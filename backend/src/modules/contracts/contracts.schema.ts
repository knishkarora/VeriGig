import { z } from 'zod';

export const createOfferSchema = z.object({
  applicationId: z
    .string({ error: 'Application ID is required' })
    .uuid('Application ID must be a valid UUID'),
  totalAmount: z
    .number()
    .int()
    .positive('Total contract amount must be positive')
    .optional(),
  customNotes: z.string().max(1000).optional(),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;

export const acceptScopeSchema = z.object({
  confidentialityAccepted: z
    .boolean({ error: 'Confidentiality agreement acceptance is required' })
    .refine(val => val === true, {
      message: 'You must accept the confidentiality agreement prior to commencing work',
    }),
  ipClauseAccepted: z
    .boolean({ error: 'IP assignment clause acceptance is required' })
    .refine(val => val === true, {
      message: 'You must accept the intellectual property transfer clause (work product transfers upon approved payout)',
    }),
  termsVersion: z.string().default('1.0'),
});

export type AcceptScopeInput = z.infer<typeof acceptScopeSchema>;

export const submitDeliverableSchema = z.object({
  studentNotes: z
    .string({ error: 'Deliverable notes are required' })
    .min(10, 'Please provide notes describing your deliverable (at least 10 characters)')
    .max(2000, 'Notes cannot exceed 2000 characters'),
  liveUrl: z
    .string()
    .url('Must be a valid URL (e.g., Figma prototype, deployed website, Google Drive link)')
    .optional()
    .or(z.literal('')),
  repositoryUrl: z
    .string()
    .url('Must be a valid repository URL (e.g., GitHub, GitLab)')
    .optional()
    .or(z.literal('')),
  fileReferences: z
    .array(z.string().min(1))
    .max(5, 'Maximum of 5 deliverable file attachments allowed')
    .default([]),
});

export type SubmitDeliverableInput = z.infer<typeof submitDeliverableSchema>;

export const requestRevisionSchema = z.object({
  feedbackText: z
    .string({ error: 'Actionable revision feedback is required' })
    .min(10, 'Please specify concrete revision instructions (at least 10 characters)')
    .max(2000, 'Feedback cannot exceed 2000 characters'),
});

export type RequestRevisionInput = z.infer<typeof requestRevisionSchema>;

export const approveMilestoneSchema = z.object({
  notes: z.string().max(1000).optional(),
});

export type ApproveMilestoneInput = z.infer<typeof approveMilestoneSchema>;
