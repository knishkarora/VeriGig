# Execution Flow Map: Employer Verification, Pipeline & Workspace Resolution

## 1. Feature Context
- **Feature Target:** Employer Profile Customization, Credential Verification (GSTIN/Udyam/PAN/Aadhaar), Public Employer Profile Dossier, Dynamic Applicant Pipeline & Sanitized Employer Workspace.
- **Affected Roles:** `employer`, `student`, `admin`.

## 2. Execution Sequences

### Flow A: Employer Profile Customization & KYC Submission
```mermaid
sequenceDiagram
    autonumber
    actor Employer as SME Employer
    participant UI as EmployerProfile / EmployerDashboard
    participant Drawer as EditEmployerProfileDrawer
    participant Ctx as MarketplaceContext
    participant API as Fastify Backend (/api/v1/profiles, /api/v1/verifications)
    participant Admin as AdminVerifications Queue

    Employer->>UI: Clicks "Edit Profile" or "Verify Business Credentials"
    UI->>Drawer: Opens with current employer profile & KYC state
    Employer->>Drawer: Updates name, email, avatar, company, address, phone & KYC (GSTIN/Udyam/PAN/Aadhaar + doc)
    Drawer->>API: PUT /api/v1/profiles/employers/me (business profile)
    Drawer->>API: POST /api/v1/verifications/submit (FormData with document & credential)
    Drawer->>Ctx: updateCurrentUser(...) & submitVerificationRequest(...)
    Ctx->>UI: Status reflects "Verification Under Review"
    Admin->>Admin: Sees request in "SME Proofs" tab
    Admin->>Ctx: approveVerification(id)
    Ctx->>UI: Status updates to "Verified SME Partner"
```

### Flow B: Public Employer Profile Inspection by Student
```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Freelancer
    participant GigUI as GigDetails Page (/app/student/gig/:id)
    participant PubUI as PublicEmployerProfile (/employers/:id)
    participant Ctx as MarketplaceContext / Backend

    Student->>GigUI: Views micro-gig specifications
    Student->>GigUI: Clicks "About the Business" card
    GigUI->>PubUI: Navigates to /employers/:id
    PubUI->>Ctx: Resolves employer profile & active micro-gigs
    PubUI->>Student: Displays verified business dossier, bio, website, open gigs
    Note over PubUI,Student: Strictly minimises confidential KYC (phone, street address, GSTIN doc) per DPDPA 2023
```

### Flow C: Dynamic Applicant Pipeline Navigation
```mermaid
sequenceDiagram
    autonumber
    actor Employer as SME Employer
    participant Nav as Navbar ("Applicant Pipeline")
    participant AppPipe as GigApplicants (/app/employer/applicants)
    participant Ctx as MarketplaceContext

    Employer->>Nav: Clicks "Applicant Pipeline"
    Nav->>AppPipe: Routes to /app/employer/applicants (without hardcoded gig ID)
    AppPipe->>Ctx: Queries employer's own gigs (employerId === currentUser.id)
    alt Employer has no posted gigs
        AppPipe->>Employer: Renders "No Active Job Listings" with "Post New Micro-Gig" CTA
    else Employer has posted gigs
        AppPipe->>Employer: Renders gig selector tabs & candidate pool for selected gig
    end
```

### Flow D: Multi-Gig Sanitized Employer Workspace
```mermaid
sequenceDiagram
    autonumber
    actor Employer as SME Employer
    participant Nav as Navbar ("Workspace & Sign-Off")
    participant WS as EmployerWorkspace (/app/employer/workspace)
    participant Ctx as MarketplaceContext

    Employer->>Nav: Clicks "Workspace & Sign-Off"
    Nav->>WS: Routes to /app/employer/workspace
    WS->>Ctx: Scopes gigs to currentUser.id
    alt No gigs posted
        WS->>Employer: Displays "No Active Workspace" state
    else Gig has no hired student
        WS->>Employer: Displays "Candidate Hiring In Progress" pointing to Applicant Pipeline
    else Gig has active contract & hired student
        WS->>Employer: Renders inspection desk with actual student name, deliverables & escrow actions
    end
```

### Flow E: Cross-Route Guest Section Navigation & Notification Concealment
```mermaid
sequenceDiagram
    autonumber
    actor Guest as Unauthenticated Guest
    participant Nav as Navbar ("Why Us" / "Campus Network")
    participant Router as React Router DOM (App / ScrollToTop)
    participant Landing as LandingPage (/ #comparison / #colleges)

    alt Guest is on non-landing route (e.g. /app/student/explore)
        Guest->>Nav: Clicks "Why Us" or "Campus Network"
        Nav->>Router: navigate('/#comparison') or navigate('/#colleges')
        Router->>Landing: Mounts / route with location.hash
        Router->>Router: ScrollToTop detects hash & targetId
        Router->>Landing: element.scrollIntoView({ behavior: 'smooth' })
    else Guest is already on landing page (/)
        Guest->>Nav: Clicks "Why Us" or "Campus Network"
        Nav->>Landing: element.scrollIntoView({ behavior: 'smooth' })
        Nav->>Router: navigate('/#sectionId', { replace: true })
    end
    Note over Guest,Nav: When currentRole === 'guest', the Notification Bell and Drawer are strictly unmounted.
```

