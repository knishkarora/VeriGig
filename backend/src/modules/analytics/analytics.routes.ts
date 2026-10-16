import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { AnalyticsService } from './analytics.service.js';
import { authenticate, requireRole } from '../../middleware/auth.guard.js';

export async function analyticsRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const analyticsService = new AnalyticsService();

  // GET /api/v1/analytics/platform (Platform metrics computed from database)
  app.get(
    '/platform',
    { preHandler: [authenticate] },
    async (_req: FastifyRequest, reply: FastifyReply) => {
      const metrics = await analyticsService.getPlatformMetrics();
      return reply.send(metrics);
    }
  );
}
