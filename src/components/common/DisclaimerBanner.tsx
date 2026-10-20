import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, ShieldAlert, ChevronRight, X, PhoneCall } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const { t, language } = useApp();
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Close urgent modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showUrgentModal) {
        setShowUrgentModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showUrgentModal]);

  if (isDismissed) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-rose-50/90 via-peach-50/70 to-lavender-50/90 border-b border-rose-200/50 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm text-plum-800 flex items-center justify-between gap-2 sm:gap-3 transition-all relative z-10">
        <div className="flex items-center gap-1.5 sm:gap-2 max-w-5xl mx-auto min-w-0 flex-1 overflow-hidden">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <p className="truncate">
            <span className="font-semibold text-rose-800">{language === 'bn' ? 'সতর্কতা:' : 'Notice:'}</span>{' '}
            {t.disclaimer}
          </p>
          <button
            onClick={() => setShowUrgentModal(true)}
            className="inline-flex items-center gap-0.5 text-[11px] sm:text-xs font-semibold text-rose-600 hover:text-rose-800 underline ml-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{language === 'bn' ? 'বিপদচিহ্ন' : 'Urgent help'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-plum-400 hover:text-plum-700 p-1 shrink-0 cursor-pointer rounded-lg hover:bg-rose-100/50"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Urgent Care Guidelines Modal */}
      {showUrgentModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/40 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUrgentModal(false);
          }}
        >
          <div className="bg-surface max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-rose-200 relative">
            <button
              onClick={() => setShowUrgentModal(false)}
              className="absolute top-4 right-4 text-plum-400 hover:text-plum-700 p-1.5 rounded-full hover:bg-rose-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <ShieldAlert className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-plum-900">
                  {language === 'bn' ? 'জরুরি স্বাস্থ্য সতর্কবার্তা' : 'Urgent Gynecological Red Flags'}
                </h3>
                <p className="text-xs text-plum-500">
                  {language === 'bn' ? 'কখন বিলম্ব না করে হাসপাতালে যেতে হবে' : 'When immediate emergency evaluation is required'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-plum-700 mb-6 bg-rose-50/60 p-4 rounded-2xl border border-rose-100">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <p>
                  <strong>{language === 'bn' ? 'অতিরিক্ত রক্তক্ষরণ:' : 'Severe Hemorrhage:'}</strong>{' '}
                  {language === 'bn'
                    ? 'টানা ২ ঘণ্টার বেশি প্রতি ঘণ্টায় ২টি বা তার বেশি ভারী প্যাড ভিজে যাওয়া।'
                    : 'Soaking through 2+ heavy maxi pads per hour for 2 or more hours continuously.'}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <p>
                  <strong>{language === 'bn' ? 'তীব্র একতরফা ব্যথা:' : 'Acute Unilateral Pain:'}</strong>{' '}
                  {language === 'bn'
                    ? 'হঠাৎ তলপেটের একপাশে প্রচণ্ড তীক্ষ্ণ ব্যথা, সাথে কাঁধের পেছনে ব্যথা বা মাথা ঘোরা।'
                    : 'Sudden, severe one-sided lower pelvic pain accompanied by shoulder-tip ache, nausea, or dizziness.'}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <p>
                  <strong>{language === 'bn' ? 'অজ্ঞান হওয়া বা ব্লাকআউট:' : 'Syncope / Fainting:'}</strong>{' '}
                  {language === 'bn'
                    ? 'রক্তক্ষরণের কারণে দাঁড়াতে না পারা বা নিস্তেজ হয়ে পড়ে যাওয়া।'
                    : 'Loss of consciousness, extreme pallor, or blood pressure drops.'}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <p>
                  <strong>{language === 'bn' ? 'তীব্র জ্বর ও সংক্রমণ:' : 'High Fever & Rigors:'}</strong>{' '}
                  {language === 'bn'
                    ? 'মাসিকের সাথে ১০১°F এর বেশি জ্বর বা দুর্গন্ধযুক্ত তীব্র নিঃসরণ।'
                    : 'Fever above 38.5°C (101.3°F) with pelvic tenderness or malodorous discharge.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:999"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-md text-sm cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{language === 'bn' ? 'জরুরি সেবা (৯৯৯)' : 'Emergency Services (999 / 911)'}</span>
              </a>
              <button
                onClick={() => setShowUrgentModal(false)}
                className="px-4 py-2.5 border border-plum-200 text-plum-700 hover:bg-rose-50 rounded-xl text-sm font-medium cursor-pointer"
              >
                {language === 'bn' ? 'বুঝেছি, বন্ধ করুন' : 'Understood, Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
