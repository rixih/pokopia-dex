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
    <nav className="flex gap-1 bg-gray-900/60 p-1 rounded-xl border border-gray-700/50 backdrop-blur-sm">
      {TABS.map((tab) => {
        const active = tab.to === '/' ? pathname === '/' : pathname.startsWith(tab.to);
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              active
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
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
