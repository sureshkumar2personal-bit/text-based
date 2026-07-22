const now = new Date();

export const actors = {
  user: { id: 'u-1', fullName: 'Priya Sharma', email: 'priya@example.com', mobile: '+91-9876543210' },
  astrologer: { id: 'a-1', displayName: 'Dr. Arjun Nair', title: 'Vedic Astrologer', email: 'arjun@astro.com', mobile: '+91-8765432109', rating: 4.5, reviewCount: 128 },
  platform: { id: 'adm-1', fullName: 'Platform Operator', role: 'platform_operator' }
};

export const campaigns = [
  {
    id: 'cmp-1', astrologerId: 'a-1', campaignName: 'Career & Finance Guidance', campaignCode: 'CMP-H2K-3AB',
    description: 'Get expert career and financial astrology insights',
    price: 299, currency: 'INR', totalSlots: 50, soldSlots: 32, availableSlots: 18,
    generalQuestionLimit: 40, individualQuestionLimit: 10,
    generalSoldCount: 28, individualSoldCount: 4,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 48, status: 'active',
    categories: ['Career', 'Finance', 'Business'],
    languages: ['English', 'Hindi', 'Tamil'],
    startAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 23 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 8 * 86400000).toISOString()
  },
  {
    id: 'cmp-2', astrologerId: 'a-1', campaignName: 'Love & Relationship Answers', campaignCode: 'CMP-7JS-B4R',
    description: 'Deep insights into love, marriage and relationship compatibility',
    price: 499, currency: 'INR', totalSlots: 30, soldSlots: 25, availableSlots: 5,
    generalQuestionLimit: 20, individualQuestionLimit: 10,
    generalSoldCount: 18, individualSoldCount: 7,
    submissionMode: 'text', answerMode: 'voice',
    deadlineHours: 72, status: 'active',
    categories: ['Love', 'Marriage', 'Relationship'],
    languages: ['English', 'Hindi'],
    startAt: new Date(now.getTime() - 14 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 16 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 15 * 86400000).toISOString()
  },
  {
    id: 'cmp-3', astrologerId: 'a-1', campaignName: 'Health & Wellness Horoscope', campaignCode: 'CMP-JP5-X2W',
    description: 'Health predictions and wellness guidance through astrology',
    price: 199, currency: 'INR', totalSlots: 100, soldSlots: 100, availableSlots: 0,
    generalQuestionLimit: 80, individualQuestionLimit: 20,
    generalSoldCount: 80, individualSoldCount: 20,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 48, status: 'active',
    categories: ['Health', 'Wellness'],
    languages: ['English', 'Tamil', 'Malayalam'],
    startAt: new Date(now.getTime() - 30 * 86400000).toISOString(),
    endAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 31 * 86400000).toISOString()
  },
  {
    id: 'cmp-4', astrologerId: 'a-1', campaignName: 'Education & Career Planning', campaignCode: 'CMP-RV8-KL9',
    description: 'Guidance for students and professionals on education and career path',
    price: 349, currency: 'INR', totalSlots: 40, soldSlots: 0, availableSlots: 40,
    generalQuestionLimit: 30, individualQuestionLimit: 10,
    generalSoldCount: 0, individualSoldCount: 0,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 48, status: 'draft',
    categories: ['Education', 'Career'],
    languages: ['English', 'Hindi'],
    startAt: null, endAt: null,
    createdAt: new Date(now.getTime() - 2 * 86400000).toISOString()
  },
  {
    id: 'cmp-5', astrologerId: 'a-1', campaignName: 'Weekly Quick Predictions', campaignCode: 'CMP-MN3-DF7',
    description: 'Quick weekly predictions at an affordable price',
    price: 99, currency: 'INR', totalSlots: 200, soldSlots: 45, availableSlots: 155,
    generalQuestionLimit: 150, individualQuestionLimit: 50,
    generalSoldCount: 35, individualSoldCount: 10,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 24, status: 'paused',
    categories: ['General', 'Weekly'],
    languages: ['Tamil'],
    startAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 20 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 11 * 86400000).toISOString()
  }
];

