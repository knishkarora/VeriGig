import React, { useState, useEffect, useCallback } from 'react';
import { 
  Check, 
  X, 
  GraduationCap, 
  Building2, 
  FileText,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  Calendar,
  MapPin,
  Mail,
  Award,
  Hash
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { VerificationRequest } from '../../types';
import { verificationApi } from '../../api/endpoints';

export const AdminVerifications: React.FC = () => {
  const { verifications: contextVerifications, approveVerification, rejectVerification } = useMarketplace();

  // Primary tab: 'student' vs 'sme' vs 'all'
  const [activeTab, setActiveTab] = useState<'student' | 'sme' | 'all'>('student');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Independent queues for strict separation
  const [studentQueue, setStudentQueue] = useState<VerificationRequest[]>([]);
  const [employerQueue, setEmployerQueue] = useState<VerificationRequest[]>([]);
  const [allQueue, setAllQueue] = useState<VerificationRequest[]>([]);
  
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  // Fetch queues differently based on the active tab
  const fetchQueueData = useCallback(async () => {
    setIsLoading(true);
    setFeedbackNotice(null);

    try {
      if (activeTab === 'student') {
        const res = await verificationApi.getAdminQueue({ role: 'student' });
        if (res && Array.isArray(res.requests)) {
          setStudentQueue(res.requests);
          if (res.requests.length > 0 && (!selectedRequest || selectedRequest.userType !== 'student')) {
            setSelectedRequest(res.requests[0]);
          }
        }
      } else if (activeTab === 'sme') {
        const res = await verificationApi.getAdminQueue({ role: 'employer' });
        if (res && Array.isArray(res.requests)) {
          setEmployerQueue(res.requests);
          if (res.requests.length > 0 && (!selectedRequest || selectedRequest.userType !== 'sme')) {
            setSelectedRequest(res.requests[0]);
          }
        }
      } else {
        const res = await verificationApi.getAdminQueue();
        if (res && Array.isArray(res.requests)) {
          setAllQueue(res.requests);
          if (res.requests.length > 0 && !selectedRequest) {
            setSelectedRequest(res.requests[0]);
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch verification queue from database:', err);
      setFeedbackNotice({
        type: 'error',
        message: err?.message || 'Could not load verification queue from database. Please verify backend connection and admin token.'
      });
      setStudentQueue([]);
      setEmployerQueue([]);
      setAllQueue([]);
      setSelectedRequest(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchQueueData();
  }, [fetchQueueData]);

  // Determine current active list
  const currentList = activeTab === 'student' 
    ? studentQueue 
    : activeTab === 'sme' 
    ? employerQueue 
    : allQueue;

  // Filter by status and search query
  const filteredRequests = currentList.filter((req) => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesSearch = 
      req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.institutionOrBusiness.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.idOrDocNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.userEmail && req.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Keep selected request in sync with active list
  useEffect(() => {
    if (filteredRequests.length > 0) {
      const stillExists = filteredRequests.find(r => r.id === selectedRequest?.id);
      if (!stillExists) {
        setSelectedRequest(filteredRequests[0]);
      }
    } else {
      setSelectedRequest(null);
    }
  }, [activeTab, statusFilter, searchQuery]);

  // Handle Approve
  const handleApprove = async (id: string) => {
    setActionLoading(true);
    setFeedbackNotice(null);

    try {
      await verificationApi.reviewRequest(id, { decision: 'approve' });
      
      // Update local state in queues
      const updater = (list: VerificationRequest[]) => 
        list.map(v => v.id === id ? { ...v, status: 'approved' as const } : v);
      
      setStudentQueue(updater);
      setEmployerQueue(updater);
      setAllQueue(updater);

      if (selectedRequest?.id === id) {
        setSelectedRequest(prev => prev ? { ...prev, status: 'approved' } : null);
      }

      // Also sync to global Marketplace Context
      approveVerification(id);

      setFeedbackNotice({
        type: 'success',
        message: `Verification approved! Trust badge issued to ${selectedRequest?.userName || 'candidate'}.`
      });
    } catch (err: any) {
      console.error('API review error:', err);
      setFeedbackNotice({
        type: 'error',
        message: err?.message || 'Failed to approve verification request. Please check permissions.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject
  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) return;
    const id = selectedRequest.id;
    const reason = rejectReason.trim();
    setActionLoading(true);
    setFeedbackNotice(null);

    try {
      await verificationApi.reviewRequest(id, { decision: 'reject', rejectionReason: reason });
      
      const updater = (list: VerificationRequest[]) => 
        list.map(v => v.id === id ? { ...v, status: 'rejected' as const, rejectionReason: reason } : v);
      
      setStudentQueue(updater);
      setEmployerQueue(updater);
      setAllQueue(updater);

      setSelectedRequest(prev => prev ? { ...prev, status: 'rejected', rejectionReason: reason } : null);
      rejectVerification(id, reason);

      setShowRejectModal(false);
      setRejectReason('');

      setFeedbackNotice({
        type: 'error',
        message: `Verification rejected for ${selectedRequest.userName}. Rejection reason logged.`
      });
    } catch (err: any) {
      console.error('API rejection error:', err);
      setFeedbackNotice({
        type: 'error',
        message: err?.message || 'Failed to reject verification request.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Counts for pills
  const pendingStudentCount = studentQueue.filter(s => s.status === 'pending').length;
  const pendingEmployerCount = employerQueue.filter(e => e.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 text-purple-800 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#121214]">Institutional Verification Desk</h1>
                <span className="text-xs font-black px-3 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                  Campus Governance
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Authenticate campus enrollment IDs and MSME business registration credentials to grant platform trust badges.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Tab Switcher: Strict Separation */}
        <div className="flex p-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-black shrink-0">
          <button
            onClick={() => setActiveTab('student')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeTab === 'student' ? 'bg-[#121214] text-white shadow-sm' : 'text-slate-600 hover:text-black'
            }`}
          >
            <GraduationCap size={15} className={activeTab === 'student' ? 'text-[#D4F851]' : 'text-emerald-600'} />
            <span>Student IDs</span>
            {pendingStudentCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'student' ? 'bg-[#D4F851] text-[#121214]' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {pendingStudentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sme')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeTab === 'sme' ? 'bg-[#121214] text-white shadow-sm' : 'text-slate-600 hover:text-black'
            }`}
          >
            <Building2 size={15} className={activeTab === 'sme' ? 'text-purple-300' : 'text-purple-600'} />
            <span>SME & Employers</span>
            {pendingEmployerCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'sme' ? 'bg-purple-200 text-purple-900' : 'bg-purple-100 text-purple-800'
              }`}>
                {pendingEmployerCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'all' ? 'bg-[#121214] text-white shadow-sm' : 'text-slate-600 hover:text-black'
            }`}
          >
            All ({studentQueue.length + employerQueue.length})
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackNotice && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in ${
          feedbackNotice.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackNotice.type === 'success' ? <Check size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-rose-600" />}
            <span>{feedbackNotice.message}</span>
          </div>
          <button onClick={() => setFeedbackNotice(null)} className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search & Status Filter Command Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-purple-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-4 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === 'student' ? 'students, colleges, roll numbers...' : 'businesses, GSTIN, contacts...'}`}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-50 border border-slate-200 text-xs">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize transition-all ${
                  statusFilter === st ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchQueueData()}
            disabled={isLoading}
            className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh Verification Data"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Governance Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Role-Isolated Verification Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              {activeTab === 'student' ? 'Student ID Submissions' : activeTab === 'sme' ? 'MSME Registration Proofs' : 'All Requests'} ({filteredRequests.length})
            </span>
            <span className="text-[11px] text-purple-700 font-bold">
              {activeTab === 'student' ? '🎓 Campus Enrolled' : activeTab === 'sme' ? '🏢 Local MSME' : 'Platform Directory'}
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 border border-purple-100 rounded-[2.5rem] bg-white space-y-3">
              <RefreshCw size={24} className="animate-spin text-purple-600 mx-auto" />
              <p className="text-xs font-medium">Fetching verification dossier queue from database...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border border-purple-100 rounded-[2.5rem] bg-white space-y-2">
              <ShieldCheck size={28} className="text-purple-300 mx-auto" />
              <h4 className="text-xs font-black text-slate-700">No records found</h4>
              <p className="text-[11px] text-slate-400">
                {searchQuery ? 'Try clearing your search query' : `No ${activeTab} profiles matching status: "${statusFilter}".`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => {
                const isSelected = req.id === selectedRequest?.id;
                const isStudent = req.userType === 'student';

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-5 rounded-[2rem] border cursor-pointer transition-all ${
                      isSelected
                        ? isStudent 
                          ? 'bg-white border-emerald-400 shadow-md ring-2 ring-emerald-200'
                          : 'bg-white border-purple-400 shadow-md ring-2 ring-purple-200'
                        : 'bg-white/90 border-purple-100 hover:border-purple-200 hover:bg-white shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${
                          isStudent
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-900'
                        }`}>
                          {isStudent ? <GraduationCap size={20} /> : <Building2 size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-[#121214]">{req.userName}</h4>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                              isStudent ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}>
                              {isStudent ? 'Student' : 'Employer'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                            {req.institutionOrBusiness}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black px-3 py-1 rounded-full capitalize shrink-0 ${
                        req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : req.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium">
                      <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[10px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        <Hash size={11} className="text-slate-400" />
                        <span className="truncate max-w-[170px]">{req.idOrDocNumber}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">{req.submittedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Verification Dossier & Action Pane */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-md space-y-6">
              
              {/* Dossier Header */}
              <div className="flex items-start justify-between pb-5 border-b border-purple-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                    selectedRequest.userType === 'student' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-900'
                  }`}>
                    {selectedRequest.userType === 'student' ? <GraduationCap size={28} /> : <Building2 size={28} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 flex items-center gap-1">
                      <ShieldCheck size={12} />
                      <span>{selectedRequest.userType === 'student' ? 'Student Academic Enrollment Proof' : 'MSME Business Entity Proof'}</span>
                    </span>
                    <h3 className="text-2xl font-black text-[#121214]">{selectedRequest.userName}</h3>
                    <p className="text-xs text-slate-500 font-medium">{selectedRequest.institutionOrBusiness}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-black px-4 py-1.5 rounded-full capitalize ${
                    selectedRequest.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : selectedRequest.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {selectedRequest.status === 'approved' ? '✓ Verified' : selectedRequest.status === 'rejected' ? '✗ Rejected' : '⏱ Needs Review'}
                  </span>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-black">Official Identifier</div>
                  <div className="font-mono font-bold text-slate-900 truncate">{selectedRequest.idOrDocNumber}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-black">Profile Email</div>
                  <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                    <Mail size={12} className="text-purple-600" />
                    <span>{selectedRequest.userEmail || `${selectedRequest.userName.toLowerCase().replace(/\s+/g, '.')}@network`}</span>
                  </div>
                </div>

                {selectedRequest.userType === 'student' ? (
                  <>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-black">Degree & Year</div>
                      <div className="font-semibold text-slate-900">
                        {selectedRequest.details?.degree || 'Undergraduate Degree'} • Class of {selectedRequest.details?.graduationYear || 2026}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-black">Partner Campus Hub</div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-500" />
                        <span>{selectedRequest.institutionOrBusiness}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-black">Industry / Sector</div>
                      <div className="font-semibold text-slate-900">
                        {selectedRequest.details?.businessType || 'MSME Enterprise'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-black">Registered Location</div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-500" />
                        <span>{selectedRequest.details?.city || 'Ludhiana'}, {selectedRequest.details?.state || 'Punjab'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Student Skills Pill Bar if Student */}
              {selectedRequest.userType === 'student' && Array.isArray(selectedRequest.details?.skills) && selectedRequest.details.skills.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Declared Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRequest.details.skills.map((sk: string) => (
                      <span key={sk} className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Image Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {selectedRequest.userType === 'student' ? 'College ID Card Scan' : 'GSTIN / Udyam MSME Certificate Proof'}
                  </span>
                  <button
                    onClick={() => setPreviewDocUrl(selectedRequest.docImageUrl)}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <Eye size={13} />
                    <span>Enlarge Proof</span>
                  </button>
                </div>

                <div 
                  onClick={() => setPreviewDocUrl(selectedRequest.docImageUrl)}
                  className="relative rounded-3xl overflow-hidden border border-purple-100 bg-slate-100 h-64 flex items-center justify-center group shadow-inner cursor-zoom-in"
                >
                  <img 
                    src={selectedRequest.docImageUrl} 
                    alt="Document Proof Scan" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = selectedRequest.userType === 'student'
                        ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
                        : 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-between p-5">
                    <span className="text-xs text-white font-bold flex items-center gap-1.5">
                      <FileText size={15} /> Verified Institutional Upload Resolution
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                      Click to expand
                    </span>
                  </div>
                </div>
              </div>

              {/* Rejection Notice if applicable */}
              {selectedRequest.rejectionReason && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold space-y-1">
                  <div className="text-[10px] uppercase font-black text-rose-800">Administrative Rejection Recorded:</div>
                  <div>{selectedRequest.rejectionReason}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                {selectedRequest.status === 'pending' ? (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleApprove(selectedRequest.id)}
                      className={`flex-1 py-3.5 rounded-full text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 ${
                        selectedRequest.userType === 'student'
                          ? 'bg-emerald-700 hover:bg-emerald-800'
                          : 'bg-[#121214] hover:bg-slate-800'
                      }`}
                    >
                      <Check size={16} className="text-[#D4F851]" />
                      <span>{selectedRequest.userType === 'student' ? 'Approve & Issue Verified Student Badge' : 'Approve & Issue Verified SME Partner Seal'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setShowRejectModal(true)}
                      className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <X size={15} />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className={selectedRequest.status === 'approved' ? 'text-emerald-600' : 'text-rose-600'} />
                      <span>Decision logged in platform immutable audit log.</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 underline"
                    >
                      Re-verify Record
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-16 text-center text-slate-400 border border-purple-100 rounded-[2.5rem] bg-white space-y-3">
              <ShieldCheck size={36} className="text-purple-300 mx-auto" />
              <h4 className="text-sm font-black text-slate-800">Select a Profile to Inspect</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose an unverified student or employer from the left queue to inspect their proof document, verify details, and issue their platform badge.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          
          <div className="relative w-full max-w-md bg-white border border-purple-100 rounded-[2.5rem] p-8 shadow-2xl space-y-4 text-left">
            <h3 className="text-lg font-black text-[#121214]">Specify Rejection Reason</h3>
            <p className="text-xs text-slate-500 font-medium">
              This notice will be sent to the {selectedRequest?.userType === 'student' ? 'student' : 'enterprise'} with guidance to submit valid documentation.
            </p>

            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
            >
              <option value="">Select standard reason preset...</option>
              {selectedRequest?.userType === 'student' ? (
                <>
                  <option value="Blurry ID card scan: Roll number or student name unreadable">Blurry ID card scan: Name/roll number unreadable</option>
                  <option value="Expired academic session: ID does not cover current academic calendar">Expired academic session</option>
                  <option value="Name on ID does not match registration account handle">Name on ID does not match registration</option>
                  <option value="Non-partner institution: Only enrolled students from regional partner campuses eligible">Non-partner campus credentials</option>
                </>
              ) : (
                <>
                  <option value="Invalid GSTIN or unregistered entity status on GST portal">Invalid GSTIN or unregistered entity status</option>
                  <option value="Udyam MSME registration certificate expired or unverified">Udyam MSME certificate unverified</option>
                  <option value="Company legal title does not correspond to uploaded certificate">Company title mismatch</option>
                  <option value="Physical address verification requires updated utility or lease proof">Incomplete physical address proof</option>
                </>
              )}
            </select>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Or write custom instructions for the applicant..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-black shadow-sm"
              >
                {actionLoading ? 'Recording...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Proof Lightbox / Zoom Modal */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-8">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setPreviewDocUrl(null)} />
          
          <div className="relative max-w-4xl w-full bg-[#121214] border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#D4F851]" />
                <span className="text-xs font-black">Official Verification Document Dossier</span>
              </div>
              <button
                onClick={() => setPreviewDocUrl(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black/50 max-h-[75vh] flex items-center justify-center">
              <img 
                src={previewDocUrl} 
                alt="Enlarged Document Preview"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span>Cryptographic Proof ID: {selectedRequest?.id}</span>
              <button
                onClick={() => setPreviewDocUrl(null)}
                className="px-4 py-1.5 rounded-full bg-[#D4F851] text-[#121214] font-black text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
