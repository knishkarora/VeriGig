import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  History, 
  RotateCcw, 
  Split, 
  User, 
  Building2
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

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
            Independent governance for scope mismatches and deliverable arbitration.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-700 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
          <span className="font-black text-[#121214] text-sm">{disputes.filter(d => d.status === 'open').length}</span> Active Cases
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Flagged Disputes List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
            Flagged Cases ({disputes.length})
          </span>

          {disputes.map((disp) => {
            const isSelected = disp.id === selectedDispute?.id;
            return (
              <div
                key={disp.id}
                onClick={() => setSelectedDisputeId(disp.id)}
                className={`p-5 rounded-[2rem] border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-amber-400 shadow-md ring-2 ring-amber-200'
                    : 'bg-white/80 border-purple-100 hover:border-purple-200 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    Case {disp.id}
                  </span>
                  <span className={`text-[10px] font-black px-3 py-0.5 rounded-full capitalize ${
                    disp.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {disp.status}
                  </span>
                </div>

                <h4 className="text-xs font-black text-[#121214] leading-snug">{disp.gigTitle}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-normal">{disp.reason}</p>

                <div className="mt-3 pt-2 border-t border-purple-100 flex items-center justify-between text-[11px] font-medium">
                  <span className="text-slate-400">Escrow Value:</span>
                  <span className="font-black text-amber-600">₹{disp.amountInEscrow.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Chronological Audit Trail & Resolution Center */}
        <div className="lg:col-span-7">
          {selectedDispute && (
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-md space-y-6">
              
              <div className="pb-4 border-b border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                    <ShieldAlert size={14} /> Arbitration Dossier
                  </span>
                  <span className="font-bold text-xs text-slate-700">Escrow Value: ₹{selectedDispute.amountInEscrow.toLocaleString()}</span>
                </div>
                <h3 className="text-lg font-black text-[#121214]">{selectedDispute.gigTitle}</h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 pt-1 font-medium">
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-emerald-600" />
                    <span>Student: <strong className="text-slate-900">{selectedDispute.studentName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-purple-600" />
                    <span>Employer: <strong className="text-slate-900">{selectedDispute.employerName}</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
                <span className="font-black text-amber-950 block">Flagged Issue Summary:</span>
                <p className="text-slate-700 leading-relaxed font-normal">{selectedDispute.reason}</p>
              </div>

              {/* Chronological Audit Log */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History size={14} /> Chronological Audit Trail
                </span>

                <div className="space-y-3 pl-2 border-l-2 border-purple-200">
                  {selectedDispute.auditLog.map((log, idx) => (
                    <div key={idx} className="relative pl-4 text-xs space-y-0.5">
                      <div className="absolute -left-[9px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-600 ring-2 ring-white" />
                      <div className="flex items-center justify-between text-slate-500 text-[10px]">
                        <span className="font-black text-slate-900">{log.actor} • {log.action}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-slate-600 font-normal">{log.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Actions */}
              {selectedDispute.status === 'open' ? (
                <div className="space-y-4 pt-4 border-t border-purple-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                    Arbitration Verdict
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Arbitrator Official Findings / Settlement Note
                    </label>
                    <input
                      type="text"
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="e.g. Scope analysis confirms deliverables met 100% of agreed criteria..."
                      className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleResolve('release_student')}
                      className="py-3 px-3 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} className="text-[#D4F851]" />
                      <span>Release Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResolve('split_payout')}
                      className="py-3 px-3 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-black transition-all flex items-center justify-center gap-1.5"
                    >
                      <Split size={14} />
                      <span>Split (50/50)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResolve('refund_employer')}
                      className="py-3 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={14} />
                      <span>Refund SME</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs space-y-1">
                  <span className="font-black text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 size={15} /> Case Settled
                  </span>
                  <p className="text-slate-700 font-medium">{selectedDispute.resolutionSummary}</p>
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
