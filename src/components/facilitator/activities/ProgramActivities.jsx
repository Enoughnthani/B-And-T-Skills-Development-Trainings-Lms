import { apiFetch } from '@/api/api';
import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Edit,
  FileText,
  PlusCircle,
  Search,
  Trash2,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';

const ACTION_STYLES = {
  CREATED: { bg: 'bg-zinc-100', icon: PlusCircle },
  UPDATED: { bg: 'bg-zinc-100', icon: Edit },
  DELETED: { bg: 'bg-red-50', icon: Trash2, accent: true },
  DEACTIVATED: { bg: 'bg-red-50', icon: Trash2, accent: true },
  ACTIVATED: { bg: 'bg-zinc-100', icon: CheckCircle2 },
  ASSIGNED: { bg: 'bg-zinc-100', icon: UserPlus },
  ENROLLED: { bg: 'bg-zinc-100', icon: Users },
  SUBMITTED: { bg: 'bg-zinc-100', icon: FileText },
  ASSESSED: { bg: 'bg-zinc-100', icon: ClipboardCheck },
  COMPLETED: { bg: 'bg-zinc-900', icon: CheckCircle2, dark: true },
};

const ACTION_LABELS = {
  CREATED: 'Created',
  UPDATED: 'Updated',
  DELETED: 'Deleted',
  DEACTIVATED: 'Deactivated',
  ACTIVATED: 'Activated',
  ASSIGNED: 'Assigned',
  ENROLLED: 'Enrolled',
  SUBMITTED: 'Submitted',
  ASSESSED: 'Assessed',
  COMPLETED: 'Completed',
};

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'CREATED', label: 'Created' },
  { key: 'UPDATED', label: 'Updated' },
  { key: 'ENROLLED', label: 'Enrolments' },
  { key: 'SUBMITTED', label: 'Submissions' },
  { key: 'ASSESSED', label: 'Assessments' },
];

export default function ProgramActivities() {
  const { programId } = useParams();
  const location = useLocation();
  const { program } = location.state || {};

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!programId) return;
    load();
  }, [programId]);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch(
        `/api/programs/${programId}/activities?limit=100`
      );
      setActivities(result?.payload || result || []);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return activities.filter((a) => {
      const matchesSearch =
        !s ||
        a.description?.toLowerCase().includes(s) ||
        a.actorName?.toLowerCase().includes(s) ||
        a.message?.toLowerCase().includes(s);

      const matchesFilter =
        filter === 'ALL' ||
        a.actionType === filter ||
        a.action === filter;

      return matchesSearch && matchesFilter;
    });
  }, [activities, search, filter]);

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

  function formatFullDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
          Activities
        </h1>
        <p className="text-sm text-zinc-500">
          Everything happening in {program?.name || 'this programme'}.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search activities…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  filter === f.key
                    ? 'bg-[#E30613] text-white'
                    : 'bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-zinc-200 border-t-[#E30613]" />
            <p className="mt-3 text-sm text-zinc-500">Loading activities…</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasFilters={search || filter !== 'ALL'} />
        ) : (
          <div className="divide-y divide-zinc-100">
            {filtered.map((activity, idx) => (
              <ActivityRow
                key={activity.id || idx}
                activity={activity}
                formatRelative={formatRelative}
                formatFullDate={formatFullDate}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-400">
            Showing {filtered.length} of {activities.length} activities
          </p>
        </div>
      )}
    </div>
  );
}

function ActivityRow({ activity, formatRelative, formatFullDate }) {
  const actionType = (activity.actionType || activity.action || 'DEFAULT').toUpperCase();
  const style = ACTION_STYLES[actionType] || ACTION_STYLES.UPDATED;
  const Icon = style.icon;
  const label = ACTION_LABELS[actionType] || actionType.replace(/_/g, ' ');

  const actorName =
    activity.actorName ||
    (activity.firstname || activity.lastname
      ? `${activity.firstname || ''} ${activity.lastname || ''}`.trim()
      : 'System');

  const description =
    activity.description || activity.message || 'No description';

  return (
    <div className="flex items-start gap-3 sm:gap-4 p-4 hover:bg-red-50/30 transition-colors">
      <div
        className={`w-9 h-9 ${style.bg} rounded-lg flex items-center justify-center shrink-0`}
      >
        <Icon
          size={14}
          className={style.dark ? 'text-white' : style.accent ? 'text-[#E30613]' : 'text-zinc-600'}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              style.dark
                ? 'bg-zinc-900 text-white'
                : style.accent
                ? 'bg-red-50 text-[#E30613]'
                : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            {label}
          </span>
        </div>

        <p className="text-sm text-zinc-800 leading-snug break-words mb-1">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs">
          <span className="font-medium text-zinc-600 truncate">
            {actorName}
          </span>
          <span className="text-zinc-300">·</span>
          <span
            className="text-zinc-500"
            title={formatFullDate(activity.createdAt)}
          >
            {formatRelative(activity.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="p-12 text-center">
      <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="text-zinc-400" size={20} />
      </div>
      <h3 className="font-bold text-zinc-900 mb-1">No activities found</h3>
      <p className="text-sm text-zinc-500">
        {hasFilters
          ? 'Try adjusting your search or filter.'
          : 'Activities will appear here as learners and staff work on this programme.'}
      </p>
    </div>
  );
}