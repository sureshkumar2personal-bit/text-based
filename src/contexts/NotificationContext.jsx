import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

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
  DISPUTE_RESPONSE_RECEIVED: { icon: '⚖️', color: '#60a5fa' },
};

const NOTIF_TYPE_NAV_MAP = {
  PURCHASE_SUCCESS: { user: { tab: 'questions', filter: 'purchased' }, astrologer: { tab: 'queue' } },
  QUESTION_SUBMITTED: { user: { tab: 'tracking' }, astrologer: { tab: 'queue' } },
  QUESTION_ANSWERED: { user: { tab: 'questions', filter: 'answered' } },
  DISPUTE_RAISED: { user: { tab: 'questions' }, astrologer: { tab: 'disputes' }, platform: { tab: 'disputes' } },
  DISPUTE_ESCALATED: { user: { tab: 'questions' }, platform: { tab: 'disputes' } },
  DISPUTE_RESOLVED: { user: { tab: 'questions' }, astrologer: { tab: 'disputes' } },
  CAMPAIGN_ACTIVATED: { astrologer: { tab: 'campaigns' }, user: { tab: 'questions' } },
  CAMPAIGN_PAUSED: { astrologer: { tab: 'campaigns' }, user: { tab: 'questions' } },
  CAMPAIGN_STOPPED: { astrologer: { tab: 'campaigns' }, user: { tab: 'questions' } },
  CAMPAIGN_REVIEW: { platform: { tab: 'campaigns' } },
  CAMPAIGN_APPROVED: { astrologer: { tab: 'campaigns' } },
  CAMPAIGN_REJECTED: { astrologer: { tab: 'campaigns' } },
  NEW_QUEUE_ITEM: { astrologer: { tab: 'queue' } },
  PAYOUT_REQUESTED: { astrologer: { tab: 'sales' }, platform: { tab: 'transactions' } },
  RATING_RECEIVED: { astrologer: { tab: 'analytics' } },
  WALLET_TOPUP: { user: { tab: 'wallet' } },
  DISPUTE_RESPONSE_RECEIVED: { user: { tab: 'questions' } },
};

export function getRelativeTime(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  if (diff < 0) return 'Just now';
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'Just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function buildNavigateTo(type, targetRole) {
  const routeMap = NOTIF_TYPE_NAV_MAP[type];
  if (!routeMap) return null;
  const roleKeys = Object.keys(routeMap);
  if (roleKeys.length === 1) return routeMap[roleKeys[0]];
  if (targetRole && routeMap[targetRole]) return routeMap[targetRole];
  return null;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('ae_notifications');
      const parsed = saved ? JSON.parse(saved) : [];
      const migrated = parsed.filter(n => n.targetRole);
      if (migrated.length !== parsed.length) {
        localStorage.setItem('ae_notifications', JSON.stringify(migrated));
      }
      return migrated.map(n => ({
        ...n,
        isRead: n.isRead !== undefined ? n.isRead : !!n.read,
      }));
    } catch { return []; }
  });

  const persist = useCallback((n) => {
    try { localStorage.setItem('ae_notifications', JSON.stringify(n)); } catch {}
  }, []);

  const addNotification = useCallback((type, title, message, targetRole, navigateTo, relatedEntityId, metadata) => {
    const typeKey = typeof type === 'string'
      ? type
      : Object.keys(NOTIF_TYPES).find(k => NOTIF_TYPES[k] === type) || type;
    const typeDef = NOTIF_TYPES[typeKey] || {};
    const roles = Array.isArray(targetRole) ? targetRole : [targetRole];
    const nav = navigateTo || buildNavigateTo(typeKey, targetRole);
    const newNotifs = roles.map(role => ({
      id: ++notifId,
      type: typeKey,
      icon: typeDef.icon || '🔔',
      color: typeDef.color || '#888',
      title, message, read: false, isRead: false,
      createdAt: new Date().toISOString(),
      targetRole: role,
      navigateTo: nav,
      recipientId: null,
      relatedEntityId: relatedEntityId || null,
      metadata: metadata || null,
    }));
    setNotifications(prev => {
      const next = [...newNotifs, ...prev];
      persist(next);
      return next;
    });
  }, [persist]);

  const markRead = useCallback((id) => {
    setNotifications(prev => {
      const next = prev.map(n =>
        n.id === id ? { ...n, read: true, isRead: true } : n
      );
      persist(next);
      return next;
    });
  }, [persist]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true, isRead: true }));
      persist(next);
      return next;
    });
  }, [persist]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    persist([]);
  }, [persist]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      markRead,
      markAllRead,
      clearAll,
      addNotification,
      NOTIF_TYPES,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
