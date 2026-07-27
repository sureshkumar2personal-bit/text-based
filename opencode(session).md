# AstroEvalution — Text-Based Questions

> Complete session context for continuing development. Hand this file to any CLI AI to enable it to understand the full codebase and build new features.

---

## Project Overview

**What:** A mock UI for an astrology Q&A platform where users purchase question slots from astrologers via campaigns, submit questions (text + voice), and receive answers.

**Stack:** React 18 + Vite 5 + Tailwind CSS v4 (PostCSS plugin) + vanilla CSS. No backend, no TypeScript.

**State:** All state persisted in `localStorage` via custom `useLocalState` hook. No API calls.

**User ID:** Hardcoded `userId: 'u-1'` (Priya Sharma) across all user-facing components.

---

## Directory Structure

```
Text-based-questions/
├── package.json
├── vite.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx                         # ReactDOM render with providers
    ├── index.css                        # Global styles (1200+ lines, dark theme, animations)
    ├── App.jsx                          # Actor switcher, tab router, provider wrapper
    ├── hooks/
    │   └── useLocalState.js             # useState + localStorage persistence
    ├── contexts/
    │   ├── ThemeContext.jsx             # Dark/light theme toggle
    │   ├── ToastContext.jsx             # Toast notifications
    │   └── NotificationContext.jsx      # In-app notification system (per-role)
    ├── data/
    │   ├── mockData.js                  # All mock data (1008 lines)
    │   └── DataContext.jsx              # Central state manager (291 lines, ~30 operations)
    └── components/
        ├── AuthScreen.jsx               # Unused login screen
        ├── ui/                          # Shared UI primitives
        │   ├── AnimatedCounter.jsx
        │   ├── Avatar.jsx
        │   ├── Confetti.jsx
        │   ├── ModalPortal.jsx
        │   ├── NotificationBell.jsx     # Per-role notification dropdown
        │   ├── Skeleton.jsx
        │   ├── ThemeToggle.jsx
        │   └── WalletView.jsx
        ├── user/                         # User (customer) views
        │   ├── UserDashboard.jsx
        │   ├── UserQuestions.jsx         # ★ MERGED: purchases + questions + buy flow
        │   ├── UserAskQuestion.jsx       # ★ UPDATED: live audio recorder
        │   ├── UserTracking.jsx
        │   ├── UserWallet.jsx
        │   ├── UserRaiseDispute.jsx
        │   ├── UserDisputeTracking.jsx
        │   ├── UserAstrologyProfiles.jsx
        │   ├── UserRatings.jsx
        │   └── UserPurchase.jsx          # DEAD CODE — no longer imported
        ├── astrologer/                   # Astrologer views
        │   ├── AstroCampaigns.jsx
        │   ├── AstroQueue.jsx
        │   ├── AstroSales.jsx
        │   ├── AstroDisputes.jsx
        │   ├── AstroProfile.jsx
        │   ├── AstroAnalytics.jsx
        │   └── AstroWallet.jsx
        └── platform/                     # Platform operator views
            ├── PlatformDashboard.jsx
            ├── PlatformCampaigns.jsx     # ★ UPDATED: approve/reject buttons
            ├── PlatformDisputes.jsx
            └── TransactionLogs.jsx       # ★ UPDATED: payout processing tab
```

---

## Three Actors (Roles)

Each actor has their own tab bar, notification bell, and set of views. Switch between them using the actor bar at the top.

| Actor | Tabs | ID |
|-------|------|-----|
| **User** (customer) | Dashboard, My Questions, Ask Question, Wallet, Tracking, Raise Dispute, Dispute Tracking, My Profile, Ratings | `u-1` |
| **Astrologer** (seller) | Campaigns, Question Queue, Sales, Disputes, Wallet, My Profile, Analytics | `a-1` to `a-15` |
| **Platform** (admin) | Dashboard, Campaigns, Disputes, Transactions | `adm-1` |

---

## Tab Routing (App.jsx)

