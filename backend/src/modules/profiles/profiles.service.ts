import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { studentProfiles, businessProfiles, users } from '../../db/schema/index.js';
import { UpdateStudentProfileInput, UpdateBusinessProfileInput } from './profiles.schema.js';

export class ProfilesService {
  // Student Profiles
  async getStudentProfileByUserId(userId: string) {
    let profile = await db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.userId, userId),
    });

    if (!profile) {
      const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
      if (user) {
        const [created] = await db.insert(studentProfiles).values({
          userId: user.id,
          fullName: user.email.split('@')[0],
          collegeName: '',
          degree: '',
          graduationYear: new Date().getFullYear(),
          skills: [],
          location: 'Punjab, India',
          workModePreference: 'both',
          availabilityStatus: 'available_now',
        }).returning();
        return created;
      }

      const err = new Error('Student profile not found');
      (err as any).statusCode = 404;
      throw err;
    }

    return profile;
  }

  async getPublicStudentProfile(studentProfileId: string) {
    const profile = await db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.id, studentProfileId),
    });

    if (!profile) {
      const err = new Error('Student profile not found');
      (err as any).statusCode = 404;
      throw err;
    }

    // Data Minimization: Strictly omit rollNumberEncrypted, userId, etc.
    return {
      id: profile.id,
      fullName: profile.fullName,
      collegeName: profile.collegeName,
      degree: profile.degree,
      graduationYear: profile.graduationYear,
      bio: profile.bio,
      skills: profile.skills,
      location: profile.location,
      workModePreference: profile.workModePreference,
      portfolioLinks: profile.portfolioLinks,
      availabilityStatus: profile.availabilityStatus,
      ratingAvg: profile.ratingAvg,
      completedGigsCount: profile.completedGigsCount,
    };
  }

  async updateStudentProfile(userId: string, input: UpdateStudentProfileInput) {
    const existing = await this.getStudentProfileByUserId(userId);

    const updatePayload: any = {
      ...input,
      updatedAt: new Date(),
    };

    if (input.rollNumber !== undefined) {
      updatePayload.rollNumberEncrypted = input.rollNumber;
      delete updatePayload.rollNumber;
    }

    const [updated] = await db
      .update(studentProfiles)
      .set(updatePayload)
      .where(eq(studentProfiles.id, existing.id))
      .returning();

    return updated;
  }

  // Business Profiles
  async getBusinessProfileByUserId(userId: string) {
    const profile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId),
    });

    if (!profile) {
      const err = new Error('Business profile not found');
      (err as any).statusCode = 404;
      throw err;
    }

    return profile;
  }

  async getPublicBusinessProfile(businessProfileId: string) {
    const profile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.id, businessProfileId),
    });

    if (!profile) {
      const err = new Error('Business profile not found');
      (err as any).statusCode = 404;
      throw err;
    }

    // Data Minimization: Strictly omit registrationNumberEncrypted, contactPhoneEncrypted, userId
    return {
      id: profile.id,
      companyName: profile.companyName,
      businessType: profile.businessType,
      website: profile.website,
      description: profile.description,
      city: profile.city,
      state: profile.state,
      verifiedBadge: profile.verifiedBadge,
    };
  }

  async updateBusinessProfile(userId: string, input: UpdateBusinessProfileInput) {
    const existing = await this.getBusinessProfileByUserId(userId);

    const [updated] = await db
      .update(businessProfiles)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(businessProfiles.id, existing.id))
      .returning();

    return updated;
  }
}
