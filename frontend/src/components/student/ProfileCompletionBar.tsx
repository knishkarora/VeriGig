import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  X, 
  ShieldCheck, 
  Award,
  ChevronRight
} from 'lucide-react';
import { User } from '../../types';

interface ProfileCompletionBarProps {
  user: User;
  onOpenEdit: () => void;
}

interface ChecklistItem {
  key: string;
  label: string;
  weight: number;
  isComplete: boolean;
}

export const ProfileCompletionBar: React.FC<ProfileCompletionBarProps> = ({ user, onOpenEdit }) => {
  const storageKey = `verigig_profile_100_dismissed_${user.id || user.email}`;
  
  // Check if previously celebrated & dismissed
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });

  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  useBodyScrollLock(showCelebrationModal);

  // Calculate score breakdown
  const checklist = useMemo<ChecklistItem[]>(() => {
    const hasName = Boolean(user.name && user.name.trim().length > 0);
    const hasCollege = Boolean(user.collegeOrCompany && user.collegeOrCompany.trim().length > 0);
    const hasRollNumber = Boolean(user.rollNumber && user.rollNumber.trim().length > 0);
    const hasBio = Boolean(user.bio && user.bio.trim().length >= 10);
    const hasSkills = Boolean(Array.isArray(user.skills) && user.skills.length > 0);
    const hasDegreeOrPortfolio = Boolean(
      user.degree || 
      user.graduationYear || 
      (Array.isArray(user.portfolioLinks) && user.portfolioLinks.length > 0)
    );

    return [
      { key: 'name', label: 'Full Name', weight: 15, isComplete: hasName },
      { key: 'college', label: 'Partner Campus', weight: 20, isComplete: hasCollege },
      { key: 'roll', label: 'University Roll Number', weight: 15, isComplete: hasRollNumber },
      { key: 'bio', label: 'Bio / Summary', weight: 15, isComplete: hasBio },
      { key: 'skills', label: 'Technical Skills', weight: 15, isComplete: hasSkills },
      { key: 'academic', label: 'Degree / Portfolio', weight: 10, isComplete: hasDegreeOrPortfolio },
    ];
  }, [user]);

  // Total student-fillable score (max 90)
  const userFieldsScore = useMemo(() => {
    return checklist.reduce((acc, item) => (item.isComplete ? acc + item.weight : acc), 0);
  }, [checklist]);

  const allUserFieldsComplete = checklist.every((item) => item.isComplete);
  const isVerified = Boolean(user.isVerified);

  // Final score logic:
  // If all fields completed AND verified -> 100%
  // If all fields completed but not verified -> 90% (capped at 90% with "verification pending")
  // Otherwise -> sum of completed fields (capped at 90% max while unverified)
  const finalScore = useMemo(() => {
    if (allUserFieldsComplete && isVerified) {
      return 100;
    }
    if (allUserFieldsComplete && !isVerified) {
      return 90;
    }
    return Math.min(90, userFieldsScore + (isVerified ? 10 : 0));
  }, [allUserFieldsComplete, isVerified, userFieldsScore]);

  // Trigger celebration modal when 100% is reached and not yet dismissed
  useEffect(() => {
    if (finalScore === 100 && !isDismissed) {
      setShowCelebrationModal(true);
    }
  }, [finalScore, isDismissed]);

  const handleDismissCelebration = () => {
    try {
      localStorage.setItem(storageKey, 'true');
    } catch {
      // ignore
    }
    setIsDismissed(true);
    setShowCelebrationModal(false);
  };

  // If already at 100% and user dismissed it, completely remove the slider from the page
  if (finalScore === 100 && isDismissed) {
    return null;
  }

  const pointerLeft = Math.max(4, Math.min(96, finalScore));
  const missingItems = checklist.filter((item) => !item.isComplete);

  return (
    <>
      <div className="p-6 sm:p-7 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] space-y-5">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
                <Sparkles size={16} />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#121214]">
                Profile Completion Score
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                finalScore === 100
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : finalScore >= 90
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                {finalScore}%
              </span>
            </div>

            {/* Status explanation */}
            {finalScore === 90 && !isVerified ? (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 pt-0.5">
                <Clock size={14} className="shrink-0" />
                <span>Verification Pending — Your academic details are complete. Waiting for campus verification to unlock 100%.</span>
              </div>
            ) : finalScore === 100 ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 pt-0.5">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>100% Verified Profile — All campus credentials confirmed by regional partner institution.</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-medium pt-0.5">
                Complete your verified student profile to unlock priority matching with local businesses.
              </p>
            )}
          </div>

          {/* Action button */}
          {finalScore < 100 && (
            <button
              onClick={onOpenEdit}
              className="px-5 py-2.5 rounded-2xl bg-[#121214] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Edit3 size={14} className="text-[#D4F851]" />
              <span>Complete Your Profile</span>
            </button>
          )}
        </div>

        {/* Linear Gradient Slider with Pointer */}
        <div className="pt-6 pb-2">
          <div className="relative">
            {/* Floating Pointer / Tooltip */}
            <div 
              className="absolute -top-7 -translate-x-1/2 transition-all duration-700 ease-out flex flex-col items-center pointer-events-none z-20"
              style={{ left: `${pointerLeft}%` }}
            >
              <div className="px-2.5 py-0.5 rounded-full bg-[#121214] text-white text-[11px] font-black shadow-lg flex items-center gap-1 border border-white/20 whitespace-nowrap">
                <span>{finalScore}%</span>
              </div>
              <div className="w-1.5 h-1.5 bg-[#121214] rotate-45 -mt-0.5" />
            </div>

            {/* Gradient Track Bar */}
            <div className="relative w-full h-3.5 bg-slate-100 rounded-full p-0.5 border border-slate-200/90 shadow-inner overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{
                  width: `${finalScore}%`,
                  background: 'linear-gradient(90deg, #EF4444 0%, #F59E0B 40%, #84CC16 75%, #10B981 100%)',
                }}
              />
            </div>

            {/* Pointer Pin on the Bar */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-4 border-[#121214] shadow-md pointer-events-none transition-all duration-700 ease-out z-10"
              style={{ left: `${pointerLeft}%` }}
            />
          </div>

          {/* Scale Labels */}
          <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mt-2.5 px-0.5">
            <span className="text-red-500 font-bold">0% Start</span>
            <span className="text-slate-400">50% Mid</span>
            <span className={finalScore >= 90 ? 'text-amber-600 font-black' : 'text-slate-400'}>
              90% Verification Gate
            </span>
            <span className={finalScore === 100 ? 'text-emerald-600 font-black' : 'text-slate-400'}>
              100% Verified
            </span>
          </div>
        </div>

        {/* Missing items pills when score < 90 */}
        {missingItems.length > 0 && (
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Next to add:
            </span>
            {missingItems.map((item) => (
              <button
                key={item.key}
                onClick={onOpenEdit}
                className="px-3 py-1 rounded-xl bg-purple-50/80 hover:bg-purple-100 border border-purple-200/70 text-purple-900 text-xs font-bold transition-all flex items-center gap-1.5 group"
              >
                <span>+{item.weight}% {item.label}</span>
                <ChevronRight size={12} className="text-purple-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        )}

      </div>

      {/* 100% Verification Celebration Modal */}
      {showCelebrationModal && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleDismissCelebration();
          }}
        >
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl border border-emerald-200 text-center space-y-5 animate-scaleUp">
            
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg border-2 border-emerald-200">
              <Award size={40} className="text-emerald-600" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                Milestone Achieved
              </span>
              <h3 className="text-2xl font-black text-[#121214]">
                Verification Complete!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Your partner academic credentials have been verified successfully. Your profile completion score is now <span className="font-black text-emerald-600">100%</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Verified Campus Student Badge is now active</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Full priority listing in regional SME project searches</span>
              </div>
            </div>

            <button
              onClick={handleDismissCelebration}
              className="w-full py-3.5 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all"
            >
              Close & Continue
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
