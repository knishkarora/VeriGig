# Architectural Decisions (decision.md)

## [2026-10-15] Decision: Streamlined Onboarding, Profile Verification & Dynamic Micro-Gig Hydration

* **Context & Scope:** 
  1. The registration flow previously required academic institution credentials, university roll numbers, and physical ID document uploads upfront. This caused significant friction and created a disparity where users authenticating via Google OAuth bypassed verification without a path to upload ID documents in their profile.
  2. The student profile drawer featured an unbounded numeric graduation year counter, lacked canonical skills enforcement (allowing arbitrary text), suffered from cross-origin session token omission during profile updates, and lacked document upload inputs.
  3. Clicking on database-created micro-gigs from the Explore feed caused runtime rendering errors due to unhandled missing entity fields and unhydrated backend routes.
* **Choice Made:** 
  1. **Friction-Free Registration:** Shifted institutional verification and roll number inputs from the sign-up form to the profile drawer. Registration now strictly requires role, name, email, password, and confirm password.
  2. **Canonical Skills Catalog & 2000s Year Slider:** Built a curated, alphabetically sorted catalog of 90+ verified tech and creative skills (`PLATFORM_SKILLS`), preventing arbitrary strings. Replaced the numeric input with a smooth graduation year slider (spanning years 2000 through 2035) with real-time class badge readouts and dropdown jumps.
  3. **In-Profile Verification & Resilient Persistence:** Added roll number input and student ID card upload directly to `EditProfileDrawer.tsx`, with Bearer token injection in `client.ts` to ensure cross-origin cookie resiliency. Profile updates immediately update local state and local storage while gracefully handling backend network conditions.
  4. **Defensive Dynamic Gig Hydration:** Hardened `GigDetails.tsx` with fallbacks for all metadata fields, implemented asynchronous backend fetching by ID (`gigsApi.getGigById`), and registered route aliases (`/app/student/gig/:id`, `/app/gig/:id`, `/gigs/:id`, `/app/explore`, `/explore`) ensuring persistent accessible URLs for all posted gigs.
* **Rationale (Why over What):**
  - Moving KYC to the profile creates equal onboarding parity between email and Google OAuth logins.
  - Curated canonical skills ensure high-fidelity candidate matching and prevent garbage taxonomy.
  - Defensive fallback hydration in `GigDetails` prevents white/blank screens even when database relations are incomplete.
* **Tradeoffs Accepted:**
  - Allowing registration without immediate ID upload means unverified students can browse and explore immediately, while application submission prompts them to complete profile verification.
* **Immutability Status:** Settled & Immutable.

* **Context & Scope:** Google OAuth completed in the browser but did not create a VeriGig backend session or profile, leaving users on the auth route and mixing provider metadata with seeded demo data.
* **Choice Made:** Verify each Supabase access token in Fastify against Supabase Auth, then look up or provision the VeriGig account by verified email and issue the existing application JWT/refresh-token session.
* **Rationale (Why over What):** This makes email and Google login share one authorization and profile source of truth. It also ensures an existing account retains its assigned role instead of allowing a browser-stored role to redefine it. A frontend-only session was rejected because protected marketplace APIs could not trust it.
* **Tradeoffs Accepted:** The backend requires `SUPABASE_URL` plus a server-side Supabase service-role or anon key for the token-verification call. This is a small deployment configuration cost in exchange for reliable, server-enforced identity.
* **Immutability Status:** Settled & Immutable (prevents re-litigating settled arguments in the future).

## [2026-10-14] Decision: Frontend-Backend REST API Integration, Missing UI Modals & Parity Completion (Phase 10)

* **Context & Scope:** 
  The backend implementation across Phases 1 through 9 built comprehensive business logic, data models, and REST endpoints (Authentication, Profiles, KYC Verifications, Gigs, Applications & Explainable Fit Matching, Contracts & Milestone Revisions, Sandbox Payments & Escrow Ledger, Admin Arbitration Disputes, Double-Sided Reviews, Portable Completion Verification, and Contextual Messaging). To fulfill the project vision and demonstrate complete end-to-end functionality for hackathon evaluations (Judge Defense Matrix Q1 through Q15), the frontend had to integrate every backend capability, build all missing user-facing views, and eliminate mock-only blindspots while maintaining strict visual consistency with the Neo-Tactile design system (`#090D16`, `#D4F851`, `#FFA8D5`, Plus Jakarta Sans, rounded-3xl cards).

