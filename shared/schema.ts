// JamMakers Platform - Complete Data Schema
// Reference: blueprint:javascript_database, blueprint:javascript_log_in_with_replit

import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// =============================================================================
// ENUMS
// =============================================================================

export const userRoleEnum = pgEnum('user_role', ['brand', 'manufacturer', 'service_provider', 'financial_institution', 'creator', 'designer', 'admin']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'approved', 'rejected']);
export const projectStatusEnum = pgEnum('project_status', ['draft', 'active', 'in_progress', 'completed', 'cancelled']);
export const rfqStatusEnum = pgEnum('rfq_status', ['draft', 'active', 'reviewing', 'awarded', 'closed']);
export const messageStatusEnum = pgEnum('message_status', ['sent', 'delivered', 'read']);
export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'qualified', 'in_review', 'approved', 'rejected']);
export const certificationTypeEnum = pgEnum('certification_type', ['haccp', 'gmp', 'organic', 'iso', 'fda', 'other']);
export const loanApplicationStatusEnum = pgEnum('loan_application_status', ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed']);

// =============================================================================
// SESSION & AUTH TABLES (Required for Replit Auth)
// =============================================================================

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// =============================================================================
// USER TABLES
// =============================================================================

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role"),
  currency: varchar("currency", { length: 3 }).default('USD'), // JMD or USD
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// MANUFACTURER TABLES
// =============================================================================

export const manufacturers = pgTable("manufacturers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  businessRegistrationNumber: varchar("business_registration_number", { length: 100 }),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 255 }),
  logoUrl: varchar("logo_url"),
  coverImageUrl: varchar("cover_image_url"),
  
  // Production capacity metrics
  dailyCapacity: integer("daily_capacity"),
  weeklyCapacity: integer("weekly_capacity"),
  monthlyCapacity: integer("monthly_capacity"),
  currentUtilization: decimal("current_utilization", { precision: 5, scale: 2 }), // percentage
  maxOrderSize: integer("max_order_size"),
  minOrderQuantity: integer("min_order_quantity"),
  productionLines: integer("production_lines"),
  workforceSize: integer("workforce_size"),
  shiftsPerDay: integer("shifts_per_day"),
  
  // Industries and capabilities (stored as JSON arrays)
  industries: jsonb("industries").$type<string[]>().default(sql`'[]'`),
  capabilities: jsonb("capabilities").$type<string[]>().default(sql`'[]'`),
  equipmentSpecs: jsonb("equipment_specs").$type<Record<string, any>>(),
  
  // Verification
  verificationStatus: verificationStatusEnum("verification_status").default('pending'),
  verifiedAt: timestamp("verified_at"),
  isPremiumVerified: boolean("is_premium_verified").default(false),
  
  // Ratings
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer("total_reviews").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_manufacturer_user").on(table.userId),
  index("idx_manufacturer_verification").on(table.verificationStatus),
  index("idx_manufacturer_location").on(table.location),
]);

// =============================================================================
// BRAND TABLES
// =============================================================================

export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  industry: varchar("industry", { length: 100 }),
  productCategories: jsonb("product_categories").$type<string[]>().default(sql`'[]'`),
  companySize: varchar("company_size", { length: 50 }), // e.g., "1-10", "11-50", "51-200"
  annualVolume: varchar("annual_volume", { length: 50 }), // e.g., "< $100K", "$100K-$1M"
  preferredLocations: jsonb("preferred_locations").$type<string[]>().default(sql`'[]'`),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_brand_user").on(table.userId),
]);

// =============================================================================
// SERVICE PROVIDER TABLES
// =============================================================================

export const serviceProviders = pgTable("service_providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  description: text("description"),
  serviceTypes: jsonb("service_types").$type<string[]>().default(sql`'[]'`), // e.g., design, consulting, logistics
  certifications: jsonb("certifications").$type<string[]>().default(sql`'[]'`),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_service_provider_user").on(table.userId),
]);

// =============================================================================
// CREATOR TABLES
// =============================================================================

