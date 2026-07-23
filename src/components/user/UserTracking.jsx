import { useState } from 'react';
import { useData } from '../../data/DataContext';

const TIMELINE_STAGES = ['Purchased', 'Question Submitted', 'Received by Astrologer', 'Under Review', 'Answered'];
const STATUS_ORDER = ['question_pending', 'submitted', 'received_by_astrologer', 'under_review', 'answered', 'completed'];

function getTimeline(status) {
  const idx = STATUS_ORDER.indexOf(status);
  return TIMELINE_STAGES.map((label, i) => ({ label, completed: i <= Math.min(idx, STATUS_ORDER.length - 1) }));
}

export default function UserTracking() {
  const { questions, answers } = useData();
  const myQuestions = questions.filter(q => q.userId === 'u-1');
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="card"><h2>Question Tracking</h2></div>

      <div className="grid">
        {myQuestions.map(q => (
          <div className="card" key={q.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{q.title || q.questionCode}</h3>
              <span className={`tag ${q.status === 'answered' || q.status === 'completed' ? 'tag-green' : q.status === 'disputed' ? 'tag-red' : 'tag-yellow'}`}>{q.status}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#888', margin: '0.3rem 0' }}>{q.questionText.slice(0, 60)}...</p>
            <div style={{ fontSize: '0.72rem', color: '#666' }}>
              {q.category} · {q.language} · Astrologer: {q.astrologerName}
            </div>

            <div className="status-bar">
              {getTimeline(q.status).map((s, i, arr) => (
                <span key={s.label}>
                  <span className={`stage ${s.completed && i === arr.length - 1 ? 'completed' : s.completed && i < arr.length - 1 ? 'completed' : ''} ${q.status === 'under_review' && s.label === 'Under Review' ? 'active' : ''}`}>
                    <span className="stage-dot" /> {s.label}
                  </span>
                  {i < arr.length - 1 && <span className="stage-line" />}
                </span>
              ))}
            </div>

            <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.2rem' }}>
              Submitted: {new Date(q.submittedAt).toLocaleString()} · Due: {new Date(q.dueAt).toLocaleString()}
            </div>

            <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.3rem' }} onClick={() => setSelected(q)}>View Details</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Question Details</h2>
            <div className="card" style={{ padding: '1rem', marginBottom: '0.8rem' }}>
              <div className="row" style={{ marginBottom: '0.5rem' }}>
                <div><span style={{ color: '#888' }}>Code</span><br />{selected.questionCode}</div>
                <div><span style={{ color: '#888' }}>Campaign</span><br />{selected.campaignName}</div>
                <div><span style={{ color: '#888' }}>Status</span><br /><span className={`tag ${selected.status === 'answered' ? 'tag-green' : 'tag-yellow'}`}>{selected.status}</span></div>
              </div>
              <div className="row">
                <div><span style={{ color: '#888' }}>Category</span><br />{selected.category}</div>
                <div><span style={{ color: '#888' }}>Language</span><br />{selected.language}</div>
                <div><span style={{ color: '#888' }}>Type</span><br />{selected.questionType}</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: '0.8rem' }}>
              <h3 style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>Question</h3>
              <p style={{ fontSize: '0.85rem' }}>{selected.questionText}</p>
            </div>

            <div className="status-bar">
              {getTimeline(selected.status).map((s, i, arr) => (
                <span key={s.label}>
                  <span className={`stage ${s.completed && i === arr.length - 1 ? 'completed' : s.completed && i < arr.length - 1 ? 'completed' : ''} ${selected.status === 'under_review' && s.label === 'Under Review' ? 'active' : ''}`}>
                    <span className="stage-dot" /> {s.label}
                  </span>
                  {i < arr.length - 1 && <span className="stage-line" />}
                </span>
              ))}
            </div>

            {(() => {
              const ans = answers.find(a => a.questionId === selected.id);
              return ans ? (
                <div className="card" style={{ padding: '1rem', marginTop: '0.5rem', borderLeft: '3px solid var(--purple)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--purple)' }}>Answer ({ans.answerMode})</span>
                    <span style={{ fontSize: '0.72rem', color: '#888' }}>{new Date(ans.submittedAt).toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem' }}>{ans.answerText}</p>
                </div>
              ) : <p style={{ color: '#666', fontStyle: 'italic', marginTop: '0.5rem' }}>Answer pending — due by {new Date(selected.dueAt).toLocaleString()}</p>;
            })()}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