* **Choice Made:** 
  Implemented a dual-layer integration and UI completion architecture:
  1. **Normalized API Client & Service Layer (`frontend/src/api/`):**
     - Built a type-safe API client (`client.ts`) utilizing standard Fetch with `include` credentials for secure HTTP-only refresh cookies, normalized REST error formatting (`ApiClientError`), and base URL resolution defaulting to `http://localhost:4000/api/v1`.
     - Built fully typed endpoint functions (`endpoints.ts`) mapping 1:1 to all backend modules (`authApi`, `profilesApi`, `verificationApi`, `gigsApi`, `applicationsApi`, `contractsApi`, `paymentsApi`, `disputesApi`, `reviewsApi`, and `messagingApi`).
  2. **Comprehensive Missing UI Modal & Drawer Suite (`frontend/src/components/`):**
     - Built `ChatModal.tsx` for contextual in-app real-time conversations with real-time heuristic safety alerts warning against off-platform contact or payment sharing.
     - Built `ScopeAcceptanceModal.tsx` for bilateral binding contract activation, enforcing explicit acceptance of confidentiality (NDA), IP transfer assignment, and the 2-revision limit.
     - Built `PaymentEscrowModal.tsx` enabling employer pre-authorized contract commitment into sandbox escrow with transparent 0% pilot commission breakdown.
     - Built `ContractReceiptModal.tsx` rendering verifiable itemized financial breakdown receipts with ledger transaction hashes.
     - Built `RaiseDisputeDrawer.tsx` allowing both parties to escalate milestone conflicts with category selection and evidence attachment.
     - Built `ReviewModal.tsx` implementing the double-sided blind review gate (1–5 stars, feedback, skill endorsements) with mutual concealment notice.
     - Built `InterviewSchedulerModal.tsx` for candidate proposal scheduling.
     - Built `EditProfileDrawer.tsx` for student profile editing with DPDPA 2023 privacy controls.
  3. **Dedicated Standalone Pages (`frontend/src/pages/`):**
     - Built `EmployerProfile.tsx` (`/app/employer/profile`) showcasing verified GSTIN badge, company metrics, and 1-click rehire talent roster.
     - Built `CompletionVerificationPage.tsx` (`/verify/completion/:hash`) providing public, unauthenticated validation of student completion certificates with cryptographic SHA-256 seal.
  4. **Graceful Fallback & Context Integration:**
     - Integrated `MarketplaceContext` with dynamic API fetching of live gigs while preserving offline seed fallbacks to guarantee uninterrupted live demonstrations even if the backend database is unreachable during presentations.

* **Rationale (Why over What):**
  - **Full Parity Guarantee:** Generic demos often connect only 1 or 2 happy paths and leave other buttons non-functional. Building complete modals and drawers for all 9 phases ensures judges can inspect any screen, modal, or action and find fully interactive flows.
  - **Consistent Neo-Tactile Aesthetics:** Reusing established Tailwind tokens and Lucide iconography preserves the distinct editorial quality without introducing visual regressions or third-party component libraries.
  - **Zero-Breakage Demo Resilience:** Dual-mode state (live API calls with graceful mock seed fallbacks) ensures high reliability under judge scrutiny.

* **Tradeoffs Accepted:**
  - Fallback caching in React state allows seamless offline demo mode, which means in the absence of a live running backend server, local state modifications persist across the session without throwing unhandled network crashes.

* **Immutability Status:** Settled & Immutable.


## [2026-10-14] Decision: Double-Sided Reviews, Cryptographic Completion Proof & In-App Messaging Safety (Phase 9)

* **Context & Scope:** 
  Micro-gig completion requires trustworthy, manipulation-resistant reputation feedback and portable proof of work, while in-app communication must proactively prevent off-platform disintermediation, fee avoidance, and privacy leaks. This directly fulfills Judge Defense Matrix Q2 (verified credentials & portfolio value), Q5 (reputation & trust mechanics), Q6 (anti-fraud & disintermediation protection), and Q8 (DPDPA 2023 compliance & data protection).

