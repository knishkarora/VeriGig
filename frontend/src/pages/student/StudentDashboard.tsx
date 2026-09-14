import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  FileText, 
  TrendingUp,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const StudentDashboard: React.FC = () => {
  const { currentUser, gigs, proposals } = useMarketplace();

  const activeGigs = gigs.filter(g => g.hiredStudentId === currentUser.id);
  const myProposals = proposals.filter(p => p.studentId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="p-8 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(100,65,180,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-black text-[#101014]">Welcome back, {currentUser.name}</h1>
            <TrustBadge type="student" text="Verified PCTE Student" size="sm" />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Pre-Final Year CSE • Roll #{currentUser.rollNumber} • {currentUser.collegeOrCompany}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/student/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Browse Micro-Gigs</span>
            <div className="w-5 h-5 rounded-full bg-[#D4F851] text-[#101014] flex items-center justify-center font-bold">
              <ArrowUpRight size={13} />
            </div>
          </Link>
          <Link
            to="/app/student/profile"
            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            My Profile
          </Link>
        </div>
      </div>

      {/* Financial & Performance Telemetry Deck (Replacing repetitive 4-card row) */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          {/* Wallet Balance */}
          <div className="sm:px-4 first:pl-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Available Wallet
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Wallet size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-[#101014] mt-2 font-mono tabular-nums">
              ₹{currentUser.balance.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">Instant UPI Payout Ready</div>
          </div>

          {/* Active Escrow */}
          <div className="pt-4 sm:pt-0 sm:px-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Protected Escrow
              </span>
              <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-[#101014] mt-2 font-mono tabular-nums">
              ₹5,000
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">Locked in active milestone</div>
          </div>

          {/* Completed Gigs */}
          <div className="pt-4 sm:pt-0 sm:px-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Completed Deliverables
              </span>
              <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-[#101014] mt-2 font-mono tabular-nums">
              {currentUser.completedGigs}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">100% On-time completion</div>
          </div>

          {/* Trust Score */}
          <div className="pt-4 sm:pt-0 sm:pl-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                SME Trust Score
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-[#101014] mt-2 font-mono tabular-nums">
              {currentUser.rating} <span className="text-base font-normal text-slate-400">/ 5.0</span>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">9 verified client endorsements</div>
          </div>

        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Gigs Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#101014] flex items-center gap-2">
              <Layers size={20} className="text-slate-700" />
              <span>Active Contracts in Progress</span>
            </h2>
            <span className="text-xs text-slate-500 font-bold">{activeGigs.length} Ongoing</span>
          </div>

          {activeGigs.map((gig) => {
            const activeMs = gig.milestones.find(m => m.status === 'active' || m.status === 'under_review') || gig.milestones[0];
            return (
              <div 
                key={gig.id}
                className="p-8 rounded-[2.5rem] bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      In Progress
                    </span>
                    <h3 className="text-xl font-black text-[#101014] mt-2">{gig.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{gig.employerCompany} • {gig.locationScope}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xl font-black text-[#101014] font-mono tabular-nums">₹{gig.totalBudget.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-400 block">{gig.milestones.length} Milestones</span>
                  </div>
                </div>

                {/* Current Active Milestone Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#101014]">
                      Active Stage: {activeMs.title}
                    </span>
                    <span className={`text-[11px] font-black px-3 py-0.5 rounded-full ${
                      activeMs.status === 'under_review'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                    }`}>
                      {activeMs.status === 'under_review' ? 'Pending SME Sign-Off' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{activeMs.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <Clock size={12} /> Target: {activeMs.deadline}
                    </span>
                    <span className="font-black text-emerald-800 font-mono tabular-nums">Escrow Release: ₹{activeMs.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 font-medium">
                    SME Lead: {gig.employerName}
                  </span>
                  <Link
                    to={`/app/student/workspace/${gig.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-black transition-all shadow-sm"
                  >
                    <span>Open Workspace</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Submitted Proposals Tracker */}
          <div className="pt-4 space-y-4">
            <h2 className="text-base font-black text-[#101014] flex items-center gap-2">
              <FileText size={18} className="text-slate-700" />
              <span>My Submitted Proposals</span>
            </h2>

            <div className="space-y-3">
              {myProposals.map((prop) => (
                <div key={prop.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-black text-slate-900 block font-mono tabular-nums">
                      Bid: ₹{prop.bidAmount.toLocaleString()} in {prop.deliveryTimeDays} days
                    </span>
                    <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{prop.coverNote}</span>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                    prop.status === 'hired'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : prop.status === 'shortlisted'
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-slate-100 text-slate-600'
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
          
          <div className="p-7 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[#101014] flex items-center gap-2">
              <Sparkles size={16} className="text-slate-700" />
              <span>Recommended for You</span>
            </h3>

            <div className="space-y-3">
              {gigs.slice(1, 4).map((recGig) => (
                <Link
                  key={recGig.id}
                  to={`/app/student/gig/${recGig.id}`}
                  className="block p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{recGig.category}</span>
                    <span className="text-xs font-black text-[#101014] font-mono tabular-nums">₹{recGig.totalBudget.toLocaleString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:underline transition-colors line-clamp-1">
                    {recGig.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{recGig.employerCompany} • {recGig.targetDuration}</p>
                </Link>
              ))}
            </div>

            <Link
              to="/app/student/explore"
              className="block text-center py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-800 transition-colors"
            >
              Browse All Micro-Gigs
            </Link>
          </div>

          {/* Verification Badge Status Card */}
          <div className="p-7 rounded-[2.5rem] bg-white border border-emerald-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#101014]">College ID Verified</h4>
                <p className="text-[11px] text-emerald-800 font-bold">PCTE Group of Institutes</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your verified student credential gives you priority ranking on local SME proposal queues and instant milestone escrow release.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
