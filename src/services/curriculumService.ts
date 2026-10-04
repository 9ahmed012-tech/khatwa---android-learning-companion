import {
  Subject,
  Lesson,
  AITeachingMode,
  CurriculumSearchResult,
  VerificationStatus,
  AIStudyPlan,
  DailyStudyPlanItem,
  StudentProfile,
} from '../types';
import { ALL_SUBJECTS } from '../data/demoCurriculum';
import { getCurriculumSources } from '../data/curriculumSources';

// 1. Search Curriculum across subjects, units, lessons, and learning objectives
export function searchCurriculum(
  query: string,
  studentSubjectIds?: string[]
): CurriculumSearchResult[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const results: CurriculumSearchResult[] = [];

  const candidateSubjects = studentSubjectIds
    ? ALL_SUBJECTS.filter((s) => studentSubjectIds.includes(s.id))
    : ALL_SUBJECTS;

  for (const subject of candidateSubjects) {
    for (const unit of subject.units) {
      for (const lesson of unit.lessons) {
        let matchScore = 0;
        let snippet = '';

        if (lesson.title.toLowerCase().includes(cleanQuery)) {
          matchScore += 10;
          snippet = `عنوان الدرس: ${lesson.title}`;
        }

        if (unit.title.toLowerCase().includes(cleanQuery)) {
          matchScore += 5;
          snippet = snippet || `الوحدة: ${unit.title}`;
        }

        const matchedObj = lesson.objectives?.find((obj) => obj.toLowerCase().includes(cleanQuery));
        if (matchedObj) {
          matchScore += 8;
          snippet = snippet || `مخرج تعلم: ${matchedObj}`;
        }

        if (lesson.content.explanation.toLowerCase().includes(cleanQuery)) {
          matchScore += 6;
          const idx = lesson.content.explanation.toLowerCase().indexOf(cleanQuery);
          const start = Math.max(0, idx - 40);
          const end = Math.min(lesson.content.explanation.length, idx + 80);
          snippet = snippet || `...${lesson.content.explanation.slice(start, end)}...`;
        }

        if (matchScore > 0) {
          results.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            subjectId: subject.id,
            subjectNameAr: subject.nameAr,
            unitTitle: unit.title,
            matchSnippet: snippet,
            objectives: lesson.objectives || [
              'فهم المفهوم الأساسي وتطبيقاته',
              'حل التمارين والمسائل النموذجية',
            ],
            verificationStatus: lesson.verificationStatus || 'verified',
          });
        }
      }
    }
  }

  return results;
}

// 2. Get Lesson with Complete Curriculum Context
export function getLessonWithCurriculumContext(subjectId: string, lessonId: string) {
  const subject = ALL_SUBJECTS.find((s) => s.id === subjectId);
  if (!subject) return null;

  for (const unit of subject.units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      const sources = getCurriculumSources().filter(
        (src) => src.subject.includes(subject.nameAr) || src.subject.includes(subject.id)
      );

      return {
        subject,
        unit,
        lesson,
        sources,
        contextText: `
[السياق التعليمي للمنهج الرسمي المعتمد]
- النظام التعليمي: شهادة الثانوية العامة المصرية
- الصف الدراسي: الصف الثاني الثانوي
- المسار والتخصص: مسار الهندسة وعلوم الحاسوب (البرمجة والذكاء الاصطناعي)
- العام الدراسي: 2026-2027
- المادة: ${subject.nameAr} (${subject.name})
- الوحدة: ${unit.title}
- الدرس: ${lesson.title}
- نواتج التعلم المستهدفة (Objectives): ${(lesson.objectives || ['استيعاب المفاهيم والمصطلحات', 'التطبيق العملي']).join(' - ')}
- حالة التوثيق: ${lesson.verificationStatus === 'verified' ? 'مصدر معتمد وموثق رسمياً' : 'محتوى تجريبي قيد التوثيق'}
- مرجع المصدر: ${lesson.sourceTitle || 'بوابة المناهج بوزارة التربية والتعليم المصرية'}
        `.trim(),
      };
    }
  }

  return null;
}

