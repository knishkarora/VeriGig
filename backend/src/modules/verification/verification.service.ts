import { eq, desc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { 
  verificationRequests, 
  verificationDocuments, 
  users, 
  studentProfiles, 
  businessProfiles, 
  auditEvents 
} from '../../db/schema/index.js';
import { privateStorage, StoredFile } from '../../services/storage.service.js';
import { SubmitVerificationInput, ReviewVerificationInput } from './verification.schema.js';

export class VerificationService {
  /**
   * Submit a new verification request with document upload
   */
  async submitVerification(
    userId: string,
    userRole: 'student' | 'employer' | 'admin',
    input: SubmitVerificationInput,
    storedFile: StoredFile,
    ipAddress?: string
  ) {
    if (userRole !== 'student' && userRole !== 'employer') {
      const err = new Error('Only student or employer accounts can submit verification requests');
      (err as any).statusCode = 400;
      throw err;
    }

    const verificationType = userRole === 'student' ? 'student_college_id' : 'business_registration';

    // 1. Create verification request record
    const [request] = await db
      .insert(verificationRequests)
      .values({
        userId,
        verificationType,
        status: 'pending',
        institutionOrBusiness: input.institutionOrBusiness,
        docIdentifierEncrypted: input.docIdentifier, // Handled as protected credential
      })
      .returning();

    // 2. Link private document reference
    await db.insert(verificationDocuments).values({
      requestId: request.id,
      fileKey: storedFile.fileKey,
      originalFilename: storedFile.originalFilename,
      mimeType: storedFile.mimeType,
      fileSizeBytes: storedFile.fileSizeBytes,
    });

    // 3. Update user status to pending_verification
    await db
      .update(users)
      .set({ status: 'pending_verification' })
      .where(eq(users.id, userId));

    // 4. Log audit event
    await db.insert(auditEvents).values({
      actorId: userId,
      eventType: 'verification_submitted',
      entityType: 'user',
      entityId: userId,
      payload: {
        requestId: request.id,
        verificationType,
        institutionOrBusiness: input.institutionOrBusiness,
      },
      ipAddress,
    });

    return request;
  }

  /**
   * Get latest verification status for the current user
   */
  async getUserVerificationStatus(userId: string) {
    const latestRequest = await db.query.verificationRequests.findFirst({
      where: eq(verificationRequests.userId, userId),
      orderBy: [desc(verificationRequests.createdAt)],
    });

    if (!latestRequest) {
      return {
        hasSubmitted: false,
        status: 'none',
        message: 'No verification request has been submitted yet',
      };
    }

    const documents = await db.query.verificationDocuments.findMany({
      where: eq(verificationDocuments.requestId, latestRequest.id),
    });

    return {
      hasSubmitted: true,
      requestId: latestRequest.id,
      verificationType: latestRequest.verificationType,
      status: latestRequest.status,
      institutionOrBusiness: latestRequest.institutionOrBusiness,
      rejectionReason: latestRequest.rejectionReason,
      reviewedAt: latestRequest.reviewedAt,
      expiresAt: latestRequest.expiresAt,
      documentsCount: documents.length,
      createdAt: latestRequest.createdAt,
    };
  }

  /**
   * Admin: List verification requests with optional filter
   */
  async listVerifications(filter?: { status?: 'pending' | 'approved' | 'rejected'; role?: 'student' | 'employer' }) {
    let requests = await db.query.verificationRequests.findMany({
      orderBy: [desc(verificationRequests.createdAt)],
    });

    if (filter?.status) {
      requests = requests.filter(r => r.status === filter.status);
    }

    if (filter?.role) {
      const targetType = filter.role === 'student' ? 'student_college_id' : 'business_registration';
      requests = requests.filter(r => r.verificationType === targetType);
    }

    // Enhance with user display info
    const enriched = await Promise.all(
      requests.map(async req => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, req.userId),
        });

        let applicantName = user?.email || 'Unknown';
        let collegeOrCompany = req.institutionOrBusiness;
        let details: Record<string, any> = {};

        if (user?.role === 'student' || req.verificationType === 'student_college_id') {
          const student = user ? await db.query.studentProfiles.findFirst({
            where: eq(studentProfiles.userId, user.id),
          }) : null;
          if (student) {
            applicantName = student.fullName;
            collegeOrCompany = student.collegeName || req.institutionOrBusiness;
            details = {
              degree: student.degree,
              graduationYear: student.graduationYear,
              rollNumber: student.rollNumberEncrypted || req.docIdentifierEncrypted,
              skills: student.skills,
              location: student.location,
            };
          }
        } else if (user?.role === 'employer' || req.verificationType === 'business_registration') {
          const biz = user ? await db.query.businessProfiles.findFirst({
            where: eq(businessProfiles.userId, user.id),
          }) : null;
          if (biz) {
            applicantName = biz.companyName;
            collegeOrCompany = biz.companyName;
            details = {
              businessType: biz.businessType,
              city: biz.city,
              state: biz.state,
              website: biz.website,
              registrationNumber: biz.registrationNumberEncrypted || req.docIdentifierEncrypted,
              contactPhone: biz.contactPhoneEncrypted,
            };
          }
        }

        const docs = await db.query.verificationDocuments.findMany({
          where: eq(verificationDocuments.requestId, req.id),
        });

        const effectiveRole = user?.role || (req.verificationType === 'student_college_id' ? 'student' : 'employer');
        const defaultDocUrl = effectiveRole === 'student'
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80';

        const docImageUrl = docs.length > 0
          ? `/api/v1/verifications/admin/requests/${req.id}/documents/${docs[0].id}`
          : defaultDocUrl;

        return {
          id: req.id,
          userId: req.userId,
          userEmail: user?.email,
          userName: applicantName,
          applicantName,
          collegeOrCompany,
          role: effectiveRole,
          userType: effectiveRole === 'student' ? ('student' as const) : ('sme' as const),
          verificationType: req.verificationType,
          status: req.status,
          institutionOrBusiness: collegeOrCompany,
          docIdentifier: req.docIdentifierEncrypted,
          idOrDocNumber: req.docIdentifierEncrypted || (effectiveRole === 'student' ? 'College ID' : 'Business Proof'),
          docImageUrl,
          rejectionReason: req.rejectionReason,
          reviewerNotes: req.reviewerNotes,
          reviewedAt: req.reviewedAt,
          submittedAt: req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
          createdAt: req.createdAt,
          details,
          documents: docs.map(d => ({
            id: d.id,
            originalFilename: d.originalFilename,
            mimeType: d.mimeType,
            fileSizeBytes: d.fileSizeBytes,
          })),
        };
      })
    );

    // Also include unverified user profiles from users table who haven't submitted a formal verificationRequest
    const existingUserIds = new Set(enriched.map(r => r.userId));
    const allUsers = await db.query.users.findMany();

    for (const u of allUsers) {
      if (u.role === 'admin' || existingUserIds.has(u.id)) continue;
      if (filter?.role && u.role !== filter.role) continue;

      if (u.role === 'student') {
        const student = await db.query.studentProfiles.findFirst({
          where: eq(studentProfiles.userId, u.id),
        });
        const isPending = u.status === 'pending_verification' || !u.emailVerified;
        if (filter?.status && filter.status !== (isPending ? 'pending' : 'approved')) {
          continue;
        }

        enriched.push({
          id: `profile-${u.id}`,
          userId: u.id,
          userEmail: u.email,
          userName: student?.fullName || u.email.split('@')[0],
          applicantName: student?.fullName || u.email.split('@')[0],
          collegeOrCompany: student?.collegeName || 'Regional Campus',
          role: 'student',
          userType: 'student' as const,
          verificationType: 'student_college_id',
          status: isPending ? 'pending' : 'approved',
          institutionOrBusiness: student?.collegeName || 'Regional Campus',
          docIdentifier: student?.rollNumberEncrypted || 'Awaiting ID Scan',
          idOrDocNumber: student?.rollNumberEncrypted || 'Awaiting ID Scan',
          docImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
          rejectionReason: null,
          reviewerNotes: null,
          reviewedAt: null,
          submittedAt: new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          createdAt: u.createdAt,
          details: {
            degree: student?.degree || 'Undergraduate',
            graduationYear: student?.graduationYear || 2026,
            rollNumber: student?.rollNumberEncrypted || 'Awaiting Roll#',
            skills: student?.skills || [],
            location: student?.location || 'Ludhiana, Punjab',
          },
          documents: [],
        });
      } else if (u.role === 'employer') {
        const biz = await db.query.businessProfiles.findFirst({
          where: eq(businessProfiles.userId, u.id),
        });
        const isPending = !biz?.verifiedBadge || u.status === 'pending_verification';
        if (filter?.status && filter.status !== (isPending ? 'pending' : 'approved')) {
          continue;
        }

        enriched.push({
          id: `profile-${u.id}`,
          userId: u.id,
          userEmail: u.email,
          userName: biz?.companyName || u.email.split('@')[0],
          applicantName: biz?.companyName || u.email.split('@')[0],
          collegeOrCompany: biz?.companyName || 'MSME Business',
          role: 'employer',
          userType: 'sme' as const,
          verificationType: 'business_registration',
          status: isPending ? 'pending' : 'approved',
          institutionOrBusiness: biz?.companyName || 'MSME Business',
          docIdentifier: biz?.registrationNumberEncrypted || 'Awaiting GSTIN/Udyam',
          idOrDocNumber: biz?.registrationNumberEncrypted || 'Awaiting GSTIN/Udyam',
          docImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
          rejectionReason: null,
          reviewerNotes: null,
          reviewedAt: null,
          submittedAt: new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          createdAt: u.createdAt,
          details: {
            businessType: biz?.businessType || 'Enterprise',
            city: biz?.city || 'Ludhiana',
            state: biz?.state || 'Punjab',
            website: biz?.website || '',
            registrationNumber: biz?.registrationNumberEncrypted || 'Awaiting GSTIN',
            contactPhone: biz?.contactPhoneEncrypted || '',
          },
          documents: [],
        });
      }
    }

    return enriched;
  }

  /**
   * Admin: Retrieve file stream for inspection with audit log
   */
  async getDocumentFileStream(adminId: string, requestId: string, documentId: string, ipAddress?: string) {
    const document = await db.query.verificationDocuments.findFirst({
      where: eq(verificationDocuments.id, documentId),
    });

    if (!document || document.requestId !== requestId) {
      const err = new Error('Document reference not found');
      (err as any).statusCode = 404;
      throw err;
    }

    // Audit document access by administrator
    await db.insert(auditEvents).values({
      actorId: adminId,
      eventType: 'verification_document_inspected',
      entityType: 'user',
      entityId: adminId,
      payload: {
        requestId,
        documentId,
        fileKey: document.fileKey,
      },
      ipAddress,
    });

    const file = privateStorage.getFileStream(document.fileKey);
    return {
      stream: file.stream,
      stats: file.stats,
      mimeType: document.mimeType,
      originalFilename: document.originalFilename,
    };
  }

  /**
   * Admin: Approve or Reject a verification request
   */
  async reviewVerification(
    adminId: string,
    requestId: string,
    input: ReviewVerificationInput,
    ipAddress?: string
  ) {
    const isApproved = input.decision === 'approve';
    const now = new Date();
    const expiresAt = isApproved 
      ? new Date(now.getTime() + input.validityMonths * 30 * 24 * 60 * 60 * 1000)
      : null;

    if (requestId.startsWith('profile-')) {
      const targetUserId = requestId.replace('profile-', '');
      const user = await db.query.users.findFirst({ where: eq(users.id, targetUserId) });
      if (!user) {
        const err = new Error('User profile not found');
        (err as any).statusCode = 404;
        throw err;
      }
      const targetType = user.role === 'student' ? 'student_college_id' : 'business_registration';

      const [newReq] = await db.insert(verificationRequests).values({
        userId: user.id,
        verificationType: targetType,
        status: isApproved ? 'approved' : 'rejected',
        institutionOrBusiness: user.role === 'student' ? 'Campus Verification' : 'MSME Registration',
        docIdentifierEncrypted: 'Verified by Admin Governance Desk',
        reviewerId: adminId,
        rejectionReason: isApproved ? null : input.rejectionReason,
        reviewerNotes: input.reviewerNotes,
        reviewedAt: now,
        expiresAt,
      }).returning();

      await db.update(users).set({ status: 'active', emailVerified: true }).where(eq(users.id, user.id));
      if (user.role === 'student') {
        await db.update(studentProfiles).set({ updatedAt: now }).where(eq(studentProfiles.userId, user.id));
      } else {
        await db.update(businessProfiles).set({ verifiedBadge: isApproved, updatedAt: now }).where(eq(businessProfiles.userId, user.id));
      }

      await db.insert(auditEvents).values({
        actorId: adminId,
        eventType: isApproved ? 'verification_approved' : 'verification_rejected',
        entityType: 'user',
        entityId: user.id,
        payload: { requestId: newReq.id, decision: input.decision, reason: input.rejectionReason },
        ipAddress,
      });

      return newReq;
    }

    const request = await db.query.verificationRequests.findFirst({
      where: eq(verificationRequests.id, requestId),
    });

    if (!request) {
      const err = new Error('Verification request not found');
      (err as any).statusCode = 404;
      throw err;
    }

    // 1. Update verification request state
    const [updatedRequest] = await db
      .update(verificationRequests)
      .set({
        status: isApproved ? 'approved' : 'rejected',
        reviewerId: adminId,
        rejectionReason: isApproved ? null : input.rejectionReason || 'Document did not meet institutional standards',
        reviewerNotes: input.reviewerNotes,
        reviewedAt: now,
        expiresAt,
        updatedAt: now,
      })
      .where(eq(verificationRequests.id, requestId))
      .returning();

    // 2. Update user status and trust badges
    await db
      .update(users)
      .set({
        status: 'active',
        emailVerified: true,
      })
      .where(eq(users.id, request.userId));

    if (request.verificationType === 'student_college_id' && isApproved) {
      await db
        .update(studentProfiles)
        .set({ updatedAt: now })
        .where(eq(studentProfiles.userId, request.userId));
    } else if (request.verificationType === 'business_registration') {
      await db
        .update(businessProfiles)
        .set({
          verifiedBadge: isApproved,
          updatedAt: now,
        })
        .where(eq(businessProfiles.userId, request.userId));
    }

    // 3. Log audit event
    await db.insert(auditEvents).values({
      actorId: adminId,
      eventType: isApproved ? 'verification_approved' : 'verification_rejected',
      entityType: 'user',
      entityId: request.userId,
      payload: {
        requestId,
        decision: input.decision,
        reason: input.rejectionReason,
        validityMonths: input.validityMonths,
      },
      ipAddress,
    });

    return updatedRequest;
  }
}
