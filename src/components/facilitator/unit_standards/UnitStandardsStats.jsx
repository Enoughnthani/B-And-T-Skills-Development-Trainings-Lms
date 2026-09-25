import { FaAward, FaDatabase, FaStar } from 'react-icons/fa';

export default function UnitStandardsStats({ stats }) {
  function getPercentage(value) {
    return stats.total ? `${(value / stats.total) * 100}%` : '0%';
  }

  const cards = [
    {
      label: 'Total units',
      value: stats.total,
      icon: FaDatabase,
    },
    {
      label: 'Fundamental',
      value: stats.fundamental,
      icon: FaStar,
      percent: getPercentage(stats.fundamental),
    },
    {
      label: 'Core',
      value: stats.core,
      icon: FaAward,
      percent: getPercentage(stats.core),
      accent: true,
    },
    {
      label: 'Elective',
      value: stats.elective,
      icon: FaStar,
      percent: getPercentage(stats.elective),
    },
    {
      label: 'Total credits',
      value: stats.totalCredits,
      icon: FaAward,
      dark: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 sm:mb-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const isDark = card.dark;
        const isAccent = card.accent;

        return (
          <div
            key={i}
            className={`rounded-xl p-4 border ${
              isDark
                ? 'bg-zinc-900 border-zinc-900'
                : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2 gap-2">
              <p
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate ${
                  isDark
                    ? 'text-zinc-400'
                    : isAccent
                    ? 'text-[#E30613]'
                    : 'text-zinc-500'
                }`}
              >
                {card.label}
              </p>
              <Icon
                size={12}
                className={
                  isDark
                    ? 'text-zinc-500 shrink-0'
                    : isAccent
                    ? 'text-[#E30613] shrink-0'
                    : 'text-zinc-400 shrink-0'
                }
              />
            </div>

            <p
              className={`text-2xl font-extrabold tabular-nums ${
                isDark
                  ? 'text-white'
                  : isAccent
                  ? 'text-[#E30613]'
                  : 'text-zinc-900'
              }`}
            >
              {card.value}
            </p>

            {card.percent && (
              <div
                className={`w-full rounded-full h-1 mt-2 ${
                  isDark ? 'bg-zinc-800' : 'bg-zinc-100'
                }`}
              >
                <div
                  className={`h-1 rounded-full transition-all ${
                    isAccent ? 'bg-[#E30613]' : 'bg-zinc-900'
                  }`}
                  style={{ width: card.percent }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}