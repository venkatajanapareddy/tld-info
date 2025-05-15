// Core Data Exports
export { tldInfoList, tldList, tldInfoMap } from './tldData';

// Type Exports
export type {
  TLDString,
  TLDType,
  TLDStatus,
  ISO3166A2Code,
  TLDInfoData,
  TLDInfoMap,
} from './types';

// Utility Function Exports
export {
  normalizeTLD,
  getTLDInfo,
  getTLDsByType,
  getCountryTLDs,
  isValidTLD,
  getEmojiForTLD,
  searchTLD,
} from './utils';
