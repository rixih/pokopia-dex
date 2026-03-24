/**
 * Scrapes IGN individual Pokémon pages for favorites data.
 * Tries each Pokémon in the DB, handles 404s gracefully.
 * Updates src/data/pokemon.json with collected favorites.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src', 'data');
const pokemonPath = path.join(SRC, 'pokemon.json');

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; research-bot/1.0)' } }, (res) => {
      if (res.statusCode === 404) { resolve(null); return; }
      if (res.statusCode !== 200) { resolve(null); return; }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(null));
    req.setTimeout(15000, () => { req.destroy(); resolve(null); });
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Parse favorites from IGN page HTML/markdown
// ---------------------------------------------------------------------------

function parseFavorites(html) {
  if (!html) return null;

  // IGN pages embed content as JSON with unicode-escaped HTML
  // Pattern: ..."Favorites include:..." followed by <ul><li><b>Item</b></li>... 
  const favIdx = html.search(/Favorites include|favorite things (?:are|include)/i);
  if (favIdx === -1) return null;

  // Take a window after the favorites heading and decode unicode escapes
  const window = html.slice(favIdx, favIdx + 4000);
  const decoded = window.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  ).replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\\"/g, '"');

  // Extract <li> content (items are often wrapped in <b> tags)
  const items = [];
  const liRe = /<li[^>]*>(?:<b>)?(.*?)(?:<\/b>)?<\/li>/gi;
  let m;
  while ((m = liRe.exec(decoded)) !== null) {
    const item = m[1].replace(/<[^>]+>/g, '').trim();
    if (item && item.length > 2 && item.length < 60) items.push(item);
    if (items.length >= 6) break;
  }

  return items.length >= 4 ? items : null;
}

// ---------------------------------------------------------------------------
// Name → URL slug transformation
// ---------------------------------------------------------------------------

function nameToSlug(name) {
  return name
    .replace(/\./g, '')       // Mr. Mime → Mr Mime
    .replace(/'/g, "'")       // Farfetch'd → Farfetch'd (keep as is)
    .replace(/\s+/g, '_')
    .replace(/-/g, '-');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const pokemonJson = JSON.parse(fs.readFileSync(pokemonPath, 'utf8'));
const results = {};
let fetched = 0;
let updated = 0;

console.log(`Attempting to fetch favorites for ${pokemonJson.length} Pokémon...`);

for (const p of pokemonJson) {
  // Skip if already has favorites data
  if (p.favorites && p.favorites.length >= 4) {
    console.log(`  ${p.number} ${p.name.padEnd(20)} already populated`);
    continue;
  }

  const slug = nameToSlug(p.name);
  const url = `https://www.ign.com/wikis/pokemon-pokopia/${encodeURIComponent(slug)}_Favorites,_Habitats,_and_Specialties`;

  process.stdout.write(`  ${p.number} ${p.name.padEnd(20)}`);

  const html = await fetchUrl(url);
  fetched++;

  if (!html) {
    process.stdout.write('404/error\n');
    await sleep(300);
    continue;
  }

  const favs = parseFavorites(html);
  if (favs && favs.length >= 4) {
    results[p.name] = favs;
    process.stdout.write(`✓ [${favs.join(', ')}]\n`);
    updated++;
  } else {
    process.stdout.write('page found but no favorites parsed\n');
  }

  await sleep(400); // be polite to IGN's servers
}

// Apply results to pokemon.json
for (const p of pokemonJson) {
  if (results[p.name]) {
    p.favorites = results[p.name];
  }
}

fs.writeFileSync(pokemonPath, JSON.stringify(pokemonJson, null, 2), 'utf8');
console.log(`\nDone. ${updated} Pokémon updated with favorites out of ${fetched} attempted.`);
