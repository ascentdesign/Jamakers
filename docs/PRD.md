# Product Requirements Document (PRD) — JamMakers

## Vision
Connect brands with Jamaica’s manufacturers and service providers to move from idea to production faster — with RFQs, vetted partners, project coordination, training, and AI assistance.

## Goals
- Reduce time-to-first RFQ response and time-to-project start.
- Improve sourcing quality via verification, reviews, and certifications.
- Centralize collaboration: messaging, materials, documents, and notifications.
- Upskill users with an LMS and 24/7 AI guidance (JamBot).

## Non-Goals (v1)
- Payments/escrow, advanced logistics, external CRM integration.
- Mobile apps; real-time video calling; SSO/OAuth providers.

## Users & Personas
- Brand Owner: creates RFQs, selects manufacturers, coordinates projects.
- Manufacturer Ops: responds to RFQs, updates capacities, certifications, portfolio.
- Admin: verification queue, moderation, audit.
- Creator/Designer: listed for creative services; discoverable by brands.
- Finance: lender profiles and lead intake.

## Key Features & User Stories
- Authentication & Roles
  - As a user, I can log in and be assigned a role to access role-specific features.
- Profiles (Brand/Manufacturer)
  - As a brand, I create my company profile with industry, logo, preferences.
  - As a manufacturer, I publish capabilities, capacities, certifications, portfolio, reviews.
- Directory & Discovery
  - As a brand, I filter manufacturers by capabilities, location, verification, rating.
- RFQs & Responses
  - As a brand, I create RFQs with budget, quantity, requirements, attachments.
  - As a manufacturer, I submit responses with pricing, timeline, and message.
- Projects & Materials
  - As a brand, I track project status and materials (quantities, unit cost, total cost).
- Messaging
  - As any authenticated user, I chat within threads, send attachments, and mark read.
- Reviews, Certifications, Portfolio
  - As a brand, I leave reviews; manufacturers reply; manufacturers manage certifications and portfolio.
- Verification (Admin)
  - As an admin, I review pending verifications and approve/reject.
- Financing
  - As a user, I submit loan applications and view my application list.
- Resources & Notifications
  - As a user, I browse resources and receive system and workflow notifications.
- AI Chatbot (JamBot)
  - As a user, I ask manufacturing and compliance questions; get guided next steps.
- LMS (Training)
  - As a user, I browse courses, complete lessons, and track progress/certificates.
- Raw Materials & Suppliers
  - As a user, I view raw materials, details, and supplier lists.

## Functional Requirements (High Level)
- Role-aware navigation and route protection.
- RFQ lifecycle: draft → active → reviewing → awarded/closed.
- Manufacturer response capture and linkage to RFQ.
- Project updates and materials cost calculation.
- Messaging threads, read receipts, attachment handling.
- Review creation and manufacturer response; certification/portfolio creation.
- Verification queue access (admin), status changes.
- Course listing, detail, modules, lesson completion, user progress.
- Raw material catalog and supplier associations.

## Success Metrics & KPIs
- RFQ: median response time, response rate, award rate.
- Projects: time-to-start, on-time completion rate.
- Messaging: active threads per user, read rate.
- LMS: course completion rate, lesson completion latency.
- AI: session count, satisfaction rating, deflection of support queries.
- Directory: manufacturer profile completeness, search-to-contact conversion.

## Non-Functional Requirements
- Availability: `>= 99.5%` monthly uptime (prod).
- Performance: page load `<= 2s` desktop broadband, `<= 3s` mobile; message send/receive `<= 1s`; AI reply `<= 5s` avg.
- Security: session-based auth, role checks, ownership enforcement, input validation, secure file handling.
- Privacy: minimal PII, data retention policy for messages and uploads.

## Release Plan
- Phase 1 (MVP): auth/roles, profiles, directory, RFQs, responses, messaging, raw materials, basic LMS, notifications, uploads, JamBot basics.
- Phase 2: projects/materials cost, reviews/certifications/portfolio, verification admin, financing leads, expanded LMS, resource library.
- Phase 3: DB-backed persistence (Drizzle/Neon), advanced search/filtering, analytics dashboards, optional SSO.

## Dependencies
- Client: React, Wouter, React Query, Tailwind/Shadcn, Reshaped.
- Server: Express, Passport dev auth, Ollama for AI, Drizzle-ready schema.
- Storage: Neon/Postgres (prod), dev `MemoryStorage`; object uploads pathing.

## Risks & Mitigations
- Dev auth permissive → strengthen for prod with real auth provider.
- In-memory storage → migrate to Drizzle/Postgres before scale.
- AI accuracy → domain-tuned prompts; guardrails; human-in-the-loop for sensitive guidance.
- Verification backlog → staff/admin tooling; SLAs.

## Acceptance Criteria (Feature-Level)
- Authenticated users see gated routes; unauthenticated users see Landing.
- Brands can create RFQs and view own RFQ list; manufacturers see active RFQs and respond.
- Projects show materials and computed total cost; updates persist.
- Messaging supports threads, attachments, read receipts.
- LMS shows courses/modules; lesson completion updates progress.
- JamBot answers within target latency and handles invalid input gracefully.

## Traceability & References
- SRS: `docs/SRS.md`
- API & Routes: `docs/SRS-API-Appendix.md`