export const creators = pgTable("creators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 255 }), // Short professional headline
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  coverImageUrl: varchar("cover_image_url"),
  
  // Specialties and skills
  specialties: jsonb("specialties").$type<string[]>().default(sql`'[]'`), // e.g., video production, copywriting, social media, branding
  skills: jsonb("skills").$type<string[]>().default(sql`'[]'`), // specific skills/tools
  contentTypes: jsonb("content_types").$type<string[]>().default(sql`'[]'`), // e.g., blog posts, videos, podcasts, graphics
  
  // Service information
  servicesOffered: jsonb("services_offered").$type<string[]>().default(sql`'[]'`),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  projectRate: decimal("project_rate", { precision: 10, scale: 2 }),
  availableForHire: boolean("available_for_hire").default(true),
  
  // Portfolio and experience
  portfolioItems: jsonb("portfolio_items").$type<Array<{
    id: string;
    title: string;
    description: string;
    type: string; // video, article, design, etc.
    url: string;
    thumbnailUrl?: string;
    completedAt: string;
  }>>().default(sql`'[]'`),
  yearsExperience: integer("years_experience"),
  
  // Contact and social
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  socialLinks: jsonb("social_links").$type<Record<string, string>>().default(sql`'{}'`), // { instagram: url, linkedin: url, etc. }
  
  // Ratings
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer("total_reviews").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_creator_user").on(table.userId),
  index("idx_creator_available").on(table.availableForHire),
]);

// =============================================================================
// DESIGNER TABLES
// =============================================================================

export const designers = pgTable("designers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 255 }), // Short professional headline
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  coverImageUrl: varchar("cover_image_url"),
  
  // Design specialties
  designSpecialties: jsonb("design_specialties").$type<string[]>().default(sql`'[]'`), // e.g., packaging, product, industrial, graphic, UX/UI
  softwareProficiency: jsonb("software_proficiency").$type<string[]>().default(sql`'[]'`), // e.g., Adobe Suite, Figma, SolidWorks, AutoCAD
  designStyles: jsonb("design_styles").$type<string[]>().default(sql`'[]'`), // e.g., minimalist, modern, vintage, eco-friendly
  
  // Service information
  servicesOffered: jsonb("services_offered").$type<string[]>().default(sql`'[]'`),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  projectRate: decimal("project_rate", { precision: 10, scale: 2 }),
  availableForHire: boolean("available_for_hire").default(true),
  
  // Portfolio and experience
  portfolioItems: jsonb("portfolio_items").$type<Array<{
    id: string;
    title: string;
    description: string;
    category: string; // packaging, product, branding, etc.
    imageUrl: string;
    thumbnails?: string[];
    clientName?: string;
    completedAt: string;
  }>>().default(sql`'[]'`),
  yearsExperience: integer("years_experience"),
  certifications: jsonb("certifications").$type<string[]>().default(sql`'[]'`),
  
  // Contact and social
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  socialLinks: jsonb("social_links").$type<Record<string, string>>().default(sql`'{}'`), // { behance: url, dribbble: url, linkedin: url, etc. }
  
  // Ratings
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer("total_reviews").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_designer_user").on(table.userId),
  index("idx_designer_available").on(table.availableForHire),
]);

// =============================================================================
// FINANCIAL INSTITUTION TABLES
// =============================================================================

export const financialInstitutions = pgTable("financial_institutions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  institutionName: varchar("institution_name", { length: 255 }).notNull(),
  institutionType: varchar("institution_type", { length: 100 }), // bank, credit union, microfinance
  description: text("description"),
  logoUrl: varchar("logo_url"),
  location: varchar("location", { length: 255 }),
  address: text("address"),
  loanProducts: jsonb("loan_products").$type<string[]>().default(sql`'[]'`),
  minLoanAmount: decimal("min_loan_amount", { precision: 15, scale: 2 }),
  maxLoanAmount: decimal("max_loan_amount", { precision: 15, scale: 2 }),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_financial_institution_user").on(table.userId),
]);

