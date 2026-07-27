import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';
import ModalPortal from '../ui/ModalPortal';

export default function AstroQueue({ astrologerId }) {
  const { questions, answers, campaigns, addAnswer, updateQuestionStatus, allAstrologers } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const queued = questions.filter(q => q.astrologerId === astrologerId);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [answerMode, setAnswerMode] = useState('text');
  const [answerText, setAnswerText] = useState('');
  const [voiceUrl, setVoiceUrl] = useState('');

  const astroName = allAstrologers.find(a => a.id === astrologerId)?.displayName || 'Astrologer';

  const filtered = filter === 'all' ? queued : queued.filter(q => q.status === filter);
  const allAnswers = answers;

  const startReview = (qId) => {
    updateQuestionStatus(qId, 'under_review');
    const q = queued.find(x => x.id === qId);
    setSelected(q);
    setAnswerMode(q?.answerMode || 'text');
    setAnswerText('');
    setVoiceUrl('');
  };

  const submitAnswer = () => {
    if (answerMode === 'text' && !answerText) return toast.error('Text answer is required');
    if (answerMode === 'voice' && !voiceUrl) return toast.error('Voice file URL is required');
    addAnswer(selected.id, answerMode, answerText, voiceUrl);
    setSelected(null);
    setAnswerText('');
    setVoiceUrl('');
    toast.success('Answer submitted successfully!');
    addNotification(NOTIF_TYPES.QUESTION_ANSWERED, 'Question Answered', `Your question "${selected.title || selected.questionText.slice(0, 40)}" has been answered`, 'user', { tab: 'questions' });
  };

  const getStatusStyle = (s) => {
    if (s === 'answered') return 'tag-green';
    if (s === 'disputed') return 'tag-red';
    if (s === 'under_review') return 'tag-yellow';
    return 'tag-blue';
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{astroName}'s Question Queue ({queued.length})</h2>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {['all', 'submitted', 'under_review', 'answered', 'disputed'].map(s => (
              <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No questions in queue.
        </div>
      ) : (
        <div className="grid">
          {filtered.map(q => {
            const ans = allAnswers.find(a => a.questionId === q.id);
            return (
              <div className="card" key={q.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="tag tag-blue">{q.category}</span>
                  <span className={`tag ${getStatusStyle(q.status)}`}>{q.status}</span>
                </div>
                <h3 style={{ marginTop: '0.5rem' }}>{q.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>{q.questionText.slice(0, 100)}{q.questionText.length > 100 ? '...' : ''}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  From: <strong>{q.astrologerName}</strong> · {q.language} · {q.questionType}
                </div>
                {q.questionType === 'individual' && q.profile && (
                  <div style={{ marginTop: '0.3rem', fontSize: '0.72rem', color: 'var(--purple)', background: '#f3eefe', padding: '0.3rem 0.5rem', borderRadius: '6px' }}>
                    🔮 <strong>Individual Profile:</strong> {q.profile.rasi} · {q.profile.nakshatra} · DOB: {q.profile.dateOfBirth}
                    {q.attachments?.length > 0 && <span> · 📎 {q.attachments.length} file(s)</span>}
                  </div>
                )}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Due: {new Date(q.dueAt).toLocaleString()} · {q.campaignName}
                </div>

                {ans && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-elevated)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-on-elevated)' }}>
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
      )}

      {selected && (
        <ModalPortal onClose={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <h2>Answer Question</h2>
            <div style={{ background: 'var(--bg-elevated)', color: 'var(--text-on-elevated)', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem' }}>
              <p style={{ fontWeight: 500 }}>{selected.title}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{selected.questionText}</p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                {selected.category} · {selected.language} · {selected.questionType}
              </div>
              {selected.questionType === 'individual' && selected.profile && (
                <div style={{ marginTop: '0.6rem', padding: '0.6rem', background: '#1a1535', borderRadius: '6px', border: '1px solid #5c3b8b44' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#b388ff', marginBottom: '0.3rem' }}>🔮 Personal Astrology Details</p>
                  <div style={{ fontSize: '0.72rem', color: '#ccc', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2rem 1rem' }}>
                    <span>DOB: <strong style={{ color: '#ddd' }}>{selected.profile.dateOfBirth}</strong></span>
                    <span>TOB: <strong style={{ color: '#ddd' }}>{selected.profile.birthTime || 'N/A'}</strong></span>
                    <span>Place: <strong style={{ color: '#ddd' }}>{selected.profile.birthPlace}</strong></span>
                    <span>Raasi: <strong style={{ color: '#ddd' }}>{selected.profile.rasi}</strong></span>
                    <span>Nakshatra: <strong style={{ color: '#ddd' }}>{selected.profile.nakshatra}</strong></span>
                    <span>Pada: <strong style={{ color: '#ddd' }}>{selected.profile.pada}</strong></span>
                    <span>Lagna: <strong style={{ color: '#ddd' }}>{selected.profile.lagna || 'N/A'}</strong></span>
                  </div>
                  {selected.profile.horoscopeNotes && (
                    <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid #5c3b8b44' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#b388ff' }}>Horoscope Notes:</span>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{selected.profile.horoscopeNotes}</p>
                    </div>
                  )}
                  {selected.attachments?.length > 0 && (
                    <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid #5c3b8b44' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#b388ff' }}>Attachments:</span>
                      {selected.attachments.map((f, i) => (
                        <div key={i} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>📎 {f.name} ({(f.size / 1024).toFixed(1)} KB)</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                <label>Answer Text (max 400 characters)</label>
                <textarea rows={6} maxLength={400} value={answerText} onChange={e => setAnswerText(e.target.value)} placeholder="Type your detailed answer here..." />
                <div style={{ fontSize: '0.7rem', color: answerText.length > 350 ? '#f87171' : '#888', textAlign: 'right', marginTop: '2px' }}>{answerText.length}/400</div>
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
        </ModalPortal>
      )}
    </div>
  );
}
