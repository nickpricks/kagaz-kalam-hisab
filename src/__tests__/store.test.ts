import { beforeEach, describe, expect, it } from 'vitest';
import { addExpense, deleteExpense, getExpenses, getAllExpensesRaw, updateExpense, importExpensesFromJSON } from "../data/store";


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
    const exp = addExpense({
      date: "2024-03-16",
      category: "food",
      amount: 100,
      note: "test",
      subCat: "milk"
    });
    expect(exp.id).toBe("uuid-1");
    expect(exp.isDeleted).toBe(false);
    expect(exp.createdAt).toBeDefined();
    expect(exp.updatedAt).toBeDefined();
    expect(getExpenses().length).toBe(1);
  });

  it("should add multiple expenses with unique ids", () => {
    addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "", subCat: "" });
    addExpense({ date: "2024-03-17", category: "bills", amount: 200, note: "", subCat: "" });
    const expenses = getExpenses();
    expect(expenses.length).toBe(2);
    expect(expenses[0].id).not.toBe(expenses[1].id);
  });

  it("should delete (soft-delete) an expense", () => {
    const exp = addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "test", subCat: "" });
    deleteExpense(exp.id);
    expect(getExpenses().length).toBe(0);
    // soft-deleted record still exists in raw data
    expect(getAllExpensesRaw().length).toBe(1);
    expect(getAllExpensesRaw()[0].isDeleted).toBe(true);
  });

  it("should not crash when deleting a non-existent id", () => {
    addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "", subCat: "" });
    deleteExpense("non-existent-id");
    expect(getExpenses().length).toBe(1);
  });

  it("should update an expense", () => {
    const exp = addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "old", subCat: "" });
    updateExpense(exp.id, { amount: 250, note: "updated" });
    const updated = getExpenses()[0];
    expect(updated.amount).toBe(250);
    expect(updated.note).toBe("updated");
    expect(updated.category).toBe("food"); // unchanged field preserved
  });

  it("should silently skip update for non-existent id", () => {
    addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "", subCat: "" });
    updateExpense("non-existent", { amount: 999 });
    expect(getExpenses()[0].amount).toBe(100);
  });

  it("should return all expenses including deleted via getAllExpensesRaw", () => {
    const exp = addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "", subCat: "" });
    addExpense({ date: "2024-03-17", category: "bills", amount: 200, note: "", subCat: "" });
    deleteExpense(exp.id);
    expect(getExpenses().length).toBe(1);
    expect(getAllExpensesRaw().length).toBe(2);
  });

  it("should import expenses from JSON", () => {
    const json = JSON.stringify([
      { date: "2024-03-16", category: "food", amount: 100, note: "test", subCat: "" },
      { date: "2024-03-17", category: "bills", amount: 500, note: "rent", subCat: "" }
    ]);
    const result = importExpensesFromJSON(json);
    expect(result.success).toBe(true);
    expect(result.count).toBe(2);
    expect(getExpenses().length).toBe(2);
  });

  it("should fail import on invalid JSON string", () => {
    const result = importExpensesFromJSON("not valid json");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should fail import when data is not an array", () => {
    const result = importExpensesFromJSON(JSON.stringify({ date: "2024-03-16" }));
    expect(result.success).toBe(false);
    expect(result.error).toBe("Data must be an array");
  });

  it("should append imported expenses to existing data", () => {
    addExpense({ date: "2024-03-16", category: "food", amount: 50, note: "", subCat: "" });
    const json = JSON.stringify([{ date: "2024-03-17", category: "bills", amount: 200, note: "", subCat: "" }]);
    importExpensesFromJSON(json);
    expect(getExpenses().length).toBe(2);
  });
});
