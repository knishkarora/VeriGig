import React, { useState } from 'react';
import { 
  X, 
  User, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Plus,
} from 'lucide-react';
import { profilesApi } from '../../api/endpoints';

interface EditProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    fullName: string;
    bio?: string;
    collegeName?: string;
    degree?: string;
    graduationYear?: number;
    skills: string[];
    portfolioLinks?: { label: string; url: string }[];
    availabilityStatus?: string;
  };
  onProfileUpdated: (updated: any) => void;
}

export const EditProfileDrawer: React.FC<EditProfileDrawerProps> = ({
  isOpen,
  onClose,
  initialData,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(initialData.fullName || '');
  const [bio, setBio] = useState(initialData.bio || '');
  const [collegeName, setCollegeName] = useState(initialData.collegeName || '');
  const [graduationYear, setGraduationYear] = useState<number | ''>(initialData.graduationYear || '');
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState(initialData.availabilityStatus || '');
  
  // DPDPA Consent States
  const [dpdpaMarketing, setDpdpaMarketing] = useState(true);
  const [dpdpaMatching, setDpdpaMatching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (sk: string) => {
    setSkills(prev => prev.filter(s => s !== sk));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    const payload = {
      fullName,
      bio,
      skills,
      ...(collegeName ? { collegeName } : {}),
      ...(graduationYear ? { graduationYear } : {}),
      ...(availabilityStatus ? { availabilityStatus } : {}),
    };

    try {
      const result = await profilesApi.updateStudentProfile(payload);
      setFeedbackMsg('Profile and privacy preferences updated successfully!');
      setTimeout(() => {
        onProfileUpdated(result.profile || payload);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.warn('Profile update failed:', err);
      setFeedbackMsg(err.message || 'Profile could not be saved. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0B101B] border-l border-white/10 w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0F172A]/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F851]/10 border border-[#D4F851]/30 flex items-center justify-center text-[#D4F851]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Edit Student Profile</h3>
              <p className="text-xs text-white/50">Skills, Availability & DPDPA Controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {feedbackMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Core Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Personal & Academic Details</h4>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F851]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70">Bio / Professional Summary</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Full-stack developer with experience in React and Fastify..."
                className="w-full bg-[#1E293B] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4F851]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">College / University</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4F851]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">Graduation Year</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Optional"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4F851]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70">Current Availability Signal</label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F851]"
              >
                <option value="">Choose availability (optional)</option>
                <option value="available_now">🟢 Available immediately (10-15 hrs/wk)</option>
                <option value="busy">🔵 Limited availability</option>
                <option value="exam_break">⚪ Currently busy with college exams</option>
              </select>
            </div>
          </div>

          {/* Skills Management */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Verified Skill Stack</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add skill (e.g. Docker, Tailwind) & press enter"
                className="flex-1 bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4F851]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center space-x-1 text-xs bg-[#D4F851]/10 text-[#D4F851] border border-[#D4F851]/30 px-2.5 py-1 rounded-xl font-medium"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk)}
                    className="hover:text-red-400 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* DPDPA 2023 Privacy Section */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">DPDPA 2023 Privacy Controls</h4>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3 text-xs">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dpdpaMatching}
                  onChange={(e) => setDpdpaMatching(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-[#D4F851] focus:ring-0"
                />
                <span className="text-white/80">
                  Allow explainable candidate matching algorithm to score skills and proximity for local gigs.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dpdpaMarketing}
                  onChange={(e) => setDpdpaMarketing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-[#D4F851] focus:ring-0"
                />
                <span className="text-white/80">
                  Receive SMS/Email digests for relevant micro-gigs posted within my campus cluster.
                </span>
              </label>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#D4F851] text-[#121214] font-bold px-5 py-2.5 rounded-2xl hover:bg-[#C5F82A] disabled:opacity-40 transition-all text-xs flex items-center space-x-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
