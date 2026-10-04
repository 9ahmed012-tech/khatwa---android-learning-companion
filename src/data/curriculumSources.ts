import { CurriculumSource } from '../types';

export const INITIAL_CURRICULUM_SOURCES: CurriculumSource[] = [
  {
    id: 'src-moe-portal',
    title: 'بوابة المناهج والتعليم الإلكتروني — وزارة التربية والتعليم المصرية',
    sourceType: 'ministry_platform',
    sourceTypeAr: 'منصة الوزارة الرسمية',
    urlOrRef: 'https://moe.gov.eg/elearning',
    academicYear: '2026-2027',
    educationSystem: 'شهادة الثانوية العامة المصرية',
    grade: 'الصف الثاني الثانوي',
    subject: 'البرمجة والذكاء الاصطناعي، اللغة العربية، الإنجليزية، التاريخ',
    verificationStatus: 'verified',
    lastUpdated: '2026-09-15',
    notes: 'الإطار العام المعتمد لتوزيع المقررات ونواتج التعلم المستهدفة.',
  },
  {
    id: 'src-ekb-stem',
    title: 'بنك المعرفة المصري (EKB) — منصة مسار التكنولوجيا وعلوم الحاسوب',
    sourceType: 'ministry_platform',
    sourceTypeAr: 'بنك المعرفة والمنصات الوطنية',
    urlOrRef: 'https://www.ekb.eg/curriculum/stem-ai',
    academicYear: '2026-2027',
    educationSystem: 'شهادة الثانوية العامة المصرية',
    grade: 'الصف الثاني الثانوي',
    subject: 'البرمجة والذكاء الاصطناعي',
    verificationStatus: 'verified',
    lastUpdated: '2026-09-20',
    notes: 'الوحدات العملية في خوارزميات الذكاء الاصطناعي وبايثون المعتمدة.',
  },
  {
    id: 'src-arabic-pdf',
    title: 'كتاب اللغة العربية والآداب المعتمد (PDF) — مركز تطوير المناهج',
    sourceType: 'ministry_pdf',
    sourceTypeAr: 'كتاب وزاري معتمد (PDF)',
    urlOrRef: 'MOE_EG_SEC2_ARABIC_2026_V1.pdf',
    academicYear: '2026-2027',
    educationSystem: 'شهادة الثانوية العامة المصرية',
    grade: 'الصف الثاني الثانوي',
    subject: 'اللغة العربية والآداب',
    verificationStatus: 'verified',
    lastUpdated: '2026-08-30',
    notes: 'نصوص البلاغة، القراءة الحرة، والأدب العربي وقواعد النحو.',
  },
  {
    id: 'src-history-pdf',
    title: 'مقرر التاريخ والحضارات (PDF) — وزارة التربية والتعليم',
    sourceType: 'official_textbook',
    sourceTypeAr: 'كتاب مدرسي معتمد',
    urlOrRef: 'MOE_EG_SEC2_HISTORY_2026.pdf',
    academicYear: '2026-2027',
    educationSystem: 'شهادة الثانوية العامة المصرية',
    grade: 'الصف الثاني الثانوي',
    subject: 'التاريخ المعاصر',
    verificationStatus: 'verified',
    lastUpdated: '2026-09-01',
    notes: 'التسلسل الزمني للنهضة المصرية الحديثة وبناء الدولة الوطنية.',
  },
  {
    id: 'src-preparatory-moe',
    title: 'المقررات الوزارية للمرحلة الإعدادية — الصف الثاني الإعدادي',
    sourceType: 'ministry_platform',
    sourceTypeAr: 'مقررات المرحلة الإعدادية',
    urlOrRef: 'https://moe.gov.eg/prep2',
    academicYear: '2026-2027',
    educationSystem: 'المرحلة الإعدادية المصرية',
    grade: 'الصف الثاني الإعدادي',
    subject: 'اللغة العربية، العلوم، الرياضيات، الدراسات، الإنجليزية',
    verificationStatus: 'verified',
    lastUpdated: '2026-09-10',
    notes: 'المحتوى المعتمد لملف الطالبة سارة (الصف الثاني الإعدادي).',
  },
];

const STORAGE_KEY = 'khatwa_curriculum_sources';

export function getCurriculumSources(): CurriculumSource[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_CURRICULUM_SOURCES;
}

export function saveCurriculumSources(sources: CurriculumSource[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
  } catch {
    // ignore
  }
}

export function addCurriculumSource(source: CurriculumSource): void {
  const current = getCurriculumSources();
  const updated = [source, ...current.filter((s) => s.id !== source.id)];
  saveCurriculumSources(updated);
}

export function updateCurriculumSourceStatus(id: string, status: CurriculumSource['verificationStatus']): void {
  const current = getCurriculumSources();
  const updated = current.map((s) => (s.id === id ? { ...s, verificationStatus: status, lastUpdated: new Date().toISOString().split('T')[0] } : s));
  saveCurriculumSources(updated);
}
