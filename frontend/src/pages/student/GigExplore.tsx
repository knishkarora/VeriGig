import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Building2, 
  ArrowUpRight, 
  Layers, 
  CheckCircle2, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';
import { GigCategory, GigDuration, LocationScope } from '../../types';

export const GigExplore: React.FC = () => {
  const { gigs } = useMarketplace();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [durationFilter, setDurationFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');

  const categories: string[] = ['All', 'Web Dev', 'UI/UX', 'Graphic Design', 'Content & Copy', 'Social Media', 'Data & Research'];
  const durations: string[] = ['All', 'Under 48 hrs', '1 week', '2 weeks'];
  const locations: string[] = ['All', 'Hyper-local (On-Campus)', 'City-wide', 'Remote'];
  const paymentTypes: string[] = ['All', 'milestone', 'fixed'];

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

    return matchesSearch && matchesCategory && matchesDuration && matchesLocation && matchesPayment;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setDurationFilter('All');
    setLocationFilter('All');
    setPaymentFilter('All');
  };

  const hasActiveFilters = categoryFilter !== 'All' || durationFilter !== 'All' || locationFilter !== 'All' || paymentFilter !== 'All' || searchTerm !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Campus Micro-Gigs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse task-based projects from verified local SMEs, clinics, and studios.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredGigs.length}</strong> available micro-gigs</span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="p-6 rounded-3xl bg-[#111827]/80 backdrop-blur-md border border-slate-800 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search micro-gigs by title, skill (React, Figma, Reels), or business name..."
            className="w-full pl-12 pr-4 py-2.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-glow-indigo'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat === 'All' ? '(All Categories)' : `(${cat})`}
            </button>
          ))}
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/60 text-xs">
          
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <SlidersHorizontal size={14} />
            <span>Refine:</span>
          </div>

          {/* Duration Filter */}
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Durations</option>
            <option value="Under 48 hrs">Under 48 hrs</option>
            <option value="1 week">1 week</option>
            <option value="2 weeks">2 weeks</option>
          </select>

          {/* Location Scope */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Locations</option>
            <option value="Hyper-local (On-Campus)">Hyper-local (Campus proximity)</option>
            <option value="City-wide">City-wide</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Payment Type */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Escrow Types</option>
            <option value="milestone">Milestone Escrow</option>
            <option value="fixed">Fixed Single Escrow</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800 transition-colors ml-auto"
            >
              <X size={13} /> Clear filters
            </button>
          )}

        </div>

      </div>

      {/* Gigs Feed Grid */}
      {filteredGigs.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Layers size={36} className="mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No micro-gigs matched your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try loosening your filters or clearing the search keyword.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
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
                  {gig.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                      {skill}
                    </span>
                  ))}
                </div>

              </div>

              {/* Bottom Card Action */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {gig.targetDuration}
                  </span>
                  <span>•</span>
                  <span>{gig.milestones.length} Milestones</span>
                </div>

                <Link
                  to={`/app/student/gig/${gig.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 text-xs font-bold transition-all group/btn"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
