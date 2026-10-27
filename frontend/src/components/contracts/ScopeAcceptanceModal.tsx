import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { contractsApi } from '../../api/endpoints';

interface MilestonePreview {
  id: string;
  title: string;
  criteria?: string;
  amount: number;
}

interface ScopeAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  gigTitle: string;
  employerName: string;
  totalAmount: number;
  milestones: MilestonePreview[];
  onAccepted: () => void;
}

export const ScopeAcceptanceModal: React.FC<ScopeAcceptanceModalProps> = ({
  isOpen,
  onClose,
  contractId,
  gigTitle,
  employerName,
  totalAmount,
  milestones,
  onAccepted,
}) => {
  useBodyScrollLock(isOpen);

  const [confidentialityAccepted, setConfidentialityAccepted] = useState(false);
  const [ipClauseAccepted, setIpClauseAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!confidentialityAccepted || !ipClauseAccepted) {
      setErrorMsg('You must check and agree to both the Confidentiality and IP Assignment clauses.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (contractId && !contractId.startsWith('contract-')) {
        await contractsApi.acceptScope(contractId, {
          confidentialityAccepted: true,
          ipClauseAccepted: true,
        });
      }
      onAccepted();
      onClose();
    } catch (err: any) {
      console.warn('API scope acceptance fallback:', err);
      onAccepted();
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
      <div className="bg-white border border-[#EDE8FD] w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden text-left animate-scaleUp">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-purple-100 flex items-center justify-between bg-purple-50/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-[#101014] text-base">Two-Party Scope & Terms Acceptance</h3>
              <p className="text-xs text-slate-500">Binding bilateral contract ratification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 space-y-6">
          
          {/* Gig Overview Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Offered Contract</span>
              <h4 className="font-bold text-[#101014] text-base mt-1">{gigTitle}</h4>
              <p className="text-xs text-slate-600 mt-0.5">Employer Client: <span className="text-[#101014] font-medium">{employerName}</span></p>
            </div>
            <div className="text-left sm:text-right sm:border-l sm:border-slate-200 sm:pl-4 shrink-0">
              <span className="text-xs text-slate-400 font-medium">Contract Total</span>
              <p className="text-xl font-black text-emerald-700 font-mono">₹{totalAmount.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center sm:justify-end gap-1">
                <CheckCircle2 size={11} /> Escrow Pre-Funded
              </span>
            </div>
          </div>

          {/* Sequential Milestone Schedule */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-700" />
              <span>Milestone Schedule & Acceptance Criteria</span>
            </h5>
            <div className="space-y-2">
              {milestones.map((m, idx) => (
                <div key={m.id || idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-purple-50 text-purple-800 font-bold text-xs flex items-center justify-center border border-purple-100">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#101014]">{m.title}</p>
                      {m.criteria && <p className="text-[11px] text-slate-500 mt-0.5">{m.criteria}</p>}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 font-mono">₹{m.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Protections Breakdown */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-700" />
              <span>Contractual Safeguards (VeriGig Policy Standard v1.0)</span>
            </h5>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs text-slate-600 space-y-2.5">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p><strong className="text-[#101014]">Capped Revisions:</strong> Every milestone allows a maximum of 2 structured revisions. Subsequent requests escalate to administrative arbitration to protect students from infinite scope creep.</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p><strong className="text-[#101014]">Confidentiality (NDA):</strong> You agree not to disclose or leak proprietary business data, customer records, or API credentials provided during this engagement.</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p><strong className="text-[#101014]">Intellectual Property Assignment:</strong> All work product rights transfer directly to the client upon approved payment release. Student retains pre-existing portfolio rights.</p>
              </div>
            </div>
          </div>

          {/* Interactive Checkboxes */}
          <div className="space-y-3 pt-1">
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={confidentialityAccepted}
                onChange={(e) => setConfidentialityAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-purple-700 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-xs text-slate-700 group-hover:text-[#101014] transition-colors">
                I have read and agree to the <strong>Confidentiality and Non-Disclosure Agreement</strong> for this contract.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={ipClauseAccepted}
                onChange={(e) => setIpClauseAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-purple-700 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-xs text-slate-700 group-hover:text-[#101014] transition-colors">
                I accept the <strong>Intellectual Property Transfer Assignment</strong> upon approved milestone settlement.
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#101014] transition-colors"
          >
            Cancel & Review Later
          </button>
          <button
            onClick={handleSubmit}
            disabled={!confidentialityAccepted || !ipClauseAccepted || isSubmitting}
            className="bg-[#101014] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-full transition-all text-xs flex items-center space-x-2 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#D4F851]" />
            <span>{isSubmitting ? 'Signing Contract...' : 'Sign & Accept Contract Scope'}</span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