* **Choice Made:** 
  Implemented a dual-engine architecture across reviews, credentialing, and communication in `backend/src/modules/reviews/` and `backend/src/modules/messaging/`:
  1. **Double-Sided Review Gate (`reviews`):**
     - Reviews submitted by either the student or employer for a completed contract remain strictly confidential (`isPublic: false`) until both parties submit feedback or the evaluation period elapses.
     - Neither party can see the other's score before providing their own rating (1–5 scale with structured feedback), eliminating retaliatory ratings or coercive review negotiation.
     - Once unsealed, ratings automatically update the student's aggregate verified score (`ratingAvg`, `ratingCount`).
  2. **Cryptographic Completion Proof (`completion_records`):**
     - Upon contract completion and milestone sign-off, the server issues an immutable completion record containing a cryptographic SHA-256 digest (`verificationHash`).
     - The digest is computed deterministically over `contractId + studentId + employerId + completedAt`.
     - The certificate is publicly resolvable via `GET /api/v1/verify/completion/:hash` without authentication, providing an unfalsifiable, shareable link for student CVs, LinkedIn, or academic portfolios.
  3. **Contextual Messaging with Real-Time Safety Scanner (`conversations`, `messages`):**
     - In-app conversations are strictly contextual, anchored to a specific `gig`, `application`, or `contract`.
     - A zero-latency heuristic scanner (`MessagingSafetyScanner`) audits all incoming messages for:
       * Off-platform contact sharing (Indian/US phone numbers, WhatsApp links, Telegram handles).
       * Off-platform payment terms (UPI handles, direct transfer phrases, GPay/PhonePe solicitations).
       * Email address disclosures (DPDPA 2023 compliance advisory).
       * Accidental API secrets, passwords, or bearer token disclosure.
     - Violations flag the message with clear in-app safety advisories (`hasSafetyWarning: true`, warning notes) and emit a `safety_policy_warning_triggered` security audit event without dropping message delivery, educating users on platform protections while logging risk metrics.

* **Rationale (Why over What):**
  - **Reputation Integrity:** On generic gig marketplaces, freelancers and clients withhold honest feedback or trade 5-star ratings out of fear of retaliation. Blind double-sided submission guarantees unbiased appraisals.
  - **Portable Proof over Platform Lock-in:** Students need portable credentials they can present to university placement cells, employers, and LinkedIn. A cryptographic hash provides instant, tamper-evident verification.
  - **In-App Safety without Disruption:** Outright message blocking frustrates legitimate users, whereas immediate inline warnings and audit logging deter bad actors, preserve the escrow safety net, and protect students from payment scams.

* **Tradeoffs Accepted:**
  - Double-sided reviews require both parties to complete the review before ratings become public. If one party does not review, a background timeout window can reveal the unilateral review after a settlement grace period.

* **Immutability Status:** Settled & Immutable.


## [2026-10-14] Decision: Milestone Dispute Escalation, Evidence Gathering & Admin Arbitration (Phase 8)

* **Context & Scope:** 
  Micro-gig milestone conflicts (unreasonable revisions, unresponsive counterparties, scope disputes) require a formal escalation path to prevent non-payment, student exploitation, or client abandonment, directly addressing Judge Defense Matrix Q6 (fraud prevention) and Q13 (disputes and arbitration).

* **Choice Made:** 
  Implemented a structured, auditable dispute lifecycle in `backend/src/modules/disputes/`:
  1. **Immediate Milestone Freeze:** Filing a dispute instantly locks the disputed milestone in `disputed` state, preventing unauthorized withdrawal, release, or cancellation while keeping undamaged contract milestones intact.
  2. **Bilateral Evidence Gathering (`dispute_evidence`):** Both parties can attach immutable evidence notes and reference URLs/file keys to the case dossier.
  3. **Binding Administrative Arbitration (`dispute_decisions`):** Platform administrators review the contract brief, deliverable history, revision transcripts, and submitted evidence to issue a binding ruling with a written justification.
  4. **Strict Conservation of Funds in Ledger Settlement:** The ruling allocates the frozen milestone amount across `payoutAmountStudent` and `refundAmountEmployer`, strictly enforcing that `payout + refund === milestone.amount`. The settlement executes atomic double-entry ledger movements (Debit `sandbox_escrow` -> Credit `student_wallet` and/or `employer_account`), immediately updating the balance state and emitting an immutable audit event.

