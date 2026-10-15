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

## 6. Modified Scope (Phase 10: Frontend Integration & Missing Flow Parity)
* **Unified API Client Layer (`frontend/src/api/`):**
  - `client.ts`: Normalized fetch client with `include` credentials for HTTP-only refresh cookies, automatic JSON serialization, and structured `ApiClientError` extraction.
  - `endpoints.ts`: Complete typed service mapping covering `authApi`, `profilesApi`, `verificationApi`, `gigsApi`, `applicationsApi`, `contractsApi`, `paymentsApi`, `disputesApi`, `reviewsApi`, and `messagingApi`.
* **Missing User-Facing Modals & Drawers (`frontend/src/components/`):**
  - `messaging/ChatModal.tsx`: Contextual real-time in-app conversation modal with zero-latency heuristic safety alerts for off-platform payment, phone, WhatsApp, or email sharing.
  - `contracts/ScopeAcceptanceModal.tsx`: Two-party binding scope agreement gate with mandatory confidentiality (NDA), IP assignment transfer, and capped revision acknowledgment.
  - `payments/PaymentEscrowModal.tsx`: Employer contract commitment modal into sandbox escrow with 0% pilot commission breakdown.
  - `payments/ContractReceiptModal.tsx`: Itemized transaction receipt displaying gross amount, platform fee waiver, net disbursement, and immutable ledger hash.
  - `disputes/RaiseDisputeDrawer.tsx`: Formal milestone dispute intake drawer supporting 6 reason categories, detailed narrative, and evidence link attachment.
  - `reviews/ReviewModal.tsx`: Double-sided blind review modal (1–5 stars, written feedback, skill endorsements) with mutual concealment notice.
  - `interviews/InterviewSchedulerModal.tsx`: Structured interview scheduler for candidate proposals.
  - `student/EditProfileDrawer.tsx`: Comprehensive student profile editor with skills management, portfolio links, and DPDPA 2023 consent/privacy controls.
* **Missing Standalone Pages (`frontend/src/pages/`):**
  - `employer/EmployerProfile.tsx`: Dedicated employer business profile at `/app/employer/profile` with GSTIN verification status, company overview, and 1-click rehire talent roster.
  - `shared/CompletionVerificationPage.tsx`: Public certificate verification page at `/verify/completion/:hash` rendering cryptographic SHA-256 seal, verified skills, and copyable proof URL.
* **Integrated Views:**
  - `App.tsx`: Registered routes for `/app/employer/profile` and `/verify/completion/:hash`.
  - `Navbar.tsx`: Integrated employer business profile navigation, global chat button, and `ChatModal`.
  - `GigApplicants.tsx`: Integrated explainable candidate fit breakdown pills, interview scheduler modal, chat modal, and payment escrow modal.
  - `StudentWorkspace.tsx`: Integrated scope acceptance gate, dispute escalation drawer, double-sided review modal, and chat modal.
  - `EmployerWorkspace.tsx`: Integrated contract settlement receipt, dispute escalation drawer, double-sided review modal, and chat modal.
  - `StudentProfile.tsx`: Integrated profile editing drawer and cryptographic completion certificates section.
  - `GigExplore.tsx`: Added quick-toggle filter pills for "Beginner-ready", "Verified SME only", and "Remote only".
  - `AdminDisputes.tsx` & `AdminVerifications.tsx`: Connected to backend dispute resolution and verification decision endpoints.

## 7. Modified Scope: Google OAuth Callback & Supabase URL Alignment
* **Execution Flow Trigger:** User clicks "Continue with Google" on `AuthPage.tsx`.
* **Execution Path:**
  1. `signInWithGoogle(role)` executes with dynamic `redirectTo` set to `${window.location.origin}/auth?provider=google&role=${role}`.
  2. Browser navigates to Google Accounts OAuth consent screen.
  3. Upon consent, Google redirects to Supabase Auth (`https://<project-ref>.supabase.co/auth/v1/callback`).
  4. Supabase validates the target URL against its **Site URL** and **Redirect URLs** whitelist:
     - *Issue identified:* Supabase defaulted to `http://localhost:3000` because `http://localhost:5173/**` was not configured in the Supabase Redirect URL allowlist, causing redirected tokens to land on a dead port 3000.
     - *Resolution:* Configured Supabase dashboard requirements and added in-app guidance modal detailing exact Site URL (`http://localhost:5173`) and Redirect URLs (`http://localhost:5173/**`, `http://localhost:5173/auth`).
  5. Browser returns to `AuthPage.tsx` with session tokens in URL hash (`#access_token=...`) and role parameter.
  6. `AuthPage.tsx` active `useEffect` listener detects the OAuth return via `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()`.
  7. Renders high-fidelity `isProcessingOAuth` loading view ("Authenticating with Google...").
  8. Synchronizes authenticated user into `MarketplaceContext` via `loginUser()`, storing active role and session tokens in `localStorage`.
  9. Cleanly strips token fragments from browser address bar via `window.history.replaceState`.
  10. Routes user smoothly to role-specific dashboard (`/app/student/dashboard` or `/app/employer/dashboard`).

