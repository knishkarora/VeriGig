import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Briefcase, 
  Users, 
  Star, 
  RotateCcw, 
  ExternalLink,
  Edit3,
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';

export const EmployerProfile: React.FC = () => {
  const { currentUser, gigs } = useMarketplace();
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState('Apex Technologies Punjab');
  const [industry, setIndustry] = useState('Software Engineering & Cloud Services');
  const [city, setCity] = useState('Ludhiana, Punjab');
  const [website, setWebsite] = useState('https://apextechnologies.in');
  const [bio, setBio] = useState('Leading SME engineering firm partnering with premier technical colleges across Punjab. We scope structured, high-impact micro-gigs for student developers in React, Node.js, and Mobile apps.');
  
  // Rehire candidates list (Past verified student collaborators)
  const pastHires = [
    {
      id: 'student-1',
      name: 'Aarav Sharma',
      college: 'Thapar Institute of Eng & Tech (TIET)',
      role: 'Full-Stack Developer',
      rating: 5.0,
      completedGigs: 3,
      skills: ['React', 'TypeScript', 'PostgreSQL'],
      avatar: 'AS',
    },
    {
      id: 'student-2',
      name: 'Simran Kaur',
      college: 'Guru Nanak Dev Engineering College (GNDEC)',
      role: 'UI/UX & Product Designer',
      rating: 4.9,
      completedGigs: 2,
      skills: ['Figma', 'Design Systems', 'Tailwind CSS'],
      avatar: 'SK',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Top Profile Banner Card */}
      <div className="p-8 rounded-3xl bg-[#0F172A] border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4F851]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-5">
            <div className="w-20 h-20 rounded-3xl bg-[#1E293B] border-2 border-[#D4F851]/30 flex items-center justify-center text-[#D4F851] font-black text-2xl shadow-xl">
              {companyName.slice(0, 2).toUpperCase()}
            </div>
            
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{companyName}</h1>
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GSTIN Verified SME</span>
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70 font-medium">
                  {industry}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 pt-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4F851]" />
                  <span>{city}</span>
                </span>
                <a href={website} target="_blank" rel="noreferrer" className="flex items-center space-x-1 text-[#D4F851] hover:underline">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{website.replace('https://', '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-white/40" />
                  <span>Partnered since Oct 2025</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Link
              to="/app/employer/post-gig"
              className="flex-1 md:flex-initial bg-[#D4F851] text-[#121214] font-bold px-5 py-2.5 rounded-2xl hover:bg-[#C5F82A] text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Post New Micro-Gig</span>
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-white/80 max-w-4xl leading-relaxed border-t border-white/10 pt-5">
          {bio}
        </p>

        {/* SME Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/10">
          <div>
            <span className="text-xs text-white/40 font-medium">Completed Gigs</span>
            <p className="text-xl font-black text-white mt-0.5">8 Contracts</p>
          </div>
          <div>
            <span className="text-xs text-white/40 font-medium">Student Rating</span>
            <p className="text-xl font-black text-[#D4F851] mt-0.5 flex items-center space-x-1">
              <span>4.95</span>
              <Star className="w-4 h-4 fill-[#D4F851] inline" />
            </p>
          </div>
          <div>
            <span className="text-xs text-white/40 font-medium">Total Escrow Released</span>
            <p className="text-xl font-black text-emerald-400 mt-0.5">₹34,500</p>
          </div>
          <div>
            <span className="text-xs text-white/40 font-medium">Campus Partner Tier</span>
            <p className="text-xl font-black text-white mt-0.5">Punjab Cluster Leader</p>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Rehire Pool & Active Gigs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: 1-Click Rehire Talent Pool */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#D4F851]" />
                <span>Verified Talent Rehire Pool</span>
              </h2>
              <p className="text-xs text-white/50">1-click direct gig offer to students who completed past contracts with high ratings.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-white/70">
              {pastHires.length} Verified Alumni
            </span>
          </div>

          <div className="space-y-4">
            {pastHires.map((student) => (
              <div
                key={student.id}
                className="p-5 rounded-3xl bg-[#0F172A] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4F851]/10 border border-[#D4F851]/30 flex items-center justify-center text-[#D4F851] font-bold text-base">
                    {student.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white text-base">{student.name}</h3>
                      <span className="inline-flex items-center text-[11px] text-emerald-400 font-bold space-x-1">
                        <Star className="w-3 h-3 fill-emerald-400" />
                        <span>{student.rating}</span>
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">{student.role} • {student.college}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {student.skills.map((sk) => (
                        <span key={sk} className="text-[10px] bg-white/5 text-white/70 px-2 py-0.5 rounded-lg border border-white/5">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <span className="text-xs text-white/40">{student.completedGigs} Gigs with Apex</span>
                  <Link
                    to={`/app/employer/post-gig?rehireStudentId=${student.id}`}
                    className="bg-white/10 hover:bg-[#D4F851] hover:text-[#121214] text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center space-x-1.5 shadow-md"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Direct Rehire Offer</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Active SME Gigs & Policy Rules */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-[#FFA8D5]" />
              <span>Current Open Listings</span>
            </h3>
            
            <div className="space-y-3">
              {gigs.slice(0, 3).map((g) => (
                <Link
                  key={g.id}
                  to={`/app/employer/gig/${g.id}/applicants`}
                  className="block p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <p className="font-semibold text-white text-xs truncate">{g.title}</p>
                  <div className="flex justify-between items-center mt-2 text-[11px]">
                    <span className="text-emerald-400 font-bold">₹{g.totalBudget.toLocaleString('en-IN')}</span>
                    <span className="text-white/40">View Applicants →</span>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              to="/app/employer/dashboard"
              className="block text-center text-xs text-[#D4F851] font-semibold hover:underline pt-2"
            >
              Manage all gigs in Employer Dashboard →
            </Link>
          </div>

          <div className="p-5 rounded-3xl bg-[#D4F851]/5 border border-[#D4F851]/20 space-y-2 text-xs text-white/70">
            <h4 className="font-bold text-[#D4F851] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Punjab Campus Pilot Privilege</span>
            </h4>
            <p className="leading-relaxed">
              As a verified SME in Ludhiana, your listings bypass cold-start waitlists, access pre-vetted students from TIET and GNDEC, and benefit from 0% platform transaction fees.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
