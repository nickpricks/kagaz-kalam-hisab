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
const getQueryString = () => {
  // With HashRouter, query params live inside the hash fragment (e.g. /#/list?devMode=true)
  const hash = window.location.hash;
  const queryIndex = hash.indexOf('?');
  const search = queryIndex !== -1 ? hash.substring(queryIndex) : '';
  return new URLSearchParams(search);
};

