import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNotifications, getRelativeTime } from '../../contexts/NotificationContext';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
];

function DisputeAnswerModal({ notification, onClose, disputes, onRate }) {
  const dispute = useMemo(() => {
    const dId = notification.relatedEntityId || notification.metadata?.relatedEntityId;
    return disputes.find(d => d.id === dId);
  }, [notification, disputes]);

  if (!dispute) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
          <h2>Dispute Response</h2>
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>This dispute response is no longer available.</p>
          <div className="modal-actions"><button className="btn btn-secondary" onClick={onClose}>Close</button></div>
        </div>
      </div>
    );
  }

  const meta = notification.metadata || {};
  const astroName = meta.astrologerName || 'Astrologer';
  const respondedAt = dispute.astrologerRespondedAt
    ? new Date(dispute.astrologerRespondedAt).toLocaleString()
    : 'N/A';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <h2 style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          ⚖️ Dispute Response
        </h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Ref: {dispute.questionCode || dispute.id}
          </span>
          <span className={`tag ${dispute.status === 'astrologer_responded' ? 'tag-blue' : 'tag-yellow'}`}>
            {dispute.status}
          </span>
        </div>

        <div style={{ background: 'var(--bg-elevated)', color: 'var(--text-on-elevated)', borderRadius: '8px', padding: '0.8rem', marginBottom: '0.8rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            👤 {astroName}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.4rem' }}>
            Responded: {respondedAt}
          </div>
          <div style={{ borderTop: '1px solid var(--line)', margin: '0.5rem 0', paddingTop: '0.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#888' }}>Your Complaint:</div>
            <p style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>{dispute.description}</p>
          </div>
          <div style={{ borderTop: '1px solid var(--line)', margin: '0.5rem 0', paddingTop: '0.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#60a5fa' }}>Astrologer's Response:</div>
            <p style={{ fontSize: '0.82rem', marginTop: '0.3rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {dispute.astrologerResponse}
            </p>
          </div>
        </div>

        {dispute.questionTitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Related question: <strong>{dispute.questionTitle}</strong>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          {onRate && (
            <button className="btn btn-primary" onClick={() => { onClose(); onRate(notification); }}>
              Rate Astrologer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RateAstrologerModal({ notification, onClose, onRated }) {
  const { ratings, addRating } = useData();
  const toast = useToast();
  const meta = notification.metadata || {};
  const [score, setScore] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [hoverScore, setHoverScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const disputeId = notification.relatedEntityId || meta.relatedEntityId;
  const astroName = meta.astrologerName || 'Astrologer';
  const astroId = meta.astrologerId;

  const alreadyRated = ratings.some(r => r.disputeId === disputeId && r.userId === 'u-1');

  const submitRating = () => {
    if (submitting || alreadyRated) return;
    setSubmitting(true);
    setError(null);
    try {
      addRating({ disputeId, astrologerId: astroId, astrologerName: astroName, score, feedback, questionId: meta.relatedQuestionId || null, questionTitle: meta.questionTitle });
      toast.success(`Rating submitted! You gave ${score} ⭐`);
      setSubmitting(false);
      if (onRated) onRated();
      if (onClose) onClose();
    } catch {
      setError('Rating submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
        <h2>Rate Astrologer</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Rate <strong>{astroName}</strong> for their dispute response.
        </p>

        {alreadyRated ? (
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⭐</div>
            <p style={{ fontWeight: 600 }}>Already Rated</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {ratings.find(r => r.disputeId === disputeId)?.score} ⭐
            </p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Rating</label>
              <div style={{ display: 'flex', gap: '0.3rem', fontSize: '1.8rem' }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s}
                    style={{ cursor: 'pointer', transition: '0.15s', filter: s <= (hoverScore || score) ? 'none' : 'grayscale(1) opacity(0.4)' }}
                    onClick={() => setScore(s)}
                    onMouseEnter={() => setHoverScore(s)}
                    onMouseLeave={() => setHoverScore(0)}
                  >⭐</span>
                ))}
                <span style={{ fontSize: '2rem', marginLeft: '0.3rem', alignSelf: 'center' }}>{score}/5</span>
              </div>
            </div>

            <div className="form-group">
              <label>Feedback (optional)</label>
              <textarea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="What did you think of the response?" />
            </div>

            {error && <div style={{ color: '#b44040', fontSize: '0.78rem', marginBottom: '0.5rem' }}>{error}</div>}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={submitRating} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function NotificationBell({ actor, onNavigate }) {
  const { notifications, markRead, markAllRead, clearAll } = useNotifications();
  const { disputes, ratings } = useData();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState(null);
  const [viewingDisputeNotif, setViewingDisputeNotif] = useState(null);
  const [ratingNotif, setRatingNotif] = useState(null);
  const ref = useRef(null);
  const bellRef = useRef(null);
  const listRef = useRef(null);

  const myNotifications = useMemo(() => {
    const filtered = notifications.filter(n => n.targetRole === actor);
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    if (filter === 'all') return sorted;
    const isUnread = filter === 'unread';
    return sorted.filter(n => (n.isRead ?? n.read) === !isUnread);
  }, [notifications, actor, filter]);


  const unreadCount = useMemo(() =>
    notifications.filter(n => n.targetRole === actor && !(n.isRead ?? n.read)).length,
    [notifications, actor]
  );

  const badgeDisplay = unreadCount > 99 ? '99+' : unreadCount || null;

  const handleClickNotif = useCallback(async (n) => {
    const wasUnread = !(n.isRead ?? n.read);
    if (wasUnread) {
      markRead(n.id);
    }
    if (n.type === 'DISPUTE_RESPONSE_RECEIVED') {
      setOpen(false);
      setViewingDisputeNotif(n);
      return;
    }
    if (n.navigateTo && onNavigate) {
      onNavigate(n.navigateTo.tab, n.navigateTo.filter, n.navigateTo.preselectId);
      setOpen(false);
    }
  }, [markRead, onNavigate]);

  const handleMarkAllRead = useCallback(async () => {
    if (markingAll) return;
    setMarkingAll(true);
    setError(null);
    try {
      markAllRead();
    } catch {
      setError('Failed to mark all as read.');
    } finally {
      setMarkingAll(false);
    }
  }, [markingAll, markAllRead]);

  const handleRetry = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;
      if (e.key === 'Escape') {
        setOpen(false);
        bellRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const firstItem = listRef.current?.querySelector('[role="menuitem"]');
        if (firstItem) firstItem.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, filter]);

  const handleBellKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(v => !v);
    }
  };

  const handleItemKeyDown = (e, n) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClickNotif(n);
    }
  };

  const unreadAriaLabel = unreadCount > 0
    ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
    : 'No unread notifications';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        ref={bellRef}
        className="theme-toggle notif-bell"
        onClick={() => setOpen(v => !v)}
        onKeyDown={handleBellKeyDown}
        title="Notifications"
        aria-label={unreadAriaLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        style={{ position: 'relative' }}
      >
        🔔
        {badgeDisplay !== null && (
          <span
            className={unreadCount > 0 ? 'notif-badge' : ''}
            style={{
              position: 'absolute', top: '-2px', right: '-2px', background: '#f87171', color: '#fff',
              borderRadius: '50%', width: badgeDisplay > 9 ? '22px' : '18px', height: badgeDisplay > 9 ? '22px' : '18px',
              fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, boxShadow: '0 0 6px rgba(248,113,113,0.5)', lineHeight: 1,
            }}
            aria-label={unreadAriaLabel}
          >
            {badgeDisplay}
          </span>
        )}
      </button>

      {open && (
        <div
          className="notif-dropdown notif-panel"
          role="menu"
          aria-label="Notifications"
          ref={listRef}
        >
          <div className="notif-panel-header">
            <span className="notif-panel-title">Notifications</span>
            <div className="notif-panel-actions">
              {unreadCount > 0 && (
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.65rem', padding: '3px 8px' }}
                  onClick={handleMarkAllRead}
                  disabled={markingAll}
                  aria-label="Mark all notifications as read"
                >
                  {markingAll ? 'Marking...' : 'Mark All Read'}
                </button>
              )}
              {myNotifications.length > 0 && (
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.65rem', padding: '3px 8px' }}
                  onClick={clearAll}
                  aria-label="Clear all notifications"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="notif-panel-tabs" role="tablist" aria-label="Filter notifications">
            {FILTERS.map(f => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                className={`notif-tab ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                {f.id === 'unread' && unreadCount > 0 && (
                  <span className="notif-tab-count">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          <div className="notif-panel-body">
            {error && (
              <div className="notif-state notif-error" role="alert">
                <span>{error}</span>
                <button className="btn btn-sm btn-secondary" onClick={handleRetry} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                  Retry
                </button>
              </div>
            )}

            {!error && myNotifications.length === 0 && (
              <div className="notif-state notif-empty">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </div>
            )}

            {!error && myNotifications.length > 0 && (
              <div className="notif-list">
                {myNotifications.map((n, idx) => {
                  const isUnread = !(n.isRead ?? n.read);
                  const isDisputeResp = n.type === 'DISPUTE_RESPONSE_RECEIVED';
                  const meta = n.metadata || {};
                  const disputeId = n.relatedEntityId || meta.relatedEntityId;
                  const alreadyRatedDispute = disputeId && ratings.some(r => r.disputeId === disputeId && r.userId === 'u-1');

                  return (
                    <div
                      key={n.id}
                      className={`notif-item ${isUnread ? 'unread' : 'read'}`}
                      onClick={() => handleClickNotif(n)}
                      onKeyDown={e => handleItemKeyDown(e, n)}
                      tabIndex={0}
                      role="menuitem"
                      aria-label={`${isUnread ? 'Unread' : 'Read'} notification: ${n.title}`}
                    >
                      <span className="notif-item-num">{idx + 1}.</span>
                      <span className="notif-item-icon">{n.icon}</span>
                      <div className="notif-item-content">
                        <div className={`notif-item-title ${isUnread ? 'unread' : ''}`}>{n.title}</div>
                        <div className="notif-item-msg">{n.message}</div>
                        {isDisputeResp && (
                          <div style={{ marginTop: '0.25rem' }}>
                            {meta.responsePreview && (
                              <div style={{
                                fontSize: '0.68rem', color: '#888', fontStyle: 'italic',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>
                                "{meta.responsePreview}{meta.responsePreview && meta.responsePreview.length >= 80 ? '' : ''}"
                              </div>
                            )}
                            <div style={{
                              display: 'flex', gap: '0.3rem', marginTop: '0.25rem', flexWrap: 'wrap'
                            }}>
                              <span className={`tag ${meta.disputeStatus === 'astrologer_responded' ? 'tag-blue' : 'tag-yellow'}`}
                                style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                                {meta.disputeStatus?.replace(/_/g, ' ') || 'answered'}
                              </span>
                              <button
                                className="btn btn-sm"
                                style={{
                                  fontSize: '0.6rem', padding: '1px 6px',
                                  background: 'var(--purple)', color: '#fff', border: 'none', borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                                onClick={e => { e.stopPropagation(); markRead(n.id); setOpen(false); setViewingDisputeNotif(n); }}
                              >
                                View Answer
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{
                                  fontSize: '0.6rem', padding: '1px 6px',
                                  background: alreadyRatedDispute ? 'transparent' : 'var(--gold)',
                                  color: alreadyRatedDispute ? '#888' : '#fff',
                                  border: alreadyRatedDispute ? '1px solid var(--line)' : 'none',
                                  borderRadius: '4px', cursor: alreadyRatedDispute ? 'default' : 'pointer',
                                }}
                                onClick={e => { e.stopPropagation(); if (!alreadyRatedDispute) { setOpen(false); setRatingNotif(n); } }}
                                disabled={alreadyRatedDispute}
                              >
                                {alreadyRatedDispute ? `Rated ${ratings.find(r => r.disputeId === disputeId)?.score || ''}⭐` : 'Rate Astrologer'}
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="notif-item-time">{getRelativeTime(n.createdAt)}</div>
                      </div>
                      {isUnread && <span className="notif-item-dot" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {viewingDisputeNotif && (
        <DisputeAnswerModal
          notification={viewingDisputeNotif}
          disputes={disputes}
          onClose={() => setViewingDisputeNotif(null)}
          onRate={(notif) => { setViewingDisputeNotif(null); setTimeout(() => setRatingNotif(notif), 100); }}
        />
      )}

      {ratingNotif && (
        <RateAstrologerModal
          notification={ratingNotif}
          onClose={() => setRatingNotif(null)}
          onRated={() => setRatingNotif(null)}
        />
      )}
    </div>
  );
}
