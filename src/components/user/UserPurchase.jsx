import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

export default function UserPurchase({ onPurchaseSuccess }) {
  const { campaigns, wallet, addPurchase, allAstrologers } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [selectedAstrologerId, setSelectedAstrologerId] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [variation, setVariation] = useState('general');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(null);

  const activeCamps = campaigns.filter(c =>
    c.status === 'active' && c.availableSlots > 0 && c.astrologerId === selectedAstrologerId
  );

  const effectivePrice = selectedCamp
    ? (variation === 'individual' ? selectedCamp.individualPrice : selectedCamp.generalPrice)
    : 0;

  const totalPrice = effectivePrice * quantity;

  const handlePurchase = () => {
    if (!selectedCamp) return;
    if (wallet.availableBalance < totalPrice) {
      toast.error('Insufficient wallet balance! Top up your wallet first.');
      return;
    }
    if (quantity > selectedCamp.availableSlots) {
      toast.error('Not enough available slots!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ps = addPurchase(selectedCamp, variation, quantity);
      const first = ps[0];
      setPurchased({ count: quantity, campaignName: first.campaignName, price: totalPrice, variation: first.variation });
      setLoading(false);
      toast.success(`Purchased ${quantity}x ${variation} slot(s) in ${first.campaignName}!`, 4000);
      addNotification(NOTIF_TYPES.PURCHASE_SUCCESS, 'Slot Purchased', `You bought ${quantity}x ${variation} slot(s) in "${first.campaignName}" for ₹${totalPrice}`, 'user', { tab: 'purchase' });
      addNotification(NOTIF_TYPES.NEW_QUEUE_ITEM, 'New Slot Purchase', `${first.campaignName} — ${quantity}x ${variation} slot(s) purchased by user`, 'astrologer', { tab: 'queue' });
      if (onPurchaseSuccess) onPurchaseSuccess();
    }, 1200);
  };

  if (purchased) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>✅</div>
        <h2>Purchase Successful!</h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0' }}>You've purchased <strong>{purchased.count}x {purchased.variation}</strong> slot(s) in <strong>{purchased.campaignName}</strong></p>
        <div style={{ background: 'var(--bg-elevated)', color: 'var(--text-on-elevated)', padding: '1rem', borderRadius: '8px', display: 'inline-block', textAlign: 'left', margin: '0.5rem 0' }}>
          <div>Total Amount: <strong>₹{purchased.price}</strong></div>
          <div>Type: <span className="tag tag-purple">{purchased.variation}</span></div>
          <div>Status: <span className="tag tag-yellow">question_pending</span></div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Go to "Ask Question" tab to submit your question.</p>
        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => { setPurchased(null); setSelectedCamp(null); setSelectedAstrologerId(null); setQuantity(1); }}>Buy More</button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Purchase Question Slot</h2>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Wallet Balance</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80' }}>₹{wallet.availableBalance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '0.8rem' }}>Choose an Astrologer</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {allAstrologers.map(a => (
            <div
              key={a.id}
              className={`card ${selectedAstrologerId === a.id ? 'card-gradient-border' : ''}`}
              style={{
                cursor: 'pointer', textAlign: 'center', padding: '1rem',
                borderColor: selectedAstrologerId === a.id ? '#5b3da0' : undefined,
                transition: 'all 0.2s', transform: selectedAstrologerId === a.id ? 'scale(1.02)' : undefined
              }}
              onClick={() => { setSelectedAstrologerId(a.id); setSelectedCamp(null); }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #5b3da0, #c084fc)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', fontWeight: 700, color: '#fff',
                margin: '0 auto 0.5rem'
              }}>
                {a.displayName.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{a.displayName}</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>{a.title}</p>
              <div style={{ fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--gold)' }}>{'⭐'.repeat(Math.round(a.rating))}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}> {a.rating}</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                {a.specialties?.slice(0, 2).join(' · ')}
              </div>
              {selectedAstrologerId === a.id && (
                <div style={{ marginTop: '0.3rem' }}>
                  <span className="tag tag-green">Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedAstrologerId && (
        <>
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

              <div style={{ marginTop: '0.6rem', background: 'rgba(150,100,230,0.08)', borderRadius: '8px', padding: '0.8rem' }}>
                <label style={{ fontSize: '0.78rem', color: '#a88bd0', display: 'block', marginBottom: '0.4rem' }}>Select Slot Type:</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className={`btn ${variation === 'general' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}
                    onClick={() => setVariation('general')}>
                    <div style={{ fontSize: '0.72rem' }}>General</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>₹{selectedCamp.generalPrice}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>No personal details needed</div>
                  </button>
                  <button className={`btn ${variation === 'individual' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}
                    onClick={() => setVariation('individual')}>
                    <div style={{ fontSize: '0.72rem' }}>Individual</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>₹{selectedCamp.individualPrice}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>With birth chart details</div>
                  </button>
                </div>
              </div>

              <div className="row" style={{ marginTop: '0.4rem', background: 'rgba(150,100,230,0.08)', borderRadius: '8px', padding: '0.6rem' }}>
                <div><span style={{ color: '#a88bd0' }}>Unit Price</span><br /><strong style={{ fontSize: '1.2rem', color: '#c8a8ff' }}>₹{effectivePrice}</strong></div>
                <div><span style={{ color: '#a88bd0' }}>Quantity</span><br />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                    <button className="btn btn-sm btn-secondary" style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                    <strong style={{ color: '#c8a8ff', fontSize: '2rem', minWidth: '24px', textAlign: 'center' }}>{quantity}</strong>
                    <button className="btn btn-sm btn-secondary" style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                      onClick={() => setQuantity(q => Math.min(selectedCamp.availableSlots, q + 1))} disabled={quantity >= selectedCamp.availableSlots}>+</button>
                  </div>
                </div>
                <div><span style={{ color: '#a88bd0' }}>Total</span><br /><strong style={{ fontSize: '1.2rem', color: '#f7e07a' }}>₹{totalPrice}</strong></div>
                <div><span style={{ color: '#a88bd0' }}>Slots Left</span><br /><strong style={{ color: '#c8a8ff' }}>{selectedCamp.availableSlots}</strong></div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9a7fc0', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>🔒</span> Payment will be deducted from your wallet and held in escrow.
              </div>
              <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.06)', borderColor: '#5b3da0', color: '#bca3e0' }} onClick={() => { setSelectedCamp(null); setQuantity(1); }}>Cancel</button>
                <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c84a, #f7e07a, #e8c84a)', borderColor: '#fae582', color: '#1a1508', fontWeight: 700, boxShadow: '0 0 20px rgba(232, 200, 74, 0.5), 0 0 40px rgba(232, 200, 74, 0.2)' }} onClick={handlePurchase} disabled={loading}>
                  {loading ? '⏳ Processing...' : `💳 Pay ₹${totalPrice} from Wallet`}
                </button>
              </div>
            </div>
          )}

          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3>Campaigns from {allAstrologers.find(a => a.id === selectedAstrologerId)?.displayName}</h3>
            <span className="tag tag-blue">{activeCamps.length} active</span>
          </div>

          {activeCamps.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No active campaigns from this astrologer right now.
            </div>
          ) : (
            <div className="grid">
              {activeCamps.map(c => (
                <div className="card" key={c.id}>
                  <h3>{c.campaignName}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{c.description}</p>
                  <div className="row">
                    <div><span style={{ color: 'var(--text-muted)' }}>General</span><br /><strong>₹{c.generalPrice}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Individual</span><br /><strong>₹{c.individualPrice}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Slots Left</span><br />{c.availableSlots}/{c.totalSlots}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Answer In</span><br />{c.deadlineHours ? `${c.deadlineHours}h` : 'No deadline'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', margin: '0.3rem 0' }}>
                    {c.categories.map(cat => <span className="tag tag-blue" key={cat}>{cat}</span>)}
                    {c.languages.map(l => <span className="tag tag-purple" key={l}>{l}</span>)}
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.3rem' }}
                    onClick={() => { setSelectedCamp(c); setVariation('general'); }} disabled={wallet.availableBalance < c.generalPrice && wallet.availableBalance < c.individualPrice}>
                    {wallet.availableBalance < c.generalPrice && wallet.availableBalance < c.individualPrice ? 'Insufficient Balance' : 'Buy Slot'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
