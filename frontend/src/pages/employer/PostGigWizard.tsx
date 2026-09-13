import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { GigCategory, GigDuration, LocationScope, Milestone } from '../../types';

export const PostGigWizard: React.FC = () => {
  const navigate = useNavigate();
  const { postGig, currentUser } = useMarketplace();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Scope
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GigCategory>('Web Dev');
  const [targetDuration, setTargetDuration] = useState<GigDuration>('1 week');
  const [locationScope, setLocationScope] = useState<LocationScope>('Hyper-local (On-Campus)');
  const [description, setDescription] = useState('');

  // Step 2: Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'ms-new-1',
      title: 'Milestone 1: Design Prototype & Wireframes',
      description: 'Initial review of screens and interactive flow mockups',
      amount: 3000,
      percentage: 40,
      deadline: 'Sep 18, 2026',
      status: 'active'
    },
    {
      id: 'ms-new-2',
      title: 'Milestone 2: Final Production Deliverables & Source Code',
      description: 'Production-ready code, documentation, and asset handoff',
      amount: 4500,
      percentage: 60,
      deadline: 'Sep 24, 2026',
      status: 'locked'
    }
  ]);

  // Step 3: Candidate Criteria
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React.js', 'Tailwind CSS', 'Figma']);
  const [skillInput, setSkillInput] = useState('');
  const [preferredColleges, setPreferredColleges] = useState<string[]>([
    'PCTE Group of Institutes',
    'GNDEC Ludhiana'
  ]);

  const totalBudget = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);

  const handleAddMilestone = () => {
    if (milestones.length >= 4) return;
    const newIdx = milestones.length + 1;
    setMilestones([
      ...milestones,
      {
        id: `ms-new-${Date.now()}`,
        title: `Milestone ${newIdx}: Additional Deliverable`,
        description: 'Detail the concrete acceptance criteria...',
        amount: 2500,
        percentage: 25,
        deadline: 'Sep 28, 2026',
        status: 'locked'
      }
    ]);
  };

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleMilestoneChange = (id: string, field: keyof Milestone, val: any) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!requiredSkills.includes(skillInput.trim())) {
        setRequiredSkills([...requiredSkills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleToggleCollege = (college: string) => {
    if (preferredColleges.includes(college)) {
      setPreferredColleges(preferredColleges.filter(c => c !== college));
    } else {
      setPreferredColleges([...preferredColleges, college]);
    }
  };

  const handlePublish = () => {
    postGig({
      title,
      category,
      totalBudget,
      paymentType: 'milestone',
      targetDuration,
      locationScope,
      campusProximity: 'Within 3 km of PCTE Campus',
      description,
      expectedDeliverables: milestones.map(m => m.title),
      requiredSkills,
      preferredColleges,
      milestones,
    });

    navigate(`/app/employer/dashboard`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      <div className="flex items-center justify-between">
        <Link 
          to="/app/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back to Employer Dashboard
        </Link>
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">Step {currentStep} of 4</span>
      </div>

      <div>
        <h1 className="text-3xl font-black text-[#121214] tracking-tight">Post a Milestone-Backed Micro-Gig</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Engage verified local student talent from Ludhiana campuses with transparent escrow protection.
        </p>
      </div>

      {/* Stepper Header Pills */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { step: 1, label: '1. Basic Scope' },
          { step: 2, label: '2. Milestones' },
          { step: 3, label: '3. Criteria' },
          { step: 4, label: '4. Review' }
        ].map(({ step, label }) => (
          <button
            key={step}
            onClick={() => setCurrentStep(step)}
            className={`py-2 px-3 rounded-full text-xs font-black text-center transition-all ${
              currentStep === step
                ? 'bg-[#121214] text-white shadow-sm'
                : currentStep > step
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-white text-slate-500 border border-purple-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Step Form Box */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#EDE8FD] shadow-[0_15px_40px_-15px_rgba(112,80,200,0.06)] space-y-6">
        
        {/* STEP 1: Basic Scope */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-[#121214]">Step 1: Task Overview & Target Timeline</h2>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Task Title (e.g. Clinic Appointment Queue UI, Bakery WhatsApp Cart)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mobile Ordering Catalog & WhatsApp Checkout"
                className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Skill Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GigCategory)}
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-semibold"
                >
                  <option value="Web Dev">Web Dev</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Content & Copy">Content & Copy</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Data & Research">Data & Research</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Target Completion Window
                </label>
                <select
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value as GigDuration)}
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-semibold"
                >
                  <option value="Under 48 hrs">Under 48 hrs</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Location Scope
                </label>
                <select
                  value={locationScope}
                  onChange={(e) => setLocationScope(e.target.value as LocationScope)}
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-semibold"
                >
                  <option value="Hyper-local (On-Campus)">Hyper-local (Campus proximity)</option>
                  <option value="City-wide">City-wide (Ludhiana)</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Task Scope & Detailed Instructions for Students
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the background problem and specific requirements..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#121214] font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Milestone Constructor */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#121214]">Step 2: Milestone Constructor</h2>
                <p className="text-xs text-slate-500 font-medium">Define concrete deliverables. Escrow is released after your sign-off.</p>
              </div>
              <button
                type="button"
                onClick={handleAddMilestone}
                disabled={milestones.length >= 4}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121214] hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-black shadow-sm transition-all"
              >
                <Plus size={14} className="text-[#D4F851]" /> Add Milestone ({milestones.length}/4)
              </button>
            </div>

            <div className="space-y-4">
              {milestones.map((ms, index) => (
                <div key={ms.id} className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-purple-900">Milestone {index + 1}</span>
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(ms.id)}
                        className="text-slate-400 hover:text-rose-600 text-xs p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Deliverable Title</label>
                      <input
                        type="text"
                        value={ms.title}
                        onChange={(e) => handleMilestoneChange(ms.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-full bg-white border border-purple-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Escrow Amount (INR ₹)</label>
                      <input
                        type="number"
                        value={ms.amount}
                        onChange={(e) => handleMilestoneChange(ms.id, 'amount', Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-full bg-white border border-purple-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Acceptance Criteria</label>
                    <input
                      type="text"
                      value={ms.description}
                      onChange={(e) => handleMilestoneChange(ms.id, 'description', e.target.value)}
                      className="w-full px-4 py-2 rounded-full bg-white border border-purple-200 text-xs text-slate-900 focus:outline-none focus:border-[#121214] font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-sm flex items-center justify-between">
              <span className="text-xs text-purple-900 font-extrabold">Total Escrow Budget:</span>
              <span className="text-2xl font-black text-[#121214]">₹{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* STEP 3: Candidate Criteria */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-[#121214]">Step 3: Student Criteria & College Preferences</h2>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Required Skill Tags (Press Enter to add)
              </label>
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-2">
                {requiredSkills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#121214] border border-slate-200 text-xs font-bold shadow-sm">
                    <span>{skill}</span>
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-black">
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Add skill (e.g. Next.js)..."
                  className="bg-transparent text-xs text-slate-900 focus:outline-none px-2 flex-1 min-w-[120px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Eligible / Preferred Campus Talent Pools
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'PCTE Group of Institutes',
                  'GNDEC Ludhiana',
                  'Thapar University',
                  'Punjab Agricultural University (PAU)',
                  'Chitkara University',
                  'Any Verified Campus Talent'
                ].map((college) => {
                  const isChecked = preferredColleges.includes(college);
                  return (
                    <div 
                      key={college}
                      onClick={() => handleToggleCollege(college)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold cursor-pointer flex items-center justify-between transition-colors ${
                        isChecked 
                          ? 'bg-purple-100 border-purple-400 text-purple-950' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{college}</span>
                      {isChecked && <Check size={16} className="text-purple-700" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Publish */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-[#121214]">Step 4: Final Escrow Review & Publish</h2>

            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">{category}</span>
                  <h3 className="text-xl font-black text-[#121214] mt-1">{title || 'Micro-Gig Listing'}</h3>
                  <p className="text-xs text-slate-500 font-medium">{currentUser.collegeOrCompany} • {targetDuration}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#121214]">₹{totalBudget.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-400 font-bold block">{milestones.length} Milestones</span>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-200/80 space-y-2 text-xs font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Milestone 1 Escrow Deposit:</span>
                  <span className="text-slate-900 font-black">₹{(milestones[0]?.amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Remaining Milestones (Paid on unlock):</span>
                  <span className="text-slate-900 font-black">
                    ₹{(totalBudget - (milestones[0]?.amount || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Fee:</span>
                  <span className="text-emerald-800 font-black">₹0 (Zero Bloat Initiative)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-3 text-xs text-emerald-900 font-semibold">
              <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
              <span>
                Your listing will immediately appear in the CampusGigs student feed. Verified PCTE and GNDEC students will be alerted.
              </span>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors"
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="inline-flex items-center gap-2 pl-6 pr-2 py-2 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all group"
            >
              <span>Next Step</span>
              <div className="w-7 h-7 rounded-full bg-[#D4F851] text-[#121214] flex items-center justify-center font-bold">
                <ArrowRight size={14} />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="inline-flex items-center gap-2 pl-6 pr-2 py-2 rounded-full bg-[#121214] hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all group"
            >
              <span>Fund Escrow & Publish Listing</span>
              <div className="w-8 h-8 rounded-full bg-[#D4F851] text-[#121214] flex items-center justify-center font-bold">
                <Sparkles size={15} />
              </div>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
