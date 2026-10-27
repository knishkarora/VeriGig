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
  ExternalLink
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';

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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-slate-300 shadow-xs">
          <span>Enterprise ID:</span>
          <strong className="font-mono text-purple-300">{id || currentUser.id}</strong>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {avatar ? (
              <img 
                src={avatar} 
                alt={companyName} 
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
                  {companyName}
                </h1>
                {isVerified ? (
                  <TrustBadge type="sme" text="Verified SME Partner" size="sm" />
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-semibold">
                    Verification In Progress
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 font-medium">
                Authorized Lead: <strong className="text-[#101014] font-bold">{representativeName}</strong>
              </p>

              <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>{location}</span>
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>{category}</span>
                </span>
                {website && (
                  <a 
                    href={website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action for employer vs candidate */}
          {isCurrentEmployer ? (
            <Link
              to="/app/employer/profile"
              className="px-5 py-2.5 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm shrink-0"
            >
              Manage Business Profile
            </Link>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-left sm:text-right space-y-1 shrink-0">
              <span className="text-[10px] text-emerald-800 block font-bold uppercase tracking-wider">Escrow Commitment</span>
              <span className="text-xs font-black text-emerald-700 flex items-center justify-start sm:justify-end gap-1">
                <ShieldCheck size={15} /> 100% Pre-funded Escrow
              </span>
            </div>
          )}
        </div>

        {/* Company Description */}
        <div className="relative z-10 mt-6 pt-5 border-t border-purple-100 space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">About the Enterprise</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl font-normal">
            {bio}
          </p>
        </div>
      </div>

      {/* DPDPA 2023 Data Privacy Safeguard Notice */}
      <div className="p-5 rounded-2xl bg-white border border-[#EDE8FD] shadow-xs flex items-start gap-3.5 text-xs text-slate-600">
        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
          <Lock className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <strong className="text-[#101014] block font-bold">DPDPA 2023 Privacy Safeguard</strong>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            In strict compliance with the Digital Personal Data Protection Act (DPDPA 2023), registered tax credentials (GSTIN / Udyam / PAN), banking, and private contact lines are held under administrative encryption and are never exposed publicly.
          </p>
        </div>
      </div>

      {/* Active Listings Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Briefcase size={20} className="text-purple-400" />
              <span>Micro-Gigs Posted by {companyName}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore active campus projects open for student proposals</p>
          </div>
          <span className="text-xs font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full tabular-nums">
            {employerGigs.length} {employerGigs.length === 1 ? 'Listing' : 'Listings'}
          </span>
        </div>

        {employerGigs.length === 0 ? (
          <div className="p-12 text-center rounded-[2.5rem] bg-white border border-dashed border-slate-200 space-y-3">
            <Layers size={36} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-[#101014]">No active open listings currently</h3>
            <p className="text-xs text-slate-500">
              This employer has completed their active sprint or is preparing new listings.
            </p>
            <Link
              to="/app/student/explore"
              className="inline-block mt-2 px-5 py-2.5 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-black shadow-sm"
            >
              Explore Other Campus Gigs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {employerGigs.map((gig) => (
              <div 
                key={gig.id} 
                className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all space-y-4 text-left shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {gig.category}
                      </span>
                      <h3 className="text-base font-bold text-[#101014] mt-2 leading-snug">
                        {gig.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{gig.locationScope} • {gig.targetDuration}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-[#101014] font-mono tabular-nums">
                        ₹{gig.totalBudget.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium">{gig.milestones.length} Milestones</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {gig.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {gig.requiredSkills.slice(0, 3).map((sk, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 font-medium">
                        {sk}
                      </span>
                    ))}
                    {gig.requiredSkills.length > 3 && (
                      <span className="text-[10px] text-slate-400 px-1 py-0.5">
                        +{gig.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {gig.applicantsCount} candidate proposals
                  </span>
                  <Link
                    to={`/app/student/gig/${gig.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
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
