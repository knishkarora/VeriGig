import { User, MicroGig, Proposal, Dispute, VerificationRequest, NotificationItem } from '../types';

export const mockUsers: Record<string, User> = {
  student: {
    id: 'user-student-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@pcte.edu.in',
    role: 'student',
    collegeOrCompany: 'PCTE Group of Institutes',
    isVerified: true,
    verificationBadgeText: 'Verified PCTE Student',
    rating: 4.9,
    completedGigs: 9,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    balance: 14200,
    bio: 'Pre-final year CSE student @ PCTE. Fullstack React/Next.js developer & Tailwind aficionado. Love building nimble web tools for local businesses.',
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Figma', 'Node.js'],
    rollNumber: '2104891',
    gpa: '8.8 / 10.0',
    location: 'Ludhiana, Punjab',
  },
  employer: {
    id: 'user-emp-1',
    name: 'Simranjit Singh',
    email: 'simran@bakeology.in',
    role: 'employer',
    collegeOrCompany: 'Bakeology Artisan Bakery',
    isVerified: true,
    verificationBadgeText: 'Verified SME Partner',
    rating: 4.8,
    completedGigs: 14,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    balance: 45000,
    bio: 'Founder at Bakeology Bakery & Cafe chain across Punjab. Constantly engaging agile student talent for storefronts, social campaigns, and internal ops.',
    location: 'Sarabha Nagar, Ludhiana',
  },
  admin: {
    id: 'user-admin-1',
    name: 'CampusGigs Governance',
    email: 'governance@campusgigs.internal',
    role: 'admin',
    collegeOrCompany: 'Platform Oversight Committee',
    isVerified: true,
    verificationBadgeText: 'Super Admin',
    rating: 5.0,
    completedGigs: 180,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    balance: 850000,
    location: 'Punjab Regional Hub',
  },
  guest: {
    id: 'user-guest-1',
    name: 'Guest Visitor',
    email: 'guest@campusgigs.local',
    role: 'guest',
    collegeOrCompany: 'Visitor',
    isVerified: false,
    rating: 0,
    completedGigs: 0,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    balance: 0,
  }
};

