import { StudentProfile, AssessmentResult } from '../types';
import { DEMO_STUDENT_1, DEMO_STUDENT_2 } from '../data/demoCurriculum';

const STORAGE_KEY_PROFILES = 'khatwa_student_profiles_v1';
const STORAGE_KEY_ACTIVE_ID = 'khatwa_active_student_id_v1';

export function getInitialProfiles(): Record<string, StudentProfile> {
  const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure Ahmed's curriculum is strictly updated to Egyptian Baccalaureate without Math
      if (parsed[DEMO_STUDENT_1.id]) {
        parsed[DEMO_STUDENT_1.id].subjects = ['arabic_bac', 'english_bac', 'history_bac', 'prog_ai'];
        parsed[DEMO_STUDENT_1.id].gradeAr = 'الثانوية العامة المصرية - الصف الثاني الثانوي';
        parsed[DEMO_STUDENT_1.id].track = 'مسار الهندسة وعلوم الحاسوب - تخصص البرمجة والذكاء الاصطناعي';
        parsed[DEMO_STUDENT_1.id].educationSystem = 'شهادة الثانوية العامة المصرية';
        parsed[DEMO_STUDENT_1.id].todayGoalSubject = 'البرمجة والذكاء الاصطناعي';
        parsed[DEMO_STUDENT_1.id].completedLessonIds = (parsed[DEMO_STUDENT_1.id].completedLessonIds || []).filter(
          (id: string) => !id.startsWith('math_')
        );
        if (parsed[DEMO_STUDENT_1.id].assessmentResults) {
          delete parsed[DEMO_STUDENT_1.id].assessmentResults['math_bac'];
        }
      }
      return parsed;
    } catch {
      // fallback
    }
  }

  const initial: Record<string, StudentProfile> = {
    [DEMO_STUDENT_1.id]: DEMO_STUDENT_1,
    [DEMO_STUDENT_2.id]: DEMO_STUDENT_2,
  };
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(initial));
  return initial;
}

export function getActiveStudentId(): string {
  const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
  if (savedId) return savedId;
  localStorage.setItem(STORAGE_KEY_ACTIVE_ID, DEMO_STUDENT_1.id);
  return DEMO_STUDENT_1.id;
}

export function setActiveStudentId(id: string): void {
  localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
}

export function saveProfiles(profiles: Record<string, StudentProfile>): void {
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
}

export function saveActiveProfile(profile: StudentProfile): void {
  const profiles = getInitialProfiles();
  profiles[profile.id] = profile;
  saveProfiles(profiles);
}

export function completeLessonInProfile(studentId: string, lessonId: string, xpReward: number): StudentProfile | null {
  const profiles = getInitialProfiles();
  const student = profiles[studentId];
  if (!student) return null;

  if (!student.completedLessonIds.includes(lessonId)) {
    student.completedLessonIds.push(lessonId);
    student.xp += xpReward;
    student.level = Math.floor(student.xp / 250) + 1;
    student.completedMinutesToday += 15;
    saveProfiles(profiles);
  }
  return student;
}

export function saveAssessmentResult(studentId: string, result: AssessmentResult): StudentProfile | null {
  const profiles = getInitialProfiles();
  const student = profiles[studentId];
  if (!student) return null;

  student.assessmentResults = {
    ...student.assessmentResults,
    [result.subjectId]: result,
  };
  student.xp += 30; // bonus XP for completing diagnostic test
  saveProfiles(profiles);
  return student;
}

export function toggleQuranReadStatus(studentId: string): StudentProfile | null {
  const profiles = getInitialProfiles();
  const student = profiles[studentId];
  if (!student) return null;

  student.quranProgress.isReadToday = !student.quranProgress.isReadToday;
  if (student.quranProgress.isReadToday) {
    student.quranProgress.currentPage = Math.min(student.quranProgress.totalPages, student.quranProgress.currentPage + 2);
    student.quranProgress.streakDays += 1;
    student.xp += 25;
  }
  saveProfiles(profiles);
  return student;
}
