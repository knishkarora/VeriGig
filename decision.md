# Architectural Decisions (decision.md)

## [2026-10-12] Decision: Proposed production-path backend baseline

* **Context & Scope:** The current React frontend demonstrates a complete student-to-SME marketplace journey with seeded, in-memory data. A judge-readiness implementation plan is needed to convert the workflow into a persistent, trustworthy product without misrepresenting simulated verification or payment actions as live operations.

* **Choice Made:** Propose a TypeScript Fastify API, PostgreSQL relational database, private object storage for documents/deliverables, provider-owned marketplace payment flow, and an event outbox for notifications. n8n remains limited to non-critical reminders, reporting, and CRM-style automation.

* **Rationale (Why over What):** TypeScript aligns server contracts with the existing React/TypeScript frontend. PostgreSQL supports transactional state transitions across contracts, milestones, payouts, and disputes. A payment provider, rather than an application-controlled balance, is necessary before making escrow-like claims. Critical domain state must remain inside the API/database transaction boundary rather than an automation workflow.

* **Tradeoffs Accepted:** The plan adds server, database, provider, security, and operational complexity versus the current demo. It deliberately defers opaque AI ranking, nationwide scale, and platform-held funds in exchange for auditable, explainable MVP behaviour.

* **Immutability Status:** Proposed for approval before implementation. No dependencies or live integrations have been added.

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
