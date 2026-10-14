import { pgTable, uuid, text, timestamp, varchar, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { contracts, contractMilestones } from './contracts.js';

export const paymentProviderStatusEnum = pgEnum('payment_provider_status', [
  'created',
  'authorized',
  'captured',
  'failed',
  'refunded',
]);

export const payoutStatusEnum = pgEnum('payout_status', [
  'pending',
  'processing',
  'completed',
  'failed',
  'reversed',
]);

export const ledgerEntryTypeEnum = pgEnum('ledger_entry_type', [
  'escrow_funded',
  'milestone_payout',
  'platform_fee',
  'gateway_fee',
  'refund',
]);

export const paymentIntents = pgTable('payment_intents', {
  id: uuid('id').defaultRandom().primaryKey(),
  contractId: uuid('contract_id').references(() => contracts.id, { onDelete: 'cascade' }).notNull(),
  orderId: varchar('order_id', { length: 100 }).notNull().unique(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('INR').notNull(),
  providerStatus: paymentProviderStatusEnum('provider_status').default('created').notNull(),
  idempotencyKey: varchar('idempotency_key', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const paymentEvents = pgTable('payment_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  paymentIntentId: uuid('payment_intent_id').references(() => paymentIntents.id, { onDelete: 'cascade' }).notNull(),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  providerReference: varchar('provider_reference', { length: 255 }),
  rawPayload: jsonb('raw_payload').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const payouts = pgTable('payouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  contractMilestoneId: uuid('contract_milestone_id').references(() => contractMilestones.id, { onDelete: 'cascade' }).notNull(),
  recipientId: uuid('recipient_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  grossAmount: integer('gross_amount').notNull(),
  feeDeducted: integer('fee_deducted').default(0).notNull(),
  netAmount: integer('net_amount').notNull(),
  status: payoutStatusEnum('status').default('pending').notNull(),
  providerPayoutId: varchar('provider_payout_id', { length: 100 }),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const ledgerEntries = pgTable('ledger_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  contractId: uuid('contract_id').references(() => contracts.id, { onDelete: 'cascade' }).notNull(),
  paymentIntentId: uuid('payment_intent_id').references(() => paymentIntents.id, { onDelete: 'set null' }),
  debitAccount: varchar('debit_account', { length: 100 }).notNull(), // 'employer_account', 'sandbox_escrow', 'platform_revenue'
  creditAccount: varchar('credit_account', { length: 100 }).notNull(), // 'sandbox_escrow', 'student_account', 'platform_revenue'
  amount: integer('amount').notNull(),
  entryType: ledgerEntryTypeEnum('entry_type').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
