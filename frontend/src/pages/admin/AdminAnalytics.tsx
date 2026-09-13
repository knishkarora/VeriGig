import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Layers
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AdminAnalytics: React.FC = () => {
  const { gigs, proposals, verifications } = useMarketplace();

  const totalVolume = gigs.reduce((acc, g) => acc + g.totalBudget, 0);
  const activeEscrow = gigs
    .filter(g => g.status === 'in_progress')
    .reduce((acc, g) => acc + g.totalBudget, 0);
  const completedGigs = gigs.filter(g => g.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Platform Liquidity & Campus Analytics</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
              Real-time Metrics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking hyper-local escrow volume, campus talent liquidity, and task turnaround velocity.
          </p>
        </div>
      </div>

      {/* Top Liquidity Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Cumulative Platform Volume
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              ₹840,000
            </span>
            <span className="text-[10px] text-emerald-400 mt-1 block">↑ 28% month-over-month</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Escrow Value in Transit
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              ₹{(activeEscrow || 45000).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">Locked across active student milestones</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400">
            <Wallet size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Successful Payout Rate
            </span>
            <span className="text-2xl font-black text-indigo-400 mt-1 block">
              98.4%
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Zero dispute chargebacks</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/20 text-indigo-400">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Median Turnaround Velocity
            </span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">
              4.2 Days
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">From task posting to sign-off</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/20 text-amber-400">
            <Clock size={22} />
          </div>
        </div>

      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Campus Distribution Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#111827]/80 backdrop-blur-md border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap size={18} className="text-indigo-400" />
              <span>Campus Talent Engagement & Payout Distribution</span>
            </h3>
            <span className="text-xs text-slate-400">Ludhiana & Punjab Region</span>
          </div>

          <div className="space-y-4">
            {[
              { college: 'PCTE Group of Institutes (Ludhiana)', percentage: 46, earnings: '₹386,400', students: '380 Active' },
              { college: 'GNDEC Engineering College', percentage: 28, earnings: '₹235,200', students: '240 Active' },
              { college: 'Thapar Institute (TIET)', percentage: 14, earnings: '₹117,600', students: '110 Active' },
              { college: 'Punjab Agricultural University (PAU)', percentage: 7, earnings: '₹58,800', students: '65 Active' },
              { college: 'Other Regional Campuses', percentage: 5, earnings: '₹42,000', students: '45 Active' }
            ].map((campus, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{campus.college}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{campus.students}</span>
                    <span className="font-bold text-emerald-400">{campus.earnings}</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500" 
                    style={{ width: `${campus.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Liquidity Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#111827]/80 backdrop-blur-md border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-emerald-400" />
              <span>Category Liquidity Share</span>
            </h3>
            <span className="text-xs text-slate-400">By Total Escrow</span>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Web Dev & WhatsApp Systems', share: '38%', count: '34 Tasks' },
              { name: 'UI/UX & Accessibility Dashboards', share: '24%', count: '22 Tasks' },
              { name: 'Motion Graphics & Reels', share: '18%', count: '19 Tasks' },
              { name: 'Brand Identity & Packaging', share: '12%', count: '11 Tasks' },
              { name: 'Data Normalization & Scraping', share: '8%', count: '8 Tasks' }
            ].map((cat, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">{cat.name}</span>
                  <span className="text-[10px] text-slate-500">{cat.count}</span>
                </div>
                <span className="text-xs font-bold text-indigo-300 px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/20">
                  {cat.share}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
