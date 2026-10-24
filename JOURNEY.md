# Project Journey Log (JOURNEY.md)

## [2026-10-25] Milestone: End-to-End Candidate Hiring & Contract Auto-Activation, Targeted Notification Routing & Workspace Hardening
* **Key Changes:**
  - **Backend Contract Auto-Creation & State Synchronization:** Updated `updateApplicationStatus` in [applications.service.ts](backend/src/modules/applications/applications.service.ts) to automatically update the application to `hired`, set gig status to `in_progress`, set `gig.hiredStudentId`, and create or activate the binding record in `contracts` and `contract_milestones` with Milestone 1 marked `active`.
  - **Gig Query Multi-Status Visibility & Candidate Resolution:** Updated `listGigs` and `getGigById` in [gigs.service.ts](backend/src/modules/gigs/gigs.service.ts) to include active in-progress gigs, enrich payloads with `hiredStudentName` from `studentProfiles`, and ensure all milestone objects contain a default `status` value. Added `status` parameter to `filterGigsSchema` in [gigs.schema.ts](backend/src/modules/gigs/gigs.schema.ts).
  - **Full-Stack Hire Flow Persistence:** Made `hireApplicant` in [MarketplaceContext.tsx](frontend/src/context/MarketplaceContext.tsx) asynchronous and hooked to `applicationsApi.updateApplicantStatus`. Updated `handleHire` in [GigApplicants.tsx](frontend/src/pages/employer/GigApplicants.tsx) to await the API call before triggering workspace navigation.
  - **Targeted Notification Partitioning:** Scoped notifications strictly using `recipientUserId`:
    - Employer alert: `"Candidate Hired & Escrow Funded"` directing to `/app/employer/workspace/:gigId`.
    - Student alert: `"You Have Been Hired! 🎉"` directing to `/app/student/workspace/:gigId`.
    - Hardened [NotificationDrawer.tsx](frontend/src/components/shared/NotificationDrawer.tsx) and [Navbar.tsx](frontend/src/components/shared/Navbar.tsx) unread counters to only display notifications intended for the currently authenticated user.
  - **Black Screen Rectification & Defensive Rendering:** Eliminated the blank black screen on `/app/employer/workspace/:id` by replacing fragile `ms.status.replace` operations with safe fallback formatting `(ms.status || 'locked').replace('_', ' ')`. Added fallback checks on `gig.milestones` throughout [EmployerWorkspace.tsx](frontend/src/pages/employer/EmployerWorkspace.tsx), [StudentWorkspace.tsx](frontend/src/pages/student/StudentWorkspace.tsx), [EmployerDashboard.tsx](frontend/src/pages/employer/EmployerDashboard.tsx), and [StudentDashboard.tsx](frontend/src/pages/student/StudentDashboard.tsx).
  - **Cross-Role Workspace Redirection:** Implemented bidirectional role guards in `EmployerWorkspace` (redirects students to `/app/student/workspace/:gigId`) and `StudentWorkspace` (redirects employers to `/app/employer/workspace/:gigId`), preventing students from landing on employer management desks or seeing "Post active listing" prompts.
* **Decisions Made:** [[decision.md]] — End-to-End Candidate Hiring, Contract Auto-Activation, Targeted Notifications & Workspace Hardening.
* **Flows Mapped:** [[flow.md]] — Flow 11: End-to-End Candidate Hiring, Contract Auto-Activation & Dual-Role Workspace Resolution.
* **Verification:** Production builds verified with both backend (`tsc`) and frontend (`tsc -b && vite build`) passing with zero errors.

## [2026-10-18] Milestone: Applicant Pipeline Shortlisting, Finalist Finalization & Subdued Visual Hierarchy
* **Key Changes:**
  - **Dynamic Shortlist Logic & Backend Sync:** Implemented `handleToggleShortlist(proposalId)` in [GigApplicants.tsx](frontend/src/pages/employer/GigApplicants.tsx) enabling employers to shortlist or un-shortlist applicants. State changes are reflected instantly in the UI, synchronized with `localStorage` and `MarketplaceContext.tsx` (`shortlistApplicant`), and persisted to the Fastify backend via `applicationsApi.updateApplicantStatus`.
  - **Backend Access Authorization:** Updated `updateApplicationStatus` in [applications.service.ts](backend/src/modules/applications/applications.service.ts) to verify company name alignment (`isSameCompany`) in addition to employer user ID, preventing false 403 Forbidden responses during multi-session demo reviews.
  - **Visual Hierarchy & Sorting in Pipeline ATS:**
    - Shortlisted candidates automatically sort to the top of the applicant list.
    - Shortlisted candidate cards receive warm amber borders, golden star ring avatars, and a gold `<Star /> Shortlisted Finalist` badge.
    - Other non-shortlisted applicants receive a slightly subdued, duller styling (`opacity-60 bg-slate-50/60 border-slate-200/80 hover:opacity-100 hover:bg-white`) with neutral `Applied` status badges, ensuring the finalist is immediately prominent while all other applicants remain 100% interactive, clickable, and accessible for evaluation.
  - **Candidate Dossier Finalization State:**
    - Added a prominent "Shortlisted & Finalized Candidate" top banner in the right pane when the active applicant is shortlisted.
    - Added golden star ring and gold badge to the dossier candidate avatar.
    - Added dynamic toggleable action button: transitions between `<Star /> Shortlist Student` and `<Check /> Shortlisted Finalist`.
    - Updated Escrow action CTA to `"Hire Finalist & Pre-Authorize Escrow"`.
* **Decisions Made:** [[decision.md]] — Applicant Pipeline Shortlisting, Finalist Finalization & Subdued Visual Hierarchy.
* **Verification:** Production builds verified with both frontend (`tsc -b && vite build`) and backend (`tsc --noEmit`) passing cleanly with zero errors.

## [2026-10-17] Milestone: Weekly Drops Newsletter Database Persistence & Migration
* **Key Changes:**
  - **Database Schema & Migration:** Created the `weekly_drops` table in Drizzle ORM ([weekly-drops.ts](backend/src/db/schema/weekly-drops.ts)) with unique email constraint, subscription status, source tracker, and timestamp audit columns. Generated and applied migration `0010_aspiring_carnage.sql` against the Supabase PostgreSQL database.
  - **REST API Endpoints:** Built and registered `weeklyDropsRoutes` ([weekly-drops.routes.ts](backend/src/modules/weekly-drops/weekly-drops.routes.ts)) providing public subscription `POST /api/v1/weekly-drops/subscribe` with Zod validation, idempotency/reactivation logic, and administrative listing `GET /api/v1/weekly-drops/subscribers`.
  - **Frontend Client Integration:** Added `weeklyDropsApi` in [endpoints.ts](frontend/src/api/endpoints.ts) and connected [Footer.tsx](frontend/src/components/shared/Footer.tsx) newsletter form with real-time submission, active button disabled state with spinning loader (`Loader2`), inline validation error messaging, and dynamic confirmation response.
* **Decisions Made:** [[decision.md]] — Weekly Drops Newsletter Database Persistence & Uniqueness Constraints.
* **Verification:** Drizzle migration applied to Supabase PostgreSQL; both `backend` (`tsc`) and `frontend` (`tsc -b && vite build`) passed with zero errors.

## [2026-10-17] Milestone: Cross-Route Anchor Navigation & Unauthenticated Notification Concealment
* **Key Changes:**
  - **Cross-Route Guest Navigation:** In [Navbar.tsx](frontend/src/components/shared/Navbar.tsx), upgraded "Why Us" and "Campus Network" navigation items with `handleSectionNav`. When unauthenticated guests are on external pages (e.g. `/app/student/explore`), clicking either link smoothly routes to `/#comparison` or `/#colleges` on the landing page, eliminating inert anchor clicks. Added corresponding links to the mobile dropdown menu.
  - **Anchor Scroll Restoration:** Enhanced `ScrollToTop` in [App.tsx](frontend/src/App.tsx) with hash detection to ensure cross-route transitions to `#comparison` and `#colleges` automatically execute smooth scrolling to the target section once the DOM has mounted.
  - **Header Clearance Margins:** Added `scroll-mt-24` to `<section id="comparison">` and `<section id="colleges">` in [LandingPage.tsx](frontend/src/pages/LandingPage.tsx) so smooth scrolls preserve a clean breathing margin below the sticky navigation bar.
  - **Unauthenticated Notification Concealment:** Gated both the desktop/mobile Notification Bell button and `NotificationDrawer` in [Navbar.tsx](frontend/src/components/shared/Navbar.tsx) strictly behind `{currentRole !== 'guest' && (...)}`, ensuring guests only see clean exploration and "Login / Register" CTAs.
