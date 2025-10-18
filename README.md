# Jamakers

Software Requirements Specification (SRS)
JamMakers Platform - Version 1.0
Manufacturing Marketplace & Collaboration Platform

Table of Contents

Document Information
Introduction
Overall Description
System Architecture
Functional Requirements
Non-Functional Requirements
Data Requirements
External Interface Requirements
Security Requirements
Performance Requirements
Quality Attributes
Deployment & Environment
Constraints & Assumptions
Appendices


1. Document Information
1.1 Document Version

Version: 1.0
Date: January 2025
Status: Draft
Authors: Development Team

1.2 Document Purpose
This Software Requirements Specification (SRS) provides a comprehensive description of the JamMakers platform, a B2B marketplace connecting Jamaican brands with manufacturers and service providers. It serves as the primary reference for development, testing, and project management teams.
1.3 Scope
This document covers the complete specification for JamMakers v1.0, including:

Web-based client application
RESTful API backend
Database schema and data persistence
Integration with AI services
User authentication and authorization
File storage and management

1.4 References

Product Requirements Document (PRD): docs/PRD.md
API Documentation: docs/SRS-API-Appendix.md
Database Schema: shared/schema.ts
Deployment Guide: docs/DEPLOYING_v0.3.0.md


2. Introduction
2.1 Purpose
JamMakers is a comprehensive B2B platform designed to revolutionize Jamaica's manufacturing ecosystem by connecting brands with manufacturers, service providers, and financial institutions. The platform streamlines the entire production lifecycle from initial RFQ to final delivery.
2.2 Product Vision
Transform Jamaica's manufacturing industry by creating a digital marketplace that:

Reduces time-to-market for new products
Improves sourcing quality through verification and reviews
Centralizes project collaboration and communication
Provides AI-powered assistance and training resources
Facilitates access to financing options

2.3 Intended Audience

Primary Users:

Brand owners and product managers
Manufacturers and production facilities
Creative service providers (designers, creators)
Financial institutions and lenders
Platform administrators


Technical Audience:

Development team
QA engineers
DevOps engineers
Product managers
System administrators



2.4 Product Scope
The platform encompasses:

User registration and profile management
RFQ creation and response management
Project tracking and collaboration
Real-time messaging and notifications
AI-powered chatbot assistance
Learning management system (LMS)
Financial services integration
Resource library and documentation


3. Overall Description
3.1 Product Perspective
JamMakers operates as a standalone web application with potential for future integrations:

Independent authentication system (with future OAuth/SSO capability)
Self-contained data storage
External AI service integration (Ollama)
Future payment gateway integration potential
Mobile-responsive design for cross-device access

3.2 Product Features
3.2.1 Core Marketplace Features

Manufacturer Directory: Searchable database with filtering by capabilities, location, and certifications
RFQ Management: Complete lifecycle from creation to award
Project Coordination: Real-time collaboration tools and material tracking
Messaging System: Thread-based communication with file attachments
Review System: Two-way feedback between brands and manufacturers

3.2.2 Support Features

AI Assistant (JamBot): Context-aware help and guidance
Training Platform: Structured courses with progress tracking
Resource Library: Downloadable templates and guides
Notification System: Real-time alerts for important events

3.2.3 Administrative Features

Verification Queue: Review and approve manufacturer credentials
User Management: Role assignment and access control
Content Moderation: Review flagged content
Analytics Dashboard: Platform usage metrics (future)

3.3 User Classes and Characteristics
3.3.1 Brand Representatives

Characteristics: Business owners, product managers, procurement officers
Technical Skill: Low to medium
Frequency of Use: Weekly to daily during active projects
Primary Goals: Find manufacturers, manage RFQs, track projects

3.3.2 Manufacturers

Characteristics: Factory owners, operations managers, sales representatives
Technical Skill: Low to medium
Frequency of Use: Daily
Primary Goals: Respond to RFQs, manage capacity, showcase capabilities

3.3.3 Service Providers

Characteristics: Designers, creators, consultants
Technical Skill: Medium
Frequency of Use: Weekly
Primary Goals: Offer services, collaborate on projects

3.3.4 Financial Institutions

Characteristics: Loan officers, credit analysts
Technical Skill: Medium
Frequency of Use: Weekly
Primary Goals: Provide financing options, process applications

3.3.5 Administrators

