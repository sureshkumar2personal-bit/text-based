import { useState, useMemo } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

const STATUS_MAP = { open: 'tag-red', astrologer_reviewing: 'tag-yellow', astrologer_responded: 'tag-blue', user_reply: 'tag-purple', escalated: 'tag-red', platform_reviewing: 'tag-purple', resolved: 'tag-green', refunded: 'tag-green', rejected: 'tag-gray', closed: 'tag-gray' };

export default function PlatformDisputes() {
  const { disputes, disputeMessages, updateDisputeStatus, addDisputeMessage } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [selected, setSelected] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [resolution, setResolution] = useState('');
  const [newMsg, setNewMsg] = useState('');

  const summary = useMemo(() => ({
    total: disputes.length,
    open: disputes.filter(d => d.status === 'open').length,
    astrologer_reviewing: disputes.filter(d => d.status === 'astrologer_reviewing').length,
    escalated: disputes.filter(d => d.status === 'escalated').length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
    refunded: disputes.filter(d => d.status === 'refunded').length,
    rejected: disputes.filter(d => d.status === 'rejected').length,
    closed: disputes.filter(d => d.status === 'closed').length,
  }), [disputes]);

  const resolveDispute = () => {
    if (!resolution) return toast.error('Select a resolution');
    if (resolution === 'refunded' && !refundAmount) return toast.error('Enter refund amount');

    const refundAmt = resolution === 'refunded' ? Number(refundAmount) : 0;
    updateDisputeStatus(selected.id, { status: resolution, resolution, adminNotes: adminNotes || null, resolvedBy: 'adm-1', resolvedAt: new Date().toISOString(), refundAmount: refundAmt });
    addDisputeMessage(selected.id, 'platform', 'adm-1', 'Platform', `Dispute ${resolution} by platform.${adminNotes ? ' Note: ' + adminNotes : ''}${refundAmt ? ' Refund: ₹' + refundAmt : ''}`);

    setSelected(null);
    setAdminNotes('');
    setRefundAmount('');
    setResolution('');
    toast.success(`Dispute ${resolution} by platform.`);
    addNotification(NOTIF_TYPES.DISPUTE_RESOLVED, 'Dispute Resolved', `Dispute #${selected.questionCode} resolved as "${resolution}"`);
  };

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    addDisputeMessage(selected.id, 'platform', 'adm-1', 'Platform', newMsg.trim());
    setNewMsg('');
  };

  const getFiltered = (status) => {
    if (status === 'all') return disputes;
    return disputes.filter(d => d.status === status);
  };

  const [filter, setFilter] = useState('all');
  const filtered = getFiltered(filter);

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Dispute Management — Platform</h2>
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
            {Object.entries(summary).map(([k, v]) => (
              <span key={k}>{k}: <strong>{v}</strong></span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'open', 'escalated', 'astrologer_reviewing', 'platform_reviewing', 'resolved', 'refunded', 'rejected'].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)}>
              {s.replace('_', ' ')} ({s === 'all' ? disputes.length : disputes.filter(d => d.status === s).length})
            </button>
          ))}
        </div>
      </div>

      <div className="grid">
        {filtered.map(d => (
          <div className="card" key={d.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>#{d.questionCode}</h3>
              <span className={`tag ${STATUS_MAP[d.status]}`}>{d.status}</span>
            </div>
            <p style={{ fontSize: '0.8rem', margin: '0.3rem 0' }}><strong>{d.questionTitle}</strong></p>
            <p style={{ fontSize: '0.75rem', color: '#888' }}>{d.reason.replace(/_/g, ' ')}</p>
            <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.2rem' }}>
              {d.userFullName} vs {d.astrologerName} · ₹{d.purchaseAmount}
            </div>
            {d.escalatedAt && (
              <div style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.2rem' }}>
                ⚠️ Escalated: {new Date(d.escalatedAt).toLocaleString()}
              </div>
            )}
            <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.3rem' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => { setSelected(d); setAdminNotes(''); setRefundAmount(String(d.purchaseAmount)); setResolution(''); }}>
                {d.status === 'resolved' || d.status === 'refunded' ? 'View' : 'Resolve'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h2>#{selected.questionCode}</h2>
              <span className={`tag ${STATUS_MAP[selected.status]}`}>{selected.status}</span>
            </div>

            <div className="row" style={{ background: '#12102a', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.8rem' }}>
              <div><span style={{ color: '#888' }}>User</span><br />{selected.userFullName}</div>
              <div><span style={{ color: '#888' }}>Astrologer</span><br />{selected.astrologerName}</div>
              <div><span style={{ color: '#888' }}>Amount</span><br />₹{selected.purchaseAmount}</div>
              <div><span style={{ color: '#888' }}>Escrow</span><br />{selected.status.includes('fund') ? 'Released' : selected.status.includes('volve') || selected.status === 'open' || selected.status === 'escalated' ? 'On Hold' : '—'}</div>
            </div>

            <div style={{ background: '#12102a', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.8rem' }}>
              <p><strong>Question:</strong> {selected.questionTitle}</p>
              <p style={{ fontSize: '0.78rem', color: '#aaa' }}>{selected.questionText}</p>
              <p style={{ marginTop: '0.3rem' }}><strong>Reason:</strong> {selected.reason.replace(/_/g, ' ')}</p>
              <p style={{ fontSize: '0.78rem', color: '#aaa' }}>{selected.description}</p>
              {selected.astrologerResponse && (
                <div style={{ marginTop: '0.3rem', padding: '0.3rem', borderTop: '1px solid #2a2948' }}>
                  <span className="tag tag-blue" style={{ marginBottom: '2px', fontSize: '0.7rem' }}>Astrologer Response</span>
                  <p style={{ fontSize: '0.78rem', color: '#bbb' }}>{selected.astrologerResponse}</p>
                </div>
              )}
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
              <>
                <div className="msg-input" style={{ marginTop: '0.5rem' }}>
                  <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Platform message..." onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                  <button className="btn btn-primary btn-sm" onClick={sendMessage}>Send</button>
                </div>

                <div style={{ borderTop: '1px solid #2a2948', marginTop: '1rem', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Platform Resolution</h3>
                  <div className="row">
                    <div className="form-group">
                      <label>Resolution</label>
                      <select value={resolution} onChange={e => setResolution(e.target.value)}>
                        <option value="">Select...</option>
                        <option value="resolved">Resolved (mark question answered)</option>
                        <option value="refunded">Refunded (refund from escrow)</option>
                        <option value="rejected">Rejected (dismiss dispute)</option>
                        <option value="closed">Closed (no action)</option>
                      </select>
                    </div>
                    {resolution === 'refunded' && (
                      <div className="form-group">
                        <label>Refund Amount (max: ₹{selected.purchaseAmount})</label>
                        <input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} max={selected.purchaseAmount} />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Platform Notes</label>
                    <textarea rows={2} value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Internal notes about this resolution..." />
                  </div>
                  <button className="btn btn-success" onClick={resolveDispute} disabled={!resolution}
                    style={{ width: '100%' }}>
                    Apply Resolution
                  </button>
                </div>
              </>
            )}

            <div className="modal-actions" style={{ marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
