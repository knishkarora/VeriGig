import React from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { 
  X, 
  Receipt, 
  CheckCircle2, 
  Download, 
  Building2, 
  Calendar, 
  FileText, 
  ShieldCheck
} from 'lucide-react';

interface ContractReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  contractTitle: string;
  employerName: string;
  studentName: string;
  totalAmount: number;
  paidAt?: string;
  receiptNumber?: string;
}

export const ContractReceiptModal: React.FC<ContractReceiptModalProps> = ({
  isOpen,
  onClose,
  contractId,
  contractTitle,
  employerName,
  studentName,
  totalAmount,
  paidAt = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  receiptNumber = `REC-${contractId.slice(0, 8).toUpperCase()}`,
}) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-[#EDE8FD] w-full max-w-md max-h-[92dvh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden text-left animate-scaleUp">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-100 flex items-center justify-between bg-purple-50/50 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#101014] text-sm">Settlement Receipt</h3>
              <p className="text-[11px] text-slate-500 font-mono">{receiptNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs flex-1 min-h-0 overflow-y-auto overscroll-contain">
          
          {/* Status Badge */}
          <div className="text-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80">
            <div className="inline-flex items-center space-x-1.5 text-emerald-800 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Payment Captured & Disbursed</span>
            </div>
            <p className="text-[11px] text-slate-500">Verified Double-Entry Escrow Ledger Transfer</p>
          </div>

          {/* Parties metadata */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Billed To (Employer)</span>
              <p className="font-bold text-[#101014] mt-0.5">{employerName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Contractor (Student)</span>
              <p className="font-bold text-[#101014] mt-0.5">{studentName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Date of Settlement</span>
              <p className="text-slate-700 mt-0.5 font-medium">{paidAt}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Engagement Title</span>
              <p className="text-slate-700 mt-0.5 truncate font-medium">{contractTitle}</p>
            </div>
          </div>

          {/* Itemized Financial Breakdown */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>Gross Milestone Deliverables Total</span>
              <span className="font-mono font-medium text-[#101014]">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Platform Processing Fee (Pilot Waiver)</span>
              <span className="font-mono text-emerald-700 font-medium">₹0</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>TDS / Applicable Deduction</span>
              <span className="font-mono">₹0</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-[#101014]">
              <span>Net Settled Amount</span>
              <span className="text-lg font-black text-emerald-700 font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Verification Seal footnote */}
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-center space-x-2 text-[11px] text-purple-900">
            <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
            <span>Cryptographically sealed under VeriGig Settlement Ledger Node.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => window.print()}
            className="text-xs font-semibold text-slate-600 hover:text-[#101014] flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="bg-[#101014] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-full text-xs transition-colors shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
