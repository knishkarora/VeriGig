import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ExternalLink, 
  Code2, 
  ArrowLeft, 
  Star, 
  ThumbsUp, 
  RefreshCw, 
  Award,
  Receipt,
  MessageSquare,
  ShieldAlert,
  FileText,
  Lock,
  CreditCard,
  Briefcase,
  Users,
  AlertCircle,
  Layers
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Milestone } from '../../types';
import { TrustBadge } from '../../components/shared/TrustBadge';
import { ContractReceiptModal } from '../../components/payments/ContractReceiptModal';
import { PaymentEscrowModal } from '../../components/payments/PaymentEscrowModal';
import { RaiseDisputeDrawer } from '../../components/disputes/RaiseDisputeDrawer';
import { ReviewModal } from '../../components/reviews/ReviewModal';
import { ChatModal } from '../../components/messaging/ChatModal';

export const EmployerWorkspace: React.FC = () => {
  const { gigId } = useParams<{ gigId?: string }>();
  const { gigs, currentUser, approveMilestone, requestRevision, proposals } = useMarketplace();

  // Scope to gigs owned by current employer
  const myGigs = gigs.filter(g => 
    g.employerId === currentUser.id || 
    (currentUser.collegeOrCompany && g.employerCompany && g.employerCompany.toLowerCase().includes(currentUser.collegeOrCompany.toLowerCase()))
  );

  // Determine active gig: explicit URL param > employer's in_progress gig > employer's first gig
  const activeGigId = gigId || myGigs.find(g => g.status === 'in_progress')?.id || myGigs[0]?.id;
  const gig = myGigs.find(g => g.id === activeGigId) || myGigs[0];

  const [revisionModalMilestone, setRevisionModalMilestone] = useState<Milestone | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeMilestone, setDisputeMilestone] = useState<Milestone | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDoubleSidedReviewOpen, setIsDoubleSidedReviewOpen] = useState(false);

  // If employer has zero gigs posted
  if (!gig) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Briefcase size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#101014]">No Active Workspace</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          You don't have any micro-gigs in progress. Post a micro-gig and hire a student freelancer to activate your escrow management desk and inspect submitted deliverables.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link 
            to="/app/employer/dashboard" 
            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link 
            to="/app/employer/post-gig" 
            className="px-5 py-2.5 rounded-full bg-[#101014] text-white text-xs font-black shadow-md hover:bg-slate-800 transition-all"
          >
            Post New Micro-Gig
          </Link>
        </div>
      </div>
    );
  }

  const hasHiredStudent = Boolean(gig.hiredStudentName) || gig.status === 'in_progress';
  const hiredStudentName = gig.hiredStudentName || (hasHiredStudent ? 'Assigned Student' : '');
  const hiredStudentId = gig.hiredStudentId || 'stu-student-assigned';

  const handleApprove = (milestoneId: string) => {
    approveMilestone(gig.id, milestoneId, 'Approved! Payout released from escrow.');
    const remaining = gig.milestones.filter(m => m.id !== milestoneId && m.status !== 'completed');
    if (remaining.length === 0) {
      setTimeout(() => setIsDoubleSidedReviewOpen(true), 1200);
    }
  };

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionModalMilestone || !revisionFeedback.trim()) return;

    requestRevision(gig.id, revisionModalMilestone.id, revisionFeedback);
    setRevisionModalMilestone(null);
    setRevisionFeedback('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top back */}
      <div className="flex items-center justify-between">
        <Link 
          to="/app/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back to Employer Dashboard
        </Link>
        <span className="text-xs text-slate-400 font-medium">
          Contract ID: <span className="font-mono text-purple-700 font-bold">{gig.id}</span>
        </span>
      </div>

      {/* Multiple Gigs Switcher Tabs (if employer has multiple gigs) */}
      {myGigs.length > 1 && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
            Switch Active Workspace:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {myGigs.map(g => {
              const isActive = g.id === gig.id;
              return (
                <Link
                  key={g.id}
                  to={`/app/employer/workspace/${g.id}`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#101014] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span className="max-w-[180px] truncate">{g.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    g.status === 'in_progress' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {g.status.replace('_', ' ')}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Contract Banner */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3.5 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
              Employer Escrow Management Desk
            </span>
            <span className="text-xs text-slate-500 font-bold">{gig.employerCompany || currentUser.collegeOrCompany || 'SME Business'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#121214]">{gig.title}</h1>
          
          {hasHiredStudent ? (
            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span>Hired Student: <strong className="text-slate-900">{hiredStudentName}</strong></span>
              <TrustBadge type="student" text="Verified Student Freelancer" size="sm" />
            </p>
          ) : (
            <p className="text-xs text-amber-700 font-semibold flex items-center gap-1.5">
              <AlertCircle size={14} className="text-amber-500 shrink-0" />
              <span>No student freelancer hired yet for this micro-gig.</span>
            </p>
          )}
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Contract Escrow</span>
          <span className="text-3xl font-black text-[#121214]">₹{gig.totalBudget.toLocaleString()}</span>
          <div className="mt-1 text-xs text-emerald-800 font-bold">
            {gig.milestones.filter(m => m.status === 'completed').length} of {gig.milestones.length} Milestones Paid Out
          </div>
        </div>

        {/* Action controls row */}
        <div className="w-full pt-4 border-t border-purple-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEscrowModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md group"
            >
              <CreditCard size={14} className="text-[#D4F851]" />
              <span>Fund Escrow (Razorpay)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsReceiptOpen(true)}
              className="px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Receipt size={13} className="text-purple-700" />
              <span>Settlement Receipt & Fee Breakdown</span>
            </button>

            {hasHiredStudent && (
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare size={13} className="text-slate-700" />
                <span>Message Student ({hiredStudentName})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasHiredStudent && gig.milestones.every(m => m.status === 'completed') && (
              <button
                type="button"
                onClick={() => setIsDoubleSidedReviewOpen(true)}
                className="px-4 py-2 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#121214] text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Award size={14} />
                <span>Submit Bilateral Review</span>
              </button>
            )}

            {hasHiredStudent && (
              <button
                type="button"
                onClick={() => {
                  setDisputeMilestone(gig.milestones[0]);
                  setIsDisputeOpen(true);
                }}
                className="px-3.5 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ShieldAlert size={13} />
                <span>Dispute Escrow</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* If no student is hired yet: prominent candidate hiring cue */}
      {!hasHiredStudent ? (
        <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Users size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#101014]">
              Contract Awaiting Student Hire
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              This micro-gig has received proposals and is currently in the applicant review phase. Inspect ranked candidate dossiers and hire a student to initialize milestones and begin escrow work.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to={`/app/employer/gig/${gig.id}/applicants`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#101014] text-xs font-black shadow-md transition-all"
            >
              <Users size={14} />
              <span>Review Candidate Proposals ({gig.applicantsCount})</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Deliverable Review Stream */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#101014] flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shadow-xs">
                <Layers size={17} />
              </span>
              <span>Milestone Review & Sign-Off Pipeline</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Escrow releases immediately upon your sign-off</span>
          </div>

          <div className="space-y-6">
            {gig.milestones.map((ms, index) => {
              const isUnderReview = ms.status === 'under_review';
              const isCompleted = ms.status === 'completed';
              const isInRevision = ms.status === 'in_revision';

              return (
                <div
                  key={ms.id}
                  className={`p-7 sm:p-8 rounded-[2rem] border transition-all ${
                    isUnderReview
                      ? 'bg-amber-50/80 border-amber-300 shadow-md ring-2 ring-amber-200'
                      : isCompleted
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : isInRevision
                      ? 'bg-rose-50 border-rose-300'
                      : 'bg-white border-purple-100 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-slate-100 text-[#121214] text-xs font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h3 className="text-base font-black text-[#121214]">{ms.title}</h3>
                        <span className={`text-[11px] font-black px-3 py-0.5 rounded-full capitalize ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : isUnderReview
                            ? 'bg-amber-100 text-amber-950 border border-amber-300 animate-pulse'
                            : isInRevision
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {ms.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 pl-9 font-normal leading-relaxed">{ms.description}</p>
                    </div>

                    <div className="text-left md:text-right shrink-0 pl-9 md:pl-0">
                      <span className="text-base font-black text-[#121214]">₹{ms.amount.toLocaleString()}</span>
                      <span className="block text-[10px] text-slate-400 font-medium">Target: {ms.deadline}</span>
                    </div>
                  </div>

                  {/* Inspection Pane for Submitted Deliverables */}
                  {ms.deliverable && (
                    <div className="mt-5 pt-4 border-t border-purple-100 pl-9 space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-slate-700 uppercase tracking-wider text-[11px]">
                          Student Submission ({ms.deliverable.submittedAt})
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {ms.deliverable.liveUrl && (
                          <a
                            href={ms.deliverable.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-bold text-purple-900 transition-colors"
                          >
                            <ExternalLink size={13} />
                            <span>Open Live Preview ({ms.deliverable.liveUrl})</span>
                          </a>
                        )}
                        {ms.deliverable.repoUrl && (
                          <a
                            href={ms.deliverable.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
                          >
                            <Code2 size={13} />
                            <span>Inspect Code Repo</span>
                          </a>
                        )}
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-purple-100 text-xs text-slate-700 shadow-sm font-medium">
                        <strong className="text-slate-900 block mb-1 font-bold">Student Notes:</strong>
                        {ms.deliverable.notes}
                      </div>

                      {ms.deliverable.feedback && (
                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 font-medium">
                          <strong className="font-bold">Logged Feedback:</strong> {ms.deliverable.feedback}
                        </div>
                      )}

                      {isUnderReview && (
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleApprove(ms.id)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all group"
                          >
                            <ThumbsUp size={14} className="text-[#D4F851]" />
                            <span>Approve Deliverable & Release ₹{ms.amount.toLocaleString()} (Sandbox Payout)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRevisionModalMilestone(ms)}
                            className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-rose-800 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-2"
                          >
                            <RefreshCw size={13} />
                            <span>Request Revision</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {isCompleted && (
                    <div className="mt-3 pl-9 text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={16} />
                      <span>Deliverable Approved & Sandbox Escrow Funds Released to Student</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Structured Revision Request Modal */}
      {revisionModalMilestone && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRevisionModalMilestone(null)} />
          
          <div className="relative w-full max-w-lg bg-white border border-purple-100 rounded-[2.5rem] p-8 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h3 className="text-base font-black text-[#121214]">Request Revision for {revisionModalMilestone.title}</h3>
              <button onClick={() => setRevisionModalMilestone(null)} className="text-slate-400 hover:text-black text-xs font-bold px-3 py-1 rounded-full bg-slate-100">
                Cancel
              </button>
            </div>

            <form onSubmit={handleRevisionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Structured Feedback & Changes Needed
                </label>
                <textarea
                  rows={5}
                  required
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="Detail the specific corrections required against the acceptance criteria..."
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-600 font-medium">
                The student will receive an instant notification with this feedback to update their deliverable.
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#121214] hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all"
              >
                Send Revision Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contract Settlement Receipt Modal */}
      <ContractReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        contractId={`contract-${gig.id}`}
        contractTitle={gig.title}
        employerName={gig.employerCompany || currentUser.collegeOrCompany || 'SME Business'}
        studentName={hiredStudentName || 'Assigned Student'}
        totalAmount={gig.totalBudget}
      />

      {/* Milestone Dispute Escalation Drawer */}
      <RaiseDisputeDrawer
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        contractId={`contract-${gig.id}`}
        milestoneId={disputeMilestone?.id || gig.milestones[0]?.id || 'ms-1'}
        milestoneTitle={disputeMilestone?.title || gig.milestones[0]?.title || 'Milestone 1'}
        milestoneAmount={disputeMilestone?.amount || gig.milestones[0]?.amount || gig.totalBudget}
        onDisputeRaised={() => {}}
      />

      {/* Bilateral Double-Sided Review Modal */}
      <ReviewModal
        isOpen={isDoubleSidedReviewOpen}
        onClose={() => setIsDoubleSidedReviewOpen(false)}
        contractId={`contract-${gig.id}`}
        revieweeId={hiredStudentId}
        revieweeName={hiredStudentName || 'Assigned Student'}
        revieweeRole="student"
        onReviewSubmitted={() => {}}
      />

      {/* In-App Contextual Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        contextType="contract"
        contextId={gig.id}
        recipientId={hiredStudentId}
        recipientName={hiredStudentName || 'Assigned Student'}
        recipientRole="student"
        currentUserId={currentUser.id}
      />

      {/* Payment Escrow Funding Modal with Razorpay Checkout */}
      <PaymentEscrowModal
        isOpen={isEscrowModalOpen}
        onClose={() => setIsEscrowModalOpen(false)}
        contractId={gig.id}
        contractTitle={gig.title}
        studentName={hiredStudentName || 'Assigned Student'}
        totalBudget={gig.totalBudget}
        onFunded={() => {}}
      />

    </div>
  );
};
