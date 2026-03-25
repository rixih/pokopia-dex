import { writeFileSync } from 'fs';

const KITS = [
  'leafdenkit', 'leafhutkit', 'leafcottagekit', 'leafhousekit',
  'sanddenkit', 'sandhutkit', 'sandcottagekit', 'sandhousekit',
  'stonedenkit', 'stonehutkit', 'stonecottagekit', 'stonehousekit',
  'citydenkit', 'cityhutkit', 'citycottagekit', 'cityhousekit',
  'pokeballhousekit', 'pokemartkit',
  'wastelandpokemoncenterkit', 'beachpokemoncenterkit',
  'ridgepokemoncenterkit', 'skylandpokemoncenterkit',
  'windmillkit', 'waterwheelkit', 'furnacekit', 'chargingstationkit',
  'pikachufountainkit', 'moonlightdancestatuekit',
  'pinkhutkit', 'pinkcottagekit',
  'orangehutkit', 'orangecottagekit',
  'grayhutkit', 'graycottagekit',
  'yellowhutkit', 'yellowcottagekit',
  'logcabinkit', 'smallofficekit', 'relaxingparkkit',
  'stylishcafekit', 'concertstagekit', 'fountainplazakit',
  'altarofflamekit', 'abandonedpowerplantkit',
  'freezingchamberskit', 'mysteriousmuralkit',
];

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&eacute;/g, 'é')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#233;/g, 'é')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTdContents(rowHtml) {
  const cells = [];
  const re = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let m;
  while ((m = re.exec(rowHtml)) !== null) {
    cells.push(stripTags(m[1]));
  }
  return cells;
}

function getRows(tableHtml) {
  const rows = [];
  const re = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = re.exec(tableHtml)) !== null) {
    const cells = getTdContents(m[1]);
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}

function parseSize(str) {
  const w = str.match(/Width[^:]*:\s*(\d+)/i);
  const d = str.match(/Depth[^:]*:\s*(\d+)/i);
  const h = str.match(/Height[^:]*:\s*(\d+)/i);
  return {
    width: w ? parseInt(w[1]) : null,
    depth: d ? parseInt(d[1]) : null,
    height: h ? parseInt(h[1]) : null,
  };
}

// Extract all alt texts from img tags — used for specialty names
function getImgAlts(html) {
  const alts = [];
  const re = /<img[^>]+alt="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    alts.push(m[1]);
  }
  return alts;
}

