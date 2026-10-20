export type Language = 'en' | 'bn';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type FlowIntensity = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';

export type SeverityLevel = 'none' | 'mild' | 'moderate' | 'severe';

export type MoodType = 'calm' | 'happy' | 'anxious' | 'irritable' | 'sad' | 'energetic' | 'tired' | 'mood_swings';

export type SleepQuality = 'great' | 'average' | 'poor' | 'insomnia';

export type HeadacheType = 'none' | 'mild' | 'throbbing' | 'migraine';

export type HairChangeType = 'none' | 'thinning' | 'excessive_growth';

export type MoodScore = 1 | 2 | 3 | 4 | 5; // 1: Very Low 🌧️, 2: Low ☁️, 3: Okay ⛅, 4: Good 🌸, 5: Great ☀️

export interface MentalHealthEntry {
  id: string;
  date: string; // YYYY-MM-DD
  moodScore: MoodScore;
  moodLabel: MoodType;
  stressLevel: SeverityLevel;
  anxietyLevel: SeverityLevel;
  energyLevel: SeverityLevel;
  sleepHours: number;
  sleepQuality: SleepQuality;
  notes?: string;
  linkedToCycle: boolean;
  createdAt?: string;
}

export interface PartnerSharingPermissions {
  sharePeriodDates: boolean;
  shareCyclePhase: boolean;
  shareMoodAndSymptoms: boolean;
  shareDailyTips: boolean;
}

export interface PartnerSharingConfig {
  isEnabled: boolean;
  partnerName?: string;
  partnerEmail?: string;
  shareCode: string;
  status: 'inactive' | 'pending' | 'connected';
  permissions: PartnerSharingPermissions;
  connectedSince?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferredLanguage: Language;
  targetCycleLength: number;
  targetPeriodDuration: number;
  timeZone: string;
  notificationsEnabled: boolean;
  privacyMode: boolean; // Blur or mask health details on public screens
  consentGiven: boolean;
  avatarUrl?: string;
  dateOfBirth?: string;
  partnerSharing?: PartnerSharingConfig;
  linkMentalHealthWithCycle?: boolean; // Opt-out toggle for linking mental health to menstrual cycles
}

export interface CycleEntry {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  cycleLength?: number; // Days since previous start date
  periodDuration: number; // Days of bleeding
  flowIntensity: FlowIntensity;
  notes?: string;
  isPredicted?: boolean;
}

export interface DailySymptomEntry {
  id: string;
  date: string; // YYYY-MM-DD
  crampsPain: number; // 0 to 10 scale
  flow: FlowIntensity;
  mood: MoodType;
  acne: SeverityLevel;
  fatigue: SeverityLevel;
  headache: HeadacheType;
  bloating: SeverityLevel;
  sleepQuality: SleepQuality;
  nausea: SeverityLevel;
  hairChange: HairChangeType;
  notes?: string;
}

export type ArticleCategory =
  | 'pcos'
  | 'irregular_periods'
  | 'painful_periods'
  | 'heavy_bleeding'
  | 'pms_mood'
  | 'endometriosis'
  | 'thyroid'
  | 'anemia'
  | 'hygiene'
  | 'medical_care';

export interface ReliableSource {
  name: string;
  organization: string;
  referenceCode?: string;
  url: string;
}

export interface ArticleContent {
  introduction: string;
  commonSymptoms: string[];
  possibleCauses: string[];
  whenToSeeDoctor: string[];
  selfCareAndManagement: string[];
  reliableSources: ReliableSource[];
}

export interface HealthArticle {
  id: string;
  category: ArticleCategory;
  titleEn: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  readTime: string;
  tags: string[];
  isPcosFeatured?: boolean;
  reviewedDate: string;
  reviewedBy: string;
  contentEn: ArticleContent;
  contentBn: ArticleContent;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: Language;
  citations?: string[];
  urgentCareWarning?: boolean;
}

export interface NotificationItem {
  id: string;
  titleEn: string;
  titleBn: string;
  messageEn: string;
  messageBn: string;
  time: string;
  isRead: boolean;
  type: 'reminder' | 'insight' | 'educational' | 'system';
}

export interface CyclePrediction {
  nextPeriodStart: string;
  nextPeriodEnd: string;
  uncertaintyDays: number;
  currentPhase: CyclePhase;
  currentCycleDay: number;
  ovulationEstimatedDate: string;
  ovulationWindowStart: string;
  ovulationWindowEnd: string;
  // ML Engineering Telemetry
  mlModelName?: string;
  mlConfidencePercentage?: number;
  mlDatasetReference?: string;
  mlFeatureContributions?: {
    baselineCadence: number;
    ageFactor: number;
    bmiFactor: number;
    mensesFactor: number;
  };
}
