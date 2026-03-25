/**
 * @file store.ts
 * @description Application-specific data store for expenses using localStorage.
 */

import type { Expense } from './types';
import { getFromStorage, saveToStorage } from '../utils/localStorage';

const STORAGE_KEY = 'kagaz_kalam_expenses';

/**
 * Retrieves all expenses from storage, excluding soft-deleted ones.
 * @returns An array of active expenses.
 */
export function getExpenses(): Expense[] {
  const allExpenses = getFromStorage<Expense[]>(STORAGE_KEY, []);
  return allExpenses.filter((e) => !e.isDeleted);
}

/**
 * Retrieves all expenses including deleted ones (useful for devMode or restoration).
 */
export function getAllExpensesRaw(): Expense[] {
  return getFromStorage<Expense[]>(STORAGE_KEY, []);
}

/**
 * Adds a new expense to the store.
 * @param expense - Partial expense data (amount, category, etc.).
 * @returns The newly created expense object.
 */
export function addExpense(expenseData: Omit<Expense, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt'>): Expense {
  const allExpenses = getAllExpensesRaw();
  const now = new Date().toISOString();
  
  const newExpense: Expense = {
    ...expenseData,
    id: crypto.randomUUID(),
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  allExpenses.push(newExpense);
  saveToStorage(STORAGE_KEY, allExpenses);
  return newExpense;
}

/**
 * Updates an existing expense.
 * @param id - The ID of the expense to update.
 * @param updates - The fields to update.
 */
export function updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): void {
  const allExpenses = getAllExpensesRaw();
  const index = allExpenses.findIndex((e) => e.id === id);

  if (index !== -1) {
    allExpenses[index] = {
      ...allExpenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEY, allExpenses);
  }
}

/**
 * Performs a soft delete on an expense.
 * @param id - The ID of the expense to delete.
 */
export function deleteExpense(id: string): void {
  updateExpense(id, { isDeleted: true } as any);
}

/**
 * Bulk imports expenses from a JSON array.
 * Validates basic structure before saving.
 * @param jsonString - The JSON string representing an array of expenses.
 */
export function importExpensesFromJSON(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      return { success: false, count: 0, error: 'Data must be an array' };
    }

    const now = new Date().toISOString();
    const validatedData: Expense[] = data.map((item: any) => ({
      id: item.id || crypto.randomUUID(),
      date: item.date || now.split('T')[0],
      category: item.category || 'misc',
      subCat: item.subCat || '',
      amount: Number(item.amount) || 0,
      note: item.note || '',
      isDeleted: item.isDeleted || false,
      createdAt: item.createdAt || now,
      updatedAt: item.updatedAt || now,
    }));

    const existingData = getAllExpensesRaw();
    const combinedData = [...existingData, ...validatedData];
    saveToStorage(STORAGE_KEY, combinedData);

    return { success: true, count: validatedData.length };
  } catch (error) {
    return { success: false, count: 0, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
