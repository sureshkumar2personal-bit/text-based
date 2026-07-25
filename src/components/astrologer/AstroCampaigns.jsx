import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';
import AnimatedCounter from '../ui/AnimatedCounter';

const STATUS_MAP = { draft: 'tag-yellow', active: 'tag-green', paused: 'tag-blue', stopped: 'tag-red' };

export default function AstroCampaigns({ astrologerId }) {
  const { campaigns, addCampaign, updateCampaign, allAstrologers } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ campaignName: '', description: '', generalPrice: '', individualPrice: '', totalSlots: '', submissionMode: 'text', answerMode: 'text', deadlineHours: '48', categories: '', languages: '', generalQuestionLimit: '0', individualQuestionLimit: '0', startAt: '', endAt: '' });

  const myCampaigns = campaigns.filter(c => c.astrologerId === astrologerId);
  const astroName = allAstrologers.find(a => a.id === astrologerId)?.displayName || 'Astrologer';

  const openNew = () => {
    setEdit(null);
    setForm({ campaignName: '', description: '', generalPrice: '', individualPrice: '', totalSlots: '', submissionMode: 'text', answerMode: 'text', deadlineHours: '48', categories: '', languages: '', generalQuestionLimit: '0', individualQuestionLimit: '0', startAt: '', endAt: '' });
    setShowForm(true);
  };
  const openEdit = (c) => {
    setEdit(c);
    setForm({ campaignName: c.campaignName, description: c.description || '', generalPrice: String(c.generalPrice), individualPrice: String(c.individualPrice), totalSlots: String(c.totalSlots), submissionMode: c.submissionMode, answerMode: c.answerMode, deadlineHours: String(c.deadlineHours), categories: c.categories.join(', '), languages: c.languages.join(', '), generalQuestionLimit: String(c.generalQuestionLimit), individualQuestionLimit: String(c.individualQuestionLimit), startAt: c.startAt || '', endAt: c.endAt || '' });
    setShowForm(true);
  };

  const handleSave = () => {
    if (edit) {
      updateCampaign(edit.id, { ...form, generalPrice: Number(form.generalPrice), individualPrice: Number(form.individualPrice), totalSlots: Number(form.totalSlots), categories: form.categories.split(',').map(s => s.trim()), languages: form.languages.split(',').map(s => s.trim()) });
    } else {
      const c = { id: `cmp-${Date.now()}`, astrologerId, campaignName: form.campaignName, campaignCode: `CMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, description: form.description, generalPrice: Number(form.generalPrice), individualPrice: Number(form.individualPrice), currency: 'INR', totalSlots: Number(form.totalSlots), soldSlots: 0, availableSlots: Number(form.totalSlots), generalQuestionLimit: Number(form.generalQuestionLimit), individualQuestionLimit: Number(form.individualQuestionLimit), submissionMode: form.submissionMode, answerMode: form.answerMode, deadlineHours: Number(form.deadlineHours), status: 'draft', categories: form.categories.split(',').map(s => s.trim()), languages: form.languages.split(',').map(s => s.trim()), startAt: form.startAt || null, endAt: form.endAt || null, createdAt: new Date().toISOString() };
      addCampaign(c);
    }
    setShowForm(false);
    toast.success(edit ? 'Campaign updated!' : 'Campaign created!');
    if (!edit) {
      addNotification(NOTIF_TYPES.CAMPAIGN_REVIEW, 'Campaign Needs Review', `"${form.campaignName}" created by ${astroName}`, 'platform', { tab: 'campaigns' });
    }
  };

  const changeStatus = (id, status) => {
    if (status === 'activate' || status === 'resume') {
      const c = campaigns.find(x => x.id === id);
      if (c.generalPrice <= 0 || c.individualPrice <= 0 || c.totalSlots <= 0) return toast.error('Cannot activate: prices and totalSlots must be > 0');
      updateCampaign(id, { status: 'active', availableSlots: c.totalSlots - c.soldSlots });
      toast.success(`Campaign "${c.campaignName}" is now active!`);
      addNotification(NOTIF_TYPES.CAMPAIGN_ACTIVATED, 'Campaign Activated', `"${c.campaignName}" is now live and accepting questions`, 'astrologer', { tab: 'campaigns' });
    } else if (status === 'pause') {
      updateCampaign(id, { status: 'paused' });
      const c = campaigns.find(x => x.id === id);
      toast.info(`Campaign "${c.campaignName}" paused`);
      addNotification(NOTIF_TYPES.CAMPAIGN_PAUSED, 'Campaign Paused', `"${c.campaignName}" is paused — no new purchases`, 'astrologer', { tab: 'campaigns' });
    } else if (status === 'stop') {
      updateCampaign(id, { status: 'stopped' });
      const c = campaigns.find(x => x.id === id);
      toast.warning(`Campaign "${c.campaignName}" stopped`);
      addNotification(NOTIF_TYPES.CAMPAIGN_STOPPED, 'Campaign Stopped', `"${c.campaignName}" has been stopped`, 'astrologer', { tab: 'campaigns' });
    }
  };

  const totalSlots = myCampaigns.reduce((s, c) => s + c.totalSlots, 0);
  const totalSold = myCampaigns.reduce((s, c) => s + c.soldSlots, 0);

  return (
    <div>
      <div className="card card-gradient-border" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="gradient-text">✨ {astroName}'s Campaigns</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <AnimatedCounter value={myCampaigns.length} /> campaigns · <AnimatedCounter value={totalSlots} /> total slots · <AnimatedCounter value={totalSold} /> sold
          </p>
        </div>
        <button className="btn btn-primary btn-glow" onClick={openNew}>+ New Campaign</button>
      </div>

      <div className="grid">
        {myCampaigns.map(c => {
          const pct = c.totalSlots > 0 ? Math.round(c.soldSlots / c.totalSlots * 100) : 0;
          return (
            <div className="card" key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{c.campaignName}</h3>
                <span className={`tag ${STATUS_MAP[c.status]}`}>{c.status}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{c.description}</p>
              <div className="row" style={{ marginBottom: '0.5rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>General</span><br />₹{c.generalPrice}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Individual</span><br />₹{c.individualPrice}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Mode</span><br />{c.submissionMode}/{c.answerMode}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Deadline</span><br />{c.deadlineHours}h</div>
              </div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Slots: {c.soldSlots}/{c.totalSlots}</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {c.categories.map(cat => <span className="tag tag-blue" key={cat}>{cat}</span>)}
                {c.languages.map(l => <span className="tag tag-purple" key={l}>{l}</span>)}
              </div>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {c.status === 'draft' && <button className="btn btn-success btn-sm" onClick={() => changeStatus(c.id, 'activate')}>Activate</button>}
                {c.status === 'draft' && <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Edit</button>}
                {c.status === 'active' && <button className="btn btn-secondary btn-sm" onClick={() => changeStatus(c.id, 'pause')}>Pause</button>}
                {c.status === 'paused' && <button className="btn btn-success btn-sm" onClick={() => changeStatus(c.id, 'resume')}>Resume</button>}
                {(c.status === 'active' || c.status === 'paused') && <button className="btn btn-danger btn-sm" onClick={() => changeStatus(c.id, 'stop')}>Stop</button>}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{edit ? 'Edit Campaign' : 'New Campaign'}</h2>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--purple)', paddingBottom: '0.3rem' }}>📦 Campaign Details</div>
            <div className="form-group"><label>Campaign Name</label><input value={form.campaignName} onChange={e => setForm({...form, campaignName: e.target.value})} placeholder="e.g. Career Guidance" /></div>
            <div className="row">
              <div className="form-group"><label>General Price (₹)</label><input type="number" value={form.generalPrice} onChange={e => setForm({...form, generalPrice: e.target.value})} placeholder="199" /></div>
              <div className="form-group"><label>Individual Price (₹)</label><input type="number" value={form.individualPrice} onChange={e => setForm({...form, individualPrice: e.target.value})} placeholder="499" /></div>
            </div>
            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe what this campaign offers..." /></div>

            <div style={{ margin: '0.8rem 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--purple)', paddingBottom: '0.3rem' }}>⚙️ Slot Allocation</div>
            <div className="row">
              <div className="form-group"><label>Total Slots</label><input type="number" value={form.totalSlots} onChange={e => setForm({...form, totalSlots: e.target.value})} placeholder="50" /></div>
              <div className="form-group"><label>Deadline (hours)</label><input type="number" value={form.deadlineHours} onChange={e => setForm({...form, deadlineHours: e.target.value})} placeholder="48" /></div>
            </div>
            <div className="row">
              <div className="form-group"><label>General Question Limit</label><input type="number" value={form.generalQuestionLimit} onChange={e => setForm({...form, generalQuestionLimit: e.target.value})} placeholder="40" /></div>
              <div className="form-group"><label>Individual Question Limit</label><input type="number" value={form.individualQuestionLimit} onChange={e => setForm({...form, individualQuestionLimit: e.target.value})} placeholder="10" /></div>
            </div>

            <div style={{ margin: '0.8rem 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--purple)', paddingBottom: '0.3rem' }}>🎯 Mode & Filters</div>
            <div className="row">
              <div className="form-group"><label>Submission Mode</label><select value={form.submissionMode} onChange={e => setForm({...form, submissionMode: e.target.value})}><option value="text">Text</option><option value="voice">Voice</option><option value="both">Both</option></select></div>
              <div className="form-group"><label>Answer Mode</label><select value={form.answerMode} onChange={e => setForm({...form, answerMode: e.target.value})}><option value="text">Text</option><option value="voice">Voice</option><option value="live">Live</option></select></div>
            </div>
            <div className="row">
              <div className="form-group"><label>Categories (comma-separated)</label><input value={form.categories} onChange={e => setForm({...form, categories: e.target.value})} placeholder="Career, Finance, Health" /></div>
              <div className="form-group"><label>Languages (comma-separated)</label><input value={form.languages} onChange={e => setForm({...form, languages: e.target.value})} placeholder="English, Hindi, Tamil" /></div>
            </div>

            <div style={{ margin: '0.8rem 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--purple)', paddingBottom: '0.3rem' }}>📅 Schedule (optional)</div>
            <div className="row">
              <div className="form-group"><label>Start At</label><input type="datetime-local" value={form.startAt ? form.startAt.slice(0, 16) : ''} onChange={e => setForm({...form, startAt: e.target.value ? new Date(e.target.value).toISOString() : ''})} /></div>
              <div className="form-group"><label>End At</label><input type="datetime-local" value={form.endAt ? form.endAt.slice(0, 16) : ''} onChange={e => setForm({...form, endAt: e.target.value ? new Date(e.target.value).toISOString() : ''})} /></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.campaignName || !form.generalPrice || !form.individualPrice || !form.totalSlots}>{edit ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
