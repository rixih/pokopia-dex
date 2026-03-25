import type { FilterState, IdealHabitat, PokemonType, Rarity, TimeOfDay, Weather } from '../types/pokemon';

const ALL_TYPES: PokemonType[] = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
];

const ALL_HABITATS: IdealHabitat[] = ['Bright', 'Warm', 'Humid', 'Dry', 'Dark', 'Cool'];

const HABITAT_ICONS: Record<string, string> = {
  Bright: '☀️', Warm: '🔥', Humid: '💧', Dry: '🏜️', Dark: '🌙', Cool: '❄️',
};

const ALL_TIMES: TimeOfDay[] = ['Morning', 'Day', 'Evening', 'Night'];
const TIME_ICONS: Record<TimeOfDay, string> = {
  Morning: '🌅', Day: '🌤️', Evening: '🌆', Night: '🌙',
};

const ALL_WEATHER: Weather[] = ['Sunny', 'Cloudy', 'Rainy'];
const WEATHER_ICONS: Record<Weather, string> = {
  Sunny: '☀️', Cloudy: '☁️', Rainy: '🌧️',
};

const ALL_RARITIES: Rarity[] = ['Common', 'Rare', 'Very Rare', 'Legendary'];
const RARITY_ICONS: Record<string, string> = {
  Common: '⚪', Rare: '🔵', 'Very Rare': '🟣', Legendary: '⭐',
};

const ALL_SPECIALTIES = [
  'Appraise', 'Build', 'Bulldoze', 'Burn', 'Chop', 'Collect', 'Crush', 'DJ',
  'Dream Island', 'Engineer', 'Explode', 'Fly', 'Gather', 'Gather Honey', 'Generate',
  'Grow', 'Hype', 'Illuminate', 'Litter', 'Paint', 'Party', 'Rarify', 'Recycle',
  'Search', 'Storage', 'Teleport', 'Trade', 'Transform', 'Water', 'Yawn',
];

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}


const TYPE_CHIP_COLORS: Record<string, { active: string; hover: string }> = {
  Normal:   { active: 'border-gray-400 bg-gray-400/20 text-gray-200',     hover: 'hover:border-gray-400/60 hover:bg-gray-400/10 hover:text-gray-200' },
  Fire:     { active: 'border-orange-500 bg-orange-500/20 text-orange-200', hover: 'hover:border-orange-500/60 hover:bg-orange-500/10 hover:text-orange-200' },
  Water:    { active: 'border-blue-500 bg-blue-500/20 text-blue-200',      hover: 'hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-blue-200' },
  Electric: { active: 'border-yellow-400 bg-yellow-400/20 text-yellow-200', hover: 'hover:border-yellow-400/60 hover:bg-yellow-400/10 hover:text-yellow-200' },
  Grass:    { active: 'border-green-500 bg-green-500/20 text-green-200',   hover: 'hover:border-green-500/60 hover:bg-green-500/10 hover:text-green-200' },
  Ice:      { active: 'border-cyan-300 bg-cyan-300/20 text-cyan-200',      hover: 'hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-200' },
  Fighting: { active: 'border-red-600 bg-red-600/20 text-red-200',         hover: 'hover:border-red-600/60 hover:bg-red-600/10 hover:text-red-200' },
  Poison:   { active: 'border-purple-500 bg-purple-500/20 text-purple-200', hover: 'hover:border-purple-500/60 hover:bg-purple-500/10 hover:text-purple-200' },
  Ground:   { active: 'border-amber-600 bg-amber-600/20 text-amber-200',   hover: 'hover:border-amber-600/60 hover:bg-amber-600/10 hover:text-amber-200' },
  Flying:   { active: 'border-sky-400 bg-sky-400/20 text-sky-200',         hover: 'hover:border-sky-400/60 hover:bg-sky-400/10 hover:text-sky-200' },
  Psychic:  { active: 'border-pink-500 bg-pink-500/20 text-pink-200',      hover: 'hover:border-pink-500/60 hover:bg-pink-500/10 hover:text-pink-200' },
  Bug:      { active: 'border-lime-500 bg-lime-500/20 text-lime-200',      hover: 'hover:border-lime-500/60 hover:bg-lime-500/10 hover:text-lime-200' },
  Rock:     { active: 'border-stone-400 bg-stone-400/20 text-stone-200',   hover: 'hover:border-stone-400/60 hover:bg-stone-400/10 hover:text-stone-200' },
  Ghost:    { active: 'border-indigo-500 bg-indigo-500/20 text-indigo-200', hover: 'hover:border-indigo-500/60 hover:bg-indigo-500/10 hover:text-indigo-200' },
  Dragon:   { active: 'border-violet-500 bg-violet-500/20 text-violet-200', hover: 'hover:border-violet-500/60 hover:bg-violet-500/10 hover:text-violet-200' },
  Dark:     { active: 'border-neutral-500 bg-neutral-500/20 text-neutral-200', hover: 'hover:border-neutral-500/60 hover:bg-neutral-500/10 hover:text-neutral-200' },
  Steel:    { active: 'border-slate-400 bg-slate-400/20 text-slate-200',   hover: 'hover:border-slate-400/60 hover:bg-slate-400/10 hover:text-slate-200' },
  Fairy:    { active: 'border-rose-400 bg-rose-400/20 text-rose-200',      hover: 'hover:border-rose-400/60 hover:bg-rose-400/10 hover:text-rose-200' },
};