* **Rationale (Why over What):**
  - **Accountability over Informal Abandonment:** When freelancers and clients disagree on generic platforms, either the client charges back or the freelancer abandons work with zero recourse. VeriGig provides an objective, evidence-based arbitration desk with an auditable ledger trail.
  - **Financial Soundness:** Enforcing mathematical equality between ruling settlement sums and escrowed milestone funds prevents platform deficit or unbacked balance inflation.

* **Tradeoffs Accepted:**
  - Administrative review requires human arbitrator intervention. This is acceptable and expected for trusted Tier-2/Tier-3 regional pilot deployments where high trust and dispute resolution integrity take priority over automated black-box closures.

* **Immutability Status:** Settled & Immutable.


## [2026-10-14] Decision: Payment Commitment, Double-Entry Escrow Ledger & Webhook Authority (Phase 7)

* **Context & Scope:** 
  Financial settlement and escrow guarantees are critical to answering Judge Defense Matrix Q6 (preventing non-payment/fraud), Q9 (transparent revenue model), and Q13 (payment, milestone releases, and refunds).

* **Choice Made:** 
  Implemented an auditable financial architecture in `backend/src/modules/payments/`:
  1. **Provider Webhook as Single Source of Financial Truth:** Client code never marks funds as deposited or paid out directly. Only signed provider webhooks (`payment.captured`, `payment.authorized`) or server-side authorized releases trigger balance state transitions.
  2. **Append-Only Double-Entry Ledger (`ledger_entries`):** All financial movements create balanced debit/credit entries between `employer_account`, `sandbox_escrow`, `student_wallet`, and `platform_revenue`. Ledger records are strictly append-only and cannot be updated or deleted.
  3. **Strict Idempotency Enforcement:** All payment order generation and milestone releases mandate an `idempotency_key` unique constraint in PostgreSQL. Duplicate network requests return the original intent without double-charging or double-crediting.
  4. **Pilot Zero-Commission Policy:** To solve the initial two-sided marketplace cold start (Judge Defense Q9 & Q10), platform commission is 0% during the regional pilot cohort (standard 5% fee explicitly waived on itemized receipts with GST exempt line items).

* **Rationale (Why over What):**
  - **Judge Readiness & Escrow Compliance:** Generic platforms allow verbal deals or unsecured promises. VeriGig mandates full pre-authorized contract commitment in escrow before work begins. Using a double-entry ledger ensures every rupee is accounted for and verifiable in an audit.
  - **Security:** HMAC-SHA256 signature verification protects webhook endpoints against tampering, spoofing, and replay attacks.

* **Tradeoffs Accepted:**
  - Sandbox mode uses simulated gateway tokens and deterministic identifiers (`order_sand_...`, `payout_sand_...`) designed to drop-in swap with Razorpay Route or cashfree live credentials for production deployment.

* **Immutability Status:** Settled & Immutable.


## [2026-10-14] Decision: Two-Party Scope Acceptance & Capped Revision State Machine (Phase 6)

* **Context & Scope:** 
  Micro-gig execution requires binding commitments between student contractors and SME employers, addressing Judge Defense Matrix Q1 (problem & lifecycle), Q6 (preventing exploitation & fraud), and Q8 (confidentiality, IP transfer, and data security).

* **Choice Made:** 
  Implemented a transactional contract state machine across `contracts`, `contract_milestones`, `deliverable_submissions`, and `revision_requests`:
  1. **Two-Party Scope Acceptance Gate:** Employer offer generation establishes a `scope_pending` contract with isolated milestone clones. Execution begins only after the student contractor explicitly accepts confidentiality terms, the IP assignment clause (specifying work product transfer upon approved settlement), and the milestone breakdown.
  2. **Capped Revision Cycles:** Every contract enforces a hard revision ceiling (`maxRevisionsPerMilestone`, default 2). The server blocks subsequent revision attempts beyond this cap, requiring the employer to either approve the deliverable or escalate to formal Admin Arbitration.
  3. **Sequential Milestone Locking:** Only milestone 1 is unlocked initially; subsequent milestones remain strictly `locked` until the prior milestone is reviewed, approved, and released.
  4. **Immutable Deliverable Versioning:** Submissions record auto-incrementing version numbers, repository/live preview URLs, student notes, and file attachments.

