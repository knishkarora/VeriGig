import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { 
  Wallet, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  FileText, 
  TrendingUp,
  Layers,
  ChevronRight,
  HelpCircle,
  X,
  ShieldCheck,
  Award,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const StudentDashboard: React.FC = () => {
  const { currentUser, gigs, proposals } = useMarketplace();
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  useBodyScrollLock(isTrustModalOpen || isEscrowModalOpen);

  const activeGigs = gigs.filter(g => g.hiredStudentId === currentUser.id);
  const myProposals = proposals.filter(p => p.studentId === currentUser.id);

  // Dynamically calculate secured project funds (escrow) across in-progress gigs
  const protectedFunds = activeGigs.reduce((acc, gig) => {
    const pendingAmount = (gig.milestones || [])
      .filter(m => m.status === 'active' || m.status === 'under_review' || m.status === 'in_revision' || m.status === 'locked')
      .reduce((sum, m) => sum + (m.amount || 0), 0);
    return acc + pendingAmount;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="p-8 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(100,65,180,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-3xl font-black text-[#101014]">Welcome back, {currentUser.name}</h1>
            {currentUser.isVerified ? (
              <TrustBadge 
                type="student" 
                text={`Verified ${currentUser.collegeOrCompany ? currentUser.collegeOrCompany + ' ' : ''}Student`} 
                size="sm" 
              />
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                <Clock size={12} className="text-amber-600 shrink-0" />
                <span>Verification Pending</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {[
              currentUser.degree || 'Campus Student',
              currentUser.rollNumber ? `Roll #${currentUser.rollNumber}` : null,
              currentUser.collegeOrCompany || 'College details pending'
            ].filter(Boolean).join(' • ')}
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

      {/* Financial & Performance Telemetry Deck */}
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

          {/* Secured In-Progress Pay (Escrow) */}
          <div className="pt-4 sm:pt-0 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Secured In-Progress Pay
                </span>
                <button
                  type="button"
                  onClick={() => setIsEscrowModalOpen(true)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  title="What is Secured Pay / Escrow?"
                >
                  <HelpCircle size={13} />
                </button>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-[#101014] mt-2 font-mono tabular-nums">
              ₹{protectedFunds.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              {activeGigs.length > 0 ? 'Safely reserved in escrow for active milestones' : 'No active project funds locked'}
              <button
                type="button" 
                onClick={() => setIsEscrowModalOpen(true)}
                className="text-[10px] text-purple-700 font-bold underline"
              >
                What is Secured Pay / Escrow?
              </button>
            </div>
          </div>

          {/* Completed Deliverables */}
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
            <div className="text-[11px] text-emerald-700 font-bold mt-1">
              {currentUser.completedGigs > 0 ? '100% On-time completion' : 'Ready for your first gig'}
            </div>
          </div>

          {/* Trust Score */}
          <div className="pt-4 sm:pt-0 sm:pl-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                MSME Trust Score
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <div className="text-3xl font-black text-[#101014] font-mono tabular-nums">
                {currentUser.rating > 0 ? currentUser.rating.toFixed(1) : '0.0'}
              </div>
              <span className="text-base font-normal text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] text-slate-500 font-semibold">
                {currentUser.completedGigs > 0 ? `${currentUser.completedGigs} verified reviews` : 'New account • 0 reviews yet'}
              </span>
              <button
                type="button"
                onClick={() => setIsTrustModalOpen(true)}
                className="text-[10px] text-purple-700 font-bold hover:underline"
              >
                How to improve?
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Gigs Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30 shadow-xs">
                <Layers size={17} />
              </span>
              <span>Active Contracts in Progress</span>
            </h2>
            <span className="text-xs text-purple-300 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full font-bold tabular-nums">
              {activeGigs.length} Ongoing
            </span>
          </div>

          {activeGigs.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-white border border-dashed border-slate-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto border border-purple-100">
                <Layers size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#101014]">No Active Contracts In Progress</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  You are currently not enrolled in any live project. Explore curated campus micro-gigs, submit proposals, and get hired by verified MSMEs to start earning.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/app/student/explore"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <span>Browse Micro-Gigs</span>
                  <div className="w-4 h-4 rounded-full bg-[#D4F851] text-[#101014] flex items-center justify-center font-bold">
                    <ArrowUpRight size={11} />
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            activeGigs.map((gig) => {
              const sorted = [...(gig.milestones || [])].sort((a, b) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0));
              const activeMs = sorted.find(m => m.status === 'active' || m.status === 'under_review') || sorted[0] || {
                id: 'ms-default',
                title: 'Project Deliverables',
                description: 'Complete deliverables as outlined in project criteria',
                amount: gig.totalBudget,
                status: 'active',
                deadline: '7 days'
              };
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
                      <span className="text-[11px] text-slate-400 block">{(gig.milestones || []).length} Milestones</span>
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
            })
          )}

          {/* Submitted Proposals Tracker */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-white/10 text-slate-200 flex items-center justify-center border border-white/10 shadow-xs">
                  <FileText size={15} />
                </span>
                <span>My Submitted Proposals</span>
              </h2>
              <span className="text-xs text-slate-300 bg-white/10 border border-white/10 px-2.5 py-0.5 rounded-full font-bold tabular-nums">
                {myProposals.length} Submitted
              </span>
            </div>

            <div className="space-y-3">
              {myProposals.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-200 text-center space-y-1">
                  <p className="text-xs font-bold text-slate-800">No proposals submitted yet</p>
                  <p className="text-[11px] text-slate-500">Apply to active micro-gigs to see and track your submitted proposals here.</p>
                </div>
              ) : (
                myProposals.map((prop) => (
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
                ))
              )}
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

          {/* Verification Badge Status Card (Dynamic Database-Backed) */}
          <div className={`p-7 rounded-[2.5rem] bg-white shadow-sm space-y-3 border ${
            currentUser.isVerified ? 'border-emerald-200/80' : 'border-amber-200/80'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 ${
                currentUser.isVerified ? 'bg-emerald-600' : 'bg-amber-500'
              }`}>
                {currentUser.isVerified ? <CheckCircle2 size={18} /> : <Clock size={18} />}
              </div>
              <div>
                <h4 className="text-xs font-black text-[#101014]">
                  {currentUser.isVerified ? 'College ID Verified' : 'Verification Status: Pending'}
                </h4>
                <p className={`text-[11px] font-bold ${currentUser.isVerified ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {currentUser.collegeOrCompany || 'College details pending'}
                  {currentUser.rollNumber ? ` • Roll #${currentUser.rollNumber}` : ' • Roll number pending'}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentUser.isVerified
                ? 'Your verified student credential gives you priority ranking on local SME proposal queues and instant milestone escrow release.'
                : 'Your credentials are currently not verified. Once verified, you will be given higher priority ranking on local SME proposal queues and instant milestone escrow release.'}
            </p>

            {!currentUser.isVerified && (
              <div className="pt-2">
                <Link
                  to="/app/student/profile"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-[11px] font-bold transition-all shadow-sm"
                >
                  <span>Update College Credentials</span>
                  <ArrowUpRight size={13} className="text-[#D4F851]" />
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Escrow & Secured Pay Explainer Modal */}
      {isEscrowModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEscrowModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg max-h-[92dvh] bg-white border border-[#EDE8FD] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-5 text-left overflow-y-auto overscroll-contain animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="text-base font-black text-[#101014]">What is Secured In-Progress Pay?</h3>
              </div>
              <button
                onClick={() => setIsEscrowModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In freelance and project work, <strong className="text-slate-900">Escrow</strong> means safe, guaranteed pay. Before you begin working on any milestone, the client deposits the entire milestone budget into a secure holding vault managed by VeriGig.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-900 font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="block font-bold">Client Deposits Upfront</strong>
                  The client cannot take the money back while you are actively working on the milestone.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-900 font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="block font-bold">You Submit Deliverables</strong>
                  Submit your code, design links, or work outputs in the Active Workspace.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-900 font-black text-[11px] flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="block font-bold">Instant Payout Release</strong>
                  Once the client signs off, the locked money is immediately released directly into your wallet.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsEscrowModalOpen(false)}
                className="w-full py-3 rounded-full bg-[#101014] hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Trust Score Improvement Modal */}
      {isTrustModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsTrustModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg max-h-[92dvh] bg-white border border-[#EDE8FD] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-5 text-left overflow-y-auto overscroll-contain animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Award size={18} />
                </div>
                <h3 className="text-base font-black text-[#101014]">How to Improve Your MSME Trust Score</h3>
              </div>
              <button
                onClick={() => setIsTrustModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your MSME Trust Score is an algorithmically computed reputation index (0.0 to 5.0) visible to regional businesses when reviewing candidate proposals. Here is how you can boost it:
            </p>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3 items-start">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">1. Verify College ID & Roll Number</strong>
                  Uploading an official campus ID card unlocks instant verified status and gives you a baseline score boost.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3 items-start">
                <Clock size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">2. Deliver Milestones On Time</strong>
                  Every milestone submitted on or ahead of deadline improves your on-time reliability percentage.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3 items-start">
                <TrendingUp size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">3. Earn 5-Star MSME Client Reviews</strong>
                  Upon project completion, clients rate communication, quality, and technical scope. 5-star reviews rapidly lift your rating toward 5.0.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3 items-start">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">4. Zero Dispute Record</strong>
                  Fulfilling agreed scopes and communicating proactively prevents arbitration escalations and protects your rating.
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                to="/app/student/profile"
                onClick={() => setIsTrustModalOpen(false)}
                className="flex-1 py-3 text-center rounded-full bg-[#101014] hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Complete ID Verification
              </Link>
              <button
                type="button"
                onClick={() => setIsTrustModalOpen(false)}
                className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
