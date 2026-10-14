CREATE TYPE "public"."contract_milestone_status" AS ENUM('locked', 'active', 'submitted', 'under_review', 'revision_requested', 'approved', 'paid', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('scope_pending', 'funded', 'in_progress', 'completed', 'cancelled', 'disputed');--> statement-breakpoint
CREATE TABLE "contract_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"sequence_order" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"criteria" text,
	"amount" integer NOT NULL,
	"status" "contract_milestone_status" DEFAULT 'locked' NOT NULL,
	"due_date" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gig_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"employer_id" uuid NOT NULL,
	"total_amount" integer NOT NULL,
	"terms_version" varchar(50) DEFAULT '1.0' NOT NULL,
	"confidentiality_accepted" boolean DEFAULT false NOT NULL,
	"ip_clause_accepted" boolean DEFAULT false NOT NULL,
	"max_revisions_per_milestone" integer DEFAULT 2 NOT NULL,
	"status" "contract_status" DEFAULT 'scope_pending' NOT NULL,
	"accepted_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deliverable_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"milestone_id" uuid NOT NULL,
	"version_number" integer DEFAULT 1 NOT NULL,
	"student_notes" text NOT NULL,
	"live_url" text,
	"repository_url" text,
	"file_references" text[] DEFAULT '{}' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revision_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"milestone_id" uuid NOT NULL,
	"requested_by" uuid,
	"feedback_text" text NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contract_milestones" ADD CONSTRAINT "contract_milestones_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_gig_id_gigs_id_fk" FOREIGN KEY ("gig_id") REFERENCES "public"."gigs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliverable_submissions" ADD CONSTRAINT "deliverable_submissions_milestone_id_contract_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."contract_milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_requests" ADD CONSTRAINT "revision_requests_milestone_id_contract_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."contract_milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_requests" ADD CONSTRAINT "revision_requests_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;