* **Decisions Made:** [[decision.md]] — Cross-Route Guest Section Navigation & Unauthenticated Notification Hygiene.
* **Verification:** Production build verified with `tsc -b && vite build` passing cleanly with zero errors.

## [2026-10-16] Milestone: Backend Deployment Crash Fix (`FST_ERR_DUPLICATED_ROUTE` & Render Build Resilience)
* **Root Cause Diagnosis:**
  - Deployment log `==> Exited with status 1` was caused by a duplicate Fastify route collision during `buildApp()` bootstrap: `app.get('/api/v1/gigs/:id/applications')` was registered in `backend/src/app.ts` while `gigs.routes.ts` already registered `/:id/applications` under `/api/v1/gigs`. Fastify threw `FST_ERR_DUPLICATED_ROUTE: Method 'GET' already declared for route '/api/v1/gigs/:id/applications'`.
  - In `backend/src/index.ts`, `const app = await buildApp()` was located outside the startup `try/catch` block, causing unhandled promise rejections on startup to terminate the Node process with exit code 1.
  - Additionally, `render.yaml` was updated with `npm install --include=dev && npm run build` to ensure `devDependencies` (`typescript`) are consistently installed on Render regardless of `NODE_ENV=production`.
* **Key Changes:**
  - `backend/src/app.ts`: Removed redundant route declaration for `/api/v1/gigs/:id/applications` (handled by `gigs.routes.ts`).
  - `backend/src/index.ts`: Moved `buildApp()` inside `try/catch` with clear fatal startup logging.
  - `render.yaml`: Updated `buildCommand` to `npm install --include=dev && npm run build`.
* **Verification:**
  - Backend TypeScript build (`tsc`) succeeded with 0 errors.
  - Verified `buildApp()` startup in `dist/app.js` runs cleanly without errors.

## [2026-10-16] Milestone: Dark Theme Restoration & Student Dashboard Contrast Rectification
* **Key Changes:**
  - **Restored Dark Background Theme:** Reverted global root canvas in [App.tsx](../frontend/src/App.tsx) and [index.html](../frontend/index.html) back to `bg-[#090D16] text-[#D1D5DB]`, preserving the high-impact dark aesthetic.
  - **Student Dashboard Heading Contrast Rectification:** Resolved heading readability on dark canvas by updating "Active Contracts in Progress" and "My Submitted Proposals" in [StudentDashboard.tsx](../frontend/src/pages/student/StudentDashboard.tsx) to pure high-contrast `text-white` with tactile icon badge containers (`bg-purple-500/20 text-purple-300 border border-purple-500/30` and `bg-white/10 text-slate-200 border border-white/10`) and dynamic count pills (`{activeGigs.length} Ongoing` and `{myProposals.length} Submitted`).
  - **Proposal Empty State:** Added clean white empty state card under submitted proposals when a student has 0 active proposals.
* **Verification:** Production build verified with `npm.cmd run build` passing with zero errors (all 2,362 modules transformed, built cleanly).

## [2026-10-15] Milestone: Employer KYC Verification, Public Enterprise Dossier, Dynamic Pipeline & Sanitized Workspace

* **Key Changes:**
  - **Self-Service Employer Profile & KYC Drawer:** Built `EditEmployerProfileDrawer.tsx` allowing employers to edit avatar (file upload or industry presets), representative full name, contact email, business name, industry domain, website, bio, city, state, registered physical address (private), direct phone number (private), and official Indian business verification credentials (GSTIN, Udyam MSME, Business PAN, or Proprietor Aadhaar) with document proof upload.
  - **Dynamic Employer Dashboard Status & Verification Action Banner:** Updated `EmployerDashboard.tsx` to dynamically show verification status (Verified SME Partner, Verification Under Review, or Unverified Employer) and rendered a high-impact verification CTA banner allowing unverified employers to submit KYC credentials in 1 click.
  - **Candidate-Facing Public Employer Profile:** Created `PublicEmployerProfile.tsx` (`/employers/:id` and `/app/employer/:id/view`) and wired the "About the Business" card in `GigDetails.tsx` to link directly to it. Public profile presents verified enterprise badge, industry, public location, website, company description, and all active posted micro-gigs, while strictly concealing private contact details (address, phone) per DPDPA 2023.
  - **Dynamic Applicant Pipeline Route & Multi-Gig Switcher:** Decoupled `Navbar.tsx` from hardcoded `/app/employer/gig/gig-2/applicants` to neutral `/app/employer/applicants`, updated `App.tsx` routes, and upgraded `GigApplicants.tsx` to query the logged-in employer's gigs (`myGigs`), provide an interactive multi-gig switcher bar, and render empty states for zero-gig accounts.
  - **Sanitized Multi-Gig Employer Workspace:** Completely eliminated hardcoded mock student "Aarav Sharma" fallbacks in `EmployerWorkspace.tsx`. If no student has been recruited yet, the workspace displays a "Contract Awaiting Student Hire" card pointing directly to applicant review. If hired, the workspace binds to the real student name, live milestone deliverables, and dynamic escrow actions, with a multi-gig switcher bar for employers with multiple active listings.
* **Decisions Made:** [[decision.md]] — Employer KYC Verification, Public Enterprise Dossier, Dynamic Pipeline & Sanitized Workspace.
* **Verification:** Production builds passed with 0 errors across both `frontend` (`npm run build` compiled client in ~3.8s) and `backend` (`tsc`).

## [2026-10-15] Milestone: Partner Campus Dropdown Restriction, Create Account Cleanup & Profile Completion Score Engine

* **Key Changes:**
  - **Campus Eligibility Restriction:** Restricted college selection in student profile editing (`EditProfileDrawer.tsx`) to the 6 official regional academic partners (PCTE Group of Institutes (Ludhiana), GNDEC Engineering College, Thapar Institute (TIET), Punjab Agricultural University (PAU), Chitkara University, and Christian Medical College (CMC)) using a unified catalog in `frontend/src/data/colleges.ts`.
  - **Create Account Page Polish:** Removed obsolete next-step academic credential tip box from `AuthPage.tsx` registration flow.
  - **Navigation & Metrics Clarification:** Renamed "Verified Profile" nav item in `Navbar.tsx` to "Profile"; updated student profile metric from ambiguous "Completed" to "Completed Projects" with responsive spacing.
  - **Profile Completion Score Engine & Linear Bar:** Built `ProfileCompletionBar.tsx` featuring a linear gradient track (reddish left `#EF4444` transitioning to amber `#F59E0B` and emerald `#10B981` at 100%), floating percentage pointer needle, "Complete Your Profile" trigger, missing items checklist, and verification gate logic (capped at 90% with "Verification Pending" notice until campus approval).
  - **Single-Notice 100% Milestone Pop-up:** Upon reaching 100% completion (all fields complete + campus verification approved), displays a celebration modal once and permanently dismisses the slider to preserve a clean dashboard.
* **Verification:** Production builds (`npm run build` for frontend and `tsc` for backend) completed with 0 errors.

## [2026-10-15] Milestone: Streamlined Onboarding, Profile Verification & Dynamic Micro-Gig Hydration

