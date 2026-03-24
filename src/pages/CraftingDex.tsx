import { useState, useMemo } from 'react';
import itemsData from '../data/items.json';
import type { CraftingItem } from '../types/pokemon';

const items = itemsData as CraftingItem[];

const CATEGORIES = ['All', 'Furniture', 'Misc.', 'Outdoor', 'Utilities', 'Buildings', 'Blocks', 'Other'];

const CATEGORY_ICONS: Record<string, string> = {
  Furniture: '🪑',
  'Misc.': '📦',
  Outdoor: '🌿',
  Utilities: '⚙️',
  Buildings: '🏗️',
  Blocks: '🧱',
  Other: '✨',
};

const CATEGORY_COLORS: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  Furniture:   { bg: 'bg-amber-900/30',  border: 'border-amber-700/40',  badge: 'bg-amber-900/50 text-amber-300 border-amber-700/50',  text: 'text-amber-400' },
  'Misc.':     { bg: 'bg-blue-900/30',   border: 'border-blue-700/40',   badge: 'bg-blue-900/50 text-blue-300 border-blue-700/50',      text: 'text-blue-400' },
  Outdoor:     { bg: 'bg-green-900/30',  border: 'border-green-700/40',  badge: 'bg-green-900/50 text-green-300 border-green-700/50',   text: 'text-green-400' },
  Utilities:   { bg: 'bg-purple-900/30', border: 'border-purple-700/40', badge: 'bg-purple-900/50 text-purple-300 border-purple-700/50', text: 'text-purple-400' },
  Buildings:   { bg: 'bg-orange-900/30', border: 'border-orange-700/40', badge: 'bg-orange-900/50 text-orange-300 border-orange-700/50', text: 'text-orange-400' },
  Blocks:      { bg: 'bg-stone-800/40',  border: 'border-stone-600/40',  badge: 'bg-stone-800/60 text-stone-300 border-stone-600/50',   text: 'text-stone-400' },
  Other:       { bg: 'bg-pink-900/30',   border: 'border-pink-700/40',   badge: 'bg-pink-900/50 text-pink-300 border-pink-700/50',      text: 'text-pink-400' },
};

const DEFAULT_STYLE = { bg: 'bg-gray-800/40', border: 'border-gray-700/50', badge: 'bg-gray-800 text-gray-300 border-gray-600', text: 'text-gray-400' };

type SortField = 'name' | 'category' | 'location';
type SortDir = 'asc' | 'desc';

const hasActiveFilters = (search: string, category: string) => search !== '' || category !== 'All';

export function CraftingDex() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setSortField('name');
    setSortDir('asc');
  };

  const active = hasActiveFilters(search, category);

  const filtered = useMemo(() => {
    let result = items;
    if (category !== 'All') result = result.filter(item => item.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.requirements.some(r => r.item.toLowerCase().includes(q))
      );
    }
    return [...result].sort((a, b) => {
      const cmp = a[sortField].toLowerCase().localeCompare(b[sortField].toLowerCase());
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [search, category, sortField, sortDir]);

  const sidebar = (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Search</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Items, locations, materials…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Category</label>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map(cat => {
            const icon = cat === 'All' ? '🗂️' : CATEGORY_ICONS[cat] ?? '📦';
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-600/30 border border-indigo-500/60 text-indigo-200'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border border-transparent'
                }`}
              >
                <span>{icon}</span>
                <span>{cat === 'All' ? 'All Categories' : cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Sort By</label>
        <div className="flex flex-col gap-1">
          {(['name', 'category', 'location'] as SortField[]).map(field => {
            const labels: Record<SortField, string> = { name: 'Name', category: 'Category', location: 'Unlock / Location' };
            const isActive = sortField === field;
            return (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600/30 border border-indigo-500/60 text-indigo-200'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border border-transparent'
                }`}
              >
                <span>{labels[field]}</span>
                {isActive && <span className="text-indigo-300 text-xs">{sortDir === 'asc' ? '↑ A–Z' : '↓ Z–A'}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear */}
      {active && (
        <button
          onClick={clearFilters}
          className="w-full text-xs text-red-400 hover:text-red-300 py-1.5 border border-red-900/40 rounded-lg hover:bg-red-900/10 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Crafting Recipes</h2>
        <p className="text-gray-400 text-sm">
          {items.length} craftable items across {CATEGORIES.length - 1} categories.{' '}
          Data from{' '}
          <a href="https://www.serebii.net/pokemonpokopia/crafting.shtml" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
            Serebii
          </a>.
        </p>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/60 rounded-xl border border-gray-700/50 text-sm text-gray-300"
        >
          <span className="flex items-center gap-2">
            <span>🔽</span>
            Filters &amp; Sort
            {active && (
              <span className="ml-1 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">Active</span>
            )}
          </span>
          <span className="text-gray-500">{sidebarOpen ? '▲' : '▼'}</span>
        </button>
        {sidebarOpen && (
          <div className="mt-2 bg-gray-900/80 rounded-2xl border border-gray-700/50 p-4">
            {sidebar}
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-6 bg-gray-900/80 rounded-2xl border border-gray-700/50 p-4">
            {sidebar}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-400 mb-4">
            Showing <span className="text-white font-semibold">{filtered.length}</span> of {items.length} items
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
              <span className="text-4xl">🔨</span>
              <p className="text-lg font-medium">No items match your filters</p>
              <button onClick={clearFilters} className="text-sm text-indigo-400 hover:text-indigo-300">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((item, idx) => (
                <CraftingCard key={`${item.name}-${idx}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
function CraftingCard({ item }: { item: CraftingItem }) {
  const [imgError, setImgError] = useState(false);
  const style = CATEGORY_COLORS[item.category] ?? DEFAULT_STYLE;
  const icon = CATEGORY_ICONS[item.category] ?? '📦';

  return (
    <div className={`flex flex-col rounded-2xl border overflow-hidden ${style.border} bg-gray-900/80`}>
      {/* Image area */}
      <div className={`flex items-center justify-center pt-6 pb-3 ${style.bg}`}>
        {item.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-20 h-20 object-contain drop-shadow-lg"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-5xl select-none">{icon}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <h3 className="font-semibold text-gray-100 text-sm leading-tight">{item.name}</h3>

        <span className={`self-start inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${style.badge}`}>
          <span>{icon}</span>
          {item.category}
        </span>

        {item.location && (
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${style.text}`}>Unlock</p>
            <p className="text-xs text-gray-300 leading-snug">{item.location}</p>
          </div>
        )}

        {item.requirements.length > 0 && (
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${style.text}`}>Materials</p>
            <div className="flex flex-wrap gap-1">
              {item.requirements.map((req, i) => (
                <MaterialChip key={i} name={req.item} quantity={req.quantity} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Material chip with small Serebii icon
// ---------------------------------------------------------------------------
function MaterialChip({ name, quantity }: { name: string; quantity: number }) {
  const [imgError, setImgError] = useState(false);
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const imgUrl = `https://www.serebii.net/pokemonpokopia/items/${slug}.png`;

  return (
    <span className="inline-flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1 text-xs text-gray-200">
      {!imgError && (
        <img
          src={imgUrl}
          alt={name}
          className="w-5 h-5 object-contain"
          onError={() => setImgError(true)}
        />
      )}
      {name} <span className="text-gray-400">×{quantity}</span>
    </span>
  );
}
