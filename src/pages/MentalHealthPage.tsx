import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { 
  Brain, 
  Smile, 
  Wind, 
  HeartHandshake, 
  ShieldCheck, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  Moon, 
  BatteryMedium, 
  Sparkles,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  Info
} from 'lucide-react';
import { MoodScore } from '../types';

export const MentalHealthPage: React.FC = () => {
  const { 
    mentalHealthEntries, 
    user, 
    toggleMentalHealthCycleLink, 
    language, 
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dailyMood' | 'breathing' | 'connection' | 'support'>('dailyMood');

  // Breathing Box Timer State (4s Inhale -> 4s Hold -> 4s Exhale -> 4s Rest)
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);

  // Info modal for next step form
  const [showNextStepNotice, setShowNextStepNotice] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Cycle through phases
            setBreathingPhase((curr) => {
              if (curr === 'inhale') return 'hold1';
              if (curr === 'hold1') return 'exhale';
              if (curr === 'exhale') return 'hold2';
              return 'inhale';
            });
            return 4;
          }
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathingActive]);

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('inhale');
    setSecondsLeft(4);
  };

  // Helper translations for breathing cues
  const getBreathingCue = () => {
    switch (breathingPhase) {
      case 'inhale':
        return language === 'bn' ? 'গভীর শ্বাস নিন (৪ সেকেন্ড)' : 'Inhale deeply through your nose (4s)';
      case 'hold1':
        return language === 'bn' ? 'শ্বাস ধরে রাখুন (৪ সেকেন্ড)' : 'Hold your breath gently (4s)';
      case 'exhale':
        return language === 'bn' ? 'ধীরে ধীরে শ্বাস ছাড়ুন (৪ সেকেন্ড)' : 'Exhale slowly through your mouth (4s)';
      case 'hold2':
        return language === 'bn' ? 'বিশ্রাম ও শান্ত থাকুন (৪ সেকেন্ড)' : 'Rest and stay still (4s)';
    }
  };

  // Mood Score Helper (1-5 scale)
  const getMoodEmoji = (score: MoodScore) => {
    switch (score) {
      case 1: return { emoji: '🌧️', labelEn: 'Very Low', labelBn: 'খুব বিষণ্ণ', color: 'text-blue-500' };
      case 2: return { emoji: '☁️', labelEn: 'Low', labelBn: 'মন খারাপ', color: 'text-indigo-400' };
      case 3: return { emoji: '⛅', labelEn: 'Okay', labelBn: 'মোটামুটি', color: 'text-amber-500' };
      case 4: return { emoji: '🌸', labelEn: 'Good', labelBn: 'ভালো', color: 'text-rose-500' };
      case 5: return { emoji: '☀️', labelEn: 'Great', labelBn: 'চমৎকার', color: 'text-amber-600' };
    }
  };

  // Calculate high-level summary KPIs
  const isLinked = user.linkMentalHealthWithCycle !== false;
  const totalEntries = mentalHealthEntries.length;
  const averageMood = totalEntries > 0 
    ? (mentalHealthEntries.reduce((acc, curr) => acc + curr.moodScore, 0) / totalEntries).toFixed(1)
    : '4.0';
  const averageSleep = totalEntries > 0
    ? (mentalHealthEntries.reduce((acc, curr) => acc + curr.sleepHours, 0) / totalEntries).toFixed(1)
    : '7.5';

  const latestEntry = mentalHealthEntries.length > 0 ? mentalHealthEntries[0] : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header & Module Identification */}
      <div className="bg-gradient-to-r from-plum-900 via-plum-800 to-rose-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-lavender-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-400/25 border border-rose-300/40 text-rose-200">
                {language === 'bn' ? 'মডিউল ২ · মানসিক স্বাস্থ্য' : 'Module 2 · Mental Health'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/80">
                {language === 'bn' ? 'মন ও শরীরের সুস্থতা' : 'Mind & Emotional Wellbeing'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {t.mentalHealth.title}
            </h1>
            <p className="text-xs sm:text-base text-rose-100/90 max-w-2xl font-normal leading-relaxed">
              {t.mentalHealth.subtitle}
            </p>
          </div>

          {/* Privacy & Cycle Linking Opt-in / Opt-out Toggle */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 sm:p-4 rounded-2xl shrink-0 w-full md:max-w-xs space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                {t.mentalHealth.optInLabel}
              </span>
              <button
                onClick={toggleMentalHealthCycleLink}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isLinked ? 'bg-rose-500' : 'bg-gray-600'
                }`}
                aria-label="Toggle cycle linking"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isLinked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-white/70 leading-normal">
              {isLinked ? t.mentalHealth.optInDesc : t.mentalHealth.unlinkedNotice}
            </p>
          </div>
        </div>

        {/* Medical Scope Disclaimer Note */}
        <div className="mt-6 pt-4 border-t border-white/15 flex items-start gap-2.5 text-xs text-rose-200/90">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-300" />
          <p>
            {t.mentalHealth.disclaimer}{' '}
            <span className="text-white font-medium">
              {language === 'bn' 
                ? 'এটি কোনো মানসিক রোগ বা পিসিওএস নির্ণয় করে না।'
                : 'Does not diagnose mental health disorders or PCOS.'}
            </span>
          </p>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-rose-100">
        <button
          onClick={() => setActiveTab('dailyMood')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'dailyMood'
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
              : 'bg-surface hover:bg-peach-50 text-plum-700 border border-rose-100/60'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>{t.mentalHealth.tabs.dailyMood}</span>
        </button>

        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'breathing'
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
              : 'bg-surface hover:bg-peach-50 text-plum-700 border border-rose-100/60'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>{t.mentalHealth.tabs.breathing}</span>
        </button>

        <button
          onClick={() => setActiveTab('connection')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'connection'
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
              : 'bg-surface hover:bg-peach-50 text-plum-700 border border-rose-100/60'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>{t.mentalHealth.tabs.connection}</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'support'
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
              : 'bg-surface hover:bg-peach-50 text-plum-700 border border-rose-100/60'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{t.mentalHealth.tabs.support}</span>
        </button>
      </div>

      {/* ================= TAB 1: DAILY MOOD & WELLBEING ================= */}
      {activeTab === 'dailyMood' && (
        <div className="space-y-6">
          {/* Quick KPI Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 flex flex-col justify-between">
              <span className="text-xs text-plum-500 font-medium">
                {language === 'bn' ? 'সাম্প্রতিক মেজাজ' : 'Latest Mood Score'}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-plum-900">
                  {latestEntry ? `${latestEntry.moodScore}/5` : 'N/A'}
                </span>
                <span className="text-xl">
                  {latestEntry ? getMoodEmoji(latestEntry.moodScore).emoji : '🌿'}
                </span>
              </div>
              <span className="text-[11px] text-plum-400 mt-1">
                {latestEntry 
                  ? (language === 'bn' ? getMoodEmoji(latestEntry.moodScore).labelBn : getMoodEmoji(latestEntry.moodScore).labelEn)
                  : (language === 'bn' ? 'আজকের লগ বাকি' : 'Ready to record today')}
              </span>
            </Card>

            <Card className="p-4 flex flex-col justify-between">
              <span className="text-xs text-plum-500 font-medium">
                {language === 'bn' ? 'গড় মেজাজ স্কোর' : '7-Day Average Mood'}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-plum-900">
                  {averageMood}
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  / 5.0
                </span>
              </div>
              <span className="text-[11px] text-plum-400 mt-1">
                {language === 'bn' ? '১–৫ মেজাজ স্কেল অনুসারে' : 'On 1–5 scale'}
              </span>
            </Card>

            <Card className="p-4 flex flex-col justify-between">
              <span className="text-xs text-plum-500 font-medium">
                {language === 'bn' ? 'গড় ঘুম' : 'Average Sleep'}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-plum-900">
                  {averageSleep}
                </span>
                <span className="text-xs text-plum-400">
                  {language === 'bn' ? 'ঘণ্টা/রাত' : 'hrs / night'}
                </span>
              </div>
              <span className="text-[11px] text-plum-400 mt-1 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-lavender-500" />
                {language === 'bn' ? 'পরিমিত বিশ্রাম' : 'Restful baseline'}
              </span>
            </Card>

            <Card className="p-4 flex flex-col justify-between">
              <span className="text-xs text-plum-500 font-medium">
                {language === 'bn' ? 'ডেটা লিঙ্ক স্ট্যাটাস' : 'Cycle Integration'}
              </span>
              <div className="mt-2">
                <Badge variant={isLinked ? 'rose' : 'outline'} size="sm">
                  {isLinked 
                    ? (language === 'bn' ? 'সাইকেলের সাথে সংযুক্ত' : 'Linked with Cycle') 
                    : (language === 'bn' ? 'সম্পূর্ণ স্বাধীন ও গোপনীয়' : 'Unlinked & Isolated')}
                </Badge>
              </div>
              <span className="text-[11px] text-plum-400 mt-1">
                {language === 'bn' ? 'গোপনীয়তা অক্ষুণ্ণ' : 'Privacy preserved'}
              </span>
            </Card>
          </div>

          {/* Action Callout: Daily Mood Journal Entry Point */}
          <div className="bg-gradient-to-br from-peach-50/80 via-rose-50/50 to-lavender-50/70 border border-rose-200/70 rounded-3xl p-6 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                {language === 'bn' ? 'দৈনিক সুস্থতা রেকর্ড' : 'Daily Wellbeing Journaling'}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-plum-900">
                {language === 'bn' ? 'আজ আপনার মানসিক অবস্থা কেমন?' : 'How is your emotional wellbeing today?'}
              </h2>
              <p className="text-xs sm:text-sm text-plum-600 max-w-xl">
                {language === 'bn'
                  ? 'সহজ ১–৫ স্কেলে মেজাজ, মানসিক চাপ, উদ্বেগ, শক্তির মাত্রা এবং ঘুমের সময় নথিভুক্ত করুন। পরবর্তী ধাপে ডেটা-এন্ট্রি ফর্ম সংযুক্ত করা হবে।'
                  : 'Track your mood on a 1–5 scale, alongside stress, anxiety, energy, sleep duration, and optional private journal reflections.'}
              </p>
            </div>
            <div className="shrink-0">
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowNextStepNotice(true)}
                icon={<Smile className="w-4 h-4" />}
              >
                {language === 'bn' ? 'আজকের মেজাজ লিপিবদ্ধ করুন' : "Log Today's Mood"}
              </Button>
            </div>
          </div>

          {/* Next Step Modal Notice */}
          {showNextStepNotice && (
            <div className="fixed inset-0 z-50 bg-plum-950/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-100 shadow-2xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
                  <Smile className="w-6 h-6" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-bold text-lg text-plum-900">
                    {language === 'bn' ? 'মডিউল এন্ট্রি-পয়েন্ট প্রস্তুত' : 'Module Entry Point Active'}
                  </h3>
                  <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                    {language === 'bn'
                      ? 'নিয়ম ২ অনুযায়ী আমরা প্রথমে শেয়ার্ড নেভিগেশন ও মডিউল এন্ট্রি-পয়েন্ট তৈরি ও পরীক্ষা করেছি। পরবর্তী সবচেয়ে ছোট ধাপে সম্পূর্ণ ইন্টারঅ্যাক্টিভ ফর্মটি যুক্ত করা হবে।'
                      : 'Per Rule 2 of development, shared navigation and module entry points are established and verified first. The interactive data-entry modal form will be connected in the next smallest step.'}
                  </p>
                </div>
                <div className="pt-2">
                  <Button 
                    variant="primary" 
                    className="w-full" 
                    onClick={() => setShowNextStepNotice(false)}
                  >
                    {language === 'bn' ? 'বুঝেছি' : 'Understood'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 1–5 Mood Scale Educational Guide */}
          <Card className="p-4 sm:p-6">
            <h3 className="font-bold text-sm sm:text-base text-plum-900 mb-3 flex items-center gap-2">
              <Smile className="w-4 h-4 text-rose-500" />
              <span>{language === 'bn' ? '১–৫ মেজাজ স্কেল নির্দেশিকা' : '1–5 Mood Scale Reference'}</span>
            </h3>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
              {[1, 2, 3, 4, 5].map((score) => {
                const info = getMoodEmoji(score as MoodScore);
                return (
                  <div key={score} className="p-1.5 sm:p-3 bg-peach-50/50 rounded-xl sm:rounded-2xl border border-rose-100/60 flex flex-col items-center">
                    <span className="text-xl sm:text-3xl">{info.emoji}</span>
                    <span className="font-extrabold text-xs sm:text-sm text-plum-900 mt-1">
                      {score}
                    </span>
                    <span className="text-[9px] sm:text-xs text-plum-600 mt-0.5 font-medium truncate w-full">
                      {language === 'bn' ? info.labelBn : info.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Mood History & Journal Entries (Clearly separating Mock vs Real data) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-plum-900">
                  {language === 'bn' ? 'সাম্প্রতিক মেজাজ ও জার্নাল হিস্ট্রি' : 'Recent Mood & Journal History'}
                </h3>
                <p className="text-xs text-plum-500">
                  {language === 'bn'
                    ? 'পরীক্ষার জন্য ডেমো ডেটা সংরক্ষিত; আপনার নিজস্ব এন্ট্রি লোকাল মেমরিতে সুরক্ষিত থাকবে।'
                    : 'Annotated sample logs shown for testing. Real user entries persist securely.'}
                </p>
              </div>
              <Badge variant="plum" size="sm">
                {mentalHealthEntries.length} {language === 'bn' ? 'টি এন্ট্রি' : 'Entries'}
              </Badge>
            </div>

            <div className="space-y-3">
              {mentalHealthEntries.map((entry) => {
                const mood = getMoodEmoji(entry.moodScore);
                const isMock = entry.id.startsWith('mh_demo');
                return (
                  <Card key={entry.id} className="p-4 sm:p-5 hoverable">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-50 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl p-2 bg-peach-50 rounded-2xl border border-rose-100">
                          {mood.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-plum-900">
                              {language === 'bn' ? mood.labelBn : mood.labelEn}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              {entry.moodScore}/5
                            </span>
                            {isMock && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-lavender-100 text-lavender-700">
                                {language === 'bn' ? 'ডেমো ডেটা' : 'Demo Entry'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-plum-400 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {entry.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2.5 py-1 rounded-xl bg-surface border border-rose-100 text-plum-700 flex items-center gap-1">
                          <BatteryMedium className="w-3.5 h-3.5 text-amber-500" />
                          {language === 'bn' ? 'শক্তি' : 'Energy'}: {entry.energyLevel}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-xl bg-surface border border-rose-100 text-plum-700 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                          {language === 'bn' ? 'চাপ' : 'Stress'}: {entry.stressLevel}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-xl bg-surface border border-rose-100 text-plum-700 flex items-center gap-1">
                          <Moon className="w-3.5 h-3.5 text-indigo-500" />
                          {entry.sleepHours}h ({entry.sleepQuality})
                        </span>
                      </div>
                    </div>

                    {entry.notes && (
                      <div className="mt-3 text-xs sm:text-sm text-plum-700 bg-peach-50/40 p-3 rounded-xl border border-rose-100/60 italic">
                        "{entry.notes}"
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: BREATHING & GROUNDING ================= */}
      {activeTab === 'breathing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Interactive Box Breathing Guide */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
                <div>
                  <Badge variant="lavender" size="sm" className="mb-2">
                    <Wind className="w-3.5 h-3.5" />
                    {language === 'bn' ? '৪–৪–৪–৪ বক্স ব্রিদিং' : '4-4-4-4 Box Breathing Technique'}
                  </Badge>
                  <h2 className="text-xl sm:text-2xl font-bold text-plum-900">
                    {language === 'bn' ? 'মন শান্ত করার শ্বাসপ্রশ্বাসের ব্যায়াম' : 'Calm Your Nervous System'}
                  </h2>
                  <p className="text-xs sm:text-sm text-plum-600 max-w-md mt-1">
                    {language === 'bn'
                      ? 'অ্যাক্সাইটি বা হরমোনজনিত মানসিক চাপ কমাতে এই বৈজ্ঞানিক পদ্ধতিটি ভেগাস নার্ভ সক্রিয় করে হার্টরেট স্বাভাবিক করে।'
                      : 'Used by clinical therapists and mindfulness practitioners to downregulate the autonomic nervous system and soothe acute PMS anxiety.'}
                  </p>
                </div>

                {/* Animated Breathing Circle */}
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br from-rose-200 via-lavender-200 to-peach-200 opacity-60 transition-all duration-1000 ${
                      isBreathingActive && breathingPhase === 'inhale' ? 'scale-110' : ''
                    } ${
                      isBreathingActive && breathingPhase === 'exhale' ? 'scale-90' : ''
                    } ${isBreathingActive ? 'animate-pulse' : ''}`}
                  />
                  <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-surface border-4 border-rose-300 shadow-xl flex flex-col items-center justify-center p-3 sm:p-4">
                    <span className="text-3xl sm:text-4xl font-extrabold text-plum-900">
                      {secondsLeft}s
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose-600 mt-1">
                      {breathingPhase === 'inhale' && (language === 'bn' ? 'শ্বাস নিন' : 'Inhale')}
                      {breathingPhase === 'hold1' && (language === 'bn' ? 'ধরে রাখুন' : 'Hold')}
                      {breathingPhase === 'exhale' && (language === 'bn' ? 'শ্বাস ছাড়ুন' : 'Exhale')}
                      {breathingPhase === 'hold2' && (language === 'bn' ? 'বিশ্রাম' : 'Rest')}
                    </span>
                  </div>
                </div>

                {/* Live Cue */}
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl w-full max-w-sm">
                  <p className="text-xs font-semibold text-rose-800">
                    {getBreathingCue()}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    variant={isBreathingActive ? 'secondary' : 'primary'}
                    size="md"
                    onClick={() => setIsBreathingActive(!isBreathingActive)}
                    icon={isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  >
                    {isBreathingActive 
                      ? (language === 'bn' ? 'থামান' : 'Pause') 
                      : (language === 'bn' ? 'ব্যায়াম শুরু করুন' : 'Start Breathing')}
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={resetBreathing}
                    icon={<RotateCcw className="w-4 h-4" />}
                  >
                    {language === 'bn' ? 'পুনরায় সেট' : 'Reset'}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Meditating Brain Mascot Illustration */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="bg-gradient-to-br from-lavender-100/60 via-peach-50/50 to-rose-100/60 rounded-3xl p-6 border border-rose-100 shadow-soft text-center space-y-4 max-w-sm">
                <img
                  src="/images/meditating-brain.png"
                  alt="Meditating brain practicing mindfulness"
                  className="w-48 sm:w-56 h-auto mx-auto object-contain hover:scale-105 transition-transform duration-300"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-plum-900">
                    {language === 'bn' ? 'মৃদু ধ্যান ও মাইন্ডফুলনেস' : 'Mindful Self-Compassion'}
                  </h3>
                  <p className="text-xs text-plum-600 leading-relaxed">
                    {language === 'bn'
                      ? 'প্রতিদিন মাত্র ৩-৫ মিনিটের শান্ত শ্বাসপ্রশ্বাস মস্তিষ্কে কর্টিসল (চাপের হরমোন) কমাতে সাহায্য করে।'
                      : 'Just 3 to 5 minutes of focused rhythmic breathing helps reduce cortisol and brings biological balance to your emotional centers.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 5-4-3-2-1 Sensory Grounding Technique Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-base sm:text-lg text-plum-900">
                {language === 'bn' ? '৫-৪-৩-২-১ ইন্দ্রিয় গ্রাউন্ডিং পদ্ধতি' : '5-4-3-2-1 Sensory Grounding Exercise'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-plum-600 mb-4 leading-relaxed">
              {language === 'bn'
                ? 'তীব্র মানসিক অস্থিরতা বা প্যানিক অনুভূত হলে আপনার পঞ্চইন্দ্রিয়কে কাজে লাগিয়ে মনকে বর্তমান মুহূর্তে ফিরিয়ে আনুন:'
                : 'When acute anxiety, racing thoughts, or sensory overwhelm occur, use your five senses to ground your body in the present:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs sm:text-sm">
              <div className="p-3 bg-peach-50/60 rounded-2xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-700 block">5 {language === 'bn' ? 'টি জিনিস দেখুন' : 'Things to See'}</span>
                <p className="text-plum-600 text-xs">{language === 'bn' ? 'আপনার চারপাশে থাকা ৫টি বস্তু খেয়াল করুন।' : 'Notice shapes, colors, or subtle patterns around you.'}</p>
              </div>
              <div className="p-3 bg-peach-50/60 rounded-2xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-700 block">4 {language === 'bn' ? 'টি জিনিস স্পর্শ করুন' : 'Things to Feel'}</span>
                <p className="text-plum-600 text-xs">{language === 'bn' ? 'পোশাকের অনুভূতি বা মেঝের শীতলতা স্পর্শ করুন।' : 'Your clothes, a warm cup, or the ground beneath your feet.'}</p>
              </div>
              <div className="p-3 bg-peach-50/60 rounded-2xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-700 block">3 {language === 'bn' ? 'টি শব্দ শুনুন' : 'Things to Hear'}</span>
                <p className="text-plum-600 text-xs">{language === 'bn' ? 'পাখির ডাক বা বাতাসের শব্দ মনোযোগ দিয়ে শুনুন।' : 'Distant birds, ceiling fan, or your own breath.'}</p>
              </div>
              <div className="p-3 bg-peach-50/60 rounded-2xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-700 block">2 {language === 'bn' ? 'টি গন্ধ নিন' : 'Things to Smell'}</span>
                <p className="text-plum-600 text-xs">{language === 'bn' ? 'চা, সুগন্ধি বা যেকোনো প্রাকৃতিক সুবাস অনুভব করুন।' : 'Soap, fresh air, coffee, or a nearby candle.'}</p>
              </div>
              <div className="p-3 bg-peach-50/60 rounded-2xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-700 block">1 {language === 'bn' ? 'টি স্বাদ নিন' : 'Thing to Taste'}</span>
                <p className="text-plum-600 text-xs">{language === 'bn' ? 'এক ঢোক পানি বা মিন্টের স্বাদ লক্ষ্য করুন।' : 'A sip of cold water, mint, or the taste on your tongue.'}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ================= TAB 3: MIND & CYCLE CONNECTION (INTEGRATION) ================= */}
      {activeTab === 'connection' && (
        <div className="space-y-6">
          {/* Important Scientific Caution: Correlation vs Causation */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-5 sm:p-6 text-plum-900 flex items-start gap-3.5 shadow-soft">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs sm:text-sm">
              <h3 className="font-bold text-amber-900 text-sm sm:text-base">
                {language === 'bn' ? 'বৈজ্ঞানিক সতর্কতা: পারস্পরিক সম্পর্ক (Correlation) প্রমাণ করে না কার্যকারণ (Causation)' : 'Scientific Note: Correlation Does Not Prove Causation'}
              </h3>
              <p className="text-amber-800/90 leading-relaxed">
                {language === 'bn'
                  ? 'মাসিক চক্রের সাথে মেজাজের পরিবর্তন পর্যবেক্ষণভিত্তিক (observational)। হরমোনের ওঠানামা (যেমন লিউটিয়াল ফেজে প্রোজেস্টেরন ও ইস্ট্রোজেনের পতন) মেজাজকে প্রভাবিত করতে পারে, তবে বাইরের মানসিক চাপ, কাজের চাপ, পুষ্টি ও ঘুমের ঘাটতিও সমপরিমাণ ভূমিকা রাখে। কোনো সিদ্ধান্ত নিশ্চিত চিকিৎসা পরামর্শ নয়।'
                  : 'Hormonal fluctuations (e.g. sharp drops in estrogen and progesterone during the late luteal phase) can increase vulnerability to mood swings or anxiety. However, statistical correlation does not prove direct biological causation—external work stress, nutrition, and sleep play equally vital roles.'}
              </p>
            </div>
          </div>

          {/* Visual Educational Spotlights with User Uploaded Illustrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-full bg-peach-50 rounded-2xl p-3 flex justify-center border border-rose-100">
                  <img
                    src="/images/connection-menstrual-mental-health.png"
                    alt="Connection between menstrual cycle and mental health"
                    className="max-h-52 w-auto object-contain rounded-xl hover:scale-102 transition-transform"
                  />
                </div>
                <Badge variant="rose" size="sm">
                  {language === 'bn' ? 'শারীরবৃত্তীয় সংযোগ' : 'Biological Interaction'}
                </Badge>
                <h4 className="font-bold text-base text-plum-900">
                  {language === 'bn' ? 'হরমোন ও নিউরোট্রান্সমিটারের খেলা' : 'Hormones & Brain Chemistry'}
                </h4>
                <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                  {language === 'bn'
                    ? 'ইস্ট্রোজেন সেরোটোনিন ও ডোপামিনের উৎপাদন উদ্দীপিত করে, যা ভালো লাগার অনুভূতি তৈরি করে। ওভিউলেশনের পর যখন ইস্ট্রোজেন কমে যায়, তখন স্বাভাবিকভাবেই সংবেদনশীলতা ও মেজাজের পরিবর্তন হতে পারে।'
                    : 'Estrogen modulates brain serotonin and dopamine availability. When estrogen drops post-ovulation, serotonin activity can dip, explaining feelings of irritability or fatigue in some women.'}
                </p>
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-full bg-peach-50 rounded-2xl p-3 flex justify-center border border-rose-100">
                  <img
                    src="/images/periods-and-mental-health.jpg"
                    alt="Periods and mental health understanding emotional distress"
                    className="max-h-52 w-auto object-contain rounded-xl hover:scale-102 transition-transform"
                  />
                </div>
                <Badge variant="lavender" size="sm">
                  {language === 'bn' ? 'পিএমএস সচেতনতা' : 'PMS & Mental Clarity'}
                </Badge>
                <h4 className="font-bold text-base text-plum-900">
                  {language === 'bn' ? 'অস্থিরতা ও জটলার অনুভূতি কেন হয়?' : 'Navigating Thought Overwhelm'}
                </h4>
                <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                  {language === 'bn'
                    ? 'পিরিয়ডের আগের দিনগুলোতে অতিরিক্ত চিন্তা বা মাথার ভেতর জটলার অনুভূতি অস্বাভাবিক নয়। একে নিজের দুর্বলতা না ভেবে হরমোনের স্বাভাবিক গতিপ্রবাহ হিসেবে গ্রহণ করা স্বস্তিদায়ক।'
                    : 'Experiencing mental fatigue or thought clutter before menstruation is a recognized biological response. Acknowledging hormonal rhythms prevents self-blame and promotes compassionate self-care.'}
                </p>
              </div>
            </Card>
          </div>

          {/* Data Sufficiency & Correlation Rule Check */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base text-plum-900">
                  {language === 'bn' ? 'ব্যক্তিগত ট্রেন্ড ও ডেটার পর্যাপ্ততা' : 'Cycle & Mood Pattern Analysis'}
                </h3>
              </div>
              <Badge variant={isLinked ? 'sage' : 'plum'} size="sm">
                {isLinked ? 'Correlation Enabled' : 'Decoupled (Private)'}
              </Badge>
            </div>

            {!isLinked ? (
              <div className="p-4 bg-peach-50 rounded-2xl border border-rose-100 text-xs sm:text-sm text-plum-700">
                {language === 'bn'
                  ? '🔒 আপনার গোপনীয়তা পছন্দ অনুযায়ী মানসিক স্বাস্থ্য ও পিরিয়ড ডেটার সংযোগ বিচ্ছিন্ন রাখা হয়েছে। আপনি উপরের টগলটি দিয়ে যেকোনো সময় পুনরায় সংযোগ করতে পারেন।'
                  : '🔒 Per your privacy preference, mental health logs are completely decoupled from menstrual records. You may toggle cycle linking back on whenever you choose.'}
              </div>
            ) : totalEntries < 5 ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-1">
                <span className="font-bold block">
                  {language === 'bn' ? 'পর্যাপ্ত ডেটা প্রয়োজন (ন্যূনতম ৫-১০ টি এন্ট্রি)' : 'Sufficient Data Threshold (Minimum 5–10 Entries)'}
                </span>
                <p>
                  {language === 'bn'
                    ? `বর্তমান এন্ট্রি সংখ্যা: ${totalEntries} টি। সঠিক ও নির্ভরযোগ্য ট্রেন্ড বিশ্লেষণের জন্য অন্তত ৫টি ভিন্ন দিনের মেজাজ লগ থাকা জরুরি, যাতে দৈবচয়ন বা কাকতালীয় পরিবর্তনকে ভ্রান্ত প্যাটার্ন মনে না হয়।`
                    : `Currently recorded: ${totalEntries} entries. Safe and meaningful hormonal-mood pattern detection requires at least 5 to 10 logged days across menstrual phases to avoid misleading statistical artifacts.`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-plum-600">
                  {language === 'bn'
                    ? 'আপনার এন্ট্রির ভিত্তিতে বিভিন্ন সাইকেল ফেজে সাধারণ মানসিক প্রবণতা:'
                    : 'Observed emotional energy patterns across your cycle phases:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 space-y-1">
                    <span className="font-bold text-rose-700">{t.phases.menstrual}</span>
                    <p className="text-plum-600">{language === 'bn' ? 'বিশ্রামের সময়; শক্তি কম কিন্তু মানসিক প্রশান্তি থাকে।' : 'Reflective energy, low physical stamina, inward focus.'}</p>
                  </div>
                  <div className="p-3 bg-peach-50 rounded-2xl border border-peach-200 space-y-1">
                    <span className="font-bold text-peach-800">{t.phases.follicular}</span>
                    <p className="text-plum-600">{language === 'bn' ? 'ইস্ট্রোজেনের বৃদ্ধি; নতুন উদ্যম ও ইতিবাচক মেজাজ।' : 'Rising estrogen, cognitive clarity, positive optimism.'}</p>
                  </div>
                  <div className="p-3 bg-lavender-50 rounded-2xl border border-lavender-200 space-y-1">
                    <span className="font-bold text-lavender-800">{t.phases.ovulation}</span>
                    <p className="text-plum-600">{language === 'bn' ? 'শীর্ষ শক্তি; সামাজিক মেলামেশা ও আত্মবিশ্বাস।' : 'Peak energy, communicative confidence, high stamina.'}</p>
                  </div>
                  <div className="p-3 bg-plum-50 rounded-2xl border border-plum-200 space-y-1">
                    <span className="font-bold text-plum-800">{t.phases.luteal}</span>
                    <p className="text-plum-600">{language === 'bn' ? 'সংবেদনশীল সময়; মৃদু অস্বস্তি ও আত্মযত্নের প্রয়োজন।' : 'Progesterone drop; heightened sensitivity, self-compassion needed.'}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ================= TAB 4: SUPPORT & HELPLINES ================= */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          {/* Clinical Red Flags & Guidance */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-base sm:text-lg text-plum-900">
                {language === 'bn' ? 'কখন বিশেষজ্ঞের পরামর্শ নেওয়া জরুরি?' : 'When to Seek Professional Support'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
              {language === 'bn'
                ? 'পিরিয়ড ও হরমোনের প্রভাব স্বাভাবিক হলেও কিছু লক্ষণ ক্লিনিক্যাল মানসিক স্বাস্থ্য সমস্যার নির্দেশক হতে পারে। নিম্নোক্ত লক্ষণগুলো দেখা দিলে একজন রেজিস্টার্ড মনোরোগ বিশেষজ্ঞ বা চিকিৎসকের শরণাপন্ন হওয়া উচিত:'
                : 'While mild premenstrual mood changes are common, significant emotional disruption warrants clinical attention. Consult a licensed psychologist, psychiatrist, or gynecologist if you experience:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2 p-3 bg-peach-50/60 rounded-2xl border border-rose-100">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{language === 'bn' ? 'টানা ২ সপ্তাহের বেশি সময় ধরে গভীর বিষণ্ণতা বা কোনো কিছুতেই আনন্দ না পাওয়া।' : 'Persistent low mood, despair, or loss of interest in activities for >2 weeks.'}</span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-peach-50/60 rounded-2xl border border-rose-100">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{language === 'bn' ? 'পিএমডিডি (PMDD): পিরিয়ডের আগের দিনগুলোতে তীব্র ক্রোধ, আত্মহত্যার চিন্তা বা অসহায়ত্ব।' : 'PMDD symptoms: intense dysphoria, severe panic, or suicidal ideation before menstruation.'}</span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-peach-50/60 rounded-2xl border border-rose-100">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{language === 'bn' ? 'দৈনন্দিন কাজ, পড়াশোনা বা সম্পর্কের ক্ষেত্রে গুরুতর ব্যাঘাত।' : 'Severe interference with daily responsibilities, studies, or personal relationships.'}</span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-peach-50/60 rounded-2xl border border-rose-100">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{language === 'bn' ? 'ঘুমের তীব্র ব্যাঘাত, দীর্ঘস্থায়ী অনিদ্রা বা ক্রমাগত উদ্বেগ ও প্যানিক অ্যাটাক।' : 'Chronic insomnia, severe panic attacks, or uncontrollable bodily agitation.'}</span>
              </div>
            </div>
          </Card>

          {/* Verified Crisis Helplines */}
          <div className="bg-gradient-to-r from-rose-50 via-peach-50 to-lavender-50 rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-soft space-y-4">
            <div className="flex items-center gap-2.5 text-rose-900">
              <PhoneCall className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-base sm:text-lg">
                {language === 'bn' ? 'জরুরি মানসিক স্বাস্থ্য সহায়তা ও হটলাইন' : 'Verified Crisis Helplines & Support Lines'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-plum-700 leading-relaxed">
              {language === 'bn'
                ? 'আপনি একা নন। যদি আপনি তীব্র মানসিক যন্ত্রণায় থাকেন, অবিলম্বে এই বিশ্বস্ত হটলাইনগুলোতে বিনামূল্যে ও গোপনীয়তার সাথে কথা বলতে পারেন:'
                : 'You do not have to carry distress alone. If you or someone you know is in immediate crisis, confidential support is available around the clock:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-surface rounded-2xl p-4 border border-rose-100 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
                  🇧🇩 {language === 'bn' ? 'বাংলাদেশ সহায়তা কেন্দ্র' : 'Bangladesh Crisis Resources'}
                </span>
                <div className="space-y-1.5 text-xs text-plum-800">
                  <div className="flex items-center justify-between font-semibold">
                    <span>কান পেতে রই (Kaan Pete Roi):</span>
                    <a href="tel:+8801779554391" className="text-rose-600 hover:underline">
                      +8801779554391
                    </a>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span>জাতীয় জরুরি সেবা (National Emergency):</span>
                    <a href="tel:999" className="text-rose-600 hover:underline">
                      999
                    </a>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span>নারী ও শিশু নির্যাতন প্রতিরোধ সেল:</span>
                    <a href="tel:109" className="text-rose-600 hover:underline">
                      109
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-4 border border-rose-100 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-lavender-700 block">
                  🌐 {language === 'bn' ? 'আন্তর্জাতিক জরুরি হেল্পলাইন' : 'International Support Lines'}
                </span>
                <div className="space-y-1.5 text-xs text-plum-800">
                  <div className="flex items-center justify-between font-semibold">
                    <span>US / Canada Suicide & Crisis Lifeline:</span>
                    <a href="tel:988" className="text-lavender-600 hover:underline">
                      988
                    </a>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span>Crisis Text Line:</span>
                    <span className="text-lavender-600">Text HOME to 741741</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span>Befrienders Worldwide:</span>
                    <a 
                      href="https://www.befrienders.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lavender-600 hover:underline flex items-center gap-1"
                    >
                      befrienders.org <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