export const loanProducts = pgTable("loan_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lenderId: varchar("lender_id").notNull().references(() => financialInstitutions.id, { onDelete: 'cascade' }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  description: text("description"),
  loanType: varchar("loan_type", { length: 100 }), // e.g., "working capital", "equipment financing", "expansion loan"
  minAmount: decimal("min_amount", { precision: 15, scale: 2 }).notNull(),
  maxAmount: decimal("max_amount", { precision: 15, scale: 2 }).notNull(),
  interestRateMin: decimal("interest_rate_min", { precision: 5, scale: 2 }), // percentage
  interestRateMax: decimal("interest_rate_max", { precision: 5, scale: 2 }), // percentage
  termMonthsMin: integer("term_months_min"),
  termMonthsMax: integer("term_months_max"),
  currency: varchar("currency", { length: 3 }).default('JMD'),
  requirements: jsonb("requirements").$type<string[]>().default(sql`'[]'`),
  features: jsonb("features").$type<string[]>().default(sql`'[]'`),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_loan_product_lender").on(table.lenderId),
  index("idx_loan_product_type").on(table.loanType),
]);

export const loanApplications = pgTable("loan_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanProductId: varchar("loan_product_id").notNull().references(() => loanProducts.id, { onDelete: 'cascade' }),
  applicantId: varchar("applicant_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  businessId: varchar("business_id"), // Could be manufacturerId or brandId
  businessType: varchar("business_type", { length: 50 }), // 'manufacturer' or 'brand'
  requestedAmount: decimal("requested_amount", { precision: 15, scale: 2 }).notNull(),
  requestedTermMonths: integer("requested_term_months").notNull(),
  purpose: text("purpose").notNull(),
  businessRevenue: decimal("business_revenue", { precision: 15, scale: 2 }),
  yearsInBusiness: integer("years_in_business"),
  employeeCount: integer("employee_count"),
  collateralDescription: text("collateral_description"),
  status: loanApplicationStatusEnum("status").default('draft'),
  reviewNotes: text("review_notes"),
  approvedAmount: decimal("approved_amount", { precision: 15, scale: 2 }),
  approvedRate: decimal("approved_rate", { precision: 5, scale: 2 }),
  approvedTermMonths: integer("approved_term_months"),
  documents: jsonb("documents").$type<Array<{name: string, url: string, type: string}>>().default(sql`'[]'`),
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_loan_application_product").on(table.loanProductId),
  index("idx_loan_application_applicant").on(table.applicantId),
  index("idx_loan_application_status").on(table.status),
]);

// =============================================================================
// PROJECT & RFQ TABLES
// =============================================================================

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandId: varchar("brand_id").notNull().references(() => brands.id, { onDelete: 'cascade' }),
  manufacturerId: varchar("manufacturer_id").references(() => manufacturers.id, { onDelete: 'set null' }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  status: projectStatusEnum("status").default('draft'),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default('USD'),
  timeline: varchar("timeline", { length: 100 }), // e.g., "3 months"
  startDate: timestamp("start_date"),
  expectedCompletionDate: timestamp("expected_completion_date"),
  actualCompletionDate: timestamp("actual_completion_date"),
  requirements: jsonb("requirements").$type<Record<string, any>>(),
  milestones: jsonb("milestones").$type<Array<{id: string, title: string, completed: boolean, dueDate: string}>>().default(sql`'[]'`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_project_brand").on(table.brandId),
  index("idx_project_manufacturer").on(table.manufacturerId),
  index("idx_project_status").on(table.status),
]);

export const rfqs = pgTable("rfqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandId: varchar("brand_id").notNull().references(() => brands.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }),
  status: rfqStatusEnum("status").default('draft'),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default('USD'),
  quantity: integer("quantity"),
  timeline: varchar("timeline", { length: 100 }),
  requirements: jsonb("requirements").$type<Record<string, any>>(),
  targetManufacturers: jsonb("target_manufacturers").$type<string[]>().default(sql`'[]'`),
  attachments: jsonb("attachments").$type<Array<{name: string, url: string}>>().default(sql`'[]'`),
  responseCount: integer("response_count").default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_rfq_brand").on(table.brandId),
  index("idx_rfq_status").on(table.status),
]);

