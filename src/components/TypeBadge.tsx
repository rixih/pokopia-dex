import type { PokemonType } from '../types/pokemon';

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
