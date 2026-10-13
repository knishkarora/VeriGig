CREATE TYPE "public"."gig_category" AS ENUM('Web Dev', 'UI/UX', 'Graphic Design', 'Content & Copy', 'Social Media', 'Data & Research');--> statement-breakpoint
CREATE TYPE "public"."gig_duration" AS ENUM('Under 48 hrs', '1 week', '2 weeks', '1 month');--> statement-breakpoint
CREATE TYPE "public"."gig_status" AS ENUM('draft', 'moderation_pending', 'open', 'offer_pending', 'funded', 'in_progress', 'completed', 'cancelled', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."location_scope" AS ENUM('Hyper-local (On-Campus)', 'City-wide', 'Remote');--> statement-breakpoint
CREATE TYPE "public"."moderation_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "gig_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gig_id" uuid NOT NULL,
	"sequence_order" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"deliverable_criteria" text,
	"amount" integer NOT NULL,
	"duration_days" integer DEFAULT 7 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gig_policy_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gig_id" uuid NOT NULL,
	"flag_reason" text NOT NULL,
	"policy_rule" varchar(100) NOT NULL,
	"reviewed_by" uuid,
	"status" varchar(50) DEFAULT 'flagged' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gigs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employer_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" "gig_category" NOT NULL,
	"description" text NOT NULL,
	"gig_level" varchar(50) DEFAULT 'beginner_ready' NOT NULL,
	"work_mode" "location_scope" NOT NULL,
	"city" varchar(100) DEFAULT 'Ludhiana' NOT NULL,
	"state" varchar(100) DEFAULT 'Punjab' NOT NULL,
	"campus_proximity" varchar(150),
	"estimated_hours" integer DEFAULT 15 NOT NULL,
	"total_budget" integer NOT NULL,
	"payment_type" varchar(50) DEFAULT 'milestone' NOT NULL,
	"target_duration" "gig_duration" NOT NULL,
	"max_revisions" integer DEFAULT 2 NOT NULL,
	"status" "gig_status" DEFAULT 'open' NOT NULL,
	"moderation_status" "moderation_status" DEFAULT 'approved' NOT NULL,
	"expected_deliverables" text[] DEFAULT '{}' NOT NULL,
	"required_skills" text[] DEFAULT '{}' NOT NULL,
	"preferred_colleges" text[] DEFAULT '{}' NOT NULL,
	"hired_student_id" uuid,
	"deadline" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gig_milestones" ADD CONSTRAINT "gig_milestones_gig_id_gigs_id_fk" FOREIGN KEY ("gig_id") REFERENCES "public"."gigs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gig_policy_flags" ADD CONSTRAINT "gig_policy_flags_gig_id_gigs_id_fk" FOREIGN KEY ("gig_id") REFERENCES "public"."gigs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gig_policy_flags" ADD CONSTRAINT "gig_policy_flags_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gigs" ADD CONSTRAINT "gigs_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gigs" ADD CONSTRAINT "gigs_hired_student_id_users_id_fk" FOREIGN KEY ("hired_student_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;