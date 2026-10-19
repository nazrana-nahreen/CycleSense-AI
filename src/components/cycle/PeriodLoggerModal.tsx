import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FlowIntensity } from '../../types';
import { X, Calendar, Droplet, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

export const PeriodLoggerModal: React.FC = () => {
  const { 
    isAddPeriodModalOpen, 
    setIsAddPeriodModalOpen, 
    editingCycleId,
    setEditingCycleId,
    cycles,
    addCycle, 
    updateCycle,
    deleteCycle,
    selectedDate, 
    language, 
    t 
  } = useApp();

  const [startDate, setStartDate] = useState(selectedDate || '2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-05');
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>('medium');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state when modal opens or editingCycleId changes
  useEffect(() => {
    if (isAddPeriodModalOpen) {
      if (editingCycleId) {
        const existing = cycles.find(c => c.id === editingCycleId);
        if (existing) {
          setStartDate(existing.startDate);
          setEndDate(existing.endDate);
          setFlowIntensity(existing.flowIntensity);
          setNotes(existing.notes || '');
        }
      } else {
        setStartDate(selectedDate || '2026-10-01');
        // Default end date is 4 days after start date
        const d = new Date(selectedDate || '2026-10-01');
        d.setDate(d.getDate() + 4);
        setEndDate(d.toISOString().split('T')[0]);
        setFlowIntensity('medium');
        setNotes('');
      }
      setError(null);
      setIsSaved(false);
    }
  }, [isAddPeriodModalOpen, editingCycleId, selectedDate, cycles]);

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddPeriodModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddPeriodModalOpen]);

  if (!isAddPeriodModalOpen) return null;

  const handleClose = () => {
    setIsAddPeriodModalOpen(false);
    setEditingCycleId(null);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError(language === 'bn' ? 'সঠিক তারিখ প্রদান করুন।' : 'Please enter valid dates.');
      return;
    }

    if (end < start) {
      setError(language === 'bn' ? 'শেষের তারিখ শুরুর তারিখের পরে হতে হবে।' : 'End date must be on or after start date.');
      return;
    }

    const durationDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (durationDays > 14) {
      setError(
        language === 'bn' 
          ? 'পিরিয়ডের সময়কাল সাধারণত ১ থেকে ১৪ দিনের মধ্যে হয়।' 
          : 'Period duration typically ranges between 1 and 14 days.'
      );
      return;
    }

    if (editingCycleId) {
      updateCycle({
        id: editingCycleId,
        startDate,
        endDate,
        periodDuration: durationDays,
        flowIntensity,
        notes: notes.trim() || undefined,
      });
    } else {
      addCycle({
        startDate,
        endDate,
        periodDuration: durationDays,
        flowIntensity,
        notes: notes.trim() || undefined,
      });
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      handleClose();
    }, 700);
  };

  const handleDelete = () => {
    if (!editingCycleId) return;
    const confirmMsg = language === 'bn' 
      ? 'আপনি কি নিশ্চিত যে এই পিরিয়ড রেকর্ডটি মুছে ফেলতে চান?' 
      : 'Are you sure you want to delete this period record?';
    if (window.confirm(confirmMsg)) {
      deleteCycle(editingCycleId);
      handleClose();
    }
  };

  const flowOptions: { id: FlowIntensity; label: string; desc: string; iconFill: string }[] = [
    { 
      id: 'spotting', 
      label: t.flows.spotting, 
      desc: language === 'bn' ? 'খুব সামান্য দাগ' : 'Few drops, liner only',
      iconFill: 'text-rose-300' 
    },
    { 
      id: 'light', 
      label: t.flows.light, 
      desc: language === 'bn' ? '১-২ প্যাড/দিন' : '1-2 pads/day',
      iconFill: 'text-rose-400' 
    },
    { 
      id: 'medium', 
      label: t.flows.medium, 
      desc: language === 'bn' ? '৩-৪ প্যাড/দিন' : '3-4 pads/day',
      iconFill: 'text-rose-600' 
    },
    { 
      id: 'heavy', 
      label: t.flows.heavy, 
      desc: language === 'bn' ? '৫+ প্যাড/দিন' : '5+ pads/day',
      iconFill: 'text-rose-800' 
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/40 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className="bg-surface max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-rose-100 relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-plum-400 hover:text-plum-700 p-1.5 rounded-full hover:bg-rose-50 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 id="modal-title" className="font-bold text-lg text-plum-900">
              {editingCycleId 
                ? (language === 'bn' ? 'পিরিয়ড রেকর্ড সম্পাদনা করুন' : 'Edit Period Record')
                : (language === 'bn' ? 'পিরিয়ডের দিন রেকর্ড করুন' : 'Record Period Dates')}
            </h3>
            <p className="text-xs text-plum-500">
              {editingCycleId
                ? (language === 'bn' ? 'সংরক্ষিত পিরিয়ডের শুরুর তারিখ বা রক্তপাতের মাত্রা আপডেট করুন' : 'Modify bleeding start, end dates, or intensity')
                : (language === 'bn' ? 'আপনার রক্তক্ষরণের শুরু ও শেষের দিন যোগ করুন' : 'Track your bleeding window to refine cycle forecasts')}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSaved ? (
          <div className="py-10 text-center flex flex-col items-center justify-center gap-2 text-sage-600 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-sage-500 animate-bounce" />
            <p className="font-bold text-base text-plum-900">
              {editingCycleId
                ? (language === 'bn' ? 'পিরিয়ড রেকর্ড সফলভাবে আপডেট করা হয়েছে!' : 'Period record updated successfully!')
                : (language === 'bn' ? 'পিরিয়ডের তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Period logged successfully!')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Start and End Date Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-plum-700 mb-1">
                  {language === 'bn' ? 'শুরুর তারিখ (Day 1)' : 'Period Start Date (Day 1)'}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-canvas border border-rose-200 rounded-xl px-3 py-2 text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-plum-700 mb-1">
                  {language === 'bn' ? 'শেষের তারিখ' : 'Period End Date'}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-canvas border border-rose-200 rounded-xl px-3 py-2 text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                  required
                />
              </div>
            </div>

            {/* Bleeding Flow Intensity Selection */}
            <div>
              <label className="block text-xs font-semibold text-plum-700 mb-2">
                {language === 'bn' ? 'সর্বোচ্চ রক্তপাতের তীব্রতা' : 'Peak Bleeding Intensity'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {flowOptions.map(option => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setFlowIntensity(option.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      flowIntensity === option.id
                        ? 'border-rose-500 bg-rose-50/80 ring-1 ring-rose-500'
                        : 'border-rose-100 bg-surface hover:bg-peach-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Droplet className={`w-4 h-4 ${option.iconFill} fill-current`} />
                      {flowIntensity === option.id && (
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-plum-900 block truncate">
                        {option.label}
                      </span>
                      <span className="text-[10px] text-plum-500 block leading-tight">
                        {option.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-plum-700 mb-1">
                {language === 'bn' ? 'অতিরিক্ত মন্তব্য (ঐচ্ছিক)' : 'Optional Observations / Notes'}
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'যেমন: পেটে হালকা গরম সেঁক নেওয়া হয়েছিল, রক্তপাত সকালে বেশি ছিল...'
                    : 'e.g., Heavy flow on day 2, used heating pad, mild cramps...'
                }
                rows={2}
                className="w-full bg-canvas border border-rose-200 rounded-xl p-3 text-xs md:text-sm text-plum-900 placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              {editingCycleId ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 p-2 rounded-xl hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'রেকর্ডটি মুছুন' : 'Delete Record'}</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button type="submit" variant="primary" size="md">
                  {editingCycleId 
                    ? (language === 'bn' ? 'আপডেট করুন' : 'Update Record')
                    : (language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Period Entry')}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
