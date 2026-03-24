/**
 * Fetches the Polygon Habitat Dex article, extracts the in-game screenshot URL
 * for each of the 209 habitats, and writes `imageUrl` into habitats.json.
 *
 * Run once from the project root:
 *   node scripts/scrape-polygon-images.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HABITATS_PATH = path.join(__dirname, '..', 'src', 'data', 'habitats.json');
const POLYGON_URL = 'https://www.polygon.com/pokemon-pokopia-habitat-dex-list-requirements-unlock/';

// ---------------------------------------------------------------------------
// HTTP helper — follows up to 5 redirects, returns raw HTML string or null
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
      // Follow redirects
      if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) && res.headers.location && redirectsLeft > 0) {
        const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).toString();
        res.resume();
        fetchUrl(next, redirectsLeft - 1).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        console.log(`  HTTP ${res.statusCode} for ${url}`);
        res.resume();
        resolve(null);
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', (err) => { console.log(`  Request error: ${err.message}`); resolve(null); });
    req.setTimeout(30000, () => { req.destroy(); resolve(null); });
  });
}

// ---------------------------------------------------------------------------
// Extract image URLs from Polygon HTML
//
// Polygon's habitat table rows look like:
//   <tr>
//     <td>1</td>
//     <td>Tall grass</td>
//     <td><img src="https://cdn.vox-cdn.com/..." ...></td>
//     <td>4 tall grass</td>
//     <td>Bulbasaur, ...</td>
//   </tr>
//
// We scan for each <tr> block and extract the first <img src> found inside it,
// then pair it with the habitat number from the first <td>.
// ---------------------------------------------------------------------------
function extractHabitatImages(html) {
  const result = new Map(); // number -> imageUrl

  // Find the main table body — look for a <tbody> or just iterate <tr> blocks
  // Split on <tr (case-insensitive)
  const trPattern = /<tr[\s>]/gi;
  const trIndices = [];
  let m;
  while ((m = trPattern.exec(html)) !== null) {
    trIndices.push(m.index);
  }

  for (let i = 0; i < trIndices.length; i++) {
    const start = trIndices[i];
    const end = i + 1 < trIndices.length ? trIndices[i + 1] : html.length;
    const row = html.slice(start, end);

    // Extract all <td> content (very simplified — works for non-nested tables)
    const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const tds = [];
    let tdMatch;
    while ((tdMatch = tdPattern.exec(row)) !== null) {
      tds.push(tdMatch[1]);
    }

    if (tds.length < 3) continue;

    // First TD should be the habitat number (strip tags)
    const numStr = tds[0].replace(/<[^>]+>/g, '').trim();
    const num = parseInt(numStr, 10);
    if (isNaN(num) || num < 1 || num > 250) continue;

    // Find an <img src="..."> anywhere in this row
    const imgMatch = row.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!imgMatch) continue;

    let src = imgMatch[1];

    // Decode HTML entities (e.g. &amp; → &)
    src = src.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

    if (src.startsWith('//')) src = 'https:' + src;

    // Skip tiny icons / tracking pixels / spacers
    if (src.includes('1x1') || src.includes('pixel') || src.includes('svg+xml')) continue;

    if (!result.has(num)) {
      result.set(num, src);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Fetching Polygon habitat article...');
  const html = await fetchUrl(POLYGON_URL);

  if (!html) {
    console.error('Failed to fetch Polygon page. Exiting without changes.');
    process.exit(1);
  }

  console.log(`Fetched ${html.length} bytes of HTML.`);

  // Debug: check if we got real content or a JS-rendered placeholder
  const hasTable = /<table/i.test(html);
  const hasTr = /<tr/i.test(html);
  console.log(`  Contains <table>: ${hasTable}  Contains <tr>: ${hasTr}`);

  // Dump a snippet around the first table to verify structure
  const tableIdx = html.toLowerCase().indexOf('<table');
  if (tableIdx !== -1) {
    console.log('\n--- First 1000 chars of table ---');
    console.log(html.slice(tableIdx, tableIdx + 1000));
    console.log('--- end snippet ---\n');
  } else {
    console.log('\nNo <table> found. Polygon may require JavaScript rendering.');
    console.log('Scanning for any <img> tags to assess image embedding...');
    const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].slice(0, 5);
    imgMatches.forEach(m => console.log('  img:', m[1]));
  }

  const imageMap = extractHabitatImages(html);
  console.log(`\nExtracted ${imageMap.size} habitat image URLs.`);

  if (imageMap.size === 0) {
    console.log('\nNo images extracted — Polygon likely uses JavaScript rendering.');
    console.log('The existing CSS gradient banners will remain as visuals.');
    console.log('No changes written to habitats.json.');
    process.exit(0);
  }

  // Update habitats.json
  const habitats = JSON.parse(fs.readFileSync(HABITATS_PATH, 'utf8'));
  let updated = 0;
  for (const habitat of habitats) {
    const url = imageMap.get(habitat.number);
    if (url) {
      habitat.imageUrl = url;
      updated++;
    }
  }

  fs.writeFileSync(HABITATS_PATH, JSON.stringify(habitats, null, 2));
  console.log(`Updated ${updated} habitat entries with imageUrl in habitats.json.`);

  // Print a few samples
  habitats.slice(0, 5).forEach(h => {
    console.log(`  #${h.number} ${h.name}: ${h.imageUrl ?? '(no image)'}`);
  });
}

main().catch(err => { console.error(err); process.exit(1); });
