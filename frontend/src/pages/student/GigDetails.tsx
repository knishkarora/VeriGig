import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  FileCheck, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Plus, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const GigDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { gigs, currentUser, submitProposal, proposals } = useMarketplace();

  const gig = gigs.find(g => g.id === id);

  // Proposal Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [bidAmount, setBidAmount] = useState<number>(gig?.totalBudget || 5000);
  const [deliveryDays, setDeliveryDays] = useState<number>(7);
  const [portfolioLink, setPortfolioLink] = useState('https://github.com/aaravsharma/project-demo');
  const [submitted, setSubmitted] = useState(false);

  // Check if student already submitted proposal
  const existingProposal = proposals.find(p => p.gigId === id && p.studentId === currentUser.id);

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-white">Micro-Gig not found</h2>
        <Link to="/app/student/explore" className="text-indigo-400 text-xs mt-3 inline-block">
          Return to Explore ↗
        </Link>
      </div>
    );
  }

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverNote.trim()) return;

    submitProposal(
      gig.id,
      coverNote,
      bidAmount,
      deliveryDays,
      [{ label: 'Portfolio Link', url: portfolioLink }]
    );

    setSubmitted(true);
    setTimeout(() => {
      setIsDrawerOpen(false);
      navigate('/app/student/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Back button */}
      <div>
        <Link 
          to="/app/student/explore"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Micro-Gig Feed</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#111827] via-slate-900 to-[#141b2c] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
              {gig.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {gig.locationScope}
            </span>
            {gig.campusProximity && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {gig.campusProximity}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {gig.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Posted by <strong className="text-white">{gig.employerName}</strong> ({gig.employerCompany})</span>
            {gig.employerVerified && (
              <TrustBadge type="sme" size="sm" text="Verified SME Partner" />
            )}
          </div>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-xs text-slate-400 block uppercase tracking-wider">Total Escrow Budget</span>
          <span className="text-3xl font-black text-emerald-400 block">₹{gig.totalBudget.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 block">{gig.paymentType === 'milestone' ? 'Split into Milestones' : 'Single Payout'}</span>
          
          <div className="mt-3">
            {existingProposal ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 size={14} /> Proposal Submitted
              </span>
            ) : gig.status === 'in_progress' ? (
              <Link 
                to={`/app/student/workspace/${gig.id}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow-indigo transition-all"
              >
                <span>Open Active Workspace</span>
                <ChevronRight size={14} />
              </Link>
            ) : (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow-indigo transition-all"
              >
                <Send size={13} />
                <span>Submit Proposal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Details Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Scope & Deliverables */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Detailed Scope */}
          <div className="p-6 rounded-3xl bg-[#111827]/70 backdrop-blur-md border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Project Scope & SME Requirements</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {gig.description}
            </p>
          </div>

          {/* Expected Deliverables */}
          <div className="p-6 rounded-3xl bg-[#111827]/70 backdrop-blur-md border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck size={18} className="text-indigo-400" />
              <span>Concrete Deliverables Expected</span>
            </h2>
            <ul className="space-y-2.5">
              {gig.expectedDeliverables.map((deliv, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{deliv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Skills & Eligible Campuses */}
          <div className="p-6 rounded-3xl bg-[#111827]/70 backdrop-blur-md border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Skill Prerequisites & Preferred Campuses</h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Required Competencies
                </span>
                <div className="flex flex-wrap gap-2">
                  {gig.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Target Student Campuses
                </span>
                <div className="flex flex-wrap gap-2">
                  {gig.preferredColleges.map((col, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 text-xs font-medium">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Milestone Breakdown & Client Trust */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Milestone Timeline */}
          <div className="p-6 rounded-3xl bg-[#111827]/70 backdrop-blur-md border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Escrow Milestones</h2>
              <span className="text-xs text-indigo-400 font-semibold">{gig.milestones.length} Defined</span>
            </div>

            <div className="space-y-4">
              {gig.milestones.map((ms, index) => (
                <div 
                  key={ms.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    ms.status === 'completed'
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : ms.status === 'active' || ms.status === 'under_review'
                      ? 'bg-indigo-950/20 border-indigo-500/40 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="text-xs font-bold text-white">{ms.title}</h4>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 shrink-0">₹{ms.amount.toLocaleString()}</span>
                  </div>
                  
                  <p className="text-[11px] text-slate-400 mt-2 pl-7 leading-relaxed">
                    {ms.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pl-7 pt-2 border-t border-slate-800/60 text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock size={11} /> Due: {ms.deadline}
                    </span>
                    <span className="capitalize font-bold text-indigo-300">
                      {ms.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Escrow note */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Funds for each milestone are held securely in platform escrow and paid immediately upon SME sign-off.
              </span>
            </div>
          </div>

          {/* Client Profile Summary */}
          <div className="p-6 rounded-3xl bg-[#111827]/70 backdrop-blur-md border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About the Business</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-300 text-sm">
                {gig.employerCompany.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{gig.employerCompany}</h4>
                <p className="text-xs text-slate-400">Owner: {gig.employerName}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verified local enterprise partner. 100% dispute-free payout track record across Ludhiana campus talent.
            </p>
          </div>

        </div>

      </div>

      {/* Interactive Submit Proposal Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-[#111827] border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              
              <div className="space-y-6 text-left">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Fast Application</span>
                    <h3 className="text-lg font-bold text-white">Submit Proposal for Micro-Gig</h3>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
                  >
                    Close
                  </button>
                </div>

                {submitted ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-white">Proposal Sent to {gig.employerCompany}!</h4>
                    <p className="text-xs text-slate-400">
                      The employer has received your proposed milestone breakdown and verified student badge.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleProposalSubmit} className="space-y-4">
                    
                    {/* Cover Note */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Proposed Approach & Relevant Experience
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        placeholder="Explain how you will tackle this task, past similar projects you've built, and why you're a great fit..."
                        className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Bid and Timeline */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Your Total Bid (INR ₹)
                        </label>
                        <input
                          type="number"
                          required
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-[10px] text-slate-500">Client budget: ₹{gig.totalBudget.toLocaleString()}</span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Est. Turnaround (Days)
                        </label>
                        <input
                          type="number"
                          required
                          value={deliveryDays}
                          onChange={(e) => setDeliveryDays(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-[10px] text-slate-500">Client window: {gig.targetDuration}</span>
                      </div>
                    </div>

                    {/* Portfolio / GitHub Link */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Proof of Work / Demo Link
                      </label>
                      <input
                        type="url"
                        required
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        placeholder="https://github.com/... or Figma link"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Student Verification Note */}
                    <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                      <TrustBadge type="student" size="sm" text="Applying as Verified PCTE Student" />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo transition-all flex items-center justify-center gap-2"
                      >
                        <Send size={14} />
                        <span>Send Proposal to SME</span>
                      </button>
                    </div>

                  </form>
                )}

              </div>

              <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800 text-center">
                Submissions are timestamped and protected under the CampusGigs Honor Code.
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
