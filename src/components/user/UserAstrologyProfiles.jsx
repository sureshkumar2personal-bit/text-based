import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { raasiList, nakshatraList, relationshipOptions } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

const EMPTY_FORM = {
  profileName: '', relationship: 'self', gender: '',
  dateOfBirth: '', birthTime: '', birthPlace: '',
  latitude: '', longitude: '', timezone: 'Asia/Kolkata',
  rasi: '', nakshatra: '', pada: 1, lagna: ''
};

export default function UserAstrologyProfiles() {
  const { astrologyProfiles, addAstrologyProfile, updateAstrologyProfile, deleteAstrologyProfile, setDefaultProfile } = useData();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      profileName: p.profileName, relationship: p.relationship, gender: p.gender,
      dateOfBirth: p.dateOfBirth, birthTime: p.birthTime, birthPlace: p.birthPlace,
      latitude: String(p.latitude), longitude: String(p.longitude), timezone: p.timezone,
      rasi: p.rasi, nakshatra: p.nakshatra, pada: p.pada, lagna: p.lagna
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.profileName || !form.dateOfBirth || !form.birthPlace || !form.rasi || !form.nakshatra)
      return toast.error('Profile name, DOB, birth place, rasi and nakshatra are required.');

    if (editing) {
      updateAstrologyProfile(editing.id, { ...form, latitude: Number(form.latitude) || 0, longitude: Number(form.longitude) || 0, pada: Number(form.pada) });
    } else {
      const p = {
        id: `ap-${Date.now()}`, userId: 'u-1', ...form,
        latitude: Number(form.latitude) || 0, longitude: Number(form.longitude) || 0, pada: Number(form.pada) || 1,
        isDefault: astrologyProfiles.length === 0, createdAt: new Date().toISOString()
      };
      addAstrologyProfile(p);
    }
    setShowForm(false);
    toast.success(editing ? 'Profile updated!' : 'Profile created!');
  };

  const handleDelete = (id) => {
    deleteAstrologyProfile(id);
    toast.info('Profile deleted');
  };

  const handleSetDefault = (id) => {
    setDefaultProfile(id);
  };

  const defaultProfile = astrologyProfiles.find(p => p.isDefault);

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>My Astrology Profiles</h2>
            <p style={{ fontSize: '0.82rem', color: '#6e6573' }}>{astrologyProfiles.length} profile{astrologyProfiles.length !== 1 ? 's' : ''}{defaultProfile ? ` · Default: ${defaultProfile.profileName}` : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ New Profile</button>
        </div>
      </div>

      {astrologyProfiles.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#817987' }}>No astrology profiles yet. Create one to use with your individual questions.</p>
        </div>
      )}

      <div className="grid">
        {astrologyProfiles.map(p => (
          <div className="card" key={p.id} style={p.isDefault ? { borderColor: '#5c3b8b' } : {}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {p.profileName}
                  {p.isDefault && <span className="tag tag-blue">default</span>}
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#817987', textTransform: 'capitalize' }}>{p.relationship} · {p.gender}</span>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              <div className="row" style={{ gap: '0.5rem', marginBottom: '0.3rem' }}>
                <div><span style={{ color: '#817987' }}>DOB</span><br />{p.dateOfBirth}</div>
                <div><span style={{ color: '#817987' }}>TOB</span><br />{p.birthTime}</div>
                <div><span style={{ color: '#817987' }}>POB</span><br />{p.birthPlace}</div>
              </div>
              <div className="row" style={{ gap: '0.5rem' }}>
                <div><span style={{ color: '#817987' }}>Raasi</span><br /><strong style={{ color: '#5c3b8b' }}>{p.rasi}</strong></div>
                <div><span style={{ color: '#817987' }}>Nakshatra</span><br /><strong style={{ color: '#5c3b8b' }}>{p.nakshatra}</strong></div>
                <div><span style={{ color: '#817987' }}>Lagna</span><br />{p.lagna || '—'}</div>
              </div>
            </div>

            <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.3rem', borderTop: '1px solid var(--line)', paddingTop: '0.6rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
              {!p.isDefault && <button className="btn btn-secondary btn-sm" onClick={() => handleSetDefault(p.id)}>Set Default</button>}
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)} style={{ marginLeft: 'auto' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <h2>{editing ? 'Edit Profile' : 'New Astrology Profile'}</h2>

            <div className="row">
              <div className="form-group">
                <label>Profile Name *</label>
                <input value={form.profileName} onChange={e => setForm({...form, profileName: e.target.value})} placeholder="e.g. Myself, My Son" />
              </div>
              <div className="form-group">
                <label>Relationship</label>
                <select value={form.relationship} onChange={e => setForm({...form, relationship: e.target.value})}>
                  {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Time of Birth</label>
                <input type="time" value={form.birthTime} onChange={e => setForm({...form, birthTime: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Place of Birth *</label>
                <input value={form.birthPlace} onChange={e => setForm({...form, birthPlace: e.target.value})} placeholder="City, State" />
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <label>Raasi (Moon Sign) *</label>
                <select value={form.rasi} onChange={e => setForm({...form, rasi: e.target.value})}>
                  <option value="">Select</option>
                  {raasiList.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Nakshatra *</label>
                <select value={form.nakshatra} onChange={e => setForm({...form, nakshatra: e.target.value})}>
                  <option value="">Select</option>
                  {nakshatraList.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Pada (1-4)</label>
                <input type="number" min="1" max="4" value={form.pada} onChange={e => setForm({...form, pada: e.target.value})} />
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <label>Lagna (Ascendant)</label>
                <select value={form.lagna} onChange={e => setForm({...form, lagna: e.target.value})}>
                  <option value="">Select</option>
                  {raasiList.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select value={form.timezone} onChange={e => setForm({...form, timezone: e.target.value})}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <label>Latitude</label>
                <input type="number" step="any" value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} placeholder="13.0827" />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input type="number" step="any" value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} placeholder="80.2707" />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editing ? 'Update' : 'Create Profile'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
