import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  TrendingUp,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const StudentDashboard: React.FC = () => {
  const { currentUser, gigs, proposals } = useMarketplace();

  // Find gigs where the student is hired
  const activeGigs = gigs.filter(g => g.hiredStudentId === currentUser.id);
  const myProposals = proposals.filter(p => p.studentId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">Welcome back, {currentUser.name}</h1>
            <TrustBadge type="student" text="Verified PCTE Student" size="sm" />
          </div>
          <p className="text-xs text-slate-400">
            Pre-Final Year CSE • Roll #{currentUser.rollNumber} • {currentUser.collegeOrCompany}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/student/explore"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-indigo transition-all"
          >
            <span>Browse Micro-Gigs</span>
            <ArrowUpRight size={14} />
          </Link>
          <Link
            to="/app/student/profile"
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            View Public Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Earned */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Earnings (Wallet)
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              ₹{currentUser.balance.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">Instant UPI payout ready</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400">
            <Wallet size={22} />
          </div>
        </div>

        {/* Escrow Locked */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Milestone Escrow Active
            </span>
            <span className="text-2xl font-black text-indigo-400 mt-1 block">
              ₹5,000
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">Locked & protected in smart escrow</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/20 text-indigo-400">
            <Sparkles size={22} />
          </div>
        </div>

        {/* Completed Gigs */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Completed Gigs
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {currentUser.completedGigs}
            </span>
            <span className="text-[10px] text-emerald-400 mt-1 block">100% On-time delivery rate</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Rating */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Employer Trust Score
            </span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">
              ⭐ {currentUser.rating} / 5.0
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">Based on 9 verified reviews</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/20 text-amber-400">
            <TrendingUp size={22} />
          </div>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Gigs Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-indigo-400" />
              <span>Active Micro-Gigs in Progress</span>
            </h2>
            <span className="text-xs text-slate-400">{activeGigs.length} Ongoing Contract</span>
          </div>

          {activeGigs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-slate-400">
              <p className="text-sm">No active gigs right now.</p>
              <Link to="/app/student/explore" className="text-xs text-indigo-400 hover:underline mt-2 inline-block">
                Explore open micro-gigs ↗
              </Link>
            </div>
          ) : (
            activeGigs.map((gig) => {
              const activeMs = gig.milestones.find(m => m.status === 'active' || m.status === 'under_review') || gig.milestones[0];
              return (
                <div 
                  key={gig.id}
                  className="p-6 rounded-3xl bg-[#111827]/80 backdrop-blur-md border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{gig.title}</h3>
                      <p className="text-xs text-slate-400">{gig.employerCompany} • {gig.locationScope}</p>
                    </div>
                    <div className="text-right sm:self-start">
                      <span className="text-base font-black text-white">₹{gig.totalBudget.toLocaleString()}</span>
                      <span className="text-[11px] text-slate-400 block">{gig.milestones.length} Milestones</span>
                    </div>
                  </div>

                  {/* Current Active Milestone Card */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-300">
                        Current Task: {activeMs.title}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        activeMs.status === 'under_review'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {activeMs.status === 'under_review' ? 'Pending SME Sign-Off' : 'In Progress'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{activeMs.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Clock size={12} /> Target Deadline: {activeMs.deadline}
                      </span>
                      <span className="font-bold text-emerald-400">Milestone Payout: ₹{activeMs.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">
                      Client Contact: {gig.employerName}
                    </span>
                    <Link
                      to={`/app/student/workspace/${gig.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow-indigo transition-all"
                    >
                      <span>Open Project Workspace</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}

          {/* Submitted Proposals Tracker */}
          <div className="pt-4 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText size={16} className="text-indigo-400" />
              <span>My Submitted Proposals</span>
            </h2>

            <div className="space-y-3">
              {myProposals.map((prop) => (
                <div key={prop.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-white block">Bid: ₹{prop.bidAmount.toLocaleString()} in {prop.deliveryTimeDays} days</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{prop.coverNote}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                    prop.status === 'hired'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : prop.status === 'shortlisted'
                      ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {prop.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Recommendations & Local Campus Feed */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#111827]/80 backdrop-blur-md border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <span>Recommended for Your Skills</span>
            </h3>

            <div className="space-y-3">
              {gigs.slice(1, 4).map((recGig) => (
                <Link
                  key={recGig.id}
                  to={`/app/student/gig/${recGig.id}`}
                  className="block p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-indigo-400">{recGig.category}</span>
                    <span className="text-xs font-bold text-white">₹{recGig.totalBudget.toLocaleString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {recGig.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">{recGig.employerCompany} • {recGig.targetDuration}</p>
                </Link>
              ))}
            </div>

            <Link
              to="/app/student/explore"
              className="block text-center py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-300 transition-colors"
            >
              Browse All Micro-Gigs
            </Link>
          </div>

          {/* Verification Badge Status Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-[#111827] border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">College ID Active</h4>
                <p className="text-[10px] text-emerald-400">Verified PCTE Student</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your verified student credential gives you priority ranking on local SME proposal queues.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
