import { CycleEntry, CyclePrediction, CyclePhase } from '../types';

export function calculateCycleStats(cycles: CycleEntry[]) {
  if (cycles.length === 0) {
    return {
      averageCycleLength: 28,
      averagePeriodDuration: 5,
      cycleVariation: 0,
      totalCyclesRecorded: 0,
      regularityStatus: 'insufficient_data',
    };
  }

  // Calculate cycle lengths between consecutive start dates
  const sorted = [...cycles].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const lengths: number[] = [];
  const durations: number[] = [];

  for (let i = 0; i < sorted.length; i++) {
    durations.push(sorted[i].periodDuration);
    if (i > 0) {
      const prevStart = new Date(sorted[i - 1].startDate).getTime();
      const currStart = new Date(sorted[i].startDate).getTime();
      const diffDays = Math.round((currStart - prevStart) / (1000 * 60 * 60 * 24));
      if (diffDays > 15 && diffDays < 60) {
        lengths.push(diffDays);
      }
    }
  }

  const avgLength = lengths.length > 0 
    ? Math.round((lengths.reduce((a, b) => a + b, 0) / lengths.length) * 10) / 10 
    : 28;

  const avgDuration = durations.length > 0
    ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
    : 5;

  // Variation (standard deviation)
  let variation = 0;
  if (lengths.length > 1) {
    const variance = lengths.reduce((acc, val) => acc + Math.pow(val - avgLength, 2), 0) / lengths.length;
    variation = Math.round(Math.sqrt(variance) * 10) / 10;
  }

  let regularityStatus: 'regular' | 'mild_variation' | 'irregular' | 'insufficient_data' = 'regular';
  if (lengths.length < 2) {
    regularityStatus = 'insufficient_data';
  } else if (variation <= 2.5) {
    regularityStatus = 'regular';
  } else if (variation <= 5) {
    regularityStatus = 'mild_variation';
  } else {
    regularityStatus = 'irregular';
  }

  return {
    averageCycleLength: avgLength,
    averagePeriodDuration: avgDuration,
    cycleVariation: variation,
    totalCyclesRecorded: cycles.length,
    regularityStatus,
  };
}

export function calculateCyclePrediction(
  lastPeriodStart: string,
  targetCycleLength: number = 28,
  targetPeriodDuration: number = 5,
  variationDays: number = 2
): CyclePrediction {
  const lastStart = new Date(lastPeriodStart);
  const today = new Date();
  
  // Normalize dates to midnight UTC
  const lastStartUTC = Date.UTC(lastStart.getFullYear(), lastStart.getMonth(), lastStart.getDate());
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffDays = Math.floor((todayUTC - lastStartUTC) / (1000 * 60 * 60 * 24));
  const currentCycleDay = diffDays >= 0 ? diffDays + 1 : 1;

  // Determine estimated phase
  let currentPhase: CyclePhase = 'follicular';
  if (currentCycleDay <= targetPeriodDuration) {
    currentPhase = 'menstrual';
  } else if (currentCycleDay <= targetCycleLength - 16) {
    currentPhase = 'follicular';
  } else if (currentCycleDay <= targetCycleLength - 11) {
    currentPhase = 'ovulation';
  } else {
    currentPhase = 'luteal';
  }

  // Next Period Start
  const nextStart = new Date(lastStart);
  nextStart.setDate(lastStart.getDate() + Math.round(targetCycleLength));
  
  const nextEnd = new Date(nextStart);
  nextEnd.setDate(nextStart.getDate() + Math.round(targetPeriodDuration) - 1);

  // Ovulation estimate (around 14 days before next period)
  const ovulationDate = new Date(nextStart);
  ovulationDate.setDate(nextStart.getDate() - 14);

  const ovulationWinStart = new Date(ovulationDate);
  ovulationWinStart.setDate(ovulationDate.getDate() - 4);

  const ovulationWinEnd = new Date(ovulationDate);
  ovulationWinEnd.setDate(ovulationDate.getDate() + 1);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  return {
    nextPeriodStart: formatDate(nextStart),
    nextPeriodEnd: formatDate(nextEnd),
    uncertaintyDays: Math.max(1, Math.round(variationDays || 2)),
    currentPhase,
    currentCycleDay,
    ovulationEstimatedDate: formatDate(ovulationDate),
    ovulationWindowStart: formatDate(ovulationWinStart),
    ovulationWindowEnd: formatDate(ovulationWinEnd),
  };
}
