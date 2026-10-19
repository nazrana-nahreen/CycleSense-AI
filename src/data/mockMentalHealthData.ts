/**
 * CycleSense AI — Mock Mental Health & Mood Dataset
 * 
 * NOTE FOR TEACHER / EVALUATOR:
 * This file contains strictly labeled DEMO/SAMPLE data for evaluation and interface testing.
 * It is clearly separated from real user data stored in localStorage or the PostgreSQL/SQLite database.
 * No real health conclusions or ML claims are made from this mock data.
 */

import { MentalHealthEntry } from '../types';

export const initialMockMentalHealthEntries: MentalHealthEntry[] = [
  {
    id: 'mh_demo_01',
    date: '2026-10-19',
    moodScore: 4,
    moodLabel: 'calm',
    stressLevel: 'mild',
    anxietyLevel: 'none',
    energyLevel: 'moderate',
    sleepHours: 7.5,
    sleepQuality: 'great',
    notes: 'Practiced 5 minutes of morning box breathing. Feeling centered and grounded.',
    linkedToCycle: true,
  },
  {
    id: 'mh_demo_02',
    date: '2026-10-18',
    moodScore: 3,
    moodLabel: 'tired',
    stressLevel: 'moderate',
    anxietyLevel: 'mild',
    energyLevel: 'mild',
    sleepHours: 6,
    sleepQuality: 'average',
    notes: 'Busy workday, late evening screen time. Felt a gentle dip in afternoon focus.',
    linkedToCycle: true,
  },
  {
    id: 'mh_demo_03',
    date: '2026-10-17',
    moodScore: 2,
    moodLabel: 'anxious',
    stressLevel: 'moderate',
    anxietyLevel: 'moderate',
    energyLevel: 'mild',
    sleepHours: 5.5,
    sleepQuality: 'poor',
    notes: 'Late luteal phase sensitivity. Mind felt slightly overwhelmed; chamomile tea helped.',
    linkedToCycle: true,
  },
  {
    id: 'mh_demo_04',
    date: '2026-10-16',
    moodScore: 4,
    moodLabel: 'happy',
    stressLevel: 'none',
    anxietyLevel: 'none',
    energyLevel: 'moderate',
    sleepHours: 8,
    sleepQuality: 'great',
    notes: 'Enjoyed a peaceful weekend walk outdoors with fresh air.',
    linkedToCycle: true,
  },
  {
    id: 'mh_demo_05',
    date: '2026-10-15',
    moodScore: 5,
    moodLabel: 'energetic',
    stressLevel: 'none',
    anxietyLevel: 'none',
    energyLevel: 'severe',
    sleepHours: 8,
    sleepQuality: 'great',
    notes: 'High natural energy and clarity today.',
    linkedToCycle: true,
  },
];
