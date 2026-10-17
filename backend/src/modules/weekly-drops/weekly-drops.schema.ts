import { z } from 'zod';

export const subscribeWeeklyDropSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  source: z.string().max(100).default('footer'),
});

export type SubscribeWeeklyDropInput = z.infer<typeof subscribeWeeklyDropSchema>;
