import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  Key, 
  User, 
  Lock, 
  Mail,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useMarketplace();
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [registerRole, setRegisterRole] = useState<'student' | 'employer'>('student');
  
  // Login form fields
  const [loginEmail, setLoginEmail] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin');
  const [loginRole, setLoginRole] = useState<UserRole>('admin');

  // Register form fields
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-configured mock check
    if (loginEmail.toLowerCase() === 'admin' && loginPassword === 'admin') {
      switchRole('admin');
      navigate('/app/admin/verifications');
    } else if (loginEmail.includes('pcte') || loginRole === 'student') {
      switchRole('student');
      navigate('/app/student/dashboard');
    } else {
      switchRole('employer');
      navigate('/app/employer/dashboard');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    if (role === 'admin') {
      setLoginEmail('admin');
      setLoginPassword('admin');
      setLoginRole('admin');
      switchRole('admin');
      navigate('/app/admin/verifications');
    } else if (role === 'student') {
      setLoginEmail('aarav.sharma@pcte.edu.in');
      setLoginPassword('student123');
      setLoginRole('student');
      switchRole('student');
      navigate('/app/student/dashboard');
    } else if (role === 'employer') {
      setLoginEmail('simran@bakeology.in');
      setLoginPassword('employer123');
      setLoginRole('employer');
      switchRole('employer');
      navigate('/app/employer/dashboard');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess(true);
    setTimeout(() => {
      switchRole(registerRole);
      if (registerRole === 'student') {
        navigate('/app/student/dashboard');
      } else {
        navigate('/app/employer/dashboard');
      }
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-xl space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Campus Institutional Verification Portal</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {authMode === 'login' ? 'Sign in to CampusGigs' : 'Register with Verification'}
          </h2>
          <p className="text-xs text-slate-400">
            Empowering students from PCTE, GNDEC, and Thapar with milestone-backed SME gigs.
          </p>
        </div>

        {/* Quick Demo Credentials Bar (User requested quick demo access) */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <Sparkles size={12} /> 1-Click Interactive Demo Logins
            </span>
            <span className="text-[10px] text-slate-400">No backend required</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700 text-left text-xs transition-colors group"
            >
              <div className="font-bold text-white group-hover:text-purple-300">Admin Desk</div>
              <div className="text-[10px] text-slate-400">admin / admin</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student')}
              className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700 text-left text-xs transition-colors group"
            >
              <div className="font-bold text-white group-hover:text-emerald-300">Student (PCTE)</div>
              <div className="text-[10px] text-slate-400">aarav.sharma@pcte</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('employer')}
              className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700 text-left text-xs transition-colors group"
            >
              <div className="font-bold text-white group-hover:text-indigo-300">SME (Bakery)</div>
              <div className="text-[10px] text-slate-400">simran@bakeology</div>
            </button>
          </div>
        </div>

        {/* Auth Box Container */}
        <div className="p-8 rounded-3xl bg-[#111827]/90 backdrop-blur-xl border border-slate-800 shadow-2xl">
          
          {/* Tabs: Login vs Register */}
          <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Quick Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Role Registration
            </button>
          </div>

          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username / Email ID
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter 'admin' or college email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Hint: Use <span className="text-indigo-400 font-mono">admin</span> for admin access</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter 'admin' or password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow-indigo transition-all"
                >
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
              
              {/* Role selector pill */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => setRegisterRole('student')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    registerRole === 'student'
                      ? 'bg-emerald-950/30 border-emerald-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <GraduationCap size={20} className={registerRole === 'student' ? 'text-emerald-400' : 'text-slate-400'} />
                  <div>
                    <div className="text-xs font-bold">Student Talent</div>
                    <div className="text-[10px] text-slate-400">College ID upload</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegisterRole('employer')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    registerRole === 'employer'
                      ? 'bg-indigo-950/30 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building2 size={20} className={registerRole === 'employer' ? 'text-indigo-400' : 'text-slate-400'} />
                  <div>
                    <div className="text-xs font-bold">Local SME</div>
                    <div className="text-[10px] text-slate-400">GST / Udyam proof</div>
                  </div>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  defaultValue={registerRole === 'student' ? 'Gurpreet Singh' : 'Harpreet Dhillon'}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {registerRole === 'student' ? 'College / University' : 'Business / Firm Name'}
                </label>
                <input
                  type="text"
                  required
                  defaultValue={registerRole === 'student' ? 'PCTE Group of Institutes' : 'Punjab AgriTech Tools'}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {registerRole === 'student' ? 'Student Roll Number' : 'GSTIN / Business Registration #'}
                </label>
                <input
                  type="text"
                  required
                  defaultValue={registerRole === 'student' ? '2203102' : '03AABCL1234F1Z8'}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Document Upload Simulation */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {registerRole === 'student' ? 'Upload College ID Card (Photo/PDF)' : 'Upload GST Certificate / Business Proof'}
                </label>
                <div 
                  onClick={() => setUploadedFile(registerRole === 'student' ? 'pcte_id_card_2026.jpg' : 'gst_cert_punjab.pdf')}
                  className="p-4 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl bg-slate-900/60 text-center cursor-pointer transition-colors"
                >
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-medium">
                      <FileCheck size={18} />
                      <span>{uploadedFile} (Attached for Verification)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload size={18} className="mx-auto text-slate-400" />
                      <p className="text-xs text-slate-300 font-medium">Click to attach verification document</p>
                      <p className="text-[10px] text-slate-500">Supports JPG, PNG, PDF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {regSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Submitted! Directing you to your verified dashboard...</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald transition-all"
              >
                Complete Registration & Submit for Verification
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
