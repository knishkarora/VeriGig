import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Wallet, 
  CheckCircle2, 
  Smartphone,
  Lock,
  ArrowRight
} from 'lucide-react';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentDetails: { paymentId: string; method: string }) => void;
  amount: number;
  contractTitle: string;
  orderId?: string;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  contractTitle,
  orderId = `order_${Math.random().toString(36).substring(2, 9)}`,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('employer@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess({
          paymentId: `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          method: selectedMethod,
        });
      }, 1200);
    }, 1500);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Razorpay Standard Container (380px to 480px width) */}
      <div className="bg-white text-slate-900 w-full max-w-[480px] max-h-[92dvh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp">
        
        {/* Razorpay Top Navy Blue Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-start justify-between relative shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-blue-400">Razorpay</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                Test Mode
              </span>
            </div>
            <h3 className="font-extrabold text-base tracking-tight">VeriGig Escrow Services</h3>
            <p className="text-xs text-slate-300 line-clamp-1">{contractTitle}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Amount</span>
            <div className="text-xl font-black text-[#D4F851] tabular-nums">
              ₹{amount.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Razorpay Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4 flex-1 overflow-y-auto overscroll-contain">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900">Payment Successful</h4>
              <p className="text-xs text-slate-500 font-mono">Order ID: {orderId}</p>
              <p className="text-xs text-emerald-700 font-semibold mt-2">
                ₹{amount.toLocaleString('en-IN')} committed to VeriGig milestone custody.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row min-h-[320px] flex-1 min-h-0 overflow-y-auto overscroll-contain">
            {/* Left Method Switcher Sidebar */}
            <div className="w-full sm:w-44 bg-slate-50 border-r border-slate-200 p-2 space-y-1 shrink-0">
              <div className="px-3 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Payment Options
              </div>
              <button
                onClick={() => setSelectedMethod('upi')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedMethod === 'upi' ? 'bg-[#0c2340] text-white shadow' : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Smartphone size={16} className={selectedMethod === 'upi' ? 'text-[#D4F851]' : 'text-slate-500'} />
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() => setSelectedMethod('card')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedMethod === 'card' ? 'bg-[#0c2340] text-white shadow' : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <CreditCard size={16} className={selectedMethod === 'card' ? 'text-[#D4F851]' : 'text-slate-500'} />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setSelectedMethod('netbanking')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedMethod === 'netbanking' ? 'bg-[#0c2340] text-white shadow' : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Building2 size={16} className={selectedMethod === 'netbanking' ? 'text-[#D4F851]' : 'text-slate-500'} />
                <span>Netbanking</span>
              </button>
            </div>

            {/* Right Pane Payment Method Details */}
            <div className="flex-1 p-5 space-y-4 flex flex-col justify-between">
              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl mx-auto shadow-sm border border-slate-200 flex items-center justify-center">
                      <QrCode size={72} className="text-[#0c2340]" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-700">Scan QR with any UPI App</div>
                    <div className="flex justify-center gap-2 text-[10px] text-slate-500 font-semibold">
                      <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Or Pay via UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600">CVV</label>
                      <input
                        type="password"
                        defaultValue="•••"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-medium"
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Lock size={12} />
                    <span>Card details are tokenized securely with 256-bit encryption</span>
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700">Popular Banks</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'SBI Bank', 'Axis Bank'].map((b, i) => (
                      <button
                        key={i}
                        type="button"
                        className="p-2.5 rounded-xl border border-slate-200 text-left text-xs font-semibold hover:border-blue-600 hover:bg-blue-50/50 transition-colors"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-[#0c2340] hover:bg-[#13325b] text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Processing with Razorpay...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{amount.toLocaleString('en-IN')}</span>
                    <ArrowRight size={14} className="text-[#D4F851]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Razorpay Footer Branding */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 font-semibold shrink-0">
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>PCI-DSS Certified 256-bit Encryption</span>
          </div>
          <div className="font-bold text-slate-700">
            Powered by <span className="text-[#0c2340]">Razorpay</span>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
