import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authApi } from '../services/api';
import { 
  Heart, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  Check
} from 'lucide-react';
import { Button } from '../components/common/Button';

type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset' | 'verify';

interface AuthPageProps {
  initialMode?: AuthMode;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signin' }) => {
  const { setCurrentPage, setIsLoggedIn, updateUserProfile, language, setLanguage, t } = useApp();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form Fields
  const [name, setName] = useState('Amina Rahman');
  const [email, setEmail] = useState('amina.rahman@example.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [confirmPassword, setConfirmPassword] = useState('SecurePass123!');
  const [preferredLang, setPreferredLang] = useState<'en' | 'bn'>('en');
  const [consent, setConsent] = useState(true);
  const [resetCode, setResetCode] = useState('482910');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (mode === 'signin') {
      if (!email.includes('@')) {
        setErrorMessage(language === 'bn' ? 'সঠিক ইমেইল প্রদান করুন।' : 'Please enter a valid email address.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMessage(language === 'bn' ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
        setIsLoading(false);
        return;
      }

      try {
        const res = await authApi.login(email.trim(), password);
        if (res.user) {
          updateUserProfile({
            name: res.user.name,
            email: res.user.email,
            preferredLanguage: res.user.preferred_language,
            targetCycleLength: res.user.cycle_length_days,
            targetPeriodDuration: res.user.period_duration_days,
          });
          setLanguage(res.user.preferred_language);
        }
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
      } catch (err: any) {
        if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
          // Fallback to local session if backend server is not running
          setIsLoggedIn(true);
          setCurrentPage('dashboard');
        } else {
          setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
        }
      } finally {
        setIsLoading(false);
      }
    } else if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage(language === 'bn' ? 'আপনার নাম লিখুন।' : 'Please enter your name.');
        setIsLoading(false);
        return;
      }
      if (!email.includes('@')) {
        setErrorMessage(language === 'bn' ? 'সঠিক ইমেইল ঠিকানা দিন।' : 'Please enter a valid email address.');
        setIsLoading(false);
        return;
      }
      if (password.length < 8) {
        setErrorMessage(language === 'bn' ? 'পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।' : 'Password must be at least 8 characters.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage(language === 'bn' ? 'পাসওয়ার্ড মেলেনি।' : 'Passwords do not match.');
        setIsLoading(false);
        return;
      }
      if (!consent) {
        setErrorMessage(
          language === 'bn' 
            ? 'সংবেদনশীল স্বাস্থ্য তথ্য প্রক্রিয়াকরণে সম্মতি প্রদান করুন।' 
            : 'Please consent to sensitive health data processing.'
        );
        setIsLoading(false);
        return;
      }

      try {
        const res = await authApi.register({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          preferredLanguage: preferredLang,
          consent: true,
        });
        if (res.user) {
          updateUserProfile({
            name: res.user.name,
            email: res.user.email,
            preferredLanguage: res.user.preferred_language,
            targetCycleLength: res.user.cycle_length_days,
            targetPeriodDuration: res.user.period_duration_days,
            consentGiven: true,
          });
          setLanguage(res.user.preferred_language);
        }
        setSuccessMessage(
          language === 'bn'
            ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...'
            : 'Account registered successfully! Redirecting to dashboard...'
        );
        setTimeout(() => {
          setIsLoggedIn(true);
          setCurrentPage('dashboard');
        }, 700);
      } catch (err: any) {
        if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
          updateUserProfile({
            name: name.trim(),
            email: email.trim(),
            preferredLanguage: preferredLang,
            consentGiven: true,
          });
          setLanguage(preferredLang);
          setMode('verify');
        } else {
          setErrorMessage(err.message || 'Registration failed.');
        }
      } finally {
        setIsLoading(false);
      }
    } else if (mode === 'forgot') {
      if (!email.includes('@')) {
        setErrorMessage(language === 'bn' ? 'সঠিক ইমেইল দিন।' : 'Please enter a valid email.');
        setIsLoading(false);
        return;
      }
      setSuccessMessage(
        language === 'bn' 
          ? 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।' 
          : 'Password reset link sent! Check your inbox or proceed with code verification.'
      );
      setIsLoading(false);
      setTimeout(() => setMode('reset'), 1000);
    } else if (mode === 'reset') {
      if (password.length < 8) {
        setErrorMessage(language === 'bn' ? 'নতুন পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।' : 'New password must be at least 8 characters.');
        setIsLoading(false);
        return;
      }
      setSuccessMessage(
        language === 'bn' 
          ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন লগ ইন করুন।' 
          : 'Password successfully updated! Please sign in.'
      );
      setIsLoading(false);
      setTimeout(() => setMode('signin'), 1200);
    } else if (mode === 'verify') {
      setSuccessMessage(
        language === 'bn' 
          ? 'ইমেইল সফলভাবে নিশ্চিত করা হয়েছে!' 
          : 'Email verified successfully!'
      );
      setIsLoading(false);
      setTimeout(() => {
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Brand Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          onClick={() => setCurrentPage('landing')}
          className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-lavender-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Heart className="w-5 h-5 fill-white/20 stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-2xl text-plum-900 tracking-tight">
            CycleSense<span className="text-rose-500">.ai</span>
          </span>
        </button>

        <h2 className="text-2xl font-bold tracking-tight text-plum-900">
          {mode === 'signin' && (language === 'bn' ? 'অ্যাকাউন্টে লগ ইন করুন' : 'Sign in to your account')}
          {mode === 'signup' && (language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create your secure account')}
          {mode === 'forgot' && (language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Reset your password')}
          {mode === 'reset' && (language === 'bn' ? 'নতুন পাসওয়ার্ড নির্ধারণ' : 'Set new password')}
          {mode === 'verify' && (language === 'bn' ? 'ইমেইল নিশ্চিতকরণ' : 'Verify your email')}
        </h2>

        <p className="mt-1 text-xs text-plum-500">
          {mode === 'signin' && (language === 'bn' ? 'আপনার ব্যক্তিগত ড্যাশবোর্ডে প্রবেশ করুন' : 'Access your personalized cycle tracker')}
          {mode === 'signup' && (language === 'bn' ? 'কোনো অপ্রয়োজনীয় স্বাস্থ্য তথ্য চাওয়া হবে না' : 'We do not ask for unnecessary health details')}
        </p>

        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-peach-800 text-[11px] font-medium border border-peach-200">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
          <span>
            {language === 'bn' 
              ? 'ডেমো সিমুলেশন: কোনো সার্ভার ব্যাকএন্ড এখনো সংযুক্ত নয়' 
              : 'Frontend Prototype: Client-side mock authentication'}
          </span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-surface py-8 px-6 shadow-soft-lg rounded-3xl border border-rose-100/90 sm:px-10">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-sage-50 border border-sage-200 text-sage-700 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SIGN UP: Name */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-plum-700 mb-1">
                  {language === 'bn' ? 'আপনার পুরো নাম' : 'Full Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-plum-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g., Amina Rahman"
                    className="w-full bg-canvas border border-rose-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                  />
                </div>
              </div>
            )}

            {/* Email Field (Used in signin, signup, forgot) */}
            {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && (
              <div>
                <label className="block text-xs font-semibold text-plum-700 mb-1">
                  {language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-plum-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full bg-canvas border border-rose-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                  />
                </div>
              </div>
            )}

            {/* Password Field (Used in signin, signup, reset) */}
            {(mode === 'signin' || mode === 'signup' || mode === 'reset') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-plum-700">
                    {mode === 'reset'
                      ? (language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password')
                      : (language === 'bn' ? 'পাসওয়ার্ড' : 'Password')}
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-plum-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-canvas border border-rose-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-plum-400 hover:text-plum-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password Field (Used in signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-plum-700 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-plum-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-canvas border border-rose-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-plum-400 hover:text-plum-700 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Preferred Language Selection (Used in signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-plum-700 mb-1">
                  {language === 'bn' ? 'পছন্দের ভাষা' : 'Preferred Language'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferredLang('en')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      preferredLang === 'en'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-rose-100 bg-canvas text-plum-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredLang('bn')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer font-bengali ${
                      preferredLang === 'bn'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-rose-100 bg-canvas text-plum-600'
                    }`}
                  >
                    বাংলা (Bengali)
                  </button>
                </div>
              </div>
            )}

            {/* Verification Code input (Used in verify or reset) */}
            {(mode === 'verify' || mode === 'reset') && (
              <div>
                <label className="block text-xs font-semibold text-plum-700 mb-1">
                  {language === 'bn' ? 'যাচাইকরণ কোড (৬ সংখ্যা)' : 'Verification Code (6-digits)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-plum-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value)}
                    required
                    placeholder="482910"
                    className="w-full bg-canvas border border-rose-200 rounded-xl pl-10 pr-3 py-2.5 text-sm tracking-widest text-plum-900 font-mono focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                  />
                </div>
              </div>
            )}

            {/* Consent Checkbox for sensitive health information (Used in signup) */}
            {mode === 'signup' && (
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-rose-600 rounded border-rose-300 focus:ring-rose-500 cursor-pointer"
                  />
                  <span className="text-xs text-plum-600 leading-snug">
                    {language === 'bn'
                      ? 'আমি সংবেদনশীল মাসিক স্বাস্থ্য তথ্য ট্র্যাকিং ও বিশ্লেষণের জন্য সম্মতি প্রদান করছি। আমার তথ্য কখনো বিজ্ঞাপনের জন্য বিক্রয় করা হবে না।'
                      : 'I consent to the confidential storage and processing of my menstrual health data for observational tracking. CycleSense will never sell my data.'}
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full text-sm font-semibold rounded-xl py-3 mt-4"
            >
              {mode === 'signin' && (language === 'bn' ? 'লগ ইন করুন' : 'Sign In')}
              {mode === 'signup' && (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
              {mode === 'forgot' && (language === 'bn' ? 'রিসেট লিংক পাঠান' : 'Send Reset Code')}
              {mode === 'reset' && (language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন নিশ্চিত করুন' : 'Confirm Password Update')}
              {mode === 'verify' && (language === 'bn' ? 'কোড যাচাই করে প্রবেশ করুন' : 'Verify & Enter Dashboard')}
            </Button>
          </form>

          {/* Bottom Switcher Links */}
          <div className="mt-6 pt-5 border-t border-rose-100/80 text-center text-xs text-plum-600">
            {mode === 'signin' && (
              <p>
                {language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলতে চান? ' : "Don't have an account yet? "}
                <button
                  onClick={() => { setMode('signup'); setErrorMessage(null); }}
                  className="font-bold text-rose-600 hover:text-rose-800 cursor-pointer underline"
                >
                  {language === 'bn' ? 'শুরু করুন' : 'Sign up now'}
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p>
                {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? ' : 'Already have an account? '}
                <button
                  onClick={() => { setMode('signin'); setErrorMessage(null); }}
                  className="font-bold text-rose-600 hover:text-rose-800 cursor-pointer underline"
                >
                  {language === 'bn' ? 'লগ ইন করুন' : 'Sign in'}
                </button>
              </p>
            )}

            {(mode === 'forgot' || mode === 'reset' || mode === 'verify') && (
              <button
                onClick={() => { setMode('signin'); setErrorMessage(null); }}
                className="inline-flex items-center gap-1 font-semibold text-plum-600 hover:text-plum-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লগ ইন পেজে ফিরে যান' : 'Back to sign in'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
