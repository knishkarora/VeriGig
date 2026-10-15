import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { Navbar } from './components/shared/Navbar';
import { Footer } from './components/shared/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { GigExplore } from './pages/student/GigExplore';
import { GigDetails } from './pages/student/GigDetails';
import { StudentWorkspace } from './pages/student/StudentWorkspace';
import { StudentProfile } from './pages/student/StudentProfile';

// Employer Pages
import { EmployerDashboard } from './pages/employer/EmployerDashboard';
import { PostGigWizard } from './pages/employer/PostGigWizard';
import { GigApplicants } from './pages/employer/GigApplicants';
import { EmployerWorkspace } from './pages/employer/EmployerWorkspace';
import { EmployerProfile } from './pages/employer/EmployerProfile';
import { PublicEmployerProfile } from './pages/employer/PublicEmployerProfile';

// Shared & Legal Pages
import { CompletionVerificationPage } from './pages/shared/CompletionVerificationPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { EscrowProtocolPage } from './pages/legal/EscrowProtocolPage';

// Admin Pages
import { AdminVerifications } from './pages/admin/AdminVerifications';
import { AdminDisputes } from './pages/admin/AdminDisputes';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';

// Helper component to reset scroll position on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <MarketplaceProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F8F6FE] text-[#334155]">
          {/* Global Shell Navigation */}
          <Navbar />

          {/* Main Viewport Container */}
          <main className="flex-1 w-full">
            <Routes>
              {/* Landing & Authentication */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Legal & Trust Framework Pages */}
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/escrow" element={<EscrowProtocolPage />} />

              {/* Student Freelancer Module */}
              <Route path="/app/student/dashboard" element={<StudentDashboard />} />
              <Route path="/app/student/explore" element={<GigExplore />} />
              <Route path="/app/explore" element={<GigExplore />} />
              <Route path="/explore" element={<GigExplore />} />
              <Route path="/app/student/gig/:id" element={<GigDetails />} />
              <Route path="/app/gig/:id" element={<GigDetails />} />
              <Route path="/gigs/:id" element={<GigDetails />} />
              <Route path="/app/student/workspace" element={<StudentWorkspace />} />
              <Route path="/app/student/workspace/:gigId" element={<StudentWorkspace />} />
              <Route path="/app/student/profile" element={<StudentProfile />} />

              {/* Employer SME Module */}
              <Route path="/app/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/app/employer/post-gig" element={<PostGigWizard />} />
              <Route path="/app/employer/applicants" element={<GigApplicants />} />
              <Route path="/app/employer/gig/:id/applicants" element={<GigApplicants />} />
              <Route path="/app/employer/workspace" element={<EmployerWorkspace />} />
              <Route path="/app/employer/workspace/:gigId" element={<EmployerWorkspace />} />
              <Route path="/app/employer/profile" element={<EmployerProfile />} />
              <Route path="/employers/:id" element={<PublicEmployerProfile />} />
              <Route path="/app/employer/:id/view" element={<PublicEmployerProfile />} />

              {/* Public Portable Verification Page */}
              <Route path="/verify/completion/:hash" element={<CompletionVerificationPage />} />

              {/* Administrative Governance Desk */}
              <Route path="/app/admin/verifications" element={<AdminVerifications />} />
              <Route path="/app/admin/disputes" element={<AdminDisputes />} />
              <Route path="/app/admin/analytics" element={<AdminAnalytics />} />

              {/* Fallback route */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>

          {/* Editorial Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </MarketplaceProvider>
  );
};

export default App;
