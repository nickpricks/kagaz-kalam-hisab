import { beforeEach, describe, expect, it } from 'vitest';
import { addExpense, deleteExpense, getExpenses, getAllExpensesRaw, updateExpense, importExpenses, insertExpense, initSchemaVersion } from "../data/store";
import type { Expense } from "../data/types";


let uuidCounter = 0;

describe("Store Logic", () => {
  beforeEach(() => {
    uuidCounter = 0;
    const storage: Record<string, string> = {};
    const mockWindow = {
      localStorage: {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => { storage[key] = value; },
        removeItem: (key: string) => { delete storage[key]; },
        clear: () => { for (const key in storage) delete storage[key]; },
      }
    };
    Object.defineProperty(globalThis, 'window', { value: mockWindow, writable: true, configurable: true });
    Object.defineProperty(globalThis, 'crypto', { value: { randomUUID: () => `uuid-${++uuidCounter}` }, writable: true, configurable: true });
  });

  it("should add an expense with generated id and timestamps", () => {
    const { expense, saved } = addExpense({
      date: "2024-03-16",
      category: "food",
      amount: 100,
      note: "test",
      subCat: "milk"
    });
    expect(saved).toBe(true);
    expect(expense.id).toBe("uuid-1");
    expect(expense.isDeleted).toBe(false);
    expect(expense.createdAt).toBeDefined();
    expect(expense.updatedAt).toBeDefined();
    expect(getExpenses().length).toBe(1);
  });

  it("should add multiple expenses with unique ids", () => {
    addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "", subCat: "" });
    addExpense({ date: "2024-03-17", category: "bills", amount: 200, note: "", subCat: "" });
    const expenses = getExpenses();
    expect(expenses.length).toBe(2);
    expect(expenses[0].id).not.toBe(expenses[1].id);
  });

  it("should hard-delete an expense and return it", () => {
    const { expense } = addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "test", subCat: "" });
    const removed = deleteExpense(expense.id);
    expect(removed).not.toBeNull();
    expect(removed!.id).toBe(expense.id);
    expect(getExpenses().length).toBe(0);
    // Hard delete: record is physically gone from raw data
    expect(getAllExpensesRaw().length).toBe(0);
  });

  it("should return null when deleting a non-existent id", () => {
    addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "", subCat: "" });
    const result = deleteExpense("non-existent-id");
    expect(result).toBeNull();
    expect(getExpenses().length).toBe(1);
  });

  it("should restore a deleted expense via insertExpense (undo)", () => {
    const { expense } = addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "undo test", subCat: "" });
    const removed = deleteExpense(expense.id);
    expect(getExpenses().length).toBe(0);

    insertExpense(removed!);
    expect(getExpenses().length).toBe(1);
    expect(getExpenses()[0].id).toBe(expense.id);
  });

  it("should update an expense and return true", () => {
    const { expense } = addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "old", subCat: "" });
    const updated = updateExpense(expense.id, { amount: 250, note: "updated" });
    expect(updated).toBe(true);
    const result = getExpenses()[0];
    expect(result.amount).toBe(250);
    expect(result.note).toBe("updated");
    expect(result.category).toBe("food"); // unchanged field preserved
  });

  it("should return false when updating a non-existent id", () => {
    addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "", subCat: "" });
    const result = updateExpense("non-existent", { amount: 999 });
    expect(result).toBe(false);
    expect(getExpenses()[0].amount).toBe(100);
  });

  it("should return all expenses including legacy soft-deleted via getAllExpensesRaw", () => {
    const { expense: exp1 } = addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "", subCat: "" });
    addExpense({ date: "2024-03-17", category: "bills", amount: 200, note: "", subCat: "" });
    deleteExpense(exp1.id);
    expect(getExpenses().length).toBe(1);
    expect(getAllExpensesRaw().length).toBe(1); // hard delete removes physically
  });

  it("should import validated expenses", () => {
    const now = new Date().toISOString();
    const entries: Expense[] = [
      { id: "imp-1", date: "2024-03-16", category: "food", amount: 100, note: "test", subCat: "", isDeleted: false, createdAt: now, updatedAt: now },
      { id: "imp-2", date: "2024-03-17", category: "bills", amount: 500, note: "rent", subCat: "", isDeleted: false, createdAt: now, updatedAt: now },
    ];
    const result = importExpenses(entries);
    expect(result.success).toBe(true);
    expect(result.count).toBe(2);
    expect(result.skipped).toBe(0);
    expect(getExpenses().length).toBe(2);
  });

  it("should skip duplicate IDs on import", () => {
    const now = new Date().toISOString();
    const entries: Expense[] = [
      { id: "dup-1", date: "2024-03-16", category: "food", amount: 100, note: "", subCat: "", isDeleted: false, createdAt: now, updatedAt: now },
    ];
    importExpenses(entries);
    const result = importExpenses(entries); // re-import same data
    expect(result.success).toBe(true);
    expect(result.count).toBe(0);
    expect(result.skipped).toBe(1);
    expect(getExpenses().length).toBe(1); // no duplicate
  });

  it("should append imported expenses to existing data", () => {
    addExpense({ date: "2024-03-16", category: "food", amount: 50, note: "", subCat: "" });
    const now = new Date().toISOString();
    const entries: Expense[] = [
      { id: "new-1", date: "2024-03-17", category: "bills", amount: 200, note: "", subCat: "", isDeleted: false, createdAt: now, updatedAt: now },
    ];
    importExpenses(entries);
    expect(getExpenses().length).toBe(2);
  });

  it("should initialize schema version", () => {
    initSchemaVersion();
    // Just verify it doesn't throw; the version is stored in localStorage
  });

  it("should return empty array when stored data is not an array", () => {
    // Manually store a non-array value
    window.localStorage.setItem('kagaz_kalam_expenses', JSON.stringify({ not: "an array" }));
    expect(getExpenses()).toEqual([]);
    expect(getAllExpensesRaw()).toEqual([]);
  });
});
