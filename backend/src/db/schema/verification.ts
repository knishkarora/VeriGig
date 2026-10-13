import { pgTable, uuid, text, timestamp, varchar, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const verificationStatusEnum = pgEnum('verification_status', [
  'pending',
  'under_review',
  'approved',
  'rejected',
  'expired',
]);

export const verificationTypeEnum = pgEnum('verification_type', [
  'student_college_id',
  'business_registration',
]);

export const verificationRequests = pgTable('verification_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  verificationType: verificationTypeEnum('verification_type').notNull(),
  status: verificationStatusEnum('status').default('pending').notNull(),
  
  // Submission metadata
  institutionOrBusiness: varchar('institution_or_business', { length: 255 }).notNull(),
  docIdentifierEncrypted: text('doc_identifier_encrypted'), // Private: student roll number or business GSTIN/MSME
  
  // Reviewer details
  reviewerId: uuid('reviewer_id').references(() => users.id, { onDelete: 'set null' }),
  rejectionReason: text('rejection_reason'),
  reviewerNotes: text('reviewer_notes'),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const verificationDocuments = pgTable('verification_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestId: uuid('request_id').references(() => verificationRequests.id, { onDelete: 'cascade' }).notNull(),
  
  // Private Storage Metadata
  fileKey: text('file_key').notNull(), // Unique stored filename on private disk/bucket
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(), // 'image/jpeg', 'image/png', 'application/pdf'
  fileSizeBytes: integer('file_size_bytes').notNull(),
  
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
});
