import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { SubmissionResultPage } from './pages/SubmissionResultPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Complaint } from './types';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [lastSubmittedComplaint, setLastSubmittedComplaint] = useState<Complaint | null>(null);
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | undefined>(undefined);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('civicresolve_admin_auth') === 'true';
  });

  const handleNavigate = (page: string, category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    if (page === 'admin') {
      setCurrentPage(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmissionSuccess = (complaint: Complaint) => {
    setLastSubmittedComplaint(complaint);
    setSelectedTrackingId(complaint.id);
    setCurrentPage('submission-result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('civicresolve_admin_auth', 'true');
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('civicresolve_admin_auth');
    setCurrentPage('admin-login');
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Page Content */}
      <main className="main-content">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'report' && (
          <ReportIssuePage
            initialCategory={selectedCategory}
            onSubmissionSuccess={handleSubmissionSuccess}
          />
        )}

        {currentPage === 'submission-result' && lastSubmittedComplaint && (
          <SubmissionResultPage
            complaint={lastSubmittedComplaint}
            onNavigate={handleNavigate}
            onSelectComplaintForTracking={(complaint) => {
              setSelectedTrackingId(complaint.id);
            }}
          />
        )}

        {currentPage === 'complaints' && (
          <MyComplaintsPage
            selectedComplaintId={selectedTrackingId}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'admin-login' && (
          <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />
        )}

        {currentPage === 'admin-dashboard' && (
          <AdminDashboardPage onLogout={handleAdminLogout} />
        )}
      </main>

      {/* Bottom Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
