import fs from 'fs';
import path from 'path';
import { tldInfoList } from '../src/tldData'; // Assuming tldData is generated
import type { TLDInfoData } from '../src/types';

const OUTPUT_MD_PATH = path.resolve(__dirname, '../docs/tld-table.md');

function generateMarkdownTable(data: Readonly<TLDInfoData[]>): string {
  let md = '# TLD Information Table\n\n';
  md +=
    'A comprehensive list of Top-Level Domains (TLDs) and their metadata.\n\n';
  md +=
    '| TLD | Type | Registry | Country Code | Status | Created Date | IDN Support | Emoji Flag |\n';
  md +=
    '|-----|------|----------|--------------|--------|--------------|-------------|------------|\n';

  data.forEach((tld) => {
    md += `| ${tld.tld || 'N/A'} `;
    md += `| ${tld.type || 'N/A'} `;
    md += `| ${tld.registry || 'N/A'} `;
    md += `| ${tld.countryCode || 'N/A'} `;
    md += `| ${tld.status || 'N/A'} `;
    md += `| ${tld.createdDate || 'N/A'} `;
    md += `| ${tld.idnSupport === null ? 'N/A' : tld.idnSupport} `;
    md += `| ${tld.hasEmojiFlag && tld.countryCode ? getEmoji(tld.countryCode) : 'N/A'} |\n`;
  });

  return md;
}

// Basic emoji generation, same as in utils.ts for consistency
function getEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '';
  const OFFSET = 127397;
  const firstChar = countryCode.toUpperCase().charCodeAt(0);
  const secondChar = countryCode.toUpperCase().charCodeAt(1);
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
  return '';
}

async function main() {
  console.log('Generating Markdown documentation for TLDs...');

  if (!tldInfoList || tldInfoList.length === 0) {
    console.warn(
      'tldInfoList is empty. Ensure data is compiled first (npm run compile-data). Markdown will be generated with no data.'
    );
  }

  const markdownContent = generateMarkdownTable(tldInfoList);

  const docsDir = path.dirname(OUTPUT_MD_PATH);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_MD_PATH, markdownContent, 'utf8');
  console.log(`Successfully wrote Markdown documentation to ${OUTPUT_MD_PATH}`);

  console.log('Markdown documentation generation finished.');
}

main().catch((error) => {
  console.error('Error during Markdown documentation generation:', error);
  process.exit(1);
});
