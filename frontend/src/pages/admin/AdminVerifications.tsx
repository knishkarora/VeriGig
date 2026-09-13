import React, { useState } from 'react';
import { 
  Check, 
  X, 
  GraduationCap, 
  Building2, 
  FileText
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#121214]">Institutional Verification Desk</h1>
            <span className="text-xs font-black px-3 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
              Admin Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Review physical college ID cards and SME registration proofs to maintain platform trust.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex p-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'all' ? 'bg-[#121214] text-white shadow-sm' : 'text-slate-600 hover:text-black'
            }`}
          >
            All ({verifications.length})
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'student' ? 'bg-[#121214] text-white shadow-sm' : 'text-slate-600 hover:text-black'
            }`}
          >
            Student IDs
          </button>
          <button
            onClick={() => setActiveTab('sme')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'sme' ? 'bg-[#121214] text-white shadow-sm' : 'text-slate-600 hover:text-black'
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
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
            Verification Queue ({filteredRequests.length})
          </span>

          <div className="space-y-3">
            {filteredRequests.map((req) => {
              const isSelected = req.id === selectedRequest?.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-5 rounded-[2rem] border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-purple-400 shadow-md ring-2 ring-purple-200'
                      : 'bg-white/80 border-purple-100 hover:border-purple-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${
                        req.userType === 'student'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-900'
                      }`}>
                        {req.userType === 'student' ? <GraduationCap size={20} /> : <Building2 size={20} />}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#121214]">{req.userName}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{req.institutionOrBusiness}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-3 py-1 rounded-full capitalize ${
                      req.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : req.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-purple-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="font-mono text-slate-700">{req.idOrDocNumber}</span>
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
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-md space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                    Document Inspection
                  </span>
                  <h3 className="text-xl font-black text-[#121214]">{selectedRequest.userName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedRequest.institutionOrBusiness}</p>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black px-3.5 py-1 rounded-full capitalize ${
                    selectedRequest.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : selectedRequest.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              {/* ID / Registration credential details */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs space-y-2 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-600">Credential Reference:</span>
                  <span className="text-slate-900 font-mono font-bold">{selectedRequest.idOrDocNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Candidate Type:</span>
                  <span className="capitalize text-purple-900 font-bold">{selectedRequest.userType} Profile</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Submission Time:</span>
                  <span className="text-slate-900">{selectedRequest.submittedAt}</span>
                </div>
              </div>

              {/* Document Image Preview */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Uploaded Verification Proof
                </span>
                <div className="relative rounded-3xl overflow-hidden border border-purple-100 bg-slate-100 h-60 flex items-center justify-center group shadow-inner">
                  <img 
                    src={selectedRequest.docImageUrl} 
                    alt="Document Proof" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs text-white font-bold flex items-center gap-1.5">
                      <FileText size={15} /> Attached Document Scan • Verified Resolution
                    </span>
                  </div>
                </div>
              </div>

              {selectedRequest.rejectionReason && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold">
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
                      className="flex-1 py-3.5 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={15} className="text-[#D4F851]" />
                      <span>Approve & Issue Trust Badge</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <X size={15} />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center py-2 text-xs text-slate-400 font-bold">
                    Decision logged and recorded in audit trail.
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 border border-purple-100 rounded-[2.5rem] bg-white">
              Select a verification record from the left queue to inspect.
            </div>
          )}
        </div>

      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          
          <div className="relative w-full max-w-md bg-white border border-purple-100 rounded-[2.5rem] p-8 shadow-2xl space-y-4 text-left">
            <h3 className="text-lg font-black text-[#121214]">Specify Rejection Reason</h3>
            <p className="text-xs text-slate-500 font-medium">
              This message will be sent to the applicant with instructions to re-upload valid proof.
            </p>

            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
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
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason}
                className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-black shadow-sm"
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
