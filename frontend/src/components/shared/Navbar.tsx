import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  PlusCircle, 
  ArrowUpRight,
  Wallet,
  Sparkles
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { UserRole } from '../../types';
import { NotificationDrawer } from './NotificationDrawer';

export const Navbar: React.FC = () => {
  const { currentRole, currentUser, switchRole, unreadNotifCount } = useMarketplace();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setIsRoleMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    if (role === 'student') navigate('/app/student/dashboard');
    else if (role === 'employer') navigate('/app/employer/dashboard');
    else if (role === 'admin') navigate('/app/admin/verifications');
    else navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-4 z-40 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="h-16 px-5 rounded-full bg-white/90 backdrop-blur-xl border border-[#EDE8FD] shadow-[0_10px_35px_-10px_rgba(147,112,219,0.12)] flex items-center justify-between gap-4 transition-all">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-black text-xl tracking-tighter text-[#121214] uppercase">
                CampusGigs
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#121214] bg-[#D4F851] px-2 py-0.5 rounded-full">
                VeriGig
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 pl-2">
              {currentRole === 'guest' && (
                <>
                  <Link 
                    to="/" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214] hover:bg-purple-50'
                    }`}
                  >
                    (Home)
                  </Link>
                  <Link 
                    to="/app/student/explore" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/student/explore') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214] hover:bg-purple-50'
                    }`}
                  >
                    (Explore Gigs ↗)
                  </Link>
                  <a 
                    href="#comparison" 
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#121214] hover:bg-purple-50 rounded-full transition-all"
                  >
                    (Why Us)
                  </a>
                  <a 
                    href="#colleges" 
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#121214] hover:bg-purple-50 rounded-full transition-all"
                  >
                    (Campus Network)
                  </a>
                </>
              )}

              {currentRole === 'student' && (
                <>
                  <Link 
                    to="/app/student/dashboard" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/student/dashboard') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/app/student/explore" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/student/explore') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Explore Micro-Gigs
                  </Link>
                  <Link 
                    to="/app/student/workspace/gig-1" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      location.pathname.includes('/workspace') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Active Workspace
                  </Link>
                  <Link 
                    to="/app/student/profile" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/student/profile') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Verified Profile
                  </Link>
                </>
              )}

              {currentRole === 'employer' && (
                <>
                  <Link 
                    to="/app/employer/dashboard" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/employer/dashboard') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/app/employer/post-gig" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/employer/post-gig') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Post-a-Gig Wizard
                  </Link>
                  <Link 
                    to="/app/employer/gig/gig-2/applicants" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      location.pathname.includes('/applicants') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Applicant Pipeline
                  </Link>
                  <Link 
                    to="/app/employer/workspace/gig-1" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      location.pathname.includes('/workspace') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Workspace & Sign-Off
                  </Link>
                </>
              )}

              {currentRole === 'admin' && (
                <>
                  <Link 
                    to="/app/admin/verifications" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/admin/verifications') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Verification Queue
                  </Link>
                  <Link 
                    to="/app/admin/disputes" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/admin/disputes') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Disputes Escalation
                  </Link>
                  <Link 
                    to="/app/admin/analytics" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/admin/analytics') ? 'text-white bg-[#121214]' : 'text-slate-600 hover:text-[#121214]'
                    }`}
                  >
                    Platform Analytics
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Instant Demo Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-500 font-normal">Demo Role:</span>
                <span className="capitalize font-bold text-[#121214]">{currentRole}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-3xl bg-white border border-purple-100 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Live Persona
                  </div>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-2xl transition-colors ${
                      currentRole === 'student' ? 'bg-purple-100 text-purple-900 font-bold' : 'text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <span>Student Freelancer</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">PCTE</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange('employer')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-2xl transition-colors ${
                      currentRole === 'employer' ? 'bg-purple-100 text-purple-900 font-bold' : 'text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <span>SME Employer</span>
                    <span className="text-[10px] text-purple-600 font-semibold">Bakery</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-2xl transition-colors ${
                      currentRole === 'admin' ? 'bg-purple-100 text-purple-900 font-bold' : 'text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <span>Admin Governance</span>
                    <span className="text-[10px] text-amber-600 font-semibold">Desk</span>
                  </button>
                  <div className="border-t border-purple-100 my-1"></div>
                  <button
                    onClick={() => handleRoleChange('guest')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-2xl transition-colors ${
                      currentRole === 'guest' ? 'bg-purple-100 text-purple-900 font-bold' : 'text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <span>Guest Landing View</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-950 hover:bg-purple-50 transition-colors border border-slate-200"
            >
              <Bell size={16} />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#121214] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Wallet pill if logged in */}
            {currentRole !== 'guest' && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-emerald-200 text-xs text-emerald-800 font-bold">
                <Wallet size={13} className="text-emerald-600" />
                <span>₹{currentUser.balance.toLocaleString()}</span>
              </div>
            )}

            {/* Primary Action Button - Acid Lime Accent Pill (from Sense reference) */}
            {currentRole === 'guest' ? (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#121214] text-xs font-black shadow-sm transition-all group"
              >
                <span>Login / Register</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ) : currentRole === 'student' ? (
              <Link
                to="/app/student/explore"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#121214] text-xs font-black shadow-sm transition-all group"
              >
                <span>Find Gigs</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ) : currentRole === 'employer' ? (
              <Link
                to="/app/employer/post-gig"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
              >
                <PlusCircle size={14} className="text-[#D4F851]" />
                <span>Post a Task</span>
              </Link>
            ) : (
              <Link
                to="/app/admin/verifications"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                <span>Verify IDs</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-purple-50"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 rounded-3xl bg-white border border-purple-100 shadow-xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</div>
            {currentRole === 'guest' && (
              <>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Home</Link>
                <Link to="/app/student/explore" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Explore Gigs</Link>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-purple-700">Login / Register</Link>
              </>
            )}
            {currentRole === 'student' && (
              <>
                <Link to="/app/student/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Dashboard</Link>
                <Link to="/app/student/explore" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Explore Gigs</Link>
                <Link to="/app/student/workspace/gig-1" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Workspace</Link>
                <Link to="/app/student/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Profile</Link>
              </>
            )}
            {currentRole === 'employer' && (
              <>
                <Link to="/app/employer/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Dashboard</Link>
                <Link to="/app/employer/post-gig" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Post a Gig</Link>
                <Link to="/app/employer/gig/gig-2/applicants" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Applicants</Link>
                <Link to="/app/employer/workspace/gig-1" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Workspace</Link>
              </>
            )}
            {currentRole === 'admin' && (
              <>
                <Link to="/app/admin/verifications" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Verifications</Link>
                <Link to="/app/admin/disputes" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Disputes</Link>
                <Link to="/app/admin/analytics" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800">Analytics</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