Characteristics: Platform operators, support staff
Technical Skill: High
Frequency of Use: Daily
Primary Goals: Maintain platform integrity, resolve issues

3.4 Operating Environment

Client Side:

Modern web browsers (Chrome, Firefox, Safari, Edge)
Responsive design for desktop and mobile devices
Minimum screen resolution: 1024x768


Server Side:

Node.js 20.x runtime
Express.js framework
PostgreSQL database (production)
Linux-based hosting environment



3.5 Design and Implementation Constraints

Must maintain compatibility with existing Jamaican business regulations
Currency support for both JMD and USD
Must accommodate limited internet connectivity scenarios
Data residency requirements for financial information
Accessibility compliance (WCAG 2.1 Level AA)


4. System Architecture
4.1 High-Level Architecture
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   React SPA with Wouter Router & TanStack Query      │  │
│  │   Tailwind CSS + Shadcn/ui + Reshaped Components     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Express.js REST API (Port 5000)               │  │
│  │        Passport.js Authentication                     │  │
│  │        Session Management                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    ▼                     ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Business Logic Layer   │  │    External Services     │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │  Storage Interface │  │  │  │   Ollama AI API    │  │
│  │  (Memory/Database) │  │  │  └────────────────────┘  │
│  └────────────────────┘  │  │  ┌────────────────────┐  │
│  ┌────────────────────┐  │  │  │   Object Storage   │  │
│  │   Authorization    │  │  │  │   (Filesystem)     │  │
│  │    Middleware      │  │  │  └────────────────────┘  │
│  └────────────────────┘  │  └──────────────────────────┘
└──────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Development: In-Memory Storage (MemoryStorage)     │  │
│  │   Production: PostgreSQL with Drizzle ORM            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
4.2 Component Architecture
4.2.1 Frontend Components

Authentication: LoginForm, AuthContext
Navigation: AppSidebar, TopNav
RFQ Management: RFQList, RFQDetail, CreateRFQ, RFQResponseForm
Project Management: ProjectDashboard, ProjectDetail, CreateProject
Messaging: MessageThread, ConversationList
Profiles: ManufacturerProfile, BrandProfile, ProfileEditor
Directory: ManufacturerDirectory, FilterPanel, SearchBar
AI Assistant: ChatbotWidget, MessageBubble
Training: CourseList, CourseDetail, LessonViewer
Common UI: Button, Card, Dialog, Form, Table (Shadcn/ui)

4.2.2 Backend Services

Authentication Service: User validation, session management
Authorization Service: Role-based access control, ownership verification
Storage Service: Abstract interface for data persistence
AI Service: Ollama integration for chatbot responses
Object Storage Service: File upload/download with ACL
Notification Service: Event-driven notification creation

4.3 Database Design
The system uses a PostgreSQL database with the following main entity groups:
4.3.1 Core Entities

Users and authentication
Manufacturers with capabilities and certifications
Brands with preferences
Projects with status tracking
RFQs and responses
Messages and conversations

4.3.2 Support Entities

Reviews and ratings
Verification requests
Notifications
Resources and downloads
Course enrollment and progress

4.3.3 Financial Entities

Financial institutions
Loan products and applications
Financing leads


5. Functional Requirements
5.1 Authentication & Authorization (FR-AUTH)
FR-AUTH-001: User Registration
Priority: High
Description: System shall allow new users to register with email and password
Acceptance Criteria:

Valid email format required
Password minimum 8 characters
Role selection during registration
Email verification (future)

FR-AUTH-002: User Login
Priority: High
Description: System shall authenticate users via email/password
Acceptance Criteria:

Session created upon successful login
Role-based redirect after login
Session timeout after inactivity
Remember me option

FR-AUTH-003: Role-Based Access Control
Priority: High
Description: System shall enforce role-based permissions
Acceptance Criteria:

Brands can create RFQs
Manufacturers can respond to RFQs
Admins can access verification queue
Role-specific navigation menus

5.2 Profile Management (FR-PROF)
FR-PROF-001: Manufacturer Profile Creation
Priority: High
Description: Manufacturers shall create detailed business profiles
Acceptance Criteria:

Business information capture
Capability selection (multi-select)
Capacity metrics input
Logo and cover image upload
Location and contact details

FR-PROF-002: Brand Profile Creation
Priority: High
Description: Brands shall create company profiles
Acceptance Criteria:

