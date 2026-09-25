import { apiFetch } from '@/api/api';
import { ADMIN } from '@/utils/apiEndpoint';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  FaBan,
  FaCheckCircle,
  FaEdit,
  FaPlusCircle,
  FaSyncAlt,
  FaTrash,
  FaUser,
  FaUsers,
  FaUserTag,
} from 'react-icons/fa';
import {
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminActivities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialActivities = location?.state?.activities;

  const [activities, setActivities] = useState(initialActivities || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!initialActivities?.length) {
      getActivities();
    }
  }, []);

  async function getActivities() {
    try {
      const result = await apiFetch(`${ADMIN}/activities`);
      if (result?.success) {
        setActivities(result?.payload || []);
      }
    } catch (e) {
      // silently fail
    }
  }

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-ZA');
  };

  const formatFullDate = (dateString) =>
    new Date(dateString).toLocaleString('en-ZA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const filteredActivities = activities.filter((activity) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      activity.description?.toLowerCase().includes(search) ||
      activity.message?.toLowerCase().includes(search) ||
      `${activity.firstname} ${activity.lastname}`.toLowerCase().includes(search);
    const matchesAction = filterAction === 'ALL' || activity.actionType === filterAction;
    return matchesSearch && matchesAction;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: activities.length,
    created: activities.filter((a) => a.actionType === 'CREATED').length,
    updated: activities.filter((a) => a.actionType === 'UPDATED').length,
    deleted: activities.filter((a) => a.actionType === 'DELETED' || a.actionType === 'BULK_DELETE').length,
    activated: activities.filter((a) => a.actionType === 'ACTIVATED').length,
    roleAssignments: activities.filter(
      (a) => a.actionType === 'ROLE_ASSIGN' || a.actionType === 'BULK_ROLE_ASSIGN'
    ).length,
  };

  const statCards = [
    { label: 'Total',         value: stats.total,         color: 'text-slate-700' },
    { label: 'Created',       value: stats.created,       color: 'text-green-600' },
    { label: 'Updated',       value: stats.updated,       color: 'text-amber-600' },
    { label: 'Deleted',       value: stats.deleted,       color: 'text-red-600' },
    { label: 'Activated',     value: stats.activated,     color: 'text-emerald-600' },
    { label: 'Role Assign',   value: stats.roleAssignments, color: 'text-purple-600' },
  ];

  const actionTypes = ['ALL', ...new Set(activities.map((a) => a.actionType))];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
          Activity Log
        </h1>
        <p className="text-sm text-slate-500">
          Track all user activities and system events.
        </p>
      </div>

      {/* ============================================================
          STATS
          ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4"
          >
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`text-xl sm:text-2xl font-extrabold tabular-nums ${stat.color}`}>
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* ============================================================
          FILTERS
          ============================================================ */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search activities, messages or users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:border-slate-900 outline-none transition-colors"
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => {
            setFilterAction(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-700 focus:border-slate-900 outline-none transition-colors cursor-pointer sm:w-64"
        >
          <option value="ALL">All Activities</option>
          {actionTypes
            .filter((a) => a !== 'ALL')
            .map((action) => (
              <option key={action} value={action}>
                {action.replace(/_/g, ' ')}
              </option>
            ))}
        </select>
      </div>

      {/* ============================================================
          ACTIVITIES LIST
          ============================================================ */}
      {paginatedActivities.length > 0 ? (
        <div className="space-y-3">
          {paginatedActivities.map((activity) => {
            const styles = getActionStyles(activity.actionType);
            const displayMessage = activity.message || activity.description;
            const actorName =
              activity.firstname || activity.lastname
                ? `${activity.firstname || ''} ${activity.lastname || ''}`.trim()
                : 'System';

            return (
              <div
                key={activity.id}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 ${styles.bg} rounded-xl border-l-4 ${styles.border} hover:shadow-sm transition-all`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 ${styles.iconBg} rounded-lg flex items-center justify-center shrink-0`}
                >
                  {styles.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-block text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5 ${styles.badge}`}
                  >
                    {activity.actionType?.replace(/_/g, ' ')}
                  </span>

                  <p className={`font-medium ${styles.text} text-xs sm:text-sm break-words`}>
                    {displayMessage}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-[11px] sm:text-xs">
                    <span className="font-medium text-slate-600 truncate">
                      {actorName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{formatFullDate(activity.createdAt)}</span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="text-slate-400 hidden sm:inline">
                      {formatRelativeTime(activity.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-10 sm:p-12 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiActivity className="text-slate-400" size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No activities found
          </h3>
          <p className="text-sm text-slate-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* ============================================================
          PAGINATION
          ============================================================ */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t border-slate-200">
          <div className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
            Showing{' '}
            <span className="font-semibold text-slate-900">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-900">
              {Math.min(currentPage * itemsPerPage, filteredActivities.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-900">
              {filteredActivities.length}
            </span>
          </div>

          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
              aria-label="Previous page"
            >
              <FiChevronLeft size={16} />
            </button>

            {getPaginationRange(currentPage, totalPages).map((page, idx) =>
              page === '...' ? (
                <span
                  key={`dots-${idx}`}
                  className="px-2 py-1.5 text-slate-400 text-sm"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
              aria-label="Next page"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function getActionStyles(actionType) {
  switch (actionType?.toUpperCase()) {
    case 'ACTIVATED':
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-300',
        text: 'text-emerald-800',
        iconBg: 'bg-emerald-100',
        icon: <FaCheckCircle className="text-emerald-600" />,
        badge: 'bg-emerald-100 text-emerald-700',
      };
    case 'DEACTIVATED':
      return {
        bg: 'bg-rose-50',
        border: 'border-rose-300',
        text: 'text-rose-800',
        iconBg: 'bg-rose-100',
        icon: <FaBan className="text-rose-600" />,
        badge: 'bg-rose-100 text-rose-700',
      };
    case 'CREATED':
      return {
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-800',
        iconBg: 'bg-green-100',
        icon: <FaPlusCircle className="text-green-600" />,
        badge: 'bg-green-100 text-green-700',
      };
    case 'DELETED':
    case 'BULK_DELETE':
      return {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-800',
        iconBg: 'bg-red-100',
        icon: <FaTrash className="text-red-600" />,
        badge: 'bg-red-100 text-red-700',
      };
    case 'UPDATED':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-800',
        iconBg: 'bg-amber-100',
        icon: <FaEdit className="text-amber-600" />,
        badge: 'bg-amber-100 text-amber-700',
      };
    case 'ROLE_ASSIGN':
    case 'BULK_ROLE_ASSIGN':
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-300',
        text: 'text-purple-800',
        iconBg: 'bg-purple-100',
        icon: <FaUserTag className="text-purple-600" />,
        badge: 'bg-purple-100 text-purple-700',
      };
    case 'BULK_CREATE':
      return {
        bg: 'bg-teal-50',
        border: 'border-teal-300',
        text: 'text-teal-800',
        iconBg: 'bg-teal-100',
        icon: <FaUsers className="text-teal-600" />,
        badge: 'bg-teal-100 text-teal-700',
      };
    case 'BULK_STATUS_UPDATE':
      return {
        bg: 'bg-indigo-50',
        border: 'border-indigo-300',
        text: 'text-indigo-800',
        iconBg: 'bg-indigo-100',
        icon: <FaSyncAlt className="text-indigo-600" />,
        badge: 'bg-indigo-100 text-indigo-700',
      };
    default:
      return {
        bg: 'bg-slate-50',
        border: 'border-slate-300',
        text: 'text-slate-700',
        iconBg: 'bg-slate-100',
        icon: <FaUser className="text-slate-500" />,
        badge: 'bg-slate-100 text-slate-700',
      };
  }
}

function getPaginationRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

export default AdminActivities;