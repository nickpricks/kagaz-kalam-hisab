/**
 * @file navigation.ts
 * @description Helper functions for URL parameters.
 */

import { CONFIG } from "../constants/Config";

/**
 * Checks if the CONFIG.DEV_MODE query parameter is active.
 * @returns True if [CONFIG.DEV_MODE]=true in URL.
 */
export function isDevMode(): boolean {
  const params = getQueryString();
  return params.get(CONFIG.DEV_MODE) === 'true';
};


/**
 * Gets the query string from the URL.
 * @returns URLSearchParams object.
 */
const getQueryString = (urlWithQS: string = window.location.search) => {
  return new URLSearchParams(urlWithQS);
};

