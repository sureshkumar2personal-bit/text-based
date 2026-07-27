import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';
import ModalPortal from '../ui/ModalPortal';

const DISPUTE_TIMELINE_STAGES = [
  'Dispute Raised',
  'Astrologer Reviewing',
  'Astrologer Responded',
  'User Reply / Escalated',
  'Platform Reviewing',
  'Resolved / Refunded'
];

const DISPUTE_STATUS_ORDER = {
  open: 1, astrologer_reviewing: 2, astrologer_responded: 3,
  user_reply: 4, escalated: 5, platform_reviewing: 6,
  resolved: 7, refunded: 7, rejected: 7, closed: 7
};

function getDisputeTimeline(status) {
  const idx = DISPUTE_STATUS_ORDER[status] || 0;
  return DISPUTE_TIMELINE_STAGES.map((label, i) => ({ label, completed: i < idx, active: i === idx }));
}

const DISPUTE_STATUS_MAP = { open: 'tag-red', astrologer_reviewing: 'tag-yellow', astrologer_responded: 'tag-blue', user_reply: 'tag-purple', escalated: 'tag-red', platform_reviewing: 'tag-purple', resolved: 'tag-green', refunded: 'tag-green', rejected: 'tag-gray', closed: 'tag-gray' };

export default function UserDisputeTracking() {
  const { disputes, disputeMessages, addDisputeMessage, updateDisputeStatus } = useData();
  const { addNotification } = useNotifications();
  const myDisputes = disputes.filter(d => d.userId === 'u-1');
  const [selected, setSelected] = useState(null);
  const [newMsg, setNewMsg] = useState('');

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    addDisputeMessage(selected.id, 'user', 'u-1', 'Sureshkumar', newMsg.trim());
    addNotification(NOTIF_TYPES.DISPUTE_RAISED, 'New Message on Dispute', 'User sent a new message on dispute #' + selected.questionCode, ['astrologer', 'platform'], { tab: 'disputes' });
    setNewMsg('');
  };

  return (
    <div>
      <div className="card"><h2>Dispute Tracking</h2></div>

      <div className="grid">
        {myDisputes.map(d => {
          const tl = getDisputeTimeline(d.status);
          return (
            <div className="card" key={d.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>#{d.questionCode} — {d.questionTitle}</h3>
                <span className={`tag ${DISPUTE_STATUS_MAP[d.status]}`}>{d.status}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Reason: {d.reason.replace(/_/g, ' ')}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.description}</p>

              <div className="status-bar" style={{ flexWrap: 'wrap', gap: '0.3rem' }}>
                {tl.map((s, i) => (
                  <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span className={`stage-dot ${s.completed ? 'completed' : ''} ${s.active ? 'active' : ''}`} style={s.active ? { background: '#f9a826', boxShadow: '0 0 4px #f9a826' } : {}} />
                    <span style={{ fontSize: '0.62rem', color: s.completed ? '#4ade80' : s.active ? '#f9a826' : '#555', maxWidth: '60px', lineHeight: 1.2 }}>{s.label}</span>
                    {i < tl.length - 1 && <span className="stage-line" style={{ width: '10px' }} />}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.3rem' }}>
                Raised: {new Date(d.createdAt).toLocaleDateString()}
                {d.escalatedAt && ` · Escalated: ${new Date(d.escalatedAt).toLocaleDateString()}`}
                {d.resolvedAt && ` · Resolved: ${new Date(d.resolvedAt).toLocaleDateString()}`}
              </div>

              <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '0.4rem' }} onClick={() => setSelected(d)}>
                View Thread
              </button>
            </div>
          );
        })}
      </div>

      {selected && (
        <ModalPortal onClose={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h2>#{selected.questionCode}</h2>
              <span className={`tag ${DISPUTE_STATUS_MAP[selected.status]}`}>{selected.status}</span>
            </div>

            <div style={{ background: 'var(--bg-elevated)', color: 'var(--text-on-elevated)', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.8rem' }}>
              <p><strong>{selected.questionTitle}</strong> — {selected.reason.replace(/_/g, ' ')}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selected.description}</p>
              {selected.astrologerResponse && (
                <div style={{ marginTop: '0.3rem', padding: '0.3rem', borderTop: '1px solid #2a2948' }}>
                  <span className="tag tag-blue" style={{ marginBottom: '2px' }}>Astrologer's Response</span>
                  <p style={{ fontSize: '0.78rem', color: '#bbb' }}>{selected.astrologerResponse}</p>
                </div>
              )}
              {selected.resolution && (
                <div style={{ marginTop: '0.3rem', padding: '0.3rem', borderTop: '1px solid #2a2948' }}>
                  <span className="tag tag-green">Resolution: {selected.resolution}</span>
                  {selected.refundAmount && <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', color: '#4ade80' }}>Refund: ₹{selected.refundAmount}</span>}
                </div>
              )}
            </div>

            <div className="status-bar" style={{ justifyContent: 'center', marginBottom: '0.8rem' }}>
              {getDisputeTimeline(selected.status).map((s, i, arr) => (
                <span key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
                  <span className={`stage-dot ${s.completed ? 'completed' : ''} ${s.active ? 'active' : ''}`}
                    style={s.active ? { background: '#f9a826', boxShadow: '0 0 6px #f9a826' } : {}} />
                  <span style={{ fontSize: '0.65rem', color: s.completed ? '#4ade80' : s.active ? '#f9a826' : '#555', marginLeft: '3px' }}>{s.label}</span>
                  {i < arr.length - 1 && <span className="stage-line" />}
                </span>
              ))}
            </div>

            <div className="msg-thread">
              {disputeMessages.filter(m => m.disputeId === selected.id).map(m => (
                <div key={m.id} className={`msg ${m.senderType}`}>
                  <div className="sender">{m.senderName} ({m.senderType})</div>
                  {m.message}
                  <div className="time">{new Date(m.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>

            {!['resolved', 'refunded', 'rejected', 'closed'].includes(selected.status) && (
              <div className="msg-input">
                <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  placeholder="Type your message..." onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                <button className="btn btn-primary btn-sm" onClick={sendMessage}>Send</button>
              </div>
            )}

            <div className="modal-actions">
              {selected.status !== 'escalated' && !['resolved', 'refunded', 'rejected', 'closed'].includes(selected.status) && (
                <button className="btn btn-danger btn-sm" onClick={() => {
                  addDisputeMessage(selected.id, 'platform', 'adm-1', 'System', 'User escalated this dispute to platform review.');
                  updateDisputeStatus(selected.id, { status: 'escalated', escalatedAt: new Date().toISOString(), escalatedBy: 'u-1' });
                  addNotification(NOTIF_TYPES.DISPUTE_ESCALATED, 'Dispute Escalated', `Dispute #${selected.questionCode} sent to platform review`, 'platform', { tab: 'disputes' });
                }}>Escalate to Platform</button>
              )}
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
