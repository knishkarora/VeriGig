import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Users, 
  Clock, 
  Layers, 
  Wallet,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const EmployerDashboard: React.FC = () => {
  const { currentUser, gigs } = useMarketplace();

  const myGigs = gigs.filter(g => g.employerId === currentUser.id);

  const pendingDeliverables = myGigs.flatMap(g => 
    g.milestones
      .filter(m => m.status === 'under_review')
      .map(m => ({ gig: g, milestone: m }))
  );

  const totalApplicants = myGigs.reduce((acc, g) => acc + g.applicantsCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-black text-[#121214]">{currentUser.collegeOrCompany} Dashboard</h1>
            <TrustBadge type="sme" text="Verified SME Partner" size="sm" />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Managed by {currentUser.name} • Ludhiana Enterprise Partner Hub
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/employer/post-gig"
            className="inline-flex items-center gap-2 pl-6 pr-2 py-2 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all group"
          >
            <span>Post New Micro-Gig</span>
            <div className="w-7 h-7 rounded-full bg-[#D4F851] text-[#121214] flex items-center justify-center font-bold">
              <PlusCircle size={15} />
            </div>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Active Task Listings
            </span>
            <span className="text-3xl font-black text-[#121214] mt-1 block">
              {myGigs.length}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 block">Live on campus feeds</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-700">
            <Layers size={24} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Student Applicants
            </span>
            <span className="text-3xl font-black text-purple-900 mt-1 block">
              {totalApplicants}
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">From PCTE & GNDEC</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-700">
            <Users size={24} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Pending Review
            </span>
            <span className="text-3xl font-black text-amber-600 mt-1 block">
              {pendingDeliverables.length}
            </span>
            <span className="text-[10px] text-amber-700 font-bold mt-1 block">Deliverable inspection ready</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
            <Clock size={24} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              SME Escrow Vault
            </span>
            <span className="text-3xl font-black text-emerald-800 mt-1 block">
              ₹{currentUser.balance.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">Funded for milestones</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700">
            <Wallet size={24} />
          </div>
        </div>

      </div>

      {/* Pending Deliverables Urgent Callout */}
      {pendingDeliverables.length > 0 && (
        <div className="p-8 rounded-[2.5rem] bg-amber-50 border border-amber-300 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <h3 className="text-base font-black text-amber-950">Student Deliverables Awaiting Sign-Off</h3>
            </div>
            <span className="text-xs text-amber-900 font-extrabold bg-white px-3 py-1 rounded-full shadow-sm">
              {pendingDeliverables.length} Ready for Inspection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {pendingDeliverables.map(({ gig, milestone }) => (
              <div key={milestone.id} className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-[#121214]">{milestone.title}</h4>
                  <p className="text-[11px] text-slate-500">{gig.title} • Assignee: {gig.hiredStudentName}</p>
                  <span className="text-xs font-black text-emerald-800 mt-1 block">₹{milestone.amount.toLocaleString()} Escrow Release</span>
                </div>
                <Link
                  to={`/app/employer/workspace/${gig.id}`}
                  className="px-5 py-2 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#121214] text-xs font-black shadow-sm transition-all shrink-0"
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
          <h2 className="text-xl font-black text-[#121214]">Your Posted Micro-Gigs</h2>
          <span className="text-xs text-slate-400 font-bold">{myGigs.length} Active Listings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myGigs.map((gig) => (
            <div key={gig.id} className="p-8 rounded-[2.5rem] bg-white border border-purple-100 shadow-sm hover:shadow-md transition-all space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                    {gig.category}
                  </span>
                  <h3 className="text-lg font-black text-[#121214] mt-2">{gig.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{gig.locationScope} • {gig.targetDuration}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#121214]">₹{gig.totalBudget.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-400 block">{gig.milestones.length} Milestones</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-bold">Contract State:</span>
                  <span className="font-black text-emerald-800 capitalize">{gig.status.replace('_', ' ')}</span>
                </div>
                {gig.hiredStudentName && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-bold">Assigned Student:</span>
                    <span className="text-[#121214] font-black">{gig.hiredStudentName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  to={`/app/employer/gig/${gig.id}/applicants`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  <Users size={13} />
                  <span>Applicants ({gig.applicantsCount})</span>
                </Link>

                <Link
                  to={`/app/employer/workspace/${gig.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-sm transition-all"
                >
                  <span>Workspace</span>
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
