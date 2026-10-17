import { eq, and, desc, ilike, or, gte, lte } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { 
  gigs, 
  gigMilestones, 
  gigPolicyFlags, 
  users, 
  businessProfiles, 
  auditEvents,
  applications 
} from '../../db/schema/index.js';
import { CreateGigInput, FilterGigsInput, ModerateGigInput } from './gigs.schema.js';

export class GigsService {
  /**
   * Automated Policy Guard: checks for prohibited tasks, academic cheating, and dangerous keywords
   */
  private checkPolicyCompliance(title: string, description: string): { isFlagged: boolean; reason?: string } {
    const prohibitedKeywords = [
      'homework', 'assignment', 'exam', 'dissertation', 'thesis cheating', 
      'academic paper', 'test proxy', 'crack', 'hack', 'piracy', 'unpaid',
      'commission only'
    ];

    const content = `${title} ${description}`.toLowerCase();
    for (const keyword of prohibitedKeywords) {
      if (content.includes(keyword)) {
        return {
          isFlagged: true,
          reason: `Violates acceptable contractor policy: flagged keyword '${keyword}' detected (anti-academic dishonesty / fair contractor terms).`,
        };
      }
    }

    return { isFlagged: false };
  }

  /**
   * Create a new micro-gig listing
   */
  async createGig(employerId: string, input: CreateGigInput, ipAddress?: string) {
    // 1. Verify that milestones total matches totalBudget
    const milestonesSum = input.milestones.reduce((acc, m) => acc + m.amount, 0);
    if (milestonesSum !== input.totalBudget) {
      const err = new Error(
        `Total milestone amounts (₹${milestonesSum}) must match total budget (₹${input.totalBudget})`
      );
      (err as any).statusCode = 400;
      throw err;
    }

    // 2. Automated Policy Inspection
    const policyCheck = this.checkPolicyCompliance(input.title, input.description);

    // 3. Insert gig record
    const [newGig] = await db
      .insert(gigs)
      .values({
        employerId,
        title: input.title,
        category: input.category,
        description: input.description,
        gigLevel: input.gigLevel,
        workMode: input.workMode,
        city: input.city,
        state: input.state,
        campusProximity: input.campusProximity,
        estimatedHours: input.estimatedHours,
        totalBudget: input.totalBudget,
        paymentType: input.paymentType,
        targetDuration: input.targetDuration,
        maxRevisions: input.maxRevisions,
        expectedDeliverables: input.expectedDeliverables,
        requiredSkills: input.requiredSkills,
        preferredColleges: input.preferredColleges,
        status: policyCheck.isFlagged ? 'moderation_pending' : 'open',
        moderationStatus: policyCheck.isFlagged ? 'pending' : 'approved',
      })
      .returning();

    // 4. Insert milestones
    for (let i = 0; i < input.milestones.length; i++) {
      const ms = input.milestones[i];
      await db.insert(gigMilestones).values({
        gigId: newGig.id,
        sequenceOrder: i + 1,
        title: ms.title,
        description: ms.description,
        deliverableCriteria: ms.deliverableCriteria,
        amount: ms.amount,
        durationDays: ms.durationDays,
      });
    }

    // 5. If policy flagged, log policy flag record
    if (policyCheck.isFlagged) {
      await db.insert(gigPolicyFlags).values({
        gigId: newGig.id,
        flagReason: policyCheck.reason!,
        policyRule: 'content_moderation_guard',
        status: 'flagged',
      });
    }

    // 6. Record audit event
    await db.insert(auditEvents).values({
      actorId: employerId,
      eventType: 'gig_created',
      entityType: 'gig',
      entityId: newGig.id,
      payload: {
        title: newGig.title,
        totalBudget: newGig.totalBudget,
        isFlagged: policyCheck.isFlagged,
      },
      ipAddress,
    });

    return {
      gig: newGig,
      isUnderModeration: policyCheck.isFlagged,
      moderationMessage: policyCheck.isFlagged ? policyCheck.reason : undefined,
    };
  }

