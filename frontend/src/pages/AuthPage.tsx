import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  User, 
  Lock, 
  FileCheck,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { UserRole, User as UserType } from '../types';
import { mockUsers } from '../data/mockData';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useMarketplace();
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [registerRole, setRegisterRole] = useState<'student' | 'employer'>('student');
  
  // Login form fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register form fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const emailLower = loginEmail.trim().toLowerCase();

      if (emailLower === 'admin' || emailLower === 'admin@campusgigs.in') {
        loginUser(mockUsers.admin);
        navigate('/app/admin/verifications');
      } else if (emailLower.includes('student') || emailLower.includes('pcte') || emailLower.includes('edu')) {
        const studentUser: UserType = {
          ...mockUsers.student,
          email: loginEmail,
        };
        loginUser(studentUser);
        navigate('/app/student/dashboard');
      } else if (emailLower.length > 0) {
        const employerUser: UserType = {
          ...mockUsers.employer,
          email: loginEmail,
        };
        loginUser(employerUser);
        navigate('/app/employer/dashboard');
      } else {
        setErrorMessage('Please enter a valid email address');
      }
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Supabase Google Auth simulation for student/employer
      const googleUser: UserType = {
        id: `user-google-${Date.now()}`,
        name: 'Aarav Sharma',
        email: 'aarav.sharma@pcte.edu.in',
        role: 'student',
        collegeOrCompany: 'PCTE Group of Institutes',
        isVerified: true,
        verificationBadgeText: 'Verified PCTE Student',
        rating: 4.9,
        completedGigs: 8,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        balance: 14500,
        gpa: '8.8 GPA',
        skills: ['React', 'TypeScript', 'Node.js', 'Figma'],
      };
      loginUser(googleUser);
      navigate('/app/student/dashboard');
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess(true);
    setTimeout(() => {
      const newUser: UserType = {
        id: `user-${Date.now()}`,
        name: regName || (registerRole === 'student' ? 'Gurpreet Singh' : 'Harpreet Dhillon'),
        email: regEmail || (registerRole === 'student' ? 'student@pcte.edu.in' : 'contact@enterprise.in'),
        role: registerRole,
        collegeOrCompany: regOrg || (registerRole === 'student' ? 'PCTE Group of Institutes' : 'Punjab Enterprises'),
        isVerified: false,
        rating: 5.0,
        completedGigs: 0,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
        balance: 0,
        skills: registerRole === 'student' ? ['UI/UX', 'React'] : undefined,
      };
      loginUser(newUser);
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
            Connecting verified students from PCTE, GNDEC, and Thapar with regional local businesses.
          </p>
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
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-black rounded-full transition-all ${
                authMode === 'register' ? 'bg-[#121214] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social Auth: Google / Supabase SSO */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-full border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2.5 shadow-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
                or with email
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@pcte.edu.in or contact@sme.com"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                  />
                </div>
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
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between pl-6 pr-2 py-2 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all group"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
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
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={registerRole === 'student' ? 'e.g. Gurpreet Singh' : 'e.g. Harpreet Dhillon'}
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder={registerRole === 'student' ? 'student@pcte.edu.in' : 'contact@business.in'}
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
                  value={regOrg}
                  onChange={(e) => setRegOrg(e.target.value)}
                  placeholder={registerRole === 'student' ? 'PCTE Group of Institutes' : 'Punjab AgriTech Tools'}
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
                  value={regIdentifier}
                  onChange={(e) => setRegIdentifier(e.target.value)}
                  placeholder={registerRole === 'student' ? '2203102' : '03AABCL1234F1Z8'}
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
