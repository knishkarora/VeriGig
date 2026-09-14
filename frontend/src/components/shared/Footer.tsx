import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Globe, Send } from 'lucide-react';

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
    <footer className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      
      {/* Signature Bubblegum Pink Editorial Canvas */}
      <div className="rounded-[2.5rem] bg-[#FFA8D5] text-[#180816] p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-pink-400/40">
        
        {/* Subtle organic purple loop doodle in background */}
        <svg 
          className="absolute right-0 bottom-0 w-[500px] h-[400px] opacity-15 pointer-events-none" 
          viewBox="0 0 500 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M 100 350 C 250 100, 450 300, 480 50 C 510 -150, 200 50, 350 380" 
            stroke="#4A1538" 
            strokeWidth="28" 
            strokeLinecap="round" 
          />
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
          
          {/* Left Column: Bold statement & Brand Logo */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-3xl sm:text-4xl font-black text-[#180816] leading-[1.1] tracking-tight">
              Campus talent that grows local enterprise.
            </h3>
            
            <div className="space-y-1 text-xs text-[#4A1538] font-medium">
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-[#380E29]">Direct Contact</div>
              <div>contact@campusgigs.in</div>
              <div>+91 98765 43210 • Ludhiana, Punjab</div>
            </div>

            {/* Giant Typographic Brand */}
            <div className="pt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#180816] text-white flex items-center justify-center font-black text-xl tracking-tighter shadow-md">
                CG
              </div>
              <span className="text-4xl font-black tracking-tighter text-[#180816]">
                CampusGigs
              </span>
            </div>
          </div>

          {/* Middle Columns: Pill Navigations */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#380E29] mb-4">
                Navigation
              </div>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border border-[#180816]/20 bg-white/40 hover:bg-[#180816] hover:text-white transition-all">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/app/student/explore" className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border border-[#180816]/20 bg-white/40 hover:bg-[#180816] hover:text-white transition-all">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link to="/app/employer/post-gig" className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border border-[#180816]/20 bg-white/40 hover:bg-[#180816] hover:text-white transition-all">
                    Post-a-Gig
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border border-[#180816]/20 bg-white/40 hover:bg-[#180816] hover:text-white transition-all">
                    Verification
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#380E29] mb-4">
                Legal
              </div>
              <ul className="space-y-2">
                <li>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border border-[#180816]/20 bg-white/40 hover:bg-[#180816] hover:text-white cursor-pointer transition-all">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border border-[#180816]/20 bg-white/40 hover:bg-[#180816] hover:text-white cursor-pointer transition-all">
                    Terms & Condition
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border border-[#180816]/20 bg-white/40 hover:bg-[#180816] hover:text-white cursor-pointer transition-all">
                    Escrow Protocol
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Floating White Newsletter Card */}
          <div className="lg:col-span-4">
            <div className="p-6 sm:p-7 rounded-[2rem] bg-white text-[#101014] shadow-xl border border-pink-200/80 space-y-4">
              <h4 className="text-xl font-extrabold tracking-tight">Weekly Drop</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stay updated with newly funded campus micro-gigs, student spotlights, and local SME briefs.
              </p>

              {subscribed ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700" />
                  <span>Welcome aboard! Weekly drops arrive every Friday.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@pcte.edu.in or sme@gmail.com"
                    className="w-full px-4 py-3 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#101014] transition-colors"
                  />
                  
                  {/* Signature Pill Submit Button with Pink Arrow Circle */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-between pl-5 pr-2 py-2 rounded-full bg-[#101014] hover:bg-slate-800 text-white font-bold text-xs transition-all group shadow-md"
                  >
                    <span>Subscribe to Drops</span>
                    <div className="w-8 h-8 rounded-full bg-[#FFA8D5] text-[#101014] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <ArrowUpRight size={15} />
                    </div>
                  </button>
                </form>
              )}

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Verified Escrow Protection</span>
                <span className="font-semibold text-slate-800">Zero Agency Cut</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-footer bottom row */}
        <div className="mt-12 pt-6 border-t border-[#180816]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-[#380E29]">
          <div>© 2026 CAMPUSGIGS. ALL RIGHTS RESERVED.</div>
          <div>POWERED BY <strong className="text-[#180816] font-extrabold">LOCAL CAMPUS NETWORK</strong></div>
        </div>

      </div>

    </footer>
  );
};
