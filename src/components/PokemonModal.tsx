import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Pokemon } from '../types/pokemon';
import { TypeBadge, TYPE_CARD_STYLES } from './TypeBadge';
import { HabitatBadge, HABITAT_STYLES, HABITAT_SCENES } from './HabitatBadge';
import habitatsData from '../data/habitats.json';
import pokemonData from '../data/pokemon.json';
import eventData from '../data/events.json';
import { getSpriteUrl, formatNameForDb } from '../utils/sprite';
import { HabitatDetailModal } from './HabitatDetailModal';
import type { HabitatEntry } from './HabitatDetailModal';
import { SpecialtyModal } from './SpecialtyModal';

const HABITATS_MAP = new Map<string, HabitatEntry>(
  (habitatsData as HabitatEntry[]).map((h) => [h.name, h])
);

const TIME_ICONS: Record<string, string> = {
  Morning: '🌅', Day: '🌤️', Evening: '🌆', Night: '🌙',
};
const TIME_COLORS: Record<string, string> = {
  Morning: 'bg-orange-900/50 border-orange-700/50 text-orange-300',
  Day:     'bg-yellow-900/50 border-yellow-700/50 text-yellow-300',
  Evening: 'bg-purple-900/50 border-purple-700/50 text-purple-300',
  Night:   'bg-indigo-900/50 border-indigo-700/50 text-indigo-300',
};
const WEATHER_ICONS: Record<string, string> = {
  Sunny: '☀️', Cloudy: '☁️', Rainy: '🌧️',
};
const WEATHER_COLORS: Record<string, string> = {
  Sunny:  'bg-amber-900/50 border-amber-700/50 text-amber-300',
  Cloudy: 'bg-slate-800/60 border-slate-600/50 text-slate-300',
  Rainy:  'bg-blue-900/50 border-blue-700/50 text-blue-300',
};
const SPECIALTY_COLORS: Record<string, string> = {
  Grow:        'bg-green-900/50 border-green-700/50 text-green-300',
  Burn:        'bg-orange-900/50 border-orange-700/50 text-orange-300',
  Water:       'bg-blue-900/50 border-blue-700/50 text-blue-300',
  Fly:         'bg-sky-900/50 border-sky-700/50 text-sky-300',
  Build:       'bg-stone-800/60 border-stone-600/50 text-stone-300',
  Bulldoze:    'bg-yellow-900/50 border-yellow-700/50 text-yellow-300',
  Chop:        'bg-lime-900/50 border-lime-700/50 text-lime-300',
  Crush:       'bg-red-900/50 border-red-700/50 text-red-300',
  Generate:    'bg-yellow-900/50 border-yellow-700/50 text-yellow-300',
  Search:      'bg-indigo-900/50 border-indigo-700/50 text-indigo-300',
  Recycle:     'bg-teal-900/50 border-teal-700/50 text-teal-300',
  Trade:       'bg-violet-900/50 border-violet-700/50 text-violet-300',
  Litter:      'bg-amber-900/50 border-amber-700/50 text-amber-300',
  Hype:        'bg-pink-900/50 border-pink-700/50 text-pink-300',
  Teleport:    'bg-purple-900/50 border-purple-700/50 text-purple-300',
  Storage:     'bg-slate-800/60 border-slate-600/50 text-slate-300',
  Illuminate:  'bg-yellow-900/50 border-yellow-700/50 text-yellow-200',
  Explode:     'bg-red-900/50 border-red-700/50 text-red-300',
  Appraise:    'bg-emerald-900/50 border-emerald-700/50 text-emerald-300',
  Transform:   'bg-fuchsia-900/50 border-fuchsia-700/50 text-fuchsia-300',
  Yawn:        'bg-slate-800/60 border-slate-600/50 text-slate-300',
  'Gather Honey': 'bg-amber-900/50 border-amber-700/50 text-amber-300',
  Gather:      'bg-teal-900/50 border-teal-700/50 text-teal-300',
  'Dream Island': 'bg-violet-900/50 border-violet-700/50 text-violet-200',
  Paint:       'bg-rose-900/50 border-rose-700/50 text-rose-300',
  Collect:     'bg-yellow-900/50 border-yellow-700/50 text-yellow-200',
  Engineer:    'bg-cyan-900/50 border-cyan-700/50 text-cyan-300',
  Rarify:      'bg-purple-900/50 border-purple-700/50 text-purple-200',
  Party:       'bg-pink-900/50 border-pink-700/50 text-pink-200',
};

