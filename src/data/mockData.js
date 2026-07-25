const now = new Date();

export const actors = {
  user: { id: 'u-1', fullName: 'Priya Sharma', email: 'priya@example.com', mobile: '+91-9876543210' },
  astrologer: { id: 'a-1', displayName: 'Dr. Arjun Nair', title: 'Vedic Astrologer', email: 'arjun@astro.com', mobile: '+91-8765432109', rating: 4.5, reviewCount: 128 },
  platform: { id: 'adm-1', fullName: 'Platform Operator', role: 'platform_operator' }
};

export const defaultAstrologerSettings = {
  id: 'as-default', astrologerId: 'a-1', displayName: 'Dr. Arjun Nair',
  title: 'Vedic Astrologer', bio: 'Experienced astrologer providing personalized guidance.',
  profilePhoto: null, experienceYears: 10, specialties: ['Vedic Astrology'],
  consultationLanguages: ['English', 'Hindi'],
  maxDailyQuestions: 20, autoAcceptQuestions: true, instantAnswerEnabled: false,
  notificationPreferences: { email: true, sms: false, push: true },
  bankAccount: { accountHolder: 'Default', bankName: 'SBI', accountNumber: 'XXXX-XXXX-0000', ifsc: 'SBIN0000000' },
  updatedAt: new Date().toISOString()
};

export const allAstrologers = [
  { id: 'a-1', displayName: 'Dr. Arjun Nair', title: 'Vedic Astrologer', email: 'arjun@astro.com', rating: 4.5, reviewCount: 128, campaignsCount: 5, totalRevenue: 45820, specialties: ['Vedic Astrology', 'Numerology', 'Vastu'] },
  { id: 'a-2', displayName: 'Lakshmi Devi', title: 'Tamil Astrologer', email: 'lakshmi@astro.com', rating: 4.8, reviewCount: 96, campaignsCount: 3, totalRevenue: 28700, specialties: ['Tamil Astrology', 'Palmistry', 'Muhurtha'] },
  { id: 'a-3', displayName: 'Rajesh Kumar', title: 'Numerologist & Gemstone Expert', email: 'rajesh@astro.com', rating: 4.2, reviewCount: 74, campaignsCount: 4, totalRevenue: 19300, specialties: ['Numerology', 'Gemstone Advisory', 'Vastu'] },
  { id: 'a-4', displayName: 'Saraswati Iyer', title: 'KP Astrologer', email: 'saraswati@astro.com', rating: 4.6, reviewCount: 52, campaignsCount: 2, totalRevenue: 12500, specialties: ['KP Astrology', 'Muhurtha', 'Prashna'] },
  { id: 'a-5', displayName: 'Master Venkat', title: 'Vedic Astrologer & Palmist', email: 'venkat@astro.com', rating: 4.3, reviewCount: 41, campaignsCount: 2, totalRevenue: 9800, specialties: ['Palmistry', 'Vedic Astrology', 'Tarot'] },
];