export const rfqResponses = pgTable("rfq_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfqId: varchar("rfq_id").notNull().references(() => rfqs.id, { onDelete: 'cascade' }),
  manufacturerId: varchar("manufacturer_id").notNull().references(() => manufacturers.id, { onDelete: 'cascade' }),
  proposedPrice: decimal("proposed_price", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default('USD'),
  proposedTimeline: varchar("proposed_timeline", { length: 100 }),
  message: text("message"),
  attachments: jsonb("attachments").$type<Array<{name: string, url: string}>>().default(sql`'[]'`),
  isAwarded: boolean("is_awarded").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_rfq_response_rfq").on(table.rfqId),
  index("idx_rfq_response_manufacturer").on(table.manufacturerId),
]);

// =============================================================================
// MESSAGING TABLES
// =============================================================================

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipientId: varchar("recipient_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  subject: varchar("subject", { length: 255 }),
  content: text("content").notNull(),
  threadId: varchar("thread_id"), // For grouping messages in conversations
  status: messageStatusEnum("status").default('sent'),
  attachments: jsonb("attachments").$type<Array<{name: string, url: string}>>().default(sql`'[]'`),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_message_sender").on(table.senderId),
  index("idx_message_recipient").on(table.recipientId),
  index("idx_message_thread").on(table.threadId),
]);

// =============================================================================
// REVIEW TABLES
// =============================================================================

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  manufacturerId: varchar("manufacturer_id").notNull().references(() => manufacturers.id, { onDelete: 'cascade' }),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'set null' }),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(), // 1-5
  qualityRating: integer("quality_rating"), // 1-5
  communicationRating: integer("communication_rating"), // 1-5
  timelinessRating: integer("timeliness_rating"), // 1-5
  testimonial: text("testimonial"),
  response: text("response"), // Manufacturer's response
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_review_manufacturer").on(table.manufacturerId),
  index("idx_review_project").on(table.projectId),
  index("idx_review_reviewer").on(table.reviewerId),
]);

// =============================================================================
// CERTIFICATION TABLES
// =============================================================================

export const certifications = pgTable("certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  manufacturerId: varchar("manufacturer_id").notNull().references(() => manufacturers.id, { onDelete: 'cascade' }),
  certificationType: certificationTypeEnum("certification_type").notNull(),
  customType: varchar("custom_type", { length: 100 }), // For "other" type
  issuer: varchar("issuer", { length: 255 }).notNull(),
  issueDate: timestamp("issue_date"),
  expiryDate: timestamp("expiry_date"),
  documentUrl: varchar("document_url"),
  verificationStatus: verificationStatusEnum("verification_status").default('pending'),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_certification_manufacturer").on(table.manufacturerId),
  index("idx_certification_type").on(table.certificationType),
]);

// =============================================================================
// PORTFOLIO TABLES
// =============================================================================

export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  manufacturerId: varchar("manufacturer_id").notNull().references(() => manufacturers.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  images: jsonb("images").$type<string[]>().default(sql`'[]'`),
  projectDate: timestamp("project_date"),
  tags: jsonb("tags").$type<string[]>().default(sql`'[]'`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_portfolio_manufacturer").on(table.manufacturerId),
]);

// =============================================================================
// VERIFICATION TABLES
// =============================================================================

export const verificationRequests = pgTable("verification_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  manufacturerId: varchar("manufacturer_id").notNull().references(() => manufacturers.id, { onDelete: 'cascade' }),
  requestType: varchar("request_type", { length: 50 }).notNull(), // 'manual' or 'premium'
  status: verificationStatusEnum("status").default('pending'),
  documents: jsonb("documents").$type<Array<{name: string, url: string}>>().default(sql`'[]'`),
  notes: text("notes"),
  reviewedBy: varchar("reviewed_by").references(() => users.id, { onDelete: 'set null' }),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_verification_manufacturer").on(table.manufacturerId),
  index("idx_verification_status").on(table.status),
]);

// =============================================================================
// FINANCING LEAD TABLES
// =============================================================================

