import { HABITAT_STYLES, HABITAT_SCENES } from './HabitatBadge';

interface HabitatCardProps {
  number: number | string;
  name: string;
  category: string;
  requirements: string[];
  pokemon: string[];
  imageUrl?: string;
  onClick?: () => void;
}

export function HabitatCard({ number, name, category, requirements, pokemon, imageUrl, onClick }: HabitatCardProps) {
  const style = HABITAT_STYLES[category] ?? HABITAT_STYLES['Bright'];
  const scene = HABITAT_SCENES[category] ?? HABITAT_SCENES['Bright'];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      className={`rounded-2xl border overflow-hidden flex flex-col transition-all duration-150 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:brightness-110 ${style.bg} ${style.border}`}
    >
      {/* Scene banner — photo when available, CSS gradient fallback */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${name} habitat`}
          className="w-full object-contain"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      ) : null}
      <div
        className={`relative h-16 overflow-hidden ${scene.gradient}`}
        style={imageUrl ? { display: 'none' } : undefined}
      >
        {scene.deco.map((d, i) => (
          <span key={i} className={d.style}>{d.emoji}</span>
        ))}
      </div>

      {/* Card header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${style.border}`}>
        <span className="text-2xl">{style.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold leading-tight ${style.text}`}>{name}</p>
          <p className="text-xs text-gray-500 font-mono mt-0.5">Habitat #{number}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
          {category}
        </span>
      </div>

      {/* Requirements */}
      <div className="px-4 py-3 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">🧱 Build with</p>
        <div className="flex flex-wrap gap-1.5">
          {requirements.map((req) => (
            <span
              key={req}
              className="text-xs bg-gray-900/70 border border-gray-700/60 text-gray-300 px-2 py-0.5 rounded-md"
            >
              {req}
            </span>
          ))}
        </div>
      </div>

      {/* Pokémon count teaser */}
      {pokemon.length > 0 && (
        <div className={`px-4 py-2.5 border-t ${style.border} flex items-center gap-2`}>
          <span className="text-xs text-gray-400">🐾</span>
          <span className="text-xs text-gray-400">
            {pokemon.length} Pokémon — <span className={`font-medium ${style.text}`}>tap to explore</span>
          </span>
        </div>
      )}
    </div>
  );
}