* **Key Changes:**
  - Removed college details, roll number, and student ID card upload from the sign-up page (`AuthPage.tsx`); added password confirmation and automatic token persistence so both email and Google OAuth logins start with an identical minimal friction flow.
  - Relocated academic details and verification document upload into the student profile edit drawer (`EditProfileDrawer.tsx`), enabling equal verification access for Google OAuth and email users.
  - Implemented an interactive Graduation Year slider spanning the 2000s series (2000–2035) with class badge readouts and dropdown select.
  - Replaced arbitrary free-text skill entry with a canonical, alphabetical catalog of 90+ tech and creative skills (`PLATFORM_SKILLS` in `frontend/src/data/skills.ts`).
  - Fixed infinite loader bug on profile save by broadening Zod graduation year range in `profiles.schema.ts`, auto-provisioning missing student profile records on request in `profiles.service.ts`, injecting Bearer tokens into API requests in `client.ts`, and adding clear error/success feedback.
  - Resolved blank page crashes on gig details (`GigDetails.tsx`) by providing defensive checks against undefined employer metadata and fetching from the backend API if a gig is accessed via direct URL or database ID.
  - Wired `PostGigWizard.tsx` to asynchronously await backend gig creation, retrieve the database UUID, and navigate directly to the published gig page.
* **Decisions Made:** [[decision]] — Streamlined Onboarding, Profile Verification & Dynamic Micro-Gig Hydration.
* **Verification:** Frontend production build (`npm run build`) compiled cleanly in 5.3s with 0 errors; backend build (`tsc`) passed with 0 errors.

## [2026-10-15] Milestone: Auth Session Repair and Profile De-Seeding

* **Key Changes:** Unified Google and password authentication around backend account records; issued application session cookies during registration, login, refresh, and Google continuation; corrected verification/profile API paths; replaced hardcoded student and employer profile content with saved account data and explicit empty states.
* **Decisions Made:** [[decision]] — Backend-Owned Google Account Provisioning.
* **Verification:** Backend TypeScript build and frontend production build completed successfully; frontend lint completes with pre-existing project warnings only.

## [2026-10-14] Milestone 19: Frontend REST API Integration, Missing Views & E2E Flow Completion (Phase 10 Complete)
* Built unified REST API client layer in `frontend/src/api`:
  - `client.ts`: Custom fetch client with credentials support for HTTP-only JWT refresh cookie sessions, structured error typing (`ApiClientError`), and base URL resolution defaulting to `http://localhost:4000/api/v1`.
  - `endpoints.ts`: Complete typed API functions spanning all 10 phases: `authApi`, `profilesApi`, `verificationApi`, `gigsApi`, `applicationsApi`, `contractsApi`, `paymentsApi`, `disputesApi`, `reviewsApi`, and `messagingApi`.
* Built missing user-facing UI modals, drawers, and standalone views across `frontend/src/components` and `frontend/src/pages`:
  - `ChatModal.tsx`: Contextual real-time messaging modal with heuristic safety detection alerting users against off-platform contact or payment attempts (phone numbers, WhatsApp links, UPI handles, external emails).
  - `ScopeAcceptanceModal.tsx`: Two-party scope agreement modal enforcing explicit acceptance of confidentiality (NDA), IP transfer assignment upon payment release, and the 2-revision limit.
  - `PaymentEscrowModal.tsx`: Employer contract commitment modal into sandbox escrow with 0% pilot commission breakdown.
  - `ContractReceiptModal.tsx`: Itemized transaction receipt displaying gross amount, platform fee waiver, net disbursement, and cryptographic ledger hash.
  - `RaiseDisputeDrawer.tsx`: Milestone dispute intake drawer with reason categories, explanation, and evidence link uploader.
  - `ReviewModal.tsx`: Bilateral blind review modal (1–5 stars, feedback, skill endorsements) with double-sided concealment notice.
  - `InterviewSchedulerModal.tsx`: Structured interview scheduler for candidate proposals.
  - `EditProfileDrawer.tsx`: Student profile editor with skills management, portfolio links, and DPDPA 2023 privacy controls.
  - `EmployerProfile.tsx`: Dedicated employer business profile at `/app/employer/profile` with GSTIN verification badge, company overview, and 1-click rehire talent pool.
  - `CompletionVerificationPage.tsx`: Public certificate verification page at `/verify/completion/:hash` with official cryptographic SHA-256 seal and copyable proof link.
* Integrated missing workflows into primary application screens:
  - `App.tsx`: Registered routes for `/app/employer/profile` and `/verify/completion/:hash`.
  - `Navbar.tsx`: Added employer Business Profile navigation link, global chat launcher, and `ChatModal`.
  - `GigApplicants.tsx`: Integrated candidate fit engine breakdown pills, interview scheduler modal, chat modal, and payment escrow commitment modal.
  - `StudentWorkspace.tsx`: Integrated scope acceptance gate, dispute escalation drawer, double-sided review modal, and chat modal.
  - `EmployerWorkspace.tsx`: Integrated contract settlement receipt, dispute escalation drawer, double-sided review modal, and chat modal.
  - `StudentProfile.tsx`: Integrated profile editor drawer and cryptographic completion certificates section linking to public proof.
  - `GigExplore.tsx`: Added quick-toggle filter pills for "Beginner-ready", "Verified SME only", and "Remote only".
  - `AdminDisputes.tsx` & `AdminVerifications.tsx`: Connected to backend dispute resolution and verification decision endpoints.
  - `MarketplaceContext.tsx`: Integrated dynamic live gigs fetching with graceful fallback.
* Added architectural decision entry to [[decision.md]] explaining the full frontend integration, UI modal suite, and dual-mode demo resilience.
* Updated [[flow.md]], [[Implementation-Checklist.md]], and [[Current Status.md]].
* Validated production build across both `frontend/` (`tsc -b && vite build`) and `backend/` (`tsc`) with 0 errors.


## [2026-10-14] Milestone 18: Ratings, Verified Completion Proof & In-App Messaging (Phase 9 Complete)
* Designed and generated bilateral reviews, completion credentials, and messaging schemas:
  - `/backend/src/db/schema/reviews.ts`:
    * `reviews`: Double-sided rating mechanism with `contractId`, `reviewerId`, `revieweeId`, `rating` (1–5), `feedback`, `isPublic` (concealed until both parties review).
    * `completion_records`: Tamper-evident credentials storing `verificationHash` (cryptographic SHA-256 digest of contract execution metadata), `skillsVerified`, and public verifiability flags.
    * Generated database migration `0007_bright_talos.sql`.
  - `/backend/src/db/schema/messaging.ts`:
    * `conversations`: Contextual multi-party chat sessions indexed by `contextType` (`gig`, `application`, `contract`), `contextId`, and `participantIds`.
    * `messages`: Message transcript storing `messageText`, `attachmentUrl`, `hasSafetyWarning`, `safetyWarnings` array, and `readAt`.
    * Generated database migration `0008_legal_veda.sql`.
* Built reviews and completion verification module in `/backend/src/modules/reviews`:
  - `reviews.schema.ts`: Validation for ratings (1–5) and structured feedback.
  - `reviews.service.ts`: Handlers enforcing double-sided review concealment (reviews hidden from counterparties until both submit or window expires), automatic student profile rating aggregate re-computation, deterministic SHA-256 certificate hashing, and public certificate lookup.
  - `reviews.routes.ts`: Registered endpoints under `/api/v1/reviews`:
    * `POST /api/v1/reviews`: Submit review for completed contract with double-sided concealment gate.
    * `GET /api/v1/reviews/contract/:contractId`: Retrieve revealed reviews for a contract.
    * `GET /api/v1/reviews/user/:userId`: Public verified reviews for student/employer profiles.
    * `POST /api/v1/reviews/completion-records/generate/:contractId`: Generate tamper-evident completion certificate with SHA-256 hash.
    * `GET /api/v1/verify/completion/:hash` (and `/api/verify/completion/:hash`): Public unauthenticated certificate verification endpoint.
