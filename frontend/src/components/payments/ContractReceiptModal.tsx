import React from 'react';
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
  if (!isOpen) return null;

  const platformFee = 0;
  const standardFee = Math.round(totalAmount * 0.05);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B101B] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0F172A]/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Settlement Receipt</h3>
              <p className="text-[11px] text-white/50">{receiptNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Status Badge */}
          <div className="text-center p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="inline-flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Payment Captured & Disbursed</span>
            </div>
            <p className="text-[11px] text-white/60">Verified Double-Entry Escrow Ledger Transfer</p>
          </div>

          {/* Parties metadata */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#1E293B]/50 border border-white/10">
            <div>
              <span className="text-[10px] text-white/40 uppercase font-semibold">Billed To (Employer)</span>
              <p className="font-bold text-white mt-0.5">{employerName}</p>
            </div>
            <div>
              <span className="text-[10px] text-white/40 uppercase font-semibold">Contractor (Student)</span>
              <p className="font-bold text-white mt-0.5">{studentName}</p>
            </div>
            <div>
              <span className="text-[10px] text-white/40 uppercase font-semibold">Date of Settlement</span>
              <p className="text-white/80 mt-0.5">{paidAt}</p>
            </div>
            <div>
              <span className="text-[10px] text-white/40 uppercase font-semibold">Engagement Title</span>
              <p className="text-white/80 mt-0.5 truncate">{contractTitle}</p>
            </div>
          </div>

          {/* Itemized Financial Breakdown */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            <div className="flex justify-between text-white/70">
              <span>Gross Milestone Deliverables Total</span>
              <span className="font-medium text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span className="flex items-center space-x-1">
                <span>Platform Commission (Standard 5%)</span>
                <span className="text-[9px] bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">Waiver</span>
              </span>
              <span>
                <span className="line-through text-white/40 mr-1.5">₹{standardFee}</span>
                ₹0
              </span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>GST on Platform Service Fee (18%)</span>
              <span>₹0</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between items-baseline font-bold text-sm text-white">
              <span>Net Disbursed Amount</span>
              <span className="text-lg font-black text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* DPDPA & Ledger verification footer */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-white/50 space-y-1">
            <p className="flex items-center space-x-1 text-white/70 font-semibold">
              <ShieldCheck className="w-3 h-3 text-[#D4F851]" />
              <span>Immutable Ledger Record #LE-{contractId.slice(0, 10)}</span>
            </p>
            <p>Generated in compliance with Indian Information Technology Act & DPDPA 2023.</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0F172A]/90 border-t border-white/10 flex justify-end">
          <button
            onClick={() => window.print()}
            className="bg-[#D4F851] text-[#121214] font-bold px-4 py-2 rounded-2xl hover:bg-[#C5F82A] transition-all text-xs flex items-center space-x-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print / Save Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};
