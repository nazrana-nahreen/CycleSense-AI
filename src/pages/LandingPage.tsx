import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Calendar as CalendarIcon, 
  Activity, 
  TrendingUp, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle, 
  Lock, 
  Languages, 
  ArrowRight,
  HelpCircle,
  Stethoscope,
  Menu,
  X,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const { 
    setCurrentPage, 
    isLoggedIn, 
    setRedirectAfterAuth, 
    setAuthRequiredNotice, 
    setIsChatDrawerOpen, 
    language, 
    setLanguage, 
    t 
  } = useApp();
  const [activePreviewTab, setActivePreviewTab] = useState<'calendar' | 'dashboard' | 'insights'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Interactive Authentication Modal State
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    page: string;
    titleEn: string;
    titleBn: string;
  }>({
    isOpen: false,
    page: '',
    titleEn: '',
    titleBn: '',
  });

  const promptAuth = (page: string, titleEn: string, titleBn: string) => {
    if (isLoggedIn) {
      setCurrentPage(page);
    } else {
      setAuthModal({
        isOpen: true,
        page,
        titleEn,
        titleBn,
      });
    }
  };

  const handleGetStarted = (targetPage: string = 'dashboard') => {
    promptAuth(
      targetPage,
      'Personal Health Dashboard',
      'ব্যক্তিগত হেলথ ড্যাশবোর্ড'
    );
  };

  const handleSignIn = () => {
    setCurrentPage('auth_signin');
  };

  const handleSignUp = () => {
    setCurrentPage('auth_signup');
  };

  return (
    <div className="min-h-screen bg-canvas text-plum-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-800">
      {/* Navigation Header with Pink Background */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500 text-white shadow-md shadow-rose-900/10 px-3 sm:px-6 lg:px-12 py-2.5 sm:py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo */}
          <div 
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                CycleSense<span className="text-peach-200">.ai</span>
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/90">
            <a href="#features" className="hover:text-white hover:underline underline-offset-4 transition-all">
              {t.nav.features}
            </a>
            <a href="#how-it-works" className="hover:text-white hover:underline underline-offset-4 transition-all">
              {language === 'bn' ? 'ব্যবহারের নিয়ম' : 'How It Works'}
            </a>
            <a href="#pcos-awareness" className="hover:text-white hover:underline underline-offset-4 transition-all">
              {language === 'bn' ? 'পিসিওএস সচেতনতা' : 'PCOS Education'}
            </a>
            <a href="#mental-health" className="hover:text-white hover:underline underline-offset-4 transition-all">
              {language === 'bn' ? 'মানসিক স্বাস্থ্য' : 'Mental Health'}
            </a>
            <a href="#privacy" className="hover:text-white hover:underline underline-offset-4 transition-all">
              {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy'}
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-black/15 backdrop-blur-xs p-0.5 rounded-xl border border-white/25 text-white">
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  language === 'en' ? 'bg-white text-rose-600 shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer font-bengali ${
                  language === 'bn' ? 'bg-white text-rose-600 shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                বাং
              </button>
            </div>

            <button
              onClick={handleSignIn}
              className="hidden sm:inline-block text-xs md:text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl cursor-pointer transition-colors"
            >
              {t.nav.signIn}
            </button>

            <button
              onClick={handleSignUp}
              className="bg-white text-rose-600 hover:bg-rose-50 text-xs md:text-sm font-bold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-95"
            >
              {t.nav.signUp}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/20 space-y-3 animate-fadeIn">
            <nav className="flex flex-col space-y-1 text-sm font-semibold text-white/95">
              <a 
                href="#features" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                {t.nav.features}
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                {language === 'bn' ? 'ব্যবহারের নিয়ম' : 'How It Works'}
              </a>
              <a 
                href="#pcos-awareness" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                {language === 'bn' ? 'পিসিওএস সচেতনতা' : 'PCOS Education'}
              </a>
              <a 
                href="#mental-health" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                {language === 'bn' ? 'মানসিক স্বাস্থ্য' : 'Mental Health'}
              </a>
              <a 
                href="#privacy" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy'}
              </a>
            </nav>

            <div className="pt-2 border-t border-white/20 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignIn();
                }}
                className="flex-1 py-2.5 rounded-xl border border-white/40 text-xs font-semibold text-white text-center hover:bg-white/10 cursor-pointer"
              >
                {t.nav.signIn}
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignUp();
                }}
                className="flex-1 py-2.5 rounded-xl bg-white text-xs font-bold text-rose-600 text-center hover:bg-rose-50 shadow-sm cursor-pointer"
              >
                {t.nav.signUp}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 px-4 lg:px-12 bg-gradient-to-b from-canvas via-rose-50/30 to-canvas">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <Badge variant="rose" size="lg" className="mx-auto lg:mx-0">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>
                  {language === 'bn'
                    ? 'বিজ্ঞানের সাথে প্রযুক্তির মেলবন্ধন — নিরাপদ ও নির্ভরযোগ্য'
                    : 'Empirical Cycle Science • Dual-Language Health AI'}
                </span>
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-plum-950 tracking-tight leading-[1.15]">
                {language === 'bn' ? (
                  <>
                    আপনার সাইকেলকে জানুন। <br />
                    <span className="bg-gradient-to-r from-rose-500 to-lavender-500 bg-clip-text text-transparent">
                      নিজের স্বাস্থ্য সুরক্ষায় এগিয়ে থাকুন।
                    </span>
                  </>
                ) : (
                  <>
                    Understand Your Cycle.{' '}
                    <span className="bg-gradient-to-r from-rose-500 to-lavender-500 bg-clip-text text-transparent">
                      Take Charge of Your Health.
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-plum-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {language === 'bn'
                  ? 'পিরিয়ড ট্র্যাকিং, লক্ষণ বিশ্লেষণ ও পিসিওএস সম্পর্কে নির্ভরযোগ্য চিকিৎসা সহায়িকা—সবকিছুই এখন সহজে বাংলা ও ইংরেজিতে।'
                  : 'A dignified, evidence-backed menstrual health platform designed for accurate cycle tracking, nuanced symptom awareness, and compassionate PCOS guidance.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-semibold text-plum-800 bg-surface hover:bg-peach-50/60 px-6 py-3.5 rounded-2xl border border-rose-200 shadow-sm transition-all"
                >
                  {language === 'bn' ? 'ফিচারগুলো দেখুন' : 'Explore Platform Features'}
                </a>
              </div>

              <p className="text-xs text-plum-400 flex items-center justify-center lg:justify-start gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
                <span>
                  {language === 'bn'
                    ? 'গোপনীয় ও নিরাপদ • সাইন-আপ করতে কোনো অপ্রয়োজনীয় ব্যক্তিগত তথ্য দরকার নেই'
                    : '100% Privacy Protected • No unnecessary health questions during registration'}
                </span>
              </p>
            </div>

            {/* Right Column: Beautiful Wellness Artwork */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-rose-200/40 via-peach-200/30 to-lavender-200/40 rounded-full blur-2xl group-hover:blur-3xl transition-all opacity-80" />
                <div className="relative bg-surface rounded-3xl p-5 border border-rose-100 shadow-xl max-w-sm overflow-hidden flex flex-col items-center">
                  <img
                    src="/images/woman-wellness.png"
                    alt="Holistic Women Wellness"
                    className="w-64 sm:w-72 h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="mt-3 w-full p-3 bg-gradient-to-r from-rose-50 to-peach-50 rounded-2xl border border-rose-100 text-center">
                    <span className="text-xs font-bold text-rose-800 block">
                      {language === 'bn' ? 'আত্মপ্রেম ও সুস্থতার অঙ্গীকার' : 'Self-Care & Hormonal Harmony'}
                    </span>
                    <span className="text-[11px] text-plum-500 mt-0.5 block">
                      {language === 'bn' ? 'আপনার শরীরের ছন্দ ও অনুভূতির পাশে' : 'Attuned to every phase of your journey'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive App Mockup Preview */}
        <div className="max-w-5xl mx-auto mt-12 pt-4">
          <div className="bg-surface rounded-3xl p-4 sm:p-6 shadow-2xl border border-rose-100 ring-1 ring-plum-950/5">
            {/* Mockup Toolbar */}
            <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-rose-100 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-300" />
                <span className="w-3 h-3 rounded-full bg-peach-300" />
                <span className="w-3 h-3 rounded-full bg-lavender-300" />
                <span className="text-xs font-semibold text-plum-500 ml-2">
                  CycleSense AI Live Interactive Preview
                </span>
              </div>

              {/* View Switchers */}
              <div className="flex items-center bg-canvas p-1 rounded-xl border border-rose-100 text-xs font-semibold">
                <button
                  onClick={() => setActivePreviewTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activePreviewTab === 'dashboard'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-plum-600'
                  }`}
                >
                  {t.nav.dashboard}
                </button>
                <button
                  onClick={() => setActivePreviewTab('calendar')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activePreviewTab === 'calendar'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-plum-600'
                  }`}
                >
                  {t.nav.calendar}
                </button>
                <button
                  onClick={() => setActivePreviewTab('insights')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activePreviewTab === 'insights'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-plum-600'
                  }`}
                >
                  {t.nav.insights}
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="bg-canvas rounded-2xl p-5 border border-rose-100/70">
              {activePreviewTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="bg-surface p-4 rounded-xl border border-rose-100">
                    <span className="text-xs text-plum-400 block font-medium">
                      {t.dashboard.cycleDay}
                    </span>
                    <span className="text-3xl font-extrabold text-plum-900 mt-1 block">
                      Day 19
                    </span>
                    <Badge variant="lavender" size="sm" className="mt-2">
                      Luteal Phase (Est.)
                    </Badge>
                  </div>

                  <div className="bg-surface p-4 rounded-xl border border-rose-100">
                    <span className="text-xs text-plum-400 block font-medium">
                      {t.dashboard.nextPeriodEst}
                    </span>
                    <span className="text-2xl font-bold text-plum-900 mt-1 block">
                      Oct 30 – Nov 2
                    </span>
                    <span className="text-[11px] text-rose-600 font-medium block mt-1">
                      ±2 days confidence window
                    </span>
                  </div>

                  <div className="bg-surface p-4 rounded-xl border border-rose-100 flex flex-col justify-between">
                    <span className="text-xs text-plum-400 block font-medium">
                      AI Health Assistant
                    </span>
                    <p className="text-xs text-plum-700 italic mt-1">
                      &quot;Your luteal phase is progressing normally with low reported pelvic cramps.&quot;
                    </p>
                    <button
                      onClick={() => promptAuth('aiAssistant', 'AI Health Assistant', 'এআই স্বাস্থ্য সহায়ক')}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 text-left mt-2 flex items-center gap-1 cursor-pointer"
                    >
                      Open Assistant <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {activePreviewTab === 'calendar' && (
                <div className="text-center py-6 space-y-3">
                  <CalendarIcon className="w-10 h-10 text-rose-500 mx-auto" />
                  <h4 className="font-bold text-base text-plum-900">
                    Interactive Monthly Period & Ovulation Calendar
                  </h4>
                  <p className="text-xs text-plum-600 max-w-md mx-auto">
                    Distinguish logged bleeding days (rose), predicted cycles (dashed), and estimated ovulation windows with transparent uncertainty margins.
                  </p>
                  <Button variant="soft" size="sm" onClick={() => promptAuth('calendar', 'Interactive Menstrual Calendar', 'ইন্টারেক্টিভ মাসিক ক্যালেন্ডার')}>
                    Open Calendar View
                  </Button>
                </div>
              )}

              {activePreviewTab === 'insights' && (
                <div className="text-center py-6 space-y-3">
                  <TrendingUp className="w-10 h-10 text-lavender-500 mx-auto" />
                  <h4 className="font-bold text-base text-plum-900">
                    Empirical Symptom & Cycle Insights
                  </h4>
                  <p className="text-xs text-plum-600 max-w-md mx-auto">
                    Average cycle length: 28.6 days • Variation: ±0.5 days • Clear data patterns formatted for productive consultations with your gynecologist.
                  </p>
                  <Button variant="soft" size="sm" onClick={() => promptAuth('insights', 'Cycle & Symptom Analytics', 'সাইকেল ও লক্ষণ বিশ্লেষণ')}>
                    View Analytics
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-20 px-4 lg:px-12 bg-surface border-y border-rose-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="lavender" size="md">
              {language === 'bn' ? 'প্রধান বৈশিষ্ট্যসমূহ' : 'Comprehensive Features'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-plum-900 tracking-tight">
              {language === 'bn' 
                ? 'নারীদের স্বাস্থ্যের প্রতিটি মুহূর্তের বিশ্বস্ত সঙ্গী' 
                : 'Designed with Precision, Privacy & Compassion'}
            </h2>
            <p className="text-sm sm:text-base text-plum-600">
              {language === 'bn'
                ? 'সহজ ও বৈজ্ঞানিক উপায়ে আপনার শারীরিক সংকেতগুলো বুঝুন।'
                : 'Everything you need to observe hormonal patterns, track pain, and engage in informed medical dialogues.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-canvas p-6 rounded-3xl border border-rose-100/80 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-plum-900">
                {language === 'bn' ? 'স্মার্ট পিরিয়ড ট্র্যাকিং' : 'Period & Cycle Forecasts'}
              </h3>
              <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                {language === 'bn'
                  ? 'পূর্ববর্তী সাইকেলের গড়ের ভিত্তিতে সম্ভাব্য দিন গণনা। নিশ্চিত দাবি না করে বাস্তবসম্মত সম্ভাব্যতা রেঞ্জ প্রদান।'
                  : 'Predict upcoming cycles with visible confidence ranges. Distinguish recorded bleeding from mathematical estimations.'}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-canvas p-6 rounded-3xl border border-rose-100/80 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-peach-200 text-peach-700 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-plum-900">
                {language === 'bn' ? 'দৈনিক লক্ষণ ডায়েরি' : 'Nuanced Daily Symptom Journal'}
              </h3>
              <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                {language === 'bn'
                  ? '০-১০ স্কেলে ক্র্যাম্পস, মেজাজ, ব্রণ, পেট ফাঁপা, রক্তপাতের তীব্রতা ও ঘুমের মান পর্যবেক্ষণ।'
                  : 'Log pelvic pain on a validated 0-10 scale alongside mood, fatigue, bloating, acne, and flow intensity with one-tap ease.'}
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-canvas p-6 rounded-3xl border border-rose-100/80 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-lavender-200 text-lavender-800 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-plum-900">
                {language === 'bn' ? 'দ্বিভাষিক এআই স্বাস্থ্য সহায়ক' : 'Bilingual AI Health Assistant'}
              </h3>
              <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                {language === 'bn'
                  ? 'বাংলা ও ইংরেজিতে চিকিৎসা রেফারেন্সসহ প্রশ্নের নির্ভুল উত্তর। জরুরি বিপদচিহ্ন শনাক্তকরণ অ্যালগরিদম।'
                  : 'Ask complex cycle questions in English or Bengali. Responses feature peer-reviewed medical citations and safety triage.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 lg:px-12 bg-canvas">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Calendar Uncertainty Spotlight Banner */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-soft grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-rose-100 shadow-sm bg-rose-50/50 p-2">
                <img
                  src="/images/period-calendar-uncertainty.png"
                  alt="Period Tracking Uncertainty"
                  className="w-full max-w-[280px] h-auto object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="md:col-span-7 space-y-3 text-center md:text-left">
              <Badge variant="rose" size="sm">
                {language === 'bn' ? 'অনিশ্চয়তা থেকে স্বস্তি' : 'Predictability & Peace of Mind'}
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-plum-900 tracking-tight">
                {language === 'bn'
                  ? 'ক্যালেন্ডারে প্রশ্নচিহ্ন আর দিন গোনার দুশ্চিন্তা দূর করুন'
                  : 'Say Goodbye to Question Marks & Cycle Uncertainty'}
              </h3>
              <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                {language === 'bn'
                  ? 'পিরিয়ড কখন শুরু হবে তা নিয়ে বিভ্রান্তি ও দুশ্চিন্তায় দিন কাটাতে হবে না। সাইকেলসেন্স এআই আপনার আগের সাইকেলগুলোর প্যাটার্ন বিশ্লেষণ করে বাস্তবসম্মত দিন গণনা ও লক্ষণ পর্যবেক্ষণ প্রদান করে।'
                  : 'Wondering when your next cycle will begin shouldn’t be stressful. CycleSense AI replaces guesswork with personalized rolling averages, transparent confidence ranges, and timely reminders.'}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-peach-50 border border-peach-200 text-xs font-semibold text-plum-800">
                  ✨ {language === 'bn' ? 'সঠিক দিন গণনা' : 'Empirical Rolling Averages'}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-lavender-50 border border-lavender-200 text-xs font-semibold text-plum-800">
                  🌿 {language === 'bn' ? 'লক্ষণ ও মেজাজ পর্যবেক্ষণ' : 'Holistic Symptom Insights'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <Badge variant="peach" size="md">
              {language === 'bn' ? 'সহজ ৩টি ধাপ' : 'Simple 3 Steps'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-plum-900 tracking-tight">
              {language === 'bn' ? 'সাইকেলসেন্স কীভাবে কাজ করে?' : 'How CycleSense AI Works'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-surface p-6 rounded-3xl border border-rose-100 text-center space-y-3 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center mx-auto text-base">
                1
              </div>
              <h4 className="font-bold text-base text-plum-900">
                {language === 'bn' ? 'পিরিয়ডের দিন রেকর্ড করুন' : 'Log Period Start & Flow'}
              </h4>
              <p className="text-xs text-plum-600 leading-relaxed">
                {language === 'bn'
                  ? 'আপনার মাসিকের শুরুর দিন ও রক্তপাতের ধরন কয়েকটি সহজ ক্লিকে রেকর্ড করে রাখুন।'
                  : 'Record Day 1 and peak bleeding duration. The app updates your rolling cycle average.'}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-3xl border border-rose-100 text-center space-y-3 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-peach-400 text-plum-900 font-bold flex items-center justify-center mx-auto text-base">
                2
              </div>
              <h4 className="font-bold text-base text-plum-900">
                {language === 'bn' ? 'লক্ষণ ও ব্যথার মাত্রা লিখুন' : 'Track Daily Symptoms'}
              </h4>
              <p className="text-xs text-plum-600 leading-relaxed">
                {language === 'bn'
                  ? 'তলপেটের ব্যথা, মেজাজ বা ঘুমের অবস্থা কয়েক সেকেন্ডের মধ্যে লিপিবদ্ধ করুন।'
                  : 'Track cramps, emotional shifts, skin breakouts, or energy drops throughout your cycle.'}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-3xl border border-rose-100 text-center space-y-3 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-lavender-400 text-plum-900 font-bold flex items-center justify-center mx-auto text-base">
                3
              </div>
              <h4 className="font-bold text-base text-plum-900">
                {language === 'bn' ? 'রিপোর্ট তৈরি ও ডাক্তারের পরামর্শ' : 'Export Clinical Summary'}
              </h4>
              <p className="text-xs text-plum-600 leading-relaxed">
                {language === 'bn'
                  ? 'গাইনি ডাক্তারের সাক্ষাতের জন্য পরিচ্ছন্ন পিডিএফ রিপোর্ট প্রস্তুত করুন।'
                  : 'Generate a print-ready health summary that gives your physician an empirical longitudinal view.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated PCOS Awareness Section */}
      <section id="pcos-awareness" className="py-20 px-4 lg:px-12 bg-gradient-to-br from-lavender-50/50 via-canvas to-peach-50/40 border-y border-rose-100">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="lavender" size="md">
                {language === 'bn' ? 'সচেতনতা ক্যাম্পেইন' : 'Evidence-Based Awareness'}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-plum-900 tracking-tight">
                {language === 'bn' 
                  ? 'পিসিওএস (PCOS) সম্পর্কে সঠিক ধারণা' 
                  : 'Understanding Polycystic Ovary Syndrome (PCOS)'}
              </h2>
            </div>
            <p className="text-xs text-plum-500 max-w-sm">
              {language === 'bn'
                ? '*সাইকেলসেন্স এআই রোগ নির্ণয় করে না; এটি সচেতনতা ও শিক্ষার উদ্দেশ্যে প্রস্তুত।'
                : '*CycleSense AI provides educational guidance, not a medical diagnosis.'}
            </p>
          </div>

          {/* Anatomical Awareness & Reproductive Kindness Banner */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-soft flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 bg-rose-50/70 rounded-3xl p-3 flex items-center justify-center border border-rose-100/80 shadow-xs">
              <img
                src="/images/uterus-cute.png"
                alt="Reproductive anatomy and uterine wellness"
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <Badge variant="rose" size="sm">
                {language === 'bn' ? 'শরীরের যত্ন ও সচেতনতা' : 'Anatomy Literacy & Care'}
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-plum-900">
                {language === 'bn' ? 'আপনার শরীরকে জানুন, যত্ন নিন নির্দ্বিধায়' : 'Demystifying Reproductive Health with Kindness'}
              </h3>
              <p className="text-xs sm:text-sm text-plum-600 leading-relaxed max-w-xl">
                {language === 'bn'
                  ? 'জরায়ু ও ডিম্বাশয়ের স্বাস্থ্য কোনো লজ্জার বিষয় নয়। মাসিকের সময় ক্র্যাম্পস, অনিয়মিত রক্তপাত কিংবা পিসিওএস—সবকিছুর পেছনে রয়েছে প্রাকৃতিক হরমোনের ক্রিয়া। সঠিক তথ্য জানা থাকলে ভয়ের বদলে সুস্থ থাকার আত্মবিশ্বাস তৈরি হয়।'
                  : 'Your uterus and ovaries orchestrate a complex hormonal rhythm every single month. Understanding how ovulation, progesterone, and estrogen fluctuate transforms confusion into empowered, proactive health choices.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-3xl border border-rose-100 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <HelpCircle className="w-5 h-5" />
                <span>{language === 'bn' ? 'সাধারণ বিভ্রান্তি বনাম বিজ্ঞান' : 'Myths vs. Medical Facts'}</span>
              </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-rose-50/60 rounded-xl">
                  <p className="font-semibold text-rose-800">
                    {language === 'bn' ? 'ভুল ধারণা: "পিসিওএস হলে কখনোই মা হওয়া যায় না"' : 'Myth: "PCOS means you can never have children."'}
                  </p>
                  <p className="text-plum-600 mt-1">
                    {language === 'bn'
                      ? 'বাস্তবতা: সঠিক পুষ্টি, জীবনযাত্রা ও চিকিৎসার মাধ্যমে অধিকাংশ নারীই সুস্থভাবে সন্তান ধারণ করতে পারেন।'
                      : 'Fact: With appropriate lifestyle management, ovulation induction, and medical support, most women with PCOS can conceive.'}
                  </p>
                </div>

                <div className="p-3 bg-lavender-50/60 rounded-xl">
                  <p className="font-semibold text-lavender-800">
                    {language === 'bn' ? 'ভুল ধারণা: "পিসিওএস কেবল অতিরিক্ত ওজনের নারীদের হয়"' : 'Myth: "Only overweight women get PCOS."'}
                  </p>
                  <p className="text-plum-600 mt-1">
                    {language === 'bn'
                      ? 'বাস্তবতা: তথাকথিত "Lean PCOS" স্বাভাবিক ওজনের নারীদেরও হতে পারে।'
                      : 'Fact: "Lean PCOS" affects individuals with typical or low BMI due to genetic androgen sensitivity.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-3xl border border-rose-100 shadow-soft flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-lavender-700 font-bold text-base">
                  <Stethoscope className="w-5 h-5" />
                  <span>{language === 'bn' ? 'কখন পরীক্ষা করাবেন?' : 'When to Seek Clinical Evaluation'}</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-plum-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-600 shrink-0" />
                    <span>{language === 'bn' ? 'বছরে ৮টির কম পিরিয়ড হওয়া বা ৩৫+ দিন পর পর মাসিক হওয়া' : 'Fewer than 8 periods per year or cycles consistently >35 days'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-600 shrink-0" />
                    <span>{language === 'bn' ? 'চিবুক, বুক বা পেটে অস্বাভাবিক লোম ও নাছোড়বান্দা ব্রণ' : 'Unexplained hirsutism on chin/chest or persistent jawline acne'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-600 shrink-0" />
                    <span>{language === 'bn' ? 'ঘাড় বা বগলের ভাঁজে ত্বক কালচে হয়ে যাওয়া (Acanthosis Nigricans)' : 'Darkened velvety skin patches indicating insulin resistance'}</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => promptAuth('education', 'PCOS & Health Education Library', 'পিসিওএস ও স্বাস্থ্য শিক্ষা লাইব্রেরি')}
                className="w-full text-xs sm:text-sm"
              >
                {language === 'bn' ? 'সম্পূর্ণ পিসিওএস গাইড পড়ুন' : 'Explore Full PCOS Resource Library'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Module 2: Menstrual & Mental Health Harmony Section */}
      <section id="mental-health" className="py-20 px-4 lg:px-12 bg-gradient-to-b from-canvas via-lavender-50/40 to-canvas border-b border-rose-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="lavender" size="md">
              {language === 'bn' ? 'মডিউল ২ · মানসিক স্বাস্থ্য ও সুস্থতা' : 'Module 2 · Mind-Body Emotional Wellness'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-plum-900 tracking-tight">
              {language === 'bn'
                ? 'পিরিয়ড ও মানসিক স্বাস্থ্যের গভীর মেলবন্ধন'
                : 'The Vital Connection: Period Health & Mental Health'}
            </h2>
            <p className="text-sm sm:text-base text-plum-600 leading-relaxed">
              {language === 'bn'
                ? 'হরমোনের তারতম্য কেবল শরীরের ওপর নয়, আমাদের চিন্তা, মেজাজ ও আবেগেও প্রভাব ফেলে। আত্ম-সমালোচনা নয়, সহানুভূতিশীল যত্নই সুস্থতার চাবিকাঠি।'
                : 'Your cycle does not just affect your body—it influences neurotransmitters, stress sensitivity, and energy rhythms. Discover compassionate self-care backed by medical science.'}
            </p>
          </div>

          {/* 3 Visual Illustration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Periods & Mental Health */}
            <div className="bg-surface rounded-3xl p-6 border border-rose-100/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden bg-rose-50/60 p-3 border border-rose-100 flex items-center justify-center">
                  <img
                    src="/images/periods-and-mental-health.jpg"
                    alt="Periods and mental health illustration"
                    className="w-full max-h-56 object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl"
                  />
                </div>
                <Badge variant="rose" size="sm">
                  {language === 'bn' ? 'পিএমএস ও সংবেদনশীলতা' : 'PMS & Thought Clutter'}
                </Badge>
                <h3 className="font-bold text-lg text-plum-900 leading-snug">
                  {language === 'bn'
                    ? 'পিরিয়ডের আগের অস্থিরতা ও অতিরিক্ত চিন্তা'
                    : 'Navigating Overwhelm & Thought Tangles'}
                </h3>
                <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                  {language === 'bn'
                    ? 'মাসিকের আগে লিউটিয়াল ফেজে ইস্ট্রোজেন ও প্রোজেস্টেরনের পতনের কারণে মস্তিষ্কে সেরোটোনিন কমে যেতে পারে। এটি দুর্বলতা নয়, বরং প্রাকৃতিক হরমোনের ক্রিয়া।'
                    : 'Late luteal estrogen drops affect brain serotonin pathways. Recognizing this biological connection eliminates self-blame and fosters gentleness.'}
                </p>
              </div>
            </div>

            {/* Card 2: Box Breathing & Meditating Brain */}
            <div className="bg-surface rounded-3xl p-6 border border-rose-100/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden bg-lavender-50/60 p-3 border border-lavender-100 flex items-center justify-center">
                  <img
                    src="/images/meditating-brain.png"
                    alt="Meditating brain practicing box breathing"
                    className="w-full max-h-56 object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <Badge variant="lavender" size="sm">
                  {language === 'bn' ? 'শান্ত শ্বাসপ্রশ্বাস ও মন' : 'Mindfulness & Grounding'}
                </Badge>
                <h3 className="font-bold text-lg text-plum-900 leading-snug">
                  {language === 'bn'
                    ? '৪-৪-৪-৪ বক্স ব্রিদিং ও স্নায়ু শিথিলকরণ'
                    : 'Gentle Box Breathing & Vagus Nerve Calm'}
                </h3>
                <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                  {language === 'bn'
                    ? 'প্রতিদিন ৩-৫ মিনিটের বক্স ব্রিদিং এবং ৫-৪-৩-২-১ ইন্দ্রিয় গ্রাউন্ডিং টেকনিক প্যানিক ও উদ্বেগ প্রশমিত করতে সাহায্য করে।'
                    : 'Practice 4-4-4-4 box breathing and 5-4-3-2-1 sensory grounding to lower acute cortisol levels and steady your nervous system.'}
                </p>
              </div>
            </div>

            {/* Card 3: The Connection Between Menstrual & Mental Health */}
            <div className="bg-surface rounded-3xl p-6 border border-rose-100/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden bg-peach-50/60 p-3 border border-peach-200 flex items-center justify-center">
                  <img
                    src="/images/connection-menstrual-mental-health.png"
                    alt="The connection between menstrual health and mental health"
                    className="w-full max-h-56 object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl"
                  />
                </div>
                <Badge variant="peach" size="sm">
                  {language === 'bn' ? 'পারস্পরিক বোঝাপড়া' : 'Cycle & Mood Synergy'}
                </Badge>
                <h3 className="font-bold text-lg text-plum-900 leading-snug">
                  {language === 'bn'
                    ? 'মন ও শরীরের সংযোগ—গোপনীয়তা অক্ষুণ্ণ রেখে'
                    : 'Correlation Without Compromising Privacy'}
                </h3>
                <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                  {language === 'bn'
                    ? 'আপনার মানসিক স্বাস্থ্য ও পিরিয়ড ডেটা লিঙ্ক করে ফেজ-ভিত্তিক ট্রেন্ড দেখুন অথবা সম্পূর্ণ আলাদা রাখুন—পছন্দ সবসময়ই আপনার।'
                    : 'Optionally link your cycle and mood logs for holistic insights, or keep them strictly decoupled with full privacy at the flip of a switch.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action button to explore Mental Health module */}
          <div className="text-center pt-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => promptAuth('mentalHealth', 'Mental Health & Mood Journal', 'মানসিক স্বাস্থ্য ও মুড জার্নাল')}
              className="text-xs sm:text-sm px-6 py-3 shadow-md"
            >
              {language === 'bn' ? 'মানসিক স্বাস্থ্য ও মুড জার্নাল দেখুন' : 'Explore Mental Health & Mood Journal'}
            </Button>
          </div>
        </div>
      </section>

      {/* Privacy-First Section */}
      <section id="privacy" className="py-20 px-4 lg:px-12 bg-surface">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 rounded-3xl bg-sage-100 text-sage-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-plum-900 tracking-tight">
            {language === 'bn'
              ? 'আপনার স্বাস্থ্য তথ্য, একান্তই আপনার নিয়ন্ত্রণে'
              : 'Your Reproductive Data Belongs Strictly to You'}
          </h2>

          <p className="text-sm sm:text-base text-plum-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'আপনার সংবেদনশীল তথ্য কখনো তৃতীয় পক্ষের বিজ্ঞাপনদাতাদের সাথে শেয়ার করা হয় না। যে কোনো সময় এক ক্লিকে সমস্ত তথ্য মুছে ফেলা বা ডাউনলোড করা যায়।'
              : 'CycleSense AI adheres to privacy-by-design. Your sensitive health logs are kept confidential, never monetized to advertisers, and under your absolute deletion control at any moment.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 bg-canvas rounded-2xl border border-rose-100/70">
              <span className="font-bold text-sm text-plum-900 block mb-1">
                {language === 'bn' ? 'প্রাইভেসি শিল্ড মোড' : 'Privacy Shield Mode'}
              </span>
              <p className="text-xs text-plum-500">
                {language === 'bn'
                  ? 'পাবলিক প্লেসে স্ক্রিনে সংবেদনশীল তথ্য আবছা করার সুবিধা।'
                  : 'Instantly blur sensitive flow and pain scores in shared environments.'}
              </p>
            </div>

            <div className="p-4 bg-canvas rounded-2xl border border-rose-100/70">
              <span className="font-bold text-sm text-plum-900 block mb-1">
                {language === 'bn' ? 'এক ক্লিকে ডেটা এক্সপোর্ট' : 'One-Click Data Portability'}
              </span>
              <p className="text-xs text-plum-500">
                {language === 'bn'
                  ? 'আপনার সমস্ত সংরক্ষিত তথ্য JSON ফরম্যাটে ডাউনলোড করুন।'
                  : 'Export all cycles, symptoms, and notes to open JSON format anytime.'}
              </p>
            </div>

            <div className="p-4 bg-canvas rounded-2xl border border-rose-100/70">
              <span className="font-bold text-sm text-plum-900 block mb-1">
                {language === 'bn' ? 'সম্পূর্ণ তথ্য মুছে ফেলা' : 'Absolute Erasure'}
              </span>
              <p className="text-xs text-plum-500">
                {language === 'bn'
                  ? 'একটি ক্লিকেই অ্যাকাউন্ট ও সমস্ত শারীরিক রেকর্ড সম্পূর্ণ মুছে ফেলা সম্ভব।'
                  : 'Delete individual entries or purge your entire account with zero remnants.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-plum-950 text-plum-200 py-12 px-4 lg:px-12 border-t border-plum-900">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center gap-2.5 pb-6 border-b border-plum-800/80">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-lavender-400 flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-white/20 stroke-[2.2]" />
            </div>
            <span className="font-bold text-lg text-white">
              CycleSense<span className="text-rose-400">.ai</span>
            </span>
          </div>

          <div className="space-y-3 text-xs text-plum-400 leading-relaxed">
            <p>
              <strong>{language === 'bn' ? 'চিকিৎসা সংক্রান্ত অস্বীকৃতি (Medical Disclaimer):' : 'Medical Disclaimer:'}</strong>{' '}
              {language === 'bn'
                ? 'সাইকেলসেন্স এআই প্ল্যাটফর্মে প্রদত্ত তথ্য শুধুমাত্র স্বাস্থ্য শিক্ষা ও সচেতনতার উদ্দেশ্যে তৈরি। এটি কোনো নিবন্ধিত চিকিৎসকের বিকল্প পরামর্শ, প্রেসক্রিপশন বা রোগ নির্ণয় নয়। জরুরি স্বাস্থ্য পরিস্থিতিতে অবশ্যই হাসপাতালে যোগাযোগ করুন।'
                : 'The content provided across CycleSense AI is intended solely for educational, observational, and health literacy purposes. It is not a substitute for clinical diagnosis, medical evaluation, or individualized treatment plans from a licensed healthcare provider.'}
            </p>
            <p className="text-[11px] text-plum-500 pt-2 leading-relaxed">
              © 2026 CycleSense AI. Developed by Nazrana Nahreen, inspired by personal life experiences with menstrual and mental health challenges and a passion for helping women better understand their bodies, manage their well-being, and feel supported throughout their health journey.
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Authentication Prompt Modal */}
      {authModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-plum-950/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-surface max-w-md w-full rounded-3xl p-5 sm:p-8 shadow-2xl border border-rose-200 text-center space-y-4 sm:space-y-5 animate-scaleUp my-auto max-h-[92vh] overflow-y-auto">
            {/* Lock Icon */}
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.2]" />
            </div>

            {/* Title & Context */}
            <div className="space-y-1">
              <Badge variant="rose" size="sm">
                {language === 'bn' ? 'প্রবেশাধিকার সংরক্ষিত' : 'Authentication Required'}
              </Badge>
              <h3 className="text-lg sm:text-2xl font-extrabold text-plum-900 tracking-tight">
                {language === 'bn' ? 'সাইন ইন বা রেজিস্ট্রেশন আবশ্যক' : 'Sign Up or Log In Required'}
              </h3>
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 py-1 px-3 rounded-full inline-block border border-rose-100 mt-1">
                {language === 'bn' ? authModal.titleBn : authModal.titleEn}
              </p>
            </div>

            {/* Crucial Explanatory Notice */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-canvas border border-rose-100 text-xs sm:text-sm text-plum-800 leading-relaxed text-left space-y-2">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="font-semibold text-plum-900">
                  {language === 'bn'
                    ? 'আপনাকে প্রথমে সাইন আপ অথবা লগ ইন করতে হবে, অন্যথায় কোনো অভ্যন্তরীণ তথ্য বা ডেটা দেখানো হবে না।'
                    : 'You need to sign up first or log in first, otherwise no inside data will be shown.'}
                </p>
              </div>
              <p className="text-plum-600 pl-6 text-[11px] leading-normal">
                {language === 'bn'
                  ? 'আপনার স্বাস্থ্য তথ্য ও প্রজনন স্বাস্থ্যের ডেটা সম্পূর্ণ সুরক্ষিত রাখতে সকল অভ্যন্তরীণ সেবা কেবল নিবন্ধিত ব্যবহারকারীদের জন্য উন্মুক্ত।'
                  : 'For medical integrity and personal data privacy, all cycle tracking tools, symptom diaries, and educational libraries remain strictly locked.'}
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setRedirectAfterAuth(authModal.page);
                  setAuthRequiredNotice(
                    language === 'bn'
                      ? 'আপনাকে প্রথমে সাইন আপ অথবা লগ ইন করতে হবে, অন্যথায় কোনো অভ্যন্তরীণ তথ্য বা ডেটা দেখানো হবে না।'
                      : 'You need to sign up first or log in first, otherwise no inside data will be shown.'
                  );
                  setAuthModal({ ...authModal, isOpen: false });
                  setCurrentPage('auth_signin');
                }}
                className="w-full justify-center shadow-md shadow-rose-500/20 text-xs sm:text-sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span>{language === 'bn' ? 'আপনার অ্যাকাউন্টে লগ ইন করুন (Log In)' : 'Sign In to Your Account (Log In)'}</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setRedirectAfterAuth(authModal.page);
                  setAuthRequiredNotice(
                    language === 'bn'
                      ? 'আপনাকে প্রথমে সাইন আপ অথবা লগ ইন করতে হবে, অন্যথায় কোনো অভ্যন্তরীণ তথ্য বা ডেটা দেখানো হবে না।'
                      : 'You need to sign up first or log in first, otherwise no inside data will be shown.'
                  );
                  setAuthModal({ ...authModal, isOpen: false });
                  setCurrentPage('auth_signup');
                }}
                className="w-full justify-center text-xs sm:text-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span>{language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন (Sign Up)' : 'Create Free Account (Sign Up)'}</span>
              </Button>

              <button
                onClick={() => setAuthModal({ ...authModal, isOpen: false })}
                className="pt-1.5 text-xs font-semibold text-plum-500 hover:text-plum-800 transition-colors cursor-pointer"
              >
                {language === 'bn' ? '✕ বাতিল করুন / হোমপেজে থাকুন' : '✕ Stay on Landing Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
