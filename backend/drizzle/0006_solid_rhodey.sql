CREATE TYPE "public"."dispute_reason_category" AS ENUM('unresponsive_counterparty', 'deliverable_quality', 'scope_creep', 'unreasonable_revisions', 'unauthorized_work', 'other');--> statement-breakpoint
CREATE TYPE "public"."dispute_resolution_type" AS ENUM('refund_employer', 'payout_student', 'split_settlement');--> statement-breakpoint
CREATE TYPE "public"."dispute_status" AS ENUM('open', 'evidence_pending', 'in_review', 'resolved');--> statement-breakpoint
CREATE TABLE "dispute_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dispute_id" uuid NOT NULL,
	"admin_id" uuid,
	"formal_ruling" text NOT NULL,
	"payout_amount_student" integer DEFAULT 0 NOT NULL,
	"refund_amount_employer" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dispute_decisions_dispute_id_unique" UNIQUE("dispute_id")
);
--> statement-breakpoint
CREATE TABLE "dispute_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dispute_id" uuid NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"note" text NOT NULL,
	"file_reference" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"milestone_id" uuid NOT NULL,
	"initiated_by" uuid NOT NULL,
	"reason_category" "dispute_reason_category" NOT NULL,
	"explanation" text NOT NULL,
	"status" "dispute_status" DEFAULT 'open' NOT NULL,
	"resolution_type" "dispute_resolution_type",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "dispute_decisions" ADD CONSTRAINT "dispute_decisions_dispute_id_disputes_id_fk" FOREIGN KEY ("dispute_id") REFERENCES "public"."disputes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute_decisions" ADD CONSTRAINT "dispute_decisions_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute_evidence" ADD CONSTRAINT "dispute_evidence_dispute_id_disputes_id_fk" FOREIGN KEY ("dispute_id") REFERENCES "public"."disputes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute_evidence" ADD CONSTRAINT "dispute_evidence_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_milestone_id_contract_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."contract_milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_initiated_by_users_id_fk" FOREIGN KEY ("initiated_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;