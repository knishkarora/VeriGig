# Architectural Decisions (decision.md)

## 2026-09-13 Decision: Frontend Tech Stack and Reactive Client Architecture

* **Context & Scope:** 
  The project requires a localized Student-SME micro-gig marketplace frontend ("CampusGigs") showcasing complete role-based journeys (Student Freelancers, SME Employers, Admin Governance) with zero backend dependency for rapid stakeholder prototyping and presentation.

* **Choice Made:** 
  - **Framework & Build:** React 18 + Vite + TypeScript.
  - **Styling:** Tailwind CSS v3 with a custom dark theme design system (`#090D16` base, `#111827` frosted surfaces, `#6366F1` electric indigo, `#10B981` verified emerald, `#F59E0B` amber escalation).
  - **Navigation & Icons:** `react-router-dom` v6 and `lucide-react`.
  - **Interactive State Store:** Centralized React Context (`MarketplaceContext`) with TypeScript schemas and localized seed data (Indian Tier-2/Tier-3 college ecosystems and local businesses).

* **Rationale (Why over What):**
  - Vite + React TS provides instant HMR, high compilation speed, and strict type safety across complex gig and milestone states.
  - Tailwind CSS enables rapid implementation of utilitarian elegance, frosted glass cards (`backdrop-blur-md`), and pill-shaped badge UI derived from the design inspirations without heavy third-party UI framework lock-in.
  - A comprehensive in-memory reactive context enables full-cycle user testing (e.g. Employer posts gig -> Gig appears immediately in Student explorer -> Student applies -> Employer hires -> Student submits deliverable -> Employer signs off with milestone payout) completely offline without server prerequisites.

* **Tradeoffs Accepted:**
  - Mock state resets on browser hard-refresh (mitigated by pre-populating rich default mock datasets and syncing with `localStorage` where advantageous).
  - No live network requests or persistent backend databases in this iteration.

* **Immutability Status:** Settled & Immutable.
