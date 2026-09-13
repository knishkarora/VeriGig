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
import { Proposal } from '../../types';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const GigApplicants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { gigs, proposals, hireApplicant, shortlistApplicant } = useMarketplace();

  // Find target gig
  const gig = gigs.find(g => g.id === (id || 'gig-1')) || gigs[0];

  // Find proposals for this gig
  const gigProposals = proposals.filter(p => p.gigId === gig.id);
  
  // Selected proposal state
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Top back */}
      <div className="flex items-center justify-between">
        <Link 
          to="/app/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <span className="text-xs text-slate-400">
          Listing: <strong className="text-white">{gig.title}</strong>
        </span>
      </div>

      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#111827]/80 backdrop-blur-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Applicant Tracking Pipeline
          </span>
          <h1 className="text-2xl font-black text-white">{gig.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Budget: <strong className="text-emerald-400 font-bold">₹{gig.totalBudget.toLocaleString()}</strong> • {gig.milestones.length} Milestones Defined
          </p>
        </div>
        <div className="text-xs text-slate-400">
          <span className="font-bold text-white text-base">{gigProposals.length}</span> Proposals Received
        </div>
      </div>

      {/* Split-Pane Layout */}
      {gigProposals.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Layers size={36} className="mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No applicants yet for this micro-gig</h3>
          <p className="text-xs text-slate-400">
            Student freelancers from PCTE and GNDEC will submit proposals shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Pane: Candidate List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Ranked Candidate Pool
            </span>

            {gigProposals.map((prop) => {
              const isSelected = prop.id === (selectedProposal?.id);
              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProposalId(prop.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-glow-indigo'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={prop.studentAvatar} 
                        alt={prop.studentName} 
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{prop.studentName}</span>
                          {prop.status === 'hired' && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              Hired
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-400">{prop.studentCollege}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400">₹{prop.bidAmount.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block">{prop.deliveryTimeDays} days</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      <Sparkles size={11} /> {prop.matchScore}% Match Score
                    </span>
                    <span className="text-slate-400">{prop.studentGpa}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Pane: Selected Candidate Dossier */}
          <div className="lg:col-span-7">
            {selectedProposal && (
              <div className="p-6 rounded-3xl bg-[#111827]/90 backdrop-blur-xl border border-slate-800 space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedProposal.studentAvatar} 
                      alt={selectedProposal.studentName} 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/50"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{selectedProposal.studentName}</span>
                        <TrustBadge type="student" size="sm" text="Verified Student" />
                      </h3>
                      <p className="text-xs text-slate-400">
                        {selectedProposal.studentCollege} • {selectedProposal.studentGpa}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Proposed Total</span>
                    <span className="text-xl font-black text-emerald-400">₹{selectedProposal.bidAmount.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500 block">Est. Delivery: {selectedProposal.deliveryTimeDays} Days</span>
                  </div>
                </div>

                {/* Cover Approach */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Candidate's Proposed Execution Plan
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {selectedProposal.coverNote}
                  </div>
                </div>

                {/* Portfolio Links */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Proof of Work & Code References
                  </span>
                  <div className="space-y-2">
                    {selectedProposal.portfolioLinks.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-indigo-400 hover:underline flex items-center justify-between transition-colors"
                      >
                        <span className="font-semibold">{link.label}</span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span>{link.url}</span>
                          <ExternalLink size={12} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Milestone 1 Escrow Note */}
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold block">Milestone 1 Escrow Funding Required</span>
                    <span className="text-[11px] text-slate-400">Upon hiring, Milestone 1 (₹{(gig.milestones[0]?.amount || 3000).toLocaleString()}) will be locked in escrow.</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {selectedProposal.status === 'hired' ? (
                    <div className="w-full py-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>Candidate Hired! Active contract in workspace.</span>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleHire(selectedProposal.id)}
                        className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald transition-all flex items-center justify-center gap-2"
                      >
                        <UserCheck size={14} />
                        <span>Hire & Fund Milestone 1 (₹{(gig.milestones[0]?.amount || 3000).toLocaleString()})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => shortlistApplicant(selectedProposal.id)}
                        className="px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        Shortlist Candidate
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
