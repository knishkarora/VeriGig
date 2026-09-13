# [[Architecture]]

## System Overview
CampusGigs (VeriGig) is a localized micro-gig marketplace connecting college students with local SMEs and startups for milestone-backed, task-based projects.

## Frontend Architecture
* **Directory Structure:**
  - `src/components/shared/`: Reusable primitives (`Navbar`, `Footer`, `TrustBadge`, `NotificationDrawer`, `Modal`, `StatCard`, `Badge`)
  - `src/pages/`:
    - `LandingPage.tsx`: High-conversion hero, trust comparison matrix, category filters, live micro-gig previews.
    - `AuthPage.tsx`: Role-based registration with ID upload dropzone and instant demo login (`admin`/`admin`, `student`, `employer`).
    - `student/`: `StudentDashboard`, `GigExplore`, `GigDetails`, `StudentWorkspace`, `StudentProfile`
    - `employer/`: `EmployerDashboard`, `PostGigWizard`, `GigApplicants`, `EmployerWorkspace`
    - `admin/`: `AdminVerifications`, `AdminDisputes`, `AdminAnalytics`
  - `src/context/`: `MarketplaceContext.tsx` managing users, gigs, proposals, milestones, verifications, disputes, and notifications.
  - `src/data/`: `mockData.ts` with rich Indian SME and tier-2/tier-3 campus seed datasets.
  - `src/types/`: `index.ts` data schemas.

## Design System
* **Aesthetic:** Utilitarian Elegance with Dark Mode styling:
  - Base: `#090D16`
  - Surface: `#111827` / `bg-slate-900/60 backdrop-blur-md border border-slate-800/80`
  - Accents: Electric Indigo (`#6366F1`), Trust Emerald (`#10B981`), Escalation Amber (`#F59E0B`)
  - Typography: Pure White `#F9FAFB` headings, Slate 300 `#D1D5DB` body.
  - Distinctive Shapes: Pill buttons with directional arrows (`↗`), pill badge tags, curved ribbons, and frosted glass cards.