* Built contextual in-app messaging and real-time safety scanner in `/backend/src/modules/messaging`:
  - `safety.service.ts`: `MessagingSafetyScanner` scanning messages in real time for off-platform contact sharing (phone numbers, WhatsApp, Telegram), off-platform payment solicitations (UPI handles, direct transfers), email sharing (DPDPA notice), and accidental credentials/secrets.
  - `messaging.schema.ts`: Validation for conversation creation and message payloads.
  - `messaging.service.ts`: Handlers for starting contextual conversations, message delivery with inline safety warning tagging, security audit logging (`safety_policy_warning_triggered`), and incremental message polling with read receipts.
  - `messaging.routes.ts`: Registered endpoints under `/api/v1/messaging`:
    * `POST /api/v1/messaging/conversations`: Find or create contextual conversation.
    * `GET /api/v1/messaging/conversations`: List user conversations with unread message badges.
    * `POST /api/v1/messaging/conversations/:id/messages`: Send message with safety scanner evaluation.
    * `GET /api/v1/messaging/conversations/:id/messages`: Retrieve messages with optional incremental polling (`?after=`) and auto-read receipts.
* Added architectural decision entry to [[decision.md]] explaining double-sided review concealment, portable SHA-256 certificate proof, and zero-latency safety advisories.
* Updated [[flow.md]], [[Implementation-Checklist.md]], [[Current Status.md]], and verified clean compilation (`tsc`) across backend and frontend.


## [2026-10-14] Milestone 17: Dispute Resolution, Governance & Immutable Audit Logs (Phase 8 Complete)
* Designed and generated dispute resolution database schemas in `/backend/src/db/schema/disputes.ts`:
  - `disputes`: Tracks contract milestone disputes with `contractId`, `milestoneId`, `initiatedBy`, `reasonCategory` (`unresponsive_counterparty`, `deliverable_quality`, `scope_creep`, `unreasonable_revisions`, `unauthorized_work`, `other`), `explanation`, `status` (`open`, `evidence_pending`, `in_review`, `resolved`), and `resolutionType` (`refund_employer`, `payout_student`, `split_settlement`).
  - `dispute_evidence`: Immutable evidence trail recording `uploadedBy`, note descriptions, and attached files/URLs.
  - `dispute_decisions`: Administrative arbitration rulings recording `adminId`, `formalRuling`, `payoutAmountStudent`, and `refundAmountEmployer`.
  - Generated database migration `0006_solid_rhodey.sql`.
* Built dispute resolution and administrative arbitration module in `/backend/src/modules/disputes`:
  - `disputes.schema.ts`: Validation for dispute filing, evidence submissions, and administrative arbitration rulings with strict mathematical reconciliation (`payout + refund === milestone.amount`).
  - `disputes.service.ts`: Handlers for freezing disputed milestones in escrow, bilateral evidence gathering, comprehensive case dossier inspection, and administrative arbitration ruling execution with double-entry ledger settlements and immutable audit logs.
  - `disputes.routes.ts`: Registered endpoints under `/api/v1/disputes` with aliases in `app.ts`:
    - `POST /api/v1/contracts/:id/disputes/raise` (and `/api/v1/disputes/raise`): Party registers dispute and freezes milestone funds in escrow.
    - `POST /api/v1/disputes/:id/evidence`: Submits evidence notes and document references.
    - `GET /api/v1/disputes/:id`: Retrieves complete case dossier with milestones, deliverables, revisions, and evidence.
    - `GET /api/v1/admin/disputes` (and `/api/v1/disputes/admin/queue`): Admin arbitration queue.
    - `POST /api/v1/admin/disputes/:id/resolve`: Admin issues binding ruling, settles ledger accounts, and updates contract state.
* Added architectural decision entry to [[decision.md]] explaining milestone freeze guarantees, bilateral evidence, and double-entry dispute settlement.
* Updated [[flow.md]], [[Implementation-Checklist.md]], and verified clean compilation (`tsc`) across both backend and frontend.


## [2026-10-14] Milestone 16: Payment Commitment, Sandbox Escrow Ledger & Webhooks (Phase 7 Complete)
* Designed and generated financial ledger database schemas in `/backend/src/db/schema/payments.ts`:
  - `payment_intents`: Tracks payment orders, amounts, currencies, provider statuses, and unique idempotency keys.
  - `payment_events`: Append-only raw webhook audit log with provider references.
  - `payouts`: Milestone payout records tracking gross amount, platform fee deduction, net disbursement, and completion status.
  - `ledger_entries`: Double-entry accounting table recording auditable debit/credit movements (`employer_account`, `sandbox_escrow`, `student_wallet`, `platform_revenue`).
  - Generated database migration `0005_gifted_lake.sql`.
* Built sandbox payment provider and signed webhook verification in `/backend/src/modules/payments`:
  - `gateway.service.ts`: `SandboxPaymentGatewayService` generating sandbox orders (`order_sand_...`) and verifying HMAC-SHA256 signatures.
  - `payments.schema.ts`: Validation for funding order creation, idempotency keys, signed webhook events, and payout release triggers.
  - `payments.service.ts`: Handlers enforcing provider webhooks as the sole authority for contract funding, double-entry escrow locking, zero-commission pilot milestone releases, itemized receipts with fee transparency, and student private earnings tracking.
  - `payments.routes.ts`: Registered endpoints under `/api/v1/payments`:
    - `POST /create-order`: Employer creates funding order with mandatory idempotency key.
    - `POST /webhook`: Signed provider webhook handler updating contract to `funded` upon `payment.captured`.
    - `POST /release-payout`: Employer authorizes payout release for approved milestones.
    - `GET /receipt/:contractId`: Itemized financial breakdown receipt with platform fee transparency.
    - `GET /student/earnings`: Student private financial dashboard reporting lifetime earnings, pending escrow, and payout history.
* Added architectural decision entry to [[decision.md]] explaining the double-entry ledger, webhook authority, and zero-commission pilot strategy.
* Updated [[flow.md]], [[Implementation-Checklist.md]], and verified clean compilation (`tsc`) across both backend and frontend.


## [2026-10-14] Milestone 15: Contracts, Two-Party Scope Acceptance & Milestone Execution (Phase 6 Complete)
* Designed and generated relational contract database schemas in `/backend/src/db/schema/contracts.ts`:
  - `contracts`: Tracks binding agreements, `gigId`, `applicationId`, `studentId`, `employerId`, `totalAmount`, `termsVersion`, `confidentialityAccepted`, `ipClauseAccepted`, `maxRevisionsPerMilestone`, and status (`scope_pending`, `funded`, `in_progress`, `completed`, `cancelled`, `disputed`).
  - `contract_milestones`: Cloned milestone schedule tracking `sequenceOrder`, criteria, amount, status (`locked`, `active`, `submitted`, `under_review`, `revision_requested`, `approved`, `paid`, `disputed`), due dates, and sign-off timestamps.
  - `deliverable_submissions`: Multi-version deliverable history tracking `versionNumber`, notes, live URLs, repository URLs, and attachments.
  - `revision_requests`: Capped revision feedback loop recording reviewer ID, actionable feedback, and timestamps.
  - Generated database migration `0004_public_sleeper.sql`.
* Built contract lifecycle and milestone execution state machine in `/backend/src/modules/contracts`:
  - `contracts.schema.ts`: Validation for offer creation, scope signing (mandating both confidentiality and IP transfer acceptance), versioned deliverable submissions, and actionable revision notes.
  - `contracts.service.ts`: Handlers enforcing two-party scope acceptance gate, sequential milestone activation (milestone 1 -> 2), hard revision limits per milestone (default 2), deliverable versioning, and contract completion upon final milestone approval.
  - `contracts.routes.ts`: Registered endpoints under `/api/v1/contracts`:
    - `POST /create-offer`: Employer initiates contract offer from applicant proposal.
    - `POST /:id/accept-scope`: Student contractor signs scope, confidentiality agreement, and IP clause.
    - `GET /`: User contract listing (student/employer).
    - `GET /:id`: Full contract dossier with timeline, milestones, submissions, and revisions.
    - `POST /:id/milestones/:milestoneId/submit`: Student delivers work with version tracking.
    - `POST /:id/milestones/:milestoneId/request-revision`: Employer requests revision within capped limits.
    - `POST /:id/milestones/:milestoneId/approve`: Employer signs off deliverable; activates next milestone or completes contract.
* Added architectural decision entry to [[decision.md]] explaining the two-party scope gate, IP transfer clauses, and capped revision safeguards.
* Updated [[flow.md]], [[Implementation-Checklist.md]], and verified clean compilation (`tsc`) across both backend and frontend.


