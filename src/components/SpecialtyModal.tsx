import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Pokemon } from '../types/pokemon';
import { SPECIALTY_MAP } from '../data/specialties';
import { TypeBadge, TYPE_CARD_STYLES } from './TypeBadge';
import { getSpriteUrl } from '../utils/sprite';

export const SPECIALTY_COLORS: Record<string, { card: string; active: string; glow: string }> = {
  Grow:           { card: 'border-green-700/50 bg-green-900/20',     active: 'border-green-500 bg-green-900/40 shadow-green-900/50',     glow: 'hover:shadow-green-900/60' },
  Burn:           { card: 'border-orange-700/50 bg-orange-900/20',   active: 'border-orange-500 bg-orange-900/40 shadow-orange-900/50',   glow: 'hover:shadow-orange-900/60' },
  Water:          { card: 'border-blue-700/50 bg-blue-900/20',       active: 'border-blue-500 bg-blue-900/40 shadow-blue-900/50',         glow: 'hover:shadow-blue-900/60' },
  Fly:            { card: 'border-sky-700/50 bg-sky-900/20',         active: 'border-sky-500 bg-sky-900/40 shadow-sky-900/50',           glow: 'hover:shadow-sky-900/60' },
  Build:          { card: 'border-stone-600/50 bg-stone-800/20',     active: 'border-stone-400 bg-stone-800/50 shadow-stone-900/50',     glow: 'hover:shadow-stone-900/60' },
  Bulldoze:       { card: 'border-yellow-700/50 bg-yellow-900/20',   active: 'border-yellow-500 bg-yellow-900/40 shadow-yellow-900/50',   glow: 'hover:shadow-yellow-900/60' },
  Chop:           { card: 'border-lime-700/50 bg-lime-900/20',       active: 'border-lime-500 bg-lime-900/40 shadow-lime-900/50',         glow: 'hover:shadow-lime-900/60' },
  Crush:          { card: 'border-red-700/50 bg-red-900/20',         active: 'border-red-500 bg-red-900/40 shadow-red-900/50',           glow: 'hover:shadow-red-900/60' },
  Generate:       { card: 'border-yellow-600/50 bg-yellow-950/20',   active: 'border-yellow-400 bg-yellow-950/40 shadow-yellow-900/50',   glow: 'hover:shadow-yellow-900/60' },
  Search:         { card: 'border-indigo-700/50 bg-indigo-900/20',   active: 'border-indigo-500 bg-indigo-900/40 shadow-indigo-900/50',   glow: 'hover:shadow-indigo-900/60' },
  Recycle:        { card: 'border-teal-700/50 bg-teal-900/20',       active: 'border-teal-500 bg-teal-900/40 shadow-teal-900/50',         glow: 'hover:shadow-teal-900/60' },
  Trade:          { card: 'border-violet-700/50 bg-violet-900/20',   active: 'border-violet-500 bg-violet-900/40 shadow-violet-900/50',   glow: 'hover:shadow-violet-900/60' },
  Litter:         { card: 'border-amber-700/50 bg-amber-900/20',     active: 'border-amber-500 bg-amber-900/40 shadow-amber-900/50',     glow: 'hover:shadow-amber-900/60' },
  Hype:           { card: 'border-pink-700/50 bg-pink-900/20',       active: 'border-pink-500 bg-pink-900/40 shadow-pink-900/50',         glow: 'hover:shadow-pink-900/60' },
  Teleport:       { card: 'border-purple-700/50 bg-purple-900/20',   active: 'border-purple-500 bg-purple-900/40 shadow-purple-900/50',   glow: 'hover:shadow-purple-900/60' },
  Storage:        { card: 'border-slate-600/50 bg-slate-800/20',     active: 'border-slate-400 bg-slate-800/50 shadow-slate-800/50',     glow: 'hover:shadow-slate-800/60' },
  Illuminate:     { card: 'border-yellow-500/50 bg-yellow-950/20',   active: 'border-yellow-300 bg-yellow-950/40 shadow-yellow-900/50',   glow: 'hover:shadow-yellow-800/60' },
  Explode:        { card: 'border-red-600/50 bg-red-950/20',         active: 'border-red-400 bg-red-950/40 shadow-red-900/50',           glow: 'hover:shadow-red-900/60' },
  Appraise:       { card: 'border-emerald-700/50 bg-emerald-900/20', active: 'border-emerald-500 bg-emerald-900/40 shadow-emerald-900/50', glow: 'hover:shadow-emerald-900/60' },
  Transform:      { card: 'border-fuchsia-700/50 bg-fuchsia-900/20', active: 'border-fuchsia-500 bg-fuchsia-900/40 shadow-fuchsia-900/50', glow: 'hover:shadow-fuchsia-900/60' },
  Yawn:           { card: 'border-slate-500/50 bg-slate-800/20',     active: 'border-slate-300 bg-slate-800/50 shadow-slate-700/50',     glow: 'hover:shadow-slate-700/60' },
  'Gather Honey': { card: 'border-amber-600/50 bg-amber-950/20',     active: 'border-amber-400 bg-amber-950/40 shadow-amber-900/50',     glow: 'hover:shadow-amber-900/60' },
  Gather:         { card: 'border-teal-600/50 bg-teal-950/20',       active: 'border-teal-400 bg-teal-950/40 shadow-teal-900/50',         glow: 'hover:shadow-teal-900/60' },
  'Dream Island': { card: 'border-violet-600/50 bg-violet-950/20',   active: 'border-violet-400 bg-violet-950/40 shadow-violet-900/50',   glow: 'hover:shadow-violet-900/60' },
  Paint:          { card: 'border-rose-700/50 bg-rose-900/20',       active: 'border-rose-500 bg-rose-900/40 shadow-rose-900/50',         glow: 'hover:shadow-rose-900/60' },
  Collect:        { card: 'border-yellow-600/50 bg-yellow-950/20',   active: 'border-yellow-400 bg-yellow-950/40 shadow-yellow-900/50',   glow: 'hover:shadow-yellow-900/60' },
  Engineer:       { card: 'border-cyan-700/50 bg-cyan-900/20',       active: 'border-cyan-500 bg-cyan-900/40 shadow-cyan-900/50',         glow: 'hover:shadow-cyan-900/60' },
  Rarify:         { card: 'border-purple-600/50 bg-purple-950/20',   active: 'border-purple-400 bg-purple-950/40 shadow-purple-900/50',   glow: 'hover:shadow-purple-900/60' },
  Party:          { card: 'border-pink-600/50 bg-pink-950/20',       active: 'border-pink-400 bg-pink-950/40 shadow-pink-900/50',         glow: 'hover:shadow-pink-900/60' },
  DJ:             { card: 'border-cyan-600/50 bg-cyan-950/20',       active: 'border-cyan-400 bg-cyan-950/40 shadow-cyan-900/50',         glow: 'hover:shadow-cyan-900/60' },
};

