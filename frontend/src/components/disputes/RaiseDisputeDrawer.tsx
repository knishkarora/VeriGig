import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  UploadCloud, 
  Send, 
  Lock,
  CheckCircle2
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B101B] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0F172A]/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Escalate Milestone Dispute</h3>
              <p className="text-xs text-white/50">Formal Administrative Arbitration Intake</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Milestone Details */}
          <div className="p-3.5 rounded-2xl bg-[#1E293B]/60 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase text-amber-400 tracking-wider">Affected Milestone</span>
              <p className="text-sm font-bold text-white mt-0.5">{milestoneTitle}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/40">Frozen Escrow</span>
              <p className="text-base font-black text-white">₹{milestoneAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Reason Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/80">Dispute Reason Category</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
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
            <label className="text-xs font-bold text-white/80">Detailed Written Statement</label>
            <textarea
              rows={4}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="State what went wrong, referencing specific milestone deliverables, timeline expectations, or communication transcripts..."
              className="w-full bg-[#1E293B] border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Evidence Upload / Link */}
          <div className="space-y-3 pt-1 border-t border-white/10">
            <label className="text-xs font-bold text-white/80 flex items-center space-x-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
              <span>Supporting Evidence Note & Links</span>
            </label>
            
            <input
              type="text"
              value={evidenceNote}
              onChange={(e) => setEvidenceNote(e.target.value)}
              placeholder="Evidence description (e.g. Figma changelog, email approval log)"
              className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
            />

            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="Evidence reference URL (GitHub PR, Loom, cloud drive link)"
              className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Freezing Warning Callout */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2.5 text-xs text-amber-200">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Escrow Safeguard Freeze</p>
              <p className="text-amber-200/80 mt-0.5 text-[11px] leading-relaxed">
                Filing locks ₹{milestoneAmount.toLocaleString('en-IN')} in escrow. Neither party can withdraw or approve funds until an Administrator completes arbitration and issues a formal binding settlement.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !explanation.trim()}
              className="bg-amber-400 text-[#121214] font-bold px-5 py-2.5 rounded-2xl hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs flex items-center space-x-2 shadow-lg"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isSubmitting ? 'Freezing & Escalating...' : 'Submit Formal Dispute'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
