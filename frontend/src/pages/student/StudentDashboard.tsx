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
      <div className="p-8 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-black text-[#121214]">Welcome back, {currentUser.name}</h1>
            <TrustBadge type="student" text="Verified PCTE Student" size="sm" />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Pre-Final Year CSE • Roll #{currentUser.rollNumber} • {currentUser.collegeOrCompany}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/student/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Browse Micro-Gigs</span>
            <div className="w-5 h-5 rounded-full bg-[#D4F851] text-[#121214] flex items-center justify-center font-bold">
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Earned */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Wallet Balance
            </span>
            <span className="text-3xl font-black text-[#121214] mt-1 block">
              ₹{currentUser.balance.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 block">Instant UPI payout ready</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700">
            <Wallet size={24} />
          </div>
        </div>

        {/* Escrow Active */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Active Milestone Escrow
            </span>
            <span className="text-3xl font-black text-purple-900 mt-1 block">
              ₹5,000
            </span>
            <span className="text-[10px] text-purple-600 font-bold mt-1 block">Locked & protected</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-700">
            <Sparkles size={24} />
          </div>
        </div>

        {/* Completed */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Completed Gigs
            </span>
            <span className="text-3xl font-black text-[#121214] mt-1 block">
              {currentUser.completedGigs}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 block">100% On-time track record</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-700">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Trust score */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              SME Trust Score
            </span>
            <span className="text-3xl font-black text-amber-600 mt-1 block">
              ⭐ {currentUser.rating}
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-1 block">9 verified reviews</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
            <TrendingUp size={24} />
          </div>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Gigs Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#121214] flex items-center gap-2">
              <Layers size={20} className="text-purple-600" />
              <span>Active Contracts in Progress</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">{activeGigs.length} Ongoing</span>
          </div>

          {activeGigs.map((gig) => {
            const activeMs = gig.milestones.find(m => m.status === 'active' || m.status === 'under_review') || gig.milestones[0];
            return (
              <div 
                key={gig.id}
                className="p-8 rounded-[2.5rem] bg-white border border-purple-100 shadow-sm hover:shadow-md transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      In Progress
                    </span>
                    <h3 className="text-xl font-black text-[#121214] mt-2">{gig.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{gig.employerCompany} • {gig.locationScope}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xl font-black text-[#121214]">₹{gig.totalBudget.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-400 block">{gig.milestones.length} Milestones</span>
                  </div>
                </div>

                {/* Current Active Milestone Card */}
                <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-purple-950">
                      Active Stage: {activeMs.title}
                    </span>
                    <span className={`text-[11px] font-black px-3 py-0.5 rounded-full ${
                      activeMs.status === 'under_review'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-white text-purple-900 border border-purple-200 shadow-sm'
                    }`}>
                      {activeMs.status === 'under_review' ? 'Pending SME Sign-Off' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{activeMs.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-purple-200/60 text-[11px]">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <Clock size={12} /> Target: {activeMs.deadline}
                    </span>
                    <span className="font-black text-emerald-800">Escrow Release: ₹{activeMs.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 font-medium">
                    SME Lead: {gig.employerName}
                  </span>
                  <Link
                    to={`/app/student/workspace/${gig.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black transition-all shadow-sm"
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
            <h2 className="text-base font-black text-[#121214] flex items-center gap-2">
              <FileText size={18} className="text-purple-600" />
              <span>My Submitted Proposals</span>
            </h2>

            <div className="space-y-3">
              {myProposals.map((prop) => (
                <div key={prop.id} className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-black text-slate-900 block">Bid: ₹{prop.bidAmount.toLocaleString()} in {prop.deliveryTimeDays} days</span>
                    <span className="text-xs text-slate-500 line-clamp-1">{prop.coverNote}</span>
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
          
          <div className="p-7 rounded-[2.5rem] bg-white border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[#121214] flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" />
              <span>Recommended for You</span>
            </h3>

            <div className="space-y-3">
              {gigs.slice(1, 4).map((recGig) => (
                <Link
                  key={recGig.id}
                  to={`/app/student/gig/${recGig.id}`}
                  className="block p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200/80 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-purple-700 uppercase">{recGig.category}</span>
                    <span className="text-xs font-black text-[#121214]">₹{recGig.totalBudget.toLocaleString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-1">
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
          <div className="p-7 rounded-[2.5rem] bg-gradient-to-br from-emerald-50 to-purple-50 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#121214]">College ID Verified</h4>
                <p className="text-[11px] text-emerald-800 font-bold">PCTE Group of Institutes</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your verified student credential gives you priority ranking on local SME proposal queues.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
