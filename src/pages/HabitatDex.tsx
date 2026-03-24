import { useState, useMemo } from 'react';
import habitatsData from '../data/habitats.json';
import pokemonData from '../data/pokemon.json';
import eventData from '../data/events.json';
import type { Pokemon } from '../types/pokemon';
import { HabitatCard } from '../components/HabitatCard';
import { HabitatDetailModal, type HabitatEntry } from '../components/HabitatDetailModal';
import { PokemonModal } from '../components/PokemonModal';
import { useTracker } from '../hooks/useTracker';

const ALL_HABITATS = habitatsData as HabitatEntry[];
const ALL_CATEGORIES = ['All', 'Bright', 'Warm', 'Humid', 'Cool', 'Dry', 'Dark'];

const CATEGORY_ICONS: Record<string, string> = {
  All: '🌍', Bright: '☀️', Warm: '🔥', Humid: '💧', Cool: '❄️', Dry: '🏜️', Dark: '🌙',
};

export function HabitatDex() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedHabitat, setSelectedHabitat] = useState<HabitatEntry | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const { found, toggle } = useTracker(false);
  const { found: foundEvent, toggle: toggleEvent } = useTracker(true);

  // Combined found set for display (covers both main + event Pokémon)
  const combinedFound = useMemo(() => new Set([...found, ...foundEvent]), [found, foundEvent]);

  const allPokemonMap = useMemo(() => {
    const m = new Map<string, Pokemon>();
    (pokemonData as Pokemon[]).forEach((p) => m.set(p.name, p));
    (eventData as Pokemon[]).forEach((p) => m.set(p.name, p));
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_HABITATS.filter((h) => {
      const matchesCategory = activeCategory === 'All' || h.category === activeCategory;
      const matchesSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.requirements.some((r) => r.toLowerCase().includes(q)) ||
        h.pokemon.some((p) => p.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  function handlePokemonClick(name: string) {
    const p = allPokemonMap.get(name);
    if (p) setSelectedPokemon(p);
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Habitat Dex</h2>
        <p className="text-sm text-gray-400 mt-1">
          All {ALL_HABITATS.length} habitats in Pokémon Pokopia — what to build, and which Pokémon each attracts.
        </p>
      </div>

      {/* Search + category filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search habitats, items, or Pokémon…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
              activeCategory === cat
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-900/50'
                : 'bg-gray-800/60 border-gray-700/50 text-gray-400 hover:text-gray-200 hover:border-gray-600'
            }`}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500 mb-4">
        Showing {filtered.length} of {ALL_HABITATS.length} habitats
      </p>

      {/* Habitat grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-semibold text-gray-400">No habitats found</p>
          <p className="text-sm mt-1">Try a different search or category filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((h) => (
            <HabitatCard
              key={h.number}
              number={h.number}
              name={h.name}
              category={h.category}
              requirements={h.requirements}
              pokemon={h.pokemon}
              imageUrl={(h as { imageUrl?: string }).imageUrl}
              onClick={() => setSelectedHabitat(h)}
            />
          ))}
        </div>
      )}

      {/* Habitat detail modal */}
      {selectedHabitat && (
        <HabitatDetailModal
          habitat={selectedHabitat}
          pokemonMap={allPokemonMap}
          foundSet={combinedFound}
          onPokemonClick={handlePokemonClick}
          onClose={() => setSelectedHabitat(null)}
        />
      )}

      {/* Pokémon detail modal (stacks on top of habitat modal) */}
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          isFound={combinedFound.has(selectedPokemon.number)}
          onToggleFound={(num) => {
            // Route toggle to the correct tracker based on Pokémon number prefix
            if (num.startsWith('E')) toggleEvent(num);
            else toggle(num);
          }}
          onClose={() => setSelectedPokemon(null)}
          foundSet={combinedFound}
          onNavigateToPokemon={(name) => {
            const p = allPokemonMap.get(name);
            if (p) setSelectedPokemon(p);
          }}
        />
      )}
    </div>
  );
}
