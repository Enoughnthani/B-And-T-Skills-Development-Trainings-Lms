import { apiFetch } from '@/api/api';
import { useEffect, useState } from 'react';
import {
  FaAward,
  FaBook,
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTools,
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const EMPTY_STATS = {
  total: 0,
  knowledge: 0,
  practical: 0,
  workExperience: 0,
  active: 0,
  phasedOut: 0,
  totalCredits: 0,
  notionalHours: 0,
};

const CARDS = [
  {
    key: 'total',
    label: 'Total modules',
    icon: FaBook,
    accent: true,
  },
  {
    key: 'knowledge',
    label: 'Knowledge',
    icon: FaBook,
    percent: true,
  },
  {
    key: 'practical',
    label: 'Practical skills',
    icon: FaTools,
    percent: true,
  },
  {
    key: 'workExperience',
    label: 'Work experience',
    icon: FaBriefcase,
    percent: true,
  },
  {
    key: 'totalCredits',
    label: 'Total credits',
    icon: FaAward,
    dark: true,
  },
];

export default function UnitStandardsStats({ refreshKey = 0 }) {
  const { programId } = useParams();
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!programId) return;
    load();
  }, [programId, refreshKey]);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch(
        `/api/unit-standards/program/${programId}/stats`
      );
      const payload = result;
      if (!payload) return;

      setStats({
        total: payload.total || 0,
        knowledge: payload.knowledge || 0,
        practical: payload.practical || 0,
        workExperience: payload.workExperience || 0,
        active: payload.active || 0,
        phasedOut: payload.phasedOut || 0,
        totalCredits: payload.totalCredits || 0,
        notionalHours: payload.notionalHours || 0,
      });
    } catch {
      // keep zeros on error
    } finally {
      setLoading(false);
    }
  }

  function getPercentage(value) {
    return stats.total ? `${(value / stats.total) * 100}%` : '0%';
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 sm:mb-8">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const isDark = card.dark;
        const isAccent = card.accent;
        const value = stats[card.key] || 0;
        const percent = card.percent ? getPercentage(value) : null;

        return (
          <div
            key={card.key}
            className={`rounded-xl p-4 border ${
              isDark ? 'bg-zinc-900 border-zinc-900' : 'bg-white border-zinc-200'
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
              {loading ? '—' : value}
            </p>

            {percent && !loading && (
              <div
                className={`w-full rounded-full h-1 mt-2 ${
                  isDark ? 'bg-zinc-800' : 'bg-zinc-100'
                }`}
              >
                <div
                  className={`h-1 rounded-full transition-all ${
                    isAccent ? 'bg-[#E30613]' : 'bg-zinc-900'
                  }`}
                  style={{ width: percent }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}