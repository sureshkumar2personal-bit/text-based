import { useState } from 'react';
import { purchases, questions, answers } from '../../data/mockData';

const PURCHASE_STATUS_MAP = { question_pending: 'tag-yellow', question_submitted: 'tag-blue', answered: 'tag-green', disputed: 'tag-red', refunded: 'tag-gray' };
const QUESTION_STATUS_MAP = { submitted: 'tag-blue', under_review: 'tag-yellow', answered: 'tag-green', disputed: 'tag-red' };

export default function UserQuestions() {
  const myPurchases = purchases.filter(p => p.userId === 'u-1');
  const myQuestions = questions.filter(q => q.userId === 'u-1');
  const [tab, setTab] = useState('purchases');

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn btn-sm ${tab === 'purchases' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('purchases')}>My Purchases ({myPurchases.length})</button>
          <button className={`btn btn-sm ${tab === 'questions' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('questions')}>My Questions ({myQuestions.length})</button>
        </div>
      </div>

      {tab === 'purchases' && (
        <div className="grid">
          {myPurchases.map(p => (
            <div className="card" key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{p.campaignName}</h3>
                <span className={`tag ${PURCHASE_STATUS_MAP[p.purchaseStatus] || 'tag-gray'}`}>{p.purchaseStatus}</span>
              </div>
              <div className="row" style={{ marginTop: '0.4rem' }}>
                <div><span style={{ color: '#888' }}>Price</span><br />₹{p.price}</div>
                <div><span style={{ color: '#888' }}>Code</span><br />{p.purchaseCode}</div>
                <div><span style={{ color: '#888' }}>Expires</span><br /><span style={{ fontSize: '0.72rem' }}>{new Date(p.expiresAt).toLocaleDateString()}</span></div>
              </div>
              <div style={{ marginTop: '0.3rem', fontSize: '0.72rem', color: '#666' }}>
                {p.questionSubmitted ? 'Question submitted ✓' : 'No question yet — use "Ask Question"'}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'questions' && (
        <div className="grid">
          {myQuestions.map(q => {
            const ans = answers.find(a => a.questionId === q.id);
            return (
              <div className="card" key={q.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{q.title}</h3>
                  <span className={`tag ${QUESTION_STATUS_MAP[q.status] || 'tag-gray'}`}>{q.status}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '0.3rem 0' }}>{q.questionText.slice(0, 80)}{q.questionText.length > 80 ? '...' : ''}</p>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>
                  {q.category} · {q.language} · {q.questionType}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.2rem' }}>
                  Astrologer: {q.astrologerName} · {q.campaignName}
                  <br />Submitted: {new Date(q.submittedAt).toLocaleDateString()} · Due: {new Date(q.dueAt).toLocaleDateString()}
                </div>
                {ans && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#12102a', borderRadius: '6px', fontSize: '0.78rem', color: '#bbb' }}>
                    <span className="tag tag-green">Answer ({ans.answerMode})</span>
                    <p style={{ marginTop: '4px' }}>{ans.answerText?.slice(0, 100)}{ans.answerText?.length > 100 ? '...' : ''}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