export const financingLeads = pgTable("financing_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantId: varchar("applicant_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  institutionId: varchar("institution_id").references(() => financialInstitutions.id, { onDelete: 'set null' }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  loanAmount: decimal("loan_amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('USD'),
  loanPurpose: text("loan_purpose"),
  industry: varchar("industry", { length: 100 }),
  yearsInBusiness: integer("years_in_business"),
  annualRevenue: decimal("annual_revenue", { precision: 15, scale: 2 }),
  creditScore: varchar("credit_score", { length: 50 }),
  status: leadStatusEnum("status").default('new'),
  contactedAt: timestamp("contacted_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_financing_lead_applicant").on(table.applicantId),
  index("idx_financing_lead_institution").on(table.institutionId),
  index("idx_financing_lead_status").on(table.status),
]);

// =============================================================================
// RESOURCE TABLES
// =============================================================================

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // export_guides, certification_templates, costing_calculators
  description: text("description"),
  fileUrl: varchar("file_url"),
  fileType: varchar("file_type", { length: 50 }), // pdf, xlsx, docx
  tags: jsonb("tags").$type<string[]>().default(sql`'[]'`),
  viewCount: integer("view_count").default(0),
  downloadCount: integer("download_count").default(0),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_resource_category").on(table.category),
]);

// =============================================================================
// NOTIFICATION TABLES
// =============================================================================

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar("type", { length: 100 }).notNull(), // message, rfq_response, verification_update, etc.
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  actionUrl: varchar("action_url"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_notification_user").on(table.userId),
  index("idx_notification_read").on(table.isRead),
]);

// =============================================================================
// LMS (LEARNING MANAGEMENT SYSTEM) TABLES
// =============================================================================

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // manufacturing, export, compliance, quality_control
  level: varchar("level", { length: 50 }).default('beginner'), // beginner, intermediate, advanced
  duration: integer("duration"), // in minutes
  thumbnailUrl: varchar("thumbnail_url"),
  instructorName: varchar("instructor_name", { length: 255 }),
  instructorBio: text("instructor_bio"),
  isPublished: boolean("is_published").default(true),
  enrollmentCount: integer("enrollment_count").default(0),
  certificateTemplate: varchar("certificate_template"),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_course_category").on(table.category),
  index("idx_course_published").on(table.isPublished),
]);

export const courseModules = pgTable("course_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_module_course").on(table.courseId),
]);

export const courseLessons = pgTable("course_lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull().references(() => courseModules.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"), // Lesson content in markdown or HTML
  videoUrl: varchar("video_url"),
  duration: integer("duration"), // in minutes
  orderIndex: integer("order_index").notNull().default(0),
  resourceUrls: jsonb("resource_urls").$type<string[]>().default(sql`'[]'`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_lesson_module").on(table.moduleId),
]);

export const userCourseEnrollments = pgTable("user_course_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: varchar("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  progressPercentage: integer("progress_percentage").default(0),
  lastAccessedAt: timestamp("last_accessed_at"),
}, (table) => [
  index("idx_enrollment_user").on(table.userId),
  index("idx_enrollment_course").on(table.courseId),
]);

export const userLessonProgress = pgTable("user_lesson_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: varchar("lesson_id").notNull().references(() => courseLessons.id, { onDelete: 'cascade' }),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_progress_user").on(table.userId),
  index("idx_progress_lesson").on(table.lessonId),
]);

export const courseCertificates = pgTable("course_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: varchar("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  certificateUrl: varchar("certificate_url"),
  issuedAt: timestamp("issued_at").defaultNow(),
  credentialId: varchar("credential_id").unique(), // Unique verification ID
}, (table) => [
  index("idx_certificate_user").on(table.userId),
  index("idx_certificate_course").on(table.courseId),
]);

// =============================================================================
// RAW MATERIALS
// =============================================================================

export const rawMaterials = pgTable("raw_materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // e.g., 'spices', 'fruits', 'packaging', 'chemicals'
  unitOfMeasure: varchar("unit_of_measure", { length: 50 }), // e.g., 'kg', 'lbs', 'liters', 'units'
  specifications: text("specifications"), // Technical specifications
  imageUrl: varchar("image_url"),
  minimumOrderQuantity: integer("minimum_order_quantity"),
  averagePrice: integer("average_price"), // in cents
  currency: varchar("currency", { length: 3 }).default('JMD'),
  supplierCount: integer("supplier_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_raw_material_category").on(table.category),
  index("idx_raw_material_name").on(table.name),
]);

