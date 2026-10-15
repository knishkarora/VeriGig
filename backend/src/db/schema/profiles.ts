import { pgTable, uuid, text, timestamp, boolean, varchar, integer, numeric, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const campuses = pgTable('campuses', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  domain: varchar('domain', { length: 100 }),
  partnerStatus: boolean('partner_status').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const studentProfiles = pgTable('student_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  collegeName: varchar('college_name', { length: 255 }).notNull(),
  campusId: uuid('campus_id').references(() => campuses.id, { onDelete: 'set null' }),
  degree: varchar('degree', { length: 100 }).notNull(),
  graduationYear: integer('graduation_year').notNull(),
  rollNumberEncrypted: text('roll_number_encrypted'), // Private: never exposed in public queries
  bio: text('bio'),
  skills: text('skills').array().notNull().default([]), // Text array of student competencies
  location: varchar('location', { length: 150 }).notNull(),
  workModePreference: varchar('work_mode_preference', { length: 50 }).default('both').notNull(), // 'remote', 'on_site', 'both'
  portfolioLinks: jsonb('portfolio_links').$type<{ label: string; url: string }[]>().default([]).notNull(),
  availabilityStatus: varchar('availability_status', { length: 50 }).default('available_now').notNull(),
  ratingAvg: numeric('rating_avg', { precision: 3, scale: 2 }).default('0.00').notNull(),
  completedGigsCount: integer('completed_gigs_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const businessProfiles = pgTable('business_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  businessType: varchar('business_type', { length: 100 }).notNull(), // 'Retail', 'Healthcare', 'Tech', etc.
  registrationNumberEncrypted: text('registration_number_encrypted'), // Private: GSTIN/MSME stored securely
  website: text('website'),
  description: text('description'),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  contactPhoneEncrypted: text('contact_phone_encrypted'), // Private: contact number
  verifiedBadge: boolean('verified_badge').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
