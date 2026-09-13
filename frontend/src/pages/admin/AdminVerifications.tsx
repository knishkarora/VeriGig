import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  GraduationCap, 
  Building2, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { VerificationRequest } from '../../types';

export const AdminVerifications: React.FC = () => {
  const { verifications, approveVerification, rejectVerification } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'sme'>('all');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(
    verifications[0] || null
  );
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const filteredRequests = verifications.filter((v) => {
    if (activeTab === 'all') return true;
    return v.userType === activeTab;
  });

  const handleApprove = (id: string) => {
    approveVerification(id);
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status: 'approved' });
    }
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectReason) return;
    rejectVerification(selectedRequest.id, rejectReason);
    setSelectedRequest({ ...selectedRequest, status: 'rejected', rejectionReason: rejectReason });
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Institutional Verification Desk</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
              Admin Governance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review physical college ID cards and SME registration proofs to maintain platform trust.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors ${
              activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({verifications.length})
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors ${
              activeTab === 'student' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Student College IDs
          </button>
          <button
            onClick={() => setActiveTab('sme')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors ${
              activeTab === 'sme' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            SME Proofs
          </button>
        </div>
      </div>

      {/* Side-by-Side Queue Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Queue Table / List */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Pending & Processed Queue ({filteredRequests.length})
          </span>

          <div className="space-y-3">
            {filteredRequests.map((req) => {
              const isSelected = req.id === selectedRequest?.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-glow-indigo'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${
                        req.userType === 'student'
                          ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                          : 'bg-indigo-950/60 border-indigo-500/30 text-indigo-400'
                      }`}>
                        {req.userType === 'student' ? <GraduationCap size={18} /> : <Building2 size={18} />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{req.userName}</h4>
                        <p className="text-[11px] text-slate-400">{req.institutionOrBusiness}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      req.status === 'approved'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : req.status === 'rejected'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-500/30 animate-pulse'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono text-slate-400">{req.idOrDocNumber}</span>
                    <span>{req.submittedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Inspection & Document Preview Pane */}
        <div className="lg:col-span-6">
          {selectedRequest ? (
            <div className="p-6 rounded-3xl bg-[#111827]/90 backdrop-blur-xl border border-slate-800 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Document Inspection
                  </span>
                  <h3 className="text-base font-bold text-white">{selectedRequest.userName}</h3>
                  <p className="text-xs text-slate-400">{selectedRequest.institutionOrBusiness}</p>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                    selectedRequest.status === 'approved'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : selectedRequest.status === 'rejected'
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              {/* ID / Registration credential details */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Credential Reference:</span>
                  <span className="text-white font-mono font-semibold">{selectedRequest.idOrDocNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate Type:</span>
                  <span className="capitalize text-slate-200">{selectedRequest.userType} Profile</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Submission Time:</span>
                  <span className="text-slate-200">{selectedRequest.submittedAt}</span>
                </div>
              </div>

              {/* Document Image Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Uploaded Verification Proof
                </span>
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 flex items-center justify-center group">
                  <img 
                    src={selectedRequest.docImageUrl} 
                    alt="Document Proof" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-[11px] text-slate-200 font-medium flex items-center gap-1.5">
                      <FileText size={14} /> Attached Document Scan • Verified Resolution
                    </span>
                  </div>
                </div>
              </div>

              {selectedRequest.rejectionReason && (
                <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                  <strong>Rejection Reason:</strong> {selectedRequest.rejectionReason}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                {selectedRequest.status === 'pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={14} />
                      <span>Approve & Issue Trust Badge</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      className="px-5 py-3 rounded-full bg-slate-900 hover:bg-slate-850 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-2"
                    >
                      <X size={14} />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center py-2 text-xs text-slate-500">
                    Decision logged and recorded in audit trail.
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 border border-slate-800 rounded-3xl bg-slate-900/40">
              Select a verification record from the left queue to inspect.
            </div>
          )}
        </div>

      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          
          <div className="relative w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <h3 className="text-base font-bold text-white">Specify Rejection Reason</h3>
            <p className="text-xs text-slate-400">
              This message will be sent to the applicant with instructions to re-upload valid proof.
            </p>

            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select reason...</option>
              <option value="Blurry ID card photo, name/roll number unreadable">Blurry ID card photo, unreadable</option>
              <option value="Expired college session ID card">Expired college session ID card</option>
              <option value="Name on ID does not match registration handle">Name on ID does not match registration</option>
              <option value="Invalid GSTIN format or unregistered business entity">Invalid GSTIN format</option>
            </select>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Or write custom reason..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
