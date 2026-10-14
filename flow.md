# Execution Flow Map (flow.md)

## 1. Entry Point
* **Browser Navigation:** `index.html` -> `src/main.tsx` -> `src/App.tsx` (wrapped in `<BrowserRouter>` and `<MarketplaceProvider>`).
* **Route Resolution:** Resolves URLs to corresponding pages:
  - `/`: `LandingPage`
  - `/auth`: `AuthPage`
  - `/app/student/*`: Student pages (`StudentDashboard`, `GigExplore`, `GigDetails`, `StudentWorkspace`, `StudentProfile`)
  - `/app/employer/*`: Employer pages (`EmployerDashboard`, `PostGigWizard`, `GigApplicants`, `EmployerWorkspace`)
  - `/app/admin/*`: Admin pages (`AdminVerifications`, `AdminDisputes`, `AdminAnalytics`)

## 2. Dynamic Execution Sequence & State Flow
```
User Action (e.g. Post Gig / Apply / Submit Deliverable / Approve)
  │
  ▼
Component Handler (e.g. PostGigWizard.handleSubmit)
  │
  ▼
MarketplaceContext Action Dispatcher
  │
  ├─> Updates React State (`gigs`, `proposals`, `verifications`, `notifications`)
  ├─> Triggers Notification dispatch (simulated webhook toast/drawer)
  └─> Updates LocalStorage cache for session persistence
  │
  ▼
Re-render across subscribed modules:
  ├─> Student Explorer (`/app/student/explore`) immediately lists newly published gigs
  ├─> Employer ATS (`/app/employer/gig/:id/applicants`) immediately lists new applicant proposals
  ├─> Workspaces (`/app/student/workspace/:id` & `/app/employer/workspace/:id`) sync milestone statuses
  └─> Admin Queue (`/app/admin/verifications`) reflects approved student IDs with updated trust badges
```

## 3. Modified Scope (Phase 7: Payment Commitment, Sandbox Escrow Ledger & Webhooks)
* Implemented `src/db/schema/payments.ts`:
  - `payment_intents`: Tracks order IDs, amounts, provider statuses (`created`, `authorized`, `captured`, `failed`, `refunded`), and unique idempotency keys.
  - `payment_events`: Immutable log of raw webhook payloads and provider references.
  - `payouts`: Milestone payout records with gross amount, zero-commission pilot fee deduction, net student amount, and status (`pending`, `processing`, `completed`, `failed`).
  - `ledger_entries`: Double-entry append-only accounting ledger recording debit/credit movements (`employer_account`, `sandbox_escrow`, `student_wallet`, `platform_revenue`) and entry types (`escrow_funded`, `milestone_payout`, `platform_fee`, `refund`).
* Implemented `src/modules/payments/`:
  - `gateway.service.ts`: `SandboxPaymentGatewayService` creating sandbox orders and verifying HMAC-SHA256 webhook signatures.
  - `payments.schema.ts`: Zod validation for payment orders, idempotency enforcement, signed webhook payloads, and payout release authorizations.
  - `payments.service.ts`: Enforces provider webhook as sole authority for funding state, records double-entry ledger entries, settles milestone payouts with zero pilot fees, computes student private lifetime earnings and pending escrow, and generates itemized receipts.
  - `payments.routes.ts`: Registered endpoints under `/api/v1/payments`:
    - `POST /create-order`: Employer creates funding order with mandatory idempotency key.
    - `POST /webhook`: Digital signature-verified webhook handler processing `payment.captured` and updating contract state.
    - `POST /release-payout`: Employer authorizes payout release for approved milestones.
    - `GET /receipt/:contractId`: Itemized financial breakdown receipt with platform fee transparency.
    - `GET /student/earnings`: Student private financial dashboard reporting lifetime earnings, pending escrow, and payout history.

## 4. Backend Execution Sequence
```
HTTP Request (Client / Browser / curl)
  │
  ▼
Fastify Server (src/index.ts -> src/app.ts)
  │
  ├─> Helmet (Security Headers)
  ├─> CORS Validation (Whitelist check vs config.CORS_ORIGIN)
  ├─> Cookie & JWT Parser (Token extraction from Authorization / Cookie)
  ├─> Multipart Limit Handler (File uploads restricted to 5MB, 3 files max)
  │
  ▼
Route Resolver (/api/v1/*)
  │
  ├─> PreHandler Hooks:
  │     ├─> authenticate: Extracts JWT payload -> req.currentUser (401 on missing/expired)
  │     └─> requireRole: Validates role in allowed list (403 on role mismatch)
  │
  ├─> Zod Schema Validation (Request body, params, query)
  ├─> AuthService Execution (bcrypt password verify, DB transactions)
  ├─> Session / JWT Issuance & HTTP-only Cookie setting
  ├─> Audit Log Recording (audit_events table)
  │
  ▼
Centralized Error Handler (ZodError -> 400 with field errors, Error -> 500)
  │
  ▼
JSON HTTP Response
```

## 5. Cross-Boundary Analysis
* **Role Boundary:** Role switcher updates `currentRole` in `MarketplaceContext`, seamlessly reconfiguring Navbar links, quick actions, and route accessibility.
* **Milestone State Transitions:**
  - `locked` -> `active` (upon hiring & funding escrow)
  - `active` -> `under_review` (upon student deliverable submission)
  - `under_review` -> `completed` (upon employer sign-off & release) OR `in_revision` (upon revision request)
* **Trust Propagation:** Admin verification triggers immediate badge upgrade (`isVerified: true`), showing emerald verified badge across proposals, profiles, and listings.
* **Frontend-Backend API Boundary:** Frontend communicates via authenticated REST API at `http://localhost:4000/api/v1` with credentials enabled for session cookies.
