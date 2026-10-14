import { pgTable, uuid, text, timestamp, boolean, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const conversationContextTypeEnum = pgEnum('conversation_context_type', [
  'gig',
  'application',
  'contract',
]);

export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  contextType: conversationContextTypeEnum('context_type').notNull(),
  contextId: uuid('context_id').notNull(),
  participantIds: text('participant_ids').array().notNull(), // User UUID array
  lastMessageText: text('last_message_text'),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
  senderId: uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  messageText: text('message_text').notNull(),
  attachmentUrl: text('attachment_url'),
  hasSafetyWarning: boolean('has_safety_warning').default(false).notNull(),
  safetyWarnings: text('safety_warnings').array().default([]).notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
