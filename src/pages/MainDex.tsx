import { useState, useMemo } from 'react';
import type { FilterState, Pokemon } from '../types/pokemon';
import pokemonData from '../data/pokemon.json';
import { FilterBar } from '../components/FilterBar';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonModal } from '../components/PokemonModal';
import { ProgressTracker } from '../components/ProgressTracker';
import { useTracker } from '../hooks/useTracker';

const EMPTY_FILTERS: FilterState = {
  search: '',
  types: [],
  rarity: '',
  idealHabitat: '',
  times: [],
  weather: [],
  specialties: [],
};

function hasActiveFilters(f: FilterState) {
  return (
    f.search !== '' ||
    f.types.length > 0 ||
    f.rarity !== '' ||
    f.idealHabitat !== '' ||
    f.times.length > 0 ||
    f.weather.length > 0 ||
    f.specialties.length > 0
  );
}

function applyFilters(list: Pokemon[], f: FilterState): Pokemon[] {
  return list.filter((p) => {
    if (f.search && !p.name.toLowerCase().includes(f.search.toLowerCase())) return false;
    if (f.types.length > 0 && !f.types.some((t) => p.types.includes(t))) return false;
    if (f.rarity && p.rarity !== f.rarity) return false;
    if (f.idealHabitat && p.idealHabitat !== f.idealHabitat) return false;
    if (f.times.length > 0 && !f.times.some((t) => p.times.includes(t))) return false;
    if (f.weather.length > 0 && !f.weather.some((w) => p.weather.includes(w))) return false;
    if (f.specialties.length > 0 && !f.specialties.some((s) => p.specialties.includes(s))) return false;
    return true;
  });
}

export function MainDex() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { found, toggle, isFound, count } = useTracker(false);

  const allPokemon = pokemonData as Pokemon[];
  const filtered = useMemo(() => applyFilters(allPokemon, filters), [filters, allPokemon]);
  const active = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-4">
        <ProgressTracker found={count} total={allPokemon.length} label="Pokémon found" />
      </div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/60 rounded-xl border border-gray-700/50 text-sm text-gray-300"
        >
          <span className="flex items-center gap-2">
            <span>🔽</span>
            Filters
            {active && (
              <span className="ml-1 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                Active
              </span>
            )}
          </span>
          <span className="text-gray-500">{sidebarOpen ? '▲' : '▼'}</span>
        </button>
        {sidebarOpen && (
          <div className="mt-2 bg-gray-900/80 rounded-2xl border border-gray-700/50 p-4">
            <FilterBar
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(EMPTY_FILTERS)}
              hasActiveFilters={active}
            />
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6 bg-gray-900/80 rounded-2xl border border-gray-700/50 p-4">
            <FilterBar
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(EMPTY_FILTERS)}
              hasActiveFilters={active}
            />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <p className="text-sm text-gray-400 mr-auto">
              Showing <span className="text-white font-semibold">{filtered.length}</span> of {allPokemon.length} Pokémon
            </p>
            {filters.rarity && (
              <span className="flex items-center gap-1 text-xs bg-gray-800 border border-gray-600 text-gray-300 px-2 py-1 rounded-full">
                {filters.rarity}
                <button onClick={() => setFilters({ ...filters, rarity: '' })} className="text-gray-500 hover:text-white ml-1">✕</button>
              </span>
            )}
            {filters.idealHabitat && (
              <span className="flex items-center gap-1 text-xs bg-gray-800 border border-gray-600 text-gray-300 px-2 py-1 rounded-full">
                {filters.idealHabitat}
                <button onClick={() => setFilters({ ...filters, idealHabitat: '' })} className="text-gray-500 hover:text-white ml-1">✕</button>
              </span>
            )}
            {filters.types.map((t) => (
              <span key={t} className="flex items-center gap-1 text-xs bg-gray-800 border border-gray-600 text-gray-300 px-2 py-1 rounded-full">
                {t}
                <button onClick={() => setFilters({ ...filters, types: filters.types.filter((x) => x !== t) })} className="text-gray-500 hover:text-white ml-1">✕</button>
              </span>
            ))}
            {filters.specialties.map((s) => (
              <span key={s} className="flex items-center gap-1 text-xs bg-gray-800 border border-gray-600 text-gray-300 px-2 py-1 rounded-full">
                {s}
                <button onClick={() => setFilters({ ...filters, specialties: filters.specialties.filter((x) => x !== s) })} className="text-gray-500 hover:text-white ml-1">✕</button>
              </span>
            ))}
            {active && (
              <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs text-red-400 hover:text-red-300">
                Clear all
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
              <span className="text-4xl">🔍</span>
              <p className="text-lg font-medium">No Pokémon match your filters</p>
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((p) => (
                <PokemonCard
                  key={p.number}
                  pokemon={p}
                  isFound={isFound(p.number)}
                  onToggleFound={toggle}
                  onClick={() => setSelectedPokemon(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          isFound={isFound(selectedPokemon.number)}
          onToggleFound={toggle}
          onClose={() => setSelectedPokemon(null)}
          foundSet={found}
          onNavigateToPokemon={(name) => {
            const p = allPokemon.find((x) => x.name === name);
            if (p) setSelectedPokemon(p);
          }}
        />
      )}
    </div>
  );
}
