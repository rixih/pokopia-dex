import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RECIPES, COOKING_EQUIPMENT, type CookingRecipe, type RecipeType, type Flavor } from '../data/cooking';

// ─── Style maps ────────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<RecipeType, { bg: string; border: string; badge: string; text: string; icon: string; move: string }> = {
  Salad: {
    bg: 'bg-emerald-900/30', border: 'border-emerald-700/40',
    badge: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50', text: 'text-emerald-400',
    icon: '🥗', move: 'Leafage',
  },
  Soup: {
    bg: 'bg-blue-900/30', border: 'border-blue-700/40',
    badge: 'bg-blue-900/50 text-blue-300 border-blue-700/50', text: 'text-blue-400',
    icon: '🍲', move: 'Water Gun',
  },
  Bread: {
    bg: 'bg-amber-900/30', border: 'border-amber-700/40',
    badge: 'bg-amber-900/50 text-amber-300 border-amber-700/50', text: 'text-amber-400',
    icon: '🍞', move: 'Cut',
  },
  Steak: {
    bg: 'bg-red-900/30', border: 'border-red-700/40',
    badge: 'bg-red-900/50 text-red-300 border-red-700/50', text: 'text-red-400',
    icon: '🥩', move: 'Rock Smash',
  },
};

const FLAVOR_STYLES: Record<string, string> = {
  Sweet:  'bg-pink-900/50 text-pink-300 border-pink-700/50',
  Spicy:  'bg-orange-900/50 text-orange-300 border-orange-700/50',
  Dry:    'bg-indigo-900/50 text-indigo-300 border-indigo-700/50',
  Bitter: 'bg-lime-900/50 text-lime-300 border-lime-700/50',
  Sour:   'bg-yellow-900/50 text-yellow-300 border-yellow-700/50',
};

const FLAVOR_ICONS: Record<string, string> = {
  Sweet: '🍬', Spicy: '🌶️', Dry: '🫙', Bitter: '🍵', Sour: '🍋',
};

const ALL_TYPES: RecipeType[] = ['Salad', 'Soup', 'Bread', 'Steak'];
const ALL_FLAVORS: Flavor[] = ['Sweet', 'Spicy', 'Dry', 'Bitter', 'Sour'];

// Ingredient slug → Serebii image URL
function ingredientImageUrl(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://www.serebii.net/pokemonpokopia/items/${slug}.png`;
}

// ─── Equipment tooltip — portal-rendered to escape card overflow:hidden ────────
function EquipmentChip({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const eq = COOKING_EQUIPMENT[name];

  const show = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.top, left: r.left + r.width / 2 });
    }
    setOpen(true);
  };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <span className="relative inline-block">
      <button
        ref={btnRef}
        onClick={show}
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        className="text-xs px-2 py-0.5 rounded-md border bg-slate-800/80 border-slate-600/50 text-slate-200 hover:border-indigo-500/60 hover:text-indigo-200 transition-colors cursor-pointer"
      >
        {name}
      </button>

      {open && eq && createPortal(
        <div
          className="fixed z-[9999] w-52 bg-gray-900 border border-gray-700/60 rounded-xl shadow-2xl p-3 pointer-events-none"
          style={{ top: pos.top - 8, left: pos.left, transform: 'translate(-50%, -100%)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <img src={eq.imageUrl} alt={eq.name} className="w-10 h-10 object-contain" />
            <div>
              <p className="text-sm font-semibold text-white leading-tight">{eq.name}</p>
              <p className="text-xs text-gray-400 leading-tight">{eq.location}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Craft with</p>
            <div className="flex flex-wrap gap-1">
              {eq.requirements.map((r, i) => (
                <span key={i} className="text-xs bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 text-gray-300">
                  {r.item} ×{r.quantity}
                </span>
              ))}
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-700/60" />
        </div>,
        document.body
      )}
    </span>
  );
}

// ─── Ingredient chip ───────────────────────────────────────────────────────────
function IngredientChip({ name }: { name: string }) {
  const [imgError, setImgError] = useState(false);
  return (
    <span className="inline-flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-0.5 text-xs text-gray-200">
      {!imgError && (
        <img
          src={ingredientImageUrl(name)}
          alt={name}
          className="w-4 h-4 object-contain"
          onError={() => setImgError(true)}
        />
      )}
      {name}
    </span>
  );
}

