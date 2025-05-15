import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { TLDInfoData, TLDString } from '../src/types';

// Mock the tldData module before tests run
vi.mock('../src/tldData', () => {
  // Define mock data inline within the factory function
  const mockTldCom: TLDInfoData = {
    tld: '.com' as TLDString,
    type: 'gTLD',
    registry: 'VeriSign Global Registry Services',
    countryCode: null,
    status: 'active',
    createdDate: '1985-01-01',
    idnSupport: true,
    hasEmojiFlag: false,
  };

  const mockTldAi: TLDInfoData = {
    tld: '.ai' as TLDString,
    type: 'ccTLD',
    registry: 'Government of Anguilla',
    countryCode: 'AI',
    status: 'active',
    createdDate: '1995-02-16',
    idnSupport: false,
    hasEmojiFlag: true,
  };

  const mockTldDe: TLDInfoData = {
    tld: '.de' as TLDString,
    type: 'ccTLD',
    registry: 'DENIC eG',
    countryCode: 'DE',
    status: 'active',
    createdDate: '1986-11-05',
    idnSupport: true,
    hasEmojiFlag: true,
  };

  const mockTldTest: TLDInfoData = {
    tld: '.test' as TLDString,
    type: 'test',
    registry: 'Internet Assigned Numbers Authority',
    countryCode: null,
    status: 'reserved',
    createdDate: '1999-06-11',
    idnSupport: null,
    hasEmojiFlag: false,
  };

  const mockTldInfoList = [mockTldCom, mockTldAi, mockTldDe, mockTldTest];
  const mockTldList = mockTldInfoList.map((tld) => tld.tld);
  const mockTldInfoMap = mockTldInfoList.reduce(
    (acc, tld) => {
      acc[tld.tld] = tld;
      return acc;
    },
    {} as Record<TLDString, TLDInfoData>
  );

  return {
    tldInfoList: mockTldInfoList,
    tldList: mockTldList,
    tldInfoMap: mockTldInfoMap,
  };
});

// Import after mock is set up
import {
  normalizeTLD,
  getTLDInfo,
  isValidTLD,
  getTLDsByType,
  getCountryTLDs,
  getEmojiForTLD,
  searchTLD,
} from '../src/utils';
import * as tldDataModule from '../src/tldData';

// For test reference - expose the mock data
const mockTldInfoMap = tldDataModule.tldInfoMap;
const mockTldCom = mockTldInfoMap['.com'];
const mockTldAi = mockTldInfoMap['.ai'];
const mockTldDe = mockTldInfoMap['.de'];
const mockTldTest = mockTldInfoMap['.test'];