## [2026-10-14] Milestone 14: Proposals, Candidate Pipeline & Explainable Matching (Phase 5 Complete)
* Implemented applications and interview database schema in `/backend/src/db/schema/applications.ts`:
  - `applications`: Tracks student proposal submissions with `gigId`, `studentId`, `coverNote`, `proposedTimeline`, `bidAmount`, `portfolioItems`, `status` (`submitted`, `shortlisted`, `interviewed`, `rejected`, `hired`), deterministic `fitScore`, structured `fitBreakdown`, and array of `fitExplanation` statements.
  - `interviews`: Tracks interview scheduling with unique `applicationId`, `scheduledAt`, `meetingLinkOrInstructions`, `status` (`scheduled`, `completed`, `cancelled`), and `notes`.
  - Generated database migration `0003_outgoing_martin_li.sql`.
* Implemented Explainable Candidate Fit Scoring Engine (`CandidateFitEngine`) in `/backend/src/modules/applications/matching.service.ts`:
  - Directly addresses Judge Defense Matrix Q12 ("How does matching work without fake AI claims?").
  - Deterministically evaluates candidate fit across 4 auditable dimensions:
    1. Skill Overlap (40% weight): Exact and substring token matching against required skills.
    2. Work Mode & Locality Compatibility (25% weight): Remote preference match or hyper-local / campus proximity alignment in Punjab.
    3. Availability & Timeline Fit (20% weight): Verified immediate vs part-time availability status.
    4. Verified Track Record & Quality (15% weight): Credential verification bonus, completed gig counts, and peer ratings.
  - Produces structured category scores and human-readable explanation bullets returned with every application.
* Built application workflows API in `/backend/src/modules/applications`:
  - `applications.schema.ts`: Zod validation for proposal inputs, candidate status transitions, and interview scheduling.
  - `applications.service.ts`: Verification checks (verified student only), duplicate application prevention, automatic fit scoring, candidate ranking, and audit logging.
  - `applications.routes.ts`: Registered endpoints under `/api/v1/applications` with aliases in `gigs.routes.ts` and `app.ts`:
    - `POST /api/v1/gigs/:id/apply`: Authenticated verified student proposal submission.
    - `GET /api/v1/student/applications`: Student tracking their submitted proposals with fit scores and interview statuses.
    - `GET /api/v1/gigs/:id/applications`: Employer candidate dossier ordered by explainable fit score.
    - `GET /api/v1/applications/:id`: Application dossier view with explainable fit scoring breakdown.
    - `PATCH /api/v1/applications/:id/status`: Employer candidate pipeline management (`shortlisted`, `rejected`, `hired`).
    - `POST /api/v1/applications/:id/interview`: Employer interview scheduling with meeting links and instructions.
* Added architectural decision entry to [[decision.md]] explaining the deterministic matching rationale.
* Updated [[flow.md]], [[Implementation-Checklist.md]], and verified 100% clean compilation (`tsc`) across both backend and frontend.


## [2026-10-14] Milestone 13: Gig Lifecycle, Scoping & Policy Engine (Phase 4 Complete)
* Implemented complete micro-gig management and policy enforcement module in `/backend/src/modules/gigs`:
  - `gigs.schema.ts`: Enforces contractor safeguards: minimum budget floor ($\ge ₹1,500$), mandatory measurable deliverables, estimated hours, capped revisions ($1-5$), and strict sum matching between milestones and total contract budget.
  - `gigs.service.ts`: Implemented automated policy compliance scanner detecting prohibited academic cheating (homework proxy, exams, thesis writing) and hazardous tasks, multi-facet query filtering (category, work mode, budget range, search terms), and administrative moderation actions.
  - `gigs.routes.ts`: Registered endpoints under `/api/v1/gigs`:
    - `GET /`: Public multi-facet feed with employer verification badges and milestone schedules.
    - `GET /:id`: Detailed brief view.
    - `POST /`: Protected employer creation route validating milestones and policy rules.
    - `GET /admin/pending`: Admin moderation queue for flagged listings.
    - `POST /admin/:id/moderate`: Administrative approval/rejection endpoint with immutable audit logging.
* Generated database migration `0002_thin_grim_reaper.sql`.
* Updated [[flow.md]], [[Implementation-Checklist.md]], and verified clean compilation (`tsc`).

## [2026-10-14] Milestone 12: Verification APIs & Admin Governance Desk (Phase 3 Complete)
* Implemented complete Identity Verification lifecycle in `/backend/src/modules/verification`:
  - `verification.schema.ts`: Zod validation for multipart submissions and administrative approval/rejection decisions with validity limits.
  - `verification.service.ts`: Handlers for role-specific submission (`student_college_id` / `business_registration`), status tracking, enriched admin queue retrieval, private document streaming with access auditing, and trust badge propagation.
  - `verification.routes.ts`: Registered endpoints under `/api/v1/verifications`:
    - `POST /submit`: Protected multipart endpoint streaming credential files to private disk and updating account status to `pending_verification`.
    - `GET /status`: Retrieves current student/employer verification progress and reason codes.
    - `GET /admin/queue`: Admin governance endpoint filtering submissions by status and role.
    - `GET /admin/requests/:requestId/documents/:docId`: Admin document inspection endpoint streaming private files with audit logging.
    - `POST /admin/requests/:id/review`: Admin decision endpoint approving/rejecting requests, granting `verifiedBadge`, and emitting immutable audit events.
* Updated [[flow.md]], [[Implementation-Checklist.md]], and verified 100% clean compilation (`tsc`).

## [2026-10-14] Milestone 11: Identity Verification Storage & Schema (Phase 3.1 Complete)
* Designed identity verification database schemas in `/backend/src/db/schema/verification.ts`:
  - `verification_requests`: Tracks submission type (`student_college_id`, `business_registration`), review status (`pending`, `under_review`, `approved`, `rejected`, `expired`), encrypted document identifiers, reviewer ID, reason codes, and expiry dates.
  - `verification_documents`: Tracks private file keys, original names, MIME types, and file size in bytes with cascading foreign key references.
  - Generated database migration `0001_violet_lilith.sql`.
* Implemented `PrivateStorageService` in `/backend/src/services/storage.service.ts`:
  - Strict MIME validation (JPEG, PNG, WEBP, PDF only).
  - 5MB maximum file size enforcement with automatic cleanup on limit breach.
  - Collision-resistant UUID key generation and streaming storage outside public accessibility.
* Verified clean compilation (`tsc`).

## [2026-10-14] Milestone 10: Profile Management & Data Minimization (Phase 2.3 Complete)
* Built profile management module in `/backend/src/modules/profiles`:
  - `profiles.schema.ts`: Validation schemas for student competencies, portfolio links, availability statuses, and employer details.
  - `profiles.service.ts`: Implemented private CRUD and public view methods enforcing strict **data minimization** (stripping encrypted roll numbers, official registration docs, and private phone numbers from public responses per DPDPA 2023).
  - `profiles.routes.ts`: Registered endpoints under `/api/v1/profiles`:
    - `GET /students/me` & `PUT /students/me`: Authenticated student management protected with `requireRole(['student'])`.
    - `GET /students/:id`: Public sanitized student view.
    - `GET /employers/me` & `PUT /employers/me`: Authenticated employer management protected with `requireRole(['employer'])`.
    - `GET /employers/:id`: Public sanitized company view.
* Updated [[flow.md]], [[Implementation-Checklist.md]], and verified clean compilation (`tsc`).

## [2026-10-13] Milestone 9: Route Guards & RBAC Middleware (Phase 2.2 Complete)
* Implemented authentication and role-based access control middleware in `/backend/src/middleware/auth.guard.ts`:
  - `authenticate`: Fastify preHandler verifying JWT from headers/cookies and hydrating `req.currentUser` (`AuthenticatedUser`).
  - `requireRole(['student' | 'employer' | 'admin'])`: Enforces strict authorization policies and returns HTTP 403 Forbidden with clear diagnostic messaging upon role mismatch.
  - Linked `authenticate` guard into the `/api/v1/auth/me` endpoint.