Tabs are defined in `TABS` object. The `AppContent` component switches views based on `actor` + `tab` state.

Key navigation props passed to components:
- `onNavigate(tab, filter, preselectId)` — navigate to a tab with optional filter/preselection
- `onPurchaseSuccess` — triggers confetti animation
- `filter` — passed to components for filtered views (e.g., 'unused', 'answered', 'pending')
- `preselectId` — auto-select a purchase when navigating to Ask Question

---

## Data Model (mockData.js)

### Core Entities

**`actors`** — Static user/astrologer/platform profiles
```
user: { id: 'u-1', fullName, email, mobile }
astrologer: { id: 'a-1', displayName, title, rating, reviewCount }
platform: { id: 'adm-1', fullName, role }
```

**`allAstrologers[]`** — 15 astrologers (a-1 to a-15), each with:
```
{ id, displayName, title, email, rating, reviewCount, campaignsCount, totalRevenue, specialties[] }
```

**`campaigns[]`** — 34 campaigns (cmp-1 to cmp-34), each with:
```
{ id, astrologerId, campaignName, campaignCode, description,
  generalPrice, individualPrice, currency, totalSlots, soldSlots, availableSlots,
  generalQuestionLimit, individualQuestionLimit, generalSoldCount, individualSoldCount,
  submissionMode, answerMode, deadlineHours, status, categories[], languages[],
  startAt, endAt, createdAt }
```
Status: `draft` | `active` | `paused` | `stopped` | `rejected`

**`purchases[]`** — 6 purchases (pur-1 to pur-6), each with:
```
{ id, userId, astrologerId, campaignId, purchaseCode, price, currency,
  paymentStatus, purchaseStatus, variation, questionSubmitted, questionId,
  campaignName, answerMode, expiresAt, createdAt }
```
purchaseStatus: `question_pending` | `question_submitted` | `answered` | `disputed`
variation: `general` | `individual`

**`questions[]`** — 7 questions (q-1 to q-7), each with:
```
{ id, userId, astrologerId, campaignId, purchaseId, questionCode,
  questionType, category, language, title, questionText,
  status, submittedAt, dueAt, campaignName, answerMode, astrologerName,
  profile?, attachments[]?, voiceNote? }
```
Status: `submitted` | `under_review` | `received_by_astrologer` | `answered` | `disputed`

**`disputes[]`** — Dispute records with status: `open` | `astrologer_reviewing` | `astrologer_responded` | `escalated` | `resolved` | `refunded`

**`disputeMessages[]`** — Threaded messages on disputes, each with: `{ id, disputeId, senderType, senderId, senderName, message, createdAt }`

**`wallet`** — User wallet: `{ availableBalance, currency }`

**`walletTransactions[]`** — User wallet transactions (credit/debit)

**`escrowRecords[]`** — Payment escrow tracking: `{ status: 'held' | 'released' | 'refunded' | 'on_hold_due_to_dispute' }`

**`astrologerWallets{}`** — Per-astrologer wallets keyed by astrologerId: `{ availableBalance, totalEarned, totalWithdrawn }`

**`astrologerWalletTxMap{}`** — Per-astrologer wallet transactions keyed by astrologerId

**`astrologyProfiles[]`** — User's saved birth chart profiles

**`ratings[]`** — User ratings on answered questions

---

## DataContext Operations

All mutations go through `DataContext`. Import via `const { ... } = useData();`

### Campaign Operations
- `updateCampaign(cId, updates)` — merge updates into campaign
- `addCampaign(camp)` — prepend new campaign
- `deleteCampaign(cId)` — remove campaign by ID

### Purchase Operations
- `addPurchase(campaign, variation)` — create purchase, decrement availableSlots, update soldCounts
- `addTransaction(type, amount, description)` — add user wallet transaction

### Question Operations
- `addQuestion(data)` — create question, mark purchase as question_submitted
- `updateQuestionStatus(qId, status)` — change question status

### Answer Operations
- `addAnswer(qId, answerMode, answerText, voiceUrl)` — submit answer, update question + purchase status

