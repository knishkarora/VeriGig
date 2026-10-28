import { z } from 'zod';

export const createOrderSchema = z.object({
  contractId: z
    .string({ error: 'Contract ID is required' })
    .uuid('Contract ID must be a valid UUID'),
  idempotencyKey: z
    .string({ error: 'Idempotency key is required to prevent duplicate charges' })
    .min(8, 'Idempotency key must be at least 8 characters')
    .max(255),
  currency: z.string().default('INR'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const webhookPayloadSchema = z.object({
  event: z.enum([
    'payment.authorized',
    'payment.captured',
    'payment.failed',
    'payout.processed',
    'refund.processed',
  ] as const, { error: 'Event type is required' }),
  orderId: z.string({ error: 'Order ID is required' }),
  paymentId: z.string().optional(),
  amount: z.number().int().positive(),
  signature: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type WebhookPayloadInput = z.infer<typeof webhookPayloadSchema>;

export const releaseMilestonePayoutSchema = z.object({
  contractId: z.string().uuid(),
  milestoneId: z.string().uuid(),
  idempotencyKey: z.string().min(8).max(255),
});

export type ReleaseMilestonePayoutInput = z.infer<typeof releaseMilestonePayoutSchema>;
