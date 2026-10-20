import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { PeriodLoggerModal } from './components/cycle/PeriodLoggerModal';
import { ChatDrawer } from './components/chat/ChatDrawer';
import { AuthRequiredGuard } from './components/common/AuthRequiredGuard';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PeriodCalendarPage } from './pages/PeriodCalendarPage';
import { SymptomTrackerPage } from './pages/SymptomTrackerPage';
import { CycleInsightsPage } from './pages/CycleInsightsPage';
import { PcosEducationPage } from './pages/PcosEducationPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { HealthReportsPage } from './pages/HealthReportsPage';
import { ProfilePrivacyPage } from './pages/ProfilePrivacyPage';
import { SettingsPage } from './pages/SettingsPage';
import { PartnerViewPage } from './pages/PartnerViewPage';
import { MentalHealthPage } from './pages/MentalHealthPage';

const AppContent: React.FC = () => {
  const { currentPage, isLoggedIn, t } = useApp();

  // Public Landing Page
  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  // Auth Pages
  if (currentPage === 'auth_signin') {
    return <AuthPage initialMode="signin" />;
  }
  if (currentPage === 'auth_signup') {
    return <AuthPage initialMode="signup" />;
  }

  // Standalone Read-Only Partner Companion Page
  if (currentPage === 'partner_view') {
    return <PartnerViewPage />;
  }

  // Authentication Guard:
  // If user is not logged in, block all internal health pages and require authentication
  if (!isLoggedIn) {
    return <AuthRequiredGuard attemptedPage={currentPage} />;
  }

  // Helper title resolver
  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard':
        return t.nav.dashboard;
      case 'calendar':
        return t.nav.calendar;
      case 'symptoms':
        return t.nav.symptoms;
      case 'insights':
        return t.nav.insights;
      case 'education':
        return t.nav.education;
      case 'aiAssistant':
        return t.nav.aiAssistant;
      case 'reports':
        return t.nav.reports;
      case 'mentalHealth':
        return t.nav.mentalHealth;
      case 'profile':
        return t.nav.profile;
      case 'settings':
        return t.nav.settings;
      default:
        return t.appName;
    }
  };

  return (
    <div className="flex h-screen bg-canvas overflow-hidden font-sans text-plum-900">
      {/* Desktop Responsive Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Persistent Medical Disclaimer & Urgent Care Banner */}
        <DisclaimerBanner />

        {/* Header with Title, Language Switcher, Privacy Shield, Notification Bell & Profile Menu */}
        <Header title={getPageTitle(currentPage)} />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-24 lg:pb-12">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'calendar' && <PeriodCalendarPage />}
          {currentPage === 'symptoms' && <SymptomTrackerPage />}
          {currentPage === 'insights' && <CycleInsightsPage />}
          {currentPage === 'education' && <PcosEducationPage />}
          {currentPage === 'mentalHealth' && <MentalHealthPage />}
          {currentPage === 'aiAssistant' && <AiAssistantPage />}
          {currentPage === 'reports' && <HealthReportsPage />}
          {currentPage === 'profile' && <ProfilePrivacyPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>

        {/* Mobile & Tablet Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Modals & Drawers */}
      <PeriodLoggerModal />
      <ChatDrawer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
