import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schema.js';

export async function authRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const authService = new AuthService();

  // POST /api/v1/auth/register
  app.post('/register', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = registerSchema.parse(req.body);
    const ipAddress = req.ip;

    const result = await authService.register(parsed, ipAddress);

    // Issue access token
    const token = app.jwt.sign({
      id: result.id,
      email: result.email,
      role: result.role,
    });

    return reply.status(201).send({
      message: 'Account created successfully',
      user: result,
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

    // Set secure HTTP-only refresh cookie
    reply.setCookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return reply.send({
      message: 'Logged in successfully',
      user: result.user,
      token,
    });
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

    reply.setCookie('refreshToken', result.newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60,
    });

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
    return reply.send({ message: 'Logged out successfully' });
  });

  // GET /api/v1/auth/me
  app.get('/me', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Valid JWT session token required',
      });
    }

    const decoded = req.user as { id: string };
    const user = await authService.getCurrentUser(decoded.id);

    return reply.send({ user });
  });
}
