import { useState, useEffect } from 'react';
import { useData } from '../../data/DataContext';
import AnimatedCounter from '../ui/AnimatedCounter';

const formatDuration = (secs) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
};

export default function UserDashboard({ onNavigate }) {
  const { purchases, questions, wallet, allAstrologers, emergencyRequests } = useData();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const myPurchases = purchases.filter(p => p.userId === 'u-1');
  const myQuestions = questions.filter(q => q.userId === 'u-1');
  const myEmergency = emergencyRequests.filter(r => r.userId === 'u-1');
  const unusedPurchases = myPurchases.filter(p => p.purchaseStatus === 'question_pending' && !p.questionSubmitted);
  const pendingQ = myQuestions.filter(q => q.status === 'submitted' || q.status === 'under_review' || q.status === 'received_by_astrologer');
  const answeredQ = myQuestions.filter(q => q.status === 'answered');

  const completedCalls = myEmergency.filter(r => r.status === 'call_completed' && r.startedAt && r.endedAt);
  const totalCallSecs = completedCalls.reduce((sum, r) => sum + Math.max(0, (new Date(r.endedAt) - new Date(r.startedAt)) / 1000), 0);
  const liveCall = myEmergency.find(r => r.status === 'call_in_progress' && r.startedAt);
  const liveCallSecs = liveCall ? Math.max(0, (now - new Date(liveCall.startedAt)) / 1000) : 0;

  const callActivity = completedCalls.map(r => ({
    id: r.id, kind: 'emergency',
    name: `${r.callType === 'video' ? '📹' : '📞'} Emergency Call`,
    status: 'call_completed', astrologerName: r.astrologerName,
    createdAt: r.createdAt, durationSecs: Math.max(0, (new Date(r.endedAt) - new Date(r.startedAt)) / 1000)
  }));

  const recentActivity = [...myPurchases, ...myQuestions, ...callActivity]
    .sort((a, b) => new Date(b.createdAt || b.submittedAt) - new Date(a.createdAt || a.submittedAt)).slice(0, 5);

  return (
    <div>
      <div className="card card-gradient-border">
        <h2 className="gradient-text">✨ Welcome, Priya!</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Your astrology journey at a glance</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        <button type="button" className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.3s ease-out', cursor: 'pointer', width: '100%', border: '1px solid var(--line)', background: 'var(--bg)', font: 'inherit', color: 'inherit' }} onClick={() => onNavigate?.('questions', 'unused')}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--purple)' }}><AnimatedCounter value={unusedPurchases.length} /></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Purchases</div>
        </button>
        <button type="button" className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.4s ease-out', cursor: 'pointer', width: '100%', border: '1px solid var(--line)', background: 'var(--bg)', font: 'inherit', color: 'inherit' }} onClick={() => onNavigate?.('tracking', 'pending')}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f9a826' }}><AnimatedCounter value={pendingQ.length} /></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending Answers</div>
        </button>
        <button type="button" className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease-out', cursor: 'pointer', width: '100%', border: '1px solid var(--line)', background: 'var(--bg)', font: 'inherit', color: 'inherit' }} onClick={() => onNavigate?.('questions', 'answered')}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4ade80' }}><AnimatedCounter value={answeredQ.length} /></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Answered</div>
        </button>
        <button type="button" className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease-out', cursor: 'pointer', width: '100%', border: '1px solid var(--line)', background: 'var(--bg)', font: 'inherit', color: 'inherit' }} onClick={() => onNavigate?.('wallet')}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)' }}>₹<AnimatedCounter value={wallet.availableBalance} /></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wallet Balance</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--purple)', fontWeight: 600, marginTop: '2px' }}>View wallet →</div>
        </button>
        <button type="button" className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.7s ease-out', cursor: 'pointer', width: '100%', border: '1px solid var(--line)', background: 'var(--bg)', font: 'inherit', color: 'inherit' }} onClick={() => onNavigate?.('emergency')}>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#c0392b' }}>
            {liveCall ? <span style={{ color: '#f87171' }}>📞 {formatDuration(Math.floor(liveCallSecs))}</span> : <AnimatedCounter value={Math.floor(totalCallSecs / 60)} />}
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, marginLeft: '2px' }}>{liveCall ? '' : ' min'}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{liveCall ? 'Live Call Duration' : 'Total Call Duration'}</div>
          <div style={{ fontSize: '0.65rem', color: '#c0392b', fontWeight: 600, marginTop: '2px' }}>{completedCalls.length} call{completedCalls.length === 1 ? '' : 's'} completed →</div>
        </button>
      </div>

      <div className="row">
        <div className="card" style={{ flex: 1.5 }}>
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button className="btn btn-primary btn-glow" onClick={() => onNavigate?.('questions')}>
              🛒 Buy a Question Slot
            </button>
            <button className="btn btn-outline" onClick={() => onNavigate?.('ask')}>
              ✍️ Ask a Question
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate?.('wallet')}>
              💰 Wallet
            </button>
          </div>
        </div>

        <div className="card" style={{ flex: 2 }}>
          <h3>Recent Activity</h3>
          <div style={{ marginTop: '0.5rem' }}>
            {recentActivity.length === 0 ? (
              <div className="empty">No recent activity</div>
            ) : (
              recentActivity.map((item, i) => {
                const astroName = item.astrologerName || allAstrologers.find(a => a.id === item.astrologerId)?.displayName;
                return (
                <div key={item.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--line)', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.campaignName || item.title || item.questionCode || item.name}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
                      {item.purchaseStatus || item.status}
                    </span>
                    {item.durationSecs !== undefined && (
                      <span className="tag tag-red" style={{ marginLeft: '0.4rem', fontSize: '0.62rem' }}>⏱ {formatDuration(Math.floor(item.durationSecs))}</span>
                    )}
                    {astroName && <div style={{ fontSize: '0.68rem', color: '#d63384' }}>{astroName}</div>}
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    {new Date(item.createdAt || item.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Wallet Summary</h3>
        <div className="row" style={{ marginTop: '0.5rem' }}>
          <div><span style={{ color: 'var(--text-muted)' }}>Available</span><br /><strong style={{ fontSize: '1.1rem', color: '#4ade80' }}>₹{wallet.availableBalance}</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>On Hold (Escrow)</span><br /><strong style={{ fontSize: '1.1rem', color: '#f9a826' }}>₹{wallet.holdBalance}</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>Pending</span><br /><strong style={{ fontSize: '1.1rem', color: '#60a5fa' }}>₹{wallet.pendingBalance}</strong></div>
        </div>
      </div>
    </div>
  );
}