// ─── Recipe card ───────────────────────────────────────────────────────────────
function RecipeCard({ recipe }: { recipe: CookingRecipe }) {
  const [imgError, setImgError] = useState(false);
  const s = TYPE_STYLES[recipe.type];

  return (
    <div className={`flex flex-col rounded-2xl border overflow-hidden backdrop-blur-sm ${s.border} bg-slate-900/60 hover:bg-slate-800/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`}>
      {/* Image area */}
      <div className={`flex items-center justify-center pt-6 pb-3 relative ${s.bg}`}>
        {!imgError ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-20 h-20 object-contain drop-shadow-lg"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-5xl select-none">{s.icon}</span>
        )}
        {/* Flavor badge top-right */}
        {recipe.flavor && (
          <span className={`absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full border font-medium ${FLAVOR_STYLES[recipe.flavor]}`}>
            {FLAVOR_ICONS[recipe.flavor]} {recipe.flavor}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <h3 className="font-semibold text-gray-100 text-sm leading-tight capitalize">{recipe.name}</h3>

        {/* Type + move effect */}
        <div className="flex flex-wrap gap-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${s.badge}`}>
            {s.icon} {recipe.type}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-purple-900/40 border-purple-700/40 text-purple-300">
            ⚡ {recipe.moveEffect}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-snug">{recipe.description}</p>

        {/* Ingredients */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${s.text}`}>Ingredients</p>
          <div className="flex flex-wrap gap-1">
            {recipe.ingredients.map(ing => (
              <IngredientChip key={ing} name={ing} />
            ))}
          </div>
        </div>

        {/* Required specialty */}
        {recipe.requiredSpecialty && (
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${s.text}`}>Specialty Needed</p>
            <span className="text-xs px-2.5 py-1 rounded-lg border bg-indigo-900/40 border-indigo-700/50 text-indigo-200 font-semibold">
              {recipe.requiredSpecialty}
            </span>
          </div>
        )}

        {/* Equipment */}
        <div className="mt-auto pt-1">
          <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${s.text}`}>Equipment</p>
          <div className="flex flex-wrap gap-1">
            {recipe.equipment.map(eq => (
              <EquipmentChip key={eq} name={eq} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function CookingDex() {
  const [search, setSearch] = useState('');
  const [activeTypes, setActiveTypes] = useState<RecipeType[]>([]);
  const [activeFlavors, setActiveFlavors] = useState<Flavor[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleType = (t: RecipeType) =>
    setActiveTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleFlavor = (f: Flavor) =>
    setActiveFlavors(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const clearFilters = () => { setSearch(''); setActiveTypes([]); setActiveFlavors([]); };
  const hasFilters = search !== '' || activeTypes.length > 0 || activeFlavors.length > 0;

  const filtered = useMemo(() => {
    let result = RECIPES;
    if (activeTypes.length > 0) result = result.filter(r => activeTypes.includes(r.type));
    if (activeFlavors.length > 0) result = result.filter(r => r.flavor !== null && activeFlavors.includes(r.flavor));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.toLowerCase().includes(q)) ||
        (r.flavor?.toLowerCase().includes(q) ?? false) ||
        (r.requiredSpecialty?.toLowerCase().includes(q) ?? false)
      );
    }
    return result;
  }, [search, activeTypes, activeFlavors]);

  const sidebar = (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Search</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Recipe, ingredient, flavor…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {/* Type filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Type</label>
        <div className="flex flex-col gap-1">
          {ALL_TYPES.map(t => {
            const s = TYPE_STYLES[t];
            const active = activeTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left border ${
                  active ? `${s.bg} ${s.border} ${s.text}` : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border-transparent'
                }`}
              >
                <span>{s.icon}</span>
                <span>{t}</span>
                <span className="ml-auto text-xs opacity-60">{RECIPES.filter(r => r.type === t).length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Flavor filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Flavor</label>
        <div className="flex flex-col gap-1">
          {ALL_FLAVORS.map(f => {
            const active = activeFlavors.includes(f);
            const style = FLAVOR_STYLES[f!];
            return (
              <button
                key={f}
                onClick={() => toggleFlavor(f)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left border ${
                  active ? `${style} border-current` : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border-transparent'
                }`}
              >
                <span>{FLAVOR_ICONS[f!]}</span>
                <span>{f}</span>
                <span className="ml-auto text-xs opacity-60">{RECIPES.filter(r => r.flavor === f).length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {hasFilters && (
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
        <h2 className="text-2xl font-bold text-white mb-1">Cooking Recipes</h2>
        <p className="text-gray-400 text-sm">
          All {RECIPES.length} recipes across {ALL_TYPES.length} types. Hover any equipment name to see crafting requirements.
        </p>
      </div>

      {/* Move effect legend */}
      <div className="flex flex-wrap gap-2">
        {ALL_TYPES.map(t => {
          const s = TYPE_STYLES[t];
          return (
            <div key={t} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${s.bg} ${s.border} ${s.text}`}>
              <span>{s.icon}</span>
              <span>{t}</span>
              <span className="text-gray-500 mx-1">→</span>
              <span className="text-purple-300">⚡ {s.move}</span>
            </div>
          );
        })}
      </div>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/60 rounded-xl border border-gray-700/50 text-sm text-gray-300"
        >
          <span className="flex items-center gap-2">
            <span>🔽</span>
            Filters
            {hasFilters && <span className="ml-1 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">Active</span>}
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
            Showing <span className="text-white font-semibold">{filtered.length}</span> of {RECIPES.length} recipes
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
              <span className="text-4xl">👨‍🍳</span>
              <p className="text-lg font-medium">No recipes match your filters</p>
              <button onClick={clearFilters} className="text-sm text-indigo-400 hover:text-indigo-300">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(recipe => (
                <RecipeCard key={recipe.slug} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
