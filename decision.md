# Architectural Decisions (decision.md)

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