// 3. Mapping of AI Teaching Modes to Pedagogical Directives (Section 8)
export const AI_TEACHING_MODES: {
  id: AITeachingMode;
  labelAr: string;
  icon: string;
  directive: string;
}[] = [
  {
    id: 'explain',
    labelAr: 'اشرحلي',
    icon: 'BookOpen',
    directive:
      'اشرح الدرس والمفهوم بأسلوب تربوي ممتع ومنظم، مع التركيز على نواتج التعلم المقررة للمنهج الرسمي.',
  },
  {
    id: 'simplify',
    labelAr: 'اشرحلي ببساطة',
    icon: 'Sparkles',
    directive:
      'بسط الشرح لأقصى درجة كأنك تشرح لمبتدئ تماماً، واستخدم تشبيهات من واقع الحياة اليومية لتيسير الاستيعاب.',
  },
  {
    id: 'example',
    labelAr: 'اديني مثال',
    icon: 'Lightbulb',
    directive:
      'قدم مثالاً عملياً واقعياً أو نموذجاً محلولاً خطوة بخطوة يوضح كيفية تطبيق هذا المفهوم في الامتحان أو الحياة العملية.',
  },
  {
    id: 'hint',
    labelAr: 'اديني تلميح',
    icon: 'Compass',
    directive:
      'المطلوب تلميح ذكي فقط يوجه تفكير الطالب إلى الفكرة المفتاحية دون كشف الإجابة أو الحل النهائي.',
  },
  {
    id: 'step_by_step',
    labelAr: 'وجهني خطوة بخطوة',
    icon: 'Layers',
    directive:
      'قسّم المسألة إلى خطوات متتالية، واشرح الخطوة الأولى فقط واطلب من الطالب التفكير في الخطوة التي تليها.',
  },
  {
    id: 'test_me',
    labelAr: 'اختبرني',
    icon: 'CheckCircle2',
    directive:
      'اطرح على الطالب سؤالاً تدريبياً دقيقاً من صميم نواتج تعلم هذا الدرس، وانتظر إجابته لتقييمها قبل المتابعة.',
  },
  {
    id: 'check_solution',
    labelAr: 'راجع حلي',
    icon: 'CheckSquare',
    directive:
      'راجع حل الطالب أو الصورة المرفقة، بيّن مواضع القوة والصواب أولاً، ثم وضح أي خطأ مع تعليله التربوي بلطف.',
  },
  {
    id: 'clarify_mistake',
    labelAr: 'وضح الغلط',
    icon: 'AlertCircle',
    directive:
      'حلل الخطأ المفاهيمي الذي وقع فيه الطالب، واشرح سبب كونه خطأ وكيف يتفاداه في الاختبارات القادمة.',
  },
  {
    id: 'similar_question',
    labelAr: 'سؤال مشابه',
    icon: 'RefreshCw',
    directive:
      'صغ مسألة جديدة بنفس الصعوبة ونفس الفكرة الامتحانية ليتأكد الطالب من رسوخ المفهوم لديه.',
  },
  {
    id: 'summarize',
    labelAr: 'اعمللي ملخص',
    icon: 'FileText',
    directive:
      'لخص أهم النقاط والقوانين والقواعد الجوهرية لهذا الدرس في نقاط سريعة مكثفة صالحة للمراجعة ليلة الامتحان.',
  },
  {
    id: 'challenge',
    labelAr: 'تحدي أصعب',
    icon: 'Flame',
    directive:
      'اطرح مسألة متقدمة من أسئلة المستويات العليا للتفكير (Higher-Order Thinking Skills) للطلاب المتفوقين.',
  },
];

