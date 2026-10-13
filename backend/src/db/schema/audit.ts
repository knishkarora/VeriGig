import { pgTable, uuid, text, timestamp, varchar, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const auditEvents = pgTable('audit_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
  eventType: varchar('event_type', { length: 100 }).notNull(), // e.g. 'contract_created', 'milestone_released', 'id_verification_decision'
  entityType: varchar('entity_type', { length: 50 }).notNull(), // 'user', 'gig', 'contract', 'dispute', 'payment'
  entityId: uuid('entity_id').notNull(),
  payload: jsonb('payload').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
