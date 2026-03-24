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

function ChipButton({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-100 font-medium
        ${active
          ? 'border-indigo-500 bg-indigo-600/30 text-indigo-200'
          : 'border-gray-600/50 bg-gray-800/50 text-gray-400 hover:border-gray-500 hover:text-gray-200'
        }`}
    >
      {children}
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
            <ChipButton
              key={r}
              active={filters.rarity === r}
              onClick={() => onChange({ ...filters, rarity: filters.rarity === r ? '' : r })}
            >
              {RARITY_ICONS[r]} {r}
            </ChipButton>
          ))}
        </div>
      </div>

      {/* Ideal Habitat */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Ideal Habitat
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_HABITATS.map((h) => (
            <ChipButton
              key={h}
              active={filters.idealHabitat === h}
              onClick={() => onChange({ ...filters, idealHabitat: filters.idealHabitat === h ? '' : h })}
            >
              {HABITAT_ICONS[h]} {h}
            </ChipButton>
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
            <ChipButton key={t} active={filters.types.includes(t)} onClick={() => toggleType(t)}>
              {t}
            </ChipButton>
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
            <ChipButton key={t} active={filters.times.includes(t)} onClick={() => toggleTime(t)}>
              {TIME_ICONS[t]} {t}
            </ChipButton>
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
            <ChipButton key={w} active={filters.weather.includes(w)} onClick={() => toggleWeather(w)}>
              {WEATHER_ICONS[w]} {w}
            </ChipButton>
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
            <ChipButton key={s} active={filters.specialties.includes(s)} onClick={() => toggleSpecialty(s)}>
              {s}
            </ChipButton>
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
