import { FitBreakdownItem } from '../../db/schema/applications.js';

export interface GigMatchCriteria {
  id: string;
  title: string;
  category: string;
  requiredSkills: string[];
  workMode: 'Hyper-local (On-Campus)' | 'City-wide' | 'Remote';
  city: string;
  preferredColleges?: string[];
  targetDuration: string;
}

export interface StudentMatchProfile {
  id: string;
  fullName: string;
  collegeName: string;
  location: string;
  skills: string[];
  workModePreference: string; // 'remote', 'on_site', 'both'
  availabilityStatus: string; // 'available_now', 'part_time', 'busy', 'unavailable'
  ratingAvg: string | number;
  completedGigsCount: number;
  isVerified: boolean;
}

export interface FitCalculationResult {
  overallScore: number;
  breakdown: FitBreakdownItem[];
  explanation: string[];
}

export class CandidateFitEngine {
  /**
   * Deterministic Explainable Candidate Matching Algorithm
   * Scores applicants based on consented, verifiable attributes:
   * 1. Skill Overlap (40%)
   * 2. Work Mode & Locality Compatibility (25%)
   * 3. Availability & Timeline Fit (20%)
   * 4. Verified Track Record & Quality (15%)
   */
  static calculateFit(
    gig: GigMatchCriteria,
    student: StudentMatchProfile
  ): FitCalculationResult {
    const breakdown: FitBreakdownItem[] = [];
    const explanation: string[] = [];

    // ==========================================
    // 1. Skill Overlap (Weight: 40 points)
    // ==========================================
    const requiredSkills = (gig.requiredSkills || []).map(s => s.trim().toLowerCase());
    const candidateSkills = (student.skills || []).map(s => s.trim().toLowerCase());

    let skillScore = 40;
    if (requiredSkills.length > 0) {
      const matchedSkills: string[] = [];
      const missingSkills: string[] = [];

      for (const req of requiredSkills) {
        const found = candidateSkills.some(
          cs => cs === req || cs.includes(req) || req.includes(cs)
        );
        if (found) {
          // Keep original display case if possible
          matchedSkills.push(req);
        } else {
          missingSkills.push(req);
        }
      }

      const matchRatio = matchedSkills.length / requiredSkills.length;
      skillScore = Math.round(matchRatio * 40);

      const skillDetail = matchedSkills.length === requiredSkills.length
        ? `All ${requiredSkills.length} required skills matched (${matchedSkills.join(', ')})`
        : matchedSkills.length > 0
        ? `${matchedSkills.length} of ${requiredSkills.length} required skills matched (${matchedSkills.join(', ')}); missing: ${missingSkills.join(', ')}`
        : `0 of ${requiredSkills.length} required skills matched; missing: ${missingSkills.join(', ')}`;

      breakdown.push({
        category: 'Skill Overlap',
        score: skillScore,
        maxScore: 40,
        detail: skillDetail,
      });

      explanation.push(skillDetail);
    } else {
      breakdown.push({
        category: 'Skill Overlap',
        score: 40,
        maxScore: 40,
        detail: 'General beginner gig: No specialized prerequisite skills mandatory',
      });
      explanation.push('Open scope: baseline digital competencies sufficient');
    }

    // ==========================================
    // 2. Work Mode & Locality Compatibility (Weight: 25 points)
    // ==========================================
    let locationScore = 0;
    let locationDetail = '';

    const gigCity = (gig.city || 'Ludhiana').trim().toLowerCase();
    const studentLocation = (student.location || '').trim().toLowerCase();
    const studentCollege = (student.collegeName || '').trim().toLowerCase();
    const preferredColleges = (gig.preferredColleges || []).map(c => c.trim().toLowerCase());

    if (gig.workMode === 'Remote') {
      locationScore = 25;
      locationDetail = 'Remote task: fully compatible with online execution';
      explanation.push('Matches remote work mode preference');
    } else {
      // Gig is On-Campus or City-wide
      if (student.workModePreference === 'remote') {
        locationScore = 0;
        locationDetail = `Work mode mismatch: Gig requires on-site attendance in ${gig.city}, but candidate prefers remote-only`;
        explanation.push(`Location mismatch: requires physical attendance in ${gig.city}`);
      } else {
        const isCityMatch = studentLocation.includes(gigCity) || gigCity.includes(studentLocation);
        const isCollegeMatch = preferredColleges.some(pc => studentCollege.includes(pc) || pc.includes(studentCollege));

        if (isCollegeMatch || (gig.workMode === 'Hyper-local (On-Campus)' && isCityMatch)) {
          locationScore = 25;
          locationDetail = `Direct campus & hyper-local match in ${gig.city} (${student.collegeName})`;
          explanation.push(`Local campus alignment: located at ${student.collegeName} in ${gig.city}`);
        } else if (isCityMatch) {
          locationScore = 25;
          locationDetail = `City-wide match: student is resident in ${gig.city}`;
          explanation.push(`Matches city requirement: resident in ${gig.city}`);
        } else {
          locationScore = 10;
          locationDetail = `Regional candidate located in ${student.location}; outside primary ${gig.city} perimeter`;
          explanation.push(`Regional proximity: located in ${student.location} (commute required for ${gig.city})`);
        }
      }
    }

    breakdown.push({
      category: 'Work Mode & Locality',
      score: locationScore,
      maxScore: 25,
      detail: locationDetail,
    });

    // ==========================================
    // 3. Availability & Timeline Fit (Weight: 20 points)
    // ==========================================
    let availabilityScore = 15;
    let availabilityDetail = '';

    const avail = student.availabilityStatus || 'available_now';
    if (avail === 'available_now') {
      availabilityScore = 20;
      availabilityDetail = 'Immediate availability: Student is ready to start project immediately';
      explanation.push('Available immediately for task kickoff');
    } else if (avail === 'part_time') {
      availabilityScore = 15;
      availabilityDetail = 'Part-time schedule: compatible with milestone duration';
      explanation.push('Part-time availability suitable for milestone timeline');
    } else if (avail === 'busy') {
      availabilityScore = 8;
      availabilityDetail = 'Candidate has other ongoing commitments or active gigs';
      explanation.push('Candidate marked as busy (potential scheduling delay)');
    } else {
      availabilityScore = 5;
      availabilityDetail = 'Candidate is marked unavailable';
      explanation.push('Candidate currently marked unavailable');
    }

    breakdown.push({
      category: 'Availability',
      score: availabilityScore,
      maxScore: 20,
      detail: availabilityDetail,
    });

    // ==========================================
    // 4. Verified Track Record & Quality (Weight: 15 points)
    // ==========================================
    let trackScore = 0;
    const verificationPoints = student.isVerified ? 5 : 0;
    const completedGigs = student.completedGigsCount || 0;
    const gigsPoints = Math.min(5, Math.round(completedGigs * 2.5));

    const ratingVal = typeof student.ratingAvg === 'string'
      ? parseFloat(student.ratingAvg) || 5.0
      : student.ratingAvg || 5.0;

    let ratingPoints = 5;
    if (completedGigs > 0) {
      if (ratingVal >= 4.5) ratingPoints = 5;
      else if (ratingVal >= 4.0) ratingPoints = 3;
      else ratingPoints = 1;
    } else {
      // First-time beginner gets 4 benefit-of-doubt points
      ratingPoints = 4;
    }

    trackScore = verificationPoints + gigsPoints + ratingPoints;
    const trackDetail = student.isVerified
      ? `Verified student ID; ${completedGigs} completed gig(s) with ${ratingVal.toFixed(1)} avg rating`
      : `Unverified student account; ${completedGigs} completed gig(s)`;

    breakdown.push({
      category: 'Verified Reputation',
      score: trackScore,
      maxScore: 15,
      detail: trackDetail,
    });

    if (student.isVerified && completedGigs > 0) {
      explanation.push(`Verified track record: ${completedGigs} completed micro-gig(s) with ${ratingVal.toFixed(1)} rating`);
    } else if (student.isVerified) {
      explanation.push('Verified college student with verified academic credentials');
    }

    // ==========================================
    // Overall Sum & Normalization
    // ==========================================
    const totalRaw = skillScore + locationScore + availabilityScore + trackScore;
    const overallScore = Math.min(100, Math.max(0, totalRaw));

    return {
      overallScore,
      breakdown,
      explanation,
    };
  }
}
