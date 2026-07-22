import { useState } from 'react';
import { purchases, campaigns } from '../../data/mockData';

const pendingPurchases = purchases.filter(p => p.userId === 'u-1' && p.purchaseStatus === 'question_pending' && !p.questionSubmitted);

export default function UserAskQuestion() {
  const [step, setStep] = useState(pendingPurchases.length > 0 ? 'select' : 'no-purchases');
  const [selectedPur, setSelectedPur] = useState(null);
  const [form, setForm] = useState({ questionType: 'general', category: '', language: '', title: '', questionText: '' });
  const [submitted, setSubmitted] = useState(null);
  const [camp, setCamp] = useState(null);

  const selectPurchase = (p) => {
    setSelectedPur(p);
    const c = campaigns.find(c => c.id === p.campaignId);
    setCamp(c);
    setForm({ questionType: 'general', category: c.categories[0], language: c.languages[0], title: '', questionText: '' });
    setStep('form');
  };

  const handleSubmit = () => {
    if (!form.questionText && !form.title) return alert('Question text required');
    if (!form.category) return alert('Category required');
    if (!form.language) return alert('Language required');

    setTimeout(() => {
      setSubmitted({ ...form, purchase: selectedPur, campaign: camp, questionCode: `Q-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, submittedAt: new Date().toISOString() });
      setStep('done');
    }, 1000);
  };

  if (step === 'no-purchases') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📋</div>
        <h2>No Purchases Available</h2>
        <p style={{ color: '#888' }}>You need to purchase a question slot first. Go to the "Purchase" tab.</p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📨</div>
        <h2>Question Submitted!</h2>
        <div style={{ background: '#12102a', padding: '1rem', borderRadius: '8px', display: 'inline-block', textAlign: 'left', margin: '0.5rem 0' }}>
          <div>Code: <strong>{submitted.questionCode}</strong></div>
          <div>Campaign: <strong>{submitted.campaign.campaignName}</strong></div>
          <div>Category: {submitted.category} · Language: {submitted.language}</div>
          <div>Due: {new Date(Date.now() + (submitted.campaign.deadlineHours || 48) * 3600000).toLocaleString()}</div>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#666' }}>Track your question status in the "Tracking" tab.</p>
        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => { setStep('select'); setSubmitted(null); }}>Ask Another</button>
      </div>
    );
  }

  return (
    <div>
      {step === 'select' && (
        <>
          <div className="card"><h2>Select a Purchase</h2><p style={{ fontSize: '0.82rem', color: '#888' }}>Choose a campaign slot to submit your question for.</p></div>
          <div className="grid">
            {pendingPurchases.map(p => (
              <div className="card" key={p.id}>
                <h3>{p.campaignName}</h3>
                <div className="row" style={{ marginTop: '0.4rem' }}>
                  <div><span style={{ color: '#888' }}>Price</span><br />₹{p.price}</div>
                  <div><span style={{ color: '#888' }}>Code</span><br />{p.purchaseCode}</div>
                  <div><span style={{ color: '#888' }}>Answer</span><br />{p.answerMode}</div>
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
          <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1rem' }}>
            Campaign: <strong>{selectedPur.campaignName}</strong> · Answer mode: <strong>{camp.answerMode}</strong>
          </p>

          <div className="row">
            <div className="form-group">
              <label>Question Type</label>
              <select value={form.questionType} onChange={e => setForm({...form, questionType: e.target.value})}>
                <option value="general">General</option>
                <option value="individual">Individual</option>
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

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setStep('select')}>Back</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit Question</button>
          </div>
        </div>
      )}
    </div>
  );
}