* Updated [[flow.md]], [[Implementation-Checklist.md]], and verified 100% clean compilation via `npm run build`.

## [2026-10-13] Milestone 8: Authentication Endpoints & Business Logic (Phase 2.1 Complete)
* Built full authentication module in `/backend/src/modules/auth`:
  - `auth.schema.ts`: Zod validation schemas enforcing strict email, password complexity, role selection (`student` / `employer`), and mandatory DPDPA consent acceptance.
  - `auth.service.ts`: Secure bcrypt hashing (cost 12), user account creation with transaction safety, automatic role profile provisioning (`student_profiles`, `business_profiles`), cryptographic session token rotation, and immutable audit event logging.
  - `auth.routes.ts`: Registered endpoints under `/api/v1/auth`:
    - `POST /register`: Registers user, creates profile, issues access JWT.
    - `POST /login`: Validates credentials, checks suspension state, sets secure HTTP-only refresh cookie (`refreshToken`), and returns access token.
    - `POST /refresh`: Rotates refresh token in `sessions` table and reissues fresh JWT.
    - `POST /logout`: Invalidates session in database and clears cookie.
    - `GET /me`: Authenticates via JWT and returns current user details with attached student/business profile.
* Updated [[flow.md]], [[Implementation-Checklist.md]], and verified 100% clean compilation via `npm run build`.

## [2026-10-13] Milestone 7: Database & Migration Engine (Phase 1.2 Complete)
* Configured PostgreSQL database connection pool and Drizzle ORM in `/backend/src/db/index.ts`.
* Designed core database schemas:
  - `users`: UUID primary keys, role enum (`student`, `employer`, `admin`), account status, email verification.
  - `sessions`: refresh token hashes with expiration timestamps for secure HTTP-only cookie sessions.
  - `consents`: DPDPA 2023 compliance recording consent types, policy versions, and timestamps.
  - `campuses`: Punjab and regional campus partner network records.
  - `student_profiles`: competencies, portfolio links, availability status, encrypted roll numbers, ratings, and completed gig metrics.
  - `business_profiles`: company information, encrypted GSTIN/MSME registration, verified badges.
  - `audit_events`: immutable audit logging for all critical platform actions.
* Configured `drizzle.config.ts`, generated migration (`0000_outgoing_william_stryker.sql`), and created migration runner (`src/db/migrate.ts`).
* Verified clean TypeScript compilation (`tsc`).

## [2026-10-12] Milestone 6: Backend Server Scaffolding (Phase 1.1 Complete)
* Initialized Fastify + TypeScript backend workspace in `/backend`:
  - Configured strict `tsconfig.json` with NodeNext resolution.
  - Implemented runtime environment variable validation using Zod in `src/config/env.ts`.
  - Configured core middleware plugins: Helmet security headers, CORS origin checking, Cookie parser, JWT session management, and Multipart file upload limits (5MB).
  - Built centralized error handling mapping Zod schema validation errors directly to structured HTTP 400 responses.
  - Added root `/health` and `/api/v1/info` service endpoints.
  - Verified clean TypeScript compilation (`tsc`) and updated [[flow.md]].

## [2026-10-12] Milestone 5: Demo Integrity & Frontend Truthfulness Audit (Phase 0 Complete)
* Executed complete audit and rectification across the frontend to align with the Judge Defense Matrix:
  - **Landing Page (`LandingPage.tsx`):** Labeled prototype metrics as pilot demonstrations; replaced inflated student counts with targeted regional cohort descriptions; added a 4-stage visual breakdown of the Verified Milestone Trust Workflow.
  - **Fit Scoring & Disclaimers (`GigDetails.tsx`, `GigApplicants.tsx`):** Clarified candidate scores as explainable "Fit Score (Skills & Location Match)" rather than black-box AI; replaced "100% dispute-free" claim with documented regional track record.
  - **Escrow & Funding Transparency (`PostGigWizard.tsx`, `EmployerWorkspace.tsx`):** Clarified full pre-authorized contract commitment in sandbox escrow; added sandbox tags to payout triggers.
  - **Admin Analytics (`AdminAnalytics.tsx`):** Calibrated header with "Seeded Pilot Demonstration Data" badge.
* Validated build: Vite + TypeScript compiled 100% clean with zero errors.

## [2026-10-12] Milestone 4: Judge-Readiness Implementation Blueprint
* Reviewed the submitted project synopsis, market-research survey, existing product documentation, and frontend implementation.
* Created [[Judge-Readiness-Implementation-Blueprint]] with an evidence-based response map for fifteen likely judge questions, frontend gap inventory, proposed backend architecture, payment/dispute lifecycle, security baseline, and phased acceptance checkpoints.
* Established the master sequential execution roadmap in [[Implementation-Checklist]] with 10 phased checkpoints (Phase 0 to Phase 10) enabling atomic progress tracking.
* Recorded the proposed production-path backend decision in [[decision.md]]. No application code, dependencies, user data, payments, or external integrations were changed.

## [2026-09-13] Milestone 1: Frontend Architecture & Foundation Setup
* Initialized Vite + React 18 + TypeScript in `frontend/`.
* Mapped execution flows and established foundational types and mock data.

## [2026-09-13] Milestone 2: Aesthetic Transformation to Editorial Pastel System
* **Context & Trigger:** User requested strict adherence to the visual essence of the two provided inspiration images (Sense and Shinta), moving away from dark themes to the authentic pastel lilac, bubblegum pink, acid lime, and crisp white editorial world.
* **Key Changes:**
  - Configured custom palette: canvas `#F5F2FD`, white cards `#FFFFFF`, acid lime `#D4F851`, bubblegum pink `#FFA8D5`, jet black `#121214`.
  - Transformed Landing Page with Sense-inspired organic wave ribbon, floating student capsules, 4-track media cards with glowing play buttons and pill action bars, and Shinta-inspired split section with pink noodle doodle.
  - Redesigned Footer into a full-width bubblegum pink editorial canvas with giant brand lettering, pill badge links, and floating white newsletter card.
  - Refactored all 13 screens across Student, Employer, and Admin modules to crisp, luminous white card layouts with dark typography and smooth pill micro-interactions.
  - Installed and verified `framer-motion` and verified 100% clean production build.

## [2026-09-14] Milestone 3: Impeccable Craft Floor & Visual Polish
* **Context & Trigger:** Systematic frontend audit and UI elevation executed via `/impeccable` skill, eliminating AI prototype slop and lifting the application to publication-grade craft.
* **Key Changes:**
  - **Design & Product Authorities:** Formatted `PRODUCT.md` and `DESIGN.md` establishing the Neo-Tactile editorial palette (`#F8F6FE` canvas, `#101014` ink, `#D4F851` lime, `#FFA8D5` pink) and strict craft floor guidelines.
  - **Browser Ergonomics:** Injected custom high-contrast lime selection (`selection:bg-[#D4F851]`), visible ink focus-visible rings (`ring-[#101014]`), custom scrollbars, and `tabular-nums` formatting into `frontend/src/index.css`.
  - **Slop Elimination:** Purged category kicker badges ("THE TALENT ENGINE", "ALL-IN-ONE SYSTEM") above hero titles, removed robotic parenthetical labels (e.g., `(Home)`, `(All Categories)`), and replaced the uniform 4-card metric rows in `StudentDashboard`, `EmployerDashboard`, and `AdminAnalytics` with customized telemetry strips and command desks.
  - **Contrast & Hierarchy Rectification:** Elevated low-contrast `gray-on-color` text on `#FFA8D5` surfaces (e.g. Footer and applicant pills) and `bg-amber-50` dispute banners using deep plum and obsidian ink (`#180816` / `#380E29`), achieving WCAG AAA compliance.
  - **Validation:** Executed `impeccable detect` across all 16 views/components with 0 warnings reported. Re-verified `npm run build` with zero TypeScript or packaging errors.