const RARITY_CHIP_COLORS: Record<string, { active: string; hover: string }> = {
  Common:     { active: 'border-gray-400 bg-gray-400/20 text-gray-200',     hover: 'hover:border-gray-400/60 hover:bg-gray-400/10 hover:text-gray-200' },
  Rare:       { active: 'border-blue-500 bg-blue-500/20 text-blue-200',     hover: 'hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-blue-200' },
  'Very Rare':{ active: 'border-violet-500 bg-violet-500/20 text-violet-200', hover: 'hover:border-violet-500/60 hover:bg-violet-500/10 hover:text-violet-200' },
  Legendary:  { active: 'border-yellow-400 bg-yellow-400/20 text-yellow-200', hover: 'hover:border-yellow-400/60 hover:bg-yellow-400/10 hover:text-yellow-200' },
};

const HABITAT_CHIP_COLORS: Record<string, { active: string; hover: string }> = {
  Bright: { active: 'border-yellow-500 bg-yellow-500/20 text-yellow-200', hover: 'hover:border-yellow-500/60 hover:bg-yellow-500/10 hover:text-yellow-200' },
  Warm:   { active: 'border-orange-500 bg-orange-500/20 text-orange-200', hover: 'hover:border-orange-500/60 hover:bg-orange-500/10 hover:text-orange-200' },
  Humid:  { active: 'border-teal-500 bg-teal-500/20 text-teal-200',       hover: 'hover:border-teal-500/60 hover:bg-teal-500/10 hover:text-teal-200' },
  Dry:    { active: 'border-amber-600 bg-amber-600/20 text-amber-200',    hover: 'hover:border-amber-600/60 hover:bg-amber-600/10 hover:text-amber-200' },
  Dark:   { active: 'border-violet-600 bg-violet-600/20 text-violet-200', hover: 'hover:border-violet-600/60 hover:bg-violet-600/10 hover:text-violet-200' },
  Cool:   { active: 'border-sky-500 bg-sky-500/20 text-sky-200',          hover: 'hover:border-sky-500/60 hover:bg-sky-500/10 hover:text-sky-200' },
};

const TIME_CHIP_COLORS: Record<string, { active: string; hover: string }> = {
  Morning: { active: 'border-orange-400 bg-orange-400/20 text-orange-200', hover: 'hover:border-orange-400/60 hover:bg-orange-400/10 hover:text-orange-200' },
  Day:     { active: 'border-yellow-400 bg-yellow-400/20 text-yellow-200', hover: 'hover:border-yellow-400/60 hover:bg-yellow-400/10 hover:text-yellow-200' },
  Evening: { active: 'border-red-400 bg-red-400/20 text-red-200',          hover: 'hover:border-red-400/60 hover:bg-red-400/10 hover:text-red-200' },
  Night:   { active: 'border-indigo-400 bg-indigo-400/20 text-indigo-200', hover: 'hover:border-indigo-400/60 hover:bg-indigo-400/10 hover:text-indigo-200' },
};

const WEATHER_CHIP_COLORS: Record<string, { active: string; hover: string }> = {
  Sunny:  { active: 'border-yellow-400 bg-yellow-400/20 text-yellow-200', hover: 'hover:border-yellow-400/60 hover:bg-yellow-400/10 hover:text-yellow-200' },
  Cloudy: { active: 'border-slate-400 bg-slate-400/20 text-slate-200',    hover: 'hover:border-slate-400/60 hover:bg-slate-400/10 hover:text-slate-200' },
  Rainy:  { active: 'border-blue-400 bg-blue-400/20 text-blue-200',       hover: 'hover:border-blue-400/60 hover:bg-blue-400/10 hover:text-blue-200' },
};

const SPECIALTY_COLORS = {
  active: 'border-teal-500 bg-teal-500/20 text-teal-200',
  hover:  'hover:border-teal-500/60 hover:bg-teal-500/10 hover:text-teal-200',
};

