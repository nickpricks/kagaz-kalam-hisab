/**
 * @file types.ts
 * @description Core data models for the application.
 */

/**
 * Represents a single expense entry.
 */
export interface Expense {
  /** Unique identifier for the expense (crypto.randomUUID()) */
  id: string;
  /** Date of the expense in YYYY-MM-DD format */
  date: string;
  /** Primary category key */
  category: string;
  /** Sub-category key (empty string if none) */
  subCat: string;
  /** Expense amount (raw number) */
  amount: number;
  /** Optional descriptive note */
  note: string;
  /** Soft delete flag */
  isDeleted: boolean;
  /** ISO 8601 creation timestamp */
  createdAt: string;
  /** ISO 8601 last update timestamp */
  updatedAt: string;
}

/**
 * Represents a category structure with sub-categories.
 */
export interface CategoryDefinition {
  id: string;
  label: string;
  subCategories: string[];
}
