import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Upload, 
  ExternalLink, 
  Code2, 
  AlertCircle, 
  ArrowLeft, 
  Check,
  MessageSquare,
  ShieldAlert,
  FileText,
  Award,
  Sparkles,
  Layers,
  ArrowUpRight,
  History,
  ChevronRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Milestone, MilestoneStatus, MicroGig } from '../../types';
import { ScopeAcceptanceModal } from '../../components/contracts/ScopeAcceptanceModal';
import { RaiseDisputeDrawer } from '../../components/disputes/RaiseDisputeDrawer';
import { ReviewModal } from '../../components/reviews/ReviewModal';
import { ChatModal } from '../../components/messaging/ChatModal';

export const StudentWorkspace: React.FC = () => {
  const { gigId } = useParams<{ gigId?: string }>();
  const { gigs, currentUser, submitDeliverable } = useMarketplace();

  // Role Protection: Redirect employers to Employer Escrow Workspace
  if (currentUser.role === 'employer') {
    return <Navigate to={gigId ? `/app/employer/workspace/${gigId}` : '/app/employer/workspace'} replace />;
  }

  // Filter projects strictly assigned/hired to the logged-in student
  const myGigs = gigs.filter(g => g.hiredStudentId === currentUser.id);
  const activeGigs = myGigs.filter(g => 
    g.status === 'in_progress' || 
    g.status === 'funded' ||
    (g.status === 'open' && g.milestones?.some(m => m.status === 'active' || m.status === 'under_review' || m.status === 'in_revision'))
  );
  const pastGigs = myGigs.filter(g => 
    g.status === 'completed' || 
    (g.milestones?.length > 0 && g.milestones.every(m => m.status === 'completed'))
  );

  // Archive inspection state
  const [viewingPastGigId, setViewingPastGigId] = useState<string | null>(null);

  // Selected project resolution (never show a gig the user does not own)
  const gig: MicroGig | null = viewingPastGigId
    ? myGigs.find(g => g.id === viewingPastGigId) || null
    : gigId
    ? myGigs.find(g => g.id === gigId) || (activeGigs.length > 0 ? activeGigs[0] : null)
    : (activeGigs.length > 0 ? activeGigs[0] : null);

  const isArchivedView = Boolean(viewingPastGigId || (gig && (gig.status === 'completed' || ((gig.milestones || []).length > 0 && gig.milestones.every(m => m.status === 'completed')))));

  // Modal states
  const [activeModalMilestone, setActiveModalMilestone] = useState<Milestone | null>(null);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeMilestone, setDisputeMilestone] = useState<Milestone | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [liveUrl, setLiveUrl] = useState('https://deliverable-preview.vercel.app');
  const [repoUrl, setRepoUrl] = useState('https://github.com/my-project/source');
  const [notes, setNotes] = useState('All requested features implemented and verified.');
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gig || !activeModalMilestone) return;

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
            <CheckCircle2 size={12} /> Stage 4: Approved & Paid
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            <Clock size={12} /> Stage 3: Under SME Review
          </span>
        );
      case 'in_revision':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            <AlertCircle size={12} /> Revision Requested
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
            <Clock size={12} /> Stage 2: In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500">
            <Lock size={11} /> Stage 1: Locked
          </span>
        );
    }
  };

  // Case 1: Student is NOT under any active project and is not viewing an archive
  if (!gig) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-left">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            to="/app/student/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <span className="text-xs text-slate-400 font-medium">
            Active Workspace Desk
          </span>
        </div>

        {/* No Active Project Notice */}
        <div className="p-10 sm:p-16 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto border border-purple-200">
            <Layers size={32} />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
              Workspace Status: No Active Contracts
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101014] mt-2">
              You are not under any active project
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              When a local MSME accepts your proposal and funds the milestone escrow, your contract details, stages progression, deliverable handoff, and chat desk will unlock right here.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/app/student/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-black shadow-sm transition-all"
            >
              <span>Explore Available Micro-Gigs</span>
              <div className="w-5 h-5 rounded-full bg-[#D4F851] text-[#101014] flex items-center justify-center font-bold">
                <ArrowUpRight size={13} />
              </div>
            </Link>
            <Link
              to="/app/student/dashboard"
              className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Past Completed Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shadow-xs">
                <History size={15} />
              </span>
              <span>Past Completed Projects</span>
            </h3>
            <span className="text-xs text-purple-900 bg-purple-50 border border-purple-200/80 px-3 py-1 rounded-full font-bold tabular-nums">
              {pastGigs.length} Completed
            </span>
          </div>

          {pastGigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastGigs.map(pGig => (
                <div 
                  key={pGig.id}
                  className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                        Completed & Paid
                      </span>
                      <span className="text-base font-black text-[#101014] font-mono tabular-nums">
                        ₹{pGig.totalBudget.toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#101014] mt-2">{pGig.title}</h4>
                    <p className="text-xs text-slate-500">{pGig.employerCompany} • {pGig.milestones.length} Milestones</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewingPastGigId(pGig.id)}
                    className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText size={13} />
                    <span>Inspect Project Archive</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 sm:p-12 rounded-[2rem] bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
              <FileText size={24} className="text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700">No Past Completed Projects</h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                When you successfully deliver milestones and receive client sign-off, your completed projects and verified proofs will be archived here.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Case 2: Student has an active project (or selected an archived project)
  const completedMilestones = gig.milestones.filter(m => m.status === 'completed');
  const activeMilestone = gig.milestones.find(m => m.status === 'active' || m.status === 'under_review' || m.status === 'in_revision') || gig.milestones[0];
  const completionPercentage = Math.round((completedMilestones.length / gig.milestones.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link 
            to="/app/student/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          {isArchivedView && (
            <button
              onClick={() => setViewingPastGigId(null)}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              • Exit Archive View
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">
            Contract ID: <span className="font-mono text-purple-700 font-bold">{gig.id}</span>
          </span>
        </div>
      </div>

      {/* Multi-Active-Gig Switcher Tabs if multiple */}
      {activeGigs.length > 1 && !isArchivedView && (
        <div className="p-4 rounded-2xl bg-white border border-[#EDE8FD] shadow-sm flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2">Active Projects:</span>
          {activeGigs.map(ag => (
            <Link
              key={ag.id}
              to={`/app/student/workspace/${ag.id}`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                ag.id === gig.id 
                  ? 'bg-[#101014] text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {ag.title.length > 28 ? `${ag.title.slice(0, 28)}...` : ag.title}
            </Link>
          ))}
        </div>
      )}

      {/* Archived Notice Banner if inspecting past gig */}
      {isArchivedView && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-purple-700" />
            <span>Viewing Archived Completed Project <strong>({gig.title})</strong>. All milestones have been approved and funds released.</span>
          </div>
          <button
            onClick={() => setViewingPastGigId(null)}
            className="px-3 py-1 rounded-full bg-white border border-purple-300 text-purple-900 font-bold hover:bg-purple-100 text-[11px]"
          >
            Close Archive
          </button>
        </div>
      )}

      {/* Contract Banner */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black px-3.5 py-1 rounded-full border ${
              isArchivedView 
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-purple-50 text-purple-900 border-purple-200'
            }`}>
              {isArchivedView ? 'Completed Contract' : 'Active Project Workspace'}
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
          <span className="text-3xl font-black text-[#121214] font-mono tabular-nums">₹{gig.totalBudget.toLocaleString()}</span>
          <div className="mt-1 text-xs text-emerald-800 font-bold">
            {completedMilestones.length} of {gig.milestones.length} Milestones Released ({completionPercentage}%)
          </div>
        </div>

        {/* Action controls row */}
        <div className="w-full pt-4 border-t border-purple-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsScopeModalOpen(true)}
              className="px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileText size={13} className="text-purple-700" />
              <span>Scope & Legal Terms (NDA)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare size={13} className="text-slate-700" />
              <span>Message SME Client</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {gig.milestones.every(m => m.status === 'completed') && (
              <button
                type="button"
                onClick={() => setIsReviewOpen(true)}
                className="px-4 py-2 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#121214] text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Award size={14} />
                <span>Submit Review & View Proof</span>
              </button>
            )}
            {!isArchivedView && (
              <button
                type="button"
                onClick={() => {
                  setDisputeMilestone(activeMilestone);
                  setIsDisputeOpen(true);
                }}
                className="px-3.5 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ShieldAlert size={13} />
                <span>Escalate Milestone</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced 4-Stage Pipeline Progress Tracker */}
      <div className="p-7 rounded-[2.5rem] bg-white border border-purple-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Stage-by-Stage Milestone Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current Active Phase: <strong className="text-slate-900">{activeMilestone.title}</strong>
            </p>
          </div>
          <div className="text-xs font-black text-purple-700 font-mono">
            {completionPercentage}% Total Completed
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#101014] h-full transition-all duration-500 rounded-full" 
            style={{ width: `${Math.max(completionPercentage, 10)}%` }}
          />
        </div>

        {/* 4 Stages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {[
            { stageNum: 1, name: 'Scope & Legal', desc: 'NDA & Terms Confirmed', done: true, current: false },
            { stageNum: 2, name: 'In Progress', desc: 'Deliverables Development', done: completedMilestones.length > 0, current: activeMilestone.status === 'active' },
            { stageNum: 3, name: 'Under Review', desc: 'SME Inspection & Test', done: completedMilestones.length > 0, current: activeMilestone.status === 'under_review' },
            { stageNum: 4, name: 'Approved & Paid', desc: 'Escrow Released to Wallet', done: gig.milestones.every(m => m.status === 'completed'), current: false },
          ].map((stg) => (
            <div 
              key={stg.stageNum} 
              className={`p-4 rounded-2xl border transition-all ${
                stg.current
                  ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-100'
                  : stg.done
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`w-6 h-6 rounded-full font-black text-[11px] flex items-center justify-center shadow-sm ${
                  stg.done ? 'bg-emerald-600 text-white' : stg.current ? 'bg-purple-700 text-white' : 'bg-white text-slate-700'
                }`}>
                  {stg.done ? <Check size={13} /> : stg.stageNum}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Stage {stg.stageNum}
                </span>
              </div>
              <div className="text-xs font-bold text-[#101014] mt-2">{stg.name}</div>
              <div className="text-[11px] text-slate-500">{stg.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage-Wise Milestones List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shadow-xs">
              <Layers size={17} />
            </span>
            <span>Project Milestones & Deliverables</span>
          </h2>
          <span className="text-xs text-purple-900 bg-purple-50 border border-purple-200/80 px-3 py-1 rounded-full font-bold tabular-nums">
            {gig.milestones.length} Milestones Structured
          </span>
        </div>

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
                  <div className="flex flex-wrap items-center gap-2.5">
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
                    <span className="text-base font-black text-[#121214] font-mono tabular-nums">₹{ms.amount.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-400 font-medium">Due: {ms.deadline}</span>
                  </div>

                  {!isArchivedView && (ms.status === 'active' || ms.status === 'in_revision') ? (
                    <button
                      onClick={() => setActiveModalMilestone(ms)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-sm transition-all shrink-0"
                    >
                      <Upload size={14} className="text-[#D4F851]" />
                      <span>{ms.status === 'in_revision' ? 'Resubmit Deliverable' : 'Submit Deliverable'}</span>
                    </button>
                  ) : !isArchivedView && ms.status === 'under_review' ? (
                    <button
                      onClick={() => setActiveModalMilestone(ms)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold shrink-0 hover:bg-slate-200 transition-colors"
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

      {/* Past Completed Projects Archive Drawer/Section */}
      <div className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <History size={18} className="text-slate-700" />
            <span>Past Completed Projects</span>
          </h3>
          <span className="text-xs text-slate-500 font-bold">{pastGigs.length} Completed</span>
        </div>

        {pastGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastGigs.map(pGig => (
              <div 
                key={pGig.id}
                className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                      Completed & Paid
                    </span>
                    <span className="text-base font-black text-[#101014] font-mono tabular-nums">
                      ₹{pGig.totalBudget.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#101014] mt-2">{pGig.title}</h4>
                  <p className="text-xs text-slate-500">{pGig.employerCompany} • {pGig.milestones.length} Milestones</p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingPastGigId(pGig.id)}
                  className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText size={13} />
                  <span>Inspect Project Archive</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-[2rem] bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
            <FileText size={22} className="text-slate-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">No Past Completed Projects Yet</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Completed projects and verified completion credentials will be archived here upon milestone sign-off.
            </p>
          </div>
        )}
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

      {/* Two-Party Scope Acceptance Modal */}
      <ScopeAcceptanceModal
        isOpen={isScopeModalOpen}
        onClose={() => setIsScopeModalOpen(false)}
        contractId={`contract-${gig.id}`}
        gigTitle={gig.title}
        employerName={gig.employerCompany}
        totalAmount={gig.totalBudget}
        milestones={(gig.milestones || []).map(m => ({ id: m.id, title: m.title, criteria: m.description, amount: m.amount }))}
        onAccepted={() => {}}
      />

      {/* Milestone Dispute Escalation Drawer */}
      <RaiseDisputeDrawer
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        contractId={`contract-${gig.id}`}
        milestoneId={disputeMilestone?.id || gig.milestones[0]?.id || 'ms-1'}
        milestoneTitle={disputeMilestone?.title || gig.milestones[0]?.title || 'Milestone 1'}
        milestoneAmount={disputeMilestone?.amount || gig.milestones[0]?.amount || 3000}
        onDisputeRaised={() => {}}
      />

      {/* Double-Sided Review & Rating Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        contractId={`contract-${gig.id}`}
        revieweeId={gig.employerId}
        revieweeName={gig.employerCompany}
        revieweeRole="employer"
        onReviewSubmitted={() => {}}
      />

      {/* In-App Contextual Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        contextType="contract"
        contextId={gig.id}
        recipientId={gig.employerId}
        recipientName={gig.employerCompany}
        recipientRole="employer"
        currentUserId={currentUser.id}
      />

    </div>
  );
};
