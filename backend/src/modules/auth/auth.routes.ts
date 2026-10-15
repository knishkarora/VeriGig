import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service.js';
import { registerSchema, loginSchema, googleOAuthSchema } from './auth.schema.js';

function setSessionCookies(reply: FastifyReply, token: string, refreshToken: string) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/api/v1',
  };
  reply.setCookie('token', token, { ...cookieOptions, maxAge: 15 * 60 });
  reply.setCookie('refreshToken', refreshToken, { ...cookieOptions, path: '/api/v1/auth', maxAge: 7 * 24 * 60 * 60 });
}

export async function authRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const authService = new AuthService();

  // POST /api/v1/auth/register
  app.post('/register', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = registerSchema.parse(req.body);
    const ipAddress = req.ip;

    const result = await authService.register(parsed, ipAddress);

    // Issue access token
    const token = app.jwt.sign({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });
    setSessionCookies(reply, token, result.refreshToken);

    return reply.status(201).send({
      message: 'Account created successfully',
      user: result.user,
      token,
    });
  });

  // POST /api/v1/auth/login
  app.post('/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = loginSchema.parse(req.body);
    const ipAddress = req.ip;

    const result = await authService.login(parsed, ipAddress);

    // Issue access token
    const token = app.jwt.sign({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });

    setSessionCookies(reply, token, result.refreshToken);

    return reply.send({
      message: 'Logged in successfully',
      user: result.user,
      token,
    });
  });

  // POST /api/v1/auth/google
  app.post('/google', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = googleOAuthSchema.parse(req.body);
    const result = await authService.loginWithGoogle(parsed, req.ip);
    const token = app.jwt.sign({ id: result.user.id, email: result.user.email, role: result.user.role });
    setSessionCookies(reply, token, result.refreshToken);
    return reply.send({ message: 'Google sign-in completed', user: result.user, token });
  });

  // POST /api/v1/auth/refresh
  app.post('/refresh', async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = (req.cookies as { refreshToken?: string }).refreshToken;

    if (!refreshToken) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'No refresh token provided in session cookie',
      });
    }

    const result = await authService.refreshSession(refreshToken);

    const token = app.jwt.sign({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });

    setSessionCookies(reply, token, result.newRefreshToken);

    return reply.send({
      user: result.user,
      token,
    });
  });

  // POST /api/v1/auth/logout
  app.post('/logout', async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = (req.cookies as { refreshToken?: string }).refreshToken;
    await authService.logout(refreshToken);

    reply.clearCookie('refreshToken', { path: '/api/v1/auth' });
    reply.clearCookie('token', { path: '/api/v1' });
    return reply.send({ message: 'Logged out successfully' });
  });

  // GET /api/v1/auth/me
  const { authenticate } = await import('../../middleware/auth.guard.js');
  app.get('/me', { preHandler: [authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const currentUser = req.currentUser!;
    const user = await authService.getCurrentUser(currentUser.id);

    return reply.send({ user });
  });
}
