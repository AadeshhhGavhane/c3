/**
 * Capitalizes the first letter of each word in a string
 * @param str - The string to capitalize
 * @returns The string with first letter of each word capitalized
 */
export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

