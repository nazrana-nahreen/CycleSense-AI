import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Droplet, 
  Info, 
  Calendar as CalendarIcon, 
  Clock, 
  FileText,
  Activity,
  Sparkles,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const PeriodCalendarPage: React.FC = () => {
  const { 
    cycles, 
    symptoms, 
    prediction, 
    cycleStats, 
    selectedDate, 
    setSelectedDate, 
    setIsAddPeriodModalOpen, 
    setEditingCycleId,
    deleteCycle,
    setCurrentPage, 
    language, 
    t 
  } = useApp();

  // Current viewing month (starts at live dynamic current month)
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(() => now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => now.getMonth());

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const daysOfWeekEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeekBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Helper date string formatter YYYY-MM-DD
  const formatDateKey = (year: number, month: number, day: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Helper check if a date is within a period range
  const isPeriodDay = (dateStr: string) => {
    return cycles.some(c => dateStr >= c.startDate && dateStr <= c.endDate);
  };

  const getCycleForDay = (dateStr: string) => {
    return cycles.find(c => dateStr >= c.startDate && dateStr <= c.endDate);
  };

  // Helper check if date is within predicted range (e.g., Oct 30 - Nov 2)
  const isPredictedPeriodDay = (dateStr: string) => {
    return dateStr >= prediction.nextPeriodStart && dateStr <= prediction.nextPeriodEnd;
  };

  // Helper check if date is in estimated ovulation window
  const isOvulationDay = (dateStr: string) => {
    return dateStr >= prediction.ovulationWindowStart && dateStr <= prediction.ovulationWindowEnd;
  };

  // Live dynamic today marker (YYYY-MM-DD)
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

  // Details for currently selected date
  const selectedCycle = getCycleForDay(selectedDate);
  const selectedSymptom = symptoms.find(s => s.date === selectedDate);
  const isSelectedPredicted = isPredictedPeriodDay(selectedDate);
  const isSelectedOvulation = isOvulationDay(selectedDate);

  const handleEditCycle = (id: string) => {
    setEditingCycleId(id);
    setIsAddPeriodModalOpen(true);
  };

  const handleDeleteCycle = (id: string) => {
    const confirmMsg = language === 'bn' 
      ? 'আপনি কি নিশ্চিত যে এই পিরিয়ড রেকর্ডটি মুছে ফেলতে চান?' 
      : 'Are you sure you want to delete this period record?';
    if (window.confirm(confirmMsg)) {
      deleteCycle(id);
    }
  };

  const handleAddNewPeriod = () => {
    setEditingCycleId(null);
    setIsAddPeriodModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-plum-900 tracking-tight">
            {t.calendar.title}
          </h2>
          <p className="text-xs sm:text-sm text-plum-500 mt-0.5">
            {t.calendar.subtitle}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleAddNewPeriod}
        >
          {t.calendar.addPeriodBtn}
        </Button>
      </div>

      {/* Main Calendar View and Day Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols on lg) */}
        <div className="lg:col-span-8 bg-surface rounded-3xl p-5 md:p-6 border border-rose-100 shadow-soft">
          {/* Month Navigation Controls */}
          <div className="flex items-center justify-between pb-4 border-b border-rose-50 mb-4">
            <h3 className="text-lg font-extrabold text-plum-900">
              {language === 'bn' ? monthNamesBn[currentMonth] : monthNamesEn[currentMonth]} {currentYear}
            </h3>

            <div className="flex items-center gap-1.5 bg-canvas p-1 rounded-xl border border-rose-100">
              <button
                onClick={prevMonth}
                className="p-1.5 text-plum-600 hover:text-plum-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
                title={language === 'bn' ? 'পূর্ববর্তী মাস' : 'Previous Month'}
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentMonth(9);
                  setCurrentYear(2026);
                  setSelectedDate(todayStr);
                }}
                className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'আজকে' : 'Today'}
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 text-plum-600 hover:text-plum-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
                title={language === 'bn' ? 'পরবর্তী মাস' : 'Next Month'}
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
            {(language === 'bn' ? daysOfWeekBn : daysOfWeekEn).map((d, i) => (
              <span key={i} className="text-xs font-bold text-plum-400 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Blank offset tiles */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-12 sm:h-16 rounded-xl opacity-20 pointer-events-none" />
            ))}

            {/* Actual day tiles */}
            {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateKey = formatDateKey(currentYear, currentMonth, day);
              const isPeriod = isPeriodDay(dateKey);
              const isPredicted = isPredictedPeriodDay(dateKey);
              const isOvulation = isOvulationDay(dateKey);
              const isToday = dateKey === todayStr;
              const isSelected = dateKey === selectedDate;
              const hasSymptoms = symptoms.some(s => s.date === dateKey);

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`relative h-12 sm:h-16 rounded-2xl flex flex-col items-center justify-between p-1.5 transition-all text-xs cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-rose-500 shadow-sm z-10'
                      : 'hover:bg-peach-50/50'
                  } ${
                    isPeriod
                      ? 'bg-rose-500 text-white font-bold shadow-xs'
                      : isPredicted
                      ? 'bg-rose-100/70 border border-dashed border-rose-400 text-rose-800 font-semibold'
                      : isOvulation
                      ? 'bg-lavender-100/70 text-lavender-900 font-semibold border border-lavender-200'
                      : 'bg-canvas text-plum-800'
                  }`}
                  aria-label={`${dateKey} ${isPeriod ? 'Period Day' : ''}`}
                >
                  {/* Top row: day number & today dot */}
                  <div className="w-full flex items-center justify-between px-1">
                    <span className="text-xs font-semibold">{day}</span>
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" title="Today" />
                    )}
                  </div>

                  {/* Indicators for period, prediction, ovulation, symptoms */}
                  <div className="flex items-center gap-1 mt-auto">
                    {isPeriod && (
                      <Droplet className="w-3 h-3 fill-white stroke-none opacity-90" />
                    )}
                    {isPredicted && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700">
                        Est
                      </span>
                    )}
                    {isOvulation && (
                      <span className="text-[9px] font-bold text-lavender-700">
                        ★
                      </span>
                    )}
                    {hasSymptoms && !isPeriod && (
                      <span className="w-1.5 h-1.5 rounded-full bg-peach-500" title="Symptom logged" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Legends */}
          <div className="mt-6 pt-4 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3 text-xs text-plum-600">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-lg bg-rose-500" />
              <span>{t.calendar.legendPeriod}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-lg bg-rose-100 border border-dashed border-rose-400" />
              <span>{t.calendar.legendPredicted} ({t.dashboard.uncertainty})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-lg bg-lavender-200" />
              <span>{t.calendar.legendOvulation}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-rose-200" />
              <span>{t.calendar.legendToday}</span>
            </div>
          </div>
        </div>

        {/* Selected Date Details Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                  {language === 'bn' ? 'তারিখের বিস্তারিত' : 'Selected Date Details'}
                </span>
                <h4 className="font-bold text-base text-plum-900 mt-0.5">
                  {new Date(selectedDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h4>
              </div>
              {selectedDate === todayStr && (
                <Badge variant="rose" size="sm">
                  {t.calendar.legendToday}
                </Badge>
              )}
            </div>

            {/* Period Status for Selected Day */}
            {selectedCycle ? (
              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                    <Droplet className="w-4 h-4 fill-current" />
                    <span>{language === 'bn' ? 'রেকর্ডকৃত পিরিয়ডের দিন' : 'Recorded Menstrual Day'}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditCycle(selectedCycle.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-100/60 cursor-pointer"
                      title={language === 'bn' ? 'পিরিয়ড সম্পাদনা করুন' : 'Edit period'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCycle(selectedCycle.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-100/60 cursor-pointer"
                      title={language === 'bn' ? 'পিরিয়ড মুছুন' : 'Delete period'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-plum-700 space-y-1">
                  <p>
                    <strong>{t.calendar.flow}:</strong> {t.flows[selectedCycle.flowIntensity]}
                  </p>
                  <p>
                    <strong>{language === 'bn' ? 'পিরিয়ডের সময়কাল:' : 'Window:'}</strong> {selectedCycle.startDate} to {selectedCycle.endDate} ({selectedCycle.periodDuration} {language === 'bn' ? 'দিন' : 'days'})
                  </p>
                  {selectedCycle.notes && (
                    <p className="italic text-plum-600 bg-white/70 p-2 rounded-lg mt-1 border border-rose-100">
                      &quot;{selectedCycle.notes}&quot;
                    </p>
                  )}
                </div>
              </div>
            ) : isSelectedPredicted ? (
              <div className="bg-peach-50 p-4 rounded-2xl border border-peach-200 space-y-2 mb-4">
                <div className="flex items-center gap-2 text-peach-700 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{t.calendar.legendPredicted}</span>
                </div>
                <p className="text-xs text-plum-700 leading-relaxed">
                  {language === 'bn' 
                    ? `আনুমানিক শুরু: ${prediction.nextPeriodStart} (±২ দিন তারতম্য হতে পারে)। এটি একটি সম্ভাব্য সময়কাল, নিশ্চিত ডাক্তারি তথ্য নয়।`
                    : `Statistical forecast based on your past cycles. Confidence window spans ±2 days.`}
                </p>
              </div>
            ) : isSelectedOvulation ? (
              <div className="bg-lavender-50 p-4 rounded-2xl border border-lavender-200 space-y-2 mb-4">
                <div className="flex items-center gap-2 text-lavender-700 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{t.calendar.legendOvulation}</span>
                </div>
                <p className="text-xs text-plum-700 leading-relaxed">
                  {language === 'bn'
                    ? 'সম্ভাব্য ডিম্বস্ফোটন সময়কাল। প্রাকৃতিক পরিবর্তনের কারণে এর তারতম্য হতে পারে।'
                    : 'Estimated fertile window based on standard luteal phase subtraction (approx. 14 days before anticipated period).'}
                </p>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-plum-400">
                {t.calendar.noEntriesForDay}
              </div>
            )}

            {/* Daily Symptoms Section for Selected Date */}
            <div className="pt-2 border-t border-rose-50 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs text-plum-900">
                  {language === 'bn' ? 'দৈনিক লক্ষণসমূহ' : 'Recorded Symptoms'}
                </h5>
                <button
                  onClick={() => setCurrentPage('symptoms')}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                >
                  {selectedSymptom 
                    ? (language === 'bn' ? 'সম্পাদনা করুন' : 'Edit') 
                    : (language === 'bn' ? 'লক্ষণ লিখুন' : 'Log Symptoms')}
                </button>
              </div>

              {selectedSymptom ? (
                <div className="space-y-1.5 text-xs text-plum-700 bg-canvas p-3 rounded-xl border border-rose-100">
                  <div className="flex justify-between">
                    <span className="text-plum-500">{t.symptoms.crampsPain}:</span>
                    <span className="font-semibold">{selectedSymptom.crampsPain}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-plum-500">{t.symptoms.moodStatus}:</span>
                    <span className="font-semibold">{t.moods[selectedSymptom.mood]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-plum-500">{t.symptoms.flowIntensity}:</span>
                    <span>{t.flows[selectedSymptom.flow]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-plum-500">{t.symptoms.fatigueLevel}:</span>
                    <span className="font-semibold">{t.severities[selectedSymptom.fatigue]}</span>
                  </div>
                  {selectedSymptom.notes && (
                    <p className="pt-1 text-[11px] text-plum-500 italic">
                      &quot;{selectedSymptom.notes}&quot;
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-plum-400 italic">
                  {language === 'bn' ? 'এই দিনের কোনো লক্ষণ লেখা হয়নি।' : 'No symptoms recorded for this date.'}
                </p>
              )}
            </div>

            {/* Quick Action Button */}
            {!selectedCycle ? (
              <Button
                variant="soft"
                size="sm"
                onClick={handleAddNewPeriod}
                className="w-full mt-4 text-xs"
              >
                {language === 'bn' ? 'এই দিনে পিরিয়ড রেকর্ড করুন' : 'Record Period Starting Here'}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                icon={<Edit3 className="w-3.5 h-3.5 text-rose-600" />}
                onClick={() => handleEditCycle(selectedCycle.id)}
                className="w-full mt-4 text-xs"
              >
                {language === 'bn' ? 'পিরিয়ড তথ্য এডিট করুন' : 'Edit This Period'}
              </Button>
            )}
          </Card>
        </div>
      </div>

      {/* Recorded Cycles History Management Table */}
      <Card className="p-5 md:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-4">
          <div>
            <h3 className="font-bold text-base text-plum-900">
              {language === 'bn' ? 'পূর্ববর্তী সমস্ত সাইকেলের তালিকা' : 'Recorded Cycles History & Management'}
            </h3>
            <p className="text-xs text-plum-400">
              {language === 'bn' ? 'আপনার সংরক্ষিত পিরিয়ডের তারিখ ও স্থায়িত্ব সম্পাদনা বা মুছুন' : 'Review, update, or remove recorded period episodes'}
            </p>
          </div>
          <Badge variant="rose" size="sm">
            {cycles.length} {language === 'bn' ? 'টি সাইকেল' : 'cycles'}
          </Badge>
        </div>

        {cycles.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <CalendarIcon className="w-10 h-10 text-rose-300 mx-auto" />
            <p className="text-xs sm:text-sm text-plum-500 max-w-sm mx-auto">
              {language === 'bn' 
                ? 'এখনও কোনো পিরিয়ডের তথ্য নেই। আপনার প্রথম সাইকেল রেকর্ড করতে উপরের বাটনে ক্লিক করুন।' 
                : 'No menstrual cycles recorded yet. Click "Record Period Dates" to log your first cycle.'}
            </p>
            <Button variant="primary" size="sm" onClick={handleAddNewPeriod}>
              {t.calendar.addPeriodBtn}
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-rose-100 bg-canvas text-plum-800">
                    <th className="py-2.5 px-3 font-bold">Start Date</th>
                    <th className="py-2.5 px-3 font-bold">End Date</th>
                    <th className="py-2.5 px-3 font-bold">Bleeding Duration</th>
                    <th className="py-2.5 px-3 font-bold">Cycle Length</th>
                    <th className="py-2.5 px-3 font-bold">Flow Intensity</th>
                    <th className="py-2.5 px-3 font-bold">Notes</th>
                    <th className="py-2.5 px-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50 text-plum-700">
                  {cycles.map(c => (
                    <tr key={c.id} className="hover:bg-peach-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-plum-900">{c.startDate}</td>
                      <td className="py-2.5 px-3">{c.endDate}</td>
                      <td className="py-2.5 px-3">{c.periodDuration} days</td>
                      <td className="py-2.5 px-3 font-semibold">
                        {c.cycleLength ? `${c.cycleLength} days` : '—'}
                      </td>
                      <td className="py-2.5 px-3 capitalize">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {t.flows[c.flowIntensity]}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 italic text-plum-500 max-w-[180px] truncate">
                        {c.notes || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleEditCycle(c.id)}
                            className="p-1.5 text-plum-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Edit cycle"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCycle(c.id)}
                            className="p-1.5 text-plum-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Delete cycle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards */}
            <div className="md:hidden space-y-3">
              {cycles.map(c => (
                <div key={c.id} className="p-4 bg-canvas rounded-2xl border border-rose-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-plum-900">
                      {c.startDate} <span className="text-plum-400 font-normal">→</span> {c.endDate}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {t.flows[c.flowIntensity]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-plum-600 pt-1 border-t border-rose-50">
                    <div>
                      <span className="text-plum-400 block text-[10px]">Bleeding Duration:</span>
                      <span className="font-bold text-plum-800">{c.periodDuration} days</span>
                    </div>
                    <div>
                      <span className="text-plum-400 block text-[10px]">Cycle Length:</span>
                      <span className="font-bold text-plum-800">{c.cycleLength ? `${c.cycleLength} days` : '—'}</span>
                    </div>
                  </div>
                  {c.notes && (
                    <p className="text-[11px] text-plum-500 italic bg-white/70 p-2 rounded-xl border border-rose-50">
                      "{c.notes}"
                    </p>
                  )}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-50">
                    <button
                      onClick={() => handleEditCycle(c.id)}
                      className="px-3 py-1.5 bg-white text-rose-700 border border-rose-200 rounded-xl font-semibold flex items-center gap-1.5 text-xs shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'এডিট' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCycle(c.id)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-semibold flex items-center gap-1.5 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
