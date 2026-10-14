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

## 3. Modified Scope (Phase 8: Dispute Resolution, Governance & Immutable Audit Logs)
* Implemented `src/db/schema/disputes.ts`:
  - `disputes`: Tracks contract milestone disputes with `initiatedBy`, `reasonCategory`, `explanation`, `status` (`open`, `evidence_pending`, `in_review`, `resolved`), and `resolutionType` (`refund_employer`, `payout_student`, `split_settlement`).
  - `dispute_evidence`: Bilateral evidence log tracking `uploadedBy`, notes, and file attachments/URLs.
  - `dispute_decisions`: Administrative arbitration rulings recording `adminId`, `formalRuling`, `payoutAmountStudent`, and `refundAmountEmployer`.
* Implemented `src/modules/disputes/`:
  - `disputes.schema.ts`: Zod validation for dispute filing, evidence submissions, and admin arbitration rulings with strict mathematical reconciliation.
  - `disputes.service.ts`: Handlers for freezing disputed milestones in escrow, collecting bilateral evidence, assembling comprehensive case dossiers for administrative review, executing binding arbitration rulings with double-entry ledger settlements, and logging immutable audit events.
  - `disputes.routes.ts`: Registered endpoints under `/api/v1/disputes` with aliases in `app.ts`:
    - `POST /api/v1/contracts/:id/disputes/raise` (and `/api/v1/disputes/raise`): Party files dispute; freezes milestone funds in escrow.
    - `POST /api/v1/disputes/:id/evidence`: Student or employer attaches supporting evidence notes/documents.
    - `GET /api/v1/disputes/:id`: Detailed dispute dossier inspection view.
    - `GET /api/v1/admin/disputes` (and `/api/v1/disputes/admin/queue`): Admin arbitration desk listing active dispute cases.
    - `POST /api/v1/admin/disputes/:id/resolve`: Admin issues formal ruling, triggers double-entry ledger transfers, updates contract lifecycle, and emits audit event.

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
