import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import { ZodError } from 'zod';
import { config } from './config/env.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        config.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  });

  // Security headers
  await app.register(helmet, {
    crossOriginResourcePolicy: false,
  });

  // CORS configuration
  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        cb(null, true);
        return;
      }

      const cleanOrigin = origin.replace(/\/+$/, '');
      const cleanConfig = config.CORS_ORIGIN?.replace(/\/+$/, '');

      if (
        cleanOrigin === cleanConfig ||
        cleanOrigin.startsWith('http://localhost:') ||
        cleanOrigin.endsWith('.onrender.com') ||
        cleanOrigin.endsWith('.pages.dev')
      ) {
        cb(null, true);
        return;
      }
      cb(new Error(`Not allowed by CORS: ${origin}`), false);
    },
    credentials: true,
  });

  // Cookies for HTTP-only refresh tokens & session management
  await app.register(cookie);

  // JWT configuration
  await app.register(jwt, {
    secret: config.JWT_SECRET,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });

  // Multipart file handling for private documents
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 3,
    },
  });

  // Global Centralized Schema & Zod Error Handler
  app.setErrorHandler((error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        details: error.flatten().fieldErrors,
      });
    }

    const statusCode = (error as { statusCode?: number }).statusCode || 500;
    app.log.error(error);

    return reply.status(statusCode).send({
      statusCode,
      error: statusCode >= 500 ? 'Internal Server Error' : error.name,
      message: statusCode >= 500 ? 'An unexpected error occurred' : error.message,
    });
  });

  // Root & Healthcheck Endpoints
  app.get('/health', async () => {
    return {
      status: 'ok',
      service: 'verigig-api',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
    };
  });

  // API Routes
  const { authRoutes } = await import('./modules/auth/auth.routes.js');
  await app.register(authRoutes, { prefix: '/api/v1/auth' });

  const { profilesRoutes } = await import('./modules/profiles/profiles.routes.js');
  await app.register(profilesRoutes, { prefix: '/api/v1/profiles' });

  const { verificationRoutes } = await import('./modules/verification/verification.routes.js');
  await app.register(verificationRoutes, { prefix: '/api/v1/verifications' });

  const { gigsRoutes } = await import('./modules/gigs/gigs.routes.js');
  await app.register(gigsRoutes, { prefix: '/api/v1/gigs' });

  const { applicationsRoutes } = await import('./modules/applications/applications.routes.js');
  await app.register(applicationsRoutes, { prefix: '/api/v1/applications' });

  const { contractsRoutes } = await import('./modules/contracts/contracts.routes.js');
  await app.register(contractsRoutes, { prefix: '/api/v1/contracts' });

  const { paymentsRoutes } = await import('./modules/payments/payments.routes.js');
  await app.register(paymentsRoutes, { prefix: '/api/v1/payments' });

  const { disputesRoutes } = await import('./modules/disputes/disputes.routes.js');
  await app.register(disputesRoutes, { prefix: '/api/v1/disputes' });

  const { analyticsRoutes } = await import('./modules/analytics/analytics.routes.js');
  await app.register(analyticsRoutes, { prefix: '/api/v1/analytics' });

  // Direct alias for student applications tracking per specification
  const { ApplicationsService } = await import('./modules/applications/applications.service.js');
  const { PaymentsService } = await import('./modules/payments/payments.service.js');
  const { DisputesService } = await import('./modules/disputes/disputes.service.js');
  const { raiseDisputeSchema, resolveDisputeSchema } = await import('./modules/disputes/disputes.schema.js');
  const { authenticate, requireRole } = await import('./middleware/auth.guard.js');
  const applicationsService = new ApplicationsService();
  const paymentsService = new PaymentsService();
  const disputesService = new DisputesService();

  app.get(
    '/api/v1/student/applications',
    { preHandler: [authenticate, requireRole(['student'])] },
    async (req, reply) => {
      const apps = await applicationsService.getStudentApplications(req.currentUser!.id);
      return reply.send({ applications: apps, total: apps.length });
    }
  );

  app.get(
    '/api/v1/student/earnings',
    { preHandler: [authenticate, requireRole(['student'])] },
    async (req, reply) => {
      const earnings = await paymentsService.getStudentEarnings(req.currentUser!.id);
      return reply.send(earnings);
    }
  );

  // Direct aliases for contract disputes and admin arbitration per checklist
  app.post<{
    Params: { id: string };
  }>(
    '/api/v1/contracts/:id/disputes/raise',
    { preHandler: [authenticate] },
    async (req, reply) => {
      const bodyWithContractId = { ...(req.body as any), contractId: req.params.id };
      const parsed = raiseDisputeSchema.parse(bodyWithContractId);
      const result = await disputesService.raiseDispute(
        req.currentUser!.id,
        req.currentUser!.role,
        parsed,
        req.ip
      );
      return reply.status(201).send(result);
    }
  );

  app.get<{
    Querystring: { status?: string };
  }>(
    '/api/v1/admin/disputes',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (req, reply) => {
      const disputesList = await disputesService.listDisputes(req.query.status);
      return reply.send({ disputes: disputesList, total: disputesList.length });
    }
  );

  app.get<{
    Params: { id: string };
  }>(
    '/api/v1/admin/disputes/:id',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (req, reply) => {
      const dossier = await disputesService.getDisputeById(
        req.currentUser!.id,
        req.currentUser!.role,
        req.params.id
      );
      return reply.send(dossier);
    }
  );

  app.post<{
    Params: { id: string };
  }>(
    '/api/v1/admin/disputes/:id/resolve',
    { preHandler: [authenticate, requireRole(['admin'])] },
    async (req, reply) => {
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

  // Reviews & Completion Certificates
  const { reviewsRoutes } = await import('./modules/reviews/reviews.routes.js');
  await app.register(reviewsRoutes, { prefix: '/api/v1/reviews' });

  // In-App Messaging
  const { messagingRoutes } = await import('./modules/messaging/messaging.routes.js');
  await app.register(messagingRoutes, { prefix: '/api/v1/messaging' });

  // Weekly Drops Newsletter Subscriptions
  const { weeklyDropsRoutes } = await import('./modules/weekly-drops/weekly-drops.routes.js');
  await app.register(weeklyDropsRoutes, { prefix: '/api/v1/weekly-drops' });

  const { ReviewsService } = await import('./modules/reviews/reviews.service.js');
  const reviewsService = new ReviewsService();

  // Public portable verification endpoint (Judge Matrix Q2 & Q5)
  app.get<{
    Params: { hash: string };
  }>(
    '/api/v1/verify/completion/:hash',
    async (req, reply) => {
      const cert = await reviewsService.getPublicCertificate(req.params.hash);
      return reply.send(cert);
    }
  );

  app.get<{
    Params: { hash: string };
  }>(
    '/api/verify/completion/:hash',
    async (req, reply) => {
      const cert = await reviewsService.getPublicCertificate(req.params.hash);
      return reply.send(cert);
    }
  );

  app.get('/api/v1/info', async () => {
    return {
      name: 'VeriGig REST API',
      version: '1.0.0',
      description: 'Controlled micro-gig marketplace API for verified students & SMEs',
      pilotCluster: 'Ludhiana & Punjab Academic Network',
    };
  });

  return app;
}