### Flow F: Weekly Drops Newsletter Subscription & Database Persistence
```mermaid
sequenceDiagram
    autonumber
    actor Visitor as Website Visitor (Student / SME / Guest)
    participant UI as Footer Newsletter Card
    participant Client as Frontend API Client (weeklyDropsApi)
    participant API as Fastify Backend (/api/v1/weekly-drops/subscribe)
    participant DB as Supabase PostgreSQL (weekly_drops table)

    Visitor->>UI: Enters email and clicks "Subscribe to Drops"
    UI->>UI: Disables submit button & activates Loader spinner
    UI->>Client: weeklyDropsApi.subscribe(cleanEmail, 'footer')
    Client->>API: POST /api/v1/weekly-drops/subscribe { email, source: 'footer' }
    API->>API: Validates email format & length via Zod
    API->>DB: SELECT * FROM weekly_drops WHERE email = $email
    alt Email already subscribed
        API->>DB: Updates status to 'active' & updatedAt timestamp if needed
        API->>Client: Returns 200 { success: true, message: 'You are already subscribed to Weekly Drops!', alreadySubscribed: true }
    else New subscriber
        API->>DB: INSERT INTO weekly_drops (email, source, status) VALUES ($email, 'footer', 'active')
        API->>Client: Returns 200 { success: true, message: 'Successfully subscribed to Weekly Drops!', subscriber: {...} }
    end
    Client->>UI: Updates feedbackMessage and sets subscribed=true
    UI->>Visitor: Renders green confirmation banner with dynamic welcome message
```

### Flow G: Student Proposal Submission, Session Persistence & Employer Pipeline Synchronization
```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Freelancer
    participant GigUI as GigDetails (/app/student/gig/:id)
    participant Client as Frontend API Client (applicationsApi)
    participant API as Fastify Backend (/api/v1/gigs/:id/apply)
    participant DB as Supabase PostgreSQL (applications & student_profiles)
    participant Ctx as MarketplaceContext (localStorage)
    participant ProfileUI as StudentProfile & StudentDashboard
    actor Employer as SME Employer
    participant EmpUI as GigApplicants (/app/employer/applicants)

    Student->>GigUI: Opens proposal drawer & enters cover note, bid amount, timeline, portfolio
    GigUI->>Client: applicationsApi.applyForGig(gig.id, { coverNote, proposedTimeline, bidAmount, portfolioItems, termsAccepted: true })
    Client->>API: POST /api/v1/gigs/:id/apply (with JWT bearer)
    API->>DB: Checks gig status='open', moderation='approved'
    API->>DB: Auto-provisions student profile if missing
    API->>API: Computes deterministic fit score & breakdown
    API->>DB: INSERT INTO applications (gig_id, student_id, cover_note, proposed_timeline, bid_amount, portfolio_items, fit_score, status='submitted')
    API-->>Client: Returns 201 { application, fitResult }
    Client-->>GigUI: Resolves application id (UUID)
    GigUI->>Ctx: submitProposal(gig.id, coverNote, bidAmount, deliveryDays, portfolioItems, application.id)
    Ctx->>Ctx: Updates in-memory proposals & commits to localStorage ('verigig_proposals')
    Ctx-->>ProfileUI: Dynamically displays submitted proposal under "My Submitted Proposals"
    
    Note over Student,ProfileUI: Student logs out and logs back in
    Student->>Ctx: Authentication sync trigger
    Ctx->>Client: applicationsApi.getStudentApplications()
    Client->>API: GET /api/v1/student/applications
    API->>DB: SELECT * FROM applications WHERE student_id = $userId
    DB-->>API: Returns list of student applications
    API-->>Client: { applications: [...] }
    Client-->>Ctx: Merges live backend applications with cached localStorage proposals
    Ctx-->>ProfileUI: Submitted proposals remain intact and visible across sessions

    Note over Employer,EmpUI: Employer logs in to inspect candidate proposals
    Employer->>EmpUI: Navigates to Applicant Pipeline (/app/employer/applicants)
    EmpUI->>Client: applicationsApi.getGigApplicants(gig.id)
    Client->>API: GET /api/v1/gigs/:id/applications
    API->>DB: SELECT * FROM applications WHERE gig_id = $gigId ORDER BY fit_score DESC
    DB-->>API: Returns applicant dossiers with student profile metadata
    API-->>Client: { candidates: [...] }
    Client-->>EmpUI: Merges database candidate dossiers with context proposals
    EmpUI-->>Employer: Renders student candidate card with exact bid, timeline, match score & dossier
```

## 3. Boundary Crossings & Safety Gates
1. **Confidentiality Gate (DPDPA 2023):** Physical business address and contact phone numbers are stored as internal KYC attributes and explicitly excluded from the public employer profile view.
2. **Gig Assignment Gate:** Workspaces no longer assume or inject static mock names (e.g. `Aarav Sharma`) when an employer has no hired candidate.
3. **Route Neutrality:** Navbar navigation paths for pipeline and workspace are decoupled from static seeded mock IDs.
4. **Guest Authentication & Navigation Isolation:** Inactive notification bells and empty drawer containers are prohibited for guests (`currentRole !== 'guest'`), and section anchor links gracefully transition cross-route to the landing page with sticky-header clearance (`scroll-mt-24`).
5. **Newsletter Deduplication & Sanitization Gate:** All newsletter submissions are normalized (trimmed, lowercased), schema-validated with strict regex email constraints, deduplicated against the unique constraint on `weekly_drops.email`, and protected by optimistic fallback handling during presentation modes.
6. **Proposal Persistence & Schema Safety Gate:** Proposal submissions strictly provide required `termsAccepted: true` and `bidAmount`, auto-prefix URLs, auto-provision student profiles if uninitialized, and commit proposals to both PostgreSQL and `localStorage` so proposals persist across session logouts and remain immediately visible in both student dashboards and employer pipeline dossiers.


