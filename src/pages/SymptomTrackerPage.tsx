import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DailySymptomEntry, 
  FlowIntensity, 
  MoodType, 
  SeverityLevel, 
  SleepQuality, 
  HeadacheType, 
  HairChangeType 
} from '../types';
import { 
  Activity, 
  Calendar as CalendarIcon, 
  Save, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Smile, 
  Moon, 
  Droplet, 
  Sparkles, 
  HeartHandshake,
  Clock
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const SymptomTrackerPage: React.FC = () => {
  const { 
    symptoms, 
    addOrUpdateSymptom, 
    deleteSymptom, 
    selectedDate, 
    setSelectedDate, 
    language, 
    t 
  } = useApp();

  const [date, setDate] = useState(selectedDate || '2026-10-19');
  const [crampsPain, setCrampsPain] = useState<number>(1);
  const [flow, setFlow] = useState<FlowIntensity>('none');
  const [mood, setMood] = useState<MoodType>('calm');
  const [acne, setAcne] = useState<SeverityLevel>('mild');
  const [fatigue, setFatigue] = useState<SeverityLevel>('mild');
  const [headache, setHeadache] = useState<HeadacheType>('none');
  const [bloating, setBloating] = useState<SeverityLevel>('mild');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('great');
  const [nausea, setNausea] = useState<SeverityLevel>('none');
  const [hairChange, setHairChange] = useState<HairChangeType>('none');
  const [notes, setNotes] = useState('');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const moodOptions: { id: MoodType; emoji: string; label: string }[] = [
    { id: 'calm', emoji: '😌', label: t.moods.calm },
    { id: 'happy', emoji: '😊', label: t.moods.happy },
    { id: 'energetic', emoji: '✨', label: t.moods.energetic },
    { id: 'tired', emoji: '🥱', label: t.moods.tired },
    { id: 'anxious', emoji: '😰', label: t.moods.anxious },
    { id: 'irritable', emoji: '😤', label: t.moods.irritable },
    { id: 'sad', emoji: '🥺', label: t.moods.sad },
    { id: 'mood_swings', emoji: '🎢', label: t.moods.mood_swings },
  ];

  const handleEditEntry = (entry: DailySymptomEntry) => {
    setEditingId(entry.id);
    setDate(entry.date);
    setCrampsPain(entry.crampsPain);
    setFlow(entry.flow);
    setMood(entry.mood);
    setAcne(entry.acne);
    setFatigue(entry.fatigue);
    setHeadache(entry.headache);
    setBloating(entry.bloating);
    setSleepQuality(entry.sleepQuality);
    setNausea(entry.nausea);
    setHairChange(entry.hairChange);
    setNotes(entry.notes || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    addOrUpdateSymptom({
      id: editingId || undefined,
      date,
      crampsPain,
      flow,
      mood,
      acne,
      fatigue,
      headache,
      bloating,
      sleepQuality,
      nausea,
      hairChange,
      notes: notes.trim() || undefined,
    });

    setSavedSuccess(true);
    setEditingId(null);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Pain helper text
  const getPainScoreLabel = (score: number) => {
    if (score === 0) return t.symptoms.painScoreZero;
    if (score <= 3) return t.symptoms.painScoreMild;
    if (score <= 6) return t.symptoms.painScoreMod;
    return t.symptoms.painScoreSevere;
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-plum-900 tracking-tight">
            {t.symptoms.title}
          </h2>
          <p className="text-xs sm:text-sm text-plum-500 mt-0.5">
            {t.symptoms.subtitle}
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-surface p-1.5 px-3 rounded-2xl border border-rose-100 shadow-xs">
          <CalendarIcon className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-semibold text-plum-700">{t.symptoms.selectDate}:</span>
          <input
            type="date"
            value={date}
            onChange={e => {
              setDate(e.target.value);
              setSelectedDate(e.target.value);
            }}
            className="text-xs bg-canvas px-2.5 py-1 rounded-lg border border-rose-200 text-plum-900 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-sage-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
          <span>{t.symptoms.saveSuccess}</span>
        </div>
      )}

      {/* Main Form and History Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Symptom Logger Form (8 cols on lg) */}
        <div className="lg:col-span-8 bg-surface rounded-3xl p-6 border border-rose-100 shadow-soft">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Cramps and Pelvic Pain Scale (0 to 10) */}
            <div className="p-4 bg-canvas rounded-2xl border border-rose-100/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-sm text-plum-900 block">
                    {t.symptoms.crampsPain}
                  </label>
                  <span className="text-xs text-rose-600 font-semibold block mt-0.5">
                    {getPainScoreLabel(crampsPain)}
                  </span>
                </div>
                <div className="text-2xl font-black text-rose-600 bg-white px-3 py-1 rounded-xl shadow-xs border border-rose-200">
                  {crampsPain}/10
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                value={crampsPain}
                onChange={e => setCrampsPain(parseInt(e.target.value))}
                className="w-full h-2.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />

              <div className="flex justify-between text-[10px] font-semibold text-plum-400 px-1">
                <span>0 (None)</span>
                <span>3 (Mild)</span>
                <span>5 (Moderate)</span>
                <span>7 (Severe)</span>
                <span>10 (Debilitating)</span>
              </div>
            </div>

            {/* 2. Emotional State / Mood Selector */}
            <div>
              <label className="font-bold text-sm text-plum-900 block mb-2">
                {t.symptoms.moodStatus}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {moodOptions.map(m => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      mood === m.id
                        ? 'border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-500 shadow-xs'
                        : 'border-rose-100/70 bg-canvas hover:bg-peach-50/50 text-plum-700'
                    }`}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <span className="text-xs font-semibold truncate">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Bleeding / Spotting Flow */}
            <div>
              <label className="font-bold text-sm text-plum-900 block mb-2">
                {t.symptoms.flowIntensity}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['none', 'spotting', 'light', 'medium', 'heavy'] as FlowIntensity[]).map(f => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFlow(f)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs font-semibold ${
                      flow === f
                        ? 'border-rose-500 bg-rose-500 text-white shadow-xs'
                        : 'border-rose-100 bg-canvas text-plum-700 hover:bg-rose-50'
                    }`}
                  >
                    {t.flows[f]}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Physical Symptoms Grid (Acne, Fatigue, Bloating, Headache, Sleep, Nausea) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fatigue */}
              <div className="p-3.5 bg-canvas rounded-2xl border border-rose-100/80">
                <label className="block text-xs font-bold text-plum-900 mb-1.5">
                  {t.symptoms.fatigueLevel}
                </label>
                <div className="flex gap-1.5">
                  {(['none', 'mild', 'moderate', 'severe'] as SeverityLevel[]).map(lvl => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setFatigue(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        fatigue === lvl
                          ? 'bg-rose-500 text-white'
                          : 'bg-white text-plum-600 hover:bg-rose-50 border border-rose-100'
                      }`}
                    >
                      {t.severities[lvl]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bloating */}
              <div className="p-3.5 bg-canvas rounded-2xl border border-rose-100/80">
                <label className="block text-xs font-bold text-plum-900 mb-1.5">
                  {t.symptoms.bloatingLevel}
                </label>
                <div className="flex gap-1.5">
                  {(['none', 'mild', 'moderate', 'severe'] as SeverityLevel[]).map(lvl => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setBloating(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        bloating === lvl
                          ? 'bg-rose-500 text-white'
                          : 'bg-white text-plum-600 hover:bg-rose-50 border border-rose-100'
                      }`}
                    >
                      {t.severities[lvl]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Quality */}
              <div className="p-3.5 bg-canvas rounded-2xl border border-rose-100/80">
                <label className="block text-xs font-bold text-plum-900 mb-1.5">
                  {t.symptoms.sleepQuality}
                </label>
                <div className="flex gap-1.5">
                  {(['great', 'average', 'poor', 'insomnia'] as SleepQuality[]).map(lvl => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setSleepQuality(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        sleepQuality === lvl
                          ? 'bg-lavender-500 text-white'
                          : 'bg-white text-plum-600 hover:bg-lavender-50 border border-rose-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headache */}
              <div className="p-3.5 bg-canvas rounded-2xl border border-rose-100/80">
                <label className="block text-xs font-bold text-plum-900 mb-1.5">
                  {t.symptoms.headacheType}
                </label>
                <div className="flex gap-1.5">
                  {(['none', 'mild', 'throbbing', 'migraine'] as HeadacheType[]).map(lvl => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setHeadache(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        headache === lvl
                          ? 'bg-plum-800 text-white'
                          : 'bg-white text-plum-600 hover:bg-plum-50 border border-rose-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Acne */}
              <div className="p-3.5 bg-canvas rounded-2xl border border-rose-100/80">
                <label className="block text-xs font-bold text-plum-900 mb-1.5">
                  {t.symptoms.acneSeverity}
                </label>
                <div className="flex gap-1.5">
                  {(['none', 'mild', 'moderate', 'severe'] as SeverityLevel[]).map(lvl => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setAcne(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        acne === lvl
                          ? 'bg-rose-500 text-white'
                          : 'bg-white text-plum-600 hover:bg-rose-50 border border-rose-100'
                      }`}
                    >
                      {t.severities[lvl]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Changes */}
              <div className="p-3.5 bg-canvas rounded-2xl border border-rose-100/80">
                <label className="block text-xs font-bold text-plum-900 mb-1.5">
                  {t.symptoms.hairChange}
                </label>
                <div className="flex gap-1.5">
                  {(['none', 'thinning', 'excessive_growth'] as HairChangeType[]).map(lvl => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setHairChange(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer truncate ${
                        hairChange === lvl
                          ? 'bg-lavender-500 text-white'
                          : 'bg-white text-plum-600 hover:bg-lavender-50 border border-rose-100'
                      }`}
                    >
                      {lvl.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Notes & Observations Field */}
            <div>
              <label className="font-bold text-xs text-plum-700 block mb-1">
                {language === 'bn' ? 'ব্যক্তিগত পর্যবেক্ষণ ও নোট' : 'Personal Observations & Triggers'}
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t.symptoms.notesPlaceholder}
                rows={3}
                className="w-full bg-canvas border border-rose-200 rounded-2xl p-3.5 text-xs sm:text-sm text-plum-900 placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNotes('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-plum-600 hover:text-plum-900 cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel Edit'}
                </button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={<Save className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                {editingId ? t.symptoms.updateEntry : t.symptoms.saveEntry}
              </Button>
            </div>
          </form>
        </div>

        {/* Recent History List (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
              <h4 className="font-bold text-sm text-plum-900">
                {t.symptoms.historyTitle}
              </h4>
              <Badge variant="plum" size="sm">
                {symptoms.length} {language === 'bn' ? 'টি' : 'logs'}
              </Badge>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {symptoms.length === 0 ? (
                <p className="text-xs text-plum-400 text-center py-6">
                  {language === 'bn' ? 'কোনো লক্ষণ রেকর্ড করা নেই।' : 'No symptom records found.'}
                </p>
              ) : (
                symptoms.map(entry => (
                  <div
                    key={entry.id}
                    className="p-3 bg-canvas rounded-2xl border border-rose-100 hover:border-rose-300 transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-plum-900">
                        {new Date(entry.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="p-1 text-plum-400 hover:text-rose-600 rounded-lg hover:bg-white cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(t.symptoms.deleteConfirm)) {
                              deleteSymptom(entry.id);
                            }
                          }}
                          className="p-1 text-plum-400 hover:text-rose-600 rounded-lg hover:bg-white cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-plum-600">
                      <div>
                        <span className="text-plum-400">{t.symptoms.crampsPain}:</span>{' '}
                        <strong className="text-rose-600">{entry.crampsPain}/10</strong>
                      </div>
                      <div>
                        <span className="text-plum-400">{t.symptoms.moodStatus}:</span>{' '}
                        <span className="font-semibold">{t.moods[entry.mood] || entry.mood}</span>
                      </div>
                      <div>
                        <span className="text-plum-400">{t.symptoms.flowIntensity}:</span>{' '}
                        <span>{t.flows[entry.flow]}</span>
                      </div>
                      <div>
                        <span className="text-plum-400">{t.symptoms.fatigueLevel}:</span>{' '}
                        <span>{t.severities[entry.fatigue]}</span>
                      </div>
                    </div>

                    {entry.notes && (
                      <p className="text-[11px] text-plum-600 italic bg-white/80 p-2 rounded-xl border border-rose-50">
                        &quot;{entry.notes}&quot;
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
