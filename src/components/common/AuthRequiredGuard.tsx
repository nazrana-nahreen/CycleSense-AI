import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Heart, ArrowRight, UserPlus, LogIn, Home, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

interface AuthRequiredGuardProps {
  attemptedPage?: string;
}

export const AuthRequiredGuard: React.FC<AuthRequiredGuardProps> = ({ attemptedPage }) => {
  const { setCurrentPage, language, setRedirectAfterAuth, setAuthRequiredNotice, t } = useApp();

  const handleSignIn = () => {
    if (attemptedPage) {
      setRedirectAfterAuth(attemptedPage);
    }
    setAuthRequiredNotice(
      language === 'bn'
        ? 'এই সেবাটি দেখতে অনুগ্রহ করে আপনার অ্যাকাউন্টে সাইন ইন করুন।'
        : 'Please sign in to access this CycleSense AI service.'
    );
    setCurrentPage('auth_signin');
  };

  const handleSignUp = () => {
    if (attemptedPage) {
      setRedirectAfterAuth(attemptedPage);
    }
    setAuthRequiredNotice(
      language === 'bn'
        ? 'এই সেবাটি ব্যবহার করতে অনুগ্রহ করে একটি ফ্রি অ্যাকাউন্ট তৈরি করুন।'
        : 'Please create a free account to access this CycleSense AI service.'
    );
    setCurrentPage('auth_signup');
  };

  const handleGoHome = () => {
    setCurrentPage('landing');
  };

  const getPageName = (page?: string) => {
    switch (page) {
      case 'education':
        return language === 'bn' ? 'পিসিওএস ও স্বাস্থ্য শিক্ষা লাইব্রেরি' : 'PCOS & Health Education Library';
      case 'calendar':
        return language === 'bn' ? 'মেনস্ট্রুয়াল ক্যালেন্ডার' : 'Menstrual Cycle Calendar';
      case 'symptoms':
        return language === 'bn' ? 'লক্ষণ ট্র্যাকার' : 'Daily Symptom Tracker';
      case 'insights':
        return language === 'bn' ? 'সাইকেল অ্যানালিটিক্স' : 'Cycle Insights & Trends';
      case 'mentalHealth':
        return language === 'bn' ? 'মানসিক স্বাস্থ্য ও মুড জার্নাল' : 'Mental Health & Mood Journal';
      case 'aiAssistant':
        return language === 'bn' ? 'এআই স্বাস্থ্য সহায়ক' : 'AI Health Assistant';
      case 'reports':
        return language === 'bn' ? 'ক্লিনিক্যাল হেলথ রিপোর্ট' : 'Clinical Health Reports';
      case 'profile':
        return language === 'bn' ? 'প্রোফাইল ও ডেটা প্রাইভেসি' : 'User Profile & Data Privacy';
      case 'settings':
        return language === 'bn' ? 'অ্যাপ সেটিংস' : 'Application Settings';
      default:
        return language === 'bn' ? 'অভ্যন্তরীণ স্বাস্থ্য সেবা' : 'Protected Health Service';
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between font-sans selection:bg-rose-100 selection:text-rose-800">
      {/* Top Simple Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-rose-100/70 bg-surface/80 backdrop-blur-md">
        <div 
          onClick={handleGoHome}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-xl text-plum-900 tracking-tight">
            CycleSense<span className="text-rose-500">.ai</span>
          </span>
        </div>

        <button
          onClick={handleGoHome}
          className="text-xs font-semibold text-plum-600 hover:text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{language === 'bn' ? 'হোমপেজ' : 'Public Home'}</span>
        </button>
      </header>

      {/* Main Guard Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-surface rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xl space-y-6 text-center animate-fadeIn">
          {/* Lock Icon with Pulsing Effect */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-rose-200/50 animate-ping opacity-75" />
            <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Lock className="w-8 h-8 stroke-[2.2]" />
            </div>
          </div>

          {/* Badges & Target Context */}
          <div className="space-y-2">
            <Badge variant="rose" size="md">
              {language === 'bn' ? 'প্রবেশাধিকার সংরক্ষিত · অথেনটিকেশন আবশ্যক' : 'Protected Area · Authentication Required'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-plum-900 tracking-tight">
              {language === 'bn' 
                ? 'অনুগ্রহ করে প্রথমে সাইন আপ অথবা লগ ইন করুন' 
                : 'Sign Up or Log In Required'}
            </h2>
            {attemptedPage && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 py-1 px-3 rounded-full inline-block border border-rose-100">
                {language === 'bn' ? 'অনুরোধকৃত সেবা:' : 'Requested Service:'} {getPageName(attemptedPage)}
              </p>
            )}
          </div>

          {/* Detailed Clinical & Privacy Notice */}
          <div className="p-4 rounded-2xl bg-canvas border border-rose-100 text-xs sm:text-sm text-plum-700 leading-relaxed text-left space-y-2.5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <p>
                {language === 'bn'
                  ? 'আপনার প্রজনন স্বাস্থ্য, পিরিয়ড হিস্টোরি এবং মানসিক সুস্থতার তথ্যের সর্বোচ্চ গোপনীয়তা ও সুরক্ষার জন্য সকল সেবা অথেনটিকেটেড অ্যাকাউন্টের আওতাভুক্ত।'
                  : 'For privacy, medical integrity, and clinical safety, all cycle tracking tools, symptom logs, and health libraries are accessible only to authenticated users.'}
              </p>
            </div>
            <p className="text-plum-600 font-medium pl-7">
              {language === 'bn'
                ? 'লগ ইন বা সাইন আপ না করা পর্যন্ত কোনো অভ্যন্তরীণ ডেটা বা টুলস প্রদর্শিত হবে না।'
                : 'No inside records, predictions, or health journals will be displayed until you authenticate.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSignUp}
              className="w-full justify-center shadow-md shadow-rose-500/20"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span>{language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন (Sign Up)' : 'Create Free Account (Sign Up)'}</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleSignIn}
              className="w-full justify-center"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span>{language === 'bn' ? 'পূর্ববর্তী অ্যাকাউন্টে লগ ইন করুন (Log In)' : 'Sign In to Your Account (Log In)'}</span>
            </Button>

            <button
              onClick={handleGoHome}
              className="w-full pt-2 text-xs font-semibold text-plum-500 hover:text-plum-800 transition-colors cursor-pointer"
            >
              {language === 'bn' ? '← পাবলিক হোমপেজে ফিরে যান' : '← Return to Public Home'}
            </button>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="text-center py-4 px-4 text-[11px] text-plum-400 border-t border-rose-100/50">
        {language === 'bn'
          ? 'CycleSense AI • গোপনীয়তা-বান্ধব নারী স্বাস্থ্য প্ল্যাটফর্ম'
          : 'CycleSense AI • Privacy-First Women’s Health Platform'}
      </footer>
    </div>
  );
};
