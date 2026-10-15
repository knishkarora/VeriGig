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
  1. `signInWithGoogle(role)` persists intended role to `localStorage` under `OAUTH_PENDING_ROLE_KEY` prior to redirection, ensuring zero loss of chosen role across the PKCE handshake.
  2. Browser navigates to Google Accounts OAuth consent screen with clean redirect URL (`${window.location.origin}/auth`).
  3. Upon consent, Google redirects to Supabase Auth (`https://<project-ref>.supabase.co/auth/v1/callback`), which redirects back to `${window.location.origin}/auth?code=...`.
  4. Single Authoritative Handler (`MarketplaceContext`):
     - Exclusively exchanges the single-use PKCE `code` for an active session via `supabase.auth.exchangeCodeForSession(window.location.href)`.
     - Passes the Supabase access token and pending first-time role to the Fastify Google continuation endpoint for verified account lookup/provisioning.
     - Commits only the backend-returned account profile to `localStorage` (`verigig_session_role` & `verigig_session_user`) and updates `currentRole` & `currentUser`.
     - Strips `?code=` from browser URL via `window.history.replaceState`.
  5. Reactive View Layer (`AuthPage`):
     - Displays sleek loading view while `isReturningFromOAuth` is active ("Authenticating with Google... Setting up your workspace").
     - Observes `currentRole` transitioning from `guest` to `student` or `employer`.
     - Immediately routes user to `/app/student/dashboard` or `/app/employer/dashboard` with zero duplicate token redemption conflicts.

## 8. Modified Scope: Unified Account Session and Empty-Profile Provisioning
* **Entry points:** Email registration/login (`POST /api/v1/auth/register`, `POST /api/v1/auth/login`) and Google return (`MarketplaceContext` -> `POST /api/v1/auth/google`).
* **Execution sequence:**
  1. Google returns a Supabase PKCE session to `/auth`; `MarketplaceContext` exchanges the callback code once.
  2. The context sends the Supabase access token and requested first-time role to `AuthService.loginWithGoogle`.
  3. The backend verifies the token against Supabase's `/auth/v1/user` endpoint, then looks up the VeriGig user by verified email.
  4. Existing accounts retain their stored role. New accounts receive an intentionally sparse role profile, with no fabricated education, business, skills, location, ratings, or avatar.
  5. The backend issues the same application JWT and refresh-token cookies used by password login. The frontend maps the returned profile record directly into its session and navigates by the persisted role.
* **Boundary safeguards:** The browser never trusts Google user metadata as a VeriGig role or profile record. Google avatar metadata is display-only for that active OAuth session; email registrations use initials until an avatar feature is explicitly added.

## 9. Modified Scope: Streamlined Registration, In-Profile Verification & Dynamic Gig Hydration
* **Streamlined Sign-Up Flow:**
  - `AuthPage.tsx` registration now captures only role, full name, email, password, and confirm password.
  - College details, university roll number, and student ID card file upload are completely decoupled from initial onboarding, eliminating verification disparity between Google OAuth and email/password accounts.
  - Successful registration immediately dispatches and saves application JWT tokens to both cookie and `localStorage` (`verigig_auth_token`), granting instant access to the application.
* **Unified Profile Verification & Editing (`EditProfileDrawer.tsx` & `StudentProfile.tsx`):**
  - Moved student college details, university roll number, and student ID card document upload into the student profile editor drawer.
  - Implemented an interactive graduation year slider spanning the 2000s series (2000–2035) with class badge readouts and instant selector.
  - Embedded a canonical, curated catalog of 90+ alphabetically organized technical and creative skills/tools (`PLATFORM_SKILLS` in `frontend/src/data/skills.ts`), blocking arbitrary inputs like "A B C".
  - Updated backend profile validation schema (`profiles.schema.ts`) and profile query service (`profiles.service.ts`) to permit graduation years across 2000–2035, auto-provision missing student profile records on request, and accept roll numbers.
  - Multi-part document upload via `verificationApi.submitRequest` allows both Google OAuth and email-authenticated students to submit ID cards for admin verification.
* **Defensive Dynamic Gig Page Hydration (`GigDetails.tsx` & `PostGigWizard.tsx`):**
  - Resolved blank page crashes on `/app/gig/:id` and `/gigs/:id` by adding asynchronous backend hydration (`gigsApi.getGigById(id)`) and defensive null-safety guards across all gig fields (`employerCompany`, `milestones`, `expectedDeliverables`, `requiredSkills`).
  - Updated `PostGigWizard.tsx` so MSME publishing triggers backend persistence, maps the returned backend database UUID, adds the gig to context, and navigates directly to the dedicated gig view.
