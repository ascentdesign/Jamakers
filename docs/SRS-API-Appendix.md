# JamMakers SRS — API & Routes Appendix

This appendix catalogs the server API endpoints, middleware guards, and client routes to complement the detailed SRS. It reflects the current in-memory storage implementation and role-based access controls.

## Server API Endpoints

- Auth
  - GET `/api/auth/user` — Get authenticated user; `isAuthenticated`
  - POST `/api/login` — Login (local dev via Passport)
  - POST `/api/logout` — Logout

- Profiles
  - GET `/api/profile/manufacturer` — Current user's manufacturer; `isAuthenticated`
  - GET `/api/profile/brand` — Current user's brand; `isAuthenticated`

- Manufacturers
  - GET `/api/manufacturers` — Search list (filters via query)
  - GET `/api/manufacturers/:id` — Detail
  - POST `/api/manufacturers` — Create; `isAuthenticated`
  - PUT `/api/manufacturers/:id` — Update; `isAuthenticated` + ownership
  - PATCH `/api/manufacturers/:id` — Update; `isAuthenticated` + ownership
  - GET `/api/manufacturers/:id/portfolio` — Portfolio items
  - GET `/api/manufacturers/:id/certifications` — Certifications
  - GET `/api/manufacturers/:id/reviews` — Reviews

- Brands
  - GET `/api/brands/:id` — Detail
  - POST `/api/brands` — Create; `isAuthenticated`
  - PUT `/api/brands/:id` — Update; `isAuthenticated` + ownership
  - PATCH `/api/brands/:id` — Update; `isAuthenticated` + ownership

- RFQs
  - GET `/api/rfqs` — Brand: own RFQs; Manufacturer: active RFQs; `isAuthenticated`
  - GET `/api/rfqs/:id` — Detail (public)
  - POST `/api/rfqs` — Create; `isAuthenticated` + `requireBrand`
  - POST `/api/rfqs/:id/responses` — Create response; `isAuthenticated` + `requireManufacturer`

- Projects
  - GET `/api/projects` — Brand: by brand; Manufacturer: by manufacturer; `isAuthenticated`
  - PUT `/api/projects/:id` — Update; `isAuthenticated` + brand ownership
  - PATCH `/api/projects/:id` — Update; `isAuthenticated` + brand ownership

- Messages
  - GET `/api/messages/threads` — Conversation threads for user; `isAuthenticated`
  - GET `/api/messages/:userId` — Messages with specific user; `isAuthenticated`
  - POST `/api/messages` — Send message; `isAuthenticated`
  - PUT `/api/messages/:id/read` — Mark as read; `isAuthenticated`

- Reviews
  - POST `/api/reviews` — Create review; `isAuthenticated`
  - PUT `/api/reviews/:id/response` — Manufacturer response; `isAuthenticated` + manufacturer ownership

- Certifications & Portfolio
  - POST `/api/certifications` — Create certification; `isAuthenticated` + `requireManufacturer`
  - POST `/api/portfolio` — Create portfolio item; `isAuthenticated` + `requireManufacturer`

- Verifications
  - GET `/api/verifications` — Pending verifications (admin view); `isAuthenticated`

- Finance
  - POST `/api/finance/loan-applications` — Create loan application; `isAuthenticated`
  - GET `/api/finance/loan-applications` — List current user's applications; `isAuthenticated`

- AI Chatbot
  - POST `/api/chat` — JamBot chat reply; `isAuthenticated`

- LMS
  - GET `/api/courses` — Courses (optional `category` filter)
  - GET `/api/courses/:id` — Course detail
  - GET `/api/courses/:id/modules` — Modules for a course
  - GET `/api/courses/:id/progress` — Progress for current user; `isAuthenticated`
  - POST `/api/lessons/:id/complete` — Mark lesson complete; `isAuthenticated`
  - GET `/api/enrollments` — User enrollments; `isAuthenticated`

- Raw Materials
  - GET `/api/raw-materials` — List (optional `category` filter)
  - GET `/api/raw-materials/:id` — Detail
  - GET `/api/raw-materials/:id/suppliers` — Suppliers for material

- Project Materials
  - GET `/api/projects/:id/materials` — Materials for project; `isAuthenticated`
  - POST `/api/projects/:id/materials` — Add material; `isAuthenticated`
  - PUT `/api/projects/:id/materials/:materialId` — Update material; `isAuthenticated`
  - DELETE `/api/projects/:id/materials/:materialId` — Remove material; `isAuthenticated`
  - GET `/api/projects/:id/materials/cost` — Total cost; `isAuthenticated`

- Object Storage
  - POST `/api/objects/uploads/:id` — Upload file; returns public `path` like `/objects/uploads/:id`

## Client Routes (Authenticated)

- `/` — Home
- `/manufacturers` — Directory
- `/directory/:id` — Manufacturer detail
- `/manufacturers/create` — Create manufacturer profile
- `/brands/create` — Create brand profile
- `/rfqs` — RFQ list
- `/rfqs/new` — Create RFQ
- `/rfqs/:id` — RFQ detail
- `/projects` — Project dashboard
- `/projects/new/:rfqId?` — Create project
- `/projects/:id` — Project detail
- `/training` — Courses
- `/training/:id` — Course detail
- `/raw-materials` — Raw materials
- `/raw-materials/:id` — Raw material detail
- `/finance` — Lenders directory
- `/finance/:id` — Lender detail
- `/creators` — Creators directory
- `/creators/:id` — Creator detail
- `/designers` — Designers directory
- `/designers/:id` — Designer detail
- `/messages` — Messaging
- `/notifications` — Notifications
- `/profile` — User profile
- `/resources` — Resources
- `/admin/verifications` — Admin verification queue

## Client Routes (Unauthenticated)

- `/` — Landing (includes login)

## Middleware Summary

- `isAuthenticated` — Requires valid session; attaches `req.user`
- `requireBrand` — Resolves brand from `req.user`; attaches `req.brand`
- `requireManufacturer` — Resolves manufacturer from `req.user`; attaches `req.manufacturer`
- `requireOwnership(fn)` — Checks resource owner matches current user