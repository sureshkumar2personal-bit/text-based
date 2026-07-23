import { useState, useRef } from 'react';
import { actors } from './data/mockData';
import { DataProvider } from './data/DataContext';
import ThemeToggle from './components/ui/ThemeToggle';
import NotificationBell from './components/ui/NotificationBell';
import Confetti from './components/ui/Confetti';
import Avatar from './components/ui/Avatar';

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

import UserDashboard from './components/user/UserDashboard';
import UserRatings from './components/user/UserRatings';
import AstroProfile from './components/astrologer/AstroProfile';
import AstroAnalytics from './components/astrologer/AstroAnalytics';
import PlatformDashboard from './components/platform/PlatformDashboard';
import TransactionLogs from './components/platform/TransactionLogs';


const TABS = {
  astrologer: [
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'queue', label: 'Question Queue' },
    { id: 'sales', label: 'Sales' },
    { id: 'disputes', label: 'Disputes' },
    { id: 'profile', label: 'My Profile' },
    { id: 'analytics', label: 'Analytics' }
  ],
  user: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'questions', label: 'My Questions' },
    { id: 'purchase', label: 'Purchase' },
    { id: 'ask', label: 'Ask Question' },
    { id: 'tracking', label: 'Tracking' },
    { id: 'raise-dispute', label: 'Raise Dispute' },
    { id: 'dispute-tracking', label: 'Dispute Tracking' },
    { id: 'astrology-profiles', label: 'Astrology Profiles' },
    { id: 'ratings', label: 'Ratings & Reviews' }
  ],
  platform: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'disputes', label: 'Disputes' },
    { id: 'transactions', label: 'Transactions' }
  ]
};

export default function App() {
  const [actor, setActor] = useState('user');
  const [tab, setTab] = useState(TABS[actor][0].id);
  const [confetti, setConfetti] = useState(false);
  const confettiTimer = useRef(null);

  const switchActor = (a) => { setActor(a); setTab(TABS[a][0].id); };

  const triggerConfetti = () => {
    setConfetti(true);
    if (confettiTimer.current) clearTimeout(confettiTimer.current);
    confettiTimer.current = setTimeout(() => setConfetti(false), 3500);
  };

  const profile = actors[actor];

  return (
    <DataProvider>
    <div className="app">
      <Confetti active={confetti} />
      <header className="app-header glass-card" style={{ borderBottom: '1px solid var(--glass-border)', position: 'sticky' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Avatar name="AE" size="sm" />
            <div>
              <h1 className="gradient-text">🔮 Text-Based Questions</h1>
              <p className="subtitle">AstroEvalution — Mock UI (no backend)</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="stat-pill animate-float">
              {profile.fullName || profile.displayName}
            </span>
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>
        <div className="actor-bar">
          {Object.entries(actors).map(([key, val]) => (
            <button key={key} className={`actor-btn ${actor === key ? 'active' : ''}`}
              onClick={() => switchActor(key)}>
              {key === 'user' ? '👤' : key === 'astrologer' ? '⭐' : '🏛️'}
              <Avatar name={val.fullName || val.displayName} size="sm" style={{ width: 20, height: 20, fontSize: '0.55rem' }} />
              {val.fullName || val.displayName}
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

      <main className="main animate-in">
        {actor === 'astrologer' && (
          <>
            {tab === 'campaigns' && <AstroCampaigns />}
            {tab === 'queue' && <AstroQueue />}
            {tab === 'sales' && <AstroSales />}
            {tab === 'disputes' && <AstroDisputes />}
            {tab === 'profile' && <AstroProfile />}
            {tab === 'analytics' && <AstroAnalytics />}
          </>
        )}
        {actor === 'user' && (
          <>
            {tab === 'dashboard' && <UserDashboard />}
            {tab === 'questions' && <UserQuestions />}
            {tab === 'purchase' && <UserPurchase onPurchaseSuccess={triggerConfetti} />}
            {tab === 'ask' && <UserAskQuestion onAskSuccess={triggerConfetti} />}
            {tab === 'tracking' && <UserTracking />}
            {tab === 'raise-dispute' && <UserRaiseDispute />}
            {tab === 'dispute-tracking' && <UserDisputeTracking />}
            {tab === 'astrology-profiles' && <UserAstrologyProfiles />}
            {tab === 'ratings' && <UserRatings />}
          </>
        )}
        {actor === 'platform' && (
          <>
            {tab === 'dashboard' && <PlatformDashboard />}
            {tab === 'campaigns' && <PlatformCampaigns />}
            {tab === 'disputes' && <PlatformDisputes />}
            {tab === 'transactions' && <TransactionLogs />}
          </>
        )}
      </main>
    </div>
    </DataProvider>
  );
}
