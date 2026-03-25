import { useEffect, useState } from 'react';
import type { Pokemon } from '../types/pokemon';
import { HABITAT_STYLES, HABITAT_SCENES } from './HabitatBadge';
import { TypeBadge, TYPE_CARD_STYLES } from './TypeBadge';
import { getSpriteUrl } from '../utils/sprite';

export type HabitatEntry = {
  number: number | string;
  name: string;
  category: string;
  requirements: string[];
  pokemon: string[];
  imageUrl?: string;
};

interface HabitatDetailModalProps {
  habitat: HabitatEntry;
  pokemonMap: Map<string, Pokemon>;
  foundSet: Set<string>;
  onPokemonClick: (name: string) => void;
  onClose: () => void;
}

function PokemonSpriteCell({
  pokemon,
  isFound,
  onClick,
}: {
  pokemon: Pokemon;
  isFound: boolean;
  onClick: () => void;
}) {
  const [src, setSrc] = useState(getSpriteUrl(pokemon));
  const [errored, setErrored] = useState(false);
  const typeStyle = TYPE_CARD_STYLES[pokemon.types[0]];
  const type2Style = pokemon.types[1] ? TYPE_CARD_STYLES[pokemon.types[1]] : null;
  const spriteBg = type2Style
    ? { background: `linear-gradient(135deg, rgba(${typeStyle.bgRaw},0.45) 0%, rgba(${typeStyle.bgRaw},0.45) 55%, rgba(${type2Style.bgRaw},0.45) 100%)` }
    : undefined;

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-150 cursor-pointer backdrop-blur-sm
        ${typeStyle.cardBorder}
        ${type2Style ? '' : typeStyle.bg}
        ${typeStyle.topStripe}
        ${isFound ? 'ring-1 ring-emerald-600/40' : ''}
        hover:brightness-110 hover:scale-[1.03]`}
      style={spriteBg}
    >
      {isFound && (
        <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white text-xs leading-none">
          ✓
        </span>
      )}
      <div className="w-16 h-16 flex items-center justify-center">
        {errored ? (
          <span className="text-3xl">
            {pokemon.types[0] === 'Fire' ? '🔥'
              : pokemon.types[0] === 'Water' ? '💧'
              : pokemon.types[0] === 'Grass' ? '🌿'
              : '⚪'}
          </span>
        ) : (
          <img
            src={src}
            alt={pokemon.name}
            className="w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200"
            loading="lazy"
            onError={() => {
              const fallback = `https://img.pokemondb.net/sprites/home/normal/${pokemon.name.toLowerCase().replace(/\s+/g, '-').replace(/['']/g, '').replace(/\./g, '').replace(/é/g, 'e').replace(/\?/g, '')}.png`;
              if (src !== fallback) setSrc(fallback);
              else setErrored(true);
            }}
          />
        )}
      </div>
      <p className="text-xs font-semibold text-gray-200 text-center leading-tight max-w-full truncate">
        {pokemon.name}
      </p>
      <div className="flex flex-wrap justify-center gap-1">
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} size="sm" />
        ))}
      </div>
    </button>
  );
}

export function HabitatDetailModal({
  habitat,
  pokemonMap,
  foundSet,
  onPokemonClick,
  onClose,
}: HabitatDetailModalProps) {
  const style = HABITAT_STYLES[habitat.category] ?? HABITAT_STYLES['Bright'];
  const scene = HABITAT_SCENES[habitat.category] ?? HABITAT_SCENES['Bright'];

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Resolve pokemon names → Pokemon objects
  const pokemonList = habitat.pokemon
    .map((name) => pokemonMap.get(name))
    .filter((p): p is Pokemon => p !== undefined);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-gray-700/60 bg-gray-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header image / gradient */}
        {habitat.imageUrl ? (
          <img
            src={habitat.imageUrl}
            alt={`${habitat.name} habitat`}
            className="w-full h-40 object-contain bg-black/30"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`relative h-40 overflow-hidden ${scene.gradient}`}
          style={habitat.imageUrl ? { display: 'none' } : undefined}
        >
          {scene.deco.map((d, i) => (
            <span key={i} className={d.style}>{d.emoji}</span>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-gray-300 hover:text-white hover:bg-black/70 transition-colors text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title bar */}
        <div className={`flex items-center gap-3 px-5 py-4 border-b ${style.border} ${style.bg}`}>
          <span className="text-2xl">{style.icon}</span>
          <div className="flex-1 min-w-0">
            <h2 className={`text-lg font-bold leading-tight ${style.text}`}>{habitat.name}</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Habitat #{habitat.number}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
            {habitat.category}
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Build requirements */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              🧱 Build with
            </h3>
            <div className="flex flex-wrap gap-2">
              {habitat.requirements.map((req) => (
                <span
                  key={req}
                  className={`text-xs px-3 py-1 rounded-md border ${style.bg} ${style.border} ${style.text}`}
                >
                  {req}
                </span>
              ))}
            </div>
          </section>

          {/* Pokémon sprite grid */}
          {pokemonList.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                🐾 Attracts ({pokemonList.length} Pokémon)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {pokemonList.map((p) => (
                  <PokemonSpriteCell
                    key={p.number}
                    pokemon={p}
                    isFound={foundSet.has(p.number)}
                    onClick={() => onPokemonClick(p.name)}
                  />
                ))}
              </div>
              {habitat.pokemon.length > pokemonList.length && (
                <p className="text-xs text-gray-500 mt-3">
                  + {habitat.pokemon.length - pokemonList.length} more Pokémon not yet in the database
                </p>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
