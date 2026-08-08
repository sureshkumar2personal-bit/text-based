import { useState, useRef } from 'react';
import { actors } from './data/mockData';
import { DataProvider, useData } from './data/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ThemeToggle from './components/ui/ThemeToggle';
import NotificationBell from './components/ui/NotificationBell';
import Confetti from './components/ui/Confetti';
import Avatar from './components/ui/Avatar';

import AstroCampaigns from './components/astrologer/AstroCampaigns';
import AstroQueue from './components/astrologer/AstroQueue';
import AstroDisputes from './components/astrologer/AstroDisputes';
import AstroSales from './components/astrologer/AstroSales';

import UserQuestions from './components/user/UserQuestions';
import UserAskQuestion from './components/user/UserAskQuestion';
import UserTracking from './components/user/UserTracking';
import UserRaiseDispute from './components/user/UserRaiseDispute';
import UserDisputeTracking from './components/user/UserDisputeTracking';
import UserAstrologyProfiles from './components/user/UserAstrologyProfiles';

import PlatformCampaigns from './components/platform/PlatformCampaigns';
import PlatformDisputes from './components/platform/PlatformDisputes';

import UserDashboard from './components/user/UserDashboard';
import UserRatings from './components/user/UserRatings';
import UserEmergency from './components/user/UserEmergency';
import AstroProfile from './components/astrologer/AstroProfile';
import AstroEmergency from './components/astrologer/AstroEmergency';
import AstroAnalytics from './components/astrologer/AstroAnalytics';
import PlatformDashboard from './components/platform/PlatformDashboard';
import TransactionLogs from './components/platform/TransactionLogs';
import UserWallet from './components/user/UserWallet';
import AstroWallet from './components/astrologer/AstroWallet';

import MainNavigation from './components/navigation/MainNavigation';
import SectionNavigation from './components/navigation/SectionNavigation';
import MobileNavigation from './components/navigation/MobileNavigation';

const NAV = {
  astrologer: [
    { id: 'overview', label: 'Overview', icon: '📊', children: [{ id: 'analytics', label: 'Dashboard & Analytics' }] },
    { id: 'questions', label: 'Questions', icon: '❓', children: [{ id: 'queue', label: 'Question Queue' }, { id: 'disputes', label: 'Disputes' }] },
    { id: 'business', label: 'Business', icon: '💼', children: [{ id: 'campaigns', label: 'Campaigns' }, { id: 'sales', label: 'Sales' }] },
    { id: 'finance', label: 'Finance', icon: '💰', children: [{ id: 'wallet', label: 'Wallet' }] },
    { id: 'account', label: 'Account', icon: '👤', children: [{ id: 'profile', label: 'My Profile' }] },
    { id: 'emergency', label: 'Emergency', icon: '🚨' }
  ],
  user: [
    { id: 'overview', label: 'Overview', icon: '🏠', children: [{ id: 'dashboard', label: 'Dashboard' }] },
    { id: 'questions', label: 'Questions', icon: '❓', children: [{ id: 'questions', label: 'My Questions' }, { id: 'ask', label: 'Ask Question' }, { id: 'tracking', label: 'Tracking' }] },
    { id: 'payments', label: 'Payments', icon: '💳', children: [{ id: 'wallet', label: 'Wallet' }] },
    { id: 'support', label: 'Support', icon: '⚖️', children: [{ id: 'raise-dispute', label: 'Disputes' }, { id: 'dispute-tracking', label: 'Dispute Tracking' }, { id: 'ratings', label: 'Ratings & Reviews' }] },
    { id: 'account', label: 'Account', icon: '👤', children: [{ id: 'astrology-profiles', label: 'My Profile' }] },
    { id: 'emergency', label: 'Emergency', icon: '🚨' }
  ],
  platform: [
    { id: 'overview', label: 'Overview', icon: '🏛️', children: [{ id: 'dashboard', label: 'Dashboard' }] },
    { id: 'operations', label: 'Operations', icon: '⚙️', children: [{ id: 'campaigns', label: 'Campaigns' }, { id: 'disputes', label: 'Disputes' }] },
    { id: 'finance', label: 'Finance', icon: '💰', children: [{ id: 'transactions', label: 'Transactions' }] }
  ]
};

const firstPage = (a, sectionId) => {
  const sec = NAV[a].find(s => s.id === sectionId);
  return sec && sec.children && sec.children.length ? sec.children[0].id : sectionId;
};

const buildSectionMap = (a) => {
  const map = {};
  NAV[a].forEach(s => {
    if (s.children && s.children.length) {
      s.children.forEach(c => { map[c.id] = s.id; });
    } else {
      map[s.id] = s.id;
    }
  });
  return map;
};