export const initialGigs: MicroGig[] = [
  {
    id: 'gig-1',
    title: 'Digital Ordering Menu & WhatsApp Checkout for Artisan Bakery',
    employerId: 'user-emp-1',
    employerName: 'Simranjit Singh',
    employerCompany: 'Bakeology Artisan Bakery',
    employerVerified: true,
    category: 'Web Dev',
    totalBudget: 8500,
    paymentType: 'milestone',
    targetDuration: '1 week',
    locationScope: 'Hyper-local (On-Campus)',
    campusProximity: '2.5 km from PCTE Campus',
    description: 'We need a lightweight mobile-first web menu catalog for Bakeology where customers can browse daily fresh pastries, custom cakes, and hit "Order on WhatsApp" with pre-filled items. Must be blindingly fast and work smoothly on mobile browsers.',
    expectedDeliverables: [
      'Interactive responsive web catalog with category filter (Breads, Pastries, Savory)',
      'Cart state stored locally with direct WhatsApp message string generator',
      'Deployed preview on Vercel with admin JSON menu config'
    ],
    requiredSkills: ['React.js', 'Tailwind CSS', 'Mobile UI', 'WhatsApp API'],
    preferredColleges: ['PCTE Group of Institutes', 'GNDEC Ludhiana'],
    status: 'in_progress',
    applicantsCount: 5,
    createdAt: '2 days ago',
    hiredStudentId: 'user-student-1',
    hiredStudentName: 'Aarav Sharma',
    milestones: [
      {
        id: 'ms-1-1',
        title: 'Milestone 1: Wireframe & Product Catalog UI',
        description: 'Responsive catalog layout showing pastry cards, category tabs, and cart drawer',
        amount: 3500,
        percentage: 40,
        deadline: 'Sep 15, 2026',
        status: 'completed',
        deliverable: {
          submittedAt: 'Yesterday, 4:20 PM',
          liveUrl: 'https://bakeology-preview.vercel.app',
          repoUrl: 'https://github.com/aaravsharma/bakeology-catalog',
          notes: 'Completed mobile-first responsive layout with fast image loading and interactive categories. Tested on iPhone 14 & Pixel 7.',
          feedback: 'Outstanding work! Very snappy and matches our bakery branding perfectly.'
        }
      },
      {
        id: 'ms-1-2',
        title: 'Milestone 2: WhatsApp Checkout Integration & Vercel Deploy',
        description: 'Integrate WhatsApp redirect with formatted bill summary and finalized production domain',
        amount: 5000,
        percentage: 60,
        deadline: 'Sep 18, 2026',
        status: 'under_review',
        deliverable: {
          submittedAt: 'Today, 2:15 PM',
          liveUrl: 'https://bakeology-menu-prod.vercel.app',
          repoUrl: 'https://github.com/aaravsharma/bakeology-catalog',
          notes: 'WhatsApp checkout is now wired up with localized INR currency formatting, automatic cart calculation, and pickup time selector.'
        }
      }
    ]
  },
  {
    id: 'gig-2',
    title: 'Clinic Appointment Booking & Patient Queue Screen UI',
    employerId: 'user-emp-2',
    employerName: 'Dr. Raman Batra',
    employerCompany: 'Apex Ortho & Rehab Clinic',
    employerVerified: true,
    category: 'UI/UX',
    totalBudget: 12000,
    paymentType: 'milestone',
    targetDuration: '2 weeks',
    locationScope: 'City-wide',
    campusProximity: 'Ludhiana Civil Lines',
    description: 'Design an intuitive patient intake portal and a waiting-room TV queue display. Needs high readability for senior patients, clean accessibility, and a modern clean medical aesthetic.',
    expectedDeliverables: [
      'Figma wireframes for Patient Self-Booking Mobile Flow',
      'Figma prototype for Waiting Room Reception Queue Screen (1080p landscape)',
      'Design token handoff documentation for React developer'
    ],
    requiredSkills: ['Figma', 'UI/UX', 'Accessibility (WCAG)', 'Design Systems'],
    preferredColleges: ['PCTE Group of Institutes', 'Thapar University'],
    status: 'open',
    applicantsCount: 4,
    createdAt: '1 day ago',
    milestones: [
      {
        id: 'ms-2-1',
        title: 'Milestone 1: Patient Mobile Intake Flow (Figma)',
        description: '5 key screens: Slot Selection, Doctor Details, Patient Form, OTP, Confirmation',
        amount: 5000,
        percentage: 42,
        deadline: 'Sep 20, 2026',
        status: 'active'
      },
      {
        id: 'ms-2-2',
        title: 'Milestone 2: Clinic TV Display Prototype & Design System Hand-off',
        description: 'High contrast display UI with patient token ticker, sound cues, and dev tokens',
        amount: 7000,
        percentage: 58,
        deadline: 'Sep 27, 2026',
        status: 'locked'
      }
    ]
  },
  {
    id: 'gig-3',
    title: 'Instagram Reels & Promo Motion Graphics for Organic Cafe',
    employerId: 'user-emp-3',
    employerName: 'Tanya Mehra',
    employerCompany: 'The Daily Roast Cafe',
    employerVerified: true,
    category: 'Social Media',
    totalBudget: 6000,
    paymentType: 'milestone',
    targetDuration: 'Under 48 hrs',
    locationScope: 'Hyper-local (On-Campus)',
    campusProximity: 'Opposite GNDEC Gate 2',
    description: 'We are launching our student study discount hour. Need 3 punchy, aesthetic 9:16 vertical motion reels with trending audio hooks, kinetic typography, and our cafe vibes.',
    expectedDeliverables: [
      '3 Edited 9:16 1080x1920 MP4 Video Reels (15-30s each)',
      'Editable CapCut / Premiere Pro project files',
      'Thumbnail covers with readable bold titles'
    ],
    requiredSkills: ['Premiere Pro', 'CapCut', 'Motion Design', 'Short-form Video'],
    preferredColleges: ['GNDEC Ludhiana', 'PCTE'],
    status: 'open',
    applicantsCount: 7,
    createdAt: '5 hours ago',
    milestones: [
      {
        id: 'ms-3-1',
        title: 'Milestone 1: 3 Draft Storyboards & Audio Stems Selection',
        description: 'Select trending audio and outline visual hooks for 3 videos',
        amount: 2000,
        percentage: 33,
        deadline: 'Tomorrow, 6 PM',
        status: 'active'
      },
      {
        id: 'ms-3-2',
        title: 'Milestone 2: Final Rendered 4K Reels & Thumbnails',
        description: 'Deliver finished video reels with color grading and sound design',
        amount: 4000,
        percentage: 67,
        deadline: 'Sep 15, 2026',
        status: 'locked'
      }
    ]
  },
  {
    id: 'gig-4',
    title: 'E-Commerce CSV Product Catalog Cleansing & Automated Shopify Export',
    employerId: 'user-emp-4',
    employerName: 'Harpreet Dhillon',
    employerCompany: 'Punjab AgriTech & Tools',
    employerVerified: true,
    category: 'Data & Research',
    totalBudget: 4500,
    paymentType: 'fixed',
    targetDuration: 'Under 48 hrs',
    locationScope: 'Remote',
    campusProximity: 'Remote / Hybrid',
    description: 'We have 1,400 raw SKUs in messy Excel spreadsheets with mixed units, missing barcodes, and irregular category names. Need a Python script or Google Sheets pipeline to standardize and export valid Shopify CSV.',
    expectedDeliverables: [
      'Cleaned XLSX / CSV matching Shopify import format specification',
      'Python script or Google Sheet formula sheet for future monthly runs',
      'Summary error log of invalid/unresolvable SKUs'
    ],
    requiredSkills: ['Python', 'Pandas', 'Excel / Sheets', 'Shopify CSV'],
    preferredColleges: ['Thapar University', 'GNDEC', 'PCTE'],
    status: 'open',
    applicantsCount: 3,
    createdAt: '3 hours ago',
    milestones: [
      {
        id: 'ms-4-1',
        title: 'Full Deliverable: Cleaned Catalog & Python Normalizer',
        description: 'Complete data normalization and formatted Shopify CSV export file',
        amount: 4500,
        percentage: 100,
        deadline: 'Sep 15, 2026',
        status: 'active'
      }
    ]
  },
  {
    id: 'gig-5',
    title: 'Boutique Apparel Brand Identity, Brand Book & Packaging Tags',
    employerId: 'user-emp-5',
    employerName: 'Navneet Sandhu',
    employerCompany: 'Virsa Handlooms & Apparel',
    employerVerified: true,
    category: 'Graphic Design',
    totalBudget: 9000,
    paymentType: 'milestone',
    targetDuration: '1 week',
    locationScope: 'City-wide',
    campusProximity: 'Ferozepur Road Hub',
    description: 'Craft a minimalist, heritage-infused visual identity for our premium khadi and handloom line. Includes primary logo mark, color palette tokens, typography rules, and hang tag vectors.',
    expectedDeliverables: [
      'Vector Logo Suite (AI, SVG, PNG with light/dark variants)',
      '12-page PDF Brand Guidelines Booklet',
      'Print-ready Hang Tag & Packaging Tape mockups'
    ],
    requiredSkills: ['Adobe Illustrator', 'Brand Identity', 'Packaging Design', 'Typography'],
    preferredColleges: ['NIFT', 'PCTE Group of Institutes', 'Apeejay Institute'],
    status: 'open',
    applicantsCount: 6,
    createdAt: '1 day ago',
    milestones: [
      {
        id: 'ms-5-1',
        title: 'Milestone 1: 3 Distinct Logo Concepts & Moodboard',
        description: 'Deliver 3 vector concepts with typography exploration',
        amount: 3500,
        percentage: 39,
        deadline: 'Sep 17, 2026',
        status: 'active'
      },
      {
        id: 'ms-5-2',
        title: 'Milestone 2: Final Brand Book & Packaging Print Files',
        description: 'Full identity kit, CMYK print files for hang tags, and vector exports',
        amount: 5500,
        percentage: 61,
        deadline: 'Sep 22, 2026',
        status: 'locked'
      }
    ]
  },
  {
    id: 'gig-6',
    title: 'SEO Content Writing for Dental Care Routine Blog Series (5 Articles)',
    employerId: 'user-emp-6',
    employerName: 'Dr. Jasleen Kaur',
    employerCompany: 'Smiles Ahead Multispeciality Dental',
    employerVerified: false,
    category: 'Content & Copy',
    totalBudget: 5000,
    paymentType: 'milestone',
    targetDuration: '1 week',
    locationScope: 'Remote',
    description: 'Looking for a student who can write 5 crisp, medically sound, and engaging 800-word articles on preventive dental care, aligners vs braces, and pediatric oral health.',
    expectedDeliverables: [
      '5 Markdown / Google Doc articles (800-1000 words each)',
      'Meta title, meta description, and target keyword density report',
      'Zero AI plagiarism verification certificate'
    ],
    requiredSkills: ['Copywriting', 'SEO Research', 'Medical Writing', 'Proofreading'],
    preferredColleges: ['PCTE Group of Institutes', 'Christian Medical College', 'PAU'],
    status: 'open',
    applicantsCount: 2,
    createdAt: '6 hours ago',
    milestones: [
      {
        id: 'ms-6-1',
        title: 'Milestone 1: First 2 Articles + Keyword Mapping',
        description: 'Submit articles on Aligners vs Braces and Child Dental Hygiene',
        amount: 2000,
        percentage: 40,
        deadline: 'Sep 16, 2026',
        status: 'active'
      },
      {
        id: 'ms-6-2',
        title: 'Milestone 2: Remaining 3 Articles & Meta Tags',
        description: 'Submit remaining articles with SEO optimizations and internal links',
        amount: 3000,
        percentage: 60,
        deadline: 'Sep 21, 2026',
        status: 'locked'
      }
    ]
  }
];

