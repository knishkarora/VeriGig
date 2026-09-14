import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  FileCheck, 
  ShieldCheck, 
  Send, 
  ChevronRight,
  ArrowUpRight
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

  const existingProposal = proposals.find(p => p.gigId === id && p.studentId === currentUser.id);

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-black text-slate-900">Micro-Gig not found</h2>
        <Link to="/app/student/explore" className="text-purple-700 text-xs font-bold mt-3 inline-block">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Back button */}
      <div>
        <Link 
          to="/app/student/explore"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Micro-Gig Feed</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-purple-50 border border-purple-200 text-purple-900">
              {gig.category}
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
              {gig.locationScope}
            </span>
            {gig.campusProximity && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {gig.campusProximity}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#121214] leading-tight">
            {gig.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Posted by <strong className="text-slate-900">{gig.employerName}</strong> ({gig.employerCompany})</span>
            {gig.employerVerified && (
              <TrustBadge type="sme" size="sm" text="Verified SME Partner" />
            )}
          </div>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Escrow Budget</span>
          <span className="text-3xl sm:text-4xl font-black text-[#101014] block font-mono tabular-nums">₹{gig.totalBudget.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 font-medium block">{gig.paymentType === 'milestone' ? 'Split into Milestones' : 'Single Payout'}</span>
          
          <div className="mt-4">
            {existingProposal ? (
              <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-black">
                <CheckCircle2 size={15} /> Proposal Submitted
              </span>
            ) : gig.status === 'in_progress' ? (
              <Link 
                to={`/app/student/workspace/${gig.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#101014] text-white text-xs font-black shadow-md transition-all"
              >
                <span>Open Active Workspace</span>
                <ChevronRight size={14} />
              </Link>
            ) : (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-2 pl-6 pr-2 py-2 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#101014] text-xs font-black shadow-md transition-all group"
              >
                <span>Submit Proposal</span>
                <div className="w-7 h-7 rounded-full bg-[#101014] text-white flex items-center justify-center font-bold">
                  <ArrowUpRight size={14} />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Details Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Scope & Deliverables */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-8 rounded-[2rem] bg-white border border-[#EDE8FD] shadow-sm space-y-4">
            <h2 className="text-lg font-black text-[#101014]">Project Scope & SME Requirements</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
              {gig.description}
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white border border-[#EDE8FD] shadow-sm space-y-4">
            <h2 className="text-lg font-black text-[#101014] flex items-center gap-2">
              <FileCheck size={20} className="text-slate-700" />
              <span>Concrete Deliverables Expected</span>
            </h2>
            <ul className="space-y-3">
              {gig.expectedDeliverables.map((deliv, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-slate-700 font-medium">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{deliv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-[2rem] bg-white border border-[#EDE8FD] shadow-sm space-y-4">
            <h2 className="text-lg font-black text-[#101014]">Skill Prerequisites & Preferred Campuses</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                  Required Competencies
                </span>
                <div className="flex flex-wrap gap-2">
                  {gig.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                  Target Student Campuses
                </span>
                <div className="flex flex-wrap gap-2">
                  {gig.preferredColleges.map((col, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 rounded-full bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold">
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
          
          <div className="p-8 rounded-[2rem] bg-white border border-[#EDE8FD] shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#101014]">Escrow Milestones</h2>
              <span className="text-xs text-slate-600 font-bold">{gig.milestones.length} Defined</span>
            </div>

            <div className="space-y-4">
              {gig.milestones.map((ms, index) => (
                <div 
                  key={ms.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    ms.status === 'completed'
                      ? 'bg-emerald-50 border-emerald-300'
                      : ms.status === 'active' || ms.status === 'under_review'
                      ? 'bg-slate-50 border-slate-300 shadow-sm'
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white text-slate-900 font-black text-xs flex items-center justify-center shadow-sm">
                        {index + 1}
                      </span>
                      <h4 className="text-xs font-black text-[#101014]">{ms.title}</h4>
                    </div>
                    <span className="text-xs font-black text-[#101014] font-mono tabular-nums shrink-0">₹{ms.amount.toLocaleString()}</span>
                  </div>
                  
                  <p className="text-xs text-slate-600 mt-2 pl-8 leading-relaxed font-normal">
                    {ms.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pl-8 pt-2 border-t border-slate-200 text-[10px] font-bold">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock size={11} /> Due: {ms.deadline}
                    </span>
                    <span className="capitalize text-[#101014]">
                      {ms.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5 font-medium">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Funds for each milestone are held securely in platform escrow and released upon your sign-off.
              </span>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-white border border-[#EDE8FD] shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">About the Business</h3>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center font-black text-sm">
                {gig.employerCompany.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-black text-[#101014]">{gig.employerCompany}</h4>
                <p className="text-xs text-slate-500 font-medium">Founder: {gig.employerName}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Verified local enterprise partner. 100% dispute-free payout track record across Ludhiana campus talent.
            </p>
          </div>

        </div>

      </div>

      {/* Interactive Submit Proposal Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white border-l border-purple-100 shadow-2xl p-8 flex flex-col justify-between overflow-y-auto">
              
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Proposal Submission</span>
                    <h3 className="text-xl font-black text-[#121214]">Apply for Micro-Gig</h3>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-slate-400 hover:text-black text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100"
                  >
                    Close
                  </button>
                </div>

                {submitted ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 className="text-xl font-black text-[#121214]">Proposal Sent to {gig.employerCompany}!</h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      The employer has received your proposed breakdown and verified student badge.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleProposalSubmit} className="space-y-4">
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Proposed Approach & Relevant Experience
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        placeholder="Explain how you will tackle this task and why you're a great fit..."
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#121214] font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Your Total Bid (INR ₹)
                        </label>
                        <input
                          type="number"
                          required
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-bold"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">Budget: ₹{gig.totalBudget.toLocaleString()}</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Est. Turnaround (Days)
                        </label>
                        <input
                          type="number"
                          required
                          value={deliveryDays}
                          onChange={(e) => setDeliveryDays(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-bold"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">Window: {gig.targetDuration}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Proof of Work / Demo Link
                      </label>
                      <input
                        type="url"
                        required
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        placeholder="https://github.com/... or Figma link"
                        className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 font-bold flex items-center gap-2">
                      <TrustBadge type="student" size="sm" text="Applying as Verified PCTE Student" />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-full bg-[#121214] hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Send size={14} />
                        <span>Send Proposal to SME</span>
                      </button>
                    </div>

                  </form>
                )}

              </div>

              <div className="text-[11px] text-slate-400 pt-4 border-t border-purple-100 text-center font-medium">
                Protected by the CampusGigs Honor Code & Escrow Guarantee.
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