* **Rationale (Why over What):**
  - **Exploitation Protection:** Unbounded revision requests are the primary vector of student exploitation on generic freelancing platforms. Hard server-side enforcement prevents infinite rework loops.
  - **Legal & IP Certainty:** Explicit two-party scope acceptance creates an auditable contract record. IP transfer is conditioned upon milestone sign-off, protecting the student during work and the SME upon completion.

* **Tradeoffs Accepted:**
  - Extra friction before work kickoff (student must review and sign scope instead of instant work start). This trade-off is essential to maintain the trust boundary.
  - Hard revision cap may require admin dispute escalation if an SME is genuinely dissatisfied after 2 revisions.

* **Immutability Status:** Settled & Immutable.


## [2026-10-14] Decision: Explainable Deterministic Candidate Fit Scoring Engine (Phase 5)

* **Context & Scope:** 
  The proposal submission and applicant tracking pipeline in Phase 5 requires scoring candidate suitability for employers while addressing Judge Defense Matrix Q12 ("How does matching work without fake AI claims?").

* **Choice Made:** 
  Implemented a pure, deterministic, rule-based matching engine (`CandidateFitEngine`) in `backend/src/modules/applications/matching.service.ts` scoring across 4 auditable dimensions:
  1. Skill Overlap (40% weight): Exact and substring token matching between gig requirements and student profile skills.
  2. Work Mode & Locality Compatibility (25% weight): Remote preference alignment or hyper-local / campus proximity matching.
  3. Availability & Timeline Fit (20% weight): Current student schedule signal (`available_now`, `part_time`, `busy`).
  4. Verified Track Record & Quality (15% weight): Collegiate credential verification bonus, completed gig count, and peer rating.
  The engine returns an overall score (0-100), structured breakdown categories, and human-readable explanation bullets stored alongside the application.

* **Rationale (Why over What):**
  - **Explainability over Black-Box AI:** In micro-gigs, students and SMEs need transparent justifications (e.g. "3 of 4 required skills matched", "Matches remote preference", "2 past verified completions"). Opaque vector embeddings or LLM ranking cannot be audited, risk hallucinatory bias, and invite severe scrutiny from judges.
  - **DPDPA Compliance:** The algorithm strictly evaluates consented, profile-declared attributes without scraping third-party sources or processing unconsented telemetry.
  - **Zero External Latency:** Pure TypeScript in-memory evaluation executes in `< 1ms` during proposal submission, eliminating AI model inference costs and API downtime risks.

* **Tradeoffs Accepted:**
  - Semantic synonyms (e.g. "ReactJS" vs "React") rely on substring and token normalization rather than deep semantic embeddings (acceptable for micro-gig taxonomy and can be augmented with synonym dictionaries in future iterations).
  - No automated rejection: Scores strictly aid employer shortlisting; the platform never automatically rejects a student based on score alone.

* **Immutability Status:** Settled & Immutable.


## [2026-10-12] Decision: Proposed production-path backend baseline

* **Context & Scope:** The current React frontend demonstrates a complete student-to-SME marketplace journey with seeded, in-memory data. A judge-readiness implementation plan is needed to convert the workflow into a persistent, trustworthy product without misrepresenting simulated verification or payment actions as live operations.

* **Choice Made:** Propose a TypeScript Fastify API, PostgreSQL relational database, private object storage for documents/deliverables, provider-owned marketplace payment flow, and an event outbox for notifications. n8n remains limited to non-critical reminders, reporting, and CRM-style automation.

* **Rationale (Why over What):** TypeScript aligns server contracts with the existing React/TypeScript frontend. PostgreSQL supports transactional state transitions across contracts, milestones, payouts, and disputes. A payment provider, rather than an application-controlled balance, is necessary before making escrow-like claims. Critical domain state must remain inside the API/database transaction boundary rather than an automation workflow.

