import { Link, useLocation } from 'react-router-dom';

// Pokéball icon for Pokédex tab
function PokeballIcon({ className }: { className?: string }) {
  return (
    <img src="/tab-pokeball.png" alt="" className={className} />
  );
}

// Star-with-pokéball icon for Event Pokédex tab — drawn as SVG for transparency
function StarPokeballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFD740" />
          <stop offset="100%" stopColor="#F5A623" />
        </linearGradient>
      </defs>
      {/* 5-point star */}
      <path
        d="M50,5 L60.6,35.4 L92.8,36.1 L67.1,55.6 L76.4,86.4 L50,68 L23.6,86.4 L32.9,55.6 L7.2,36.1 L39.4,35.4 Z"
        fill="url(#sg)"
        stroke="#2a2a2a"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Pokéball — bottom half */}
      <path d="M35,52 A15,15 0 0,0 65,52 Z" fill="#e0e0e0" />
      {/* Pokéball — top half */}
      <path d="M35,52 A15,15 0 0,1 65,52 Z" fill="#e53935" />
      {/* Pokéball border circle */}
      <circle cx="50" cy="52" r="15" fill="none" stroke="#2a2a2a" strokeWidth="2.5" />
      {/* Center divider line */}
      <line x1="35" y1="52" x2="65" y2="52" stroke="#2a2a2a" strokeWidth="2.5" />
      {/* Center button */}
      <circle cx="50" cy="52" r="5.5" fill="white" stroke="#2a2a2a" strokeWidth="2" />
      <circle cx="50" cy="52" r="2.5" fill="#ccc" />
    </svg>
  );
}

const TABS = [
  { to: '/', label: 'Pokédex', renderIcon: () => <PokeballIcon className="w-5 h-5 object-contain" /> },
  { to: '/events', label: 'Event Pokédex', renderIcon: () => <StarPokeballIcon className="w-6 h-6" /> },
  { to: '/specialties', label: 'Specialties', renderIcon: () => <span>⚡</span> },
  { to: '/habitats', label: 'Habitat Dex', renderIcon: () => <span>🏡</span> },
  { to: '/crafting', label: 'Crafting', renderIcon: () => <span>🔨</span> },
  { to: '/cooking', label: 'Cooking', renderIcon: () => <span>👨‍🍳</span> },
];

export function TabNav() {
  const { pathname } = useLocation();

  return (
    <nav className="flex gap-1 bg-slate-900/70 p-1 rounded-xl border border-purple-900/30 backdrop-blur-sm">
      {TABS.map((tab) => {
        const active = tab.to === '/' ? pathname === '/' : pathname.startsWith(tab.to);
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-gradient-to-b from-purple-800/60 to-slate-800/80 text-white shadow-md shadow-purple-900/40 border border-purple-700/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            {tab.renderIcon()}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
