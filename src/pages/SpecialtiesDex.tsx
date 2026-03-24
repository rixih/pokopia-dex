import { useMemo, useState } from 'react';
import type { Pokemon } from '../types/pokemon';
import pokemonData from '../data/pokemon.json';
import eventData from '../data/events.json';
import { SPECIALTIES } from '../data/specialties';
import { SpecialtyModal, SPECIALTY_COLORS, DEFAULT_SPECIALTY_COLORS } from '../components/SpecialtyModal';
import { PokemonModal } from '../components/PokemonModal';
import { useTracker } from '../hooks/useTracker';

const ALL_POKEMON: Pokemon[] = [
  ...(pokemonData as Pokemon[]),
  ...(eventData as Pokemon[]),
];

export function SpecialtiesDex() {
  const [search, setSearch] = useState('');
  const [modalSpecialty, setModalSpecialty] = useState<string | null>(null);
  const [detailPokemon, setDetailPokemon] = useState<Pokemon | null>(null);
  const { found, toggle } = useTracker(false);
  const { found: eventFound, toggle: toggleEvent } = useTracker(true);

  const allFoundSet = useMemo(() => new Set([...found, ...eventFound]), [found, eventFound]);

  // Build specialty → Pokémon list map
  const specialtyPokemonMap = useMemo(() => {
    const map = new Map<string, Pokemon[]>();
    for (const p of ALL_POKEMON) {
      for (const s of p.specialties ?? []) {
        if (!map.has(s)) map.set(s, []);
        map.get(s)!.push(p);
      }
    }
    return map;
  }, []);

  const lowerSearch = search.toLowerCase();

  const filteredSpecialties = useMemo(() =>
    SPECIALTIES.filter((s) =>
      s.name.toLowerCase().includes(lowerSearch) ||
      s.description.toLowerCase().includes(lowerSearch)
    ),
    [lowerSearch]
  );

  const modalPokemonList = useMemo(
    () => modalSpecialty ? (specialtyPokemonMap.get(modalSpecialty) ?? []) : [],
    [modalSpecialty, specialtyPokemonMap]
  );

  const isEventPokemon = (p: Pokemon) =>
    (eventData as Pokemon[]).some((e) => e.number === p.number && e.name === p.name);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-white">Specialties</h2>
        <p className="text-sm text-gray-400 mt-1">
          All {SPECIALTIES.length} specialties in Pokémon Pokopia — what each does and which Pokémon perform it.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔎</span>
        <input
          type="text"
          placeholder="Search specialties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700/50 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 backdrop-blur-sm transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Specialty cards grid */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Specialties — {filteredSpecialties.length}
        </h3>
        {filteredSpecialties.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No specialties match your search.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredSpecialties.map((s) => {
              const colors = SPECIALTY_COLORS[s.name] ?? DEFAULT_SPECIALTY_COLORS;
              const count = specialtyPokemonMap.get(s.name)?.length ?? 0;
              return (
                <button
                  key={s.name}
                  onClick={() => setModalSpecialty(s.name)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm text-center
                    ${colors.card} hover:shadow-md`}
                >
                  <span className="text-3xl">{s.icon}</span>
                  <span className="text-xs font-semibold text-gray-100 leading-tight">{s.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-900/50 border border-gray-700/40 rounded-full px-2 py-0.5 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Specialty modal */}
      {modalSpecialty && (
        <SpecialtyModal
          specialtyName={modalSpecialty}
          pokemonList={modalPokemonList}
          foundSet={allFoundSet}
          onPokemonClick={(p) => {
            setModalSpecialty(null);
            setDetailPokemon(p);
          }}
          onClose={() => setModalSpecialty(null)}
        />
      )}

      {/* Pokémon detail modal */}
      {detailPokemon && (
        <PokemonModal
          pokemon={detailPokemon}
          isFound={allFoundSet.has(detailPokemon.number)}
          onToggleFound={(num) => {
            if (isEventPokemon(detailPokemon)) toggleEvent(num);
            else toggle(num);
          }}
          onClose={() => setDetailPokemon(null)}
          foundSet={allFoundSet}
        />
      )}
    </div>
  );
}
