import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

const STATUS_MAP = { open: 'tag-red', astrologer_reviewing: 'tag-yellow', astrologer_responded: 'tag-blue', user_reply: 'tag-purple', escalated: 'tag-red', platform_reviewing: 'tag-purple', resolved: 'tag-green', refunded: 'tag-green', rejected: 'tag-gray', closed: 'tag-gray' };

export default function AstroDisputes({ astrologerId }) {
  const { disputes, disputeMessages, updateDisputeStatus, addDisputeMessage, allAstrologers, acceptDisputeReanswer, questions } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const myDisputes = disputes.filter(d => d.astrologerId === astrologerId);
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');

  const astroName = allAstrologers.find(a => a.id === astrologerId)?.displayName || 'Dr. Arjun Nair';

  const markReviewing = (id) => {
    updateDisputeStatus(id, { status: 'astrologer_reviewing' });
  };

  const acceptDispute = (d) => {
    addDisputeMessage(d.id, 'astrologer', astrologerId, astroName, 'I accept this dispute and will re-answer the question.');
    acceptDisputeReanswer(d.questionId, d.id);
    const q = questions.find(x => x.id === d.questionId);
    toast.success('Dispute accepted — question returned to queue for re-answer');
    addNotification(NOTIF_TYPES.DISPUTE_RESOLVED, 'Dispute Accepted — Re-answering', `Your dispute #${d.questionCode} was accepted. The astrologer will re-answer.`, 'user', { tab: 'questions' });
  };

  const rejectDispute = (d) => {
    addDisputeMessage(d.id, 'astrologer', astrologerId, astroName, 'I reject this dispute. Escalating to platform for review.');
    updateDisputeStatus(d.id, { status: 'escalated', astrologerResponse: 'Rejected', astrologerRespondedAt: new Date().toISOString() });
    toast.warning('Dispute rejected — escalated to platform');
    addNotification(NOTIF_TYPES.DISPUTE_ESCALATED, 'Dispute Rejected', `Your dispute #${d.questionCode} was rejected and escalated to platform`, 'user', { tab: 'dispute-tracking' });
    addNotification(NOTIF_TYPES.DISPUTE_ESCALATED, 'Dispute Escalated', `Dispute #${d.questionCode} escalated by ${astroName}`, 'platform', { tab: 'disputes' });
  };

  const submitResponse = () => {
    if (!response.trim()) return toast.error('Response text is required');
    addDisputeMessage(selected.id, 'astrologer', astrologerId, astroName, response.trim());
    updateDisputeStatus(selected.id, { status: 'astrologer_responded', astrologerResponse: response, astrologerRespondedAt: new Date().toISOString() });
    setResponse('');
    setSelected(null);
    toast.success('Response submitted!');
    addNotification(NOTIF_TYPES.DISPUTE_RAISED, 'Dispute Response', `Astrologer responded to your dispute #${selected.questionCode}`, 'user', { tab: 'dispute-tracking' });
  };

  return (
    <div>
      <div className="card">
        <h2>Disputes ({myDisputes.length})</h2>
      </div>

      {myDisputes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No disputes for this astrologer.
        </div>
      ) : (
        <div className="grid">
          {myDisputes.map(d => (
            <div className="card" key={d.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>#{d.questionCode}</h3>
                <span className={`tag ${STATUS_MAP[d.status]}`}>{d.status}</span>
              </div>
              <p style={{ fontSize: '0.8rem', margin: '0.3rem 0', color: '#ddd' }}><strong>{d.questionTitle}</strong> — {d.reason}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.description}</p>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                User: {d.userFullName} · Purchase: ₹{d.purchaseAmount} · {new Date(d.createdAt).toLocaleDateString()}
              </div>
              {d.astrologerResponse && (
                <div style={{ marginTop: '0.4rem', padding: '0.5rem', background: 'var(--bg-elevated)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-on-elevated)' }}>
                  <span className="tag tag-blue" style={{ marginBottom: '3px' }}>My Response</span>
                  <p style={{ marginTop: '3px' }}>{d.astrologerResponse}</p>
                </div>
              )}
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {(d.status === 'open' || d.status === 'user_reply') && (
                  <button className="btn btn-secondary btn-sm" onClick={() => markReviewing(d.id)}>Mark Reviewing</button>
                )}
                {(d.status === 'open' || d.status === 'astrologer_reviewing' || d.status === 'user_reply') && (
                  <button className="btn btn-primary btn-sm" onClick={() => setSelected(d)}>Respond</button>
                )}
                {(d.status === 'open' || d.status === 'astrologer_reviewing' || d.status === 'user_reply') && (
                  <button className="btn btn-success btn-sm" onClick={() => acceptDispute(d)}>✓ Accept</button>
                )}
                {(d.status === 'open' || d.status === 'astrologer_reviewing' || d.status === 'user_reply') && (
                  <button className="btn btn-danger btn-sm" onClick={() => rejectDispute(d)}>✗ Reject</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Respond to Dispute</h2>
            <div style={{ background: 'var(--bg-elevated)', color: 'var(--text-on-elevated)', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.8rem' }}>
              <p style={{ fontWeight: 500 }}>{selected.questionTitle}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selected.description}</p>
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

            <div className="form-group" style={{ marginTop: '0.8rem' }}>
              <label>Your Response</label>
              <textarea rows={4} value={response} onChange={e => setResponse(e.target.value)} placeholder="Explain your side..." />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitResponse}>Submit Response</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
