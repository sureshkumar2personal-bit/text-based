import { useState } from 'react';
import { useData } from '../../data/DataContext';
import ModalPortal from '../ui/ModalPortal';

const TIMELINE_STAGES = ['Purchased', 'Question Submitted', 'Received by Astrologer', 'Under Review', 'Answered'];
const STATUS_ORDER = ['question_pending', 'submitted', 'received_by_astrologer', 'under_review', 'answered', 'completed'];

function getTimeline(status) {
  const idx = STATUS_ORDER.indexOf(status);
  return TIMELINE_STAGES.map((label, i) => ({ label, completed: i <= Math.min(idx, STATUS_ORDER.length - 1) }));
}

export default function UserTracking({ filter, onNavigate }) {
  const { questions, answers, allAstrologers, disputes } = useData();
  const myQuestions = questions.filter(q => q.userId === 'u-1');
  const filtered = filter === 'pending'
    ? myQuestions.filter(q => ['submitted', 'under_review', 'received_by_astrologer'].includes(q.status))
    : myQuestions;
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="card"><h2>Question Tracking</h2>{filter && <span style={{ fontSize: '0.72rem', color: '#a88bd0', marginLeft: '0.5rem', fontStyle: 'italic' }}>({filter === 'pending' ? 'Pending only' : 'All questions'})</span>}</div>

      <div className="grid">
        {filtered.length === 0
          ? <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              {filter === 'pending' ? 'No pending questions to track.' : 'No questions yet.'}
            </div>
          : filtered.map(q => (
            <div className="card" key={q.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{q.title || q.questionCode}</h3>
                <span className={`tag ${q.status === 'answered' || q.status === 'completed' ? 'tag-green' : q.status === 'disputed' ? 'tag-red' : 'tag-yellow'}`}>{q.status}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>{q.questionText.slice(0, 60)}...</p>
              <div style={{ fontSize: '0.72rem', color: '#d63384' }}>
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
        <ModalPortal onClose={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Question Details</h2>
            <div className="card" style={{ padding: '1rem', marginBottom: '0.8rem' }}>
              <div className="row" style={{ marginBottom: '0.5rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Code</span><br />{selected.questionCode}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Campaign</span><br />{selected.campaignName}</div>
                <div><span style={{ color: '#d63384' }}>Astrologer</span><br />{selected.astrologerName || allAstrologers.find(a => a.id === selected.astrologerId)?.displayName || 'Unknown'}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Status</span><br /><span className={`tag ${selected.status === 'answered' ? 'tag-green' : selected.status === 'disputed' ? 'tag-red' : 'tag-yellow'}`}>{selected.status}</span></div>
              </div>
              <div className="row">
                <div><span style={{ color: 'var(--text-muted)' }}>Category</span><br />{selected.category}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Language</span><br />{selected.language}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Type</span><br />{selected.questionType}</div>
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
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(ans.submittedAt).toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem' }}>{ans.answerText}</p>
                </div>
              ) : <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem' }}>Answer pending — due by {new Date(selected.dueAt).toLocaleString()}</p>;
            })()}

            {selected.status === 'disputed' && (() => {
              const dispute = disputes.find(d => d.questionId === selected.id);
              if (!dispute) return null;
              return (
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '0.8rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                  <p style={{ fontWeight: 500, marginBottom: '0.3rem', color: '#ef4444' }}>⚠️ Dispute ({dispute.reason}):</p>
                  <p style={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>{dispute.description}</p>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    Disputed: {new Date(dispute.createdAt).toLocaleString()}
                  </div>
                  {dispute.astrologerResponse && (
                    <div style={{ marginTop: '0.4rem', padding: '0.4rem', background: 'rgba(251, 191, 36, 0.08)', borderRadius: '4px' }}>
                      <p style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 500 }}>Astrologer's Response:</p>
                      <p style={{ fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}>{dispute.astrologerResponse}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Responded: {new Date(dispute.astrologerRespondedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="modal-actions">
              {selected.status === 'answered' && (
                <button className="btn btn-danger" onClick={() => { onNavigate?.('raise-dispute', null, selected.id); setSelected(null); }}>
                  ⚖️ Raise Dispute
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
