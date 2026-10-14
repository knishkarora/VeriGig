import { pgTable, uuid, text, timestamp, boolean, varchar, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { gigs } from './gigs.js';

export const applicationStatusEnum = pgEnum('application_status', [
  'submitted',
  'shortlisted',
  'interviewed',
  'rejected',
  'hired',
]);

export const interviewStatusEnum = pgEnum('interview_status', [
  'scheduled',
  'completed',
  'cancelled',
]);

export interface FitBreakdownItem {
  category: string;
  score: number;
  maxScore: number;
  detail: string;
}

export const applications = pgTable('applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  gigId: uuid('gig_id').references(() => gigs.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  coverNote: text('cover_note').notNull(),
  proposedTimeline: varchar('proposed_timeline', { length: 100 }).notNull(),
  bidAmount: integer('bid_amount'),
  portfolioItems: jsonb('portfolio_items').$type<{ label: string; url: string }[]>().default([]).notNull(),
  status: applicationStatusEnum('status').default('submitted').notNull(),
  
  // Explainable deterministic match scoring
  fitScore: integer('fit_score').default(0).notNull(), // 0 to 100
  fitBreakdown: jsonb('fit_breakdown').$type<FitBreakdownItem[]>().default([]).notNull(),
  fitExplanation: text('fit_explanation').array().default([]).notNull(),

  rejectionReason: text('rejection_reason'),
  termsAccepted: boolean('terms_accepted').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const interviews = pgTable('interviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicationId: uuid('application_id').references(() => applications.id, { onDelete: 'cascade' }).notNull().unique(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  meetingLinkOrInstructions: text('meeting_link_or_instructions').notNull(),
  status: interviewStatusEnum('status').default('scheduled').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
