/**
 * Parses all 209 Pokopia habitats from Polygon's Habitat Dex guide and:
 *  1. Updates src/data/pokemon.json with habitats, habitatItems, times, weather
 *  2. Generates src/data/habitats.json
 *
 * Data source: https://www.polygon.com/pokemon-pokopia-habitat-dex-list-requirements-unlock/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src', 'data');

// ---------------------------------------------------------------------------
// Name normalisation: Polygon name → our DB name
// ---------------------------------------------------------------------------
const NAME_ALIASES = {
  'Victreebell': 'Victreebel',
  'Exeggcutor': 'Exeggutor',
  'Armarogue': 'Armarouge',
  'Farigarif': 'Farigiraf',
  'Daschbun': 'Dachsbun',
  'Volcarona': 'Volcanora',  // our DB uses "Volcanora"
};

// Strip form specifiers, apply alias, return null if unknown
function normalizeName(rawName) {
  const stripped = rawName.replace(/\s*\([^)]+\)\s*$/, '').trim();
  if (!stripped || stripped === '???') return null;
  return NAME_ALIASES[stripped] || stripped;
}

// ---------------------------------------------------------------------------
// All 209 habitats.
// Each pokemon entry is either a string (no restriction) or an object:
//   { name, times?, weather?, location? }
// Omitting times/weather means the full set (all times / all weather).
// ---------------------------------------------------------------------------
const ALL_TIMES = ['Morning', 'Day', 'Evening', 'Night'];
const ALL_WEATHER = ['Sunny', 'Cloudy', 'Rainy'];

const DAY_TIMES = ['Morning', 'Day', 'Evening'];
const NIGHT_TIMES = ['Night'];
const RAINY = ['Rainy'];
const SUNNY_CLOUDY = ['Sunny', 'Cloudy'];
const SUNNY = ['Sunny'];

const HABITATS = [
  {
    number: 1, name: 'Tall grass', category: 'Bright',
    requirements: '4 tall grass',
    pokemon: [
      'Bulbasaur', 'Squirtle',
      { name: 'Charmander', weather: SUNNY_CLOUDY },
      { name: 'Oddish', times: NIGHT_TIMES },
      { name: 'Geodude', location: 'Palette Town' },
      { name: 'Charizard', weather: SUNNY_CLOUDY },
    ],
  },
  {
    number: 2, name: 'Tree-shaded tall grass', category: 'Bright',
    requirements: '1 large tree (any), 4 tall grass',
    pokemon: [
      'Scyther', { name: 'Scizor', location: 'Palette Town' },
      'Bellsprout', 'Pinsir', 'Heracross',
      { name: 'Skwovet', location: 'Palette Town' },
    ],
  },
  {
    number: 3, name: 'Boulder-shaded tall grass', category: 'Bright',
    requirements: '4 tall grass, 1 large boulder',
    pokemon: [
      'Timburr', 'Gurdurr', { name: 'Machop', location: 'Palette Town' },
    ],
  },
  {
    number: 4, name: 'Hydrated tall grass', category: 'Humid',
    requirements: '4 tall grass, 2 water',
    pokemon: [
      'Squirtle', 'Wartortle', 'Blastoise',
      { name: 'Sliggoo', weather: RAINY },
      { name: 'Cramorant', location: 'Palette Town' },
    ],
  },
  {
    number: 5, name: 'Seaside tall grass', category: 'Humid',
    requirements: '4 tall grass, 2 ocean water',
    pokemon: ['Slowpoke', 'Slowbro', 'Slowking'],
  },
  {
    number: 6, name: 'Elevated tall grass', category: 'Bright',
    requirements: '4 tall grass, 1 high-up location',
    pokemon: [
      { name: 'Pidgey', times: DAY_TIMES },
      { name: 'Pidgeotto', times: DAY_TIMES },
      { name: 'Hoothoot', times: NIGHT_TIMES },
      { name: 'Noctowl', times: NIGHT_TIMES },
    ],
  },
  {
    number: 7, name: 'Illuminated tall grass', category: 'Bright',
    requirements: '4 tall grass (any), 1 lighting (any)',
    pokemon: [
      { name: 'Venonat', times: NIGHT_TIMES },
      { name: 'Venomoth', times: NIGHT_TIMES },
    ],
  },
  {
    number: 8, name: 'Pretty flower bed', category: 'Bright',
    requirements: '4 wildflowers',
    pokemon: [
      { name: 'Pidgey', times: DAY_TIMES },
      { name: 'Pidgeotto', times: DAY_TIMES },
      { name: 'Hoothoot', times: NIGHT_TIMES },
      'Combee',
      { name: 'Eevee', location: 'Palette Town' },
      { name: 'Magby', location: 'Palette Town' },
    ],
  },
  {
    number: 9, name: 'Tree-shaded flower bed', category: 'Bright',
    requirements: '1 berry tree (any), 4 wildflowers',
    pokemon: [
      { name: 'Goomy', weather: RAINY },
      { name: 'Cacturne', times: NIGHT_TIMES },
      { name: 'Vikavolt', location: 'Palette Town' },
    ],
  },
  {
    number: 10, name: 'Hydrated flower bed', category: 'Humid',
    requirements: '4 wildflowers, 2 water',
    pokemon: ['Volbeat', 'Illumise'],
  },
  {
    number: 11, name: 'Field of flowers', category: 'Bright',
    requirements: '8 wildflowers',
    pokemon: ['Vespiquen', 'Ivysaur', 'Venusaur'],
  },
  {
    number: 12, name: 'Elevated flower bed', category: 'Bright',
    requirements: '4 wildflowers, 1 high-up location',
    pokemon: ['Paras', 'Parasect'],
  },
  {
    number: 13, name: 'Grave with flowers', category: 'Dark',
    requirements: '4 wildflowers, 1 gravestone',
    pokemon: ['Cubone', 'Marowak'],
  },
  {
    number: 14, name: 'Flower garden', category: 'Bright',
    requirements: '4 hedges (any), 4 wildflowers',
    pokemon: ['Paras', 'Parasect'],
  },
  {
    number: 15, name: 'Fresh veggie field', category: 'Bright',
    requirements: '8 vegetable field (any)',
    pokemon: ['Drilbur', 'Excadrill'],
  },
  {
    number: 16, name: 'Riding warm updrafts', category: 'Warm',
    requirements: '3 lit campfires',
    pokemon: ['Drifloon'],
  },
  {
    number: 17, name: 'Campsite', category: 'Warm',
    requirements: '1 lit campfire, 1 straw table, 1 straw stool',
    pokemon: [{ name: 'Charmeleon', weather: SUNNY_CLOUDY }],
  },
  {
    number: 18, name: 'Training waterfall', category: 'Humid',
    requirements: '1 seat (any), 2 water, 1 waterfall',
    pokemon: ['Tyrogue'],
  },
  {
    number: 19, name: 'Tantalizing dining set', category: 'Bright',
    requirements: '1 seat (any), 1 table (any), 1 plated food',
    pokemon: ['Gulpin'],
  },
  {
    number: 20, name: 'Picnic set', category: 'Bright',
    requirements: '1 seat (any), 1 table (any), 1 picnic basket',
    pokemon: [
      { name: 'Pichu', location: 'Withered Wasteland' },
      { name: 'Pikachu', location: 'Palette Town' },
    ],
  },
  {
    number: 21, name: 'Flowery table', category: 'Bright',
    requirements: '1 seat (any), 1 table (any), 1 small vase',
    pokemon: ['Weepinbell', 'Victreebell'],
  },
  {
    number: 22, name: 'Bench with greenery', category: 'Bright',
    requirements: '2 hedges (any), 1 seat (wide)',
    pokemon: ['Bulbasaur', 'Ivysaur'],
  },
  {
    number: 23, name: 'Illuminated bench', category: 'Dark',
    requirements: '1 seat (wide), 1 powered streetlight (any)',
    pokemon: [
      { name: 'Venonat', times: NIGHT_TIMES },
      { name: 'Venomoth', times: NIGHT_TIMES },
    ],
  },
  {
    number: 24, name: 'Exercise resting spot', category: 'Bright',
    requirements: '1 punching bag, 1 seat (any)',
    pokemon: ['Hitmonchan'],
  },
  {
    number: 25, name: 'Urgent care', category: 'Bright',
    requirements: '1 seat (any), 1 table (any), 1 first aid kit',
    pokemon: ['Hitmonlee'],
  },
  {
    number: 26, name: 'Gym first aid', category: 'Bright',
    requirements: '1 table (any), 1 punching bag, 1 first aid kit',
    pokemon: ['Hitmontop'],
  },
  {
    number: 27, name: 'Road sign', category: 'Bright',
    requirements: '1 arrow sign, 3 wooden path',
    pokemon: ['Shellos'],
  },
  {
    number: 28, name: 'Large luggage carrier', category: 'Bright',
    requirements: '1 cart, 2 wooden crates',
    pokemon: [
      'Gurdurr',
      { name: 'Tinkatink', location: 'Palette Town' },
      { name: 'Tinkatuff', location: 'Palette Town' },
    ],
  },
  {
    number: 29, name: "Lumberjack's workplace", category: 'Bright',
    requirements: '1 log chair, 1 cart, 1 tree stump (any), 1 log table',
    pokemon: ['Axew', 'Fraxure', 'Haxorus'],
  },
  {
    number: 30, name: 'Bed with a plush', category: 'Bright',
    requirements: '1 bed (any), 1 doll (any)',
    pokemon: [
      'Drifloon', 'Slowbro', 'Slowking',
      { name: 'Munchlax', location: 'Palette Town' },
    ],
  },
  {
    number: 31, name: 'Gently lit bed', category: 'Dark',
    requirements: '1 bed (any), 1 table (any), 1 lit slender candle',
    pokemon: [
      { name: 'Hoothoot', times: NIGHT_TIMES },
      { name: 'Noctowl', times: NIGHT_TIMES },
    ],
  },
  {
    number: 32, name: 'Grave offering', category: 'Dark',
    requirements: '1 gravestone, 1 plated food, 2 lit slender candles',
    pokemon: ['Litwick', 'Lampent'],
  },
  {
    number: 33, name: 'Creepy grave offering', category: 'Dark',
    requirements: '2 lit eerie candles, 1 gravestone, 1 plated food',
    pokemon: ['Litwick', 'Lampent', 'Chandelure'],
  },
  {
    number: 34, name: 'Chansey resting area', category: 'Bright',
    requirements: '6 hedges (any), 1 Chansey plant, 1 seat (wide)',
    pokemon: ['Vileplume', 'Bellossom'],
  },
  {
    number: 35, name: 'Irresistible scent and glow', category: 'Bright',
    requirements: '1 pitcher-plant pot, 1 plated food, 1 mushroom lamp',
    pokemon: ['Weepinbell', 'Victreebell'],
  },
  {
    number: 36, name: 'Floating in the shade', category: 'Humid',
    requirements: '1 inflatable boat, 1 beach parasol, 2 water',
    pokemon: ['Blastoise'],
  },
  {
    number: 37, name: 'Smooth tall grass', category: 'Dry',
    requirements: '1 dry tall grass, 1 smooth rock',
    pokemon: ['Onix'],
  },
  {
    number: 38, name: 'Factory storage', category: 'Dark',
    requirements: '1 powered streetlight (any), 1 control unit, 1 metal drum, 1 jumbled cords',
    pokemon: ['Magnemite'],
  },
  {
    number: 39, name: 'Luxury chirp-chirp meal', category: 'Bright',
    requirements: '1 wooden birdhouse, 1 berry basket',
    pokemon: [{ name: 'Pidgeot', times: DAY_TIMES }],
  },
  {
    number: 40, name: 'Berry-feast campsite', category: 'Warm',
    requirements: '1 Castform weather charm (sun), 1 lit bonfire, 1 berry basket, 1 high-up location',
    pokemon: [{ name: 'Charizard', weather: SUNNY_CLOUDY }],
  },
  {
    number: 41, name: 'Rain Dance site', category: 'Humid',
    requirements: '2 Castform weather charm (rain), 1 plated food',
    pokemon: [{ name: 'Goomy', weather: RAINY }],
  },
  {
    number: 42, name: 'Sunny Day site', category: 'Warm',
    requirements: '2 Castform weather charm (sun), 1 plated food',
    pokemon: [{ name: 'Cacnea', weather: SUNNY }],
  },
  {
    number: 43, name: "Professor's treasure trove", category: 'Bright',
    requirements: "1 Professor's treasure trove, 4 lost relics (large), 1 bed (any)",
    pokemon: ['Tangrowth'],
  },
  {
    number: 44, name: 'Cozy log handicrafts', category: 'Bright',
    requirements: '1 log chair, 1 log bed, 1 log table',
    pokemon: ['Axew', 'Fraxure', 'Haxorus'],
  },
  {
    number: 45, name: 'Very-berry space', category: 'Bright',
    requirements: '1 berry chair, 1 berry bed, 1 berry table, 1 powered berry table lamp',
    pokemon: [{ name: 'Goodra', weather: RAINY }],
  },
  {
    number: 46, name: 'Garden terrace', category: 'Bright',
    requirements: '4 wildflowers, 1 garden chair, 1 lit garden light, 1 garden table',
    pokemon: ['Venusaur'],
  },
  {
    number: 47, name: 'Tree-shaded snoozing Snorlax', category: 'Bright',
    requirements: '1 large tree (any), 1 naptime bed',
    pokemon: [
      { name: 'Munchlax', location: 'Palette Town' },
      { name: 'Snorlax', location: 'Palette Town' },
    ],
  },
  {
    number: 48, name: 'Gold old-fashioned antiques', category: 'Bright',
    requirements: '1 antique closet, 1 antique bed, 1 antique dresser, 1 antique chair',
    pokemon: [{ name: 'Weezing', location: 'Palette Town' }],
  },
  {
    number: 49, name: "Nothin' but Poké Balls", category: 'Bright',
    requirements: '1 Poké Ball sofa, 1 Poké Ball bed, 1 Poké Ball table, 1 powered Poké Ball light',
    pokemon: [{ name: 'Tangela', location: 'Palette Town' }],
  },
  {
    number: 50, name: 'Yellow tall grass', category: 'Bright',
    requirements: '4 yellow tall grass',
    pokemon: ['Spinarak', 'Ariados', 'Grubbin'],
  },
  {
    number: 51, name: 'Tree-shaded yellow tall grass', category: 'Bright',
    requirements: '1 large tree (any), 4 yellow tall grass',
    pokemon: [
      { name: 'Zubat', times: NIGHT_TIMES, location: 'Bleak Beach' },
      { name: 'Golbat', times: NIGHT_TIMES },
      'Makuhita', 'Hariyama',
    ],
  },
  {
    number: 52, name: 'Elevated yellow tall grass', category: 'Bright',
    requirements: '4 yellow tall grass, 1 high-up location',
    pokemon: [
      { name: 'Wingull', times: DAY_TIMES },
      { name: 'Pelipper', times: DAY_TIMES },
      { name: 'Crobat', times: NIGHT_TIMES },
    ],
  },
  {
    number: 53, name: 'Hydrated yellow tall grass', category: 'Humid',
    requirements: '4 yellow tall grass, 2 water',
    pokemon: ['Azurill', 'Marill', 'Piplup', 'Prinplup'],
  },
  {
    number: 54, name: 'Marshy tall grass', category: 'Humid',
    requirements: '4 yellow tall grass, 2 muddy water',
    pokemon: ['Paldean Wooper', 'Clodsire'],
  },
  {
    number: 55, name: 'Overgrowth vending machine', category: 'Bright',
    requirements: '4 yellow tall grass, 1 powered vending machine',
    pokemon: ['Mareep'],
  },
  {
    number: 56, name: 'Breezy flower bed', category: 'Bright',
    requirements: '4 seashore flowers',
    pokemon: ['Pawmi', 'Zorua', 'Zoroark'],
  },
  {
    number: 57, name: 'Tropical vibes', category: 'Bright',
    requirements: '1 large palm tree, 4 seashore flowers',
    pokemon: ['Gloom', 'Exeggcute', 'Exeggcutor'],
  },
  {
    number: 58, name: 'Windy flower bed', category: 'Bright',
    requirements: '1 windmill, 4 seashore flowers',
    pokemon: [
      { name: 'Wingull', times: DAY_TIMES },
      { name: 'Pelipper', times: DAY_TIMES },
    ],
  },
  {
    number: 59, name: 'Shaded beach', category: 'Bright',
    requirements: '1 large palm tree, 1 beach chair',
    pokemon: ['Exeggcute', 'Exeggutor'],
  },
  {
    number: 60, name: 'Tropical seaside', category: 'Humid',
    requirements: '1 large palm tree, 2 hedges (any), 2 ocean water',
    pokemon: ['Lapras'],
  },
  {
    number: 61, name: 'Resting spot', category: 'Bright',
    requirements: '1 cardboard boxes, 1 straw bed',
    pokemon: ['Meowth'],
  },
  {
    number: 62, name: 'Perpetual mess', category: 'Bright',
    requirements: '1 cardboard boxes, 2 toys (any)',
    pokemon: ['Growlithe', 'Azurill'],
  },
  {
    number: 63, name: 'Trash collection site', category: 'Dark',
    requirements: '1 waste bin (any), 1 sign (any), 1 garbage bags',
    pokemon: [
      'Trubbish', 'Garbodor',
      { name: 'Koffing', location: 'Palette Town' },
      { name: 'Weezing', location: 'Palette Town' },
    ],
  },
  {
    number: 64, name: 'Trash can central', category: 'Dark',
    requirements: '4 garbage bins',
    pokemon: ['Magneton', 'Magnezone', 'Electabuzz'],
  },
  {
    number: 65, name: 'Trash disposal site', category: 'Dark',
    requirements: '1 utility pole, 1 garbage bags',
    pokemon: [{ name: 'Crobat', times: NIGHT_TIMES }],
  },
  {
    number: 66, name: 'Park bench', category: 'Bright',
    requirements: '1 seat (wide), 1 garbage bin',
    pokemon: [
      { name: 'Zubat', times: NIGHT_TIMES, location: 'Bleak Beach' },
      'Voltorb', 'Electrode',
    ],
  },
  {
    number: 67, name: 'Tantalizing restaurant', category: 'Bright',
    requirements: '1 seat (any), 1 menu board, 1 table (any), 1 plated food',
    pokemon: ['Pawmo', 'Pawmi'],
  },
  {
    number: 68, name: 'Tableside delivery cart', category: 'Bright',
    requirements: '2 chic chairs, 1 chic table, 1 small vase, 1 push cart, 1 plated food',
    pokemon: [{ name: 'Empoleon', weather: RAINY }],
  },
  {
    number: 69, name: 'Chirp-chirp meal', category: 'Bright',
    requirements: '1 wooden birdhouse, 1 table (any), 1 plated food',
    pokemon: ['Torchic', 'Blaziken'],
  },
  {
    number: 70, name: 'Café space', category: 'Bright',
    requirements: '2 seats (any), 1 potted plant (any), 2 counters, 1 mug, 1 menu board',
    pokemon: ['Pawmo', 'Pawmot'],
  },
  {
    number: 71, name: 'Beach set', category: 'Bright',
    requirements: '1 beach chair, 1 beach parasol, 1 side table',
    pokemon: ['Tatsugiri (Stretchy form)', 'Tatsugiri (Droopy form)', 'Tatsugiri (Curly form)'],
  },
  {
    number: 72, name: 'Light-up stage', category: 'Bright',
    requirements: '2 powered spotlights, 1 powered small stage',
    pokemon: ['Electabuzz', 'Electivire'],
  },
  {
    number: 73, name: 'Surprise in store', category: 'Dark',
    requirements: '2 balloons, 1 boo-in-the-box',
    pokemon: [
      { name: 'Haunter', times: NIGHT_TIMES },
      'Zoroark',
      { name: 'Gengar', times: NIGHT_TIMES },
    ],
  },
  {
    number: 74, name: 'Night festival venue', category: 'Bright',
    requirements: '2 balloons, 1 powered Raichu sign',
    pokemon: ['Flaaffy'],
  },
  {
    number: 75, name: 'Changing area', category: 'Bright',
    requirements: '1 closet (any), 1 mirror (large)',
    pokemon: ['Minccino'],
  },
  {
    number: 76, name: 'Private makeup stand', category: 'Bright',
    requirements: '2 partitions (any), 1 closet (any), 1 dresser (any)',
    pokemon: ['Minccino', 'Cinccino'],
  },
  {
    number: 77, name: 'Knitting station', category: 'Bright',
    requirements: '1 seat (any), 1 table (any), 1 knitting supplies',
    pokemon: ['Mareep', 'Flaaffy'],
  },
  {
    number: 78, name: 'Hot-spring shower', category: 'Humid',
    requirements: '1 shower, 1 seat (any), 2 hot-spring water',
    pokemon: ['Psyduck', 'Golduck'],
  },
  {
    number: 79, name: 'Resort meal prep', category: 'Warm',
    requirements: '1 large palm tree, 1 seat (any), 1 plated food, 1 campfire',
    pokemon: ['Growlithe', 'Torchic', 'Combusken'],
  },
  {
    number: 80, name: 'All packed up', category: 'Bright',
    requirements: '1 cart, 2 cardboard boxes',
    pokemon: ["Farfetch'd", 'Makuhita', 'Hariyama'],
  },
  {
    number: 81, name: 'Full recovery', category: 'Bright',
    requirements: '1 bed (any), 1 plain chest, 1 first aid kit',
    pokemon: ['Chansey', 'Pikachu'],
  },
  {
    number: 82, name: 'Alarm clock sleep zone', category: 'Bright',
    requirements: '1 bed (any), 1 table (any), 1 alarm clock',
    pokemon: ['Happiny'],
  },
  {
    number: 83, name: 'Vending machine break area', category: 'Bright',
    requirements: '1 powered vending machine, 1 seat (wide)',
    pokemon: ['Grubbin', 'Charjabug'],
  },
  {
    number: 84, name: 'Vending machine set', category: 'Bright',
    requirements: '1 waste bin (any), 1 powered vending machine',
    pokemon: ['Elekid', 'Electivire'],
  },
  {
    number: 85, name: 'Mini game corner', category: 'Bright',
    requirements: '1 powered arcade machine, 1 seat (any), 1 punching game',
    pokemon: ['Magneton', 'Magnezone'],
  },
  {
    number: 86, name: 'Waterwheel spot', category: 'Humid',
    requirements: '1 waterwheel, 2 water, 1 waterfall',
    pokemon: ['Prinplup', { name: 'Empoleon', weather: RAINY }],
  },
  {
    number: 87, name: 'Furnace spot', category: 'Warm',
    requirements: '1 metal drum, 1 furnace',
    pokemon: ['Combusken', 'Blaziken'],
  },
  {
    number: 88, name: 'Dock', category: 'Humid',
    requirements: '4 walkways, 1 powered streetlight, 2 ocean water',
    pokemon: ['Marill', { name: 'Azumarill', weather: RAINY }],
  },
  {
    number: 89, name: 'Spooky study', category: 'Dark',
    requirements: '1 bookcase, 1 chic sofa, 1 plain table, 1 lit slender candle',
    pokemon: [
      { name: 'Gastly', times: NIGHT_TIMES },
      { name: 'Haunter', times: NIGHT_TIMES },
    ],
  },
  {
    number: 90, name: 'Playing pirate', category: 'Bright',
    requirements: "2 barrels, 1 ship's wheel, 2 cannons",
    pokemon: ['Voltorb'],
  },
  {
    number: 91, name: 'Working the register', category: 'Bright',
    requirements: '2 table (any), 1 powered cash register',
    pokemon: ['Meowth', 'Happiny', 'Audino'],
  },
  {
    number: 92, name: 'Tiny atelier', category: 'Bright',
    requirements: '1 canvas, 1 seat (any)',
    pokemon: ['Smeargle'],
  },
  {
    number: 93, name: "Gourmet's altar", category: 'Bright',
    requirements: '1 offering dish',
    pokemon: ['Snorlax'],
  },
  {
    number: 94, name: 'Pikachu space', category: 'Bright',
    requirements: '1 Pikachu sofa, 1 Pikachu doll',
    pokemon: ['Mimikyu'],
  },
  {
    number: 95, name: 'Cuteness overload', category: 'Bright',
    requirements: '1 cute sofa, 1 cute table, 1 powered cute lamp, 1 cute bed, 1 cute dresser',
    pokemon: ['Blissey'],
  },
  {
    number: 96, name: 'Welcoming resort', category: 'Bright',
    requirements: '1 resort sofa, 1 resort table, 1 resort hammock, 1 powered resort light',
    pokemon: ['Absol'],
  },
  {
    number: 97, name: 'Plain life', category: 'Bright',
    requirements: '1 plain bed, 1 plain sofa, 1 plain table, 1 lit plain lamp',
    pokemon: ['Ampharos'],
  },
  {
    number: 98, name: 'Red tall grass', category: 'Dry',
    requirements: '4 red tall grass',
    pokemon: ['Scorbunny', 'Riolu', 'Kricketot', 'Kricketune', 'Cinderace'],
  },
  {
    number: 99, name: 'Tree-shaded red tall grass', category: 'Dry',
    requirements: '1 large tree (any), 4 red tall grass',
    pokemon: ['Diglett', 'Dugtrio', 'Bonsly', 'Sudowoodo'],
  },
  {
    number: 100, name: 'Pointy tree-shaded rocky tall grass', category: 'Dry',
    requirements: '1 pointy tree, 4 red tall grass, 1 large boulder',
    pokemon: ['Dartrix', 'Decidueye'],
  },
  {
    number: 101, name: 'Hydrated red tall grass', category: 'Humid',
    requirements: '4 red tall grass, 2 water',
    pokemon: ['Lotad', 'Lombre'],
  },
  {
    number: 102, name: 'Elevated red tall grass', category: 'Dry',
    requirements: '4 red tall grass, 1 high-up location',
    pokemon: [
      { name: 'Chatot', times: DAY_TIMES },
      { name: 'Murkrow', times: NIGHT_TIMES },
      { name: 'Honchkrow', times: NIGHT_TIMES },
    ],
  },
  {
    number: 103, name: 'Grassy training field', category: 'Dry',
    requirements: '2 sandbags, 4 red tall grass',
    pokemon: ['Machoke', 'Machamp'],
  },
  {
    number: 104, name: 'Graceful flower bed', category: 'Cool',
    requirements: '4 mountain flowers',
    pokemon: [
      { name: 'Cleffa', times: NIGHT_TIMES },
      { name: 'Clefairy', times: NIGHT_TIMES },
      { name: 'Clefable', times: NIGHT_TIMES },
      { name: 'Fidough', times: DAY_TIMES },
      { name: 'Daschbun', times: DAY_TIMES },
    ],
  },
  {
    number: 105, name: 'Tree-shaded graceful flower bed', category: 'Cool',
    requirements: '1 pointy tree, 4 mountain flowers',
    pokemon: [
      { name: 'Murkrow', times: NIGHT_TIMES },
      'Larvesta', 'Volcanion',
    ],
  },
  {
    number: 106, name: 'Hydrated graceful flower bed', category: 'Cool',
    requirements: '4 mountain flowers, 2 water',
    pokemon: ['Ekans', 'Arbok', 'Politoed'],
  },
  {
    number: 107, name: 'Flower garden stump stage', category: 'Cool',
    requirements: '4 mountain flowers, 1 tree stump (any), 2 mushroom lamp',
    pokemon: ['Igglybuff', 'Jigglypuff', 'Politoed'],
  },
  {
    number: 108, name: 'Toil in the soil', category: 'Dry',
    requirements: '4 vegetable fields (any), 1 wheelbarrow',
    pokemon: ['Tyranitar'],
  },
  {
    number: 109, name: 'Uplifting duckweed', category: 'Humid',
    requirements: '4 duckweed, 2 water',
    pokemon: ['Lotad', 'Ludicolo'],
  },
  {
    number: 110, name: 'Mossy rest spot', category: 'Cool',
    requirements: '4 moss',
    pokemon: ['Larvitar', 'Tyranitar'],
  },
  {
    number: 111, name: 'Mossy boulder', category: 'Cool',
    requirements: '4 moss, 1 mossy boulder',
    pokemon: ['Graveler', 'Golem'],
  },
  {
    number: 112, name: 'Mossy hot spring', category: 'Humid',
    requirements: '3 moss, 2 hot-spring water',
    pokemon: ['Torkoal'],
  },
  {
    number: 113, name: 'Open-air bath', category: 'Humid',
    requirements: '1 hot-spring spout, 2 hot-spring water',
    pokemon: ['Raboot'],
  },
  {
    number: 114, name: 'Harmonious hot spring', category: 'Humid',
    requirements: '1 hot-spring spout, 1 water basin, 2 hot-spring water',
    pokemon: ['Politoed'],
  },
  {
    number: 115, name: 'Piping-hot lava', category: 'Warm',
    requirements: '1 molten rock, 2 lava',
    pokemon: ['Charcadet', 'Volcarona'],
  },
  {
    number: 116, name: 'Digging and burning', category: 'Warm',
    requirements: '1 wheelbarrow, 1 smelting furnace, 1 excavation tools',
    pokemon: ['Magmar'],
  },
  {
    number: 117, name: 'Clink-clang iron construction', category: 'Warm',
    requirements: '3 iron beams or columns, 1 wheelbarrow, 1 sandbag, 1 excavation tools',
    pokemon: ['Steelix', 'Machamp'],
  },
  {
    number: 118, name: 'Creepy white rocks', category: 'Dark',
    requirements: '1 stalagmites, 4 moss, 1 wooden crate, 1 lantern',
    pokemon: ['Glimmet', 'Glimmora'],
  },
  {
    number: 119, name: 'Container snacking', category: 'Dark',
    requirements: '1 barrel, 1 wooden crate, 1 lantern, 1 plated food',
    pokemon: ['Diglett', 'Glimmet', 'Glimmora'],
  },
  {
    number: 120, name: 'Dinner table surprise', category: 'Bright',
    requirements: '2 seats (wide), 1 table (large), 4 party platters',
    pokemon: ['Swalot'],
  },
  {
    number: 121, name: 'Best bread bakery', category: 'Bright',
    requirements: '1 bread oven, 2 counters, 1 plated food',
    pokemon: [
      { name: 'Fidough', times: DAY_TIMES },
      { name: 'Dachsbun', times: DAY_TIMES },
    ],
  },
  {
    number: 122, name: 'Mini kitchen', category: 'Bright',
    requirements: '1 kitchen table, 1 cooking stove, 1 frying pan (any), 1 modern sink',
    pokemon: ['Magmortar'],
  },
  {
    number: 123, name: 'House party', category: 'Bright',
    requirements: '1 food counter, 1 paper party cups, 1 plated food',
    pokemon: ['Dugtrio', 'Sudowoodo'],
  },
  {
    number: 124, name: 'Lazy photo-album scrolling', category: 'Dry',
    requirements: '1 paper party cups, 1 tablet',
    pokemon: [{ name: 'Toxel', location: 'Rocky Ridges' }],
  },
  {
    number: 125, name: 'Chirping recital', category: 'Bright',
    requirements: '1 perch, 1 standing mic',
    pokemon: [
      { name: 'Chatot', times: DAY_TIMES },
      { name: 'Honchkrow', times: NIGHT_TIMES },
    ],
  },
  {
    number: 126, name: 'Recital stage', category: 'Bright',
    requirements: '2 speakers, 1 powered small stage, 1 standing mic',
    pokemon: ['Wigglytuff'],
  },
  {
    number: 127, name: 'Box to the rhythm', category: 'Bright',
    requirements: '1 punching bag, 1 table (any), 1 CD player',
    pokemon: ['Machop', 'Riolu', 'Lucario'],
  },
  {
    number: 128, name: 'Music and magazines', category: 'Bright',
    requirements: '1 CD player, 1 CD rack, 1 magazine rack',
    pokemon: ['Kricketot', 'Kricketune', 'Rotom'],
  },
  {
    number: 129, name: 'Mini museum', category: 'Bright',
    requirements: '3 posts (any), 1 pedestal/exhibition stand, 1 lost relic (large)',
    pokemon: ['Gimmighoul', 'Arcanine'],
  },
  {
    number: 130, name: 'Refreshing locker room', category: 'Bright',
    requirements: '2 office lockers, 1 potted plant (any), 1 seat (wide), 1 punching game',
    pokemon: ['Raboot', 'Cinderace'],
  },
  {
    number: 131, name: 'Bronze landmark', category: 'Dark',
    requirements: '4 hedges (any), 1 moonlight dance statue, 1 sign',
    pokemon: [
      { name: 'Clefairy', times: NIGHT_TIMES },
      { name: 'Clefable', times: NIGHT_TIMES },
    ],
  },
  {
    number: 132, name: 'Railroad crossing', category: 'Dry',
    requirements: '1 railway track, 1 crossing gate',
    pokemon: ['Rolycoly', 'Carkol', 'Coalossal'],
  },
  {
    number: 133, name: "Chef's kitchen", category: 'Bright',
    requirements: '1 cooking stove, 1 modern sink, 1 plain table, 1 stylish cooking pot, 1 cutting board, 1 plated food',
    pokemon: ['Greedent'],
  },
  {
    number: 134, name: 'Absolute luxury', category: 'Bright',
    requirements: '1 lit luxury lamp, 1 luxury bed, 1 luxury sofa, 1 luxury table',
    pokemon: ['Gholdengo'],
  },
  {
    number: 135, name: 'Heavy iron', category: 'Dry',
    requirements: '1 iron bed, 1 iron table, 1 iron chair, 1 lit lantern',
    pokemon: ['Coalossal'],
  },
  {
    number: 136, name: 'Modern living', category: 'Bright',
    requirements: '1 industrial bed, 1 industrial desk, 1 industrial chair',
    pokemon: ['Decidueye'],
  },
  {
    number: 137, name: 'Pink tall grass', category: 'Cool',
    requirements: '4 pink tall grass',
    pokemon: [
      'Trapinch', 'Vibrava', 'Flygon', 'Swablu',
      { name: 'Duskull', times: NIGHT_TIMES },
    ],
  },
  {
    number: 138, name: 'Tree-shaded pink tall grass', category: 'Cool',
    requirements: '1 large tree (any), 4 pink tall grass',
    pokemon: ['Sprigatito', 'Dreepy', 'Drakloak', 'Pupitar'],
  },
  {
    number: 139, name: 'Hydrated pink tall grass', category: 'Humid',
    requirements: '4 pink tall grass, 2 water',
    pokemon: ['Froakie', 'Frogadier'],
  },
  {
    number: 140, name: 'Elevated pink tall grass', category: 'Cool',
    requirements: '4 pink tall grass, 1 high-up location',
    pokemon: ['Corvisquire', 'Corviknight', 'Wattrel', 'Kilowattrel'],
  },
  {
    number: 141, name: 'Concrete pipe secret base', category: 'Bright',
    requirements: '3 concrete pipes, 4 tall grass (any)',
    pokemon: ['Cyndaquil', 'Quilava'],
  },
  {
    number: 142, name: 'Fluffy flower bed', category: 'Cool',
    requirements: '4 skyland flowers',
    pokemon: [
      'Vulpix', 'Ninetales', 'Rookidee',
      { name: 'Misdreavus', times: NIGHT_TIMES },
    ],
  },
  {
    number: 143, name: 'Tree-shaded fluffy flower bed', category: 'Cool',
    requirements: '1 large tree (any), 4 skyland flowers',
    pokemon: ['Girafarig', 'Farigarif', 'Servine', 'Serperior'],
  },
  {
    number: 144, name: 'Hydrated fluffy flower bed', category: 'Humid',
    requirements: '4 skyland flowers, 2 water',
    pokemon: ['Dratini', 'Dragonair', 'Poliwhirl'],
  },
  {
    number: 145, name: 'Waterside dinghy', category: 'Humid',
    requirements: '1 canoe, 2 duckweed, 2 water, 1 high-up location',
    pokemon: ['Dragonite'],
  },
  {
    number: 146, name: 'Illuminated waterfall', category: 'Humid',
    requirements: '3 stepping stones, 2 lit torches, 3 water, 1 waterfall',
    pokemon: ['Gyarados'],
  },
  {
    number: 147, name: 'Birdsong garden', category: 'Bright',
    requirements: '1 stylish hedge, 1 wooden birdhouse',
    pokemon: ['Altaria'],
  },
  {
    number: 148, name: 'Simple bathroom', category: 'Humid',
    requirements: '1 shower, 1 bathtub',
    pokemon: ['Dratini'],
  },
  {
    number: 149, name: 'Cycling rest stop', category: 'Bright',
    requirements: '1 bike, 1 powered vending machine',
    pokemon: ['Beldum'],
  },
  {
    number: 150, name: 'Fireplace nap spot', category: 'Warm',
    requirements: '1 lit stone fireplace, 1 seat (wide)',
    pokemon: ['Quilava', 'Typhlosion'],
  },
  {
    number: 151, name: 'Surging psychic power', category: 'Bright',
    requirements: '1 simple cushion, 1 crystal ball',
    pokemon: ['Alakazam'],
  },
  {
    number: 152, name: "Fortune-teller's table", category: 'Bright',
    requirements: '2 seats (any), 1 table (any), 1 crystal ball',
    pokemon: ['Abra', 'Kadabra'],
  },
  {
    number: 153, name: 'Trash site TV', category: 'Dark',
    requirements: '2 garbage bags, 1 powered television',
    pokemon: [], // ??? entries only
  },
  {
    number: 154, name: 'Oversized dumping ground', category: 'Dark',
    requirements: '3 iron beams or columns, 1 tires, 1 waste bin (any), 1 microwave oven',
    pokemon: [
      { name: 'Tinkatink', location: 'Palette Town' },
      'Tinkaton',
    ],
  },
  {
    number: 155, name: "Interrogation desk", category: 'Bright',
    requirements: '1 Arcanine doll, 2 folding chairs, 1 industrial desk, 1 lit desk light',
    pokemon: ['Sprigatito', 'Floragato'],
  },
  {
    number: 156, name: 'Sewer-hole inspection', category: 'Dark',
    requirements: '1 iron pipes, 1 sewer-hole cover, 1 excavation tools, 1 traffic cone',
    pokemon: [
      { name: 'Tinkatuff', location: 'Palette Town' },
      'Corviknight', 'Poliwrath',
    ],
  },
  {
    number: 157, name: 'Spotless washing station', category: 'Bright',
    requirements: '1 towel rack, 1 wall mirror, 1 sink',
    pokemon: ['Mime Jr.', 'Mr. Mime'],
  },
  {
    number: 158, name: 'Home theater', category: 'Dark',
    requirements: '2 speakers, 1 stand (any), 1 powered television',
    pokemon: [{ name: 'Mismagius', times: NIGHT_TIMES }],
  },
  {
    number: 159, name: 'Study area', category: 'Bright',
    requirements: '1 bookcase, 1 seat (any), 1 table (any), 1 pencil holder',
    pokemon: ['Ralts', 'Kirlia'],
  },
  {
    number: 160, name: 'Rhythmic living room', category: 'Bright',
    requirements: '2 speakers, 4 music mats (any), 1 powered television',
    pokemon: ['Noibat', 'Noivern'],
  },
  {
    number: 161, name: 'Squeaky clean', category: 'Bright',
    requirements: '1 bathtub, 1 cleaning supplies',
    pokemon: [], // ??? only
  },
  {
    number: 162, name: 'Moisturizing makeup stand', category: 'Bright',
    requirements: '1 dresser (any), 1 seat (any), 1 humidifier',
    pokemon: ['Kirlia', 'Gardevoir'],
  },
  {
    number: 163, name: 'Mini library', category: 'Bright',
    requirements: '2 bookcases, 1 step stool, 1 table (any), 1 powered lighting (any)',
    pokemon: ['Gardevoir'],
  },
  {
    number: 164, name: 'Game Corner battle zone', category: 'Bright',
    requirements: '2 powered arcade machines, 2 seats (any)',
    pokemon: ['Porygon-Z'],
  },
  {
    number: 165, name: 'Playland', category: 'Cool',
    requirements: '1 slide, 1 toy (any)',
    pokemon: [{ name: 'Snivy', location: 'Sparkling Skylands' }],
  },
  {
    number: 166, name: 'Work desk', category: 'Bright',
    requirements: '1 office desk, 1 laptop, 1 mug, 1 office chair',
    pokemon: ['Porygon2'],
  },
  {
    number: 167, name: 'Office storeroom', category: 'Dark',
    requirements: '1 office shelf, 1 step stool, 1 cardboard boxes',
    pokemon: [
      { name: 'Misdreavus', times: NIGHT_TIMES },
      { name: 'Mismagius', times: NIGHT_TIMES },
      'Drakloak', 'Dragapult',
    ],
  },
  {
    number: 168, name: 'Experiment space', category: 'Bright',
    requirements: '1 science experiment, 1 microscope, 1 papers',
    pokemon: ['Alakazam'],
  },
  {
    number: 169, name: "Professor's apprentice program", category: 'Bright',
    requirements: '1 whiteboard, 1 table (any), 1 jumbled cords, 1 laptop',
    pokemon: ['Metang'],
  },
  {
    number: 170, name: "Researcher's desk", category: 'Bright',
    requirements: '2 tables (any), 1 powered computer, 1 science experiment',
    pokemon: ['Porygon'],
  },
  {
    number: 171, name: 'Public reading material', category: 'Bright',
    requirements: '1 magazine rack, 1 newspaper',
    pokemon: ['Mime Jr.', 'Serperior'],
  },
  {
    number: 172, name: 'Heart-pounding surprise box', category: 'Dark',
    requirements: '2 lit spotlights, 1 big drum, 1 boo-in-the-box',
    pokemon: [], // ??? only
  },
  {
    number: 173, name: 'Prank button', category: 'Dark',
    requirements: '1 floor switch, 1 boo-in-the-box',
    pokemon: ['Frogadier'],
  },
  {
    number: 174, name: 'Picturesque photo cutout board', category: 'Bright',
    requirements: '1 photo cutout board, 2 powered spotlights, 1 high-up location',
    pokemon: ['Plusle', 'Minun'],
  },
  {
    number: 175, name: 'Tire park', category: 'Cool',
    requirements: '1 slide, 1 tires, 2 tire toys',
    pokemon: [{ name: 'Dedenne', location: 'Sparkling Skylands' }],
  },
  {
    number: 176, name: "Nature's market", category: 'Bright',
    requirements: '1 large tree (any), 1 large boulder, 2 tables (any), 1 powered cash register',
    pokemon: ['Raichu'],
  },
  {
    number: 177, name: 'Construction-site generator', category: 'Warm',
    requirements: '1 furnace, 2 iron scaffold, 1 iron pipes',
    pokemon: ['Conkeldurr'],
  },
  {
    number: 178, name: 'Dojo training', category: 'Bright',
    requirements: '2 hanging scrolls, 2 strength rocks',
    pokemon: ['Poliwrath'],
  },
  {
    number: 179, name: 'Evil organization HQ', category: 'Dark',
    requirements: '2 potted plants (any), 1 Team Rocket wall hanging, 1 luxury sofa',
    pokemon: ['Persian'],
  },
  {
    number: 180, name: 'Nine flames', category: 'Warm',
    requirements: '9 lit firepits',
    pokemon: ['Ninetales'],
  },
  {
    number: 181, name: 'Plush central', category: 'Bright',
    requirements: '1 Arcanine doll, 1 Pikachu doll, 1 Dragonite doll, 1 Eevee doll',
    pokemon: ['Drifloon', 'Drifblim'],
  },
  {
    number: 182, name: "Gamer's paradise", category: 'Bright',
    requirements: '1 gaming bed, 1 gaming PC, 1 gaming chair, 1 table (any), 1 gaming fridge',
    pokemon: ['Metagross'],
  },
  {
    number: 183, name: 'Top pop', category: 'Warm',
    requirements: '1 pop art bed, 1 pop art sofa, 1 pop art table',
    pokemon: ['Typhlosion'],
  },
  {
    number: 184, name: 'Fishing pond', category: 'Humid',
    requirements: '1 fishing rod, 1 seat (any), 1 water',
    pokemon: ['Slowbro', 'Slowking'],
  },
  {
    number: 185, name: 'Ocean fishing spot', category: 'Humid',
    requirements: '1 fishing rod, 1 seat (any), 1 ocean water',
    pokemon: ['Magikarp', 'Gastrodon'],
  },
  {
    number: 186, name: 'Marsh fishing spot', category: 'Humid',
    requirements: '1 fishing rod, 1 seat (any), 1 muddy water',
    pokemon: ['Grimer', 'Muk', 'Clodsire'],
  },
  {
    number: 187, name: 'Hot-spring fishing spot', category: 'Humid',
    requirements: '1 fishing rod, 1 seat (any), 1 hot-spring water',
    pokemon: ['Lotad', 'Lombre'],
  },
  {
    number: 188, name: 'Magma fishing spot', category: 'Warm',
    requirements: '1 fishing rod, 1 seat (any), 1 lava',
    pokemon: ['Arcanine'],
  },
  {
    number: 189, name: 'Amped rock stage', category: 'Bright',
    requirements: '2 speakers, 1 powered small stage, 1 cool electric guitar, 1 standing mic',
    pokemon: ['Toxtricity (Amped form)'],
  },
  {
    number: 190, name: 'Low-key rock stage', category: 'Bright',
    requirements: '2 speakers, 1 powered small stage, 1 cool bass guitar, 1 standing mic',
    pokemon: ['Toxtricity (Low Key form)'],
  },
  {
    number: 191, name: "Malicious knight's shrine", category: 'Warm',
    requirements: '1 pedestal/exhibition stand, 1 Malicious Armor, 2 stepping stones, 2 lit firepits',
    pokemon: ['Ceruledge'],
  },
  {
    number: 192, name: "Auspicious knight's shrine", category: 'Warm',
    requirements: '1 pedestal/exhibition stand, 1 Auspicious Armor, 2 stepping stones, 2 lit firepits',
    pokemon: ['Armarogue'],
  },
  {
    number: 193, name: 'Wing Fossil display', category: 'Bright',
    requirements: '1 pedestal/exhibition stand, 1 Wing Fossil (head), 1 Wing Fossil (right wing), 1 Wing Fossil (left wing), 1 Wing Fossil (body), 1 Wing Fossil (tail)',
    pokemon: ['Aerodactyl'],
  },
  {
    number: 194, name: 'Skull Fossil display', category: 'Bright',
    requirements: '1 pedestal/exhibition stand, 1 Skull Fossil',
    pokemon: ['Cranidos'],
  },
  {
    number: 195, name: 'Headbutt Fossil display', category: 'Bright',
    requirements: '1 pedestal/exhibition stand, 1 Headbutt Fossil (head), 1 Headbutt Fossil (body), 1 Headbutt Fossil (tail)',
    pokemon: ['Rampardos'],
  },
  {
    number: 196, name: 'Armor Fossil display', category: 'Bright',
    requirements: '1 pedestal/exhibition stand, 1 Armor Fossil',
    pokemon: ['Shieldon'],
  },
  {
    number: 197, name: 'Shield Fossil display', category: 'Bright',
    requirements: '2 pedestal/exhibition stands, 1 Shield Fossil (head), 1 Shield Fossil (body), 1 Shield Fossil (tail)',
    pokemon: ['Bastiodon'],
  },
  {
    number: 198, name: 'Jaw Fossil display', category: 'Bright',
    requirements: '1 pedestal/exhibition stand, 1 Jaw Fossil',
    pokemon: ['Tyrunt'],
  },
  {
    number: 199, name: 'Despot Fossil display', category: 'Bright',
    requirements: '2 pedestal/exhibition stands, 1 Despot Fossil (head), 1 Despot Fossil (body), 1 Despot Fossil (legs), 1 Despot Fossil (tail)',
    pokemon: ['Tyrantrum'],
  },
  {
    number: 200, name: 'Sail Fossil display', category: 'Cool',
    requirements: '1 pedestal/exhibition stand, 1 Sail Fossil',
    pokemon: ['Amaura'],
  },
  {
    number: 201, name: 'Tundra Fossil display', category: 'Cool',
    requirements: '2 pedestal/exhibition stands, 1 Tundra Fossil (head), 1 Tundra Fossil (body), 1 Tundra Fossil (tail)',
    pokemon: ['Aurorus'],
  },
  {
    number: 202, name: 'Boundless beverage', category: 'Bright',
    requirements: '1 seat (any), 1 table (any), 1 soda float',
    pokemon: [{ name: 'Vaporeon', location: 'Palette Town' }],
  },
  {
    number: 203, name: 'Electrifying potatoes', category: 'Bright',
    requirements: '1 seat (any), 1 table (any), 1 fried potatoes',
    pokemon: [{ name: 'Jolteon', location: 'Palette Town' }],
  },
  {
    number: 204, name: 'Burning-hot spice', category: 'Warm',
    requirements: '1 seat (any), 1 table (any), 1 pizza',
    pokemon: [{ name: 'Flareon', location: 'Palette Town' }],
  },
  {
    number: 205, name: 'Elegant daytime treats', category: 'Bright',
    requirements: '1 seat (any), 1 table (any), 1 afternoon tea set',
    pokemon: [{ name: 'Espeon', times: DAY_TIMES, location: 'Palette Town' }],
  },
  {
    number: 206, name: 'Dark-chocolate cookies', category: 'Dark',
    requirements: '1 seat (any), 1 table (any), 1 chocolate cookies',
    pokemon: [{ name: 'Umbreon', times: NIGHT_TIMES, location: 'Palette Town' }],
  },
  {
    number: 207, name: 'Leafy greens sandwich', category: 'Bright',
    requirements: '1 seat (any), 1 table (any), 1 sandwiches',
    pokemon: [{ name: 'Leafeon', location: 'Palette Town' }],
  },
  {
    number: 208, name: 'Chilly shaved ice', category: 'Cool',
    requirements: '1 seat (any), 1 table (any), 1 shaved ice',
    pokemon: [{ name: 'Glaceon', location: 'Palette Town' }],
  },
  {
    number: 209, name: 'Lovely ribbon cake', category: 'Bright',
    requirements: '1 seat (any), 1 table (any), 1 ribbon cake',
    pokemon: [{ name: 'Sylveon', location: 'Palette Town' }],
  },
];

// ---------------------------------------------------------------------------
// Build per-Pokémon aggregated habitat data
// ---------------------------------------------------------------------------

const pokemonData = {}; // normalized name → { habitats[], items Set, timesSet, weatherSet }

for (const habitat of HABITATS) {
  const reqParts = habitat.requirements.split(',').map(r => r.trim());

  for (const rawEntry of habitat.pokemon) {
    const isString = typeof rawEntry === 'string';
    const rawName = isString ? rawEntry : rawEntry.name;
    const dbName = normalizeName(rawName);
    if (!dbName) continue;

    if (!pokemonData[dbName]) {
      pokemonData[dbName] = {
        habitats: [],
        itemsSet: new Set(),
        timesSet: new Set(),
        weatherSet: new Set(),
      };
    }

    const d = pokemonData[dbName];

    // Avoid duplicate habitat listings (some Pokémon appear in multiple habitats)
    if (!d.habitats.includes(habitat.name)) {
      d.habitats.push(habitat.name);
    }

    // Aggregate items
    for (const item of reqParts) d.itemsSet.add(item);

    // Times — union across all habitats
    const times = isString ? ALL_TIMES : (rawEntry.times || ALL_TIMES);
    for (const t of times) d.timesSet.add(t);

    // Weather — union across all habitats
    const weather = isString ? ALL_WEATHER : (rawEntry.weather || ALL_WEATHER);
    for (const w of weather) d.weatherSet.add(w);
  }
}

// ---------------------------------------------------------------------------
// Update pokemon.json
// ---------------------------------------------------------------------------

const pokemonPath = path.join(SRC, 'pokemon.json');
const pokemonJson = JSON.parse(fs.readFileSync(pokemonPath, 'utf8'));

const TIME_ORDER = ['Morning', 'Day', 'Evening', 'Night'];
const WEATHER_ORDER = ['Sunny', 'Cloudy', 'Rainy'];

let updatedCount = 0;
for (const p of pokemonJson) {
  const d = pokemonData[p.name];
  if (!d) continue;

  p.habitats = d.habitats;
  p.habitatItems = [...d.itemsSet];
  p.times = TIME_ORDER.filter(t => d.timesSet.has(t));
  p.weather = WEATHER_ORDER.filter(w => d.weatherSet.has(w));
  updatedCount++;
}

fs.writeFileSync(pokemonPath, JSON.stringify(pokemonJson, null, 2), 'utf8');
console.log(`Updated ${updatedCount} Pokémon in pokemon.json`);

// ---------------------------------------------------------------------------
// Generate habitats.json
// ---------------------------------------------------------------------------

// Build a DB-name lookup for fast checking
const dbNames = new Set(pokemonJson.map(p => p.name));

const habitatsJson = HABITATS.map(h => {
  const pokemonNames = h.pokemon
    .map(entry => {
      const rawName = typeof entry === 'string' ? entry : entry.name;
      const dbName = normalizeName(rawName);
      return dbName && dbNames.has(dbName) ? dbName : null;
    })
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i); // deduplicate

  return {
    number: h.number,
    name: h.name,
    category: h.category,
    requirements: h.requirements.split(',').map(r => r.trim()),
    pokemon: pokemonNames,
  };
});

const habitatsPath = path.join(SRC, 'habitats.json');
fs.writeFileSync(habitatsPath, JSON.stringify(habitatsJson, null, 2), 'utf8');
console.log(`Generated habitats.json with ${habitatsJson.length} habitats`);
console.log('Done!');
