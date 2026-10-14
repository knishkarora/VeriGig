import { pgTable, uuid, text, timestamp, varchar, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { contracts, contractMilestones } from './contracts.js';

export const disputeStatusEnum = pgEnum('dispute_status', [
  'open',
  'evidence_pending',
  'in_review',
  'resolved',
]);

export const disputeReasonCategoryEnum = pgEnum('dispute_reason_category', [
  'unresponsive_counterparty',
  'deliverable_quality',
  'scope_creep',
  'unreasonable_revisions',
  'unauthorized_work',
  'other',
]);

export const disputeResolutionTypeEnum = pgEnum('dispute_resolution_type', [
  'refund_employer',
  'payout_student',
  'split_settlement',
]);

export const disputes = pgTable('disputes', {
  id: uuid('id').defaultRandom().primaryKey(),
  contractId: uuid('contract_id').references(() => contracts.id, { onDelete: 'cascade' }).notNull(),
  milestoneId: uuid('milestone_id').references(() => contractMilestones.id, { onDelete: 'cascade' }).notNull(),
  initiatedBy: uuid('initiated_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  reasonCategory: disputeReasonCategoryEnum('reason_category').notNull(),
  explanation: text('explanation').notNull(),
  status: disputeStatusEnum('status').default('open').notNull(),
  resolutionType: disputeResolutionTypeEnum('resolution_type'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
});

export const disputeEvidence = pgTable('dispute_evidence', {
  id: uuid('id').defaultRandom().primaryKey(),
  disputeId: uuid('dispute_id').references(() => disputes.id, { onDelete: 'cascade' }).notNull(),
  uploadedBy: uuid('uploaded_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  note: text('note').notNull(),
  fileReference: text('file_reference'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
});

export const disputeDecisions = pgTable('dispute_decisions', {
  id: uuid('id').defaultRandom().primaryKey(),
  disputeId: uuid('dispute_id').references(() => disputes.id, { onDelete: 'cascade' }).notNull().unique(),
  adminId: uuid('admin_id').references(() => users.id, { onDelete: 'set null' }),
  formalRuling: text('formal_ruling').notNull(),
  payoutAmountStudent: integer('payout_amount_student').default(0).notNull(),
  refundAmountEmployer: integer('refund_amount_employer').default(0).notNull(),
  recordedAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
