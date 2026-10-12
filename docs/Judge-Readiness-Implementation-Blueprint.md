# VeriGig implementation blueprint for judge readiness

**Purpose:** Convert the present frontend prototype into a truthful, testable student-to-SME micro-gig marketplace that can answer the likely judge questions with demonstrated product behaviour, not only slides.

**Scope of this document:** Implementation design only. It does not author code, create payment accounts, or claim that the current prototype processes real users, identity checks, or money.

## 1. The position to defend in a presentation

**VeriGig is not another general freelancer directory.** It is a controlled micro-gig workflow for verified college students and local SMEs: a business publishes a clearly scoped task, both parties agree to its milestones, the payment commitment is recorded before work starts, progress and evidence stay in one place, and verified completion becomes portable portfolio proof.

The defensible USP is the **trust workflow**, not merely the words “student”, “local”, or “verified”:

1. Student and business identity checks are private and role-specific.
2. A structured brief, scope acceptance, milestones, revision rule, and payment state exist before work starts.
3. Completion evidence, ratings, payout history, and dispute decisions produce an accountable record for the next gig.
4. Locality is an optional preference for on-campus/city work, while suitable remote work can reach any verified student. It therefore improves trust without artificially shrinking the marketplace.

Do not describe the present interface as a live marketplace, live escrow service, or source of live platform metrics. It is a frontend demonstration with seeded data and simulated actions. That honesty is more persuasive than an unsupported claim.

## 2. Evidence used and what it means

### Synopsis alignment

The submitted synopsis defines a student profile/portfolio, gig discovery, applications, company verification, job management, applicant tracking, notifications, and ratings as the core scope. It lists integrated escrow and AI matching as future scope. The frontend has already visualised milestone payment, matching, and governance flows, but they remain simulated. The implementation priority is therefore to make the **core submitted scope real first**, then introduce payment-provider integration and explainable matching.

### Survey observations

The survey contains 38 submissions: 27 selected the student role and 11 selected the business role. It is useful directional discovery, not a representative market-size study. Seven respondents who selected the student role also answered business questions, so business-question totals can reach 18. All business-side percentages below should be described as *directional response patterns*, not as a statistic about all SMEs.

| Evidence | Observation | Product consequence |
| --- | --- | --- |
| Student demand | 19 of 27 students rated interest in a verified student-to-business platform as 4 or 5 out of 5. 24 of 27 had either never tried freelance work but wanted to, or had tried without securing a project. | Onboard beginners, not only students with prior paid work. Give them a structured first-project path and portfolio evidence. |
| Student friction | The leading barriers were lack of portfolio (6), lack of client trust (5), fear of non-payment (4), and lack of experience (4). | Verified completion records, clear briefs, payment states, and a beginner-ready gig label are MVP requirements. |
| Student preferences | The highest requested features were ratings/reviews (10), remote opportunities (9), recommendations (8), verified businesses (8), and milestone tracking (8). 10 of 27 preferred milestone payment. | Build ratings, remote/local filtering, explainable recommendations, business verification, and a real milestone state machine before cosmetic AI. |
| Privacy expectation | 11 students said yes to college-credential verification and 13 said “maybe” depending on data protection; only 3 said no. | Verification needs a short consent notice, private document storage, a retention policy, and a public badge that reveals no document data. |
| SME demand | Among 18 non-blank business-question responses, 13 rated willingness to hire a verified student as 4 or 5 out of 5. | Start with a small partner cohort, but validate repeat posting rather than claiming large liquidity. |
| SME risk | Accountability and confidentiality/data security were each the most common concern (4). The strongest confidence builder was communication/interview before hiring (8), followed by completed-project history (5). | Add messaging/interview scheduling, a two-party scope agreement, access-controlled files, audit logs, and verified completion history. |
| Locality | Only 4 of 18 business responses explicitly preferred students from their state; 10 said location does not matter for remote work or depends on the project. | Keep city/campus filters, but never make location a hard eligibility rule for remote gigs. |
| Pricing | Free posting (5) and a per-gig fee (5) tied as preferred business pricing; success fee (3), subscription (3), and freemium (2) followed. | Launch with free basic posting. Test a low, visible successful-completion fee or paid employer tools after repeat usage. Do not assume a subscription model works yet. |

