import type { PokemonType } from '../types/pokemon';

export const TYPE_CARD_STYLES: Record<PokemonType, { bg: string; bgRaw: string; cardBorder: string; topStripe: string; hoverShadow: string; borderFilter: string }> = {
  Normal:   { bg: 'bg-gray-700/40',    bgRaw: '55,65,81',     cardBorder: 'border-gray-600/50',    topStripe: 'border-t-2 border-gray-500/60',    hoverShadow: 'hover:shadow-gray-800/40',    borderFilter: 'invert(1) brightness(0.5)' },
  Fire:     { bg: 'bg-orange-900/40',  bgRaw: '124,45,18',    cardBorder: 'border-orange-700/50',  topStripe: 'border-t-2 border-orange-500/70',  hoverShadow: 'hover:shadow-orange-900/40',  borderFilter: 'invert(1) sepia(1) hue-rotate(0deg) saturate(6) brightness(1.0)' },
  Water:    { bg: 'bg-blue-900/40',    bgRaw: '30,58,138',    cardBorder: 'border-blue-700/50',    topStripe: 'border-t-2 border-blue-500/70',    hoverShadow: 'hover:shadow-blue-900/40',    borderFilter: 'invert(1) sepia(1) hue-rotate(200deg) saturate(5) brightness(0.9)' },
  Electric: { bg: 'bg-yellow-700/40',  bgRaw: '161,98,7',     cardBorder: 'border-yellow-600/50',  topStripe: 'border-t-2 border-yellow-400/70',  hoverShadow: 'hover:shadow-yellow-900/40',  borderFilter: 'invert(1) sepia(1) hue-rotate(30deg) saturate(6) brightness(1.2)' },
  Grass:    { bg: 'bg-green-900/40',   bgRaw: '20,83,45',     cardBorder: 'border-green-700/50',   topStripe: 'border-t-2 border-green-500/70',   hoverShadow: 'hover:shadow-green-900/40',   borderFilter: 'invert(1) sepia(1) hue-rotate(95deg) saturate(5) brightness(0.9)' },
  Ice:      { bg: 'bg-cyan-900/40',    bgRaw: '22,78,99',     cardBorder: 'border-cyan-600/50',    topStripe: 'border-t-2 border-cyan-400/70',    hoverShadow: 'hover:shadow-cyan-900/40',    borderFilter: 'invert(1) sepia(1) hue-rotate(165deg) saturate(3) brightness(1.0)' },
  Fighting: { bg: 'bg-red-900/40',     bgRaw: '127,29,29',    cardBorder: 'border-red-700/50',     topStripe: 'border-t-2 border-red-600/70',     hoverShadow: 'hover:shadow-red-900/40',     borderFilter: 'invert(1) sepia(1) hue-rotate(350deg) saturate(8) brightness(0.9)' },
  Poison:   { bg: 'bg-purple-900/40',  bgRaw: '88,28,135',    cardBorder: 'border-purple-700/50',  topStripe: 'border-t-2 border-purple-500/70',  hoverShadow: 'hover:shadow-purple-900/40',  borderFilter: 'invert(1) sepia(1) hue-rotate(270deg) saturate(5) brightness(0.8)' },
  Ground:   { bg: 'bg-amber-900/40',   bgRaw: '120,53,15',    cardBorder: 'border-amber-700/50',   topStripe: 'border-t-2 border-amber-500/70',   hoverShadow: 'hover:shadow-amber-900/40',   borderFilter: 'invert(1) sepia(1) hue-rotate(10deg) saturate(4) brightness(0.9)' },
  Flying:   { bg: 'bg-sky-900/40',     bgRaw: '12,74,110',    cardBorder: 'border-sky-600/50',     topStripe: 'border-t-2 border-sky-400/70',     hoverShadow: 'hover:shadow-sky-900/40',     borderFilter: 'invert(1) sepia(1) hue-rotate(185deg) saturate(4) brightness(1.1)' },
  Psychic:  { bg: 'bg-pink-900/40',    bgRaw: '131,24,67',    cardBorder: 'border-pink-700/50',    topStripe: 'border-t-2 border-pink-500/70',    hoverShadow: 'hover:shadow-pink-900/40',    borderFilter: 'invert(1) sepia(1) hue-rotate(310deg) saturate(5) brightness(1.0)' },
  Bug:      { bg: 'bg-lime-900/40',    bgRaw: '26,46,5',      cardBorder: 'border-lime-700/50',    topStripe: 'border-t-2 border-lime-500/70',    hoverShadow: 'hover:shadow-lime-900/40',    borderFilter: 'invert(1) sepia(1) hue-rotate(75deg) saturate(5) brightness(1.0)' },
  Rock:     { bg: 'bg-stone-800/40',   bgRaw: '41,37,36',     cardBorder: 'border-stone-600/50',   topStripe: 'border-t-2 border-stone-500/60',   hoverShadow: 'hover:shadow-stone-900/40',   borderFilter: 'invert(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.8)' },
  Ghost:    { bg: 'bg-indigo-900/40',  bgRaw: '30,27,75',     cardBorder: 'border-indigo-700/50',  topStripe: 'border-t-2 border-indigo-500/70',  hoverShadow: 'hover:shadow-indigo-900/40',  borderFilter: 'invert(1) sepia(1) hue-rotate(240deg) saturate(4) brightness(0.8)' },
  Dragon:   { bg: 'bg-violet-900/40',  bgRaw: '46,16,101',    cardBorder: 'border-violet-700/50',  topStripe: 'border-t-2 border-violet-500/70',  hoverShadow: 'hover:shadow-violet-900/40',  borderFilter: 'invert(1) sepia(1) hue-rotate(255deg) saturate(5) brightness(0.85)' },
  Dark:     { bg: 'bg-neutral-900/40', bgRaw: '23,23,23',     cardBorder: 'border-neutral-700/50', topStripe: 'border-t-2 border-neutral-600/60', hoverShadow: 'hover:shadow-neutral-900/40', borderFilter: 'invert(1) sepia(1) hue-rotate(232deg) saturate(2) brightness(0.5)' },
  Steel:    { bg: 'bg-slate-700/40',   bgRaw: '51,65,85',     cardBorder: 'border-slate-500/50',   topStripe: 'border-t-2 border-slate-400/60',   hoverShadow: 'hover:shadow-slate-800/40',   borderFilter: 'invert(1) sepia(1) hue-rotate(190deg) saturate(2) brightness(0.9)' },
  Fairy:    { bg: 'bg-rose-900/40',    bgRaw: '136,19,55',    cardBorder: 'border-rose-700/50',    topStripe: 'border-t-2 border-rose-500/70',    hoverShadow: 'hover:shadow-rose-900/40',    borderFilter: 'invert(1) sepia(1) hue-rotate(320deg) saturate(4) brightness(1.0)' },
};

const TYPE_COLORS: Record<PokemonType, string> = {
  Normal:   'bg-gray-400 text-gray-900',
  Fire:     'bg-orange-500 text-white',
  Water:    'bg-blue-500 text-white',
  Electric: 'bg-yellow-400 text-yellow-900',
  Grass:    'bg-green-500 text-white',
  Ice:      'bg-cyan-300 text-cyan-900',
  Fighting: 'bg-red-700 text-white',
  Poison:   'bg-purple-600 text-white',
  Ground:   'bg-amber-700 text-white',
  Flying:   'bg-sky-400 text-white',
  Psychic:  'bg-pink-500 text-white',
  Bug:      'bg-lime-500 text-white',
  Rock:     'bg-stone-500 text-white',
  Ghost:    'bg-indigo-700 text-white',
  Dragon:   'bg-violet-700 text-white',
  Dark:     'bg-neutral-700 text-white',
  Steel:    'bg-slate-400 text-slate-900',
  Fairy:    'bg-rose-400 text-white',
};

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] ?? 'bg-gray-500 text-white';
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2.5 py-1 font-semibold';
  return (
    <span className={`inline-block rounded-full ${sizeClass} ${color} tracking-wide`}>
      {type}
    </span>
  );
}
