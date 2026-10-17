import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  UserCheck,
  CheckCircle2,
  Video,
  MessageSquare,
  Lock,
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';
import { InterviewSchedulerModal } from '../../components/interviews/InterviewSchedulerModal';
import { ChatModal } from '../../components/messaging/ChatModal';
import { PaymentEscrowModal } from '../../components/payments/PaymentEscrowModal';
import { applicationsApi } from '../../api/endpoints';
import { Proposal } from '../../types';

export const GigApplicants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, gigs, proposals, hireApplicant, shortlistApplicant } = useMarketplace();

  // Employer's own gigs strictly scoped to this business
  const myGigs = gigs.filter(g => 
    g.employerId === currentUser.id || 
    (currentUser.collegeOrCompany && g.employerCompany && g.employerCompany.toLowerCase().includes(currentUser.collegeOrCompany.toLowerCase()))
  );

  // Determine active gig: explicit URL id matching employer > employer's first gig
  const gig = id 
    ? (myGigs.find(g => g.id === id) || gigs.find(g => g.id === id) || myGigs[0])
    : myGigs[0];

  const [apiCandidates, setApiCandidates] = useState<Proposal[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string>('');

  // Fetch real applicant proposals from PostgreSQL for this specific gig
  useEffect(() => {
    if (!gig?.id) return;

    let active = true;
    const fetchApplicants = async () => {
      setIsLoadingCandidates(true);
      try {
        const res = await applicationsApi.getGigApplicants(gig.id);
        if (active && res && Array.isArray(res.candidates)) {
          const mapped: Proposal[] = res.candidates.map((c: any) => ({
            id: c.id,
            gigId: c.gigId,
            studentId: c.studentId,
            studentName: c.studentName || 'Student Applicant',
            studentCollege: c.studentCollege || 'Verified Campus',
            studentAvatar: c.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            studentGpa: c.studentDegree || 'Undergraduate',
            matchScore: c.fitScore || 90,
            coverNote: c.coverNote,
            bidAmount: c.bidAmount || gig.totalBudget,
            deliveryTimeDays: parseInt(c.proposedTimeline) || 7,
            portfolioLinks: Array.isArray(c.portfolioItems) ? c.portfolioItems : [],
            status: c.status || 'submitted',
            submittedAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently',
          }));

          setApiCandidates(mapped);
          if (mapped.length > 0) {
            setSelectedProposalId(mapped[0].id);
          }
        } else {
          setApiCandidates([]);
        }
      } catch (err) {
        console.warn('Could not fetch candidate pipeline from API:', err);
        // Fallback to local proposals matching this gig only
        const local = proposals.filter(p => p.gigId === gig.id);
        setApiCandidates(local);
        if (local.length > 0) setSelectedProposalId(local[0].id);
      } finally {
        if (active) setIsLoadingCandidates(false);
      }
    };

    fetchApplicants();
    return () => { active = false; };
  }, [gig?.id]);

  // Combine fetched candidates with any newly submitted proposals in context/localStorage
  const memoryProps = gig ? proposals.filter(p => 
    p.gigId === gig.id && !apiCandidates.some(c => c.id === p.id || (c.studentId && p.studentId && c.studentId === p.studentId))
  ) : [];
  const gigProposals = [...apiCandidates, ...memoryProps];

  // Modals
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEscrowOpen, setIsEscrowOpen] = useState(false);

  const selectedProposal = gigProposals.find(p => p.id === selectedProposalId) || gigProposals[0];

  const handleHire = (proposalId: string) => {
    if (!gig) return;
    hireApplicant(proposalId);
    setTimeout(() => {
      navigate(`/app/employer/workspace/${gig.id}`);
    }, 1500);
  };

  // If employer has zero gigs posted
  if (!gig) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Layers size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#101014]">No Micro-Gig Listings Found</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          You haven't posted any micro-gigs yet under this employer account. Post your first micro-gig to start receiving ranked proposals from verified campus talent.
        </p>
        <div className="pt-2">
          <Link
            to="/app/employer/post-gig"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#101014] text-white text-xs font-black shadow-md hover:bg-slate-800 transition-all"
          >
            <span>Post New Micro-Gig</span>
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Multiple Gigs Switcher Tabs (if employer has multiple gigs) */}
      {myGigs.length > 1 && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
            Switch Job Listing Pipeline:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {myGigs.map(g => {
              const isActive = g.id === gig.id;
              return (
                <Link
                  key={g.id}
                  to={`/app/employer/gig/${g.id}/applicants`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#101014] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span className="max-w-[220px] truncate">{g.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-[#D4F851] text-[#101014]' : 'bg-white text-slate-700 border border-slate-200'
                  }`}>
                    {g.category}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(100,65,180,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101014]">{gig.title}</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Budget: <strong className="text-emerald-800 font-black font-mono tabular-nums">₹{gig.totalBudget.toLocaleString()}</strong> • Category: <strong className="text-slate-900">{gig.category}</strong>
          </p>
        </div>
        <div className="text-xs font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 tabular-nums">
          <span className="font-black text-[#101014] text-sm">{gigProposals.length}</span> Proposals in Pipeline
        </div>
      </div>

      {isLoadingCandidates ? (
        <div className="py-20 text-center space-y-2">
          <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Fetching ranked candidate dossiers from database...</p>
        </div>
      ) : gigProposals.length === 0 ? (
        <div className="py-20 text-center rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-3">
          <Layers size={36} className="mx-auto text-slate-300" />
          <h3 className="text-base font-black text-[#101014]">No applicants yet for this micro-gig</h3>
          <p className="text-xs text-slate-500">
            Student freelancers from regional partner campuses will submit proposals shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Pane: Candidate List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
              Ranked Candidate Pool ({gigProposals.length})
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
                        src={prop.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
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
                      src={selectedProposal.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
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
                    <span className="text-[11px] text-slate-500 font-semibold block">Timeline: {selectedProposal.deliveryTimeDays} Days</span>
                  </div>
                </div>

                {/* Candidate Execution Approach */}
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Candidate's Proposed Execution Plan
                  </span>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal">
                    {selectedProposal.coverNote}
                  </div>
                </div>

                {/* Portfolio Links */}
                {selectedProposal.portfolioLinks && selectedProposal.portfolioLinks.length > 0 && (
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
                )}

                {/* Explainable Fit Breakdown Card */}
                <div className="p-4 rounded-2xl bg-[#D4F851]/10 border border-[#D4F851]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-emerald-700" />
                      <span>Explainable Candidate Fit Engine</span>
                    </span>
                    <span className="text-sm font-black text-emerald-800 font-mono">{selectedProposal.matchScore}% Match Score</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                      ✓ Skills Overlap for {gig.category}
                    </span>
                    <span className="text-[10px] font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                      ✓ Regional Campus Verified Student
                    </span>
                    <span className="text-[10px] font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                      ✓ Punctuality & Completion Rating
                    </span>
                  </div>
                </div>

                {/* Escrow Commitment Note */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#101014] flex items-center justify-between">
                  <div>
                    <span className="font-black block flex items-center gap-1 text-slate-900">
                      <ShieldCheck size={14} className="text-emerald-600 inline" />
                      <span>Contract Milestone Protection (Platform Escrow)</span>
                    </span>
                    <span className="text-[11px] text-slate-600 font-medium">
                      Full contract budget (₹{selectedProposal.bidAmount.toLocaleString()}) is locked into escrow before work begins. Student receives payouts per approved milestone.
                    </span>
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
                        onClick={() => setIsEscrowOpen(true)}
                        className="flex-1 py-3.5 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <UserCheck size={15} className="text-[#D4F851]" />
                        <span>Hire & Pre-Authorize Escrow (₹{selectedProposal.bidAmount.toLocaleString()})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsInterviewOpen(true)}
                        className="px-4 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Video size={14} className="text-[#FFA8D5]" />
                        <span>Schedule Chat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsChatOpen(true)}
                        className="px-4 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare size={14} className="text-slate-600" />
                        <span>Message</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => shortlistApplicant(selectedProposal.id)}
                        className="px-4 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
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

      {/* Candidate Interview Scheduler Modal */}
      {selectedProposal && (
        <InterviewSchedulerModal
          isOpen={isInterviewOpen}
          onClose={() => setIsInterviewOpen(false)}
          applicationId={selectedProposal.id}
          candidateName={selectedProposal.studentName}
          gigTitle={gig.title}
          onScheduled={() => {}}
        />
      )}

      {/* Candidate Direct Chat Modal */}
      {selectedProposal && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          contextType="application"
          contextId={selectedProposal.id}
          recipientId={selectedProposal.studentId}
          recipientName={selectedProposal.studentName}
          recipientRole="student"
          currentUserId={gig.employerId}
        />
      )}

      {/* Payment Escrow Funding Modal */}
      {selectedProposal && (
        <PaymentEscrowModal
          isOpen={isEscrowOpen}
          onClose={() => setIsEscrowOpen(false)}
          contractId={`contract-${selectedProposal.id}`}
          contractTitle={gig.title}
          studentName={selectedProposal.studentName}
          totalBudget={selectedProposal.bidAmount}
          onFunded={() => handleHire(selectedProposal.id)}
        />
      )}

    </div>
  );
};
