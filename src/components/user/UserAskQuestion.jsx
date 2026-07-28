import { useState, useRef, useEffect } from 'react';
import { useData } from '../../data/DataContext';
import { raasiList, nakshatraList } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

export default function UserAskQuestion({ onAskSuccess, preselectId }) {
  const { purchases, campaigns, astrologyProfiles, allAstrologers, addQuestion } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const pendingPurchases = purchases.filter(p => p.userId === 'u-1' && p.purchaseStatus === 'question_pending' && !p.questionSubmitted);

  const [step, setStep] = useState('select');
  const [selectedPur, setSelectedPur] = useState(null);
  const [form, setForm] = useState({ questionType: 'general', language: 'English', questionText: '' });

  const [profileForm, setProfileForm] = useState({
    dateOfBirth: '', birthTime: '', birthPlace: '', rasi: '', nakshatra: '', pada: 1, lagna: '',
    horoscopeNotes: '', uploadedFiles: []
  });
  const [submitted, setSubmitted] = useState(null);
  const [camp, setCamp] = useState(null);
  const uploadRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (uploadRef.current?.contains(e.target)) {
        const items = Array.from(e.clipboardData?.items || []);
        const files = items.filter(i => i.kind === 'file').map(i => i.getAsFile()).filter(Boolean);
        if (files.length) { e.preventDefault(); setProfileForm(prev => ({...prev, uploadedFiles: [...prev.uploadedFiles, ...files]})); }
      }
    };
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch {
      toast.error('Microphone access denied. Please allow microphone permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(recordingTimerRef.current);
  };

  const deleteRecording = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingTime(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(recordingTimerRef.current);
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, []);

  const selectPurchase = (p) => {
    setSelectedPur(p);
    const c = campaigns.find(c => c.id === p.campaignId);
    setCamp(c);
    setForm({ questionType: p.variation || 'general', language: 'English', questionText: '' });
    deleteRecording();
    const def = astrologyProfiles.find(pr => pr.isDefault);
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

  useEffect(() => {
    if (preselectId) {
      const found = pendingPurchases.find(p => p.id === preselectId);
      if (found) {
        selectPurchase(found);
      }
    } else if (pendingPurchases.length === 0) {
      setStep('no-purchases');
    }
  }, [preselectId]);

  const isIndividual = form.questionType === 'individual';

  const handleSubmit = () => {
    if (!form.questionText) return toast.error('Question text is required');
    if (!form.language) return toast.error('Please select a language');

    if (isIndividual) {
      if (!profileForm.dateOfBirth) return toast.error('Date of Birth is required for individual questions');
      if (!profileForm.birthPlace) return toast.error('Place of Birth is required for individual questions');
      if (!profileForm.rasi) return toast.error('Raasi (Moon Sign) is required for individual questions');
      if (!profileForm.nakshatra) return toast.error('Nakshatra is required for individual questions');
    }

    const q = addQuestion({
      campaignId: camp.id, purchaseId: selectedPur.id,
      questionType: form.questionType, language: form.language,
      title: form.questionText.slice(0, 50), questionText: form.questionText,
      deadlineHours: camp.deadlineHours, campaignName: camp.campaignName, answerMode: camp.answerMode,
      profile: isIndividual ? { ...profileForm, uploadedFiles: undefined } : null,
      attachments: isIndividual && profileForm.uploadedFiles.length > 0 ? profileForm.uploadedFiles.map(f => ({ name: f.name, type: f.type, size: f.size })) : [],
      voiceNote: recordedBlob ? { name: 'voice_note.webm', type: recordedBlob.type, size: recordedBlob.size } : null,
    });

    setTimeout(() => {
      setSubmitted({
        ...form,
        profile: isIndividual ? { ...profileForm, uploadedFiles: undefined } : null,
        attachments: isIndividual && profileForm.uploadedFiles.length > 0 ? profileForm.uploadedFiles.map(f => ({ name: f.name, type: f.type, size: f.size })) : [],
        voiceNote: recordedBlob ? { name: 'voice_note.webm', type: recordedBlob.type, size: recordedBlob.size } : null,
        purchase: selectedPur, campaign: camp,
        questionCode: q.questionCode,
        submittedAt: new Date().toISOString()
      });
      setStep('done');
      toast.success('Question submitted successfully!', 4000);
      addNotification(NOTIF_TYPES.QUESTION_SUBMITTED, 'New Question', `"${q.title || q.questionText.slice(0, 40)}" submitted by user`, 'astrologer', { tab: 'queue' });
      if (onAskSuccess) onAskSuccess();
    }, 500);
  };

  if (step === 'no-purchases') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>📋</div>
        <h2>No Purchases Available</h2>
        <p style={{ color: 'var(--text-muted)' }}>You need to purchase a question slot first. Go to the "Purchase" tab.</p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>📨</div>
        <h2>Question Submitted!</h2>
        <div style={{ background: 'var(--pale)', padding: '1rem', borderRadius: '8px', display: 'inline-block', textAlign: 'left', margin: '0.5rem 0' }}>
          <div>Code: <strong>{submitted.questionCode}</strong></div>
          <div>Campaign: <strong>{submitted.campaign.campaignName}</strong></div>
          <div style={{ color: '#d63384' }}>Astrologer: <strong>{submitted.astrologerName || allAstrologers.find(a => a.id === submitted.astrologerId)?.displayName || 'Unknown'}</strong></div>
          <div>Language: {submitted.language}</div>
          <div>Type: <strong>{submitted.questionType}</strong></div>
          {submitted.profile && (
            <div style={{ marginTop: '0.3rem', paddingTop: '0.3rem', borderTop: '1px solid var(--line)' }}>
              <div style={{ color: 'var(--purple)', fontWeight: 600, fontSize: '0.78rem' }}>Attached Profile:</div>
              <div>DOB: {submitted.profile.dateOfBirth} · TOB: {submitted.profile.birthTime}</div>
              <div>Raasi: {submitted.profile.rasi} · Nakshatra: {submitted.profile.nakshatra}</div>
              {submitted.profile.horoscopeNotes && (
                <div style={{ marginTop: '0.3rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--purple)' }}>Horoscope:</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{submitted.profile.horoscopeNotes}</p>
                </div>
              )}
            </div>
          )}
          {submitted.attachments && submitted.attachments.length > 0 && (
            <div style={{ marginTop: '0.3rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--purple)', fontSize: '0.78rem' }}>Attachments:</span>
              {submitted.attachments.map((f, i) => (
                <div key={i} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📎 {f.name} ({(f.size / 1024).toFixed(1)} KB)</div>
              ))}
            </div>
          )}
          {submitted.voiceNote && (
            <div style={{ marginTop: '0.3rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--purple)', fontSize: '0.78rem' }}>Voice Note:</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🎤 {submitted.voiceNote.name} ({(submitted.voiceNote.size / 1024).toFixed(1)} KB)</div>
            </div>
          )}
          <div>Due: {new Date(Date.now() + (submitted.campaign.deadlineHours || 48) * 3600000).toLocaleString()}</div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Track your question status in the "Tracking" tab. It also appears in the astrologer's queue.</p>
        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => { setStep('select'); setSubmitted(null); }}>Ask Another</button>
      </div>
    );
  }

  return (
    <div>
      {step === 'select' && (
        <>
          <div className="card"><h2>Select a Purchase</h2><p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Choose a campaign slot to submit your question for.</p></div>
          <div className="grid">
            {pendingPurchases.map(p => (
              <div className="card" key={p.id}>
                <h3>{p.campaignName}</h3>
                <div style={{ fontSize: '0.72rem', color: '#d63384', marginBottom: '0.2rem' }}>
                  Astrologer: {allAstrologers.find(a => a.id === p.astrologerId)?.displayName || 'Unknown'}
                </div>
                  <div className="row" style={{ marginTop: '0.4rem' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Price</span><br />₹{p.price}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Code</span><br />{p.purchaseCode}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Type</span><br /><span className="tag tag-purple">{p.variation}</span></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Answer</span><br />{p.answerMode}</div>
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
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Campaign: <strong>{selectedPur.campaignName}</strong> · Answer mode: <strong>{camp.answerMode}</strong>
          </p>

          <div className="row">
            <div className="form-group">
              <label>Question Type</label>
              <div style={{ padding: '0.5rem 0.75rem', background: '#f3eefe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--purple)' }}>
                {selectedPur.variation === 'individual' ? '🔮 Individual (Personalized)' : '📝 General (No personal details)'}
              </div>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select value={form.language} onChange={e => setForm({...form, language: e.target.value})}>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Tanglish">Tanglish</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Your Question (max 400 characters)</label>
            <textarea rows={5} maxLength={400} value={form.questionText} onChange={e => setForm({...form, questionText: e.target.value})} placeholder="Describe your question in detail..." />
            <div style={{ fontSize: '0.7rem', color: form.questionText.length > 350 ? '#f87171' : 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>{form.questionText.length}/400</div>
          </div>

          <div className="form-group">
            <label>Voice Note (optional)</label>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 0.5rem' }}>Record your question by voice if you prefer not to type.</p>
            {!recordedUrl && !isRecording && (
              <button className="btn btn-primary" onClick={startRecording} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🎙️</span> Start Recording
              </button>
            )}
            {isRecording && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: 'var(--pale)', borderRadius: '8px', border: '2px solid #f87171' }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%', background: '#f87171',
                  animation: 'pulse 1s infinite'
                }} />
                <span style={{ fontWeight: 600, color: '#f87171', fontSize: '0.9rem' }}>Recording...</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:{String(recordingTime % 60).padStart(2, '0')}
                </span>
                <button className="btn btn-sm" onClick={stopRecording} style={{ background: '#f87171', color: '#fff', marginLeft: 'auto' }}>⏹ Stop</button>
              </div>
            )}
            {recordedUrl && !isRecording && (
              <div style={{ padding: '0.8rem', background: 'var(--pale)', borderRadius: '8px', border: '2px solid #4ade80' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                  <span style={{ fontWeight: 600, color: '#4ade80', fontSize: '0.85rem' }}>Voice Note Recorded</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({String(Math.floor(recordingTime / 60)).padStart(2, '0')}:{String(recordingTime % 60).padStart(2, '0')})
                  </span>
                </div>
                <audio ref={audioPlayerRef} controls src={recordedUrl} style={{ width: '100%', height: 36, marginBottom: '0.5rem' }} />
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className="btn btn-sm btn-secondary" onClick={startRecording}>🔄 Re-record</button>
                  <button className="btn btn-sm btn-danger" onClick={deleteRecording}>🗑 Delete</button>
                </div>
              </div>
            )}
          </div>

          {isIndividual && (
            <div style={{ marginTop: '1rem', borderTop: '2px solid var(--purple)', paddingTop: '1rem', background: 'var(--pale)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🔮</span>
                <h3 style={{ margin: 0, color: 'var(--purple)' }}>Personal Astrology Details</h3>
                {astrologyProfiles.length > 0 && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    <button className="btn btn-sm btn-outline" type="button" onClick={() => {
                      const def = astrologyProfiles.find(p => p.isDefault) || astrologyProfiles[0];
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

              <div style={{ marginTop: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>📎</span>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--purple)' }}>Upload Documents</h4>
                </div>
                <div ref={uploadRef}
                  style={{ background: '#fff', border: '2px dashed var(--line)', borderRadius: '8px', padding: '1rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#5c3b8b'; e.currentTarget.style.background = '#f3eefe'; }}
                  onDragLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = '#fff'; }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = '#fff'; const files = Array.from(e.dataTransfer.files); if (files.length) setProfileForm({...profileForm, uploadedFiles: [...profileForm.uploadedFiles, ...files]}); }}>
                  <input type="file" id="file-upload" multiple style={{ display: 'none' }}
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      setProfileForm({...profileForm, uploadedFiles: [...profileForm.uploadedFiles, ...files]});
                      e.target.value = '';
                    }} />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.3rem' }}>📤</div>
                    <span style={{ color: 'var(--purple)', fontWeight: 600, fontSize: '0.85rem' }}>Click to upload</span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Images, PDFs (max 5MB each)</div>
                  </label>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', borderTop: '1px dashed var(--line)', paddingTop: '0.4rem' }}>
                    or drag & drop files here, or paste from clipboard
                  </div>
                </div>
                {profileForm.uploadedFiles.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {profileForm.uploadedFiles.map((f, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: '#fff', border: '1px solid var(--line)', borderRadius: '6px', marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                        <span>📎 {f.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{(f.size / 1024).toFixed(1)} KB</span>
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
