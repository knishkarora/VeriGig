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

## 3. Modified Scope (Phase 9: Bilateral Reviews, Cryptographic Completion Proof & In-App Messaging)
* Implemented `src/db/schema/reviews.ts` & `src/db/schema/messaging.ts`:
  - `reviews`: Double-sided review gate tracking `contractId`, `reviewerId`, `revieweeId`, `rating`, `feedback`, `isPublic` (concealed until both submit).
  - `completion_records`: Cryptographic completion credentials with portable SHA-256 digests (`verificationHash`) generated from contract execution data.
  - `conversations`: Contextual multi-party chat sessions indexed by `contextType` (`gig`, `application`, `contract`) and `contextId`.
  - `messages`: Contextual message log tracking `hasSafetyWarning`, `safetyWarnings`, `readAt`, and attachments.
* Implemented `src/modules/reviews/`:
  - `reviews.schema.ts`: Zod schema validation for ratings (1-5), structured feedback, and certificate generation.
  - `reviews.service.ts`: Bilateral review concealment engine (reviews revealed only once both parties submit), automatic student rating re-aggregation, and SHA-256 certificate hashing with public verifiability.
  - `reviews.routes.ts`: Endpoints under `/api/v1/reviews` and public verify routes `/api/v1/verify/completion/:hash`.
* Implemented `src/modules/messaging/`:
  - `safety.service.ts`: Real-time heuristic policy scanner flagging off-platform contact sharing (phone, WhatsApp, Telegram), off-platform payment terms (UPI handles, direct transfers), email disclosures, and credentials.
  - `messaging.schema.ts`: Validation for starting contextual conversations and dispatching messages.
  - `messaging.service.ts`: Contextual conversation manager, safety warning evaluation with security audit logging, and message polling with automatic read receipt updating.
  - `messaging.routes.ts`: Registered endpoints under `/api/v1/messaging/conversations` for listing, creating, and retrieving messages.

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
