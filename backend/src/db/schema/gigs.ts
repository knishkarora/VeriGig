import { pgTable, uuid, text, timestamp, boolean, varchar, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const gigCategoryEnum = pgEnum('gig_category', [
  'Web Dev',
  'UI/UX',
  'Graphic Design',
  'Content & Copy',
  'Social Media',
  'Data & Research',
]);

export const gigDurationEnum = pgEnum('gig_duration', [
  'Under 48 hrs',
  '1 week',
  '2 weeks',
  '1 month',
]);

export const locationScopeEnum = pgEnum('location_scope', [
  'Hyper-local (On-Campus)',
  'City-wide',
  'Remote',
]);

export const gigStatusEnum = pgEnum('gig_status', [
  'draft',
  'moderation_pending',
  'open',
  'offer_pending',
  'funded',
  'in_progress',
  'completed',
  'cancelled',
  'disputed',
]);

export const moderationStatusEnum = pgEnum('moderation_status', [
  'pending',
  'approved',
  'rejected',
]);

export const gigs = pgTable('gigs', {
  id: uuid('id').defaultRandom().primaryKey(),
  employerId: uuid('employer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  category: gigCategoryEnum('category').notNull(),
  description: text('description').notNull(),
  gigLevel: varchar('gig_level', { length: 50 }).default('beginner_ready').notNull(), // 'beginner_ready', 'intermediate', 'advanced'
  workMode: locationScopeEnum('work_mode').notNull(),
  city: varchar('city', { length: 100 }).default('Ludhiana').notNull(),
  state: varchar('state', { length: 100 }).default('Punjab').notNull(),
  campusProximity: varchar('campus_proximity', { length: 150 }),
  estimatedHours: integer('estimated_hours').notNull().default(15),
  totalBudget: integer('total_budget').notNull(), // Budget floor >= ₹1,500
  paymentType: varchar('payment_type', { length: 50 }).default('milestone').notNull(), // 'milestone', 'fixed'
  targetDuration: gigDurationEnum('target_duration').notNull(),
  maxRevisions: integer('max_revisions').default(2).notNull(), // Bound revision cycles
  status: gigStatusEnum('status').default('open').notNull(),
  moderationStatus: moderationStatusEnum('moderation_status').default('approved').notNull(),
  
  // Specific deliverables and required skills arrays
  expectedDeliverables: text('expected_deliverables').array().notNull().default([]),
  requiredSkills: text('required_skills').array().notNull().default([]),
  preferredColleges: text('preferred_colleges').array().notNull().default([]),

  hiredStudentId: uuid('hired_student_id').references(() => users.id, { onDelete: 'set null' }),
  deadline: timestamp('deadline', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const gigMilestones = pgTable('gig_milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  gigId: uuid('gig_id').references(() => gigs.id, { onDelete: 'cascade' }).notNull(),
  sequenceOrder: integer('sequence_order').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  deliverableCriteria: text('deliverable_criteria'),
  amount: integer('amount').notNull(),
  durationDays: integer('duration_days').default(7).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const gigPolicyFlags = pgTable('gig_policy_flags', {
  id: uuid('id').defaultRandom().primaryKey(),
  gigId: uuid('gig_id').references(() => gigs.id, { onDelete: 'cascade' }).notNull(),
  flagReason: text('flag_reason').notNull(),
  policyRule: varchar('policy_rule', { length: 100 }).notNull(), // e.g. 'anti_academic_dishonesty', 'budget_floor', 'hazardous_task'
  reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).default('flagged').notNull(), // 'flagged', 'resolved', 'banned'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
