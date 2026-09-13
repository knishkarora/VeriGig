import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Layers, 
  Wallet,
  ChevronRight
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const EmployerDashboard: React.FC = () => {
  const { currentUser, gigs, proposals } = useMarketplace();

  // Employer's gigs
  const myGigs = gigs.filter(g => g.employerId === currentUser.id);

  // Deliverables pending review
  const pendingDeliverables = myGigs.flatMap(g => 
    g.milestones
      .filter(m => m.status === 'under_review')
      .map(m => ({ gig: g, milestone: m }))
  );

  // Total applicants across all employer gigs
  const totalApplicants = myGigs.reduce((acc, g) => acc + g.applicantsCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">{currentUser.collegeOrCompany} Dashboard</h1>
            <TrustBadge type="sme" text="Verified SME Partner" size="sm" />
          </div>
          <p className="text-xs text-slate-400">
            Managed by {currentUser.name} • Ludhiana Enterprise Partner Hub
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/employer/post-gig"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald transition-all"
          >
            <PlusCircle size={15} />
            <span>Post New Micro-Gig</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Active Task Listings
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {myGigs.length}
            </span>
            <span className="text-[10px] text-emerald-400 mt-1 block">Live across campus feeds</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
            <Layers size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Student Applicants
            </span>
            <span className="text-2xl font-black text-indigo-400 mt-1 block">
              {totalApplicants}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">From PCTE & GNDEC campuses</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/20 text-indigo-400">
            <Users size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Pending Review
            </span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">
              {pendingDeliverables.length}
            </span>
            <span className="text-[10px] text-amber-300 mt-1 block">Requires deliverable inspection</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/20 text-amber-400">
            <Clock size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              SME Escrow Vault
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              ₹{currentUser.balance.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">Locked & funded for milestones</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400">
            <Wallet size={22} />
          </div>
        </div>

      </div>

      {/* Pending Deliverables Urgent Callout */}
      {pendingDeliverables.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <h3 className="text-sm font-bold text-amber-300">Student Deliverables Awaiting Your Sign-Off</h3>
            </div>
            <span className="text-xs text-amber-400 font-semibold">{pendingDeliverables.length} Ready for Inspection</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {pendingDeliverables.map(({ gig, milestone }) => (
              <div key={milestone.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">{milestone.title}</h4>
                  <p className="text-[11px] text-slate-400">{gig.title} • Assignee: {gig.hiredStudentName}</p>
                  <span className="text-xs font-bold text-emerald-400 mt-1 block">₹{milestone.amount.toLocaleString()} Escrow Release</span>
                </div>
                <Link
                  to={`/app/employer/workspace/${gig.id}`}
                  className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shrink-0"
                >
                  Inspect & Sign-Off
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Listings Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Posted Micro-Gigs</h2>
          <span className="text-xs text-slate-400">{myGigs.length} Active Listings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myGigs.map((gig) => (
            <div key={gig.id} className="p-6 rounded-3xl bg-[#111827]/80 backdrop-blur-md border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                    {gig.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{gig.title}</h3>
                  <p className="text-xs text-slate-400">{gig.locationScope} • {gig.targetDuration}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-white">₹{gig.totalBudget.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-400 block">{gig.milestones.length} Milestones</span>
                </div>
              </div>

              {/* Status and Milestones */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Contract State:</span>
                  <span className="font-bold text-emerald-400 capitalize">{gig.status.replace('_', ' ')}</span>
                </div>
                {gig.hiredStudentName && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Assigned Student:</span>
                    <span className="text-white font-semibold">{gig.hiredStudentName}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  to={`/app/employer/gig/${gig.id}/applicants`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Users size={13} />
                  <span>View Applicants ({gig.applicantsCount})</span>
                </Link>

                <Link
                  to={`/app/employer/workspace/${gig.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow-indigo transition-all"
                >
                  <span>Manage Workspace</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
