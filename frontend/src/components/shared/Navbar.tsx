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
  MessageSquare,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { NotificationDrawer } from './NotificationDrawer';
import { ChatModal } from '../messaging/ChatModal';

export const Navbar: React.FC = () => {
  const { currentRole, currentUser, logout, unreadNotifCount } = useMarketplace();
  const userInitials = currentUser.name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleSectionNav = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        navigate(`/#${sectionId}`, { replace: true });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
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
            <nav className="hidden lg:flex items-center gap-1 pl-2">
              {currentRole === 'guest' && (
                <>
                  <Link 
                    to="/" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/app/student/explore" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/student/explore') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Explore Gigs
                  </Link>
                  <a 
                    href="/#comparison" 
                    onClick={(e) => handleSectionNav(e, 'comparison')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#101014] hover:bg-slate-100 rounded-full transition-all"
                  >
                    Why Us
                  </a>
                  <a 
                    href="/#colleges" 
                    onClick={(e) => handleSectionNav(e, 'colleges')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#101014] hover:bg-slate-100 rounded-full transition-all"
                  >
                    Campus Network
                  </a>
                </>
              )}

              {currentRole === 'student' && (
                <>
                  <Link 
                    to="/app/student/dashboard" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/student/dashboard') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/app/student/explore" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/student/explore') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Explore Micro-Gigs
                  </Link>
                  <Link 
                    to="/app/student/workspace" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      location.pathname.includes('/workspace') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Active Workspace
                  </Link>
                  <Link 
                    to="/app/student/profile" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/student/profile') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}

              {currentRole === 'employer' && (
                <>
                  <Link 
                    to="/app/employer/dashboard" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/employer/dashboard') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/app/employer/post-gig" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/employer/post-gig') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Post-a-Gig
                  </Link>
                  <Link 
                    to="/app/employer/applicants" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      location.pathname.includes('/applicants') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Applicant Pipeline
                  </Link>
                  <Link 
                    to="/app/employer/workspace" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      location.pathname.includes('/workspace') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Workspace & Sign-Off
                  </Link>
                  <Link 
                    to="/app/employer/profile" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/employer/profile') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Business Profile
                  </Link>
                </>
              )}

              {currentRole === 'admin' && (
                <>
                  <Link 
                    to="/app/admin/verifications" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/admin/verifications') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Verification Queue
                  </Link>
                  <Link 
                    to="/app/admin/disputes" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/admin/disputes') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
                    }`}
                  >
                    Disputes Escalation
                  </Link>
                  <Link 
                    to="/app/admin/analytics" 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive('/app/admin/analytics') ? 'text-white bg-[#101014]' : 'text-slate-600 hover:text-[#101014] hover:bg-slate-100'
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
            
            {/* Authenticated User Account Menu */}
            {currentRole !== 'guest' && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-all shadow-sm"
                >
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover border border-slate-300" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-purple-100 border border-purple-200 text-[9px] font-black text-purple-800 flex items-center justify-center">{userInitials}</span>
                  )}
                  <span className="font-bold text-[#101014] max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded-full">
                    {currentRole}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-slate-200/80 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                      <div className="font-extrabold text-xs text-[#101014] truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">{currentUser.email}</div>
                      <div className="text-[10px] font-bold text-purple-700 mt-1 flex items-center gap-1">
                        <ShieldCheck size={12} />
                        <span>{currentUser.collegeOrCompany || 'Profile setup pending'}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {currentRole === 'student' && (
                        <Link
                          to="/app/student/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <UserIcon size={14} />
                          <span>View Student Profile</span>
                        </Link>
                      )}
                      {currentRole === 'employer' && (
                        <Link
                          to="/app/employer/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <UserIcon size={14} />
                          <span>Business Profile</span>
                        </Link>
                      )}
                      
                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notification Bell (Only when logged in) */}
            {currentRole !== 'guest' && (
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors border border-slate-200"
                aria-label="Notifications"
              >
                <Bell size={16} />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#101014] text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
            )}

            {/* In-App Messaging Button */}
            {currentRole !== 'guest' && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="relative p-2 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors border border-slate-200"
                aria-label="Messages"
                title="In-App Messaging"
              >
                <MessageSquare size={16} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D4F851] ring-2 ring-white"></span>
              </button>
            )}

            {/* Wallet pill if logged in */}
            {currentRole !== 'guest' && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold tabular-nums">
                <Wallet size={13} className="text-emerald-700" />
                <span>₹{currentUser.balance.toLocaleString()}</span>
              </div>
            )}

            {/* Primary Action Button - Acid Lime Accent Pill */}
            {currentRole === 'guest' ? (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#101014] text-xs font-black shadow-sm transition-all group btn-tactile"
              >
                <span>Login / Register</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ) : currentRole === 'student' ? (
              <Link
                to="/app/student/explore"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4F851] hover:bg-[#C5F82A] text-[#101014] text-xs font-black shadow-sm transition-all group btn-tactile"
              >
                <span>Find Gigs</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ) : currentRole === 'employer' ? (
              <Link
                to="/app/employer/post-gig"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm btn-tactile"
              >
                <PlusCircle size={14} className="text-[#D4F851]" />
                <span>Post Tasks</span>
              </Link>
            ) : (
              <Link
                to="/app/admin/verifications"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#101014] hover:bg-slate-800 text-white text-xs font-bold transition-all btn-tactile"
              >
                <span>Verify IDs</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</div>
            {currentRole === 'guest' && (
              <>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Home</Link>
                <Link to="/app/student/explore" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Explore Gigs</Link>
                <a 
                  href="/#comparison" 
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleSectionNav(e, 'comparison');
                  }} 
                  className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]"
                >
                  Why Us
                </a>
                <a 
                  href="/#colleges" 
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleSectionNav(e, 'colleges');
                  }} 
                  className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]"
                >
                  Campus Network
                </a>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-purple-700">Login / Register</Link>
              </>
            )}
            {currentRole === 'student' && (
              <>
                <Link to="/app/student/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Dashboard</Link>
                <Link to="/app/student/explore" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Explore Gigs</Link>
                <Link to="/app/student/workspace" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Workspace</Link>
                <Link to="/app/student/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Profile</Link>
              </>
            )}
            {currentRole === 'employer' && (
              <>
                <Link to="/app/employer/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Dashboard</Link>
                <Link to="/app/employer/post-gig" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Post a Gig</Link>
                <Link to="/app/employer/applicants" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Applicant Pipeline</Link>
                <Link to="/app/employer/workspace" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Workspace</Link>
                <Link to="/app/employer/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Business Profile</Link>
              </>
            )}
            {currentRole === 'admin' && (
              <>
                <Link to="/app/admin/verifications" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Verifications</Link>
                <Link to="/app/admin/disputes" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Disputes</Link>
                <Link to="/app/admin/analytics" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#101014]">Analytics</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Notification Drawer */}
      {currentRole !== 'guest' && (
        <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      )}

      {/* In-App Contextual Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        contextType="contract"
        contextId="c7b2a19e-5e3a-4a21-99bc"
        recipientId={currentRole === 'student' ? 'emp-apex-ludhiana' : 'stu-aarav-sharma'}
        recipientName={currentRole === 'student' ? 'Apex Technologies Punjab' : 'Aarav Sharma'}
        recipientRole={currentRole === 'student' ? 'employer' : 'student'}
        currentUserId={currentUser.id}
      />
    </>
  );
};