function ColorChipButton({
  label, active, onClick, colors, icon,
}: { label: string; active: boolean; onClick: () => void; colors: { active: string; hover: string }; icon?: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-100 font-medium
        ${active
          ? colors.active
          : `border-gray-600/50 bg-gray-800/50 text-gray-400 ${colors.hover}`
        }`}
    >
      {icon ? `${icon} ${label}` : label}
    </button>
  );
}

function TypeChipButton({
  type, active, onClick,
}: { type: string; active: boolean; onClick: () => void }) {
  const colors = TYPE_CHIP_COLORS[type] ?? { active: 'border-indigo-500 bg-indigo-600/30 text-indigo-200', hover: 'hover:border-gray-500 hover:text-gray-200' };
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-100 font-medium
        ${active
          ? colors.active
          : `border-gray-600/50 bg-gray-800/50 text-gray-400 ${colors.hover}`
        }`}
    >
      {type}
    </button>
  );
}

export function FilterBar({ filters, onChange, onClear, hasActiveFilters }: FilterBarProps) {
  function toggleType(t: PokemonType) {
    const types = filters.types.includes(t)
      ? filters.types.filter((x) => x !== t)
      : [...filters.types, t];
    onChange({ ...filters, types });
  }

  function toggleTime(t: TimeOfDay) {
    const times = filters.times.includes(t)
      ? filters.times.filter((x) => x !== t)
      : [...filters.times, t];
    onChange({ ...filters, times });
  }

  function toggleWeather(w: Weather) {
    const weather = filters.weather.includes(w)
      ? filters.weather.filter((x) => x !== w)
      : [...filters.weather, w];
    onChange({ ...filters, weather });
  }

  function toggleSpecialty(s: string) {
    const specialties = filters.specialties.includes(s)
      ? filters.specialties.filter((x) => x !== s)
      : [...filters.specialties, s];
    onChange({ ...filters, specialties });
  }

  return (
    <aside className="flex flex-col gap-5 w-full">
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Search
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Pokémon name..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700/50 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* Rarity */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Rarity
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_RARITIES.map((r) => (
            <ColorChipButton
              key={r}
              label={r}
              icon={RARITY_ICONS[r]}
              active={filters.rarity === r}
              onClick={() => onChange({ ...filters, rarity: filters.rarity === r ? '' : r })}
              colors={RARITY_CHIP_COLORS[r] ?? { active: 'border-indigo-500 bg-indigo-600/30 text-indigo-200', hover: 'hover:border-gray-500 hover:text-gray-200' }}
            />
          ))}
          <ColorChipButton
            label="NPC"
            icon="✦"
            active={filters.uniqueOnly}
            onClick={() => onChange({ ...filters, uniqueOnly: !filters.uniqueOnly })}
            colors={{ active: 'border-violet-500 bg-violet-500/20 text-violet-200', hover: 'hover:border-violet-500/60 hover:bg-violet-500/10 hover:text-violet-200' }}
          />
        </div>
      </div>

      {/* Ideal Habitat */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Ideal Habitat
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_HABITATS.map((h) => (
            <ColorChipButton
              key={h}
              label={h}
              icon={HABITAT_ICONS[h]}
              active={filters.idealHabitat === h}
              onClick={() => onChange({ ...filters, idealHabitat: filters.idealHabitat === h ? '' : h })}
              colors={HABITAT_CHIP_COLORS[h] ?? { active: 'border-indigo-500 bg-indigo-600/30 text-indigo-200', hover: 'hover:border-gray-500 hover:text-gray-200' }}
            />
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TYPES.map((t) => (
            <TypeChipButton key={t} type={t} active={filters.types.includes(t)} onClick={() => toggleType(t)} />
          ))}
        </div>
      </div>

      {/* Time of Day */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Time of Day
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TIMES.map((t) => (
            <ColorChipButton
              key={t}
              label={t}
              icon={TIME_ICONS[t]}
              active={filters.times.includes(t)}
              onClick={() => toggleTime(t)}
              colors={TIME_CHIP_COLORS[t] ?? { active: 'border-indigo-500 bg-indigo-600/30 text-indigo-200', hover: 'hover:border-gray-500 hover:text-gray-200' }}
            />
          ))}
        </div>
      </div>

      {/* Weather */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Weather
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_WEATHER.map((w) => (
            <ColorChipButton
              key={w}
              label={w}
              icon={WEATHER_ICONS[w]}
              active={filters.weather.includes(w)}
              onClick={() => toggleWeather(w)}
              colors={WEATHER_CHIP_COLORS[w] ?? { active: 'border-indigo-500 bg-indigo-600/30 text-indigo-200', hover: 'hover:border-gray-500 hover:text-gray-200' }}
            />
          ))}
        </div>
      </div>

      {/* Specialty */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Specialty
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SPECIALTIES.map((s) => (
            <ColorChipButton
              key={s}
              label={s}
              active={filters.specialties.includes(s)}
              onClick={() => toggleSpecialty(s)}
              colors={SPECIALTY_COLORS}
            />
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="text-sm text-red-400 hover:text-red-300 border border-red-800/40 hover:border-red-700/60 rounded-lg py-2 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