  /**
   * Multi-facet public search and filtering for gigs
   */
  async listGigs(filters: FilterGigsInput) {
    let allGigs = await db.query.gigs.findMany({
      where: eq(gigs.status, 'open'),
      orderBy: [desc(gigs.createdAt)],
      limit: filters.limit,
      offset: filters.offset,
    });

    // Apply in-memory facet filters if provided
    if (filters.category && filters.category !== 'All') {
      allGigs = allGigs.filter(g => g.category === filters.category);
    }
    if (filters.workMode) {
      allGigs = allGigs.filter(g => g.workMode === filters.workMode);
    }
    if (filters.gigLevel) {
      allGigs = allGigs.filter(g => g.gigLevel === filters.gigLevel);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      allGigs = allGigs.filter(
        g => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
      );
    }
    if (filters.minBudget) {
      allGigs = allGigs.filter(g => g.totalBudget >= filters.minBudget!);
    }
    if (filters.maxBudget) {
      allGigs = allGigs.filter(g => g.totalBudget <= filters.maxBudget!);
    }

    // Enrich with employer business profile info and milestones
    const enriched = await Promise.all(
      allGigs.map(async g => {
        const employer = await db.query.businessProfiles.findFirst({
          where: eq(businessProfiles.userId, g.employerId),
        });

        const milestones = await db.query.gigMilestones.findMany({
          where: eq(gigMilestones.gigId, g.id),
          orderBy: [gigMilestones.sequenceOrder],
        });

        const gigApps = await db.query.applications.findMany({
          where: eq(applications.gigId, g.id),
        });

        return {
          ...g,
          employerName: employer?.companyName || 'Regional Enterprise',
          employerCompany: employer?.companyName || 'Regional Enterprise',
          employerVerified: employer?.verifiedBadge || false,
          applicantsCount: gigApps.length,
          milestones,
        };
      })
    );

    return enriched;
  }

  /**
   * Get single gig details by ID
   */
  async getGigById(gigId: string) {
    const gig = await db.query.gigs.findFirst({
      where: eq(gigs.id, gigId),
    });

    if (!gig) {
      const err = new Error('Micro-gig not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const employer = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, gig.employerId),
    });

    const milestones = await db.query.gigMilestones.findMany({
      where: eq(gigMilestones.gigId, gig.id),
      orderBy: [gigMilestones.sequenceOrder],
    });

    const gigApps = await db.query.applications.findMany({
      where: eq(applications.gigId, gig.id),
    });

    return {
      ...gig,
      employerName: employer?.companyName || 'Regional Enterprise',
      employerCompany: employer?.companyName || 'Regional Enterprise',
      employerVerified: employer?.verifiedBadge || false,
      applicantsCount: gigApps.length,
      milestones,
    };
  }

  /**
   * Admin: List gigs pending moderation
   */
  async listPendingModeration() {
    const flaggedGigs = await db.query.gigs.findMany({
      where: or(
        eq(gigs.status, 'moderation_pending'),
        eq(gigs.moderationStatus, 'pending')
      ),
      orderBy: [desc(gigs.createdAt)],
    });

    const enriched = await Promise.all(
      flaggedGigs.map(async g => {
        const flag = await db.query.gigPolicyFlags.findFirst({
          where: eq(gigPolicyFlags.gigId, g.id),
        });
        return {
          ...g,
          flagReason: flag?.flagReason || 'Requires administrative review',
        };
      })
    );

    return enriched;
  }

  /**
   * Admin: Moderate a flagged gig
   */
  async moderateGig(adminId: string, gigId: string, input: ModerateGigInput, ipAddress?: string) {
    const gig = await db.query.gigs.findFirst({
      where: eq(gigs.id, gigId),
    });

    if (!gig) {
      const err = new Error('Micro-gig not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const newStatus = input.action === 'approve' ? 'open' : 'cancelled';
    const newModStatus = input.action === 'approve' ? 'approved' : 'rejected';

    const [updated] = await db
      .update(gigs)
      .set({
        status: newStatus,
        moderationStatus: newModStatus,
        updatedAt: new Date(),
      })
      .where(eq(gigs.id, gigId))
      .returning();

    // Update flag status if exists
    await db
      .update(gigPolicyFlags)
      .set({
        reviewedBy: adminId,
        status: input.action === 'approve' ? 'resolved' : 'banned',
      })
      .where(eq(gigPolicyFlags.gigId, gigId));

    // Audit log
    await db.insert(auditEvents).values({
      actorId: adminId,
      eventType: 'gig_moderated',
      entityType: 'gig',
      entityId: gigId,
      payload: { action: input.action, reason: input.reason },
      ipAddress,
    });

    return updated;
  }
}