export const campaigns = [
  {
    id: 'cmp-1', astrologerId: 'a-1', campaignName: 'Career & Finance Guidance', campaignCode: 'CMP-H2K-3AB',
    description: 'Get expert career and financial astrology insights',
    generalPrice: 199, individualPrice: 499, currency: 'INR', totalSlots: 50, soldSlots: 32, availableSlots: 18,
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
    generalPrice: 399, individualPrice: 799, currency: 'INR', totalSlots: 30, soldSlots: 25, availableSlots: 5,
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
    generalPrice: 149, individualPrice: 349, currency: 'INR', totalSlots: 100, soldSlots: 100, availableSlots: 0,
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
    generalPrice: 249, individualPrice: 599, currency: 'INR', totalSlots: 40, soldSlots: 0, availableSlots: 40,
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
    generalPrice: 79, individualPrice: 149, currency: 'INR', totalSlots: 200, soldSlots: 45, availableSlots: 155,
    generalQuestionLimit: 150, individualQuestionLimit: 50,
    generalSoldCount: 35, individualSoldCount: 10,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 24, status: 'paused',
    categories: ['General', 'Weekly'],
    languages: ['Tamil'],
    startAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 20 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 11 * 86400000).toISOString()
  },
  {
    id: 'cmp-6', astrologerId: 'a-2', campaignName: 'Tamil Jothidam Premium', campaignCode: 'CMP-TJ6-L2M',
    description: 'Traditional Tamil astrology predictions for all life aspects',
    generalPrice: 149, individualPrice: 399, currency: 'INR', totalSlots: 60, soldSlots: 25, availableSlots: 35,
    generalQuestionLimit: 45, individualQuestionLimit: 15,
    generalSoldCount: 20, individualSoldCount: 5,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 48, status: 'active',
    categories: ['General', 'Career', 'Health'],
    languages: ['Tamil'],
    startAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 25 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 6 * 86400000).toISOString()
  },
  {
    id: 'cmp-7', astrologerId: 'a-2', campaignName: 'Palm Reading Insights', campaignCode: 'CMP-PR8-X5K',
    description: 'Detailed palm reading analysis for life predictions',
    generalPrice: 299, individualPrice: 599, currency: 'INR', totalSlots: 30, soldSlots: 8, availableSlots: 22,
    generalQuestionLimit: 20, individualQuestionLimit: 10,
    generalSoldCount: 6, individualSoldCount: 2,
    submissionMode: 'text', answerMode: 'voice',
    deadlineHours: 72, status: 'active',
    categories: ['Palmistry', 'General'],
    languages: ['Tamil', 'English'],
    startAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 27 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 4 * 86400000).toISOString()
  },
  {
    id: 'cmp-8', astrologerId: 'a-2', campaignName: 'Marriage Matching', campaignCode: 'CMP-MM9-J4H',
    description: 'Traditional horoscope matching for marriage compatibility',
    generalPrice: 499, individualPrice: 999, currency: 'INR', totalSlots: 20, soldSlots: 0, availableSlots: 20,
    generalQuestionLimit: 15, individualQuestionLimit: 5,
    generalSoldCount: 0, individualSoldCount: 0,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 96, status: 'draft',
    categories: ['Marriage', 'Relationship'],
    languages: ['Tamil'],
    startAt: null, endAt: null,
    createdAt: new Date(now.getTime() - 1 * 86400000).toISOString()
  },
  {
    id: 'cmp-9', astrologerId: 'a-3', campaignName: 'Lucky Number Analysis', campaignCode: 'CMP-LN3-K7B',
    description: 'Find your lucky numbers and gemstones through numerology',
    generalPrice: 99, individualPrice: 249, currency: 'INR', totalSlots: 100, soldSlots: 40, availableSlots: 60,
    generalQuestionLimit: 80, individualQuestionLimit: 20,
    generalSoldCount: 35, individualSoldCount: 5,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 24, status: 'active',
    categories: ['Numerology', 'Gemstone'],
    languages: ['English', 'Hindi'],
    startAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 20 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 11 * 86400000).toISOString()
  },
  {
    id: 'cmp-10', astrologerId: 'a-3', campaignName: 'Name Numerology Report', campaignCode: 'CMP-NN5-F9G',
    description: 'Complete numerology report based on your full name',
    generalPrice: 199, individualPrice: 449, currency: 'INR', totalSlots: 40, soldSlots: 12, availableSlots: 28,
    generalQuestionLimit: 30, individualQuestionLimit: 10,
    generalSoldCount: 10, individualSoldCount: 2,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 48, status: 'active',
    categories: ['Numerology', 'Name Analysis'],
    languages: ['English', 'Hindi'],
    startAt: new Date(now.getTime() - 6 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 24 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 7 * 86400000).toISOString()
  },
  {
    id: 'cmp-11', astrologerId: 'a-4', campaignName: 'KP Horary Questions', campaignCode: 'CMP-KP2-R7D',
    description: 'Get instant answers to your specific questions using KP astrology',
    generalPrice: 249, individualPrice: 549, currency: 'INR', totalSlots: 40, soldSlots: 15, availableSlots: 25,
    generalQuestionLimit: 30, individualQuestionLimit: 10,
    generalSoldCount: 12, individualSoldCount: 3,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 36, status: 'active',
    categories: ['General', 'Prashna'],
    languages: ['English', 'Hindi', 'Tamil'],
    startAt: new Date(now.getTime() - 8 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 22 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 9 * 86400000).toISOString()
  },
  {
    id: 'cmp-12', astrologerId: 'a-4', campaignName: 'Muhurtha & Auspicious Timing', campaignCode: 'CMP-MU6-B3H',
    description: 'Find the best auspicious timings for important life events',
    generalPrice: 349, individualPrice: 699, currency: 'INR', totalSlots: 25, soldSlots: 5, availableSlots: 20,
    generalQuestionLimit: 20, individualQuestionLimit: 5,
    generalSoldCount: 4, individualSoldCount: 1,
    submissionMode: 'text', answerMode: 'voice',
    deadlineHours: 72, status: 'active',
    categories: ['Muhurtha', 'Ceremonies'],
    languages: ['English', 'Tamil'],
    startAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 26 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 5 * 86400000).toISOString()
  },
  {
    id: 'cmp-13', astrologerId: 'a-5', campaignName: 'Palm & Face Reading', campaignCode: 'CMP-PF4-K9M',
    description: 'Comprehensive palmistry and face reading analysis',
    generalPrice: 199, individualPrice: 449, currency: 'INR', totalSlots: 50, soldSlots: 20, availableSlots: 30,
    generalQuestionLimit: 40, individualQuestionLimit: 10,
    generalSoldCount: 18, individualSoldCount: 2,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 48, status: 'active',
    categories: ['Palmistry', 'General'],
    languages: ['English', 'Tamil', 'Telugu'],
    startAt: new Date(now.getTime() - 12 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 18 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 13 * 86400000).toISOString()
  },
  {
    id: 'cmp-14', astrologerId: 'a-5', campaignName: 'Tarot Card Readings', campaignCode: 'CMP-TC8-W2P',
    description: 'Get guidance through tarot card readings for life decisions',
    generalPrice: 149, individualPrice: 349, currency: 'INR', totalSlots: 30, soldSlots: 8, availableSlots: 22,
    generalQuestionLimit: 25, individualQuestionLimit: 5,
    generalSoldCount: 7, individualSoldCount: 1,
    submissionMode: 'text', answerMode: 'text',
    deadlineHours: 48, status: 'active',
    categories: ['Tarot', 'General'],
    languages: ['English', 'Tamil'],
    startAt: new Date(now.getTime() - 6 * 86400000).toISOString(),
    endAt: new Date(now.getTime() + 24 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 7 * 86400000).toISOString()
  }
];

