import { z } from 'zod';

export const raiseDisputeSchema = z.object({
  contractId: z.string({ error: 'Contract ID is required' }).uuid(),
  milestoneId: z.string({ error: 'Milestone ID is required' }).uuid(),
  reasonCategory: z.enum([
    'unresponsive_counterparty',
    'deliverable_quality',
    'scope_creep',
    'unreasonable_revisions',
    'unauthorized_work',
    'other',
  ] as const, { error: 'Dispute reason category is required' }),
  explanation: z
    .string({ error: 'Detailed explanation is required' })
    .min(20, 'Please provide an explanation of at least 20 characters')
    .max(2000, 'Explanation cannot exceed 2000 characters'),
  initialEvidenceNote: z.string().max(1000).optional(),
  fileReference: z.string().optional(),
});

export type RaiseDisputeInput = z.infer<typeof raiseDisputeSchema>;

export const addEvidenceSchema = z.object({
  note: z
    .string({ error: 'Evidence note is required' })
    .min(10, 'Note must be at least 10 characters')
    .max(2000),
  fileReference: z.string().optional(),
});

export type AddEvidenceInput = z.infer<typeof addEvidenceSchema>;

export const resolveDisputeSchema = z.object({
  formalRuling: z
    .string({ error: 'Formal ruling justification is required' })
    .min(20, 'Ruling justification must be at least 20 characters')
    .max(3000),
  resolutionType: z.enum(['refund_employer', 'payout_student', 'split_settlement'] as const, {
    error: 'Resolution type is required',
  }),
  payoutAmountStudent: z.number().int().min(0).default(0),
  refundAmountEmployer: z.number().int().min(0).default(0),
});

export type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>;