export const rawMaterialSuppliers = pgTable("raw_material_suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rawMaterialId: varchar("raw_material_id").notNull().references(() => rawMaterials.id, { onDelete: 'cascade' }),
  manufacturerId: varchar("manufacturer_id").notNull().references(() => manufacturers.id, { onDelete: 'cascade' }),
  pricePerUnit: integer("price_per_unit"), // in cents
  currency: varchar("currency", { length: 3 }).default('JMD'),
  minimumOrderQuantity: integer("minimum_order_quantity"),
  leadTimeDays: integer("lead_time_days"),
  isVerified: boolean("is_verified").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_rms_material").on(table.rawMaterialId),
  index("idx_rms_manufacturer").on(table.manufacturerId),
]);

export const projectMaterials = pgTable("project_materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  rawMaterialId: varchar("raw_material_id").notNull().references(() => rawMaterials.id, { onDelete: 'cascade' }),
  supplierId: varchar("supplier_id").references(() => rawMaterialSuppliers.id, { onDelete: 'set null' }), // Optional: specific supplier chosen
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price"), // in cents - price at time of adding
  currency: varchar("currency", { length: 3 }).default('JMD'),
  totalCost: integer("total_cost"), // quantity * unitPrice
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_pm_project").on(table.projectId),
  index("idx_pm_material").on(table.rawMaterialId),
]);

// =============================================================================
// RELATIONS
// =============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  manufacturer: one(manufacturers, {
    fields: [users.id],
    references: [manufacturers.userId],
  }),
  brand: one(brands, {
    fields: [users.id],
    references: [brands.userId],
  }),
  serviceProvider: one(serviceProviders, {
    fields: [users.id],
    references: [serviceProviders.userId],
  }),
  financialInstitution: one(financialInstitutions, {
    fields: [users.id],
    references: [financialInstitutions.userId],
  }),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'recipient' }),
  reviews: many(reviews),
  notifications: many(notifications),
}));

export const manufacturersRelations = relations(manufacturers, ({ one, many }) => ({
  user: one(users, {
    fields: [manufacturers.userId],
    references: [users.id],
  }),
  projects: many(projects),
  certifications: many(certifications),
  portfolioItems: many(portfolioItems),
  reviews: many(reviews),
  verificationRequests: many(verificationRequests),
  rfqResponses: many(rfqResponses),
}));

export const brandsRelations = relations(brands, ({ one, many }) => ({
  user: one(users, {
    fields: [brands.userId],
    references: [users.id],
  }),
  projects: many(projects),
  rfqs: many(rfqs),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  brand: one(brands, {
    fields: [projects.brandId],
    references: [brands.id],
  }),
  manufacturer: one(manufacturers, {
    fields: [projects.manufacturerId],
    references: [manufacturers.id],
  }),
}));

export const rfqsRelations = relations(rfqs, ({ one, many }) => ({
  brand: one(brands, {
    fields: [rfqs.brandId],
    references: [brands.id],
  }),
  responses: many(rfqResponses),
}));

