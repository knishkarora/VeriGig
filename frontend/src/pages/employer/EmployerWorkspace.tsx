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
  const { gigs, approveMilestone, requestRevision, currentUser } = useMarketplace();

  const gig = gigs.find(g => g.id === (gigId || 'gig-1')) || gigs[0];

  // Revision Modal State
  const [revisionModalMilestone, setRevisionModalMilestone] = useState<Milestone | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  // Rating Modal State
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [testimonial, setTestimonial] = useState('Exceptional turnaround and clean code execution!');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleApprove = (milestoneId: string) => {
    approveMilestone(gig.id, milestoneId, 'Approved! Payout released from escrow.');
    // If all completed, offer rating modal
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Top back */}
      <div className="flex items-center justify-between">
        <Link 
          to="/app/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Employer Dashboard
        </Link>
        <span className="text-xs text-slate-400">
          Contract ID: <span className="font-mono text-emerald-400">{gig.id}</span>
        </span>
      </div>

      {/* Contract Banner */}
      <div className="p-8 rounded-3xl bg-[#111827]/90 backdrop-blur-xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              Employer Escrow Management Desk
            </span>
            <span className="text-xs text-slate-400">{gig.employerCompany}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{gig.title}</h1>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span>Hired Student: <strong className="text-white">{gig.hiredStudentName || 'Aarav Sharma'}</strong></span>
            <TrustBadge type="student" text="Verified PCTE Student" size="sm" />
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-xs text-slate-400 block uppercase tracking-wider">Total Contract Escrow</span>
          <span className="text-3xl font-black text-emerald-400">₹{gig.totalBudget.toLocaleString()}</span>
          <div className="mt-2 text-xs text-slate-400">
            {gig.milestones.filter(m => m.status === 'completed').length} of {gig.milestones.length} Milestones Paid Out
          </div>
        </div>
      </div>

      {/* Deliverable Review Stream */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Milestone Review & Sign-Off Pipeline</h2>
          <span className="text-xs text-slate-400">Escrow releases immediately upon your sign-off</span>
        </div>

        <div className="space-y-6">
          {gig.milestones.map((ms, index) => {
            const isUnderReview = ms.status === 'under_review';
            const isCompleted = ms.status === 'completed';
            const isInRevision = ms.status === 'in_revision';

            return (
              <div
                key={ms.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isUnderReview
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-xl'
                    : isCompleted
                    ? 'bg-emerald-950/15 border-emerald-500/30'
                    : isInRevision
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h3 className="text-base font-bold text-white">{ms.title}</h3>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        isCompleted
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : isUnderReview
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30 animate-pulse'
                          : isInRevision
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {ms.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 pl-8">{ms.description}</p>
                  </div>

                  <div className="text-left md:text-right shrink-0 pl-8 md:pl-0">
                    <span className="text-base font-black text-emerald-400">₹{ms.amount.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-500">Deadline: {ms.deadline}</span>
                  </div>
                </div>

                {/* Inspection Pane for Submitted Deliverables */}
                {ms.deliverable && (
                  <div className="mt-5 pt-4 border-t border-slate-800/80 pl-8 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                        Student Submission ({ms.deliverable.submittedAt})
                      </span>
                    </div>

                    {/* Preview Links */}
                    <div className="flex flex-wrap items-center gap-3">
                      {ms.deliverable.liveUrl && (
                        <a
                          href={ms.deliverable.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
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
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                          <Code2 size={13} />
                          <span>Inspect Code Repo</span>
                        </a>
                      )}
                    </div>

                    {/* Notes from student */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                      <strong className="text-slate-400 block mb-1">Student Notes:</strong>
                      {ms.deliverable.notes}
                    </div>

                    {/* Previous feedback */}
                    {ms.deliverable.feedback && (
                      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300">
                        <strong>Logged Feedback:</strong> {ms.deliverable.feedback}
                      </div>
                    )}

                    {/* Sign-Off / Revision Action Buttons if under review */}
                    {isUnderReview && (
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleApprove(ms.id)}
                          className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald transition-all flex items-center gap-2"
                        >
                          <ThumbsUp size={14} />
                          <span>Approve Deliverable & Release ₹{ms.amount.toLocaleString()} Payout</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRevisionModalMilestone(ms)}
                          className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-850 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-2"
                        >
                          <RefreshCw size={13} />
                          <span>Request Revision</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {isCompleted && (
                  <div className="mt-3 pl-8 text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
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
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setRevisionModalMilestone(null)} />
          
          <div className="relative w-full max-w-lg bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Request Revision for {revisionModalMilestone.title}</h3>
              <button onClick={() => setRevisionModalMilestone(null)} className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800">
                Cancel
              </button>
            </div>

            <form onSubmit={handleRevisionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Structured Feedback & Changes Needed
                </label>
                <textarea
                  rows={5}
                  required
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="Detail the specific corrections required against the milestone acceptance criteria..."
                  className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 text-xs text-slate-400">
                The student will receive an instant notification with this feedback to resubmit their deliverable.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all"
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
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsRatingModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
            
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Award size={30} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">All Milestones Completed!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Rate your experience with <strong className="text-white">{gig.hiredStudentName || 'Aarav Sharma'}</strong> to build their campus trust score.
              </p>
            </div>

            {ratingSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
                Review submitted and added to Aarav's verified profile!
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 text-center">
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
                          size={24} 
                          className={star <= ratingValue ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Client Testimonial & Recommendation
                  </label>
                  <textarea
                    rows={3}
                    value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo transition-all"
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