### External market and compliance checks

Internshala already offers broad student/fresher hiring, employer postings, screening, chat, and interview tools across India. VeriGig cannot win by claiming that only it connects businesses to students. Its narrower micro-gig, payment-commitment, verified-completion, and campus-partner workflow must be the differentiator. [Internshala’s employer guide](https://internshala.com/blog/employer-how-to-hire-on-internshala/) documents those broad hiring capabilities.

Never hold customer funds in a normal VeriGig bank account or call a simple database balance “escrow”. RBI directions place escrow-account obligations on payment aggregators, and actual money movement must use an authorised/contracted payment partner and its approved marketplace flow. [RBI’s escrow-account directions](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=11996) and [Razorpay Route’s documented split-settlement model](https://razorpay.com/partnership-services-and-collection-facilitation-agreement/) are the basis for the proposed approach. Before live launch, obtain provider, tax, and legal advice.

College IDs, profile data, and payment identifiers are personal data. The platform should minimise collection, record clear consent, restrict access, and support retention/deletion requests in line with the [Digital Personal Data Protection Act, 2023](https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf). This is product guidance, not legal advice.

## 3. Judge-question response map

The status labels are intentional:

- **Connect**: The user experience exists in the frontend. Replace mock context actions with authenticated API calls and persisted data.
- **Extend**: The screen exists, but its data, validation, or edge-case behaviour is insufficient for a real workflow.
- **Add**: No adequate user-facing flow currently exists.
- **Correct**: A demo claim or simulated action must be relabelled or removed until it is real.

### 1. “What exact problem are you solving?”

**Answer to demonstrate:** Students cannot obtain a trustworthy first paid project, and SMEs cannot safely delegate a small, clearly bounded job. VeriGig reduces the first-project trust gap.

- **Frontend:** Connect the existing student exploration, profile, proposal, employer posting, applicant, and workspace flows. Add a “Beginner-ready” listing tag and a business checkbox confirming the task is appropriate for a student contractor.
- **Backend:** Store `gig_level`, estimated hours, clear deliverables, revision allowance, work mode, deadline, budget, and prohibited-task flags. Reject an incomplete brief before it can become open.
- **Judge-proof metric:** first proposal rate, first gig won, completion rate, median time from post to funded contract, and repeat-employer rate.

### 2. “What is the USP compared with Internshala, Fiverr, Upwork, or WhatsApp groups?”

**Answer to demonstrate:** VeriGig controls the project lifecycle for short, defined student work. It does not try to be a global bidding marketplace or an internship job board.

- **Frontend:** The landing comparison exists, but **Correct** its generic “20%+ fee”, “1,400+ verified students”, payout, and success-rate claims unless supported by live data. Explain the verified milestone workflow with a real sample contract instead.
- **Backend:** Implement the workflow state machine in section 6, immutable activity records, and a verified completion certificate. The UX copy should say “payment commitment through our provider” only after that integration exists.
- **Policy:** Limit MVP work to discrete digital/administrative deliverables. Block academic cheating, unlawful work, unsafe in-person tasks, and vague “anything you need” listings.

### 3. “Why would an SME use it instead of its own network or social media?”

**Answer to demonstrate:** Faster shortlisting from verified portfolios, a structured brief, trackable delivery, documented payment and rehire history, and one accountable record if something goes wrong.

- **Frontend:** **Connect** the employer dashboard, posting wizard, applicant dossier, and review workspace. **Add** an employer profile page, saved/rehire talent list, and candidate comparison rubric.
- **Backend:** Allow verified employers to publish; index students by skills, availability, work mode, location preference, past verified work, and rating. Store a reusable candidate shortlist and rehire relationship.
- **Acceptance test:** An employer posts a scoped gig, shortlists, messages/interviews, hires, approves a milestone, and can rehire the same student without losing history.

### 4. “Why would a student use it instead of a conventional freelance site?”

**Answer to demonstrate:** The platform gives a newcomer a controlled way to earn a first verified record without competing globally on reputation alone.

- **Frontend:** Student discovery, proposal, workspace, and profile views exist. **Add** availability, a profile-completion checklist, beginner-ready filter, saved gigs, and a private earnings/transaction history.
- **Backend:** Store portfolio links and evidence, proposal eligibility, completed-work records, ratings, and a generated verified-completion record. Do not allow an employer to see private verification documents.
- **Design rule:** A new student may apply after identity verification, but their visible profile must clearly distinguish self-declared skills from platform-verified completion evidence.

### 5. “What does verified mean?”

**Answer to demonstrate:** It is a defined status, not a decorative badge.

- **Frontend:** The registration upload simulation and admin verification queue already exist. **Extend** them with review status, rejection reason, consent notice, and only the necessary badge detail: `Student identity verified` or `Business identity verified`.
- **Backend:** Create `verification_requests`, private `verification_documents`, reviewer decisions, expiry/re-verification dates, and `audit_events`. Students submit college email and/or ID; businesses submit official email plus a suitable registration or ownership document. Admins see private, signed document links only.
- **Security:** Encrypt document references, use private object storage and short-lived signed URLs, virus-scan uploads, rate-limit attempts, and retain documents only for the defined purpose. Launch with users aged 18+ unless a separate minor-consent policy is approved.

### 6. “How will you prevent fake gigs, fraud, unpaid work, and poor quality?”

**Answer to demonstrate:** Prevention comes from business verification, a mandatory scope template, payment status before work, evidence at each milestone, a limited revision path, and a documented dispute procedure.

- **Frontend:** Milestone and dispute UI is present. **Add** report-listing controls, a clear scope-acceptance screen, milestone due-date warnings, and a student-facing “raise dispute” flow with evidence upload.
- **Backend:** Require a verified business plus moderator checks for first listings. Validate budget, milestones, dates, and prohibited content. Create an append-only ledger for payment events and an audit log for state changes. Flag suspicious accounts based on velocity, duplicate payment methods, repeated rejected verification, and unresolved disputes for manual review.
- **Quality control:** Each milestone has acceptance criteria, one agreed revision allowance, a deadline, submission evidence, reviewer feedback, and a dispute escalation action. Ratings are permitted only after contract completion or formal cancellation.

### 7. “Which gigs are suitable for students and how do you protect them from exploitation?”

**Answer to demonstrate:** We permit bounded, paid, skills-building tasks and reject work that is unsafe, illegal, academic dishonesty, or disguised full-time employment.

- **Frontend:** The posting wizard already captures category, skills, budget, location, milestones, and duration. **Extend** it with estimated hours, a required minimum budget rule, revision count, client-supplied resources, confidentiality category, and a signed task-standard checkbox.
- **Backend:** Maintain a `gig_policy_rules` configuration and moderation queue. Reject unsafe categories and descriptions; require at least one measurable deliverable; record acceptance of contractor terms. Log every moderation decision.
- **Launch catalogue:** web/UI work, design, video editing, content, social media, data/Excel, research, presentations, and approved tutoring. Do not allow students to complete another person’s graded academic work.

### 8. “How will you handle confidentiality, IP, and data security?”

**Answer to demonstrate:** Sensitive access is minimised and the contract tells both sides who owns what.

- **Frontend:** **Add** confidentiality/IP terms to the scope-acceptance step; add an “access needed” field to gig posting; show a confidentiality indicator without exposing detail publicly.
- **Backend:** Store accepted terms version, a per-contract confidentiality flag, and an IP handover clause. Use role and ownership checks on every API request. Private deliverables use signed URLs. Never put access credentials in messages; provide a secure warning and allow the business to revoke shared access outside the platform.
- **Policy:** Work product transfers according to the agreed contract after final approved payment; pre-existing student portfolio material remains theirs unless separately agreed.

### 9. “What is the revenue model?”

**Answer to demonstrate:** The model starts with proven value, not an untested fee assumption.

- **Frontend:** **Add** a transparent pricing page, a checkout fee breakdown, invoices/receipts, and a promotional-code/admin waiver mechanism. Do not show an invented platform fee in the current UI.
- **Backend:** Store fee policy version, platform fee, provider charge, tax fields, invoice reference, and net student payout on each transaction. Pricing is calculated server-side, never in the browser.
- **Recommended experiment:** free basic employer posting during launch; test either a small successful-completion fee or paid employer tools after sufficient repeat use. Compare conversion, repeat posting, and gross margin before committing to subscription pricing.

### 10. “How will you solve the two-sided marketplace problem?”

**Answer to demonstrate:** Start geographically and operationally small, with committed supply and demand, rather than launching an empty marketplace.

- **Frontend:** The existing campus/city filters are useful. **Add** onboarding waitlists, referral codes, partner badges, an invite-only employer launch option, and an “available now” student signal.
- **Backend:** Model `campuses`, `partner_organisations`, invite codes, referral attribution, student availability, and employer onboarding stage. Add manual admin tools to approve launch cohorts.
- **Operating plan:** Obtain 5–10 real, verified SMEs with one scoped task each before broad student marketing. Onboard students into the specific skills the partners need. Run concierge matching initially; automate only after observing successful matches.

### 11. “Why local? Does that limit growth?”

**Answer to demonstrate:** Locality is a trust and operating wedge, not a wall. It helps partner acquisition, verification, and on-site gigs; remote work stays open to compatible verified students.

- **Frontend:** The explorer and posting wizard already have hyper-local, city-wide, and remote work modes. **Connect** these to actual location-preference data. **Add** travel/attendance requirements and an “open to India” setting.
- **Backend:** Store city, state, campus, work mode, and optional travel radius separately. Apply location as a scored preference for remote work and a hard requirement only for legitimately on-site tasks.
- **Measurement:** Compare response time, successful completion, and repeat hiring for hyper-local vs remote work before expanding beyond the initial city/campus cluster.

### 12. “How will matching work and how will you avoid fake AI claims?”

**Answer to demonstrate:** Version 1 is explainable matching, not opaque AI.

- **Frontend:** Applicant cards currently show a static match score. **Correct** this. Display a calculated score with reasons such as “3 of 4 required skills”, “remote compatible”, “available before deadline”, and “2 verified completions”.
- **Backend:** Create a deterministic matching service that scores only consented, relevant fields: verified status, skills overlap, work mode/location compatibility, budget/duration fit, availability, rating, and verified completion count. Save the score inputs for audit. Never auto-reject solely on a score.
- **Later phase:** Train or use AI only after there is consented, quality-labelled historical data and an appeal/explanation mechanism. AI matching is future scope, consistent with the synopsis.

### 13. “How do payment, milestones, revisions, refunds, and disputes work?”

**Answer to demonstrate:** A contract is funded only after scope acceptance; every movement is provider-confirmed and auditable.

- **Frontend:** The wizard, workspaces, milestone timeline, revision control, and admin dispute desk exist. **Correct** the current first-milestone-only deposit wording. For the trust promise, the full agreed contract amount must be committed before work starts, or the UI must explicitly say that later milestones are not funded. **Add** payment checkout, payment receipt, transaction history, release-pending state, cancel/dispute action, and evidence uploader.
- **Backend:** Create `contracts`, `milestones`, `payment_intents`, `payment_events`, `payouts`, `refunds`, `disputes`, `dispute_evidence`, and `ledger_entries`. The server creates payment orders; the provider webhook is the only authority that marks a payment funded, paid out, refunded, or failed. Use idempotency keys for every money-changing request.
- **Provider design:** In sandbox, label it “sandbox payment simulation”. For production, integrate an authorised marketplace/payment-aggregator provider such as Razorpay Route or an equivalent contracted provider. VeriGig must not hold raw card/UPI data or operate its own escrow account.
- **Dispute policy:** Allow either party to open a case before payout; freeze the affected milestone; ask both parties for evidence; target a defined response and resolution SLA; record an admin decision and provider refund/payout result. Do not present a single-click 50/50 split as an automatic real-money action.

### 14. “What proves that there is demand?”

**Answer to demonstrate:** The survey identifies a credible problem and feature priorities, but the next proof is behavioural.

- **Frontend:** **Add** an admin research/validation dashboard with real counts only. Hide the hard-coded “live metrics”, “₹840,000 total volume”, “98.4% payout rate”, and campus figures until backed by production data.
- **Backend:** Create event tracking for registration completed, verification approved, gig published, proposal sent, interview booked, contract funded, milestone submitted, milestone approved, payout completed, dispute opened, and rehire. Link events to a non-identifying user and gig ID.
- **Validation gates:** Track partner conversion, fill rate, time-to-first-proposal, funded-contract rate, completion rate, average budget, dispute rate, student earnings, and 30-day repeat posting. A pilot succeeds only if these improve from a documented baseline.

### 15. “What is the MVP, first market, and measure of success?”

**Answer to demonstrate:** MVP is a verified, scoped, milestone-tracked task from a small Punjab campus/SME cohort—not a nationwide AI freelance platform.

- **MVP includes:** authentication; roles and RBAC; student/business verification; profile/portfolio; gig posting/discovery; application/shortlisting; messaging/interview; two-party scope acceptance; sandbox or provider-backed payment status; milestone submissions; ratings; disputes; notifications; and truthful analytics.
- **First market:** one city/campus cluster, initially with partner SMEs and students in web, design, content, digital marketing, video, data/Excel, and presentations—the categories most visible in the survey.
- **Out of MVP:** nationwide expansion, opaque AI selection, platform-held balances, unmoderated marketplace access, complex subscriptions, and broad employment hiring.

## 4. Current frontend inventory and required work

| Current area | Current status | Required implementation work |
| --- | --- | --- |
| [Landing page](../frontend/src/pages/LandingPage.tsx) | Comparison/USP content, category previews, and hard-coded traction claims. | Connect curated gig previews to public API. Remove or label all seeded traction/performance claims as demo data. Add factual pricing, safety, and partner information. |
| [Authentication](../frontend/src/pages/AuthPage.tsx) | Role selection and document-upload simulation. | Connect registration/login, email verification, password reset, consent, session refresh, role selection, and private upload flow. Add protected routes. |
| [Student dashboard](../frontend/src/pages/student/StudentDashboard.tsx) | Earnings, milestones, and active contracts visualised with mock data. | Connect user-specific overview API. Add real transaction states, actionable tasks, and empty/error states. |
| [Gig explorer](../frontend/src/pages/student/GigExplore.tsx) | Client-side search plus category, duration, location, and payment filters. | Move filtering, pagination, sort, and eligibility checks to API query parameters. Add saved searches/gigs, remote preference, beginner-ready, and verified-only filters. |
| [Gig details and proposal](../frontend/src/pages/student/GigDetails.tsx) | Scope, milestones, trust panel, and proposal drawer. | Persist proposals; validate duplicate/late applications; show verified business history; require terms acceptance. Replace unsupported “100% dispute-free” language with calculated data or omit it. |
| [Student workspace](../frontend/src/pages/student/StudentWorkspace.tsx) | Milestone submission, URLs, review state, and payout simulation. | Add private file upload, versioning, timestamps, evidence, submission/revision history, payment status, dispute opening, and transaction records. |
| [Student profile](../frontend/src/pages/student/StudentProfile.tsx) | Static portfolio items, skills, reviews, and verified label. | Add profile editor, skill evidence, portfolio uploads/links, availability, privacy controls, and API-backed verified completion records. |
| [Employer dashboard](../frontend/src/pages/employer/EmployerDashboard.tsx) | Listing and applicant summaries. | Connect business-specific metrics, verification status, and actionable review queue. Add employer profile and team access later. |
| [Post-gig wizard](../frontend/src/pages/employer/PostGigWizard.tsx) | Four-step scoped gig/milestone form with client-side total. | Add drafts, server validation, moderation, policy acknowledgement, estimated hours, revision count, confidentiality, scope agreement, and actual payment order/checkout. Change first-milestone-only funding wording. |
| [Applicant tracker](../frontend/src/pages/employer/GigApplicants.tsx) | Shortlisting, portfolios, and simulated “hire & fund”. | Persist pipeline status, messaging, interview booking, score explanation, candidate rubric, contract offer, payment gate, and rejection notifications. |
| [Employer workspace](../frontend/src/pages/employer/EmployerWorkspace.tsx) | Deliverable inspection, revision, approval, and rating UI. | Connect provider-confirmed milestone release, evidence view, overdue reminders, cancellation/dispute action, review persistence, and receipts. |
| [Admin verifications](../frontend/src/pages/admin/AdminVerifications.tsx) | Queue, image preview, approval, and rejection simulation. | Secure document retrieval, access log, reviewer identity, reason codes, expiration/recheck workflow, abuse controls, and private storage policy. |
| [Admin disputes](../frontend/src/pages/admin/AdminDisputes.tsx) | Admin-only case view and instant outcome buttons. | Add claimant intake, evidence, messaging, SLA dates, conflict-of-interest assignment, provider refund/payout request, and immutable decision record. |
| [Admin analytics](../frontend/src/pages/admin/AdminAnalytics.tsx) | Mostly seeded/hard-coded platform metrics. | Replace all figures with aggregated event/transaction data and dates. Add pilot KPIs, cohort filters, export, and strict admin-only access. |
| [Marketplace context](../frontend/src/context/MarketplaceContext.tsx) | In-memory state generates IDs and mutates mock arrays. | Replace action methods with API client calls, cache/query layer, loading/error handling, optimistic updates only where safe, and server-state refetch after payment webhooks. |
| [Notifications](../frontend/src/components/shared/NotificationDrawer.tsx) | Local notification drawer. | Persist read state; send in-app/email notifications from an event outbox; include preferences, retries, and links only to authorised resources. |

### User-facing flows that are missing or incomplete

1. In-platform conversation and interview scheduling.
2. Employer business profile, verification status, and rehire list.
3. Student profile editing, availability, privacy settings, consent, and account deletion request.
4. Two-party contract/scope acceptance with revision, IP, confidentiality, and cancellation terms.
5. Payment checkout, receipts, payout/transaction history, and provider-confirmed status.
6. Student-facing dispute intake, evidence upload, and status updates.
7. Saved gigs, saved searches, beginner-ready and availability filters.
8. Real file attachments, versioned deliverables, safe downloads, and file scanning.
9. Reporting/blocking, moderation queue, and user suspension controls.
10. Truthful analytics populated from live events rather than seed data.

## 5. Proposed backend architecture

This is a proposed baseline for approval before coding. It deliberately fits the existing React + TypeScript frontend and the synopsis requirement for a relational database.

```text
React / Vite frontend
        |
        | HTTPS, authenticated REST API
        v
TypeScript Fastify API
  |- identity and role access
  |- marketplace domain modules
  |- payment webhook verifier
  |- admin/governance module
  |- event outbox
        |                 |                 |
        v                 v                 v
 PostgreSQL          Private object      Payment provider
 (transactions,      storage for          (sandbox first;
 state, audit)       documents/files      authorised production flow)
        |
        v
 Background worker / n8n for non-critical notifications and reports
```

### Why this architecture

- **TypeScript Fastify API:** preserves a single language across the current React codebase and gives schema-based request validation. The alternative—putting business rules in React context—would make fraud checks, permissions, payment verification, and auditability impossible.
- **PostgreSQL:** contracts, milestones, payment states, disputes, and reviews need relational integrity and transactions. A document-only store would make these links and state transitions harder to enforce.
- **Private object storage:** documents and deliverables should not sit in the database or public URLs.
- **Provider-owned payment flow:** protects users and avoids attempting to operate a regulated payment/escrow system.
- **n8n only for non-critical automation:** use it for email reminders, partner CRM sync, and scheduled reporting. Payment, verification, contract, and dispute state changes always originate in the API and database, not an automation workflow.

### Modules and API responsibilities

| Module | Main responsibility | Representative API behaviour |
| --- | --- | --- |
| Identity and access | Register, log in, verify email, create secure session, reset password, enforce roles. | A student cannot read another student’s verification document; an employer can only view applicants to its own gig. |
| Profiles and portfolio | Maintain public profile fields and private account settings. | Publish only consented skills, portfolio links, rating, and verified-completion summary. |
| Verification | Intake and review student/business evidence. | Upload returns a private-file reference; admin decision changes public badge only after approval. |
| Gigs | Create drafts, validate/publish/moderate listings, search/filter. | A gig cannot publish without a verified employer, measurable deliverables, budget, dates, and terms. |
| Applications and matching | Submit/withdraw proposals, shortlist, explain ranking. | Match score is computed server-side with visible reasons; it does not make an irreversible decision. |
| Contracts and milestones | Record accepted scope and manage state transitions. | Both parties accept the same terms version before the contract can seek funding. |
| Files and deliverables | Store evidence, revisions, and signed access. | Submission creates a new version, never overwrites the previous delivered evidence. |
| Payments | Create provider orders, verify webhooks, record fee/ledger entries, request payout/refund. | Client confirmation never marks money paid; only a verified provider webhook does. |
| Messaging and notifications | Authorised conversation, interview slots, in-app/email alerts. | Every message is tied to a gig/application/contract and is reportable. |
| Reviews and completion proof | Publish double-sided review after eligible outcome. | A review is immutable after a short correction window and is linked to a real completed contract. |
| Disputes and governance | Intake, evidence, assignment, resolution, suspension, audit. | A case freezes only the affected unfunded/unreleased amount and records the administrator’s decision. |
| Analytics | Aggregate events and financial statuses for admins. | Metrics use timestamps and actual records; never seeded values. |

### Core data model

| Entity | Required relationships and data |
| --- | --- |
| `users`, `sessions`, `consents` | Identity, role, password hash/session metadata, email/phone verification, policy versions accepted. |
| `student_profiles`, `business_profiles`, `campuses` | Public profile, location/work preferences, portfolio references, availability, business registration details, partner status. |
| `verification_requests`, `verification_documents`, `verification_reviews` | Private evidence, status, expiry, reviewer, reason codes, and access logs. |
| `gigs`, `gig_skills`, `gig_milestones`, `gig_policy_flags` | Draft/published lifecycle, category, scope, hours, work mode, budget, timeline, revisions, moderation decision. |
| `applications`, `application_scores`, `shortlists`, `interviews` | Proposal, transparent score inputs, status history, interview schedule, employer rationale. |
| `contracts`, `contract_acceptances`, `milestones`, `deliverable_versions` | Accepted terms snapshot, assignee, state, acceptance criteria, files/URLs, feedback, timestamps. |
| `payment_intents`, `payment_events`, `payouts`, `refunds`, `ledger_entries` | Provider references, idempotency keys, status, fee/tax breakdown, append-only monetary audit trail. |
| `conversations`, `messages`, `notifications` | Authorised communication, report status, read state, event delivery status. |
| `reviews`, `completion_records` | Ratings, written feedback, project evidence summary, generated verification link/record. |
| `disputes`, `dispute_evidence`, `dispute_decisions`, `audit_events` | Case reason, evidence, actions, decision, actor, time, immutable audit history. |
| `product_events` | Funnel events for real analytics and pilot measurement. |

### State machine that the API must enforce

```text
Account: registered -> email_confirmed -> verification_pending -> verified | rejected | suspended

Gig: draft -> moderation_pending -> open -> offer_pending -> funded -> in_progress
     -> completed | cancelled | disputed

Milestone: locked -> active -> submitted -> under_review
           -> revision_requested -> submitted
           -> approved -> release_pending -> paid
           -> disputed -> resolved_refund | resolved_payout | resolved_split
```

Only permitted transitions are accepted. For example, the browser cannot mark a milestone paid; a verified payment-provider webhook and the server’s transaction determine that state. Every transition writes an `audit_event` and, where needed, an outbox notification event in the same database transaction.

## 6. Payment and dispute design in detail

1. **Scope first:** Employer submits a detailed gig. Student accepts the final brief, milestones, revision count, deadline, and terms.
2. **Funding next:** API creates an order with the payment provider. The contract becomes funded only after the provider’s signed webhook confirms payment. The full contract should be committed for the strong student-protection promise.
3. **Work and evidence:** The active milestone defines what the student submits. Every submission creates a timestamped version and may include files, link, notes, and repository URL.
4. **Review:** Employer approves, requests a permitted revision with specific feedback, or opens a dispute. A reminder and eventual escalation route prevent silent delay.
5. **Release:** Approval creates a provider payout/release request. A second webhook confirms actual payout; only then is the student’s transaction record marked paid.
6. **Dispute:** The affected milestone is frozen. Both sides upload evidence. An assigned admin records a reasoned decision. Refund, payout, or split is requested from the provider and confirmed by webhook.
7. **Completion:** When all milestones are paid or a formal resolution ends the contract, both eligible parties can rate. The student receives a verified completion record.

## 7. Security, privacy, and fairness baseline

- Use server-side role and ownership checks on every request. Never rely only on hidden buttons or client routing.
- Store passwords with a modern password hash; use secure, HTTP-only sessions, email verification, rate limiting, and login/audit logs.
- Keep verification documents private. Public profiles show a status badge, not roll number, ID image, address, or document number.
- Use signed uploads/downloads, file-size/type limits, malware scanning, and virus-safe preview generation.
- Record consent and terms versions. Provide privacy, terms, acceptable-gig policy, grievance/dispute policy, and deletion/request channels before collecting IDs.
- Encrypt sensitive values at rest where feasible, rotate credentials, validate all input server-side, and protect webhook signatures.
- Give both users clear explanations for verification rejection, proposal rejection where supplied, match criteria, payment status, and dispute outcome.
- Add a manual appeal route for verification and moderation decisions. Do not make automated matching or fraud flags a final decision by themselves.

## 8. Delivery order and acceptance checkpoints

### Priority 0: Make the existing demonstration truthful

1. Label seed users, payment actions, verification actions, and analytics as demo/sandbox data.
2. Remove unsupported metrics and claims from the landing page, gig trust panel, and admin analytics.
3. Replace static match scores with “demo score” until the matching API exists.
4. Correct the payment wording so a judge cannot infer real escrow or full funding where neither exists.

**Checkpoint:** A presentation can accurately say “the prototype demonstrates the workflow; live financial and identity operations are not yet enabled.”

### Priority 1: Functional marketplace core

1. API foundation, database migrations, authentication, role guards, profile management, and audit events.
2. Student/business verification with consent and private document storage.
3. Gig drafts/publishing, moderation, discovery, applications, and applicant tracking.
4. Messaging/interview, scope acceptance, contract creation, milestones, private submission files, review, and notifications.

**Checkpoint:** A verified business and verified student can complete an end-to-end, non-financial sandbox contract in separate accounts, with every state persisted after refresh.

### Priority 2: Payment-backed trust and governance

1. Payment-provider sandbox integration, webhook verification, transaction ledger, receipts, payout/refund states.
2. Student-facing disputes, evidence, admin assignment, SLA reminders, and immutable decisions.
3. Ratings, verified completion records, rehire flow, and real analytics events.

**Checkpoint:** A provider-sandbox contract cannot progress to paid without a verified webhook, and a dispute freezes the correct milestone while retaining evidence.

### Priority 3: Pilot and measured improvement

1. Recruit a small verified SME cohort and skills-matched student cohort.
2. Run assisted matching; record all funnel events and feedback.
3. Test fee options only after actual successful completions.
4. Improve ranking from observed data, preserving explanation and human review.

**Checkpoint:** Report pilot data as pilot data: verified registrations, active postings, proposals, funded contracts, completion, time to fill, disputes, student earnings, and rehires.

## 9. Presentation proof pack

For a judge demonstration, show one clean path rather than every page:

1. Verified SME posts a well-scoped 1–2 week micro-gig with measurable milestones.
2. Verified student finds it through skills and remote/local compatibility, sees why it matches, and applies with portfolio evidence.
3. SME messages/interviews, compares candidates, and accepts the identical scope/terms.
4. The payment screen shows **sandbox funded** status, not a fictional real escrow.
5. Student submits versioned work. SME approves or requests a specific revision.
6. A provider-confirmed sandbox payout creates a receipt and verified completion record.
7. Briefly show the dispute evidence path and admin audit record.
8. Close with the real pilot metrics dashboard and the survey’s directional findings, including its sample limitation.

That sequence answers the USP, trust, matching, payment, quality, privacy, revenue, and scalability questions through observable behaviour.

## 10. Decisions needed before coding

1. Approve the proposed TypeScript Fastify + PostgreSQL baseline, or select another backend stack.
2. Choose the first pilot city/campus and identify the initial SME partners.
3. Decide whether Priority 1 ends at an explicitly labelled payment sandbox or includes a contracted provider sandbox integration.
4. Confirm the launch policy: age 18+, allowed gig catalogue, minimum budget rule, standard revision allowance, and dispute response/resolution targets.
5. Choose the initial pricing experiment only after pilot demand is measured.

Until those decisions are made, do not build live payment, verification, or data-retention functionality. They involve external providers, operational policy, and potentially legal/compliance obligations.
