# كفيل · Kafil — UI/UX Design Specification
### Milestone-Based Escrow & Peer Arbitration for Arab Freelancers
#### SalamHack 2026 · Fintech Track 2 · Freelancers & SMBs

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design System](#2-design-system)
3. [Information Architecture](#3-information-architecture)
4. [User Flows](#4-user-flows)
5. [Screen-by-Screen Breakdown](#5-screen-by-screen-breakdown)
6. [Component Library](#6-component-library)
7. [Microinteractions & Motion](#7-microinteractions--motion)
8. [Accessibility & RTL Strategy](#8-accessibility--rtl-strategy)
9. [AI Feature UX](#9-ai-feature-ux)
10. [Mobile Experience](#10-mobile-experience)
11. [Error States & Edge Cases](#11-error-states--edge-cases)
12. [Design Decisions Log](#12-design-decisions-log)

---

## 1. Design Philosophy

### 1.1 Core Principle: Trust Made Visible

Kafil's entire reason for existence is **trust** — trust that funds are safe, trust that rates are fair, trust that disputes will be resolved. Every design decision must reinforce this, not just functionally, but emotionally.

> **Design Mantra:** *"What you see is exactly what you get. Always."*

### 1.2 The Three Pillars

| Pillar | What It Means Visually |
|--------|----------------------|
| 🔒 **Transparency** | No hidden states. Every stakeholder sees their relevant truth in full color. Budget breakdowns are presented as clean, scannable cards — never buried in tables. |
| ⚡ **Clarity** | Every screen answers one question: *"What do I need to do right now?"* Single primary CTA per screen. Zero decision fatigue. |
| 🤝 **Dignity** | Arab freelancers are professionals, not gig workers. The UI uses clean, editorial aesthetics — not the cluttered dashboards of generic SaaS. |

### 1.3 Emotional Design Goals

```
When a sub-freelancer opens their invite:
  → They feel RESPECTED (they can see their exact allocation)
  → They feel PROTECTED (escrow badge is prominent)
  → They feel INFORMED (fairness score is right there)

When a client creates a project:
  → They feel IN CONTROL (milestone tracker is visual and clear)
  → They feel CONFIDENT (they see every allocation before approving)

When a dispute is filed:
  → They feel HEARD (the AI summary reflects their input)
  → They feel the system is FAIR (arbitrators are peers, not employees)
```

---

## 2. Design System

### 2.1 Color Palette

#### Primary Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--kafil-midnight` | `#0D1B2A` | Primary brand, headers, navbar |
| `--kafil-gold` | `#C9A84C` | CTAs, escrow indicators, accents — evoking *dinar*, trust, premium |
| `--kafil-teal` | `#1A7F74` | Approval states, success, "funds released" badges |
| `--kafil-cream` | `#F9F4EE` | Page backgrounds — warm, not clinical white |
| `--kafil-sand` | `#E8DDD0` | Card borders, dividers |

#### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--status-green` | `#22C55E` | Approved, paid, fair rate |
| `--status-yellow` | `#EAB308` | Warning — rate 10–25% below market |
| `--status-red` | `#EF4444` | Alert — rate 25%+ below market, disputes |
| `--status-blue` | `#3B82F6` | In-progress, pending review |
| `--status-gray` | `#94A3B8` | Inactive, draft, not started |

#### Why Gold?

Gold (`#C9A84C`) is deliberate. It evokes the *dinar* — the historical Arab currency — and communicates value, authenticity, and premium quality. It visually says *"your money matters"* every time it appears near an escrow action.

### 2.2 Typography

#### Font Stack

```css
/* Primary — Arabic + Latin dual script */
--font-arabic: 'IBM Plex Arabic', 'Cairo', system-ui;
--font-latin: 'Inter', 'IBM Plex Sans', system-ui;

/* Combined usage — system auto-detects script */
body {
  font-family: 'IBM Plex Arabic', 'Inter', system-ui;
}
```

#### Type Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Display | 48px / 3rem | 700 | Hero headlines |
| H1 | 32px / 2rem | 700 | Page titles |
| H2 | 24px / 1.5rem | 600 | Section headers |
| H3 | 20px / 1.25rem | 600 | Card titles |
| Body Large | 18px / 1.125rem | 400 | Primary body text |
| Body | 16px / 1rem | 400 | Default content |
| Body Small | 14px / 0.875rem | 400 | Supporting text |
| Caption | 12px / 0.75rem | 500 | Labels, badges |

#### Arabic Typographic Considerations

- **Line height** increases to `1.8` for Arabic (vs `1.5` for Latin) — Arabic letterforms require more vertical breathing room
- **Letter-spacing**: `0` for Arabic (never negative), `−0.01em` for Latin headings
- **Numbers**: Use `font-variant-numeric: lnum tabular-nums` for monetary amounts — critical for alignment in budget tables

### 2.3 Spacing System

8pt grid. All spacing values are multiples of 8.

```
4px  → micro gaps (between badge icon and text)
8px  → small gaps (within components)
16px → base unit (between elements in a card)
24px → medium (section padding)
32px → large (between cards)
48px → xl (section spacing on desktop)
64px → 2xl (hero padding)
```

### 2.4 Elevation & Shadow

```css
--shadow-card:    0 1px 3px rgba(13,27,42,0.08), 0 1px 2px rgba(13,27,42,0.06);
--shadow-modal:   0 20px 60px rgba(13,27,42,0.20), 0 4px 16px rgba(13,27,42,0.10);
--shadow-escrow:  0 0 0 3px rgba(201,168,76,0.25); /* gold ring for escrow status */
--shadow-dispute: 0 0 0 3px rgba(239,68,68,0.20); /* red ring for dispute states */
```

### 2.5 Border Radius

```
--radius-sm: 6px   → Badges, chips
--radius-md: 12px  → Cards, inputs
--radius-lg: 16px  → Modals, panels
--radius-xl: 24px  → Hero cards, feature blocks
--radius-pill: 9999px → Buttons, status pills
```

### 2.6 Iconography

**Library:** Lucide Icons (open source, consistent weight)

**Custom Kafil icons** (SVG, designed for the platform):

| Icon | Usage |
|------|-------|
| 🔐 Vault Lock | Escrow locked state |
| ⚖️ Scale | Arbitration / fairness |
| 📊 Breakdown | Budget allocation view |
| 🛡️ Shield + Star | Kafil Verified badge |
| 🌐 Globe + Crescent | MENA cross-border indicator |

**Icon sizing rules:**
- 16px → inline with text
- 20px → buttons
- 24px → standalone navigation
- 32px → feature callouts
- 48px → empty states

---

## 3. Information Architecture

### 3.1 Site Map

```
Kafil Platform
├── Public / Marketing
│   ├── Landing Page
│   ├── How It Works
│   ├── Pricing
│   └── Arabic Blog / Podcast Hub
│
├── Auth
│   ├── Sign Up (role selection: Client / Lead / Sub)
│   ├── Sign In
│   ├── Verify Identity (KYC lite for MENA)
│   └── Onboarding Flow (role-specific, 3 steps)
│
├── Client Dashboard
│   ├── Projects Overview
│   ├── Create New Project
│   │   ├── Step 1: Project Details
│   │   ├── Step 2: Budget & Deadline
│   │   ├── Step 3: Review Lead's Breakdown
│   │   └── Step 4: Fund Escrow
│   ├── Project Detail View
│   │   ├── Milestone Tracker
│   │   ├── Team Allocation Cards
│   │   ├── Deliverable Review
│   │   └── Dispute Center
│   └── Payment History
│
├── Lead Freelancer Dashboard
│   ├── My Projects
│   ├── AI Role Breakdown Tool
│   │   ├── Natural Language Input
│   │   ├── AI Suggestion Review
│   │   └── Manual Adjustment
│   ├── Team Management
│   │   ├── Invite Sub-Freelancers
│   │   └── Sub-Freelancer Status Cards
│   ├── Milestone Management
│   │   ├── Submit for Client Approval
│   │   └── Delegation Controls
│   └── Lead Fee Tracker
│
├── Sub-Freelancer Dashboard
│   ├── My Invitations (pending/accepted/declined)
│   ├── Active Work
│   │   ├── Milestone Deliverable Upload
│   │   └── Submission History
│   ├── Earnings Tracker
│   │   ├── Escrowed (locked)
│   │   ├── Pending Approval
│   │   └── Paid Out
│   └── Fairness Alerts
│
├── Dispute Center (all roles)
│   ├── Open a Dispute
│   ├── My Disputes
│   │   ├── Requester View
│   │   └── Respondent View
│   └── Arbitrator Panel (verified arbitrators only)
│       ├── Case Queue
│       ├── Case Detail + AI Summary
│       └── Vote Interface
│
└── Profile & Settings
    ├── Reputation Dashboard
    ├── Payout Settings (bank, wallet)
    ├── Language Toggle (AR / EN)
    └── Notification Preferences
```

### 3.2 Role-Based Navigation

Each role sees a **custom navigation** with only their relevant items:

```
Client Nav:        Projects | Budget Tracker | Disputes | Profile
Lead Nav:          My Projects | AI Breakdown | Team | Disputes | Profile
Sub-Freelancer Nav: Invitations | My Work | Earnings | Profile
Arbitrator Nav:    Case Queue | Past Decisions | Reputation | Profile
```

---

## 4. User Flows

### 4.1 Primary Flow: Project Creation to First Payment

```
CLIENT                    LEAD                      SUB-FREELANCER
   │                        │                              │
   ▼                        │                              │
[Create Project]            │                              │
   │                        │                              │
   ▼                        │                              │
[Set Budget + Deadline]     │                              │
   │                        │                              │
   ▼                        │                              │
[Invite Lead Freelancer] ──▶│                              │
                            ▼                              │
                   [AI Role Breakdown Tool]                │
                            │                              │
                            ▼                              │
                   [Propose Allocation]                    │
                            │                              │
   ◀──────────────[Send to Client for Review]              │
   │                        │                              │
   ▼                        │                              │
[Approve / Negotiate]       │                              │
   │                        │                              │
   ▼                        │                              │
[Fund Escrow] ──────────────│──────────────────────────────│
   │                        │                              │
   │              [Invite Sub-Freelancers] ───────────────▶│
   │                        │                              ▼
   │                        │                    [View: Role + Amount
   │                        │                     + Fairness Score]
   │                        │                              │
   │                        │                    [Accept / Decline]
   │                        │                              │
   │                        │◀────────────────[Accepted]   │
   │                        │                              │
   │                        │                    [Do the Work]
   │                        │                              │
   │                        │                    [Submit Deliverable]
   │                        │                              │
   │◀──────────────[Request Milestone Approval]            │
   │                        │                              │
   ▼                        │                              │
[Review Deliverable]        │                              │
   │                        │                              │
   ▼                        │                              │
[Approve Milestone] ────────│──────────────────────────────│
                            │                              ▼
                            │                    [💰 Payment Released
                            │                       Directly to Wallet]
                            │
          [All milestones done] ──▶ [Lead Fee Released]
```

### 4.2 Dispute Flow

```
Any Participant
      │
      ▼
[Open Dispute]
 - $10 filing deposit
 - Select disputed milestone
 - Upload evidence (files)
 - Write your case (AI structures it)
      │
      ▼
[AI Generates Neutral Case Summary]
      │
      ▼
[System Selects 3 Arbitrators]
 - Same category/discipline
 - 12+ months, 4.5+ rating
 - No prior relationship
      │
      ▼
[Arbitrators Receive Notification]
 Must accept within 6 hours
      │
      ▼
[Each Arbitrator Reviews Independently]
 - AI case summary
 - Submitted files
 - Project + chat history
      │
      ▼
[Vote: Rule for A / Rule for B / Partial Split]
 - 48 hour deadline
      │
      ▼
[Majority Decision = Binding]
      │
      ├──▶ Clear Winner → $10 fee paid by loser, $3 per arbitrator
      ├──▶ Partial → $5 split, averaged partial %, $3 per arbitrator
      └──▶ Automatic payment redistribution executed
```

---

## 5. Screen-by-Screen Breakdown

### 5.1 Landing Page

**Goal:** Communicate trust, explain the value prop in 10 seconds, convert to sign-up.

**Layout — Above the Fold:**
```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR: [كفيل Logo] [How It Works] [Pricing] [تسجيل]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   HERO — Full-width, dark midnight background           │
│   ┌─────────────────────┐  ┌────────────────────────┐  │
│   │                     │  │  ESCROW LIVE DEMO CARD  │  │
│   │  كفيل ضامنوك        │  │  ┌──────────────────┐  │  │
│   │                     │  │  │ 🔒 Locked in Escrow│  │  │
│   │  Get paid what       │  │  │ $3,000.00         │  │  │
│   │  you earned.        │  │  ├──────────────────┤  │  │
│   │  On time. In full.  │  │  │ Designer  $600 ✅ │  │  │
│   │                     │  │  │ Developer $1200 ⏳│  │  │
│   │  [Get Started →]    │  │  │ Writer    $300 ⏳ │  │  │
│   │  [See How It Works] │  │  │ Lead Fee  $400 🔒 │  │  │
│   │                     │  │  └──────────────────┘  │  │
│   └─────────────────────┘  └────────────────────────┘  │
│                                                         │
│   Trusted by freelancers in 🇪🇬 🇸🇦 🇦🇪              │
└─────────────────────────────────────────────────────────┘
```

**Scrolling Sections:**
1. **Problem Statement** — 3 cards (Hidden Budgets / Payment Disappearance / No MENA Dispute Resolution) with real stats
2. **How Kafil Works** — animated 5-step horizontal timeline
3. **The Three Personas** — 3 side-by-side profile cards (Layla, Tariq, Sara) with their stories
4. **AI Features** — dark section, animated feature demos of the Fairness Detector and Role Breakdown tool
5. **Arbitration System** — peer panel illustrated with avatars + vote icons
6. **Social Proof** — testimonial cards in Arabic
7. **CTA** — gold button on midnight background: *"Start Your First Project Free"*

---

### 5.2 Onboarding Flow

**3-screen flow, role-specific, no clutter.**

**Screen 1 — Role Selection:**
```
┌───────────────────────────────────────────────┐
│              Who are you?                     │
│           من أنت في هذا المشروع؟              │
│                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌────────┐│
│  │   👤 Client  │ │ ⚡ Lead Free. │ │ 🎨 Sub ││
│  │              │ │              │ │        ││
│  │ I hire teams │ │ I coordinate │ │ I do   ││
│  │ for projects │ │ projects     │ │ the    ││
│  │              │ │              │ │ work   ││
│  └──────────────┘ └──────────────┘ └────────┘│
│                                               │
│         [ You can change this later ]         │
└───────────────────────────────────────────────┘
```

**Screen 2 — Profile Basics:** Name, Country (EG/SA/AE + others), Category (for freelancers), verification email

**Screen 3 — Role-Specific Setup:**
- Client → Connect payment method
- Lead → Select primary discipline, experience level, upload sample portfolio link
- Sub → Select skills, set availability, connect payout method

**Design Rules for Onboarding:**
- Progress bar: 3 dots (filled = done, current = gold, upcoming = gray)
- One input per screen where possible
- Skip links visible but de-emphasized
- Arabic placeholder text that feels natural (not translated English)

---

### 5.3 Sub-Freelancer Invite Screen ⭐ (Most Critical UX Moment)

This is Kafil's **defining moment** — the screen where a sub-freelancer sees their allocation for the first time. It must feel like a revelation of transparency, not just a form.

```
┌─────────────────────────────────────────────────────────┐
│  ← Back           Project Invitation                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  From: Tariq M. (⭐ 4.9 · Kafil Verified Lead)         │
│  Project: "E-commerce Mobile App — 3 Screens"          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🔒 YOUR ALLOCATION — LOCKED IN ESCROW           │   │
│  │  ─────────────────────────────────────────────  │   │
│  │                                                  │   │
│  │         $600.00                                  │   │
│  │         UI/UX Design — 3 app screens             │   │
│  │                                                  │   │
│  │  ✅ Funds are already in escrow                  │   │
│  │  ✅ Payment released directly to you             │   │
│  │  ✅ Lead freelancer cannot touch your funds      │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  AI FAIRNESS CHECK                                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🟢 This rate is ABOVE MARKET                    │   │
│  │     Market range for UI/UX in Egypt: $400–$550  │   │
│  │     Your offer: $600 (+9% above market)         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  DELIVERABLES                                           │
│  • 3 high-fidelity screens (Figma, .fig + PDF export)  │
│  • 1 revision round included                           │
│  • Deadline: June 15, 2026                             │
│                                                         │
│  MILESTONE BREAKDOWN                                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Milestone 1  Wireframes        $200   Jun 5    │   │
│  │  Milestone 2  High-fidelity     $250   Jun 12   │   │
│  │  Milestone 3  Final + exports   $150   Jun 15   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │   ✗ Decline         │  │  ✓ Accept & Start Work  │  │
│  └─────────────────────┘  └─────────────────────────┘  │
│                                                         │
│  Need to negotiate? → Message Tariq before accepting   │
└─────────────────────────────────────────────────────────┘
```

**UX Decisions on this screen:**
- The `$600.00` figure is the **largest text on the screen** — it's what the sub-freelancer needs to see first
- The escrow lock box uses a gold border to signal safety
- Fairness check is a compact, colored strip — not a popup — always visible without scroll
- "Lead freelancer cannot touch your funds" is written in plain language, not legalese
- Decline button is muted gray; Accept is gold/teal — deliberate weight difference
- Negotiation option is present but de-emphasized (text link, not button) to avoid friction loops

---

### 5.4 Budget Breakdown — Lead Freelancer's Tool

```
┌─────────────────────────────────────────────────────────┐
│  AI Role Breakdown Assistant                            │
│  ─────────────────────────────────────────────────────  │
│  Describe your project:                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  "Build a 5-screen mobile app with payment      │   │
│  │   integration and copywriting for 3 pages..."   │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                             [ ✨ Generate Breakdown ]   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  AI SUGGESTION  (based on MENA market data)             │
│                                                         │
│  Total Project Budget: $3,200                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Role            Est. Rate     Hours    Subtotal   │  │
│  │ ─────────────────────────────────────────────── │  │
│  │ UI/UX Designer  $8–11/hr   ×  80hrs  = $640–880  │  │
│  │ React Native Dev $10–15/hr × 120hrs  = $1200–1800│  │
│  │ Backend Dev     $10–15/hr ×  80hrs  = $800–1200  │  │
│  │ Copywriter      $15–25/hr ×  10hrs  = $150–250   │  │
│  │ ─────────────────────────────────────────────── │  │
│  │ Lead Fee (12%)                       = $336       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  FAIRNESS SCORE                                         │
│  ████████████░░  78/100   Good allocation              │
│  "Lead fee is within recommended 10–15% range"         │
│                                                         │
│  [ Edit Manually ]              [ Send to Client → ]   │
└─────────────────────────────────────────────────────────┘
```

---

### 5.5 Milestone Tracker — Client View

```
┌─────────────────────────────────────────────────────────┐
│  Project: E-commerce App · $3,200 in Escrow 🔒         │
│                                                         │
│  MILESTONE PROGRESS                                     │
│  ●━━━━━━━━━━━━━●━━━━━━━━━━━━━○━━━━━━━━━━━━○           │
│  Wireframes   Design    Dev Sprint 1   Final QA        │
│  ✅ Done       ⏳ Review  ⏱ Upcoming    ⏱ Upcoming    │
│                                                         │
│  TEAM ALLOCATION STATUS                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  👤 Sara (UI Designer)    $600    ✅ $200 paid   │   │
│  │  ████████░░░░░░░░░░░░     $400 pending           │   │
│  │                                                  │   │
│  │  👤 Karim (RN Developer)  $1,200  ⏳ Working     │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░   $0 released             │   │
│  │                                                  │   │
│  │  👤 Noura (Copywriter)    $300    🔒 Escrowed    │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░   Not started             │   │
│  │                                                  │   │
│  │  ⚡ Tariq (Lead Fee)      $400    🔒 Upon finish │   │
│  │  ─────────────────────────────────────────────  │   │
│  │  Total Released: $200 / $3,200                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  PENDING APPROVAL                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Sara submitted: "UI Design — Screens 1–3"      │   │
│  │  Submitted: June 12, 2026                        │   │
│  │  Files: figma_screens_v2.fig  design_export.pdf  │   │
│  │                                                  │   │
│  │  [ Preview Files ]   [ Request Changes ]         │   │
│  │                            [ ✓ Approve & Pay ]   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### 5.6 Dispute Filing Screen

```
┌─────────────────────────────────────────────────────────┐
│  ← Back          Open a Dispute                        │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ⚠️  Filing a dispute pauses all pending payments.     │
│     A $10 deposit is required (refunded if you win).   │
│                                                         │
│  WHAT ARE YOU DISPUTING?                                │
│  ○ Deliverable quality does not match agreed scope      │
│  ○ Deadline was missed without communication            │
│  ○ Payment not released after approval                  │
│  ○ Work not delivered at all                            │
│  ○ Other (describe below)                               │
│                                                         │
│  WHICH MILESTONE?                                       │
│  [ Milestone 2: UI Design — High-Fidelity  ▼ ]        │
│                                                         │
│  YOUR CASE (max 500 words)                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  The submitted Figma file was missing Screen 3  │   │
│  │  which was explicitly listed in the milestone   │   │
│  │  deliverables. Three messages were sent with    │   │
│  │  no response for 5 days...                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  EVIDENCE  (optional but strongly recommended)          │
│  [ + Upload Screenshots / Files / Chat Export ]         │
│  ┌───────────────────┐ ┌───────────────────┐           │
│  │ 📎 screenshot1.png│ │ 📎 chat_export.pdf│           │
│  └───────────────────┘ └───────────────────┘           │
│                                                         │
│  AI WILL GENERATE a neutral summary for arbitrators.   │
│  You won't see it before they do (prevents coaching).  │
│                                                         │
│  [ Cancel ]                 [ File Dispute · $10 → ]   │
└─────────────────────────────────────────────────────────┘
```

---

### 5.7 Arbitrator Case View

```
┌─────────────────────────────────────────────────────────┐
│  ⚖️  Case #KF-2847 · UI/UX Design Dispute              │
│  Deadline: 38 hours remaining  ████████████░░░░░░░     │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  AI-GENERATED CASE SUMMARY                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Requester (Client "Layla M.") filed this       │   │
│  │  dispute on June 13, 2026 regarding Milestone 2  │   │
│  │  of project "E-commerce App". The requester     │   │
│  │  claims that deliverable Screen 3 was absent    │   │
│  │  from the submitted Figma file, despite being   │   │
│  │  explicitly defined in the milestone scope...   │   │
│  │                                                  │   │
│  │  Respondent (Sara A.) maintains that Screen 3   │   │
│  │  was included in the Figma link shared on       │   │
│  │  June 11, and attributes the confusion to a     │   │
│  │  permissions issue on the Figma share link...   │   │
│  └─────────────────────────────────────────────────┘   │
│  Generated by AI · Neutral summarization only          │
│                                                         │
│  EVIDENCE FILES                                         │
│  📎 figma_link.txt     📎 screenshot_dispute.png       │
│  📎 chat_log_export.pdf                                 │
│                                                         │
│  PROJECT HISTORY (auto-pulled)                          │
│  • Milestone 2 scope accepted by both parties Jun 1    │
│  • Sara submitted Jun 11 at 14:22                      │
│  • Client opened dispute Jun 13 at 09:10               │
│                                                         │
│  YOUR VOTE  (other arbitrators' votes hidden)          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  ○ Rule for Requester (Layla) — full release     │  │
│  │  ○ Rule for Respondent (Sara) — approve payment  │  │
│  │  ○ Partial split: Requester gets [___]%           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [ Save Draft ]                 [ Submit Vote → ]       │
│                                                         │
│  Your reward: $3.00 · Released after majority vote     │
└─────────────────────────────────────────────────────────┘
```

---

### 5.8 Earnings Dashboard — Sub-Freelancer

```
┌─────────────────────────────────────────────────────────┐
│  My Earnings                           June 2026        │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐│
│  │ 🔒 Escrow  │  │ ⏳ Pending │  │ ✅ Paid Out        ││
│  │   $1,250   │  │    $400    │  │   $3,800            ││
│  │ 2 projects │  │ 1 approval │  │ Lifetime            ││
│  └────────────┘  └────────────┘  └────────────────────┘│
│                                                         │
│  ACTIVE MILESTONES                                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  E-commerce App · Milestone 3                    │   │
│  │  $150 · Due June 15 · 3 days left               │   │
│  │  [ Upload Deliverable ]                          │   │
│  │                                                  │   │
│  │  SaaS Dashboard · Milestone 1                   │   │
│  │  $400 · Due June 20 · 8 days left               │   │
│  │  [ Upload Deliverable ]                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  RECENT PAYMENTS                                        │
│  ✅ $200 · E-commerce App M1 · June 8                  │
│  ✅ $250 · E-commerce App M2 · June 12                 │
│  ✅ $600 · Brand Identity M1–3 · May 30                │
│                                                         │
│  YOUR KAFIL REPUTATION                                  │
│  ⭐ 4.8 · 12 projects · 0 disputes                     │
│  [ Share Reputation Card ]                              │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Component Library

### 6.1 Escrow Status Badge

The most important component in the system. Appears on every project, invite, and payment screen.

**States:**

```
🔒 LOCKED IN ESCROW       → Dark gold border, lock icon, midnight bg
⏳ PENDING APPROVAL       → Blue border, clock icon
✅ RELEASED               → Green border, checkmark, soft green bg
⚠️ DISPUTE PAUSED         → Red border, warning icon, soft red bg
```

**HTML/CSS Blueprint:**

```css
.escrow-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  border: 1.5px solid;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.escrow-badge--locked   { border-color: #C9A84C; color: #C9A84C; background: rgba(201,168,76,0.08); }
.escrow-badge--pending  { border-color: #3B82F6; color: #3B82F6; background: rgba(59,130,246,0.08); }
.escrow-badge--released { border-color: #22C55E; color: #22C55E; background: rgba(34,197,94,0.08); }
.escrow-badge--dispute  { border-color: #EF4444; color: #EF4444; background: rgba(239,68,68,0.08); }
```

### 6.2 Fairness Score Indicator

```
ABOVE MARKET   ████████████████████  🟢  $600  (+9%)
AT MARKET      ████████████████░░░░  🟡  $450  (±0%)
BELOW MARKET   ████████░░░░░░░░░░░░  🟠  $300  (−18%)
EXPLOITATION   ████░░░░░░░░░░░░░░░░  🔴  $150  (−45%)
```

**UX Rule:** The red state must include a specific, localized explanation:
> *"This offer is 45% below typical UI/UX rates in Egypt ($400–$550/month equivalent). You have the right to negotiate or decline."*

### 6.3 Milestone Progress Stepper

```
●━━━━━━━━━━━━━●━━━━━━━━━━━━━○━━━━━━━━━━━━○
[Completed]   [In Review]   [Upcoming]   [Upcoming]

Rules:
• ● filled gold = completed
• ● filled teal = current / active
• ○ empty gray  = upcoming
• Connecting line: gold to completed, gray to upcoming
```

### 6.4 Allocation Breakdown Bar

Used in the client's project overview to visualize fund distribution:

```
Total: $3,200
├── Designer    ██░░░░░░░░░░░░░░░░░░  $600   18.75%
├── Developer   ████████░░░░░░░░░░░░  $1,200  37.5%
├── Backend     █████░░░░░░░░░░░░░░░  $800   25.0%
├── Writer      █░░░░░░░░░░░░░░░░░░░  $300    9.4%
└── Lead Fee    ██░░░░░░░░░░░░░░░░░░  $400   12.5%
```

Each bar segment is color-coded per role (consistent across all screens).

### 6.5 Kafil Verified Badge

```
╔══════════════════════╗
║  🛡️  KAFIL VERIFIED  ║
║  Lead Freelancer      ║
║  ⭐ 4.9 · 24 projects ║
╚══════════════════════╝
```

Displayed on Lead Freelancer profiles and invite screens. Requires: 12+ months on platform, 4.5+ rating, 0 active disputes. Exportable as a PNG card for LinkedIn/Mostaql profiles.

---

## 7. Microinteractions & Motion

### 7.1 Motion Principles

```
Timing:
  Fast  → 150ms  (hover states, badge flips)
  Base  → 250ms  (panel slides, dropdown open)
  Slow  → 400ms  (modal entry, page transitions)
  Paced → 600ms  (escrow lock animation, celebration)

Easing:
  Ease-out → most transitions (feels intentional, not mechanical)
  Spring   → milestone completion, payment success (feels alive)
```

### 7.2 Signature Animations

**Escrow Lock Animation** (when client funds the project):
```
1. Button text: "Fund Escrow"
2. Click → spinner (200ms)
3. Success → vault door closes with a satisfying click
4. Gold ring expands from center, fades (400ms)
5. Status badge flips from "Pending" to "🔒 Locked"
6. Confetti-lite: 12 gold particles burst and fade (600ms)
7. Sound: optional subtle "lock click" (user-enabled)
```

**Payment Release Animation** (when milestone approved):
```
1. Client clicks "Approve & Pay"
2. Amount animates: $0 → $250 (counter, 400ms)
3. Green checkmark draws in (stroke animation, 300ms)
4. Sub-freelancer's card pulses once (teal glow, 200ms)
5. Notification sent: "Sara's payment of $250 is on its way"
```

**Fairness Score Load:**
```
1. Screen loads → bar is empty
2. Bar fills from left (0% → actual %, 500ms ease-out)
3. Color reveals at completion (green/yellow/red)
4. Percentage number counts up simultaneously
```

**Dispute Filed:**
```
1. Confirm button clicked
2. All payment CTAs on page fade to gray (dimmed, 300ms)
3. "DISPUTE IN PROGRESS" banner slides down from top (400ms)
4. Subtle red border appears around entire project card
```

### 7.3 Hover States

```css
/* Card hover — lift with shadow */
.kafil-card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
.kafil-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(13,27,42,0.12);
}

/* Primary button — gold brightens */
.btn-primary {
  background: #C9A84C;
  transition: background 150ms, box-shadow 150ms;
}
.btn-primary:hover {
  background: #D4B55E;
  box-shadow: 0 4px 12px rgba(201,168,76,0.35);
}
```

---

## 8. Accessibility & RTL Strategy

### 8.1 RTL-First Design

Kafil is designed RTL-first, not RTL-adapted. The default layout assumes Arabic reading direction, with LTR as the secondary mode.

**RTL Implementation Rules:**

```css
/* Root level */
html[lang="ar"] { direction: rtl; }
html[lang="en"] { direction: ltr; }

/* Logical properties — auto-adapt to direction */
.card {
  padding-inline-start: 24px;  /* replaces padding-left */
  padding-inline-end: 24px;    /* replaces padding-right */
  margin-block-start: 16px;    /* replaces margin-top */
}

/* Icons that imply direction must be flipped */
[dir="rtl"] .icon-arrow-right { transform: scaleX(-1); }
[dir="rtl"] .icon-chevron      { transform: scaleX(-1); }
```

**Number and Currency Formatting:**

```javascript
// Arabic-Eastern numerals for Arabic UI
const formatCurrency = (amount, locale = 'ar-EG') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Arabic:  ٦٠٠٫٠٠ دولار
// English: $600.00
```

**Mixed-Direction Text (amounts always LTR):**
```html
<!-- Use bdi element for amounts in Arabic text -->
<p>تم إيداع مبلغ <bdi>$600.00</bdi> في الضمان.</p>
```

### 8.2 WCAG 2.1 AA Compliance

| Check | Standard | Kafil Value |
|-------|----------|-------------|
| Text contrast (body) | 4.5:1 min | 7.2:1 (cream bg / midnight text) |
| Text contrast (large) | 3:1 min | 5.8:1 |
| Gold on midnight | — | 4.6:1 ✅ |
| Touch target size | 44×44px min | 48×48px default |
| Focus indicator | 3:1 min | Gold 3px ring, always visible |

### 8.3 Keyboard Navigation

Full keyboard navigation for all critical paths:
- `Tab` through all interactive elements
- `Enter/Space` to activate buttons, accept/decline invites
- `Escape` to close modals/panels
- Skip links: `[Skip to main content]` visible on focus
- Arbitrator vote: `1`, `2`, `3` keyboard shortcuts for fast voting

### 8.4 Screen Reader Optimization

```html
<!-- Escrow status announced meaningfully -->
<div role="status" aria-live="polite" aria-label="Project funds locked in escrow: $3,200">
  <span aria-hidden="true">🔒</span>
  <span>$3,200 محفوظ في الضمان</span>
</div>

<!-- Progress stepper with ARIA -->
<ol role="list" aria-label="Milestone progress">
  <li aria-current="step" aria-label="Step 2 of 4: Design review, in progress">...</li>
</ol>
```

---

## 9. AI Feature UX

### 9.1 AI Fairness Detector — UX Principles

**The AI must never feel like a black box.** Every AI output is accompanied by:
1. The data source ("Based on 847 similar projects on Mostaql, June 2026")
2. The specific comparison ("UI/UX in Egypt: $8–11/hr market rate")
3. An action option ("You can negotiate or decline without penalty")

**Warning Level UX:**

```
🟢 ABOVE MARKET
   Visual: Green badge, thumbs up icon
   Copy:   "Great offer! This is above market for your role in Egypt."
   Action: None required

🟡 SLIGHTLY BELOW (10–25%)
   Visual: Yellow badge, info icon
   Copy:   "This offer is 18% below typical rates for UI/UX in Egypt
            ($450–$600/hr equivalent). You may want to negotiate."
   Action: [Negotiate Rate] button appears (sends message to lead)

🔴 SIGNIFICANTLY BELOW (25%+)
   Visual: Red badge, warning icon, expanded explanation
   Copy:   "⚠️ This offer is 45% below market rate. Accepting this
            may not be worth your time. You have every right to
            decline. Kafil data shows similar work pays $400–$550
            in your market."
   Action: [Decline Offer] pre-highlighted, [Negotiate] available
```

**What the AI Fairness Detector Never Does:**
- It never blocks a sub-freelancer from accepting (autonomy is preserved)
- It never reveals the total project budget (that's not its job)
- It never judges the lead freelancer publicly (shown privately to sub only)

### 9.2 AI Role Breakdown — UX Principles

**Interaction Model:**

The text input accepts natural language. Users should not feel like they are prompting an AI — they should feel like they are describing their project to a smart assistant.

```
Placeholder text (Arabic):
"صف مشروعك بكلماتك الخاصة — مثلاً: 'تطبيق جوال بـ 5 شاشات مع بوابة دفع...'"

English:
"Describe your project in your own words — e.g., 'Mobile app with 5 screens, payment gateway, Arabic/English support...'"
```

**Loading State:** While AI generates, show a skeleton of the breakdown table with a pulsing shimmer. Add a human message:
> *"Analyzing your project against MENA market data..."* (never say "AI is thinking")

**Editable Output:** Every AI-suggested value is editable inline. Edited values show a small "Edited" tag so the lead knows what they changed from the AI recommendation.

**Fairness Score on Breakdown:**
The lead sees their own fairness score before sending to client. This is transparent trust-building — a lead with a high score sends a stronger signal.

### 9.3 AI Dispute Summarizer — UX Principles

**Transparency of Process:**
- Both parties are told upfront: *"The AI will generate a neutral summary from all available project data. You will not see the summary before arbitrators do."*
- This prevents coaching but feels fair because both sides are treated equally

**Summary Card Design:**
```
┌─────────────────────────────────────────────────────────┐
│  🤖 AI Case Summary · Case #KF-2847                    │
│  Generated: June 13, 2026 at 10:42                     │
│  ─────────────────────────────────────────────────────  │
│  [Summary text — neutral, factual, structured]         │
│                                                         │
│  Sources used: Project scope · 47 chat messages ·      │
│  Milestone descriptions · Submitted files              │
│                                                         │
│  ⚠️  This summary is AI-generated. Arbitrators are    │
│     required to review original evidence independently.│
└─────────────────────────────────────────────────────────┘
```

---

## 10. Mobile Experience

### 10.1 Mobile-First Architecture

Kafil is designed mobile-first. The primary use case for sub-freelancers and lead freelancers is mobile. Clients may use desktop more frequently but mobile must be fully capable.

**Breakpoints:**
```
Mobile:  320px – 767px   (primary)
Tablet:  768px – 1023px  (secondary)
Desktop: 1024px+          (full dashboard)
```

### 10.2 Mobile-Specific Adaptations

**Navigation:** Bottom tab bar on mobile (5 items), top nav on desktop

```
Mobile Bottom Nav:
[🏠 Home] [📋 Projects] [💬 Messages] [💰 Earnings] [👤 Profile]
```

**Sub-Freelancer Invite — Mobile Scroll Flow:**

The invite screen content is too dense for mobile. Adapt:
1. Screen 1 of 3: Your Role + Amount (full screen, large number)
2. Screen 2 of 3: Fairness check + Milestones
3. Screen 3 of 3: Accept/Decline + Message option

**Swipe Gestures:**
- Swipe left on an invitation card to quick-decline
- Swipe right to quick-accept (with confirmation modal)
- Swipe up on milestone card to submit deliverable

**WhatsApp Integration (Phase 2):**
Mobile users can receive milestone notifications and respond via WhatsApp bot — critical for MENA where WhatsApp is the primary communication channel.

### 10.3 Progressive Web App (PWA)

Kafil ships as a PWA for:
- Offline viewing of project details and past payments
- Home screen installation (no app store friction)
- Push notifications for milestone approvals and dispute updates

---

## 11. Error States & Edge Cases

### 11.1 Empty States

Each empty state is a call to action, not a dead end:

```
Sub-Freelancer — No invitations yet:
  Illustration: Open envelope with a star
  Headline:    "لا دعوات بعد" / "No invitations yet"
  Body:        "Share your Kafil profile with lead freelancers
                you'd like to work with."
  CTA:         [Copy Profile Link]

Client — No projects yet:
  Illustration: Blank canvas with paint splash
  Headline:    "Start your first protected project"
  Body:        "Post a project and invite a lead freelancer.
                Your budget stays safe in escrow until every
                milestone is delivered."
  CTA:         [Create Project →]
```

### 11.2 Payment Failure States

```
Escrow funding failed:
  → Toast: "Payment couldn't be processed. No funds were moved."
  → CTA:   [Try Again] [Update Payment Method]
  → Never leave the user wondering if money left their account

Payout failed (to sub-freelancer):
  → Email + in-app notification to sub-freelancer
  → Funds remain in escrow (never lost)
  → CTA: [Update Payout Details]
  → Lead freelancer is NOT notified (sub-freelancer privacy)
```

### 11.3 Dispute Edge Cases

```
Arbitrator doesn't respond in 6 hours:
  → System silently replaces with next eligible arbitrator
  → Original arbitrator receives a "missed case" notification
  → 3 replacements = temporary suspension from arbitrator pool

All 3 arbitrators choose "Partial" with different splits:
  → System averages the three percentages
  → Displayed as: "Arbitrators recommended a weighted split"
  → Breakdown shows individual votes after resolution

Disputing party withdraws:
  → $5 deterrent fee charged
  → Payments resume
  → The withdrawal is noted on their reputation record (privately)
```

### 11.4 Network & Loading States

```
Skeleton loading on all data-fetching screens
Optimistic UI updates for milestone status (update instantly, rollback on failure)
Offline mode: last-seen project data available, "You're offline" banner
```

---

## 12. Design Decisions Log

### Why Gold Accents, Not Green?

Green is the obvious "money" color, but it's also the color of warning-free states. Using green for the brand would create confusion with our success state green. Gold is premium, culturally resonant with MENA (dinar, wealth, trust), and distinctive in a space where most fintech apps use blue.

### Why is the Sub-Freelancer Invite its Own Dedicated Screen?

This is the most trust-critical moment in the product. In informal WhatsApp arrangements, sub-freelancers are told their rate verbally and have no documentation. Giving this moment its own full-screen, clearly designed view signals: *"This is real. This is official. You have proof."*

### Why No Dark Mode in V1?

Dark mode adds significant design maintenance overhead. More critically, the escrow lock card with gold on dark needs careful calibration not to feel like a crypto product. We defer dark mode to Phase 2 when brand is established.

### Why Separate Role-Based Dashboards Rather Than One Unified View?

Testing with MENA freelancers revealed that seeing other parties' dashboards created anxiety ("what can they see about me?"). Clean separation removes that cognitive load and builds trust through clearly bounded visibility.

### Why a $10 Dispute Filing Deposit?

This was the most debated design decision. The data from platforms with free dispute filing shows >60% of disputes are filed as leverage tactics, not genuine grievances. The $10 deposit (refunded on win) filters out bad-faith filings while remaining accessible for all income levels in our target markets. The UX communicates this clearly: *"Refunded if you win."*

### Why Arbitrators Vote Blind (Don't See Each Other's Votes)?

Prevents anchoring bias. Arbitrator 2 and 3 must not be influenced by Arbitrator 1's vote. The vote aggregation happens server-side and results are revealed only after all three have voted or the 48-hour deadline passes.

---

## Appendix: Design Handoff Checklist

- [ ] Design tokens exported to JSON (colors, spacing, typography)
- [ ] Component library in Figma with all states documented
- [ ] RTL and LTR versions of all screens exported
- [ ] Mobile and desktop versions for all primary flows
- [ ] All AI states documented (loading, success, error, empty)
- [ ] Accessibility annotations on all components
- [ ] Motion specs in Figma (Smart Animate + duration/easing doc)
- [ ] Icon set exported as SVG sprite
- [ ] Dev handoff notes on Figma frames for each screen
- [ ] Edge case screens documented (dispute, failure, empty states)

---

*Kafil UI/UX Design Specification — SalamHack 2026*
*Designed with respect for Arab freelancers, their dignity, and their right to be paid fairly.*

**كفيل — نحن ضامنوك**
*Kafil — We are your guarantor.*
