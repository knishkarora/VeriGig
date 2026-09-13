import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Upload, 
  ExternalLink, 
  Code2, 
  AlertCircle, 
  ArrowLeft, 
  Check
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Milestone, MilestoneStatus } from '../../types';

export const StudentWorkspace: React.FC = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const { gigs, currentUser, submitDeliverable } = useMarketplace();

  const gig = gigs.find(g => g.id === (gigId || 'gig-1')) || gigs[0];

  // Selected Milestone for submission
  const [activeModalMilestone, setActiveModalMilestone] = useState<Milestone | null>(null);
  const [liveUrl, setLiveUrl] = useState('https://bakeology-preview.vercel.app');
  const [repoUrl, setRepoUrl] = useState('https://github.com/aaravsharma/bakeology-catalog');
  const [notes, setNotes] = useState('All requested features implemented and tested across mobile viewports.');
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalMilestone) return;

    submitDeliverable(gig.id, activeModalMilestone.id, {
      liveUrl,
      repoUrl,
      notes,
    });

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      setActiveModalMilestone(null);
    }, 1200);
  };

  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={12} /> Approved & Paid
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 animate-pulse">
            <Clock size={12} /> Submitted for SME Review
          </span>
        );
      case 'in_revision':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-950/60 text-rose-300 border border-rose-500/30">
            <AlertCircle size={12} /> Revisions Requested
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
            <Clock size={12} /> In Progress
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Locked
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link 
          to="/app/student/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <span className="text-xs text-slate-400">
          Contract ID: <span className="font-mono text-indigo-400">{gig.id}</span>
        </span>
      </div>

      {/* Contract Banner */}
      <div className="p-8 rounded-3xl bg-[#111827]/90 backdrop-blur-xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
              Active Project Workspace
            </span>
            <span className="text-xs text-slate-400">Client: {gig.employerCompany}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{gig.title}</h1>
          <p className="text-xs text-slate-400">
            Assignee: <strong className="text-white">{currentUser.name}</strong> • Escrow Protected by CampusGigs
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-xs text-slate-400 block uppercase tracking-wider">Total Contract Value</span>
          <span className="text-3xl font-black text-emerald-400">₹{gig.totalBudget.toLocaleString()}</span>
          <div className="mt-2 text-xs text-slate-400">
            {gig.milestones.filter(m => m.status === 'completed').length} of {gig.milestones.length} Milestones Released
          </div>
        </div>
      </div>

      {/* Milestone Progression Stepper */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Milestone Pipeline Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {['Pending / Locked', 'In Progress', 'Submitted for Review', 'Approved & Paid'].map((stage, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300">
              <span className="w-5 h-5 rounded-full bg-slate-800 font-bold text-[11px] flex items-center justify-center text-indigo-400">
                {idx + 1}
              </span>
              <span className="font-medium">{stage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white">Project Deliverable Milestones</h2>

        <div className="space-y-4">
          {gig.milestones.map((ms, index) => (
            <div 
              key={ms.id}
              className={`p-6 rounded-3xl border transition-all ${
                ms.status === 'completed'
                  ? 'bg-emerald-950/15 border-emerald-500/30'
                  : ms.status === 'under_review'
                  ? 'bg-amber-950/15 border-amber-500/30'
                  : ms.status === 'active'
                  ? 'bg-indigo-950/20 border-indigo-500/40 shadow-glow-indigo'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{ms.title}</h3>
                    {getStatusBadge(ms.status)}
                  </div>
                  <p className="text-xs text-slate-400 pl-8">{ms.description}</p>
                </div>

                <div className="flex items-center gap-4 pl-8 md:pl-0">
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-400">₹{ms.amount.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-500">Target: {ms.deadline}</span>
                  </div>

                  {ms.status === 'active' || ms.status === 'in_revision' ? (
                    <button
                      onClick={() => setActiveModalMilestone(ms)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow-indigo transition-all shrink-0"
                    >
                      <Upload size={13} />
                      <span>{ms.status === 'in_revision' ? 'Resubmit Deliverable' : 'Submit Deliverable'}</span>
                    </button>
                  ) : ms.status === 'under_review' ? (
                    <button
                      onClick={() => setActiveModalMilestone(ms)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 shrink-0"
                    >
                      <span>Update Submission</span>
                    </button>
                  ) : ms.status === 'completed' ? (
                    <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={16} /> Paid to Wallet
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Unlocks after Milestone {index}</span>
                  )}
                </div>
              </div>

              {/* Deliverable Review Details if exists */}
              {ms.deliverable && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 pl-8 space-y-2 text-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Submitted Deliverable Preview
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-slate-300">
                    {ms.deliverable.liveUrl && (
                      <a 
                        href={ms.deliverable.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-400 hover:underline"
                      >
                        <ExternalLink size={13} /> Live Preview ({ms.deliverable.liveUrl})
                      </a>
                    )}
                    {ms.deliverable.repoUrl && (
                      <a 
                        href={ms.deliverable.repoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-300 hover:underline"
                      >
                        <Code2 size={13} /> Code Repository
                      </a>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <strong className="text-slate-300">Submission Notes:</strong> {ms.deliverable.notes}
                  </p>

                  {ms.deliverable.feedback && (
                    <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 text-xs">
                      <strong>Client Feedback:</strong> {ms.deliverable.feedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Deliverable Submission Modal */}
      {activeModalMilestone && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setActiveModalMilestone(null)} />
          
          <div className="relative w-full max-w-lg bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-left">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Deliverable Handoff</span>
                <h3 className="text-base font-bold text-white">{activeModalMilestone.title}</h3>
              </div>
              <button 
                onClick={() => setActiveModalMilestone(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            {successToast ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-bold text-white">Deliverable Submitted!</h4>
                <p className="text-xs text-slate-400">The SME has been notified to review and release funds.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitModal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Live Deliverable URL (Vercel, Figma, Google Drive)
                  </label>
                  <input
                    type="url"
                    required
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Code Repository / Design Assets (Optional)
                  </label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Submission Notes & Instructions for the SME
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Summarize what was completed and how the employer can verify it..."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald transition-all flex items-center justify-center gap-2"
                  >
                    <Upload size={14} />
                    <span>Submit for SME Approval (₹{activeModalMilestone.amount.toLocaleString()} Escrow)</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
