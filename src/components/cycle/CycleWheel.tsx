import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar, HelpCircle, Info } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CycleWheel: React.FC = () => {
  const { user, prediction, language, t } = useApp();

  const totalDays = user.targetCycleLength || 29;
  const currentDay = Math.min(prediction.currentCycleDay, totalDays);
  const progressRatio = currentDay / totalDays;

  // SVG parameters
  const size = 300;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Arc calculation: offset
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Phase colors and titles
  const phaseInfo = {
    menstrual: {
      color: '#D96C91',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      title: t.phases.menstrual,
      desc: t.phases.menstrualDesc,
    },
    follicular: {
      color: '#ECA48A',
      bg: 'bg-peach-100 text-peach-700 border-peach-200',
      title: t.phases.follicular,
      desc: t.phases.follicularDesc,
    },
    ovulation: {
      color: '#B8A7E8',
      bg: 'bg-lavender-100 text-lavender-800 border-lavender-200',
      title: t.phases.ovulation,
      desc: t.phases.ovulationDesc,
    },
    luteal: {
      color: '#9E88DE',
      bg: 'bg-plum-100 text-plum-800 border-plum-200',
      title: t.phases.luteal,
      desc: t.phases.lutealDesc,
    },
  }[prediction.currentPhase];

  // Days till next period
  const daysTillNext = Math.max(0, totalDays - currentDay + 1);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Interactive Dial SVG */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="w-full h-full -rotate-90 transform drop-shadow-sm"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background track circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#FDEEF2"
            strokeWidth={strokeWidth}
          />

          {/* Menstrual Phase Section (Approx Days 1 to 5) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#D96C91"
            strokeWidth={strokeWidth}
            strokeDasharray={`${(5 / totalDays) * circumference} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            className="opacity-40"
          />

          {/* Ovulation window estimate (Approx Days 13 to 17) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#B8A7E8"
            strokeWidth={strokeWidth}
            strokeDasharray={`${(4 / totalDays) * circumference} ${circumference}`}
            strokeDashoffset={-((12 / totalDays) * circumference)}
            className="opacity-40"
          />

          {/* Progress Path Indicator */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={phaseInfo.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Information Card */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none pointer-events-none">
          <span className="text-xs uppercase tracking-wider font-semibold text-plum-500">
            {t.dashboard.cycleDay}
          </span>

          <div className="flex items-baseline justify-center gap-1 my-0.5">
            <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight text-plum-900 ${user.privacyMode ? 'blur-sm' : ''}`}>
              {currentDay}
            </span>
            <span className="text-xs sm:text-sm text-plum-400 font-medium">
              / ~{totalDays} {language === 'bn' ? 'দিন' : 'days'}
            </span>
          </div>

          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border mt-1 ${phaseInfo.bg}`}>
            {phaseInfo.title}
          </span>

          <div className="mt-2 text-[11px] text-plum-500 flex items-center justify-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-rose-500" />
            <span>
              {language === 'bn'
                ? `পরবর্তী মাসিক: ~${daysTillNext} দিন পর`
                : `Next: in ~${daysTillNext} days`}
            </span>
            <span className="text-[10px] text-plum-400 font-normal">
              ({t.dashboard.uncertainty})
            </span>
          </div>
        </div>
      </div>

      {/* Explanatory Phase Card */}
      <div className="mt-4 p-3.5 bg-canvas rounded-2xl border border-rose-100/70 max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-plum-800 mb-1">
          <Info className="w-3.5 h-3.5 text-rose-500" />
          <span>{t.dashboard.currentPhase}</span>
        </div>
        <p className="text-xs text-plum-600 leading-relaxed">
          {phaseInfo.desc}
        </p>
      </div>
    </div>
  );
};
