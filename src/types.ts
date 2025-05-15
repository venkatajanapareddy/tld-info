export type TLDString = string; // e.g., '.com', '.ai' (normalized: starts with '.', lowercase)
export type TLDType =
  | 'gTLD'
  | 'ccTLD'
  | 'sTLD'
  | 'infrastructure'
  | 'test'
  | string; // Add other common types
export type TLDStatus =
  | 'active'
  | 'not assigned'
  | 'reserved'
  | 'inactive'
  | string; // Add other common statuses
export type ISO3166A2Code = string; // e.g., 'US', 'DE'

export interface TLDInfoData {
  tld: TLDString;
  type: TLDType;
  registry: string | null;
  countryCode: ISO3166A2Code | null; // For ccTLDs
  status: TLDStatus | null;
  createdDate: string | null; // YYYY-MM-DD or YYYY
  idnSupport: boolean | null;
  hasEmojiFlag: boolean; // True if a flag emoji can be derived (for ccTLDs)
}

export type TLDInfoMap = Record<TLDString, TLDInfoData>;
