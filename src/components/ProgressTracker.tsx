interface ProgressTrackerProps {
  found: number;
  total: number;
  label?: string;
}

export function ProgressTracker({ found, total, label = 'Pokémon found' }: ProgressTrackerProps) {
  const pct = total > 0 ? Math.round((found / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-400">
          <span className="text-white font-bold">{found}</span>
          <span className="text-gray-500"> / {total}</span>
          <span className="text-gray-500 ml-2">({pct}%)</span>
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