Company information
Industry selection
Preferred manufacturer criteria
Budget ranges
Contact information

FR-PROF-003: Profile Verification
Priority: Medium
Description: System shall support profile verification workflow
Acceptance Criteria:

Verification request submission
Document upload support
Admin review queue
Status notifications

5.3 RFQ Management (FR-RFQ)
FR-RFQ-001: RFQ Creation
Priority: High
Description: Brands shall create detailed RFQs
Acceptance Criteria:

Product specifications
Quantity requirements
Budget range
Delivery timeline
File attachments
Draft/publish states

FR-RFQ-002: RFQ Response
Priority: High
Description: Manufacturers shall submit responses to RFQs
Acceptance Criteria:

Pricing proposal
Production timeline
Capability confirmation
Additional notes
Sample attachments

FR-RFQ-003: RFQ Award
Priority: High
Description: Brands shall award RFQs to manufacturers
Acceptance Criteria:

Response comparison view
Award notification
Project creation trigger
Unsuccessful bidder notification

5.4 Project Management (FR-PROJ)
FR-PROJ-001: Project Creation
Priority: High
Description: System shall create projects from awarded RFQs
Acceptance Criteria:

Auto-populate from RFQ data
Status tracking
Timeline management
Team assignment

FR-PROJ-002: Material Management
Priority: Medium
Description: Projects shall track materials and costs
Acceptance Criteria:

Material list maintenance
Quantity tracking
Unit cost calculation
Total cost aggregation
Cost change history

FR-PROJ-003: Project Updates
Priority: Medium
Description: Users shall update project progress
Acceptance Criteria:

Status changes
Milestone tracking
File attachments
Update notifications

5.5 Messaging System (FR-MSG)
FR-MSG-001: Direct Messaging
Priority: High
Description: Users shall exchange messages
Acceptance Criteria:

Thread-based conversations
Real-time delivery
File attachments
Read receipts
Message history

FR-MSG-002: Notification System
Priority: Medium
Description: System shall notify users of important events
Acceptance Criteria:

In-app notifications
Email notifications (future)
Notification preferences
Mark as read functionality

5.6 AI Assistant (FR-AI)
FR-AI-001: Chatbot Interaction
Priority: Medium
Description: Users shall interact with AI assistant
Acceptance Criteria:

Natural language queries
Context-aware responses
Manufacturing domain knowledge
Conversation history
Streaming responses

5.7 Learning Management (FR-LMS)
FR-LMS-001: Course Enrollment
Priority: Low
Description: Users shall enroll in training courses
Acceptance Criteria:

Course catalog browsing
Self-enrollment
Progress tracking
Certificate generation

FR-LMS-002: Lesson Completion
Priority: Low
Description: Users shall complete course lessons
Acceptance Criteria:

Sequential lesson access
Progress saving
Completion marking
Achievement badges

5.8 Financial Services (FR-FIN)
FR-FIN-001: Loan Application
Priority: Low
Description: Users shall apply for financing
Acceptance Criteria:

Application form
Document upload
Status tracking
Lender communication


6. Non-Functional Requirements
6.1 Performance Requirements (NFR-PERF)
NFR-PERF-001: Page Load Time
Measurement: Page render time
Target:

Desktop: ≤ 2 seconds on broadband
Mobile: ≤ 3 seconds on 4G
Priority: High

NFR-PERF-002: API Response Time
Measurement: Server response time
Target:

CRUD operations: < 500ms
Search queries: < 1 second
AI responses: < 5 seconds average
Priority: High

NFR-PERF-003: Concurrent Users
Measurement: Simultaneous active sessions
Target: Support 1000+ concurrent users
Priority: Medium
6.2 Reliability Requirements (NFR-REL)
NFR-REL-001: System Availability
Measurement: Uptime percentage
Target: ≥ 99.5% monthly uptime
Priority: High
NFR-REL-002: Data Backup
Measurement: Recovery point objective
Target: Daily backups with < 24-hour data loss window
Priority: High
6.3 Usability Requirements (NFR-USE)
NFR-USE-001: Mobile Responsiveness
Measurement: Mobile compatibility
Target: Full functionality on devices ≥ 375px width
Priority: High
NFR-USE-002: Accessibility
Measurement: WCAG compliance
Target: WCAG 2.1 Level AA compliance
Priority: Medium
NFR-USE-003: Browser Compatibility
Measurement: Browser support
Target: Latest 2 versions of major browsers
Priority: High
6.4 Security Requirements (NFR-SEC)
NFR-SEC-001: Data Encryption
Measurement: Encryption standards
Target:

HTTPS/TLS 1.3 for transit
AES-256 for sensitive data at rest
Priority: High

NFR-SEC-002: Session Security
Measurement: Session management
Target:

HTTP-only cookies
Secure flag in production
Session timeout after 30 minutes inactivity
Priority: High

6.5 Scalability Requirements (NFR-SCAL)
NFR-SCAL-001: Database Scalability
Measurement: Database performance
Target: Support 100,000+ records per table
Priority: Medium
NFR-SCAL-002: Storage Scalability
Measurement: File storage capacity
Target: Support 10TB+ of file storage
Priority: Low

7. Data Requirements
7.1 Data Model Overview
The system employs a relational database model with the following key entities:
7.1.1 User Management
users
├── id (UUID, PK)
├── email (unique)
├── firstName
├── lastName
├── profileImageUrl
├── role (enum)
├── currency (JMD/USD)
└── timestamps
7.1.2 Business Entities
manufacturers
├── id (UUID, PK)
├── userId (FK → users)
├── businessName
├── businessRegistrationNumber
├── description
├── location
├── capacity metrics
├── capabilities (JSON)
├── industries (JSON)
├── verificationStatus
└── timestamps

brands
├── id (UUID, PK)
├── userId (FK → users)
├── companyName
├── industry
├── preferredCategories
├── budgetRange
└── timestamps
7.1.3 Transaction Entities
rfqs
├── id (UUID, PK)
├── brandId (FK → brands)
├── title
├── description
├── requirements
├── quantity
├── budget
├── deadline
├── status (enum)
└── timestamps

projects
├── id (UUID, PK)
├── rfqId (FK → rfqs)
├── brandId (FK → brands)
├── manufacturerId (FK → manufacturers)
├── status (enum)
├── timeline
└── timestamps
7.2 Data Retention Policies
Data TypeRetention PeriodNotesUser accountsIndefiniteUntil deletion requestRFQs2 yearsAfter closureProjects5 yearsFor audit trailMessages1 yearAfter last activityFiles6 monthsAfter project completionLogs90 daysSystem logs
7.3 Data Migration Requirements

Support for bulk import of manufacturer data
CSV/Excel import for product catalogs
API for third-party data synchronization
Incremental migration support


8. External Interface Requirements
8.1 User Interface Requirements
8.1.1 General UI Principles

Consistent navigation across all pages
Mobile-first responsive design
Dark/light theme support
Accessibility features (keyboard navigation, screen reader support)

8.1.2 Key UI Components

Navigation: Persistent sidebar for desktop, bottom navigation for mobile
Forms: Inline validation with clear error messages
Tables: Sortable, filterable data grids with pagination
Modals: Confirmation dialogs for destructive actions
Notifications: Toast messages for user feedback

8.2 API Interface Requirements
8.2.1 REST API Standards

RESTful URL patterns
JSON request/response format
Standard HTTP status codes
API versioning support (future)

8.2.2 Authentication API
POST /api/login
POST /api/logout
GET /api/auth/user
8.2.3 Resource APIs
GET/POST/PUT/DELETE /api/manufacturers
GET/POST/PUT/DELETE /api/brands
GET/POST /api/rfqs
GET/POST/PUT /api/projects
POST /api/messages
8.3 Hardware Interface Requirements

Standard web server hardware
Minimum 4GB RAM for application server
SSD storage for database
CDN for static assets (future)

8.4 Software Interface Requirements
8.4.1 Database Interface

PostgreSQL 14+ with Drizzle ORM
Connection pooling
Read replica support (future)

8.4.2 AI Service Interface

Ollama API for chatbot
Model: Configurable via environment
Timeout: 30 seconds
Retry policy: 3 attempts

8.4.3 Storage Interface

Local filesystem (development)
Cloud storage (production, future)
Max file size: 50MB
Supported formats: PDF, DOC, XLS, Images


9. Security Requirements
9.1 Authentication Security
9.1.1 Password Requirements

Minimum 8 characters
At least one uppercase letter
At least one number
Password strength indicator
Password reset via email

