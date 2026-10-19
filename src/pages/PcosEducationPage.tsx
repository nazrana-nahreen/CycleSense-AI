import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockArticles } from '../data/mockArticles';
import { HealthArticle, ArticleCategory } from '../types';
import { 
  Search, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  ArrowLeft, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Heart,
  Share2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const PcosEducationPage: React.FC = () => {
  const { selectedArticleId, setSelectedArticleId, language, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');

  const categories: { id: ArticleCategory | 'all'; labelEn: string; labelBn: string }[] = [
    { id: 'all', labelEn: 'All Guides', labelBn: 'সকল সহায়িকা' },
    { id: 'pcos', labelEn: 'PCOS Awareness', labelBn: 'পিসিওএস সচেতনতা' },
    { id: 'irregular_periods', labelEn: 'Irregular Cycles', labelBn: 'অনিয়মিত পিরিয়ড' },
    { id: 'painful_periods', labelEn: 'Pain & Cramps', labelBn: 'ব্যথা ও ক্র্যাম্পস' },
    { id: 'heavy_bleeding', labelEn: 'Heavy Bleeding', labelBn: 'অতিরিক্ত রক্তক্ষরণ' },
    { id: 'pms_mood', labelEn: 'PMS & Mood', labelBn: 'পিএমএস ও মেজাজ' },
    { id: 'endometriosis', labelEn: 'Endometriosis', labelBn: 'এন্ডোমেট্রিওসিস' },
    { id: 'hygiene', labelEn: 'Menstrual Hygiene', labelBn: 'মাসিক পরিচ্ছন্নতা' },
    { id: 'medical_care', labelEn: 'Urgent Care Red Flags', labelBn: 'বিপদচিহ্ন ও জরুরি সেবা' },
  ];

  // Filter articles
  const filteredArticles = mockArticles.filter(art => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const title = language === 'bn' ? art.titleBn : art.titleEn;
    const summary = language === 'bn' ? art.summaryBn : art.summaryEn;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || title.toLowerCase().includes(q) || summary.toLowerCase().includes(q) || art.tags.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  // Selected article for detailed reading
  const activeArticle = mockArticles.find(a => a.id === selectedArticleId);

  // If viewing a single article
  if (activeArticle) {
    const content = language === 'bn' ? activeArticle.contentBn : activeArticle.contentEn;
    const title = language === 'bn' ? activeArticle.titleBn : activeArticle.titleEn;

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fadeIn">
        {/* Back to Library Button */}
        <button
          onClick={() => setSelectedArticleId(null)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.education.backToArticles}</span>
        </button>

        {/* Article Header Card */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-soft space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant={activeArticle.isPcosFeatured ? 'rose' : 'lavender'} size="md">
                {activeArticle.category.toUpperCase().replace('_', ' ')}
              </Badge>
              <span className="text-plum-400">•</span>
              <span className="text-plum-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeArticle.readTime}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-plum-500">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
              <span>{activeArticle.reviewedBy}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-plum-900 tracking-tight leading-snug">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-plum-500 italic pb-2 border-b border-rose-50">
            {language === 'bn' ? 'সর্বশেষ পর্যালোচনা:' : 'Reviewed Date:'} {activeArticle.reviewedDate}
          </p>

          {/* Introduction */}
          <div className="text-sm sm:text-base text-plum-700 leading-relaxed pt-2">
            {content.introduction}
          </div>
        </div>

        {/* If PCOS article, show the friendly cat explainer */}
        {activeArticle.category === 'pcos' && (
          <div className="bg-gradient-to-r from-rose-50/90 via-peach-50/70 to-lavender-50/90 rounded-3xl p-6 border border-rose-100/90 shadow-soft flex flex-col sm:flex-row items-center gap-6">
            <div className="w-40 sm:w-48 shrink-0 bg-white rounded-2xl p-2.5 shadow-sm border border-rose-100 flex justify-center">
              <img
                src="/images/pcos-explained-cats.png"
                alt="PCOS explained with cats cartoon"
                className="w-full h-auto object-contain rounded-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <Badge variant="rose" size="sm">
                🐱 {language === 'bn' ? 'সহজ ভিজ্যুয়াল ধারণা' : 'Visual Explainer: PCOS with Cats'}
              </Badge>
              <h3 className="font-bold text-base sm:text-lg text-plum-900">
                {language === 'bn' ? 'ডিম্বাশয়ে কী ঘটে?' : 'What Happens to the Ovaries in PCOS?'}
              </h3>
              <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                {language === 'bn'
                  ? 'কার্টুনে যেমন ওভারি বা ডিম্বাশয় কাঁদতে দেখা যাচ্ছে—হরমোন (যেমন অ্যান্ড্রোজেন ও ইনসুলিন)-এর সাময়িক ভারসাম্যহীনতার কারণে ফলিকলগুলো সময়মতো ডিম্বাণু ছাড়তে না পেরে ডিম্বাশয়ে জমে থাকে। সঠিক খাদ্যাভ্যাস, মৃদু ব্যায়াম ও ডাক্তারের পরামর্শে শরীর পুনরায় স্বাভাবিক ছন্দে ফেরে।'
                  : 'As shown in the cartoon, hormonal imbalances (elevated androgens and insulin) cause mature follicles to pause rather than release eggs—creating distressed or "crying" ovaries. With personalized nutrition, exercise, and clinical guidance, this cycle can be gently restored.'}
              </p>
            </div>
          </div>
        )}

        {/* If PMS & Mood article, show the menstrual & mental health explainer */}
        {activeArticle.category === 'pms_mood' && (
          <div className="bg-gradient-to-r from-lavender-50/90 via-rose-50/70 to-peach-50/90 rounded-3xl p-6 border border-rose-100/90 shadow-soft flex flex-col sm:flex-row items-center gap-6">
            <div className="w-44 sm:w-56 shrink-0 bg-white rounded-2xl p-2.5 shadow-sm border border-rose-100 flex justify-center">
              <img
                src="/images/periods-and-mental-health.jpg"
                alt="Periods and mental health illustration"
                className="w-full h-auto object-contain rounded-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <Badge variant="lavender" size="sm">
                🧠 {language === 'bn' ? 'মন ও হরমোনের বোঝাপড়া' : 'Mind & Hormone Connection'}
              </Badge>
              <h3 className="font-bold text-base sm:text-lg text-plum-900">
                {language === 'bn' ? 'পিএমএস ও মানসিক অস্থিরতা' : 'Why Does PMS Cause Emotional Distress?'}
              </h3>
              <p className="text-xs sm:text-sm text-plum-600 leading-relaxed">
                {language === 'bn'
                  ? 'মাসিকের ঠিক আগে লিউটিয়াল ফেজে ইস্ট্রোজেন ও প্রোজেস্টেরনের দ্রুত পতনের কারণে মস্তিষ্কে সেরোটোনিনের মাত্রা কমে যেতে পারে। এটি আপনার কোনো চারিত্রিক দুর্বলতা নয়, বরং প্রাকৃতিক হরমোনজনিত পরিবর্তনের প্রভাব।'
                  : 'Sharp declines in estrogen and allopregnanolone during the late luteal phase modulate central serotonin receptors. Experiencing thought clutter, crying spells, or irritability is a biological sensitivity, not a personal flaw.'}
              </p>
            </div>
          </div>
        )}

        {/* Symptoms and Causes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm sm:text-base">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span>{language === 'bn' ? 'সাধারণ লক্ষণসমূহ' : 'Common Symptoms'}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-plum-700">
              {content.commonSymptoms.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-lavender-800 font-bold text-sm sm:text-base">
              <Stethoscope className="w-5 h-5 text-lavender-600" />
              <span>{language === 'bn' ? 'শারীরিক ও জৈবিক কারণ' : 'Physiological Causes'}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-plum-700">
              {content.possibleCauses.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lavender-500 mt-2 shrink-0" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* When to see a doctor */}
        <Card className="p-6 border-l-4 border-l-rose-500 bg-rose-50/40 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>{t.education.whenToConsult}</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-plum-800">
            {content.whenToSeeDoctor.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Self-Care & Management */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-sage-700 font-bold text-base">
            <Heart className="w-5 h-5 text-sage-600" />
            <span>{t.education.lifestyleTips}</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-plum-700">
            {content.selfCareAndManagement.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-500 mt-2 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Reliable Evidence Sources */}
        <div className="p-5 bg-canvas rounded-2xl border border-rose-100 text-xs space-y-2">
          <span className="font-bold text-plum-900 block">
            {t.education.sources}:
          </span>
          <div className="space-y-1.5">
            {content.reliableSources.map((src, idx) => (
              <div key={idx} className="flex items-center gap-2 text-plum-600">
                <span>• {src.name} — <em>{src.organization}</em></span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:text-rose-800 underline inline-flex items-center gap-0.5"
                >
                  <span>Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Articles Library Overview
  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-plum-900 tracking-tight">
            {t.education.title}
          </h2>
          <p className="text-xs sm:text-sm text-plum-500 mt-0.5">
            {t.education.subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-plum-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.education.searchPlaceholder}
            className="w-full bg-surface border border-rose-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 shadow-xs"
          />
        </div>
      </div>

      {/* Featured Fun Cartoon Explainer Banner */}
      <div className="bg-gradient-to-br from-rose-50/80 via-peach-50/60 to-lavender-50/80 rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-soft grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 flex justify-center">
          <div className="relative group max-w-[210px] rounded-2xl overflow-hidden bg-white p-2.5 shadow-sm border border-rose-200/70">
            <img
              src="/images/pcos-explained-cats.png"
              alt="PCOS explained with cats"
              className="w-full h-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="md:col-span-8 space-y-3 text-center md:text-left">
          <Badge variant="rose" size="md">
            🐱 {language === 'bn' ? 'সহজ ভিজ্যুয়াল শিক্ষা' : 'Featured Cartoon: PCOS with Cats'}
          </Badge>
          <h3 className="text-xl sm:text-2xl font-extrabold text-plum-900 tracking-tight">
            {language === 'bn'
              ? 'ভয় নয়, ভালোবাসায় বুঝুন আপনার ডিম্বাশয় ও হরমোনের ভাষা'
              : 'Understanding Polycystic Ovaries with Empathy & Simplicity'}
          </h3>
          <p className="text-xs sm:text-sm text-plum-600 leading-relaxed max-w-xl">
            {language === 'bn'
              ? 'পিসিওএস কোনো ভয়ের বিষয় নয়। ডিম্বাশয়ে হরমোনের তারতম্যের কারণে ডিম্বাণু ছাড়তে দেরি হলে ওভারি কিছুটা বিপাকে পড়ে। তবে সঠিক পুষ্টি, সক্রিয় জীবনযাপন ও চিকিৎসকের পরামর্শে ওভারি পুনরায় স্বাভাবিক ছন্দে কাজ করতে পারে।'
              : 'Polycystic Ovary Syndrome (PCOS) can feel intimidating, but simple visual education removes the shame. When hormones fluctuate, mature follicles pause ovulation—creating "crying ovaries". With mindful nutrition, stress control, and clinical support, balance is achievable.'}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={() => setSelectedArticleId('pcos-guide')}
            >
              {language === 'bn' ? 'পিসিওএস বিস্তারিত গাইড পড়ুন' : 'Read Full PCOS 101 Guide'}
            </Button>
            <span className="text-xs text-plum-500 font-medium">
              🩺 {language === 'bn' ? 'গাইনোকোলজি ক্লিনিকাল গাইডলাইন' : 'Clinical Gynecological Guidelines'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-surface hover:bg-peach-50 text-plum-700 border border-rose-100'
            }`}
          >
            {language === 'bn' ? cat.labelBn : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-plum-400">
            {language === 'bn' ? 'কোনো প্রবন্ধ পাওয়া যায়নি।' : 'No matching health articles found.'}
          </div>
        ) : (
          filteredArticles.map(article => (
            <Card
              key={article.id}
              hoverable
              onClick={() => setSelectedArticleId(article.id)}
              className="flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <Badge variant={article.isPcosFeatured ? 'rose' : 'lavender'} size="sm">
                    {article.category.toUpperCase().replace('_', ' ')}
                  </Badge>
                  <span className="text-[11px] text-plum-400">{article.readTime}</span>
                </div>

                <h3 className="font-bold text-base text-plum-900 leading-snug line-clamp-2">
                  {language === 'bn' ? article.titleBn : article.titleEn}
                </h3>

                <p className="text-xs text-plum-600 line-clamp-3 leading-relaxed">
                  {language === 'bn' ? article.summaryBn : article.summaryEn}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-canvas text-plum-500 px-2 py-0.5 rounded-md border border-rose-100/60 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-rose-50 flex items-center justify-between text-xs font-semibold text-rose-600">
                <span>{t.education.readArticle}</span>
                <span className="text-[11px] text-plum-400 font-normal">
                  {article.reviewedDate}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
