import { api } from './client';

// ==========================================
// AUTH & PROFILES
// ==========================================

export const authApi = {
  register: (data: { email: string; password: string; role: 'student' | 'employer' | 'admin' }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get<any>('/auth/me'),
};

export const profilesApi = {
  getStudentProfile: (userId: string) => api.get<any>(`/profiles/student/${userId}`),
  updateStudentProfile: (data: any) => api.patch<any>('/profiles/student', data),
  getBusinessProfile: (userId: string) => api.get<any>(`/profiles/business/${userId}`),
  updateBusinessProfile: (data: any) => api.patch<any>('/profiles/business', data),
  recordConsent: (data: { consentType: string; isGranted: boolean; policyVersion: string }) =>
    api.post('/profiles/consent', data),
  deleteAccount: () => api.delete('/profiles/me'),
};

// ==========================================
// VERIFICATIONS
// ==========================================

export const verificationApi = {
  submitRequest: (formData: FormData) => api.post<any>('/verifications/request', formData),
  getAdminQueue: (status?: string) => api.get<any>(`/verifications/admin/queue${status ? `?status=${status}` : ''}`),
  decideVerification: (id: string, data: { status: 'approved' | 'rejected'; rejectionReason?: string }) =>
    api.post(`/verifications/admin/${id}/decision`, data),
};

// ==========================================
// GIGS & MODERATION
// ==========================================

export const gigsApi = {
  listGigs: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') query.append(key, String(val));
      });
    }
    const qStr = query.toString();
    return api.get<any>(`/gigs${qStr ? `?${qStr}` : ''}`);
  },
  getGigById: (id: string) => api.get<any>(`/gigs/${id}`),
  createGig: (data: any) => api.post<any>('/gigs', data),
  getAdminPending: () => api.get<any>('/gigs/admin/pending'),
  moderateGig: (id: string, data: { action: 'approve' | 'reject'; notes?: string }) =>
    api.post(`/gigs/admin/${id}/moderate`, data),
};

// ==========================================
// APPLICATIONS & MATCHING
// ==========================================

export const applicationsApi = {
  applyForGig: (gigId: string, data: { coverNote: string; proposedTimeline?: string; portfolioItems?: any[] }) =>
    api.post<any>(`/gigs/${gigId}/apply`, data),
  getStudentApplications: () => api.get<any>('/student/applications'),
  getGigApplicants: (gigId: string) => api.get<any>(`/gigs/${gigId}/applications`),
  updateApplicantStatus: (id: string, data: { status: string; rejectionReason?: string }) =>
    api.patch<any>(`/applications/${id}/status`, data),
  scheduleInterview: (id: string, data: { scheduledAt: string; meetingLinkOrInstructions: string; notes?: string }) =>
    api.post<any>(`/applications/${id}/schedule-interview`, data),
};

// ==========================================
// CONTRACTS & MILESTONES
// ==========================================

export const contractsApi = {
  createOffer: (data: { gigId: string; applicationId: string }) =>
    api.post<any>('/contracts/create-offer', data),
  acceptScope: (contractId: string, data: { confidentialityAccepted: boolean; ipClauseAccepted: boolean }) =>
    api.post<any>(`/contracts/${contractId}/accept-scope`, data),
  getContractById: (contractId: string) => api.get<any>(`/contracts/${contractId}`),
  getUserContracts: () => api.get<any>('/contracts'),
  submitDeliverable: (contractId: string, milestoneId: string, data: { notes: string; liveUrl?: string; repositoryUrl?: string }) =>
    api.post<any>(`/contracts/${contractId}/milestones/${milestoneId}/submit`, data),
  requestRevision: (contractId: string, milestoneId: string, data: { feedback: string }) =>
    api.post<any>(`/contracts/${contractId}/milestones/${milestoneId}/request-revision`, data),
  approveMilestone: (contractId: string, milestoneId: string, data?: { feedback?: string }) =>
    api.post<any>(`/contracts/${contractId}/milestones/${milestoneId}/approve`, data || {}),
};

// ==========================================
// PAYMENTS & ESCROW
// ==========================================

export const paymentsApi = {
  createOrder: (contractId: string) =>
    api.post<any>('/payments/create-order', { contractId }),
  simulateWebhookCapture: (paymentIntentId: string, orderId: string, amount: number) =>
    api.post<any>('/payments/webhook', {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: `pay_sim_${Date.now()}`,
            order_id: orderId,
            amount: amount * 100,
            status: 'captured',
          },
        },
      },
    }),
  releasePayout: (contractMilestoneId: string) =>
    api.post<any>('/payments/release-payout', { contractMilestoneId }),
  getReceipt: (contractId: string) =>
    api.get<any>(`/payments/receipt/${contractId}`),
  getStudentEarnings: () =>
    api.get<any>('/payments/student/earnings'),
};

// ==========================================
// DISPUTES & ARBITRATION
// ==========================================

export const disputesApi = {
  raiseDispute: (contractId: string, data: { milestoneId: string; reasonCategory: string; explanation: string }) =>
    api.post<any>(`/contracts/${contractId}/disputes/raise`, data),
  submitEvidence: (disputeId: string, data: { note: string; fileReference?: string }) =>
    api.post<any>(`/disputes/${disputeId}/evidence`, data),
  getDisputeDossier: (disputeId: string) =>
    api.get<any>(`/disputes/${disputeId}`),
  listAdminDisputes: (status?: string) =>
    api.get<any>(`/admin/disputes${status ? `?status=${status}` : ''}`),
  resolveDispute: (disputeId: string, data: { formalRuling: string; payoutAmountStudent: number; refundAmountEmployer: number }) =>
    api.post<any>(`/admin/disputes/${disputeId}/resolve`, data),
};

// ==========================================
// REVIEWS & COMPLETION PROOF
// ==========================================

export const reviewsApi = {
  submitReview: (data: { contractId: string; revieweeId: string; rating: number; feedback: string; skillsEndorsed?: string[] }) =>
    api.post<any>('/reviews', data),
  getContractReviews: (contractId: string) =>
    api.get<any>(`/reviews/contract/${contractId}`),
  getUserReviews: (userId: string) =>
    api.get<any>(`/reviews/user/${userId}`),
  generateCertificate: (contractId: string) =>
    api.post<any>(`/reviews/completion-records/generate/${contractId}`),
  getPublicCertificate: (hash: string) =>
    api.get<any>(`/verify/completion/${hash}`),
};

// ==========================================
// IN-APP MESSAGING
// ==========================================

export const messagingApi = {
  getOrCreateConversation: (data: { contextType: 'gig' | 'application' | 'contract'; contextId: string; recipientId: string }) =>
    api.post<any>('/messaging/conversations', data),
  listConversations: () =>
    api.get<any>('/messaging/conversations'),
  sendMessage: (conversationId: string, data: { messageText: string; attachmentUrl?: string }) =>
    api.post<any>(`/messaging/conversations/${conversationId}/messages`, data),
  getMessages: (conversationId: string, after?: string) =>
    api.get<any>(`/messaging/conversations/${conversationId}/messages${after ? `?after=${after}` : ''}`),
};
