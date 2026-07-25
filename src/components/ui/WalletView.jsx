import { useState, useMemo } from 'react';
import AnimatedCounter from './AnimatedCounter';

export default function WalletView({ wallet, transactions, actorName, onTopUp }) {
  const [txFilter, setTxFilter] = useState('all');

  const filtered = useMemo(() => {
    if (txFilter === 'all') return transactions;
    return transactions.filter(t => t.type === txFilter);
  }, [transactions, txFilter]);

  const totalCredits = useMemo(() =>
    transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalDebits = useMemo(() =>
    transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  return (
    <div>
      <div className="card card-gradient-border">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="gradient-text">💼 {actorName}'s Wallet</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Balance: <strong>₹{wallet.availableBalance?.toLocaleString() || 0}</strong></p>
          </div>
          {onTopUp && (
            <button className="btn btn-primary btn-glow" onClick={onTopUp}>💰 Top Up</button>
          )}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4ade80' }}>
            ₹<AnimatedCounter value={wallet.availableBalance || 0} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available Balance</div>
        </div>
        {wallet.totalEarned !== undefined && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#60a5fa' }}>
              ₹<AnimatedCounter value={wallet.totalEarned || 0} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Earned</div>
          </div>
        )}
        {wallet.totalWithdrawn !== undefined && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f87171' }}>
              ₹<AnimatedCounter value={wallet.totalWithdrawn || 0} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Withdrawn</div>
          </div>
        )}
        {wallet.holdBalance !== undefined && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f9a826' }}>
              ₹<AnimatedCounter value={wallet.holdBalance || 0} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On Hold (Escrow)</div>
          </div>
        )}
        {wallet.pendingBalance !== undefined && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#c084fc' }}>
              ₹<AnimatedCounter value={wallet.pendingBalance || 0} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending</div>
          </div>
        )}
      </div>

      <div className="row">
        <div className="card" style={{ flex: 1 }}>
          <h3>Summary</h3>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Credits (In)</span>
              <span style={{ color: '#4ade80', fontWeight: 600 }}>+₹{totalCredits.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Debits (Out)</span>
              <span style={{ color: '#f87171', fontWeight: 600 }}>-₹{totalDebits.toLocaleString()}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '0.4rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700 }}>
              <span>Net Balance</span>
              <span style={{ color: wallet.availableBalance >= 0 ? '#4ade80' : '#f87171' }}>
                ₹{(wallet.availableBalance || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>Transaction History</h3>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {['all', 'credit', 'debit'].map(f => (
                <button key={f} className={`btn btn-sm ${txFilter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTxFilter(f)}>
                  {f === 'all' ? 'All' : f === 'credit' ? 'Credits' : 'Debits'}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">No transactions found</div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filtered.map(tx => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid var(--line)', fontSize: '0.78rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500 }}>{tx.description}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {new Date(tx.createdAt).toLocaleString()}
                      {tx.status === 'pending' && <span className="tag tag-yellow" style={{ marginLeft: '0.3rem', fontSize: '0.6rem' }}>pending</span>}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: tx.type === 'credit' ? '#4ade80' : '#f87171', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
