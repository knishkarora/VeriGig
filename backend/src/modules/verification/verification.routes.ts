import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { VerificationService } from './verification.service.js';
import { submitVerificationSchema, reviewVerificationSchema } from './verification.schema.js';
import { authenticate, requireRole } from '../../middleware/auth.guard.js';
import { privateStorage } from '../../services/storage.service.js';

export async function verificationRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const verificationService = new VerificationService();

  // ==========================================
  // STUDENT & EMPLOYER VERIFICATION SUBMISSION
  // ==========================================

  // POST /api/v1/verifications/submit (Multipart File + Metadata)
  app.post(
    '/submit',
    { preHandler: [authenticate, requireRole(['student', 'employer'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const data = await req.file();
      if (!data) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Document file is required for verification',
        });
      }

      // Extract fields from multipart formData
      const fields = data.fields as Record<string, any>;
      const institutionOrBusiness = fields.institutionOrBusiness?.value;
      const docIdentifier = fields.docIdentifier?.value;

      const parsedInput = submitVerificationSchema.parse({
        institutionOrBusiness,
        docIdentifier,
      });

      // Stream file to private object storage
      const storedFile = await privateStorage.saveFile(
        data.file,
        data.filename,
        data.mimetype
      );

      const result = await verificationService.submitVerification(
        req.currentUser!.id,
        req.currentUser!.role,
        parsedInput,
        storedFile,
        req.ip
      );

      return reply.status(201).send({
        message: 'Verification request submitted successfully and queued for review',
        request: result,
      });
    }
  );

  // GET /api/v1/verifications/status (Check personal verification status)
  app.get(
    '/status',
    { preHandler: [authenticate, requireRole(['student', 'employer'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const status = await verificationService.getUserVerificationStatus(req.currentUser!.id);
      return reply.send({ status });
    }
  );

  // ==========================================
  // ADMIN GOVERNANCE VERIFICATION DESK
  // ==========================================

  // GET /api/v1/verifications/admin/queue (List all submitted requests)
  app.get<{
    Querystring: { status?: 'pending' | 'approved' | 'rejected'; role?: 'student' | 'employer' };
  }>(
    '/admin/queue',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (req, reply) => {
      const list = await verificationService.listVerifications(req.query);
      return reply.send({ requests: list });
    }
  );

  // GET /api/v1/verifications/admin/requests/:requestId/documents/:docId (Inspect private file)
  app.get<{
    Params: { requestId: string; docId: string };
  }>(
    '/admin/requests/:requestId/documents/:docId',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (req, reply) => {
      const { stream, mimeType, originalFilename } = await verificationService.getDocumentFileStream(
        req.currentUser!.id,
        req.params.requestId,
        req.params.docId,
        req.ip
      );

      reply.header('Content-Type', mimeType);
      reply.header('Content-Disposition', `inline; filename="${originalFilename}"`);
      return reply.send(stream);
    }
  );

  // POST /api/v1/verifications/admin/requests/:id/review (Approve or Reject with reason)
  app.post<{
    Params: { id: string };
  }>(
    '/admin/requests/:id/review',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (req, reply) => {
      const parsed = reviewVerificationSchema.parse(req.body);
      const result = await verificationService.reviewVerification(
        req.currentUser!.id,
        req.params.id,
        parsed,
        req.ip
      );

      return reply.send({
        message: `Verification request ${parsed.decision === 'approve' ? 'approved' : 'rejected'} successfully`,
        request: result,
      });
    }
  );
}
