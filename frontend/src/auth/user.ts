import { User, UserRole } from '../types';

type BackendUser = {
  id: string;
  email: string;
  role: UserRole;
  status: string;
  profile?: Record<string, unknown> | null;
};

/** Turns the API account record into the UI session without inventing profile data. */
export function toMarketplaceUser(
  user: BackendUser,
  providerProfile: Record<string, unknown> = {},
): User {
  const profile = user.profile ?? {};
  const isStudent = user.role === 'student';
  const displayName = String(
    profile.fullName || profile.companyName || providerProfile.fullName || providerProfile.name || user.email.split('@')[0],
  );

  return {
    id: user.id,
    name: displayName,
    email: user.email,
    role: user.role,
    collegeOrCompany: String(isStudent ? profile.collegeName || '' : profile.companyName || ''),
    isVerified: isStudent ? user.status === 'verified' : Boolean(profile.verifiedBadge),
    verificationBadgeText: user.status === 'verified' ? 'Verified account' : 'Verification pending',
    rating: Number(profile.ratingAvg ?? 0),
    completedGigs: Number(profile.completedGigsCount ?? 0),
    avatar: String(providerProfile.avatarUrl || providerProfile.picture || ''),
    balance: 0,
    bio: typeof profile.bio === 'string' && profile.bio ? profile.bio : undefined,
    skills: Array.isArray(profile.skills) ? profile.skills.filter((skill): skill is string => typeof skill === 'string') : [],
    location: typeof profile.location === 'string' && profile.location ? profile.location : undefined,
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
    verificationStatus: user.status === 'pending_verification' 
      ? 'pending' 
      : (isStudent ? (user.status === 'verified' ? 'approved' : 'none') : (profile.verifiedBadge ? 'approved' : 'none')),
  };
}
