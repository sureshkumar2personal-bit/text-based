import { salesData } from '../../data/mockData';

export default function AstroSales() {
  const s = salesData;
  const maxRevenue = Math.max(...s.campaignWise.map(c => c.revenue));
  const maxMonth = Math.max(...s.monthlyEarnings.map(m => m.earnings));

  return (
    <div>
      <div className="card">
        <h2>Sales Dashboard</h2>
        <div className="row" style={{ marginTop: '0.5rem' }}>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#4ade80', fontWeight: 700 }}>₹{(s.totalEarnings).toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>Total Earnings</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#f9a826', fontWeight: 700 }}>{s.totalPurchases}</div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>Total Purchases</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#60a5fa', fontWeight: 700 }}>{s.totalQuestionsAnswered}</div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>Questions Answered</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#c084fc', fontWeight: 700 }}>{s.averageRating} ⭐</div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>Average Rating</div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="card" style={{ flex: 2 }}>
          <h2>Monthly Earnings</h2>
          {s.monthlyEarnings.map(m => {
            const pct = maxMonth > 0 ? (m.earnings / maxMonth * 100) : 0;
            return (
              <div className="chart-bar" key={m.month}>
                <span className="chart-bar-label">{m.month}</span>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${pct}%`, background: pct > 70 ? '#4ade80' : pct > 40 ? '#f9a826' : '#f87171' }} />
                </div>
                <span className="chart-bar-value">₹{m.earnings}</span>
                <span style={{ fontSize: '0.68rem', color: '#666' }}>({m.answered} answers)</span>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ flex: 1.5 }}>
          <h2>Campaign Breakdown</h2>
          {s.campaignWise.map(c => {
            const pct = maxRevenue > 0 ? (c.revenue / maxRevenue * 100) : 0;
            return (
              <div key={c.campaignName} style={{ marginBottom: '0.7rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#ddd' }}>{c.campaignName}</div>
                <div className="chart-bar" style={{ margin: '0.2rem 0' }}>
                  <div className="chart-bar-track" style={{ height: '12px' }}>
                    <div className="chart-bar-fill" style={{ width: `${pct}%`, background: '#60a5fa' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#888' }}>
                  <span>Sold: {c.sold}/{c.answered} answered</span>
                  <span>₹{c.revenue}</span>
                  <span className="value-up">+₹{c.net}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2>Payout History</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Period</th><th>Gross</th><th>Commission (20%)</th><th>Net</th><th>Status</th><th>Paid At</th></tr>
            </thead>
            <tbody>
              {s.payoutHistory.map(p => (
                <tr key={p.id}>
                  <td>{p.period}</td>
                  <td>₹{p.gross}</td>
                  <td className="value-down">-₹{p.commission}</td>
                  <td className="value-up">₹{p.net}</td>
                  <td><span className={`tag ${p.status === 'paid' ? 'tag-green' : 'tag-yellow'}`}>{p.status}</span></td>
                  <td>{p.paidAt || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ background: '#2a2518', borderColor: '#5a4a26' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <div>
            <h3 style={{ color: '#f9a826' }}>This Month (so far)</h3>
            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
              Revenue: <strong className="value-up">₹{s.currentMonthEarnings}</strong> · Commission: <strong className="value-down">₹{s.currentMonthCommission}</strong> · Net: <strong className="value-up">₹{s.currentMonthNet}</strong>
            </div>
          </div>
          <button className="btn btn-primary">Request Payout</button>
        </div>
      </div>
    </div>
  );
}
