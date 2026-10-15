import React, { useState, useRef, useEffect } from 'react';
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
  AlertCircle,
  HelpCircle,
  X,
  Loader2
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { authApi, verificationApi } from '../api/endpoints';
import { isSupabaseConfigured, signInWithGoogle } from '../api/supabase';
import { toMarketplaceUser } from '../auth/user';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole, loginUser, isAuthInitializing, authError } = useMarketplace();
  
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
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Google OAuth guidance modal
  const [showGoogleGuide, setShowGoogleGuide] = useState(false);

  // Check if browser is currently returning from Google OAuth redirect
  const isReturningFromOAuth = 
    typeof window !== 'undefined' && (
      window.location.search.includes('code=') || 
      window.location.search.includes('provider=google') || 
      window.location.hash.includes('access_token=')
    );

  // When user is authenticated (either from Google OAuth or manual login), immediately forward to role dashboard
  useEffect(() => {
    if (currentRole === 'student') {
      navigate('/app/student/dashboard', { replace: true });
    } else if (currentRole === 'employer') {
      navigate('/app/employer/dashboard', { replace: true });
    } else if (currentRole === 'admin') {
      navigate('/app/admin/verifications', { replace: true });
    }
  }, [currentRole, navigate]);

  // Handle Real Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // 1. Send authentication request to live Fastify backend
      const res: any = await authApi.login({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });

      if (res && res.user) {
        if (res.token) {
          try {
            localStorage.setItem('verigig_auth_token', res.token);
          } catch {
            // ignore
          }
        }
        const liveUser = toMarketplaceUser(res.user);

        loginUser(liveUser);

        if (liveUser.role === 'student') navigate('/app/student/dashboard');
        else if (liveUser.role === 'employer') navigate('/app/employer/dashboard');
        else if (liveUser.role === 'admin') navigate('/app/admin/verifications');
        else navigate('/');
      }
    } catch (err: any) {
      console.warn('Backend login response:', err);
      const message = err.details?.message || err.message || 'Login failed. Please check your credentials or create an account.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Real Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and confirm your password.');
      return;
    }

    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create User in PostgreSQL (Supabase) via Fastify Backend
      const regRes: any = await authApi.register({
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        role: registerRole,
        fullName: regName.trim(),
        dpdpaConsent: true,
      });

      if (regRes && regRes.token) {
        try {
          localStorage.setItem('verigig_auth_token', regRes.token);
        } catch {
          // ignore
        }
      }

      setRegSuccess(true);

      const liveUser = toMarketplaceUser(regRes.user);

      setTimeout(() => {
        loginUser(liveUser);
        if (registerRole === 'student') navigate('/app/student/dashboard');
        else navigate('/app/employer/dashboard');
      }, 1000);

    } catch (err: any) {
      console.error('Registration error:', err);
      const message = err.details?.message || err.message || 'Registration failed. The email may already be in use.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth Trigger
  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    if (isSupabaseConfigured) {
      try {
        setIsSubmitting(true);
        await signInWithGoogle(authMode === 'register' ? registerRole : 'student');
      } catch (err: any) {
        setErrorMessage(err.message || 'Google OAuth failed to initialize.');
        setIsSubmitting(false);
      }
    } else {
      setShowGoogleGuide(true);
    }
  };

  if (isReturningFromOAuth && isAuthInitializing) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-white border border-purple-100 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-black text-[#121214]">Authenticating with Google</h2>
          <p className="text-xs text-slate-500 font-medium">
            Verifying your identity and setting up your workspace...
          </p>
          <div className="pt-2 flex justify-center">
            <Loader2 className="w-7 h-7 text-purple-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

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
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-black rounded-full transition-all ${
                authMode === 'login' ? 'bg-[#121214] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
              }}
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
              onClick={handleGoogleAuth}
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
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2 text-left">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {authError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2 text-left">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
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
                    type="email"
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
                    placeholder="Enter password"
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
                  <span>{isSubmitting ? 'Authenticating with Database...' : 'Sign In'}</span>
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
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm'
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
                      ? 'bg-purple-50 border-purple-400 text-purple-950 shadow-sm'
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
                  Full Name <span className="text-red-500">*</span>
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
                  Email Address <span className="text-red-500">*</span>
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
                  Password (min 8 characters) <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214]"
                />
              </div>

              {regSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Account successfully created! Loading dashboard...</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account & Sign In</span>
                )}
              </button>

            </form>
          )}

        </div>

      </div>

      {/* Google OAuth Setup Guidance Modal */}
      {showGoogleGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-900 shadow-2xl border border-slate-200 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-purple-600" />
                <h3 className="font-extrabold text-base">Supabase Google Auth Setup</h3>
              </div>
              <button 
                onClick={() => setShowGoogleGuide(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              To trigger real Google login with account selection, your frontend needs your Supabase project keys:
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
              <div className="text-purple-700 font-bold">1. In Render (Frontend Environment):</div>
              <div>VITE_SUPABASE_URL = https://[your-project-ref].supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY = [your-anon-public-key]</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
              <div className="text-purple-700 font-bold">2. In Render (Backend Environment):</div>
              <div>SUPABASE_URL = https://[your-project-ref].supabase.co</div>
              <div>SUPABASE_SERVICE_ROLE_KEY = [server-only key]</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs space-y-1.5">
              <div className="text-purple-900 font-bold">3. In Supabase Dashboard:</div>
              <div className="text-slate-600">Go to <strong>Authentication</strong> → <strong>Providers</strong> → enable <strong>Google</strong> (paste Client ID & Secret from Google Cloud Console).</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
              <div className="text-amber-900 font-bold">4. Supabase URL Configuration (Prevents Blank localhost:3000):</div>
              <div className="text-slate-700">
                Go to <strong>Authentication</strong> → <strong>URL Configuration</strong>:
              </div>
              <div className="font-mono text-[11px] text-amber-950">
                • <strong>Site URL:</strong> {window.location.origin}
              </div>
              <div className="font-mono text-[11px] text-amber-950">
                • <strong>Redirect URLs:</strong> Add <span className="font-bold">{window.location.origin}/**</span> and <span className="font-bold">{window.location.origin}/auth</span>
              </div>
            </div>

            <button
              onClick={() => setShowGoogleGuide(false)}
              className="w-full py-2.5 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-bold transition-all"
            >
              Got it, continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