### Dispute Operations
- `addDispute(data)` — create dispute, update question status to 'disputed', add initial message
- `updateDisputeStatus(dId, updates)` — merge updates into dispute
- `addDisputeMessage(disputeId, senderType, senderId, senderName, message)` — add thread message
- `acceptDisputeReanswer(questionId, dId)` — accept dispute, return question to queue

### Profile Operations
- `addAstrologyProfile(profile)` / `updateAstrologyProfile(pId, updates)` / `deleteAstrologyProfile(pId)` / `setDefaultProfile(pId)`

### Wallet Operations
- `walletTopUp(amount)` — add funds to user wallet
- `addAstrologerTransaction(astrologerId, type, amount, description)` — credit/debit astrologer wallet

### Ratings
- `addRating(data)` — save user rating for answered question

### Follow-Up
- `addFollowUpQuestion(data)` — add follow-up question

### Astrologer Settings
- `updateAstroSettings(astrologerId, updates)` — update astrologer profile/settings

---

## Notification System

### NotificationContext (`src/contexts/NotificationContext.jsx`)

**NOTIF_TYPES** — 16 predefined types with icon + color:
```js
PURCHASE_SUCCESS, QUESTION_SUBMITTED, QUESTION_ANSWERED,
DISPUTE_RAISED, DISPUTE_ESCALATED, DISPUTE_RESOLVED,
CAMPAIGN_ACTIVATED, CAMPAIGN_PAUSED, CAMPAIGN_STOPPED,
CAMPAIGN_REVIEW, CAMPAIGN_APPROVED, CAMPAIGN_REJECTED,
NEW_QUEUE_ITEM, PAYOUT_REQUESTED, RATING_RECEIVED, WALLET_TOPUP
```

**API:**
```js
addNotification(type, title, message, targetRole, navigateTo)
```
- `targetRole`: `'user'` | `'astrologer'` | `'platform'` (or array for multiple)
- `navigateTo`: `{ tab: 'questions' }` — auto-navigates on click

**NotificationBell** (`src/components/ui/NotificationBell.jsx`):
- Filters by `n.targetRole === actor`
- Shows unread count badge
- Click → marks read + navigates to linked tab

### Notification Inventory (who gets notified for what)

| Action | User | Astrologer | Platform |
|--------|------|-----------|----------|
| User buys slot | ✅ Slot Purchased | ✅ New Slot Purchase | |
| User subscribes to astrologer | ✅ Astrologer Subscribed | | |
| User submits question | | ✅ New Question | |
| User raises dispute | | ✅ Dispute Raised | |
| User sends dispute message | | ✅ New Message on Dispute | ✅ New Message on Dispute |
| User escalates dispute | | | ✅ Dispute Escalated |
| User rates answer | | ✅ Rating Received | |
| User tops up wallet | ✅ Wallet Top-Up | | |
| Astrologer answers question | ✅ Question Answered | | |
| Astrologer creates campaign | | ✅ (draft) | ✅ Campaign Needs Review |
| Astrologer edits campaign | | | ✅ Campaign Updated |
| Astrologer activates campaign | ✅ New Campaign Available | ✅ Campaign Activated | |
| Astrologer pauses campaign | ✅ Campaign Paused | ✅ Campaign Paused | |
| Astrologer stops campaign | ✅ Campaign Stopped | ✅ Campaign Stopped | |
| Astrologer deletes campaign | | | ✅ Campaign Deleted |
| Astrologer marks dispute reviewing | ✅ Dispute Being Reviewed | | |
| Astrologer accepts dispute | ✅ Dispute Accepted | | |
| Astrologer rejects dispute | ✅ Dispute Rejected | | ✅ Dispute Escalated |
| Astrologer sends dispute response | ✅ Dispute Response | | |
| Astrologer requests payout | | ✅ Payout Requested | ✅ Payout Requested |
| Platform approves campaign | ✅ New Campaign Available | ✅ Campaign Approved | |
| Platform rejects campaign | | ✅ Campaign Rejected | |
| Platform sends dispute message | ✅ Platform Message on Dispute | ✅ Platform Message on Dispute | |
| Platform resolves dispute | ✅ Dispute Resolved | ✅ Dispute Resolved | |
| Platform processes payout | | ✅ Payout Processed | |