export const purchases = [
  {
    id: 'pur-1', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-1',
    purchaseCode: 'QP-K2M-L8N', price: 299, currency: 'INR',
    paymentStatus: 'paid', purchaseStatus: 'answered',
    questionSubmitted: true, questionId: 'q-1',
    campaignName: 'Career & Finance Guidance', answerMode: 'text',
    expiresAt: new Date(now.getTime() + 5 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 3 * 86400000).toISOString()
  },
  {
    id: 'pur-2', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-2',
    purchaseCode: 'QP-X7J-H9W', price: 499, currency: 'INR',
    paymentStatus: 'paid', purchaseStatus: 'question_submitted',
    questionSubmitted: true, questionId: 'q-2',
    campaignName: 'Love & Relationship Answers', answerMode: 'voice',
    expiresAt: new Date(now.getTime() + 10 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 1 * 86400000).toISOString()
  },
  {
    id: 'pur-3', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-1',
    purchaseCode: 'QP-R5B-T3F', price: 299, currency: 'INR',
    paymentStatus: 'paid', purchaseStatus: 'question_pending',
    questionSubmitted: false, questionId: null,
    campaignName: 'Career & Finance Guidance', answerMode: 'text',
    expiresAt: new Date(now.getTime() + 6 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 1 * 86400000).toISOString()
  },
  {
    id: 'pur-4', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-3',
    purchaseCode: 'QP-V9C-D2A', price: 199, currency: 'INR',
    paymentStatus: 'paid', purchaseStatus: 'disputed',
    questionSubmitted: true, questionId: 'q-3',
    campaignName: 'Health & Wellness Horoscope', answerMode: 'text',
    expiresAt: new Date(now.getTime() + 2 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 5 * 86400000).toISOString()
  }
];

export const questions = [
  {
    id: 'q-1', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-1', purchaseId: 'pur-1',
    questionCode: 'Q-K2M-L8N', questionType: 'general',
    category: 'Finance', language: 'English',
    title: 'Investment timing', questionText: 'I am planning to invest in real estate. Is this a good time based on my chart? Saturn is transiting my 2nd house.',
    status: 'answered', submittedAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    dueAt: new Date(now.getTime() + 1 * 86400000).toISOString(),
    campaignName: 'Career & Finance Guidance', answerMode: 'text',
    astrologerName: 'Dr. Arjun Nair'
  },
  {
    id: 'q-2', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-2', purchaseId: 'pur-2',
    questionCode: 'Q-X7J-H9W', questionType: 'individual',
    category: 'Marriage', language: 'Hindi',
    title: 'Marriage compatibility', questionText: 'Meri shaadi ki umar nikal rahi hai. Kya is saal shaadi hogi?',
    status: 'under_review', submittedAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    dueAt: new Date(now.getTime() + 2 * 86400000).toISOString(),
    campaignName: 'Love & Relationship Answers', answerMode: 'voice',
    astrologerName: 'Dr. Arjun Nair'
  },
  {
    id: 'q-3', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-3', purchaseId: 'pur-4',
    questionCode: 'Q-V9C-D2A', questionType: 'general',
    category: 'Health', language: 'Tamil',
    title: 'Health issue', questionText: 'Enakku weekly thalai vali irukku. En chart la ethavathu dosham irukka?',
    status: 'disputed', submittedAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    dueAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    campaignName: 'Health & Wellness Horoscope', answerMode: 'text',
    astrologerName: 'Dr. Arjun Nair'
  },
  {
    id: 'q-4', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-1', purchaseId: 'pur-1',
    questionCode: 'Q-ABC-123', questionType: 'general',
    category: 'Career', language: 'English',
    title: 'Job change', questionText: 'I have two job offers — one in finance and one in tech. Which aligns better with my chart?',
    status: 'submitted', submittedAt: new Date(now.getTime() - 6 * 3600000).toISOString(),
    dueAt: new Date(now.getTime() + 42 * 3600000).toISOString(),
    campaignName: 'Career & Finance Guidance', answerMode: 'text',
    astrologerName: 'Dr. Arjun Nair'
  }
];

export const answers = [
  {
    id: 'ans-1', questionId: 'q-1', astrologerId: 'a-1',
    answerMode: 'text', answerText: 'Dear Priya, based on your chart, Saturn in the 2nd house is actually forming a favorable aspect for long-term investments. I recommend waiting until mid-next month when Jupiter transits into a supportive position. Real estate investments initiated during that window (between 15th-22nd next month) will yield good returns over a 5-year horizon. Consider properties in the South-East direction.',
    voiceAnswerUrl: null, status: 'submitted',
    submittedAt: new Date(now.getTime() - 2 * 86400000 + 4 * 3600000).toISOString()
  }
];

