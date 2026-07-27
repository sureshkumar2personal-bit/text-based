import { useState, useEffect, useRef } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';
import ModalPortal from '../ui/ModalPortal';

const STATUS_MAP = { open: 'tag-red', astrologer_reviewing: 'tag-yellow', astrologer_responded: 'tag-blue', user_reply: 'tag-purple', escalated: 'tag-red', platform_reviewing: 'tag-purple', resolved: 'tag-green', refunded: 'tag-green', rejected: 'tag-gray', closed: 'tag-gray' };

export default function AstroDisputes({ astrologerId }) {
  const { disputes, disputeMessages, updateDisputeStatus, addDisputeMessage, allAstrologers, questions } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const myDisputes = disputes.filter(d => d.astrologerId === astrologerId);
  const [expandedId, setExpandedId] = useState(null);
  const [answering, setAnswering] = useState(null);
  const [response, setResponse] = useState('');

  const astroName = allAstrologers.find(a => a.id === astrologerId)?.displayName || 'Dr. Arjun Nair';

  const gridRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (expandedId && gridRef.current && !gridRef.current.contains(e.target)) {
        setExpandedId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expandedId]);

  const submitResponse = () => {
    if (!response.trim()) return toast.error('Response text is required');
    addDisputeMessage(answering.id, 'astrologer', astrologerId, astroName, response.trim());
    updateDisputeStatus(answering.id, { status: 'astrologer_responded', astrologerResponse: response, astrologerRespondedAt: new Date().toISOString() });
    setResponse('');
    setAnswering(null);
    toast.success('Response submitted!');
    addNotification(NOTIF_TYPES.DISPUTE_RESPONSE_RECEIVED, 'Your dispute has been answered', `${astroName} has responded to your dispute.`, 'user', null, answering.id, {
      astrologerId,
      astrologerName: astroName,
      responsePreview: response.slice(0, 80),
      disputeStatus: 'astrologer_responded',
      relatedQuestionId: answering.questionId,
      questionCode: answering.questionCode,
      questionTitle: answering.questionTitle,
      fullResponse: response,
      canRate: true,
    });
  };

  const rejectDispute = (d) => {
    addDisputeMessage(d.id, 'astrologer', astrologerId, astroName, 'I reject this dispute. Escalating to platform for review.');
    updateDisputeStatus(d.id, { status: 'escalated', astrologerResponse: 'Rejected', astrologerRespondedAt: new Date().toISOString() });
    toast.warning('Dispute rejected — escalated to platform');
    addNotification(NOTIF_TYPES.DISPUTE_ESCALATED, 'Dispute Rejected', `Your dispute #${d.questionCode} was rejected and escalated to platform`, 'user', { tab: 'questions' });
    addNotification(NOTIF_TYPES.DISPUTE_ESCALATED, 'Dispute Escalated', `Dispute #${d.questionCode} escalated by ${astroName}`, 'platform', { tab: 'disputes' });
  };

  const canAct = (d) => ['open', 'astrologer_reviewing', 'user_reply'].includes(d.status);

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
        <div className="grid" ref={gridRef}>
          {myDisputes.map(d => (
            <div
              className="card"
              key={d.id}
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
            >
              {expandedId === d.id && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(26, 21, 48, 0.95)', color: '#e8e3f0', padding: '1rem', borderRadius: '12px',
                  fontSize: '0.78rem', lineHeight: 1.5, zIndex: 100,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)', border: '1px solid rgba(155,111,212,0.2)',
                  pointerEvents: 'auto', backdropFilter: 'blur(4px)',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: '#f87171' }}>⚖️ {d.questionTitle || `Dispute #${d.questionCode}`}</div>
                    <p style={{ margin: '0.3rem 0', fontSize: '0.75rem', color: '#bca3e0' }}><strong>Reason:</strong> {d.reason?.replace(/_/g, ' ')}</p>
                    <p style={{ margin: '0.3rem 0', fontSize: '0.75rem', color: '#bca3e0', whiteSpace: 'pre-wrap' }}>{d.description}</p>
                    <div style={{ marginTop: '0.3rem', fontSize: '0.7rem', color: '#9a8db0' }}>
                      User: {d.userFullName} · ₹{d.purchaseAmount} · {new Date(d.createdAt).toLocaleDateString()}
                    </div>
                    {d.astrologerResponse && (
                      <div style={{ marginTop: '0.4rem', padding: '0.4rem', borderTop: '1px solid rgba(155,111,212,0.15)', fontSize: '0.72rem', color: '#60a5fa' }}>
                        My Response: {d.astrologerResponse}
                      </div>
                    )}
                    <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: '#6e6573' }}>Click anywhere to close</div>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>#{d.questionCode}</h3>
                <span className={`tag ${STATUS_MAP[d.status]}`}>{d.status}</span>
              </div>
              <p style={{ fontSize: '0.8rem', margin: '0.3rem 0', color: '#ddd' }}><strong>{d.questionTitle}</strong> — {d.reason?.replace(/_/g, ' ')}</p>
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
                {canAct(d) && (
                  <>
                    <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={e => { e.stopPropagation(); setAnswering(d); }}>
                      ✓ Accept
                    </button>
                    <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={e => { e.stopPropagation(); rejectDispute(d); }}>
                      ✗ Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {answering && (
        <ModalPortal onClose={() => { setAnswering(null); setResponse(''); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Respond to Dispute</h2>
            <div style={{ background: 'var(--bg-elevated)', color: 'var(--text-on-elevated)', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.8rem' }}>
              <p style={{ fontWeight: 500 }}>{answering.questionTitle}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{answering.description}</p>
            </div>

            <div className="msg-thread">
              {disputeMessages.filter(m => m.disputeId === answering.id).map(m => (
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
              <button className="btn btn-secondary" onClick={() => { setAnswering(null); setResponse(''); }}>Cancel</button>
              <button className="btn btn-primary" onClick={submitResponse}>Submit Response</button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
