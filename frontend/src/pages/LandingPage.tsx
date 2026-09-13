import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  ChevronRight, 
  Award,
  Layers,
  Search,
  Filter,
  Users
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { TrustBadge } from '../components/shared/TrustBadge';
import { GigCategory } from '../types';

export const LandingPage: React.FC = () => {
  const { gigs, switchRole } = useMarketplace();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: string[] = [
    'All',
    'Web Dev',
    'UI/UX',
    'Graphic Design',
    'Content & Copy',
    'Social Media',
    'Data & Research'
  ];

  const filteredGigs = selectedCategory === 'All' 
    ? gigs 
    : gigs.filter(g => g.category === selectedCategory);

  return (
    <div className="relative overflow-hidden">
      
      {/* Background glowing ribbons and decorative wave curves (inspired by design references) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[5%] w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[130px]" />
        
        {/* Curved decorative ribbon SVG */}
        <svg 
          className="absolute top-12 left-0 w-full h-[550px] opacity-25" 
          viewBox="0 0 1200 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M-100 200 C 300 50, 600 450, 1300 150" 
            stroke="url(#ribbon-gradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeDasharray="6 8"
          />
          <path 
            d="M-50 250 C 350 120, 700 500, 1350 220" 
            stroke="url(#ribbon-gradient-2)" 
            strokeWidth="2" 
          />
          <defs>
            <linearGradient id="ribbon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#EC4899" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="ribbon-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-sm">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              <span>Zero-Bloat Micro-Gigs for College Campuses & Local SMEs</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Verified College Talent for Agile Local Businesses.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Connect directly with verified students from <strong className="text-white font-semibold">PCTE</strong>, <strong className="text-white font-semibold">GNDEC</strong>, and <strong className="text-white font-semibold">Thapar</strong> for task-based deliverables. Funded by milestone escrow. Zero 6-month unpaid internship bloat.
            </p>

            {/* Action Buttons & Fast Demo Pills */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/app/student/explore"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow-indigo transition-all group"
              >
                <span>Explore Micro-Gigs</span>
                <div className="w-6 h-6 rounded-full bg-indigo-900 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight size={14} />
                </div>
              </Link>

              <Link
                to="/app/employer/post-gig"
                onClick={() => switchRole('employer')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
              >
                <Building2 size={16} className="text-emerald-400" />
                <span>Post a Task (SMEs)</span>
              </Link>
            </div>

            {/* Micro proof tags */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Govt/College ID Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Milestone-Locked Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>48hr to 2-week Deliverables</span>
              </div>
            </div>

          </div>

          {/* Right Visual Floating Showcase Cards (inspired by design sample 1 & 2) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none space-y-4">
              
              {/* Primary Card - Active Workspace Snapshot */}
              <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Milestone Payout
                  </span>
                  <span className="text-xs text-slate-400">Escrow Protected</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">Digital Ordering Menu & WhatsApp Checkout</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Bakeology Artisan Bakery • Sarabha Nagar</p>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400 shrink-0">₹8,500</span>
                  </div>

                  {/* Milestone Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Milestone 1: Catalog UI & Cart</span>
                      <span className="text-emerald-400 font-semibold">Approved & Paid (₹3,500)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 w-[60%] rounded-full"></div>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                        alt="Aarav" 
                        className="w-6 h-6 rounded-full object-cover border border-emerald-500/50"
                      />
                      <span className="text-slate-200 font-medium">Aarav Sharma</span>
                      <TrustBadge type="student" text="PCTE CSE" size="sm" />
                    </div>
                    <span className="text-[11px] text-slate-400">Under 48 hrs delivery</span>
                  </div>
                </div>
              </div>

              {/* Floating Second Card - Verification Showcase */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#111827] to-[#1a2333] border border-indigo-500/30 shadow-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Institutional Talent Pool</span>
                      <ShieldCheck size={13} className="text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">1,400+ Verified Students across Ludhiana & Punjab</p>
                  </div>
                </div>
                <Link 
                  to="/auth"
                  className="px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0"
                >
                  Verify ID <ChevronRight size={12} />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Three-Pillar Comparison Matrix Section */}
      <section id="comparison" className="py-20 bg-[#0B0F1A]/90 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
              Direct Benchmark Matrix
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why CampusGigs Beats Generic Freelance & Internship Portals
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Built specifically for the unit economics and fast turnaround needed by local SMEs and agile college builders.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Comparison Vector</th>
                  <th className="py-4 px-6 text-white bg-indigo-950/30 rounded-t-2xl border-x border-t border-indigo-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400 font-extrabold text-sm">CampusGigs (VeriGig)</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Purpose-Built</span>
                    </div>
                  </th>
                  <th className="py-4 px-6">Generic Platforms (Upwork, Fiverr)</th>
                  <th className="py-4 px-6">Internship Portals (Internshala)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">Project Granularity & Speed</td>
                  <td className="py-4 px-6 bg-indigo-950/20 border-x border-indigo-500/20 font-medium text-emerald-300">
                    48-hr to 2-week micro-gigs with discrete deliverables.
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    Broad scope, hours of bid wars, high overseas noise.
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    Long 3-6 month full-time commitment requirement.
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">Identity & Trust Verification</td>
                  <td className="py-4 px-6 bg-indigo-950/20 border-x border-indigo-500/20 font-medium text-emerald-300">
                    Verified physical college IDs (PCTE, GNDEC) & SME business documents.
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    Unverified accounts, bot bidders, fake agency fronts.
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    Basic resume upload without real skill/ID validation.
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">Financial & Milestone Safety</td>
                  <td className="py-4 px-6 bg-indigo-950/20 border-x border-indigo-500/20 font-medium text-emerald-300">
                    Milestone-backed escrow payout released upon inspection sign-off.
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    High 20%+ platform cut, confusing dispute arbitration.
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    Delayed monthly stipends; frequent unpaid internship abuse.
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">Local Context & Proximity</td>
                  <td className="py-4 px-6 bg-indigo-950/20 border-x border-indigo-500/20 font-medium text-emerald-300 rounded-b-2xl border-b border-indigo-500/30">
                    Hyper-local. Students can visit the clinic, bakery, or store in person.
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    Remote-only, time zone friction, cultural disconnects.
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    Often requires relocation or remote corporate grind.
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Live Micro-Gig Preview Feed Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Live Opportunities
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Featured Micro-Gigs on Campus
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Real projects waiting for immediate student proposals.
            </p>
          </div>

          <Link
            to="/app/student/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View all {gigs.length} open micro-gigs</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Category Pills (from reference images style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-glow-indigo'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat === 'All' ? '(All Categories)' : `(${cat})`}
            </button>
          ))}
        </div>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.slice(0, 6).map((gig) => (
            <div 
              key={gig.id}
              className="p-6 rounded-3xl bg-[#111827]/70 backdrop-blur-md border border-slate-800 hover:border-indigo-500/40 hover:bg-[#151e33] transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                    {gig.category}
                  </span>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-white">₹{gig.totalBudget.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-400 capitalize">{gig.paymentType} Escrow</span>
                  </div>
                </div>

                {/* Title */}
                <Link to={`/app/student/gig/${gig.id}`}>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2 leading-snug">
                    {gig.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {gig.description}
                </p>

                {/* Company & Proximity */}
                <div className="space-y-1 mb-4 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <Building2 size={13} className="text-slate-400" />
                    <span>{gig.employerCompany}</span>
                    {gig.employerVerified && (
                      <TrustBadge type="sme" size="sm" text="Verified SME" />
                    )}
                  </div>
                  {gig.campusProximity && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{gig.campusProximity}</span>
                    </div>
                  )}
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {gig.requiredSkills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                      {skill}
                    </span>
                  ))}
                  {gig.requiredSkills.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      +{gig.requiredSkills.length - 3}
                    </span>
                  )}
                </div>

              </div>

              {/* Bottom Card Action (Directional Arrow Pill from design sample) */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {gig.targetDuration}
                  </span>
                  <span>•</span>
                  <span>{gig.milestones.length} Milestones</span>
                </div>

                <Link
                  to={`/app/student/gig/${gig.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 text-xs font-semibold transition-all group/btn"
                >
                  <span>Details</span>
                  <ArrowUpRight size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* College Network Section */}
      <section id="colleges" className="py-16 border-t border-slate-800/80 bg-[#090D16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6">
            Connected Regional Academic Campuses
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {[
              'PCTE Group of Institutes (Ludhiana)',
              'GNDEC Engineering College',
              'Thapar Institute (TIET)',
              'Punjab Agricultural University (PAU)',
              'Chitkara University',
              'Christian Medical College (CMC)'
            ].map((campus, idx) => (
              <div 
                key={idx}
                className="px-4 py-2 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2 hover:border-slate-700 transition-colors"
              >
                <GraduationCap size={14} className="text-indigo-400" />
                <span>{campus}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-[#102422] border border-indigo-500/30 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30">
              Ready to collaborate?
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Post a 48-hour micro-task or earn your first college escrow payout.
            </h3>
            <p className="text-sm text-slate-300">
              Zero registration fees. Instant verification using student college ID card or business GSTIN.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Student / SME Sign Up</span>
              <ArrowUpRight size={14} />
            </Link>
            <Link
              to="/app/employer/post-gig"
              onClick={() => switchRole('employer')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Post a Micro-Gig ↗</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
