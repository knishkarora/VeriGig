import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Globe, MessageCircle, Send, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#0B0F1A] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main curved showcase block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left brand column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
                CG
              </div>
              <span className="text-2xl font-black text-white tracking-tight">CampusGigs</span>
            </div>
            <h3 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
              Hyper-local talent that grows local enterprise.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Connecting colleges like PCTE, GNDEC, and Thapar with agile local businesses for milestone-backed micro-gigs. Zero agency bloat.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Direct Contact: <a href="mailto:support@campusgigs.in" className="text-indigo-400 hover:underline">support@campusgigs.in</a> • Ludhiana, Punjab
            </div>
          </div>

          {/* Center Links Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                Navigation
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/" className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:text-white transition-all">
                    (Home)
                  </Link>
                </li>
                <li>
                  <Link to="/app/student/explore" className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:text-white transition-all">
                    (Micro-Gigs ↗)
                  </Link>
                </li>
                <li>
                  <Link to="/app/employer/post-gig" className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:text-white transition-all">
                    (Post a Task)
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:text-white transition-all">
                    (ID Verification)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                Trust & Legal
              </div>
              <ul className="space-y-2.5">
                <li>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/40 text-slate-400 cursor-pointer hover:text-slate-200">
                    (Escrow Guarantee)
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/40 text-slate-400 cursor-pointer hover:text-slate-200">
                    (Privacy Policy)
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/40 text-slate-400 cursor-pointer hover:text-slate-200">
                    (Terms of Task)
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/40 text-slate-400 cursor-pointer hover:text-slate-200">
                    (Dispute Protocol)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Floating Newsletter card (from design reference) */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-[#121927] border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
              
              <h4 className="text-lg font-bold text-white mb-1">Campus Dispatch</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Receive weekly curated micro-gigs posted by vetted local bakeries, tech agencies, and dental clinics.
              </p>

              {subscribed ? (
                <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>You're on the list! First drop arrives Friday.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your student or business email..."
                    className="w-full px-4 py-2.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full flex items-center justify-between px-5 py-2.5 rounded-full bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-colors group"
                  >
                    <span>Subscribe to Weekly Drops</span>
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={13} />
                    </div>
                  </button>
                </form>
              )}

              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/60">
                <span>Zero spam. Unsubscribe anytime.</span>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Escrow-safe</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-footer bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>© 2026 CampusGigs (VeriGig). All institutional rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Security Protocol</span>
            <span className="hover:text-slate-300 cursor-pointer">Campus Ambassadors</span>
            <span className="hover:text-slate-300 cursor-pointer">Status: 99.98% uptime</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
