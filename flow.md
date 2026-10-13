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

## 3. Modified Scope (Phase 2.1 Authentication & RBAC Engine)
* Implemented `src/modules/auth/`:
  - `auth.schema.ts`: Zod validation schemas for registration, login, and mandatory DPDPA consent.
  - `auth.service.ts`: Secure bcrypt hashing (cost 12), user creation, role profile provisioning (`student_profiles`, `business_profiles`), session token rotation, and immutable audit event emission.
  - `auth.routes.ts`: Fastify route handlers registered under `/api/v1/auth`:
    - `POST /register`: Registers user, creates profile, issues access JWT.
    - `POST /login`: Validates password, checks suspension, sets HTTP-only refresh cookie, issues access JWT.
    - `POST /refresh`: Rotates refresh token in database session, reissues access JWT.
    - `POST /logout`: Invalidates session in database, clears cookie.
    - `GET /me`: Validates JWT, returns user details and associated profile.

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
Route Resolver (/api/v1/auth/*)
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
