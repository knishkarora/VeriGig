import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const weeklyDrops = pgTable('weekly_drops', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  source: varchar('source', { length: 100 }).default('footer').notNull(),
  status: varchar('status', { length: 50 }).default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type WeeklyDropSubscriber = typeof weeklyDrops.$inferSelect;
export type NewWeeklyDropSubscriber = typeof weeklyDrops.$inferInsert;
