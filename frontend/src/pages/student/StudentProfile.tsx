import React from 'react';
import { 
  GraduationCap, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  ShieldCheck,
  Code2
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TrustBadge } from '../../components/shared/TrustBadge';

export const StudentProfile: React.FC = () => {
  const { currentUser } = useMarketplace();

  const portfolioItems = [
    {
      title: 'Modena Woodfired Pizza - Mobile Menu & Cart',
      category: 'Web Dev (Vite + Tailwind)',
      client: 'Modena Pizzeria (Ludhiana)',
      url: 'https://github.com/aaravsharma/modena-menu',
      rating: 5.0,
      review: 'Aarav delivered the complete web catalog in 3 days. Blazingly fast on 4G phone networks and our daily orders jumped 20%!'
    },
    {
      title: 'Gym Membership Barcode Check-in Screen',
      category: 'Frontend Prototype',
      client: 'Pulse Fitness Studio',
      url: 'https://github.com/aaravsharma/gym-checkin-ui',
      rating: 4.8,
      review: 'Great communication and spotless TypeScript code.'
    },
    {
      title: 'Bakeology Bakery Daily Special Ordering',
      category: 'Fullstack Micro-Gig',
      client: 'Bakeology Artisan Bakery',
      url: 'https://bakeology-preview.vercel.app',
      rating: 5.0,
      review: 'Super responsive and understood our bakery branding effortlessly.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Profile Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#111827] via-slate-900 to-[#162136] border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-24 h-24 rounded-3xl object-cover border-2 border-emerald-500/60 shadow-glow-emerald"
          />
          
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
              <TrustBadge type="student" text="Verified PCTE Student" size="md" />
            </div>
            
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <GraduationCap size={15} className="text-indigo-400" />
              <span>{currentUser.collegeOrCompany} • Roll #{currentUser.rollNumber} • CGPA: {currentUser.gpa}</span>
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1"><MapPin size={13} /> {currentUser.location}</span>
              <span className="flex items-center gap-1"><Mail size={13} /> {currentUser.email}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Pill Block */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shrink-0">
          <div className="text-center px-2">
            <span className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Star size={16} className="fill-amber-400" /> 4.9
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">Trust Score</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <span className="text-xl font-black text-white">{currentUser.completedGigs}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">Completed</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <span className="text-xl font-black text-emerald-400">100%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">On-Time</span>
          </div>
        </div>

      </div>

      {/* About & Verified Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-6">
          
          {/* Bio */}
          <div className="p-6 rounded-3xl bg-[#111827]/70 backdrop-blur-md border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white">About Aarav</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentUser.bio}
            </p>
          </div>

          {/* Past Gigs & SME Client Testimonials */}
          <div className="p-6 rounded-3xl bg-[#111827]/70 backdrop-blur-md border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Delivered Micro-Gigs & SME Reviews</h2>
              <span className="text-xs text-emerald-400 font-semibold">{portfolioItems.length} Verified Deliveries</span>
            </div>

            <div className="space-y-4">
              {portfolioItems.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <span className="text-[11px] text-indigo-400 font-medium">{item.client} • {item.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                      <Star size={13} className="fill-amber-400" /> {item.rating}
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 italic">"{item.review}"</p>
                  
                  <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-800/60">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Escrow Released
                    </span>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> View Project
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Skills & Academic Validation */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Verified Skills */}
          <div className="p-6 rounded-3xl bg-[#111827]/70 backdrop-blur-md border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 size={16} className="text-indigo-400" />
              <span>Endorsed Skill Stack</span>
            </h3>

            <div className="space-y-2">
              {[
                { name: 'React.js / Next.js', count: 9 },
                { name: 'Tailwind CSS', count: 8 },
                { name: 'TypeScript', count: 7 },
                { name: 'Figma to Code', count: 6 },
                { name: 'Node.js & APIs', count: 5 }
              ].map((skill, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{skill.name}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {skill.count} SME Endorsements
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Badge Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-xs font-bold text-white">Campus Institutional Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Student enrollment confirmed via College Registrar portal with roll number <span className="font-mono text-indigo-300">2104891</span>.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