export const initialProposals: Proposal[] = [
  {
    id: 'prop-1',
    gigId: 'gig-1',
    studentId: 'user-student-1',
    studentName: 'Aarav Sharma',
    studentCollege: 'PCTE Group of Institutes',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    studentGpa: '8.8 GPA',
    matchScore: 98,
    coverNote: 'I have previously built 2 WhatsApp ordering catalogs for local Ludhiana food outlets (including a pizza kitchen in Model Town). I can deliver a sub-second load time using Vite + Tailwind and generate instantaneous WhatsApp message links with zero backend friction.',
    bidAmount: 8500,
    deliveryTimeDays: 6,
    portfolioLinks: [
      { label: 'Modena Pizza Web Menu', url: 'https://modena-menu.example.com' },
      { label: 'GitHub: AaravSharma', url: 'https://github.com/aaravsharma' }
    ],
    status: 'hired',
    submittedAt: '3 days ago'
  },
  {
    id: 'prop-2',
    gigId: 'gig-1',
    studentId: 'user-student-2',
    studentName: 'Kavita Chawla',
    studentCollege: 'GNDEC Ludhiana',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    studentGpa: '9.1 GPA',
    matchScore: 88,
    coverNote: 'Hi Simranjit! Third-year IT student at GNDEC. I specialize in lightweight mobile frontends and can integrate a smooth cart animation with local storage persistence.',
    bidAmount: 8000,
    deliveryTimeDays: 7,
    portfolioLinks: [
      { label: 'Dribbble Profile', url: 'https://dribbble.com' },
      { label: 'Live Portfolio', url: 'https://kavita.dev' }
    ],
    status: 'submitted',
    submittedAt: '2 days ago'
  },
  {
    id: 'prop-3',
    gigId: 'gig-2',
    studentId: 'user-student-3',
    studentName: 'Priya Kaur',
    studentCollege: 'PCTE Group of Institutes',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    studentGpa: '8.9 GPA',
    matchScore: 94,
    coverNote: 'Experienced UI/UX designer with 6 completed campus gigs. I recently designed an accessibility-focused pathology dashboard. I understand high contrast typography for medical clinic environments.',
    bidAmount: 11500,
    deliveryTimeDays: 12,
    portfolioLinks: [
      { label: 'Figma Community File', url: 'https://figma.com/@priyakaur' },
      { label: 'Behance Medical Case Study', url: 'https://behance.net/priyakaur' }
    ],
    status: 'shortlisted',
    submittedAt: '1 day ago'
  },
  {
    id: 'prop-4',
    gigId: 'gig-2',
    studentId: 'user-student-4',
    studentName: 'Rohan Verma',
    studentCollege: 'Thapar University',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    studentGpa: '8.4 GPA',
    matchScore: 82,
    coverNote: 'Can deliver complete Figma prototype and React component scaffolding for the waiting room TV dashboard with live auto-refresh simulation.',
    bidAmount: 12000,
    deliveryTimeDays: 14,
    portfolioLinks: [
      { label: 'Design System Demo', url: 'https://rohan-ds.vercel.app' }
    ],
    status: 'submitted',
    submittedAt: '18 hours ago'
  }
];

