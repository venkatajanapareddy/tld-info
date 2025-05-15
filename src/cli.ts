import {
  getCountryTLDs,
  getEmojiForTLD,
  getTLDInfo,
  getTLDsByType,
  isValidTLD,
  normalizeTLD,
  searchTLD,
  tldInfoList,
} from './index'; // Use relative path to compiled output if running directly from src
import type { TLDInfoData } from './types';

function printTLDInfo(info: TLDInfoData) {
  const emoji =
    info.hasEmojiFlag && info.countryCode ? getEmojiForTLD(info.tld) : '';
  console.log(
    `${info.tld}: ${info.type}, Registry: ${info.registry || 'N/A'}, Status: ${info.status || 'N/A'}${info.countryCode ? `, Country: ${info.countryCode}` : ''}${emoji ? `, Emoji: ${emoji}` : ''}`
  );
}

function printHelp() {
  console.log(`
Usage: tld-info <command|tld> [options]

Commands:
  <tldString>             Get info for a specific TLD (e.g., .com, ai).
  search <query>          Search TLDs by name, registry, or country code.
  validate <tldString>    Validate if a TLD is known.
  listall                 List all TLDs with basic info.

Options:
  --type <tldType>        List TLDs of a specific type (e.g., ccTLD, gTLD).
  --country <countryCode> List TLDs for a specific country code (e.g., DE, US).
  --help                  Show this help message.

Examples:
  tld-info .ai
  tld-info search Anguilla
  tld-info validate example.org
  tld-info --type gTLD
  tld-info --country JP
  `);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    printHelp();
    return;
  }

  const commandOrTld = args[0];

  if (commandOrTld === 'listall') {
    if (tldInfoList.length === 0) {
      console.log(
        'No TLD data available. Try running `npm run compile-data` first.'
      );
      return;
    }
    tldInfoList.forEach(printTLDInfo);
    return;
  }

  if (commandOrTld === 'search') {
    const query = args[1];
    if (!query) {
      console.error('Error: Search query is missing.');
      printHelp();
      return;
    }
    const results = searchTLD(query);
    if (results.length === 0) {
      console.log(`No TLDs found matching "${query}".`);
    } else {
      results.forEach(printTLDInfo);
    }
    return;
  }

  if (commandOrTld === 'validate') {
    const tldToValidate = args[1];
    if (!tldToValidate) {
      console.error('Error: TLD to validate is missing.');
      printHelp();
      return;
    }
    // Extract TLD from a potential domain
    const parts = tldToValidate.split('.');
    const potentialTld = parts.length > 1 ? `.${parts.pop()}` : tldToValidate;
    console.log(isValidTLD(potentialTld));
    return;
  }

  if (args.some((arg: string) => arg.startsWith('--'))) {
    // Option-based listing
    if (args.includes('--type')) {
      const typeIndex = args.indexOf('--type');
      const typeValue = args[typeIndex + 1];
      if (!typeValue) {
        console.error('Error: --type option requires a value.');
        printHelp();
        return;
      }
      const results = getTLDsByType(typeValue);
      if (results.length === 0) {
        console.log(`No TLDs found for type "${typeValue}".`);
      } else {
        results.forEach(printTLDInfo);
      }
      return;
    }

    if (args.includes('--country')) {
      const countryIndex = args.indexOf('--country');
      const countryValue = args[countryIndex + 1];
      if (!countryValue) {
        console.error('Error: --country option requires a value.');
        printHelp();
        return;
      }
      const results = getCountryTLDs(countryValue);
      if (results.length === 0) {
        console.log(`No TLDs found for country code "${countryValue}".`);
      } else {
        results.forEach(printTLDInfo);
      }
      return;
    }
  } else {
    // Assume it's a TLD lookup
    const info = getTLDInfo(commandOrTld);
    if (info) {
      printTLDInfo(info);
    } else {
      // Check if it might be a domain and they meant to validate the TLD part
      const parts = commandOrTld.split('.');
      if (parts.length > 1 && parts[0] !== '') {
        // e.g. example.com not .com
        const potentialTld = `.${parts.pop()}`;
        const tldInfo = getTLDInfo(potentialTld);
        if (tldInfo) {
          console.log(
            `Information for the TLD part ('${tldInfo.tld}') of '${commandOrTld}':`
          );
          printTLDInfo(tldInfo);
          return;
        }
      }
      console.log(
        `No information found for TLD: "${normalizeTLD(commandOrTld)}".`
      );
      console.log('Is it a valid TLD? ', isValidTLD(commandOrTld));
    }
    return;
  }

  printHelp(); // Default to help if command not recognized
}

main().catch((error) => {
  console.error('CLI Error:', error);
  process.exit(1);
});
