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
        <div className="min-h-screen flex flex-col bg-[#090D16] text-[#D1D5DB]">
          {/* Global Shell Navigation with instant Role Switcher */}
          <Navbar />

          {/* Main Viewport Container */}
          <main className="flex-1 w-full">
            <Routes>
              {/* Landing & Authentication */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Student Freelancer Module */}
              <Route path="/app/student/dashboard" element={<StudentDashboard />} />
              <Route path="/app/student/explore" element={<GigExplore />} />
              <Route path="/app/student/gig/:id" element={<GigDetails />} />
              <Route path="/app/student/workspace/:gigId" element={<StudentWorkspace />} />
              <Route path="/app/student/profile" element={<StudentProfile />} />

              {/* Employer SME Module */}
              <Route path="/app/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/app/employer/post-gig" element={<PostGigWizard />} />
              <Route path="/app/employer/gig/:id/applicants" element={<GigApplicants />} />
              <Route path="/app/employer/workspace/:gigId" element={<EmployerWorkspace />} />

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
