import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { ProfilesService } from './profiles.service.js';
import { updateStudentProfileSchema, updateBusinessProfileSchema } from './profiles.schema.js';
import { authenticate, requireRole } from '../../middleware/auth.guard.js';

export async function profilesRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const profilesService = new ProfilesService();

  // ==========================================
  // STUDENT PROFILES
  // ==========================================

  // GET /api/v1/profiles/students/me (Authenticated Student)
  app.get(
    '/students/me',
    { preHandler: [authenticate, requireRole(['student'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const student = await profilesService.getStudentProfileByUserId(req.currentUser!.id);
      return reply.send({ profile: student });
    }
  );

  // PUT /api/v1/profiles/students/me (Authenticated Student)
  app.put(
    '/students/me',
    { preHandler: [authenticate, requireRole(['student'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = updateStudentProfileSchema.parse(req.body);
      const updated = await profilesService.updateStudentProfile(req.currentUser!.id, parsed);
      return reply.send({ message: 'Profile updated successfully', profile: updated });
    }
  );

  // GET /api/v1/profiles/students/:id (Public View with Data Minimization)
  app.get('/students/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const publicProfile = await profilesService.getPublicStudentProfile(req.params.id);
    return reply.send({ profile: publicProfile });
  });

  // ==========================================
  // BUSINESS PROFILES
  // ==========================================

  // GET /api/v1/profiles/employers/me (Authenticated Employer)
  app.get(
    '/employers/me',
    { preHandler: [authenticate, requireRole(['employer'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const business = await profilesService.getBusinessProfileByUserId(req.currentUser!.id);
      return reply.send({ profile: business });
    }
  );

  // PUT /api/v1/profiles/employers/me (Authenticated Employer)
  app.put(
    '/employers/me',
    { preHandler: [authenticate, requireRole(['employer'])] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = updateBusinessProfileSchema.parse(req.body);
      const updated = await profilesService.updateBusinessProfile(req.currentUser!.id, parsed);
      return reply.send({ message: 'Business profile updated successfully', profile: updated });
    }
  );

  // GET /api/v1/profiles/employers/:id (Public View with Data Minimization)
  app.get('/employers/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const publicProfile = await profilesService.getPublicBusinessProfile(req.params.id);
    return reply.send({ profile: publicProfile });
  });
}
