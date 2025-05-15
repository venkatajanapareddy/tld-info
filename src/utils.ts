import { tldInfoList, tldInfoMap } from './tldData';
import type { ISO3166A2Code, TLDInfoData, TLDString, TLDType } from './types';

/**
 * Normalizes a TLD string by ensuring it starts with a dot ('.') and converting it to lowercase.
 * @param input The TLD string to normalize.
 * @returns The normalized TLD string (e.g., '.com'). Returns input as is if it's empty or just a dot.
 */
export function normalizeTLD(input: string): TLDString {
  if (!input || input.trim() === '' || input.trim() === '.') {
    // Return as TLDString, but it might be invalid for lookups
    return input as TLDString;
  }
  const trimmed = input.trim().toLowerCase();
  return (trimmed.startsWith('.') ? trimmed : `.${trimmed}`) as TLDString;
}

/**
 * Retrieves the TLD information for a given TLD string.
 * @param tldInput The TLD string (case-insensitive, with or without leading dot).
 * @returns The TLDInfoData object or undefined if not found.
 */
export function getTLDInfo(tldInput: string): TLDInfoData | undefined {
  if (!tldInput || tldInput.trim() === '') return undefined;
  const normalized = normalizeTLD(tldInput);
  return tldInfoMap[normalized];
}

/**
 * Checks if a TLD string is valid and exists in the dataset.
 * @param tldInput The TLD string (case-insensitive, with or without leading dot).
 * @returns True if the TLD is valid, false otherwise.
 */
export function isValidTLD(tldInput: string): boolean {
  if (!tldInput || tldInput.trim() === '') return false;
  const normalized = normalizeTLD(tldInput);
  return !!tldInfoMap[normalized];
}

/**
 * Retrieves TLDs of a specific type.
 * @param type The TLD type (case-insensitive).
 * @returns An array of TLDInfoData objects matching the type.
 */
export function getTLDsByType(type: TLDType | string): TLDInfoData[] {
  if (!type || type.trim() === '') return [];
  const lowerType = type.toLowerCase();
  return tldInfoList.filter((tld) => tld.type?.toLowerCase() === lowerType);
}

/**
 * Retrieves ccTLDs for a specific country code.
 * @param countryCode The ISO 3166-1 alpha-2 country code (case-insensitive).
 * @returns An array of TLDInfoData objects for that country.
 */
export function getCountryTLDs(
  countryCode: ISO3166A2Code | string
): TLDInfoData[] {
  if (!countryCode || countryCode.trim() === '') return [];
  const upperCountryCode = countryCode.toUpperCase();
  return tldInfoList.filter(
    (tld) => tld.type === 'ccTLD' && tld.countryCode === upperCountryCode
  );
}

/**
 * Generates an emoji flag for a given ISO 3166-1 alpha-2 country code.
 * This is a simplified version. A more robust solution might use a library or a more comprehensive map.
 * @param countryCode The ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB').
 * @returns The emoji flag string or undefined if the country code is invalid or has no standard flag.
 */
function countryCodeToEmojiFlag(
  countryCode: ISO3166A2Code
): string | undefined {
  if (!countryCode || countryCode.length !== 2) return undefined;
  const code = countryCode.toUpperCase();
  // Offset between uppercase ASCII letters and regional indicator symbols.
  const OFFSET = 127397;
  const firstChar = code.charCodeAt(0);
  const secondChar = code.charCodeAt(1);

  if (
    firstChar >= 65 &&
    firstChar <= 90 &&
    secondChar >= 65 &&
    secondChar <= 90
  ) {
    return (
      String.fromCodePoint(firstChar + OFFSET) +
      String.fromCodePoint(secondChar + OFFSET)
    );
  }
  return undefined;
}

/**
 * Gets the emoji flag for a given ccTLD string.
 * @param tldInput The ccTLD string (case-insensitive, with or without leading dot).
 * @returns The emoji flag string or undefined if not a ccTLD with a flag or not found.
 */
export function getEmojiForTLD(tldInput: string): string | undefined {
  const info = getTLDInfo(tldInput);
  if (info && info.type === 'ccTLD' && info.countryCode && info.hasEmojiFlag) {
    return countryCodeToEmojiFlag(info.countryCode);
  }
  return undefined;
}

/**
 * Performs a search on TLD strings, registry names, or country codes.
 * This is a very basic substring match. For more advanced fuzzy search, consider a library like Fuse.js.
 * @param query The search query (case-insensitive).
 * @param options Optional parameters, e.g., { limit?: number }.
 * @returns An array of matching TLDInfoData objects.
 */
export function searchTLD(
  query: string,
  options?: { limit?: number }
): TLDInfoData[] {
  if (!query || query.trim() === '') return [];
  const lowerQuery = query.toLowerCase();
  const limit = options?.limit;

  const results: TLDInfoData[] = [];
  for (const tld of tldInfoList) {
    if (tld.tld.toLowerCase().includes(lowerQuery)) {
      results.push(tld);
      if (limit && results.length >= limit) return results;
      continue;
    }
    if (tld.registry?.toLowerCase().includes(lowerQuery)) {
      results.push(tld);
      if (limit && results.length >= limit) return results;
      continue;
    }
    if (tld.countryCode?.toLowerCase().includes(lowerQuery)) {
      results.push(tld);
      if (limit && results.length >= limit) return results;
      continue;
    }
  }
  return results;
}
