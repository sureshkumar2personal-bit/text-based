import { useState, useMemo } from 'react';
import { useData } from '../../data/DataContext';
import { salesDataMap as initialSales } from '../../data/mockData';
import AnimatedCounter from '../ui/AnimatedCounter';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

export default function AstroSales({ astrologerId }) {
  const { purchases, answers, campaigns, ratings, addTransaction, addAstrologerTransaction, allAstrologers } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [s, setS] = useState(initialSales[astrologerId] || initialSales['a-1']);

  const astroName = allAstrologers.find(a => a.id === astrologerId)?.displayName || 'Astrologer';

  const myPurchases = purchases.filter(p => p.astrologerId === astrologerId);
  const myAnswers = answers.filter(a => a.astrologerId === astrologerId);
  const myCampaigns = campaigns.filter(c => c.astrologerId === astrologerId);
  const myRatings = ratings.filter(r => r.astrologerId === astrologerId);

  const live = useMemo(() => {
    const totalPurchases = myPurchases.length;
    const totalAnswered = myAnswers.length;
    const totalEarnings = myPurchases.reduce((sum, p) => sum + p.price, 0);
    const avgRating = myRatings.length > 0 ? (myRatings.reduce((sum, r) => sum + r.score, 0) / myRatings.length) : s.averageRating;
    const campaignWise = myCampaigns.map(c => {
      const campPurchases = myPurchases.filter(p => p.campaignId === c.id);
      const rev = campPurchases.reduce((s, p) => s + p.price, 0);
      const comm = rev * 0.2;
      const answered = campPurchases.filter(p => p.purchaseStatus === 'answered').length;
      return { campaignName: c.campaignName, sold: campPurchases.length, revenue: rev, commission: comm, net: rev - comm, answered };
    });
    const maxRevenue = campaignWise.length > 0 ? Math.max(...campaignWise.map(cw => cw.revenue)) : 1;
    return { totalPurchases, totalAnswered, totalEarnings, avgRating, campaignWise, maxRevenue };
  }, [myPurchases, myAnswers, myCampaigns, myRatings, s.averageRating]);

  const maxMonth = Math.max(...s.monthlyEarnings.map(m => m.earnings));

  return (
    <div>
      <div className="card card-gradient-border">
        <h2 className="gradient-text">📊 {astroName}'s Sales Dashboard</h2>
        <div className="row" style={{ marginTop: '0.5rem' }}>
          <div className="card" style={{ flex: 1, textAlign: 'center', animation: 'fadeInUp 0.4s ease-out' }}>
            <div style={{ fontSize: '1.5rem', color: '#4ade80', fontWeight: 700 }}>
              ₹<AnimatedCounter value={live.totalEarnings} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Earnings</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', animation: 'fadeInUp 0.5s ease-out' }}>
            <div style={{ fontSize: '1.5rem', color: '#f9a826', fontWeight: 700 }}>
              <AnimatedCounter value={live.totalPurchases} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Purchases</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
            <div style={{ fontSize: '1.5rem', color: '#60a5fa', fontWeight: 700 }}>
              <AnimatedCounter value={live.totalAnswered} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Questions Answered</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', animation: 'fadeInUp 0.7s ease-out' }}>
            <div style={{ fontSize: '1.5rem', color: '#c084fc', fontWeight: 700 }}>{live.avgRating.toFixed(1)} ⭐</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Rating</div>
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
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>({m.answered} answers)</span>
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
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.campaignName}</div>
                <div className="chart-bar" style={{ margin: '0.2rem 0' }}>
                  <div className="chart-bar-track" style={{ height: '12px' }}>
                    <div className="chart-bar-fill" style={{ width: `${pct}%`, background: '#60a5fa' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
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
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Revenue: <strong className="value-up">₹<AnimatedCounter value={s.currentMonthEarnings} /></strong> · Commission: <strong className="value-down">-₹<AnimatedCounter value={s.currentMonthCommission} /></strong> · Net: <strong className="value-up">₹<AnimatedCounter value={s.currentMonthNet} /></strong>
            </div>
          </div>
          <button className="btn btn-primary btn-glow" onClick={() => {
            const net = s.currentMonthNet;
            if (net <= 0) return toast.info('No earnings to payout this month');
            const newPayout = { id: `po-${Date.now()}`, period: new Date().toLocaleString('default', { month: 'long' }) + ' (Requested)', gross: s.currentMonthEarnings, commission: s.currentMonthCommission, net, status: 'pending', paidAt: null };
            setS({ ...s, payoutHistory: [newPayout, ...s.payoutHistory], currentMonthEarnings: 0, currentMonthCommission: 0, currentMonthNet: 0 });
            addTransaction('debit', net, `Payout request for ${new Date().toLocaleString('default', { month: 'long' })}`);
            addAstrologerTransaction(astrologerId, 'debit', net, `Payout requested: ${new Date().toLocaleString('default', { month: 'long' })}`);
            toast.success(`Payout request for ₹${net} submitted!`);
            addNotification(NOTIF_TYPES.PAYOUT_REQUESTED, 'Payout Requested', `₹${net} payout requested for ${new Date().toLocaleString('default', { month: 'long' })}`, 'astrologer', { tab: 'sales' });
            addNotification(NOTIF_TYPES.PAYOUT_REQUESTED, 'Payout Requested', `₹${net} payout requested by ${astroName} for ${new Date().toLocaleString('default', { month: 'long' })}`, 'platform', { tab: 'transactions' });
          }}>{s.currentMonthNet > 0 ? 'Request Payout' : 'Payout Requested'}</button>
        </div>
      </div>
    </div>
  );
}
