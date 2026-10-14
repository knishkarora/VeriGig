import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { ApplicationsService } from './applications.service.js';
import { 
  applyGigSchema, 
  updateApplicationStatusSchema, 
  scheduleInterviewSchema 
} from './applications.schema.js';
import { authenticate, requireRole } from '../../middleware/auth.guard.js';

export async function applicationsRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const applicationsService = new ApplicationsService();

  // ==========================================
  // STUDENT PROPOSAL SUBMISSION & TRACKING
  // ==========================================

  // POST /api/v1/applications/gigs/:id/apply (Student Submits Proposal)
  app.post<{
    Params: { id: string };
  }>(
    '/gigs/:id/apply',
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

  // GET /api/v1/applications/student (Student Tracking Their Own Proposals)
  app.get(
    '/student',
    { preHandler: [authenticate, requireRole(['student'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const applications = await applicationsService.getStudentApplications(req.currentUser!.id);
      return reply.send({
        applications,
        total: applications.length,
      });
    }
  );

  // ==========================================
  // EMPLOYER CANDIDATE PIPELINE & DOSSIER
  // ==========================================

  // GET /api/v1/applications/gigs/:id (Employer Views Ranked Candidate Dossier for Gig)
  app.get<{
    Params: { id: string };
  }>(
    '/gigs/:id',
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

  // GET /api/v1/applications/:id (Single Application Dossier View)
  app.get<{
    Params: { id: string };
  }>(
    '/:id',
    { preHandler: [authenticate] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const result = await applicationsService.getApplicationById(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.id
      );

      return reply.send(result);
    }
  );

  // PATCH /api/v1/applications/:id/status (Employer Shortlists, Rejects, or Hires)
  app.patch<{
    Params: { id: string };
  }>(
    '/:id/status',
    { preHandler: [authenticate, requireRole(['employer', 'admin'])] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const parsed = updateApplicationStatusSchema.parse(req.body);
      const updated = await applicationsService.updateApplicationStatus(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.id,
        parsed,
        req.ip
      );

      return reply.send({
        message: `Application status updated to '${parsed.status}'`,
        application: updated,
      });
    }
  );

  // POST /api/v1/applications/:id/interview (Employer Schedules Interview)
  app.post<{
    Params: { id: string };
  }>(
    '/:id/interview',
    { preHandler: [authenticate, requireRole(['employer', 'admin'])] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const parsed = scheduleInterviewSchema.parse(req.body);
      const interview = await applicationsService.scheduleInterview(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.id,
        parsed,
        req.ip
      );

      return reply.status(201).send({
        message: 'Interview scheduled successfully',
        interview,
      });
    }
  );
}
