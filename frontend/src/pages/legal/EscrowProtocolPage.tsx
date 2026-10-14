import React from 'react';
import { Lock, ArrowLeft, Layers, ShieldCheck, CheckCircle2, AlertOctagon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EscrowProtocolPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Return to Marketplace</span>
      </Link>

      {/* Hero Header */}
      <div className="rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-xl p-8 sm:p-12 text-[#101014] space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-black uppercase tracking-wider">
          <Lock size={14} className="text-emerald-700" />
          <span>Milestone Commitment & Capital Protection</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#101014]">
          Escrow & Trust Protocol
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
          How the VeriGig milestone custody ledger guarantees that verified students get paid for approved work and SMEs receive authentic deliverables.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 border-t border-slate-100">
          <span>Escrow Rule Engine: 4-Stage State Machine</span>
          <span>•</span>
          <span>Zero Commission During Pilot</span>
          <span>•</span>
          <span>Triple-Settlement Dispute Arbitration</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-xl p-8 sm:p-12 text-[#101014] space-y-8 text-xs sm:text-sm leading-relaxed">
        
        {/* Step-by-step visual lifecycle */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-[#101014] flex items-center gap-2">
            <Layers size={18} className="text-emerald-600" />
            1. The 4-Stage Capital Custody Lifecycle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Stage 1</span>
              <h3 className="font-bold text-xs text-[#101014]">Pre-Funding Order</h3>
              <p className="text-[11px] text-slate-600 leading-normal">
                SME funds the full contract amount prior to work commencement. Capital is locked into safe custody.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Stage 2</span>
              <h3 className="font-bold text-xs text-[#101014]">Active Milestone</h3>
              <p className="text-[11px] text-slate-600 leading-normal">
                Student builds with confidence knowing 100% of the funds are verified and held in escrow.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Stage 3</span>
              <h3 className="font-bold text-xs text-[#101014]">Deliverable Sign-Off</h3>
              <p className="text-[11px] text-slate-600 leading-normal">
                Deliverable artifacts (URLs, repositories, files) are uploaded and inspected by the business.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Stage 4</span>
              <h3 className="font-bold text-xs text-[#101014]">Instant Payout</h3>
              <p className="text-[11px] text-slate-600 leading-normal">
                Approval immediately unlocks the milestone payout directly into the student freelancer's wallet.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-black text-[#101014] flex items-center gap-2">
            <ShieldCheck size={18} className="text-purple-600" />
            2. Pilot Zero-Fee Structure
          </h2>
          <p className="text-slate-600">
            Unlike legacy freelancing portals that deduct 10% to 20% platform commissions from student earnings, VeriGig charges <strong>0% platform commission</strong> to students during the regional Punjab pilot network. 100% of approved milestone funds reach the student freelancer.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-black text-[#101014] flex items-center gap-2">
            <AlertOctagon size={18} className="text-red-600" />
            3. Dispute Arbitration & Triple Settlement
          </h2>
          <p className="text-slate-600">
            If an impasse occurs during deliverable inspection, either party may escalate to the campus governance desk. An administrative arbitrator reviews the chronological evidence docket (scope agreement, upload timestamps, message logs) and settles the escrow via one of three binding outcomes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Release to Student (100%):</strong> When deliverable fully matches agreed scope specifications.</li>
            <li><strong>Full Refund to SME (100%):</strong> In cases of total student abandonment or unoriginal work.</li>
            <li><strong>Fair Split Settlement:</strong> Proportional release based on partial milestone completion.</li>
          </ul>
        </section>

      </div>
    </div>
  );
};