* **Tradeoffs Accepted:** The plan adds server, database, provider, security, and operational complexity versus the current demo. It deliberately defers opaque AI ranking, nationwide scale, and platform-held funds in exchange for auditable, explainable MVP behaviour.

* **Immutability Status:** Proposed for approval before implementation. No dependencies or live integrations have been added.

## 2026-09-13 Decision: Frontend Tech Stack and Reactive Client Architecture

* **Context & Scope:** 
  The project requires a localized Student-SME micro-gig marketplace frontend ("CampusGigs") showcasing complete role-based journeys (Student Freelancers, SME Employers, Admin Governance) with zero backend dependency for rapid stakeholder prototyping and presentation.

* **Choice Made:** 
  - **Framework & Build:** React 18 + Vite + TypeScript.
  - **Styling:** Tailwind CSS v3 with a custom dark theme design system (`#090D16` base, `#111827` frosted surfaces, `#6366F1` electric indigo, `#10B981` verified emerald, `#F59E0B` amber escalation).
  - **Navigation & Icons:** `react-router-dom` v6 and `lucide-react`.
  - **Interactive State Store:** Centralized React Context (`MarketplaceContext`) with TypeScript schemas and localized seed data (Indian Tier-2/Tier-3 college ecosystems and local businesses).

* **Rationale (Why over What):**
  - Vite + React TS provides instant HMR, high compilation speed, and strict type safety across complex gig and milestone states.
  - Tailwind CSS enables rapid implementation of utilitarian elegance, frosted glass cards (`backdrop-blur-md`), and pill-shaped badge UI derived from the design inspirations without heavy third-party UI framework lock-in.
  - A comprehensive in-memory reactive context enables full-cycle user testing (e.g. Employer posts gig -> Gig appears immediately in Student explorer -> Student applies -> Employer hires -> Student submits deliverable -> Employer signs off with milestone payout) completely offline without server prerequisites.

* **Tradeoffs Accepted:**
  - Mock state resets on browser hard-refresh (mitigated by pre-populating rich default mock datasets and syncing with `localStorage` where advantageous).
  - No live network requests or persistent backend databases in this iteration.

* **Immutability Status:** Settled & Immutable.

## [2026-10-15] Decision: Client-Side Google OAuth Handshake & Supabase Whitelist Architecture

* **Context & Scope:** 
  During Google OAuth authentication on the `/auth` page, completing Google account authorization redirected users to a blank `http://localhost:3000/#access_token=...` screen with serialized credentials in the URL fragment instead of logging the user into their respective role workspace.

* **Choice Made:** 
  - Maintained dynamic frontend origin resolution (`${window.location.origin}/auth?provider=google&role=${role}`) with client-side session extraction via `@supabase/supabase-js`.
  - Added an active `useEffect` listener on `AuthPage.tsx` using `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()`.
  - Automatically mapped authenticated OAuth profile data (`full_name`, `email`, `picture`) into `MarketplaceContext` via `loginUser()` and redirected to role-specific dashboards.
  - Documented explicit Supabase URL configuration settings required to prevent the fallback to Supabase's default Site URL (`http://localhost:3000`).

* **Rationale (Why over What):**
  - Supabase Auth strictly validates the requested `redirectTo` parameter against the project's configured **Site URL** and **Redirect URLs** allowlist. When Vite runs on `http://localhost:5173` without `http://localhost:5173/**` registered in Supabase, Supabase silently falls back to its default Site URL (`http://localhost:3000`). Because nothing listens on port 3000 in Vite's default dev environment, the browser encounters an unreachable/blank screen.
  - Adding the client-side session listener ensures that upon return from Google's consent screen, tokens are immediately ingested, persisted to state, stripped from the browser URL address bar via `window.history.replaceState`, and transitioned to `/app/student/dashboard` or `/app/employer/dashboard` without requiring a custom OAuth proxy server.

* **Tradeoffs Accepted:**
  - Users must configure their local dev URL (`http://localhost:5173/**`) and production domain in their Supabase Dashboard's URL Configuration. This is standard OAuth protocol security behavior to prevent open redirect vulnerabilities.

* **Immutability Status:** Settled & Immutable.
