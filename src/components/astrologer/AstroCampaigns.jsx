import { useState } from 'react';
import { campaigns } from '../../data/mockData';

const STATUS_MAP = { draft: 'tag-yellow', active: 'tag-green', paused: 'tag-blue', stopped: 'tag-red' };

export default function AstroCampaigns() {
  const [list, setList] = useState(campaigns);
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ campaignName: '', description: '', price: '', totalSlots: '', submissionMode: 'text', answerMode: 'text', deadlineHours: '48', categories: '', languages: '', generalQuestionLimit: '0', individualQuestionLimit: '0', startAt: '', endAt: '' });

  const openNew = () => {
    setEdit(null);
    setForm({ campaignName: '', description: '', price: '', totalSlots: '', submissionMode: 'text', answerMode: 'text', deadlineHours: '48', categories: '', languages: '', generalQuestionLimit: '0', individualQuestionLimit: '0', startAt: '', endAt: '' });
    setShowForm(true);
  };
  const openEdit = (c) => {
    setEdit(c);
    setForm({ campaignName: c.campaignName, description: c.description || '', price: String(c.price), totalSlots: String(c.totalSlots), submissionMode: c.submissionMode, answerMode: c.answerMode, deadlineHours: String(c.deadlineHours), categories: c.categories.join(', '), languages: c.languages.join(', '), generalQuestionLimit: String(c.generalQuestionLimit), individualQuestionLimit: String(c.individualQuestionLimit), startAt: c.startAt || '', endAt: c.endAt || '' });
    setShowForm(true);
  };

  const handleSave = () => {
    if (edit) {
      setList(list.map(c => c.id === edit.id ? { ...c, ...form, price: Number(form.price), totalSlots: Number(form.totalSlots), categories: form.categories.split(',').map(s => s.trim()), languages: form.languages.split(',').map(s => s.trim()) } : c));
    } else {
      const c = { id: `cmp-${Date.now()}`, astrologerId: 'a-1', campaignName: form.campaignName, campaignCode: `CMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, description: form.description, price: Number(form.price), currency: 'INR', totalSlots: Number(form.totalSlots), soldSlots: 0, availableSlots: Number(form.totalSlots), generalQuestionLimit: Number(form.generalQuestionLimit), individualQuestionLimit: Number(form.individualQuestionLimit), submissionMode: form.submissionMode, answerMode: form.answerMode, deadlineHours: Number(form.deadlineHours), status: 'draft', categories: form.categories.split(',').map(s => s.trim()), languages: form.languages.split(',').map(s => s.trim()), startAt: form.startAt || null, endAt: form.endAt || null, createdAt: new Date().toISOString() };
      setList([c, ...list]);
    }
    setShowForm(false);
  };

  const changeStatus = (id, status) => {
    if (status === 'activate') {
      const c = list.find(x => x.id === id);
      if (c.price <= 0 || c.totalSlots <= 0) return alert('Cannot activate: price and totalSlots must be > 0');
      setList(list.map(c => c.id === id ? { ...c, status: 'active', availableSlots: c.totalSlots - c.soldSlots } : c));
    } else if (status === 'pause') {
      setList(list.map(c => c.id === id ? { ...c, status: 'paused' } : c));
    } else if (status === 'stop') {
      setList(list.map(c => c.id === id ? { ...c, status: 'stopped' } : c));
    }
  };

  const totalSlots = list.reduce((s, c) => s + c.totalSlots, 0);
  const totalSold = list.reduce((s, c) => s + c.soldSlots, 0);

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Question Campaigns</h2>
          <p style={{ fontSize: '0.82rem', color: '#888' }}>{list.length} campaigns · {totalSlots} total slots · {totalSold} sold</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ New Campaign</button>
      </div>

      <div className="grid">
        {list.map(c => {
          const pct = c.totalSlots > 0 ? Math.round(c.soldSlots / c.totalSlots * 100) : 0;
          return (
            <div className="card" key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{c.campaignName}</h3>
                <span className={`tag ${STATUS_MAP[c.status]}`}>{c.status}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.5rem' }}>{c.description}</p>
              <div className="row" style={{ marginBottom: '0.5rem' }}>
                <div><span style={{ color: '#888' }}>Price</span><br />₹{c.price}</div>
                <div><span style={{ color: '#888' }}>Mode</span><br />{c.submissionMode}/{c.answerMode}</div>
                <div><span style={{ color: '#888' }}>Deadline</span><br />{c.deadlineHours}h</div>
              </div>
              <div><span style={{ color: '#888', fontSize: '0.78rem' }}>Slots: {c.soldSlots}/{c.totalSlots}</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {c.categories.map(cat => <span className="tag tag-blue" key={cat}>{cat}</span>)}
                {c.languages.map(l => <span className="tag tag-purple" key={l}>{l}</span>)}
              </div>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {c.status === 'draft' && <button className="btn btn-success btn-sm" onClick={() => changeStatus(c.id, 'activate')}>Activate</button>}
                {c.status === 'draft' && <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Edit</button>}
                {c.status === 'active' && <button className="btn btn-secondary btn-sm" onClick={() => changeStatus(c.id, 'pause')}>Pause</button>}
                {c.status === 'paused' && <button className="btn btn-success btn-sm" onClick={() => changeStatus(c.id, 'activate')}>Resume</button>}
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
            <div className="row">
              <div className="form-group"><label>Campaign Name</label><input value={form.campaignName} onChange={e => setForm({...form, campaignName: e.target.value})} /></div>
              <div className="form-group"><label>Price (₹)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
            </div>
            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div className="row">
              <div className="form-group"><label>Total Slots</label><input type="number" value={form.totalSlots} onChange={e => setForm({...form, totalSlots: e.target.value})} /></div>
              <div className="form-group"><label>Deadline (hours)</label><input type="number" value={form.deadlineHours} onChange={e => setForm({...form, deadlineHours: e.target.value})} /></div>
            </div>
            <div className="row">
              <div className="form-group"><label>Submission Mode</label><select value={form.submissionMode} onChange={e => setForm({...form, submissionMode: e.target.value})}><option value="text">Text</option><option value="voice">Voice</option><option value="both">Both</option></select></div>
              <div className="form-group"><label>Answer Mode</label><select value={form.answerMode} onChange={e => setForm({...form, answerMode: e.target.value})}><option value="text">Text</option><option value="voice">Voice</option><option value="live">Live</option></select></div>
            </div>
            <div className="row">
              <div className="form-group"><label>Categories (comma-separated)</label><input value={form.categories} onChange={e => setForm({...form, categories: e.target.value})} placeholder="Career, Finance, Health" /></div>
              <div className="form-group"><label>Languages (comma-separated)</label><input value={form.languages} onChange={e => setForm({...form, languages: e.target.value})} placeholder="English, Hindi, Tamil" /></div>
            </div>
            <div className="row">
              <div className="form-group"><label>General Q Limit</label><input type="number" value={form.generalQuestionLimit} onChange={e => setForm({...form, generalQuestionLimit: e.target.value})} /></div>
              <div className="form-group"><label>Individual Q Limit</label><input type="number" value={form.individualQuestionLimit} onChange={e => setForm({...form, individualQuestionLimit: e.target.value})} /></div>
            </div>
            <div className="row">
              <div className="form-group"><label>Start At</label><input type="datetime-local" value={form.startAt ? form.startAt.slice(0, 16) : ''} onChange={e => setForm({...form, startAt: e.target.value ? new Date(e.target.value).toISOString() : ''})} /></div>
              <div className="form-group"><label>End At</label><input type="datetime-local" value={form.endAt ? form.endAt.slice(0, 16) : ''} onChange={e => setForm({...form, endAt: e.target.value ? new Date(e.target.value).toISOString() : ''})} /></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.campaignName || !form.price || !form.totalSlots}>{edit ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