export const initialVerifications: VerificationRequest[] = [
  {
    id: 'vr-1',
    userId: 'user-student-5',
    userName: 'Gurpreet Singh Gill',
    userType: 'student',
    institutionOrBusiness: 'PCTE Group of Institutes (Campus 2)',
    idOrDocNumber: 'Roll #2203102 - B.Tech CSE (3rd Year)',
    docImageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
    submittedAt: 'Today, 11:30 AM',
    status: 'pending'
  },
  {
    id: 'vr-2',
    userId: 'user-student-6',
    userName: 'Divya Goyal',
    userType: 'student',
    institutionOrBusiness: 'GNDEC Ludhiana',
    idOrDocNumber: 'Roll #2109440 - B.Tech IT',
    docImageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
    submittedAt: 'Yesterday, 5:45 PM',
    status: 'pending'
  },
  {
    id: 'vr-3',
    userId: 'user-emp-7',
    userName: 'Karan Mehandiratta',
    userType: 'sme',
    institutionOrBusiness: 'Ludhiana Steel Forge Tech Pvt Ltd',
    idOrDocNumber: 'GSTIN: 03AABCL1234F1Z8 / MSME UDYAM-PB-08-00192',
    docImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    submittedAt: 'Sep 11, 2026',
    status: 'pending'
  },
  {
    id: 'vr-4',
    userId: 'user-student-1',
    userName: 'Aarav Sharma',
    userType: 'student',
    institutionOrBusiness: 'PCTE Group of Institutes',
    idOrDocNumber: 'Roll #2104891 - Valid through June 2027',
    docImageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
    submittedAt: 'Aug 14, 2026',
    status: 'approved'
  }
];

