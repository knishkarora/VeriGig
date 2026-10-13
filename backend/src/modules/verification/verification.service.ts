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
        if (user?.role === 'student') {
          const student = await db.query.studentProfiles.findFirst({
            where: eq(studentProfiles.userId, user.id),
          });
          if (student) applicantName = student.fullName;
        } else if (user?.role === 'employer') {
          const biz = await db.query.businessProfiles.findFirst({
            where: eq(businessProfiles.userId, user.id),
          });
          if (biz) applicantName = biz.companyName;
        }

        const docs = await db.query.verificationDocuments.findMany({
          where: eq(verificationDocuments.requestId, req.id),
        });

        return {
          id: req.id,
          userId: req.userId,
          userEmail: user?.email,
          applicantName,
          role: user?.role,
          verificationType: req.verificationType,
          status: req.status,
          institutionOrBusiness: req.institutionOrBusiness,
          docIdentifier: req.docIdentifierEncrypted,
          rejectionReason: req.rejectionReason,
          reviewerNotes: req.reviewerNotes,
          reviewedAt: req.reviewedAt,
          createdAt: req.createdAt,
          documents: docs.map(d => ({
            id: d.id,
            originalFilename: d.originalFilename,
            mimeType: d.mimeType,
            fileSizeBytes: d.fileSizeBytes,
          })),
        };
      })
    );

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
    const request = await db.query.verificationRequests.findFirst({
      where: eq(verificationRequests.id, requestId),
    });

    if (!request) {
      const err = new Error('Verification request not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const isApproved = input.decision === 'approve';
    const now = new Date();
    const expiresAt = isApproved 
      ? new Date(now.getTime() + input.validityMonths * 30 * 24 * 60 * 60 * 1000)
      : null;

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
      // Award student verified badge
      await db
        .update(studentProfiles)
        .set({ updatedAt: now })
        .where(eq(studentProfiles.userId, request.userId));
    } else if (request.verificationType === 'business_registration' && isApproved) {
      // Award business verified badge
      await db
        .update(businessProfiles)
        .set({
          verifiedBadge: true,
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