export const disputes = [
  {
    id: 'disp-1', userId: 'u-1', astrologerId: 'a-1', questionId: 'q-3', purchaseId: 'pur-4',
    reason: 'incomplete_answer', description: 'The answer was too brief and did not address my specific health concerns. I expected a detailed analysis of my chart.',
    expectedResolution: 're_answer',
    status: 'astrologer_reviewing',
    astrologerResponse: null, astrologerRespondedAt: null,
    adminNotes: null, resolution: null, resolvedBy: null,
    resolvedAt: null, escalatedAt: null, escalatedBy: null, refundAmount: null,
    createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    questionCode: 'Q-V9C-D2A', questionTitle: 'Health issue',
    questionText: 'Enakku weekly thalai vali irukku. En chart la ethavathu dosham irukka?',
    userFullName: 'Priya Sharma', astrologerName: 'Dr. Arjun Nair',
    purchaseAmount: 199, purchaseStatus: 'disputed'
  },
  {
    id: 'disp-2', userId: 'u-1', astrologerId: 'a-1', questionId: 'q-1', purchaseId: 'pur-1',
    reason: 'too_brief', description: 'Could you elaborate more on the timing aspect?',
    expectedResolution: 're_answer',
    status: 'escalated',
    astrologerResponse: 'I have provided the key timing details. Please let me know what specific aspect you need elaborated.',
    astrologerRespondedAt: new Date(now.getTime() - 1 * 86400000 + 6 * 3600000).toISOString(),
    adminNotes: null, resolution: null, resolvedBy: null,
    resolvedAt: null,
    escalatedAt: new Date(now.getTime() - 12 * 3600000).toISOString(),
    escalatedBy: 'u-1', refundAmount: null,
    createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 12 * 3600000).toISOString(),
    questionCode: 'Q-K2M-L8N', questionTitle: 'Investment timing',
    questionText: 'I am planning to invest in real estate. Is this a good time based on my chart?',
    userFullName: 'Priya Sharma', astrologerName: 'Dr. Arjun Nair',
    purchaseAmount: 299, purchaseStatus: 'disputed'
  }
];

export const disputeMessages = [
  {
    id: 'dm-1', disputeId: 'disp-1', senderType: 'user', senderId: 'u-1',
    senderName: 'Priya Sharma', message: 'Dispute raised: incomplete_answer. The answer was too brief and did not address my specific health concerns.',
    createdAt: new Date(now.getTime() - 2 * 86400000).toISOString()
  },
  {
    id: 'dm-2', disputeId: 'disp-2', senderType: 'user', senderId: 'u-1',
    senderName: 'Priya Sharma', message: 'Dispute raised: too_brief. Could you elaborate more on the timing aspect?',
    createdAt: new Date(now.getTime() - 3 * 86400000).toISOString()
  },
  {
    id: 'dm-3', disputeId: 'disp-2', senderType: 'astrologer', senderId: 'a-1',
    senderName: 'Dr. Arjun Nair', message: 'I have provided the key timing details. Please let me know what specific aspect you need elaborated.',
    createdAt: new Date(now.getTime() - 1 * 86400000 + 6 * 3600000).toISOString()
  },
  {
    id: 'dm-4', disputeId: 'disp-2', senderType: 'user', senderId: 'u-1',
    senderName: 'Priya Sharma', message: 'I need exact dates and the reasoning based on my birth chart placements.',
    createdAt: new Date(now.getTime() - 18 * 3600000).toISOString()
  },
  {
    id: 'dm-5', disputeId: 'disp-2', senderType: 'user', senderId: 'u-1',
    senderName: 'Priya Sharma', message: 'Dispute escalated to platform.',
    createdAt: new Date(now.getTime() - 12 * 3600000).toISOString()
  }
];

export const wallet = {
  id: 'wal-u-1', ownerType: 'user', ownerId: 'u-1',
  availableBalance: 1250, holdBalance: 598, pendingBalance: 0, currency: 'INR'
};

export const walletTransactions = [
  { id: 'wt-1', type: 'credit', amount: 2000, description: 'Wallet top-up', status: 'completed', createdAt: new Date(now.getTime() - 10 * 86400000).toISOString() },
  { id: 'wt-2', type: 'debit', amount: 299, description: 'Purchase from campaign: Career & Finance Guidance', status: 'completed', createdAt: new Date(now.getTime() - 3 * 86400000).toISOString() },
  { id: 'wt-3', type: 'debit', amount: 499, description: 'Purchase from campaign: Love & Relationship Answers', status: 'completed', createdAt: new Date(now.getTime() - 1 * 86400000).toISOString() },
  { id: 'wt-4', type: 'debit', amount: 299, description: 'Purchase from campaign: Career & Finance Guidance', status: 'completed', createdAt: new Date(now.getTime() - 1 * 86400000).toISOString() },
  { id: 'wt-5', type: 'debit', amount: 199, description: 'Purchase from campaign: Health & Wellness Horoscope', status: 'completed', createdAt: new Date(now.getTime() - 5 * 86400000).toISOString() }
];

