# [[Architecture]]

## System Overview
CampusGigs (VeriGig) is a localized micro-gig marketplace connecting college students with local SMEs and startups for milestone-backed, task-based projects.

## Visual Design System & Aesthetics (Refined from Reference Inpirations)
* **Design World:**
  - Soft, ethereal pastel canvas background (`#F5F2FD`).
  - Giant rounded white card containers (`rounded-[2.5rem]` to `rounded-[3.5rem] bg-white border border-[#EDE8FD] shadow-[0_20px_60px_-15px_rgba(112,80,200,0.08)]`).
  - Organic pastel lilac/pink winding wave ribbons across the hero with floating student/task thumbnail capsules (inspired by **Sense** reference).
  - High-visibility acid-lime accent pills (`#D4F851`) with enclosed arrow circle icons (`[Action ↗]`).
  - High-contrast jet-black cards (`#121214`) with pink doodle ribbon accents (`#FFA8D5`) paired with lifestyle photography (inspired by **Shinta** reference).
  - Signature editorial bubblegum pink footer canvas (`#FFA8D5`) with giant typographic brand mark and floating white newsletter card.
  - Dark, high-contrast typography (`#121214` headings, `#334155` body, `#64748B` muted) satisfying WCAG AAA standards.

## Frontend Directory Map
* `src/components/shared/`:
  - `Navbar.tsx`: Floating white pill navigation with instant role switcher and acid lime CTA.
  - `Footer.tsx`: Bubblegum pink editorial canvas with floating white newsletter card and pill navigation links.
  - `TrustBadge.tsx`: Institutional verification badge component (`Verified PCTE Student` / `Verified SME Partner`).
  - `NotificationDrawer.tsx`: Flyout drawer with event icons and mark-as-read controls.
* `src/pages/`:
  - `LandingPage.tsx`: Sense-inspired organic wave ribbon, floating student capsules, 4-track media cards, Shinta black card & pink doodle split section, and 3-pillar comparison matrix.
  - `AuthPage.tsx`: Role-based registration with document upload simulation and 1-click demo logins (`admin`/`admin`).
  - `student/`: `StudentDashboard`, `GigExplore`, `GigDetails`, `StudentWorkspace`, `StudentProfile`.
  - `employer/`: `EmployerDashboard`, `PostGigWizard`, `GigApplicants`, `EmployerWorkspace`.
  - `admin/`: `AdminVerifications`, `AdminDisputes`, `AdminAnalytics`.
* `src/context/`: `MarketplaceContext.tsx` reactive in-memory state.
* `src/data/`: `mockData.ts` localized seed data.