export const purchases = [
  {
    id: 'pur-1', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-1',
    purchaseCode: 'QP-K2M-L8N', price: 199, currency: 'INR',
    paymentStatus: 'paid', purchaseStatus: 'answered', variation: 'general',
    questionSubmitted: true, questionId: 'q-1',
    campaignName: 'Career & Finance Guidance', answerMode: 'text',
    expiresAt: new Date(now.getTime() + 5 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 3 * 86400000).toISOString()
  },
  {
    id: 'pur-2', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-2',
    purchaseCode: 'QP-X7J-H9W', price: 799, currency: 'INR',
    paymentStatus: 'paid', purchaseStatus: 'question_submitted', variation: 'individual',
    questionSubmitted: true, questionId: 'q-2',
    campaignName: 'Love & Relationship Answers', answerMode: 'voice',
    expiresAt: new Date(now.getTime() + 10 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 1 * 86400000).toISOString()
  },
  {
    id: 'pur-3', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-1',
    purchaseCode: 'QP-R5B-T3F', price: 199, currency: 'INR',
    paymentStatus: 'paid', purchaseStatus: 'question_pending', variation: 'general',
    questionSubmitted: false, questionId: null,
    campaignName: 'Career & Finance Guidance', answerMode: 'text',
    expiresAt: new Date(now.getTime() + 6 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 1 * 86400000).toISOString()
  },
  {
    id: 'pur-4', userId: 'u-1', astrologerId: 'a-1', campaignId: 'cmp-3',
    purchaseCode: 'QP-V9C-D2A', price: 149, currency: 'INR',
    paymentStatus: 'paid', purchaseStatus: 'disputed', variation: 'general',
    questionSubmitted: true, questionId: 'q-3',
    campaignName: 'Health & Wellness Horoscope', answerMode: 'text',
    expiresAt: new Date(now.getTime() + 2 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 5 * 86400000).toISOString()
  },
  {
    id: 'pur-5', userId: 'u-1', astrologerId: 'a-2', campaignId: 'cmp-6',
    purchaseCode: 'QP-L2M-K7N', price: 149, currency: 'INR',
    paymentStatus: 'paid', purchaseStatus: 'question_pending', variation: 'general',
    questionSubmitted: false, questionId: null,
    campaignName: 'Tamil Jothidam Premium', answerMode: 'text',
    expiresAt: new Date(now.getTime() + 7 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 2 * 86400000).toISOString()
  },
  {
    id: 'pur-6', userId: 'u-1', astrologerId: 'a-3', campaignId: 'cmp-9',
    purchaseCode: 'QP-N3J-K8M', price: 99, currency: 'INR',
    paymentStatus: 'paid', purchaseStatus: 'answered', variation: 'general',
    questionSubmitted: true, questionId: 'q-5',
    campaignName: 'Lucky Number Analysis', answerMode: 'text',
    expiresAt: new Date(now.getTime() + 4 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 4 * 86400000).toISOString()
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
    astrologerName: 'Dr. Arjun Nair',
    profile: { dateOfBirth: '1995-06-15', birthTime: '14:30', birthPlace: 'Mumbai, Maharashtra', rasi: 'Kanya', nakshatra: 'Uttara Phalguni', pada: 3, lagna: 'Mithuna', horoscopeNotes: 'Shani mahadasha running until 2027. Guru in 7th house indicates delay in marriage but positive outcome after Jupiter transit.' },
    attachments: [{ name: 'birth_chart.jpg', type: 'image/jpeg', size: 245760 }, { name: 'horoscope_notes.pdf', type: 'application/pdf', size: 512000 }]
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
  },
  {
    id: 'q-5', userId: 'u-1', astrologerId: 'a-3', campaignId: 'cmp-9', purchaseId: 'pur-6',
    questionCode: 'Q-N3J-K8M', questionType: 'general',
    category: 'Numerology', language: 'Hindi',
    title: 'Lucky number for business', questionText: 'Mera lucky number kya hai business ke liye? Main naya business start kar raha hoon.',
    status: 'answered', submittedAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
    dueAt: new Date(now.getTime()).toISOString(),
    campaignName: 'Lucky Number Analysis', answerMode: 'text',
    astrologerName: 'Rajesh Kumar'
  },
  {
    id: 'q-6', userId: 'u-1', astrologerId: 'a-2', campaignId: 'cmp-6', purchaseId: 'pur-5',
    questionCode: 'Q-TJ6-M3K', questionType: 'general',
    category: 'Career', language: 'Tamil',
    title: 'Career path change', questionText: 'Enakku job change pannanum. Enaku suitable ah irukka? Current IT job la satisfaction illa.',
    status: 'submitted', submittedAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
    dueAt: new Date(now.getTime() + 2 * 86400000).toISOString(),
    campaignName: 'Tamil Jothidam Premium', answerMode: 'text',
    astrologerName: 'Lakshmi Devi'
  },
  {
    id: 'q-7', userId: 'u-1', astrologerId: 'a-4', campaignId: 'cmp-11', purchaseId: null,
    questionCode: 'Q-KP2-H7N', questionType: 'general',
    category: 'Prashna', language: 'English',
    title: 'Should I buy a house now?', questionText: 'I have been looking at a property for 3 months. Is this the right time to buy based on KP principles?',
    status: 'submitted', submittedAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    dueAt: new Date(now.getTime() + 1 * 86400000).toISOString(),
    campaignName: 'KP Horary Questions', answerMode: 'text',
    astrologerName: 'Saraswati Iyer'
  }
];

