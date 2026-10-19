import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Clock, 
  Languages, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Save
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const { user, language, setLanguage, resetToDemoData, t } = useApp();

  const [periodAlert, setPeriodAlert] = useState(true);
  const [ovulationAlert, setOvulationAlert] = useState(true);
  const [dailyLogAlert, setDailyLogAlert] = useState(true);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [discreteText, setDiscreteText] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-plum-900 tracking-tight">
          {t.settings.title}
        </h2>
        <p className="text-xs sm:text-sm text-plum-500 mt-0.5">
          {t.settings.subtitle}
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-sage-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
          <span>{language === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings preferences saved!'}</span>
        </div>
      )}

      {/* Prototype Web Push Disclaimer */}
      <div className="p-3.5 bg-peach-50/70 border border-peach-200 rounded-2xl text-xs text-plum-700 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
        <p>
          <strong>{language === 'bn' ? 'প্রোটোটাইপ তথ্য:' : 'Prototype Note:'}</strong>{' '}
          {language === 'bn'
            ? 'এই ফ্রন্টএন্ড প্রোটোটাইপে রিমাইন্ডার পছন্দসমূহ স্থানীয় মেমরিতে সংরক্ষিত থাকে। ব্যাকএন্ড পুশ সার্ভিস যুক্ত হলে এটি ডিভাইসে নোটিফিকেশন পাঠাবে।'
            : 'Reminder preferences are currently stored in local browser settings. They will trigger automated native Web Push alerts once the backend server is connected.'}
        </p>
      </div>

      {/* Reminder Configuration Form */}
      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-rose-50 font-bold text-base text-plum-900">
            <Bell className="w-5 h-5 text-rose-500" />
            <span>{t.settings.reminders}</span>
          </div>

          <div className="space-y-4">
            {/* Period Alert */}
            <div className="flex items-center justify-between p-3.5 bg-canvas rounded-2xl border border-rose-100">
              <div>
                <span className="font-semibold text-xs sm:text-sm text-plum-900 block">
                  {t.settings.periodReminder}
                </span>
                <span className="text-xs text-plum-500">
                  {language === 'bn' ? 'প্রস্তুতির জন্য সম্ভাব্য দিনের ২ দিন আগে বিজ্ঞপ্তি' : 'Gentle prompt to pack supplies 48h prior to predicted Day 1'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={periodAlert}
                onChange={e => setPeriodAlert(e.target.checked)}
                className="w-5 h-5 text-rose-600 rounded border-rose-300 focus:ring-rose-500 cursor-pointer"
              />
            </div>

            {/* Ovulation Alert */}
            <div className="flex items-center justify-between p-3.5 bg-canvas rounded-2xl border border-rose-100">
              <div>
                <span className="font-semibold text-xs sm:text-sm text-plum-900 block">
                  {t.settings.ovulationReminder}
                </span>
                <span className="text-xs text-plum-500">
                  {language === 'bn' ? 'সম্ভাব্য ওভিউলেশন উইন্ডোর শুরুর সংকেত' : 'Estimated fertile window alert based on rolling cycle metrics'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={ovulationAlert}
                onChange={e => setOvulationAlert(e.target.checked)}
                className="w-5 h-5 text-rose-600 rounded border-rose-300 focus:ring-rose-500 cursor-pointer"
              />
            </div>

            {/* Daily Evening Log Reminder */}
            <div className="flex items-center justify-between p-3.5 bg-canvas rounded-2xl border border-rose-100">
              <div>
                <span className="font-semibold text-xs sm:text-sm text-plum-900 block">
                  {t.settings.dailyLogReminder}
                </span>
                <span className="text-xs text-plum-500">
                  {language === 'bn' ? 'প্রতিদিন নির্দিষ্ট সময়ে লক্ষণ লেখার তাগিদ' : 'Quick check-in to log pain, mood, and sleep'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={dailyLogAlert}
                onChange={e => setDailyLogAlert(e.target.checked)}
                className="w-5 h-5 text-rose-600 rounded border-rose-300 focus:ring-rose-500 cursor-pointer"
              />
            </div>

            {/* Preferred Reminder Time */}
            <div className="p-3.5 bg-canvas rounded-2xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-xs sm:text-sm text-plum-900 block">
                  {t.settings.reminderTime}
                </span>
                <span className="text-xs text-plum-500">
                  {language === 'bn' ? 'যে সময়ে নোটিফিকেশন পেতে চান' : 'Local time for evening symptom check-in'}
                </span>
              </div>
              <input
                type="time"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="bg-white border border-rose-200 rounded-xl px-3 py-1.5 text-xs text-plum-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {/* Discrete Notification Text Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-canvas rounded-2xl border border-rose-100">
              <div>
                <span className="font-semibold text-xs sm:text-sm text-plum-900 block">
                  {t.settings.discreteNotifications}
                </span>
                <span className="text-xs text-plum-500">
                  {language === 'bn'
                    ? 'লকস্ক্রিনে "পিরিয়ড" বা "রক্তপাত" শব্দের পরিবর্তে "স্বাস্থ্য রিমাইন্ডার" দেখাবে।'
                    : 'Replaces sensitive words with discreet phrases like "Daily wellness check-in" on lockscreens.'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={discreteText}
                onChange={e => setDiscreteText(e.target.checked)}
                className="w-5 h-5 text-rose-600 rounded border-rose-300 focus:ring-rose-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
              {t.settings.saveSettings}
            </Button>
          </div>
        </form>
      </Card>

      {/* Language Switcher Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-rose-50 font-bold text-base text-plum-900">
          <Languages className="w-5 h-5 text-plum-600" />
          <span>{language === 'bn' ? 'ভাষাগত পছন্দ' : 'Language Preferences'}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer ${
              language === 'en'
                ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500'
                : 'border-rose-100 bg-canvas text-plum-700 hover:bg-peach-50'
            }`}
          >
            English (Global)
          </button>
          <button
            type="button"
            onClick={() => setLanguage('bn')}
            className={`p-4 rounded-2xl border text-center font-bold text-sm font-bengali transition-all cursor-pointer ${
              language === 'bn'
                ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500'
                : 'border-rose-100 bg-canvas text-plum-700 hover:bg-peach-50'
            }`}
          >
            বাংলা (Bengali)
          </button>
        </div>
      </Card>
    </div>
  );
};
