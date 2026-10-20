import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Activity, 
  TrendingUp, 
  Bot, 
  Plus, 
  ChevronRight, 
  AlertCircle, 
  Info, 
  Sparkles, 
  ArrowUpRight, 
  Heart, 
  Clock, 
  BookOpen,
  Bell,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Share2,
  Users
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { CycleWheel } from '../components/cycle/CycleWheel';
import { mockArticles } from '../data/mockArticles';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    cycles, 
    symptoms, 
    prediction, 
    cycleStats, 
    language, 
    t, 
    setCurrentPage, 
    setSelectedArticleId, 
    setIsAddPeriodModalOpen, 
    setIsChatDrawerOpen 
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const code = user.partnerSharing?.shareCode || 'CYCLE-8492';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const code = user.partnerSharing?.shareCode || 'CYCLE-8492';
    const link = `${window.location.origin}/#partner_view?code=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Prepare chart data for cycle lengths
  const cycleChartData = [...cycles].reverse().map((c, i) => ({
    name: `Cycle ${i + 1}`,
    startDate: c.startDate.slice(5),
    duration: c.periodDuration,
    length: c.cycleLength || 28,
  }));

  // Symptom frequency trends
  const symptomData = [
    { name: language === 'bn' ? 'ক্র্যাম্পস' : 'Cramps', days: 4, fill: '#D96C91' },
    { name: language === 'bn' ? 'ক্লান্তি' : 'Fatigue', days: 3, fill: '#ECA48A' },
    { name: language === 'bn' ? 'পেট ফাঁপা' : 'Bloating', days: 3, fill: '#B8A7E8' },
    { name: language === 'bn' ? 'মাথাব্যথা' : 'Headache', days: 2, fill: '#948398' },
    { name: language === 'bn' ? 'ব্রণ' : 'Acne', days: 2, fill: '#F3C4B0' },
  ];

  const featuredArticles = mockArticles.slice(0, 3);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Demo Data Notice Banner */}
      <div className="bg-gradient-to-r from-peach-100/70 via-rose-50/50 to-lavender-50/70 border border-rose-200/60 rounded-2xl p-3 px-4 flex items-center justify-between text-xs text-plum-700">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-rose-500 shrink-0" />
          <p>
            <strong className="text-rose-800">{language === 'bn' ? 'নমুনা ডেটা মোড:' : 'Demo Data Notice:'}</strong>{' '}
            {t.dashboard.sampleDataNotice}
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('profile')}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline shrink-0 cursor-pointer hidden sm:block"
        >
          {language === 'bn' ? 'ডেটা ম্যানেজমেন্ট' : 'Manage Data'}
        </button>
      </div>

      {/* Hero Welcome Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface rounded-3xl p-4 sm:p-6 border border-rose-100 shadow-soft">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose-500">
              {language === 'bn' ? 'ব্যক্তিগত ড্যাশবোর্ড' : 'Personal Health Overview'}
            </span>
            <span className="text-plum-300 hidden xs:inline">•</span>
            <span className="text-[11px] sm:text-xs font-semibold text-plum-600 bg-rose-50/70 px-2 py-0.5 rounded-lg border border-rose-100">
              {new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-plum-900 tracking-tight mt-1">
            {t.dashboard.welcome}, {user.name.split(' ')[0]} 👋
          </h2>
          <p className="text-xs sm:text-sm text-plum-500 mt-1">
            {language === 'bn' 
              ? `আজ আপনার বর্তমান সাইকেলের ${prediction.currentCycleDay}তম দিন। সমস্ত শারীরিক লক্ষণ পর্যবেক্ষণে রয়েছে।`
              : `You're on Day ${prediction.currentCycleDay} of your estimated ~${user.targetCycleLength || 29}-day cycle. Here is your synthesized wellness summary.`}
          </p>
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            className="sm:!py-2.5 sm:!px-4 sm:!text-sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddPeriodModalOpen(true)}
          >
            {t.dashboard.logPeriod}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="sm:!py-2.5 sm:!px-4 sm:!text-sm"
            icon={<Activity className="w-4 h-4 text-rose-500" />}
            onClick={() => setCurrentPage('symptoms')}
          >
            {t.dashboard.logSymptoms}
          </Button>
          <Button
            variant="soft"
            size="sm"
            className="sm:!py-2.5 sm:!px-4 sm:!text-sm"
            icon={<Bot className="w-4 h-4 text-lavender-700" />}
            onClick={() => setIsChatDrawerOpen(true)}
          >
            {t.dashboard.askAi}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="sm:!py-2.5 sm:!px-4 sm:!text-sm border-rose-200 text-rose-700 hover:bg-rose-50"
            icon={<Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />}
            onClick={() => setCurrentPage('partner_view')}
          >
            {language === 'bn' ? 'সঙ্গী ভিউ' : 'Partner Companion'}
          </Button>
        </div>
      </div>

      {/* Main Cycle Dial & Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cycle Wheel Centerpiece (7 cols on lg) */}
        <div className="lg:col-span-7 bg-surface rounded-3xl p-4 sm:p-6 border border-rose-100 shadow-soft flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between border-b border-rose-50 pb-3 mb-2">
            <div>
              <h3 className="font-bold text-base text-plum-900">
                {language === 'bn' ? 'বর্তমান সাইকেল চক্র' : 'Menstrual Cycle Tracker'}
              </h3>
              <p className="text-xs text-plum-400">
                {language === 'bn' ? 'হরমোন পর্যায়ের আনুমানিক রূপরেখা' : 'Longitudinal physiological phase tracker'}
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('calendar')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'bn' ? 'ক্যালেন্ডার' : 'Full Calendar'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <CycleWheel />
        </div>

        {/* Stat Cards & Next Forecast (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {/* Next Period Card */}
          <Card className="bg-gradient-to-br from-rose-50/70 via-surface to-peach-50/50 border-rose-200/70">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-plum-500 uppercase tracking-wider block">
                    {t.dashboard.nextPeriodEst}
                  </span>
                  <Badge variant="rose" size="sm">
                    {prediction.mlConfidencePercentage ? `${prediction.mlConfidencePercentage}% ML Confidence` : 'Trained ML Model'}
                  </Badge>
                </div>
                <span className={`text-2xl sm:text-3xl font-extrabold text-plum-900 mt-1 block ${user.privacyMode ? 'blur-sm' : ''}`}>
                  {new Date(prediction.nextPeriodStart).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' })}
                  {' – '}
                  {new Date(prediction.nextPeriodEnd).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-rose-700 font-medium mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>±{prediction.uncertaintyDays} {language === 'bn' ? 'দিন অনির্দিষ্টতা উইন্ডো' : 'days uncertainty window'}</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-sm">
                <CalendarIcon className="w-6 h-6" />
              </div>
            </div>
          </Card>

          {/* Average Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <span className="text-xs text-plum-500 block">
                {t.insights.avgCycleLength}
              </span>
              <span className={`text-2xl font-extrabold text-plum-900 mt-1 block ${user.privacyMode ? 'blur-sm' : ''}`}>
                {cycleStats.averageCycleLength} <span className="text-xs font-normal text-plum-400">{language === 'bn' ? 'দিন' : 'days'}</span>
              </span>
              <span className="text-[10px] text-sage-600 font-semibold block mt-1">
                ±{cycleStats.cycleVariation} {language === 'bn' ? 'দিন তারতম্য' : 'day variation'}
              </span>
            </Card>

            <Card className="p-4">
              <span className="text-xs text-plum-500 block">
                {t.insights.avgPeriodDuration}
              </span>
              <span className={`text-2xl font-extrabold text-plum-900 mt-1 block ${user.privacyMode ? 'blur-sm' : ''}`}>
                {cycleStats.averagePeriodDuration} <span className="text-xs font-normal text-plum-400">{language === 'bn' ? 'দিন' : 'days'}</span>
              </span>
              <span className="text-[10px] text-plum-400 block mt-1">
                {language === 'bn' ? 'সাধারণ রক্তক্ষরণ' : 'Bleeding duration'}
              </span>
            </Card>
          </div>

          {/* Notification / Reminder Card */}
          <Card className="p-4 bg-lavender-50/50 border-lavender-200/60">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-lavender-200 text-lavender-800 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-plum-900">
                  {language === 'bn' ? 'রিমাইন্ডার পছন্দসমূহ' : 'Cycle Alert Preview'}
                </h4>
                <p className="text-xs text-plum-600 mt-0.5 leading-relaxed">
                  {language === 'bn' 
                    ? 'আপনার পছন্দ অনুযায়ী পিরিয়ডের সম্ভাব্য দিনের ২ দিন আগে আপনি সতর্কবার্তা পাবেন।'
                    : 'Configured to notify 2 days ahead of forecasted period start via discrete notification.'}
                </p>
                <button
                  onClick={() => setCurrentPage('settings')}
                  className="text-xs font-semibold text-lavender-700 hover:text-lavender-900 underline mt-1.5 cursor-pointer"
                >
                  {language === 'bn' ? 'সেটিংস পরিবর্তন করুন' : 'Adjust Reminders'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ================= PARTNER SHARING & CARE COMPANION SHOWCASE ================= */}
      <Card className="bg-gradient-to-br from-rose-50/90 via-surface to-peach-50/60 border border-rose-200/80 p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-peach-400 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
              <Heart className="w-6 h-6 fill-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-plum-900">
                  {language === 'bn' ? 'সঙ্গী শেয়ারিং ও কেয়ার কম্প্যানিয়ন' : 'Partner Cycle Sharing & Support'}
                </h3>
                <Badge variant={user.partnerSharing?.isEnabled ? 'sage' : 'rose'} size="sm">
                  {user.partnerSharing?.isEnabled 
                    ? (language === 'bn' 
                        ? (user.partnerSharing.partnerName ? `${user.partnerSharing.partnerName}-এর সাথে সংযুক্ত` : 'সক্রিয় সংযোগ') 
                        : (user.partnerSharing.partnerName ? `Connected with ${user.partnerSharing.partnerName}` : 'Active Connection'))
                    : (language === 'bn' ? 'শেয়ার করতে প্রস্তুত' : 'Ready to Connect')}
                </Badge>
              </div>
              <p className="text-xs text-plum-600 mt-0.5">
                {language === 'bn'
                  ? 'আপনার জীবনসঙ্গীকে পরবর্তী পিরিয়ডের দিন, হরমোন পর্যায় এবং ভালোবাসার যত্ন সম্পর্কে অবগত রাখুন।'
                  : 'Keep your supportive partner informed with real-time cycle phases, period countdowns, and caring empathy tips.'}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              icon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={() => setCurrentPage('partner_view')}
            >
              {language === 'bn' ? 'সঙ্গী ভিউ খুলুন' : 'Open Partner View'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage('profile')}
            >
              {language === 'bn' ? 'শেয়ারিং সেটিংস' : 'Manage Sharing'}
            </Button>
          </div>
        </div>

        {/* Share Code & Link Tray */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
          <div className="md:col-span-7 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-plum-700 uppercase tracking-wider">
                {language === 'bn' ? 'ইউনিক শেয়ার কোড:' : 'Your Share Code:'}
              </span>
              <div className="bg-white px-3 py-1.5 rounded-xl border border-rose-200 font-mono font-black text-sm tracking-widest text-rose-600 shadow-xs">
                {user.partnerSharing?.shareCode || 'CYCLE-8492'}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-rose-100/70 hover:bg-rose-100 text-rose-800 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-sage-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কোড কপি' : 'Copy Code')}</span>
              </button>
            </div>
            <p className="text-[11px] text-plum-500 flex items-center gap-1.5 leading-normal">
              <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0" />
              <span>
                {language === 'bn'
                  ? 'সম্পূর্ণ রিড-অনলি ও সুরক্ষিত: আপনার ব্যক্তিগত লক্ষণ ও বিস্তারিত নোট কখনোই শেয়ার করা হয় না।'
                  : '100% Read-only & Secure: Confidential symptom diaries and intimate medical notes remain private.'}
              </span>
            </p>
          </div>

          <div className="md:col-span-5 flex md:justify-end items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full md:w-auto px-4 py-2 bg-white hover:bg-peach-50 text-plum-700 border border-rose-200 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-sage-600" /> : <Share2 className="w-3.5 h-3.5 text-rose-500" />}
              <span>{copiedLink ? (language === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link Copied!') : (language === 'bn' ? 'সরাসরি ব্রাউজার লিংক কপি' : 'Copy Direct Companion Link')}</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Recent History & Symptom Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cycle Duration Chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-plum-900">
                  {t.dashboard.cycleHistory}
                </h3>
                <Badge variant="peach" size="sm">
                  {language === 'bn' ? 'নমুনা ডেমো চার্ট' : 'Demo Dataset'}
                </Badge>
              </div>
              <p className="text-xs text-plum-400">
                {t.dashboard.cycleHistoryDesc}
              </p>
            </div>
            <Badge variant="plum" size="sm">
              {cycles.length} {language === 'bn' ? 'টি সাইকেল' : 'cycles'}
            </Badge>
          </div>

          {cycles.length === 0 ? (
            <div className="h-56 w-full flex flex-col items-center justify-center text-center p-4 bg-canvas rounded-2xl border border-dashed border-rose-200">
              <CalendarIcon className="w-8 h-8 text-rose-300 mb-2" />
              <p className="text-xs text-plum-500 font-medium">
                {language === 'bn' ? 'এখনও কোনো সাইকেলের তথ্য নেই।' : 'No cycle history logged yet.'}
              </p>
              <button
                onClick={() => setIsAddPeriodModalOpen(true)}
                className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-800 underline cursor-pointer"
              >
                {t.dashboard.logPeriod}
              </button>
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cycleChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FCE7EB" vertical={false} />
                  <XAxis dataKey="startDate" stroke="#948398" fontSize={11} tickLine={false} />
                  <YAxis stroke="#948398" fontSize={11} domain={[20, 35]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      borderColor: '#F8D0DC',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="length" fill="#D96C91" radius={[6, 6, 0, 0]} name={t.calendar.recordedCycle} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Most Frequent Symptoms */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-plum-900">
                  {t.dashboard.symptomTrends}
                </h3>
                <Badge variant="lavender" size="sm">
                  {language === 'bn' ? 'নমুনা ডেমো চার্ট' : 'Demo Dataset'}
                </Badge>
              </div>
              <p className="text-xs text-plum-400">
                {language === 'bn' ? 'গত ৩০ দিনে সবচেয়ে বেশি দেখা যাওয়া লক্ষণসমূহ' : 'Recorded frequency in the last 30 days'}
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('symptoms')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'bn' ? 'লক্ষণ ট্র্যাকার' : 'View Tracker'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {symptoms.length === 0 ? (
            <div className="h-56 w-full flex flex-col items-center justify-center text-center p-4 bg-canvas rounded-2xl border border-dashed border-rose-200">
              <Activity className="w-8 h-8 text-rose-300 mb-2" />
              <p className="text-xs text-plum-500 font-medium">
                {language === 'bn' ? 'কোনো লক্ষণ রেকর্ড করা হয়নি।' : 'No symptoms recorded yet.'}
              </p>
              <button
                onClick={() => setCurrentPage('symptoms')}
                className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-800 underline cursor-pointer"
              >
                {t.dashboard.logSymptoms}
              </button>
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={symptomData} layout="vertical" margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FCE7EB" horizontal={false} />
                  <XAxis type="number" stroke="#948398" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#302536" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      borderColor: '#F8D0DC',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="days" radius={[0, 6, 6, 0]} name={language === 'bn' ? 'দিন সংখ্যা' : 'Logged days'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Connected Modules Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module 1: Period Health */}
        <div 
          onClick={() => setCurrentPage('calendar')}
          className="bg-gradient-to-br from-rose-50/80 to-peach-50/60 rounded-3xl p-5 border border-rose-200/70 hover:shadow-soft transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-xs border border-rose-100 flex items-center justify-center shrink-0">
              <img
                src="/images/uterus-cute.png"
                alt="Period Health Module"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                {language === 'bn' ? 'মডিউল ১' : 'Module 1'}
              </span>
              <h4 className="font-bold text-sm sm:text-base text-plum-900 truncate">
                {language === 'bn' ? 'পিরিয়ড ও সাইকেল স্বাস্থ্য' : 'Period Health & Cycles'}
              </h4>
              <p className="text-xs text-plum-600 line-clamp-1">
                {language === 'bn' ? 'তারিখ, প্রবাহ, লক্ষণ ও ক্যালেন্ডার' : 'Period dates, flow & calendar'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
        </div>

        {/* Module 2: Mental Health */}
        <div 
          onClick={() => setCurrentPage('mentalHealth')}
          className="bg-gradient-to-br from-lavender-50/80 to-rose-50/60 rounded-3xl p-5 border border-lavender-200/70 hover:shadow-soft transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-xs border border-lavender-100 flex items-center justify-center shrink-0">
              <img
                src="/images/meditating-brain.png"
                alt="Mental Health Module"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-lavender-700 block">
                {language === 'bn' ? 'মডিউল ২' : 'Module 2'}
              </span>
              <h4 className="font-bold text-sm sm:text-base text-plum-900 truncate">
                {language === 'bn' ? 'মানসিক স্বাস্থ্য ও আবেগ' : 'Mental Health & Mood'}
              </h4>
              <p className="text-xs text-plum-600 line-clamp-1">
                {language === 'bn' ? 'দৈনিক মেজাজ ডায়েরি ও ব্রিদিং' : 'Daily mood scale & breathing'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-lavender-600 shrink-0 ml-2" />
        </div>

        {/* Module 3: Partner Sharing & Support */}
        <div 
          onClick={() => setCurrentPage('partner_view')}
          className="bg-gradient-to-br from-peach-50/80 to-rose-50/60 rounded-3xl p-5 border border-peach-200/70 hover:shadow-soft transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-xs border border-peach-100 flex items-center justify-center shrink-0 text-rose-500">
              <Heart className="w-6 h-6 fill-rose-500/20 text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                {language === 'bn' ? 'মডিউল ৩' : 'Module 3'}
              </span>
              <h4 className="font-bold text-sm sm:text-base text-plum-900 truncate">
                {language === 'bn' ? 'সঙ্গী কেয়ার কম্প্যানিয়ন' : 'Partner Companion'}
              </h4>
              <p className="text-xs text-plum-600 line-clamp-1">
                {language === 'bn' ? 'রিড-অনলি সাইকেল ও কেয়ার টিপস' : 'Read-only cycle & care tips'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
        </div>
      </div>

      {/* Educational Article Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-plum-900">
              {t.dashboard.recommendedReading}
            </h3>
            <p className="text-xs text-plum-500">
              {language === 'bn' 
                ? 'আপনার বর্তমান পর্যায় ও লক্ষণের সাথে প্রাসঙ্গিক গাইনি সহায়িকা'
                : 'Evidence-based guides relevant to your current luteal phase & symptoms'}
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('education')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'bn' ? 'সমস্ত প্রবন্ধ দেখুন' : 'View All Library'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredArticles.map(article => (
            <Card
              key={article.id}
              hoverable
              onClick={() => {
                setSelectedArticleId(article.id);
                setCurrentPage('education');
              }}
              className="flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <Badge variant={article.isPcosFeatured ? 'rose' : 'lavender'} size="sm">
                    {article.category.toUpperCase().replace('_', ' ')}
                  </Badge>
                  <span className="text-[11px] text-plum-400">{article.readTime}</span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-plum-900 line-clamp-2 leading-snug">
                  {language === 'bn' ? article.titleBn : article.titleEn}
                </h4>
                <p className="text-xs text-plum-600 line-clamp-2 leading-relaxed">
                  {language === 'bn' ? article.summaryBn : article.summaryEn}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-rose-50 flex items-center justify-between text-xs font-semibold text-rose-600">
                <span>{t.education.readArticle}</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