describe('TLD Utility Functions', () => {
  beforeEach(() => {
    // Reset mocks if necessary, though vi.mock should handle this for module-level mocks
    // vi.resetAllMocks(); // Could be used if more complex stateful mocks are involved
  });

  describe('normalizeTLD', () => {
    it('should lowercase and add leading dot', () => {
      expect(normalizeTLD('COM')).toBe('.com');
      expect(normalizeTLD('CoM')).toBe('.com');
    });

    it('should handle existing leading dot', () => {
      expect(normalizeTLD('.NET')).toBe('.net');
    });

    it('should handle whitespace', () => {
      expect(normalizeTLD('  org  ')).toBe('.org');
      expect(normalizeTLD('  .ORG  ')).toBe('.org');
    });

    it('should return invalid input as is', () => {
      expect(normalizeTLD('')).toBe('');
      expect(normalizeTLD('  ')).toBe('  ');
      expect(normalizeTLD('.')).toBe('.');
    });
  });

  describe('getTLDInfo', () => {
    it('should return TLD info for a valid TLD', () => {
      expect(getTLDInfo('com')).toEqual(mockTldCom);
      expect(getTLDInfo('.AI')).toEqual(mockTldAi);
    });

    it('should be case-insensitive', () => {
      expect(getTLDInfo('De')).toEqual(mockTldDe);
    });

    it('should return undefined for an invalid TLD', () => {
      expect(getTLDInfo('invalidtld')).toBeUndefined();
      expect(getTLDInfo('.nonexistent')).toBeUndefined();
    });

    it('should return undefined for empty input', () => {
      expect(getTLDInfo('')).toBeUndefined();
    });
  });

  describe('isValidTLD', () => {
    it('should return true for a valid TLD', () => {
      expect(isValidTLD('com')).toBe(true);
      expect(isValidTLD('.AI')).toBe(true);
    });

    it('should return false for an invalid TLD', () => {
      expect(isValidTLD('invalidtld')).toBe(false);
      expect(isValidTLD('.nonexistent')).toBe(false);
    });

    it('should return false for empty input', () => {
      expect(isValidTLD('')).toBe(false);
    });
  });

  describe('getTLDsByType', () => {
    it('should return TLDs of a specific type', () => {
      const ccTLDs = getTLDsByType('ccTLD');
      expect(ccTLDs).toContainEqual(mockTldAi);
      expect(ccTLDs).toContainEqual(mockTldDe);
      expect(ccTLDs.length).toBe(2);

      const gTLDs = getTLDsByType('gTLD');
      expect(gTLDs).toContainEqual(mockTldCom);
      expect(gTLDs.length).toBe(1);
    });

    it('should be case-insensitive for type', () => {
      const ccTLDs = getTLDsByType('CCTLD');
      expect(ccTLDs.length).toBe(2);
    });

    it('should return empty array for non-existent type', () => {
      expect(getTLDsByType('nonexistenttype')).toEqual([]);
    });
  });

  describe('getCountryTLDs', () => {
    it('should return TLDs for a specific country code', () => {
      const deTLDs = getCountryTLDs('DE');
      expect(deTLDs).toContainEqual(mockTldDe);
      expect(deTLDs.length).toBe(1);
    });

    it('should be case-insensitive for country code', () => {
      const aiTLDs = getCountryTLDs('ai');
      expect(aiTLDs).toContainEqual(mockTldAi);
      expect(aiTLDs.length).toBe(1);
    });

    it('should return empty array for non-existent country code or non-ccTLD countries', () => {
      expect(getCountryTLDs('XX')).toEqual([]);
      // 'COM' is gTLD, not associated with a country for this function's purpose
      expect(getCountryTLDs('US')).toEqual([]); // Assuming no US ccTLD in mock data
    });
  });

  describe('getEmojiForTLD', () => {
    it('should return emoji for a ccTLD with hasEmojiFlag true', () => {
      expect(getEmojiForTLD('ai')).toBe('🇦🇮');
      expect(getEmojiForTLD('.DE')).toBe('🇩🇪');
    });

    it('should return undefined if TLD not found', () => {
      expect(getEmojiForTLD('nonexistent')).toBeUndefined();
    });

    it('should return undefined for gTLDs', () => {
      expect(getEmojiForTLD('com')).toBeUndefined();
    });

    it('should return undefined if ccTLD has hasEmojiFlag false (if such data existed)', () => {
      const mockTldNoFlag: TLDInfoData = {
        ...mockTldAi,
        tld: '.xx' as TLDString,
        countryCode: 'XX',
        hasEmojiFlag: false, // Explicitly false
      };
      // Temporarily modify the mock for this specific test case
      const originalTldInfoMap = { ...tldDataModule.tldInfoMap }; // Shallow clone
      (tldDataModule.tldInfoMap as Record<TLDString, TLDInfoData>)['.xx'] =
        mockTldNoFlag;

      expect(getEmojiForTLD('.xx')).toBeUndefined();

      // Restore the original mock map
      Object.keys(tldDataModule.tldInfoMap).forEach((key) => {
        delete (tldDataModule.tldInfoMap as Record<TLDString, TLDInfoData>)[
          key
        ];
      });
      Object.assign(tldDataModule.tldInfoMap, originalTldInfoMap);
    });

    it('should return undefined for TLDs with null countryCode', () => {
      expect(getEmojiForTLD('test')).toBeUndefined();
    });
  });

  describe('searchTLD', () => {
    it('should find TLDs by direct TLD string match', () => {
      const results = searchTLD('.com');
      expect(results).toContainEqual(mockTldCom);
      expect(results.length).toBe(1);
    });

    it('should find TLDs by partial TLD string match (case-insensitive)', () => {
      const results = searchTLD('aI'); // matches .ai
      expect(results).toContainEqual(mockTldAi);
    });

    it('should find TLDs by registry name match (case-insensitive)', () => {
      const results = searchTLD('veriSign');
      expect(results).toContainEqual(mockTldCom);
    });

    it('should find TLDs by country code match (case-insensitive)', () => {
      const results = searchTLD('de'); // matches .de (countryCode DE)
      expect(results).toContainEqual(mockTldDe);
    });

    it('should return multiple results if applicable', () => {
      const results = searchTLD('i');

      // Order isn't guaranteed with simple search, just check presence
      expect(results).toContainEqual(mockTldCom); // VeriSign
      expect(results).toContainEqual(mockTldAi); // .ai, AI
      expect(results).toContainEqual(mockTldDe); // DENIC
      expect(results).toContainEqual(mockTldTest); // Internet
      expect(results.length).toBe(4); // All mock TLDs have 'i' in some field
    });

    it('should respect limit option', () => {
      const results = searchTLD('a', { limit: 1 });
      expect(results.length).toBe(1);
    });

    it('should return empty array for no matches', () => {
      expect(searchTLD('nonexistentquery')).toEqual([]);
    });

    it('should return empty array for empty query', () => {
      expect(searchTLD('')).toEqual([]);
    });
  });

  // Data Integrity Spot Checks (using the mocked data)
  describe('Data Integrity (Spot Check with Mock Data)', () => {
    it('.com should have correct basic info', () => {
      const comInfo = getTLDInfo('.com');
      expect(comInfo).toBeDefined();
      expect(comInfo?.type).toBe('gTLD');
      expect(comInfo?.registry).toBe('VeriSign Global Registry Services');
      expect(comInfo?.countryCode).toBeNull();
    });

    it('.ai should be a ccTLD with country code AI and emoji flag', () => {
      const aiInfo = getTLDInfo('.ai');
      expect(aiInfo).toBeDefined();
      expect(aiInfo?.type).toBe('ccTLD');
      expect(aiInfo?.countryCode).toBe('AI');
      expect(aiInfo?.hasEmojiFlag).toBe(true);
      expect(getEmojiForTLD('.ai')).toBe('🇦🇮');
    });

    it('.test should be a test TLD', () => {
      const testInfo = getTLDInfo('.test');
      expect(testInfo).toBeDefined();
      expect(testInfo?.type).toBe('test');
      expect(testInfo?.status).toBe('reserved');
    });
  });
});
