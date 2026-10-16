import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  Building2, 
  ArrowUpRight, 
  Layers, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const GigExplore: React.FC = () => {
  const { gigs } = useMarketplace();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [durationFilter, setDurationFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [verifiedSmeOnly, setVerifiedSmeOnly] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);

  const categories: string[] = ['All', 'Web Dev', 'UI/UX', 'Graphic Design', 'Content & Copy', 'Social Media', 'Data & Research'];

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch = 
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.employerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || gig.category === categoryFilter;
    const matchesDuration = durationFilter === 'All' || gig.targetDuration === durationFilter;
    const matchesLocation = locationFilter === 'All' || gig.locationScope === locationFilter;
    const matchesPayment = paymentFilter === 'All' || gig.paymentType === paymentFilter;
    const matchesBeginner = !beginnerOnly || gig.totalBudget <= 3500;
    const matchesVerified = !verifiedSmeOnly || gig.employerVerified;
    const matchesRemote = !remoteOnly || gig.locationScope === 'Remote';

    return matchesSearch && matchesCategory && matchesDuration && matchesLocation && matchesPayment && matchesBeginner && matchesVerified && matchesRemote;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setDurationFilter('All');
    setLocationFilter('All');
    setPaymentFilter('All');
    setBeginnerOnly(false);
    setVerifiedSmeOnly(false);
    setRemoteOnly(false);
  };

  const hasActiveFilters = categoryFilter !== 'All' || durationFilter !== 'All' || locationFilter !== 'All' || paymentFilter !== 'All' || searchTerm !== '' || beginnerOnly || verifiedSmeOnly || remoteOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="p-8 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(100,65,180,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#101014] tracking-tight">Explore Campus Micro-Gigs</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Browse task-based deliverables from verified local SMEs, clinics, and studios.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 tabular-nums">
          Showing <strong className="text-[#101014]">{filteredGigs.length}</strong> available micro-gigs
        </div>
      </div>

      {/* Search and Filter Box */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-sm space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search micro-gigs by title, skill (React, Figma, Reels), or business name..."
            className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#101014] font-medium transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-[#101014] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          
          <div className="flex items-center gap-1.5 text-slate-600 font-bold">
            <SlidersHorizontal size={14} />
            <span>Filter:</span>
          </div>

          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-[#101014]"
          >
            <option value="All">All Durations</option>
            <option value="Under 48 hrs">Under 48 hrs</option>
            <option value="1 week">1 week</option>
            <option value="2 weeks">2 weeks</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-[#101014]"
          >
            <option value="All">All Locations</option>
            <option value="Hyper-local (On-Campus)">Hyper-local (Campus proximity)</option>
            <option value="City-wide">City-wide</option>
            <option value="Remote">Remote</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-[#101014]"
          >
            <option value="All">All Escrow Types</option>
            <option value="milestone">Milestone Escrow</option>
            <option value="fixed">Fixed Single Escrow</option>
          </select>

          {/* Quick toggle chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setBeginnerOnly(!beginnerOnly)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                beginnerOnly
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {beginnerOnly ? '✓ Beginner-Ready' : '+ Beginner-Ready (≤ ₹3.5k)'}
            </button>

            <button
              type="button"
              onClick={() => setVerifiedSmeOnly(!verifiedSmeOnly)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                verifiedSmeOnly
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {verifiedSmeOnly ? '✓ Verified SME Only' : '+ Verified SME Only'}
            </button>

            <button
              type="button"
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                remoteOnly
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {remoteOnly ? '✓ Remote Only' : '+ Remote Only'}
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors ml-auto"
            >
              <X size={12} />
              <span>Clear Filters</span>
            </button>
          )}

        </div>

      </div>

      {/* Gigs Feed Grid */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xl font-black text-white flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shadow-xs">
            <Layers size={17} />
          </span>
          <span>Available Campus Gigs</span>
        </h2>
        <span className="text-xs text-purple-900 bg-purple-50 border border-purple-200/80 px-3 py-1 rounded-full font-bold tabular-nums">
          {filteredGigs.length} {filteredGigs.length === 1 ? 'Opportunity' : 'Opportunities'}
        </span>
      </div>

      {filteredGigs.length === 0 ? (
        <div className="py-20 text-center rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-3">
          <Layers size={36} className="mx-auto text-slate-300" />
          <h3 className="text-base font-black text-[#101014]">No micro-gigs matched your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try loosening your filters or clearing the search keyword.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-full bg-[#101014] text-white text-xs font-bold shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <div 
              key={gig.id}
              className="p-6 rounded-[2rem] bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-xl shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                
                {/* Header row */}
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

                {/* Company & Proximity */}
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

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {gig.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>

              </div>

              {/* Bottom Card Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {gig.targetDuration}
                  </span>
                  <span>•</span>
                  <span>{gig.milestones.length} Milestones</span>
                </div>

                <Link
                  to={`/app/student/gig/${gig.id}`}
                  className="inline-flex items-center gap-1.5 pl-4 pr-1.5 py-1.5 rounded-full bg-[#101014] text-white text-xs font-bold hover:bg-slate-800 transition-all group/btn shadow-sm"
                >
                  <span>Apply</span>
                  <div className="w-5 h-5 rounded-full bg-[#D4F851] text-[#101014] flex items-center justify-center font-bold">
                    <ArrowUpRight size={12} />
                  </div>
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
