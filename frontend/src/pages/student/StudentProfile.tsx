import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Code2, Edit3, GraduationCap, Mail, MapPin, Star, UserRound, FileText, Send } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';
import { EditProfileDrawer } from '../../components/student/EditProfileDrawer';
import { ProfileCompletionBar } from '../../components/student/ProfileCompletionBar';

export const StudentProfile: React.FC = () => {
  const { currentUser, loginUser, proposals, gigs } = useMarketplace();
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const myProposals = proposals.filter(p => p.studentId === currentUser.id);
  const skills = currentUser.skills || [];
  const portfolioItems = currentUser.portfolioLinks || [];
  const initials = currentUser.name.split(' ').filter(Boolean).map((name) => name[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Dynamic Profile Completion Linear Bar */}
      <ProfileCompletionBar 
        user={currentUser} 
        onOpenEdit={() => setIsEditDrawerOpen(true)} 
      />

      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-3xl object-cover border-2 border-slate-200 shadow-md" />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-purple-100 border-2 border-purple-200 text-purple-800 flex items-center justify-center text-2xl font-black shadow-md">{initials}</div>
          )}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black text-[#121214]">{currentUser.name}</h1>
              {currentUser.isVerified ? <TrustBadge type="student" text="Verified student" size="md" /> : <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">Verification pending</span>}
            </div>
            <p className="text-xs text-slate-600 font-bold flex items-center gap-2">
              <GraduationCap size={16} className="text-purple-700" />
              <span>
                {currentUser.collegeOrCompany || 'College not added yet'}
                {currentUser.degree ? ` • ${currentUser.degree}` : ''}
                {currentUser.graduationYear ? ` (Class of ${currentUser.graduationYear})` : ''}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
              {currentUser.rollNumber && (
                <span className="font-mono bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded-full font-bold">
                  Roll: {currentUser.rollNumber}
                </span>
              )}
              {currentUser.location && <span className="flex items-center gap-1"><MapPin size={13} /> {currentUser.location}</span>}
              <span className="flex items-center gap-1"><Mail size={13} /> {currentUser.email}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div className="flex items-center gap-4 sm:gap-6 px-5 py-4 rounded-3xl bg-slate-50 border border-slate-200">
            <div className="text-center px-1">
              <span className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                <Star size={18} className="fill-amber-400" /> {currentUser.rating ? currentUser.rating : '—'}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Rating</span>
            </div>
            <div className="h-9 w-px bg-slate-200" />
            <div className="text-center px-1">
              <span className="text-2xl font-black text-[#121214]">{currentUser.completedGigs || 0}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5 whitespace-nowrap">Completed Projects</span>
            </div>
          </div>
          <button onClick={() => setIsEditDrawerOpen(true)} className="w-full sm:w-auto px-5 py-4 rounded-3xl bg-[#121214] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"><Edit3 size={15} className="text-[#D4F851]" /><span>Edit Profile</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <section className="p-8 rounded-[2rem] bg-white border border-purple-100 shadow-sm space-y-3"><h2 className="text-lg font-black text-[#121214]">About</h2><p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{currentUser.bio || 'Add a short introduction so clients can understand your strengths and availability.'}</p></section>
          <section className="p-8 rounded-[2rem] bg-white border border-purple-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between"><h2 className="text-lg font-black text-[#121214]">Portfolio</h2><span className="text-xs text-slate-500 font-bold">{portfolioItems.length} item{portfolioItems.length === 1 ? '' : 's'}</span></div>
            {portfolioItems.length ? <div className="space-y-3">{portfolioItems.map((item) => <a key={`${item.label}-${item.url}`} href={item.url} target="_blank" rel="noreferrer" className="block p-4 rounded-2xl bg-purple-50/50 border border-purple-100 hover:border-purple-300"><span className="text-xs font-black text-[#121214]">{item.label}</span><span className="block text-[11px] text-purple-700 font-medium truncate mt-1">{item.url}</span></a>)}</div> : <p className="text-xs text-slate-500">No portfolio links have been added.</p>}
          </section>

          {/* Submitted Proposals Tracker */}
          <section className="p-8 rounded-[2rem] bg-white border border-purple-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#121214] flex items-center gap-2">
                <FileText size={18} className="text-purple-700" />
                <span>Submitted Proposals & Applications</span>
              </h2>
              <span className="text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full tabular-nums">
                {myProposals.length} Submitted
              </span>
            </div>

            {myProposals.length > 0 ? (
              <div className="space-y-3">
                {myProposals.map((prop) => {
                  const targetGig = gigs.find((g) => g.id === prop.gigId);
                  return (
                    <div
                      key={prop.id}
                      className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <Link
                          to={`/app/student/gig/${prop.gigId}`}
                          className="text-xs font-black text-slate-900 hover:text-purple-700 block transition-colors"
                        >
                          {targetGig?.title || 'Campus Micro-Gig'} ↗
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <span className="font-mono font-bold text-slate-900">Bid: ₹{prop.bidAmount.toLocaleString()}</span>
                          <span>•</span>
                          <span>Turnaround: {prop.deliveryTimeDays} days</span>
                          <span>•</span>
                          <span>{prop.submittedAt}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 italic mt-0.5">"{prop.coverNote}"</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                            prop.status === 'hired'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : prop.status === 'shortlisted'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center space-y-2">
                <p className="text-xs font-bold text-slate-800">No proposals submitted yet</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Explore open campus micro-gigs, submit your approach, and track your active proposals here.
                </p>
                <Link
                  to="/app/student/explore"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121214] text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-all mt-1"
                >
                  <span>Browse Gigs ↗</span>
                </Link>
              </div>
            )}
          </section>
        </div>
        <aside className="lg:col-span-4 space-y-6">
          <section className="p-8 rounded-[2rem] bg-white border border-purple-100 shadow-sm space-y-4"><h3 className="text-sm font-black text-[#121214] flex items-center gap-2"><Code2 size={16} className="text-purple-700" /><span>Skills</span></h3>{skills.length ? <div className="flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">{skill}</span>)}</div> : <p className="text-xs text-slate-500">No skills added yet.</p>}</section>
          <section className="p-8 rounded-[2rem] bg-purple-50/70 border border-purple-200 space-y-3"><div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center">{currentUser.isVerified ? <CheckCircle2 size={20} /> : <UserRound size={20} />}</div><h4 className="text-xs font-black text-[#121214]">Identity verification</h4><p className="text-xs text-slate-600 leading-relaxed font-medium">{currentUser.isVerified ? 'Your identity has been verified.' : 'Your submitted document is awaiting review. Complete your profile while verification is in progress.'}</p></section>
        </aside>
      </div>

      <EditProfileDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        initialData={{
          fullName: currentUser.name,
          bio: currentUser.bio,
          collegeName: currentUser.collegeOrCompany,
          rollNumber: currentUser.rollNumber,
          degree: currentUser.degree,
          graduationYear: currentUser.graduationYear,
          skills,
          portfolioLinks: portfolioItems,
          availabilityStatus: currentUser.availabilityStatus,
          isVerified: currentUser.isVerified,
        }}
        onProfileUpdated={(profile) =>
          loginUser({
            ...currentUser,
            name: profile.fullName || currentUser.name,
            collegeOrCompany: profile.collegeName || currentUser.collegeOrCompany,
            rollNumber: profile.rollNumber !== undefined ? profile.rollNumber : currentUser.rollNumber,
            bio: profile.bio || undefined,
            degree: profile.degree || undefined,
            graduationYear: profile.graduationYear || undefined,
            skills: profile.skills || [],
            availabilityStatus: profile.availabilityStatus,
            portfolioLinks: profile.portfolioLinks || portfolioItems,
          })
        }
      />
    </div>
  );
};