## [2026-10-14] Milestone 6: Product Furnishing & Cloud Deployment Readiness
* **Context & Trigger:** Transition from internal evaluation prototype to production-grade product ready for college evaluation and deployment to Render & Supabase.
* **Key Changes:**
  - **Purged Preview Crutches:** Removed the artificial Persona Switcher pill from `Navbar.tsx` and 1-click demo buttons from `AuthPage.tsx`. Replaced with an authentic profile avatar menu, role badges, and functional `Sign Out` flow.
  - **Legal Trust Framework:** Created dedicated, production-grade legal pages: `PrivacyPolicyPage.tsx` (DPDP Act compliance), `TermsPage.tsx` (scope limits & IP rights transfer), and `EscrowProtocolPage.tsx` (4-stage custody lifecycle). Connected all static footer links via React Router.
  - **Simulated Razorpay Checkout Modal:** Engineered a realistic `RazorpayCheckoutModal.tsx` simulating UPI/QR, Cards, and Netbanking with PCI-DSS branding and instant test verification to demonstrate payment commitments without live merchant fees.
  - **Cloud Deployment Configuration:** Generated `render.yaml` blueprint for unified Render deployment (Fastify backend + Vite static frontend) and added `frontend/public/_redirects` for SPA routing.
  - **Environment & Storage Alignment:** Configured production-ready `backend/.env` with 64-character cryptographically secure `JWT_SECRET`, Supabase connection templates, and recommended Supabase Storage (1 GB free) for document uploads.
  - **Verification:** Both `frontend` and `backend` built with 0 errors (`tsc && vite build`).

## [2026-10-15] Milestone 7: Dynamic Student Dashboard, Footer RBAC Sanitization & Stage-Isolated Workspace
* **Context & Trigger:** Audit and remediation of static data artifacts, misleading placeholder values, footer RBAC violations, and leaking of unassigned active workspaces to newly registered students.
* **Key Changes:**
  - **Dynamic Secured Pay Telemetry (`StudentDashboard.tsx`):** Replaced technical jargon "Protected Escrow" with intuitive "Secured In-Progress Pay". Replaced the hardcoded ₹5,000 figure with dynamic calculation across active gigs (`activeGigs.reduce(...)`), accurately displaying ₹0 for new accounts. Added an educational modal explaining Escrow in plain terms.
  - **Dynamic Campus ID Credentials:** Replaced static "Verified PCTE Student" and institution badges with real database values (`currentUser.collegeOrCompany`, `currentUser.rollNumber`, and `currentUser.isVerified`). Unverified accounts display "Verification Status: Pending" and clear priority queue messaging with a direct profile link.
  - **MSME Trust Score Guidance:** Dynamically connected rating and reviews count ("New account • 0 reviews yet") and added an interactive modal explaining the 4 criteria to increase score from 0.0 to 5.0.
  - **Footer RBAC Sanitization & PostGig Role Guard:** Removed employer-only "Post-a-Gig" link from the universal footer and replaced it with "Escrow Protection" (`/escrow`). Added a student role guard to `PostGigWizard.tsx` blocking unauthorized access with clear guidance.
  - **Stage-Isolated Workspace & Past Archive (`StudentWorkspace.tsx`, `Navbar.tsx`, `App.tsx`):**
    - Updated navigation and routes to generic `/app/student/workspace` and `/app/employer/workspace`.
    - Enforced student project ownership checking: users only see workspaces where `hiredStudentId === currentUser.id`.
    - If a user has no active projects, a clean "No Active Projects Right Now" empty state is rendered with a "Browse Available Micro-Gigs" CTA.
    - Added a "Past Completed Projects" section allowing users to inspect archived deliverables, proofs, and feedback, which renders an empty state for new users.
  - **Build Verification:** 100% clean production builds verified across both frontend and backend (`npm run build`).

## Milestone 26: Frontend Visual Polish, Heading Contrast Fixes & Micro-Animations
* **Objective:** Elevate visual polish, eliminate unreadable black headings on dark cards, and incorporate purposeful Emil Kowalski micro-animations while preserving the existing brand and layout architecture.
* **Key Changes:**
  - **Dark Surface Contrast Rectification (`LandingPage.tsx`):**
    - Corrected Section 2's high-contrast jet black card (`bg-[#101014]`) heading "Grow faster with verified student talent." by adding explicit `text-white` and `text-slate-200` to prevent inheriting dark body text.
    - Updated comparison matrix data cells to use subtle background tints (`bg-purple-50/60 font-bold text-[#101014]`) with clean borders instead of muddy dark opacity fills.
    - Fixed return back buttons in `TermsPage.tsx`, `PrivacyPolicyPage.tsx`, and `EscrowProtocolPage.tsx` to `text-slate-600 hover:text-[#101014]`, eliminating the invisible `hover:text-white` bug on light canvases.
  - **Motion System Foundations (`index.css`):**
    - Introduced Emil Kowalski custom cubic-bezier curves (`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`).
    - Removed blanket `transition: all` anti-pattern from `.editorial-card` in favor of hardware-accelerated `transform` and `box-shadow` transitions.
    - Added `.btn-tactile` utility with `active:scale-[0.97]` for responsive physical feedback.
    - Added `@media (prefers-reduced-motion: reduce)` accessibility safeguards.
  - **Choreographed Micro-Animations (`LandingPage.tsx`, `Navbar.tsx`, `Footer.tsx`):**
    - Orchestrated hero entrance with staggered `framer-motion` reveals.
    - Applied interactive hover dynamics to top student showcase badges with subtle elevation.
    - Added staggered scroll-reveal to the 4 task track media cards and 4-stage milestone lifecycle cards.
    - Added button-in-button trailing icon hover transitions and tactile press feedback across primary CTAs.
  - **Verification:** Verified clean TypeScript build and Vite compilation without errors.

## Milestone 27: Super Admin Authentication & Role-Isolated Institutional Verification Desk
* **Objective:** Enable administrator login, seed super admin credentials directly into Supabase PostgreSQL, isolate student and employer verification queues into dedicated separate tabs, and provide plain-text credentials for all dummy accounts.
* **Key Changes:**
  - **Super Admin Seeding & Database Provisioning (`seed.ts`):**
    - Seeded two super administrator accounts in Supabase PostgreSQL: `admin@campusgigs.internal` and `admin@verigig.com` with default password `Password@123`.
    - Seeded pending verification dossiers for both students (`navjot.singh@pcte.edu.in`, `gurpreet.kaur@thapar.edu`) and MSME businesses (`amrit@ludhianatech.in`, `deepak@punjaborganics.in`).
  - **Plain-Text Dummy Account Catalog:**
    - Documented `Password@123` across all 5 seeded students (`aarav.sharma@pcte.edu.in`, `mehak.kaur@gndec.ac.in`, etc.) and 5 seeded employers (`simran@bakeology.in`, `rajesh@apexautocomponents.in`, etc.).
  - **Quick 1-Click Autofill Command Bar (`AuthPage.tsx`):**
    - Added quick autofill cards for Super Admin, Student Talent, and SME Employer roles with explicit password transparency and 1-click execution.
  - **Strict Role-Isolated Verification Queue (`AdminVerifications.tsx`, `verification.service.ts`):**
    - Split verification governance into dedicated tabs: "🎓 Student IDs" and "🏢 SME Proofs" fetched independently from `/api/v1/verifications/admin/queue` with query parameters.
    - Implemented rich dossiers: Students display academic institution, degree, graduation year, roll number, skill pills, and college ID card scans; Employers display business domain, GSTIN/Udyam tax proofs, address, and official registration documents.
    - Integrated real-time approval/rejection API calls (`/api/v1/verifications/admin/requests/:id/review`), updating PostgreSQL database records, granting trust badges, and reflecting instantly in the UI.
    - Added document proof zoom modal and customizable rejection reason presets.
  - **Navigation & Access (`Navbar.tsx`, `Footer.tsx`):**
    - Ensured admin routing forwards directly to `/app/admin/verifications` upon login, with direct links from the universal footer and user account menu.
  - **Build Verification:** 100% clean production builds verified across both backend and frontend (`tsc -b && vite build` and `npm run build` in backend).

---

