# VeriGig Master Implementation Roadmap & Checklist

> **Single Source of Truth Checklist for Engineering Tasks**  
> Formatted as sequential, checkable, and atomic steps. When a step is completed, mark it `[x]` and advance directly to the subsequent step without re-evaluating priorities.  
> Blueprint reference: [[Judge-Readiness-Implementation-Blueprint]] | Decisions: [[decision.md]] | Journey: [[JOURNEY.md]]

---

## 🧭 The Global Judge Defense Matrix (Why Every Task Exists)

Every task in this checklist is directly tied to answering a specific, hard judge question through **demonstrated product behaviour**, not slide claims. Keep this intent in mind on every task:

| Judge Question | Core Defense & Product Behaviour | Governed By Phases |
| :--- | :--- | :--- |
| **Q1. What exact problem are you solving?** | Students lack a safe first paid project; SMEs cannot safely delegate small jobs. VeriGig provides a bounded, beginner-ready micro-gig workflow with payment commitments. | Phase 0, Phase 4, Phase 6 |
| **Q2. What is the USP vs Internshala, Upwork, WhatsApp?** | VeriGig is NOT a bidding market or internship board. It controls the lifecycle: structured brief, milestone lock, immutable activity records, and verified completion certificates. | Phase 0, Phase 4, Phase 6, Phase 9 |
| **Q3. Why would an SME use this instead of their network?** | Fast shortlisting from verified portfolios, structured scope agreements, trackable milestone sign-offs, and an accountable rehire record. | Phase 4, Phase 5, Phase 6, Phase 9 |
| **Q4. Why would a student use it?** | A newcomer gets a structured path to a first verified completion record without competing globally against established agencies on reputation alone. | Phase 2, Phase 5, Phase 9 |
| **Q5. What does "verified" actually mean?** | Not a cosmetic badge. Private document check (college email/ID; business registration) with signed access, reviewer decisions, and privacy preservation (DPDPA 2023). | Phase 3, Phase 10 |
| **Q6. How do you prevent fake gigs, fraud, and non-payment?** | Mandatory scope template, business verification, payment commitment prior to work, milestone evidence, capped revision cycles, and an append-only audit trail. | Phase 0, Phase 4, Phase 6, Phase 7, Phase 8 |
| **Q7. Which gigs are suitable? How to protect from exploitation?** | Bounded digital deliverables only; minimum budget floor; estimated hours; explicit rejection of graded academic dishonesty and hazardous work. | Phase 4 |
| **Q8. How do you handle confidentiality, IP, and data security?** | Two-party contract acceptance with explicit IP assignment clauses, signed deliverable URLs, role-based access checks, and confidentiality flags. | Phase 2, Phase 3, Phase 6 |
| **Q9. What is the revenue model?** | Free basic employer posting during initial pilot to drive adoption; tested successful-completion fee or employer tools; server-side fee calculations. | Phase 0, Phase 7 |
| **Q10. How do you solve the two-sided cold-start problem?** | Hyper-local wedge: start with 5–10 verified partner SMEs and targeted student cohorts before expanding; availability signals and cohort onboarding. | Phase 2, Phase 4, Phase 5 |
| **Q11. Why local? Does it limit growth?** | Locality is a trust wedge, not a wall: it aids verification and on-site tasks, while remote gigs remain open to compatible verified students nationwide. | Phase 4, Phase 5 |
| **Q12. How does matching work without fake AI claims?** | Version 1 is explainable, deterministic matching (skills overlap, work mode, availability, past verified completions) with clear breakdowns—not opaque AI black-boxes. | Phase 0, Phase 5 |
| **Q13. How do payment, milestones, refunds, and disputes work?** | Full contract commitment into sandbox/provider escrow before work starts; webhook-driven milestone payouts; freeze on dispute; formal admin arbitration. | Phase 0, Phase 6, Phase 7, Phase 8 |
| **Q14. What proves that there is demand?** | Honest behavioral event tracking (registrations, proposals, funded contracts, fill rates, completion rates); no fabricated vanity metrics. | Phase 0, Phase 7, Phase 10 |
| **Q15. What is the MVP and measure of success?** | A verified, scoped, milestone-tracked task from a regional campus/SME cluster—validated through real end-to-end contract completions. | Phase 1 to Phase 10 |

---