export const answers = [
  {
    id: 'ans-1', questionId: 'q-1', astrologerId: 'a-1',
    answerMode: 'text', answerText: 'Dear Priya, based on your chart, Saturn in the 2nd house is actually forming a favorable aspect for long-term investments. I recommend waiting until mid-next month when Jupiter transits into a supportive position. Real estate investments initiated during that window (between 15th-22nd next month) will yield good returns over a 5-year horizon. Consider properties in the South-East direction.',
    voiceAnswerUrl: null, status: 'submitted',
    submittedAt: new Date(now.getTime() - 2 * 86400000 + 4 * 3600000).toISOString()
  },
  {
    id: 'ans-2', questionId: 'q-5', astrologerId: 'a-3',
    answerMode: 'text', answerText: 'Namaste! Based on your birth details analysis, your business number is 8. Mercury and Jupiter are favorably placed. I recommend wearing a Yellow Sapphire on your index finger on a Thursday morning. Your lucky days are Wednesday and Thursday. Business name should have a total numerological value of 8 or 3.',
    voiceAnswerUrl: null, status: 'submitted',
    submittedAt: new Date(now.getTime() - 3 * 86400000 + 6 * 3600000).toISOString()
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
  { id: 'wt-5', type: 'debit', amount: 199, description: 'Purchase from campaign: Health & Wellness Horoscope', status: 'completed', createdAt: new Date(now.getTime() - 5 * 86400000).toISOString() },
  { id: 'wt-6', type: 'debit', amount: 149, description: 'Purchase from campaign: Tamil Jothidam Premium', status: 'completed', createdAt: new Date(now.getTime() - 2 * 86400000).toISOString() },
  { id: 'wt-7', type: 'debit', amount: 99, description: 'Purchase from campaign: Lucky Number Analysis', status: 'completed', createdAt: new Date(now.getTime() - 4 * 86400000).toISOString() }
];

export const escrowRecords = [
  { id: 'esc-1', userId: 'u-1', astrologerId: 'a-1', serviceType: 'question_purchase', serviceId: 'pur-1', grossAmount: 299, platformCommission: 59.8, astrologerAmount: 239.2, status: 'held' },
  { id: 'esc-2', userId: 'u-1', astrologerId: 'a-1', serviceType: 'question_purchase', serviceId: 'pur-2', grossAmount: 499, platformCommission: 99.8, astrologerAmount: 399.2, status: 'held' },
  { id: 'esc-3', userId: 'u-1', astrologerId: 'a-1', serviceType: 'question_purchase', serviceId: 'pur-3', grossAmount: 299, platformCommission: 59.8, astrologerAmount: 239.2, status: 'held' },
  { id: 'esc-4', userId: 'u-1', astrologerId: 'a-1', serviceType: 'question_purchase', serviceId: 'pur-4', grossAmount: 199, platformCommission: 39.8, astrologerAmount: 159.2, status: 'on_hold_due_to_dispute' },
  { id: 'esc-5', userId: 'u-1', astrologerId: 'a-2', serviceType: 'question_purchase', serviceId: 'pur-5', grossAmount: 149, platformCommission: 29.8, astrologerAmount: 119.2, status: 'held' },
  { id: 'esc-6', userId: 'u-1', astrologerId: 'a-3', serviceType: 'question_purchase', serviceId: 'pur-6', grossAmount: 99, platformCommission: 19.8, astrologerAmount: 79.2, status: 'held' }
];

export const ratings = [
  { id: 'rat-1', questionId: 'q-1', userId: 'u-1', astrologerId: 'a-1', score: 4, feedback: 'Detailed and helpful analysis of my chart.', createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(), questionTitle: 'Investment timing', astrologerName: 'Dr. Arjun Nair' },
  { id: 'rat-2', questionId: 'q-5', userId: 'u-1', astrologerId: 'a-3', score: 5, feedback: 'Very accurate and helpful numerology guidance!', createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(), questionTitle: 'Lucky number for business', astrologerName: 'Rajesh Kumar' }
];

export const followUpQuestions = [
  {
    id: 'fuq-1', questionId: 'q-1', userId: 'u-1', astrologerId: 'a-1',
    followUpText: 'Thank you for the detailed answer. Could you suggest specific remedies or gemstones that would strengthen the beneficial planetary positions you mentioned?',
    status: 'submitted', submittedAt: new Date(now.getTime() - 12 * 3600000).toISOString(),
    originalQuestionTitle: 'Investment timing', astrologerName: 'Dr. Arjun Nair'
  }
];

export const astrologerSettingsMap = {
  'a-1': {
    id: 'as-1', astrologerId: 'a-1', displayName: 'Dr. Arjun Nair',
    title: 'Vedic Astrologer', bio: 'Over 15 years of experience in Vedic astrology, numerology, and vastu. I provide personalized guidance based on your birth chart with practical remedies.',
    profilePhoto: null, experienceYears: 15, specialties: ['Vedic Astrology', 'Numerology', 'Vastu', 'Muhurtha'],
    consultationLanguages: ['English', 'Hindi', 'Tamil', 'Malayalam'],
    maxDailyQuestions: 20, autoAcceptQuestions: true, instantAnswerEnabled: false,
    notificationPreferences: { email: true, sms: false, push: true },
    bankAccount: { accountHolder: 'Arjun Nair', bankName: 'State Bank of India', accountNumber: 'XXXX-XXXX-4521', ifsc: 'SBIN00XXXX' },
    updatedAt: new Date(now.getTime() - 10 * 86400000).toISOString()
  },
  'a-2': {
    id: 'as-2', astrologerId: 'a-2', displayName: 'Lakshmi Devi',
    title: 'Tamil Astrologer', bio: 'Traditional Tamil astrologer with 20+ years of experience in Jothidam, palmistry, and vastu. Expert in horoscope matching and marriage compatibility.',
    profilePhoto: null, experienceYears: 20, specialties: ['Tamil Astrology', 'Palmistry', 'Muhurtha', 'Vastu'],
    consultationLanguages: ['Tamil', 'Telugu'],
    maxDailyQuestions: 15, autoAcceptQuestions: true, instantAnswerEnabled: false,
    notificationPreferences: { email: true, sms: true, push: false },
    bankAccount: { accountHolder: 'Lakshmi Devi', bankName: 'Indian Bank', accountNumber: 'XXXX-XXXX-7834', ifsc: 'IDIB00XXXX' },
    updatedAt: new Date(now.getTime() - 8 * 86400000).toISOString()
  },
  'a-3': {
    id: 'as-3', astrologerId: 'a-3', displayName: 'Rajesh Kumar',
    title: 'Numerologist & Gemstone Expert', bio: 'Certified numerologist and gemstone advisor. Helping people find their path through numbers and cosmic energies.',
    profilePhoto: null, experienceYears: 10, specialties: ['Numerology', 'Gemstone Advisory', 'Vastu'],
    consultationLanguages: ['English', 'Hindi', 'Marathi'],
    maxDailyQuestions: 25, autoAcceptQuestions: false, instantAnswerEnabled: true,
    notificationPreferences: { email: true, sms: false, push: true },
    bankAccount: { accountHolder: 'Rajesh Kumar', bankName: 'HDFC Bank', accountNumber: 'XXXX-XXXX-2190', ifsc: 'HDFC00XXXX' },
    updatedAt: new Date(now.getTime() - 5 * 86400000).toISOString()
  },
  'a-4': {
    id: 'as-4', astrologerId: 'a-4', displayName: 'Saraswati Iyer',
    title: 'KP Astrologer', bio: 'Expert in Krishnamurti Paddhati (KP) astrology and Prashna Marga. Providing accurate predictions and auspicious timing for important events.',
    profilePhoto: null, experienceYears: 12, specialties: ['KP Astrology', 'Muhurtha', 'Prashna'],
    consultationLanguages: ['English', 'Hindi', 'Tamil'],
    maxDailyQuestions: 18, autoAcceptQuestions: true, instantAnswerEnabled: false,
    notificationPreferences: { email: true, sms: false, push: true },
    bankAccount: { accountHolder: 'Saraswati Iyer', bankName: 'ICICI Bank', accountNumber: 'XXXX-XXXX-5567', ifsc: 'ICIC00XXXX' },
    updatedAt: new Date(now.getTime() - 6 * 86400000).toISOString()
  },
  'a-5': {
    id: 'as-5', astrologerId: 'a-5', displayName: 'Master Venkat',
    title: 'Vedic Astrologer & Palmist', bio: 'Master Venkat offers Vedic astrology, palmistry, and tarot readings. Over 8 years of experience guiding people through life decisions.',
    profilePhoto: null, experienceYears: 8, specialties: ['Palmistry', 'Vedic Astrology', 'Tarot'],
    consultationLanguages: ['English', 'Tamil', 'Telugu'],
    maxDailyQuestions: 12, autoAcceptQuestions: false, instantAnswerEnabled: false,
    notificationPreferences: { email: true, sms: true, push: true },
    bankAccount: { accountHolder: 'Venkatachalam', bankName: 'Canara Bank', accountNumber: 'XXXX-XXXX-8901', ifsc: 'CNRB00XXXX' },
    updatedAt: new Date(now.getTime() - 4 * 86400000).toISOString()
  }
};

export const salesDataMap = {
  'a-1': {
    astrologerId: 'a-1',
    totalEarnings: 45820, totalCommissionPaid: 9164, netPayout: 36656,
    currentMonthEarnings: 8720, currentMonthCommission: 1744, currentMonthNet: 6976,
    totalPurchases: 57, totalQuestionsAnswered: 52, averageRating: 4.5,
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
  },
  'a-2': {
    astrologerId: 'a-2', totalEarnings: 28700, totalCommissionPaid: 5740, netPayout: 22960,
    currentMonthEarnings: 5200, currentMonthCommission: 1040, currentMonthNet: 4160,
    totalPurchases: 33, totalQuestionsAnswered: 30, averageRating: 4.8,
    campaignWise: [
      { campaignName: 'Tamil Jothidam Premium', sold: 25, revenue: 3725, commission: 745, net: 2980, answered: 22 },
      { campaignName: 'Palm Reading Insights', sold: 8, revenue: 2392, commission: 478.4, net: 1913.6, answered: 8 }
    ],
    monthlyEarnings: [
      { month: 'Jan', earnings: 1800, answered: 12 },
      { month: 'Feb', earnings: 3200, answered: 18 },
      { month: 'Mar', earnings: 4500, answered: 25 },
      { month: 'Apr', earnings: 5200, answered: 30 },
      { month: 'May', earnings: 5800, answered: 35 },
      { month: 'Jun', earnings: 5200, answered: 28 }
    ],
    payoutHistory: [
      { id: 'po-a2-1', period: 'Jun 1-15', gross: 2800, commission: 560, net: 2240, status: 'paid', paidAt: '2026-06-20' },
      { id: 'po-a2-2', period: 'Jun 16-30', gross: 2400, commission: 480, net: 1920, status: 'pending', paidAt: null }
    ]
  },
  'a-3': {
    astrologerId: 'a-3', totalEarnings: 19300, totalCommissionPaid: 3860, netPayout: 15440,
    currentMonthEarnings: 4200, currentMonthCommission: 840, currentMonthNet: 3360,
    totalPurchases: 52, totalQuestionsAnswered: 48, averageRating: 4.2,
    campaignWise: [
      { campaignName: 'Lucky Number Analysis', sold: 40, revenue: 3960, commission: 792, net: 3168, answered: 38 },
      { campaignName: 'Name Numerology Report', sold: 12, revenue: 2388, commission: 477.6, net: 1910.4, answered: 10 }
    ],
    monthlyEarnings: [
      { month: 'Jan', earnings: 1500, answered: 10 },
      { month: 'Feb', earnings: 2400, answered: 16 },
      { month: 'Mar', earnings: 3100, answered: 22 },
      { month: 'Apr', earnings: 3800, answered: 28 },
      { month: 'May', earnings: 4300, answered: 34 },
      { month: 'Jun', earnings: 4200, answered: 30 }
    ],
    payoutHistory: [
      { id: 'po-a3-1', period: 'Jun 1-15', gross: 2200, commission: 440, net: 1760, status: 'paid', paidAt: '2026-06-20' },
      { id: 'po-a3-2', period: 'Jun 16-30', gross: 2000, commission: 400, net: 1600, status: 'pending', paidAt: null }
    ]
  },
  'a-4': {
    astrologerId: 'a-4', totalEarnings: 12500, totalCommissionPaid: 2500, netPayout: 10000,
    currentMonthEarnings: 3800, currentMonthCommission: 760, currentMonthNet: 3040,
    totalPurchases: 20, totalQuestionsAnswered: 18, averageRating: 4.6,
    campaignWise: [
      { campaignName: 'KP Horary Questions', sold: 15, revenue: 3735, commission: 747, net: 2988, answered: 13 },
      { campaignName: 'Muhurtha & Auspicious Timing', sold: 5, revenue: 1745, commission: 349, net: 1396, answered: 5 }
    ],
    monthlyEarnings: [
      { month: 'Feb', earnings: 1800, answered: 8 },
      { month: 'Mar', earnings: 2500, answered: 12 },
      { month: 'Apr', earnings: 3200, answered: 15 },
      { month: 'May', earnings: 3800, answered: 18 },
      { month: 'Jun', earnings: 3200, answered: 14 }
    ],
    payoutHistory: [
      { id: 'po-a4-1', period: 'Jun 1-15', gross: 1800, commission: 360, net: 1440, status: 'paid', paidAt: '2026-06-20' }
    ]
  },
  'a-5': {
    astrologerId: 'a-5', totalEarnings: 9800, totalCommissionPaid: 1960, netPayout: 7840,
    currentMonthEarnings: 2800, currentMonthCommission: 560, currentMonthNet: 2240,
    totalPurchases: 28, totalQuestionsAnswered: 25, averageRating: 4.3,
    campaignWise: [
      { campaignName: 'Palm & Face Reading', sold: 20, revenue: 3980, commission: 796, net: 3184, answered: 18 },
      { campaignName: 'Tarot Card Readings', sold: 8, revenue: 1192, commission: 238.4, net: 953.6, answered: 7 }
    ],
    monthlyEarnings: [
      { month: 'Mar', earnings: 1200, answered: 6 },
      { month: 'Apr', earnings: 2200, answered: 11 },
      { month: 'May', earnings: 2800, answered: 15 },
      { month: 'Jun', earnings: 2600, answered: 13 }
    ],
    payoutHistory: [
      { id: 'po-a5-1', period: 'Jun 1-15', gross: 1400, commission: 280, net: 1120, status: 'paid', paidAt: '2026-06-20' },
      { id: 'po-a5-2', period: 'Jun 16-30', gross: 1200, commission: 240, net: 960, status: 'pending', paidAt: null }
    ]
  }
};

export const platformStats = {
  totalUsers: 2847, totalAstrologers: 46, totalQuestionsAsked: 12580, totalQuestionsAnswered: 11240,
  totalRevenue: 1845900, totalCommissionCollected: 369180, averageResolutionTimeHours: 18.5,
  activeCampaigns: 38, pendingReviews: 5, openDisputes: 3,
  monthlyRevenue: [
    { month: 'Jan', revenue: 240000, questions: 1800 },
    { month: 'Feb', revenue: 285000, questions: 2100 },
    { month: 'Mar', revenue: 310000, questions: 2300 },
    { month: 'Apr', revenue: 365000, questions: 2600 },
    { month: 'May', revenue: 398000, questions: 2900 },
    { month: 'Jun', revenue: 247900, questions: 1880 }
  ],
  topAstrologers: [
    { id: 'a-1', name: 'Dr. Arjun Nair', revenue: 45820, rating: 4.5, questionsAnswered: 520 },
    { id: 'a-2', name: 'Lakshmi Devi', revenue: 28700, rating: 4.8, questionsAnswered: 380 },
    { id: 'a-3', name: 'Rajesh Kumar', revenue: 19300, rating: 4.2, questionsAnswered: 245 },
    { id: 'a-4', name: 'Saraswati Iyer', revenue: 12500, rating: 4.6, questionsAnswered: 180 },
    { id: 'a-5', name: 'Master Venkat', revenue: 9800, rating: 4.3, questionsAnswered: 140 }
  ]
};

export const platformDisputeSummary = {
  total: 8, open: 3, astrologer_reviewing: 1, escalated: 1, resolved: 2, refunded: 1
};

const raasiOptions = ['Mesha', 'Vrishabha', 'Mithuna', 'Kataka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanus', 'Makara', 'Kumbha', 'Meena'];
const nakshatraOptions = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];

