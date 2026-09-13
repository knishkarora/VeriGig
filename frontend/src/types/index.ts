export type UserRole = 'student' | 'employer' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  collegeOrCompany: string;
  isVerified: boolean;
  verificationBadgeText?: string;
  rating: number;
  completedGigs: number;
  avatar: string;
  balance: number;
  bio?: string;
  skills?: string[];
  rollNumber?: string;
  gpa?: string;
  location?: string;
}

export type MilestoneStatus = 'locked' | 'active' | 'under_review' | 'completed' | 'in_revision';

export interface DeliverableSubmission {
  submittedAt: string;
  liveUrl: string;
  notes: string;
  repoUrl?: string;
  attachments?: string[];
  feedback?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  percentage: number;
  deadline: string;
  status: MilestoneStatus;
  deliverable?: DeliverableSubmission;
}

export type GigCategory = 
  | 'Web Dev' 
  | 'UI/UX' 
  | 'Graphic Design' 
  | 'Content & Copy' 
  | 'Social Media' 
  | 'Data & Research';

export type GigDuration = 'Under 48 hrs' | '1 week' | '2 weeks' | '1 month';
export type LocationScope = 'Hyper-local (On-Campus)' | 'City-wide' | 'Remote';

export interface MicroGig {
  id: string;
  title: string;
  employerId: string;
  employerName: string;
  employerCompany: string;
  employerVerified: boolean;
  category: GigCategory;
  totalBudget: number;
  paymentType: 'milestone' | 'fixed';
  targetDuration: GigDuration;
  locationScope: LocationScope;
  campusProximity?: string;
  description: string;
  expectedDeliverables: string[];
  requiredSkills: string[];
  preferredColleges: string[];
  status: 'open' | 'in_progress' | 'completed' | 'disputed';
  milestones: Milestone[];
  applicantsCount: number;
  createdAt: string;
  hiredStudentId?: string;
  hiredStudentName?: string;
}

export interface Proposal {
  id: string;
  gigId: string;
  studentId: string;
  studentName: string;
  studentCollege: string;
  studentAvatar: string;
  studentGpa: string;
  matchScore: number;
  coverNote: string;
  bidAmount: number;
  deliveryTimeDays: number;
  portfolioLinks: { label: string; url: string }[];
  status: 'submitted' | 'shortlisted' | 'hired' | 'rejected';
  submittedAt: string;
}

export interface Dispute {
  id: string;
  gigId: string;
  gigTitle: string;
  studentName: string;
  employerName: string;
  raisedBy: 'student' | 'employer';
  reason: string;
  amountInEscrow: number;
  status: 'open' | 'investigating' | 'resolved';
  auditLog: {
    timestamp: string;
    actor: string;
    action: string;
    detail: string;
  }[];
  resolutionSummary?: string;
  resolvedAt?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userType: 'student' | 'sme';
  institutionOrBusiness: string;
  idOrDocNumber: string;
  docImageUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'milestone' | 'applicant' | 'verification' | 'payment' | 'system';
  link?: string;
}