## Phase 0: Demo Integrity & Frontend Truthfulness (Pre-Backend Polish)
*Objective: Eliminate deceptive claims, label mock/seed data as sandboxed/demonstration, and ensure the UI truthfully presents its current state to evaluators and judges.*

- [x] **0.1 Landing Page Truthfulness Audit (`LandingPage.tsx`)**
  - [x] Replace or label simulated platform metrics ("1,400+ verified students", "₹840,000 volume", "98.4% payout") with sandbox/demonstration indicators.
  - [x] Update fee comparison copy from generic "20%+ fee" to transparent pilot pricing explanation (free basic posting during pilot).
  - [x] Add transparent explanation of the verified milestone trust workflow with visual sample contract breakdown.
- [x] **0.2 Trust & Match Score Representation (`GigDetails.tsx`, `GigApplicants.tsx`)**
  - [x] Replace static hardcoded match percentages with an explainable badge labeled "Fit Score (Skills, Location Match)".
  - [x] Remove or nuance unsupported absolute claims such as "100% dispute-free guarantee" with calculated or pilot disclaimer.
- [x] **0.3 Funding & Escrow Wording Correction (`PostGigWizard.tsx`, `EmployerWorkspace.tsx`)**
  - [x] Rectify "First milestone deposit only" wording: clarify that in the complete trust model, entire contract commitment is pre-authorized/committed before work begins.
  - [x] Explicitly tag simulated payment triggers as "Sandbox Payment Simulation".
- [x] **0.4 Admin Analytics Calibration (`AdminAnalytics.tsx`)**
  - [x] Tag mock volume, GMV, and university counts clearly as "Seeded Pilot Demonstration Data".

---

## Phase 1: Backend Scaffolding & Core Architecture
*Objective: Set up the production-grade TypeScript Fastify REST API, PostgreSQL database schemas, and migration runner.*

