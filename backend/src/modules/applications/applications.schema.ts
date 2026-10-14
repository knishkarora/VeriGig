import { z } from 'zod';

export const applyGigSchema = z.object({
  coverNote: z
    .string({ required_error: 'Cover note is required' })
    .min(20, 'Cover note must be at least 20 characters explaining your approach')
    .max(2000, 'Cover note cannot exceed 2000 characters'),
  proposedTimeline: z
    .string({ required_error: 'Proposed timeline is required' })
    .min(2, 'Proposed timeline cannot be empty')
    .max(100, 'Proposed timeline is too long'),
  bidAmount: z
    .number()
    .int()
    .positive('Bid amount must be positive')
    .optional(),
  portfolioItems: z
    .array(
      z.object({
        label: z.string().min(1, 'Portfolio label is required').max(100),
        url: z.string().url('Must provide a valid URL for portfolio link'),
      })
    )
    .max(5, 'Maximum of 5 portfolio links allowed')
    .default([]),
  termsAccepted: z
    .boolean({ required_error: 'You must accept the micro-gig terms and milestone scope' })
    .refine(val => val === true, {
      message: 'You must accept the gig terms, milestone milestones, and platform policy',
    }),
});

export type ApplyGigInput = z.infer<typeof applyGigSchema>;

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['shortlisted', 'interviewed', 'rejected', 'hired'], {
    required_error: 'Status is required',
  }),
  rejectionReason: z.string().max(500).optional(),
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;

export const scheduleInterviewSchema = z.object({
  scheduledAt: z
    .string({ required_error: 'Scheduled date and time is required' })
    .datetime({ message: 'Must be a valid ISO datetime string' }),
  meetingLinkOrInstructions: z
    .string({ required_error: 'Meeting link or instructions are required' })
    .min(5, 'Meeting instructions or video call URL must be at least 5 characters')
    .max(1000, 'Instructions cannot exceed 1000 characters'),
  notes: z.string().max(1000).optional(),
});

export type ScheduleInterviewInput = z.infer<typeof scheduleInterviewSchema>;
