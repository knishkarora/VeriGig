import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { PaymentsService } from './payments.service.js';
import { 
  createOrderSchema, 
  webhookPayloadSchema, 
  releaseMilestonePayoutSchema 
} from './payments.schema.js';
import { authenticate, requireRole } from '../../middleware/auth.guard.js';

export async function paymentsRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const paymentsService = new PaymentsService();

  // ==========================================
  // PAYMENT ORDER CREATION (ESCROW COMMITMENT)
  // ==========================================

  // POST /api/v1/payments/create-order (Employer creates funding order)
  app.post(
    '/create-order',
    { preHandler: [authenticate, requireRole(['employer', 'admin'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = createOrderSchema.parse(req.body);
      const result = await paymentsService.createOrder(
        req.currentUser!.id,
        req.currentUser!.role,
        parsed,
        req.ip
      );

      return reply.status(201).send(result);
    }
  );

  // ==========================================
  // SIGNED WEBHOOK HANDLER
  // ==========================================

  // POST /api/v1/payments/webhook (Signed provider webhook for capture/payout events)
  app.post(
    '/webhook',
    async (req: FastifyRequest, reply: FastifyReply) => {
      const signature = req.headers['x-razorpay-signature'] as string | undefined
        || req.headers['x-verigig-signature'] as string | undefined;

      const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const parsed = webhookPayloadSchema.parse(req.body);

      const result = await paymentsService.handleWebhook(
        parsed,
        rawBody,
        signature,
        req.ip
      );

      return reply.send(result);
    }
  );

  // ==========================================
  // MILESTONE PAYOUT RELEASE
  // ==========================================

  // POST /api/v1/payments/release-payout (Employer authorizes release of approved milestone)
  app.post(
    '/release-payout',
    { preHandler: [authenticate, requireRole(['employer', 'admin'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = releaseMilestonePayoutSchema.parse(req.body);
      const result = await paymentsService.releaseMilestonePayout(
        req.currentUser!.id,
        req.currentUser!.role,
        parsed,
        req.ip
      );

      return reply.send(result);
    }
  );

  // ==========================================
  // FINANCIAL REPORTS & RECEIPTS
  // ==========================================

  // GET /api/v1/payments/receipt/:contractId (Itemized transparent receipt)
  app.get<{
    Params: { contractId: string };
  }>(
    '/receipt/:contractId',
    { preHandler: [authenticate] },
    async (req: FastifyRequest<{ Params: { contractId: string } }>, reply: FastifyReply) => {
      const receipt = await paymentsService.getReceipt(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.contractId
      );

      return reply.send(receipt);
    }
  );

  // GET /api/v1/payments/student/earnings (Private earnings dashboard for students)
  app.get(
    '/student/earnings',
    { preHandler: [authenticate, requireRole(['student'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const earnings = await paymentsService.getStudentEarnings(req.currentUser!.id);
      return reply.send(earnings);
    }
  );
}
