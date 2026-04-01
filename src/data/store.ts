/**
 * @file store.ts
 * @description Application-specific data store for expenses using localStorage.
 */

import type { Expense } from './types';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import { CONFIG } from '../constants/Config';

const STORAGE_KEY = CONFIG.STORAGE_KEYS.EXPENSES;
const SCHEMA_VERSION = 1;

/**
 * Initializes schema version in localStorage if not already set.
 * Called once on app load.
 */
export function initSchemaVersion(): void {
  const key = CONFIG.STORAGE_KEYS.SETTINGS + '_schema';
  const current = getFromStorage<number | null>(key, null);
  if (current === null) {
    saveToStorage(key, SCHEMA_VERSION);
  }
}

/**
 * Retrieves all expenses from storage, excluding soft-deleted ones.
 * @returns An array of active expenses.
 */
export function getExpenses(): Expense[] {
  const allExpenses = getFromStorage<Expense[]>(STORAGE_KEY, []);
  if (!Array.isArray(allExpenses)) return [];
  return allExpenses.filter((e) => !e.isDeleted);
}

/**
 * Retrieves all expenses including deleted ones (useful for devMode or restoration).
 */
export function getAllExpensesRaw(): Expense[] {
  const result = getFromStorage<Expense[]>(STORAGE_KEY, []);
  return Array.isArray(result) ? result : [];
}

/**
 * Adds a new expense to the store.
 * @param expenseData - Required expense fields (date, category, subCat, amount, note). ID and timestamps are auto-generated.
 * @returns Object with the new expense and whether it was persisted.
 */
export function addExpense(expenseData: Omit<Expense, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt'>): { expense: Expense; saved: boolean } {
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
  const saved = saveToStorage(STORAGE_KEY, allExpenses);
  return { expense: newExpense, saved };
}

/**
 * Updates an existing expense.
 * @param id - The ID of the expense to update.
 * @param updates - The fields to update.
 * @returns true if the expense was found and updated, false if ID not found.
 */
export function updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): boolean {
  const allExpenses = getAllExpensesRaw();
  const index = allExpenses.findIndex((e) => e.id === id);

  if (index === -1) return false;

  allExpenses[index] = {
    ...allExpenses[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEY, allExpenses);
  return true;
}

/**
 * Permanently removes an expense from storage.
 * @param id - The ID of the expense to delete.
 * @returns The removed expense (for undo), or null if not found.
 */
export function deleteExpense(id: string): Expense | null {
  const allExpenses = getAllExpensesRaw();
  const index = allExpenses.findIndex((e) => e.id === id);
  if (index === -1) return null;
  const [removed] = allExpenses.splice(index, 1);
  saveToStorage(STORAGE_KEY, allExpenses);
  return removed;
}

/**
 * Inserts an expense back into storage (used for undo).
 * Coerces missing/invalid fields to defaults rather than rejecting them.
 * @param expense - The full expense object to restore.
 * Callers should use validateImportData() first if strict validation is needed.
 */
export function insertExpense(expense: Expense): void {
  const allExpenses = getAllExpensesRaw();
  allExpenses.push(expense);
  saveToStorage(STORAGE_KEY, allExpenses);
}

/**
 * Imports pre-validated expenses into storage with deduplication.
 * @param entries - Array of validated Expense objects.
 * @returns Result with count of imported and skipped entries.
 */
export function importExpenses(entries: Expense[]): { success: boolean; count: number; skipped: number } {
  const existingData = getAllExpensesRaw();
  const existingIds = new Set(existingData.map((e) => e.id));

  const toAdd: Expense[] = [];
  let skipped = 0;

  for (const entry of entries) {
    if (existingIds.has(entry.id)) {
      skipped++;
    } else {
      toAdd.push(entry);
      existingIds.add(entry.id);
    }
  }

  const combinedData = [...existingData, ...toAdd];
  const saved = saveToStorage(STORAGE_KEY, combinedData);

  if (!saved) {
    return { success: false, count: 0, skipped: 0 };
  }

  return { success: true, count: toAdd.length, skipped };
}
