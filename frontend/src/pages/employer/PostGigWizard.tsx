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
  Layers, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Wallet 
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
  const [campusProximity, setCampusProximity] = useState('Within 3 km of PCTE Campus');
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

  // Total budget calculated from milestones
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
    const newId = postGig({
      title,
      category,
      totalBudget,
      paymentType: 'milestone',
      targetDuration,
      locationScope,
      campusProximity,
      description,
      expectedDeliverables: milestones.map(m => m.title),
      requiredSkills,
      preferredColleges,
      milestones,
    });

    navigate(`/app/employer/dashboard`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Top back */}
      <div className="flex items-center justify-between">
        <Link 
          to="/app/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Employer Dashboard
        </Link>
        <span className="text-xs text-slate-500">Step {currentStep} of 4</span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Post a Milestone-Backed Micro-Gig</h1>
        <p className="text-xs text-slate-400 mt-1">
          Engage verified local student talent from Ludhiana campuses with transparent escrow protection.
        </p>
      </div>

      {/* Stepper Header Pills */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { step: 1, label: '1. Basic Scope' },
          { step: 2, label: '2. Milestones' },
          { step: 3, label: '3. Criteria' },
          { step: 4, label: '4. Escrow Review' }
        ].map(({ step, label }) => (
          <button
            key={step}
            onClick={() => setCurrentStep(step)}
            className={`py-2 px-3 rounded-xl text-xs font-semibold text-center transition-all ${
              currentStep === step
                ? 'bg-indigo-600 text-white shadow-glow-indigo'
                : currentStep > step
                ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Step Form Box */}
      <div className="p-8 rounded-3xl bg-[#111827]/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* STEP 1: Basic Scope */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Step 1: Task Overview & Target Timeline</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Task Title (e.g. Clinic Appointment Queue UI, Bakery WhatsApp Cart)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mobile Ordering Catalog & WhatsApp Checkout"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Skill Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GigCategory)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Completion Window
                </label>
                <select
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value as GigDuration)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Under 48 hrs">Under 48 hrs</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Location Scope
                </label>
                <select
                  value={locationScope}
                  onChange={(e) => setLocationScope(e.target.value as LocationScope)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Hyper-local (On-Campus)">Hyper-local (Campus proximity)</option>
                  <option value="City-wide">City-wide (Ludhiana)</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Task Scope & Detailed Instructions for Students
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the background problem, specific requirements, and any sample references or brand guidelines..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Milestone Constructor */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Step 2: Milestone Constructor</h2>
                <p className="text-xs text-slate-400">Define concrete phases. Escrow is released after you inspect each deliverable.</p>
              </div>
              <button
                type="button"
                onClick={handleAddMilestone}
                disabled={milestones.length >= 4}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Plus size={13} /> Add Milestone ({milestones.length}/4)
              </button>
            </div>

            <div className="space-y-4">
              {milestones.map((ms, index) => (
                <div key={ms.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-400">Milestone {index + 1}</span>
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(ms.id)}
                        className="text-slate-500 hover:text-rose-400 text-xs p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Deliverable Title</label>
                      <input
                        type="text"
                        value={ms.title}
                        onChange={(e) => handleMilestoneChange(ms.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Escrow Amount (INR ₹)</label>
                      <input
                        type="number"
                        value={ms.amount}
                        onChange={(e) => handleMilestoneChange(ms.id, 'amount', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Acceptance Criteria</label>
                    <input
                      type="text"
                      value={ms.description}
                      onChange={(e) => handleMilestoneChange(ms.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total summary */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
              <span className="text-xs text-indigo-300 font-medium">Total Escrow Budget:</span>
              <span className="text-lg font-black text-emerald-400">₹{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* STEP 3: Candidate Criteria */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-white">Step 3: Student Criteria & College Preferences</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Required Skill Tags (Press Enter to add)
              </label>
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-2">
                {requiredSkills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs">
                    <span>{skill}</span>
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-white">
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
                  className="bg-transparent text-xs text-white focus:outline-none px-1 flex-1 min-w-[120px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
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
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                        isChecked 
                          ? 'bg-indigo-950/40 border-indigo-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{college}</span>
                      {isChecked && <Check size={14} className="text-indigo-400" />}
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
            <h2 className="text-base font-bold text-white">Step 4: Final Escrow Review & Publish</h2>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{category}</span>
                  <h3 className="text-base font-bold text-white mt-1">{title || 'Micro-Gig Listing'}</h3>
                  <p className="text-xs text-slate-400">{currentUser.collegeOrCompany} • {targetDuration}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-400">₹{totalBudget.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block">{milestones.length} Milestones</span>
                </div>
              </div>

              {/* Escrow breakdown */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Milestone 1 Escrow Deposit:</span>
                  <span className="text-white font-semibold">₹{(milestones[0]?.amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Remaining Milestones (Paid on unlock):</span>
                  <span className="text-white font-semibold">
                    ₹{(totalBudget - (milestones[0]?.amount || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>CampusGigs Platform Fee:</span>
                  <span className="text-emerald-400 font-semibold">₹0 (Zero Bloat Initiative)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
              <ShieldCheck size={20} className="shrink-0" />
              <span>
                Your listing will immediately appear in the CampusGigs student feed. You will be notified when verified PCTE and GNDEC students apply.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
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
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow-indigo transition-all"
            >
              <span>Next Step</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald transition-all"
            >
              <Sparkles size={14} />
              <span>Fund Escrow & Publish Listing</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
