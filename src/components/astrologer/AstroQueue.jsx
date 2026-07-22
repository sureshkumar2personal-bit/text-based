import { useState } from 'react';
import { questions, answers } from '../../data/mockData';

const STATUS_MAP = { submitted: 'tag-blue', under_review: 'tag-yellow', answered: 'tag-green', disputed: 'tag-red' };

export default function AstroQueue() {
  const [queued, setQueued] = useState(questions.filter(q => q.astrologerId === 'a-1'));
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [answerMode, setAnswerMode] = useState('text');
  const [answerText, setAnswerText] = useState('');
  const [voiceUrl, setVoiceUrl] = useState('');

  const filtered = filter === 'all' ? queued : queued.filter(q => q.status === filter);

  const startReview = (qId) => {
    setQueued(queued.map(q => q.id === qId ? { ...q, status: 'under_review' } : q));
    setSelected(queued.find(q => q.id === qId));
    if (!queued.find(q => q.id === qId).campaignName) return;
    const q = queued.find(x => x.id === qId);
    setAnswerMode(q.answerMode);
    setAnswerText('');
    setVoiceUrl('');
  };

  const submitAnswer = () => {
    if (answerMode === 'text' && !answerText) return alert('Text answer required');
    if (answerMode === 'voice' && !voiceUrl) return alert('Voice file URL required');
    setQueued(queued.map(q => q.id === selected.id ? { ...q, status: 'answered' } : q));
    setSelected(null);
    setAnswerText('');
    setVoiceUrl('');
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Question Queue</h2>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {['all', 'submitted', 'under_review', 'answered', 'disputed'].map(s => (
              <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid">
        {filtered.map(q => {
          const ans = answers.find(a => a.questionId === q.id);
          return (
            <div className="card" key={q.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="tag tag-blue">{q.category}</span>
                <span className={`tag ${STATUS_MAP[q.status]}`}>{q.status}</span>
              </div>
              <h3 style={{ marginTop: '0.5rem' }}>{q.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '0.3rem 0' }}>{q.questionText.slice(0, 100)}{q.questionText.length > 100 ? '...' : ''}</p>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>
                From: <strong>{q.astrologerName}</strong> · {q.language} · {q.questionType}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.2rem' }}>
                Due: {new Date(q.dueAt).toLocaleString()} · {q.campaignName}
              </div>

              {ans && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#12102a', borderRadius: '6px', fontSize: '0.78rem', color: '#bbb' }}>
                  <span className="tag tag-green" style={{ marginBottom: '3px' }}>Answered ({ans.answerMode})</span>
                  <p style={{ marginTop: '3px' }}>{ans.answerText?.slice(0, 80)}...</p>
                </div>
              )}

              {q.status === 'submitted' && (
                <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem', width: '100%' }} onClick={() => startReview(q.id)}>
                  Start Review
                </button>
              )}
              {q.status === 'under_review' && (
                <button className="btn btn-success btn-sm" style={{ marginTop: '0.5rem', width: '100%' }} onClick={() => { setSelected(q); setAnswerMode(q.answerMode); setAnswerText(''); setVoiceUrl(''); }}>
                  Submit Answer
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <h2>Answer Question</h2>
            <div style={{ background: '#12102a', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem' }}>
              <p style={{ fontWeight: 500 }}>{selected.title}</p>
              <p style={{ fontSize: '0.82rem', color: '#aaa', marginTop: '0.3rem' }}>{selected.questionText}</p>
              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.3rem' }}>
                {selected.category} · {selected.language} · {selected.questionType}
              </div>
            </div>
            <div className="form-group">
              <label>Answer Mode</label>
              <select value={answerMode} onChange={e => setAnswerMode(e.target.value)}>
                <option value="text">Text</option>
                <option value="voice">Voice</option>
              </select>
            </div>
            {answerMode === 'text' && (
              <div className="form-group">
                <label>Answer Text</label>
                <textarea rows={6} value={answerText} onChange={e => setAnswerText(e.target.value)} placeholder="Type your detailed answer here..." />
              </div>
            )}
            {answerMode === 'voice' && (
              <div className="form-group">
                <label>Voice File URL</label>
                <input value={voiceUrl} onChange={e => setVoiceUrl(e.target.value)} placeholder="https://example.com/audio/answer.mp3" />
                <div className="helper">Upload a voice recording and paste the URL</div>
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-success" onClick={submitAnswer}>Submit Answer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
