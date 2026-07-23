import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';

const SPECIALTIES = ['Vedic Astrology', 'Numerology', 'Vastu', 'Muhurtha', 'Palmistry', 'Tarot', 'Prashna', 'Gemstone Advisory'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Gujarati', 'Bengali'];

export default function AstroProfile() {
  const { astroSettings, updateAstroSettings } = useData();
  const toast = useToast();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...astroSettings });

  const handleSave = () => {
    updateAstroSettings({
      displayName: form.displayName, title: form.title, bio: form.bio,
      experienceYears: Number(form.experienceYears),
      specialties: form.specialties, consultationLanguages: form.consultationLanguages,
      maxDailyQuestions: Number(form.maxDailyQuestions),
      autoAcceptQuestions: form.autoAcceptQuestions,
      instantAnswerEnabled: form.instantAnswerEnabled,
      notificationPreferences: form.notificationPreferences,
    });
    setEdit(false);
    toast.success('Profile updated!');
  };

  const toggleArrayItem = (arr, item) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  return (
    <div>
      <div className="card card-gradient-border">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="gradient-text">⭐ Astrologer Profile</h2>
            <p style={{ fontSize: '0.82rem', color: '#888', marginTop: '0.2rem' }}>{astroSettings.displayName} · {astroSettings.title}</p>
          </div>
          <button className={`btn ${edit ? 'btn-success' : 'btn-primary'}`} onClick={() => edit ? handleSave() : setEdit(true)}>
            {edit ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="row">
        <div className="card" style={{ flex: 1 }}>
          <h2>Profile Details</h2>
          {edit ? (
            <>
              <div className="row">
                <div className="form-group"><label>Display Name</label><input value={form.displayName} onChange={e => setForm({...form, displayName: e.target.value})} /></div>
                <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Bio</label><textarea rows={4} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} /></div>
              <div className="row">
                <div className="form-group"><label>Experience (years)</label><input type="number" value={form.experienceYears} onChange={e => setForm({...form, experienceYears: e.target.value})} /></div>
                <div className="form-group"><label>Max Questions/Day</label><input type="number" value={form.maxDailyQuestions} onChange={e => setForm({...form, maxDailyQuestions: e.target.value})} /></div>
              </div>
              <div className="form-group">
                <label>Automatically Accept Questions</label>
                <select value={form.autoAcceptQuestions} onChange={e => setForm({...form, autoAcceptQuestions: e.target.value === 'true'})}>
                  <option value="true">Yes</option><option value="false">No</option>
                </select>
              </div>
              <div className="row">
                <div className="form-group">
                  <label>Specialties</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {SPECIALTIES.map(s => (
                      <span key={s} className={`tag ${form.specialties.includes(s) ? 'tag-green' : 'tag-gray'}`}
                        style={{ cursor: 'pointer' }} onClick={() => setForm({...form, specialties: toggleArrayItem(form.specialties, s)})}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Consultation Languages</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {LANGUAGES.map(l => (
                    <span key={l} className={`tag ${form.consultationLanguages.includes(l) ? 'tag-blue' : 'tag-gray'}`}
                      style={{ cursor: 'pointer' }} onClick={() => setForm({...form, consultationLanguages: toggleArrayItem(form.consultationLanguages, l)})}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#888' }}>{astroSettings.bio}</p>
                <div style={{ marginTop: '0.8rem' }}>
                  <div className="stat-pill">🎂 {astroSettings.experienceYears} years experience</div>
                  <div className="stat-pill" style={{ marginLeft: '0.3rem' }}>📅 {astroSettings.maxDailyQuestions} questions/day</div>
                </div>
              </div>
              <div style={{ marginTop: '0.8rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Specialties</div>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {astroSettings.specialties.map(s => <span key={s} className="tag tag-blue">{s}</span>)}
                </div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Languages</div>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {astroSettings.consultationLanguages.map(l => <span key={l} className="tag tag-purple">{l}</span>)}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h2>Settings & Preferences</h2>
          {edit ? (
            <>
              <div className="form-group">
                <label>Email Notifications</label>
                <select value={form.notificationPreferences.email ? 'true' : 'false'} onChange={e => setForm({...form, notificationPreferences: {...form.notificationPreferences, email: e.target.value === 'true'}})}>
                  <option value="true">Enabled</option><option value="false">Disabled</option>
                </select>
              </div>
              <div className="form-group">
                <label>SMS Notifications</label>
                <select value={form.notificationPreferences.sms ? 'true' : 'false'} onChange={e => setForm({...form, notificationPreferences: {...form.notificationPreferences, sms: e.target.value === 'true'}})}>
                  <option value="true">Enabled</option><option value="false">Disabled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Push Notifications</label>
                <select value={form.notificationPreferences.push ? 'true' : 'false'} onChange={e => setForm({...form, notificationPreferences: {...form.notificationPreferences, push: e.target.value === 'true'}})}>
                  <option value="true">Enabled</option><option value="false">Disabled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Instant Answer Mode</label>
                <select value={form.instantAnswerEnabled ? 'true' : 'false'} onChange={e => setForm({...form, instantAnswerEnabled: e.target.value === 'true'})}>
                  <option value="false">Disabled</option><option value="true">Enabled</option>
                </select>
                <div className="helper">When enabled, some questions can be auto-answered with templates</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginTop: '0.5rem' }}>
                <div className="stat-pill">📧 Email: {astroSettings.notificationPreferences.email ? '✅' : '❌'}</div>
                <div className="stat-pill" style={{ marginLeft: '0.3rem' }}>📱 SMS: {astroSettings.notificationPreferences.sms ? '✅' : '❌'}</div>
                <div className="stat-pill" style={{ marginLeft: '0.3rem' }}>🔔 Push: {astroSettings.notificationPreferences.push ? '✅' : '❌'}</div>
              </div>
              <hr className="section-divider" />
              <h3>Bank Account (for payouts)</h3>
              <div style={{ fontSize: '0.82rem', marginTop: '0.3rem' }}>
                <div><span style={{ color: '#888' }}>Holder:</span> {astroSettings.bankAccount.accountHolder}</div>
                <div><span style={{ color: '#888' }}>Bank:</span> {astroSettings.bankAccount.bankName}</div>
                <div><span style={{ color: '#888' }}>Account:</span> {astroSettings.bankAccount.accountNumber}</div>
                <div><span style={{ color: '#888' }}>IFSC:</span> {astroSettings.bankAccount.ifsc}</div>
              </div>
              <hr className="section-divider" />
              <h3>Quick Stats</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                <div className="stat-pill">⭐ Rating: {astroSettings.rating || 4.5}</div>
                <div className="stat-pill">📋 {astroSettings.reviewCount || 128} reviews</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
