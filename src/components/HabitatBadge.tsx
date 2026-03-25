import type { IdealHabitat } from '../types/pokemon';

export const HABITAT_SCENES: Record<string, { gradient: string; deco: Array<{ emoji: string; style: string }> }> = {
  Bright: {
    gradient: 'bg-gradient-to-br from-yellow-700/70 via-yellow-500/50 to-yellow-800/60',
    deco: [
      { emoji: '☀️', style: 'absolute top-2 left-4 text-3xl opacity-90' },
      { emoji: '🌳', style: 'absolute bottom-0 right-6 text-4xl opacity-80' },
      { emoji: '🌿', style: 'absolute bottom-1 left-1/3 text-2xl opacity-70' },
    ],
  },
  Warm: {
    gradient: 'bg-gradient-to-br from-red-900/80 via-orange-800/60 to-red-900/70',
    deco: [
      { emoji: '🔥', style: 'absolute top-2 left-4 text-3xl opacity-90' },
      { emoji: '🌋', style: 'absolute bottom-0 right-5 text-4xl opacity-75' },
      { emoji: '♨️', style: 'absolute top-3 right-1/3 text-2xl opacity-70' },
    ],
  },
  Humid: {
    gradient: 'bg-gradient-to-br from-teal-900/80 via-cyan-800/50 to-blue-900/70',
    deco: [
      { emoji: '🌧️', style: 'absolute top-2 left-4 text-3xl opacity-90' },
      { emoji: '🌊', style: 'absolute bottom-0 right-4 text-4xl opacity-80' },
      { emoji: '💧', style: 'absolute top-3 right-1/4 text-2xl opacity-70' },
    ],
  },
  Cool: {
    gradient: 'bg-gradient-to-br from-sky-900/80 via-blue-800/50 to-slate-900/70',
    deco: [
      { emoji: '❄️', style: 'absolute top-2 left-4 text-3xl opacity-90' },
      { emoji: '🏔️', style: 'absolute bottom-0 right-5 text-4xl opacity-75' },
      { emoji: '🌨️', style: 'absolute top-3 right-1/3 text-2xl opacity-70' },
    ],
  },
  Dry: {
    gradient: 'bg-gradient-to-br from-yellow-900/80 via-stone-700/60 to-amber-900/70',
    deco: [
      { emoji: '🏜️', style: 'absolute top-2 left-4 text-3xl opacity-90' },
      { emoji: '🪨', style: 'absolute bottom-0 right-6 text-4xl opacity-80' },
      { emoji: '🌵', style: 'absolute bottom-1 left-1/3 text-2xl opacity-70' },
    ],
  },
  Dark: {
    gradient: 'bg-gradient-to-br from-gray-950/90 via-violet-950/70 to-gray-900/80',
    deco: [
      { emoji: '🌙', style: 'absolute top-2 left-4 text-3xl opacity-90' },
      { emoji: '⭐', style: 'absolute top-3 right-1/3 text-xl opacity-60' },
      { emoji: '🕯️', style: 'absolute bottom-1 right-6 text-3xl opacity-80' },
    ],
  },
};

export const HABITAT_STYLES: Record<string, { bg: string; text: string; border: string; cardBorder: string; topStripe: string; hoverShadow: string; borderFilter: string; icon: string; label: string }> = {
  Bright: {
    bg: 'bg-yellow-700/40',
    text: 'text-yellow-300',
    border: 'border-yellow-500/40',
    cardBorder: 'border-yellow-700/50',
    topStripe: 'border-t-2 border-yellow-500/70',
    hoverShadow: 'hover:shadow-yellow-900/40',
    borderFilter: 'invert(1) sepia(1) hue-rotate(22deg) saturate(5) brightness(1.1)',
    icon: '☀️',
    label: 'Bright',
  },
  Warm: {
    bg: 'bg-orange-900/40',
    text: 'text-orange-300',
    border: 'border-orange-600/40',
    cardBorder: 'border-orange-800/50',
    topStripe: 'border-t-2 border-orange-500/70',
    hoverShadow: 'hover:shadow-orange-900/40',
    borderFilter: 'invert(1) sepia(1) hue-rotate(345deg) saturate(8) brightness(1.1)',
    icon: '🔥',
    label: 'Warm',
  },
  Humid: {
    bg: 'bg-teal-900/40',
    text: 'text-teal-300',
    border: 'border-teal-600/40',
    cardBorder: 'border-teal-800/50',
    topStripe: 'border-t-2 border-teal-500/70',
    hoverShadow: 'hover:shadow-teal-900/40',
    borderFilter: 'invert(1) sepia(1) hue-rotate(137deg) saturate(4) brightness(0.9)',
    icon: '💧',
    label: 'Humid',
  },
  Dry: {
    bg: 'bg-yellow-900/40',
    text: 'text-yellow-300',
    border: 'border-yellow-600/40',
    cardBorder: 'border-yellow-900/50',
    topStripe: 'border-t-2 border-amber-600/70',
    hoverShadow: 'hover:shadow-yellow-900/40',
    borderFilter: 'invert(1) sepia(1) hue-rotate(15deg) saturate(4) brightness(0.95)',
    icon: '🏜️',
    label: 'Dry',
  },
  Dark: {
    bg: 'bg-violet-900/40',
    text: 'text-violet-300',
    border: 'border-violet-600/40',
    cardBorder: 'border-violet-800/50',
    topStripe: 'border-t-2 border-violet-500/70',
    hoverShadow: 'hover:shadow-violet-900/40',
    borderFilter: 'invert(1) sepia(1) hue-rotate(232deg) saturate(5) brightness(0.9)',
    icon: '🌙',
    label: 'Dark',
  },
  Cool: {
    bg: 'bg-sky-900/40',
    text: 'text-sky-300',
    border: 'border-sky-600/40',
    cardBorder: 'border-sky-800/50',
    topStripe: 'border-t-2 border-sky-500/70',
    hoverShadow: 'hover:shadow-sky-900/40',
    borderFilter: 'invert(1) sepia(1) hue-rotate(162deg) saturate(4) brightness(1.0)',
    icon: '❄️',
    label: 'Cool',
  },
};

interface HabitatBadgeProps {
  habitat: IdealHabitat;
  size?: 'sm' | 'md';
}

export function HabitatBadge({ habitat, size = 'md' }: HabitatBadgeProps) {
  if (!habitat) return null;
  const style = HABITAT_STYLES[habitat];
  if (!style) return null;
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5 font-semibold';
  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizeClass} ${style.bg} ${style.text} ${style.border}`}
    >
      <span>{style.icon}</span>
      {style.label}
    </span>
  );
}