export const DEFAULT_SPECIALTY_COLORS = { card: 'border-gray-700/50 bg-gray-800/20', active: 'border-gray-400 bg-gray-800/50 shadow-gray-800/50', glow: 'hover:shadow-gray-700/50' };

export function PokemonSpriteCell({
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
        hover:brightness-110 hover:scale-[1.03] hover:shadow-lg ${typeStyle.hoverShadow}`}
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

interface SpecialtyModalProps {
  specialtyName: string;
  pokemonList: Pokemon[];
  foundSet: Set<string>;
  onPokemonClick: (pokemon: Pokemon) => void;
  onClose: () => void;
}

export function SpecialtyModal({
  specialtyName,
  pokemonList,
  foundSet,
  onPokemonClick,
  onClose,
}: SpecialtyModalProps) {
  const meta = SPECIALTY_MAP[specialtyName];
  const colors = SPECIALTY_COLORS[specialtyName] ?? DEFAULT_SPECIALTY_COLORS;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-3xl rounded-2xl bg-gray-900 border border-gray-700/60 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative flex items-center gap-4 p-6 rounded-t-2xl border-b border-gray-700/40 ${colors.card}`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
          <span className="text-5xl">{meta?.icon ?? '⚡'}</span>
          <div>
            <h2 className="text-2xl font-bold text-white">{specialtyName}</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-lg leading-relaxed">
              {meta?.description ?? ''}
            </p>
          </div>
        </div>

        {/* Pokémon grid — fixed height, scrollable */}
        <div className="p-6 overflow-y-auto max-h-[26rem]">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
            Pokémon with this specialty — {pokemonList.length}
          </h3>
          {pokemonList.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No Pokémon found in your data with this specialty.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {pokemonList.map((p) => (
                <PokemonSpriteCell
                  key={p.number + p.name}
                  pokemon={p}
                  isFound={foundSet.has(p.number)}
                  onClick={() => onPokemonClick(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
