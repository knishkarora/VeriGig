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
      // Allow requests with no origin (e.g. mobile apps, curl) or matching dev origin
      if (!origin || origin === config.CORS_ORIGIN || origin.startsWith('http://localhost:')) {
        cb(null, true);
        return;
      }
      cb(new Error('Not allowed by CORS'), false);
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
