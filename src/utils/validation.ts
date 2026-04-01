/**
 * @file validation.ts
 * @description Helpers for data validation.
 */

import { CATEGORIES } from '../data/categories';

/**
 * Validates an array of expense objects for import.
 * @param data - The data to validate.
 * @returns An object with valid status and error message if any.
 */
export function validateImportData(data: unknown): { isValid: boolean; error?: string } {
  if (!Array.isArray(data)) {
    return { isValid: false, error: 'Data must be an array of objects.' };
  }

  for (let i = 0; i < data.length; i++) {
    const item = data[i] as Record<string, unknown>;
    
    // Check mandatory fields
    if (!item.date || !item.category || item.amount === undefined) {
      return {
        isValid: false,
        error: `Item at index ${i} is missing mandatory fields (date, category, or amount).`
      };
    }

    const date = item.date as string;
    const category = item.category as string;
    const amount = item.amount;

    // Validate date format (YYYY-MM-DD) and semantic validity
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return {
        isValid: false,
        error: `Item at index ${i} has an invalid date format (expected YYYY-MM-DD).`
      };
    }
    const [y, m, d] = date.split('-').map(Number);
    const parsed = new Date(y, m - 1, d);
    if (parsed.getFullYear() !== y || parsed.getMonth() !== m - 1 || parsed.getDate() !== d) {
      return {
        isValid: false,
        error: `Item at index ${i} has an invalid date: "${date}".`
      };
    }

    // Validate category
    if (!CATEGORIES[category]) {
      return {
        isValid: false,
        error: `Item at index ${i} has an unknown category: "${category}".`
      };
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return {
        isValid: false,
        error: `Item at index ${i} has an invalid amount (must be a positive number).`
      };
    }
  }

  return { isValid: true };
}
