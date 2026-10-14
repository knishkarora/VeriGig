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

## 3. Modified Scope (Phase 5: Proposals, Candidate Pipeline & Explainable Matching)
* Implemented `src/db/schema/applications.ts`:
  - `applications`: Stores student proposal submissions, status transitions (`submitted`, `shortlisted`, `interviewed`, `rejected`, `hired`), deterministic `fitScore`, structured `fitBreakdown`, and human-readable `fitExplanation`.
  - `interviews`: Tracks scheduled interviews with datetime, instructions/meeting link, notes, and status.
* Implemented `src/modules/applications/`:
  - `matching.service.ts`: `CandidateFitEngine` calculating deterministic, explainable candidate suitability across 4 auditable dimensions: Skill Overlap (40%), Work Mode & Locality Compatibility (25%), Availability & Timeline Fit (20%), and Verified Track Record & Quality (15%).
  - `applications.schema.ts`: Zod validation for proposals (`coverNote`, `proposedTimeline`, `portfolioItems`, `termsAccepted`), candidate status updates, and interview scheduling.
  - `applications.service.ts`: Handlers enforcing student verification checks, duplicate proposal prevention, automatic fit scoring, candidate pipeline listing ordered by fit score, status management, and interview scheduling with immutable audit logging.
  - `applications.routes.ts`: Registered endpoints under `/api/v1/applications` with aliases in `gigs.routes.ts` and `app.ts`:
    - `POST /api/v1/gigs/:id/apply`: Authenticated verified student proposal submission.
    - `GET /api/v1/student/applications`: Authenticated student proposal tracking.
    - `GET /api/v1/gigs/:id/applications`: Authenticated employer applicant dossier ordered by fit score.
    - `GET /api/v1/applications/:id`: Application dossier view with explainable fit score breakdowns.
    - `PATCH /api/v1/applications/:id/status`: Employer shortlisting, rejection (with reason), and hiring.
    - `POST /api/v1/applications/:id/interview`: Employer interview scheduling.

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
