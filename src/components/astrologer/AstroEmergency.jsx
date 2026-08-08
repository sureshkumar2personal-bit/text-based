import { useState, useEffect, useRef } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

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
const SLOT_TAGS = { draft: 'tag-gray', published: 'tag-green', paused: 'tag-yellow' };
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

const emptySlot = {
  title: '', slotDate: '', startTime: '', endTime: '',
  callDurationMinutes: 20, breakTimeMinutes: 5,
  price: '', status: 'published', callModes: 'both',
  languages: ['English', 'Tamil'], purposes: ['Career']
};

export default function AstroEmergency({ astrologerId }) {
  const { allAstrologers, emergencyRequests, emergencyOptions,
    addEmergencySlot, updateEmergencySlot, deleteEmergencySlot, getAstrologerEmergencySlots,
    getEmergencyRequestsForAstrologer, acceptEmergencyRequest, rejectEmergencyRequest,
    startEmergencyCall, endEmergencyCall } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();

  const [view, setView] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptySlot);
  const [available, setAvailable] = useState(true);

  const astro = allAstrologers.find(a => a.id === astrologerId) || {};
  const slots = getAstrologerEmergencySlots(astrologerId);
  const requests = getEmergencyRequestsForAstrologer(astrologerId);
  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const active = requests.filter(r => ['requested', 'payment_completed', 'accepted', 'call_in_progress'].includes(r.status));
  const pending = requests.filter(r => ['requested', 'payment_completed'].includes(r.status));
  const completed = requests.filter(r => r.status === 'call_completed');

  const setFormField = (patch) => setForm(f => ({ ...f, ...patch }));

  const saveSlot = (e) => {
    e.preventDefault();
    if (!form.slotDate || !form.startTime || !form.endTime) return toast.error('Date and times are required');
    if (!form.price || parseFloat(form.price) <= 0) return toast.error('Price must be greater than 0');
    const startMin = form.startTime.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);
    const endMin = form.endTime.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);
    if (endMin <= startMin) return toast.error('End time must be after start time');
    if (editingId) {
      updateEmergencySlot(editingId, { ...form, astrologerId, astrologerName: astro.displayName });
      toast.success('Slot updated.');
    } else {
      addEmergencySlot({ ...form, astrologerId, astrologerName: astro.displayName });
      toast.success('Emergency slot created.');
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptySlot);
  };

  const editSlot = (s) => {
    setEditingId(s.id);
    setForm({ ...emptySlot, ...s });
    setShowForm(true);
  };

  const setSlotStatus = (s, status) => {
    updateEmergencySlot(s.id, { status });
    toast.info(`Slot ${status}.`);
  };

  const removeSlot = (s) => {
    if (!window.confirm(`Delete slot on ${s.slotDate}?`)) return;
    deleteEmergencySlot(s.id);
    toast.success('Slot deleted.');
  };

  const handleAccept = (r) => {
    acceptEmergencyRequest(r.id);
    addNotification(NOTIF_TYPES.EMERGENCY_ACCEPTED, 'Emergency Call Accepted',
      `${r.astrologerName} accepted your emergency call.`, 'user', { tab: 'emergency' });
    toast.success('Request accepted.');
  };

  const handleReject = (r) => {
    const reason = window.prompt('Reason for declining:', 'Astrologer unavailable');
    if (reason === null) return;
    rejectEmergencyRequest(r.id, reason || undefined);
    addNotification(NOTIF_TYPES.EMERGENCY_REJECTED, 'Emergency Call Declined',
      `${r.astrologerName} could not take your call. Reason: ${reason || 'Astrologer unavailable'}`, 'user', { tab: 'emergency' });
    toast.info('Request declined.');
  };

  const handleStart = (r) => {
    startEmergencyCall(r.id);
    addNotification(NOTIF_TYPES.EMERGENCY_STARTED, 'Call Started',
      'Your emergency call with ' + r.astrologerName + ' has started.', 'user', { tab: 'emergency' });
    toast.success('Call started.');
  };

   const handleEnd = (r) => {
     if (!window.confirm('End this emergency call?')) return;
     endEmergencyCall(r.id, 'astrologer');
     addNotification(NOTIF_TYPES.EMERGENCY_CALL_ENDED, 'Call Ended',
       'Your emergency call with ' + r.astrologerName + ' has been ended.', 'user', { tab: 'emergency' });
     addNotification(NOTIF_TYPES.EMERGENCY_COMPLETED, 'Call Completed',
       'Emergency call with ' + r.userId + ' has ended.', 'user', { tab: 'emergency' });
     toast.success('Call ended. Astrologer credited.');
   };

  const maxSlots = (s) => {
    const toMin = (t) => t.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);
    const total = toMin(s.endTime) - toMin(s.startTime);
    if (total <= 0) return 0;
    return Math.max(0, Math.floor(total / (s.callDurationMinutes + s.breakTimeMinutes)));
  };

  const tabBtn = (t) => ({
    padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
    background: view === t ? '#c0392b' : 'transparent',
    color: view === t ? '#fff' : 'var(--text-muted)',
    transition: 'all 0.2s'
  });

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>🚨 Emergency Calls — {astro.displayName || 'Astrologer'}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Publish slots and handle urgent call requests
          </p>
        </div>
        <button className={`btn btn-sm ${available ? 'btn-success' : 'btn-secondary'}`} onClick={() => { setAvailable(!available); toast.info(available ? 'Emergency availability turned off' : 'Emergency availability turned on'); }}>
          {available ? '🟢 Available for Emergency' : '🔴 Not Available'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        <button style={tabBtn('dashboard')} onClick={() => setView('dashboard')}>Dashboard</button>
        <button style={tabBtn('slots')} onClick={() => setView('slots')}>My Slots</button>
        <button style={tabBtn('requests')} onClick={() => setView('requests')}>Requests</button>
      </div>

      {view === 'dashboard' && (
        <>
          <div className="row">
            <div className="card" style={{ flex: 1 }}><h3>{slots.filter(s => s.status === 'published').length}</h3><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Published Slots</p></div>
            <div className="card" style={{ flex: 1 }}><h3>{pending.length}</h3><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pending Requests</p></div>
            <div className="card" style={{ flex: 1 }}><h3>{active.length}</h3><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Active / Waiting</p></div>
            <div className="card" style={{ flex: 1 }}><h3>{completed.length}</h3><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Completed Calls</p></div>
          </div>

          {pending.length > 0 && (
            <div className="card">
              <h3>New Requests</h3>
              <div className="grid">
                {pending.slice(0, 4).map(r => (
                  <div key={r.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3>{r.userId === 'u-1' ? 'You (test user)' : 'User ' + r.userId}</h3>
                      <span className={`tag ${STATUS_TAGS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
                      {r.callType} · {r.purpose} · {r.language} · ₹{r.priceCharged}
                    </p>
                    <div className="modal-actions" style={{ marginTop: '0.5rem' }}>
                      <button className="btn btn-success btn-sm" onClick={() => handleAccept(r)}>Accept</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleReject(r)}>Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active.some(r => ['accepted', 'call_in_progress'].includes(r.status)) && (
            <div className="card">
              <h3>Active Calls</h3>
              <div className="grid">
                {active.filter(r => ['accepted', 'call_in_progress'].includes(r.status)).map(r => (
                   <div key={r.id} className="card">
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <h3>{r.userId === 'u-1' ? 'You (test user)' : 'User ' + r.userId}</h3>
                       <span className={`tag ${STATUS_TAGS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                     </div>
                     <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
                       {r.callType} · {r.purpose} · ₹{r.priceCharged}
                     </p>
                     {r.status === 'call_in_progress' && (
                       <div style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}>
                         <Dur startedAt={r.startedAt} endedAt={r.endedAt} />
                         {r.userAttended && <span style={{ color: '#4ade80', marginLeft: '0.6rem' }}>✓ User joined</span>}
                       </div>
                     )}
                     <div className="modal-actions" style={{ marginTop: '0.5rem' }}>
                       {r.status === 'accepted' && <button className="btn btn-emergency btn-sm" onClick={() => handleStart(r)}>📞 Start Call</button>}
                       {r.status === 'call_in_progress' && <button className="btn btn-emergency btn-sm" onClick={() => handleEnd(r)}>End Call</button>}
                     </div>
                   </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {view === 'slots' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>My Emergency Slots ({slots.length})</h3>
            <button className="btn btn-emergency btn-sm" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptySlot); }}>
              {showForm ? '← Back' : '+ Create Slot'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={saveSlot} style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)' }}>
              <h3>{editingId ? 'Edit Slot' : 'Create Emergency Slot'}</h3>
              <div className="form-group">
                <label>Title</label>
                <input value={form.title} onChange={e => setFormField({ title: e.target.value })} placeholder="e.g. Evening Emergency Slot" />
              </div>
              <div className="row">
                <div className="form-group" style={{ minWidth: 140 }}>
                  <label>Date *</label>
                  <input type="date" required value={form.slotDate} onChange={e => setFormField({ slotDate: e.target.value })} />
                </div>
                <div className="form-group" style={{ minWidth: 110 }}>
                  <label>Start *</label>
                  <input type="time" required value={form.startTime} onChange={e => setFormField({ startTime: e.target.value })} />
                </div>
                <div className="form-group" style={{ minWidth: 110 }}>
                  <label>End *</label>
                  <input type="time" required value={form.endTime} onChange={e => setFormField({ endTime: e.target.value })} />
                </div>
              </div>
              <div className="row">
                <div className="form-group" style={{ minWidth: 120 }}>
                  <label>Call Duration (min)</label>
                  <input type="number" min={1} value={form.callDurationMinutes} onChange={e => setFormField({ callDurationMinutes: e.target.value })} />
                </div>
                <div className="form-group" style={{ minWidth: 120 }}>
                  <label>Break (min)</label>
                  <input type="number" min={0} value={form.breakTimeMinutes} onChange={e => setFormField({ breakTimeMinutes: e.target.value })} />
                </div>
                <div className="form-group" style={{ minWidth: 120 }}>
                  <label>Price (₹) *</label>
                  <input type="number" required min={1} value={form.price} onChange={e => setFormField({ price: e.target.value })} />
                </div>
                <div className="form-group" style={{ minWidth: 130 }}>
                  <label>Call Modes</label>
                  <select value={form.callModes} onChange={e => setFormField({ callModes: e.target.value })}>
                    <option value="audio">Audio Only</option>
                    <option value="video">Video Only</option>
                    <option value="both">Audio + Video</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Languages</label>
                  <input value={form.languages.join(', ')} onChange={e => setFormField({ languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Comma separated" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Purposes</label>
                  <input value={form.purposes.join(', ')} onChange={e => setFormField({ purposes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Career, Marriage, Health..." />
                </div>
              </div>
              {form.slotDate && form.startTime && form.endTime && (
                <p style={{ fontSize: '0.78rem', color: '#c0392b', margin: '0.4rem 0' }}>
                  Available window: {maxSlots(form)} slot(s) · {form.callDurationMinutes} min call + {form.breakTimeMinutes} min break each
                </p>
              )}
              <div className="modal-actions">
                <button type="submit" className="btn btn-emergency">{editingId ? 'Save Changes' : 'Create Slot'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
              </div>
            </form>
          )}

          {slots.length === 0 && !showForm ? (
            <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No emergency slots yet. Create one to start receiving bookings.</p>
          ) : (
            <div className="grid">
              {slots.map(s => (
                <div key={s.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="tag tag-blue">{s.slotDate} · {s.startTime}-{s.endTime}</span>
                    <span className={`tag ${SLOT_TAGS[s.status]}`}>{s.status}</span>
                  </div>
                  <h3 style={{ marginTop: '0.5rem' }}>{s.title || 'Emergency Slot'} · ₹{s.price}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
                    {s.callDurationMinutes} min calls · {s.breakTimeMinutes} min breaks · {maxSlots(s)} max slots · {s.callModes === 'both' ? 'Audio+Video' : s.callModes}
                  </p>
                  {s.languages?.length > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Languages: {s.languages.join(', ')}</p>}
                  {s.purposes?.length > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Purposes: {s.purposes.join(', ')}</p>}
                  <div className="modal-actions" style={{ marginTop: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => editSlot(s)}>Edit</button>
                    {s.status !== 'published' && <button className="btn btn-success btn-sm" onClick={() => setSlotStatus(s, 'published')}>Publish</button>}
                    {s.status === 'published' && <button className="btn btn-secondary btn-sm" onClick={() => setSlotStatus(s, 'paused')}>Pause</button>}
                    <button className="btn btn-danger btn-sm" onClick={() => removeSlot(s)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'requests' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3>Requests ({requests.length})</h3>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {['all', 'requested', 'payment_completed', 'accepted', 'call_in_progress', 'call_completed', 'rejected'].map(s => (
                <button key={s} className={`btn btn-sm ${filter === s ? 'btn-emergency' : 'btn-secondary'}`} onClick={() => setFilter(s)}>{s}</button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No requests found.</p>
          ) : (
            <div className="grid">
              {filtered.map(r => (
                <div key={r.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{r.userId === 'u-1' ? 'You (test user)' : 'User ' + r.userId}</h3>
                    <span className={`tag ${STATUS_TAGS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
                    {r.callType} call · {r.purpose} · {r.language} · ₹{r.priceCharged}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleString()}</p>
                  {r.rejectionReason && <p style={{ fontSize: '0.75rem', color: '#b44040' }}>Reason: {r.rejectionReason}</p>}
                  {r.rating && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rating: {r.rating}★</p>}
                  <div className="modal-actions" style={{ marginTop: '0.5rem' }}>
                    {['requested', 'payment_completed'].includes(r.status) && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleAccept(r)}>Accept</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(r)}>Decline</button>
                      </>
                    )}
                    {r.status === 'accepted' && <button className="btn btn-emergency btn-sm" onClick={() => handleStart(r)}>📞 Start Call</button>}
                    {r.status === 'call_in_progress' && <button className="btn btn-emergency btn-sm" onClick={() => handleEnd(r)}>End Call</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}