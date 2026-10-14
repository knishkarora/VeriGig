CREATE TYPE "public"."application_status" AS ENUM('submitted', 'shortlisted', 'interviewed', 'rejected', 'hired');--> statement-breakpoint
CREATE TYPE "public"."interview_status" AS ENUM('scheduled', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gig_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"cover_note" text NOT NULL,
	"proposed_timeline" varchar(100) NOT NULL,
	"bid_amount" integer,
	"portfolio_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "application_status" DEFAULT 'submitted' NOT NULL,
	"fit_score" integer DEFAULT 0 NOT NULL,
	"fit_breakdown" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"fit_explanation" text[] DEFAULT '{}' NOT NULL,
	"rejection_reason" text,
	"terms_accepted" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"meeting_link_or_instructions" text NOT NULL,
	"status" "interview_status" DEFAULT 'scheduled' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "interviews_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_gig_id_gigs_id_fk" FOREIGN KEY ("gig_id") REFERENCES "public"."gigs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;