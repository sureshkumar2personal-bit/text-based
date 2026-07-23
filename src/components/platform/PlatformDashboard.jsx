import { useData } from '../../data/DataContext';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function PlatformDashboard() {
  const { platformStats, disputes, platformCampaigns, purchases } = useData();

  const stats = platformStats;
  const pendingReviewCount = platformCampaigns.filter(c => c.approvalStatus === 'pending_review').length;
  const totalPurchases = purchases.length;
  const openDisputes = disputes.filter(d => ['open', 'escalated', 'astrologer_reviewing', 'platform_reviewing', 'user_reply'].includes(d.status)).length;

  const metricCards = [
    { label: 'Total Users', value: stats.totalUsers, color: '#60a5fa', icon: '👥' },
    { label: 'Total Astrologers', value: stats.totalAstrologers, color: 'var(--purple)', icon: '⭐' },
    { label: 'Questions Asked', value: stats.totalQuestionsAsked, color: '#f9a826', icon: '📝' },
    { label: 'Revenue (₹)', value: stats.totalRevenue, color: '#4ade80', icon: '💰', prefix: '₹' },
    { label: 'Active Campaigns', value: stats.activeCampaigns, color: '#34d399', icon: '📢' },
    { label: 'Pending Reviews', value: pendingReviewCount, color: '#f87171', icon: '⏳' },
    { label: 'Open Disputes', value: openDisputes, color: '#c084fc', icon: '⚖️' },
    { label: 'Avg Resolution', value: stats.averageResolutionTimeHours, color: '#e879f9', icon: '⏱️', suffix: 'hrs', decimals: 1 },
  ];

  return (
    <div>
      <div className="card card-gradient-border">
        <h2 className="gradient-text">🏛️ Platform Dashboard</h2>
        <p style={{ fontSize: '0.82rem', color: '#888' }}>Real-time platform overview</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {metricCards.map((m, i) => (
          <div key={m.label} className="card" style={{ textAlign: 'center', animation: `fadeInUp ${0.1 + i * 0.06}s ease-out` }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{m.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: m.color }}>
              {m.prefix || ''}<AnimatedCounter value={m.value} decimals={m.decimals || 0} />{m.suffix || ''}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#888' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="card" style={{ flex: 1.5 }}>
          <h3>Monthly Revenue</h3>
          <div style={{ marginTop: '0.5rem' }}>
            {stats.monthlyRevenue.map((m, i) => {
              const maxRev = Math.max(...stats.monthlyRevenue.map(x => x.revenue));
              const pct = (m.revenue / maxRev * 100);
              return (
                <div key={m.month} className="chart-bar">
                  <span className="chart-bar-label">{m.month}</span>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${pct}%`, background: i === stats.monthlyRevenue.length - 1 ? 'var(--purple)' : '#60a5fa' }} />
                  </div>
                  <span className="chart-bar-value">₹{(m.revenue / 1000).toFixed(1)}k</span>
                  <span style={{ fontSize: '0.68rem', color: '#888' }}>({m.questions} Qs)</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h3>Top Astrologers</h3>
          <div style={{ marginTop: '0.5rem' }}>
            {stats.topAstrologers.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#888' }}>#{i + 1}</span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.82rem' }}>{a.name}</div>
                    <div style={{ fontSize: '0.68rem', color: '#888' }}>{a.rating} ⭐ · {a.questionsAnswered} answered</div>
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: '#4ade80' }}>₹{a.revenue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Platform Health</h3>
        <div className="row" style={{ marginTop: '0.5rem' }}>
          <div className="stat-pill">📊 Commission Collected: ₹{stats.totalCommissionCollected.toLocaleString()}</div>
          <div className="stat-pill">📈 Active Users: {stats.totalUsers}</div>
          <div className="stat-pill">✅ Answer Rate: {stats.totalQuestionsAnswered > 0 ? Math.round(stats.totalQuestionsAnswered / stats.totalQuestionsAsked * 100) : 0}%</div>
          <div className="stat-pill">⚡ Avg Resolution: {stats.averageResolutionTimeHours}h</div>
        </div>
      </div>
    </div>
  );
}