### Milestone 28: Database-Driven Admin Verification, Live Dispute Arbitrations, Real-Time Analytics & Authenticated Work Histories
- **Timestamp:** 2026-10-16
- **Status:** Complete & Production Verified
- **Problem Statement:**
  1. The Admin Verification Desk contained silent mock fallbacks; pending profiles displayed mock users rather than real database verification requests.
  2. The Dispute Escalations Desk was displaying mock disputes instead of querying Supabase PostgreSQL.
  3. The Platform Analytics dashboard displayed static hardcoded cards ("₹840,000", mock percentages).
  4. Every employer account was seeing "Festive Handloom Lookbook" in the applicant pipeline due to lack of applicant seeding and un-scoped gig selection fallbacks. Seed accounts appeared empty rather than demonstrating active contracts and past work histories.
- **Architectural & Technical Solution:**
  - **Comprehensive Seed Execution (`backend/src/db/seed.ts`):**
    - Seeded Super Admin accounts: `admin@campusgigs.internal` and `admin@verigig.com` (`Password@123`).
    - Seeded 5 Verified Regional Campuses (PCTE, GNDEC, Thapar, PAU, Chitkara).
    - Seeded 5 Verified Students (`aarav.sharma@pcte.edu.in`, `mehak.kaur@gndec.ac.in`, `rohan.verma@thapar.edu`, `simran.singh@pau.edu`, `tanvi.gupta@chitkara.edu.in`).
    - Seeded 2 Pending Unverified Students in Admin Queue (`navjot.singh@pcte.edu.in`, `gurpreet.kaur@thapar.edu`).
    - Seeded 5 Verified MSMEs (`simran@bakeology.in`, `rajesh@apexautocomponents.in`, `harpreet@greenroots.in`, `dr.bansal@bansaldental.in`, `karan@urbandrape.in`).
    - Seeded 2 Pending Unverified MSMEs in Admin Queue (`amrit@ludhianatech.in`, `deepak@punjaborganics.in`).
    - Seeded 5 Distinct Open Micro-Gigs with structured milestones (1 per employer) and rich applicant proposals with explainable fit scores.
    - Seeded 5 Active Working Projects (`in_progress` contracts with milestone deliverable submissions) for every employer and student pair.
    - Seeded 6 Completed Past Projects with 5-star ratings, written feedback, endorsed skills, and cryptographically verifiable SHA-256 completion proof hashes.
    - Seeded 2 Real Contract Disputes in `disputes` and `disputeEvidence` for Apex Auto (`deliverable_quality`) and UrbanDrape (`scope_creep`).
  - **Live Backend Analytics Service (`analytics.service.ts`, `analytics.routes.ts`, `app.ts`):**
    - Built `GET /api/v1/analytics/platform` computing real-time total volume, escrow in transit, payout success rate, median turnaround, campus freelancer distribution, and category liquidity share directly from PostgreSQL tables.
  - **Frontend Live Data Wiring:**
    - `AdminVerifications.tsx`: Removed all mock fallbacks; displays only real database verification requests in isolated student and employer tabs. Verification approvals update badges immediately in PostgreSQL.
    - `AdminDisputes.tsx`: Re-wired to `disputesApi.listAdminDisputes()`, fetches live case dossiers with timestamped evidence, and executes binding settlement rulings (`POST /api/v1/admin/disputes/:id/resolve`).
    - `AdminAnalytics.tsx`: Replaced all hardcoded values with live telemetry from `analyticsApi.getPlatformAnalytics()`.
    - `GigApplicants.tsx`: Fixed employer scoping to strictly isolate gigs owned by the logged-in business, eliminated fallback to foreign gigs, and fetches candidate applications dynamically from `applicationsApi.getGigApplicants(gig.id)`.
    - `MarketplaceContext.tsx`: Synchronizes both open gigs and user contracts (`contractsApi.getUserContracts()`) on authentication, ensuring dashboards and workspaces display active contracts and past work.
- **Verification:** Both backend (`npm run build`) and frontend (`tsc -b && vite build`) compiled with 0 errors. All accounts share the password `Password@123`.

---

## Phase 14: Authentic Student Profile Picture Propagation and Contextual Messaging Delivery Ticks & Clock State Machine
- **Timestamp:** 2026-10-24
- **Status:** Complete & Production Verified
- **Problem Statement:**
  1. Student proposals in the employer pipeline view showed a hardcoded Unsplash profile picture instead of the authentic profile picture fetched via Google Auth.
  2. Messages sent from an employer to a student applicant were not received by the student, and the employer saw a static `<Clock />` icon that misleadingly indicated the message was not sent from their side.
- **Architectural & Technical Solution:**
  - **Authentic Student Avatar Propagation & Fallback:**
    - Updated `backend/src/modules/applications/applications.schema.ts` to accept `studentAvatar`.
    - Updated `backend/src/modules/applications/applications.service.ts` to persist `studentAvatar` under internal marker `__student_avatar__` in `portfolioItems` and return it cleanly in `getGigApplications`.
    - Wired `currentUser.avatar` through `GigDetails.tsx`, `endpoints.ts`, and `MarketplaceContext.tsx`.
    - In `GigApplicants.tsx`, candidate cards and dossiers render the student's authentic Google Auth avatar, with automatic safe fallback to `DEFAULT_STUDENT_AVATAR` on missing avatar or image load error.
  - **Contextual Messaging & Delivery State Machine:**
    - Replaced the hardcoded clock in `ChatModal.tsx` with a 4-state delivery model:
      - `sending`: `<Clock className="w-3 h-3 text-white/40 animate-spin" />` (not sent yet from user side).
      - `sent`: `<Check className="w-3.5 h-3.5 text-white/50" />` (single gray tick, confirmed sent from user side).
      - `delivered`: `<CheckCheck className="w-3.5 h-3.5 text-white/50" />` (double gray tick, delivered to student).
      - `read`: `<CheckCheck className="w-3.5 h-3.5 text-[#38BDF8]" />` (double sky-blue tick, seen/read by student).
    - In `backend/src/modules/messaging/messaging.service.ts`, implemented `toValidUuid(id)` using deterministic MD5 hashing to prevent PostgreSQL UUID type crashes on non-UUID context and user identifiers.
    - Added multi-thread discovery in `ChatModal.tsx` and updated `Navbar.tsx` to dynamically open real active conversation threads.
    - Synchronized messages across browser tabs and sessions via `localStorage` and `verigig_message_sent` / `verigig_message_read` custom event bus.
- **Verification:**
  - Backend TypeScript checked (`tsc --noEmit`) with 0 errors.
  - Frontend TypeScript checked (`tsc --noEmit`) with 0 errors.
  - Frontend production build (`vite build`) succeeded with 0 errors.

---

## Phase 15: Navbar Message Streamlining via Notification System and Applied Micro-Gig Direct Communication
- **Timestamp:** 2026-10-24
- **Status:** Complete & Production Verified
- **Problem Statement:**
  1. The standalone message button in the navbar created confusion because students logging in could not find where messages were received.
  2. Applied students viewing their applied micro-gigs only saw "Proposal Submitted" with no way to start or view conversations with the hiring business.
- **Architectural & Technical Solution:**
  - **Removed Message Icon from Navbar:** Streamlined header navigation to solely use the Notification Bell for alerts, messages, and platform activity.
  - **Targeted Message Notifications with Direct Chat Handshake:**
    - Expanded `NotificationItem` to support `type: 'message'` and embedded `chatContext`.
    - In `MarketplaceContext.tsx`, isolated notifications per user (`recipientUserId === currentUser.id`) and synced unread conversation messages into interactive notifications.
    - In `NotificationDrawer.tsx`, added "Open Conversation" action button and clickable message cards that launch `ChatModal` directly into the relevant employer thread.
  - **Applied Micro-Gig SME Communication Channel:**
    - In `GigDetails.tsx`, added a "Messages with SME" button next to "Proposal Submitted".
    - Added a direct communication channel card in the project body detailing the conversation with the employer and a one-click "Open Conversation" button.
- **Verification:**
  - `tsc -b frontend/tsconfig.json` completed with 0 errors.
  - `vite build` completed in 5.73s with 0 errors.


