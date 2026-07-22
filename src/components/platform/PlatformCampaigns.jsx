import { useState } from 'react';
import { platformCampaigns, allAstrologers } from '../../data/mockData';

const APPROVAL_MAP = { pending_review: 'tag-yellow', approved: 'tag-green', rejected: 'tag-red', not_submitted: 'tag-gray' };

export default function PlatformCampaigns() {
  const [list, setList] = useState(platformCampaigns);
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const approve = (id) => {
    setList(list.map(c => c.id === id ? { ...c, approvalStatus: 'approved', status: 'active', reviewedAt: new Date().toISOString(), reviewedBy: 'adm-1' } : c));
    setSelected(null);
  };

  const reject = () => {
    if (!rejectReason.trim()) return alert('Please provide a rejection reason');
    setList(list.map(c => c.id === selected.id ? { ...c, approvalStatus: 'rejected', rejectionReason: rejectReason, reviewedAt: new Date().toISOString(), reviewedBy: 'adm-1' } : c));
    setSelected(null);
    setRejectReason('');
  };

  const pendingCount = list.filter(c => c.approvalStatus === 'pending_review').length;
  const approvedCount = list.filter(c => c.approvalStatus === 'approved').length;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Campaign Publishing — Platform Panel</h2>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem' }}>
            <span>⏳ Pending: <strong style={{ color: '#facc15' }}>{pendingCount}</strong></span>
            <span>✅ Approved: <strong style={{ color: '#4ade80' }}>{approvedCount}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid">
        {list.map(c => (
          <div className="card" key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{c.campaignName}</h3>
              <span className={`tag ${APPROVAL_MAP[c.approvalStatus]}`}>{c.approvalStatus}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#888' }}>{c.description}</p>
            <div className="row" style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}>
              <div><span style={{ color: '#888' }}>Astrologer</span><br />{c.astrologerName}</div>
              <div><span style={{ color: '#888' }}>Price</span><br />₹{c.price}</div>
              <div><span style={{ color: '#888' }}>Slots</span><br />{c.soldSlots}/{c.totalSlots}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', margin: '0.3rem 0' }}>
              {c.categories.map(cat => <span className="tag tag-blue" key={cat}>{cat}</span>)}
              {c.languages.map(l => <span className="tag tag-purple" key={l}>{l}</span>)}
            </div>

            {c.rejectionReason && (
              <div style={{ padding: '0.4rem', background: '#3a1616', borderRadius: '6px', fontSize: '0.75rem', color: '#f87171', marginTop: '0.3rem' }}>
                Rejected: {c.rejectionReason}
              </div>
            )}

            {c.approvalStatus === 'pending_review' && (
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.3rem' }}>
                <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => setSelected(c)}>Review</button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => { setSelected(c); setRejectReason(''); }}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Review Campaign</h2>
            <div style={{ background: '#12102a', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3>{selected.campaignName}</h3>
              <p style={{ fontSize: '0.8rem', color: '#aaa' }}>{selected.description}</p>
              <div className="row" style={{ marginTop: '0.5rem' }}>
                <div><span style={{ color: '#888' }}>Astrologer</span><br />{selected.astrologerName}</div>
                <div><span style={{ color: '#888' }}>Price</span><br />₹{selected.price}</div>
                <div><span style={{ color: '#888' }}>Deadline</span><br />{selected.deadlineHours}h</div>
                <div><span style={{ color: '#888' }}>Submitted</span><br />{new Date(selected.submittedAt).toLocaleDateString()}</div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div><span style={{ color: '#888' }}>Categories</span>: {selected.categories.join(', ')}</div>
                <div><span style={{ color: '#888' }}>Languages</span>: {selected.languages.join(', ')}</div>
                <div><span style={{ color: '#888' }}>Mode</span>: {selected.submissionMode}/{selected.answerMode}</div>
                <div><span style={{ color: '#888' }}>Slots</span>: {selected.totalSlots} total, {selected.generalQuestionLimit} general, {selected.individualQuestionLimit} individual</div>
              </div>
            </div>

            <div className="form-group">
              <label>Rejection Reason (if rejecting)</label>
              <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="If rejecting, explain why..." />
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={reject} disabled={!rejectReason.trim()}>Reject</button>
              <button className="btn btn-success" onClick={() => approve(selected.id)}>Approve & Publish</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2>All Astrologers</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Title</th><th>Rating</th><th>Campaigns</th><th>Total Revenue</th><th>Status</th></tr>
            </thead>
            <tbody>
              {allAstrologers.map(a => (
                <tr key={a.id}>
                  <td>{a.displayName}</td>
                  <td style={{ color: '#888' }}>{a.title}</td>
                  <td>{a.rating} ⭐</td>
                  <td>{a.campaignsCount}</td>
                  <td className="value-up">₹{a.totalRevenue.toLocaleString()}</td>
                  <td><span className="tag tag-green">verified</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
