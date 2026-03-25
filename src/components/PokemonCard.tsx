import { useState } from 'react';
import { HABITAT_STYLES } from './HabitatBadge';
import { TypeBadge, TYPE_CARD_STYLES } from './TypeBadge';
import type { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  isFound: boolean;
  onToggleFound: (number: string) => void;
  onClick: () => void;
  isEvent?: boolean;
}

function formatNameForDb(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/['']/g, '')
    .replace(/\./g, '')
    .replace(/é/g, 'e')
    .replace(/\?/g, '')
    .replace(/♀/g, '-f')
    .replace(/♂/g, '-m');
}

export function getSpriteUrl(pokemon: Pokemon): string {
  if (pokemon.ignSprite) return pokemon.ignSprite;
  return `https://img.pokemondb.net/sprites/home/normal/${formatNameForDb(pokemon.name)}.png`;
}

const RARITY_STYLES: Record<string, string> = {
  Common:     'bg-gray-700/60 text-gray-400 border-gray-600/50',
  Rare:       'bg-blue-900/60 text-blue-300 border-blue-700/50',
  'Very Rare':'bg-violet-900/60 text-violet-300 border-violet-700/50',
  Legendary:  'bg-yellow-900/60 text-yellow-300 border-yellow-700/50',
};

function PokemonSprite({ pokemon }: { pokemon: Pokemon }) {
  const [src, setSrc] = useState(getSpriteUrl(pokemon));
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-700/50 text-2xl select-none">
        {pokemon.types[0] === 'Fire' ? '🔥' : pokemon.types[0] === 'Water' ? '💧' : pokemon.types[0] === 'Grass' ? '🌿' : '⚪'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={pokemon.name}
      className="w-20 h-20 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-200"
      loading="lazy"
      onError={() => {
        if (src !== `https://img.pokemondb.net/sprites/home/normal/${formatNameForDb(pokemon.name)}.png`) {
          setSrc(`https://img.pokemondb.net/sprites/home/normal/${formatNameForDb(pokemon.name)}.png`);
        } else {
          setErrored(true);
        }
      }}
    />
  );
}

export function PokemonCard({ pokemon, isFound, onToggleFound, onClick, isEvent }: PokemonCardProps) {
  const typeStyle = TYPE_CARD_STYLES[pokemon.types[0]];
  const habitatStyle = pokemon.idealHabitat ? HABITAT_STYLES[pokemon.idealHabitat] : null;
  const rarityStyle = pokemon.rarity ? RARITY_STYLES[pokemon.rarity] : null;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden pokemon-card-enter backdrop-blur-sm
        ${isFound
          ? `${typeStyle.cardBorder} ring-1 ring-emerald-600/40 bg-slate-900/60 hover:bg-slate-800/70 ${typeStyle.hoverShadow}`
          : `${typeStyle.cardBorder} bg-slate-900/60 hover:bg-slate-800/70 ${typeStyle.hoverShadow}`
        } hover:-translate-y-0.5 hover:shadow-xl`}
      onClick={onClick}
    >
      {isEvent && (
        <div className="absolute top-2 left-2 z-30 flex items-center gap-1 bg-yellow-500/90 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
          ⭐ Event
        </div>
      )}

      {isFound && (
        <div className="absolute top-2 right-2 z-30">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-xs">✓</span>
        </div>
      )}

      {/* Sprite area */}
      <div
        className={`relative flex items-center justify-center pt-6 pb-2 transition-colors overflow-hidden ${typeStyle.bg} ${typeStyle.topStripe}`}
      >
        {/* Ornamental border overlay — cropped to sprite area */}
        <img
          src="/card-border.png"
          aria-hidden="true"
          className={`absolute top-0 left-0 w-full pointer-events-none mix-blend-screen z-10 opacity-20`}
          style={{ height: 'auto', filter: typeStyle.borderFilter }}
        />
        <PokemonSprite pokemon={pokemon} />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <div className="flex items-start justify-between gap-1">
          <div>
            <p className="text-xs text-gray-500 font-mono">#{pokemon.number}</p>
            <h3 className="font-semibold text-gray-100 text-sm leading-tight">{pokemon.name}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto gap-1 flex-wrap">
          {habitatStyle && (
            <div className="flex items-center gap-1">
              <span className="text-xs">{habitatStyle.icon}</span>
              <span className={`text-xs font-medium ${habitatStyle.text}`}>{habitatStyle.label}</span>
            </div>
          )}
          {rarityStyle && (
            <span className={`text-xs border px-1.5 py-0.5 rounded-full font-medium ml-auto ${rarityStyle}`}>
              {pokemon.rarity === 'Very Rare' ? 'V.Rare' : pokemon.rarity}
            </span>
          )}
        </div>
      </div>

      {/* Found button */}
      <button
        className={`w-full text-xs font-semibold py-2 border-t transition-colors duration-150
          ${isFound
            ? 'border-emerald-700/50 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
            : 'border-gray-700/50 bg-gray-800/40 text-gray-500 hover:text-gray-300 hover:bg-gray-700/40'
          }`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFound(pokemon.number);
        }}
      >
        {isFound ? '✓ Found' : '+ Mark as Found'}
      </button>
    </div>
  );
}
