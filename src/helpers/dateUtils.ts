/**
 * @file dateUtils.ts
 * @description Date utility functions for local-time formatting and comparison.
 */

/**
 * Formats a Date object as a YYYY-MM-DD string using local time.
 * Avoids the UTC pitfall of toISOString().split('T')[0] which returns
 * the wrong date for IST users after ~6:30 PM.
 * @param date - The date to format.
 * @returns A YYYY-MM-DD string in local time.
 */
export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
