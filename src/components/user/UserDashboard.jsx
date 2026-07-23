import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function UserDashboard() {
  const { purchases, questions, answers, wallet, walletTransactions, addTransaction } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(500);

  const myPurchases = purchases.filter(p => p.userId === 'u-1');
  const myQuestions = questions.filter(q => q.userId === 'u-1');
  const pendingQ = myQuestions.filter(q => q.status === 'submitted' || q.status === 'under_review' || q.status === 'received_by_astrologer');
  const answeredQ = myQuestions.filter(q => q.status === 'answered');
  const activePurchases = myPurchases.filter(p => p.purchaseStatus !== 'disputed' && p.purchaseStatus !== 'refunded');
  const recentActivity = [...myPurchases, ...myQuestions].sort((a, b) => new Date(b.createdAt || b.submittedAt) - new Date(a.createdAt || a.submittedAt)).slice(0, 5);

  const handleTopUp = () => {
    if (topUpAmount <= 0) return toast.error('Enter a valid amount');
    addTransaction('credit', topUpAmount, 'Wallet top-up');
    toast.success(`₹${topUpAmount} added to wallet!`);
    addNotification(NOTIF_TYPES.WALLET_TOPUP, 'Wallet Top-Up', `₹${topUpAmount} added to your wallet. New balance: ₹${wallet.availableBalance + topUpAmount}`);
    setShowTopUp(false);
    setTopUpAmount(500);
  };

  return (
    <div>
      <div className="card card-gradient-border">
        <h2 className="gradient-text">✨ Welcome, Priya!</h2>
        <p style={{ fontSize: '0.82rem', color: '#888' }}>Your astrology journey at a glance</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        <div className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.3s ease-out' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--purple)' }}><AnimatedCounter value={activePurchases.length} /></div>
          <div style={{ fontSize: '0.75rem', color: '#888' }}>Active Purchases</div>
        </div>
        <div className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.4s ease-out' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f9a826' }}><AnimatedCounter value={pendingQ.length} /></div>
          <div style={{ fontSize: '0.75rem', color: '#888' }}>Pending Answers</div>
        </div>
        <div className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease-out' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4ade80' }}><AnimatedCounter value={answeredQ.length} /></div>
          <div style={{ fontSize: '0.75rem', color: '#888' }}>Answered</div>
        </div>
        <div className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease-out', cursor: 'pointer' }} onClick={() => setShowTopUp(true)}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)' }}>₹<AnimatedCounter value={wallet.availableBalance} /></div>
          <div style={{ fontSize: '0.75rem', color: '#888' }}>Wallet Balance</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--purple)', fontWeight: 600, marginTop: '2px' }}>Tap to top up →</div>
        </div>
      </div>

      <div className="row">
        <div className="card" style={{ flex: 1.5 }}>
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button className="btn btn-primary btn-glow" onClick={() => document.querySelector('[data-tab="purchase"]')?.click() || alert('Go to Purchase tab')}>
              🛒 Buy a Question Slot
            </button>
            <button className="btn btn-outline" onClick={() => document.querySelector('[data-tab="ask"]')?.click() || alert('Go to Ask Question tab')}>
              ✍️ Ask a Question
            </button>
            <button className="btn btn-secondary" onClick={() => setShowTopUp(true)}>
              💰 Top Up Wallet
            </button>
          </div>
        </div>

        <div className="card" style={{ flex: 2 }}>
          <h3>Recent Activity</h3>
          <div style={{ marginTop: '0.5rem' }}>
            {recentActivity.length === 0 ? (
              <div className="empty">No recent activity</div>
            ) : (
              recentActivity.map((item, i) => (
                <div key={item.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--line)', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.campaignName || item.title || item.questionCode}</span>
                    <span style={{ color: '#888', marginLeft: '0.3rem' }}>
                      {item.purchaseStatus || item.status}
                    </span>
                  </div>
                  <span style={{ color: '#888', fontSize: '0.7rem' }}>
                    {new Date(item.createdAt || item.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Wallet Summary</h3>
        <div className="row" style={{ marginTop: '0.5rem' }}>
          <div><span style={{ color: '#888' }}>Available</span><br /><strong style={{ fontSize: '1.1rem', color: '#4ade80' }}>₹{wallet.availableBalance}</strong></div>
          <div><span style={{ color: '#888' }}>On Hold (Escrow)</span><br /><strong style={{ fontSize: '1.1rem', color: '#f9a826' }}>₹{wallet.holdBalance}</strong></div>
          <div><span style={{ color: '#888' }}>Pending</span><br /><strong style={{ fontSize: '1.1rem', color: '#60a5fa' }}>₹{wallet.pendingBalance}</strong></div>
        </div>
      </div>

      {showTopUp && (
        <div className="modal-overlay" onClick={() => setShowTopUp(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>💳 Top Up Wallet</h2>
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              <div style={{ fontSize: '0.82rem', color: '#888', marginBottom: '0.5rem' }}>Current Balance: <strong style={{ color: 'var(--ink)' }}>₹{wallet.availableBalance}</strong></div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {[500, 1000, 2000, 5000].map(amt => (
                  <button key={amt} className={`btn ${topUpAmount === amt ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTopUpAmount(amt)}>₹{amt}</button>
                ))}
              </div>
              <div className="form-group" style={{ maxWidth: '300px', margin: '0 auto' }}>
                <label>Custom Amount</label>
                <input type="number" value={topUpAmount} onChange={e => setTopUpAmount(Number(e.target.value))} min="1" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowTopUp(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleTopUp} disabled={topUpAmount <= 0}>Add ₹{topUpAmount}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
