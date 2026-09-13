import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  UserRole, 
  MicroGig, 
  Proposal, 
  Dispute, 
  VerificationRequest, 
  NotificationItem,
  Milestone
} from '../types';
import { 
  mockUsers, 
  initialGigs, 
  initialProposals, 
  initialVerifications, 
  initialDisputes, 
  initialNotifications 
} from '../data/mockData';

interface MarketplaceContextType {
  currentRole: UserRole;
  currentUser: User;
  switchRole: (role: UserRole) => void;
  gigs: MicroGig[];
  proposals: Proposal[];
  verifications: VerificationRequest[];
  disputes: Dispute[];
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type'], link?: string) => void;
  postGig: (gig: Partial<MicroGig> & { title: string; category: MicroGig['category']; totalBudget: number; milestones: Milestone[] }) => string;
  submitProposal: (gigId: string, coverNote: string, bidAmount: number, deliveryTimeDays: number, portfolioLinks: { label: string; url: string }[]) => void;
  hireApplicant: (proposalId: string) => void;
  shortlistApplicant: (proposalId: string) => void;
  submitDeliverable: (gigId: string, milestoneId: string, data: { liveUrl: string; repoUrl?: string; notes: string }) => void;
  approveMilestone: (gigId: string, milestoneId: string, feedback?: string) => void;
  requestRevision: (gigId: string, milestoneId: string, feedback: string) => void;
  approveVerification: (id: string) => void;
  rejectVerification: (id: string, reason: string) => void;
  resolveDispute: (id: string, resolution: 'release_student' | 'refund_employer' | 'split_payout', note: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.guest);
  const [gigs, setGigs] = useState<MicroGig[]>(initialGigs);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [verifications, setVerifications] = useState<VerificationRequest[]>(initialVerifications);
  const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser(mockUsers[role] || mockUsers.guest);
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type'], link?: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type,
      link,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const postGig = (newGigData: Partial<MicroGig> & { title: string; category: MicroGig['category']; totalBudget: number; milestones: Milestone[] }): string => {
    const gigId = `gig-${Date.now()}`;
    const newGig: MicroGig = {
      id: gigId,
      title: newGigData.title,
      employerId: currentUser.id,
      employerName: currentUser.name,
      employerCompany: currentUser.collegeOrCompany || 'Local SME',
      employerVerified: currentUser.isVerified,
      category: newGigData.category,
      totalBudget: newGigData.totalBudget,
      paymentType: newGigData.paymentType || 'milestone',
      targetDuration: newGigData.targetDuration || '1 week',
      locationScope: newGigData.locationScope || 'City-wide',
      campusProximity: newGigData.campusProximity || 'Within 5 km radius',
      description: newGigData.description || 'Task description for local college students.',
      expectedDeliverables: newGigData.expectedDeliverables || ['Complete task as requested'],
      requiredSkills: newGigData.requiredSkills || ['Quick Learner'],
      preferredColleges: newGigData.preferredColleges || ['PCTE', 'GNDEC', 'Any Local Campus'],
      status: 'open',
      applicantsCount: 0,
      createdAt: 'Just now',
      milestones: newGigData.milestones.map((ms, idx) => ({
        ...ms,
        status: idx === 0 ? 'active' : 'locked'
      }))
    };

    setGigs(prev => [newGig, ...prev]);
    addNotification('New Gig Published', `Your gig "${newGig.title}" is now visible to campus talent!`, 'system', `/app/student/gig/${gigId}`);
    return gigId;
  };

  const submitProposal = (gigId: string, coverNote: string, bidAmount: number, deliveryTimeDays: number, portfolioLinks: { label: string; url: string }[]) => {
    const gig = gigs.find(g => g.id === gigId);
    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      gigId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentCollege: currentUser.collegeOrCompany,
      studentAvatar: currentUser.avatar,
      studentGpa: currentUser.gpa || '8.8 GPA',
      matchScore: 95,
      coverNote,
      bidAmount,
      deliveryTimeDays,
      portfolioLinks,
      status: 'submitted',
      submittedAt: 'Just now'
    };

