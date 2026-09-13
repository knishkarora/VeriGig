import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  Briefcase, 
  Compass, 
  LayoutDashboard, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle, 
  BarChart3, 
  PlusCircle, 
  User as UserIcon,
  ArrowUpRight,
  Wallet
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { UserRole } from '../../types';
import { TrustBadge } from './TrustBadge';
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
    
    // Auto-navigate to the logical landing screen for that role
    if (role === 'student') navigate('/app/student/dashboard');
    else if (role === 'employer') navigate('/app/employer/dashboard');
    else if (role === 'admin') navigate('/app/admin/verifications');
    else navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[1.5px] shadow-glow-indigo transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                  <span className="font-black text-white text-base tracking-tighter">CG</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight group-hover:text-indigo-300 transition-colors">
                    CampusGigs
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                    VeriGig
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:block">Micro-gigs • Zero bloat</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {currentRole === 'guest' && (
                <>
                  <Link 
                    to="/" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive('/') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    (Home)
                  </Link>
                  <Link 
                    to="/app/student/explore" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive('/app/student/explore') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    (Explore Gigs ↗)
                  </Link>
                  <a 
                    href="#comparison" 
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                  >
                    (Why Us)
                  </a>
                  <a 
                    href="#colleges" 
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                  >
                    (Campus Network)
                  </a>
                </>
              )}

              {currentRole === 'student' && (
                <>
                  <Link 
                    to="/app/student/dashboard" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive('/app/student/dashboard') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/app/student/explore" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive('/app/student/explore') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Explore Micro-Gigs
                  </Link>
                  <Link 
                    to="/app/student/workspace/gig-1" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      location.pathname.includes('/workspace') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Active Workspace
                  </Link>
                  <Link 
                    to="/app/student/profile" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive('/app/student/profile') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
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
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive('/app/employer/dashboard') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/app/employer/post-gig" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive('/app/employer/post-gig') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Post-a-Gig Wizard
                  </Link>
                  <Link 
                    to="/app/employer/gig/gig-2/applicants" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      location.pathname.includes('/applicants') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Applicant Pipeline
                  </Link>
                  <Link 
                    to="/app/employer/workspace/gig-1" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      location.pathname.includes('/workspace') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Deliverables Sign-Off
                  </Link>
                </>
              )}

              {currentRole === 'admin' && (
                <>
                  <Link 
                    to="/app/admin/verifications" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive('/app/admin/verifications') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Verification Queue
                  </Link>
                  <Link 
                    to="/app/admin/disputes" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive('/app/admin/disputes') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Disputes Escalation
                  </Link>
                  <Link 
                    to="/app/admin/analytics" 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive('/app/admin/analytics') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Liquidity Analytics
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-indigo-500/40 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm transition-all"
                title="Switch demo role instantly"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-400 font-normal">Role:</span>
                <span className="capitalize text-indigo-300">{currentRole}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#111827] border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Interactive Role Switcher
                  </div>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                      currentRole === 'student' ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>Student Freelancer</span>
                    <span className="text-[10px] text-emerald-400">PCTE ID</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange('employer')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                      currentRole === 'employer' ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>SME Employer</span>
                    <span className="text-[10px] text-indigo-400">Bakeology</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                      currentRole === 'admin' ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>Admin Governance</span>
                    <span className="text-[10px] text-amber-400">Desk</span>
                  </button>
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    onClick={() => handleRoleChange('guest')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                      currentRole === 'guest' ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
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
              className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-800"
              title="Notifications"
            >
              <Bell size={17} />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#090D16]">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Wallet / Earnings preview if logged in */}
            {currentRole !== 'guest' && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <Wallet size={14} className="text-emerald-400" />
                <span className="font-semibold text-emerald-400">₹{currentUser.balance.toLocaleString()}</span>
              </div>
            )}

            {/* Primary Action Button based on role */}
            {currentRole === 'guest' ? (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-indigo transition-all group"
              >
                <span>Login / Register</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ) : currentRole === 'student' ? (
              <Link
                to="/app/student/explore"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-indigo transition-all"
              >
                <span>Find Gigs ↗</span>
              </Link>
            ) : currentRole === 'employer' ? (
              <Link
                to="/app/employer/post-gig"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-glow-emerald transition-all"
              >
                <PlusCircle size={14} />
                <span>Post a Task</span>
              </Link>
            ) : (
              <Link
                to="/app/admin/verifications"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
              >
                <span>Verify IDs</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#111827] px-4 py-4 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Navigation</div>
            {currentRole === 'guest' && (
              <>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Home</Link>
                <Link to="/app/student/explore" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Explore Gigs</Link>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-indigo-400 font-medium">Login / Register</Link>
              </>
            )}
            {currentRole === 'student' && (
              <>
                <Link to="/app/student/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Dashboard</Link>
                <Link to="/app/student/explore" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Explore Gigs</Link>
                <Link to="/app/student/workspace/gig-1" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Workspace</Link>
                <Link to="/app/student/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Profile</Link>
              </>
            )}
            {currentRole === 'employer' && (
              <>
                <Link to="/app/employer/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Dashboard</Link>
                <Link to="/app/employer/post-gig" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Post a Gig</Link>
                <Link to="/app/employer/gig/gig-2/applicants" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Applicants</Link>
                <Link to="/app/employer/workspace/gig-1" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Workspace</Link>
              </>
            )}
            {currentRole === 'admin' && (
              <>
                <Link to="/app/admin/verifications" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Verifications</Link>
                <Link to="/app/admin/disputes" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Disputes</Link>
                <Link to="/app/admin/analytics" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-200">Analytics</Link>
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
