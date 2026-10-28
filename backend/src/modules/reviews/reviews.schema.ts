import { z } from 'zod';

export const submitReviewSchema = z.object({
  contractId: z.string({ error: 'Contract ID is required' }).uuid(),
  ratingScore: z
    .number({ error: 'Rating score is required' })
    .int('Rating must be an integer between 1 and 5')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  writtenFeedback: z
    .string({ error: 'Written feedback is required' })
    .min(10, 'Please write feedback of at least 10 characters')
    .max(2000, 'Feedback cannot exceed 2000 characters'),
  skillsEndorsed: z
    .array(z.string().min(1).max(50))
    .max(10, 'Maximum of 10 skills can be endorsed')
    .default([]),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

export const generateCertificateSchema = z.object({
  contractId: z.string().uuid(),
});

export type GenerateCertificateInput = z.infer<typeof generateCertificateSchema>;
