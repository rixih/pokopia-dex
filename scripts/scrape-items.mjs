/**
 * Fetches the Serebii Pokémon Pokopia crafting page and builds src/data/items.json.
 *
 * Data source: https://www.serebii.net/pokemonpokopia/crafting.shtml
 *
 * Run once from the project root:
 *   node scripts/scrape-items.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'items.json');
const SEREBII_BASE = 'https://www.serebii.net/pokemonpokopia/';
const SEREBII_URL = SEREBII_BASE + 'crafting.shtml';

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------
function fetchUrl(url, redirectsLeft = 5) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).toString();
        res.resume();
        fetchUrl(next, redirectsLeft - 1).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        console.log(`  HTTP ${res.statusCode}`);
        res.resume();
        resolve(null);
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', (err) => { resolve(null); });
    req.setTimeout(30000, () => { req.destroy(); resolve(null); });
  });
}

// ---------------------------------------------------------------------------
// Decode common HTML entities
// ---------------------------------------------------------------------------
function decode(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&eacute;/g, 'é')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&#233;/g, 'é')
    .replace(/&#234;/g, 'ê')
    .replace(/&#160;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Determine category from position in HTML
// ---------------------------------------------------------------------------
function buildCategoryRanges(html) {
  const SECTIONS = ['Furniture', 'Misc.', 'Outdoor', 'Utilities', 'Buildings', 'Blocks', 'Other'];
  const ranges = [];

  for (const section of SECTIONS) {
    // h2 pattern: <h2><a name="furniture"></a>List of Furniture</h2>
    const pattern = new RegExp(`List\\s+of\\s+${section.replace('.', '\\.')}`, 'i');
    const idx = html.search(pattern);
    if (idx !== -1) {
      ranges.push({ label: section, start: idx });
    }
  }

  ranges.sort((a, b) => a.start - b.start);

  // Add end positions
  for (let i = 0; i < ranges.length; i++) {
    ranges[i].end = i + 1 < ranges.length ? ranges[i + 1].start : html.length;
  }

  return ranges;
}

// ---------------------------------------------------------------------------
// Parse requirements from the requirements <td class="fooinfo"> HTML.
// The nested table has rows like:
//   <td><a href="items/X.shtml"><img ...></td>
//   <td><a href="items/X.shtml"><u>Material Name</u></a> * N</td>
// We match the text link pattern: <u>MATERIAL</u></a> * N
// ---------------------------------------------------------------------------
function parseRequirements(reqHtml) {
  const reqs = [];
  // Serebii format: <a href="items/X.shtml"><u>Material</u></a> * N
  // Pattern captures material name and quantity
  const pattern = /<u>([^<]+)<\/u><\/a>\s*\*\s*(\d+)/gi;
  let m;
  while ((m = pattern.exec(reqHtml)) !== null) {
    const name = decode(m[1]);
    const qty = parseInt(m[2], 10);
    if (name && qty > 0) {
      reqs.push({ item: name, quantity: qty });
    }
  }
  // Deduplicate by item name (shouldn't be needed but just in case)
  const seen = new Map();
  for (const r of reqs) seen.set(r.item, r);
  return [...seen.values()];
}

// ---------------------------------------------------------------------------
// Parse all items from the fetched HTML
// ---------------------------------------------------------------------------
function parseItems(html) {
  const items = [];
  const categoryRanges = buildCategoryRanges(html);
  console.log('Category ranges:', categoryRanges.map(r => `${r.label} [${r.start}-${r.end}]`));

  for (const range of categoryRanges) {
    const sectionHtml = html.slice(range.start, range.end);

    // Each item row starts with: <tr><td class="cen"><a href="items/
    // Split the section HTML on this pattern to get individual item rows
    const rowSplitter = /(?=<tr><td class="cen"><a href="items\/)/g;
    const rowChunks = sectionHtml.split(rowSplitter).slice(1); // skip text before first row

    let sectionCount = 0;

    for (const chunk of rowChunks) {
      // --- Image URL (from the <img src="items/X.png"> in first td) ---
      const imgMatch = chunk.match(/<img src="(items\/[^"]+\.png)"/i);
      const imageUrl = imgMatch
        ? SEREBII_BASE + imgMatch[1]
        : null;

      // --- Name: from alt attribute of the image (most reliable) ---
      const altMatch = chunk.match(/alt="([^"]+)"/i);
      const name = altMatch ? decode(altMatch[1]) : null;
      if (!name) continue;

      // --- Location: first <td class="fooinfo"> text ---
      const locationMatch = chunk.match(/<td class="fooinfo">([\s\S]*?)(?=<td class="fooinfo">|<\/tr>)/i);
      const location = locationMatch ? decode(locationMatch[1]) : '';

      // --- Requirements: second <td class="fooinfo"> section ---
      // Find all fooinfo tds
      const fooinfos = [];
      const fooPattern = /<td class="fooinfo">([\s\S]*?)(?=<td class="fooinfo">|<\/tr>|$)/gi;
      let fm;
      while ((fm = fooPattern.exec(chunk)) !== null) {
        fooinfos.push(fm[1]);
      }

      const reqHtml = fooinfos.length >= 2 ? fooinfos[1] : (fooinfos[0] || '');
      const requirements = parseRequirements(reqHtml);

      items.push({
        name,
        category: range.label,
        location: location || '',
        requirements,
        imageUrl,
      });
      sectionCount++;
    }

    console.log(`  ${range.label}: ${sectionCount} items`);
  }

  return items;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Fetching Serebii crafting page...');
  const html = await fetchUrl(SEREBII_URL);

  if (!html) {
    console.error('Failed to fetch Serebii page.');
    process.exit(1);
  }

  console.log(`Fetched ${html.length} bytes.\n`);

  const items = parseItems(html);
  console.log(`\nTotal items parsed: ${items.length}`);

  if (items.length === 0) {
    console.error('No items extracted — check the page structure.');
    process.exit(1);
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(items, null, 2), 'utf8');
  console.log(`Wrote ${items.length} items to src/data/items.json`);

  // Print samples
  const byCategory = {};
  for (const item of items) {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  }
  for (const [cat, catItems] of Object.entries(byCategory)) {
    console.log(`\n${cat} (${catItems.length}):`);
    catItems.slice(0, 3).forEach(item => {
      const reqs = item.requirements.map(r => `${r.item} x${r.quantity}`).join(', ');
      console.log(`  "${item.name}" — ${item.location} — [${reqs}]`);
    });
  }
}

main().catch(err => { console.error(err); process.exit(1); });
