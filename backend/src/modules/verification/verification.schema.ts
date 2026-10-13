import { z } from 'zod';

export const submitVerificationSchema = z.object({
  institutionOrBusiness: z.string().min(2, 'Institution or business name is required'),
  docIdentifier: z.string().min(2, 'Document or Roll number is required'),
});

export const reviewVerificationSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  rejectionReason: z.string().optional(),
  reviewerNotes: z.string().optional(),
  validityMonths: z.number().int().min(1).max(48).default(12),
});

export type SubmitVerificationInput = z.infer<typeof submitVerificationSchema>;
export type ReviewVerificationInput = z.infer<typeof reviewVerificationSchema>;
