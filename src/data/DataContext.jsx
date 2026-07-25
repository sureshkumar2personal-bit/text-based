import { createContext, useContext, useEffect } from 'react';
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
  ratings as initialRatings,
  allAstrologers as initialAstrologers,
  astrologerSettingsMap as initialAstroSettingsMap,
  platformStats as initialPlatformStats,
  followUpQuestions as initialFollowUpQuestions,
  astrologerWallets as initialAstroWallets,
  astrologerWalletTransactions as initialAstroWalletTx,
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
  const [ratings, setRatings] = useLocalState('ae_ratings', initialRatings);
  const [astroSettingsMap, setAstroSettingsMap] = useLocalState('ae_astroSettingsMap', initialAstroSettingsMap);
  const [platformStats, setPlatformStats] = useLocalState('ae_platformStats', initialPlatformStats);
  const [followUpQuestions, setFollowUpQuestions] = useLocalState('ae_followUpQuestions', initialFollowUpQuestions);
  const [astrologerWallets, setAstrologerWallets] = useLocalState('ae_astroWallets', initialAstroWallets);
  const [astrologerWalletTxMap, setAstrologerWalletTxMap] = useLocalState('ae_astroWalletTx', initialAstroWalletTx);

  useEffect(() => {
    setCampaigns(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const missing = initialCampaigns.filter(c => !existingIds.has(c.id));
      return missing.length ? [...prev, ...missing] : prev;
    });
    setQuestions(prev => {
      const existingIds = new Set(prev.map(q => q.id));
      const missing = initialQuestions.filter(q => !existingIds.has(q.id));
      return missing.length ? [...prev, ...missing] : prev;
    });
  }, []);

  const getAstrologerName = (id) => {
    const a = initialAstrologers.find(x => x.id === id);
    return a ? a.displayName : 'Unknown Astrologer';
  };

  const addRating = (data) => {
    const q = questions.find(x => x.id === data.questionId);
    const astrologerId = q ? q.astrologerId : 'a-1';
    const astrologerName = q ? q.astrologerName : getAstrologerName(astrologerId);
    const r = { id: `rat-${Date.now()}`, userId: 'u-1', astrologerId, astrologerName, ...data, createdAt: new Date().toISOString() };
    setRatings(prev => [r, ...prev]);
    return r;
  };

  const addFollowUpQuestion = (data) => {
    const q = questions.find(x => x.id === data.questionId);
    const astrologerId = q ? q.astrologerId : 'a-1';
    const astrologerName = q ? q.astrologerName : getAstrologerName(astrologerId);
    const fuq = {
      id: `fuq-${Date.now()}`, userId: 'u-1', astrologerId, astrologerName,
      ...data, status: 'submitted', submittedAt: new Date().toISOString()
    };
    setFollowUpQuestions(prev => [fuq, ...prev]);
    return fuq;
  };

  const updateAstroSettings = (astrologerId, updates) => {
    setAstroSettingsMap(prev => ({
      ...prev,
      [astrologerId]: { ...(prev[astrologerId] || {}), ...updates, updatedAt: new Date().toISOString() }
    }));
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

  const addPurchase = (camp, variation = 'general') => {
    const actualPrice = variation === 'individual' ? camp.individualPrice : camp.generalPrice;
    const astrologerId = camp.astrologerId || 'a-1';
    const p = {
      id: `pur-${Date.now()}`, userId: 'u-1', astrologerId, campaignId: camp.id,
      purchaseCode: `QP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      price: actualPrice, currency: 'INR', paymentStatus: 'paid', purchaseStatus: 'question_pending',
      variation,
      questionSubmitted: false, questionId: null,
      campaignName: camp.campaignName, answerMode: camp.answerMode,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date().toISOString()
    };
    setPurchases(prev => [p, ...prev]);
    addTransaction('debit', actualPrice, `Purchase from campaign: ${camp.campaignName}`);
    setEscrowRecords(prev => [...prev, {
      id: `esc-${Date.now()}`, userId: 'u-1', astrologerId,
      serviceType: 'question_purchase', serviceId: p.id,
      grossAmount: actualPrice, platformCommission: actualPrice * 0.2,
      astrologerAmount: actualPrice * 0.8, status: 'held'
    }]);
    setCampaigns(prev => prev.map(c => c.id === camp.id ? {
      ...c, soldSlots: c.soldSlots + 1, availableSlots: c.availableSlots - 1,
      ...(variation === 'general' ? { generalSoldCount: c.generalSoldCount + 1 } : { individualSoldCount: c.individualSoldCount + 1 })
    } : c));
    return p;
  };

  const addQuestion = (data) => {
    const purchase = purchases.find(p => p.id === data.purchaseId);
    const astrologerId = purchase ? purchase.astrologerId : 'a-1';
    const astrologerName = getAstrologerName(astrologerId);
    const q = {
      id: `q-${Date.now()}`, userId: 'u-1', astrologerId,
      campaignId: data.campaignId, purchaseId: data.purchaseId,
      questionCode: `Q-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      questionType: data.questionType, category: data.category, language: data.language,
      title: data.title, questionText: data.questionText,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + (data.deadlineHours || 48) * 3600000).toISOString(),
      campaignName: data.campaignName, answerMode: data.answerMode,
      astrologerName,
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
    const question = questions.find(q => q.id === qId);
    const astrologerId = question ? question.astrologerId : 'a-1';
    const a = {
      id: `ans-${Date.now()}`, questionId: qId, astrologerId,
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
    const question = questions.find(q => q.id === data.questionId);
    const astrologerId = question ? question.astrologerId : 'a-1';
    const astrologerName = question ? question.astrologerName : getAstrologerName(astrologerId);
    const d = {
      id: `disp-${Date.now()}`, userId: 'u-1', astrologerId,
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
      userFullName: 'Priya Sharma', astrologerName,
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
  };

  const addCampaign = (camp) => {
    setCampaigns(prev => [camp, ...prev]);
    return camp;
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

  const acceptDisputeReanswer = (questionId, dId) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, status: 'submitted' } : q));
    setPurchases(prev => prev.map(p => p.questionId === questionId ? { ...p, purchaseStatus: 'question_submitted' } : p));
    setDisputes(prev => prev.map(d => d.id === dId ? { ...d, status: 'resolved', resolution: 'accepted_for_reanswer', astrologerResponse: 'Accepted — re-answering' } : d));
  };

  const getAstrologerWallet = (id) => astrologerWallets[id] || { id: `wal-${id}`, ownerType: 'astrologer', ownerId: id, availableBalance: 0, totalEarned: 0, totalWithdrawn: 0, currency: 'INR' };
  const getAstrologerWalletTransactions = (id) => astrologerWalletTxMap[id] || [];

  const addAstrologerTransaction = (astrologerId, type, amount, description) => {
    const tx = { id: `awt-${Date.now()}`, type, amount, description, status: 'completed', createdAt: new Date().toISOString() };
    setAstrologerWalletTxMap(prev => ({
      ...prev,
      [astrologerId]: [tx, ...(prev[astrologerId] || [])]
    }));
    setAstrologerWallets(prev => {
      const w = prev[astrologerId] || { id: `wal-${astrologerId}`, ownerType: 'astrologer', ownerId: astrologerId, availableBalance: 0, totalEarned: 0, totalWithdrawn: 0, currency: 'INR' };
      return { ...prev, [astrologerId]: { ...w, availableBalance: type === 'credit' ? w.availableBalance + amount : w.availableBalance - amount, totalEarned: type === 'credit' ? w.totalEarned + amount : w.totalEarned, totalWithdrawn: type === 'debit' ? w.totalWithdrawn + amount : w.totalWithdrawn } };
    });
    return tx;
  };

  const value = {
    campaigns, purchases, questions, answers, disputes, disputeMessages,
    wallet, walletTransactions, escrowRecords, astrologyProfiles,
    ratings, astroSettingsMap, platformStats, followUpQuestions,
    astrologerWallets, astrologerWalletTxMap,
    allAstrologers: initialAstrologers, getAstrologerName,
    addPurchase, addTransaction, addQuestion, updateQuestionStatus, addAnswer,
    addDispute, updateDisputeStatus, addDisputeMessage,
    updateCampaign, addCampaign,
    addAstrologyProfile, updateAstrologyProfile, deleteAstrologyProfile, setDefaultProfile,
    addRating, addFollowUpQuestion, updateAstroSettings, walletTopUp, resolveDispute,
    getAstrologerWallet, getAstrologerWalletTransactions, addAstrologerTransaction,
    acceptDisputeReanswer,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
