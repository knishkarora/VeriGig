import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  History, 
  RotateCcw, 
  Split, 
  User, 
  Building2,
  RefreshCw,
  FileText,
  AlertCircle,
  Clock
} from 'lucide-react';
import { disputesApi } from '../../api/endpoints';

interface DisputeItem {
  id: string;
  contractId: string;
  gigTitle: string;
  milestoneId: string;
  milestoneTitle: string;
  disputedAmount: number;
  reasonCategory: string;
  explanation: string;
  status: string;
  resolutionType?: string | null;
  initiatedBy: {
    id: string;
    email?: string;
    role?: string;
  };
  evidenceCount: number;
  createdAt: string;
  resolvedAt?: string | null;
}

interface DisputeDossier extends DisputeItem {
  studentName?: string;
  employerName?: string;
  evidence?: {
    id: string;
    uploadedBy: string;
    note: string;
    fileReference?: string;
    submittedAt: string;
  }[];
  decision?: {
    formalRuling: string;
    payoutAmountStudent: number;
    refundAmountEmployer: number;
    recordedAt: string;
  } | null;
}

export const AdminDisputes: React.FC = () => {
  const [disputesList, setDisputesList] = useState<DisputeItem[]>([]);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>('');
  const [selectedDossier, setSelectedDossier] = useState<DisputeDossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDossierLoading, setIsDossierLoading] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch disputes from real backend database
  const fetchDisputes = useCallback(async () => {
    setIsLoading(true);
    setFeedbackMessage(null);
    try {
      const res = await disputesApi.listAdminDisputes();
      if (res && Array.isArray(res.disputes)) {
        setDisputesList(res.disputes);
        if (res.disputes.length > 0 && !selectedDisputeId) {
          setSelectedDisputeId(res.disputes[0].id);
        }
      } else {
        setDisputesList([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch disputes from backend:', err);
      setFeedbackMessage({
        type: 'error',
        text: err?.message || 'Could not load dispute cases from database.'
      });
      setDisputesList([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDisputeId]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  // Fetch full case dossier whenever selected dispute changes
  useEffect(() => {
    if (!selectedDisputeId) {
      setSelectedDossier(null);
      return;
    }

    let active = true;
    const loadDossier = async () => {
      setIsDossierLoading(true);
      try {
        const dossier = await disputesApi.getDisputeDossier(selectedDisputeId);
        if (active && dossier) {
          const matchedItem = disputesList.find(d => d.id === selectedDisputeId);
          setSelectedDossier({
            ...matchedItem!,
            ...dossier.dispute,
            studentName: dossier.student?.name || 'Student Contractor',
            employerName: dossier.employer?.name || 'SME Client',
            evidence: dossier.evidence || [],
            decision: dossier.decision || null,
          });
        }
      } catch (err) {
        console.warn('Could not fetch detailed dossier:', err);
        const fallback = disputesList.find(d => d.id === selectedDisputeId);
        if (active && fallback) {
          setSelectedDossier(fallback);
        }
      } finally {
        if (active) setIsDossierLoading(false);
      }
    };

    loadDossier();
    return () => { active = false; };
  }, [selectedDisputeId, disputesList]);

  const handleResolve = async (resolutionType: 'release_student' | 'refund_employer' | 'split_payout') => {
    if (!selectedDossier) return;
    setIsResolving(true);
    setFeedbackMessage(null);

    const amount = selectedDossier.disputedAmount || 4000;
    const studentAmt = resolutionType === 'release_student' 
      ? amount 
      : resolutionType === 'split_payout' 
      ? Math.round(amount / 2) 
      : 0;
    const employerAmt = amount - studentAmt;

    const ruling = resolutionNote.trim() || `Resolved per arbitration audit: ${
      resolutionType === 'release_student' 
        ? 'Full payout released to student after verifying deliverable criteria.' 
        : resolutionType === 'refund_employer' 
        ? 'Full refund issued to employer due to defective delivery.' 
        : '50/50 split settlement issued to both parties.'
    }`;

    try {
      await disputesApi.resolveDispute(selectedDossier.id, {
        formalRuling: ruling,
        payoutAmountStudent: studentAmt,
        refundAmountEmployer: employerAmt,
      });

      setFeedbackMessage({
        type: 'success',
        text: `Arbitration ruling executed: ${
          resolutionType === 'release_student' 
            ? '₹' + amount + ' released to Student' 
            : resolutionType === 'refund_employer' 
            ? '₹' + amount + ' refunded to SME' 
            : '₹' + studentAmt + ' each split 50/50'
        }.`
      });

      setResolutionNote('');
      // Refresh real state from database
      await fetchDisputes();
    } catch (err: any) {
      console.error('Failed to resolve dispute:', err);
      setFeedbackMessage({
        type: 'error',
        text: err?.message || 'Resolution failed. Please verify admin privileges.'
      });
    } finally {
      setIsResolving(false);
    }
  };

  const openCases = disputesList.filter(d => d.status === 'open' || d.status === 'in_review');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#121214]">Dispute & Escalation Desk</h1>
            <span className="text-xs font-black px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              Arbitration Protocol
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Independent institutional governance and binding milestone arbitration backed by PostgreSQL audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDisputes()}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Refresh disputes"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <div className="text-xs font-bold text-amber-950 bg-amber-50 px-4 py-2 rounded-full border border-amber-200 tabular-nums">
            <span className="font-black text-[#101014] text-sm">{openCases.length}</span> Active Cases
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          {feedbackMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Querying live arbitration cases from database...</p>
        </div>
      ) : disputesList.length === 0 ? (
        <div className="p-12 rounded-[2.5rem] bg-white border border-slate-200 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-black text-slate-900">Zero Pending Disputes</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All contract milestones are currently progressing smoothly or have been settled without escalated contest.
          </p>
        </div>
      ) : (
        /* Two Column Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Flagged Disputes List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
              Active Case Files ({disputesList.length})
            </span>

            {disputesList.map((disp) => {
              const isSelected = disp.id === selectedDisputeId;
              const isResolved = disp.status === 'resolved';

              return (
                <div
                  key={disp.id}
                  onClick={() => setSelectedDisputeId(disp.id)}
                  className={`p-5 rounded-[2rem] border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-amber-400 shadow-md ring-2 ring-amber-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      {disp.reasonCategory.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-black px-3 py-0.5 rounded-full capitalize ${
                      isResolved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {disp.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-[#101014] leading-snug">{disp.gigTitle}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-normal">{disp.explanation}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium">
                    <span className="text-slate-400">Escrow Value:</span>
                    <span className="font-black text-amber-600 font-mono tabular-nums">
                      ₹{disp.disputedAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Dossier View & Resolution Center */}
          <div className="lg:col-span-7">
            {isDossierLoading ? (
              <div className="p-12 rounded-[2.5rem] bg-white border border-slate-200 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-bold">Loading case dossier and evidence chain...</p>
              </div>
            ) : selectedDossier ? (
              <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-md space-y-6">
                
                <div className="pb-4 border-b border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                      <ShieldAlert size={14} /> Arbitration Case File
                    </span>
                    <span className="font-bold text-xs text-slate-700 font-mono tabular-nums">
                      Escrow in Lock: ₹{selectedDossier.disputedAmount.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#101014]">{selectedDossier.gigTitle}</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 pt-1 font-medium">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-emerald-600" />
                      <span>Student: <strong className="text-slate-900">{selectedDossier.studentName || 'Student'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-purple-600" />
                      <span>Employer: <strong className="text-slate-900">{selectedDossier.employerName || 'Business'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Flagged Issue Details */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-amber-950">Initiated Grievance:</span>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                      Category: {selectedDossier.reasonCategory.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-amber-950 leading-relaxed font-normal">{selectedDossier.explanation}</p>
                </div>

                {/* Real Evidence Items from Database */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <History size={14} /> Submitted Evidence & Timestamps ({selectedDossier.evidence?.length || 0})
                  </span>

                  {selectedDossier.evidence && selectedDossier.evidence.length > 0 ? (
                    <div className="space-y-3 pl-2 border-l-2 border-purple-200">
                      {selectedDossier.evidence.map((ev, idx) => (
                        <div key={idx} className="relative pl-4 text-xs space-y-1">
                          <div className="absolute -left-[9px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-600 ring-2 ring-white" />
                          <div className="flex items-center justify-between text-slate-500 text-[10px]">
                            <span className="font-black text-slate-900">
                              Evidence #{idx + 1} • {new Date(ev.submittedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                            {ev.fileReference && (
                              <span className="text-purple-700 font-mono font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                                <FileText size={10} />
                                {ev.fileReference}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700 font-normal leading-relaxed">{ev.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                      No additional external files submitted yet. Party statements logged above.
                    </div>
                  )}
                </div>

                {/* Resolution Actions */}
                {selectedDossier.status === 'open' || selectedDossier.status === 'in_review' ? (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                      Admin Binding Ruling
                    </span>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Arbitrator Formal Settlement Verdict
                      </label>
                      <input
                        type="text"
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        placeholder="e.g. Scope audit confirms deliverables met agreed acceptance criteria..."
                        className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#101014] font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <button
                        type="button"
                        disabled={isResolving}
                        onClick={() => handleResolve('release_student')}
                        className="py-3 px-3 rounded-full bg-[#101014] hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={14} className="text-[#D4F851]" />
                        <span>Release Student</span>
                      </button>

                      <button
                        type="button"
                        disabled={isResolving}
                        onClick={() => handleResolve('split_payout')}
                        className="py-3 px-3 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-900 text-xs font-black transition-all flex items-center justify-center gap-1.5"
                      >
                        <Split size={14} />
                        <span>Split (50/50)</span>
                      </button>

                      <button
                        type="button"
                        disabled={isResolving}
                        onClick={() => handleResolve('refund_employer')}
                        className="py-3 px-3 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs font-black transition-all flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw size={14} />
                        <span>Refund SME</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs space-y-1">
                    <span className="font-black text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 size={15} /> Case Formally Settled
                    </span>
                    <p className="text-slate-800 font-medium">
                      {selectedDossier.decision?.formalRuling || 'Arbitration settled by governance committee.'}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-600 pt-1 font-mono">
                      <span>Student: ₹{selectedDossier.decision?.payoutAmountStudent ?? 0}</span>
                      <span>Employer Refund: ₹{selectedDossier.decision?.refundAmountEmployer ?? 0}</span>
                    </div>
                  </div>
                )}

              </div>
            ) : null}
          </div>

        </div>
      )}

    </div>
  );
};
