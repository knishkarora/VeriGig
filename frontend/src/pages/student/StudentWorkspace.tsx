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
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 size={12} /> Approved & Paid
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            <Clock size={12} /> Under SME Review
          </span>
        );
      case 'in_revision':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            <AlertCircle size={12} /> Revision Needed
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
            <Clock size={12} /> In Progress
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500">
            Locked
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link 
          to="/app/student/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
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
              Active Project Workspace
            </span>
            <span className="text-xs text-slate-500 font-bold">Client: {gig.employerCompany}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#121214]">{gig.title}</h1>
          <p className="text-xs text-slate-500 font-medium">
            Student Assignee: <strong className="text-slate-900">{currentUser.name}</strong> • Escrow Protected
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Contract Value</span>
          <span className="text-3xl font-black text-[#121214]">₹{gig.totalBudget.toLocaleString()}</span>
          <div className="mt-1 text-xs text-emerald-800 font-bold">
            {gig.milestones.filter(m => m.status === 'completed').length} of {gig.milestones.length} Milestones Released
          </div>
        </div>
      </div>

      {/* Milestone Progression Stepper */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Milestone Pipeline Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {['1. Pending / Locked', '2. In Progress', '3. Under Review', '4. Approved & Paid'].map((stage, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center gap-2.5 text-xs text-slate-800 font-bold">
              <span className="w-6 h-6 rounded-full bg-white text-purple-900 font-black text-[11px] flex items-center justify-center shadow-sm">
                {idx + 1}
              </span>
              <span>{stage.split('. ')[1]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-[#121214]">Project Milestones & Deliverables</h2>

        <div className="space-y-4">
          {gig.milestones.map((ms, index) => (
            <div 
              key={ms.id}
              className={`p-7 rounded-[2rem] border transition-all ${
                ms.status === 'completed'
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : ms.status === 'under_review'
                  ? 'bg-amber-50/70 border-amber-300'
                  : ms.status === 'active'
                  ? 'bg-white border-purple-300 shadow-md ring-2 ring-purple-100'
                  : 'bg-white/80 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-[#121214] text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-black text-[#121214]">{ms.title}</h3>
                    {getStatusBadge(ms.status)}
                  </div>
                  <p className="text-xs text-slate-600 pl-9 font-normal leading-relaxed">{ms.description}</p>
                </div>

                <div className="flex items-center gap-4 pl-9 md:pl-0">
                  <div className="text-right">
                    <span className="text-base font-black text-[#121214]">₹{ms.amount.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-400 font-medium">Due: {ms.deadline}</span>
                  </div>

                  {ms.status === 'active' || ms.status === 'in_revision' ? (
                    <button
                      onClick={() => setActiveModalMilestone(ms)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-sm transition-all shrink-0"
                    >
                      <Upload size={14} className="text-[#D4F851]" />
                      <span>{ms.status === 'in_revision' ? 'Resubmit Deliverable' : 'Submit Deliverable'}</span>
                    </button>
                  ) : ms.status === 'under_review' ? (
                    <button
                      onClick={() => setActiveModalMilestone(ms)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold shrink-0"
                    >
                      <span>Update Submission</span>
                    </button>
                  ) : ms.status === 'completed' ? (
                    <div className="text-xs text-emerald-800 font-black flex items-center gap-1">
                      <CheckCircle2 size={16} /> Paid to Wallet
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium italic">Unlocks after Milestone {index}</span>
                  )}
                </div>
              </div>

              {/* Deliverable Review Details if exists */}
              {ms.deliverable && (
                <div className="mt-4 pt-4 border-t border-purple-100 pl-9 space-y-2 text-xs">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Submitted Deliverable Preview
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {ms.deliverable.liveUrl && (
                      <a 
                        href={ms.deliverable.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-purple-700 hover:underline font-bold"
                      >
                        <ExternalLink size={13} /> Live Preview ({ms.deliverable.liveUrl})
                      </a>
                    )}
                    {ms.deliverable.repoUrl && (
                      <a 
                        href={ms.deliverable.repoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-700 hover:underline font-semibold"
                      >
                        <Code2 size={13} /> Code Repository
                      </a>
                    )}
                  </div>
                  <p className="text-slate-700 text-xs bg-white p-3.5 rounded-2xl border border-purple-100 font-medium">
                    <strong className="text-slate-900 font-bold">Submission Notes:</strong> {ms.deliverable.notes}
                  </p>

                  {ms.deliverable.feedback && (
                    <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-medium">
                      <strong className="font-bold">Client Feedback:</strong> {ms.deliverable.feedback}
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
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setActiveModalMilestone(null)} />
          
          <div className="relative w-full max-w-lg bg-white border border-purple-100 rounded-[2.5rem] p-8 shadow-2xl space-y-5 text-left">
            
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Deliverable Handoff</span>
                <h3 className="text-base font-black text-[#121214]">{activeModalMilestone.title}</h3>
              </div>
              <button 
                onClick={() => setActiveModalMilestone(null)}
                className="text-slate-400 hover:text-black text-xs font-bold px-3 py-1 rounded-full bg-slate-100"
              >
                Cancel
              </button>
            </div>

            {successToast ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-black text-[#121214]">Deliverable Submitted!</h4>
                <p className="text-xs text-slate-500">The SME has been notified to review and release funds.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitModal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Live Deliverable URL (Vercel, Figma, Google Drive)
                  </label>
                  <input
                    type="url"
                    required
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Code Repository / Design Assets (Optional)
                  </label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Submission Notes & Instructions for the SME
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Summarize what was completed and how the employer can verify it..."
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#121214] hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Upload size={14} className="text-[#D4F851]" />
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
