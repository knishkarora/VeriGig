import { pgTable, uuid, text, timestamp, boolean, varchar, integer } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { contracts } from './contracts.js';

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  contractId: uuid('contract_id').references(() => contracts.id, { onDelete: 'cascade' }).notNull(),
  reviewerId: uuid('reviewer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  revieweeId: uuid('reviewee_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  ratingScore: integer('rating_score').notNull(), // 1 to 5
  writtenFeedback: text('written_feedback').notNull(),
  skillsEndorsed: text('skills_endorsed').array().default([]).notNull(),
  isPublic: boolean('is_public').default(false).notNull(), // Revealed only after both sides submit
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const completionRecords = pgTable('completion_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  verificationHash: varchar('verification_hash', { length: 64 }).notNull().unique(), // SHA-256 proof hash
  publicSlug: varchar('100', { length: 100 }).notNull().unique(),
  contractId: uuid('contract_id').references(() => contracts.id, { onDelete: 'cascade' }).notNull().unique(),
  studentId: uuid('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  employerId: uuid('employer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  gigTitle: varchar('gig_title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  employerCompany: varchar('employer_company', { length: 255 }).notNull(),
  studentName: varchar('student_name', { length: 255 }).notNull(),
  collegeName: varchar('college_name', { length: 255 }).notNull(),
  skills: text('skills').array().default([]).notNull(),
  totalAmount: integer('total_amount').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
