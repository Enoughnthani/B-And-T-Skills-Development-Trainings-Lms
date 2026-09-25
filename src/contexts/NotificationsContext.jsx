import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/api/api';
import { ADMIN } from '@/utils/apiEndpoint';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch(`${ADMIN}/notifications`);
      if (result?.success) {
        setNotifications(result.payload || []);
      } else {
        setError(result?.message || 'Failed to load notifications');
      }
    } catch (e) {
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Optional: poll every 60 seconds for new notifications
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(async (id) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await apiFetch(`${ADMIN}/notifications/${id}/read`, { method: 'PUT' });
    } catch (e) {
      // revert on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await apiFetch(`${ADMIN}/notifications/read-all`, { method: 'PUT' });
    } catch (e) {
      setNotifications(previous);
    }
  }, [notifications]);

  const dismiss = useCallback(async (id) => {
    const previous = notifications;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await apiFetch(`${ADMIN}/notifications/${id}`, { method: 'DELETE' });
    } catch (e) {
      setNotifications(previous);
    }
  }, [notifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        error,
        unreadCount,
        refresh: load,
        markAsRead,
        markAllAsRead,
        dismiss,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return ctx;
}