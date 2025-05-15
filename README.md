# tld-info

A complete, typed dataset of all valid top-level domains (TLDs) with metadata, utilities, and CLI. This modern TypeScript library provides an enriched and developer-friendly TLD dataset, designed as an upgrade over existing packages like `tlds`.

[![CI](https://github.com/venkatajanapareddy/tld-info/actions/workflows/main.yml/badge.svg)](https://github.com/venkatajanapareddy/tld-info/actions/workflows/main.yml)
[![npm version](https://img.shields.io/npm/v/tld-info.svg)](https://www.npmjs.com/package/tld-info)
[![License](https://img.shields.io/github/license/venkatajanapareddy/tld-info)](https://github.com/venkatajanapareddy/tld-info/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/tld-info)](https://bundlephobia.com/package/tld-info)

**Features:**

- **Accurate & Essential Metadata:** Based on the official IANA list, enriched with essential metadata like TLD type, registry organization, country code (for ccTLDs), and emoji flags.
- **TypeScript First:** Fully implemented in TypeScript with strict typings for all data and functions.
- **Zero Runtime Dependencies:** The core dataset and utility functions have no external runtime dependencies.
- **Comprehensive Utilities:** Functions to normalize, validate, lookup, filter, and search TLDs.
- **Dual Module Support:** ESM and CJS compatible.
- **JSON Data Export:** Includes a `dist/tld-info-data.json` for easy consumption in other environments.
- **CLI Access (Basic):** Provides basic command-line interface for quick lookups and validation.

## About the TLD Metadata

This library takes a pragmatic approach to TLD metadata:

1. **Essential Metadata Focus:** We provide the most reliable and useful metadata that can be determined with high confidence:

   - TLD type (ccTLD, gTLD, sTLD, etc.)
   - Country codes for ccTLDs
   - Basic registry information
   - Emoji flag capability

2. **Reliability Over Completeness:** Rather than attempting to scrape and maintain complex metadata that's prone to errors or becoming outdated, we focus on providing accurate core information.

3. **Automatic Updates:** The TLD list is fetched directly from IANA's authoritative source, ensuring the list itself is always current.

This approach allows us to maintain a lightweight, accurate, and useful dataset without the complexity and potential errors of web scraping or manual data maintenance.

## Installation

```bash
npm install tld-info
# or
yarn add tld-info
# or
pnpm add tld-info
```

## Usage

### Data Exports

```typescript
import {
  tldInfoList, // Readonly<TLDInfoData[]>
  tldList, // Readonly<TLDString[]>
  tldInfoMap, // Readonly<Record<TLDString, TLDInfoData>>
} from 'tld-info';

console.log(`There are ${tldList.length} TLDs.`);
console.log('Info for .com:', tldInfoMap['.com']);
console.log('First TLD in the list:', tldInfoList[0]);
```

### Utility Functions

```typescript
import {
  normalizeTLD,
  getTLDInfo,
  isValidTLD,
  getTLDsByType,
  getCountryTLDs,
  getEmojiForTLD,
  searchTLD,
} from 'tld-info';

// Normalize TLD
console.log(normalizeTLD('COM')); // Output: .com
console.log(normalizeTLD('  .net  ')); // Output: .net

// Get TLD Info
const comInfo = getTLDInfo('com');
if (comInfo) {
  console.log('.com registry:', comInfo.registry); // VeriSign Global Registry Services
  console.log('.com created:', comInfo.createdDate); // 1985-01-01 (example data)
}

// Validate TLD
console.log(isValidTLD('org')); // true
console.log(isValidTLD('.nonexistent')); // false

// Get TLDs by Type
const ccTLDs = getTLDsByType('ccTLD');
console.log(`Found ${ccTLDs.length} ccTLDs. Example: ${ccTLDs[0]?.tld}`);

// Get TLDs by Country Code
const germanTLDs = getCountryTLDs('DE'); // e.g., .de
germanTLDs.forEach((tld) =>
  console.log(`German TLD: ${tld.tld}, Emoji: ${getEmojiForTLD(tld.tld)}`)
);

// Get Emoji for TLD
console.log('Emoji for .ai:', getEmojiForTLD('ai')); // 🇦🇮 (example data)
console.log('Emoji for .com:', getEmojiForTLD('com')); // undefined

// Search TLDs
const searchResults = searchTLD('Anguilla', { limit: 5 });
console.log(
  "Search results for 'Anguilla':",
  searchResults.map((t) => t.tld)
);
```

### JSON Data

A `tld-info-data.json` file is included in the `dist` directory of the published package. You can import or require it directly if needed:

```javascript
// Example for Node.js CJS environment
// const tldData = require('tld-info/dist/tld-info-data.json');

// For ESM, you might need an import assertion or fs.readFile
// import tldData from 'tld-info/dist/tld-info-data.json' assert { type: 'json' };
// console.log(tldData[0].tld);
```

## API Reference

### Types

- `TLDString`: e.g., `.com`, `.ai` (normalized: starts with `.`, lowercase)
- `TLDType`: `'gTLD' | 'ccTLD' | 'sTLD' | 'infrastructure' | 'test' | string`
- `TLDStatus`: `'active' | 'not assigned' | 'reserved' | 'inactive' | string`
- `ISO3166A2Code`: e.g., `'US'`, `'DE'`
- `TLDInfoData`: Interface for TLD metadata:
  - `tld: TLDString`
  - `type: TLDType`
  - `registry: string | null`
  - `countryCode: ISO3166A2Code | null`
  - `status: TLDStatus | null`
  - `createdDate: string | null` (YYYY-MM-DD or YYYY)
  - `idnSupport: boolean | null`
  - `hasEmojiFlag: boolean`
- `TLDInfoMap`: `Record<TLDString, TLDInfoData>`

### Data Exports

- `tldInfoList: Readonly<TLDInfoData[]>`: Immutable array of all `TLDInfoData` objects.
- `tldList: Readonly<TLDString[]>`: Immutable array of all normalized TLD strings.
- `tldInfoMap: Readonly<TLDInfoMap>`: Immutable map of TLD strings to `TLDInfoData` objects.

### Utility Functions

- `normalizeTLD(input: string): TLDString`
- `getTLDInfo(tldInput: string): TLDInfoData | undefined`
- `getTLDsByType(type: TLDType | string): TLDInfoData[]`
- `getCountryTLDs(countryCode: ISO3166A2Code | string): TLDInfoData[]`
- `isValidTLD(tldInput: string): boolean`
- `getEmojiForTLD(tldInput: string): string | undefined`
- `searchTLD(query: string, options?: { limit?: number }): TLDInfoData[]`

## Data Sources and Update Process

- **Primary Source:** The list of TLDs is fetched from the official IANA list: `https://data.iana.org/TLD/tlds-alpha-by-domain.txt`.
- **Enrichment:** Metadata for each TLD is compiled from various reliable public sources (e.g., Wikipedia, ICANN, IANA's detailed registry information, specific TLD registry websites).
- **Update Frequency:** The dataset is intended to be updated periodically. Maintainers can run `npm run update-data` to attempt to refresh the dataset from IANA and re-compile it. Due to the manual nature of some enrichment data, updates might not be fully automatic and may require review.

## CLI (Command Line Interface)

Basic CLI for quick lookups (more features planned):

```bash
# Get info for a specific TLD
npx tld-info .ai
# > .ai: ccTLD, Government of Anguilla, active, Emoji: 🇦🇮 (Example output)

# List TLDs by type (example with mock data)
npx tld-info --type ccTLD
# > .ai
# > .de

# List TLDs by country (example with mock data)
npx tld-info --country DE
# > .de

# Validate a TLD
npx tld-info validate .com
# > true
npx tld-info validate .nonexistenttld
# > false

# Search TLDs (example with mock data)
npx tld-info search Anguilla
# > .ai (TLDInfoData...)
```

- Run `npx tld-info --help` for more options (once implemented).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

Ensure tests pass (`npm test`) and code is formatted (`npm run format`) before submitting a PR.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
