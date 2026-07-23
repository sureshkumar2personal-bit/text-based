import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

export default function UserPurchase({ onPurchaseSuccess }) {
  const { campaigns, wallet, addPurchase } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const activeCamps = campaigns.filter(c => c.status === 'active' && c.availableSlots > 0);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(null);

  const handlePurchase = () => {
    if (!selectedCamp) return;
    if (wallet.availableBalance < selectedCamp.price) {
      toast.error('Insufficient wallet balance! Top up your wallet first.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const p = addPurchase(selectedCamp);
      setPurchased({ id: p.id, campaignName: p.campaignName, price: p.price, purchaseCode: p.purchaseCode, purchaseStatus: 'question_pending' });
      setLoading(false);
      toast.success(`Purchased slot in ${p.campaignName}!`, 4000);
      addNotification(NOTIF_TYPES.PURCHASE_SUCCESS, 'Slot Purchased', `You bought a slot in "${p.campaignName}" for ₹${p.price}`);
      if (onPurchaseSuccess) onPurchaseSuccess();
    }, 1200);
  };

  if (purchased) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
        <h2>Purchase Successful!</h2>
        <p style={{ color: '#aaa', margin: '0.5rem 0' }}>You've purchased a slot in <strong>{purchased.campaignName}</strong></p>
        <div style={{ background: '#12102a', padding: '1rem', borderRadius: '8px', display: 'inline-block', textAlign: 'left', margin: '0.5rem 0' }}>
          <div>Code: <strong>{purchased.purchaseCode}</strong></div>
          <div>Amount: <strong>₹{purchased.price}</strong></div>
          <div>Status: <span className="tag tag-yellow">question_pending</span></div>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#666' }}>Go to "Ask Question" tab to submit your question.</p>
        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => { setPurchased(null); setSelectedCamp(null); }}>Buy Another</button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Purchase Question Slot</h2>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#888' }}>Wallet Balance</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80' }}>₹{wallet.availableBalance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {selectedCamp && (
        <div className="card" style={{
          borderColor: '#5b3da0', background: 'linear-gradient(135deg, #2a1848 0%, #3F256D 100%)',
          boxShadow: '0 4px 24px rgba(63, 37, 109, 0.3), inset 0 1px 0 rgba(150, 100, 230, 0.1)',
          backdropFilter: 'blur(8px)', overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <div style={{ fontSize: '1.4rem' }}>💳</div>
            <h3 style={{ margin: 0, color: '#c8a8ff' }}>Confirm Purchase</h3>
          </div>
          <p style={{ color: '#bca3e0', fontSize: '0.85rem' }}>You are about to purchase a slot in <strong style={{ color: '#dcc8ff' }}>{selectedCamp.campaignName}</strong></p>
          <div className="row" style={{ marginTop: '0.6rem', background: 'rgba(150,100,230,0.08)', borderRadius: '8px', padding: '0.6rem' }}>
            <div><span style={{ color: '#a88bd0' }}>Price</span><br /><strong style={{ fontSize: '1.2rem', color: '#c8a8ff' }}>₹{selectedCamp.price}</strong></div>
            <div><span style={{ color: '#a88bd0' }}>Available Slots</span><br /><strong style={{ color: '#c8a8ff' }}>{selectedCamp.availableSlots}</strong></div>
            <div><span style={{ color: '#a88bd0' }}>Answer Mode</span><br /><strong style={{ color: '#c8a8ff' }}>{selectedCamp.answerMode}</strong></div>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#9a7fc0', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>🔒</span> Payment will be deducted from your wallet and held in escrow.
          </div>
          <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.06)', borderColor: '#5b3da0', color: '#bca3e0' }} onClick={() => setSelectedCamp(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c84a, #f7e07a, #e8c84a)', borderColor: '#fae582', color: '#1a1508', fontWeight: 700, boxShadow: '0 0 20px rgba(232, 200, 74, 0.5), 0 0 40px rgba(232, 200, 74, 0.2)' }} onClick={handlePurchase} disabled={loading}>
              {loading ? '⏳ Processing...' : `💳 Pay ₹${selectedCamp.price} from Wallet`}
            </button>
          </div>
        </div>
      )}

      <div className="grid">
        {activeCamps.map(c => (
          <div className="card" key={c.id}>
            <h3>{c.campaignName}</h3>
            <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.4rem' }}>{c.description}</p>
            <div className="row">
              <div><span style={{ color: '#888' }}>Price</span><br /><strong>₹{c.price}</strong></div>
              <div><span style={{ color: '#888' }}>Slots Left</span><br />{c.availableSlots}/{c.totalSlots}</div>
              <div><span style={{ color: '#888' }}>Answer In</span><br />{c.deadlineHours}h</div>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', margin: '0.3rem 0' }}>
              {c.categories.map(cat => <span className="tag tag-blue" key={cat}>{cat}</span>)}
              {c.languages.map(l => <span className="tag tag-purple" key={l}>{l}</span>)}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.3rem' }}
              onClick={() => setSelectedCamp(c)} disabled={wallet.availableBalance < c.price}>
              {wallet.availableBalance < c.price ? 'Insufficient Balance' : 'Buy Slot'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
