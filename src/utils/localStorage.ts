/**
 * @file localStorage.ts
 * @description Generic utilities for interacting with window.localStorage.
 */

/**
 * Saves a value to localStorage.
 * @param key - The key to store the value under.
 * @param value - The value to store (will be JSON stringified).
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage [${key}]:`, error);
  }
}

/**
 * Retrieves a value from localStorage.
 * @param key - The key to retrieve.
 * @param defaultValue - The value to return if the key doesn't exist.
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage [${key}]:`, error);
    return defaultValue;
  }
}
