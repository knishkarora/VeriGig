import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { MessagingService } from './messaging.service.js';
import { getOrCreateConversationSchema, sendMessageSchema } from './messaging.schema.js';
import { authenticate } from '../../middleware/auth.guard.js';

export async function messagingRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const messagingService = new MessagingService();

  // ==========================================
  // CONVERSATIONS
  // ==========================================

  // POST /api/v1/messaging/conversations (Find or start conversation)
  app.post(
    '/conversations',
    { preHandler: [authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = getOrCreateConversationSchema.parse(req.body);
      const conv = await messagingService.getOrCreateConversation(
        req.currentUser!.id,
        parsed,
        req.ip
      );
      return reply.status(200).send({ conversation: conv });
    }
  );

  // GET /api/v1/messaging/conversations (List user conversations with unread counter)
  app.get(
    '/conversations',
    { preHandler: [authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const convList = await messagingService.listUserConversations(req.currentUser!.id);
      return reply.send({ conversations: convList, total: convList.length });
    }
  );

  // ==========================================
  // MESSAGES
  // ==========================================

  // POST /api/v1/messaging/conversations/:id/messages (Send message with safety scanner)
  app.post<{
    Params: { id: string };
  }>(
    '/conversations/:id/messages',
    { preHandler: [authenticate] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const parsed = sendMessageSchema.parse(req.body);
      const msg = await messagingService.sendMessage(
        req.currentUser!.id,
        req.params.id,
        parsed,
        req.ip
      );
      return reply.status(201).send({ message: msg });
    }
  );

  // GET /api/v1/messaging/conversations/:id/messages (Get messages, optional ?after= timestamp)
  app.get<{
    Params: { id: string };
    Querystring: { after?: string };
  }>(
    '/conversations/:id/messages',
    { preHandler: [authenticate] },
    async (
      req: FastifyRequest<{ Params: { id: string }; Querystring: { after?: string } }>,
      reply: FastifyReply
    ) => {
      const msgList = await messagingService.getConversationMessages(
        req.currentUser!.id,
        req.params.id,
        req.query.after
      );
      return reply.send({ messages: msgList, count: msgList.length });
    }
  );
}
