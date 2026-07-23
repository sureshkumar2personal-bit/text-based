import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="theme-toggle" onClick={() => setOpen(!open)} title="Notifications" style={{ position: 'relative' }}>
        🔔{unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px', background: '#f87171', color: '#fff',
            borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.6rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            boxShadow: '0 0 6px rgba(248,113,113,0.5)'
          }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '360px',
          maxHeight: '420px', overflowY: 'auto', background: 'var(--bg-card)',
          border: '1px solid var(--line)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)', zIndex: 300,
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--line)' }}>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Notifications</span>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {unreadCount > 0 && <button className="btn btn-sm btn-secondary" style={{ fontSize: '0.65rem', padding: '3px 8px' }} onClick={markAllRead}>Mark All Read</button>}
              {notifications.length > 0 && <button className="btn btn-sm btn-secondary" style={{ fontSize: '0.65rem', padding: '3px 8px' }} onClick={clearAll}>Clear</button>}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontSize: '0.82rem' }}>
              No notifications yet
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} onClick={() => { if (!n.read) markRead(n.id); }}
                style={{
                  display: 'flex', gap: '0.6rem', padding: '0.7rem 1rem', cursor: 'pointer',
                  borderBottom: '1px solid var(--line)', transition: 'background 0.15s',
                  background: n.read ? 'transparent' : 'rgba(92,59,139,0.06)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(92,59,139,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(92,59,139,0.06)'}
              >
                <span style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>{n.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? 400 : 600, fontSize: '0.8rem', color: 'var(--ink)' }}>{n.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.message}</div>
                  <div style={{ fontSize: '0.62rem', color: '#999', marginTop: '3px' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--purple)', flexShrink: 0, marginTop: '4px' }} />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
