import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaCheckDouble,
  FaEnvelope,
  FaExclamationCircle,
  FaGraduationCap,
  FaUserPlus,
} from 'react-icons/fa';
import { FiCheck, FiClock, FiX } from 'react-icons/fi';
import { useNotifications } from '@/contexts/NotificationsContext';

const TYPE_ICONS = {
  enquiry:    { icon: FaEnvelope,           color: 'text-[#E30613]', bg: 'bg-red-50' },
  assessment: { icon: FaCheckDouble,        color: 'text-emerald-600', bg: 'bg-emerald-50' },
  learner:    { icon: FaUserPlus,           color: 'text-blue-600',    bg: 'bg-blue-50' },
  certificate:{ icon: FaGraduationCap,      color: 'text-amber-600',   bg: 'bg-amber-50' },
  system:     { icon: FaExclamationCircle,  color: 'text-zinc-600',    bg: 'bg-zinc-100' },
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const recent = notifications.slice(0, 6);

  const handleNotificationClick = (notification) => {
    if (!notification.read) markAsRead(notification.id);
    if (notification.link) navigate(notification.link);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        aria-label="Notifications"
      >
        <FaBell size={18} />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E30613] rounded-full ring-2 ring-white" />
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#E30613] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-white bg-[#E30613] px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {recent.length === 0 ? (
                <div className="p-8 text-center">
                  <FaBell className="text-zinc-200 text-2xl mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {recent.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onClick={() => handleNotificationClick(n)}
                      onDismiss={() => dismiss(n.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <Link
                to="/user/admin/notifications"
                onClick={() => setOpen(false)}
                className="block text-center py-3 text-sm font-bold text-[#E30613] hover:bg-red-50 border-t border-zinc-100 transition-colors no-underline"
              >
                View all notifications
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function NotificationItem({ notification, onClick, onDismiss }) {
  const style = TYPE_ICONS[notification.type] || TYPE_ICONS.system;
  const Icon = style.icon;

  return (
    <div
      className={`group relative flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
        notification.read ? 'hover:bg-zinc-50' : 'bg-red-50/40 hover:bg-red-50'
      }`}
      onClick={onClick}
    >
      <div
        className={`w-9 h-9 ${style.bg} rounded-lg flex items-center justify-center shrink-0`}
      >
        <Icon className={style.color} size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug truncate ${
            notification.read ? 'text-zinc-700' : 'text-zinc-900 font-medium'
          }`}
        >
          {notification.title}
        </p>
        {notification.body && (
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
            {notification.body}
          </p>
        )}
        <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
          <FiClock size={9} />
          {formatRelative(notification.createdAt)}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
        aria-label="Dismiss"
      >
        <FiX size={12} />
      </button>

      {/* Unread dot */}
      {!notification.read && (
        <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#E30613] rounded-r" />
      )}
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
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}