9.1.2 Session Management

Secure session cookies
Session invalidation on logout
Concurrent session limits
IP-based session validation (optional)

9.2 Authorization Security
9.2.1 Role-Based Access

Principle of least privilege
Role hierarchy enforcement
Dynamic permission checking
Audit trail for permission changes

9.2.2 Resource-Level Security

Ownership verification
Row-level security in database
API rate limiting
CORS configuration

9.3 Data Security
9.3.1 Data Protection

Encryption at rest for sensitive data
PII data masking in logs
Secure file upload scanning
SQL injection prevention

9.3.2 Privacy Compliance

GDPR compliance features
Data export functionality
Right to deletion support
Privacy policy acceptance tracking

9.4 Infrastructure Security
9.4.1 Network Security

HTTPS enforcement
Web Application Firewall (WAF)
DDoS protection
Security headers (CSP, HSTS)

9.4.2 Monitoring & Auditing

Security event logging
Failed login attempt tracking
Suspicious activity alerts
Regular security audits


10. Performance Requirements
10.1 Response Time Requirements
OperationTarget TimeMaximum TimePage Load2 seconds5 secondsAPI Call500ms2 secondsSearch Query1 second3 secondsFile Upload (10MB)10 seconds30 secondsReport Generation5 seconds15 seconds
10.2 Throughput Requirements
MetricTargetPeakConcurrent Users1,0005,000Requests/Second100500Database Queries/Second1,0005,000File Uploads/Hour100500
10.3 Resource Utilization
ResourceNormal LoadPeak LoadCPU Usage< 50%< 80%Memory Usage< 70%< 90%Disk I/O< 60%< 85%Network Bandwidth< 40%< 70%

11. Quality Attributes
11.1 Maintainability
11.1.1 Code Standards

TypeScript for type safety
ESLint configuration
Prettier formatting
Component documentation
Unit test coverage > 70%

11.1.2 Architecture Patterns

Separation of concerns
Dependency injection
Repository pattern for data access
Service layer abstraction

11.2 Testability
11.2.1 Testing Levels

Unit tests for utilities
Integration tests for APIs
E2E tests for critical paths
Performance testing
Security testing

11.2.2 Testing Tools

Jest for unit testing
Supertest for API testing
Playwright for E2E testing
K6 for load testing

11.3 Portability
11.3.1 Platform Independence

Docker containerization
Environment variable configuration
Database abstraction layer
Cloud-agnostic design

11.4 Extensibility
11.4.1 Plugin Architecture

Modular component design
Event-driven architecture
Webhook support
API extensibility


12. Deployment & Environment
12.1 Development Environment
12.1.1 Requirements

Node.js 20.x
PostgreSQL 14+ (optional)
Git for version control
VS Code or similar IDE

12.1.2 Configuration
envNODE_ENV=development
PORT=5000
SESSION_SECRET=dev-secret
DATABASE_URL=postgresql://... (optional)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
12.2 Staging Environment

Mirror of production
Separate database instance
Test data seeding
Performance monitoring

12.3 Production Environment
12.3.1 Infrastructure

Load-balanced application servers
PostgreSQL with replication
Redis for session storage
CDN for static assets

12.3.2 Deployment Process

CI/CD pipeline
Blue-green deployment
Database migration scripts
Rollback procedures

12.4 Monitoring & Logging
12.4.1 Application Monitoring

APM tools (New Relic/Datadog)
Error tracking (Sentry)
Custom metrics dashboard
Health check endpoints

12.4.2 Infrastructure Monitoring

Server metrics
Database performance
Network latency
Storage utilization


13. Constraints & Assumptions
13.1 Technical Constraints

Limited to web-based access (no native mobile apps in v1)
Single-region deployment initially
English language only in v1
Maximum file upload size of 50MB
Session-based authentication only

13.2 Business Constraints

Must comply with Jamaican business regulations
Support for JMD and USD currencies only
Limited to Jamaica-based manufacturers initially
No payment processing in v1
Manual verification process

13.3 Assumptions

Users have stable internet connectivity
Users have modern web browsers
Email is primary communication channel
Mobile devices have screens ≥ 375px width
AI model availability via Ollama

13.4 Dependencies

Ollama service for AI functionality
PostgreSQL database availability
Email service for notifications (future)
Cloud storage service (future)
Payment gateway integration (future)