// 4. Client-side Adaptive AI Study Plan Generator (Section 20 & 21)
export function createAIStudyPlan(
  student: StudentProfile,
  focusArea: 'balanced' | 'weak_spots' | 'exam_sprint' = 'balanced',
  dailyHours: number = 2
): AIStudyPlan {
  const weakSubjects = Object.entries(student.assessmentResults || {})
    .filter(([_, res]) => res.weakAreas && res.weakAreas.length > 0)
    .map(([_, res]) => res.subjectNameAr);

  const schedule: DailyStudyPlanItem[] = [];

  // 1. Core Subject Lesson
  schedule.push({
    id: 'plan-1',
    timeSlot: '04:30 م - 05:15 م',
    taskType: 'lesson',
    title: `استذكار درس: ${student.todayGoalSubject}`,
    subjectName: student.todayGoalSubject,
    durationMinutes: 45,
    completed: student.completedMinutesToday >= 45,
    xpReward: 60,
    recommendedLessonId: student.currentLessonId,
  });

  // 2. Weak Area or Socratic revision
  const weakFocus = weakSubjects.length > 0 ? weakSubjects[0] : 'اللغة الإنجليزية';
  schedule.push({
    id: 'plan-2',
    timeSlot: '05:30 م - 06:00 م',
    taskType: 'weak_revision',
    title: `مراجعة نقطة تحتاج تثبيت في (${weakFocus})`,
    subjectName: weakFocus,
    durationMinutes: 30,
    completed: false,
    xpReward: 50,
  });

  // 3. English or Coding Challenge
  schedule.push({
    id: 'plan-3',
    timeSlot: '07:30 م - 07:55 م',
    taskType: 'english_challenge',
    title: 'تطبيق عملي: كود بايثون أو قراءة فقرة إنجليزية',
    durationMinutes: 25,
    completed: false,
    xpReward: 40,
  });

  // 4. Free Game Reward
  schedule.push({
    id: 'plan-4',
    timeSlot: '08:00 م - 08:15 م',
    taskType: 'free_game',
    title: 'مكافأة الاستراحة: جولة في سباق خطوة أو تحدي الذاكرة 🎮',
    durationMinutes: 15,
    completed: false,
    xpReward: 25,
  });

  return {
    id: `plan-${Date.now()}`,
    generatedAt: new Date().toISOString().split('T')[0],
    studentGrade: student.gradeAr,
    academicYear: '2026-2027',
    weeklyGoalMinutes: dailyHours * 60 * 6,
    focusWeakAreas: weakSubjects,
    dailySchedule: schedule,
    aiAdvice:
      '«سر التفوق ليس في السهر الطويل، بل في الاستذكار المركز وتقسيم المهام. خطتك اليوم مبنية على المنهج المعتمد ونقاط قوتك.»',
  };
}

// 5. Document/PDF Curriculum Import Simulation & Validator (Section 5)
export interface ImportedCurriculumDoc {
  fileName: string;
  sourceType: string;
  academicYear: string;
  extractedUnitsCount: number;
  extractedLessonsCount: number;
  verificationStatus: VerificationStatus;
  notes: string;
}

export function simulateCurriculumDocImport(
  fileName: string,
  rawText: string
): ImportedCurriculumDoc {
  const lineCount = rawText.split('\n').length;
  const estimatedLessons = Math.max(1, Math.min(12, Math.floor(lineCount / 10) + 2));

  return {
    fileName,
    sourceType: 'كتاب وزاري أو وثيقة منهجية (PDF/DOC)',
    academicYear: '2026-2027',
    extractedUnitsCount: Math.ceil(estimatedLessons / 3),
    extractedLessonsCount: estimatedLessons,
    verificationStatus: 'pending_verification',
    notes:
      'تم استخراج هيكل الوحدات والدروس المنهجية بنجاح؛ تم تعيين الحالة تلقائياً كـ (بانتظار التحقق من المصدر الرسمي) للحفاظ على موثوقية المحتوى.',
  };
}
