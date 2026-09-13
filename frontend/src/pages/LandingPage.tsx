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
    <div className="space-y-16 pb-12">
      
      {/* ============================================================ */}
      {/* SECTION 1: SENSE-INSPIRED HERO CONTAINER WITH CURVED RIBBON  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Giant Crisp White Rounded Card Container (directly from Sense sample) */}
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-white border border-[#EDE8FD] shadow-[0_20px_60px_-15px_rgba(112,80,200,0.08)] p-6 sm:p-14 relative overflow-hidden">
          
          {/* Flowing Organic Pastel Lilac Wave Ribbon SVG running across the hero */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <svg 
              className="w-[140%] h-[120%] -translate-y-4 opacity-75" 
              viewBox="0 0 1400 700" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Thick organic wavy ribbon shape */}
              <path 
                d="M -100 350 C 200 150, 450 550, 750 300 C 1050 50, 1250 480, 1550 280 L 1550 450 C 1250 650, 1050 200, 750 460 C 450 700, 200 320, -100 520 Z" 
                fill="#F3E8FF" 
              />
              {/* Secondary subtle accent stroke */}
              <path 
                d="M -100 330 C 200 130, 450 530, 750 280 C 1050 30, 1250 460, 1550 260" 
                stroke="#FFA8D5" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeDasharray="10 14"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Floating Avatar / Task Thumbnails positioned along the wave (from Sense reference) */}
          <div className="relative z-10">
            
            {/* Top Row Floating Thumbnail Capsules */}
            <div className="hidden md:flex justify-between items-center px-12 mb-6 pointer-events-none">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white -rotate-6 transform hover:rotate-0 transition-transform">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Student" className="w-full h-full object-cover" />
              </div>

              <div className="w-24 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white rotate-3">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80" alt="Team" className="w-full h-full object-cover" />
              </div>

              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white 6 rotate-6">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" alt="Student" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Center Hero Title & Action Pills */}
            <div className="text-center max-w-3xl mx-auto py-6 sm:py-10 space-y-6 relative">
              
              {/* Floating lower side thumbnails */}
              <div className="hidden sm:block absolute -left-12 top-1/2 -translate-y-1/2 w-16 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white -rotate-12 pointer-events-none">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80" alt="Student" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block absolute -right-12 top-1/2 -translate-y-1/2 w-20 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white rotate-12 pointer-events-none">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Employer" className="w-full h-full object-cover" />
              </div>

              {/* Bold Center Brand Name (Sense style) */}
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#121214] tracking-tight uppercase leading-none">
                CampusGigs
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-xl mx-auto tracking-normal">
                Verified college talent from PCTE, GNDEC, and Thapar for agile local enterprises. Milestone-backed escrow. Zero bloat.
              </p>

              {/* Dual Pill CTA Buttons (from Sense reference) */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                
                {/* Primary Acid Lime Pill Button with Arrow */}
                <Link
                  to="/app/student/explore"
                  className="inline-flex items-center gap-2 pl-6 pr-3 py-3 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#121214] font-black text-xs sm:text-sm shadow-md transition-all group"
                >
                  <span>Explore Micro-Gigs</span>
                  <div className="w-7 h-7 rounded-full bg-[#121214] text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight size={15} />
                  </div>
                </Link>

                {/* Secondary Contact / Post Pill Button */}
                <Link
                  to="/app/employer/post-gig"
                  onClick={() => switchRole('employer')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-[#121214] border border-slate-300 font-bold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <MessageCircle size={17} className="text-purple-600" />
                  <span>Post a Task (SMEs)</span>
                </Link>

              </div>

            </div>

          </div>

          {/* Section Divider & Heading (from Sense reference) */}
          <div className="mt-14 pt-12 border-t border-purple-100/80 text-center space-y-3 relative z-10">
            
            {/* Lilac Accent Pill Tag */}
            <div className="inline-block px-5 py-1.5 rounded-full bg-[#F3E8FF] border border-purple-200 text-purple-900 text-xs font-black uppercase tracking-widest">
              DISCOVER NEW HORIZONS — VERIFIED CAMPUS TALENT
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#121214] uppercase tracking-tight">
              Explore Task Tracks in Our Regional Network
            </h2>

          </div>

          {/* 4-Card Media Showcase Grid (Directly from Sense reference bottom cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 relative z-10">
            {showcaseTracks.map((track, idx) => (
              <div 
                key={idx}
                className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-md border border-slate-200/80 flex flex-col justify-between p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
              >
                {/* Background Image */}
                <img 
                  src={track.image} 
                  alt={track.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />

                {/* Subtle dark gradient overlay so pill pops */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Top tag */}
                <div className="relative z-10 flex justify-end">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white/90 text-slate-900 shadow-sm backdrop-blur-md">
                    {track.tag}
                  </span>
                </div>

                {/* Center glowing Play / Preview Circle (Sense motif) */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-[#121214]">
                    <Play size={18} className="fill-[#121214] ml-0.5" />
                  </div>
                </div>

                {/* Bottom Floating White Pill Bar with Acid Lime Arrow Circle (Sense motif) */}
                <Link
                  to={track.link}
                  className="relative z-10 flex items-center justify-between pl-4 pr-1.5 py-1.5 rounded-full bg-white text-[#121214] shadow-lg transition-all"
                >
                  <span className="font-black text-xs tracking-wider uppercase">{track.title}</span>
                  <div className="w-7 h-7 rounded-full bg-[#D4F851] text-[#121214] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpRight size={15} />
                  </div>
                </Link>

              </div>
            ))}
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* SECTION 2: SHINTA-INSPIRED HIGH-CONTRAST SPLIT HERO SECTION */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-white border border-[#EDE8FD] shadow-[0_20px_60px_-15px_rgba(112,80,200,0.08)] p-6 sm:p-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left High-Contrast Jet Black Card with Pink Ribbon Doodle (Shinta motif) */}
            <div className="lg:col-span-5 rounded-[2rem] sm:rounded-[2.5rem] bg-[#121214] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl">
              
              {/* Playful Pink Ribbon Loop Doodle SVG (Shinta signature) */}
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
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.15]">
                  Let's grow through verified student talent!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  CampusGigs helps regional clinics, bakeries, and retail brands create digital products that earn customer attention, drive engagement, and eliminate agency overhead.
                </p>
              </div>

              {/* Shinta Style Pill Button */}
              <div className="pt-8">
                <Link
                  to="/auth"
                  className="w-full flex items-center justify-between pl-5 pr-2 py-2 rounded-full bg-white text-[#121214] font-black text-xs sm:text-sm transition-transform hover:scale-[1.02]"
                >
                  <span>Post a Micro-Task</span>
                  <div className="w-8 h-8 rounded-full bg-[#FFA8D5] text-[#121214] flex items-center justify-center font-bold">
                    <ArrowUpRight size={16} />
                  </div>
                </Link>
              </div>

            </div>

            {/* Right Lifestyle Photography Card (Shinta motif) */}
            <div className="lg:col-span-7 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl min-h-[350px] relative">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80" 
                alt="Students collaborating" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-8">
                <div className="text-white space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D4F851] bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                    Campus Network
                  </span>
                  <p className="text-lg font-bold">Ludhiana & Punjab Academic Talent Pool</p>
                  <p className="text-xs text-slate-200">1,400+ Verified Students actively bidding on 48hr - 2wk tasks.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: THREE-PILLAR BENCHMARK COMPARISON MATRIX          */}
      {/* ============================================================ */}
      <section id="comparison" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-white border border-[#EDE8FD] shadow-[0_20px_60px_-15px_rgba(112,80,200,0.08)] p-6 sm:p-12 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-4 py-1 rounded-full bg-[#F3E8FF] text-purple-900 font-extrabold text-xs uppercase tracking-wider">
              Three-Pillar Benchmark
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#121214] tracking-tight">
              Why CampusGigs Outperforms Generic Platforms
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Contrasting our hyper-local, milestone-backed trust model against legacy freelance sites and long-term internship portals.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-purple-100 text-xs font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Comparison Matrix</th>
                  <th className="py-4 px-6 text-[#121214] bg-purple-50 rounded-t-3xl border-x border-t border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm">CampusGigs (VeriGig)</span>
                      <span className="text-[10px] bg-[#D4F851] text-[#121214] font-extrabold px-2 py-0.5 rounded-full">Zero Bloat</span>
                    </div>
                  </th>
                  <th className="py-4 px-6">Generic Upwork / Fiverr</th>
                  <th className="py-4 px-6">Internship Portals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 text-xs font-medium text-slate-700">
                
                <tr className="hover:bg-purple-50/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Task Scope & Velocity</td>
                  <td className="py-4 px-6 bg-purple-50/70 border-x border-purple-200 font-bold text-purple-900">
                    48-hr to 2-week micro-gigs with discrete deliverables.
                  </td>
                  <td className="py-4 px-6 text-slate-500">Unbounded scope, endless bid wars, high bot friction.</td>
                  <td className="py-4 px-6 text-slate-500">3-6 month mandatory corporate commitments.</td>
                </tr>

                <tr className="hover:bg-purple-50/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Identity & Campus Trust</td>
                  <td className="py-4 px-6 bg-purple-50/70 border-x border-purple-200 font-bold text-purple-900">
                    Verified physical student IDs (PCTE, GNDEC) & SME business documents.
                  </td>
                  <td className="py-4 px-6 text-slate-500">Anonymous accounts, fake agencies, unvetted bids.</td>
                  <td className="py-4 px-6 text-slate-500">Self-reported resumes without institutional check.</td>
                </tr>

                <tr className="hover:bg-purple-50/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Escrow Security</td>
                  <td className="py-4 px-6 bg-purple-50/70 border-x border-purple-200 font-bold text-purple-900">
                    Milestone-backed escrow released upon employer sign-off.
                  </td>
                  <td className="py-4 px-6 text-slate-500">Hefty 20%+ fee take, complex dispute arbitration.</td>
                  <td className="py-4 px-6 text-slate-500">Frequent unpaid internship complaints and delayed stipends.</td>
                </tr>

                <tr className="hover:bg-purple-50/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">Local Proximity</td>
                  <td className="py-4 px-6 bg-purple-50/70 border-x border-b border-purple-200 font-bold text-purple-900 rounded-b-3xl">
                    Hyper-local. Students can visit the clinic, bakery, or retail site in person.
                  </td>
                  <td className="py-4 px-6 text-slate-500">Remote only, time zone friction.</td>
                  <td className="py-4 px-6 text-slate-500">Requires city relocation or corporate desk work.</td>
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
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-white border border-[#EDE8FD] shadow-[0_20px_60px_-15px_rgba(112,80,200,0.08)] p-6 sm:p-12 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Active Contracts
              </span>
              <h2 className="text-3xl font-black text-[#121214] tracking-tight mt-2">
                Live Micro-Gigs on Campus
              </h2>
            </div>

            <Link
              to="/app/student/explore"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-950"
            >
              <span>View all {gigs.length} micro-gigs</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#121214] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                className="p-6 rounded-3xl bg-[#F8F6FE] border border-purple-100 hover:border-purple-300 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Category & Budget */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white text-purple-900 border border-purple-200">
                      {gig.category}
                    </span>
                    <div className="text-right">
                      <span className="text-base font-black text-[#121214]">₹{gig.totalBudget.toLocaleString()}</span>
                      <span className="block text-[10px] text-slate-500 capitalize">{gig.paymentType} Escrow</span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link to={`/app/student/gig/${gig.id}`}>
                    <h3 className="text-base font-black text-[#121214] group-hover:text-purple-700 transition-colors line-clamp-2 mb-2 leading-snug">
                      {gig.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
                    {gig.description}
                  </p>

                  {/* Company */}
                  <div className="space-y-1 mb-4 pb-4 border-b border-purple-200/60">
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
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white text-slate-700 border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Pill CTA */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><Clock size={12} /> {gig.targetDuration}</span>
                    <span>•</span>
                    <span>{gig.milestones.length} Milestones</span>
                  </div>

                  <Link
                    to={`/app/student/gig/${gig.id}`}
                    className="inline-flex items-center gap-1 pl-3.5 pr-1.5 py-1.5 rounded-full bg-[#121214] text-white text-xs font-bold hover:bg-slate-800 transition-all group/btn"
                  >
                    <span>Details</span>
                    <div className="w-5 h-5 rounded-full bg-[#D4F851] text-[#121214] flex items-center justify-center font-bold">
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
      {/* SECTION 5: CAMPUS ECOSYSTEM NETWORK BADGES                   */}
      {/* ============================================================ */}
      <section id="colleges" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-sm space-y-5">
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Connected Regional Academic Campuses
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
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
                className="px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-slate-800 flex items-center gap-2"
              >
                <GraduationCap size={15} className="text-purple-600" />
                <span>{campus}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
