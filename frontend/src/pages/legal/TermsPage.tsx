import React from 'react';
import { FileCheck2, Scale, ArrowLeft, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-black uppercase tracking-wider">
          <Scale size={14} className="text-blue-700" />
          <span>Campus Marketplace Master Agreement</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#101014]">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
          The legal framework governing micro-gig scope agreements, intellectual property assignments, and student freelancer protections.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 border-t border-slate-100">
          <span>Effective Date: October 2026</span>
          <span>•</span>
          <span>Standard Contract Version 2.0</span>
          <span>•</span>
          <span>Governed by Indian Contract Act, 1872</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-xl p-8 sm:p-12 text-[#101014] space-y-8 text-xs sm:text-sm leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-black text-[#101014] flex items-center gap-2">
            <FileCheck2 size={18} className="text-blue-600" />
            1. The Two-Party Scope Agreement
          </h2>
          <p className="text-slate-600">
            Every engagement on VeriGig requires an explicit two-party scope confirmation before work begins. 
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Discrete Tasks Only:</strong> Tasks must range from 48 hours to 2 weeks maximum duration. Open-ended or unbounded corporate employment disguised as micro-gigs is strictly barred.</li>
            <li><strong>Deliverable Precision:</strong> Employers must define clear, measurable deliverables (e.g. <em>"Figma Prototype consisting of 5 mobile screens"</em> or <em>"Responsive Next.js Landing Page"</em>).</li>
            <li><strong>Mutual Acceptance:</strong> Work commences only when the student formally accepts the scope and confidentiality clause.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-black text-[#101014] flex items-center gap-2">
            <Award size={18} className="text-purple-600" />
            2. Intellectual Property (IP) Transfer
          </h2>
          <p className="text-slate-600">
            Upon final milestone approval and payout disbursement, all agreed intellectual property, source code, designs, and media assets transfer completely to the SME client.
          </p>
          <p className="text-slate-600">
            <strong>Portfolio Right:</strong> Students retain the irrevocable non-commercial right to showcase watermarked or demonstration versions of the completed deliverable in their verified VeriGig portfolio and academic resumes.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-black text-[#101014] flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-600" />
            3. Revision Boundaries & Scope Creep Protection
          </h2>
          <p className="text-slate-600">
            To protect student academics from endless revision cycles, each milestone contract includes a maximum of <strong>2 structured revision rounds</strong> within the original agreed scope. Any request exceeding the initial specification requires a formal budget expansion amendment agreed to by both parties.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-black text-[#101014]">
            4. Code of Conduct
          </h2>
          <p className="text-slate-600">
            Any attempt to solicit off-platform payments to circumvent escrow protection, submit plagiarism or unoriginal code without attribution, or engage in abusive communication results in permanent termination of platform privileges and notification to the partner college authority.
          </p>
        </section>

      </div>
    </div>
  );
};
