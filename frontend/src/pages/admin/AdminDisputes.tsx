import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  History, 
  RotateCcw, 
  Split, 
  Check, 
  User, 
  Building2,
  FileText
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Dispute } from '../../types';

export const AdminDisputes: React.FC = () => {
  const { disputes, resolveDispute } = useMarketplace();

  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(disputes[0]?.id || '');
  const [resolutionNote, setResolutionNote] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedDispute = disputes.find(d => d.id === selectedDisputeId) || disputes[0];

  const handleResolve = (resolutionType: 'release_student' | 'refund_employer' | 'split_payout') => {
    if (!selectedDispute) return;
    const note = resolutionNote || 'Resolved per governance guidelines after scope audit.';
    resolveDispute(selectedDispute.id, resolutionType, note);

    const label = resolutionType === 'release_student' 
      ? 'Funds Released to Student' 
      : resolutionType === 'refund_employer'
      ? 'Funds Refunded to Business'
      : 'Funds Split 50/50';

    setSuccessMessage(`Resolution executed: ${label}`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Dispute & Escalation Desk</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30">
              Dispute Resolution Protocol
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Independent arbitration for scope creep, non-responsive SME sign-offs, and requirement mismatches.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          <span className="font-bold text-white text-base">{disputes.filter(d => d.status === 'open').length}</span> Active Disputes
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Flagged Disputes List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Flagged Cases ({disputes.length})
          </span>

          {disputes.map((disp) => {
            const isSelected = disp.id === selectedDispute?.id;
            return (
              <div
                key={disp.id}
                onClick={() => setSelectedDisputeId(disp.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-500/80 shadow-glow-indigo'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-500/30">
                    Case {disp.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    disp.status === 'resolved'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                  }`}>
                    {disp.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">{disp.gigTitle}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{disp.reason}</p>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Escrow in Dispute:</span>
                  <span className="font-extrabold text-amber-400">₹{disp.amountInEscrow.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Chronological Audit Trail & Resolution Center */}
        <div className="lg:col-span-7">
          {selectedDispute && (
            <div className="p-6 rounded-3xl bg-[#111827]/90 backdrop-blur-xl border border-slate-800 space-y-6">
              
              {/* Header */}
              <div className="pb-4 border-b border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShieldAlert size={14} /> Arbitration Dossier
                  </span>
                  <span className="font-mono text-xs text-slate-400">Escrow Value: ₹{selectedDispute.amountInEscrow.toLocaleString()}</span>
                </div>
                <h3 className="text-base font-bold text-white">{selectedDispute.gigTitle}</h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-emerald-400" />
                    <span>Student: <strong className="text-white">{selectedDispute.studentName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 size={13} className="text-indigo-400" />
                    <span>Employer: <strong className="text-white">{selectedDispute.employerName}</strong></span>
                  </div>
                </div>
              </div>

              {/* Dispute Core Reason */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <span className="font-bold text-amber-300 block">Flagged Issue Summary:</span>
                <p className="text-slate-300 leading-relaxed">{selectedDispute.reason}</p>
              </div>

              {/* Chronological Audit Log */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History size={14} /> Chronological Action Audit Trail
                </span>

                <div className="space-y-2.5 pl-2 border-l-2 border-slate-800">
                  {selectedDispute.auditLog.map((log, idx) => (
                    <div key={idx} className="relative pl-4 text-xs space-y-0.5">
                      <div className="absolute -left-[9px] top-1 w-2 h-2 rounded-full bg-indigo-500" />
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="font-bold text-slate-300">{log.actor} • {log.action}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-slate-300">{log.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Actions */}
              {selectedDispute.status === 'open' ? (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Arbitration Verdict
                  </span>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Arbitrator Official Findings / Settlement Note
                    </label>
                    <input
                      type="text"
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="e.g. Scope analysis confirms deliverables met 100% of agreed criteria..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleResolve('release_student')}
                      className="py-2.5 px-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={13} />
                      <span>Release to Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResolve('split_payout')}
                      className="py-2.5 px-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow-indigo transition-all flex items-center justify-center gap-1.5"
                    >
                      <Split size={13} />
                      <span>Split Payout (50/50)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResolve('refund_employer')}
                      className="py-2.5 px-3 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={13} />
                      <span>Refund to SME</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Case Settled
                  </span>
                  <p className="text-slate-300">{selectedDispute.resolutionSummary}</p>
                  <span className="text-[10px] text-slate-500 block">Settled At: {selectedDispute.resolvedAt}</span>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
