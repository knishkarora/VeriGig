import { FastifyReply, FastifyRequest } from 'fastify';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'student' | 'employer' | 'admin';
}

declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: AuthenticatedUser;
  }
}

/**
 * PreHandler hook to authenticate JWT from Authorization header or cookie
 */
export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await req.jwtVerify<AuthenticatedUser>();
    req.currentUser = payload;
  } catch (err) {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Authentication token is missing, invalid, or expired',
    });
  }
}

/**
 * PreHandler hook generator to enforce role-based access control (RBAC)
 */
export function requireRole(allowedRoles: ('student' | 'employer' | 'admin')[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    // 1. Ensure user is authenticated first
    if (!req.currentUser) {
      await authenticate(req, reply);
      if (reply.sent) return;
    }

    const userRole = req.currentUser?.role;

    // 2. Check if user's role is in the allowed list
    if (!userRole || !allowedRoles.includes(userRole)) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: `Access denied. Required role: [${allowedRoles.join(', ')}], current role: ${userRole || 'none'}`,
      });
    }
  };
}
