import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';
import ModalPortal from '../ui/ModalPortal';

const STATUS_MAP = { open: 'tag-red', astrologer_reviewing: 'tag-yellow', astrologer_responded: 'tag-blue', user_reply: 'tag-purple', escalated: 'tag-red', platform_reviewing: 'tag-purple', resolved: 'tag-green', refunded: 'tag-green', rejected: 'tag-gray', closed: 'tag-gray' };

export default function AstroDisputes({ astrologerId }) {
  const { disputes, disputeMessages, updateDisputeStatus, addDisputeMessage, allAstrologers, questions, answers } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const myDisputes = disputes.filter(d => d.astrologerId === astrologerId);
  const [viewingD, setViewingD] = useState(null);
  const [answering, setAnswering] = useState(null);
  const [response, setResponse] = useState('');

  const astroName = allAstrologers.find(a => a.id === astrologerId)?.displayName || 'Dr. Arjun Nair';

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
        <div className="grid">
          {myDisputes.map(d => (
            <div
              className="card"
              key={d.id}
              style={{ cursor: 'pointer' }}
              onClick={() => setViewingD(d)}
            >
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

      {viewingD && (
        <ModalPortal onClose={() => setViewingD(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <h2>⚖️ {viewingD.questionTitle || `Dispute #${viewingD.questionCode}`}</h2>

            <div style={{ background: 'var(--bg-elevated)', color: 'var(--text-on-elevated)', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.6rem' }}>
              <p style={{ fontSize: '0.78rem', marginBottom: '0.3rem' }}><strong>Reason:</strong> {viewingD.reason?.replace(/_/g, ' ')}</p>
              <p style={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>{viewingD.description}</p>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                User: {viewingD.userFullName} · ₹{viewingD.purchaseAmount} · {new Date(viewingD.createdAt).toLocaleDateString()}
              </div>
            </div>

            {(() => {
              const relQ = questions.find(q => q.id === viewingD.questionId);
              if (!relQ) return null;
              const relA = answers.find(a => a.questionId === viewingD.questionId);
              return (
                <>
                  <div style={{ background: '#2a2555', border: '1px solid rgba(155,111,212,0.3)', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.6rem' }}>
                    <p style={{ fontWeight: 500, marginBottom: '0.3rem', color: '#fff' }}>📝 Related Question</p>
                    <p style={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap', color: '#ddd' }}>{relQ.questionText}</p>
                    <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '0.3rem' }}>
                      {relQ.title} · {relQ.category} · {relQ.language}
                    </div>
                  </div>
                  {relA && (
                    <div style={{ background: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.15)', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.6rem' }}>
                      <p style={{ fontWeight: 500, marginBottom: '0.3rem', color: '#4ade80' }}>✅ Your Answer</p>
                      {relA.answerText && <p style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{relA.answerText}</p>}
                      {relA.voiceUrl && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🎤 <a href={relA.voiceUrl} target="_blank" rel="noreferrer">Voice Answer</a></p>}
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        {relA.answerMode} · {new Date(relA.createdAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {viewingD.astrologerResponse && (
              <div style={{ background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.15)', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.6rem' }}>
                <p style={{ fontWeight: 500, marginBottom: '0.3rem', color: '#60a5fa' }}>My Response</p>
                <p style={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>{viewingD.astrologerResponse}</p>
              </div>
            )}

            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Dispute ID: #{viewingD.questionCode} · Status: <span className={`tag ${STATUS_MAP[viewingD.status]}`}>{viewingD.status}</span>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setViewingD(null)}>Close</button>
            </div>
          </div>
        </ModalPortal>
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
