import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Layers, 
  Briefcase, 
  Clock, 
  ArrowUpRight, 
  Lock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';
import { MicroGig } from '../../types';

export const PublicEmployerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { gigs, currentUser } = useMarketplace();

  // Find employer from gigs or current user
  const employerGigs = gigs.filter(g => g.employerId === id || (id && g.id === id));
  const sampleGig = employerGigs[0];

  const isCurrentEmployer = currentUser.role === 'employer' && (currentUser.id === id || !id);

  const companyName = isCurrentEmployer 
    ? (currentUser.collegeOrCompany || currentUser.name)
    : (sampleGig?.employerCompany || sampleGig?.employerName || 'Ludhiana Enterprise Partner');

  const representativeName = isCurrentEmployer
    ? currentUser.name
    : (sampleGig?.employerName || 'SME Business Owner');

  const isVerified = isCurrentEmployer
    ? currentUser.isVerified
    : (sampleGig ? sampleGig.employerVerified : true);

  const location = isCurrentEmployer
    ? (currentUser.location || 'Ludhiana, Punjab')
    : (sampleGig?.locationScope || 'Ludhiana, Punjab');

  const category = isCurrentEmployer
    ? (currentUser.businessType || 'Handloom & Textiles')
    : (sampleGig?.category || 'SME Business');

  const bio = isCurrentEmployer
    ? (currentUser.bio || 'Verified local enterprise operating in the Punjab manufacturing and commerce cluster. Specializing in high-craft production and partnering with regional campus talent for rapid micro-gigs.')
    : (sampleGig?.description 
        ? `Verified regional enterprise partner. Frequently posts high-impact micro-projects across campus clusters in ${location}. Known for prompt escrow funding and milestone sign-offs.`
        : 'Verified regional enterprise partner operating across Ludhiana regional campus clusters.');

  const website = isCurrentEmployer ? currentUser.website : undefined;
  const avatar = isCurrentEmployer ? currentUser.avatar : undefined;

  const initials = (companyName.replace(/[^a-zA-Z]/g, '').slice(0, 2) || 'SM').toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-xs text-slate-500 font-mono">
          Employer ID: <strong className="text-white/80">{id || currentUser.id}</strong>
        </span>
      </div>

      {/* Hero Banner Card */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0F172A] border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4F851]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {avatar ? (
              <img 
                src={avatar} 
                alt={companyName} 
                className="w-20 h-20 rounded-3xl object-cover border-2 border-[#D4F851]/40 shadow-xl" 
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-[#1E293B] border-2 border-[#D4F851]/30 flex items-center justify-center text-[#D4F851] font-black text-2xl shadow-xl">
                {initials}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {companyName}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified SME Partner</span>
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-200 border border-amber-400/20 font-medium">
                    Verification In Progress
                  </span>
                )}
              </div>

              <p className="text-xs text-white/60 font-medium">
                Authorized Representative: <strong className="text-white font-bold">{representativeName}</strong>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4F851]" />
                  <span>{location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{category}</span>
                </span>
                {website && (
                  <a 
                    href={website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#D4F851] hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action for employer vs student */}
          {isCurrentEmployer ? (
            <Link
              to="/app/employer/profile"
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
            >
              Manage Profile
            </Link>
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-right space-y-1">
              <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">Escrow Commitment</span>
              <span className="text-sm font-black text-emerald-400 flex items-center justify-end gap-1">
                <ShieldCheck size={16} /> 100% Funded via Sandbox Escrow
              </span>
            </div>
          )}
        </div>

        {/* Company Description */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-white/40">About the Enterprise</h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-4xl font-normal">
            {bio}
          </p>
        </div>
      </div>

      {/* DPDPA 2023 Data Privacy Safeguard Notice */}
      <div className="p-5 rounded-2xl bg-[#0F172A]/80 border border-white/10 flex items-start gap-3 text-xs text-white/70">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block font-bold">DPDPA 2023 Data Privacy Notice</strong>
          <p className="text-[11px] text-white/50 leading-relaxed">
            In strict compliance with Digital Personal Data Protection Act (DPDPA 2023) principles of purpose limitation and data minimization, this enterprise's registered physical address, contact telephone, and internal tax identification documents (GSTIN / Udyam / PAN / Aadhaar) are securely stored on encrypted platform databases exclusively for administrative KYC verification. They are never exposed publicly or shared with unrecruited parties.
          </p>
        </div>
      </div>

      {/* Active Listings Grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Briefcase size={20} className="text-[#D4F851]" />
              <span>Micro-Gigs Posted by {companyName}</span>
            </h2>
            <p className="text-xs text-white/50 mt-0.5">Explore active campus projects open for student proposals</p>
          </div>
          <span className="text-xs text-white/60 font-bold tabular-nums">
            {employerGigs.length} {employerGigs.length === 1 ? 'Listing' : 'Listings'}
          </span>
        </div>

        {employerGigs.length === 0 ? (
          <div className="p-12 text-center rounded-[2.5rem] bg-[#0F172A] border border-white/10 space-y-3">
            <Layers size={36} className="mx-auto text-white/20" />
            <h3 className="text-base font-bold text-white">No active open listings currently</h3>
            <p className="text-xs text-white/50">
              This employer has completed their active sprint or is preparing new listings.
            </p>
            <Link
              to="/app/student/explore"
              className="inline-block mt-2 px-5 py-2.5 rounded-full bg-[#D4F851] text-[#121214] text-xs font-black"
            >
              Explore Other Campus Gigs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {employerGigs.map((gig) => (
              <div 
                key={gig.id} 
                className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 hover:border-white/20 transition-all space-y-4 text-left shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4F851] bg-[#D4F851]/10 px-2.5 py-0.5 rounded-full border border-[#D4F851]/20">
                      {gig.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2 leading-snug">
                      {gig.title}
                    </h3>
                    <p className="text-xs text-white/50 mt-1">{gig.locationScope} • {gig.targetDuration}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-emerald-400 font-mono tabular-nums">
                      ₹{gig.totalBudget.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-white/40">{gig.milestones.length} Milestones</span>
                  </div>
                </div>

                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                  {gig.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {gig.requiredSkills.slice(0, 3).map((sk, idx) => (
                    <span key={idx} className="text-[10px] bg-white/5 text-white/70 px-2 py-0.5 rounded-lg border border-white/5">
                      {sk}
                    </span>
                  ))}
                  {gig.requiredSkills.length > 3 && (
                    <span className="text-[10px] text-white/40 px-1 py-0.5">
                      +{gig.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/50 font-medium">
                    {gig.applicantsCount} candidate proposals
                  </span>
                  <Link
                    to={`/app/student/gig/${gig.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#121214] text-xs font-black transition-all shadow-sm"
                  >
                    <span>View Gig Scope</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
