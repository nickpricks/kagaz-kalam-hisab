/**
 * @file categories.ts
 * @description Category tree definition and helper functions.
 */

import type { CategoryDefinition } from './types';

/**
 * The primary category tree for the application.
 * Each key is a Category ID, and the value contains the label and sub-categories.
 */
export const CATEGORIES: Record<string, CategoryDefinition> = {
  food: {
    id: 'food',
    label: 'Food',
    subCategories: ['Milk', 'Snacks', 'Groceries', 'Healthy', 'Orders'],
  },
  shopping: {
    id: 'shopping',
    label: 'Shopping',
    subCategories: ['Veggies', 'Fruits', 'Fashion', 'Ration', 'Electronics'],
  },
  travel: {
    id: 'travel',
    label: 'Travel',
    subCategories: ['Air', 'Train', 'Bus', 'Road Toll'],
  },
  vehicle: {
    id: 'vehicle',
    label: 'Vehicle',
    subCategories: ['Fuel', 'Maintenance', 'Washing'],
  },
  bills: {
    id: 'bills',
    label: 'Bills',
    subCategories: [
      'Phone',
      'Internet',
      'Subscriptions',
      'Entertainment',
      'Rent',
      'Electricity',
      'Society',
      'Insurance',
    ],
  },
  medical: {
    id: 'medical',
    label: 'Medical',
    subCategories: ['Doctor/Consultation', 'Medicines', 'Tests'],
  },
  care: {
    id: 'care',
    label: 'Care',
    subCategories: ['Personal', 'Grooming', 'Massage'],
  },
  gifts: {
    id: 'gifts',
    label: 'Gifts',
    subCategories: ['Ceremonies', 'Charity', 'Donations'],
  },
  education: {
    id: 'education',
    label: 'Education',
    subCategories: ['Courses', 'Books'],
  },
  misc: {
    id: 'misc',
    label: 'Misc',
    subCategories: [],
  },
};

/**
 * Returns a category definition by its ID.
 * @param id - The category ID.
 */
export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES[id];
}

/**
 * Returns a list of all category IDs.
 */
export function getAllCategoryIds(): string[] {
  return Object.keys(CATEGORIES);
}

/**
 * Returns sub-categories for a given category ID.
 * @param categoryId - The ID of the parent category.
 */
export function getSubCategories(categoryId: string): string[] {
  const category = getCategoryById(categoryId);
  return category ? category.subCategories : [];
}
