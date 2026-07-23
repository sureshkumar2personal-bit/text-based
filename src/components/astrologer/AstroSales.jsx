import { useState, useMemo } from 'react';
import { useData } from '../../data/DataContext';
import { salesData as initialSales } from '../../data/mockData';
import AnimatedCounter from '../ui/AnimatedCounter';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

export default function AstroSales() {
  const { purchases, answers, campaigns, ratings, addTransaction } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [s, setS] = useState(initialSales);

  const live = useMemo(() => {
    const totalPurchases = purchases.length;
    const totalAnswered = answers.length;
    const totalEarnings = campaigns.reduce((sum, c) => sum + c.soldSlots * c.price, 0);
    const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length) : 4.5;
    const campaignWise = campaigns.map(c => {
      const rev = c.soldSlots * c.price;
      const comm = rev * 0.2;
      const answered = answers.filter(a => {
        const q = purchases.find(p => p.id === a.questionId || p.questionId === a.questionId);
        return q && q.campaignId === c.id;
      }).length;
      return { campaignName: c.campaignName, sold: c.soldSlots, revenue: rev, commission: comm, net: rev - comm, answered };
    });
    const maxRevenue = campaignWise.length > 0 ? Math.max(...campaignWise.map(cw => cw.revenue)) : 1;
    return { totalPurchases, totalAnswered, totalEarnings, avgRating, campaignWise, maxRevenue };
  }, [purchases, answers, campaigns, ratings]);

  const maxMonth = Math.max(...s.monthlyEarnings.map(m => m.earnings));

  return (
    <div>
      <div className="card card-gradient-border">
        <h2 className="gradient-text">📊 Sales Dashboard</h2>
        <div className="row" style={{ marginTop: '0.5rem' }}>
          <div className="card" style={{ flex: 1, textAlign: 'center', animation: 'fadeInUp 0.4s ease-out' }}>
            <div style={{ fontSize: '1.5rem', color: '#4ade80', fontWeight: 700 }}>
              ₹<AnimatedCounter value={live.totalEarnings} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>Total Earnings</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', animation: 'fadeInUp 0.5s ease-out' }}>
            <div style={{ fontSize: '1.5rem', color: '#f9a826', fontWeight: 700 }}>
              <AnimatedCounter value={live.totalPurchases} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>Total Purchases</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
            <div style={{ fontSize: '1.5rem', color: '#60a5fa', fontWeight: 700 }}>
              <AnimatedCounter value={live.totalAnswered} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>Questions Answered</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', animation: 'fadeInUp 0.7s ease-out' }}>
            <div style={{ fontSize: '1.5rem', color: '#c084fc', fontWeight: 700 }}>{live.avgRating.toFixed(1)} ⭐</div>
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
          {live.campaignWise.map(c => {
            const pct = live.maxRevenue > 0 ? (c.revenue / live.maxRevenue * 100) : 0;
            return (
              <div key={c.campaignName} style={{ marginBottom: '0.7rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#888' }}>{c.campaignName}</div>
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

      <div className="card card-gradient-border" style={{ background: 'var(--bg-glass)' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <div>
            <h3 style={{ color: 'var(--gold)' }}>This Month (so far)</h3>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>
              Revenue: <strong className="value-up">₹<AnimatedCounter value={s.currentMonthEarnings} /></strong> · Commission: <strong className="value-down">-₹<AnimatedCounter value={s.currentMonthCommission} /></strong> · Net: <strong className="value-up">₹<AnimatedCounter value={s.currentMonthNet} /></strong>
            </div>
          </div>
          <button className="btn btn-primary btn-glow" onClick={() => {
            const net = s.currentMonthNet;
            if (net <= 0) return toast.info('No earnings to payout this month');
            const newPayout = { id: `po-${Date.now()}`, period: new Date().toLocaleString('default', { month: 'long' }) + ' (Requested)', gross: s.currentMonthEarnings, commission: s.currentMonthCommission, net, status: 'pending', paidAt: null };
            setS({ ...s, payoutHistory: [newPayout, ...s.payoutHistory], currentMonthEarnings: 0, currentMonthCommission: 0, currentMonthNet: 0 });
            addTransaction('debit', net, `Payout request for ${new Date().toLocaleString('default', { month: 'long' })}`);
            toast.success(`Payout request for ₹${net} submitted!`);
            addNotification(NOTIF_TYPES.PAYOUT_REQUESTED, 'Payout Requested', `₹${net} payout requested for ${new Date().toLocaleString('default', { month: 'long' })}`);
          }}>{s.currentMonthNet > 0 ? 'Request Payout' : 'Payout Requested'}</button>
        </div>
      </div>
    </div>
  );
}