    setProposals(prev => [newProp, ...prev]);
    setGigs(prev => prev.map(g => g.id === gigId ? { ...g, applicantsCount: g.applicantsCount + 1 } : g));
    addNotification('Proposal Submitted', `You applied to "${gig?.title || 'Micro-gig'}". The business will review your profile.`, 'applicant', `/app/student/gig/${gigId}`);
  };

  const shortlistApplicant = (proposalId: string) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'shortlisted' } : p));
  };

  const hireApplicant = (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'hired' } : p));
    setGigs(prev => prev.map(g => {
      if (g.id === proposal.gigId) {
        return {
          ...g,
          status: 'in_progress',
          hiredStudentId: proposal.studentId,
          hiredStudentName: proposal.studentName,
          milestones: g.milestones.map((ms, idx) => idx === 0 ? { ...ms, status: 'active' } : ms)
        };
      }
      return g;
    }));

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    addNotification('Candidate Hired & Escrow Funded', `You hired ${proposal.studentName}! Milestone 1 is active.`, 'milestone', `/app/employer/workspace/${proposal.gigId}`);
  };

  const submitDeliverable = (gigId: string, milestoneId: string, data: { liveUrl: string; repoUrl?: string; notes: string }) => {
    setGigs(prev => prev.map(g => {
      if (g.id === gigId) {
        const updatedMilestones = g.milestones.map(ms => {
          if (ms.id === milestoneId) {
            return {
              ...ms,
              status: 'under_review' as const,
              deliverable: {
                submittedAt: 'Just now',
                liveUrl: data.liveUrl,
                repoUrl: data.repoUrl,
                notes: data.notes
              }
            };
          }
          return ms;
        });
        return { ...g, milestones: updatedMilestones };
      }
      return g;
    }));

    addNotification('Deliverable Sent for Review', 'Your milestone deliverable has been sent to the employer for sign-off.', 'milestone', `/app/student/workspace/${gigId}`);
  };

  const approveMilestone = (gigId: string, milestoneId: string, feedback?: string) => {
    let completedAmount = 0;
    setGigs(prev => prev.map(g => {
      if (g.id === gigId) {
        let foundIndex = -1;
        const updatedMilestones = g.milestones.map((ms, idx) => {
          if (ms.id === milestoneId) {
            foundIndex = idx;
            completedAmount = ms.amount;
            return {
              ...ms,
              status: 'completed' as const,
              deliverable: ms.deliverable ? { ...ms.deliverable, feedback: feedback || 'Approved & Escrow Released!' } : undefined
            };
          }
          return ms;
        });

        // Unlock next milestone if available
        if (foundIndex >= 0 && foundIndex + 1 < updatedMilestones.length) {
          if (updatedMilestones[foundIndex + 1].status === 'locked') {
            updatedMilestones[foundIndex + 1] = {
              ...updatedMilestones[foundIndex + 1],
              status: 'active'
            };
          }
        }

        const allDone = updatedMilestones.every(m => m.status === 'completed');
        return {
          ...g,
          status: allDone ? 'completed' : g.status,
          milestones: updatedMilestones
        };
      }
      return g;
    }));

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    addNotification('Milestone Approved & Payout Released', `₹${completedAmount.toLocaleString()} has been released from escrow!`, 'payment', `/app/employer/workspace/${gigId}`);
  };

  const requestRevision = (gigId: string, milestoneId: string, feedback: string) => {
    setGigs(prev => prev.map(g => {
      if (g.id === gigId) {
        const updatedMilestones = g.milestones.map(ms => {
          if (ms.id === milestoneId) {
            return {
              ...ms,
              status: 'in_revision' as const,
              deliverable: ms.deliverable ? { ...ms.deliverable, feedback } : undefined
            };
          }
          return ms;
        });
        return { ...g, milestones: updatedMilestones };
      }
      return g;
    }));

    addNotification('Revision Requested', 'Structured revision feedback was sent to the student.', 'milestone', `/app/employer/workspace/${gigId}`);
  };

  const approveVerification = (id: string) => {
    setVerifications(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
    addNotification('Verification Approved', 'College ID / Business registration proof has been verified.', 'verification', '/app/admin/verifications');
  };

  const rejectVerification = (id: string, reason: string) => {
    setVerifications(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected', rejectionReason: reason } : v));
    addNotification('Verification Rejected', `Rejected: ${reason}`, 'verification', '/app/admin/verifications');
  };

  const resolveDispute = (id: string, resolution: 'release_student' | 'refund_employer' | 'split_payout', note: string) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === id) {
        const resolutionSummary = resolution === 'release_student' 
          ? `Funds fully released to student. Note: ${note}`
          : resolution === 'refund_employer'
          ? `Funds fully refunded to employer. Note: ${note}`
          : `Funds split 50/50 between student and employer. Note: ${note}`;

        return {
          ...d,
          status: 'resolved',
          resolutionSummary,
          resolvedAt: 'Just now',
          auditLog: [
            ...d.auditLog,
            {
              timestamp: 'Just now',
              actor: 'Governance Admin',
              action: 'Dispute Resolved',
              detail: resolutionSummary
            }
          ]
        };
      }
      return d;
    }));

    addNotification('Dispute Case Settled', `Dispute ${id} was resolved by Admin.`, 'system', '/app/admin/disputes');
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <MarketplaceContext.Provider value={{
      currentRole,
      currentUser,
      switchRole,
      gigs,
      proposals,
      verifications,
      disputes,
      notifications,
      unreadNotifCount,
      markNotificationRead,
      markAllNotificationsRead,
      addNotification,
      postGig,
      submitProposal,
      hireApplicant,
      shortlistApplicant,
      submitDeliverable,
      approveMilestone,
      requestRevision,
      approveVerification,
      rejectVerification,
      resolveDispute,
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
