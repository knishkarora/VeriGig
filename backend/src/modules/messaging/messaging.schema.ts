import { z } from 'zod';

export const getOrCreateConversationSchema = z.object({
  contextType: z.enum(['gig', 'application', 'contract'], {
    required_error: 'Context type is required',
  }),
  contextId: z.string({ required_error: 'Context ID is required' }).uuid(),
  recipientId: z.string({ required_error: 'Recipient user ID is required' }).uuid(),
});

export type GetOrCreateConversationInput = z.infer<typeof getOrCreateConversationSchema>;

export const sendMessageSchema = z.object({
  messageText: z
    .string({ required_error: 'Message text is required' })
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message cannot exceed 5000 characters'),
  attachmentUrl: z
    .string()
    .url('Attachment must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
