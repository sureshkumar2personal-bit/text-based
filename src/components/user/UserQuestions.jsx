import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';
import useLocalState from '../../hooks/useLocalState';

export default function UserQuestions({ filter, onNavigate, onPurchaseSuccess }) {
  const { purchases, questions, answers, campaigns, wallet, addPurchase, allAstrologers } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const myPurchases = purchases.filter(p => p.userId === 'u-1');
  const myQuestions = questions.filter(q => q.userId === 'u-1');
  const [tab, setTab] = useState(filter === 'answered' ? 'questions' : 'purchases');

  const [view, setView] = useState('list');
  const [selectedAstrologerId, setSelectedAstrologerId] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [variation, setVariation] = useState('general');
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(null);
  const [subscribedIds, setSubscribedIds] = useLocalState('user-subscribed-astrologers', []);
  const [subscribingLoading, setSubscribingLoading] = useState(false);

  const baseSubscribedIds = allAstrologers.slice(0, 5).map(a => a.id);
  const allSubscribedIds = [...new Set([...baseSubscribedIds, ...subscribedIds])];
  const subscribedAstrologers = allAstrologers.filter(a => allSubscribedIds.includes(a.id));
  const suggestedAstrologers = allAstrologers.filter(a => !allSubscribedIds.includes(a.id));
  const selectedAstrologer = allAstrologers.find(a => a.id === selectedAstrologerId);
  const isSubscribed = selectedAstrologerId ? allSubscribedIds.includes(selectedAstrologerId) : false;

  const activeCamps = campaigns.filter(c =>
    c.status === 'active' && c.availableSlots > 0 && c.astrologerId === selectedAstrologerId
  );

  const effectivePrice = selectedCamp
    ? (variation === 'individual' ? selectedCamp.individualPrice : selectedCamp.generalPrice)
    : 0;

  const filteredPurchases = filter === 'unused'
    ? myPurchases.filter(p => p.purchaseStatus === 'question_pending' && !p.questionSubmitted)
    : myPurchases;

  const filteredQuestions = filter === 'answered'
    ? myQuestions.filter(q => q.status === 'answered')
    : filter === 'pending'
      ? myQuestions.filter(q => ['submitted', 'under_review', 'received_by_astrologer'].includes(q.status))
      : myQuestions;

  const handleSubscribe = () => {
    if (!selectedAstrologerId) return;
    setSubscribingLoading(true);
    setTimeout(() => {
      setSubscribedIds(prev => [...prev, selectedAstrologerId]);
      setSubscribingLoading(false);
      toast.success(`Subscribed to ${selectedAstrologer.displayName}!`, 4000);
      addNotification(NOTIF_TYPES.PURCHASE_SUCCESS, 'Astrologer Subscribed', `You are now subscribed to ${selectedAstrologer.displayName}`, 'user', { tab: 'questions' });
    }, 1000);
  };

  const handlePurchase = () => {
    if (!selectedCamp) return;
    if (wallet.availableBalance < effectivePrice) {
      toast.error('Insufficient wallet balance! Top up your wallet first.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const p = addPurchase(selectedCamp, variation);
      setPurchased({ id: p.id, campaignName: p.campaignName, price: p.price, purchaseCode: p.purchaseCode, purchaseStatus: 'question_pending', variation: p.variation });
      setLoading(false);
      toast.success(`Purchased ${variation} slot in ${p.campaignName}!`, 4000);
      addNotification(NOTIF_TYPES.PURCHASE_SUCCESS, 'Slot Purchased', `You bought a ${variation} slot in "${p.campaignName}" for ₹${p.price}`, 'user', { tab: 'questions' });
      addNotification(NOTIF_TYPES.NEW_QUEUE_ITEM, 'New Slot Purchase', `${p.campaignName} — ${variation} slot purchased by user`, 'astrologer', { tab: 'queue' });
      if (onPurchaseSuccess) onPurchaseSuccess();
    }, 1200);
  };

  const resetPurchaseFlow = () => {
    setView('list');
    setSelectedAstrologerId(null);
    setSelectedCamp(null);
    setVariation('general');
    setPurchased(null);
  };

  const renderAstrologerCard = (a, isSelected) => (
    <div
      key={a.id}
      className={`card ${isSelected ? 'card-gradient-border' : ''}`}
      style={{
        cursor: 'pointer', textAlign: 'center', padding: '1rem',
        borderColor: isSelected ? '#5b3da0' : undefined,
        transition: 'all 0.2s', transform: isSelected ? 'scale(1.02)' : undefined
      }}
      onClick={() => { setSelectedAstrologerId(a.id); setSelectedCamp(null); setView('astro-detail'); }}
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
      {isSelected && (
        <div style={{ marginTop: '0.3rem' }}>
          <span className="tag tag-green">Selected</span>
        </div>
      )}
    </div>
  );

  if (purchased) {
    return (
      <div>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
          <h2>Purchase Successful!</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0' }}>You've purchased a <strong>{purchased.variation}</strong> slot in <strong>{purchased.campaignName}</strong></p>
          <div style={{ background: 'var(--bg-elevated)', color: 'var(--text-on-elevated)', padding: '1rem', borderRadius: '8px', display: 'inline-block', textAlign: 'left', margin: '0.5rem 0' }}>
            <div>Code: <strong>{purchased.purchaseCode}</strong></div>
            <div>Amount: <strong>₹{purchased.price}</strong></div>
            <div>Type: <span className="tag tag-purple">{purchased.variation}</span></div>
            <div>Status: <span className="tag tag-yellow">question_pending</span></div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Go to "Ask Question" tab to submit your question.</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button className="btn btn-primary" onClick={() => { setPurchased(null); setSelectedCamp(null); setSelectedAstrologerId(null); setView('purchase'); }}>Buy Another</button>
            <button className="btn btn-secondary" onClick={resetPurchaseFlow}>Back to My Questions</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'purchase') {
    return (
      <div>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Purchase Question Slot</h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Select an astrologer to view their campaigns</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Wallet Balance</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80' }}>₹{wallet.availableBalance.toLocaleString()}</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={resetPurchaseFlow}>← Back</button>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
            <h3 style={{ margin: 0 }}>Astrologers (subscribe)</h3>
            <span className="tag tag-blue">{subscribedAstrologers.length}</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {subscribedAstrologers.map(a => renderAstrologerCard(a, false))}
          </div>
        </div>

        {suggestedAstrologers.length > 0 && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <h3 style={{ margin: 0 }}>Suggested Astrologers</h3>
              <span className="tag tag-purple">{suggestedAstrologers.length}</span>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {suggestedAstrologers.map(a => renderAstrologerCard(a, false))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'astro-detail') {
    if (!selectedAstrologer) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Astrologer not found.</p>
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn btn-primary btn-sm" onClick={() => { setView('purchase'); setSelectedAstrologerId(null); }}>← Back to Astrologers</button>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => { setView('purchase'); setSelectedAstrologerId(null); setSelectedCamp(null); }}>← Back to Astrologers</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Wallet Balance</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80' }}>₹{wallet.availableBalance.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="card" style={{
          borderColor: '#5b3da0',
          background: 'linear-gradient(135deg, #f8f5ff 0%, #f0eaf8 100%)',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg, #5b3da0, #c084fc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 700, color: '#fff', flexShrink: 0
            }}>
              {selectedAstrologer.displayName.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{selectedAstrologer.displayName}</h3>
              <p style={{ margin: '0.2rem 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedAstrologer.title}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                <span>⭐ {selectedAstrologer.rating} ({selectedAstrologer.reviewCount} reviews)</span>
                <span>📋 {selectedAstrologer.campaignsCount} campaigns</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
            {selectedAstrologer.specialties?.map(s => (
              <span key={s} className="tag tag-purple">{s}</span>
            ))}
          </div>
        </div>

        {!isSubscribed && (
          <div className="card" style={{
            borderColor: '#c9a84c', background: 'linear-gradient(135deg, #2a1f10 0%, #3d2e15 100%)',
            boxShadow: '0 4px 24px rgba(201, 168, 76, 0.2), inset 0 1px 0 rgba(232, 200, 74, 0.1)',
            backdropFilter: 'blur(8px)', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #5b3da0, #c084fc)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', fontWeight: 700, color: '#fff'
              }}>
                {selectedAstrologer.displayName.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#e8c84a' }}>{selectedAstrologer.displayName}</h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#c9a84c' }}>{selectedAstrologer.title}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', margin: '0.6rem 0', color: '#bca3e0', fontSize: '0.82rem' }}>
              <div>⭐ {selectedAstrologer.rating} ({selectedAstrologer.reviewCount} reviews)</div>
              <div>📋 {selectedAstrologer.campaignsCount} campaigns</div>
            </div>

            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', margin: '0.4rem 0' }}>
              {selectedAstrologer.specialties?.map(s => (
                <span key={s} className="tag tag-purple">{s}</span>
              ))}
            </div>

            <p style={{ color: '#bca3e0', fontSize: '0.85rem', margin: '0.6rem 0' }}>
              Subscribe to <strong style={{ color: '#dcc8ff' }}>{selectedAstrologer.displayName}</strong> to view and purchase their question slots.
            </p>

            <div style={{ fontSize: '0.72rem', color: '#9a7fc0', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>🔒</span> Subscribing is free. You only pay when you purchase a slot.
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.06)', borderColor: '#c9a84c', color: '#c9a84c' }} onClick={() => { setView('purchase'); setSelectedAstrologerId(null); }}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c84a, #f7e07a, #e8c84a)', borderColor: '#fae582', color: '#1a1508', fontWeight: 700, boxShadow: '0 0 20px rgba(232, 200, 74, 0.5), 0 0 40px rgba(232, 200, 74, 0.2)' }} onClick={handleSubscribe} disabled={subscribingLoading}>
                {subscribingLoading ? '⏳ Subscribing...' : '🔔 Subscribe'}
              </button>
            </div>
          </div>
        )}

        {isSubscribed && (
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
                      <div style={{ fontSize: '1rem', fontWeight: 700 }}>₹{selectedCamp.generalPrice}</div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>No personal details needed</div>
                    </button>
                    <button className={`btn ${variation === 'individual' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}
                      onClick={() => setVariation('individual')}>
                      <div style={{ fontSize: '0.72rem' }}>Individual</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700 }}>₹{selectedCamp.individualPrice}</div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>With birth chart details</div>
                    </button>
                  </div>
                </div>

                <div className="row" style={{ marginTop: '0.4rem', background: 'rgba(150,100,230,0.08)', borderRadius: '8px', padding: '0.6rem' }}>
                  <div><span style={{ color: '#a88bd0' }}>Price</span><br /><strong style={{ fontSize: '1.2rem', color: '#c8a8ff' }}>₹{effectivePrice}</strong></div>
                  <div><span style={{ color: '#a88bd0' }}>Available Slots</span><br /><strong style={{ color: '#c8a8ff' }}>{selectedCamp.availableSlots}</strong></div>
                  <div><span style={{ color: '#a88bd0' }}>Answer Mode</span><br /><strong style={{ color: '#c8a8ff' }}>{selectedCamp.answerMode}</strong></div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#9a7fc0', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>🔒</span> Payment will be deducted from your wallet and held in escrow.
                </div>
                <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.06)', borderColor: '#5b3da0', color: '#bca3e0' }} onClick={() => setSelectedCamp(null)}>Cancel</button>
                  <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c84a, #f7e07a, #e8c84a)', borderColor: '#fae582', color: '#1a1508', fontWeight: 700, boxShadow: '0 0 20px rgba(232, 200, 74, 0.5), 0 0 40px rgba(232, 200, 74, 0.2)' }} onClick={handlePurchase} disabled={loading}>
                    {loading ? '⏳ Processing...' : `💳 Pay ₹${effectivePrice} from Wallet`}
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3>Campaigns from {selectedAstrologer.displayName}</h3>
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
                      <div><span style={{ color: 'var(--text-muted)' }}>Answer In</span><br />{c.deadlineHours}h</div>
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

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={`btn btn-sm ${tab === 'purchases' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('purchases')}>My Purchases ({myPurchases.length})</button>
            <button className={`btn btn-sm ${tab === 'questions' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('questions')}>My Questions ({myQuestions.length})</button>
          </div>
          <button className="btn btn-primary btn-glow btn-sm" onClick={() => setView('purchase')}>🛒 Buy New Slot</button>
        </div>
        {filter && (
          <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#a88bd0', fontStyle: 'italic' }}>
            Showing: {filter === 'unused' ? 'Unused purchase slots' : filter === 'answered' ? 'Answered questions' : filter === 'pending' ? 'Pending questions' : 'All'}
          </div>
        )}
      </div>

      {tab === 'purchases' && (
        <div className="grid">
          {filteredPurchases.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              {filter === 'unused' ? 'All purchases have been used. Great job!' : 'No purchases yet.'}
              {filter !== 'unused' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setView('purchase')}>🛒 Buy Your First Slot</button>
                </div>
              )}
            </div>
          ) : (
            filteredPurchases.map(p => (
              <div className="card" key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{p.campaignName}</h3>
                  <span className={`tag ${p.purchaseStatus === 'question_pending' ? 'tag-yellow' : p.purchaseStatus === 'question_submitted' ? 'tag-blue' : p.purchaseStatus === 'answered' ? 'tag-green' : 'tag-gray'}`}>{p.purchaseStatus}</span>
                </div>
                <div className="row" style={{ marginTop: '0.4rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Price</span><br />₹{p.price}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Type</span><br /><span className="tag tag-purple" style={{ fontSize: '0.65rem' }}>{p.variation}</span></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Code</span><br />{p.purchaseCode}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Expires</span><br /><span style={{ fontSize: '0.72rem' }}>{new Date(p.expiresAt).toLocaleDateString()}</span></div>
                </div>
                <div style={{ marginTop: '0.3rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {p.questionSubmitted ? 'Question submitted ✓' : 'No question yet — use "Ask Question"'}
                </div>
                {!p.questionSubmitted && (
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => onNavigate?.('ask', null, p.id)}>
                    Use This Slot
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'questions' && (
        <div className="grid">
          {filteredQuestions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              {filter === 'answered' ? 'No answered questions yet.' : filter === 'pending' ? 'No pending questions.' : 'No questions yet.'}
            </div>
          ) : (
            filteredQuestions.map(q => {
              const ans = answers.find(a => a.questionId === q.id);
              return (
                <div className="card" key={q.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{q.title}</h3>
                    <span className={`tag ${q.status === 'answered' ? 'tag-green' : q.status === 'disputed' ? 'tag-red' : q.status === 'submitted' ? 'tag-blue' : 'tag-yellow'}`}>{q.status}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>{q.questionText.slice(0, 80)}{q.questionText.length > 80 ? '...' : ''}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {q.category} · {q.language} · {q.questionType}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Astrologer: {q.astrologerName} · {q.campaignName}
                    <br />Submitted: {new Date(q.submittedAt).toLocaleDateString()} · Due: {new Date(q.dueAt).toLocaleDateString()}
                  </div>
                  {ans && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-elevated)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-on-elevated)' }}>
                      <span className="tag tag-green">Answer ({ans.answerMode})</span>
                      <p style={{ marginTop: '4px' }}>{ans.answerText?.slice(0, 100)}{ans.answerText?.length > 100 ? '...' : ''}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