function AppContent() {
  const [actor, setActor] = useState('user');
  const [section, setSection] = useState(NAV.user[0].id);
  const [tab, setTab] = useState(firstPage('user', NAV.user[0].id));
  const [navFilter, setNavFilter] = useState(null);
  const [preselectPurchase, setPreselectPurchase] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const confettiTimer = useRef(null);
  const [selectedAstrologerId, setSelectedAstrologerId] = useState('a-1');
  const { allAstrologers } = useData();

  const switchActor = (a) => {
    setActor(a);
    setSection(NAV[a][0].id);
    setTab(firstPage(a, NAV[a][0].id));
    setNavFilter(null);
    setPreselectPurchase(null);
  };

  const handleNavigate = (t, filter, preselectId) => {
    setSection(buildSectionMap(actor)[t] || t);
    setNavFilter(filter);
    setPreselectPurchase(preselectId || null);
    setTab(t);
  };

  const selectSection = (secId) => {
    setNavFilter(null);
    setPreselectPurchase(null);
    setSection(secId);
    setTab(firstPage(actor, secId));
  };

  const selectTab = (tabId) => {
    setNavFilter(null);
    setPreselectPurchase(null);
    setSection(buildSectionMap(actor)[tabId] || tabId);
    setTab(tabId);
  };

  const triggerConfetti = () => {
    setConfetti(true);
    if (confettiTimer.current) clearTimeout(confettiTimer.current);
    confettiTimer.current = setTimeout(() => setConfetti(false), 3500);
  };

  const selectedAstrologer = allAstrologers.find(a => a.id === selectedAstrologerId);
  const profile = actor === 'astrologer' ? (selectedAstrologer || actors.astrologer) : actors[actor];

  return (
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
              {actor === 'astrologer' ? (selectedAstrologer?.displayName || profile.displayName) : (profile.fullName || profile.displayName)}
            </span>
            <NotificationBell actor={actor} onNavigate={handleNavigate} />
            <ThemeToggle />
          </div>
        </div>
        <div className="actor-bar">
          {Object.entries(actors).map(([key, val]) => (
            <button key={key} className={`actor-btn ${actor === key ? 'active' : ''}`}
              onClick={() => switchActor(key)}>
              {key === 'user' ? '👤' : key === 'astrologer' ? '⭐' : '🏛️'}
              <Avatar name={val.fullName || val.displayName} size="sm" style={{ width: 20, height: 20, fontSize: '0.55rem' }} />
              {key === 'astrologer' ? (selectedAstrologer?.displayName || val.displayName) : (val.fullName || val.displayName)}
              <span className="badge">{key}</span>
            </button>
          ))}
          {actor === 'astrologer' && (
            <select
              value={selectedAstrologerId}
              onChange={e => { setSelectedAstrologerId(e.target.value); selectSection(NAV.astrologer[0].id); }}
              style={{
                marginLeft: '0.5rem', padding: '4px 8px', borderRadius: '6px',
                border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink)',
                fontSize: '0.78rem', cursor: 'pointer'
              }}
            >
              {allAstrologers.map(a => (
                <option key={a.id} value={a.id}>{a.displayName}</option>
              ))}
            </select>
          )}
        </div>
        <div className="nav-shell">
          <div className="desktop-nav">
            <MainNavigation sections={NAV[actor]} activeSection={section} onSelect={selectSection} />
            <SectionNavigation section={NAV[actor].find(s => s.id === section)} activeTab={tab} onSelect={selectTab} />
          </div>
          <MobileNavigation
            sections={NAV[actor]}
            activeSection={section}
            activeTab={tab}
            onSection={selectSection}
            onTab={selectTab}
          />
        </div>
      </header>

      <main className="main animate-in">
        {actor === 'astrologer' && (
          <>
            {tab === 'campaigns' && <AstroCampaigns astrologerId={selectedAstrologerId} />}
            {tab === 'emergency' && <AstroEmergency astrologerId={selectedAstrologerId} />}
            {tab === 'queue' && <AstroQueue astrologerId={selectedAstrologerId} />}
            {tab === 'sales' && <AstroSales astrologerId={selectedAstrologerId} />}
            {tab === 'disputes' && <AstroDisputes astrologerId={selectedAstrologerId} />}
            {tab === 'profile' && <AstroProfile astrologerId={selectedAstrologerId} />}
            {tab === 'wallet' && <AstroWallet astrologerId={selectedAstrologerId} />}
            {tab === 'analytics' && <AstroAnalytics astrologerId={selectedAstrologerId} />}
          </>
        )}
        {actor === 'user' && (
          <>
            {tab === 'dashboard' && <UserDashboard onNavigate={handleNavigate} />}
            {tab === 'emergency' && <UserEmergency />}
            {tab === 'questions' && <UserQuestions key={'q-' + navFilter} filter={navFilter} onNavigate={handleNavigate} onPurchaseSuccess={triggerConfetti} />}
            {tab === 'ask' && <UserAskQuestion key={'ask-' + preselectPurchase} onAskSuccess={triggerConfetti} preselectId={preselectPurchase} />}
            {tab === 'wallet' && <UserWallet />}
            {tab === 'tracking' && <UserTracking key={'tr-' + navFilter} filter={navFilter} onNavigate={handleNavigate} />}
            {tab === 'raise-dispute' && <UserRaiseDispute key={'rd-' + preselectPurchase} preselectId={preselectPurchase} />}
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
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </NotificationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
