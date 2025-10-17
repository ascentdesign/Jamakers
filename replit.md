# JamMakers - B2B Manufacturing Marketplace Platform

## Overview

JamMakers is a comprehensive B2B marketplace platform connecting Jamaican manufacturers and agro-processors with brands, entrepreneurs, and financial institutions. The platform facilitates secure RFQ (Request for Quotation) management, project tracking, manufacturer verification, and AI-powered assistance. Its core purpose is to streamline B2B interactions within the manufacturing sector, fostering economic growth and efficiency in Jamaica.

## User Preferences

- **Currency Support:** Multi-currency (JMD/USD) with CurrencySelector component
- **Authentication:** Supports Google/GitHub/X/Apple/Email via Replit Auth
- **File Storage:** ACL-based access control for protected uploads

## System Architecture

**UI/UX Decisions:**
The platform utilizes a modern design aesthetic with a "Green Sidebar Theme" (hue 145°) ensuring WCAG AA accessibility compliance. It integrates Reshaped UI for polished components and Shadcn UI (with Radix UI) for foundational elements, including professional skeleton loading states, smooth ScrollArea components, and informative Alert components for empty states. The design system incorporates Material Design 3 principles with a color palette inspired by Caribbean warmth (Deep Ocean Blue, Warm Caribbean Gold), and typography uses Poppins for headings and Inter for body text. Interactions feature subtle hover/active states and animations.

**Technical Implementations:**
- **Notification System:** Real-time notifications displayed in TopNav and a dedicated `/notifications` page with mark-as-read functionality and contextual deep-linking.
- **Manufacturer Directory:** Advanced search and filtering by industry, location, certifications, and capacity with client-side filtering. Individual manufacturer detail pages at `/directory/:id` display full business profiles with contact information, certifications, and capabilities.
- **User Profile Management:** Unified `/profile` page with role-based display for manufacturers (business info, certifications, portfolio, reviews, stats) and brands (company info, industry, location).
- **Landing Page & Home Dashboard:** Provide key platform information and personalized metrics/actions for authenticated users.
- **Resource Library:** Searchable and filterable collection of resources.
- **Learning Management System (LMS):** Complete training platform with `/training` page for course catalog and enrollments, `/training/:id` for course details with modules/lessons, progress tracking, lesson completion, and certificate issuance. Includes demo course "Manufacturing Best Practices for Caribbean Producers" with 3 modules and 9 lessons covering manufacturing excellence, process optimization, and safety.
- **Raw Materials Directory:** Comprehensive marketplace for raw materials and supplies with `/raw-materials` listing page featuring search and category filtering, material images, and `/raw-materials/:id` detail pages showing material images, specifications, and supplier listings with clickable links to supplier profiles. Manufacturers serve dual roles as suppliers, with supplier-specific pricing, minimum order quantities, and lead times. Includes 10 demo materials across categories (Agricultural Products, Spices, Oils & Fats, Packaging) with verified supplier relationships and stock images for visual representation.
- **Project Materials Management:** Full-featured system for adding raw materials to projects with automatic cost calculation. Features include `/projects/:id` detail pages with material management interface, supplier selection with auto-populated pricing, quantity-based cost calculation (quantity × unit price), real-time cost totals, and material removal capabilities. Costs are stored in cents and displayed in multi-currency format (JMD/USD).
- **Finance Directory:** Comprehensive financial services marketplace with `/finance` listing page featuring lender profiles, loan products with rates/terms/requirements, and `/finance/:id` detail pages. Includes loan application system with form validation, institution-based product filtering, and application tracking. Manufacturers and brands can discover financing options and apply for loans directly through the platform.
- **Creators Directory:** Professional directory for content creators and marketing specialists with `/creators` listing page featuring search, availability filtering, and creator cards displaying specialties, experience, and rates. Individual `/creators/:id` detail pages showcase portfolios, skills, content types, pricing (hourly/project), and contact information. Supports profiles for photographers, videographers, writers, social media managers, and brand strategists.
- **Designers Directory:** Professional directory for design professionals with `/designers` listing page featuring search, availability filtering, and designer cards displaying design specialties, experience, and rates. Individual `/designers/:id` detail pages showcase portfolios, software proficiency, design styles, certifications, pricing (hourly/project), and contact information. Supports profiles for graphic designers, packaging designers, UX/UI designers, and brand identity specialists.
- **Security Model:** Multi-tenant isolation, role-based access control (brand, manufacturer, service_provider, financial_institution, admin, creator, designer), Zod for request body validation, and an ACL system for file permissions.
- **Navigation:** Consistent sidebar navigation across roles with additions for "Directory", "Finance", "Projects", "Training", "Raw Materials", "Creators", and "Designers".

**System Design Choices:**
The system adheres to a robust backend architecture using Express.js with TypeScript, a PostgreSQL database managed by Drizzle ORM, and Replit Auth for OpenID Connect authentication. Frontend development is based on React with TypeScript, Wouter for routing, TanStack Query v5 for state management, and React Hook Form with Zod for form handling. The design prioritizes performance, security, and a rich user experience through component-based development and modern UI libraries. Multi-tenancy and strict ownership checks are fundamental to data integrity and user authorization.

## External Dependencies

- **Database:** PostgreSQL (Neon) via Drizzle ORM
- **Authentication:** Replit Auth (OpenID Connect)
- **Storage:** Google Cloud Storage via Replit Object Storage
- **AI:** OpenAI GPT-5 via Replit AI Integrations
- **Session Management:** `connect-pg-simple`
- **UI Libraries:** Shadcn UI, Radix UI, Reshaped UI
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query v5
- **Form Management & Validation:** React Hook Form, Zod