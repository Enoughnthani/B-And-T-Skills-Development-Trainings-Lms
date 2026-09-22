import { apiFetch } from '@/api/api';
import { ADMIN } from '@/utils/apiEndpoint';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  FaBan,
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaUser,
  FaUserPlus,
  FaUsers,
  FaUserTag,
  FaSyncAlt,
  FaPlusCircle
} from 'react-icons/fa';
import {
  FiActivity, FiChevronLeft, FiChevronRight,
  FiSearch
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminActivities = () => {
  const location = useLocation()
  const initialActivities = location?.state?.activities;
  const [activities, setActivities] = useState(initialActivities || [])

  useEffect(() => {
    getActivities()
  }, [])

  async function getActivities() {
    try {
      const result = await apiFetch(`${ADMIN}/activities`)
      if (result?.success) {
        setActivities(result?.payload)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate()

  const getActionStyles = (actionType) => {
    switch (actionType?.toUpperCase()) {
      case 'ACTIVATED':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200 hover:border-emerald-400',
          text: 'text-emerald-700',
          iconBg: 'bg-emerald-100',
          icon: <FaCheckCircle className="text-emerald-500 text-lg" />,
          badge: 'bg-emerald-100 text-emerald-700'
        };
      case 'DEACTIVATED':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200 hover:border-rose-400',
          text: 'text-rose-700',
          iconBg: 'bg-rose-100',
          icon: <FaBan className="text-rose-500 text-lg" />,
          badge: 'bg-rose-100 text-rose-700'
        };
      case 'CREATED':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200 hover:border-green-400',
          text: 'text-green-700',
          iconBg: 'bg-green-100',
          icon: <FaPlusCircle className="text-green-500 text-lg" />,
          badge: 'bg-green-100 text-green-700'
        };
      case 'DELETED':
      case 'BULK_DELETE':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200 hover:border-red-400',
          text: 'text-red-700',
          iconBg: 'bg-red-100',
          icon: <FaTrash className="text-red-500 text-lg" />,
          badge: 'bg-red-100 text-red-700'
        };
      case 'UPDATED':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200 hover:border-amber-400',
          text: 'text-amber-700',
          iconBg: 'bg-amber-100',
          icon: <FaEdit className="text-amber-500 text-lg" />,
          badge: 'bg-amber-100 text-amber-700'
        };
      case 'ROLE_ASSIGN':
      case 'BULK_ROLE_ASSIGN':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200 hover:border-purple-400',
          text: 'text-purple-700',
          iconBg: 'bg-purple-100',
          icon: <FaUserTag className="text-purple-500 text-lg" />,
          badge: 'bg-purple-100 text-purple-700'
        };
      case 'BULK_CREATE':
        return {
          bg: 'bg-teal-50',
          border: 'border-teal-200 hover:border-teal-400',
          text: 'text-teal-700',
          iconBg: 'bg-teal-100',
          icon: <FaUsers className="text-teal-500 text-lg" />,
          badge: 'bg-teal-100 text-teal-700'
        };
      case 'BULK_STATUS_UPDATE':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-200 hover:border-indigo-400',
          text: 'text-indigo-700',
          iconBg: 'bg-indigo-100',
          icon: <FaSyncAlt className="text-indigo-500 text-lg" />,
          badge: 'bg-indigo-100 text-indigo-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200 hover:border-gray-400',
          text: 'text-gray-700',
          iconBg: 'bg-gray-100',
          icon: <FaUser className="text-gray-500 text-lg" />,
          badge: 'bg-gray-100 text-gray-700'
        };
    }
  };

  // Format relative time
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
    return date.toLocaleDateString();
  };

  // Format full date
  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and search activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${activity.firstname} ${activity.lastname}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || activity.actionType === filterAction;
    return matchesSearch && matchesAction;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: activities.length,
    created: activities.filter(a => a.actionType === 'CREATED').length,
    updated: activities.filter(a => a.actionType === 'UPDATED').length,
    deleted: activities.filter(a => a.actionType === 'DELETED' || a.actionType === 'BULK_DELETE').length,
    activated: activities.filter(a => a.actionType === 'ACTIVATED').length,
    deactivated: activities.filter(a => a.actionType === 'DEACTIVATED').length,
    roleAssignments: activities.filter(a => a.actionType === 'ROLE_ASSIGN' || a.actionType === 'BULK_ROLE_ASSIGN').length
  };

  // Get unique action types for filters
  const actionTypes = ['ALL', ...new Set(activities.map(a => a.actionType))];

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 flex-1">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-3">
            <div>
              <Button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 border-gray-200 text-gray-600"
                variant="outline-secondary"
                size="sm"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">Back</span>
              </Button>
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Activity Log</h1>
              <p className="text-sm text-gray-500 mt-0.5">Track all user activities and system events</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-green-200 shadow-sm bg-green-50/30">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Created</p>
            <p className="text-2xl font-bold text-green-700">{stats.created}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-amber-200 shadow-sm bg-amber-50/30">
            <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Updated</p>
            <p className="text-2xl font-bold text-amber-700">{stats.updated}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-red-200 shadow-sm bg-red-50/30">
            <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Deleted</p>
            <p className="text-2xl font-bold text-red-700">{stats.deleted}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-emerald-200 shadow-sm bg-emerald-50/30">
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Activated</p>
            <p className="text-2xl font-bold text-emerald-700">{stats.activated}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-purple-200 shadow-sm bg-purple-50/30">
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Role Assign</p>
            <p className="text-2xl font-bold text-purple-700">{stats.roleAssignments}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search activities, messages or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="w-64">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Activities</option>
              {actionTypes.filter(a => a !== 'ALL').map((action) => (
                <option key={action} value={action}>
                  {action.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activities List - Card View */}
        <div className="space-y-3">
          {paginatedActivities.map((activity) => {
            const styles = getActionStyles(activity.actionType);
            const displayMessage = activity.message || activity.description;
            const actorName = activity.firstname || activity.lastname
              ? `${activity.firstname || ''} ${activity.lastname || ''}`.trim()
              : 'System';

            return (
              <div
                key={activity.id}
                className={`flex items-start gap-4 p-4 ${styles.bg} rounded-xl transition-all duration-300 border-l-4 ${styles.border} hover:shadow-md`}
              >
                <div className={`w-10 h-10 ${styles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {styles.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
                      {activity.actionType?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className={`font-medium ${styles.text} text-sm break-words`}>
                    {displayMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs font-medium text-gray-600">
                      {actorName}
                    </span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      {formatFullDate(activity.createdAt)}
                    </span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(activity.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
              <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredActivities.length)}</span> of{' '}
              <span className="font-medium text-gray-900">{filteredActivities.length}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600"
              >
                <FiChevronLeft size={16} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                    if (i === 6) pageNum = totalPages;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }

                  if (pageNum === undefined) return null;
                  if (i === 5 && totalPages > 7 && currentPage <= 4) {
                    return <span key="dots" className="px-2 py-1.5 text-gray-400">...</span>;
                  }
                  if (i === 1 && totalPages > 7 && currentPage >= totalPages - 3) {
                    return <span key="dots" className="px-2 py-1.5 text-gray-400">...</span>;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center mt-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiActivity className="text-gray-400" size={28} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No activities found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivities;