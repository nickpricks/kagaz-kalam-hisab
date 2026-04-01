
/**
 * @file strings.ts
 * @description Helper functions for string manipulation.
 */

/**
 * Capitalizes the first letter of a string.
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
export const capFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
