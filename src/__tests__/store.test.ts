import { beforeEach, describe, expect, it } from 'vitest';
import { addExpense, deleteExpense, getExpenses, importExpensesFromJSON } from "../data/store";


describe("Store Logic", () => {
  beforeEach(() => {
    // Mock localStorage
    const storage: Record<string, string> = {};
    global.window = {
      localStorage: {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => { storage[key] = value; },
        removeItem: (key: string) => { delete storage[key]; },
        clear: () => { for (const key in storage) delete storage[key]; },
      }
    } as any;
    // Mock crypto for UUID
    global.crypto = { randomUUID: () => "test-uuid" } as any;
  });

  it("should add an expense", () => {
    const exp = addExpense({
      date: "2024-03-16",
      category: "food",
      amount: 100,
      note: "test",
      subCat: "milk"
    });
    expect(exp.id).toBe("test-uuid");
    expect(getExpenses().length).toBe(1);
  });

  it("should delete (soft-delete) an expense", () => {
    addExpense({ date: "2024-03-16", category: "food", amount: 100, note: "test", subCat: "" });
    deleteExpense("test-uuid");
    expect(getExpenses().length).toBe(0);
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
});
