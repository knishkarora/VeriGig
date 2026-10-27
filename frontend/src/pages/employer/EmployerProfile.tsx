import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Globe, 
  MapPin, 
  PlusCircle, 
  Edit3, 
  ShieldCheck, 
  Lock, 
  Clock, 
  ExternalLink, 
  Users, 
  Layers, 
  ChevronRight, 
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';
import { EditEmployerProfileDrawer } from '../../components/employer/EditEmployerProfileDrawer';

export const EmployerProfile: React.FC = () => {
  const { currentUser, gigs } = useMarketplace();
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const ownGigs = gigs.filter((gig) => gig.employerId === currentUser.id);
  const initials = currentUser.collegeOrCompany
    ? currentUser.collegeOrCompany.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
    : currentUser.name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SM';

  const isVerified = currentUser.isVerified;
  const isPending = currentUser.verificationStatus === 'pending';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Banner Card */}
      <section className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.collegeOrCompany || currentUser.name} 
                className="w-20 h-20 rounded-3xl object-cover border-2 border-slate-200 shadow-md shrink-0" 
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-purple-100 border-2 border-purple-200 flex items-center justify-center text-purple-800 font-black text-2xl shadow-sm shrink-0">
                {initials}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#101014]">
                  {currentUser.collegeOrCompany || 'Business Profile Setup'}
                </h1>

                {isVerified ? (
                  <TrustBadge type="sme" text="Verified SME Partner" size="sm" />
                ) : isPending ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>Verification Under Review</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span>Unverified Account</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600">
                Authorized Lead: <strong className="text-[#101014] font-bold">{currentUser.name}</strong> • ({currentUser.email})
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                {currentUser.location && (
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>{currentUser.location}</span>
                  </span>
                )}
                {currentUser.businessType && (
                  <span className="flex items-center gap-1 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>{currentUser.businessType}</span>
                  </span>
                )}
                {currentUser.website && (
                  <a 
                    href={currentUser.website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{currentUser.website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setIsEditDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#101014] font-bold px-4 py-2.5 rounded-full text-xs border border-slate-200 transition-all shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile & KYC</span>
            </button>

            <Link 
              to="/app/employer/post-gig" 
              className="inline-flex items-center justify-center gap-2 bg-[#101014] hover:bg-slate-800 text-white font-black px-5 py-2.5 rounded-full text-xs shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4 text-[#D4F851]" />
              <span>Post a Micro-Gig</span>
            </Link>
          </div>
        </div>

        {/* Public Description */}
        <div className="relative z-10 mt-6 pt-5 border-t border-purple-100 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">About Your Enterprise</span>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl font-normal">
            {currentUser.bio || 'Heritage MSME enterprise operating within the regional commerce hub. Click "Edit Profile & KYC" to add your business background, portfolio links, and mission statement for student candidates to read.'}
          </p>
        </div>
      </section>

      {/* Verification CTA Banner (if unverified or pending) */}
      {!isVerified && (
        <section className={`p-6 sm:p-8 rounded-[2.5rem] bg-white border space-y-4 shadow-sm ${
          isPending 
            ? 'border-amber-300' 
            : 'border-purple-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isPending ? (
                  <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-purple-700" />
                )}
                <h3 className="text-base font-black text-[#101014]">
                  {isPending 
                    ? 'Business Verification Documents Under Review' 
                    : 'Verify Business Credentials to Unlock Verified SME Partner Badge'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                {isPending 
                  ? 'Your GSTIN, Udyam MSME, PAN, or Aadhaar credentials have been submitted and are in the administrative governance queue. Approval will unlock the verified partner seal across all your listings.'
                  : 'Unverified business listings experience lower applicant proposal fit. Provide an official Indian credential (GSTIN, Udyam MSME, Business PAN, or Proprietor Aadhaar) to gain instant campus trust.'}
              </p>
            </div>

            <button
              onClick={() => setIsEditDrawerOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition-all shadow-sm"
            >
              {isPending ? 'Inspect Submitted Documents' : 'Submit Verification Credentials'}
            </button>
          </div>
        </section>
      )}

      {/* Grid: Private KYC Summary & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Private KYC Compliance Card */}
        <div className="lg:col-span-6 p-7 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-[#101014] text-base">Private Verification & Compliance Records</h2>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              DPDPA 2023 Protected
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            These internal parameters are securely encrypted. They are never exposed publicly or shared with student freelancers.
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Registered Address</span>
              <span className="text-[#101014] font-medium max-w-[240px] truncate text-right">
                {currentUser.address || 'Plot 42, Focal Point, Ludhiana, Punjab'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Private Phone Number</span>
              <span className="text-[#101014] font-mono font-medium">
                {currentUser.phone ? `${currentUser.phone.slice(0, 3)} •••••••• ${currentUser.phone.slice(-2)}` : '+91 •••••••• 89'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Tax / Registry Credential</span>
              <span className="text-emerald-700 font-mono font-bold">
                {currentUser.verificationDocType || 'GSTIN'}: {currentUser.verificationDocNumber ? `${currentUser.verificationDocNumber.slice(0, 4)}••••${currentUser.verificationDocNumber.slice(-3)}` : '03AA••••1Z5'}
              </span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Status: <strong className="text-[#101014]">{isVerified ? 'Verified Legal Entity' : isPending ? 'Queue Priority #12' : 'Action Required'}</strong></span>
            <button 
              onClick={() => setIsEditDrawerOpen(true)}
              className="text-purple-700 hover:text-purple-900 font-bold hover:underline"
            >
              Update Credentials
            </button>
          </div>
        </div>

        {/* Right Column: Public Profile Preview Cue */}
        <div className="lg:col-span-6 p-7 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-700" />
              <h2 className="font-bold text-[#101014] text-base">Candidate-Facing Public Dossier</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              When student freelancers browse micro-gigs posted by your account, they can click on your company card to view your verified public dossier, reviews, and active listings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Public URL:</span>
              <span className="font-mono text-purple-700 font-bold">/employers/{currentUser.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Visible Data:</span>
              <span className="text-[#101014] font-medium">Name, Domain, City, State, Website, Open Gigs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Concealed Data:</span>
              <span className="text-emerald-700 font-medium">Address, Direct Phone, Tax Docs</span>
            </div>
          </div>

          <Link
            to={`/employers/${currentUser.id}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#101014] hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <span>View Your Public Profile as a Student</span>
            <ExternalLink size={13} />
          </Link>
        </div>

      </div>

      {/* Section: Your Posted Micro-Gigs */}
      <section className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-[#101014] text-xl flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-700" />
              <span>Your Posted Micro-Gigs</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gigs currently authored and managed by this account
            </p>
          </div>
          <span className="text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full tabular-nums">
            {ownGigs.length} {ownGigs.length === 1 ? 'Listing' : 'Listings'}
          </span>
        </div>

        {ownGigs.length === 0 ? (
          <div className="p-12 text-center rounded-[2rem] bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <Layers className="w-8 h-8 mx-auto text-slate-300" />
            <h4 className="text-sm font-bold text-[#101014]">You have not posted a micro-gig yet</h4>
            <p className="text-xs text-slate-500">
              Create your first campus listing to receive applications from verified students.
            </p>
            <Link
              to="/app/employer/post-gig"
              className="inline-block mt-2 px-5 py-2.5 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-black shadow-sm"
            >
              Post a Micro-Gig
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownGigs.map((gig) => (
              <div 
                key={gig.id} 
                className="p-5 rounded-2xl bg-slate-50/60 hover:bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {gig.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#101014] mt-1.5 truncate max-w-sm">
                      {gig.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">{gig.locationScope} • {gig.targetDuration}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#101014] font-mono tabular-nums">₹{gig.totalBudget.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-400 capitalize">{gig.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <Link
                    to={`/app/employer/gig/${gig.id}/applicants`}
                    className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Users size={12} />
                    <span>{gig.applicantsCount} Applicants</span>
                  </Link>

                  <Link
                    to={`/app/employer/workspace/${gig.id}`}
                    className="text-slate-600 hover:text-[#101014] font-medium flex items-center gap-1"
                  >
                    <span>Open Workspace</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Profile Drawer Modal */}
      <EditEmployerProfileDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
      />

    </div>
  );
};
