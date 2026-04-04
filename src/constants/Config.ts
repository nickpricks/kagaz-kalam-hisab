/**
 * @file Config.ts
 * @description Application-level configuration.
 */

export const CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'KAGAZ KALAM HISAB',
  CURRENCY_SYMBOL: '₹',
  DEFAULT_LANGUAGE: 'en',
  STORAGE_KEYS: {
    EXPENSES: 'kagaz_kalam_expenses',
    SETTINGS: 'kagaz_kalam_settings',
  },
  DEV_MODE: import.meta.env.VITE_DEV_MODE || 'devMode',
  VERSION: import.meta.env.VITE_APP_VERSION || '0.0.2',
};
