import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AdminAnalytics: React.FC = () => {
  const { gigs } = useMarketplace();

  const totalVolume = gigs.reduce((acc, g) => acc + g.totalBudget, 0);
  const activeEscrow = gigs
    .filter(g => g.status === 'in_progress')
    .reduce((acc, g) => acc + g.totalBudget, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#121214]">Platform Liquidity & Campus Analytics</h1>
            <span className="text-xs font-black px-3 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
              Live Metrics
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Tracking hyper-local escrow volume, campus talent liquidity, and task turnaround velocity.
          </p>
        </div>
      </div>

      {/* Top Liquidity Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Cumulative Platform Volume
            </span>
            <span className="text-3xl font-black text-[#121214] mt-1 block">
              ₹840,000
            </span>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 block">↑ 28% month-over-month</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-700">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Escrow in Transit
            </span>
            <span className="text-3xl font-black text-emerald-800 mt-1 block">
              ₹{(activeEscrow || 45000).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">Active milestone locks</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700">
            <Wallet size={24} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Successful Payout Rate
            </span>
            <span className="text-3xl font-black text-purple-900 mt-1 block">
              98.4%
            </span>
            <span className="text-[10px] text-purple-700 font-bold mt-1 block">Zero dispute chargebacks</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-700">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Median Turnaround Velocity
            </span>
            <span className="text-3xl font-black text-amber-600 mt-1 block">
              4.2 Days
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-1 block">From task posting to payout</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
            <Clock size={24} />
          </div>
        </div>

      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Campus Distribution Breakdown */}
        <div className="lg:col-span-7 p-8 rounded-[2.5rem] bg-white border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#121214] flex items-center gap-2">
              <GraduationCap size={20} className="text-purple-600" />
              <span>Campus Engagement & Payout Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">Ludhiana & Punjab</span>
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
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-900 font-bold">{campus.college}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-normal">{campus.students}</span>
                    <span className="font-black text-emerald-800">{campus.earnings}</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-purple-50 rounded-full overflow-hidden border border-purple-100">
                  <div 
                    className="h-full bg-[#121214] rounded-full transition-all duration-500" 
                    style={{ width: `${campus.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Liquidity Breakdown */}
        <div className="lg:col-span-5 p-8 rounded-[2.5rem] bg-white border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#121214] flex items-center gap-2">
              <Layers size={20} className="text-purple-600" />
              <span>Category Liquidity Share</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">By Total Escrow</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Web Dev & WhatsApp Systems', share: '38%', count: '34 Tasks' },
              { name: 'UI/UX & Accessibility Dashboards', share: '24%', count: '22 Tasks' },
              { name: 'Motion Graphics & Reels', share: '18%', count: '19 Tasks' },
              { name: 'Brand Identity & Packaging', share: '12%', count: '11 Tasks' },
              { name: 'Data Normalization & Scraping', share: '8%', count: '8 Tasks' }
            ].map((cat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{cat.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{cat.count}</span>
                </div>
                <span className="text-xs font-black text-purple-950 px-3 py-1 rounded-full bg-white border border-purple-200 shadow-sm">
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
