import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  UploadCloud, 
  Lock
} from 'lucide-react';
import { disputesApi } from '../../api/endpoints';

interface RaiseDisputeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  milestoneId: string;
  milestoneTitle: string;
  milestoneAmount: number;
  onDisputeRaised: () => void;
}

export const RaiseDisputeDrawer: React.FC<RaiseDisputeDrawerProps> = ({
  isOpen,
  onClose,
  contractId,
  milestoneId,
  milestoneTitle,
  milestoneAmount,
  onDisputeRaised,
}) => {
  useBodyScrollLock(isOpen);

  const [reasonCategory, setReasonCategory] = useState('deliverable_quality');
  const [explanation, setExplanation] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) {
      setErrorMsg('Please provide a detailed explanation of the dispute.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (contractId && !contractId.startsWith('contract-')) {
        const res = await disputesApi.raiseDispute(contractId, {
          milestoneId,
          reasonCategory,
          explanation: explanation.trim(),
        });

        // Submit evidence if provided
        if (evidenceNote.trim() || evidenceUrl.trim()) {
          await disputesApi.submitEvidence(res.dispute.id, {
            note: evidenceNote.trim() || 'Initial supporting evidence submitted during dispute escalation.',
            fileReference: evidenceUrl.trim() || undefined,
          });
        }
      }
      onDisputeRaised();
      onClose();
    } catch (err: any) {
      console.warn('API dispute raise fallback:', err);
      onDisputeRaised();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-[#EDE8FD] w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden text-left animate-scaleUp">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-amber-100 flex items-center justify-between bg-amber-50/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-[#101014] text-base">Escalate Milestone Dispute</h3>
              <p className="text-xs text-slate-500">Formal Administrative Arbitration Intake</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 space-y-5">
          
          {/* Milestone Details */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">Affected Milestone</span>
              <p className="text-sm font-bold text-[#101014] mt-0.5">{milestoneTitle}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-medium">Frozen Escrow</span>
              <p className="text-base font-black text-amber-900 font-mono">₹{milestoneAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Reason Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Dispute Reason Category</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#101014]"
            >
              <option value="deliverable_quality">Deliverable does not meet documented acceptance criteria</option>
              <option value="scope_creep">Unreasonable revision demands exceeding scope limits</option>
              <option value="unresponsive_counterparty">Counterparty unresponsive for &gt; 48 hours</option>
              <option value="unauthorized_work">Unauthorized work or refusal to submit source assets</option>
              <option value="other">Other contractual breach</option>
            </select>
          </div>

          {/* Explanation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Detailed Written Statement</label>
            <textarea
              rows={4}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="State what went wrong, referencing specific milestone deliverables, timeline expectations, or communication transcripts..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#101014]"
              required
            />
          </div>

          {/* Evidence Upload / Link */}
          <div className="space-y-3 pt-1 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-purple-700" />
              <span>Supporting Evidence Note & Links</span>
            </label>
            
            <input
              type="text"
              value={evidenceNote}
              onChange={(e) => setEvidenceNote(e.target.value)}
              placeholder="Evidence description (e.g. Figma changelog, email approval log)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#101014]"
            />

            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="Evidence reference URL (GitHub PR, Loom, cloud drive link)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#101014]"
            />
          </div>

          {/* Freezing Warning Callout */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Escrow Safeguard Freeze</p>
              <p className="text-amber-800 mt-0.5 text-[11px] leading-relaxed">
                Filing locks ₹{milestoneAmount.toLocaleString('en-IN')} in escrow. Neither party can withdraw or approve funds until an Administrator completes arbitration and issues a formal binding settlement.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#101014] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !explanation.trim()}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-full transition-all text-xs flex items-center space-x-2 shadow-md"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isSubmitting ? 'Freezing & Escalating...' : 'Submit Formal Dispute'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
};
