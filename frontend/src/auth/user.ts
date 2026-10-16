import { User, UserRole } from '../types';

type BackendUser = {
  id: string;
  email: string;
  role: UserRole;
  status: string;
  isVerified?: boolean;
  verificationStatus?: 'pending' | 'approved' | 'rejected' | 'none';
  profile?: Record<string, unknown> | null;
};

/** Turns the API account record into the UI session without inventing profile data. */
export function toMarketplaceUser(
  user: BackendUser,
  providerProfile: Record<string, unknown> = {},
): User {
  const profile = user.profile ?? {};
  const isStudent = user.role === 'student';
  const isAdmin = user.role === 'admin';
  const displayName = String(
    profile.fullName || profile.companyName || providerProfile.fullName || providerProfile.name || (isAdmin ? 'Campus Governance Admin' : user.email.split('@')[0]),
  );

  const isVerified = isAdmin
    ? true
    : (user.isVerified !== undefined
      ? Boolean(user.isVerified)
      : (isStudent
        ? user.status === 'verified'
        : Boolean(profile.verifiedBadge)));

  const verificationBadgeText = isAdmin
    ? 'Super Admin'
    : (isVerified
      ? (isStudent ? 'Verified Student' : 'Verified SME Partner')
      : (user.status === 'pending_verification' ? 'Verification pending' : 'Unverified account'));

  const verificationStatus = isAdmin
    ? ('approved' as const)
    : (user.verificationStatus
      ? user.verificationStatus
      : (user.status === 'pending_verification'
        ? ('pending' as const)
        : (isVerified ? ('approved' as const) : ('none' as const))));

  return {
    id: user.id,
    name: displayName,
    email: user.email,
    role: user.role,
    collegeOrCompany: String(isAdmin ? 'Campus Oversight Committee' : (isStudent ? profile.collegeName || '' : profile.companyName || '')),
    isVerified,
    verificationBadgeText,
    rating: Number(profile.ratingAvg ?? 5.0),
    completedGigs: Number(profile.completedGigsCount ?? 0),
    avatar: String(providerProfile.avatarUrl || providerProfile.picture || ''),
    balance: isAdmin ? 500000 : 0,
    bio: typeof profile.bio === 'string' && profile.bio ? profile.bio : (isAdmin ? 'Institutional Governance & Dispute Arbitration Desk' : undefined),
    skills: Array.isArray(profile.skills) ? profile.skills.filter((skill): skill is string => typeof skill === 'string') : [],
    location: typeof profile.location === 'string' && profile.location ? profile.location : (isAdmin ? 'Punjab Regional Hub' : undefined),
    degree: typeof profile.degree === 'string' && profile.degree ? profile.degree : undefined,
    graduationYear: typeof profile.graduationYear === 'number' && profile.graduationYear > 0
      ? profile.graduationYear
      : undefined,
    portfolioLinks: Array.isArray(profile.portfolioLinks) ? profile.portfolioLinks : [],
    availabilityStatus: typeof profile.availabilityStatus === 'string' ? profile.availabilityStatus : undefined,
    rollNumber: typeof profile.rollNumberEncrypted === 'string'
      ? profile.rollNumberEncrypted
      : typeof profile.rollNumber === 'string'
      ? profile.rollNumber
      : undefined,
    businessType: typeof profile.businessType === 'string' ? profile.businessType : undefined,
    website: typeof profile.website === 'string' ? profile.website : undefined,
    phone: typeof profile.contactPhoneEncrypted === 'string' ? profile.contactPhoneEncrypted : undefined,
    address: typeof profile.registeredAddress === 'string' ? profile.registeredAddress : undefined,
    verificationStatus,
  };
}
