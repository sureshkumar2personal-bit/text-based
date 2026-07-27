import { useData } from '../../data/DataContext';
import { allAstrologers } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

export default function PlatformCampaigns() {
  const { campaigns, updateCampaign } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();

  const handleApprove = (c) => {
    updateCampaign(c.id, { status: 'active', availableSlots: c.totalSlots - c.soldSlots });
    toast.success('Campaign "' + c.campaignName + '" approved and activated!');
    const astroName = allAstrologers.find(a => a.id === c.astrologerId)?.displayName || 'Astrologer';
    addNotification(NOTIF_TYPES.CAMPAIGN_APPROVED, 'Campaign Approved', 'Your campaign "' + c.campaignName + '" has been approved and is now active', 'astrologer', { tab: 'campaigns' });
    addNotification(NOTIF_TYPES.CAMPAIGN_ACTIVATED, 'New Campaign Available', '"' + c.campaignName + '" by ' + astroName + ' is now accepting questions', 'user', { tab: 'questions' });
  };

  const handleReject = (c) => {
    updateCampaign(c.id, { status: 'rejected' });
    toast.warning('Campaign "' + c.campaignName + '" rejected');
    const astroName = allAstrologers.find(a => a.id === c.astrologerId)?.displayName || 'Astrologer';
    addNotification(NOTIF_TYPES.CAMPAIGN_REJECTED, 'Campaign Rejected', 'Your campaign "' + c.campaignName + '" was rejected by platform. Please review and resubmit.', 'astrologer', { tab: 'campaigns' });
  };

  return (
    <div>
      <div className="card">
        <h2>All Campaigns — Platform View</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Manage campaigns — approve or reject draft campaigns</p>
      </div>

      <div className="grid">
        {campaigns.map(c => (
          <div className="card" key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{c.campaignName}</h3>
              <span className={`tag ${c.status === 'active' ? 'tag-green' : c.status === 'draft' ? 'tag-yellow' : c.status === 'paused' ? 'tag-blue' : c.status === 'rejected' ? 'tag-red' : 'tag-gray'}`}>{c.status}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.description}</p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Astrologer: {allAstrologers.find(a => a.id === c.astrologerId)?.displayName || 'Unknown'}
            </div>
            <div className="row" style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>General/Individual</span><br />₹{c.generalPrice} / ₹{c.individualPrice}</div>
              <div><span style={{ color: 'var(--text-muted)' }}>Slots</span><br />{c.soldSlots}/{c.totalSlots}</div>
              <div><span style={{ color: 'var(--text-muted)' }}>Deadline</span><br />{c.deadlineHours}h</div>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', margin: '0.3rem 0' }}>
              {c.categories.map(cat => <span className="tag tag-blue" key={cat}>{cat}</span>)}
              {c.languages.map(l => <span className="tag tag-purple" key={l}>{l}</span>)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Mode: {c.submissionMode}/{c.answerMode} · {c.generalQuestionLimit} general / {c.individualQuestionLimit} individual slots
            </div>
            {c.status === 'draft' && (
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => handleApprove(c)}>✅ Approve</button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => handleReject(c)}>❌ Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>

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
                  <td style={{ color: 'var(--text-muted)' }}>{a.title}</td>
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
