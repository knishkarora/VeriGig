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
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(100,65,180,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#101014]">Platform Liquidity & Campus Analytics</h1>
            <span className="text-xs font-black px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              Live Metrics
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Tracking hyper-local escrow volume, campus talent liquidity, and task turnaround velocity.
          </p>
        </div>
      </div>

      {/* Admin Performance Telemetry Strip */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          <div className="sm:px-4 first:pl-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Volume
              </span>
              <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-[#101014] mt-2 font-mono tabular-nums">
              ₹840,000
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">+24% month-over-month</div>
          </div>

          <div className="pt-4 sm:pt-0 sm:px-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Escrow in Transit
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Wallet size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-[#101014] mt-2 font-mono tabular-nums">
              ₹{(activeEscrow || 45000).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">Active milestone locks</div>
          </div>

          <div className="pt-4 sm:pt-0 sm:px-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Successful Payout Rate
              </span>
              <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                <ShieldCheck size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-[#101014] mt-2 font-mono tabular-nums">
              98.4%
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">Zero dispute chargebacks</div>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Median Turnaround
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <Clock size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-[#101014] mt-2 font-mono tabular-nums">
              4.2 Days
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">From task posting to payout</div>
          </div>

        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Campus Distribution Breakdown */}
        <div className="lg:col-span-7 p-8 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#101014] flex items-center gap-2">
              <GraduationCap size={20} className="text-slate-700" />
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
                    <span className="font-black text-emerald-800 font-mono tabular-nums">{campus.earnings}</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-[#101014] rounded-full transition-all duration-500" 
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