const FAVORITE_ICONS: Record<string, string> = {
  // Legacy (pre-spreadsheet) labels
  'Sweet flavors': '🍬', 'Spicy flavors': '🌶️', 'Sour flavors': '🍋', 'Dry flavors': '🌾',
  'Lots of nature': '🌿', 'Lots of water': '🌊', 'Lots of fire': '🔥',
  'Colorful stuff': '🎨',
  // Spreadsheet labels
  'Nature': '🌿', 'Water': '🌊', 'Fire': '🔥', 'Dirt': '🟤',
  'Soft stuff': '🧸', 'Cute stuff': '🌸', 'Nice breezes': '💨', 'Nice Breezes': '💨',
  'Pretty flowers': '🌺', 'Exercise': '💪', 'Group activities': '👥',
  'Wooden stuff': '🪵', 'Hard stuff': '🪨', 'Stone stuff': '🪨', 'Rides': '🎠',
  'Luxury': '✨', 'Healing': '💊', 'Cleanliness': '🧹', 'Watching stuff': '👀',
  'Play spaces': '🎪', 'Colourful stuff': '🎨', 'Wobbly stuff': '🫧', 'Spinning stuff': '🌀',
  'Round stuff': '⚪', 'Electronics': '⚡', 'Metal stuff': '🔩', 'Shiny stuff': '💎',
  'Sharp stuff': '🗡️', 'Garbage': '🗑️', 'Noisy stuff': '📢', 'Strange stuff': '🔮',
  'Containers': '📦', 'Complicated stuff': '🧩', 'Slender objects': '📏',
  'Glass stuff': '🪟', 'Fabric': '🧵', 'Symbols': '🔣', 'Letters/words': '📝',
  'Ocean vibes': '🌊', 'Blocky stuff': '🧱', 'Gatherings': '🎉', 'Spooky stuff': '💀',
  'Looks like food': '🍖', 'Construction': '🔨', 'Watches stuff': '👀',
  'Soft stuff ': '🧸',  // trailing-space variant
};

const FLAVOR_STYLE: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  Sweet:   { bg: 'bg-pink-900/40',   text: 'text-pink-200',   border: 'border-pink-700/40',   icon: '🍬' },
  Spicy:   { bg: 'bg-red-900/40',    text: 'text-red-200',    border: 'border-red-700/40',    icon: '🌶️' },
  Sour:    { bg: 'bg-yellow-900/40', text: 'text-yellow-200', border: 'border-yellow-700/40', icon: '🍋' },
  Bitter:  { bg: 'bg-green-900/40',  text: 'text-green-200',  border: 'border-green-700/40',  icon: '🌿' },
  Dry:     { bg: 'bg-stone-800/40',  text: 'text-stone-200',  border: 'border-stone-600/40',  icon: '🌾' },
  Neutral: { bg: 'bg-gray-800/40',   text: 'text-gray-300',   border: 'border-gray-600/40',   icon: '⚪' },
};


const RARITY_BADGE: Record<string, string> = {
  Common:     'bg-gray-700/60 border-gray-600/50 text-gray-400',
  Rare:       'bg-blue-900/60 border-blue-700/50 text-blue-300',
  'Very Rare':'bg-violet-900/60 border-violet-700/50 text-violet-300',
  Legendary:  'bg-yellow-900/60 border-yellow-700/50 text-yellow-300',
};