async function scrapeKit(slug) {
  const url = `https://www.serebii.net/pokemonpokopia/build/${slug}.shtml`;
  const imageUrl = `https://www.serebii.net/pokemonpokopia/build/${slug}.png`;

  let html;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    html = await res.text();
  } catch (e) {
    console.error(`  ✗ ${slug}: ${e.message}`);
    return null;
  }

  // Extract all dextable blocks
  const dextables = [];
  const dtRe = /<table class="dextable"[^>]*>([\s\S]*?)<\/table>/gi;
  let dtm;
  while ((dtm = dtRe.exec(html)) !== null) {
    dextables.push(dtm[1]);
  }

  if (dextables.length === 0) {
    console.error(`  ✗ ${slug}: no dextable found`);
    return null;
  }

  // ── First dextable: name, image, description, stats ──
  const statsTable = dextables[0];
  const statsRows = getRows(statsTable);

  // Name from h1
  const h1 = statsTable.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const name = h1 ? stripTags(h1[1]) : slug;

  // Description: find row where no headers and has text
  let description = '';
  let concept = '', floors = null, liveablePokemon = null, timeRequired = '', size = {};

  for (const row of statsRows) {
    // Skip header rows
    if (row.some(c => c === 'Concept' || c === 'Floors' || c === 'Time Required')) continue;
    // Skip name/image rows
    if (row[0] === name || row[0] === '') continue;

    const isConceptRow =
      row[0].includes('Building') || row[0].includes('Overworld') ||
      row[0].includes('Decoration') || row[0].includes('Remodel');

    if (isConceptRow) {
      concept = row[0];
      if (row.length >= 5) {
        // concept | floors | liveable | time | size
        floors = parseInt(row[1]);
        liveablePokemon = parseInt(row[2]);
        timeRequired = row[3];
        size = parseSize(row[4]);
      } else if (row.length === 4) {
        // concept | liveable | time | size (Overworld/no floors)
        liveablePokemon = parseInt(row[1]);
        timeRequired = row[2];
        size = parseSize(row[3]);
      } else if (row.length === 3) {
        timeRequired = row[1];
        size = parseSize(row[2]);
      }
    } else if (!isConceptRow && row.length === 1 && row[0].length > 10 && description === '') {
      description = row[0];
    }
  }

  // ── Materials + Pokémon: parse directly from full HTML ──
  // These are in nested inner tables with style="min-width:200px"
  const materials = [];
  let pokemonCount = null;
  const specialties = [];

  const knownSpecialties = new Set([
    'Build', 'Chop', 'Burn', 'Water', 'Fly', 'Bulldoze', 'Crush',
    'Generate', 'Grow', 'Litter', 'Gather', 'Search', 'Trade',
    'Recycle', 'Hype', 'Teleport', 'Storage', 'Explode', 'Engineer',
    'Paint', 'DJ', 'Yawn', 'Gather Honey', 'Dream Island', 'Illuminate',
  ]);

  // Find the h2 Materials section in the raw HTML
  const matH2Idx = html.indexOf('<h2>Materials</h2>');
  if (matH2Idx !== -1) {
    const matSection = html.slice(matH2Idx, matH2Idx + 3000);

    // Find the inner materials table (min-width:200px, first one)
    const innerMatMatch = matSection.match(/<table[^>]*min-width[^>]*>([\s\S]*?)<\/table>/i);
    if (innerMatMatch) {
      const matRows = getRows(innerMatMatch[1]);
      for (const row of matRows) {
        const filtered = row.filter(c => c.trim() !== '');
        if (filtered.length >= 2) {
          const qty = parseInt(filtered[filtered.length - 1]);
          const itemName = filtered[filtered.length - 2].trim();
          if (!isNaN(qty) && itemName && qty > 0) {
            materials.push({ item: itemName, quantity: qty });
          }
        }
      }
    }
  }

  // Find the h2 Pokémon section
  const pokeH2Idx = html.indexOf('<h2>Pok');
  if (pokeH2Idx !== -1) {
    const pokeSection = html.slice(pokeH2Idx, pokeH2Idx + 2000);

    // Count
    const countMatch = pokeSection.match(/(\d+)\s+Pok[eé]mon including/i);
    if (countMatch) pokemonCount = parseInt(countMatch[1]);

    // Specialty names from img alt attributes
    const alts = getImgAlts(pokeSection);
    for (const alt of alts) {
      if (knownSpecialties.has(alt) && !specialties.includes(alt)) {
        specialties.push(alt);
      }
    }
  }

  return {
    slug,
    name,
    description,
    concept,
    floors: isNaN(floors) ? null : floors,
    liveablePokemon: isNaN(liveablePokemon) ? null : liveablePokemon,
    timeRequired,
    size,
    materials,
    pokemonRequired: { count: pokemonCount, specialties },
    imageUrl,
  };
}

async function main() {
  const results = [];
  for (const slug of KITS) {
    process.stdout.write(`Scraping ${slug}...`);
    const kit = await scrapeKit(slug);
    if (kit) {
      console.log(` ✓ "${kit.name}" | ${kit.concept} | ${kit.timeRequired} | ${kit.materials.length} mats | specialties: ${kit.pokemonRequired.specialties.join(',')}`);
      results.push(kit);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  writeFileSync('src/data/building-kits.json', JSON.stringify(results, null, 2));
  console.log(`\nDone! Saved ${results.length} kits to src/data/building-kits.json`);
}

main().catch(console.error);
