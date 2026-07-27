import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { allAstrologers } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

export default function TransactionLogs() {
  const { escrowRecords, purchases, disputes, walletTransactions, astrologerWallets, getAstrologerWalletTransactions } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('escrow');

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

  const handleProcessPayout = (astroId) => {
    const w = getAstrologerWallet(astroId);
    if (w.availableBalance <= 0) return toast.info('No balance to process');
    const astroName = allAstrologers.find(a => a.id === astroId)?.displayName || 'Astrologer';
    const amount = w.availableBalance;
    toast.success('Payout of ₹' + amount + ' processed for ' + astroName);
    addNotification(NOTIF_TYPES.PAYOUT_REQUESTED, 'Payout Processed', '₹' + amount + ' payout processed for ' + astroName + ' — will be credited to bank account', 'astrologer', { tab: 'sales' });
  };

  const getAstrologerWallet = (id) => {
    return astrologerWallets[id] || { availableBalance: 0, totalEarned: 0, totalWithdrawn: 0 };
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Transaction & Escrow Logs</h2>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button className={`btn btn-sm ${tab === 'escrow' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('escrow')}>Escrow Records</button>
            <button className={`btn btn-sm ${tab === 'payouts' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('payouts')}>Astrologer Payouts</button>
          </div>
        </div>
      </div>

      {tab === 'escrow' && (
        <>
          <div className="card">
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {['all', 'held', 'released', 'refunded', 'on_hold_due_to_dispute'].map(s => (
                <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter(s)}>
                  {s.replace(/_/g, ' ')} ({s === 'all' ? escrowRecords.length : escrowRecords.filter(e => e.status === s).length})
                </button>
              ))}
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
        </>
      )}

      {tab === 'payouts' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Astrologer</th><th>Total Earned</th><th>Total Withdrawn</th><th>Available Balance</th><th>Action</th></tr>
            </thead>
            <tbody>
              {allAstrologers.map(a => {
                const w = getAstrologerWallet(a.id);
                return (
                  <tr key={a.id}>
                    <td><strong>{a.displayName}</strong><br /><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{a.title}</span></td>
                    <td className="value-up">₹{w.totalEarned.toLocaleString()}</td>
                    <td className="value-down">₹{w.totalWithdrawn.toLocaleString()}</td>
                    <td><strong>₹{w.availableBalance.toLocaleString()}</strong></td>
                    <td>
                      {w.availableBalance > 0 ? (
                        <button className="btn btn-success btn-sm" onClick={() => handleProcessPayout(a.id)}>Process Payout</button>
                      ) : (
                        <span className="tag tag-gray">No pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>{t.description}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
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
