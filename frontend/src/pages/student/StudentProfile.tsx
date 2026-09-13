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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Profile Header Banner */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-24 h-24 rounded-3xl object-cover border-2 border-emerald-400 shadow-md"
          />
          
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black text-[#121214]">{currentUser.name}</h1>
              <TrustBadge type="student" text="Verified PCTE Student" size="md" />
            </div>
            
            <p className="text-xs text-slate-600 font-bold flex items-center gap-2">
              <GraduationCap size={16} className="text-purple-700" />
              <span>{currentUser.collegeOrCompany} • Roll #{currentUser.rollNumber} • CGPA: {currentUser.gpa}</span>
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
              <span className="flex items-center gap-1"><MapPin size={13} /> {currentUser.location}</span>
              <span className="flex items-center gap-1"><Mail size={13} /> {currentUser.email}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Pill Block */}
        <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-200 shrink-0">
          <div className="text-center px-2">
            <span className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Star size={18} className="fill-amber-400" /> 4.9
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Trust Score</span>
          </div>
          <div className="h-9 w-px bg-slate-200" />
          <div className="text-center px-2">
            <span className="text-2xl font-black text-[#121214]">{currentUser.completedGigs}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Completed</span>
          </div>
          <div className="h-9 w-px bg-slate-200" />
          <div className="text-center px-2">
            <span className="text-2xl font-black text-emerald-700">100%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">On-Time</span>
          </div>
        </div>

      </div>

      {/* About & Verified Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-6">
          
          <div className="p-8 rounded-[2rem] bg-white border border-purple-100 shadow-sm space-y-3">
            <h2 className="text-lg font-black text-[#121214]">About Aarav</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {currentUser.bio}
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white border border-purple-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#121214]">Delivered Micro-Gigs & SME Reviews</h2>
              <span className="text-xs text-emerald-800 font-bold">{portfolioItems.length} Verified Deliveries</span>
            </div>

            <div className="space-y-4">
              {portfolioItems.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-[#121214]">{item.title}</h4>
                      <span className="text-[11px] text-purple-700 font-bold">{item.client} • {item.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-black shrink-0">
                      <Star size={13} className="fill-amber-400" /> {item.rating}
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-600 italic font-medium">"{item.review}"</p>
                  
                  <div className="pt-2 flex items-center justify-between text-[11px] border-t border-purple-100">
                    <span className="text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Escrow Released
                    </span>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-slate-600 hover:text-black font-bold flex items-center gap-1"
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
          
          <div className="p-8 rounded-[2rem] bg-white border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[#121214] flex items-center gap-2">
              <Code2 size={16} className="text-purple-700" />
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
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{skill.name}</span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {skill.count} SME Endorsements
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-purple-50/70 border border-purple-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-xs font-black text-[#121214]">Campus Institutional Verification</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Student enrollment confirmed via College Registrar portal with roll number <span className="font-mono text-purple-900 font-bold">2104891</span>.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
