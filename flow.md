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

## 3. Modified Scope (Phase 6: Contracts, Two-Party Scope Acceptance & Milestone Execution)
* Implemented `src/db/schema/contracts.ts`:
  - `contracts`: Tracks two-party contracts, `totalAmount`, `termsVersion`, `confidentialityAccepted`, `ipClauseAccepted`, `maxRevisionsPerMilestone`, and status (`scope_pending`, `funded`, `in_progress`, `completed`, `cancelled`, `disputed`).
  - `contract_milestones`: Manages sequence order, criteria, amount, status (`locked`, `active`, `submitted`, `under_review`, `revision_requested`, `approved`, `paid`, `disputed`), and due dates.
  - `deliverable_submissions`: Multi-version deliverable history tracking `versionNumber`, notes, live URLs, repository URLs, and attachments.
  - `revision_requests`: Capped revision feedback loop recording reviewer ID, actionable feedback, and timestamps.
* Implemented `src/modules/contracts/`:
  - `contracts.schema.ts`: Zod validation for offer creation, scope acceptance (mandatory IP & confidentiality flags), deliverable submissions, and revision feedback.
  - `contracts.service.ts`: Complete contract state machine enforcing two-party scope signing, sequential milestone unlocking (milestone 1 -> milestone 2), revision capping (blocks revisions beyond `maxRevisionsPerMilestone`), deliverable versioning, and contract completion upon final milestone sign-off.
  - `contracts.routes.ts`: Registered endpoints under `/api/v1/contracts`:
    - `POST /create-offer`: Employer initiates contract offer from applicant proposal.
    - `POST /:id/accept-scope`: Student contractor accepts terms, confidentiality, and IP transfer clause.
    - `GET /`: User contract listing (student/employer).
    - `GET /:id`: Full contract dossier with timeline, milestones, submissions, and revisions.
    - `POST /:id/milestones/:milestoneId/submit`: Student delivers work with version tracking.
    - `POST /:id/milestones/:milestoneId/request-revision`: Employer requests revision within capped limits.
    - `POST /:id/milestones/:milestoneId/approve`: Employer signs off deliverable; activates next milestone or completes contract.

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
