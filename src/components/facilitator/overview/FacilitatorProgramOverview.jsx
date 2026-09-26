import { apiFetch } from '@/api/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  FaBook,
  FaClipboardList,
  FaUsers,
} from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function FacilitatorProgramOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { programId } = useParams();

  const [program, setProgram] = useState(location?.state?.program || null);
  const [stats, setStats] = useState({
    totalLearners: 0,
    activeLearners: 0,
    totalUnitStandards: 0,
    totalAssessments: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (program?.id) {
      fetchProgramStats();
      fetchRecentActivities();
    }
  }, [program]);

  useEffect(() => {
    if (!program) loadProgram();
  }, [programId]);

  async function loadProgram() {
    try {
      const data = await apiFetch(`/api/programs/${programId}`);
      if (data?.payload) setProgram(data.payload);
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  async function fetchProgramStats() {
    try {
      const data = await apiFetch(`/api/programs/${program.id}/stats`);
      if (data?.payload) setStats(data.payload);
    } catch {
      // ignore
    }
  }

  async function fetchRecentActivities() {
    try {
      const data = await apiFetch(
        `/api/activities/program/${program.id}?limit=5`
      );
      setRecentActivities(data?.payload || data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  function getProgramType() {
    if (program?.category === 'LEARNERSHIP') return 'Learnership';
    if (program?.category === 'INTERNSHIP') return 'Internship';
    return 'Short Course';
  }

  function formatRelative(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMin = Math.floor((now - date) / 60000);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  if (loading && !program) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-[#E30613]" />
          <p className="mt-3 text-sm text-zinc-500">Loading programme…</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: 'Total learners',
      value: stats.totalLearners,
      sub: `${stats.activeLearners || 0} active`,
      icon: FaUsers,
      accent: true,
    },
    {
      label: 'Unit standards',
      value: stats.totalUnitStandards,
      sub: 'In this programme',
      icon: FaBook,
    },
    {
      label: 'Assessments',
      value: stats.totalAssessments,
      sub: 'Scheduled',
      icon: FaClipboardList,
    },
  ];

  const quickActions = [
    {
      label: 'Create unit standard',
      description: 'Add a new SAQA unit standard to this programme.',
      icon: FaBook,
      onClick: () =>
        navigate('unit-standards/new', { state: { program } }),
    },
    {
      label: 'View learners',
      description: 'See learners enrolled in this programme.',
      icon: FaUsers,
      onClick: () => navigate('learners', { state: { program } }),
    },
    {
      label: 'View activities',
      description: 'See everything happening in this programme.',
      icon: FaClipboardList,
      onClick: () => navigate('activities', { state: { program } }),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#E30613] tracking-[0.15em] uppercase">
              {getGreeting()}, {user?.firstname || 'Facilitator'}
            </span>
            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded uppercase tracking-wider">
              {getProgramType()}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1 truncate">
            {program?.name || 'Programme'}
          </h1>
          <p className="text-sm text-zinc-500">
            Monitor content delivery and learner engagement.
          </p>
        </div>

        <button
          onClick={() =>
            navigate('unit-standards/new', { state: { program } })
          }
          className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0 w-full sm:w-auto"
        >
          <Plus size={14} />
          Create unit standard
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {statsCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white border border-zinc-200 rounded-xl p-4"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                  card.accent ? 'bg-red-50' : 'bg-zinc-100'
                }`}
              >
                <Icon
                  className={card.accent ? 'text-[#E30613]' : 'text-zinc-600'}
                  size={14}
                />
              </div>
              <div
                className={`text-2xl font-extrabold tabular-nums mb-0.5 ${
                  card.accent ? 'text-[#E30613]' : 'text-zinc-900'
                }`}
              >
                {card.value}
              </div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {card.label}
              </div>
              {card.sub && (
                <div className="text-[11px] text-zinc-400 mt-1">
                  {card.sub}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              onClick={action.onClick}
              className="group text-left bg-white border border-zinc-200 rounded-xl p-4 hover:border-zinc-400 transition-colors"
            >
              <div className="w-9 h-9 bg-zinc-100 group-hover:bg-red-50 rounded-lg flex items-center justify-center mb-3 transition-colors">
                <Icon
                  className="text-zinc-600 group-hover:text-[#E30613] transition-colors"
                  size={14}
                />
              </div>
              <div className="font-bold text-sm text-zinc-900 mb-1 group-hover:text-[#E30613] transition-colors">
                {action.label}
              </div>
              <div className="text-xs text-zinc-500 leading-snug">
                {action.description}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-6">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-bold text-zinc-900">Recent activity</h2>
          <button
            onClick={() => navigate('activities', { state: { program } })}
            className="text-xs font-bold text-[#E30613] hover:underline"
          >
            View all →
          </button>
        </div>

        {recentActivities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaClipboardList className="text-zinc-400" size={16} />
            </div>
            <p className="text-sm text-zinc-500">No recent activity yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 px-4 sm:px-6 py-3 hover:bg-red-50/30 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E30613] mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-700 leading-snug break-words">
                    {activity.description}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {formatRelative(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6">
        <h2 className="text-sm font-bold text-zinc-900 mb-4">
          Programme description
        </h2>
        <div
          className="text-sm text-zinc-700 leading-relaxed break-words
            [&_p]:mb-3 [&_a]:text-[#E30613] [&_a]:underline
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5
            [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-zinc-900 [&_h1]:mb-2
            [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-zinc-900 [&_h2]:mb-2
            [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-zinc-900 [&_h3]:mb-1.5
            [&_strong]:text-zinc-900 [&_strong]:font-bold
            [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-3"
          dangerouslySetInnerHTML={{
            __html: program?.description || 'No description provided.',
          }}
        />
      </div>
    </div>
  );
}