import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  Play,
  Check,
  MessageCircle
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { TrustBadge } from '../components/shared/TrustBadge';

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

  // Showcase cards modeled directly after Sense reference bottom cards
  const showcaseTracks = [
    {
      title: 'WEB DEV',
      category: 'Frontend & Web',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      tag: '₹8,500 Avg Escrow',
      link: '/app/student/explore'
    },
    {
      title: 'UI/UX DESIGN',
      category: 'Product & Figma',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      tag: '₹12,000 Avg Escrow',
      link: '/app/student/explore'
    },
    {
      title: 'REELS & MOTION',
      category: 'Social Media',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
      tag: '₹6,000 Avg Escrow',
      link: '/app/student/explore'
    },
    {
      title: 'DATA AUTOMATION',
      category: 'Python & Sheets',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
      tag: '₹4,500 Avg Escrow',
      link: '/app/student/explore'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* ============================================================ */}
      {/* SECTION 1: HERO CONTAINER WITH ORGANIC FLOWING ACCENTS       */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Crisp White Rounded Card Container */}
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-white border border-[#EDE8FD] shadow-[0_20px_60px_-15px_rgba(100,65,180,0.08)] p-6 sm:p-14 relative overflow-hidden">
          
          {/* Flowing Organic Wave Ribbon SVG */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <svg 
              className="w-[140%] h-[120%] -translate-y-4 opacity-80" 
              viewBox="0 0 1400 700" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M -100 350 C 200 150, 450 550, 750 300 C 1050 50, 1250 480, 1550 280 L 1550 450 C 1250 650, 1050 200, 750 460 C 450 700, 200 320, -100 520 Z" 
                fill="#F6F1FD" 
              />
              <path 
                d="M -100 330 C 200 130, 450 530, 750 280 C 1050 30, 1250 460, 1550 260" 
                stroke="#FFA8D5" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeDasharray="12 16"
                opacity="0.8"
              />
            </svg>
          </div>

          <div className="relative z-10">
            
            {/* Top Row Student Showcase Badges */}
            <div className="hidden md:flex justify-between items-center px-8 mb-6 pointer-events-none">
              <div className="flex items-center gap-3 p-2 pr-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-lg -rotate-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Aanya" 
                  className="w-10 h-10 rounded-xl object-cover" 
                />
                <div>
                  <div className="text-xs font-bold text-[#101014]">Aanya S. • PCTE</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">₹18,500 Earned Escrow</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 pr-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-lg rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80" 
                  alt="Rohan" 
                  className="w-10 h-10 rounded-xl object-cover" 
                />
                <div>
                  <div className="text-xs font-bold text-[#101014]">Rohan M. • GNDEC</div>
                  <div className="text-[10px] text-purple-700 font-semibold">Verified Full-Stack</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 pr-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-lg rotate-4">
                <img 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" 
                  alt="Harman" 
                  className="w-10 h-10 rounded-xl object-cover" 
                />
                <div>
                  <div className="text-xs font-bold text-[#101014]">Harman K. • Thapar</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Top Rated UI Designer</div>
                </div>
              </div>
            </div>

            {/* Center Hero Title & Action Pills */}
            <div className="text-center max-w-3xl mx-auto py-4 sm:py-8 space-y-6 relative">
              
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#101014] tracking-tight uppercase leading-none">
                CampusGigs
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
                Verified college talent from PCTE, GNDEC, and Thapar for agile local enterprises. Milestone-backed escrow. Zero agency bloat.
              </p>

              {/* Dual Pill CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/app/student/explore"
                  className="inline-flex items-center gap-2 pl-6 pr-2.5 py-2.5 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#101014] font-black text-xs sm:text-sm shadow-md transition-all group"
                >
                  <span>Explore Micro-Gigs</span>
                  <div className="w-7 h-7 rounded-full bg-[#101014] text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight size={15} />
                  </div>
                </Link>

                <Link
                  to="/app/employer/post-gig"
                  onClick={() => switchRole('employer')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-[#101014] border border-slate-200 font-bold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <MessageCircle size={16} className="text-purple-700" />
                  <span>Post a Task (SMEs)</span>
                </Link>
              </div>

            </div>

          </div>

          {/* Section Divider & Heading */}
          <div className="mt-14 pt-12 border-t border-slate-100 text-center space-y-2 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#101014] tracking-tight">
              Explore Task Tracks in Our Regional Network
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Curated student capabilities matched to local SME digital needs.
            </p>
          </div>

          {/* 4-Card Media Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 relative z-10">
            {showcaseTracks.map((track, idx) => (
              <div 
                key={idx}
                className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-sm border border-slate-200/80 flex flex-col justify-between p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
              >
                <img 
                  src={track.image} 
                  alt={track.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/75 via-transparent to-black/25" />

                <div className="relative z-10 flex justify-end">
                  <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-white/95 text-[#101014] shadow-sm backdrop-blur-md tabular-nums">
                    {track.tag}
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-[#101014]">
                    <Play size={18} className="fill-[#101014] ml-0.5" />
                  </div>
                </div>

                <Link
                  to={track.link}
                  className="relative z-10 flex items-center justify-between pl-4 pr-1.5 py-1.5 rounded-full bg-white text-[#101014] shadow-lg transition-all"
                >
                  <span className="font-extrabold text-xs tracking-wide uppercase">{track.title}</span>
                  <div className="w-7 h-7 rounded-full bg-[#D4F851] text-[#101014] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpRight size={15} />
                  </div>
                </Link>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* SECTION 2: HIGH-CONTRAST SPLIT HERO SECTION                  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-white border border-[#EDE8FD] shadow-[0_20px_60px_-15px_rgba(100,65,180,0.08)] p-6 sm:p-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left High-Contrast Jet Black Card */}
            <div className="lg:col-span-5 rounded-[2rem] sm:rounded-[2.5rem] bg-[#101014] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl">
              
              <svg 
                className="w-28 h-20 mb-4" 
                viewBox="0 0 140 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M 20 80 C 10 30, 60 10, 80 40 C 95 65, 40 85, 30 50 C 20 20, 70 25, 120 30" 
                  stroke="#FFA8D5" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  fill="none" 
                />
              </svg>

              <div className="space-y-4 my-auto">
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.12]">
                  Grow faster with verified student talent.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  CampusGigs connects regional clinics, bakeries, and retail brands with verified campus builders for discrete digital deliverables, eliminating traditional agency overhead.
                </p>
              </div>

              <div className="pt-8">
                <Link
                  to="/auth"
                  className="w-full flex items-center justify-between pl-5 pr-2 py-2 rounded-full bg-white text-[#101014] font-extrabold text-xs sm:text-sm transition-transform hover:scale-[1.02]"
                >
                  <span>Post a Micro-Task</span>
                  <div className="w-8 h-8 rounded-full bg-[#FFA8D5] text-[#101014] flex items-center justify-center font-bold">
                    <ArrowUpRight size={16} />
                  </div>
                </Link>
              </div>

            </div>

            {/* Right Lifestyle Photography Card */}
            <div className="lg:col-span-7 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl min-h-[350px] relative">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80" 
                alt="Students collaborating" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/80 via-transparent to-transparent flex items-end p-8">
                <div className="text-white space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#101014] bg-[#D4F851] px-3 py-1 rounded-full">
                    Campus Network
                  </span>
                  <p className="text-lg font-bold">Ludhiana & Punjab Academic Talent Pool</p>
                  <p className="text-xs text-slate-200">1,400+ Verified Students actively completing 48hr to 2-week milestones.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: BENCHMARK COMPARISON MATRIX                       */}
      {/* ============================================================ */}
      <section id="comparison" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-white border border-[#EDE8FD] shadow-[0_20px_60px_-15px_rgba(100,65,180,0.08)] p-6 sm:p-12 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-[#101014] tracking-tight">
              Why CampusGigs Outperforms Generic Platforms
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Contrasting our hyper-local, milestone-backed trust model against legacy freelance platforms and unpaid internships.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Comparison Matrix</th>
                  <th className="py-4 px-6 text-white bg-[#101014] rounded-t-3xl">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm">CampusGigs (VeriGig)</span>
                      <span className="text-[10px] bg-[#D4F851] text-[#101014] font-black px-2 py-0.5 rounded-full">Zero Bloat</span>
                    </div>
                  </th>
                  <th className="py-4 px-6">Generic Upwork / Fiverr</th>
                  <th className="py-4 px-6">Internship Portals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Task Scope & Velocity</td>
                  <td className="py-4 px-6 bg-[#101014]/5 font-bold text-[#101014]">
                    48-hr to 2-week micro-gigs with discrete deliverables.
                  </td>
                  <td className="py-4 px-6 text-slate-500">Unbounded scope, endless bidding wars, high bot spam.</td>
                  <td className="py-4 px-6 text-slate-500">3-6 month mandatory corporate commitments.</td>
                </tr>

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Identity & Campus Trust</td>
                  <td className="py-4 px-6 bg-[#101014]/5 font-bold text-[#101014]">
                    Verified physical student IDs (PCTE, GNDEC) & SME credentials.
                  </td>
                  <td className="py-4 px-6 text-slate-500">Anonymous accounts, unvetted agencies, scam bids.</td>
                  <td className="py-4 px-6 text-slate-500">Self-reported resumes without institutional verification.</td>
                </tr>

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Escrow Security</td>
                  <td className="py-4 px-6 bg-[#101014]/5 font-bold text-[#101014]">
                    Milestone-backed escrow released upon employer sign-off.
                  </td>
                  <td className="py-4 px-6 text-slate-500">Hefty 20%+ fee take, complex dispute friction.</td>
                  <td className="py-4 px-6 text-slate-500">Frequent unpaid internship complaints and delayed stipends.</td>
                </tr>

                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Local Proximity</td>
                  <td className="py-4 px-6 bg-[#101014]/5 font-bold text-[#101014] rounded-b-3xl">
                    Hyper-local. Students can visit the clinic, bakery, or retail site in person.
                  </td>
                  <td className="py-4 px-6 text-slate-500">Remote only, international time zone friction.</td>
                  <td className="py-4 px-6 text-slate-500">Requires city relocation or physical corporate desk work.</td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: LIVE MICRO-GIG EXPLORER FEED                     */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-white border border-[#EDE8FD] shadow-[0_20px_60px_-15px_rgba(100,65,180,0.08)] p-6 sm:p-12 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-[#101014] tracking-tight">
                Live Micro-Gigs on Campus
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Active tasks ready for student proposals with guaranteed milestone escrow.
              </p>
            </div>

            <Link
              to="/app/student/explore"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#101014] hover:underline"
            >
              <span>View all {gigs.length} micro-gigs</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Category Filter Pills (clean, no parentheses) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#101014] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'All Gigs' : cat}
              </button>
            ))}
          </div>

          {/* Gigs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.slice(0, 6).map((gig) => (
              <div 
                key={gig.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  {/* Category & Budget */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {gig.category}
                    </span>
                    <div className="text-right">
                      <span className="text-base font-black text-[#101014] font-mono tabular-nums">₹{gig.totalBudget.toLocaleString()}</span>
                      <span className="block text-[10px] text-slate-500 capitalize">{gig.paymentType} Escrow</span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link to={`/app/student/gig/${gig.id}`}>
                    <h3 className="text-base font-bold text-[#101014] group-hover:underline transition-colors line-clamp-2 mb-2 leading-snug">
                      {gig.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
                    {gig.description}
                  </p>

                  {/* Company */}
                  <div className="space-y-1 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Building2 size={13} className="text-slate-400" />
                      <span>{gig.employerCompany}</span>
                      {gig.employerVerified && (
                        <TrustBadge type="sme" size="sm" text="Verified SME" />
                      )}
                    </div>
                    {gig.campusProximity && (
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{gig.campusProximity}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {gig.requiredSkills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Pill CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><Clock size={12} /> {gig.targetDuration}</span>
                    <span>•</span>
                    <span>{gig.milestones.length} Milestones</span>
                  </div>

                  <Link
                    to={`/app/student/gig/${gig.id}`}
                    className="inline-flex items-center gap-1 pl-3.5 pr-1.5 py-1.5 rounded-full bg-[#101014] text-white text-xs font-bold hover:bg-slate-800 transition-all group/btn"
                  >
                    <span>Details</span>
                    <div className="w-5 h-5 rounded-full bg-[#D4F851] text-[#101014] flex items-center justify-center font-bold">
                      <ArrowUpRight size={12} />
                    </div>
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: CAMPUS NETWORK PARTNERS                           */}
      {/* ============================================================ */}
      <section id="colleges" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
            Connected Regional Academic Campuses
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
                className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 hover:border-[#101014] transition-colors"
              >
                <GraduationCap size={15} className="text-slate-700" />
                <span>{campus}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