export const astrologyProfiles = [
  {
    id: 'ap-1', userId: 'u-1', profileName: 'Myself', relationship: 'self',
    gender: 'female', dateOfBirth: '1994-08-15', birthTime: '06:45', birthPlace: 'Chennai, Tamil Nadu',
    latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata',
    rasi: 'Simha', nakshatra: 'Uttara Phalguni', pada: 3, lagna: 'Kanya',
    isDefault: true, createdAt: new Date(now.getTime() - 90 * 86400000).toISOString()
  },
  {
    id: 'ap-2', userId: 'u-1', profileName: 'My Mother', relationship: 'mother',
    gender: 'female', dateOfBirth: '1972-03-22', birthTime: '14:20', birthPlace: 'Madurai, Tamil Nadu',
    latitude: 9.9252, longitude: 78.1198, timezone: 'Asia/Kolkata',
    rasi: 'Mithuna', nakshatra: 'Punarvasu', pada: 1, lagna: 'Kataka',
    isDefault: false, createdAt: new Date(now.getTime() - 45 * 86400000).toISOString()
  },
  {
    id: 'ap-3', userId: 'u-1', profileName: 'My Son', relationship: 'son',
    gender: 'male', dateOfBirth: '2020-11-05', birthTime: '09:15', birthPlace: 'Bangalore, Karnataka',
    latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata',
    rasi: 'Tula', nakshatra: 'Swati', pada: 4, lagna: 'Dhanus',
    isDefault: false, createdAt: new Date(now.getTime() - 20 * 86400000).toISOString()
  }
];