---

## Session Changes (What Was Built)

### 1. Merged Purchase Tab into My Questions (UserQuestions.jsx)

**Before:** Separate "Purchase" tab (`UserPurchase.jsx`) and "My Questions" tab.
**After:** Single "My Questions" tab with inline purchase flow.

**Changes:**
- `App.jsx` — Removed `purchase` tab from user tabs array, removed `UserPurchase` import
- `UserQuestions.jsx` — Rewrote with 3 views: list (purchases + questions + "Buy New Slot" button), purchase flow, and success screen
- `UserDashboard.jsx` — "Buy a Question Slot" button now navigates to `questions` tab
- `AstroCampaigns.jsx` — Updated notification `navigateTo` refs from `tab: 'purchase'` to `tab: 'questions'`
- `UserPurchase.jsx` — Now dead code (not imported, can be deleted)

### 2. Added 10 New Astrologers + 20 Campaigns (mockData.js)

**Before:** 5 astrologers, 14 campaigns.
**After:** 15 astrologers, 34 campaigns.

**New astrologers (a-6 to a-15):** Dr. Meena Gupta, Pandit Ravi Shankar, Anjali Menon, Swami Prakash Das, Farida Khan, Guruji Srinivas, Neha Kapoor, Acharya Balaji, Dr. Sunita Rao, Iyer Balasubramaniam

**New campaigns (cmp-15 to cmp-34):** Two per new astrologer, covering Vedic, Tarot, Nadi, Lal Kitab, Vastu, Western, KP, Medical, Tamil Jyotish specialties.

### 3. Two-Section Astrologer Layout in Purchase Flow (UserQuestions.jsx)

**Before:** Single flat list of all astrologers under "Choose an Astrologer".
**After:** Two sections:
- **"Astrologers (subscribe)"** — First 5 astrologers (base set) + any newly subscribed ones. Blue count badge.
- **"Suggested Astrologers"** — Remaining 10 astrologers. Purple count badge.

### 4. Subscribe Flow for Suggested Astrologers (UserQuestions.jsx)

**Before:** All astrologers behave the same — click → campaigns → buy.
**After:**
- Click a **subscribed astrologer** → campaigns appear immediately
- Click a **suggested astrologer** → golden-themed **Subscribe panel** appears with:
  - Astrologer details (avatar, name, title, rating, reviews, specialties)
  - "Subscribe is free" message
  - "🔔 Subscribe" button with loading state
  - "Cancel" button
- After subscribing → astrologer moves to "Astrologers (subscribe)" → campaigns appear
- Subscription persisted in `localStorage` via `useLocalState('user-subscribed-astrologers', [])`
- Subscriptions reset on page refresh? No — `useLocalState` persists.

### 5. Live Audio Recorder (UserAskQuestion.jsx)

**Before:** Dead `<input>` with placeholder URL for voice file.
**After:** Full in-browser audio recorder using `MediaRecorder` API:
- "🎙️ Start Recording" button → requests mic permission
- Recording state: pulsing red dot, live timer (MM:SS), "⏹ Stop" button
- After recording: `<audio>` player with controls, "🔄 Re-record", "🗑 Delete" buttons
- Voice note attached to question submission as `voiceNote: { name, type, size }`
- Shown in success screen after submission
- Recording state resets when selecting a new purchase
- Blob URLs cleaned up on unmount

**CSS added:** `@keyframes pulse` animation in `index.css`

### 6. Complete Notification Coverage (6 files)

**Before:** 10+ actions had no notifications. Some actors were left uninformed of critical events.
**After:** All state-changing actions now notify relevant actors.

