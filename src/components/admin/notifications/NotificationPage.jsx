import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaCheckDouble,
  FaEnvelope,
  FaExclamationCircle,
  FaGraduationCap,
  FaSearch,
  FaTrash,
  FaUserPlus,
} from 'react-icons/fa';
import { FiCheck, FiClock, FiFilter } from 'react-icons/fi';
import { useNotifications } from '@/contexts/NotificationsContext';

const TYPE_ICONS = {
  enquiry:    { icon: FaEnvelope,           color: 'text-[#E30613]',    bg: 'bg-red-50',    label: 'Enquiry' },
  assessment: { icon: FaCheckDouble,        color: 'text-emerald-600',  bg: 'bg-emerald-50', label: 'Assessment' },
  learner:    { icon: FaUserPlus,           color: 'text-blue-600',     bg: 'bg-blue-50',    label: 'Learner' },
  certificate:{ icon: FaGraduationCap,      color: 'text-amber-600',    bg: 'bg-amber-50',   label: 'Certificate' },
  system:     { icon: FaExclamationCircle,  color: 'text-zinc-600',     bg: 'bg-zinc-100',   label: 'System' },
};

const FILTERS = [
  { key: 'all',         label: 'All' },
  { key: 'unread',      label: 'Unread' },
  { key: 'enquiry',     label: 'Enquiries' },
  { key: 'assessment',  label: 'Assessments' },
  { key: 'learner',     label: 'Learners' },
  { key: 'certificate', label: 'Certificates' },
  { key: 'system',      label: 'System' },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
  } = useNotifications();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return notifications.filter((n) => {
      const matchesSearch =
        n.title?.toLowerCase().includes(s) ||
        n.body?.toLowerCase().includes(s);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' && !n.read) ||
        n.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  const handleClick = (n) => {
    if (!n.read) markAsRead(n.id);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8  mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
            Notifications
          </h1>
          <p className="text-sm text-zinc-500">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'You are all caught up.'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <FiCheck size={14} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter size={12} className="text-zinc-400" />
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
            Filters
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-zinc-900 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === f.key
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FaBell className="text-zinc-200 text-2xl mx-auto mb-3" />
            <h3 className="font-bold text-zinc-900 mb-1">No notifications</h3>
            <p className="text-sm text-zinc-500">
              {search || filter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Notifications about enquiries, assessments and learners will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filtered.map((n) => {
              const style = TYPE_ICONS[n.type] || TYPE_ICONS.system;
              const Icon = style.icon;

              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`group flex items-start gap-3 p-4 cursor-pointer transition-colors ${
                    n.read ? 'hover:bg-zinc-50' : 'bg-red-50/40 hover:bg-red-50'
                  }`}
                >
                  {/* Unread indicator */}
                  <div className="w-1 self-stretch rounded-full shrink-0">
                    {!n.read && <div className="h-full bg-[#E30613] rounded-full" />}
                  </div>

                  {/* Icon */}
                  <div className={`w-9 h-9 ${style.bg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={style.color} size={14} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        {style.label}
                      </span>
                      {!n.read && (
                        <span className="text-[10px] font-bold text-white bg-[#E30613] px-1.5 py-0.5 rounded">
                          New
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-snug ${n.read ? 'text-zinc-700' : 'text-zinc-900 font-medium'}`}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                        {n.body}
                      </p>
                    )}
                    <p className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1">
                      <FiClock size={9} />
                      {formatRelative(n.createdAt)}
                    </p>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismiss(n.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
                    aria-label="Dismiss"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function formatRelative(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}