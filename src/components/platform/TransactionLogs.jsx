import { useState } from 'react';
import { useData } from '../../data/DataContext';

export default function TransactionLogs() {
  const { escrowRecords, purchases, disputes, walletTransactions } = useData();
  const [filter, setFilter] = useState('all');

  const getFiltered = () => {
    if (filter === 'all') return escrowRecords;
    return escrowRecords.filter(e => e.status === filter);
  };

  const filtered = getFiltered();

  const escrowStatusMap = {
    held: 'tag-blue',
    released: 'tag-green',
    refunded: 'tag-red',
    on_hold_due_to_dispute: 'tag-yellow',
    partially_released: 'tag-purple',
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Transaction & Escrow Logs</h2>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {['all', 'held', 'released', 'refunded', 'on_hold_due_to_dispute'].map(s => (
              <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(s)}>
                {s.replace(/_/g, ' ')} ({s === 'all' ? escrowRecords.length : escrowRecords.filter(e => e.status === s).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Escrow ID</th><th>User</th><th>Astrologer</th><th>Service Type</th><th>Gross</th><th>Commission (20%)</th><th>Astrologer Payout</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>{e.id}</td>
                <td>{e.userId}</td>
                <td>{e.astrologerId}</td>
                <td>{e.serviceType.replace(/_/g, ' ')}</td>
                <td>₹{e.grossAmount}</td>
                <td className="value-down">-₹{e.platformCommission.toFixed(1)}</td>
                <td className="value-up">₹{e.astrologerAmount.toFixed(1)}</td>
                <td><span className={`tag ${escrowStatusMap[e.status] || 'tag-gray'}`}>{e.status.replace(/_/g, ' ')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row" style={{ marginTop: '1rem' }}>
        <div className="card" style={{ flex: 1 }}>
          <h3>Recent Wallet Transactions</h3>
          <div style={{ marginTop: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {walletTransactions.slice(0, 10).map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--line)', fontSize: '0.78rem' }}>
                <div>
                  <span className={t.type === 'credit' ? 'value-up' : 'value-down'} style={{ fontWeight: 600 }}>
                    {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                  </span>
                  <span style={{ color: '#888', marginLeft: '0.3rem' }}>{t.description}</span>
                </div>
                <span style={{ color: '#888', fontSize: '0.7rem' }}>
                  <span className={`tag ${t.status === 'completed' ? 'tag-green' : 'tag-yellow'}`}>{t.status}</span>
                  {' '}{new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h3>Escrow Summary</h3>
          <div style={{ marginTop: '0.5rem' }}>
            <div className="row">
              <div className="stat-pill">💰 Held: ₹{escrowRecords.filter(e => e.status === 'held').reduce((s, e) => s + e.grossAmount, 0)}</div>
              <div className="stat-pill">⚠️ Disputed: ₹{escrowRecords.filter(e => e.status === 'on_hold_due_to_dispute').reduce((s, e) => s + e.grossAmount, 0)}</div>
            </div>
            <div className="row" style={{ marginTop: '0.3rem' }}>
              <div className="stat-pill">📊 Total Commission: ₹{escrowRecords.reduce((s, e) => s + e.platformCommission, 0).toFixed(1)}</div>
              <div className="stat-pill">📈 Total Payout: ₹{escrowRecords.reduce((s, e) => s + e.astrologerAmount, 0).toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