**Simple additions (4 files):**
- `AstroCampaigns.jsx` — Edit → platform, Pause → user, Stop → user, Delete → platform
- `AstroDisputes.jsx` — Mark reviewing → user
- `UserDisputeTracking.jsx` — Send dispute message → astrologer + platform
- `PlatformDisputes.jsx` — Send dispute message → user + astrologer

**New features (2 files):**
- `PlatformCampaigns.jsx` — **Approve/Reject buttons** for draft campaigns with notifications (approve → astrologer + user, reject → astrologer). Campaign rejected status added.
- `TransactionLogs.jsx` — **"Astrologer Payouts" tab** with Process Payout button per astrologer. Shows total earned, withdrawn, available balance. Payout notification → astrologer.

---

## Code Conventions

### Component Pattern
```jsx
export default function ComponentName({ prop1, prop2 }) {
  const { data, operations } = useData();
  const toast = useToast();
  const { addNotification } = useNotifications();
  // state, handlers, render
}
```

### Styling
- **CSS classes:** `.card`, `.card-gradient-border`, `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-sm`, `.btn-glow`, `.btn-success`, `.btn-danger`, `.btn-outline`, `.tag`, `.tag-green`, `.tag-blue`, `.tag-purple`, `.tag-yellow`, `.tag-red`, `.tag-gray`, `.row`, `.grid`, `.form-group`, `.stat-pill`, `.value-up`, `.value-down`, `.table-wrap`
- **Inline styles** used extensively for component-specific styling
- **CSS variables:** `--bg-card`, `--bg-elevated`, `--text-muted`, `--text-on-elevated`, `--line`, `--purple`, `--gold`, `--ink`, `--pale`, `--glass-border`, `--shadow-lg`, `--radius-md`
- **Gradients:** `linear-gradient(135deg, #5b3da0, #c084fc)` for purple theme, `linear-gradient(135deg, #c9a84c, #e8c84a, #f7e07a, #e8c84a)` for gold buttons
- **Dark theme** supported via CSS variables and ThemeContext

### ID Generation
```js
`cmp-${Date.now()}`     // campaigns
`q-${Date.now()}`       // questions
`pur-${Date.now()}`     // purchases
`disp-${Date.now()}`    // disputes
`dm-${Date.now()}`      // dispute messages
`ans-${Date.now()}`     // answers
`po-${Date.now()}`      // payouts
```

### Code Style
- **No comments** in code (user preference)
- **No TypeScript** — plain JSX with inline styles
- **No external UI library** — all custom components
- **`setTimeout`** used to simulate async operations (800-1200ms delays)
- **`window.confirm()`** used for destructive actions (delete)
- **Toast messages** for success/error/info feedback
- **Notifications** for cross-actor communication

### Data Filtering Pattern
```js
// Always filter by hardcoded user ID
const myPurchases = purchases.filter(p => p.userId === 'u-1');
const myQuestions = questions.filter(q => q.userId === 'u-1');
// Astrologer views receive astrologerId as prop
const myCampaigns = campaigns.filter(c => c.astrologerId === astrologerId);
```

---

## Build & Run

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

Build command: `vite build` — always run this to verify changes compile without errors.

---

## Known Issues / Dead Code

- `UserPurchase.jsx` — No longer imported. Can be deleted.
- `AuthScreen.jsx` — Unused login screen. Not imported.
- `UserAskQuestion.jsx` line 110 — References "Go to the Purchase tab" but purchase tab no longer exists (should say "My Questions tab").
- `PlatformCampaigns.jsx` — New `rejected` status not in the original `STATUS_MAP` for other components.

---

## Mock Data Statistics

| Entity | Count | IDs |
|--------|-------|-----|
| Astrologers | 15 | a-1 to a-15 |
| Campaigns | 34 | cmp-1 to cmp-34 |
| Purchases | 6 | pur-1 to pur-6 |
| Questions | 7 | q-1 to q-7 |
| Answers | — | In answers array |
| Disputes | — | In disputes array |
| Wallet balance | ₹4,965 | User wallet |
| Escrow records | — | In escrowRecords array |
