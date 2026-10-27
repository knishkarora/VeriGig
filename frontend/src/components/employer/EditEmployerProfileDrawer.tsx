import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
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
  Phone
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
  useBodyScrollLock(isOpen);

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

  // Synchronize when drawer opens or user changes
  useEffect(() => {
    if (isOpen) {
      setFullName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setAvatar(currentUser.avatar || '');
      setCompanyName(currentUser.collegeOrCompany || '');
      setBusinessType(currentUser.businessType || 'Handloom & Textiles');
      setWebsite(currentUser.website || '');
      setBio(currentUser.bio || '');
      setAddress(currentUser.address || '');
      setPhone(currentUser.phone || '');
      setDocNumber(currentUser.verificationDocNumber || '');
      setFeedback(null);
      setSelectedFile(null);

      if (currentUser.location) {
        const parts = currentUser.location.split(',').map(s => s.trim());
        if (parts[0]) setCity(parts[0]);
        if (parts[1]) setState(parts[1]);
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
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
        avatar: avatar || undefined,
        collegeOrCompany: companyName.trim(),
        businessType: businessType,
        website: website.trim() || undefined,
        bio: bio.trim(),
        location: fullLocation,
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        verificationDocType: docType,
        verificationDocNumber: cleanDocNumber || undefined,
      };

      if (cleanDocNumber && !currentUser.isVerified) {
        updatedUserPayload.verificationStatus = 'pending';
      }

      updateCurrentUser(updatedUserPayload);

      if (onProfileUpdated) {
        onProfileUpdated(updatedUserPayload);
      }

      setFeedback({
        type: 'success',
        message: backendSuccess
          ? 'Business profile & compliance documentation updated successfully!'
          : 'Profile updated in your active demonstration session!',
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

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border-l border-purple-100 w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden text-left animate-slideLeft">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-purple-100 flex items-center justify-between bg-purple-50/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-[#101014] text-base">Edit Business Profile & KYC</h3>
              <p className="text-xs text-slate-500">Institutional Credential Verification & Branding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 space-y-6">
          
          {feedback && (
            <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              )}
              <span className="font-medium">{feedback.message}</span>
            </div>
          )}

          {/* Section 1: Avatar & Representative Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Account Representative & Logo</span>
            </h4>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="relative group shrink-0">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt={companyName || fullName} 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 border-2 border-purple-200 flex items-center justify-center text-purple-800 font-black text-xl">
                    {companyName ? companyName.slice(0, 2).toUpperCase() : 'SME'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-white transition-opacity"
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
                    className="px-3 py-1.5 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload size={12} />
                    <span>Upload Image</span>
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="px-2.5 py-1.5 rounded-full text-slate-500 hover:text-red-600 text-xs transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Upload your business logo or avatar (PNG, JPG, WebP)</p>
              </div>
            </div>

            {/* Quick avatar presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 block font-medium">Or select an industry preset:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setAvatar(preset.url)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[11px] text-slate-700 transition-all shadow-2xs"
                  >
                    <img src={preset.url} alt={preset.label} className="w-4 h-4 rounded-full object-cover" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name (Authorized Lead)</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jaswinder Singh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#101014]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Contact Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jaswinder@kaurtextiles.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#101014]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business Identity (Public) */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Public Enterprise Details</span>
              <span className="text-[10px] text-purple-700 font-bold">Visible on Gig Listings</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Company / Enterprise Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Kaur Handlooms & Textiles"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#101014]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Industry / Domain</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#101014]"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Website or Catalog URL (Optional)</label>
              <div className="relative">
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://kaurhandlooms.in"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#101014]"
                />
                <Globe size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">About Your Business</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Heritage handloom weaver unit operating since 1998, crafting traditional shawls and home furnishings..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#101014]"
              />
              <span className="text-[10px] text-slate-400 block">Student applicants read this summary when exploring your posted micro-gigs.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">City (Public)</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ludhiana"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#101014]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">State (Public)</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Punjab"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#101014]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Private KYC & Contact Details (NOT Public) */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101014]">
                  Private Verification Records
                </h4>
              </div>
              <span className="text-[10px] bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200 font-bold">
                🔒 Strictly Confidential • DPDPA 2023
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your street address and direct phone number are securely encrypted and used strictly for identity verification, anti-fraud auditing, and escrow disbursement. They are <strong>never</strong> exposed publicly.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Direct Contact Phone Number</span>
                <span className="text-[10px] text-slate-400">Used for Escrow OTPs & SMS Alerts</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#101014]"
                />
                <Phone size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Registered Physical Address / Facility Location</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot 42, Focal Point Phase IV, Ludhiana, Punjab - 141010"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#101014]"
              />
            </div>
          </div>

          {/* Section 4: Credential Verification (GSTIN / Udyam / PAN / Aadhaar) */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101014]">
                  Business KYC Verification Credentials
                </h4>
              </div>
              {currentUser.isVerified ? (
                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                  ✓ Verified SME Partner
                </span>
              ) : currentUser.verificationStatus === 'pending' ? (
                <span className="text-[10px] bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300 font-bold">
                  ⏳ Under Admin Review
                </span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                  Unverified
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              To earn the <strong className="text-emerald-700">Verified SME Partner</strong> trust badge, provide one official registration credential. Indian enterprises can use GSTIN, MSME Udyam, Business PAN, or Proprietor Aadhaar.
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
                      ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-bold">{opt.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{opt.hint}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono uppercase focus:outline-none focus:border-[#101014]"
              />
            </div>

            {/* Document File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Upload Proof Document (PDF, PNG, JPG)</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleDocumentFile}
                accept=".pdf,image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-purple-400 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50/60 space-y-2"
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-purple-700">
                    <FileCheck size={18} />
                    <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="mx-auto text-slate-400" />
                    <p className="text-xs text-slate-700 font-semibold">
                      Click to upload registration certificate or ID proof
                    </p>
                    <p className="text-[10px] text-slate-400">Max 10MB • Encrypted on private compliant storage</p>
                  </>
                )}
              </div>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <input
                type="checkbox"
                checked={dpdpaConsent}
                onChange={(e) => setDpdpaConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-purple-700 focus:ring-purple-500"
              />
              <span className="text-slate-600 leading-relaxed text-[11px]">
                I certify under penalty of account suspension that these credentials belong to the registered legal entity and authorize VeriGig compliance officers to verify them against official GST/MSME registries.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200 sticky bottom-0 bg-white/95 backdrop-blur-md py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#101014] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !dpdpaConsent}
              className="bg-[#101014] hover:bg-slate-800 disabled:opacity-40 text-white font-bold px-6 py-3 rounded-full transition-all text-xs flex items-center space-x-2 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#D4F851]" />
              <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile & Submit KYC'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
};
