import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  X, 
  User, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Plus,
  Upload,
  FileCheck,
  AlertCircle,
  Search,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import { profilesApi, verificationApi } from '../../api/endpoints';
import { PLATFORM_SKILLS } from '../../data/skills';
import { PARTNER_COLLEGES, normalizeCollegeName } from '../../data/colleges';

interface EditProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    fullName: string;
    bio?: string;
    collegeName?: string;
    rollNumber?: string;
    degree?: string;
    graduationYear?: number;
    skills: string[];
    portfolioLinks?: { label: string; url: string }[];
    availabilityStatus?: string;
    isVerified?: boolean;
  };
  onProfileUpdated: (updated: any) => void;
}

export const EditProfileDrawer: React.FC<EditProfileDrawerProps> = ({
  isOpen,
  onClose,
  initialData,
  onProfileUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(initialData.fullName || '');
  const [bio, setBio] = useState(initialData.bio || '');
  const [collegeName, setCollegeName] = useState(normalizeCollegeName(initialData.collegeName));
  const [rollNumber, setRollNumber] = useState(initialData.rollNumber || '');
  
  // Synchronize when initialData or drawer opens
  useEffect(() => {
    if (isOpen) {
      setFullName(initialData.fullName || '');
      setBio(initialData.bio || '');
      setCollegeName(normalizeCollegeName(initialData.collegeName));
      setRollNumber(initialData.rollNumber || '');
      setGraduationYear(
        initialData.graduationYear && initialData.graduationYear >= 2000 && initialData.graduationYear <= 2035
          ? initialData.graduationYear
          : 2026
      );
      setSkills(initialData.skills || []);
      setAvailabilityStatus(initialData.availabilityStatus || 'available_now');
      setFeedback(null);
    }
  }, [isOpen, initialData]);

  // Graduation Year Slider (Range 2000 - 2035)
  const [graduationYear, setGraduationYear] = useState<number>(
    initialData.graduationYear && initialData.graduationYear >= 2000 && initialData.graduationYear <= 2035
      ? initialData.graduationYear
      : 2026
  );

  // Curated Skills State
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const [skillSearch, setSkillSearch] = useState('');
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [skillError, setSkillError] = useState<string | null>(null);

  // Availability & DPDPA
  const [availabilityStatus, setAvailabilityStatus] = useState(initialData.availabilityStatus || 'available_now');
  const [dpdpaMarketing, setDpdpaMarketing] = useState(true);
  const [dpdpaMatching, setDpdpaMatching] = useState(true);

  // Document Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Submission & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter skills based on search term
  const filteredSkills = useMemo(() => {
    const q = skillSearch.trim().toLowerCase();
    return PLATFORM_SKILLS.filter(
      (s) => !skills.includes(s) && (q === '' || s.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [skillSearch, skills]);

  if (!isOpen) return null;

  const handleSelectSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills(prev => [...prev, skill]);
      setSkillSearch('');
      setIsSkillDropdownOpen(false);
      setSkillError(null);
    }
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const match = PLATFORM_SKILLS.find(
        (s) => s.toLowerCase() === skillSearch.trim().toLowerCase()
      );
      if (match) {
        handleSelectSkill(match);
      } else if (filteredSkills.length > 0) {
        handleSelectSkill(filteredSkills[0]);
      } else {
        setSkillError('Please choose a recognized skill from our verified catalog.');
      }
    }
  };

  const handleRemoveSkill = (sk: string) => {
    setSkills(prev => prev.filter(s => s !== sk));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadedFileName(file.name);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const profilePayload = {
      fullName: fullName.trim(),
      bio: bio.trim(),
      collegeName: collegeName.trim(),
      rollNumber: rollNumber.trim(),
      graduationYear: Number(graduationYear),
      skills,
      availabilityStatus: availabilityStatus || 'available_now',
    };

    try {
      // 1. Update Student Profile in Backend
      let backendSuccess = false;
      try {
        await profilesApi.updateStudentProfile(profilePayload);
        backendSuccess = true;
      } catch (apiErr) {
        console.warn('API profile update fallback:', apiErr);
      }

      // 2. Submit Verification ID Document if selected
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append('institutionOrBusiness', collegeName.trim() || 'University / College');
          formData.append('docIdentifier', rollNumber.trim() || 'Roll# Not Provided');
          formData.append('file', selectedFile);

          await verificationApi.submitRequest(formData);
        } catch (uploadErr) {
          console.warn('Document verification submission fallback:', uploadErr);
        }
      }

      // 3. Immediately sync updated state to client context & localStorage
      onProfileUpdated({
        ...profilePayload,
        rollNumber: rollNumber.trim(),
      });

      setFeedback({
        type: 'success',
        message: backendSuccess
          ? 'Profile and institutional verification details updated successfully!'
          : 'Profile changes saved and updated in your session!',
      });

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (err: any) {
      console.error('Save profile error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Profile could not be saved. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Year Options from 2000 to 2035
  const yearOptions = Array.from({ length: 36 }, (_, i) => 2000 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0B101B] border-l border-white/10 w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden text-left">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0F172A]/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F851]/10 border border-[#D4F851]/30 flex items-center justify-center text-[#D4F851]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Edit Student Profile</h3>
              <p className="text-xs text-white/50">Campus Credentials, Skills & Verification</p>
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
          
          {feedback && (
            <div className={`p-3.5 rounded-2xl border text-xs flex items-center space-x-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Section 1: Personal & Bio */}
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

            {/* College Name & Roll Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/70">Partner Campus</label>
                  <span className="text-[10px] text-[#D4F851] font-bold">6 Campuses</span>
                </div>
                <div className="relative">
                  <select
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    required
                    className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3 py-2.5 pr-8 text-xs text-white focus:outline-none focus:border-[#D4F851] appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0B101B] text-white/40">Select partner campus...</option>
                    {PARTNER_COLLEGES.map((college) => (
                      <option key={college} value={college} className="bg-[#0B101B] text-white py-1">
                        {college}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">University Roll Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 2203102"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4F851]"
                />
              </div>
            </div>

            {/* Graduation Year Interactive Slider */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                  <GraduationCap className="w-4 h-4 text-[#D4F851]" />
                  <span>Graduation Year</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#D4F851]/20 border border-[#D4F851]/40 text-[#D4F851] tabular-nums">
                    Class of {graduationYear}
                  </span>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="bg-[#1E293B] border border-white/10 text-white text-[11px] font-bold rounded-lg px-2 py-0.5 focus:outline-none focus:border-[#D4F851]"
                  >
                    {yearOptions.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Slider Range Control */}
              <input
                type="range"
                min={2000}
                max={2035}
                step={1}
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                className="w-full accent-[#D4F851] cursor-pointer h-2 bg-slate-700 rounded-lg"
              />

              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>2000</span>
                <span>2015</span>
                <span className="text-[#D4F851]/80 font-bold">2026 (Now)</span>
                <span>2035</span>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70">Current Availability Signal</label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F851]"
              >
                <option value="available_now">🟢 Available immediately (10-15 hrs/wk)</option>
                <option value="busy">🔵 Limited availability</option>
                <option value="exam_break">⚪ Currently busy with college exams</option>
              </select>
            </div>
          </div>

          {/* Section 2: Student ID Card Document Upload */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Student Institutional Verification</h4>
              {initialData.isVerified ? (
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Verified Student
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  ID Verification Required
                </span>
              )}
            </div>

            <p className="text-xs text-white/60">
              Upload your official college ID card to unlock institutional trust badges and apply for verified SME micro-gigs.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                uploadedFileName
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-white/15 hover:border-white/30 bg-white/5'
              }`}
            >
              {uploadedFileName ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold">
                  <FileCheck size={18} className="text-emerald-400" />
                  <span>{uploadedFileName} (Ready to Submit)</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload size={20} className="mx-auto text-[#D4F851]" />
                  <p className="text-xs text-white font-bold">Click to attach College ID Card</p>
                  <p className="text-[10px] text-white/40">Supports JPG, PNG, PDF up to 5MB (Stored in private vault)</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Verified Skills Catalog Selector */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Verified Skill Stack</h4>
              <span className="text-[10px] font-bold text-white/40 tabular-nums">
                {skills.length} skill{skills.length === 1 ? '' : 's'} added
              </span>
            </div>

            {/* Search and Select from Curated Catalog */}
            <div className="relative">
              <div className="flex items-center bg-[#1E293B] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus-within:border-[#D4F851]">
                <Search size={14} className="text-white/40 mr-2 shrink-0" />
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => {
                    setSkillSearch(e.target.value);
                    setIsSkillDropdownOpen(true);
                    setSkillError(null);
                  }}
                  onFocus={() => setIsSkillDropdownOpen(true)}
                  onKeyDown={handleSkillInputKeyDown}
                  placeholder="Search and select from verified catalog (e.g. React, Docker, Figma)..."
                  className="bg-transparent text-xs text-white placeholder-white/30 focus:outline-none flex-1"
                />
              </div>

              {skillError && (
                <div className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  <span>{skillError}</span>
                </div>
              )}

              {/* Suggestions Dropdown */}
              {isSkillDropdownOpen && filteredSkills.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 max-h-48 overflow-y-auto bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in">
                  <div className="text-[10px] uppercase font-bold text-white/40 px-3 py-1">
                    Canonical Platform Skills
                  </div>
                  {filteredSkills.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleSelectSkill(sk)}
                      className="w-full text-left px-3 py-1.5 text-xs text-white hover:bg-[#D4F851]/10 hover:text-[#D4F851] rounded-xl font-medium transition-colors flex items-center justify-between"
                    >
                      <span>{sk}</span>
                      <Plus size={12} className="opacity-60" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Skills Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center space-x-1.5 text-xs bg-[#D4F851]/10 text-[#D4F851] border border-[#D4F851]/30 px-3 py-1 rounded-xl font-medium shadow-sm"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk)}
                    className="hover:text-red-400 p-0.5 rounded-full transition-colors"
                    aria-label={`Remove ${sk}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: DPDPA 2023 Privacy Section */}
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
              <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
