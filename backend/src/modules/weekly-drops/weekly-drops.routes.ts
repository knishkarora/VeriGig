import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { WeeklyDropsService } from './weekly-drops.service.js';
import { subscribeWeeklyDropSchema } from './weekly-drops.schema.js';
import { authenticate, requireRole } from '../../middleware/auth.guard.js';

export async function weeklyDropsRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const weeklyDropsService = new WeeklyDropsService();

  // Public endpoint for submitting emails from the footer
  app.post(
    '/subscribe',
    async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = subscribeWeeklyDropSchema.parse(req.body);
      const result = await weeklyDropsService.subscribe(parsed);
      return reply.status(200).send(result);
    }
  );

  // Administrative view for reviewing subscribed emails
  app.get(
    '/subscribers',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (_req: FastifyRequest, reply: FastifyReply) => {
      const subscribers = await weeklyDropsService.listSubscribers();
      return reply.send({ subscribers, total: subscribers.length });
    }
  );
}
