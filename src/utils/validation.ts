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
export function validateImportData(data: any): { isValid: boolean; error?: string } {
  if (!Array.isArray(data)) {
    return { isValid: false, error: 'Data must be an array of objects.' };
  }

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // Check mandatory fields
    if (!item.date || !item.category || item.amount === undefined) {
      return { 
        isValid: false, 
        error: `Item at index ${i} is missing mandatory fields (date, category, or amount).` 
      };
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
      return { 
        isValid: false, 
        error: `Item at index ${i} has an invalid date format (expected YYYY-MM-DD).` 
      };
    }

    // Validate category
    if (!CATEGORIES[item.category]) {
      return { 
        isValid: false, 
        error: `Item at index ${i} has an unknown category: "${item.category}".` 
      };
    }

    // Validate amount
    if (typeof item.amount !== 'number' || item.amount <= 0) {
      return { 
        isValid: false, 
        error: `Item at index ${i} has an invalid amount (must be a positive number).` 
      };
    }
  }

  return { isValid: true };
}
