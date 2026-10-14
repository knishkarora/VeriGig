import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { 
  disputes, 
  disputeEvidence, 
  disputeDecisions, 
  contracts, 
  contractMilestones, 
  deliverableSubmissions, 
  revisionRequests, 
  gigs, 
  users, 
  studentProfiles, 
  businessProfiles, 
  ledgerEntries, 
  payouts, 
  auditEvents 
} from '../../db/schema/index.js';
import { 
  RaiseDisputeInput, 
  AddEvidenceInput, 
  ResolveDisputeInput 
} from './disputes.schema.js';

export class DisputesService {
  /**
   * Student or Employer raises a formal dispute on a contract milestone (Judge Matrix Q13)
   */
  async raiseDispute(
    userId: string,
    userRole: string,
    input: RaiseDisputeInput,
    ipAddress?: string
  ) {
    // 1. Fetch contract & verify ownership
    const contract = await db.query.contracts.findFirst({
      where: eq(contracts.id, input.contractId),
    });

    if (!contract) {
      const err = new Error('Contract not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (userRole !== 'admin' && contract.studentId !== userId && contract.employerId !== userId) {
      const err = new Error('You are not a party to this contract and cannot raise a dispute');
      (err as any).statusCode = 403;
      throw err;
    }

    // 2. Fetch milestone & verify eligibility
    const milestone = await db.query.contractMilestones.findFirst({
      where: and(
        eq(contractMilestones.id, input.milestoneId),
        eq(contractMilestones.contractId, input.contractId)
      ),
    });

    if (!milestone) {
      const err = new Error('Milestone not found in this contract');
      (err as any).statusCode = 404;
      throw err;
    }

    if (milestone.status === 'paid') {
      const err = new Error('Cannot dispute a milestone that has already been paid out and settled');
      (err as any).statusCode = 400;
      throw err;
    }

    // 3. Check for existing open dispute on this milestone
    const existing = await db.query.disputes.findFirst({
      where: and(
        eq(disputes.milestoneId, input.milestoneId),
        eq(disputes.status, 'open')
      ),
    });

    if (existing) {
      const err = new Error('An active dispute is already open for this milestone');
      (err as any).statusCode = 400;
      throw err;
    }

    const now = new Date();

    // 4. Freeze milestone and contract state in database
    await db
      .update(contractMilestones)
      .set({
        status: 'disputed',
        updatedAt: now,
      })
      .where(eq(contractMilestones.id, milestone.id));

    await db
      .update(contracts)
      .set({
        status: 'disputed',
        updatedAt: now,
      })
      .where(eq(contracts.id, contract.id));

    // 5. Create dispute record
    const [dispute] = await db
      .insert(disputes)
      .values({
        contractId: contract.id,
        milestoneId: milestone.id,
        initiatedBy: userId,
        reasonCategory: input.reasonCategory,
        explanation: input.explanation,
        status: 'open',
      })
      .returning();

    // 6. Record initial evidence if provided
    if (input.initialEvidenceNote) {
      await db.insert(disputeEvidence).values({
        disputeId: dispute.id,
        uploadedBy: userId,
        note: input.initialEvidenceNote,
        fileReference: input.fileReference || null,
      });
    }

    // 7. Record immutable audit log
    await db.insert(auditEvents).values({
      actorId: userId,
      eventType: 'dispute_raised',
      entityType: 'dispute',
      entityId: dispute.id,
      payload: {
        contractId: contract.id,
        milestoneId: milestone.id,
        reasonCategory: input.reasonCategory,
        milestoneAmount: milestone.amount,
      },
      ipAddress,
    });

    return {
      dispute,
      message: 'Dispute registered. Milestone funds frozen in escrow pending admin arbitration review.',
    };
  }

  /**
   * Either party submits supporting documentation/notes to an active dispute
   */
  async addEvidence(
    userId: string,
    userRole: string,
    disputeId: string,
    input: AddEvidenceInput,
    ipAddress?: string
  ) {
    const dispute = await db.query.disputes.findFirst({
      where: eq(disputes.id, disputeId),
    });

    if (!dispute) {
      const err = new Error('Dispute case not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (dispute.status === 'resolved') {
      const err = new Error('Cannot submit evidence for a dispute that has already been formally resolved');
      (err as any).statusCode = 400;
      throw err;
    }

    const contract = await db.query.contracts.findFirst({
      where: eq(contracts.id, dispute.contractId),
    });

    if (
      userRole !== 'admin' &&
      contract?.studentId !== userId &&
      contract?.employerId !== userId
    ) {
      const err = new Error('You do not have permission to attach evidence to this dispute');
      (err as any).statusCode = 403;
      throw err;
    }

    // 1. Insert evidence
    const [evidence] = await db
      .insert(disputeEvidence)
      .values({
        disputeId: dispute.id,
        uploadedBy: userId,
        note: input.note,
        fileReference: input.fileReference || null,
      })
      .returning();

    // 2. Transition dispute to in_review if pending
    if (dispute.status === 'open' || dispute.status === 'evidence_pending') {
      await db
        .update(disputes)
        .set({ status: 'in_review' })
        .where(eq(disputes.id, dispute.id));
    }

    // 3. Log audit event
    await db.insert(auditEvents).values({
      actorId: userId,
      eventType: 'dispute_evidence_added',
      entityType: 'dispute',
      entityId: dispute.id,
      payload: {
        evidenceId: evidence.id,
        hasFileReference: Boolean(input.fileReference),
      },
      ipAddress,
    });

    return evidence;
  }

  /**
   * Admin: List all dispute dossiers with optional status filter
   */
  async listDisputes(filterStatus?: string) {
    const allDisputes = await db.query.disputes.findMany({
      orderBy: [desc(disputes.createdAt)],
    });

    const filtered = filterStatus
      ? allDisputes.filter(d => d.status === filterStatus)
      : allDisputes;

    const enriched = await Promise.all(
      filtered.map(async d => {
        const contract = await db.query.contracts.findFirst({
          where: eq(contracts.id, d.contractId),
        });

        const gig = contract
          ? await db.query.gigs.findFirst({ where: eq(gigs.id, contract.gigId) })
          : null;

        const milestone = await db.query.contractMilestones.findFirst({
          where: eq(contractMilestones.id, d.milestoneId),
        });

        const initiator = await db.query.users.findFirst({
          where: eq(users.id, d.initiatedBy),
        });

        const evidence = await db.query.disputeEvidence.findMany({
          where: eq(disputeEvidence.disputeId, d.id),
        });

        return {
          id: d.id,
          contractId: d.contractId,
          gigTitle: gig?.title || 'Micro-gig',
          milestoneId: d.milestoneId,
          milestoneTitle: milestone?.title || 'Milestone',
          disputedAmount: milestone?.amount || 0,
          reasonCategory: d.reasonCategory,
          explanation: d.explanation,
          status: d.status,
          resolutionType: d.resolutionType,
          initiatedBy: {
            id: d.initiatedBy,
            email: initiator?.email,
            role: initiator?.role,
          },
          evidenceCount: evidence.length,
          createdAt: d.createdAt,
          resolvedAt: d.resolvedAt,
        };
      })
    );

    return enriched;
  }

  /**
   * Retrieve single dispute case dossier
   */
  async getDisputeById(userId: string, userRole: string, disputeId: string) {
    const dispute = await db.query.disputes.findFirst({
      where: eq(disputes.id, disputeId),
    });

    if (!dispute) {
      const err = new Error('Dispute case not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const contract = await db.query.contracts.findFirst({
      where: eq(contracts.id, dispute.contractId),
    });

    if (
      userRole !== 'admin' &&
      contract?.studentId !== userId &&
      contract?.employerId !== userId
    ) {
      const err = new Error('You do not have permission to view this dispute case');
      (err as any).statusCode = 403;
      throw err;
    }

    const gig = contract
      ? await db.query.gigs.findFirst({ where: eq(gigs.id, contract.gigId) })
      : null;

    const milestone = await db.query.contractMilestones.findFirst({
      where: eq(contractMilestones.id, dispute.milestoneId),
    });

    const studentUser = contract
      ? await db.query.users.findFirst({ where: eq(users.id, contract.studentId) })
      : null;
    const student = contract
      ? await db.query.studentProfiles.findFirst({ where: eq(studentProfiles.userId, contract.studentId) })
      : null;

    const employerUser = contract
      ? await db.query.users.findFirst({ where: eq(users.id, contract.employerId) })
      : null;
    const employerBiz = contract
      ? await db.query.businessProfiles.findFirst({ where: eq(businessProfiles.userId, contract.employerId) })
      : null;

    const evidenceList = await db.query.disputeEvidence.findMany({
      where: eq(disputeEvidence.disputeId, dispute.id),
      orderBy: [disputeEvidence.submittedAt],
    });

    const enrichedEvidence = await Promise.all(
      evidenceList.map(async ev => {
        const uploader = await db.query.users.findFirst({
          where: eq(users.id, ev.uploadedBy),
        });
        return {
          id: ev.id,
          note: ev.note,
          fileReference: ev.fileReference,
          submittedAt: ev.submittedAt,
          uploader: {
            id: ev.uploadedBy,
            email: uploader?.email,
            role: uploader?.role,
          },
        };
      })
    );

    const submissions = await db.query.deliverableSubmissions.findMany({
      where: eq(deliverableSubmissions.milestoneId, dispute.milestoneId),
      orderBy: [desc(deliverableSubmissions.versionNumber)],
    });

    const revisions = await db.query.revisionRequests.findMany({
      where: eq(revisionRequests.milestoneId, dispute.milestoneId),
      orderBy: [desc(revisionRequests.requestedAt)],
    });

    const decision = await db.query.disputeDecisions.findFirst({
      where: eq(disputeDecisions.disputeId, dispute.id),
    });

    return {
      dispute: {
        id: dispute.id,
        status: dispute.status,
        reasonCategory: dispute.reasonCategory,
        explanation: dispute.explanation,
        resolutionType: dispute.resolutionType,
        createdAt: dispute.createdAt,
        resolvedAt: dispute.resolvedAt,
      },
      contract: {
        id: contract?.id,
        gigTitle: gig?.title,
        totalAmount: contract?.totalAmount,
        status: contract?.status,
      },
      milestone: {
        id: milestone?.id,
        sequenceOrder: milestone?.sequenceOrder,
        title: milestone?.title,
        amount: milestone?.amount,
        status: milestone?.status,
        submissions,
        revisions,
      },
      parties: {
        student: {
          id: contract?.studentId,
          name: student?.fullName || studentUser?.email,
          collegeName: student?.collegeName,
          rating: student?.ratingAvg,
        },
        employer: {
          id: contract?.employerId,
          companyName: employerBiz?.companyName || employerUser?.email,
          city: employerBiz?.city,
        },
      },
      evidence: enrichedEvidence,
      decision: decision || null,
    };
  }

  /**
   * Admin: Issue binding arbitration ruling and execute double-entry ledger settlement (Judge Matrix Q13)
   */
  async resolveDispute(
    adminId: string,
    disputeId: string,
    input: ResolveDisputeInput,
    ipAddress?: string
  ) {
    const dispute = await db.query.disputes.findFirst({
      where: eq(disputes.id, disputeId),
    });

    if (!dispute) {
      const err = new Error('Dispute case not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (dispute.status === 'resolved') {
      const err = new Error('This dispute has already been resolved and settled');
      (err as any).statusCode = 400;
      throw err;
    }

    const contract = await db.query.contracts.findFirst({
      where: eq(contracts.id, dispute.contractId),
    });

    const milestone = await db.query.contractMilestones.findFirst({
      where: eq(contractMilestones.id, dispute.milestoneId),
    });

    if (!contract || !milestone) {
      const err = new Error('Associated contract or milestone missing');
      (err as any).statusCode = 404;
      throw err;
    }

    // 1. Validate settlement math: student payout + employer refund === milestone.amount
    const totalSettled = input.payoutAmountStudent + input.refundAmountEmployer;
    if (totalSettled !== milestone.amount) {
      const err = new Error(
        `Total settlement amount (₹${totalSettled}) must equal the frozen milestone value (₹${milestone.amount})`
      );
      (err as any).statusCode = 400;
      throw err;
    }

    const now = new Date();

    // 2. Record formal dispute decision
    const [decision] = await db
      .insert(disputeDecisions)
      .values({
        disputeId: dispute.id,
        adminId,
        formalRuling: input.formalRuling,
        payoutAmountStudent: input.payoutAmountStudent,
        refundAmountEmployer: input.refundAmountEmployer,
      })
      .returning();

    // 3. Execute double-entry ledger settlements
    if (input.payoutAmountStudent > 0) {
      // Create student payout record
      await db.insert(payouts).values({
        contractMilestoneId: milestone.id,
        recipientId: contract.studentId,
        grossAmount: input.payoutAmountStudent,
        feeDeducted: 0,
        netAmount: input.payoutAmountStudent,
        status: 'completed',
        providerPayoutId: `payout_arbitration_${Date.now()}`,
        processedAt: now,
      });

      // Ledger: Escrow -> Student Wallet
      await db.insert(ledgerEntries).values({
        contractId: contract.id,
        debitAccount: 'sandbox_escrow',
        creditAccount: 'student_wallet',
        amount: input.payoutAmountStudent,
        entryType: 'milestone_payout',
        description: `Arbitration ruling payout to student contractor (Dispute: ${dispute.id})`,
      });
    }

    if (input.refundAmountEmployer > 0) {
      // Ledger: Escrow -> Employer Account (Refund)
      await db.insert(ledgerEntries).values({
        contractId: contract.id,
        debitAccount: 'sandbox_escrow',
        creditAccount: 'employer_account',
        amount: input.refundAmountEmployer,
        entryType: 'refund',
        description: `Arbitration ruling refund to employer (Dispute: ${dispute.id})`,
      });
    }

    // 4. Update milestone status
    await db
      .update(contractMilestones)
      .set({
        status: input.payoutAmountStudent > 0 ? 'paid' : 'approved',
        updatedAt: now,
      })
      .where(eq(contractMilestones.id, milestone.id));

    // 5. Update dispute status
    const [updatedDispute] = await db
      .update(disputes)
      .set({
        status: 'resolved',
        resolutionType: input.resolutionType,
        resolvedAt: now,
      })
      .where(eq(disputes.id, dispute.id))
      .returning();

    // 6. Resume or Complete Contract
    const allMilestones = await db.query.contractMilestones.findMany({
      where: eq(contractMilestones.contractId, contract.id),
    });
    const allDone = allMilestones.every(m => m.id === milestone.id || m.status === 'paid' || m.status === 'approved');

    await db
      .update(contracts)
      .set({
        status: allDone ? 'completed' : 'in_progress',
        completedAt: allDone ? now : null,
        updatedAt: now,
      })
      .where(eq(contracts.id, contract.id));

    // 7. Log immutable audit event
    await db.insert(auditEvents).values({
      actorId: adminId,
      eventType: 'dispute_resolved',
      entityType: 'dispute',
      entityId: dispute.id,
      payload: {
        resolutionType: input.resolutionType,
        payoutAmountStudent: input.payoutAmountStudent,
        refundAmountEmployer: input.refundAmountEmployer,
        contractStatus: allDone ? 'completed' : 'in_progress',
      },
      ipAddress,
    });

    return {
      dispute: updatedDispute,
      decision,
      message: `Dispute resolved successfully via ${input.resolutionType}. Funds released from escrow according to binding arbitration.`,
    };
  }
}