export const rfqResponsesRelations = relations(rfqResponses, ({ one }) => ({
  rfq: one(rfqs, {
    fields: [rfqResponses.rfqId],
    references: [rfqs.id],
  }),
  manufacturer: one(manufacturers, {
    fields: [rfqResponses.manufacturerId],
    references: [manufacturers.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: 'recipient',
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  manufacturer: one(manufacturers, {
    fields: [reviews.manufacturerId],
    references: [manufacturers.id],
  }),
  project: one(projects, {
    fields: [reviews.projectId],
    references: [projects.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
}));

// =============================================================================
// INSERT SCHEMAS & TYPES
// =============================================================================

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
  currency: true,
});

export const insertManufacturerSchema = createInsertSchema(manufacturers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  verifiedAt: true,
  averageRating: true,
  totalReviews: true,
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRfqSchema = createInsertSchema(rfqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  responseCount: true,
});

export const insertRfqResponseSchema = createInsertSchema(rfqResponses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isAwarded: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  respondedAt: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  verifiedAt: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVerificationRequestSchema = createInsertSchema(verificationRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  reviewedBy: true,
  reviewedAt: true,
  reviewNotes: true,
});

export const insertFinancingLeadSchema = createInsertSchema(financingLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  contactedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  downloadCount: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  enrollmentCount: true,
});

export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseLessonSchema = createInsertSchema(courseLessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserCourseEnrollmentSchema = createInsertSchema(userCourseEnrollments).omit({
  id: true,
  enrolledAt: true,
  completedAt: true,
  lastAccessedAt: true,
});

export const insertUserLessonProgressSchema = createInsertSchema(userLessonProgress).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertCourseCertificateSchema = createInsertSchema(courseCertificates).omit({
  id: true,
  issuedAt: true,
});

export const insertRawMaterialSchema = createInsertSchema(rawMaterials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  supplierCount: true,
});

export const insertRawMaterialSupplierSchema = createInsertSchema(rawMaterialSuppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectMaterialSchema = createInsertSchema(projectMaterials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalCost: true, // Will be calculated automatically
});

// Update schemas - exclude sensitive fields that should never be user-modifiable
export const updateManufacturerSchema = insertManufacturerSchema.omit({
  userId: true,
  verificationStatus: true,
  isPremiumVerified: true,
});

export const updateBrandSchema = insertBrandSchema.omit({
  userId: true,
});

export const updateProjectSchema = insertProjectSchema.omit({
  brandId: true,
  manufacturerId: true,
});

export const updateRfqSchema = insertRfqSchema.omit({
  brandId: true,
});

// TypeScript types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertManufacturer = z.infer<typeof insertManufacturerSchema>;
export type Manufacturer = typeof manufacturers.$inferSelect;

export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

export type InsertServiceProvider = typeof serviceProviders.$inferInsert;
export type ServiceProvider = typeof serviceProviders.$inferSelect;

export type InsertCreator = typeof creators.$inferInsert;
export type Creator = typeof creators.$inferSelect;

export type InsertDesigner = typeof designers.$inferInsert;
export type Designer = typeof designers.$inferSelect;

export type InsertFinancialInstitution = typeof financialInstitutions.$inferInsert;
export type FinancialInstitution = typeof financialInstitutions.$inferSelect;

export type InsertLoanProduct = typeof loanProducts.$inferInsert;
export type LoanProduct = typeof loanProducts.$inferSelect;

export type InsertLoanApplication = typeof loanApplications.$inferInsert;
export type LoanApplication = typeof loanApplications.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertRfq = z.infer<typeof insertRfqSchema>;
export type Rfq = typeof rfqs.$inferSelect;

export type InsertRfqResponse = z.infer<typeof insertRfqResponseSchema>;
export type RfqResponse = typeof rfqResponses.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certifications.$inferSelect;

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export type InsertVerificationRequest = z.infer<typeof insertVerificationRequestSchema>;
export type VerificationRequest = typeof verificationRequests.$inferSelect;

export type InsertFinancingLead = z.infer<typeof insertFinancingLeadSchema>;
export type FinancingLead = typeof financingLeads.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;
export type CourseModule = typeof courseModules.$inferSelect;

export type InsertCourseLesson = z.infer<typeof insertCourseLessonSchema>;
export type CourseLesson = typeof courseLessons.$inferSelect;

export type InsertUserCourseEnrollment = z.infer<typeof insertUserCourseEnrollmentSchema>;
export type UserCourseEnrollment = typeof userCourseEnrollments.$inferSelect;

export type InsertUserLessonProgress = z.infer<typeof insertUserLessonProgressSchema>;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;

export type InsertCourseCertificate = z.infer<typeof insertCourseCertificateSchema>;
export type CourseCertificate = typeof courseCertificates.$inferSelect;

export type InsertRawMaterial = z.infer<typeof insertRawMaterialSchema>;
export type RawMaterial = typeof rawMaterials.$inferSelect;

export type InsertRawMaterialSupplier = z.infer<typeof insertRawMaterialSupplierSchema>;
export type RawMaterialSupplier = typeof rawMaterialSuppliers.$inferSelect;

export type InsertProjectMaterial = z.infer<typeof insertProjectMaterialSchema>;
export type ProjectMaterial = typeof projectMaterials.$inferSelect;
