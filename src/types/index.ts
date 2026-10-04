export type EducationStage = 'primary' | 'preparatory' | 'secondary';

export type LessonStatus = 'completed' | 'in_progress' | 'locked';

export type AssessmentLevel = 'مبتدئ' | 'متوسط' | 'متقدم';

export type VerificationStatus = 'verified' | 'pending_verification' | 'draft' | 'outdated';

export type AITeachingMode =
  | 'explain' // "اشرحلي"
  | 'simplify' // "اشرحلي ببساطة"
  | 'example' // "اديني مثال"
  | 'hint' // "اديني تلميح"
  | 'step_by_step' // "وجهني خطوة بخطوة"
  | 'test_me' // "اختبرني"
  | 'check_solution' // "راجع حلي"
  | 'clarify_mistake' // "وضح الغلط"
  | 'similar_question' // "اعمللي سؤال مشابه"
  | 'summarize' // "اعمللي ملخص"
  | 'challenge'; // "عايز تحدي أصعب"

export interface CurriculumSource {
  id: string;
  title: string;
  sourceType: 'ministry_platform' | 'ministry_pdf' | 'official_textbook' | 'curriculum_doc' | 'verified_partner';
  sourceTypeAr: string;
  urlOrRef: string;
  academicYear: string; // e.g. "2026-2027"
  educationSystem: string; // e.g. "شهادة الثانوية العامة المصرية"
  grade: string; // e.g. "الصف الثاني الثانوي"
  subject: string;
  verificationStatus: VerificationStatus;
  lastUpdated: string;
  notes?: string;
}

export interface PracticeQuestion {
  id: string;
  prompt: string;
  hint: string;
  stepByStepGuide: string[];
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonContent {
  explanation: string;
  summaryPoints: string[];
  example: {
    title: string;
    problem: string;
    solutionSteps: string[];
    takeaway: string;
  };
  practiceQuestions: PracticeQuestion[];
  quiz: QuizQuestion[];
}

export interface Lesson {
  id: string;
  subjectId: string;
  unitId: string;
  title: string;
  order: number;
  status: LessonStatus;
  xpReward: number;
  estimatedMinutes: number;
  objectives?: string[]; // نواتج التعلم المستهدفة
  difficulty?: 'مبتدئ' | 'متوسط' | 'متقدم';
  verificationStatus?: VerificationStatus;
  sourceTitle?: string;
  sourceUrl?: string;
  academicYear?: string;
  term?: string;
  content: LessonContent;
}

export interface Unit {
  id: string;
  title: string;
  order: number;
  description: string;
  academicYear?: string;
  term?: string;
  termAr?: string;
  lessons: Lesson[];
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  skillArea: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DiagnosticTest {
  subjectId: string;
  subjectNameAr: string;
  estimatedMinutes: number;
  questions: DiagnosticQuestion[];
}

export interface Subject {
  id: string;
  name: string;
  nameAr: string;
  iconName: string;
  color: string;
  bgGradient: string;
  gradeId: string;
  trackId?: string;
  units: Unit[];
  diagnosticTest: DiagnosticTest;
}

export interface AssessmentResult {
  subjectId: string;
  subjectNameAr: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: AssessmentLevel;
  weakAreas: string[];
  recommendation: string;
  recommendedLessonId?: string;
  completedAt: string;
}

export interface SkillMilestone {
  id: string;
  title: string;
  levelRequired: number;
  isUnlocked: boolean;
  xpValue: number;
}

export interface SkillItem {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  level: number;
  currentXP: number;
  maxXP: number;
  iconName: string;
  color: string;
  description: string;
  milestones: SkillMilestone[];
}

export interface QuranProgress {
  currentSurah: string;
  surahNumber: number;
  currentPage: number;
  totalPages: number;
  targetDailyPages: number;
  isReadToday: boolean;
  streakDays: number;
}

export interface PrayerTimeItem {
  nameAr: string;
  nameEn: string;
  timeString: string;
  isPassed: boolean;
  isNext: boolean;
  remainingMinutes?: number;
}

export interface DailyStudyStat {
  dayNameAr: string;
  dateString: string;
  studyMinutes: number;
  completedLessonsCount: number;
  isToday?: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  stage: EducationStage;
  grade: string;
  gradeAr: string;
  track?: string;
  educationSystem: string;
  subjects: string[]; // subject IDs
  skills: string[]; // skill IDs
  xp: number;
  level: number;
  streakDays: number;
  todayGoalMinutes: number;
  completedMinutesToday: number;
  todayGoalSubject: string;
  currentLessonId: string;
  currentSkillId: string;
  completedLessonIds: string[];
  assessmentResults: Record<string, AssessmentResult>;
  quranProgress: QuranProgress;
  weeklyStats?: DailyStudyStat[];
  isCustomProfile?: boolean;
  gameRecords?: GameRecord;
  savedLifeTips?: string[];
  savedIslamicBenefits?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  hints?: string[];
  source?: string;
  suggestedAction?: {
    type: 'review_lesson' | 'try_practice' | 'check_diagnostic';
    targetId?: string;
    label: string;
  };
}

export interface StudentSettings {
  studyRemindersEnabled: boolean;
  studyReminderTime: string;
  studyDurationGoal: number;
  soundEnabled: boolean;
  weekendRemindersEnabled: boolean;
  prayerAlertsEnabled: boolean;
  prayerTiming: 'at_time' | 'before_10m' | 'before_15m';
  fajrEnabled: boolean;
  dhuhrEnabled: boolean;
  asrEnabled: boolean;
  maghribEnabled: boolean;
  ishaEnabled: boolean;
  athanTone: 'standard' | 'makkah' | 'madinah' | 'calm';
  updatedAt?: string;
}

export interface LifeTip {
  id: string;
  title: string;
  category: 'tech_habits' | 'sleep' | 'study_habits' | 'time_mgmt' | 'nutrition' | 'cyber_safety' | 'mindset';
  categoryAr: string;
  summary: string;
  content: string;
  practicalTip: string;
  challenge?: {
    title: string;
    xpReward: number;
  };
  iconName: string;
}

export interface IslamicBenefit {
  id: string;
  title: string;
  type: 'quran' | 'hadith' | 'seerah' | 'manners' | 'history';
  typeAr: string;
  arabicText: string;
  reference: string;
  explanation: string;
  reflection: string;
}

export interface IslamicQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  reference: string;
  xpReward: number;
}

export interface GameRecord {
  racingHighScore: number;
  racingTracksUnlocked: number;
  selectedCarColor: string;
  selectedCarModel: string;
  brainScore: number;
  adventureStage: number;
  totalGamesPlayed: number;
  totalPlayMinutesToday: number;
  lastPlayDate?: string;
}

export interface DailyStudyPlanItem {
  id: string;
  timeSlot: string;
  taskType: 'lesson' | 'weak_revision' | 'english_challenge' | 'mistake_review' | 'free_game';
  title: string;
  subjectName?: string;
  durationMinutes: number;
  completed: boolean;
  xpReward: number;
  recommendedLessonId?: string;
}

export interface AIStudyPlan {
  id: string;
  generatedAt: string;
  studentGrade: string;
  academicYear: string;
  weeklyGoalMinutes: number;
  focusWeakAreas: string[];
  dailySchedule: DailyStudyPlanItem[];
  aiAdvice: string;
}

export interface CurriculumSearchResult {
  lessonId: string;
  lessonTitle: string;
  subjectId: string;
  subjectNameAr: string;
  unitTitle: string;
  matchSnippet: string;
  objectives: string[];
  verificationStatus: VerificationStatus;
}


