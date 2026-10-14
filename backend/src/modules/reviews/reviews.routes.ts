import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { ReviewsService } from './reviews.service.js';
import { submitReviewSchema } from './reviews.schema.js';
import { authenticate } from '../../middleware/auth.guard.js';

export async function reviewsRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const reviewsService = new ReviewsService();

  // ==========================================
  // BILATERAL REVIEWS (DOUBLE-SIDED GATE)
  // ==========================================

  // POST /api/v1/reviews (Submit review for completed contract)
  app.post(
    '/',
    { preHandler: [authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = submitReviewSchema.parse(req.body);
      const result = await reviewsService.submitReview(
        req.currentUser!.id,
        req.currentUser!.role,
        parsed,
        req.ip
      );

      return reply.status(201).send(result);
    }
  );

  // GET /api/v1/reviews/contract/:contractId (Contract reviews)
  app.get<{
    Params: { contractId: string };
  }>(
    '/contract/:contractId',
    { preHandler: [authenticate] },
    async (req: FastifyRequest<{ Params: { contractId: string } }>, reply: FastifyReply) => {
      const contractReviews = await reviewsService.getContractReviews(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.contractId
      );

      return reply.send({ reviews: contractReviews });
    }
  );

  // GET /api/v1/reviews/user/:userId (Public verified reviews for a profile)
  app.get<{
    Params: { userId: string };
  }>(
    '/user/:userId',
    async (req: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
      const userReviews = await reviewsService.getUserPublicReviews(req.params.userId);
      return reply.send({ reviews: userReviews, total: userReviews.length });
    }
  );

  // ==========================================
  // COMPLETION CERTIFICATES
  // ==========================================

  // POST /api/v1/reviews/completion-records/generate/:contractId
  app.post<{
    Params: { contractId: string };
  }>(
    '/completion-records/generate/:contractId',
    { preHandler: [authenticate] },
    async (req: FastifyRequest<{ Params: { contractId: string } }>, reply: FastifyReply) => {
      const cert = await reviewsService.generateCertificate(req.params.contractId, req.ip);
      return reply.status(201).send({ certificate: cert });
    }
  );
}
