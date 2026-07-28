import { useState } from 'react';
import { useData } from '../../data/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications, NOTIF_TYPES } from '../../contexts/NotificationContext';

export default function UserRatings() {
  const { questions, answers, ratings, addRating } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const answeredQ = questions.filter(q => q.userId === 'u-1' && q.status === 'answered');
  const myRatings = ratings.filter(r => r.userId === 'u-1');

  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [hoverScore, setHoverScore] = useState(0);

  const alreadyRated = (qId) => myRatings.some(r => r.questionId === qId);

  const submitRating = () => {
    if (!selected) return;
    addRating({ questionId: selected.id, score, feedback, questionTitle: selected.title, astrologerName: selected.astrologerName });
    toast.success(`Rating submitted! You gave ${score} ⭐`);
    addNotification(NOTIF_TYPES.RATING_RECEIVED, 'Rating Received', `You received ${score}⭐ from user for "${selected.title}"`, 'astrologer', { tab: 'analytics' });
    setSelected(null);
    setScore(5);
    setFeedback('');
  };

  return (
    <div>
      <div className="card"><h2>Rate Answers</h2><p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Share your feedback on answered questions.</p></div>

      {!selected ? (
        <div className="grid">
          {answeredQ.map(q => {
            const ans = answers.find(a => a.questionId === q.id);
            const rated = alreadyRated(q.id);
            return (
              <div className="card" key={q.id}>
                <h3>{q.title}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>{q.questionText.slice(0, 60)}...</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Astrologer: {q.astrologerName} · {q.category}
                </div>
                {rated ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="tag tag-green">✓ Rated</span>
                    <span style={{ marginLeft: '0.3rem', color: 'var(--gold)' }}>
                      {myRatings.find(r => r.questionId === q.id)?.score} ⭐
                    </span>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '0.5rem' }}
                    onClick={() => setSelected(q)}>
                    Rate This Answer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <h2>Rate Answer</h2>
          <div style={{ background: 'var(--bg-glass)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <p style={{ fontWeight: 500 }}>{selected.title}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selected.questionText}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Answer: {answers.find(a => a.questionId === selected.id)?.answerText?.slice(0, 120)}...
            </p>
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div style={{ display: 'flex', gap: '0.3rem', fontSize: '1.8rem' }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ cursor: 'pointer', transition: '0.15s', filter: s <= (hoverScore || score) ? 'none' : 'grayscale(1) opacity(0.4)' }}
                  onClick={() => setScore(s)} onMouseEnter={() => setHoverScore(s)} onMouseLeave={() => setHoverScore(0)}>
                  ⭐
                </span>
              ))}
              <span style={{ fontSize: '2rem', marginLeft: '0.3rem', alignSelf: 'center' }}>{score}/5</span>
            </div>
          </div>

          <div className="form-group">
            <label>Feedback (optional)</label>
            <textarea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="What did you like or what could be improved?" />
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setSelected(null)}>Back</button>
            <button className="btn btn-primary" onClick={submitRating}>Submit Rating</button>
          </div>
        </div>
      )}

      {myRatings.length > 0 && !selected && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>My Ratings History</h3>
          <div style={{ marginTop: '0.5rem' }}>
            {myRatings.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--line)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.82rem' }}>{r.questionTitle}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.astrologerName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{r.score} ⭐</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
