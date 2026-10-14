import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { GigsService } from './gigs.service.js';
import { createGigSchema, filterGigsSchema, moderateGigSchema } from './gigs.schema.js';
import { authenticate, requireRole } from '../../middleware/auth.guard.js';

export async function gigsRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const gigsService = new GigsService();

  // ==========================================
  // PUBLIC GIG DISCOVERY
  // ==========================================

  // GET /api/v1/gigs (Public Feed with multi-facet query parameters)
  app.get<{
    Querystring: {
      category?: string;
      workMode?: string;
      city?: string;
      gigLevel?: string;
      search?: string;
      minBudget?: number;
      maxBudget?: number;
      limit?: number;
      offset?: number;
    };
  }>('/', async (req, reply) => {
    const parsedFilters = filterGigsSchema.parse(req.query);
    const gigs = await gigsService.listGigs(parsedFilters);
    return reply.send({ gigs, total: gigs.length });
  });

  // GET /api/v1/gigs/:id (Public Detailed Brief & Milestones)
  app.get<{
    Params: { id: string };
  }>('/:id', async (req, reply) => {
    const gig = await gigsService.getGigById(req.params.id);
    return reply.send({ gig });
  });

  // ==========================================
  // EMPLOYER GIG POSTING
  // ==========================================

  // POST /api/v1/gigs (Employer Creates & Publishes Scoped Micro-Gig)
  app.post(
    '/',
    { preHandler: [authenticate, requireRole(['employer'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = createGigSchema.parse(req.body);
      const result = await gigsService.createGig(
        req.currentUser!.id,
        parsed,
        req.ip
      );

      return reply.status(201).send({
        message: result.isUnderModeration
          ? 'Gig created but placed in moderation queue for policy review'
          : 'Micro-gig published successfully to student feed',
        gig: result.gig,
        moderationMessage: result.moderationMessage,
      });
    }
  );

  // ==========================================
  // ADMIN POLICY & MODERATION GATE
  // ==========================================

  // GET /api/v1/gigs/admin/pending (List Gigs Pending Moderation)
  app.get(
    '/admin/pending',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (_req, reply) => {
      const pendingGigs = await gigsService.listPendingModeration();
      return reply.send({ gigs: pendingGigs });
    }
  );

  // POST /api/v1/gigs/admin/:id/moderate (Admin Approves or Bans Listing)
  app.post<{
    Params: { id: string };
  }>(
    '/admin/:id/moderate',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (req, reply) => {
      const parsed = moderateGigSchema.parse(req.body);
      const updated = await gigsService.moderateGig(
        req.currentUser!.id,
        req.params.id,
        parsed,
        req.ip
      );

      return reply.send({
        message: `Gig ${parsed.action === 'approve' ? 'approved' : 'rejected'} successfully`,
        gig: updated,
      });
    }
  );

  // ==========================================
  // APPLICATIONS & CANDIDATE PIPELINE ALIASES
  // ==========================================

  // POST /api/v1/gigs/:id/apply (Student Applies to Gig)
  const { ApplicationsService } = await import('../applications/applications.service.js');
  const { applyGigSchema } = await import('../applications/applications.schema.js');
  const applicationsService = new ApplicationsService();

  app.post<{
    Params: { id: string };
  }>(
    '/:id/apply',
    { preHandler: [authenticate, requireRole(['student'])] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const parsed = applyGigSchema.parse(req.body);
      const result = await applicationsService.applyToGig(
        req.currentUser!.id,
        req.params.id,
        parsed,
        req.ip
      );

      return reply.status(201).send({
        message: 'Proposal submitted successfully with explainable candidate fit analysis',
        application: result.application,
        fitAnalysis: result.fitResult,
      });
    }
  );

  // GET /api/v1/gigs/:id/applications (Employer Views Applicants for Gig)
  app.get<{
    Params: { id: string };
  }>(
    '/:id/applications',
    { preHandler: [authenticate, requireRole(['employer', 'admin'])] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const candidates = await applicationsService.getGigApplications(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.id
      );

      return reply.send({
        gigId: req.params.id,
        candidates,
        total: candidates.length,
      });
    }
  );
}
