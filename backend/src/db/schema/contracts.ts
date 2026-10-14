import { pgTable, uuid, text, timestamp, boolean, varchar, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { gigs } from './gigs.js';
import { applications } from './applications.js';

export const contractStatusEnum = pgEnum('contract_status', [
  'scope_pending',
  'funded',
  'in_progress',
  'completed',
  'cancelled',
  'disputed',
]);

export const contractMilestoneStatusEnum = pgEnum('contract_milestone_status', [
  'locked',
  'active',
  'submitted',
  'under_review',
  'revision_requested',
  'approved',
  'paid',
  'disputed',
]);

export const contracts = pgTable('contracts', {
  id: uuid('id').defaultRandom().primaryKey(),
  gigId: uuid('gig_id').references(() => gigs.id, { onDelete: 'cascade' }).notNull(),
  applicationId: uuid('application_id').references(() => applications.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  employerId: uuid('employer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  totalAmount: integer('total_amount').notNull(),
  termsVersion: varchar('terms_version', { length: 50 }).default('1.0').notNull(),
  confidentialityAccepted: boolean('confidentiality_accepted').default(false).notNull(),
  ipClauseAccepted: boolean('ip_clause_accepted').default(false).notNull(),
  maxRevisionsPerMilestone: integer('max_revisions_per_milestone').default(2).notNull(),
  status: contractStatusEnum('status').default('scope_pending').notNull(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const contractMilestones = pgTable('contract_milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  contractId: uuid('contract_id').references(() => contracts.id, { onDelete: 'cascade' }).notNull(),
  sequenceOrder: integer('sequence_order').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  criteria: text('criteria'),
  amount: integer('amount').notNull(),
  status: contractMilestoneStatusEnum('status').default('locked').notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const deliverableSubmissions = pgTable('deliverable_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  milestoneId: uuid('milestone_id').references(() => contractMilestones.id, { onDelete: 'cascade' }).notNull(),
  versionNumber: integer('version_number').default(1).notNull(),
  studentNotes: text('student_notes').notNull(),
  liveUrl: text('live_url'),
  repositoryUrl: text('repository_url'),
  fileReferences: text('file_references').array().default([]).notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
});

export const revisionRequests = pgTable('revision_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  milestoneId: uuid('milestone_id').references(() => contractMilestones.id, { onDelete: 'cascade' }).notNull(),
  requestedBy: uuid('requested_by').references(() => users.id, { onDelete: 'set null' }),
  feedbackText: text('feedback_text').notNull(),
  requestedAt: timestamp('requested_at', { withTimezone: true }).defaultNow().notNull(),
});
