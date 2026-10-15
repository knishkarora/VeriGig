import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users, sessions, consents, studentProfiles, businessProfiles, auditEvents } from '../../db/schema/index.js';
import { config } from '../../config/env.js';
import { RegisterInput, LoginInput, GoogleOAuthInput } from './auth.schema.js';

export class AuthService {
  private async createRefreshSession(userId: string) {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({ userId, refreshTokenHash, expiresAt });
    return refreshToken;
  }

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
        collegeName: input.collegeName || '',
        degree: input.degree || '',
        graduationYear: input.graduationYear || 0,
        skills: input.skills || [],
        location: input.city && input.state ? `${input.city}, ${input.state}` : '',
        workModePreference: 'both',
        availabilityStatus: '',
      });
    } else if (input.role === 'employer') {
      await db.insert(businessProfiles).values({
        userId: newUser.id,
        companyName: input.companyName || '',
        businessType: input.businessType || '',
        city: input.city || '',
        state: input.state || '',
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

    return { user: await this.getCurrentUser(newUser.id), refreshToken: await this.createRefreshSession(newUser.id) };
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
    const refreshToken = await this.createRefreshSession(user.id);

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
      user: await this.getCurrentUser(user.id),
      refreshToken,
    };
  }

  async loginWithGoogle(input: GoogleOAuthInput, ipAddress?: string) {
    const apiKey = config.SUPABASE_SERVICE_ROLE_KEY || config.SUPABASE_ANON_KEY;
    if (!config.SUPABASE_URL || !apiKey) {
      const err = new Error('Google sign-in is not fully configured on the server');
      (err as any).statusCode = 503;
      throw err;
    }

    const response = await fetch(`${config.SUPABASE_URL.replace(/\/+$/, '')}/auth/v1/user`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${input.accessToken}` },
    });
    if (!response.ok) {
      const err = new Error('Your Google session could not be verified');
      (err as any).statusCode = 401;
      throw err;
    }

    const googleUser: any = await response.json();
    const isGoogleIdentity = googleUser.identities?.some((identity: any) => identity.provider === 'google');
    if (!isGoogleIdentity || !googleUser.email || !googleUser.email_confirmed_at) {
      const err = new Error('A verified Google email identity is required');
      (err as any).statusCode = 401;
      throw err;
    }

    let user = await db.query.users.findFirst({ where: eq(users.email, googleUser.email.toLowerCase()) });
    if (!user) {
      const metadata = googleUser.user_metadata || {};
      const name = String(metadata.full_name || metadata.name || googleUser.email.split('@')[0]);
      const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);
      [user] = await db.insert(users).values({
        email: googleUser.email.toLowerCase(),
        passwordHash,
        role: input.requestedRole,
        status: 'active',
        emailVerified: Boolean(googleUser.email_confirmed_at),
      }).returning();

      if (user.role === 'student') {
        await db.insert(studentProfiles).values({
          userId: user.id, fullName: name, collegeName: '', degree: '', graduationYear: 0,
          skills: [], location: '', workModePreference: 'both', availabilityStatus: '',
        });
      } else {
        await db.insert(businessProfiles).values({
          userId: user.id, companyName: '', businessType: '', city: '', state: '', verifiedBadge: false,
        });
      }
      await db.insert(auditEvents).values({
        actorId: user.id, eventType: 'user_registered_google', entityType: 'user', entityId: user.id,
        payload: { provider: 'google' }, ipAddress,
      });
    }

    await db.insert(auditEvents).values({
      actorId: user.id, eventType: 'user_logged_in_google', entityType: 'user', entityId: user.id,
      payload: { provider: 'google' }, ipAddress,
    });
    return { user: await this.getCurrentUser(user.id), refreshToken: await this.createRefreshSession(user.id) };
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
