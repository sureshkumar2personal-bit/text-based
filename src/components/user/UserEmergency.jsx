import { useState, useEffect } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';
import ModalPortal from '../ui/ModalPortal';
import CallRecorder from '../ui/CallRecorder';

const STATUS_LABELS = {
  requested: 'New Request', payment_completed: 'Paid - Waiting', accepted: 'Accepted',
  call_in_progress: 'In Progress', call_completed: 'Completed', rejected: 'Rejected',
  cancelled: 'Cancelled', refunded: 'Refunded'
};
const STATUS_TAGS = {
  requested: 'tag-yellow', payment_completed: 'tag-blue', accepted: 'tag-green',
  call_in_progress: 'tag-purple', call_completed: 'tag-green', rejected: 'tag-red',
  cancelled: 'tag-gray', refunded: 'tag-gray'
};

const fmtDur = (secs) => {
  if (!secs || secs < 0) return '00:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
const Dur = ({ startedAt, endedAt }) => {
  const [d, setD] = useState(fmtDur(Math.floor((new Date() - new Date(startedAt)) / 1000)));
  useEffect(() => { if (!startedAt) return; const i = setInterval(() => setD(fmtDur(Math.floor((new Date() - new Date(startedAt)) / 1000))), 1000); return () => clearInterval(i); }, [startedAt]);
  if (!startedAt) return null;
  if (endedAt) return <span style={{ fontSize: '0.78rem', color: '#9b6fd4' }}>Duration: {d}</span>;
  return <span style={{ fontSize: '0.78rem', color: '#9b6fd4' }}>Live: {d}</span>;
};

export default function UserEmergency() {
  const { allAstrologers, emergencySlots, emergencyRequests, emergencyOptions, wallet,
    bookEmergencyRequest, payEmergencyRequest, cancelEmergencyRequest, addEmergencyRating,
    getEmergencyRecordings, addEmergencyRecording, deleteEmergencyRecording,
    startEmergencyCall, joinEmergencyCall, endEmergencyCall } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();

  const [view, setView] = useState('book');
  const [selectedAstro, setSelectedAstro] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState({ callType: 'audio', purpose: '', language: '' });
  const [paying, setPaying] = useState(false);

  const myRequests = emergencyRequests.filter(r => r.userId === 'u-1');
  const active = myRequests.filter(r => ['requested', 'payment_completed', 'accepted', 'call_in_progress'].includes(r.status));
  const past = myRequests.filter(r => !active.includes(r));

  const publishedSlots = emergencySlots.filter(s => s.status === 'published');
  const astrosWithSlots = allAstrologers.filter(a => publishedSlots.some(s => s.astrologerId === a.id));

  const selectAstro = (a) => {
    setSelectedAstro(a);
    setSelectedSlot(null);
    setBooking(b => ({ ...b, language: '', purpose: '' }));
  };

  const getSlotSlots = (astroId) => publishedSlots.filter(s => s.astrologerId === astroId);

  const handleBook = () => {
    if (!selectedSlot) return toast.error('Select a time slot first');
    if (!booking.purpose) return toast.error('Select a purpose');
    const req = bookEmergencyRequest({
      slotId: selectedSlot.id,
      callType: booking.callType === 'both' ? 'audio' : booking.callType,
      purpose: booking.purpose,
      language: booking.language
    });
    addNotification(NOTIF_TYPES.EMERGENCY_REQUESTED, 'Emergency Call Requested',
      `You requested an emergency ${req.callType} call with ${req.astrologerName}. Pay to confirm.`, 'user', { tab: 'emergency' });
    addNotification(NOTIF_TYPES.EMERGENCY_REQUESTED, 'New Emergency Request',
      `${req.astrologerName}, you have a new emergency call request.`, 'astrologer', { tab: 'emergency' });
    setView('mylist');
    toast.success('Emergency request created. Pay to confirm your slot.');
  };

  const handlePay = (id) => {
    setPaying(true);
    setTimeout(() => {
      const res = payEmergencyRequest(id);
      if (res.error) {
        toast.error(res.error);
        setPaying(false);
        return;
      }
      addNotification(NOTIF_TYPES.EMERGENCY_PAID, 'Payment Successful',
        'Your emergency call is confirmed. Awaiting astrologer acceptance.', 'user', { tab: 'emergency' });
      const er = emergencyRequests.find(x => x.id === id);
      if (er) addNotification(NOTIF_TYPES.EMERGENCY_PAID, 'Payment Confirmed',
        `A user paid for an emergency call with you.`, 'astrologer', { tab: 'emergency' });
      setPaying(false);
      toast.success('Payment successful. Waiting for astrologer.');
    }, 800);
  };

  const handleCancel = (id) => {
    const reason = window.prompt('Reason for cancellation (optional):');
    if (reason === null) return;
    cancelEmergencyRequest(id, reason || undefined);
    toast.success('Request cancelled.');
  };

  const handleRate = (id) => {
    setView('mypage');
    const rating = window.prompt('Rate this call 1-5:');
    const r = parseInt(rating);
    if (!r || r < 1 || r > 5) return toast.error('Rating must be 1-5');
    const reviewText = window.prompt('Leave a review (optional):');
    addEmergencyRating(id, r, reviewText || undefined);
    const er = emergencyRequests.find(x => x.id === id);
    if (er) addNotification(NOTIF_TYPES.EMERGENCY_RATING, 'New Rating',
      `Your emergency call was rated ${r}/5.`, 'astrologer', { tab: 'emergency' });
    toast.success('Thanks for rating!');
  };

   const handleJoinCall = (r) => {
     joinEmergencyCall(r.id);
     addNotification(NOTIF_TYPES.EMERGENCY_USER_ATTENDED, 'Joined Call',
       'You have joined the emergency call with ' + r.astrologerName + '.', 'astrologer', { tab: 'emergency' });
     toast.success('You joined the call.');
   };

   const handleEndCall = (r) => {
     endEmergencyCall(r.id, 'user');
     addNotification(NOTIF_TYPES.EMERGENCY_CALL_ENDED, 'Call Ended',
       'You ended your emergency call with ' + r.astrologerName + '.', 'astrologer', { tab: 'emergency' });
     toast.success('Call ended.');
   };

  const canRate = (r) => r.status === 'call_completed' && r.rating == null &&
    (!r.ratingWindowExpiresAt || new Date(r.ratingWindowExpiresAt) > new Date());

  const tabBtn = (activeTab) => ({
    padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
    background: view === activeTab ? '#c0392b' : 'transparent',
    color: view === activeTab ? '#fff' : 'var(--text-muted)',
    transition: 'all 0.2s'
  });

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>🚨 Emergency Calls</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Get instant priority access to astrologers for urgent matters
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button className={`btn btn-sm ${view === 'book' ? 'btn-emergency' : 'btn-secondary'}`} onClick={() => setView('book')}>Book Emergency Slot</button>
          <button className={`btn btn-sm ${view === 'mypage' ? 'btn-emergency' : 'btn-secondary'}`} onClick={() => setView('mypage')}>My Requests</button>
        </div>
      </div>

      {view === 'book' && (
        <div className="card">
          <h3>{selectedAstro ? `Choose a slot — ${selectedAstro.displayName}` : '1. Choose an astrologer'}</h3>

          {!selectedAstro ? (
            <div className="grid">
              {astrosWithSlots.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No astrologers available for emergency calls right now.
                </div>
              )}
              {astrosWithSlots.map(a => (
                <div key={a.id} className="card" style={{ cursor: 'pointer' }} onClick={() => selectAstro(a)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{a.displayName}</h3>
                    <span className="tag tag-blue">{a.title}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
                    ★ {a.rating} ({a.reviewCount} reviews) · {a.specialties?.join(', ')}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#c0392b' }}>
                    Published slots: {getSlotSlots(a.id).length}
                  </p>
                  <button className="btn btn-emergency btn-sm" style={{ marginTop: '0.5rem', width: '100%' }} onClick={() => selectAstro(a)}>
                    View Slots
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p style={{ fontSize: '0.8rem', margin: '0.4rem 0' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedAstro(null)}>← Change astrologer</button>
              </p>
              {getSlotSlots(selectedAstro.id).length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                  No published slots for this astrologer right now.
                </div>
              ) : (
                <div className="grid">
                  {getSlotSlots(selectedAstro.id).map(s => (
                    <div key={s.id} className="card"
                      style={{ cursor: 'pointer', border: selectedSlot?.id === s.id ? '2px solid #c0392b' : undefined }}
                      onClick={() => { setSelectedSlot(s); setBooking(b => ({ ...b, callType: s.callModes === 'audio' ? 'audio' : s.callModes === 'video' ? 'video' : 'audio' })); }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="tag tag-green">₹{s.price}</span>
                        <span className="tag tag-blue">{s.callDurationMinutes} min</span>
                      </div>
                      <h3 style={{ marginTop: '0.5rem' }}>{s.slotDate} · {s.startTime}-{s.endTime}</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {s.callModes === 'both' ? 'Audio + Video' : s.callModes} · {s.languages.join(', ')}
                      </p>
                      {s.purposes?.length > 0 && <p style={{ fontSize: '0.75rem', color: '#c0392b' }}>Handles: {s.purposes.join(', ')}</p>}
                    </div>
                  ))}
                </div>
              )}

              {selectedSlot && (
                <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)' }}>
                  <h3 style={{ marginBottom: '0.8rem' }}>Confirm Booking</h3>
                  <div className="row">
                    <div className="form-group" style={{ minWidth: 130 }}>
                      <label>Call Type</label>
                      <select value={booking.callType} onChange={e => setBooking(b => ({ ...b, callType: e.target.value }))}>
                        {(selectedSlot.callModes === 'both' ? ['audio', 'video'] : [selectedSlot.callModes]).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ minWidth: 150 }}>
                      <label>Purpose *</label>
                      <select value={booking.purpose} onChange={e => setBooking(b => ({ ...b, purpose: e.target.value }))}>
                        <option value="">Select purpose...</option>
                        {(selectedSlot.purposes?.length ? selectedSlot.purposes : emergencyOptions.purposes).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ minWidth: 130 }}>
                      <label>Language</label>
                      <select value={booking.language} onChange={e => setBooking(b => ({ ...b, language: e.target.value }))}>
                        {(selectedSlot.languages?.length ? selectedSlot.languages : emergencyOptions.languages).map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.8rem', fontSize: '0.85rem' }}>
                    <strong>Price: ₹{selectedSlot.price}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '0.4rem' }}>
                      · Includes platform fee & tax · Wallet balance: ₹{wallet.availableBalance}
                    </span>
                  </div>
                  <button className="btn btn-emergency" style={{ marginTop: '0.8rem' }} onClick={handleBook}>
                    Book Slot · Will pay ₹{selectedSlot.price}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {view === 'mypage' && (
        <>
          <div className="card">
            <h3>Active / Waiting ({active.length})</h3>
            {active.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No active emergency requests.</p>
            ) : (
              <div className="grid">
                {active.map(r => (
                  <div key={r.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3>{r.astrologerName}</h3>
                      <span className={`tag ${STATUS_TAGS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
                      {r.callType} call · {r.purpose} · {r.language} · ₹{r.priceCharged}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleString()}</p>
                    <div className="modal-actions" style={{ marginTop: '0.5rem' }}>
                      {r.status === 'requested' && (
                        <>
                          <button className="btn btn-emergency btn-sm" onClick={() => handlePay(r.id)}>Pay ₹{r.priceCharged}</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleCancel(r.id)}>Cancel</button>
                        </>
                      )}
                      {r.status === 'payment_completed' && <span className="tag tag-blue" style={{ fontSize: '0.75rem' }}>Paid — waiting for astrologer to accept</span>}
                      {r.status === 'accepted' && (
                        <button className="btn btn-emergency btn-sm" onClick={() => handleJoinCall(r)}>👥 Join Call</button>
                      )}
                      {r.status === 'call_in_progress' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span className="tag tag-purple" style={{ fontSize: '0.75rem' }}>📞 Call in progress</span>
                          {r.userAttended ? <span className="tag tag-green" style={{ fontSize: '0.72rem' }}>✓ You joined</span> : <span className="tag tag-yellow" style={{ fontSize: '0.72rem' }}>Waiting for you to join</span>}
                          <button className="btn btn-danger btn-sm" style={{ padding: '2px 8px', fontSize: '0.65rem' }} onClick={() => handleEndCall(r)}>End Call</button>
                        </div>
                      )}
                    </div>
                    {r.status === 'call_in_progress' && !r.endedBy && r.userAttended && (
                      <div style={{ marginTop: '0.8rem' }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c0392b', margin: '0 0 0.5rem' }}>🎧 Record the astrologer's voice</p>
                        <CallRecorder
                          onSave={(secs) => {
                            const rid = `${r.id}-rec-${Date.now()}`;
                            addEmergencyRecording(r.id, {
                              id: rid, name: `call_recording_${new Date().toLocaleTimeString().replace(/:/g, '-')}.webm`,
                              duration: secs, size: Math.round((secs || 10) * 16) + ' KB', createdAt: new Date().toISOString()
                            });
                            toast.success('Recording saved.');
                          }}
                          onDelete={() => {}}
                        />
                        {getEmergencyRecordings(r.id).length > 0 && (
                          <div style={{ marginTop: '0.8rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', margin: '0 0 0.4rem' }}>
                              Saved recordings for this call ({getEmergencyRecordings(r.id).length})
                            </p>
                            {getEmergencyRecordings(r.id).map(rec => (
                              <div key={rec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: 'var(--bg-elevated)', border: '1px solid var(--line)', borderRadius: '6px', marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                                <span>🎙️ {rec.name} ({rec.duration ? `${Math.floor(rec.duration / 60)}:${String(rec.duration % 60).padStart(2, '0')}` : '00:10'})</span>
                                <span style={{ color: 'var(--text-muted)' }}>{rec.size}</span>
                                <button className="btn btn-sm btn-danger" style={{ padding: '2px 8px', fontSize: '0.65rem' }} onClick={() => { deleteEmergencyRecording(r.id, rec.id); toast.info('Recording deleted.'); }}>Delete</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {r.endedBy && r.status === 'call_completed' && (
                      <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', fontSize: '0.8rem' }}>
                        {r.endedBy === 'astrologer' ? '🛑 The astrologer ended this call.' : '✅ You ended this call.'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3>History ({past.length})</h3>
            {past.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No past emergency calls.</p>
            ) : (
              <div className="grid">
                {past.map(r => (
                  <div key={r.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3>{r.astrologerName}</h3>
                      <span className={`tag ${STATUS_TAGS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
                      {r.callType} call · {r.purpose} · ₹{r.priceCharged}
                    </p>
                    {r.rejectionReason && <p style={{ fontSize: '0.75rem', color: '#b44040' }}>Reason: {r.rejectionReason}</p>}
                     {r.cancellationReason && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cancelled: {r.cancellationReason}</p>}
                     {r.endedBy && r.status === 'call_completed' && (
                       <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <Dur startedAt={r.startedAt} endedAt={r.endedAt} />
                         <span style={{ color: r.endedBy === 'astrologer' ? '#f87171' : '#9b6fd4' }}>
                           {r.endedBy === 'astrologer' ? '🛑 The astrologer ended this call' : '✅ You ended this call'}
                         </span>
                       </div>
                     )}
                     {r.rating && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Your rating: {r.rating}★ {r.reviewText ? `— "${r.reviewText}"` : ''}</p>}
                    {canRate(r) && (
                      <button className="btn btn-emergency btn-sm" style={{ marginTop: '0.4rem' }} onClick={() => handleRate(r.id)}>
                        ⭐ Rate Call
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}