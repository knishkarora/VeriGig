import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const GigApplicants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { gigs, proposals, hireApplicant, shortlistApplicant } = useMarketplace();

  const gig = gigs.find(g => g.id === (id || 'gig-1')) || gigs[0];
  const gigProposals = proposals.filter(p => p.gigId === gig.id);

  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    gigProposals[0]?.id || ''
  );

  const selectedProposal = gigProposals.find(p => p.id === selectedProposalId) || gigProposals[0];

  const handleHire = (proposalId: string) => {
    hireApplicant(proposalId);
    setTimeout(() => {
      navigate(`/app/employer/workspace/${gig.id}`);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top back */}
      <div className="flex items-center justify-between">
        <Link 
          to="/app/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <span className="text-xs text-slate-500 font-medium">
          Listing: <strong className="text-slate-900">{gig.title}</strong>
        </span>
      </div>

      {/* Header */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(100,65,180,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101014]">{gig.title}</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Budget: <strong className="text-emerald-800 font-black font-mono tabular-nums">₹{gig.totalBudget.toLocaleString()}</strong> • {gig.milestones.length} Milestones Defined
          </p>
        </div>
        <div className="text-xs font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 tabular-nums">
          <span className="font-black text-[#101014] text-sm">{gigProposals.length}</span> Proposals Received
        </div>
      </div>

      {/* Split-Pane Layout */}
      {gigProposals.length === 0 ? (
        <div className="py-20 text-center rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-3">
          <Layers size={36} className="mx-auto text-slate-300" />
          <h3 className="text-base font-black text-[#101014]">No applicants yet for this micro-gig</h3>
          <p className="text-xs text-slate-500">
            Student freelancers from PCTE and GNDEC will submit proposals shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Pane: Candidate List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
              Ranked Candidate Pool
            </span>

            {gigProposals.map((prop) => {
              const isSelected = prop.id === (selectedProposal?.id);
              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProposalId(prop.id)}
                  className={`p-5 rounded-[2rem] border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#101014] shadow-md ring-2 ring-[#101014]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={prop.studentAvatar} 
                        alt={prop.studentName} 
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <h4 className="text-xs font-black text-[#101014] flex items-center gap-1.5">
                          <span>{prop.studentName}</span>
                          {prop.status === 'hired' && (
                            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-extrabold">
                              Hired
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">{prop.studentCollege}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#101014] font-mono tabular-nums">₹{prop.bidAmount.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block">{prop.deliveryTimeDays} days</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Sparkles size={11} /> {prop.matchScore}% Match Score
                    </span>
                    <span className="text-slate-500">{prop.studentGpa}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Pane: Selected Candidate Dossier */}
          <div className="lg:col-span-7">
            {selectedProposal && (
              <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-md space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedProposal.studentAvatar} 
                      alt={selectedProposal.studentName} 
                      className="w-14 h-14 rounded-3xl object-cover border-2 border-emerald-400 shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-black text-[#101014] flex items-center gap-2">
                        <span>{selectedProposal.studentName}</span>
                        <TrustBadge type="student" size="sm" text="Verified Student" />
                      </h3>
                      <p className="text-xs text-slate-500 font-bold">
                        {selectedProposal.studentCollege} • {selectedProposal.studentGpa}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Proposed Total</span>
                    <span className="text-2xl font-black text-[#101014] font-mono tabular-nums">₹{selectedProposal.bidAmount.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500 font-semibold block">Turnaround: {selectedProposal.deliveryTimeDays} Days</span>
                  </div>
                </div>

                {/* Cover Approach */}
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Candidate's Proposed Execution Plan
                  </span>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal">
                    {selectedProposal.coverNote}
                  </div>
                </div>

                {/* Portfolio Links */}
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Proof of Work & Code References
                  </span>
                  <div className="space-y-2">
                    {selectedProposal.portfolioLinks.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-[#101014] font-bold hover:underline flex items-center justify-between transition-colors"
                      >
                        <span>{link.label}</span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-normal">
                          <span>{link.url}</span>
                          <ExternalLink size={12} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Milestone 1 Escrow Note */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#101014] flex items-center justify-between">
                  <div>
                    <span className="font-black block">Milestone 1 Escrow Funding Required</span>
                    <span className="text-[11px] text-slate-600 font-medium">Upon hiring, Milestone 1 (₹{(gig.milestones[0]?.amount || 3000).toLocaleString()}) will be funded in escrow.</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {selectedProposal.status === 'hired' ? (
                    <div className="w-full py-3.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black text-center flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-700" />
                      <span>Candidate Hired! Active contract in workspace.</span>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleHire(selectedProposal.id)}
                        className="flex-1 py-3.5 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <UserCheck size={15} className="text-[#D4F851]" />
                        <span>Hire & Fund Milestone 1 (₹{(gig.milestones[0]?.amount || 3000).toLocaleString()})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => shortlistApplicant(selectedProposal.id)}
                        className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                      >
                        Shortlist
                      </button>
                    </>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
