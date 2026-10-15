import React from 'react';
import { Building2, CheckCircle2, Globe, MapPin, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';

export const EmployerProfile: React.FC = () => {
  const { currentUser, gigs } = useMarketplace();
  const ownGigs = gigs.filter((gig) => gig.employerId === currentUser.id);
  const initials = currentUser.name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'B';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="p-8 rounded-3xl bg-[#0F172A] border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4F851]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-3xl bg-[#1E293B] border-2 border-[#D4F851]/30 flex items-center justify-center text-[#D4F851] font-black text-2xl shadow-xl">{initials}</div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl sm:text-3xl font-extrabold text-white">{currentUser.collegeOrCompany || 'Business profile setup'}</h1>{currentUser.isVerified ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" />Verified business</span> : <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-200 font-medium">Verification pending</span>}</div>
              <p className="text-xs text-white/60">Account owner: {currentUser.name}</p>
              {currentUser.location && <span className="flex items-center gap-1 text-xs text-white/60"><MapPin className="w-3.5 h-3.5 text-[#D4F851]" />{currentUser.location}</span>}
            </div>
          </div>
          <Link to="/app/employer/post-gig" className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#D4F851] text-[#121214] font-bold px-5 py-3 rounded-2xl hover:bg-[#C5F82A] text-xs shadow-lg transition-all"><PlusCircle className="w-4 h-4" />Post a task</Link>
        </div>
        <p className="relative z-10 mt-6 text-sm text-white/80 max-w-4xl leading-relaxed border-t border-white/10 pt-5">{currentUser.bio || 'Add your business description in the profile editor when it becomes available. No business details have been assumed for this account.'}</p>
      </section>

      <section className="p-7 rounded-3xl bg-[#0F172A] border border-white/10 space-y-4">
        <div className="flex items-center justify-between"><div><h2 className="font-bold text-white text-lg flex items-center gap-2"><Building2 className="w-5 h-5 text-[#D4F851]" />Your listings</h2><p className="text-xs text-white/50 mt-1">Only tasks created by this account appear here.</p></div><span className="text-xs text-white/60">{ownGigs.length} listing{ownGigs.length === 1 ? '' : 's'}</span></div>
        {ownGigs.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{ownGigs.map((gig) => <Link key={gig.id} to={`/app/employer/gig/${gig.id}/applicants`} className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5"><p className="font-semibold text-white text-sm truncate">{gig.title}</p><div className="flex justify-between mt-2 text-xs"><span className="text-emerald-400 font-bold">₹{gig.totalBudget.toLocaleString('en-IN')}</span><span className="text-white/50">{gig.applicantsCount} applicants</span></div></Link>)}</div> : <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"><Globe className="w-5 h-5 mx-auto text-white/40 mb-2" /><p className="text-xs text-white/60">You have not posted a task yet.</p></div>}
      </section>
    </div>
  );
};
