import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

let notifId = 0;

export const NOTIF_TYPES = {
  PURCHASE_SUCCESS: { icon: '🛒', color: '#4ade80' },
  QUESTION_SUBMITTED: { icon: '📝', color: '#60a5fa' },
  QUESTION_ANSWERED: { icon: '✅', color: '#4ade80' },
  DISPUTE_RAISED: { icon: '⚖️', color: '#f87171' },
  DISPUTE_ESCALATED: { icon: '⚠️', color: '#f87171' },
  DISPUTE_RESOLVED: { icon: '🔨', color: '#4ade80' },
  CAMPAIGN_ACTIVATED: { icon: '📢', color: '#4ade80' },
  CAMPAIGN_PAUSED: { icon: '⏸️', color: '#f9a826' },
  CAMPAIGN_STOPPED: { icon: '⏹️', color: '#f87171' },
  CAMPAIGN_REVIEW: { icon: '🕐', color: '#f9a826' },
  CAMPAIGN_APPROVED: { icon: '✅', color: '#4ade80' },
  CAMPAIGN_REJECTED: { icon: '❌', color: '#f87171' },
  NEW_QUEUE_ITEM: { icon: '📩', color: '#60a5fa' },
  PAYOUT_REQUESTED: { icon: '💰', color: '#f9a826' },
  RATING_RECEIVED: { icon: '⭐', color: '#f9a826' },
  WALLET_TOPUP: { icon: '💳', color: '#4ade80' },
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('ae_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const persist = (n) => {
    try { localStorage.setItem('ae_notifications', JSON.stringify(n)); } catch {}
  };

  const addNotification = useCallback((type, title, message, targetRole, navigateTo) => {
    const roles = Array.isArray(targetRole) ? targetRole : [targetRole];
    const newNotifs = roles.map(role => ({
      id: ++notifId,
      type,
      icon: NOTIF_TYPES[type]?.icon || '🔔',
      color: NOTIF_TYPES[type]?.color || '#888',
      title, message, read: false,
      createdAt: new Date().toISOString(),
      targetRole: role,
      navigateTo: navigateTo || null,
    }));
    setNotifications(prev => {
      const next = [...newNotifs, ...prev];
      persist(next);
      return next;
    });
  }, []);

  const markRead = useCallback((id) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      persist(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      persist(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    persist([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, markRead, markAllRead, clearAll, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
