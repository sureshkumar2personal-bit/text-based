import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

const STATUS_MAP = { open: 'tag-red', astrologer_reviewing: 'tag-yellow', astrologer_responded: 'tag-blue', user_reply: 'tag-purple', escalated: 'tag-red', platform_reviewing: 'tag-purple', resolved: 'tag-green', refunded: 'tag-green', rejected: 'tag-gray', closed: 'tag-gray' };

export default function AstroDisputes() {
  const { disputes, disputeMessages, updateDisputeStatus, addDisputeMessage } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const myDisputes = disputes.filter(d => d.astrologerId === 'a-1');
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');

  const markReviewing = (id) => {
    updateDisputeStatus(id, { status: 'astrologer_reviewing' });
  };

  const submitResponse = () => {
    if (!response.trim()) return toast.error('Response text is required');
    addDisputeMessage(selected.id, 'astrologer', 'a-1', 'Dr. Arjun Nair', response.trim());
    updateDisputeStatus(selected.id, { status: 'astrologer_responded', astrologerResponse: response, astrologerRespondedAt: new Date().toISOString() });
    setResponse('');
    setSelected(null);
    toast.success('Response submitted!');
    addNotification(NOTIF_TYPES.DISPUTE_RAISED, 'Dispute Response Sent', `You responded to dispute #${selected.questionCode}`);
  };

  return (
    <div>
      <div className="card">
        <h2>Disputes ({myDisputes.length})</h2>
      </div>

      <div className="grid">
        {myDisputes.map(d => (
          <div className="card" key={d.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>#{d.questionCode}</h3>
              <span className={`tag ${STATUS_MAP[d.status]}`}>{d.status}</span>
            </div>
            <p style={{ fontSize: '0.8rem', margin: '0.3rem 0', color: '#ddd' }}><strong>{d.questionTitle}</strong> — {d.reason}</p>
            <p style={{ fontSize: '0.78rem', color: '#888' }}>{d.description}</p>
            <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.2rem' }}>
              User: {d.userFullName} · Purchase: ₹{d.purchaseAmount} · {new Date(d.createdAt).toLocaleDateString()}
            </div>
            {d.astrologerResponse && (
              <div style={{ marginTop: '0.4rem', padding: '0.5rem', background: '#12102a', borderRadius: '6px', fontSize: '0.78rem', color: '#bbb' }}>
                <span className="tag tag-blue" style={{ marginBottom: '3px' }}>My Response</span>
                <p style={{ marginTop: '3px' }}>{d.astrologerResponse}</p>
              </div>
            )}
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.3rem' }}>
              {(d.status === 'open' || d.status === 'user_reply') && (
                <button className="btn btn-secondary btn-sm" onClick={() => markReviewing(d.id)}>Mark Reviewing</button>
              )}
              {(d.status === 'open' || d.status === 'astrologer_reviewing' || d.status === 'user_reply') && (
                <button className="btn btn-primary btn-sm" onClick={() => setSelected(d)}>Respond</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Respond to Dispute</h2>
            <div style={{ background: '#12102a', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.8rem' }}>
              <p style={{ fontWeight: 500 }}>{selected.questionTitle}</p>
              <p style={{ fontSize: '0.8rem', color: '#aaa' }}>{selected.description}</p>
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
