import { useState, useRef } from 'react';
import { useData } from '../../data/DataContext';
import { raasiList, nakshatraList, relationshipOptions } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';
import ModalPortal from '../ui/ModalPortal';

const EMPTY_FORM = {
  profileName: '', relationship: 'self', gender: '',
  dateOfBirth: '', birthTime: '', birthPlace: '',
  latitude: '', longitude: '', timezone: 'Asia/Kolkata',
  rasi: '', nakshatra: '', pada: 1, lagna: '',
  mobile: '', email: '', horoscopeFiles: []
};

export default function UserAstrologyProfiles() {
  const { astrologyProfiles, addAstrologyProfile, updateAstrologyProfile, deleteAstrologyProfile, setDefaultProfile } = useData();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const uploadRef = useRef(null);

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
      rasi: p.rasi, nakshatra: p.nakshatra, pada: p.pada, lagna: p.lagna,
      mobile: p.mobile || '', email: p.email || '', horoscopeFiles: p.horoscopeFiles || []
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
              {(p.mobile || p.email) && (
                <div className="row" style={{ gap: '0.5rem', marginTop: '0.3rem' }}>
                  {p.mobile && <div><span style={{ color: '#817987' }}>📱 Mobile</span><br />{p.mobile}</div>}
                  {p.email && <div><span style={{ color: '#817987' }}>📧 Email</span><br />{p.email}</div>}
                </div>
              )}
              {p.horoscopeFiles?.length > 0 && (
                <div style={{ marginTop: '0.3rem', fontSize: '0.72rem', color: 'var(--purple)' }}>
                  📎 {p.horoscopeFiles.length} horoscope file(s)
                </div>
              )}
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
        <ModalPortal className="astrology-profile-overlay" onClose={() => setShowForm(false)}>
          <div
            className="modal astrology-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="astrology-profile-modal-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="astrology-profile-modal-header">
              <div>
                <span className="astrology-profile-modal-kicker">Astrology profile</span>
                <h2 id="astrology-profile-modal-title">{editing ? 'Edit profile details' : 'Create a new profile'}</h2>
                <p>Keep these details accurate for more reliable chart calculations.</p>
              </div>
              <button
                type="button"
                className="astrology-profile-modal-close"
                aria-label="Close profile form"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <div className="astrology-profile-modal-body">
            <div className="astrology-profile-section">
              <div className="astrology-profile-section-heading">
                <span>01</span>
                <div><h3>Basic information</h3><p>How this profile should be identified.</p></div>
              </div>
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
            </div>

            <div className="astrology-profile-section">
              <div className="astrology-profile-section-heading">
                <span>02</span>
                <div><h3>Birth details</h3><p>Information used to calculate the birth chart.</p></div>
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
            </div>

            <div className="astrology-profile-section">
              <div className="astrology-profile-section-heading">
                <span>03</span>
                <div><h3>Location & coordinates</h3><p>Optional precision details for the place of birth.</p></div>
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
            </div>

            <div className="astrology-profile-section">
            <div className="astrology-profile-section-heading">
              <span>04</span>
              <div><h3>Contact information</h3><p>Optional details kept with this profile.</p></div>
            </div>
            <div className="row">
              <div className="form-group">
                <label>Mobile Number</label>
                <input value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} placeholder="+91-9876543210" />
              </div>
              <div className="form-group">
                <label>Email ID</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="user@example.com" />
              </div>
            </div>
            </div>

            <div className="astrology-profile-section">
            <div className="astrology-profile-section-heading">
              <span>05</span>
              <div><h3>Horoscope documents</h3><p>Attach existing charts for quick reference.</p></div>
            </div>
            <div ref={uploadRef}
              className="astrology-profile-upload"
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('is-dragging'); }}
              onDragLeave={e => { e.currentTarget.classList.remove('is-dragging'); }}
              onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('is-dragging'); const files = Array.from(e.dataTransfer.files); if (files.length) setForm({...form, horoscopeFiles: [...form.horoscopeFiles, ...files]}); }}>
              <input type="file" id="horo-upload" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                onChange={e => {
                  const files = Array.from(e.target.files);
                  setForm({...form, horoscopeFiles: [...form.horoscopeFiles, ...files]});
                  e.target.value = '';
                }} />
              <label htmlFor="horo-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>📤</div>
                <span style={{ color: 'var(--purple)', fontWeight: 600, fontSize: '0.85rem' }}>Click to upload horoscope</span>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>PDF, JPG, PNG (max 5MB each)</div>
              </label>
              <div className="astrology-profile-upload-divider">or drag &amp; drop files here</div>
            </div>
            {form.horoscopeFiles.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                {form.horoscopeFiles.map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: '#fff', border: '1px solid var(--line)', borderRadius: '6px', marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                    <span>📎 {f.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{(f.size / 1024).toFixed(1)} KB</span>
                    <button className="btn btn-sm btn-danger" style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                      onClick={() => setForm({...form, horoscopeFiles: form.horoscopeFiles.filter((_, fi) => fi !== i)})}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            </div>
            </div>

            <div className="modal-actions astrology-profile-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>{editing ? 'Save changes' : 'Create profile'}</button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
