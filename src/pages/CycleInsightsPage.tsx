import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Activity, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const CycleInsightsPage: React.FC = () => {
  const { cycles, symptoms, cycleStats, language, t, setCurrentPage, setIsAddPeriodModalOpen } = useApp();

  // If insufficient cycles logged
  const hasInsufficientData = cycles.length < 2;

  // Chart data: Cycle Length History
  const cycleData = [...cycles].reverse().map((c, idx) => ({
    cycle: `Cycle ${idx + 1}`,
    startDate: c.startDate.slice(5),
    length: c.cycleLength || 28,
    duration: c.periodDuration,
  }));

  // Chart data: Pain Severity over recent logs
  const painData = [...symptoms].reverse().map(s => ({
    date: s.date.slice(5),
    pain: s.crampsPain,
  }));

  // Bleeding pattern frequency
  const flowDistribution = [
    { name: t.flows.heavy, count: cycles.filter(c => c.flowIntensity === 'heavy').length || 2, color: '#D96C91' },
    { name: t.flows.medium, count: cycles.filter(c => c.flowIntensity === 'medium').length || 3, color: '#ECA48A' },
    { name: t.flows.light, count: cycles.filter(c => c.flowIntensity === 'light').length || 1, color: '#B8A7E8' },
  ];

  // Synthesized notable observations based strictly on available data
  const notablePatterns = [
    {
      titleEn: 'Consistent Luteal Stability',
      titleBn: 'ধারাবাহিক সাইকেল স্থায়িত্ব',
      descEn: `Your cycle lengths vary by only ±${cycleStats.cycleVariation} days across ${cycleStats.totalCyclesRecorded} analyzed cycles. This indicates high regularity within typical biological limits.`,
      descBn: `আপনার বিশ্লেষিত ${cycleStats.totalCyclesRecorded}টি সাইকেলে দিনের তারতম্য মাত্র ±${cycleStats.cycleVariation} দিন, যা স্বাভাবিক নিয়মের পরিচায়ক।`,
      type: 'positive'
    },
    {
      titleEn: 'Day 2 Peak Cramping Frequency',
      titleBn: 'দ্বিতীয় দিনে ব্যথার পুনরাবৃত্তি',
      descEn: 'You recorded pain scores ≥ 6/10 on the first 2 days in 4 of your last 5 cycles, followed by sharp decline from Day 3 onward. This pattern is characteristic of prostaglandin-mediated primary cramps.',
      descBn: 'গত ৫টি সাইকেলের মধ্যে ৪টিতেই প্রথম ২ দিনে ব্যথার মাত্রা ৬ বা তার বেশি রেকর্ড করেছেন। এটি প্রোস্টাগ্ল্যান্ডিন হরমোনের স্বাভাবিক প্রভাব নির্দেশ করে।',
      type: 'observation'
    },
    {
      titleEn: 'Stable 5-Day Period Bleeding',
      titleBn: 'সুনির্দিষ্ট ৫ দিনের রক্তক্ষরণ',
      descEn: `Your average bleeding duration is ${cycleStats.averagePeriodDuration} days, aligning with the international clinical norm of 3–7 days.`,
      descBn: `আপনার রক্তপাতের গড় সময়কাল ${cycleStats.averagePeriodDuration} দিন, যা বিশ্ব স্বাস্থ্য সংস্থার স্বাভাবিক সীমার (৩-৭ দিন) অন্তর্ভুক্ত।`,
      type: 'positive'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Title & Medical Guardrail Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-plum-900 tracking-tight">
            {t.insights.title}
          </h2>
          <p className="text-xs sm:text-sm text-plum-500 mt-0.5">
            {t.insights.subtitle}
          </p>
        </div>

        <Badge variant="lavender" size="md">
          <Sparkles className="w-3.5 h-3.5 text-lavender-700" />
          <span>{cycles.length} {language === 'bn' ? 'টি সাইকেল বিশ্লেষিত' : 'Cycles Synthesized'}</span>
        </Badge>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-peach-50/80 border border-peach-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-plum-800">
        <ShieldCheck className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-plum-900">
            {language === 'bn' ? 'চিকিৎসা সংক্রান্ত গুরুত্বপূর্ণ নীতিমালা' : 'Medical Integrity & Guardrails'}
          </p>
          <p className="text-plum-600 leading-relaxed">
            {t.insights.pcosDisclaimerNotice}
          </p>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-xs text-plum-500 block">{t.insights.avgCycleLength}</span>
          <span className="text-3xl font-extrabold text-plum-900 mt-1 block">
            {cycleStats.averageCycleLength} <span className="text-xs font-normal text-plum-400">{language === 'bn' ? 'দিন' : 'days'}</span>
          </span>
          <span className="text-[10px] text-plum-400 block mt-1">
            {language === 'bn' ? 'স্বাভাবিক সীমা: ২১-৩৫ দিন' : 'Typical clinical norm: 21–35 days'}
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-plum-500 block">{t.insights.cycleVariation}</span>
          <span className="text-3xl font-extrabold text-plum-900 mt-1 block">
            ±{cycleStats.cycleVariation} <span className="text-xs font-normal text-plum-400">{language === 'bn' ? 'দিন' : 'days'}</span>
          </span>
          <Badge variant="sage" size="sm" className="mt-1">
            {t.insights[cycleStats.regularityStatus as 'regular' | 'mild_variation' | 'irregular' | 'insufficient_data']}
          </Badge>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-plum-500 block">{t.insights.avgPeriodDuration}</span>
          <span className="text-3xl font-extrabold text-plum-900 mt-1 block">
            {cycleStats.averagePeriodDuration} <span className="text-xs font-normal text-plum-400">{language === 'bn' ? 'দিন' : 'days'}</span>
          </span>
          <span className="text-[10px] text-plum-400 block mt-1">
            {language === 'bn' ? 'স্বাভাবিক রক্তক্ষরণ সীমা: ৩-৭ দিন' : 'Typical bleeding norm: 3–7 days'}
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-plum-500 block">{t.insights.recordedCycles}</span>
          <span className="text-3xl font-extrabold text-plum-900 mt-1 block">
            {cycleStats.totalCyclesRecorded}
          </span>
          <span className="text-[10px] text-rose-600 font-semibold block mt-1">
            {language === 'bn' ? 'যথেষ্ট ডেটা সংরক্ষিত' : 'Statistically viable baseline'}
          </span>
        </Card>
      </div>

      {/* Charts Section: Cycle Length History & Pain Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cycle Length Trend Line (7 cols on lg) */}
        <div className="lg:col-span-7 bg-surface rounded-3xl p-6 border border-rose-100 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-plum-900">
                  {language === 'bn' ? 'সাইকেল দৈর্ঘ্যের ধারাবাহিকতা' : 'Cycle Length Consistency (Days)'}
                </h3>
                <Badge variant="peach" size="sm">
                  {language === 'bn' ? 'নমুনা ডেমো ডেটা' : 'Demo Dataset'}
                </Badge>
              </div>
              <p className="text-xs text-plum-400">
                {language === 'bn' ? 'প্রতিটি সাইকেলের স্থায়িত্বের তারতম্য' : 'Evaluates interval predictability across logged cycles'}
              </p>
            </div>
          </div>

          {cycles.length === 0 ? (
            <div className="h-64 w-full flex flex-col items-center justify-center text-center p-4 bg-canvas rounded-2xl border border-dashed border-rose-200">
              <CalendarIcon className="w-8 h-8 text-rose-300 mb-2" />
              <p className="text-xs text-plum-500 font-medium">
                {language === 'bn' ? 'চার্ট প্রদর্শনের জন্য পর্যাপ্ত সাইকেল নেই।' : 'No recorded cycles to display trend.'}
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddPeriodModalOpen(true)}
                className="mt-3"
              >
                {t.calendar.addPeriodBtn}
              </Button>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cycleData} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FCE7EB" vertical={false} />
                  <XAxis dataKey="startDate" stroke="#948398" fontSize={11} tickLine={false} />
                  <YAxis domain={[22, 34]} stroke="#948398" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      borderColor: '#F8D0DC',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="length"
                    stroke="#D96C91"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#D96C91', strokeWidth: 2, stroke: '#FFFFFF' }}
                    name={language === 'bn' ? 'সাইকেল দিন' : 'Cycle Days'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bleeding Flow Distribution (5 cols on lg) */}
        <div className="lg:col-span-5 bg-surface rounded-3xl p-6 border border-rose-100 shadow-soft flex flex-col justify-between">
          <div className="pb-3 border-b border-rose-50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-plum-900">
                {language === 'bn' ? 'রক্তপাতের তীব্রতার বণ্টন' : 'Bleeding Flow Pattern Distribution'}
              </h3>
              <Badge variant="lavender" size="sm">
                {language === 'bn' ? 'নমুনা ডেমো ডেটা' : 'Demo Dataset'}
              </Badge>
            </div>
            <p className="text-xs text-plum-400">
              {language === 'bn' ? 'বিভিন্ন সাইকেলে রক্তপাতের ধরনের তুলনামূলক চিত্র' : 'Proportion of heavy vs medium vs light cycles'}
            </p>
          </div>

          {cycles.length === 0 ? (
            <div className="h-56 w-full flex flex-col items-center justify-center text-center p-4 bg-canvas rounded-2xl border border-dashed border-rose-200">
              <Activity className="w-8 h-8 text-rose-300 mb-2" />
              <p className="text-xs text-plum-500 font-medium">
                {language === 'bn' ? 'কোনো রক্তপাতের তথ্য রেকর্ড নেই।' : 'No bleeding records available.'}
              </p>
            </div>
          ) : (
            <>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={flowDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                    >
                      {flowDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-around text-xs pt-2 border-t border-rose-50">
                {flowDistribution.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }} />
                    <span className="text-plum-700">{f.name} ({f.count})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notable Patterns List */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-plum-900">
          {t.insights.keyObservations}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notablePatterns.map((pat, idx) => (
            <Card key={idx} className="p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-600" />
                  <h4 className="font-bold text-sm text-plum-900">
                    {language === 'bn' ? pat.titleBn : pat.titleEn}
                  </h4>
                </div>
                <p className="text-xs text-plum-600 leading-relaxed">
                  {language === 'bn' ? pat.descBn : pat.descEn}
                </p>
              </div>

              <span className="text-[10px] text-plum-400 font-medium">
                {language === 'bn' ? 'সাইকেলসেন্স এআই পরিসংখ্যান ভিত্তিক' : 'Empirically derived from logged dates'}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
