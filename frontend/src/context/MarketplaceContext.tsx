import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
import { gigsApi, authApi } from '../api/endpoints';
import { supabase, OAUTH_PENDING_ROLE_KEY } from '../api/supabase';
import { toMarketplaceUser } from '../auth/user';

interface MarketplaceContextType {
  currentRole: UserRole;
  currentUser: User;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  loginUser: (userData: User) => void;
  isAuthInitializing: boolean;
  authError: string | null;
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
  addOrUpdateGig: (gig: MicroGig) => void;
  submitProposal: (gigId: string, coverNote: string, bidAmount: number, deliveryTimeDays: number, portfolioLinks: { label: string; url: string }[]) => void;
  hireApplicant: (proposalId: string) => void;
  shortlistApplicant: (proposalId: string) => void;
  submitDeliverable: (gigId: string, milestoneId: string, data: { liveUrl: string; repoUrl?: string; notes: string }) => void;
  approveMilestone: (gigId: string, milestoneId: string, feedback?: string) => void;
  requestRevision: (gigId: string, milestoneId: string, feedback: string) => void;
  approveVerification: (id: string) => void;
  rejectVerification: (id: string, reason: string) => void;
  resolveDispute: (id: string, resolution: 'release_student' | 'refund_employer' | 'split_payout', note: string) => void;
  updateCurrentUser: (userData: Partial<User>) => void;
  submitVerificationRequest: (req: { institutionOrBusiness: string; idOrDocNumber: string; docImageUrl?: string; userType: 'student' | 'sme' }) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize role and user from localStorage if saved
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('verigig_session_role');
      return (saved as UserRole) || 'guest';
    } catch {
      return 'guest';
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const savedUser = localStorage.getItem('verigig_session_user');
      if (savedUser) return JSON.parse(savedUser);
      return mockUsers.guest;
    } catch {
      return mockUsers.guest;
    }
  });

  const [gigs, setGigs] = useState<MicroGig[]>(initialGigs);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [verifications, setVerifications] = useState<VerificationRequest[]>(initialVerifications);
  const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isAuthInitializing, setIsAuthInitializing] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState<string | null>(null);
  const handledSupabaseTokens = useRef(new Set<string>());

  // Sync live gigs from backend if Fastify server is reachable
  useEffect(() => {
    let active = true;
    const fetchLiveGigs = async () => {
      try {
        const res = await gigsApi.listGigs();
        if (active && res && res.gigs && res.gigs.length > 0) {
          const backendGigs: MicroGig[] = res.gigs.map((g: any) => ({
            id: g.id,
            title: g.title,
            employerId: g.employerId,
            employerName: g.employerName || 'Verified SME Client',
            employerCompany: g.employerCompany || 'SME Business',
            employerVerified: true,
            category: g.category,
            totalBudget: g.totalBudget,
            paymentType: g.paymentType || 'milestone',
            targetDuration: g.targetDuration || '1 week',
            locationScope: g.workMode || 'Remote',
            campusProximity: g.campusProximity || 'Within 5 km radius',
            description: g.description,
            expectedDeliverables: g.expectedDeliverables || ['Complete project criteria'],
            requiredSkills: g.requiredSkills || ['React', 'TypeScript'],
            preferredColleges: g.preferredColleges || ['PCTE Group of Institutes'],
            status: g.status || 'open',
            createdAt: g.createdAt || 'Today',
            milestones: g.milestones || [
              { id: `ms-${g.id}-1`, title: 'Milestone 1: Deliverables', description: 'Complete work criteria', amount: g.totalBudget, percentage: 100, status: 'active' }
            ]
          }));
          
          setGigs(backendGigs);
        }
      } catch (err) {
        // Fallback to initial mock gigs
      }
    };

    fetchLiveGigs();
    return () => { active = false; };
  }, []);

  // Global Supabase session synchronization. The backend validates the Supabase
  // access token and owns the VeriGig account/session, so OAuth and email use
  // the same profile record and authorization model.
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    let isMounted = true;

    const handleUserSession = async (session: any) => {
      if (!session?.user || !isMounted) return;

      if (handledSupabaseTokens.current.has(session.access_token)) return;
      handledSupabaseTokens.current.add(session.access_token);
      setIsAuthInitializing(true);
      setAuthError(null);

      const pendingRole = localStorage.getItem(OAUTH_PENDING_ROLE_KEY) as UserRole | null;
      const meta = session.user.user_metadata || {};
      try {
        const result = await authApi.continueWithGoogle({
          accessToken: session.access_token,
          requestedRole: pendingRole === 'employer' ? 'employer' : 'student',
        });
        if (!isMounted) return;

        const liveUser = toMarketplaceUser(result.user, {
          fullName: meta.full_name || meta.name,
          avatarUrl: meta.avatar_url || meta.picture,
        });
        setCurrentRole(liveUser.role);
        setCurrentUser(liveUser);
        if (result?.token) {
          localStorage.setItem('verigig_auth_token', result.token);
        }
        localStorage.removeItem(OAUTH_PENDING_ROLE_KEY);
        localStorage.setItem('verigig_session_role', liveUser.role);
        localStorage.setItem('verigig_session_user', JSON.stringify(liveUser));
        setAuthError(null);
      } catch {
        if (isMounted) {
          setAuthError('Google verified your identity, but VeriGig could not finish creating your account. Please try again or contact support.');
        }
      } finally {
        if (isMounted) setIsAuthInitializing(false);
      }

      // Clean URL params (e.g. ?code=...) without reloading
      if (window.location.search.includes('code=') || window.location.hash.includes('access_token=')) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    const syncSession = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        // If returning with PKCE code, exchange for session directly
        if (searchParams.has('code')) {
          const { data, error } = await client.auth.exchangeCodeForSession(window.location.href);
          if (!error && data?.session) {
            await handleUserSession(data.session);
            return;
          }
        }

        const { data: { session } } = await client.auth.getSession();
        if (session?.user) {
          await handleUserSession(session);
        }
      } catch (err) {
        console.warn('Supabase global session sync error:', err);
        if (isMounted) setAuthError('We could not complete the Google sign-in. Please try again.');
      } finally {
        if (isMounted) setIsAuthInitializing(false);
      }
    };

    syncSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user && isMounted) {
        void handleUserSession(session);
      } else if (event === 'SIGNED_OUT' && isMounted) {
        setCurrentRole('guest');
        setCurrentUser(mockUsers.guest);
        localStorage.removeItem('verigig_session_role');
        localStorage.removeItem('verigig_session_user');
        setIsAuthInitializing(false);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    const user = mockUsers[role] || mockUsers.guest;
    setCurrentUser(user);
    try {
      localStorage.setItem('verigig_session_role', role);
      localStorage.setItem('verigig_session_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const loginUser = (userData: User) => {
    setCurrentRole(userData.role);
    setCurrentUser(userData);
    try {
      localStorage.setItem('verigig_session_role', userData.role);
      localStorage.setItem('verigig_session_user', JSON.stringify(userData));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setCurrentRole('guest');
    setCurrentUser(mockUsers.guest);
    try {
      localStorage.removeItem('verigig_session_role');
      localStorage.removeItem('verigig_session_user');
      localStorage.removeItem('verigig_auth_token');
      authApi.logout().catch(() => {});
      supabase?.auth.signOut().catch(() => {});
    } catch {
      // ignore
    }
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

  const addOrUpdateGig = (gig: MicroGig) => {
    setGigs(prev => {
      const idx = prev.findIndex(g => g.id === gig.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...gig };
        return next;
      }
      return [gig, ...prev];
    });
  };

  const postGig = (newGigData: Partial<MicroGig> & { title: string; category: MicroGig['category']; totalBudget: number; milestones: Milestone[] }): string => {
    const gigId = newGigData.id || `gig-${Date.now()}`;
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
      milestones: (newGigData.milestones || []).map((ms, idx) => ({
        ...ms,
        status: idx === 0 ? 'active' : 'locked'
      }))
    };

    setGigs(prev => {
      const existingIdx = prev.findIndex(g => g.id === gigId);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = newGig;
        return next;
      }
      return [newGig, ...prev];
    });
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
      studentAvatar: currentUser.avatar || '',
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

  const updateCurrentUser = (partialUser: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...partialUser };
      try {
        localStorage.setItem('verigig_session_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const submitVerificationRequest = (req: {
    institutionOrBusiness: string;
    idOrDocNumber: string;
    docImageUrl?: string;
    userType: 'student' | 'sme';
  }) => {
    const newReq: VerificationRequest = {
      id: `verif-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userType: req.userType,
      institutionOrBusiness: req.institutionOrBusiness,
      idOrDocNumber: req.idOrDocNumber,
      docImageUrl: req.docImageUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      submittedAt: 'Just now',
      status: 'pending',
    };

    setVerifications(prev => [newReq, ...prev]);
    updateCurrentUser({
      verificationStatus: 'pending',
      verificationBadgeText: 'Verification pending',
    });
    addNotification(
      'Verification Under Review',
      `${req.userType === 'sme' ? 'Business registration (GSTIN/Udyam)' : 'Student ID'} credentials submitted for admin review.`,
      'verification',
      currentUser.role === 'employer' ? '/app/employer/profile' : '/app/student/profile'
    );
  };

  const approveVerification = (id: string) => {
    setVerifications(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, status: 'approved' as const } : v);
      const target = prev.find(v => v.id === id);
      if (target && target.userId === currentUser.id) {
        updateCurrentUser({
          isVerified: true,
          verificationStatus: 'approved',
          verificationBadgeText: target.userType === 'sme' ? 'Verified SME Partner' : 'Verified Student',
        });
      }
      return updated;
    });
    addNotification('Verification Approved', 'College ID / Business registration proof has been verified.', 'verification', '/app/admin/verifications');
  };

  const rejectVerification = (id: string, reason: string) => {
    setVerifications(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, status: 'rejected' as const, rejectionReason: reason } : v);
      const target = prev.find(v => v.id === id);
      if (target && target.userId === currentUser.id) {
        updateCurrentUser({
          verificationStatus: 'rejected',
          verificationBadgeText: 'Verification rejected',
        });
      }
      return updated;
    });
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
      logout,
      loginUser,
      isAuthInitializing,
      authError,
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
      addOrUpdateGig,
      submitProposal,
      hireApplicant,
      shortlistApplicant,
      submitDeliverable,
      approveMilestone,
      requestRevision,
      approveVerification,
      rejectVerification,
      resolveDispute,
      updateCurrentUser,
      submitVerificationRequest,
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
