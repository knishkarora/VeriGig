import React from 'react';
import { ShieldCheck, Lock, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-xs font-black uppercase tracking-wider">
          <ShieldCheck size={14} className="text-purple-700" />
          <span>DPDP Act (India) Compliance & Data Trust</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#101014]">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
          How VeriGig (CampusGigs) protects student college identification credentials, SME business documents, and contract communication across the regional network.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 border-t border-slate-100">
          <span>Effective Date: October 2026</span>
          <span>•</span>
          <span>Version 1.2 (Pilot Network)</span>
          <span>•</span>
          <span>Jurisdiction: Ludhiana & Punjab, India</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-xl p-8 sm:p-12 text-[#101014] space-y-8 text-xs sm:text-sm leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-black text-[#101014] flex items-center gap-2">
            <Lock size={18} className="text-purple-600" />
            1. Institutional Student Verification Data
          </h2>
          <p className="text-slate-600">
            To ensure trust between college freelancers and local enterprises, students submit institutional credentials (such as College ID cards from PCTE, GNDEC, Thapar, or PAU).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Zero Public Exposure:</strong> Physical student ID cards and roll numbers are strictly encrypted with AES-256 and stored in private cloud storage. They are never rendered publicly or shared with SME clients.</li>
            <li><strong>Admin Desk Only:</strong> Identity documents are accessible solely to authorized college verification administrators during the review process.</li>
            <li><strong>Verified Badges:</strong> SME clients only see the verified institutional badge (e.g., <em>"Verified PCTE Student"</em>) without access to private raw documents.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-black text-[#101014] flex items-center gap-2">
            <FileText size={18} className="text-purple-600" />
            2. Business & SME Documentation
          </h2>
          <p className="text-slate-600">
            SME employers provide business identification (such as GSTIN, Udyam registration, or local shop establishment records) to verify client legitimacy. These records are reviewed to protect students against phantom job postings, unpaid speculative tasks, or fraudulent solicitations.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-black text-[#101014] flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            3. In-App Messaging & Confidentiality
          </h2>
          <p className="text-slate-600">
            All discussions regarding gig deliverables, revisions, code snippets, and design files occur inside VeriGig's contextual messaging engine. Conversations are associated with contract identifiers to provide an indisputable audit trail in the event of an arbitration dispute.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-black text-[#101014]">
            4. User Rights & Data Deletion
          </h2>
          <p className="text-slate-600">
            Under India's Digital Personal Data Protection (DPDP) Act, users retain full authority over their account data. You may request complete deletion of your profile, submitted verification documents, and application records by contacting our privacy compliance desk at <strong className="text-[#101014]">privacy@campusgigs.in</strong>.
          </p>
        </section>

      </div>
    </div>
  );
};
