import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  Camera, 
  Lock, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  FileText
} from 'lucide-react';
import { profilesApi, verificationApi } from '../../api/endpoints';
import { useMarketplace } from '../../context/MarketplaceContext';

interface EditEmployerProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (updated: any) => void;
}

const BUSINESS_CATEGORIES = [
  'Handloom & Textiles',
  'IT & Software Development',
  'Retail & E-Commerce',
  'Creative & Digital Agency',
  'Hospitality & Food Services',
  'Manufacturing & Engineering',
  'Education & Coaching',
  'Healthcare & Wellness',
  'Consulting & Professional Services',
  'Other SME'
];

const PRESET_AVATARS = [
  { label: 'Textiles', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=150&auto=format&fit=crop&q=80' },
  { label: 'Tech & Code', url: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=150&auto=format&fit=crop&q=80' },
  { label: 'Creative Studio', url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=150&auto=format&fit=crop&q=80' },
  { label: 'Food & Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80' },
  { label: 'Industrial', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80' },
];

export const EditEmployerProfileDrawer: React.FC<EditEmployerProfileDrawerProps> = ({
  isOpen,
  onClose,
  onProfileUpdated
}) => {
  const { currentUser, updateCurrentUser, submitVerificationRequest } = useMarketplace();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [companyName, setCompanyName] = useState(currentUser.collegeOrCompany || '');
  const [businessType, setBusinessType] = useState(currentUser.businessType || 'Handloom & Textiles');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [city, setCity] = useState('Ludhiana');
  const [state, setState] = useState('Punjab');
  const [address, setAddress] = useState(currentUser.address || '');
  const [phone, setPhone] = useState(currentUser.phone || '');

  // KYC Verification state
  const [docType, setDocType] = useState<'GSTIN' | 'UDYAM' | 'PAN' | 'AADHAAR'>(
    (currentUser.verificationDocType as any) || 'GSTIN'
  );
  const [docNumber, setDocNumber] = useState(currentUser.verificationDocNumber || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dpdpaConsent, setDpdpaConsent] = useState(true);

  // Submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync on open
  useEffect(() => {
    if (isOpen) {
      setFullName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setAvatar(currentUser.avatar || '');
      setCompanyName(currentUser.collegeOrCompany || '');
      setBusinessType(currentUser.businessType || 'Handloom & Textiles');
      setWebsite(currentUser.website || '');
      setBio(currentUser.bio || '');
      if (currentUser.location) {
        const parts = currentUser.location.split(',');
        setCity(parts[0]?.trim() || 'Ludhiana');
        setState(parts[1]?.trim() || 'Punjab');
      }
      setAddress(currentUser.address || '');
      setPhone(currentUser.phone || '');
      setDocNumber(currentUser.verificationDocNumber || '');
      setFeedback(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const fullLocation = `${city.trim()}, ${state.trim()}`;
    const cleanDocNumber = docNumber.trim().toUpperCase();

    try {
      // 1. Submit business profile updates to backend API
      let backendSuccess = false;
      try {
        await profilesApi.updateBusinessProfile({
          companyName: companyName.trim() || undefined,
          businessType: businessType || undefined,
          website: website.trim() || undefined,
          description: bio.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          contactPhone: phone.trim() || undefined,
          registeredAddress: address.trim() || undefined,
          registrationNumber: cleanDocNumber || undefined,
          fullName: fullName.trim() || undefined,
          avatarUrl: avatar.trim() || undefined,
        });
        backendSuccess = true;
      } catch (apiErr) {
        console.warn('Backend business profile update fallback:', apiErr);
      }

      // 2. Submit document to verification API if credential or document provided
      if (cleanDocNumber || selectedFile) {
        try {
          if (selectedFile) {
            const formData = new FormData();
            formData.append('institutionOrBusiness', companyName.trim() || 'SME Business');
            formData.append('docIdentifier', `${docType}: ${cleanDocNumber || 'Pending Document'}`);
            formData.append('file', selectedFile);
            await verificationApi.submitRequest(formData);
          }
        } catch (uploadErr) {
          console.warn('Verification document upload fallback:', uploadErr);
        }

        // Add verification request to context
        submitVerificationRequest({
          institutionOrBusiness: companyName.trim() || 'SME Business',
          idOrDocNumber: `${docType}: ${cleanDocNumber}`,
          userType: 'sme',
        });
      }

      // 3. Immediately update current user session
      const updatedUserPayload: Partial<typeof currentUser> = {
        name: fullName.trim(),
        email: email.trim(),
        avatar: avatar.trim(),
        collegeOrCompany: companyName.trim(),
        businessType: businessType,
        website: website.trim(),
        bio: bio.trim(),
        location: fullLocation,
        address: address.trim(),
        phone: phone.trim(),
        verificationDocType: docType,
        verificationDocNumber: cleanDocNumber,
      };

      if (cleanDocNumber || selectedFile) {
        updatedUserPayload.verificationStatus = 'pending';
        updatedUserPayload.verificationBadgeText = 'Verification pending';
      }

      updateCurrentUser(updatedUserPayload);
      onProfileUpdated?.(updatedUserPayload);

      setFeedback({
        type: 'success',
        message: cleanDocNumber
          ? 'Profile saved and KYC credentials submitted for administrative review!'
          : 'Business profile saved successfully!',
      });

      setTimeout(() => {
        onClose();
      }, 1300);

    } catch (err: any) {
      console.error('Save employer profile error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Profile could not be saved. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0B101B] border-l border-white/10 w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden text-left">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0F172A]/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F851]/10 border border-[#D4F851]/30 flex items-center justify-center text-[#D4F851]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Edit Employer & Business Profile</h3>
              <p className="text-xs text-white/50">KYC Verification, Branding & SME Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {feedback && (
            <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span className="font-medium">{feedback.message}</span>
            </div>
          )}

          {/* Section 1: Avatar & Representative Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <span>Account Representative & Logo</span>
            </h4>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="relative group shrink-0">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt={companyName || fullName} 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4F851]/40" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border-2 border-white/10 flex items-center justify-center text-[#D4F851] font-black text-xl">
                    {companyName ? companyName.slice(0, 2).toUpperCase() : 'SME'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-white transition-opacity"
                  title="Upload profile image"
                >
                  <Camera size={18} />
                </button>
              </div>

              <div className="space-y-2 flex-1">
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarFile}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Upload size={12} />
                    <span>Upload Image</span>
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="px-2.5 py-1.5 rounded-xl text-white/50 hover:text-rose-400 text-xs transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-white/40">Upload your business logo or personal avatar (PNG, JPG, WebP)</p>
              </div>
            </div>

            {/* Quick avatar presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-white/50 block font-medium">Or select an industry icon preset:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setAvatar(preset.url)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-white/80 transition-all"
                  >
                    <img src={preset.url} alt={preset.label} className="w-4 h-4 rounded-full object-cover" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">Your Full Name (Representative)</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jaswinder Singh"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F851]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">Contact Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jaswinder@kaurtextiles.com"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F851]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business Identity (Public) */}
          <div className="space-y-4 pt-3 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center justify-between">
              <span>Public Enterprise Details</span>
              <span className="text-[10px] text-[#D4F851] font-bold">Visible on Gig Listings</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">Company / Enterprise Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Kaur Handlooms & Textiles"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F851]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">Industry / Domain</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F851]"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0B101B] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70">Website or Catalog URL (Optional)</label>
              <div className="relative">
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://kaurhandlooms.in"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4F851]"
                />
                <Globe size={14} className="text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70">About Your Business</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Heritage handloom weaver unit operating since 1998, crafting traditional shawls and home furnishings for Indian and global buyers..."
                className="w-full bg-[#1E293B] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4F851]"
              />
              <span className="text-[10px] text-white/40 block">Student applicants read this summary when exploring your posted micro-gigs.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">City (Public)</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ludhiana"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F851]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white/70">State (Public)</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Punjab"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F851]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Private KYC & Contact Details (NOT Public) */}
          <div className="space-y-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Private Verification Records
                </h4>
              </div>
              <span className="text-[10px] bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/20 font-bold">
                🔒 Strictly Confidential • DPDPA 2023
              </span>
            </div>

            <p className="text-[11px] text-white/60 leading-relaxed">
              Your street address and direct phone number are securely encrypted and used strictly for identity verification, anti-fraud auditing, and escrow disbursement. They are <strong>never</strong> exposed publicly to students or search engines.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70 flex items-center justify-between">
                <span>Direct Contact Phone Number</span>
                <span className="text-[10px] text-white/40">Used for Escrow OTPs & SMS Alerts</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4F851]"
                />
                <Phone size={14} className="text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70">Registered Physical Address / Facility Location</label>
              <div className="relative">
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot 42, Focal Point Phase IV, Ludhiana, Punjab - 141010"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4F851]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Credential Verification (GSTIN / Udyam / PAN / Aadhaar) */}
          <div className="space-y-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Business KYC Verification Credentials
                </h4>
              </div>
              {currentUser.isVerified ? (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  ✓ Verified SME Partner
                </span>
              ) : currentUser.verificationStatus === 'pending' ? (
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 font-bold">
                  ⏳ Under Admin Review
                </span>
              ) : (
                <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-bold">
                  Unverified
                </span>
              )}
            </div>

            <p className="text-[11px] text-white/60 leading-relaxed">
              To earn the <strong className="text-emerald-400">Verified SME Partner</strong> trust badge, provide one official registration credential. Indian enterprises can use GSTIN, MSME Udyam, Business PAN, or Proprietor Aadhaar.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'GSTIN', label: 'GSTIN (GST)', hint: '15-digit Tax ID' },
                { id: 'UDYAM', label: 'Udyam MSME', hint: 'Govt MSME Reg' },
                { id: 'PAN', label: 'Business PAN', hint: '10-digit PAN' },
                { id: 'AADHAAR', label: 'Aadhaar ID', hint: 'Sole Proprietor' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDocType(opt.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    docType === opt.id
                      ? 'bg-[#D4F851]/15 border-[#D4F851] text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span className="block text-xs font-black">{opt.label}</span>
                  <span className="block text-[10px] text-white/40 mt-0.5">{opt.hint}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70">
                {docType === 'GSTIN' && 'GSTIN Number (15 Digits)'}
                {docType === 'UDYAM' && 'Udyam Registration Number (UDYAM-XX-XX-XXXXXXX)'}
                {docType === 'PAN' && 'Company or Proprietor PAN Number (10 Digits)'}
                {docType === 'AADHAAR' && 'Proprietor Aadhaar Number (12 Digits - Masked)'}
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder={
                  docType === 'GSTIN' ? '03AAAAA0000A1Z5' :
                  docType === 'UDYAM' ? 'UDYAM-PB-12-0012345' :
                  docType === 'PAN' ? 'ABCDE1234F' : '1234 5678 9012'
                }
                className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#D4F851]"
              />
            </div>

            {/* Document File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/70">Upload Proof Document (PDF, PNG, JPG)</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleDocumentFile}
                accept=".pdf,image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-[#D4F851]/60 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-white/5 space-y-2"
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#D4F851]">
                    <FileCheck size={18} />
                    <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="mx-auto text-white/40" />
                    <p className="text-xs text-white/70 font-semibold">
                      Click to upload registration certificate or ID proof
                    </p>
                    <p className="text-[10px] text-white/40">Max 10MB • Encrypted on private compliant storage</p>
                  </>
                )}
              </div>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
              <input
                type="checkbox"
                checked={dpdpaConsent}
                onChange={(e) => setDpdpaConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-[#D4F851] focus:ring-0"
              />
              <span className="text-white/80 leading-relaxed text-[11px]">
                I certify under penalty of account termination that these credentials belong to the registered legal entity and authorize VeriGig compliance officers to verify them against official GST/MSME registries.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10 sticky bottom-0 bg-[#0B101B]/95 py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !dpdpaConsent}
              className="bg-[#D4F851] text-[#121214] font-bold px-6 py-3 rounded-2xl hover:bg-[#C5F82A] disabled:opacity-40 transition-all text-xs flex items-center space-x-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile & Submit KYC'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
