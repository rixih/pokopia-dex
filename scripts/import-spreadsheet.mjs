/**
 * Imports favorites and flavor data from the community spreadsheet CSV.
 * Overwrites the favorites array and adds/updates the flavor field for
 * every matched Pokémon in pokemon.json and events.json.
 *
 * Run from project root:
 *   node scripts/import-spreadsheet.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '..', 'src', 'data');
const pokemonPath = path.join(DATA, 'pokemon.json');
const eventsPath = path.join(DATA, 'events.json');

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1X91xr0zPLTzHNF24ZpmFv-mfieo3lvVJ/gviz/tq?tqx=out:csv&sheet=All+Pokemon';

// ---------------------------------------------------------------------------
// Fetch CSV
// ---------------------------------------------------------------------------
function fetchCSV(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    }).on('error', () => resolve(null));
  });
}

// ---------------------------------------------------------------------------
// Parse CSV (handles quoted fields)
// ---------------------------------------------------------------------------
function parseCSV(text) {
  const rows = [];
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const fields = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { fields.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    fields.push(cur.trim());
    rows.push(fields);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Name normalization for matching
// ---------------------------------------------------------------------------
function norm(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')   // strip spaces, punctuation
    .trim();
}

// Extra aliases: NORMALISED spreadsheet name → NORMALISED pokemon.json name
// All keys must already be in norm() form (lowercase, alphanumeric only)
const ALIASES = {
  'generategar': 'gengar',
  'alazakam': 'alakazam',
  'tatsugiricurly': 'tatsugiri',
  'tatsugiridroopy': 'tatsugiri',
  'tatsugiristretchy': 'tatsugiri',
  'shelloswest': 'shellos',
  'shelloseast': 'shellos',
  'gastrodonwest': 'gastrodon',
  'gastrodoneast': 'gastrodon',
  'snorlaxmosslax': 'snorlax',
  'toxtricitymampedform': 'toxtricity',
  'toxtricitylowkeyform': 'toxtricity',
  'toxtricitylowkeyform': 'toxtricity',
  'toxtricityampedform': 'toxtricity',
  'tinkatontinkermaster': 'tinkaton',
  'sableye': 'sableye',
  'pikachu': 'pikachu',
  'pikachu peakychu': 'pikachu',
  'pikachu(peakychu)': 'pikachu',
  'pikachupeakychu': 'pikachu',
  'azumaril': 'azumarill',
  'ninetails': 'ninetales',
  'pwooper': 'paldeanwooper',
  // strip the asterisk/date suffix from Sableye's name
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Fetching spreadsheet CSV…');
  const csv = await fetchCSV(SHEET_URL);
  if (!csv) { console.error('Failed to fetch CSV.'); process.exit(1); }

  const rows = parseCSV(csv);
  const header = rows[0];
  console.log('Columns:', header.slice(0, 12).join(' | '));

  // Build a map: normalisedName → { favorites, flavor }
  // For Pokémon with variants (Tatsugiri etc.) we keep the FIRST match unless
  // we encounter a more specific entry; variants get merged into one shared record.
  const sheet = new Map(); // normName → { favorites, flavor, sheetName }

  for (const row of rows.slice(1)) {
    if (row.length < 12) continue;
    const [, rawName, , , , , f1, f2, f3, f4, f5, rawFlavor] = row;
    if (!rawName) continue;

    const sheetName = rawName.trim();
    const key = norm(ALIASES[norm(sheetName)] ?? sheetName);

    const favorites = [f1, f2, f3, f4, f5]
      .map(v => v.trim())
      .filter(v => v && v.toLowerCase() !== 'n/a' && v.toLowerCase() !== 'n/a');

    const flavor = rawFlavor.trim().replace(/\s+$/, '');

    // Only store if we have real data (not all N/a)
    if (favorites.length > 0 || (flavor && flavor.toLowerCase() !== 'n/a')) {
      if (!sheet.has(key)) {
        sheet.set(key, { favorites, flavor: flavor === 'N/a' ? '' : flavor, sheetName });
      }
    }
  }

  console.log(`Parsed ${sheet.size} distinct Pokémon entries from spreadsheet.`);

  // Update pokemon.json
  const pokemon = JSON.parse(fs.readFileSync(pokemonPath, 'utf8'));
  let updatedPkmn = 0;
  let skippedPkmn = 0;

  for (const p of pokemon) {
    const key = norm(p.name);
    const entry = sheet.get(key);
    if (entry) {
      p.favorites = entry.favorites;
      p.flavor = entry.flavor;
      updatedPkmn++;
    } else {
      skippedPkmn++;
      console.log(`  No match for: ${p.name} (${norm(p.name)})`);
    }
  }

  fs.writeFileSync(pokemonPath, JSON.stringify(pokemon, null, 2));
  console.log(`\npokemon.json: updated ${updatedPkmn}, skipped ${skippedPkmn}`);

  // Update events.json
  const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
  let updatedEvt = 0;

  for (const e of events) {
    const key = norm(e.name);
    const entry = sheet.get(key);
    if (entry) {
      e.favorites = entry.favorites;
      e.flavor = entry.flavor;
      updatedEvt++;
    }
  }

  fs.writeFileSync(eventsPath, JSON.stringify(events, null, 2));
  console.log(`events.json: updated ${updatedEvt} of ${events.length}`);

  // Show a few samples
  console.log('\nSamples:');
  pokemon.slice(0, 5).forEach(p => {
    console.log(`  ${p.name}: favorites=${JSON.stringify(p.favorites)}, flavor="${p.flavor}"`);
  });
}

main().catch(err => { console.error(err); process.exit(1); });
