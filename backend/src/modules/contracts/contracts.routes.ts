import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { ContractsService } from './contracts.service.js';
import { 
  createOfferSchema, 
  acceptScopeSchema, 
  submitDeliverableSchema, 
  requestRevisionSchema, 
  approveMilestoneSchema 
} from './contracts.schema.js';
import { authenticate, requireRole } from '../../middleware/auth.guard.js';

export async function contractsRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const contractsService = new ContractsService();

  // ==========================================
  // CONTRACT CREATION & LISTING
  // ==========================================

  // POST /api/v1/contracts/create-offer (Employer initiates contract offer)
  app.post(
    '/create-offer',
    { preHandler: [authenticate, requireRole(['employer', 'admin'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = createOfferSchema.parse(req.body);
      const result = await contractsService.createOffer(
        req.currentUser!.id,
        req.currentUser!.role,
        parsed,
        req.ip
      );

      return reply.status(201).send({
        message: 'Contract offer created and transmitted to student for scope acceptance',
        contract: result.contract,
        milestones: result.milestones,
      });
    }
  );

  // GET /api/v1/contracts (List contracts for current authenticated user)
  app.get(
    '/',
    { preHandler: [authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const contracts = await contractsService.listUserContracts(
        req.currentUser!.id,
        req.currentUser!.role
      );

      return reply.send({
        contracts,
        total: contracts.length,
      });
    }
  );

  // GET /api/v1/contracts/:id (Detailed contract dossier with milestone timeline)
  app.get<{
    Params: { id: string };
  }>(
    '/:id',
    { preHandler: [authenticate] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const dossier = await contractsService.getContractById(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.id
      );

      return reply.send(dossier);
    }
  );

  // ==========================================
  // TWO-PARTY SCOPE ACCEPTANCE
  // ==========================================

  // POST /api/v1/contracts/:id/accept-scope (Student signs scope, IP terms & confidentiality)
  app.post<{
    Params: { id: string };
  }>(
    '/:id/accept-scope',
    { preHandler: [authenticate, requireRole(['student'])] },
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const parsed = acceptScopeSchema.parse(req.body);
      const updatedContract = await contractsService.acceptScope(
        req.currentUser!.id,
        req.params.id,
        parsed,
        req.ip
      );

      return reply.send({
        message: 'Contract scope, IP terms, and confidentiality agreement signed successfully. First milestone is now active!',
        contract: updatedContract,
      });
    }
  );

  // ==========================================
  // DELIVERABLE SUBMISSION & REVISION CYCLES
  // ==========================================

  // POST /api/v1/contracts/:id/milestones/:milestoneId/submit (Student submits deliverable)
  app.post<{
    Params: { id: string; milestoneId: string };
  }>(
    '/:id/milestones/:milestoneId/submit',
    { preHandler: [authenticate, requireRole(['student'])] },
    async (req: FastifyRequest<{ Params: { id: string; milestoneId: string } }>, reply: FastifyReply) => {
      const parsed = submitDeliverableSchema.parse(req.body);
      const result = await contractsService.submitDeliverable(
        req.currentUser!.id,
        req.params.id,
        req.params.milestoneId,
        parsed,
        req.ip
      );

      return reply.status(201).send({
        message: 'Deliverable submitted successfully for employer inspection',
        submission: result.submission,
        milestone: result.milestone,
      });
    }
  );

  // POST /api/v1/contracts/:id/milestones/:milestoneId/request-revision (Employer requests change)
  app.post<{
    Params: { id: string; milestoneId: string };
  }>(
    '/:id/milestones/:milestoneId/request-revision',
    { preHandler: [authenticate, requireRole(['employer', 'admin'])] },
    async (req: FastifyRequest<{ Params: { id: string; milestoneId: string } }>, reply: FastifyReply) => {
      const parsed = requestRevisionSchema.parse(req.body);
      const result = await contractsService.requestRevision(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.id,
        req.params.milestoneId,
        parsed,
        req.ip
      );

      return reply.send({
        message: 'Revision requested within capped allowance',
        revision: result.revision,
        milestone: result.milestone,
        revisionsUsed: result.revisionsUsed,
        maxRevisions: result.maxRevisions,
      });
    }
  );

  // POST /api/v1/contracts/:id/milestones/:milestoneId/approve (Employer signs off milestone)
  app.post<{
    Params: { id: string; milestoneId: string };
  }>(
    '/:id/milestones/:milestoneId/approve',
    { preHandler: [authenticate, requireRole(['employer', 'admin'])] },
    async (req: FastifyRequest<{ Params: { id: string; milestoneId: string } }>, reply: FastifyReply) => {
      const parsed = approveMilestoneSchema.parse(req.body);
      const result = await contractsService.approveMilestone(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.id,
        req.params.milestoneId,
        parsed,
        req.ip
      );

      return reply.send({
        message: result.contractCompleted
          ? 'Final milestone approved! Contract completed successfully.'
          : 'Milestone approved! Next milestone has been unlocked.',
        milestone: result.milestone,
        contractCompleted: result.contractCompleted,
        nextMilestoneSequence: result.nextMilestoneSequence,
      });
    }
  );
}
