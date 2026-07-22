import { useState } from 'react';
import { campaigns, wallet } from '../../data/mockData';

export default function UserPurchase() {
  const activeCamps = campaigns.filter(c => c.status === 'active' && c.availableSlots > 0);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [balance] = useState(wallet.availableBalance);
  const [purchased, setPurchased] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePurchase = () => {
    if (!selectedCamp) return;
    if (balance < selectedCamp.price) return alert('Insufficient wallet balance!');
    setLoading(true);
    setTimeout(() => {
      setPurchased({
        id: `pur-${Date.now()}`,
        campaignName: selectedCamp.campaignName,
        price: selectedCamp.price,
        purchaseCode: `QP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        purchaseStatus: 'question_pending'
      });
      setLoading(false);
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
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80' }}>₹{balance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {selectedCamp && (
        <div className="card" style={{ borderColor: '#5a4a26', background: '#2a2518' }}>
          <h3>Confirm Purchase</h3>
          <p>You are about to purchase a slot in <strong>{selectedCamp.campaignName}</strong></p>
          <div className="row" style={{ marginTop: '0.5rem' }}>
            <div><span style={{ color: '#888' }}>Price</span><br /><strong style={{ fontSize: '1.1rem' }}>₹{selectedCamp.price}</strong></div>
            <div><span style={{ color: '#888' }}>Available Slots</span><br />{selectedCamp.availableSlots}</div>
            <div><span style={{ color: '#888' }}>Answer Mode</span><br />{selectedCamp.answerMode}</div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.3rem' }}>
            Payment will be deducted from your wallet and held in escrow.
          </div>
          <div style={{ marginTop: '0.7rem', display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setSelectedCamp(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handlePurchase} disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${selectedCamp.price} from Wallet`}
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
              onClick={() => setSelectedCamp(c)} disabled={balance < c.price}>
              {balance < c.price ? 'Insufficient Balance' : 'Buy Slot'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
