import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { userApi } from '../services/api';
import { 
  Heart, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  Coffee, 
  Smile, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  Copy, 
  Check, 
  Flame,
  AlertCircle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const PartnerViewPage: React.FC = () => {
  const { user, prediction, language, setLanguage, setCurrentPage } = useApp();
  
  // Extract partner code from URL if present
  const getInitialCode = () => {
    try {
      const hash = window.location.hash;
      const search = hash.includes('?') ? hash.split('?')[1] : window.location.search.replace(/^\?/, '');
      const params = new URLSearchParams(search);
      return params.get('code') || user.partnerSharing?.shareCode || 'CYCLE-8492';
    } catch {
      return user.partnerSharing?.shareCode || 'CYCLE-8492';
    }
  };

  const [partnerCode, setPartnerCode] = useState<string>(getInitialCode);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    userApi.getSharedPartnerView(partnerCode)
      .then((data: any) => {
        if (isMounted) {
          const perms = data.permissions_shared || data.permissions || {
            sharePeriodDates: true,
            shareCyclePhase: true,
            shareMoodAndSymptoms: true,
            shareDailyTips: true,
          };
          const tips = data.care_tips || (data.partner_care_tip ? [data.partner_care_tip] : []);
          setPartnerData({
            user_name: data.user_name || user.name,
            partner_name: data.partner_name || user.partnerSharing?.partnerName || 'Partner',
            current_phase: data.current_phase || prediction.currentPhase,
            estimated_next_period: data.next_period_estimate || data.estimated_next_period || prediction.nextPeriodStart,
            days_until_next_period: data.countdown_days ?? data.days_until_next_period ?? 6,
            recent_mood: data.recent_mood || 'calm',
            recent_pain_level: data.recent_pain_level || 'mild',
            care_tips: tips.length > 0 ? tips : (language === 'bn' ? [
              'এই পর্যায়ে তার শক্তির মাত্রা কিছুটা কম থাকতে পারে। তাকে এক কাপ গরম চা বা আরামদায়ক খাবার পরিবেশন করতে পারেন।',
              'মেজাজের পরিবর্তন হলে তা ব্যক্তিগতভাবে নেবেন না — ধৈর্য ও মনোযোগ সহকারে তার কথা শুনুন।',
              'ঘরের ভারী কোনো কাজ থাকলে এগিয়ে এসে নিজের দায়িত্বে করে দিতে পারেন।'
            ] : [
              'She might experience lower energy right now. Offering a comforting warm beverage can mean the world.',
              'Be patient and attentive if mood shifts occur — gentle listening is more helpful than trying to fix things.',
              'A relaxing atmosphere and helping with demanding chores will provide immense physical relief.'
            ]),
            permissions: perms,
          });
          setIsLoading(false);
        }
      })
      .catch(() => {
        // Fallback to local user data for offline / preview experience
        if (isMounted) {
          setPartnerData({
            user_name: user.name,
            partner_name: user.partnerSharing?.partnerName || 'Partner',
            current_phase: prediction.currentPhase,
            estimated_next_period: prediction.nextPeriodStart,
            days_until_next_period: Math.max(
              0,
              Math.ceil((new Date(prediction.nextPeriodStart).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            ),
            recent_mood: 'calm',
            recent_pain_level: 'mild',
            care_tips: language === 'bn' ? [
              'এই পর্যায়ে তার শক্তির মাত্রা কিছুটা কম থাকতে পারে। তাকে এক কাপ গরম চা বা আরামদায়ক খাবার পরিবেশন করতে পারেন।',
              'মেজাজের পরিবর্তন হলে তা ব্যক্তিগতভাবে নেবেন না — ধৈর্য ও মনোযোগ সহকারে তার কথা শুনুন।',
              'ঘরের ভারী কোনো কাজ থাকলে এগিয়ে এসে নিজের দায়িত্বে করে দিতে পারেন।'
            ] : [
              'She might experience lower energy right now. Offering a comforting warm beverage can mean the world.',
              'Be patient and attentive if mood shifts occur — gentle listening is more helpful than trying to fix things.',
              'A relaxing atmosphere and helping with demanding chores will provide immense physical relief.'
            ],
            permissions: user.partnerSharing?.permissions || {
              sharePeriodDates: true,
              shareCyclePhase: true,
              shareMoodAndSymptoms: true,
              shareDailyTips: true,
            }
          });
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [partnerCode, user, prediction, language]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(partnerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-canvas text-plum-900 pb-16">
      {/* Top Navigation Bar */}
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-40 border-b border-rose-100 px-4 md:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('profile')}
              className="p-2 rounded-xl text-plum-600 hover:text-plum-900 hover:bg-rose-50 transition-colors cursor-pointer"
              title={isBn ? 'প্রোফাইলে ফিরে যান' : 'Back to Profile'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-lavender-400 flex items-center justify-center text-white shadow-sm">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-base text-plum-900 leading-tight">
                  CycleSense <span className="text-rose-600 font-semibold">{isBn ? 'সঙ্গী কম্প্যানিয়ন' : 'Partner Companion'}</span>
                </h1>
                <p className="text-[11px] text-plum-500">
                  {isBn ? 'সহমর্মিতা ও যত্নের জন্য রিড-অনলি ভিউ' : 'Read-only empathy & support view'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="flex items-center bg-rose-50 p-0.5 rounded-xl border border-rose-200/60">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                  language === 'en' ? 'bg-white text-rose-700 shadow-xs' : 'text-plum-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all font-bengali ${
                  language === 'bn' ? 'bg-white text-rose-700 shadow-xs' : 'text-plum-600'
                }`}
              >
                বাং
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage('dashboard')}
              className="text-xs hidden sm:flex"
            >
              {isBn ? 'অ্যাপ ড্যাশবোর্ড' : 'Go to App'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 pt-6 space-y-6">
        {/* Banner with user info & privacy guarantee */}
        <div className="bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 rounded-3xl p-6 border border-rose-100 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-sage-500 text-white rounded-full p-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-plum-900">
                    {partnerData?.user_name || user.name}
                  </h2>
                  <Badge variant="plum" size="sm">
                    {isBn ? 'সঙ্গী ভিউ' : 'Partner View'}
                  </Badge>
                </div>
                <p className="text-xs text-plum-600 mt-0.5">
                  {partnerData?.partner_name 
                    ? (isBn ? `${partnerData.partner_name} এর জন্য শেয়ারকৃত` : `Shared with ${partnerData.partner_name}`)
                    : (isBn ? 'বিশ্বস্ত সঙ্গীর সাথে শেয়ার করা' : 'Shared with trusted partner')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-rose-100 text-xs">
              <span className="font-semibold text-plum-500">{isBn ? 'কোড:' : 'Code:'}</span>
              <span className="font-mono font-bold text-rose-600 tracking-wider">{partnerCode}</span>
              <button
                onClick={handleCopyCode}
                className="p-1 text-plum-500 hover:text-rose-600 transition-colors ml-1"
                title={isBn ? 'কোড কপি করুন' : 'Copy code'}
              >
                {copied ? <Check className="w-4 h-4 text-sage-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-rose-200/50 flex items-center gap-2 text-xs text-plum-600">
            <Lock className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              {isBn
                ? 'সুরক্ষিত গোপনীয়তা: ব্যক্তিগত নোট বা ডাক্তারি রেকর্ড কখনো সঙ্গীর সাথে শেয়ার হয় না। শুধুমাত্র পারস্পরিক সহমর্মিতা ও সচেতনতার জন্য এই তথ্য দেখানো হচ্ছে।'
                : 'Privacy Guaranteed: Private symptom journals, intimate notes, and medical records are never shared. Only supportive cycle milestones are displayed.'}
            </span>
          </div>
        </div>

        {/* Partner Care & Comfort Spotlight Banner */}
        <div className="bg-gradient-to-br from-rose-50/90 via-peach-50/80 to-lavender-50/90 rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-soft grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group max-w-[250px] rounded-2xl overflow-hidden bg-white p-2.5 shadow-md border border-rose-200/80">
              <img
                src="/images/partner-care-bubu-dudu.png"
                alt="Your partner taking care of you during period pain"
                className="w-full h-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="md:col-span-7 space-y-3 text-center md:text-left">
            <Badge variant="rose" size="md">
              💖 {isBn ? 'সঙ্গীর মমতা ও ভালোবাসার যত্ন' : 'Your Partner Should Take Care of You'}
            </Badge>
            <h3 className="text-xl sm:text-2xl font-extrabold text-plum-900 tracking-tight">
              {isBn
                ? 'পিরিয়ডের দিনগুলোতে পাশে থাকুন ভালোবাসায় ও সেবায়'
                : 'Every Period Deserves Extra Love, Care & Warmth'}
            </h3>
            <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
              {isBn
                ? 'তলপেটে ক্র্যাম্পস ও ব্যথার সময় একটি গরম পানির ব্যাগ, প্রয়োজনীয় স্যানিটারি প্যাড, প্রিয় খাবার কিংবা এক কাপ গরম চা অনেক বড় স্বস্তি এনে দেয়। এই দিনগুলোতে মানসিক প্রশান্তি ও সহমর্মিতাই একজন নারীর সবচেয়ে বড় পাওয়া।'
                : 'Menstrual cramps and hormonal shifts can be physically draining. Small thoughtful gestures—bringing a warm heating pad, keeping comfort snacks and pads handy, or simply being gentle and patient—mean the world.'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 font-semibold shadow-xs">
                ♨️ {isBn ? 'গরম পানির ব্যাগ / হিটিং প্যাড' : 'Warm Heating Pad'}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 font-semibold shadow-xs">
                🍕 {isBn ? 'প্রিয় হালকা খাবার ও পানীয়' : 'Comfort Snacks & Food'}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 font-semibold shadow-xs">
                🌸 {isBn ? 'ধৈর্য ও সহমর্মিতা' : 'Patience & Empathy'}
              </span>
            </div>
          </div>
        </div>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Period Countdown & Next Dates */}
          {partnerData?.permissions?.sharePeriodDates && (
            <Card className="p-6 bg-surface border border-rose-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{isBn ? 'পরবর্তী পিরিয়ডের সম্ভাব্য সময়' : 'Next Expected Period'}</span>
                  </div>
                  <Badge variant="rose" size="sm">
                    {isBn ? '±২ দিন তারতম্য' : '±2 Days Range'}
                  </Badge>
                </div>

                <div className="my-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-plum-900 tracking-tight">
                    {partnerData?.days_until_next_period === 0
                      ? (isBn ? 'আজই সম্ভাব্য দিন' : 'Expected Today')
                      : (isBn ? `প্রায় ${partnerData?.days_until_next_period || 6} দিন পর` : `In ~${partnerData?.days_until_next_period || 6} Days`)}
                  </div>
                  <p className="text-xs text-plum-500 mt-1">
                    {isBn ? 'আনুমানিক তারিখ:' : 'Estimated Start:'}{' '}
                    <span className="font-semibold text-plum-700">{partnerData?.estimated_next_period || '2026-10-25'}</span>
                  </p>
                </div>
              </div>

              <div className="p-3 bg-peach-50/70 rounded-2xl border border-peach-200/60 text-xs text-plum-700">
                💡 {isBn
                  ? 'এই দিনগুলোর আশেপাশে তার জন্য প্রয়োজনীয় সামগ্রী (প্যাড, গরম পানির ব্যাগ, প্রিয় হালকা খাবার) হাতের কাছে রাখুন।'
                  : 'Consider keeping comfort items (heating pad, preferred tea, menstrual supplies) easily accessible.'}
              </div>
            </Card>
          )}

          {/* 2. Cycle Phase & Biological Context */}
          {partnerData?.permissions?.shareCyclePhase && (
            <Card className="p-6 bg-surface border border-rose-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-lavender-700 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>{isBn ? 'বর্তমান সাইকেল পর্যায়' : 'Current Biological Phase'}</span>
                  </div>
                  <Badge variant="lavender" size="sm">
                    {partnerData?.current_phase || 'Luteal'} Phase
                  </Badge>
                </div>

                <div className="my-3">
                  <h3 className="text-xl font-bold text-plum-900 capitalize">
                    {partnerData?.current_phase === 'menstrual' && (isBn ? 'ঋতুস্রাব পর্যায় (Menstrual)' : 'Menstrual Phase')}
                    {partnerData?.current_phase === 'follicular' && (isBn ? 'ফলিকুলার পর্যায় (Follicular)' : 'Follicular Phase')}
                    {partnerData?.current_phase === 'ovulation' && (isBn ? 'ওভিউলেশন পর্যায় (Ovulation)' : 'Ovulation Phase')}
                    {(partnerData?.current_phase === 'luteal' || !partnerData?.current_phase) && (isBn ? 'লুটিয়াল পর্যায় (Luteal / PMS)' : 'Luteal Phase (PMS Window)')}
                  </h3>
                  <p className="text-xs text-plum-600 leading-relaxed mt-2">
                    {isBn
                      ? 'এই পর্যায়ে প্রজেস্টেরন হরমোনের প্রভাবে শরীরের শক্তির স্তর স্বাভাবিকভাবেই কিছুটা কমতে পারে এবং শারীরিক ক্লান্তি বাড়তে পারে।'
                      : 'Progesterone levels are elevated. Energy levels naturally decrease, and rest is physically vital.'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-lavender-50/70 rounded-2xl border border-lavender-200/60 text-xs text-lavender-900">
                🌿 {isBn
                  ? 'সহানুভূতিশীল আচরণ এবং মানসিক প্রশান্তি এই সময়ে সবচেয়ে বড় উপহার।'
                  : 'Patience and a tranquil home environment are the best gifts during this window.'}
              </div>
            </Card>
          )}
        </div>

        {/* 3. Daily Empathy & Care Tips */}
        {partnerData?.permissions?.shareDailyTips && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-rose-50 font-bold text-base text-plum-900">
              <Coffee className="w-5 h-5 text-rose-500" />
              <span>{isBn ? 'আজ আপনার জন্য যত্নের পরামর্শ (Care & Empathy Tips)' : 'Daily Thoughtful Support Tips'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(partnerData?.care_tips || []).map((tip: string, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-canvas border border-rose-100 flex flex-col justify-between space-y-2 hover:border-rose-300 transition-colors"
                >
                  <div className="flex items-center gap-2 text-rose-600 font-semibold text-xs">
                    <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-[11px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{isBn ? `পরামর্শ #${idx + 1}` : `Tip #${idx + 1}`}</span>
                  </div>
                  <p className="text-xs text-plum-700 leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 4. Mood & Comfort Alerts */}
        {partnerData?.permissions?.shareMoodAndSymptoms && (
          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-rose-50 font-bold text-sm text-plum-900">
              <Smile className="w-4 h-4 text-plum-600" />
              <span>{isBn ? 'শারীরিক স্বাচ্ছন্দ্য ও মেজাজের অবস্থা' : 'Comfort & Mood Summary'}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="px-3.5 py-2 rounded-xl bg-peach-50 border border-peach-200 text-xs font-semibold text-plum-800 flex items-center gap-2">
                <span>{isBn ? 'ব্যথার মাত্রা:' : 'Comfort Level:'}</span>
                <span className="text-rose-700 capitalize font-bold">
                  {partnerData?.recent_pain_level === 'none' ? (isBn ? 'স্বাভাবিক / ব্যথা নেই' : 'Comfortable / No Pain') : (isBn ? 'সামান্য অস্বস্তি' : 'Mild Cramps')}
                </span>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-lavender-50 border border-lavender-200 text-xs font-semibold text-plum-800 flex items-center gap-2">
                <span>{isBn ? 'মেজাজের ধারা:' : 'Mood Disposition:'}</span>
                <span className="text-lavender-800 capitalize font-bold">
                  {partnerData?.recent_mood === 'calm' ? (isBn ? 'শান্ত ও স্বাভাবিক' : 'Calm & Steady') : (isBn ? 'সংবেদনশীল' : 'Sensitive')}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Footer Guidance */}
        <div className="text-center pt-6 text-xs text-plum-400 space-y-2">
          <p>
            CycleSense AI &copy; 2026 &bull; {isBn ? 'মহিলাদের প্রজনন স্বাস্থ্য ও সচেতনতা প্ল্যাটফর্ম' : 'AI-Powered Menstrual Health Platform'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage('landing')}
              className="hover:underline text-rose-600"
            >
              {isBn ? 'হোমপেজে যান' : 'CycleSense Home'}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setCurrentPage('education')}
              className="hover:underline text-rose-600"
            >
              {isBn ? 'পিসিওএস ও স্বাস্থ্য নির্দেশিকা' : 'PCOS Education'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