export const initialDisputes: Dispute[] = [
  {
    id: 'disp-1',
    gigId: 'gig-99',
    gigTitle: 'Social Media Banner Design for Boutique Gym',
    studentName: 'Sahil Kapoor (PCTE)',
    employerName: 'Vikram Sethi (IronFit Gym)',
    raisedBy: 'student',
    reason: 'Client requested 7 extra revisions after approved wireframes outside the original scope and has paused milestone sign-off for 9 days.',
    amountInEscrow: 3500,
    status: 'open',
    auditLog: [
      {
        timestamp: 'Sep 02, 2026 10:00 AM',
        actor: 'Milestone Escrow',
        action: 'Escrow Funded',
        detail: 'INR 3,500 locked into escrow for Milestone 1.'
      },
      {
        timestamp: 'Sep 05, 2026 06:15 PM',
        actor: 'Sahil Kapoor',
        action: 'Deliverable Submitted',
        detail: 'Submitted 8 banner sizes on Figma with editable layers.'
      },
      {
        timestamp: 'Sep 06, 2026 02:40 PM',
        actor: 'Vikram Sethi',
        action: 'Revision Requested',
        detail: 'Change all background gradients to textured concrete pattern.'
      },
      {
        timestamp: 'Sep 08, 2026 11:20 AM',
        actor: 'Sahil Kapoor',
        action: 'Dispute Raised',
        detail: 'Fourth out-of-scope revision requested. Client unresponsive to scope alignment.'
      }
    ]
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Deliverable Submitted',
    message: 'Aarav Sharma submitted Milestone 2 for Bakeology Artisan Bakery.',
    time: '15m ago',
    read: false,
    type: 'milestone',
    link: '/app/employer/workspace/gig-1'
  },
  {
    id: 'notif-2',
    title: 'New Applicant Match',
    message: 'Priya Kaur (94% match) applied to Clinic Appointment Booking.',
    time: '2h ago',
    read: false,
    type: 'applicant',
    link: '/app/employer/gig/gig-2/applicants'
  },
  {
    id: 'notif-3',
    title: 'Verification Approved',
    message: 'Your PCTE College ID has been verified. Verified badge is now active!',
    time: 'Yesterday',
    read: true,
    type: 'verification',
    link: '/app/student/profile'
  },
  {
    id: 'notif-4',
    title: 'Milestone Escrow Released',
    message: '₹3,500 has been transferred to your wallet for Bakeology Milestone 1.',
    time: 'Yesterday',
    read: true,
    type: 'payment',
    link: '/app/student/dashboard'
  }
];
