import { useState } from 'react';
import { purchases, campaigns, astrologyProfiles as profileData, raasiList, nakshatraList } from '../../data/mockData';

const pendingPurchases = purchases.filter(p => p.userId === 'u-1' && p.purchaseStatus === 'question_pending' && !p.questionSubmitted);

export default function UserAskQuestion() {
  const [step, setStep] = useState(pendingPurchases.length > 0 ? 'select' : 'no-purchases');
  const [selectedPur, setSelectedPur] = useState(null);
  const [form, setForm] = useState({ questionType: 'general', category: '', language: '', title: '', questionText: '' });

  const [profileForm, setProfileForm] = useState({
    dateOfBirth: '', birthTime: '', birthPlace: '', rasi: '', nakshatra: '', pada: 1, lagna: '',
    horoscopeNotes: '', uploadedFiles: []
  });

  const [submitted, setSubmitted] = useState(null);
  const [camp, setCamp] = useState(null);
  const [profiles] = useState(profileData);

  const selectPurchase = (p) => {
    setSelectedPur(p);
    const c = campaigns.find(c => c.id === p.campaignId);
    setCamp(c);
    setForm({ questionType: 'general', category: c.categories[0], language: c.languages[0], title: '', questionText: '' });
    const def = profileData.find(pr => pr.isDefault);
    if (def) {
      setProfileForm({
        dateOfBirth: def.dateOfBirth, birthTime: def.birthTime, birthPlace: def.birthPlace,
        rasi: def.rasi, nakshatra: def.nakshatra, pada: def.pada, lagna: def.lagna,
        horoscopeNotes: '', uploadedFiles: []
      });
    } else {
      setProfileForm({ dateOfBirth: '', birthTime: '', birthPlace: '', rasi: '', nakshatra: '', pada: 1, lagna: '', horoscopeNotes: '', uploadedFiles: [] });
    }
    setStep('form');
  };

  const isIndividual = form.questionType === 'individual';

  const handleSubmit = () => {
    if (!form.questionText && !form.title) return alert('Question text required');
    if (!form.category) return alert('Category required');
    if (!form.language) return alert('Language required');

    if (isIndividual) {
      if (!profileForm.dateOfBirth) return alert('Date of Birth is required for individual questions');
      if (!profileForm.birthPlace) return alert('Place of Birth is required for individual questions');
      if (!profileForm.rasi) return alert('Raasi (Moon Sign) is required for individual questions');
      if (!profileForm.nakshatra) return alert('Nakshatra is required for individual questions');
    }

    const attachments = profileForm.uploadedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }));
    setTimeout(() => {
      setSubmitted({
        ...form,
        profile: isIndividual ? { ...profileForm, uploadedFiles: undefined } : null,
        attachments: isIndividual && profileForm.uploadedFiles.length > 0 ? attachments : [],
        purchase: selectedPur, campaign: camp,
        questionCode: `Q-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        submittedAt: new Date().toISOString()
      });
      setStep('done');
    }, 1000);
  };

  if (step === 'no-purchases') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📋</div>
        <h2>No Purchases Available</h2>
        <p style={{ color: '#6e6573' }}>You need to purchase a question slot first. Go to the "Purchase" tab.</p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📨</div>
        <h2>Question Submitted!</h2>
        <div style={{ background: '#f9f6f1', padding: '1rem', borderRadius: '8px', display: 'inline-block', textAlign: 'left', margin: '0.5rem 0' }}>
          <div>Code: <strong>{submitted.questionCode}</strong></div>
          <div>Campaign: <strong>{submitted.campaign.campaignName}</strong></div>
          <div>Category: {submitted.category} · Language: {submitted.language}</div>
          <div>Type: <strong>{submitted.questionType}</strong></div>
          {submitted.profile && (
            <div style={{ marginTop: '0.3rem', paddingTop: '0.3rem', borderTop: '1px solid var(--line)' }}>
              <div style={{ color: '#5c3b8b', fontWeight: 600, fontSize: '0.78rem' }}>Attached Profile:</div>
              <div>DOB: {submitted.profile.dateOfBirth} · TOB: {submitted.profile.birthTime}</div>
              <div>Raasi: {submitted.profile.rasi} · Nakshatra: {submitted.profile.nakshatra}</div>
              {submitted.profile.horoscopeNotes && (
                <div style={{ marginTop: '0.3rem' }}>
                  <span style={{ fontWeight: 600, color: '#5c3b8b' }}>Horoscope:</span>
                  <p style={{ fontSize: '0.8rem', color: '#6e6573', marginTop: '2px' }}>{submitted.profile.horoscopeNotes}</p>
                </div>
              )}
            </div>
          )}
          {submitted.attachments && submitted.attachments.length > 0 && (
            <div style={{ marginTop: '0.3rem' }}>
              <span style={{ fontWeight: 600, color: '#5c3b8b', fontSize: '0.78rem' }}>Attachments:</span>
              {submitted.attachments.map((f, i) => (
                <div key={i} style={{ fontSize: '0.75rem', color: '#6e6573' }}>📎 {f.name} ({(f.size / 1024).toFixed(1)} KB)</div>
              ))}
            </div>
          )}
          <div>Due: {new Date(Date.now() + (submitted.campaign.deadlineHours || 48) * 3600000).toLocaleString()}</div>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#817987' }}>Track your question status in the "Tracking" tab.</p>
        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => { setStep('select'); setSubmitted(null); }}>Ask Another</button>
      </div>
    );
  }

  return (
    <div>
      {step === 'select' && (
        <>
          <div className="card"><h2>Select a Purchase</h2><p style={{ fontSize: '0.82rem', color: '#6e6573' }}>Choose a campaign slot to submit your question for.</p></div>
          <div className="grid">
            {pendingPurchases.map(p => (
              <div className="card" key={p.id}>
                <h3>{p.campaignName}</h3>
                <div className="row" style={{ marginTop: '0.4rem' }}>
                  <div><span style={{ color: '#817987' }}>Price</span><br />₹{p.price}</div>
                  <div><span style={{ color: '#817987' }}>Code</span><br />{p.purchaseCode}</div>
                  <div><span style={{ color: '#817987' }}>Answer</span><br />{p.answerMode}</div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => selectPurchase(p)}>Use This Slot</button>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 'form' && (
        <div className="card">
          <h2>Submit Question</h2>
          <p style={{ fontSize: '0.82rem', color: '#6e6573', marginBottom: '1rem' }}>
            Campaign: <strong>{selectedPur.campaignName}</strong> · Answer mode: <strong>{camp.answerMode}</strong>
          </p>

          <div className="row">
            <div className="form-group">
              <label>Question Type</label>
              <select value={form.questionType} onChange={e => setForm({...form, questionType: e.target.value})}>
                <option value="general">General (no personal details)</option>
                <option value="individual">Individual (with astrology profile)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {camp.categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select value={form.language} onChange={e => setForm({...form, language: e.target.value})}>
                {camp.languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Title (optional)</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Investment timing question" />
          </div>
          <div className="form-group">
            <label>Your Question</label>
            <textarea rows={5} value={form.questionText} onChange={e => setForm({...form, questionText: e.target.value})} placeholder="Describe your question in detail..." />
          </div>

          <div className="form-group">
            <label>Voice File (optional)</label>
            <input placeholder="https://example.com/audio/question.mp3" />
            <div className="helper">Upload a voice recording and paste the URL</div>
          </div>

          {isIndividual && (
            <div style={{ marginTop: '1rem', borderTop: '2px solid var(--purple)', paddingTop: '1rem', background: '#f9f6f1', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🔮</span>
                <h3 style={{ margin: 0, color: '#5c3b8b' }}>Personal Astrology Details</h3>
                {profiles.length > 0 && (
                  <span style={{ fontSize: '0.72rem', color: '#817987', marginLeft: 'auto' }}>
                    <button className="btn btn-sm btn-outline" type="button" onClick={() => {
                      const def = profiles.find(p => p.isDefault) || profiles[0];
                      if (def) setProfileForm({
                        dateOfBirth: def.dateOfBirth, birthTime: def.birthTime, birthPlace: def.birthPlace,
                        rasi: def.rasi, nakshatra: def.nakshatra, pada: def.pada, lagna: def.lagna,
                        horoscopeNotes: '', uploadedFiles: []
                      });
                    }}>Load from Saved Profile</button>
                  </span>
                )}
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" value={profileForm.dateOfBirth} onChange={e => setProfileForm({...profileForm, dateOfBirth: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Time of Birth</label>
                  <input type="time" value={profileForm.birthTime} onChange={e => setProfileForm({...profileForm, birthTime: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Place of Birth *</label>
                  <input value={profileForm.birthPlace} onChange={e => setProfileForm({...profileForm, birthPlace: e.target.value})} placeholder="City, State" />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Raasi (Moon Sign) *</label>
                  <select value={profileForm.rasi} onChange={e => setProfileForm({...profileForm, rasi: e.target.value})}>
                    <option value="">Select</option>
                    {raasiList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nakshatra *</label>
                  <select value={profileForm.nakshatra} onChange={e => setProfileForm({...profileForm, nakshatra: e.target.value})}>
                    <option value="">Select</option>
                    {nakshatraList.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Pada (1-4)</label>
                  <input type="number" min="1" max="4" value={profileForm.pada} onChange={e => setProfileForm({...profileForm, pada: e.target.value})} />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Lagna (Ascendant)</label>
                  <select value={profileForm.lagna} onChange={e => setProfileForm({...profileForm, lagna: e.target.value})}>
                    <option value="">Select</option>
                    {raasiList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--line)', paddingTop: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>🌙</span>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#5c3b8b' }}>Horoscope / Chart Details</h4>
                </div>
                <div className="form-group">
                  <label>Horoscope Notes (planet positions, house details, etc.)</label>
                  <textarea rows={3} value={profileForm.horoscopeNotes} onChange={e => setProfileForm({...profileForm, horoscopeNotes: e.target.value})}
                    placeholder="e.g. Jupiter in 7th house, Saturn retrograde in 10th, Moon in Rohini nakshatra..." />
                </div>
              </div>

              <div style={{ marginTop: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>📎</span>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#5c3b8b' }}>Upload Horoscope / Documents</h4>
                </div>
                <div style={{ background: '#fff', border: '2px dashed var(--line)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                  <input type="file" id="file-upload" multiple style={{ display: 'none' }}
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      setProfileForm({...profileForm, uploadedFiles: [...profileForm.uploadedFiles, ...files]});
                      e.target.value = '';
                    }} />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>📤</div>
                    <span style={{ color: '#5c3b8b', fontWeight: 600, fontSize: '0.85rem' }}>Click to upload</span>
                    <div style={{ fontSize: '0.72rem', color: '#817987', marginTop: '0.2rem' }}>Horoscope images, PDF charts (max 5MB each)</div>
                  </label>
                </div>
                {profileForm.uploadedFiles.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {profileForm.uploadedFiles.map((f, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: '#fff', border: '1px solid var(--line)', borderRadius: '6px', marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                        <span>📎 {f.name}</span>
                        <span style={{ color: '#817987' }}>{(f.size / 1024).toFixed(1)} KB</span>
                        <button className="btn btn-sm btn-danger" style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                          onClick={() => setProfileForm({...profileForm, uploadedFiles: profileForm.uploadedFiles.filter((_, fi) => fi !== i)})}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="modal-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setStep('select')}>Back</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit Question</button>
          </div>
        </div>
      )}
    </div>
  );
}
