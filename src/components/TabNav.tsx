import { Link, useLocation } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Pokédex', icon: '📖' },
  { to: '/events', label: 'Event Pokédex', icon: '⭐' },
  { to: '/habitats', label: 'Habitat Dex', icon: '🏡' },
  { to: '/crafting', label: 'Crafting', icon: '🔨' },
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
            <span>{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
