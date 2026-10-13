import { pgTable, uuid, text, timestamp, boolean, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['student', 'employer', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'suspended', 'pending_verification']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  status: userStatusEnum('status').default('active').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  refreshTokenHash: text('refresh_token_hash').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const consents = pgTable('consents', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  consentType: varchar('consent_type', { length: 100 }).notNull(), // e.g. 'dpdpa_terms', 'credential_storage'
  version: varchar('version', { length: 20 }).notNull(), // e.g. 'v1.0'
  ipAddress: varchar('ip_address', { length: 45 }),
  grantedAt: timestamp('granted_at', { withTimezone: true }).defaultNow().notNull(),
});
