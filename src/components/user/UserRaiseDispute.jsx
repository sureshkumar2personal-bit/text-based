import { useState } from 'react';
import { questions, answers } from '../../data/mockData';

const DISPUTE_REASONS = [
  { value: 'incomplete_answer', label: 'Incomplete Answer' },
  { value: 'incorrect_information', label: 'Incorrect Information' },
  { value: 'off_topic', label: 'Off Topic / Irrelevant' },
  { value: 'too_brief', label: 'Too Brief / Lacks Detail' },
  { value: 'rude_inappropriate', label: 'Rude or Inappropriate' },
  { value: 'duplicate_answer', label: 'Duplicate / Generic Answer' },
  { value: 'wrong_predictions', label: 'Wrong Predictions' },
  { value: 'other', label: 'Other' }
];

export default function UserRaiseDispute() {
  const answeredQuestions = questions.filter(q => q.userId === 'u-1' && q.status === 'answered');
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [expectation, setExpectation] = useState('');
  const [raised, setRaised] = useState(null);

  const handleRaise = () => {
    if (!reason) return alert('Please select a reason');
    if (!description.trim()) return alert('Please describe your issue');

    setTimeout(() => {
      setRaised({ question: selected, reason, description, expectation, createdAt: new Date().toISOString(), disputeId: `disp-${Date.now()}` });
    }, 800);
  };

  if (raised) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚖️</div>
        <h2>Dispute Raised Successfully!</h2>
        <div style={{ background: '#12102a', padding: '1rem', borderRadius: '8px', display: 'inline-block', textAlign: 'left', margin: '0.5rem 0' }}>
          <div>Dispute ID: <strong>{raised.disputeId}</strong></div>
          <div>Question: <strong>{raised.question.title}</strong></div>
          <div>Reason: {raised.reason.replace('_', ' ')}</div>
          <div>Status: <span className="tag tag-red">open</span></div>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#666' }}>Track your dispute status in the "Dispute Tracking" tab.</p>
        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => { setRaised(null); setSelected(null); setReason(''); setDescription(''); }}>Raise Another</button>
      </div>
    );
  }

  if (answeredQuestions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
        <h2>No Answered Questions</h2>
        <p style={{ color: '#888' }}>You can only raise disputes on answered questions.</p>
      </div>
    );
  }

  return (
    <div>
      {!selected ? (
        <>
          <div className="card"><h2>Raise a Dispute</h2><p style={{ fontSize: '0.82rem', color: '#888' }}>Select an answered question to dispute.</p></div>
          <div className="grid">
            {answeredQuestions.map(q => {
              const ans = answers.find(a => a.questionId === q.id);
              return (
                <div className="card" key={q.id}>
                  <h3>{q.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: '#888', margin: '0.2rem 0' }}>{q.questionText.slice(0, 60)}...</p>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>Astrologer: {q.astrologerName}</div>
                  {ans && <div style={{ fontSize: '0.72rem', color: '#555' }}>Answered: {new Date(ans.submittedAt).toLocaleDateString()}</div>}
                  <button className="btn btn-danger btn-sm" style={{ width: '100%', marginTop: '0.4rem' }} onClick={() => setSelected(q)}>Dispute This Answer</button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="card">
          <h2>Raise Dispute</h2>
          <div style={{ background: '#12102a', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem' }}>
            <p style={{ fontWeight: 500 }}>{selected.title}</p>
            <p style={{ fontSize: '0.8rem', color: '#aaa' }}>{selected.questionText}</p>
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>
              Answer: {answers.find(a => a.questionId === selected.id)?.answerText?.slice(0, 100)}...
            </p>
          </div>

          <div className="form-group">
            <label>Reason for Dispute</label>
            <select value={reason} onChange={e => setReason(e.target.value)}>
              <option value="">Select a reason...</option>
              {DISPUTE_REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Describe your issue</label>
            <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Explain why you're disputing this answer..." />
          </div>

          <div className="form-group">
            <label>Expected Resolution (optional)</label>
            <select value={expectation} onChange={e => setExpectation(e.target.value)}>
              <option value="">Select resolution...</option>
              <option value="re_answer">Re-answer (new detailed answer)</option>
              <option value="refund">Full Refund</option>
              <option value="partial_refund">Partial Refund</option>
              <option value="no_action">No action needed (just feedback)</option>
            </select>
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setSelected(null)}>Back</button>
            <button className="btn btn-danger" onClick={handleRaise} disabled={!reason || !description.trim()}>Raise Dispute</button>
          </div>
        </div>
      )}
    </div>
  );
}
