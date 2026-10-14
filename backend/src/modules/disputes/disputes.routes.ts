import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { DisputesService } from './disputes.service.js';
import { 
  raiseDisputeSchema, 
  addEvidenceSchema, 
  resolveDisputeSchema 
} from './disputes.schema.js';
import { authenticate, requireRole } from '../../middleware/auth.guard.js';

export async function disputesRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const disputesService = new DisputesService();

  // ==========================================
  // DISPUTE INTAKE & EVIDENCE
  // ==========================================

  // POST /api/v1/disputes/raise (Student or Employer raises dispute)
  app.post(
    '/raise',
    { preHandler: [authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = raiseDisputeSchema.parse(req.body);
      const result = await disputesService.raiseDispute(
        req.currentUser!.id,
        req.currentUser!.role,
        parsed,
        req.ip
      );

      return reply.status(201).send(result);
    }
  );

  // POST /api/v1/disputes/:id/evidence (Party attaches evidence note/reference)
  app.post<{
    Params: { id: string };
  }>(
    '/:id/evidence',
    { preHandler: [authenticate] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const parsed = addEvidenceSchema.parse(req.body);
      const evidence = await disputesService.addEvidence(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.id,
        parsed,
        req.ip
      );

      return reply.status(201).send({
        message: 'Evidence submitted successfully to dispute case file',
        evidence,
      });
    }
  );

  // GET /api/v1/disputes/:id (View detailed case dossier)
  app.get<{
    Params: { id: string };
  }>(
    '/:id',
    { preHandler: [authenticate] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const dossier = await disputesService.getDisputeById(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.id
      );

      return reply.send(dossier);
    }
  );

  // ==========================================
  // ADMIN ARBITRATION DESK
  // ==========================================

  // GET /api/v1/disputes/admin/queue (Admin lists all dispute dossiers)
  app.get<{
    Querystring: { status?: string };
  }>(
    '/admin/queue',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (req: FastifyRequest<{ Querystring: { status?: string } }>, reply: FastifyReply) => {
      const disputesList = await disputesService.listDisputes(req.query.status);
      return reply.send({
        disputes: disputesList,
        total: disputesList.length,
      });
    }
  );

  // POST /api/v1/disputes/admin/:id/resolve (Admin issues binding settlement ruling)
  app.post<{
    Params: { id: string };
  }>(
    '/admin/:id/resolve',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const parsed = resolveDisputeSchema.parse(req.body);
      const result = await disputesService.resolveDispute(
        req.currentUser!.id,
        req.params.id,
        parsed,
        req.ip
      );

      return reply.send(result);
    }
  );
}
