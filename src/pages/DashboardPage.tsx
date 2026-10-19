import React from 'react';
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
  Bell
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface rounded-3xl p-6 border border-rose-100 shadow-soft">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
            {language === 'bn' ? 'ব্যক্তিগত ড্যাশবোর্ড' : 'Personal Health Overview'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-plum-900 tracking-tight mt-0.5">
            {t.dashboard.welcome}, {user.name.split(' ')[0]} 👋
          </h2>
          <p className="text-xs sm:text-sm text-plum-500 mt-1">
            {language === 'bn' 
              ? 'আজ আপনার বর্তমান সাইকেলের ১৯তম দিন। সমস্ত শারীরিক লক্ষণ পর্যবেক্ষণে রয়েছে।'
              : "You're on Day 19 of your estimated ~29-day cycle. Here is your synthesized wellness summary."}
          </p>
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddPeriodModalOpen(true)}
          >
            {t.dashboard.logPeriod}
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={<Activity className="w-4 h-4 text-rose-500" />}
            onClick={() => setCurrentPage('symptoms')}
          >
            {t.dashboard.logSymptoms}
          </Button>
          <Button
            variant="soft"
            size="md"
            icon={<Bot className="w-4 h-4 text-lavender-700" />}
            onClick={() => setIsChatDrawerOpen(true)}
          >
            {t.dashboard.askAi}
          </Button>
        </div>
      </div>

      {/* Main Cycle Dial & Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cycle Wheel Centerpiece (7 cols on lg) */}
        <div className="lg:col-span-7 bg-surface rounded-3xl p-6 border border-rose-100 shadow-soft flex flex-col items-center justify-center">
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
                <span className="text-xs font-semibold text-plum-500 uppercase tracking-wider block">
                  {t.dashboard.nextPeriodEst}
                </span>
                <span className={`text-2xl sm:text-3xl font-extrabold text-plum-900 mt-1 block ${user.privacyMode ? 'blur-sm' : ''}`}>
                  Oct 30 – Nov 2
                </span>
                <div className="flex items-center gap-1.5 text-xs text-rose-700 font-medium mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~10 {language === 'bn' ? 'দিন বাকি' : 'days away'}</span>
                  <span className="text-[11px] text-plum-400">({t.dashboard.uncertainty})</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: Period Health */}
        <div 
          onClick={() => setCurrentPage('calendar')}
          className="bg-gradient-to-br from-rose-50/80 to-peach-50/60 rounded-3xl p-5 border border-rose-200/70 hover:shadow-soft transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-xs border border-rose-100 flex items-center justify-center shrink-0">
              <img
                src="/images/uterus-cute.png"
                alt="Period Health Module"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                {language === 'bn' ? 'মডিউল ১' : 'Module 1'}
              </span>
              <h4 className="font-bold text-base text-plum-900">
                {language === 'bn' ? 'পিরিয়ড ও সাইকেল স্বাস্থ্য' : 'Period Health & Menstrual Cycle'}
              </h4>
              <p className="text-xs text-plum-600 line-clamp-1">
                {language === 'bn' ? 'পিরিয়ড তারিখ, প্রবাহের মাত্রা, শারীরিক লক্ষণ ও ক্যালেন্ডার' : 'Period logging, flow intensity, physical symptoms & cycle stats'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-rose-500 shrink-0 ml-3" />
        </div>

        {/* Module 2: Mental Health */}
        <div 
          onClick={() => setCurrentPage('mentalHealth')}
          className="bg-gradient-to-br from-lavender-50/80 to-rose-50/60 rounded-3xl p-5 border border-lavender-200/70 hover:shadow-soft transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-xs border border-lavender-100 flex items-center justify-center shrink-0">
              <img
                src="/images/meditating-brain.png"
                alt="Mental Health Module"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-lavender-700 block">
                {language === 'bn' ? 'মডিউল ২' : 'Module 2'}
              </span>
              <h4 className="font-bold text-base text-plum-900">
                {language === 'bn' ? 'মানসিক স্বাস্থ্য ও আবেগ' : 'Mental Health & Emotional Wellbeing'}
              </h4>
              <p className="text-xs text-plum-600 line-clamp-1">
                {language === 'bn' ? 'দৈনিক মেজাজ ডায়েরি, রিল্যাক্সিং ব্রিদিং ও মন-শরীরের সংযোগ' : 'Daily mood scale, box breathing exercises & cycle correlation'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-lavender-600 shrink-0 ml-3" />
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
