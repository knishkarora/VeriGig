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
  Award 
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Milestone } from '../../types';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const EmployerWorkspace: React.FC = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const { gigs, approveMilestone, requestRevision } = useMarketplace();

  const gig = gigs.find(g => g.id === (gigId || 'gig-1')) || gigs[0];

  const [revisionModalMilestone, setRevisionModalMilestone] = useState<Milestone | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [testimonial, setTestimonial] = useState('Exceptional turnaround and clean code execution!');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleApprove = (milestoneId: string) => {
    approveMilestone(gig.id, milestoneId, 'Approved! Payout released from escrow.');
    const remaining = gig.milestones.filter(m => m.id !== milestoneId && m.status !== 'completed');
    if (remaining.length === 0) {
      setTimeout(() => setIsRatingModalOpen(true), 1500);
    }
  };

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionModalMilestone || !revisionFeedback.trim()) return;

    requestRevision(gig.id, revisionModalMilestone.id, revisionFeedback);
    setRevisionModalMilestone(null);
    setRevisionFeedback('');
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRatingSubmitted(true);
    setTimeout(() => {
      setIsRatingModalOpen(false);
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
          <ArrowLeft size={14} /> Back to Employer Dashboard
        </Link>
        <span className="text-xs text-slate-400 font-medium">
          Contract ID: <span className="font-mono text-purple-700 font-bold">{gig.id}</span>
        </span>
      </div>

      {/* Contract Banner */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3.5 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
              Employer Escrow Management Desk
            </span>
            <span className="text-xs text-slate-500 font-bold">{gig.employerCompany}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#121214]">{gig.title}</h1>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span>Hired Student: <strong className="text-slate-900">{gig.hiredStudentName || 'Aarav Sharma'}</strong></span>
            <TrustBadge type="student" text="Verified PCTE Student" size="sm" />
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Contract Escrow</span>
          <span className="text-3xl font-black text-[#121214]">₹{gig.totalBudget.toLocaleString()}</span>
          <div className="mt-1 text-xs text-emerald-800 font-bold">
            {gig.milestones.filter(m => m.status === 'completed').length} of {gig.milestones.length} Milestones Paid Out
          </div>
        </div>
      </div>

      {/* Deliverable Review Stream */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#121214]">Milestone Review & Sign-Off Pipeline</h2>
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
                          <span>Approve Deliverable & Release ₹{ms.amount.toLocaleString()} Payout</span>
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
                    <span>Deliverable Approved & Escrow Funds Transferred to Student Wallet</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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

      {/* Post-Completion Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsRatingModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white border border-purple-100 rounded-[2.5rem] p-8 shadow-2xl space-y-5 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Award size={32} />
            </div>

            <div>
              <h3 className="text-xl font-black text-[#121214]">All Milestones Completed!</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Rate your experience with <strong className="text-[#121214]">{gig.hiredStudentName || 'Aarav Sharma'}</strong> to build their campus trust score.
              </p>
            </div>

            {ratingSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
                Review submitted and added to Aarav's verified profile!
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2 text-center">
                    Star Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingValue(star)}
                        className="p-1 text-2xl transition-transform hover:scale-110"
                      >
                        <Star 
                          size={26} 
                          className={star <= ratingValue ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Client Testimonial & Recommendation
                  </label>
                  <textarea
                    rows={3}
                    value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#121214] hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all"
                >
                  Publish Verified Review
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
