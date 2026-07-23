import { useState } from 'react';
import { useData } from '../../data/DataContext';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function AstroAnalytics() {
  const { questions, answers, ratings, campaigns } = useData();
  const [period, setPeriod] = useState('6m');

  const answered = answers.filter(a => a.astrologerId === 'a-1').length;
  const totalQ = questions.filter(q => q.astrologerId === 'a-1').length;
  const myRatings = ratings.filter(r => r.astrologerId === 'a-1');
  const avgRating = myRatings.length > 0 ? (myRatings.reduce((s, r) => s + r.score, 0) / myRatings.length) : 4.5;
  const responseTime = 12.4;
  const conversionRate = totalQ > 0 ? Math.round(answered / totalQ * 100) : 0;
  const activeCamps = campaigns.filter(c => c.status === 'active').length;
  const totalRevenue = campaigns.reduce((s, c) => s + c.soldSlots * c.price, 0);

  const metrics = [
    { label: 'Avg Rating', value: avgRating.toFixed(1), suffix: '⭐', color: 'var(--gold)' },
    { label: 'Response Time', value: responseTime, suffix: 'hrs avg', color: '#60a5fa' },
    { label: 'Conversion', value: conversionRate, suffix: '%', color: '#4ade80' },
    { label: 'Active Campaigns', value: activeCamps, suffix: '', color: 'var(--purple)' },
    { label: 'Questions Answered', value: answered, suffix: '', color: '#f9a826' },
  ];

  return (
    <div>
      <div className="card card-gradient-border">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="gradient-text">📈 Analytics</h2>
          <select className="btn btn-secondary btn-sm" value={period} onChange={e => setPeriod(e.target.value)}
            style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '6px 12px', background: 'transparent', color: 'var(--ink)' }}>
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        {metrics.map((m, i) => (
          <div key={m.label} className="card" style={{ textAlign: 'center', animation: `fadeInUp ${0.2 + i * 0.1}s ease-out` }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: m.color }}>
              <AnimatedCounter value={m.value} decimals={m.label === 'Avg Rating' ? 1 : 0} />{m.suffix}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.2rem' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="card" style={{ flex: 1 }}>
          <h3>Rating Distribution</h3>
          <div style={{ marginTop: '0.5rem' }}>
            {[5,4,3,2,1].map(s => {
              const count = myRatings.filter(r => r.score === s).length;
              const pct = myRatings.length > 0 ? (count / myRatings.length * 100) : 0;
              return (
                <div key={s} className="chart-bar">
                  <span className="chart-bar-label">{s} ⭐</span>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${pct}%`, background: s >= 4 ? '#4ade80' : s >= 3 ? '#f9a826' : '#f87171' }} />
                  </div>
                  <span className="chart-bar-value">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h3>Performance Insights</h3>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📊</span>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>Answer Rate</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>{answered} of {totalQ} questions answered</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⏱️</span>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>Avg Response Time</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>{responseTime} hours — faster than 78% of astrologers</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>Estimated Revenue</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>₹<AnimatedCounter value={totalRevenue} /> across all campaigns</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🏆</span>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>Dispute Rate</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>Low — excellent customer satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
