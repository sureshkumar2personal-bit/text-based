import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';
import WalletView from '../ui/WalletView';

export default function UserWallet() {
  const { wallet, walletTransactions, addTransaction } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(500);

  const handleTopUp = () => {
    if (topUpAmount <= 0) return toast.error('Enter a valid amount');
    addTransaction('credit', topUpAmount, 'Wallet top-up');
    toast.success(`₹${topUpAmount} added to wallet!`);
    addNotification(NOTIF_TYPES.WALLET_TOPUP, 'Wallet Top-Up', `₹${topUpAmount} added to your wallet. New balance: ₹${wallet.availableBalance + topUpAmount}`, 'user', { tab: 'wallet' });
    setShowTopUp(false);
    setTopUpAmount(500);
  };

  return (
    <div>
      <WalletView
        wallet={wallet}
        transactions={walletTransactions}
        actorName="Your"
        onTopUp={() => setShowTopUp(true)}
      />

      {showTopUp && (
        <div className="modal-overlay" onClick={() => setShowTopUp(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>💳 Top Up Wallet</h2>
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current Balance: <strong style={{ color: 'var(--ink)' }}>₹{wallet.availableBalance}</strong></div>
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
