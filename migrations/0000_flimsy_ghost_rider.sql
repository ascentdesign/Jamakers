CREATE TYPE "public"."certification_type" AS ENUM('haccp', 'gmp', 'organic', 'iso', 'fda', 'other');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'in_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."loan_application_status" AS ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('sent', 'delivered', 'read');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'active', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."rfq_status" AS ENUM('draft', 'active', 'reviewing', 'awarded', 'closed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('brand', 'manufacturer', 'service_provider', 'financial_institution', 'creator', 'designer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "brands" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"description" text,
	"logo_url" varchar,
	"industry" varchar(100),
	"product_categories" jsonb DEFAULT '[]',
	"company_size" varchar(50),
	"annual_volume" varchar(50),
	"preferred_locations" jsonb DEFAULT '[]',
	"website" varchar(255),
	"phone" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_id" varchar NOT NULL,
	"certification_type" "certification_type" NOT NULL,
	"custom_type" varchar(100),
	"issuer" varchar(255) NOT NULL,
	"issue_date" timestamp,
	"expiry_date" timestamp,
	"document_url" varchar,
	"verification_status" "verification_status" DEFAULT 'pending',
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_certificates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"course_id" varchar NOT NULL,
	"certificate_url" varchar,
	"issued_at" timestamp DEFAULT now(),
	"credential_id" varchar,
	CONSTRAINT "course_certificates_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
CREATE TABLE "course_lessons" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text,
	"video_url" varchar,
	"duration" integer,
	"order_index" integer DEFAULT 0 NOT NULL,
	"resource_urls" jsonb DEFAULT '[]',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_modules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"level" varchar(50) DEFAULT 'beginner',
	"duration" integer,
	"thumbnail_url" varchar,
	"instructor_name" varchar(255),
	"instructor_bio" text,
	"is_published" boolean DEFAULT true,
	"enrollment_count" integer DEFAULT 0,
	"certificate_template" varchar,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "creators" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"tagline" varchar(255),
	"bio" text,
	"profile_image_url" varchar,
	"cover_image_url" varchar,
	"specialties" jsonb DEFAULT '[]',
	"skills" jsonb DEFAULT '[]',
	"content_types" jsonb DEFAULT '[]',
	"services_offered" jsonb DEFAULT '[]',
	"hourly_rate" numeric(10, 2),
	"project_rate" numeric(10, 2),
	"available_for_hire" boolean DEFAULT true,
	"portfolio_items" jsonb DEFAULT '[]',
	"years_experience" integer,
	"location" varchar(255),
	"website" varchar(255),
	"phone" varchar(50),
	"social_links" jsonb DEFAULT '{}',
	"average_rating" numeric(3, 2) DEFAULT '0',
	"total_reviews" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "designers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"tagline" varchar(255),
	"bio" text,
	"profile_image_url" varchar,
	"cover_image_url" varchar,
	"design_specialties" jsonb DEFAULT '[]',
	"software_proficiency" jsonb DEFAULT '[]',
	"design_styles" jsonb DEFAULT '[]',
	"services_offered" jsonb DEFAULT '[]',
	"hourly_rate" numeric(10, 2),
	"project_rate" numeric(10, 2),
	"available_for_hire" boolean DEFAULT true,
	"portfolio_items" jsonb DEFAULT '[]',
	"years_experience" integer,
	"certifications" jsonb DEFAULT '[]',
	"location" varchar(255),
	"website" varchar(255),
	"phone" varchar(50),
	"social_links" jsonb DEFAULT '{}',
	"average_rating" numeric(3, 2) DEFAULT '0',
	"total_reviews" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "financial_institutions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"institution_name" varchar(255) NOT NULL,
	"institution_type" varchar(100),
	"description" text,
	"logo_url" varchar,
	"location" varchar(255),
	"address" text,
	"loan_products" jsonb DEFAULT '[]',
	"min_loan_amount" numeric(15, 2),
	"max_loan_amount" numeric(15, 2),
	"website" varchar(255),
	"phone" varchar(50),
	"email" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "financing_leads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" varchar NOT NULL,
	"institution_id" varchar,
	"company_name" varchar(255) NOT NULL,
	"loan_amount" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"loan_purpose" text,
	"industry" varchar(100),
	"years_in_business" integer,
	"annual_revenue" numeric(15, 2),
	"credit_score" varchar(50),
	"status" "lead_status" DEFAULT 'new',
	"contacted_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "loan_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loan_product_id" varchar NOT NULL,
	"applicant_id" varchar NOT NULL,
	"business_id" varchar,
	"business_type" varchar(50),
	"requested_amount" numeric(15, 2) NOT NULL,
	"requested_term_months" integer NOT NULL,
	"purpose" text NOT NULL,
	"business_revenue" numeric(15, 2),
	"years_in_business" integer,
	"employee_count" integer,
	"collateral_description" text,
	"status" "loan_application_status" DEFAULT 'draft',
	"review_notes" text,
	"approved_amount" numeric(15, 2),
	"approved_rate" numeric(5, 2),
	"approved_term_months" integer,
	"documents" jsonb DEFAULT '[]',
	"submitted_at" timestamp,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "loan_products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lender_id" varchar NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"description" text,
	"loan_type" varchar(100),
	"min_amount" numeric(15, 2) NOT NULL,
	"max_amount" numeric(15, 2) NOT NULL,
	"interest_rate_min" numeric(5, 2),
	"interest_rate_max" numeric(5, 2),
	"term_months_min" integer,
	"term_months_max" integer,
	"currency" varchar(3) DEFAULT 'JMD',
	"requirements" jsonb DEFAULT '[]',
	"features" jsonb DEFAULT '[]',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "manufacturers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"business_registration_number" varchar(100),
	"description" text,
	"location" varchar(255),
	"address" text,
	"phone" varchar(50),
	"website" varchar(255),
	"logo_url" varchar,
	"cover_image_url" varchar,
	"daily_capacity" integer,
	"weekly_capacity" integer,
	"monthly_capacity" integer,
	"current_utilization" numeric(5, 2),
	"max_order_size" integer,
	"min_order_quantity" integer,
	"production_lines" integer,
	"workforce_size" integer,
	"shifts_per_day" integer,
	"industries" jsonb DEFAULT '[]',
	"capabilities" jsonb DEFAULT '[]',
	"equipment_specs" jsonb,
	"verification_status" "verification_status" DEFAULT 'pending',
	"verified_at" timestamp,
	"is_premium_verified" boolean DEFAULT false,
	"average_rating" numeric(3, 2) DEFAULT '0',
	"total_reviews" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" varchar NOT NULL,
	"recipient_id" varchar NOT NULL,
	"subject" varchar(255),
	"content" text NOT NULL,
	"thread_id" varchar,
	"status" "message_status" DEFAULT 'sent',
	"attachments" jsonb DEFAULT '[]',
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text,
	"action_url" varchar,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_id" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"images" jsonb DEFAULT '[]',
	"project_date" timestamp,
	"tags" jsonb DEFAULT '[]',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_materials" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"raw_material_id" varchar NOT NULL,
	"supplier_id" varchar,
	"quantity" integer NOT NULL,
	"unit_price" integer,
	"currency" varchar(3) DEFAULT 'JMD',
	"total_cost" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" varchar NOT NULL,
	"manufacturer_id" varchar,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"status" "project_status" DEFAULT 'draft',
	"budget" numeric(15, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"timeline" varchar(100),
	"start_date" timestamp,
	"expected_completion_date" timestamp,
	"actual_completion_date" timestamp,
	"requirements" jsonb,
	"milestones" jsonb DEFAULT '[]',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raw_material_suppliers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"raw_material_id" varchar NOT NULL,
	"manufacturer_id" varchar NOT NULL,
	"price_per_unit" integer,
	"currency" varchar(3) DEFAULT 'JMD',
	"minimum_order_quantity" integer,
	"lead_time_days" integer,
	"is_verified" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raw_materials" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"unit_of_measure" varchar(50),
	"specifications" text,
	"image_url" varchar,
	"minimum_order_quantity" integer,
	"average_price" integer,
	"currency" varchar(3) DEFAULT 'JMD',
	"supplier_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"description" text,
	"file_url" varchar,
	"file_type" varchar(50),
	"tags" jsonb DEFAULT '[]',
	"view_count" integer DEFAULT 0,
	"download_count" integer DEFAULT 0,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_id" varchar NOT NULL,
	"project_id" varchar,
	"reviewer_id" varchar NOT NULL,
	"rating" integer NOT NULL,
	"quality_rating" integer,
	"communication_rating" integer,
	"timeliness_rating" integer,
	"testimonial" text,
	"response" text,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rfq_responses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rfq_id" varchar NOT NULL,
	"manufacturer_id" varchar NOT NULL,
	"proposed_price" numeric(15, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"proposed_timeline" varchar(100),
	"message" text,
	"attachments" jsonb DEFAULT '[]',
	"is_awarded" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rfqs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100),
	"status" "rfq_status" DEFAULT 'draft',
	"budget" numeric(15, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"quantity" integer,
	"timeline" varchar(100),
	"requirements" jsonb,
	"target_manufacturers" jsonb DEFAULT '[]',
	"attachments" jsonb DEFAULT '[]',
	"response_count" integer DEFAULT 0,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_providers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"description" text,
	"service_types" jsonb DEFAULT '[]',
	"certifications" jsonb DEFAULT '[]',
	"website" varchar(255),
	"phone" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_course_enrollments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"course_id" varchar NOT NULL,
	"enrolled_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"progress_percentage" integer DEFAULT 0,
	"last_accessed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_lesson_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"lesson_id" varchar NOT NULL,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"time_spent" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" "user_role",
	"currency" varchar(3) DEFAULT 'USD',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_id" varchar NOT NULL,
	"request_type" varchar(50) NOT NULL,
	"status" "verification_status" DEFAULT 'pending',
	"documents" jsonb DEFAULT '[]',
	"notes" text,
	"reviewed_by" varchar,
	"reviewed_at" timestamp,
	"review_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_certificates" ADD CONSTRAINT "course_certificates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_certificates" ADD CONSTRAINT "course_certificates_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creators" ADD CONSTRAINT "creators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "designers" ADD CONSTRAINT "designers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_institutions" ADD CONSTRAINT "financial_institutions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financing_leads" ADD CONSTRAINT "financing_leads_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financing_leads" ADD CONSTRAINT "financing_leads_institution_id_financial_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."financial_institutions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_loan_product_id_loan_products_id_fk" FOREIGN KEY ("loan_product_id") REFERENCES "public"."loan_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_products" ADD CONSTRAINT "loan_products_lender_id_financial_institutions_id_fk" FOREIGN KEY ("lender_id") REFERENCES "public"."financial_institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturers" ADD CONSTRAINT "manufacturers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_materials" ADD CONSTRAINT "project_materials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_materials" ADD CONSTRAINT "project_materials_raw_material_id_raw_materials_id_fk" FOREIGN KEY ("raw_material_id") REFERENCES "public"."raw_materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_materials" ADD CONSTRAINT "project_materials_supplier_id_raw_material_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."raw_material_suppliers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_material_suppliers" ADD CONSTRAINT "raw_material_suppliers_raw_material_id_raw_materials_id_fk" FOREIGN KEY ("raw_material_id") REFERENCES "public"."raw_materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_material_suppliers" ADD CONSTRAINT "raw_material_suppliers_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rfq_responses" ADD CONSTRAINT "rfq_responses_rfq_id_rfqs_id_fk" FOREIGN KEY ("rfq_id") REFERENCES "public"."rfqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rfq_responses" ADD CONSTRAINT "rfq_responses_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course_enrollments" ADD CONSTRAINT "user_course_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course_enrollments" ADD CONSTRAINT "user_course_enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_lesson_id_course_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."course_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_brand_user" ON "brands" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_certification_manufacturer" ON "certifications" USING btree ("manufacturer_id");--> statement-breakpoint
CREATE INDEX "idx_certification_type" ON "certifications" USING btree ("certification_type");--> statement-breakpoint
CREATE INDEX "idx_certificate_user" ON "course_certificates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_certificate_course" ON "course_certificates" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "idx_lesson_module" ON "course_lessons" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "idx_module_course" ON "course_modules" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "idx_course_category" ON "courses" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_course_published" ON "courses" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_creator_user" ON "creators" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_creator_available" ON "creators" USING btree ("available_for_hire");--> statement-breakpoint
CREATE INDEX "idx_designer_user" ON "designers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_designer_available" ON "designers" USING btree ("available_for_hire");--> statement-breakpoint
CREATE INDEX "idx_financial_institution_user" ON "financial_institutions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_financing_lead_applicant" ON "financing_leads" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "idx_financing_lead_institution" ON "financing_leads" USING btree ("institution_id");--> statement-breakpoint
CREATE INDEX "idx_financing_lead_status" ON "financing_leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_loan_application_product" ON "loan_applications" USING btree ("loan_product_id");--> statement-breakpoint
CREATE INDEX "idx_loan_application_applicant" ON "loan_applications" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "idx_loan_application_status" ON "loan_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_loan_product_lender" ON "loan_products" USING btree ("lender_id");--> statement-breakpoint
CREATE INDEX "idx_loan_product_type" ON "loan_products" USING btree ("loan_type");--> statement-breakpoint
CREATE INDEX "idx_manufacturer_user" ON "manufacturers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_manufacturer_verification" ON "manufacturers" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "idx_manufacturer_location" ON "manufacturers" USING btree ("location");--> statement-breakpoint
CREATE INDEX "idx_message_sender" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_message_recipient" ON "messages" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "idx_message_thread" ON "messages" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "idx_notification_user" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_notification_read" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "idx_portfolio_manufacturer" ON "portfolio_items" USING btree ("manufacturer_id");--> statement-breakpoint
CREATE INDEX "idx_pm_project" ON "project_materials" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_pm_material" ON "project_materials" USING btree ("raw_material_id");--> statement-breakpoint
CREATE INDEX "idx_project_brand" ON "projects" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "idx_project_manufacturer" ON "projects" USING btree ("manufacturer_id");--> statement-breakpoint
CREATE INDEX "idx_project_status" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_rms_material" ON "raw_material_suppliers" USING btree ("raw_material_id");--> statement-breakpoint
CREATE INDEX "idx_rms_manufacturer" ON "raw_material_suppliers" USING btree ("manufacturer_id");--> statement-breakpoint
CREATE INDEX "idx_raw_material_category" ON "raw_materials" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_raw_material_name" ON "raw_materials" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_resource_category" ON "resources" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_review_manufacturer" ON "reviews" USING btree ("manufacturer_id");--> statement-breakpoint
CREATE INDEX "idx_review_project" ON "reviews" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_review_reviewer" ON "reviews" USING btree ("reviewer_id");--> statement-breakpoint
CREATE INDEX "idx_rfq_response_rfq" ON "rfq_responses" USING btree ("rfq_id");--> statement-breakpoint
CREATE INDEX "idx_rfq_response_manufacturer" ON "rfq_responses" USING btree ("manufacturer_id");--> statement-breakpoint
CREATE INDEX "idx_rfq_brand" ON "rfqs" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "idx_rfq_status" ON "rfqs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_service_provider_user" ON "service_providers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "idx_enrollment_user" ON "user_course_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_enrollment_course" ON "user_course_enrollments" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "idx_progress_user" ON "user_lesson_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_progress_lesson" ON "user_lesson_progress" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "idx_verification_manufacturer" ON "verification_requests" USING btree ("manufacturer_id");--> statement-breakpoint
CREATE INDEX "idx_verification_status" ON "verification_requests" USING btree ("status");