function buildAstrologerTransactions(sales) {
  const txs = [];
  sales.monthlyEarnings.forEach((m, i) => {
    txs.push({ id: `awt-${sales.astrologerId}-earn-${i+1}`, type: 'credit', amount: m.earnings, description: `Monthly earnings - ${m.month}`, status: 'completed', createdAt: new Date(2026, i, 28).toISOString() });
  });
  sales.payoutHistory.forEach((p, i) => {
    txs.push({ id: `awt-${sales.astrologerId}-payout-${i+1}`, type: 'debit', amount: p.net, description: `Payout: ${p.period}`, status: p.status === 'paid' ? 'completed' : 'pending', createdAt: p.paidAt ? new Date(p.paidAt).toISOString() : new Date().toISOString() });
  });
  sales.campaignWise.forEach((c, i) => {
    const share = c.revenue * 0.8;
    txs.push({ id: `awt-${sales.astrologerId}-camp-${i+1}`, type: 'credit', amount: Math.round(share), description: `Earnings from "${c.campaignName}" (${c.answered} answered)`, status: 'completed', createdAt: new Date(2026, 5, 15).toISOString() });
  });
  txs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return txs;
}

export const astrologerWallets = {
  'a-1': { id: 'wal-a-1', ownerType: 'astrologer', ownerId: 'a-1', availableBalance: 6976, totalEarned: 45820, totalWithdrawn: 9164, currency: 'INR' },
  'a-2': { id: 'wal-a-2', ownerType: 'astrologer', ownerId: 'a-2', availableBalance: 4160, totalEarned: 28700, totalWithdrawn: 5740, currency: 'INR' },
  'a-3': { id: 'wal-a-3', ownerType: 'astrologer', ownerId: 'a-3', availableBalance: 3360, totalEarned: 19300, totalWithdrawn: 3860, currency: 'INR' },
  'a-4': { id: 'wal-a-4', ownerType: 'astrologer', ownerId: 'a-4', availableBalance: 3040, totalEarned: 12500, totalWithdrawn: 2500, currency: 'INR' },
  'a-5': { id: 'wal-a-5', ownerType: 'astrologer', ownerId: 'a-5', availableBalance: 2240, totalEarned: 9800, totalWithdrawn: 1960, currency: 'INR' },
};

export const astrologerWalletTransactions = Object.fromEntries(
  Object.entries(salesDataMap).map(([id, sales]) => [id, buildAstrologerTransactions(sales)])
);

export const raasiList = raasiOptions;
export const nakshatraList = nakshatraOptions;
export const relationshipOptions = ['self', 'father', 'mother', 'son', 'daughter', 'spouse', 'sibling', 'friend', 'other'];
