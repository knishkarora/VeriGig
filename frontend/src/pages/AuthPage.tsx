import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Lock, 
  Sparkles,
  FileCheck,
  ArrowUpRight
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="w-full max-w-xl space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-purple-100 border border-purple-200 text-xs font-black uppercase tracking-wider text-purple-900">
            <ShieldCheck size={14} className="text-purple-700" />
            <span>Campus Institutional Verification Portal</span>
          </div>
          <h2 className="text-4xl font-black text-[#121214] tracking-tight">
            {authMode === 'login' ? 'Sign in to CampusGigs' : 'Register with ID Verification'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Connecting verified students from PCTE, GNDEC, and Thapar with agile local businesses.
          </p>
        </div>

        {/* 1-Click Interactive Demo Logins */}
        <div className="p-5 rounded-[2rem] bg-white border border-purple-100 shadow-md text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles size={13} className="text-purple-600" /> 1-Click Fast Persona Switch
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Demo Mode</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-colors group"
            >
              <div className="font-extrabold text-xs text-[#121214] group-hover:text-purple-900">Admin Desk</div>
              <div className="text-[10px] text-purple-700 font-mono mt-0.5">admin / admin</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student')}
              className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-colors group"
            >
              <div className="font-extrabold text-xs text-[#121214] group-hover:text-emerald-900">Student (PCTE)</div>
              <div className="text-[10px] text-emerald-700 font-mono mt-0.5">aarav.sharma</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('employer')}
              className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-colors group"
            >
              <div className="font-extrabold text-xs text-[#121214] group-hover:text-amber-900">SME (Bakery)</div>
              <div className="text-[10px] text-amber-700 font-mono mt-0.5">simran@bakery</div>
            </button>
          </div>
        </div>

        {/* Auth Box Container */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-purple-100 shadow-xl space-y-6">
          
          {/* Tabs: Login vs Register */}
          <div className="flex p-1.5 rounded-full bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-black rounded-full transition-all ${
                authMode === 'login' ? 'bg-[#121214] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              Quick Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-black rounded-full transition-all ${
                authMode === 'register' ? 'bg-[#121214] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              Role Registration
            </button>
          </div>

          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Username / College Email
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter 'admin' or college email"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Default: <span className="font-mono text-purple-700 font-bold">admin</span> / <span className="font-mono text-purple-700 font-bold">admin</span></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-between pl-6 pr-2 py-2 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all group"
                >
                  <span>Sign In</span>
                  <div className="w-8 h-8 rounded-full bg-[#D4F851] text-[#121214] flex items-center justify-center font-bold">
                    <ArrowUpRight size={15} />
                  </div>
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
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    registerRole === 'student'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <GraduationCap size={20} className={registerRole === 'student' ? 'text-emerald-700' : 'text-slate-400'} />
                  <div>
                    <div className="text-xs font-black">Student Talent</div>
                    <div className="text-[10px] text-slate-500">College ID upload</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegisterRole('employer')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    registerRole === 'employer'
                      ? 'bg-purple-50 border-purple-400 text-purple-950'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Building2 size={20} className={registerRole === 'employer' ? 'text-purple-700' : 'text-slate-400'} />
                  <div>
                    <div className="text-xs font-black">Local SME</div>
                    <div className="text-[10px] text-slate-500">GST / Udyam proof</div>
                  </div>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  defaultValue={registerRole === 'student' ? 'Gurpreet Singh' : 'Harpreet Dhillon'}
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {registerRole === 'student' ? 'College / University' : 'Business / Firm Name'}
                </label>
                <input
                  type="text"
                  required
                  defaultValue={registerRole === 'student' ? 'PCTE Group of Institutes' : 'Punjab AgriTech Tools'}
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {registerRole === 'student' ? 'Student Roll Number' : 'GSTIN / Business Registration #'}
                </label>
                <input
                  type="text"
                  required
                  defaultValue={registerRole === 'student' ? '2203102' : '03AABCL1234F1Z8'}
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214]"
                />
              </div>

              {/* Document Upload Simulation */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {registerRole === 'student' ? 'Upload College ID Card (Photo/PDF)' : 'Upload GST Certificate / Business Proof'}
                </label>
                <div 
                  onClick={() => setUploadedFile(registerRole === 'student' ? 'pcte_id_card_2026.jpg' : 'gst_cert_punjab.pdf')}
                  className="p-5 border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-3xl bg-purple-50/50 text-center cursor-pointer transition-colors"
                >
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
                      <FileCheck size={18} className="text-emerald-600" />
                      <span>{uploadedFile} (Attached for Verification)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload size={20} className="mx-auto text-purple-600" />
                      <p className="text-xs text-slate-800 font-bold">Click to attach verification document</p>
                      <p className="text-[10px] text-slate-500">Supports JPG, PNG, PDF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {regSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Submitted! Directing you to your verified dashboard...</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all"
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