interface PokemonModalProps {
  pokemon: Pokemon & { areasFound?: string };
  isFound: boolean;
  onToggleFound: (number: string) => void;
  onClose: () => void;
  foundSet?: Set<string>;
  onNavigateToPokemon?: (name: string) => void;
}

export function PokemonModal({ pokemon, isFound, onToggleFound, onClose, foundSet, onNavigateToPokemon }: PokemonModalProps) {
  const [spriteSrc, setSpriteSrc] = useState(getSpriteUrl(pokemon));
  const [spriteErrored, setSpriteErrored] = useState(false);
  const [selectedHabitat, setSelectedHabitat] = useState<HabitatEntry | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const allPokemon = useMemo(() => [
    ...(pokemonData as Pokemon[]),
    ...(eventData as Pokemon[]),
  ], []);

  const pokemonMap = useMemo(() => {
    const m = new Map<string, Pokemon>();
    allPokemon.forEach((p) => m.set(p.name, p));
    return m;
  }, [allPokemon]);

  const specialtyPokemonMap = useMemo(() => {
    const map = new Map<string, Pokemon[]>();
    for (const p of allPokemon) {
      for (const s of p.specialties ?? []) {
        if (!map.has(s)) map.set(s, []);
        map.get(s)!.push(p);
      }
    }
    return map;
  }, [allPokemon]);

  useEffect(() => {
    setSpriteSrc(getSpriteUrl(pokemon));
    setSpriteErrored(false);
  }, [pokemon.number]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const typeStyle = TYPE_CARD_STYLES[pokemon.types[0]];
  const type2Style = pokemon.types[1] ? TYPE_CARD_STYLES[pokemon.types[1]] : null;
  const headerBg = type2Style
    ? { background: `linear-gradient(135deg, rgba(${typeStyle.bgRaw},0.5) 0%, rgba(${typeStyle.bgRaw},0.5) 55%, rgba(${type2Style.bgRaw},0.5) 100%)` }
    : undefined;

  return createPortal(
    <>
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center pb-4 sm:pb-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-2xl max-h-[82dvh] sm:max-h-[90vh] overflow-hidden rounded-2xl bg-gray-900 shadow-2xl border ${typeStyle.cardBorder} flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only, pinned outside scroll area */}
        <div className="flex-shrink-0 flex justify-center pt-2 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-600/70" />
        </div>

        {/* Header banner — pinned, never scrolls */}
        <div
          className={`flex-shrink-0 relative flex flex-row items-center gap-3 p-4 sm:p-6 ${typeStyle.topStripe} ${type2Style ? '' : typeStyle.bg}`}
          style={headerBg}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-full bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>

          {spriteErrored ? (
            <div className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center rounded-full bg-gray-700/50 text-5xl">
              {pokemon.types[0] === 'Fire' ? '🔥' : pokemon.types[0] === 'Water' ? '💧' : pokemon.types[0] === 'Grass' ? '🌿' : '⚪'}
            </div>
          ) : (
            <img
              src={spriteSrc}
              alt={pokemon.name}
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-2xl flex-shrink-0"
              onError={() => {
                const fallback = `https://img.pokemondb.net/sprites/home/normal/${formatNameForDb(pokemon.name)}.png`;
                if (spriteSrc !== fallback) {
                  setSpriteSrc(fallback);
                } else {
                  setSpriteErrored(true);
                }
              }}
            />
          )}

          <div className="flex flex-col gap-1.5 text-left flex-1 min-w-0">
            <div>
              <p className="text-xs text-gray-400 font-mono">#{pokemon.displayNumber ?? pokemon.number}</p>
              <div className="flex items-center gap-2 flex-wrap justify-start">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{pokemon.name}</h2>
                {pokemon.isUniquePal && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-violet-900/60 border-violet-600/50 text-violet-300">
                    ✦ NPC
                  </span>
                )}
                {pokemon.rarity && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${RARITY_BADGE[pokemon.rarity] ?? 'bg-gray-800/60 border-gray-600/50 text-gray-300'}`}>
                    {pokemon.rarity}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-start">
              {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
              {pokemon.idealHabitat && <HabitatBadge habitat={pokemon.idealHabitat} />}
            </div>
            <div className="flex gap-4 text-sm text-gray-300 justify-start">
              {pokemon.height && (
                <span><span className="text-gray-500">Height</span> {pokemon.height}</span>
              )}
              {pokemon.weight && (
                <span><span className="text-gray-500">Weight</span> {pokemon.weight}</span>
              )}
            </div>

            {/* Found toggle — bottom of header info, inline */}
            <button
              onClick={() => onToggleFound(pokemon.number)}
              className={`mt-1 self-start flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-150
                ${isFound
                  ? 'border-emerald-500 bg-emerald-900/60 text-emerald-300 hover:bg-emerald-900/80'
                  : 'border-gray-600 bg-gray-800/60 text-gray-400 hover:border-indigo-400 hover:bg-indigo-900/40 hover:text-indigo-300'
                }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full border-2 font-bold text-xs flex-shrink-0
                ${isFound ? 'border-emerald-400 bg-emerald-700/60' : 'border-gray-500 bg-gray-700/60'}`}>
                {isFound ? '✓' : '+'}
              </span>
              {isFound ? 'Marked as Found' : 'Mark as Found'}
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 min-h-0">
        <div className="p-4 sm:p-6 flex flex-col gap-5 sm:gap-6">
          {/* Description */}
          {pokemon.description && (
            <p className={`text-gray-300 text-sm leading-relaxed italic border-l-2 pl-4 ${typeStyle.topStripe.replace('border-t-2', '')}`}>
              {pokemon.description}
            </p>
          )}

          {/* Habitats — enriched with build requirements from habitats.json */}
          {pokemon.habitats.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                🏡 Habitats &amp; Build Requirements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pokemon.habitats.map((h) => {
                  const entry = HABITATS_MAP.get(h);
                  const catStyle = entry ? (HABITAT_STYLES[entry.category] ?? HABITAT_STYLES['Bright']) : null;
                  const scene = entry ? (HABITAT_SCENES[entry.category] ?? HABITAT_SCENES['Bright']) : null;
                  const imageUrl = entry?.imageUrl;
                  return (
                    <div
                      key={h}
                      role="button"
                      tabIndex={0}
                      onClick={() => entry && setSelectedHabitat(entry)}
                      onKeyDown={(e) => e.key === 'Enter' && entry && setSelectedHabitat(entry)}
                      className={`rounded-xl border overflow-hidden flex flex-col transition-transform hover:scale-[1.02] hover:shadow-lg ${
                        entry ? 'cursor-pointer' : ''
                      } ${
                        catStyle ? `${catStyle.bg} ${catStyle.border}` : 'bg-gray-800/50 border-gray-700/40'
                      }`}
                    >
                      {/* Scene photo — square top */}
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${h} habitat`}
                          className="w-full aspect-video object-contain bg-black/20"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {scene && (
                        <div
                          className={`relative aspect-video overflow-hidden ${scene.gradient}`}
                          style={imageUrl ? { display: 'none' } : undefined}
                        >
                          {scene.deco.map((d, i) => (
                            <span key={i} className={d.style}>{d.emoji}</span>
                          ))}
                        </div>
                      )}
                      {/* Info below image */}
                      <div className="px-3 py-2 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm">{catStyle?.icon ?? '🌿'}</span>
                          <span className={`text-xs font-semibold leading-tight ${catStyle?.text ?? 'text-gray-200'}`}>{h}</span>
                          {entry && (
                            <span className="ml-auto text-xs text-gray-500 font-mono flex-shrink-0">#{entry.number}</span>
                          )}
                        </div>
                        {entry && entry.requirements.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.requirements.map((req) => (
                              <span
                                key={req}
                                className={`text-xs px-1.5 py-0.5 rounded-md leading-tight border ${catStyle ? `${catStyle.bg} ${catStyle.border} ${catStyle.text}` : 'bg-gray-900/60 border-gray-700/50 text-gray-300'}`}
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Time & Weather row */}
          <div className="grid grid-cols-2 gap-4">
            {pokemon.times.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  ⏰ Active Times
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {pokemon.times.map((t) => (
                    <span key={t} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${TIME_COLORS[t] ?? 'bg-gray-800 border-gray-700 text-gray-300'}`}>
                      {TIME_ICONS[t]} {t}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {pokemon.weather.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  🌤️ Weather
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {pokemon.weather.map((w) => (
                    <span key={w} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${WEATHER_COLORS[w] ?? 'bg-gray-800 border-gray-700 text-gray-300'}`}>
                      {WEATHER_ICONS[w]} {w}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Specialties + Flavor — side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Specialties */}
            {pokemon.specialties.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  ⚡ Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.specialties.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSpecialty(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all duration-100 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-md
                        ${SPECIALTY_COLORS[s] ?? 'bg-gray-800 border-gray-700 text-gray-300'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Flavor */}
            {pokemon.flavor && pokemon.flavor.toLowerCase() !== 'n/a' && (() => {
              const flavorKey = pokemon.flavor!.trim().replace(/\s+$/, '');
              const fs = FLAVOR_STYLE[flavorKey] ?? FLAVOR_STYLE['Neutral'];
              return (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                    🍽️ Preferred Flavor
                  </h3>
                  <span className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border ${fs.bg} ${fs.text} ${fs.border}`}>
                    <span>{fs.icon}</span>
                    {flavorKey}
                  </span>
                </section>
              );
            })()}
          </div>

          {/* Favorites */}
          {pokemon.favorites.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                💖 Favorites
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.favorites.map((f) => (
                  <span key={f} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${typeStyle.bg} ${typeStyle.cardBorder} text-gray-200`}>
                    <span>{FAVORITE_ICONS[f] ?? '💛'}</span>
                    {f}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Event-only fields */}
          {'areasFound' in pokemon && pokemon.areasFound && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                📍 Areas Found
              </h3>
              <p className="text-sm text-gray-300">{pokemon.areasFound}</p>
            </section>
          )}

          {/* Event dates */}
          {('eventStart' in pokemon || 'eventEnd' in pokemon) && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                📅 Event Window
              </h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-700/40 rounded-lg px-3 py-2">
                  <span className="text-xs text-yellow-400 font-semibold">Start</span>
                  <span className="text-xs text-yellow-200">
                    {(pokemon as { eventStart?: string }).eventStart || 'TBD'}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-700/40 rounded-lg px-3 py-2">
                  <span className="text-xs text-yellow-400 font-semibold">End</span>
                  <span className="text-xs text-yellow-200">
                    {(pokemon as { eventEnd?: string }).eventEnd || 'TBD'}
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>
        </div>{/* end body inner */}
        </div>{/* end body scrollable */}
      </div>
    </div>

    {/* Habitat detail modal — opens when a habitat card is clicked */}
    {selectedHabitat && (
      <HabitatDetailModal
        habitat={selectedHabitat}
        pokemonMap={pokemonMap}
        foundSet={foundSet ?? new Set()}
        onPokemonClick={(name) => {
          setSelectedHabitat(null);
          onNavigateToPokemon?.(name);
        }}
        onClose={() => setSelectedHabitat(null)}
      />
    )}

    {/* Specialty modal — opens when a specialty badge is clicked */}
    {selectedSpecialty && (
      <SpecialtyModal
        specialtyName={selectedSpecialty}
        pokemonList={specialtyPokemonMap.get(selectedSpecialty) ?? []}
        foundSet={foundSet ?? new Set()}
        onPokemonClick={(p) => {
          setSelectedSpecialty(null);
          onNavigateToPokemon?.(p.name);
        }}
        onClose={() => setSelectedSpecialty(null)}
      />
    )}
    </>,
    document.body
  );
}
