# Software Requirements Specification (SRS) — JamMakers

## Overview
- Purpose: Connect brands with manufacturers and stakeholders (creators, designers, finance) to manage RFQs, projects, messaging, training, resources, and AI support.
- Scope: React client + Express API; local dev uses in-memory storage with a future Postgres schema.
- Audience: Product, engineering, QA, and operations.

## System Context
- Client: React with `wouter` routing and TanStack Query; role-driven navigation.
- Server: Express API with local session auth (`passport-local`) and authorization middleware.
- Persistence: In-memory store in dev (`MemoryStorage` via `storage.ts`); `shared/schema.ts` defines Postgres schema for DB mode.
- AI: Ollama-backed JamBot (`server/ai.ts`), exposed via `/api/chat`.
- Object Storage: Filesystem-backed with simple ACL for public/private objects.

## Roles
- Roles: `brand`, `manufacturer`, `admin`, `creator`, `designer` (schema also includes `service_provider`, `financial_institution`).

## Assumptions
- Local login accepts any credentials; role selected at sign-in.
- In-memory persistence; data resets on server restart in dev.
- Files stored locally; no external object storage.
- AI model configured via environment variables.

## Constraints
- Dev server on port `5000`.
- Requires `SESSION_SECRET`; optional `DATABASE_URL` for DB mode.
- Cookies `httpOnly`; `secure=false` in dev.
- Production auth, backups, and external services are out of scope.

## Functional Requirements
- Authentication/Authorization: Local login (`POST /api/login`), current user (`GET /api/auth/user`), logout; role checks and ownership enforced via middleware.
- Profiles: Fetch manufacturer/brand profiles; create and update manufacturer (`/api/manufacturers`) and brand (`/api/brands`).
- Directory: List and view manufacturers, brands, creators, designers (filters supported by storage methods).
- RFQs: Brand creates, lists, updates RFQs; manufacturers submit responses.
- Projects: Create, update, list projects scoped by user role; manage project materials (add, update, cost).
- Messaging: Send messages and mark read; list conversations.
- Reviews: Create reviews; manufacturers respond with ownership enforcement.
- Verification: Submit requests; admin approves/rejects; list pending.
- Financing: Create leads and loan applications; manage institutions and loan products.
- Resources/Notifications: List resources, track views/downloads; user notifications create/list/read.
- Object Storage: Generate upload URL, upload binaries, download public/private objects with ACL checks.
- AI Chatbot: Chat with JamBot via `/api/chat` (non-stream and stream supported).
- LMS: List courses and details; enroll users; track lesson completion and progress.

## UI Flows
- Landing & Login: Role-selectable local login (`LoginForm`) transitions to authenticated routes.
- Navigation: Role-aware sidebar/top nav; common tasks shown in `Home`.
- RFQs/Projects: Create RFQs/projects, view lists and details, submit responses.
- Messaging/Training/Finance: Conversation threads; courses; finance directory and lender details.
- AI Support: JamBot widget accessible across app.

## Data Model (Schema Highlights)
- Core: `users`, `manufacturers`, `brands`, `projects`, `rfqs`, `rfq_responses`, `messages`, `reviews`, `certifications`, `portfolio_items`, `verification_requests`.
- Finance: `financial_institutions`, `loan_products`, `loan_applications`, `financing_leads`.
- Resources/Notifications: `resources`, `notifications`.
- LMS: `courses`, `course_modules`, `course_lessons`, `user_course_enrollments`, `user_lesson_progress`.
- Enums: `user_role`, `project_status`, `rfq_status`, `message_status`, `verification_status`, `lead_status`, `loan_application_status`, `certification_type`.

## Security
- Sessions: HTTP-only cookies; `SESSION_SECRET` required; dev-only `secure=false`.
- ACL: Public/private visibility with `allowedUsers` for private objects.
- AuthZ: Role and ownership checks server-side for sensitive actions.
- Validation: Zod insert/update schemas applied in routes.

## Performance
- CRUD endpoints respond within reasonable dev latency; AI supports streaming to reduce perceived wait times.

## Maintainability
- Storage interface separates persistence; Postgres schema enables DB migration without changing call sites.

## Observability
- API request logging includes method, path, status, duration, and truncated response body.

## Deployment & Environment
- Dev: Express with Vite HMR serving client; env vars: `SESSION_SECRET`, optional `DATABASE_URL`, `OLLAMA_BASE_URL`, `OLLAMA_MODEL`.
- Port: `5000`.

## Acceptance Criteria
- Login shows authenticated routes; `GET /api/auth/user` returns user.
- RFQ and project workflows function end-to-end for brand/manufacturer.
- Messaging works (send/mark read); reviews and responses enforce ownership.
- Object uploads/downloads honor ACL; JamBot returns responses; LMS enrollment/progress updates.

## Out of Scope (Current)
- Production-grade auth (OAuth/OIDC, MFA), payments, external storage, email/push delivery.

## Future Enhancements
- Switch to Postgres (Drizzle + Neon) using `db.ts`.
- External object storage and signed URLs; richer RBAC and audit logs.
- Email/push notifications via provider; advanced search across directories and RFQs.