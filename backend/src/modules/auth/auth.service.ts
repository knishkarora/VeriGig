import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users, sessions, consents, studentProfiles, businessProfiles, auditEvents } from '../../db/schema/index.js';
import { RegisterInput, LoginInput } from './auth.schema.js';

export class AuthService {
  async register(input: RegisterInput, ipAddress?: string) {
    // 1. Check if user already exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, input.email.toLowerCase()),
    });

    if (existing) {
      const err = new Error('An account with this email already exists');
      (err as any).statusCode = 409;
      throw err;
    }

    // 2. Hash password securely
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(input.password, salt);

    // 3. Create user record
    const [newUser] = await db
      .insert(users)
      .values({
        email: input.email.toLowerCase(),
        passwordHash,
        role: input.role,
        status: 'active',
        emailVerified: false,
      })
      .returning();

    // 4. Record DPDPA mandatory consent
    await db.insert(consents).values({
      userId: newUser.id,
      consentType: 'dpdpa_terms_and_privacy',
      version: 'v1.0',
      ipAddress,
    });

    // 5. Create role-specific profile
    if (input.role === 'student') {
      await db.insert(studentProfiles).values({
        userId: newUser.id,
        fullName: input.fullName,
        collegeName: input.collegeName || 'PCTE Group of Institutes',
        degree: input.degree || 'B.Tech Computer Science',
        graduationYear: input.graduationYear || 2027,
        skills: input.skills || ['React.js', 'TypeScript', 'Tailwind CSS'],
        location: `${input.city}, ${input.state}`,
        workModePreference: 'both',
        availabilityStatus: 'available_now',
      });
    } else if (input.role === 'employer') {
      await db.insert(businessProfiles).values({
        userId: newUser.id,
        companyName: input.companyName || input.fullName,
        businessType: input.businessType || 'Local SME Enterprise',
        city: input.city,
        state: input.state,
        verifiedBadge: false,
      });
    }

    // 6. Log audit event
    await db.insert(auditEvents).values({
      actorId: newUser.id,
      eventType: 'user_registered',
      entityType: 'user',
      entityId: newUser.id,
      payload: { role: input.role, email: newUser.email },
      ipAddress,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    };
  }

  async login(input: LoginInput, ipAddress?: string) {
    // 1. Fetch user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email.toLowerCase()),
    });

    if (!user) {
      const err = new Error('Invalid email or password');
      (err as any).statusCode = 401;
      throw err;
    }

    // 2. Verify account status
    if (user.status === 'suspended') {
      const err = new Error('This account has been suspended by governance committee');
      (err as any).statusCode = 403;
      throw err;
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      (err as any).statusCode = 401;
      throw err;
    }

    // 4. Create cryptographically secure refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(sessions).values({
      userId: user.id,
      refreshTokenHash,
      expiresAt,
    });

    // 5. Log login audit
    await db.insert(auditEvents).values({
      actorId: user.id,
      eventType: 'user_logged_in',
      entityType: 'user',
      entityId: user.id,
      payload: { email: user.email },
      ipAddress,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      refreshToken,
    };
  }

  async refreshSession(refreshToken: string) {
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await db.query.sessions.findFirst({
      where: eq(sessions.refreshTokenHash, refreshTokenHash),
      with: {
        // user query
      },
    });

    if (!session || new Date() > session.expiresAt) {
      if (session) {
        await db.delete(sessions).where(eq(sessions.id, session.id));
      }
      const err = new Error('Invalid or expired refresh token');
      (err as any).statusCode = 401;
      throw err;
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    if (!user || user.status === 'suspended') {
      const err = new Error('User inactive or suspended');
      (err as any).statusCode = 403;
      throw err;
    }

    // Rotate refresh token
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db
      .update(sessions)
      .set({
        refreshTokenHash: newRefreshTokenHash,
        expiresAt,
      })
      .where(eq(sessions.id, session.id));

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      newRefreshToken,
    };
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) return;
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await db.delete(sessions).where(eq(sessions.refreshTokenHash, refreshTokenHash));
  }

  async getCurrentUser(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }

    let profile: any = null;
    if (user.role === 'student') {
      profile = await db.query.studentProfiles.findFirst({
        where: eq(studentProfiles.userId, user.id),
      });
    } else if (user.role === 'employer') {
      profile = await db.query.businessProfiles.findFirst({
        where: eq(businessProfiles.userId, user.id),
      });
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      profile,
    };
  }
}
