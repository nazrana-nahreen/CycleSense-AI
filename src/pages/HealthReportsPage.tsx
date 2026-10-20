import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Printer, 
  FileDown, 
  Calendar as CalendarIcon, 
  Activity, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  User, 
  CheckCircle2,
  Stethoscope,
  Heart
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const HealthReportsPage: React.FC = () => {
  const { user, cycles, symptoms, cycleStats, language, t } = useApp();
  const [timeRange, setTimeRange] = useState<'30days' | '3months' | '6months' | 'all'>('3months');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      patientName: user.name,
      patientEmail: user.email,
      reportGenerated: new Date().toISOString(),
      timeframe: timeRange,
      statistics: cycleStats,
      cycles: cycles,
      symptoms: symptoms,
      disclaimer: 'Observational data summary for clinical review. Not a medical diagnosis.'
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyclesense-health-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Page Header (Hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-plum-900 tracking-tight">
            {t.reports.title}
          </h2>
          <p className="text-xs sm:text-sm text-plum-500 mt-0.5">
            {t.reports.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<FileDown className="w-4 h-4 text-plum-600" />}
            onClick={handleDownloadJSON}
          >
            {language === 'bn' ? 'জেসন ডাউনলোড' : 'Download JSON'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            {t.reports.exportPdf}
          </Button>
        </div>
      </div>

      {/* Date Range Selector (Hidden on print) */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-plum-600 mr-1 shrink-0">
          {t.reports.timeRange}:
        </span>
        {[
          { id: '30days', label: t.reports.last30Days },
          { id: '3months', label: t.reports.last3Months },
          { id: '6months', label: t.reports.last6Months },
          { id: 'all', label: t.reports.allTime },
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setTimeRange(r.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              timeRange === r.id
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-surface hover:bg-peach-50 text-plum-700 border border-rose-100'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Printable Clinical Report Container */}
      <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-soft space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Report Official Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-lavender-400 flex items-center justify-center text-white shadow-sm">
              <Heart className="w-6 h-6 fill-white/20 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-plum-950 tracking-tight">
                CycleSense AI — Clinical Health Summary
              </h3>
              <p className="text-xs text-plum-500">
                {t.reports.confidentialityNotice}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-plum-600 space-y-0.5">
            <p>
              <strong>{language === 'bn' ? 'তারিখ:' : 'Report Date:'}</strong>{' '}
              {new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p>
              <strong>{language === 'bn' ? 'রোগীর নাম:' : 'Patient Name:'}</strong> {user.name}
            </p>
            <p className="text-plum-400">
              ID: {user.id}
            </p>
          </div>
        </div>

        {/* Clinical Guardrail Box */}
        <div className="p-4 rounded-2xl bg-peach-50/70 border border-peach-200 text-xs text-plum-800 space-y-1">
          <p className="font-bold text-rose-800">
            {language === 'bn' ? 'ডাক্তারের প্রতি বিশেষ দ্রষ্টব্য:' : 'Note for Attending Healthcare Professional:'}
          </p>
          <p className="leading-relaxed">
            {language === 'bn'
              ? 'এই রিপোর্টে অন্তর্ভুক্ত তথ্য ব্যবহারকারীর নিজস্ব সংরক্ষিত দৈনন্দিন স্বাস্থ্য ডায়েরি এবং গণনা থেকে সংকলিত। এতে কোনো স্বয়ংক্রিয় ডাক্তারি রোগ নির্ণয় (diagnosis) অন্তর্ভুক্ত নয়।'
              : 'This document synthesizes longitudinal patient-recorded observations and rolling mathematical statistics. It contains zero automated diagnoses. Please evaluate these findings alongside standard clinical examination.'}
          </p>
        </div>

        {/* Section 1: Rolling Statistical Overview */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-plum-900 uppercase tracking-wider">
            1. Longitudinal Cycle Parameters (Analyzed across {cycles.length} cycles)
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-canvas rounded-xl border border-rose-100">
              <span className="text-plum-500 block">{t.insights.avgCycleLength}</span>
              <strong className="text-lg text-plum-900 block mt-0.5">{cycleStats.averageCycleLength} days</strong>
            </div>

            <div className="p-3 bg-canvas rounded-xl border border-rose-100">
              <span className="text-plum-500 block">{t.insights.cycleVariation}</span>
              <strong className="text-lg text-plum-900 block mt-0.5">±{cycleStats.cycleVariation} days</strong>
            </div>

            <div className="p-3 bg-canvas rounded-xl border border-rose-100">
              <span className="text-plum-500 block">{t.insights.avgPeriodDuration}</span>
              <strong className="text-lg text-plum-900 block mt-0.5">{cycleStats.averagePeriodDuration} days</strong>
            </div>

            <div className="p-3 bg-canvas rounded-xl border border-rose-100">
              <span className="text-plum-500 block">{t.insights.regularityLabel}</span>
              <strong className="text-lg text-sage-600 block mt-0.5 capitalize">{cycleStats.regularityStatus.replace('_', ' ')}</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Detailed Menstrual Cycle History Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-plum-900 uppercase tracking-wider">
            2. Recorded Cycle Episodes
          </h4>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-rose-100 bg-canvas text-plum-800">
                  <th className="py-2.5 px-3 font-bold">Start Date (Day 1)</th>
                  <th className="py-2.5 px-3 font-bold">End Date</th>
                  <th className="py-2.5 px-3 font-bold">Period Duration</th>
                  <th className="py-2.5 px-3 font-bold">Cycle Length</th>
                  <th className="py-2.5 px-3 font-bold">Peak Bleeding Flow</th>
                  <th className="py-2.5 px-3 font-bold">Patient Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 text-plum-700">
                {cycles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-plum-400">
                      {language === 'bn' ? 'কোনো পিরিয়ডের তথ্য রেকর্ড করা নেই।' : 'No period episodes logged yet.'}
                    </td>
                  </tr>
                ) : (
                  cycles.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-peach-50/30">
                      <td className="py-2 px-3 font-semibold text-plum-900">{c.startDate}</td>
                      <td className="py-2 px-3">{c.endDate}</td>
                      <td className="py-2 px-3">{c.periodDuration} days</td>
                      <td className="py-2 px-3 font-semibold">{c.cycleLength ? `${c.cycleLength} days` : 'N/A'}</td>
                      <td className="py-2 px-3 capitalize">{c.flowIntensity}</td>
                      <td className="py-2 px-3 italic text-plum-500">{c.notes || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2.5">
            {cycles.length === 0 ? (
              <p className="py-4 text-center text-xs text-plum-400">
                {language === 'bn' ? 'কোনো পিরিয়ডের তথ্য রেকর্ড করা নেই।' : 'No period episodes logged yet.'}
              </p>
            ) : (
              cycles.map((c) => (
                <div key={c.id} className="p-3 bg-canvas rounded-xl border border-rose-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-plum-900">{c.startDate} → {c.endDate}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 capitalize">
                      {c.flowIntensity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-plum-600 text-[11px]">
                    <span>Duration: <strong>{c.periodDuration}d</strong></span>
                    <span>Cycle Length: <strong>{c.cycleLength ? `${c.cycleLength}d` : 'N/A'}</strong></span>
                  </div>
                  {c.notes && <p className="text-[10px] italic text-plum-500">"{c.notes}"</p>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 3: Recent Symptom Diary Extract */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-plum-900 uppercase tracking-wider">
            3. Patient-Recorded Daily Symptoms & Pain Severity
          </h4>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-rose-100 bg-canvas text-plum-800">
                  <th className="py-2.5 px-3 font-bold">Date</th>
                  <th className="py-2.5 px-3 font-bold">Pain Score (0-10)</th>
                  <th className="py-2.5 px-3 font-bold">Flow</th>
                  <th className="py-2.5 px-3 font-bold">Mood</th>
                  <th className="py-2.5 px-3 font-bold">Fatigue</th>
                  <th className="py-2.5 px-3 font-bold">Headache</th>
                  <th className="py-2.5 px-3 font-bold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 text-plum-700">
                {symptoms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-xs text-plum-400">
                      {language === 'bn' ? 'কোনো লক্ষণ রেকর্ড করা নেই।' : 'No daily symptoms logged.'}
                    </td>
                  </tr>
                ) : (
                  symptoms.slice(0, 10).map(s => (
                    <tr key={s.id} className="hover:bg-peach-50/30">
                      <td className="py-2 px-3 font-semibold text-plum-900">{s.date}</td>
                      <td className="py-2 px-3 font-bold text-rose-600">{s.crampsPain}/10</td>
                      <td className="py-2 px-3 capitalize">{s.flow}</td>
                      <td className="py-2 px-3 capitalize">{s.mood}</td>
                      <td className="py-2 px-3 capitalize">{s.fatigue}</td>
                      <td className="py-2 px-3 capitalize">{s.headache}</td>
                      <td className="py-2 px-3 italic text-plum-500">{s.notes || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2.5">
            {symptoms.length === 0 ? (
              <p className="py-4 text-center text-xs text-plum-400">
                {language === 'bn' ? 'কোনো লক্ষণ রেকর্ড করা নেই।' : 'No daily symptoms logged.'}
              </p>
            ) : (
              symptoms.slice(0, 8).map(s => (
                <div key={s.id} className="p-3 bg-canvas rounded-xl border border-rose-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-plum-900">{s.date}</span>
                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Pain: {s.crampsPain}/10
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-plum-600">
                    <span>Flow: <strong className="capitalize">{s.flow}</strong></span>
                    <span>Mood: <strong className="capitalize">{s.mood}</strong></span>
                    <span>Fatigue: <strong className="capitalize">{s.fatigue}</strong></span>
                    <span>Headache: <strong className="capitalize">{s.headache}</strong></span>
                  </div>
                  {s.notes && <p className="text-[10px] italic text-plum-500">"{s.notes}"</p>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 4: Physician Handwritten Notes Block (For clinical printouts) */}
        <div className="pt-4 border-t-2 border-rose-100 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-plum-900">
            <Stethoscope className="w-4 h-4 text-rose-500" />
            <span>{t.reports.doctorNotesPrompt}</span>
          </div>
          <div className="h-28 w-full border border-dashed border-rose-300 rounded-2xl bg-canvas/60 p-3 text-[11px] text-plum-400">
            <em>Space reserved for doctor&apos;s physical handwriting, pelvic exam findings, prescribed lab tests (e.g. CBC, Ultrasound, Thyroid panel), or follow-up schedule.</em>
          </div>
        </div>

        {/* Report Footer */}
        <div className="text-[10px] text-plum-400 pt-4 border-t border-rose-50 flex items-center justify-between">
          <span>CycleSense AI Capstone Platform • Verified Open-Access Clinical Guidelines</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};
