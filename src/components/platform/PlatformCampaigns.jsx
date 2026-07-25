import { useData } from '../../data/DataContext';
import { allAstrologers } from '../../data/mockData';

export default function PlatformCampaigns() {
  const { campaigns } = useData();

  return (
    <div>
      <div className="card">
        <h2>All Campaigns — Platform View</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Read-only view of all astrologer campaigns</p>
      </div>

      <div className="grid">
        {campaigns.map(c => (
          <div className="card" key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{c.campaignName}</h3>
              <span className={`tag ${c.status === 'active' ? 'tag-green' : c.status === 'draft' ? 'tag-yellow' : c.status === 'paused' ? 'tag-blue' : 'tag-red'}`}>{c.status}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.description}</p>
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