export const escrowRecords = [
  { id: 'esc-1', userId: 'u-1', astrologerId: 'a-1', serviceType: 'question_purchase', serviceId: 'pur-1', grossAmount: 299, platformCommission: 59.8, astrologerAmount: 239.2, status: 'held' },
  { id: 'esc-2', userId: 'u-1', astrologerId: 'a-1', serviceType: 'question_purchase', serviceId: 'pur-2', grossAmount: 499, platformCommission: 99.8, astrologerAmount: 399.2, status: 'held' },
  { id: 'esc-3', userId: 'u-1', astrologerId: 'a-1', serviceType: 'question_purchase', serviceId: 'pur-3', grossAmount: 299, platformCommission: 59.8, astrologerAmount: 239.2, status: 'held' },
  { id: 'esc-4', userId: 'u-1', astrologerId: 'a-1', serviceType: 'question_purchase', serviceId: 'pur-4', grossAmount: 199, platformCommission: 39.8, astrologerAmount: 159.2, status: 'on_hold_due_to_dispute' }
];

export const salesData = {
  astrologerId: 'a-1',
  totalEarnings: 45820,
  totalCommissionPaid: 9164,
  netPayout: 36656,
  currentMonthEarnings: 8720,
  currentMonthCommission: 1744,
  currentMonthNet: 6976,
  totalPurchases: 57,
  totalQuestionsAnswered: 52,
  averageRating: 4.5,
  campaignWise: [
    { campaignName: 'Career & Finance Guidance', sold: 32, revenue: 9568, commission: 1913.6, net: 7654.4, answered: 30 },
    { campaignName: 'Love & Relationship Answers', sold: 25, revenue: 12475, commission: 2495, net: 9980, answered: 22 },
    { campaignName: 'Health & Wellness Horoscope', sold: 100, revenue: 19900, commission: 3980, net: 15920, answered: 100 },
    { campaignName: 'Weekly Quick Predictions', sold: 45, revenue: 4455, commission: 891, net: 3564, answered: 45 }
  ],
  monthlyEarnings: [
    { month: 'Jan', earnings: 3200, answered: 28 },
    { month: 'Feb', earnings: 5600, answered: 41 },
    { month: 'Mar', earnings: 7200, answered: 55 },
    { month: 'Apr', earnings: 8900, answered: 62 },
    { month: 'May', earnings: 10200, answered: 78 },
    { month: 'Jun', earnings: 8720, answered: 52 }
  ],
  payoutHistory: [
    { id: 'po-1', period: 'May 1-15', gross: 5100, commission: 1020, net: 4080, status: 'paid', paidAt: '2026-05-20' },
    { id: 'po-2', period: 'May 16-31', gross: 5100, commission: 1020, net: 4080, status: 'paid', paidAt: '2026-06-05' },
    { id: 'po-3', period: 'Jun 1-15', gross: 4800, commission: 960, net: 3840, status: 'paid', paidAt: '2026-06-20' },
    { id: 'po-4', period: 'Jun 16-30', gross: 3920, commission: 784, net: 3136, status: 'pending', paidAt: null }
  ]
};

export const platformCampaigns = campaigns.map(c => ({
  ...c,
  approvalStatus: c.status === 'draft' ? 'pending_review' : c.status === 'active' ? 'approved' : 'not_submitted',
  submittedAt: c.createdAt,
  reviewedAt: c.status === 'active' ? new Date(now.getTime() - 6 * 86400000).toISOString() : null,
  reviewedBy: c.status === 'active' ? 'adm-1' : null,
  rejectionReason: null,
  astrologerName: 'Dr. Arjun Nair'
}));

platformCampaigns[0].approvalStatus = 'approved';
platformCampaigns[3].approvalStatus = 'pending_review';
platformCampaigns[4].approvalStatus = 'approved';

export const allAstrologers = [
  { id: 'a-1', displayName: 'Dr. Arjun Nair', title: 'Vedic Astrologer', email: 'arjun@astro.com', rating: 4.5, campaignsCount: 5, totalRevenue: 45820 },
  { id: 'a-2', displayName: 'Lakshmi Devi', title: 'Tamil Astrologer', email: 'lakshmi@astro.com', rating: 4.8, campaignsCount: 3, totalRevenue: 28700 },
  { id: 'a-3', displayName: 'Rajesh Kumar', title: 'Numerologist', email: 'rajesh@astro.com', rating: 4.2, campaignsCount: 4, totalRevenue: 19300 }
];

export const platformDisputeSummary = {
  total: 8, open: 3, astrologer_reviewing: 1, escalated: 1, resolved: 2, refunded: 1
};
