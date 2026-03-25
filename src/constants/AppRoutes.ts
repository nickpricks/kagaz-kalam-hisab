/**
 * @file AppRoutes.ts
 * @description Defines the navigation routes for the application.
 */

/**
 * Navigation routes for the application.
 */
export const AppRoutes = {
  ADD: '/add',
  LIST: '/list',
  IMPORT: '/import',
  ABOUT: '/about',
} as const;

/**
 * Type for application route paths.
 */
export type AppRoute = typeof AppRoutes[keyof typeof AppRoutes];
