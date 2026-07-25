import { useState } from 'react';
import { useData } from '../../data/DataContext';

export default function UserQuestions({ filter, onNavigate }) {
  const { purchases, questions, answers } = useData();
  const myPurchases = purchases.filter(p => p.userId === 'u-1');
  const myQuestions = questions.filter(q => q.userId === 'u-1');
  const [tab, setTab] = useState(filter === 'answered' ? 'questions' : 'purchases');

  const filteredPurchases = filter === 'unused'
    ? myPurchases.filter(p => p.purchaseStatus === 'question_pending' && !p.questionSubmitted)
    : myPurchases;

  const filteredQuestions = filter === 'answered'
    ? myQuestions.filter(q => q.status === 'answered')
    : filter === 'pending'
      ? myQuestions.filter(q => ['submitted', 'under_review', 'received_by_astrologer'].includes(q.status))
      : myQuestions;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn btn-sm ${tab === 'purchases' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('purchases')}>My Purchases ({myPurchases.length})</button>
          <button className={`btn btn-sm ${tab === 'questions' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('questions')}>My Questions ({myQuestions.length})</button>
        </div>
        {filter && (
          <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#a88bd0', fontStyle: 'italic' }}>
            Showing: {filter === 'unused' ? 'Unused purchase slots' : filter === 'answered' ? 'Answered questions' : filter === 'pending' ? 'Pending questions' : 'All'}
          </div>
        )}
      </div>

      {tab === 'purchases' && (
        <div className="grid">
          {filteredPurchases.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              {filter === 'unused' ? 'All purchases have been used. Great job!' : 'No purchases yet.'}
            </div>
          ) : (
            filteredPurchases.map(p => (
              <div className="card" key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{p.campaignName}</h3>
                  <span className={`tag ${p.purchaseStatus === 'question_pending' ? 'tag-yellow' : p.purchaseStatus === 'question_submitted' ? 'tag-blue' : p.purchaseStatus === 'answered' ? 'tag-green' : 'tag-gray'}`}>{p.purchaseStatus}</span>
                </div>
                <div className="row" style={{ marginTop: '0.4rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Price</span><br />₹{p.price}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Type</span><br /><span className="tag tag-purple" style={{ fontSize: '0.65rem' }}>{p.variation}</span></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Code</span><br />{p.purchaseCode}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Expires</span><br /><span style={{ fontSize: '0.72rem' }}>{new Date(p.expiresAt).toLocaleDateString()}</span></div>
                </div>
                <div style={{ marginTop: '0.3rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {p.questionSubmitted ? 'Question submitted ✓' : 'No question yet — use "Ask Question"'}
                </div>
                {!p.questionSubmitted && (
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => onNavigate?.('ask', null, p.id)}>
                    Use This Slot
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'questions' && (
        <div className="grid">
          {filteredQuestions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              {filter === 'answered' ? 'No answered questions yet.' : filter === 'pending' ? 'No pending questions.' : 'No questions yet.'}
            </div>
          ) : (
            filteredQuestions.map(q => {
              const ans = answers.find(a => a.questionId === q.id);
              return (
                <div className="card" key={q.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{q.title}</h3>
                    <span className={`tag ${q.status === 'answered' ? 'tag-green' : q.status === 'disputed' ? 'tag-red' : q.status === 'submitted' ? 'tag-blue' : 'tag-yellow'}`}>{q.status}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>{q.questionText.slice(0, 80)}{q.questionText.length > 80 ? '...' : ''}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {q.category} · {q.language} · {q.questionType}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Astrologer: {q.astrologerName} · {q.campaignName}
                    <br />Submitted: {new Date(q.submittedAt).toLocaleDateString()} · Due: {new Date(q.dueAt).toLocaleDateString()}
                  </div>
                  {ans && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-elevated)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-on-elevated)' }}>
                      <span className="tag tag-green">Answer ({ans.answerMode})</span>
                      <p style={{ marginTop: '4px' }}>{ans.answerText?.slice(0, 100)}{ans.answerText?.length > 100 ? '...' : ''}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}