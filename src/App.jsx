import { useState } from 'react';
import { actors } from './data/mockData';

import AstroCampaigns from './components/astrologer/AstroCampaigns';
import AstroQueue from './components/astrologer/AstroQueue';
import AstroDisputes from './components/astrologer/AstroDisputes';
import AstroSales from './components/astrologer/AstroSales';

import UserQuestions from './components/user/UserQuestions';
import UserPurchase from './components/user/UserPurchase';
import UserAskQuestion from './components/user/UserAskQuestion';
import UserTracking from './components/user/UserTracking';
import UserRaiseDispute from './components/user/UserRaiseDispute';
import UserDisputeTracking from './components/user/UserDisputeTracking';
import UserAstrologyProfiles from './components/user/UserAstrologyProfiles';

import PlatformCampaigns from './components/platform/PlatformCampaigns';
import PlatformDisputes from './components/platform/PlatformDisputes';

const TABS = {
  astrologer: [
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'queue', label: 'Question Queue' },
    { id: 'sales', label: 'Sales' },
    { id: 'disputes', label: 'Disputes' }
  ],
  user: [
    { id: 'questions', label: 'My Questions' },
    { id: 'purchase', label: 'Purchase' },
    { id: 'ask', label: 'Ask Question' },
    { id: 'tracking', label: 'Tracking' },
    { id: 'raise-dispute', label: 'Raise Dispute' },
    { id: 'dispute-tracking', label: 'Dispute Tracking' },
    { id: 'astrology-profiles', label: 'Astrology Profiles' }
  ],
  platform: [
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'disputes', label: 'Disputes' }
  ]
};

export default function App() {
  const [actor, setActor] = useState('user');
  const [tab, setTab] = useState(TABS[actor][0].id);

  const switchActor = (a) => { setActor(a); setTab(TABS[a][0].id); };

  const profile = actors[actor];
  return (
    <div className="app">
      <header className="app-header">
        <h1>🔮 Text-Based Questions</h1>
        <p className="subtitle">AstroEvalution — Mock UI (no backend)</p>
        <div className="actor-bar">
          {Object.entries(actors).map(([key, val]) => (
            <button key={key} className={`actor-btn ${actor === key ? 'active' : ''}`}
              onClick={() => switchActor(key)}>
              {key === 'user' ? '👤' : key === 'astrologer' ? '⭐' : '🏛️'} {val.fullName || val.displayName}
              <span className="badge">{key}</span>
            </button>
          ))}
        </div>
        <nav className="tab-bar">
          {TABS[actor].map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </nav>
      </header>

      <main className="main">
        {actor === 'astrologer' && (
          <>
            {tab === 'campaigns' && <AstroCampaigns />}
            {tab === 'queue' && <AstroQueue />}
            {tab === 'sales' && <AstroSales />}
            {tab === 'disputes' && <AstroDisputes />}
          </>
        )}
        {actor === 'user' && (
          <>
            {tab === 'questions' && <UserQuestions />}
            {tab === 'purchase' && <UserPurchase />}
            {tab === 'ask' && <UserAskQuestion />}
            {tab === 'tracking' && <UserTracking />}
            {tab === 'raise-dispute' && <UserRaiseDispute />}
            {tab === 'dispute-tracking' && <UserDisputeTracking />}
            {tab === 'astrology-profiles' && <UserAstrologyProfiles />}
          </>
        )}
        {actor === 'platform' && (
          <>
            {tab === 'campaigns' && <PlatformCampaigns />}
            {tab === 'disputes' && <PlatformDisputes />}
          </>
        )}
      </main>
    </div>
  );
}