- [x] **1.1 Server Workspace Setup (`/backend`)**
  - [x] Initialize Fastify TypeScript project with strict `tsconfig.json`, `pnpm`/`npm`, and dev scripts (`tsx` / `fastify-cli`).
  - [x] Configure environment variables validation with Zod / `@fastify/env` (`PORT`, `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `STORAGE_PATH`).
  - [x] Configure Fastify plugins: CORS, `@fastify/helmet`, `@fastify/cookie`, `@fastify/jwt`, and JSON schema error handler.
- [x] **1.2 Database & Migration Engine**
  - [x] Configure PostgreSQL client (Drizzle ORM and node-postgres pool).
  - [x] Set up migrations directory and automated migration scripts (`drizzle.config.ts`, `drizzle-kit generate`, `src/db/migrate.ts`).
  - [x] Create core tables:
    - [x] `users` (id, email, password_hash, role, status, email_verified, created_at, updated_at)
    - [x] `sessions` (id, user_id, refresh_token_hash, expires_at, created_at)
    - [x] `consents` (id, user_id, consent_type, version, granted_at, ip_address)
    - [x] `student_profiles` (id, user_id, full_name, college_name, degree, graduation_year, bio, skills, location, work_mode_preference, portfolio_links, availability_status, rating_avg, completed_gigs_count)
    - [x] `business_profiles` (id, user_id, company_name, business_type, registration_number, website, description, city, state, contact_phone, verified_badge)
    - [x] `campuses` (id, name, city, state, domain, partner_status)
    - [x] `audit_events` (id, actor_id, event_type, entity_type, entity_id, payload, created_at)

---

## Phase 2: Authentication, Authorization & Role-Based Access
*Objective: Build secure, compliant authentication and private profile management.*

- [x] **2.1 Auth Endpoints & Business Logic**
  - [x] `POST /api/v1/auth/register` (student & business paths, role assignment, DPDPA consent recording, profile creation).
  - [x] `POST /api/v1/auth/login` (password verification with bcrypt, suspension check, issue HTTP-only secure cookie / JWT).
  - [x] `POST /api/v1/auth/refresh` & `POST /api/v1/auth/logout` (cryptographic refresh token rotation in sessions table).
  - [x] `GET /api/v1/auth/me` (returns session identity, active role, and associated profile).
- [x] **2.2 Route Guards & RBAC Middleware**
  - [x] Fastify preHandler hook for authenticated sessions (`authenticate` in `src/middleware/auth.guard.ts`).
  - [x] Role verification hooks: `requireRole(['student'])`, `requireRole(['employer'])`, `requireRole(['admin'])`.
- [x] **2.3 Profile Management Endpoints**
  - [x] Student profile CRUD (`GET /api/v1/profiles/students/me`, `PUT /api/v1/profiles/students/me`, `GET /api/v1/profiles/students/:id` public view).
  - [x] Business profile CRUD (`GET /api/v1/profiles/employers/me`, `PUT /api/v1/profiles/employers/me`, `GET /api/v1/profiles/employers/:id` public view).
  - [x] Data minimization: public profiles strictly omit raw college ID, registration docs, and private phone numbers.

---

## Phase 3: Identity Verification & Private Document Management
*Objective: Private student and business credential verification with admin audit queue.*

- [x] **3.1 Verification Storage & Schema**
  - [x] Create `verification_requests` and `verification_documents` tables with enums and relationships.
  - [x] Configure private object storage (`PrivateStorageService` in `src/services/storage.service.ts`).
  - [x] File validation: MIME-type checking (JPEG, PNG, WEBP, PDF), max file size (5MB), collision-resistant sanitized filenames.
- [x] **3.2 Verification API**
  - [x] `POST /api/v1/verifications/submit` (student college ID card / business registration with private storage streaming).
  - [x] `GET /api/v1/verifications/status` (current verification state, reviewer notes, and expiration date).
- [x] **3.3 Admin Verification Desk API**
  - [x] `GET /api/v1/verifications/admin/queue` (filter by pending, student, business with applicant profile enrichment).
  - [x] `GET /api/v1/verifications/admin/requests/:requestId/documents/:docId` (secure document streaming with audit logging).
  - [x] `POST /api/v1/verifications/admin/requests/:id/review` (approve / reject with reason code; grants trust badges and logs audit events).

---

## Phase 4: Gig Lifecycle, Scoping & Policy Engine
*Objective: Structured gig posting, scope validation, beginner-friendly filters, and policy enforcement.*

- [x] **4.1 Gig Database Schema**
  - [x] `gigs` (id, employer_id, title, category, description, gig_level, work_mode, city, state, estimated_hours, total_budget, max_revisions, deadline, status, moderation_status, created_at)
  - [x] `gig_milestones` (id, gig_id, sequence_order, title, description, deliverable_criteria, amount, duration_days)
  - [x] `gig_policy_flags` (id, gig_id, flag_reason, policy_rule, reviewed_by, status)
- [x] **4.2 Gig Management API**
  - [x] `POST /api/v1/gigs` (publishing validation: requires min budget ₹1,500, milestone total sum matching, detailed deliverables).
  - [x] `GET /api/v1/gigs` (public search & filtering: category, duration, work_mode, city, beginner-ready, budget range, pagination).
  - [x] `GET /api/v1/gigs/:id` (detailed brief, milestone schedule, employer verification badge).
- [x] **4.3 Policy & Moderation Gate**
  - [x] Input moderation rules: reject academic cheating, homework proxy, hazardous tasks, and unfair terms.
  - [x] Admin moderation endpoint (`GET /api/v1/gigs/admin/pending`, `POST /api/v1/gigs/admin/:id/moderate`).

---

## Phase 5: Proposals, Candidate Pipeline & Explainable Matching
*Objective: Student proposal submissions, employer candidate comparison, and transparent match scoring.*

- [x] **5.1 Applications Schema**
  - [x] `applications` (id, gig_id, student_id, cover_note, proposed_timeline, portfolio_items, status [submitted, shortlisted, interviewed, rejected, hired], created_at)
  - [x] `interviews` (id, application_id, scheduled_at, meeting_link_or_instructions, status, notes)
- [x] **5.2 Application Workflows API**
  - [x] `POST /api/v1/gigs/:id/apply` (verified student only, duplicate application check, terms acceptance).
  - [x] `GET /api/v1/student/applications` (student tracking their submitted proposals).
  - [x] `GET /api/v1/gigs/:id/applications` (employer viewing applicant dossier for their gig).
  - [x] `PATCH /api/v1/applications/:id/status` (employer shortlisting, rejecting with optional reason).
- [x] **5.3 Explainable Candidate Fit Scoring Engine**
  - [x] Deterministic fit service scoring:
    - Skill overlap (e.g., 3/4 required skills = 75%)
    - Work mode & location compatibility (remote = full match; on-site = city match)
    - Availability fit vs gig duration
    - Verified completion history & rating
  - [x] Expose breakdown object in API: `{ overallScore: 88, breakdown: ["All required skills present", "Matches remote preference", "2 past verified completions"] }`.

---

## Phase 6: Contracts, Two-Party Scope Acceptance & Milestone Execution
*Objective: Binding two-party scope acceptance, versioned deliverable submissions, and revision cycles.*

- [x] **6.1 Contract & Milestone State Machine**
  - [x] `contracts` (id, gig_id, application_id, student_id, employer_id, total_amount, terms_version, confidentiality_accepted, ip_clause_accepted, status [scope_pending, funded, in_progress, completed, cancelled, disputed], created_at)
  - [x] `contract_milestones` (id, contract_id, sequence_order, title, criteria, amount, status [locked, active, submitted, under_review, revision_requested, approved, paid, disputed], due_date)
  - [x] `deliverable_submissions` (id, milestone_id, version_number, student_notes, repository_url, file_references, submitted_at)
  - [x] `revision_requests` (id, milestone_id, feedback_text, requested_at)
- [x] **6.2 Contract Lifecycle API**
  - [x] `POST /api/v1/contracts/create-offer` (employer initiates offer from shortlisted application).
  - [x] `POST /api/v1/contracts/:id/accept-scope` (student signs scope, IP terms, confidentiality).
  - [x] `GET /api/v1/contracts/:id` (complete contract timeline, active milestone, deliverable history).
- [x] **6.3 Deliverable Submission & Review API**
  - [x] `POST /api/v1/contracts/:id/milestones/:milestoneId/submit` (student submits deliverables; milestone moves to `submitted`/`under_review`).
  - [x] `POST /api/v1/contracts/:id/milestones/:milestoneId/request-revision` (employer requests change within allowed revision limit).
  - [x] `POST /api/v1/contracts/:id/milestones/:milestoneId/approve` (employer approves deliverable; triggers payment release state).

---

## Phase 7: Payment Commitment, Sandbox Escrow Ledger & Webhooks
*Objective: Auditable financial state machine, payment intent tracking, and webhook-driven settlement.*

- [x] **7.1 Financial Ledger Schema**
  - [x] `payment_intents` (id, contract_id, order_id, amount, currency, provider_status, idempotency_key)
  - [x] `payment_events` (id, payment_intent_id, event_type, provider_reference, raw_payload, created_at)
  - [x] `payouts` (id, contract_milestone_id, recipient_id, amount, fee_deducted, status, provider_payout_id)
  - [x] `ledger_entries` (id, contract_id, debit_account, credit_account, amount, entry_type, created_at)
- [x] **7.2 Payment Provider / Sandbox Integration**
  - [x] Sandbox Payment Gateway service (Razorpay test order / simulated marketplace aggregator flow).
  - [x] `POST /api/v1/payments/create-order` (creates funding order for accepted contract).
  - [x] `POST /api/v1/payments/webhook` (signed webhook handler: strictly verifies signature before marking contract `funded` or milestone `paid`).
  - [x] Idempotency enforcement on every money-handling endpoint.
- [x] **7.3 Financial Reports & Receipts API**
  - [x] `GET /api/v1/payments/receipt/:contractId` (generates detailed itemized receipt with platform fee breakdown).
  - [x] `GET /api/v1/student/earnings` (private transaction ledger, pending payouts, completed settlements).

---

## Phase 8: Dispute Resolution, Governance & Immutable Audit Logs
*Objective: Student/employer dispute escalation desk, evidence collection, and admin settlement.*

- [ ] **8.1 Disputes Schema**
  - [ ] `disputes` (id, contract_id, milestone_id, initiated_by, reason_category, explanation, status [open, evidence_pending, in_review, resolved], resolution_type [refund_employer, payout_student, split_settlement], created_at, resolved_at)
  - [ ] `dispute_evidence` (id, dispute_id, uploaded_by, note, file_reference, submitted_at)
  - [ ] `dispute_decisions` (id, dispute_id, admin_id, formal_ruling, payout_amount_student, refund_amount_employer, recorded_at)
- [ ] **8.2 Dispute Lifecycle API**
  - [ ] `POST /api/contracts/:id/disputes/raise` (freezes milestone, notifies other party).
  - [ ] `POST /api/disputes/:id/evidence` (both parties upload supporting evidence).
  - [ ] `GET /api/admin/disputes` & `GET /api/admin/disputes/:id` (admin case dossier).
  - [ ] `POST /api/admin/disputes/:id/resolve` (admin issues binding ruling; triggers payout/refund webhook; records immutable audit log).

---

## Phase 9: Ratings, Verified Completion Proof & In-App Messaging
*Objective: Portable portfolio verification certificates, bilateral reviews, and contextual messaging.*

- [ ] **9.1 Reviews & Completion Certificates**
  - [ ] `reviews` table (contract_id, reviewer_id, reviewee_id, rating_score [1-5], written_feedback, skills_endorsed, created_at).
  - [ ] Double-sided review gate: reviews revealed only after both parties submit or review window expires.
  - [ ] `completion_records` table (unique verification hash, student_id, gig_title, employer_company, skills, completed_at, public_slug).
  - [ ] Public verification endpoint: `GET /api/verify/completion/:hash` (portable, shareable credential proof for students).
- [ ] **9.2 Contextual Messaging API**
  - [ ] `conversations` (id, context_type [gig, application, contract], context_id, participant_ids)
  - [ ] `messages` (id, conversation_id, sender_id, message_text, attachment_url, read_at, created_at)
  - [ ] Real-time/polling messaging endpoint with safety warnings against off-platform payment or credential sharing.

---

## Phase 10: Frontend Integration & Missing Flow Completion
*Objective: Build missing user-facing views, connect all React views to the real Fastify API, and replace in-memory mocks.*

- [ ] **10.1 Build Missing/Incomplete Frontend Views (Section 4 Gap Inventory)**
  - [ ] **Messaging & Interview Scheduler:** Add in-platform conversation modal/panel and interview slot booking on `GigApplicants.tsx` and workspaces.
  - [ ] **Employer Business Profile & Rehire List:** Create business profile page (`EmployerProfile.tsx`) displaying verified badge, company bio, and past hired students for 1-click rehire.
  - [ ] **Student Profile Editing & Privacy Controls:** Add profile editor drawer on `StudentProfile.tsx` (manage skills, portfolio links, availability status, and DPDPA consent/deletion request).
  - [ ] **Two-Party Scope Acceptance Modal:** Add binding scope review screen before contract activation with explicit revision limit, confidentiality, and IP assignment clauses.
  - [ ] **Payment Checkout & Itemized Receipts:** Add payment confirmation modal on contract offer, receipt download, and student private transaction ledger drawer.
  - [ ] **Student Dispute Intake Drawer:** Add dispute submission drawer on `StudentWorkspace.tsx` with category selection and file evidence upload.
  - [ ] **Search & Filter Extensions:** Add "Beginner-ready", "Verified SME only", and "Remote compatibility" filter toggles on `GigExplore.tsx`.
  - [ ] **Real Deliverable File Uploads & Versions:** Replace simulated deliverable link input with real file uploader, file list, and version history in workspaces.
- [ ] **10.2 API Client Layer (`frontend/src/api`)**
  - [ ] Axios/Fetch API client with automatic JWT token refresh, base URL configuration, and error toast handling.
  - [ ] Typed API service functions for Auth, Gigs, Applications, Workspaces, Payments, Verifications, Admin.
- [ ] **10.3 Context & View Connection**
  - [ ] Replace `MarketplaceContext` mock arrays with React Query or server API state sync.
  - [ ] Connect `AuthPage` to real login/registration & verification upload.
  - [ ] Connect `GigExplore` and `GigDetails` to live gig query parameters and proposal submission.
  - [ ] Connect `StudentWorkspace` and `EmployerWorkspace` to contract milestone state machine.
  - [ ] Connect `AdminVerifications` and `AdminDisputes` to admin governance endpoints.
  - [ ] Connect `AdminAnalytics` to real `/api/admin/analytics` event aggregations.
- [ ] **10.4 Complete E2E Judge Demonstration Flow Validation**
  - [ ] Run full rehearsal: Verified Employer posts scoped gig -> Verified Student applies -> Employer reviews fit score & hires -> Sandbox payment commits funds -> Student submits deliverable -> Employer reviews & releases -> Payout registered & portable completion credential generated.
  - [ ] Verify test suite & typechecks pass 100% clean with zero build warnings.
