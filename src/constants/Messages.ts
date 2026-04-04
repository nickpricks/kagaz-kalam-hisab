/**
 * @file Messages.ts
 * @description User-facing validation and status messages.
 */

export const ValidationMsg = {
  CATEGORY_AND_AMOUNT: 'Please select a category and enter a valid amount.',
  UPDATE_NOT_FOUND: 'Could not update \u2014 expense may have been deleted.',
  UPDATE_STORAGE_FULL: 'Expense updated in memory but may not persist \u2014 storage is full.',
  ADD_STORAGE_FULL: 'Expense recorded but may not persist \u2014 storage is full.',
} as const;

export const ImportMsg = {
  INPUT_TOO_LARGE: (sizeMB: string) => `Input too large (${sizeMB}MB). Maximum is 1MB.`,
  NOT_ARRAY: 'Data must be an array of objects.',
  TOO_MANY_ENTRIES: (count: number, max: number) => `Too many entries (${count}). Maximum is ${max}.`,
  VALIDATION_FAILED: (error: string) => `Validation failed: ${error}`,
  STORAGE_FAILED: 'Import failed: could not save to storage.',
  INVALID_JSON: 'Invalid JSON format. Please check your data.',
} as const;
