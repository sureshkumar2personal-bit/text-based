import { createContext, useContext } from 'react';
import useLocalState from '../hooks/useLocalState';
import {
  campaigns as initialCampaigns,
  purchases as initialPurchases,
  questions as initialQuestions,
  answers as initialAnswers,
  disputes as initialDisputes,
  disputeMessages as initialMessages,
  wallet as initialWallet,
  walletTransactions as initialWalletTx,
  escrowRecords as initialEscrow,
  astrologyProfiles as initialProfiles,
  platformCampaigns as initialPlatformCampaigns,
  ratings as initialRatings,
  astrologerSettings as initialAstroSettings,
  platformStats as initialPlatformStats,
  followUpQuestions as initialFollowUpQuestions,
} from './mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [campaigns, setCampaigns] = useLocalState('ae_campaigns', initialCampaigns);
  const [purchases, setPurchases] = useLocalState('ae_purchases', initialPurchases);
  const [questions, setQuestions] = useLocalState('ae_questions', initialQuestions);
  const [answers, setAnswers] = useLocalState('ae_answers', initialAnswers);
  const [disputes, setDisputes] = useLocalState('ae_disputes', initialDisputes);
  const [disputeMessages, setDisputeMessages] = useLocalState('ae_disputeMessages', initialMessages);
  const [wallet, setWallet] = useLocalState('ae_wallet', { ...initialWallet });
  const [walletTransactions, setWalletTransactions] = useLocalState('ae_walletTx', initialWalletTx);
  const [escrowRecords, setEscrowRecords] = useLocalState('ae_escrow', initialEscrow);
  const [astrologyProfiles, setAstrologyProfiles] = useLocalState('ae_astrologyProfiles', initialProfiles);
  const [platformCampaigns, setPlatformCampaigns] = useLocalState('ae_platformCampaigns', initialPlatformCampaigns);
  const [ratings, setRatings] = useLocalState('ae_ratings', initialRatings);
  const [astroSettings, setAstroSettings] = useLocalState('ae_astroSettings', initialAstroSettings);
  const [platformStats, setPlatformStats] = useLocalState('ae_platformStats', initialPlatformStats);
  const [followUpQuestions, setFollowUpQuestions] = useLocalState('ae_followUpQuestions', initialFollowUpQuestions);

  const addRating = (data) => {
    const r = { id: `rat-${Date.now()}`, userId: 'u-1', astrologerId: 'a-1', ...data, createdAt: new Date().toISOString() };
    setRatings(prev => [r, ...prev]);
    return r;
  };

  const addFollowUpQuestion = (data) => {
    const fuq = {
      id: `fuq-${Date.now()}`, userId: 'u-1', astrologerId: 'a-1',
      ...data, status: 'submitted', submittedAt: new Date().toISOString()
    };
    setFollowUpQuestions(prev => [fuq, ...prev]);
    return fuq;
  };

  const updateAstroSettings = (updates) => {
    setAstroSettings(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
  };

  const walletTopUp = (amount) => {
    addTransaction('credit', amount, 'Wallet top-up');
  };

  const resolveDispute = (dId, resolution, adminNotes, refundAmount) => {
    setDisputes(prev => prev.map(d => d.id === dId ? {
      ...d, status: resolution, resolution, adminNotes: adminNotes || null,
      resolvedBy: 'adm-1', resolvedAt: new Date().toISOString(),
      refundAmount: refundAmount || 0
    } : d));
  };

  const addTransaction = (type, amount, description) => {
    const tx = { id: `wt-${Date.now()}`, type, amount, description, status: 'completed', createdAt: new Date().toISOString() };
    setWalletTransactions(prev => [tx, ...prev]);
    setWallet(prev => ({ ...prev, availableBalance: type === 'credit' ? prev.availableBalance + amount : prev.availableBalance - amount }));
    return tx;
  };

  const addPurchase = (camp) => {
    const p = {
      id: `pur-${Date.now()}`, userId: 'u-1', astrologerId: 'a-1', campaignId: camp.id,
      purchaseCode: `QP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      price: camp.price, currency: 'INR', paymentStatus: 'paid', purchaseStatus: 'question_pending',
      questionSubmitted: false, questionId: null,
      campaignName: camp.campaignName, answerMode: camp.answerMode,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date().toISOString()
    };
    setPurchases(prev => [p, ...prev]);
    addTransaction('debit', camp.price, `Purchase from campaign: ${camp.campaignName}`);
    setEscrowRecords(prev => [...prev, {
      id: `esc-${Date.now()}`, userId: 'u-1', astrologerId: 'a-1',
      serviceType: 'question_purchase', serviceId: p.id,
      grossAmount: camp.price, platformCommission: camp.price * 0.2,
      astrologerAmount: camp.price * 0.8, status: 'held'
    }]);
    setCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, soldSlots: c.soldSlots + 1, availableSlots: c.availableSlots - 1 } : c));
    return p;
  };

  const addQuestion = (data) => {
    const q = {
      id: `q-${Date.now()}`, userId: 'u-1', astrologerId: 'a-1',
      campaignId: data.campaignId, purchaseId: data.purchaseId,
      questionCode: `Q-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      questionType: data.questionType, category: data.category, language: data.language,
      title: data.title, questionText: data.questionText,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + (data.deadlineHours || 48) * 3600000).toISOString(),
      campaignName: data.campaignName, answerMode: data.answerMode,
      astrologerName: 'Dr. Arjun Nair',
      profile: data.profile || null,
      attachments: data.attachments || []
    };
    setQuestions(prev => [q, ...prev]);
    setPurchases(prev => prev.map(p => p.id === data.purchaseId ? { ...p, questionSubmitted: true, questionId: q.id, purchaseStatus: 'question_submitted' } : p));
    return q;
  };

  const updateQuestionStatus = (qId, status) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, status } : q));
  };

  const addAnswer = (qId, answerMode, answerText, voiceUrl) => {
    const a = {
      id: `ans-${Date.now()}`, questionId: qId, astrologerId: 'a-1',
      answerMode, answerText: answerText || null, voiceAnswerUrl: voiceUrl || null,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
    setAnswers(prev => [a, ...prev]);
    updateQuestionStatus(qId, 'answered');
    setPurchases(prev => prev.map(p => p.questionId === qId ? { ...p, purchaseStatus: 'answered' } : p));
    return a;
  };

  const addDispute = (data) => {
    const d = {
      id: `disp-${Date.now()}`, userId: 'u-1', astrologerId: 'a-1',
      questionId: data.questionId, purchaseId: data.purchaseId,
      reason: data.reason, description: data.description,
      expectedResolution: data.expectedResolution || '',
      status: 'open',
      astrologerResponse: null, astrologerRespondedAt: null,
      adminNotes: null, resolution: null, resolvedBy: null,
      resolvedAt: null, escalatedAt: null, escalatedBy: null, refundAmount: null,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      questionCode: data.questionCode, questionTitle: data.questionTitle,
      questionText: data.questionText,
      userFullName: 'Priya Sharma', astrologerName: 'Dr. Arjun Nair',
      purchaseAmount: data.purchaseAmount, purchaseStatus: 'disputed'
    };
    setDisputes(prev => [d, ...prev]);
    updateQuestionStatus(data.questionId, 'disputed');
    setDisputeMessages(prev => [...prev, {
      id: `dm-${Date.now()}`, disputeId: d.id, senderType: 'user', senderId: 'u-1',
      senderName: 'Priya Sharma',
      message: `Dispute raised: ${data.reason}. ${data.description}`,
      createdAt: new Date().toISOString()
    }]);
    return d;
  };

  const updateDisputeStatus = (dId, updates) => {
    setDisputes(prev => prev.map(d => d.id === dId ? { ...d, ...updates } : d));
  };

  const addDisputeMessage = (disputeId, senderType, senderId, senderName, message) => {
    const msg = { id: `dm-${Date.now()}`, disputeId, senderType, senderId, senderName, message, createdAt: new Date().toISOString() };
    setDisputeMessages(prev => [...prev, msg]);
    return msg;
  };

  const updateCampaign = (cId, updates) => {
    setCampaigns(prev => prev.map(c => c.id === cId ? { ...c, ...updates } : c));
    setPlatformCampaigns(prev => prev.some(pc => pc.id === cId) ? prev.map(pc => pc.id === cId ? { ...pc, ...updates } : pc) : prev);
  };

  const addCampaign = (camp) => {
    setCampaigns(prev => [camp, ...prev]);
    const pc = { ...camp, approvalStatus: 'pending_review', submittedAt: camp.createdAt, reviewedAt: null, reviewedBy: null, rejectionReason: null, astrologerName: 'Dr. Arjun Nair' };
    setPlatformCampaigns(prev => [pc, ...prev]);
    return camp;
  };

  const updatePlatformCampaign = (cId, updates) => {
    setPlatformCampaigns(prev => prev.map(c => c.id === cId ? { ...c, ...updates } : c));
    if (updates.approvalStatus === 'approved') {
      updateCampaign(cId, { status: 'active' });
    }
  };

  const addAstrologyProfile = (profile) => {
    setAstrologyProfiles(prev => [...prev, profile]);
  };

  const updateAstrologyProfile = (pId, updates) => {
    setAstrologyProfiles(prev => prev.map(p => p.id === pId ? { ...p, ...updates } : p));
  };

  const deleteAstrologyProfile = (pId) => {
    setAstrologyProfiles(prev => prev.filter(p => p.id !== pId));
  };

  const setDefaultProfile = (pId) => {
    setAstrologyProfiles(prev => prev.map(p => ({ ...p, isDefault: p.id === pId })));
  };

  const value = {
    campaigns, purchases, questions, answers, disputes, disputeMessages,
    wallet, walletTransactions, escrowRecords, astrologyProfiles, platformCampaigns,
    ratings, astroSettings, platformStats, followUpQuestions,
    addPurchase, addTransaction, addQuestion, updateQuestionStatus, addAnswer,
    addDispute, updateDisputeStatus, addDisputeMessage,
    updateCampaign, addCampaign, updatePlatformCampaign,
    addAstrologyProfile, updateAstrologyProfile, deleteAstrologyProfile, setDefaultProfile,
    addRating, addFollowUpQuestion, updateAstroSettings, walletTopUp, resolveDispute,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
