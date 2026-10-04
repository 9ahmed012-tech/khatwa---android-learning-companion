import { Subject, StudentProfile, SkillItem, DiagnosticTest } from '../types';

export const DEMO_STUDENT_1: StudentProfile = {
  id: 'student-ahmed',
  name: 'أحمد المنصوري',
  stage: 'secondary',
  grade: 'second_baccalaureate',
  gradeAr: 'الثانوية العامة المصرية - الصف الثاني الثانوي',
  track: 'مسار الهندسة وعلوم الحاسوب - تخصص البرمجة والذكاء الاصطناعي',
  educationSystem: 'شهادة الثانوية العامة المصرية',
  subjects: ['arabic_bac', 'english_bac', 'history_bac', 'prog_ai'],
  skills: ['skill_python', 'skill_web_dev', 'skill_ai_prompt', 'skill_english_talk'],
  xp: 750,
  level: 3,
  streakDays: 6,
  todayGoalMinutes: 20,
  completedMinutesToday: 8,
  todayGoalSubject: 'البرمجة والذكاء الاصطناعي',
  currentLessonId: 'prog_ai_l4',
  currentSkillId: 'skill_python',
  completedLessonIds: ['prog_ai_l1', 'prog_ai_l2', 'prog_ai_l3', 'arabic_bac_l1', 'english_bac_l1'],
  assessmentResults: {
    'prog_ai': {
      subjectId: 'prog_ai',
      subjectNameAr: 'البرمجة والذكاء الاصطناعي',
      score: 5,
      maxScore: 5,
      percentage: 100,
      level: 'متقدم',
      weakAreas: [],
      recommendation: 'مستوى استثنائي في البرمجة! يمكنك الانتقال لتحديات الخوارزميات المتقدمة.',
      recommendedLessonId: 'prog_ai_l4',
      completedAt: '2026-10-01'
    },
    'arabic_bac': {
      subjectId: 'arabic_bac',
      subjectNameAr: 'اللغة العربية والآداب',
      score: 3,
      maxScore: 4,
      percentage: 75,
      level: 'متوسط',
      weakAreas: ['قواعد البلاغة - الاستعارة والتشبيه المكنى'],
      recommendation: 'راجع درس علوم البلاغة وأساليب البيان لتثبيت قواعد التشبيه والاستعارة.',
      recommendedLessonId: 'arabic_bac_l1',
      completedAt: '2026-10-02'
    }
  },
  quranProgress: {
    currentSurah: 'سورة الكهف',
    surahNumber: 18,
    currentPage: 294,
    totalPages: 604,
    targetDailyPages: 2,
    isReadToday: false,
    streakDays: 9
  },
  weeklyStats: [
    { dayNameAr: 'الأحد', dateString: '2026-09-27', studyMinutes: 45, completedLessonsCount: 2 },
    { dayNameAr: 'الإثنين', dateString: '2026-09-28', studyMinutes: 60, completedLessonsCount: 3 },
    { dayNameAr: 'الثلاثاء', dateString: '2026-09-29', studyMinutes: 30, completedLessonsCount: 1 },
    { dayNameAr: 'الأربعاء', dateString: '2026-09-30', studyMinutes: 50, completedLessonsCount: 2 },
    { dayNameAr: 'الخميس', dateString: '2026-10-01', studyMinutes: 40, completedLessonsCount: 2 },
    { dayNameAr: 'الجمعة', dateString: '2026-10-02', studyMinutes: 25, completedLessonsCount: 1 },
    { dayNameAr: 'السبت', dateString: '2026-10-03', studyMinutes: 20, completedLessonsCount: 1, isToday: true },
  ]
};

export const DEMO_STUDENT_2: StudentProfile = {
  id: 'student-sarah',
  name: 'سارة القاضي',
  stage: 'preparatory',
  grade: 'second_prep',
  gradeAr: 'الصف الثاني الإعدادي',
  track: 'التعليم العام المعتمد',
  educationSystem: 'المنهاج الإعدادي المطور',
  subjects: ['arabic_prep', 'english_prep', 'math_prep', 'science_prep', 'social_prep'],
  skills: ['skill_english_talk', 'skill_critical_thinking'],
  xp: 420,
  level: 2,
  streakDays: 4,
  todayGoalMinutes: 25,
  completedMinutesToday: 15,
  todayGoalSubject: 'العلوم الطبيعية',
  currentLessonId: 'math_prep_l3',
  currentSkillId: 'skill_english_talk',
  completedLessonIds: ['math_prep_l1', 'math_prep_l2', 'science_prep_l1', 'arabic_prep_l1'],
  assessmentResults: {
    'math_prep': {
      subjectId: 'math_prep',
      subjectNameAr: 'الرياضيات',
      score: 2,
      maxScore: 4,
      percentage: 50,
      level: 'متوسط',
      weakAreas: ['المعادلات الخطية في متغير واحد'],
      recommendation: 'راجع درس حل المعادلات الخطية والتدرب على نقل الحدود المتشابهة.',
      recommendedLessonId: 'math_prep_l1',
      completedAt: '2026-10-02'
    }
  },
  quranProgress: {
    currentSurah: 'سورة مريم',
    surahNumber: 19,
    currentPage: 305,
    totalPages: 604,
    targetDailyPages: 2,
    isReadToday: true,
    streakDays: 14
  },
  weeklyStats: [
    { dayNameAr: 'الأحد', dateString: '2026-09-27', studyMinutes: 30, completedLessonsCount: 1 },
    { dayNameAr: 'الإثنين', dateString: '2026-09-28', studyMinutes: 40, completedLessonsCount: 2 },
    { dayNameAr: 'الثلاثاء', dateString: '2026-09-29', studyMinutes: 20, completedLessonsCount: 1 },
    { dayNameAr: 'الأربعاء', dateString: '2026-09-30', studyMinutes: 45, completedLessonsCount: 2 },
    { dayNameAr: 'الخميس', dateString: '2026-10-01', studyMinutes: 35, completedLessonsCount: 1 },
    { dayNameAr: 'الجمعة', dateString: '2026-10-02', studyMinutes: 15, completedLessonsCount: 0 },
    { dayNameAr: 'السبت', dateString: '2026-10-03', studyMinutes: 25, completedLessonsCount: 1, isToday: true },
  ]
};

export const ALL_SKILLS: SkillItem[] = [
  {
    id: 'skill_python',
    title: 'Python Programming',
    titleAr: 'برمجة بايثون التطبيقية',
    category: 'البرمجة والتقنية',
    level: 3,
    currentXP: 450,
    maxXP: 600,
    iconName: 'Code',
    color: 'emerald',
    description: 'تعلّم التفكير الحوسبي وكتابة الدوال والبرامج التفاعلية باستخدام بايثون الحديثة.',
    milestones: [
      { id: 'p1', title: 'المتغيرات وأنواع البيانات', levelRequired: 1, isUnlocked: true, xpValue: 100 },
      { id: 'p2', title: 'الشروط وحلقات التكرار (Loops)', levelRequired: 2, isUnlocked: true, xpValue: 150 },
      { id: 'p3', title: 'بناء الدوال ومكتبات بايثون', levelRequired: 3, isUnlocked: true, xpValue: 200 },
      { id: 'p4', title: 'هياكل البيانات والتعامل مع الملفات', levelRequired: 4, isUnlocked: false, xpValue: 250 },
      { id: 'p5', title: 'مقدمة في خوارزميات الذكاء الاصطناعي', levelRequired: 5, isUnlocked: false, xpValue: 300 }
    ]
  },
  {
    id: 'skill_web_dev',
    title: 'Web & Frontend Development',
    titleAr: 'تطوير الويب والواجهات (HTML/CSS & JS)',
    category: 'البرمجة والتقنية',
    level: 1,
    currentXP: 180,
    maxXP: 300,
    iconName: 'Layout',
    color: 'teal',
    description: 'بناء مواقع تفاعلية باستخدام تقنيات HTML5 و CSS الحديثة ومبادئ JavaScript.',
    milestones: [
      { id: 'w1', title: 'هيكلة صفحات الويب باستخدام HTML5', levelRequired: 1, isUnlocked: true, xpValue: 100 },
      { id: 'w2', title: 'تنسيق التصاميم والألوان عبر CSS3', levelRequired: 2, isUnlocked: false, xpValue: 150 },
      { id: 'w3', title: 'إضافة التفاعل البرمجي باستخدام JavaScript', levelRequired: 3, isUnlocked: false, xpValue: 200 }
    ]
  },
  {
    id: 'skill_english_talk',
    title: 'Conversational English',
    titleAr: 'التحدث باللغة الإنجليزية',
    category: 'اللغات العالمية',
    level: 2,
    currentXP: 220,
    maxXP: 400,
    iconName: 'Languages',
    color: 'sky',
    description: 'تطوير الطلاقة في المحادثة المدرسية واليومية مع نطق صحيح ومصطلحات معاصرة.',
    milestones: [
      { id: 'e1', title: 'التعريف بالنفس والاهتمامات اليومية', levelRequired: 1, isUnlocked: true, xpValue: 100 },
      { id: 'e2', title: 'طرح الأسئلة وطلب التوضيح في الفصل', levelRequired: 2, isUnlocked: true, xpValue: 150 },
      { id: 'e3', title: 'شرح الأفكار والمناقشات العلمية', levelRequired: 3, isUnlocked: false, xpValue: 200 },
      { id: 'e4', title: 'العروض التقديمية الأكاديمية (Presentations)', levelRequired: 4, isUnlocked: false, xpValue: 250 }
    ]
  },
  {
    id: 'skill_ai_prompt',
    title: 'AI & Prompt Engineering',
    titleAr: 'أساسيات الذكاء الاصطناعي وهندسة الأوامر',
    category: 'مهارات المستقبل',
    level: 1,
    currentXP: 90,
    maxXP: 200,
    iconName: 'Sparkles',
    color: 'amber',
    description: 'فهم كيف تفكر نماذج الذكاء الاصطناعي وكيف تصيغ أوامر دقيقة لحل المسائل المعقدة.',
    milestones: [
      { id: 'ai1', title: 'كيف تتعلّم نماذج اللغات الضخمة؟', levelRequired: 1, isUnlocked: true, xpValue: 100 },
      { id: 'ai2', title: 'هندسة الأوامر الذكية للسياق التعليمي', levelRequired: 2, isUnlocked: false, xpValue: 150 },
      { id: 'ai3', title: 'استخدام الذكاء الاصطناعي في البحث والمراجعة', levelRequired: 3, isUnlocked: false, xpValue: 200 }
    ]
  },
  {
    id: 'skill_critical_thinking',
    title: 'Problem Solving & Logic',
    titleAr: 'حل المشكلات والتفكير المنطقي',
    category: 'مهارات التفكير',
    level: 1,
    currentXP: 140,
    maxXP: 200,
    iconName: 'Brain',
    color: 'purple',
    description: 'تقنيات تفكيك المعضلات المركبة إلى خطوات قابلة للتحليل والحل.',
    milestones: [
      { id: 'c1', title: 'تحديد المعطيات والمجهول بدقة', levelRequired: 1, isUnlocked: true, xpValue: 100 },
      { id: 'c2', title: 'مخططات التدفق والتسلسل المنطقي', levelRequired: 2, isUnlocked: false, xpValue: 150 },
      { id: 'c3', title: 'التحقق من صحة الفرضيات والاستنتاج', levelRequired: 3, isUnlocked: false, xpValue: 200 }
    ]
  }
];

export const ALL_SUBJECTS: Subject[] = [
  // Baccalaureate Subjects (Student 1)
  {
    id: 'prog_ai',
    name: 'Programming & Artificial Intelligence',
    nameAr: 'البرمجة والذكاء الاصطناعي',
    iconName: 'Terminal',
    color: 'emerald',
    bgGradient: 'from-emerald-600 to-teal-700',
    gradeId: 'second_baccalaureate',
    trackId: 'مسار الهندسة وعلوم الحاسوب',
    units: [
      {
        id: 'u_prog_1',
        title: 'الوحدة 1: التفكير الخوارزمي وهياكل البيانات',
        order: 1,
        description: 'مبادئ التحليل المنطقي وهياكل البيانات الأساسية في لغة بايثون.',
        lessons: [
          {
            id: 'prog_ai_l1',
            subjectId: 'prog_ai',
            unitId: 'u_prog_1',
            title: '1. المتغيرات والعمليات المنطقية',
            order: 1,
            status: 'completed',
            xpReward: 50,
            estimatedMinutes: 15,
            content: {
              explanation: 'في البرمجة، المتغير هو حاوية في الذاكرة لتخزين قيمة معينة. في بايثون لا نحتاج لتحديد نوع المتغير مسبقاً، بل يتعرف المترجم على النوع تلقائياً.',
              summaryPoints: [
                'الرمز = يُستخدم للإسناد وليس للمساواة الرياضية.',
                'الأنواع الأساسية: أعداد صحيحة (int)، كسور (float)، نصوص (str)، وقيم منطقية (bool).',
                'المتغيرات تساعد في جعل الكود مرناً وقابلاً للقراءة والتعديل.'
              ],
              example: {
                title: 'مثال حساب متوسط درجات طالب',
                problem: 'لدينا درجتان 85 و 95، نريد تخزينهما وحساب المتوسط.',
                solutionSteps: [
                  'grade1 = 85',
                  'grade2 = 95',
                  'average = (grade1 + grade2) / 2',
                  'print("المتوسط هو:", average)  # الناتج سيكون 90.0'
                ],
                takeaway: 'استخدام الأقواس يضمن إجراء عملية الجمع قبل القسمة وفق أسبقية العمليات.'
              },
              practiceQuestions: [
                {
                  id: 'pr_p1',
                  prompt: 'ما هي نتيجة الكود التالي في بايثون؟\nx = 10\ny = 3\nprint(x % y)',
                  hint: 'العامل % يعني باقي القسمة (Modulo) وليس النسبة المئوية.',
                  stepByStepGuide: [
                    'اقسم 10 على 3، الناتج 3 والباقي 1.',
                    'العملية % تعيد باقي القسمة فقط.'
                  ],
                  options: ['3.33', '1', '3', '0'],
                  correctAnswerIndex: 1,
                  explanation: 'العامل % يعيد الباقي، 10 = (3 × 3) + 1، لذلك الناتج هو 1.'
                }
              ],
              quiz: [
                {
                  id: 'qz_p1',
                  question: 'أي من الأسماء التالية يعتبر اسم متغير غير صالح في بايثون؟',
                  options: ['student_score', '_total', '2nd_score', 'userAge'],
                  correctIndex: 2,
                  explanation: 'في بايثون لا يجوز أن يبدأ اسم المتغير برقم.'
                }
              ]
            }
          },
          {
            id: 'prog_ai_l2',
            subjectId: 'prog_ai',
            unitId: 'u_prog_1',
            title: '2. الجمل الشرطية والتحكم في التدفق (if/else)',
            order: 2,
            status: 'completed',
            xpReward: 60,
            estimatedMinutes: 20,
            content: {
              explanation: 'الجمل الشرطية تمكّن البرنامج من اتخاذ قرارات مختلفة بناءً على شروط منطقية تحقق صوابها (True) أو خطأها (False).',
              summaryPoints: [
                'نستخدم `if` لاختبار الشرط الأول.',
                'نستخدم `elif` لفحص شروط بديلة متتابعة.',
                'نستخدم `else` عندما لا يتحقق أي شرط سابق.'
              ],
              example: {
                title: 'تصنيف نتيجة الطالب',
                problem: 'كتابة شرط يحدد هل الطالب ناجح أم راسب بناءً على الحد الأدنى 50.',
                solutionSteps: [
                  'score = 72',
                  'if score >= 50:\n    print("ناجح")',
                  'else:\n    print("بحاجة لمراجعة")'
                ],
                takeaway: 'تأكد من ترك مسافة إزاحة 4 فراغات بعد النقطتين لتمييز كتلة الكود.'
              },
              practiceQuestions: [
                {
                  id: 'pr_p2',
                  prompt: 'ما الكلمة المفتاحية في بايثون لاختبار شرط ثانٍ بديل؟',
                  hint: 'هي اختصار لعبارة else if في لغات أخرى.',
                  stepByStepGuide: [
                    'في بايثون دمجت else و if في كلمة واحدة مكونة من 4 أحرف.'
                  ],
                  options: ['elseif', 'else if', 'elif', 'otherwise'],
                  correctAnswerIndex: 2,
                  explanation: 'كلمة elif هي الصيغة المعتمدة لاختبار شرط بديل في بايثون.'
                }
              ],
              quiz: [
                {
                  id: 'qz_p2',
                  question: 'ما هو الناتج عند تنفيذ: if not (5 > 3)?',
                  options: ['True', 'False', 'None', 'خطأ في الصيغة'],
                  correctIndex: 1,
                  explanation: 'الشرط (5 > 3) صحيح (True)، وعند تطبيق not عليه يصبح خاطئاً (False).'
                }
              ]
            }
          },
          {
            id: 'prog_ai_l3',
            subjectId: 'prog_ai',
            unitId: 'u_prog_1',
            title: '3. القوائم والمصفوفات في بايثون (Lists)',
            order: 3,
            status: 'completed',
            xpReward: 65,
            estimatedMinutes: 18,
            content: {
              explanation: 'القائمة (List) هي هيكل بيانات مرتب يسمح بتخزين عدة عناصر متجاورة، ويمكن تعديلها وإضافة عناصر جديدة إليها.',
              summaryPoints: [
                'نستخدم الأقواس المربعة `[]` لتعريف القائمة.',
                'الترتيب يبدأ من الصفر (Zero-based indexing).',
                'دالة `append()` تضيف عنصراً جديداً إلى نهاية القائمة.'
              ],
              example: {
                title: 'إدارة قائمة المهام اليومية',
                problem: 'إنشاء قائمة بالمواد وإضافة مادة جديدة ثم طباعة العنصر الأول.',
                solutionSteps: [
                  'subjects = ["رياضيات", "فيزياء"]',
                  'subjects.append("برمجة")',
                  'print(subjects[0])  # يطبع "رياضيات"'
                ],
                takeaway: 'العنصر الأول دائماً يحمل الفهرس [0] والعنصر الأخير يمكن الوصول إليه بـ [-1].'
              },
              practiceQuestions: [
                {
                  id: 'pr_p3',
                  prompt: 'لدينا: fruits = ["تفاح", "موز", "برتقال"]. ما هو fruits[-1]؟',
                  hint: 'الفهرس السالب يبدأ العد من نهاية القائمة.',
                  stepByStepGuide: ['[-1] يشير إلى العنصر الأخير مباشرة.'],
                  options: ['تفاح', 'موز', 'برتقال', 'خطأ'],
                  correctAnswerIndex: 2,
                  explanation: 'الفهرس -1 يمثل العنصر الأخير في القائمة وهو برتقال.'
                }
              ],
              quiz: [
                {
                  id: 'qz_p3',
                  question: 'كيف نحصل على عدد عناصر قائمة اسمها items؟',
                  options: ['items.count()', 'len(items)', 'items.size()', 'length(items)'],
                  correctIndex: 1,
                  explanation: 'الدالة المدمجة len() تحسب عدد العناصر في أي تسلسل.'
                }
              ]
            }
          },
          {
            id: 'prog_ai_l4',
            subjectId: 'prog_ai',
            unitId: 'u_prog_1',
            title: '4. بناء الدوال والخوارزميات (Functions)',
            order: 4,
            status: 'in_progress',
            xpReward: 80,
            estimatedMinutes: 25,
            content: {
              explanation: 'الدالة هي كتلة برمجية منظمة قابلة لإعادة الاستخدام تؤدي غرضاً محدداً. الدوال هي جوهر كتابة برامج نظيفة وتطبيق خوارزميات الذكاء الاصطناعي.',
              summaryPoints: [
                'تبدأ الدالة بالكلمة المفتاحية `def` متبوعة باسم الدالة وقوسين.',
                'يمكن تمرير معطيات (Parameters) للدالة.',
                'تستخدم الكلمة `return` لإرجاع نتيجة الحساب للمستدعي.'
              ],
              example: {
                title: 'دالة حساب مساحة المستطيل',
                problem: 'برمجة دالة تستقبل الطول والعرض وتعيد المساحة المحسوبة.',
                solutionSteps: [
                  'def calculate_area(length, width):',
                  '    area = length * width',
                  '    return area',
                  'result = calculate_area(5, 4)',
                  'print(result)  # الناتج 20'
                ],
                takeaway: 'فصل العمليات داخل دوال يسهل اختبار كل جزء بمفرده وتفادي تكرار الكود.'
              },
              practiceQuestions: [
                {
                  id: 'pr_p4',
                  prompt: 'ما الغرض الأساسي من استخدام الكلمة المفتاحية return داخل الدالة؟',
                  hint: 'هل هي للطباعة فقط أم لإعادة قيمة للمتغير المستدعي؟',
                  stepByStepGuide: [
                    'فكر في الفرق بين طباعة الشيء على الشاشة وإرجاعه ليُستخدم في حسابات لاحقة.'
                  ],
                  options: ['إنهاء البرنامج بالكامل', 'إرجاع قيمة ناتجة لاستخدامها', 'طباعة النص على الشاشة', 'إعادة تشغيل الدالة'],
                  correctAnswerIndex: 1,
                  explanation: 'تعيد return القيمة المحسوبة إلى المكان الذي استدعى الدالة.'
                }
              ],
              quiz: [
                {
                  id: 'qz_p4',
                  question: 'ماذا يحدث إذا لم نكتب عبارة return صريحة في نهاية دالة بايثون؟',
                  options: ['يحدث خطأ تجميعي', 'تعيد الدالة القيمة None', 'تعيد الدالة القيمة 0', 'تتكرر الدالة إلى ما لا نهاية'],
                  correctIndex: 1,
                  explanation: 'في بايثون، أي دالة لا تحتوي على return تعيد تلقائياً القيمة الخاصة None.'
                }
              ]
            }
          },
          {
            id: 'prog_ai_l5',
            subjectId: 'prog_ai',
            unitId: 'u_prog_1',
            title: '5. مدخل إلى نماذج الذكاء الاصطناعي والتعلم الآلي',
            order: 5,
            status: 'locked',
            xpReward: 100,
            estimatedMinutes: 30,
            content: {
              explanation: 'كيف يتعلم الحاسوب من البيانات؟ مقدمة مبسطة وممتعة حول تدريب النماذج وكيف تفهم البيانات الرقمية.',
              summaryPoints: [
                'الفرق بين البرمجة التقليدية (القواعد + البيانات = النتائج) والتعلم الآلي (البيانات + النتائج = القواعد).',
                'مراحل التعلم: جمع البيانات، التدريب، الاختبار، والتقييم.'
              ],
              example: {
                title: 'توقع درجات الطالب عبر الانحدار الخطي',
                problem: 'نموذج بسيط يتوقع الدرجة بناءً على ساعات المذاكرة.',
                solutionSteps: [
                  'جمع بيانات 100 طالب.',
                  'تدريب النموذج على إيجاد العلاقة بين الساعات والدرجات.',
                  'إعطاء النموذج 4 ساعات ليتوقع الدرجة بدقة تقريبية.'
                ],
                takeaway: 'جودة البيانات هي العامل الحاسم في دقة أي نظام ذكاء اصطناعي.'
              },
              practiceQuestions: [],
              quiz: []
            }
          }
        ]
      }
    ],
    diagnosticTest: {
      subjectId: 'prog_ai',
      subjectNameAr: 'البرمجة والذكاء الاصطناعي',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'dg_p1',
          question: 'ما هي الطريقة الصحيحة لتعريف دالة في بايثون؟',
          skillArea: 'بناء الدوال',
          options: ['function myFunc():', 'def my_func():', 'func my_func():', 'create myFunc():'],
          correctIndex: 1,
          explanation: 'الكلمة المفتاحية def هي المستخدمة في بايثون.'
        },
        {
          id: 'dg_p2',
          question: 'أي من هذه الهياكل غير قابل للتعديل (Immutable) بعد إنشائه؟',
          skillArea: 'هياكل البيانات',
          options: ['List (القائمة)', 'Tuple (الصف)', 'Dictionary (القاموس)', 'Set (المجموعة)'],
          correctIndex: 1,
          explanation: 'الصف (Tuple) غير قابل للتعديل بعد الإنشاء.'
        },
        {
          id: 'dg_p3',
          question: 'في التعلم الآلي الخاضع للإشراف (Supervised Learning)، ما الذي نقدمه للنموذج؟',
          skillArea: 'أساسيات الذكاء الاصطناعي',
          options: ['بيانات بدون تصنيفات', 'بيانات مع تصنيفاتها وإجاباتها الصحيحة', 'كود تشغيلي فقط', 'أسئلة عشوائية'],
          correctIndex: 1,
          explanation: 'التعلم الخاضع للإشراف يعتمد على بيانات مصنفة مسبقاً.'
        }
      ]
    }
  },
  {
    id: 'math_bac',
    name: 'Advanced Mathematics',
    nameAr: 'الرياضيات المتقدمة',
    iconName: 'Calculator',
    color: 'indigo',
    bgGradient: 'from-indigo-600 to-purple-800',
    gradeId: 'second_baccalaureate',
    trackId: 'مسار الهندسة وعلوم الحاسوب',
    units: [
      {
        id: 'u_math_1',
        title: 'الوحدة 1: النهايات والاتصال وحساب المشتقات',
        order: 1,
        description: 'دراسة سلوك الدوال عند الاقتراب من القيم الحرجة ومفهوم معدل التغير اللحظي.',
        lessons: [
          {
            id: 'math_bac_l1',
            subjectId: 'math_bac',
            unitId: 'u_math_1',
            title: '1. مفهوم المشتقة وقواعد الاشتقاق الأساسية',
            order: 1,
            status: 'completed',
            xpReward: 60,
            estimatedMinutes: 25,
            content: {
              explanation: 'المشتقة تمثل ميل مماس منحنى الدالة عند نقطة معينة، وتعبّر عن معدل التغير اللحظي للدالة بالنسبة لمتغيرها المستقل.',
              summaryPoints: [
                'مشتقة الدالة الثابتة f(x) = c هي دائماً صفر.',
                'قاعدة القوة: مشتقة x^n هي n · x^(n-1).',
                'مشتقة مجموع دالتين هي مجموع مشتقتيهما.'
              ],
              example: {
                title: 'اشتقاق دالة كثيرة حدود',
                problem: 'أوجد مشتقة الدالة: f(x) = 3x^3 - 5x + 7',
                solutionSteps: [
                  'مشتقة 3x^3 هي: 3 × 3x^(3-1) = 9x^2',
                  'مشتقة -5x هي: -5 × 1 = -5',
                  'مشتقة العدد الثابت 7 هي: 0',
                  'النتيجة النهائية: f\'(x) = 9x^2 - 5'
                ],
                takeaway: 'طبق قاعدة القوة على كل حد على حدة واحتفظ بالإشارات بدقة.'
              },
              practiceQuestions: [
                {
                  id: 'pr_m1',
                  prompt: 'ما هي مشتقة الدالة f(x) = 4x^2 + 6x؟',
                  hint: 'اضرب الأس في المعامل واطرح 1 من الأس.',
                  stepByStepGuide: [
                    'مشتقة 4x^2: 4 × 2 × x^1 = 8x',
                    'مشتقة 6x: 6'
                  ],
                  options: ['8x + 6', '4x + 6', '8x^2 + 6', '14x'],
                  correctAnswerIndex: 0,
                  explanation: 'بتطبيق قاعدة القوة: مشتقة 4x^2 هي 8x ومشتقة 6x هي 6، فالناتج 8x + 6.'
                }
              ],
              quiz: [
                {
                  id: 'qz_m1',
                  question: 'ما هي مشتقة الدالة الثابتة f(x) = 15؟',
                  options: ['15', '1', '0', '15x'],
                  correctIndex: 2,
                  explanation: 'ميل الدالة الثابتة أفقي تماماً ومعدل تغيرها صفر، لذا مشتقتها دائماً 0.'
                }
              ]
            }
          },
          {
            id: 'math_bac_l2',
            subjectId: 'math_bac',
            unitId: 'u_math_1',
            title: '2. تطبيقات المشتقة: القيم العظمى والصغرى',
            order: 2,
            status: 'in_progress',
            xpReward: 70,
            estimatedMinutes: 20,
            content: {
              explanation: 'نستخدم المشتقة لتحديد النقاط الحرجة التي تتغير عندها الدالة من التزايد إلى التناقص أو العكس، مما يمكننا من إيجاد القيم القصوى.',
              summaryPoints: [
                'النقطة الحرجة تحدث عندما f\'(x) = 0 أو تكون غير معرفة.',
                'إذا تغيرت إشارة المشتقة من موجب إلى سالب فإن النقطة عظمى محلية.',
                'تُستخدم هذه الطريقة في تحسين الكفاءة الهندسية وتخفيض التكاليف.'
              ],
              example: {
                title: 'إيجاد النقطة الحرجة',
                problem: 'أوجد النقطة الحرجة للدالة f(x) = x^2 - 6x + 5',
                solutionSteps: [
                  'نشتق الدالة: f\'(x) = 2x - 6',
                  'نساوي المشتقة بالصفر: 2x - 6 = 0',
                  'إذن 2x = 6 ومنها x = 3',
                  'نعوض في الدالة الأصلية لإيجاد y: f(3) = 9 - 18 + 5 = -4'
                ],
                takeaway: 'النقطة الحرجة هي (3, -4) وهي تمثل قيمة صغرى محلية لأن معامل x^2 موجب.'
              },
              practiceQuestions: [
                {
                  id: 'pr_m2',
                  prompt: 'متى تكون النقطة (c, f(c)) قيمة عظمى محلية للدالة القابلة للاشتقاق؟',
                  hint: 'تذكر كيف يتغير ميل المماس قبل القمة وبعدها.',
                  stepByStepGuide: ['الدالة تتزايد أولاً (ميل موجب) ثم تتناقص بعد القمة (ميل سالب).'],
                  options: ['عندما تتغير إشارة f\' من موجب إلى سالب', 'عندما تتغير إشارة f\' من سالب إلى موجب', 'عندما تكون f\' دائماً موجبة', 'عندما تكون f\' غير متصلة'],
                  correctAnswerIndex: 0,
                  explanation: 'تغير الميل من صعود (موجب) إلى هبوط (سالب) يدل على وجود قمة (قيمة عظمى).'
                }
              ],
              quiz: [
                {
                  id: 'qz_m2',
                  question: 'أين تكون الدالة f(x) = 2x - 8 متزايدة؟',
                  options: ['فقط عندما x > 4', 'على جميع الأعداد الحقيقية R', 'فقط عندما x < 4', 'الدالة غير متزايدة أبداً'],
                  correctIndex: 1,
                  explanation: 'مشتقة الدالة هي f\'(x) = 2، وهي قيمة موجبة دائماً لكل x، إذن الدالة متزايدة على R.'
                }
              ]
            }
          }
        ]
      }
    ],
    diagnosticTest: {
      subjectId: 'math_bac',
      subjectNameAr: 'الرياضيات المتقدمة',
      estimatedMinutes: 6,
      questions: [
        {
          id: 'dg_m1',
          question: 'ما هي نهاية الدالة (x^2 - 4) / (x - 2) عندما تقترب x من 2؟',
          skillArea: 'حساب النهايات',
          options: ['0', '2', '4', 'غير معرفة'],
          correctIndex: 2,
          explanation: 'بتحليل البسط إلى (x-2)(x+2) واختصار (x-2)، يتبقى x+2 = 2+2 = 4.'
        },
        {
          id: 'dg_m2',
          question: 'ما هي مشتقة حاصل ضرب دالتين u(x) · v(x)؟',
          skillArea: 'قواعد الاشتقاق',
          options: ['u\' · v\'', 'u\'v + uv\'', 'u\'v - uv\'', '(uv)\' / 2'],
          correctIndex: 1,
          explanation: 'قاعدة الضرب: مشتقة الأول في الثاني + الأول في مشتقة الثاني.'
        },
        {
          id: 'dg_m3',
          question: 'إذا كان f\'(x) = 0 وكانت المشتقة الثانية f\'\'(x) < 0، ماذا نستنتج؟',
          skillArea: 'القيم القصوى والتحدب',
          options: ['قيمة صغرى محلية', 'قيمة عظمى محلية', 'نقطة انقلاب مؤكدة', 'الدالة خط مستقيم'],
          correctIndex: 1,
          explanation: 'المشتقة الثانية السالبة تدل على تقوس لأسفل، وبالتالي النقطة تمثل قيمة عظمى.'
        }
      ]
    }
  },
  {
    id: 'arabic_bac',
    name: 'Arabic Language & Literature',
    nameAr: 'اللغة العربية والآداب',
    iconName: 'BookOpen',
    color: 'amber',
    bgGradient: 'from-amber-600 to-orange-800',
    gradeId: 'second_baccalaureate',
    trackId: 'مسار الهندسة وعلوم الحاسوب',
    units: [
      {
        id: 'u_ar_1',
        title: 'الوحدة 1: علوم البلاغة وأساليب البيان',
        order: 1,
        description: 'التشبيه والاستعارة والكناية وجماليات التعبير العربي الفصيح.',
        lessons: [
          {
            id: 'arabic_bac_l1',
            subjectId: 'arabic_bac',
            unitId: 'u_ar_1',
            title: '1. التشبيه وأركانه وأقسامه البلاغية',
            order: 1,
            status: 'completed',
            xpReward: 50,
            estimatedMinutes: 15,
            content: {
              explanation: 'التشبيه هو عقد مماثلة بين أمرين في صفة أو أكثر بواسطة أداة تشبيه ملفوظة أو ملحوظة لغرض بلاغي.',
              summaryPoints: [
                'أركان التشبيه أربعة: المشبه، المشبه به، أداة التشبيه، ووجه الشبه.',
                'طرفا التشبيه الأساسيان هما المشبه والمشبه به ولا يجوز حذفهما معاً.',
                'التشبيه البليغ هو ما حُذفت منه الأداة ووجه الشبه معاً.'
              ],
              example: {
                title: 'تحليل جملة بليغة',
                problem: 'حدد نوع التشبيه في قول الشاعر: "العلمُ نورٌ يضيءُ دروبَ الحياة"',
                solutionSteps: [
                  'المشبه: العلم',
                  'المشبه به: النور',
                  'الأداة: محذوفة',
                  'وجه الشبه: الهداية وإزالة الظلمة'
                ],
                takeaway: 'إذا حُذفت الأداة ووجه الشبه سُمي تشبيهاً بليغاً وهو أرفع درجات التشبيه قوةً.'
              },
              practiceQuestions: [
                {
                  id: 'pr_a1',
                  prompt: 'ما نوع التشبيه في عبارة: "الجنديُّ أسدٌ في الشجاعة"؟',
                  hint: 'لاحظ وجود وجه الشبه (في الشجاعة) مع غياب أداة التشبيه مثل الكاف أو مثل.',
                  stepByStepGuide: ['حذف الأداة وذكر وجه الشبه يسمى التشبيه المؤكد المفصّل.'],
                  options: ['تشبيه بليغ', 'تشبيه مؤكد', 'تشبيه مجمل', 'استعارة تصريحية'],
                  correctAnswerIndex: 1,
                  explanation: 'حذفت أداة التشبيه فصار مؤكداً، وذكر وجه الشبه فصار مفصلاً.'
                }
              ],
              quiz: [
                {
                  id: 'qz_a1',
                  question: 'أي من العناصر الآتية يمثل ركناً لا يمكن الاستغناء عنه في التشبيه أبداً؟',
                  options: ['أداة التشبيه', 'وجه الشبه', 'المشبه به', 'المحسن البديعي'],
                  correctIndex: 2,
                  explanation: 'المشبه والمشبه به هما ركنا التشبيه اللذان لا يقوم التشبيه إلا بهما.'
                }
              ]
            }
          }
        ]
      }
    ],
    diagnosticTest: {
      subjectId: 'arabic_bac',
      subjectNameAr: 'اللغة العربية والآداب',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'dg_a1',
          question: 'ما هو إعراب كلمة "سريعاً" في جملة: انطلق القطار سريعاً؟',
          skillArea: 'الإعراب والنحو',
          options: ['مفعول به منصوب', 'حال منصوبة', 'تمييز منصوب', 'نعت مجرور'],
          correctIndex: 1,
          explanation: 'تبين هيئة القطار وقت الانطلاق وتصح جواباً لـ (كيف)، فهي حال.'
        },
        {
          id: 'dg_a2',
          question: 'ما الفرق البلاغي بين التشبيه والاستعارة؟',
          skillArea: 'علوم البلاغة',
          options: ['الاستعارة تشبيه حذف أحد طرفيه', 'لا يوجد فرق بينهما', 'التشبيه يكون نثراً فقط', 'الاستعارة لا تحتوي على خيال'],
          correctIndex: 0,
          explanation: 'الاستعارة في جوهرها تشبيه بليغ حُذف أحد طرفيه (المشبه أو المشبه به).'
        }
      ]
    }
  },
  {
    id: 'english_bac',
    name: 'English Language',
    nameAr: 'اللغة الإنجليزية',
    iconName: 'Globe',
    color: 'sky',
    bgGradient: 'from-sky-600 to-blue-800',
    gradeId: 'second_baccalaureate',
    trackId: 'مسار الهندسة وعلوم الحاسوب',
    units: [
      {
        id: 'u_en_1',
        title: 'Unit 1: Technology & Academic Writing',
        order: 1,
        description: 'Advanced sentence structures, passive voice, and technological vocabulary.',
        lessons: [
          {
            id: 'english_bac_l1',
            subjectId: 'english_bac',
            unitId: 'u_en_1',
            title: '1. The Passive Voice in Scientific Reports',
            order: 1,
            status: 'completed',
            xpReward: 50,
            estimatedMinutes: 18,
            content: {
              explanation: 'In scientific and academic English, the passive voice is frequently used to emphasize the action or the result rather than the person performing it.',
              summaryPoints: [
                'Form: Subject + Verb to be + Past Participle (V3).',
                'Use when the agent is unknown, obvious, or less important than the experiment result.'
              ],
              example: {
                title: 'Converting Active to Passive',
                problem: 'Convert: "Scientists discovered a new algorithm."',
                solutionSteps: [
                  'Identify object: "a new algorithm"',
                  'Determine tense: Past Simple -> was/were discovered',
                  'Passive: "A new algorithm was discovered by scientists."'
                ],
                takeaway: 'Focus shifts from the scientists to the new algorithm itself.'
              },
              practiceQuestions: [
                {
                  id: 'pr_e1',
                  prompt: 'Choose the correct passive form: "Engineers build computers."',
                  hint: 'Computers is plural, and the tense is present simple.',
                  stepByStepGuide: ['Use "are" + past participle of build.'],
                  options: ['Computers are built by engineers.', 'Computers were built by engineers.', 'Computers is built by engineers.', 'Computers build are.'],
                  correctAnswerIndex: 0,
                  explanation: 'Present simple passive with plural subject requires "are" + "built".'
                }
              ],
              quiz: [
                {
                  id: 'qz_e1',
                  question: 'Which sentence is in the passive voice?',
                  options: ['The machine was tested yesterday.', 'The student solved the equation.', 'We are reading the new book.', 'She speaks three languages.'],
                  correctIndex: 0,
                  explanation: '"was tested" is the passive form (be + past participle).'
                }
              ]
            }
          }
        ]
      }
    ],
    diagnosticTest: {
      subjectId: 'english_bac',
      subjectNameAr: 'اللغة الإنجليزية',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'dg_e1',
          question: 'If she _______ harder, she would pass the exam with high honors.',
          skillArea: 'Conditional Sentences',
          options: ['studies', 'studied', 'had studied', 'will study'],
          correctIndex: 1,
          explanation: 'Second conditional uses past simple in the if-clause and would + base verb in the main clause.'
        },
        {
          id: 'dg_e2',
          question: 'Select the synonym of "essential":',
          skillArea: 'Academic Vocabulary',
          options: ['optional', 'crucial', 'minor', 'temporary'],
          correctIndex: 1,
          explanation: '"crucial" is a direct synonym for essential (ضروري وحاسم).'
        }
      ]
    }
  },
  {
    id: 'history_bac',
    name: 'Contemporary History',
    nameAr: 'التاريخ المعاصر',
    iconName: 'Landmark',
    color: 'rose',
    bgGradient: 'from-rose-600 to-pink-800',
    gradeId: 'second_baccalaureate',
    trackId: 'مسار الهندسة وعلوم الحاسوب',
    units: [
      {
        id: 'u_hist_1',
        title: 'الوحدة 1: العالم غداة الحرب العالمية الثانية والتحولات الكبرى',
        order: 1,
        description: 'النظام الدولي الجديد وتأسيس المنظمات العالمية ومرحلة الحرب الباردة.',
        lessons: [
          {
            id: 'history_bac_l1',
            subjectId: 'history_bac',
            unitId: 'u_hist_1',
            title: '1. تأسيس هيئة الأمم المتحدة وإعادة تنظيم العلاقات الدولية',
            order: 1,
            status: 'in_progress',
            xpReward: 45,
            estimatedMinutes: 15,
            content: {
              explanation: 'بعد انتهاء الحرب العالمية الثانية عام 1945، اجتمعت الدول لتأسيس منظمة دولية تضمن الأمن والسلام العالمي وتمنع تكرار المآسي الإنسانية.',
              summaryPoints: [
                'تم التوقيع على ميثاق الأمم المتحدة في مؤتمر سان فرانسيسكو 1945.',
                'يتكون مجلس الأمن من خمس دول دائمة العضوية تتمتع بحق النقض (الفيتو).',
                'الأهداف الأساسية: حفظ السلم والأمن الدوليين وتنمية التعاون الاقتصادي والاجتماعي.'
              ],
              example: {
                title: 'تحليل قرارات مجلس الأمن',
                problem: 'لماذا اعتُبر حق الفيتو سلاحاً فعالاً للدول الكبرى؟',
                solutionSteps: [
                  'يكفي اعتراض دولة واحدة دائمة العضوية لإلغاء أي قرار ذي طابع تنفيذي.',
                  'عكس الفيتو ميزان القوى العالمي عقب عام 1945.'
                ],
                takeaway: 'فهم ميثاق الأمم المتحدة يساعد في تفسير الصراعات الجيوسياسية المعاصرة.'
              },
              practiceQuestions: [
                {
                  id: 'pr_h1',
                  prompt: 'في أي مدينة تم التوقيع على ميثاق تأسيس هيئة الأمم المتحدة عام 1945؟',
                  hint: 'مدينة أمريكية ساحلية شهيرة على المحيط الهادئ.',
                  stepByStepGuide: ['مؤتمر سان فرانسيسكو حسم إقرار الميثاق.'],
                  options: ['نيويورك', 'سان فرانسيسكو', 'لندن', 'جنيف'],
                  correctAnswerIndex: 1,
                  explanation: 'عُقد المؤتمر التأسيسي في مدينة سان فرانسيسكو.'
                }
              ],
              quiz: [
                {
                  id: 'qz_h1',
                  question: 'كم عدد الدول دائمة العضوية في مجلس الأمن الدولي؟',
                  options: ['3', '5', '10', '15'],
                  correctIndex: 1,
                  explanation: 'مجلس الأمن يضم خمس دول دائمة العضوية (الولايات المتحدة، روسيا، الصين، بريطانيا، فرنسا).'
                }
              ]
            }
          }
        ]
      }
    ],
    diagnosticTest: {
      subjectId: 'history_bac',
      subjectNameAr: 'التاريخ المعاصر',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'dg_h1',
          question: 'ما هو التاريخ الذي انتهت فيه الحرب العالمية الثانية رسمياً؟',
          skillArea: 'التواريخ المفصلية',
          options: ['1918', '1939', '1945', '1955'],
          correctIndex: 2,
          explanation: 'انتهت الحرب العالمية الثانية عام 1945.'
        }
      ]
    }
  },

  // Preparatory Subjects (Student 2)
  {
    id: 'math_prep',
    name: 'Mathematics (Preparatory)',
    nameAr: 'الرياضيات',
    iconName: 'Calculator',
    color: 'indigo',
    bgGradient: 'from-blue-600 to-indigo-800',
    gradeId: 'second_prep',
    units: [
      {
        id: 'u_mprep_1',
        title: 'الوحدة 1: الأعداد الحقيقية والعمليات الجبرية',
        order: 1,
        description: 'الجذور التكعيبية، حل المعادلات الخطية، والمتباينات في متغير واحد.',
        lessons: [
          {
            id: 'math_prep_l1',
            subjectId: 'math_prep',
            unitId: 'u_mprep_1',
            title: '1. الجذر التكعيبي للعدد النسبي',
            order: 1,
            status: 'completed',
            xpReward: 40,
            estimatedMinutes: 15,
            content: {
              explanation: 'الجذر التكعيبي للعدد (أ) هو العدد الذي إذا ضُرب في نفسه ثلاث مرات كان الناتج مساوياً (أ). يرمز له بالرمز ∛.',
              summaryPoints: [
                'الجذر التكعيبي للعدد الموجب موجب، وللعدد السالب سالب.',
                '∛27 = 3 لأن 3 × 3 × 3 = 27.',
                '∛-8 = -2 لأن (-2) × (-2) × (-2) = -8.'
              ],
              example: {
                title: 'حساب الجذر التكعيبي',
                problem: 'احسب قيمة: ∛64 + ∛-125',
                solutionSteps: [
                  '∛64 = 4 لأن 4 × 4 × 4 = 64',
                  '∛-125 = -5 لأن (-5) × (-5) × (-5) = -125',
                  'المجموع: 4 + (-5) = -1'
                ],
                takeaway: 'انتبه لإشارة السالب تحت الجذر التكعيبي فهي تخرج مع الناتج مباشرة.'
              },
              practiceQuestions: [
                {
                  id: 'pr_mp1',
                  prompt: 'ما هي قيمة ∛125؟',
                  hint: 'ما هو العدد الذي إذا ضربته في نفسه 3 مرات ينتج 125؟',
                  stepByStepGuide: ['5 × 5 = 25، ثم 25 × 5 = 125.'],
                  options: ['25', '15', '5', '3'],
                  correctAnswerIndex: 2,
                  explanation: '5 تكعيب = 125، إذن الجذر التكعيبي هو 5.'
                }
              ],
              quiz: [
                {
                  id: 'qz_mp1',
                  question: 'ما قيمة ∛(-64)؟',
                  options: ['8', '-8', '4', '-4'],
                  correctIndex: 3,
                  explanation: '(-4) × (-4) × (-4) = -64.'
                }
              ]
            }
          },
          {
            id: 'math_prep_l2',
            subjectId: 'math_prep',
            unitId: 'u_mprep_1',
            title: '2. مجموعة الأعداد غير النسبية (نَ)',
            order: 2,
            status: 'completed',
            xpReward: 45,
            estimatedMinutes: 15,
            content: {
              explanation: 'العدد غير النسبي هو العدد الذي لا يمكن كتابته على صورة بسط ومقام (أ/ب) حيث أ، ب عددان صحيحان وب لا يساوي الصفر. أشهرها الجذور التربيعية والتكعيبية لأعداد ليست مربعات أو مكعبات كاملة مثل √2 و ∛5 والنسبة التقريبية π.',
              summaryPoints: [
                'اتحاد الأعداد النسبية وغير النسبية يُكون مجموعة الأعداد الحقيقية (ح).',
                'الجذر التربيعي لـ 5 هو عدد غير نسبي يقع بين 2 و 3.'
              ],
              example: {
                title: 'تحديد نوع العدد',
                problem: 'هل العدد √7 عدد نسبي أم غير نسبي؟',
                solutionSteps: [
                  'العدد 7 ليس مربعاً كاملاً لأي عدد صحيح.',
                  'إذن √7 هو عدد عشري غير منتهٍ وغير دوري.',
                  'الاستنتاج: √7 ينتمي لمجموعة الأعداد غير النسبية (نَ).'
                ],
                takeaway: 'الجذور التربيعية للأعداد الأولية دائماً غير نسبية.'
              },
              practiceQuestions: [
                {
                  id: 'pr_mp2',
                  prompt: 'أي من الأعداد التالية يعتبر عدداً غير نسبي؟',
                  hint: 'ابحث عن الجذر الذي لا ينتج عدداً صحيحاً دقيقاً.',
                  stepByStepGuide: ['√9 = 3 (نسبي)، أما √10 فليس له جذر صحيح.'],
                  options: ['3/4', '0.5', '√9', '√3'],
                  correctAnswerIndex: 3,
                  explanation: '√3 عدد غير نسبي لأن 3 ليست مربعاً كاملاً.'
                }
              ],
              quiz: [
                {
                  id: 'qz_mp2',
                  question: 'مجموعة الأعداد الحقيقية ح هي اتحاد:',
                  options: ['ن ∪ نَ', 'ص ∪ ط', 'ط ∪ ع', 'ن ∩ نَ'],
                  correctIndex: 0,
                  explanation: 'ح = ن ∪ نَ (النسبية وغير النسبية).'
                }
              ]
            }
          },
          {
            id: 'math_prep_l3',
            subjectId: 'math_prep',
            unitId: 'u_mprep_1',
            title: '3. حل المعادلات الخطية في متغير واحد',
            order: 3,
            status: 'in_progress',
            xpReward: 55,
            estimatedMinutes: 20,
            content: {
              explanation: 'حل المعادلة يعني إيجاد القيمة العددية للمتغير (المجهول س) التي تجعل طرفي المعادلة متساويين تماماً.',
              summaryPoints: [
                'قاعدة النقل: عند نقل حد من طرف إلى طرف نعكس إشارته.',
                'للتخلص من معامل س، نقسم طرفي المعادلة على ذلك المعامل.',
                'التحقق: نعوض بالقيمة الناتجة في المعادلة للتأكد من صحة الحل.'
              ],
              example: {
                title: 'حل معادلة خطية',
                problem: 'أوجد مجموعة حل المعادلة: 3س + 5 = 17 في ح',
                solutionSteps: [
                  'ننقل العدد +5 إلى الطرف الآخر بعكس الإشارة: 3س = 17 - 5',
                  'نحسب الناتج: 3س = 12',
                  'نقسم طرفي المعادلة على معامل س (3): س = 12 / 3',
                  'س = 4',
                  'مجموعة الحل = {4}'
                ],
                takeaway: 'المعادلة كالميزان، ما تفعله في اليمين اعمله في اليسار لتبقى متزنة.'
              },
              practiceQuestions: [
                {
                  id: 'pr_mp3',
                  prompt: 'حل المعادلة: 2س - 4 = 10',
                  hint: 'انقل -4 أولاً إلى الطرف الأيسر ليصبح +4.',
                  stepByStepGuide: [
                    '2س = 10 + 4 = 14',
                    'س = 14 / 2 = 7'
                  ],
                  options: ['س = 3', 'س = 7', 'س = 14', 'س = 6'],
                  correctAnswerIndex: 1,
                  explanation: '2س = 14 إذن س = 7.'
                }
              ],
              quiz: [
                {
                  id: 'qz_mp3',
                  question: 'إذا كان 5س = 20، فإن س + 2 = ؟',
                  options: ['4', '6', '10', '22'],
                  correctIndex: 1,
                  explanation: 'س = 20 / 5 = 4، إذن س + 2 = 4 + 2 = 6.'
                }
              ]
            }
          }
        ]
      }
    ],
    diagnosticTest: {
      subjectId: 'math_prep',
      subjectNameAr: 'الرياضيات',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'dg_mp_1',
          question: 'ما هي قيمة ∛27؟',
          skillArea: 'الجذور التكعيبية',
          options: ['9', '3', '6', '27'],
          correctIndex: 1,
          explanation: '3 × 3 × 3 = 27.'
        },
        {
          id: 'dg_mp_2',
          question: 'حل المعادلة 2س + 1 = 9 في مجموعة الأعداد الصحيحة:',
          skillArea: 'المعادلات الخطية في متغير واحد',
          options: ['س = 4', 'س = 5', 'س = 8', 'س = 10'],
          correctIndex: 0,
          explanation: '2س = 8 إذن س = 4.'
        },
        {
          id: 'dg_mp_3',
          question: 'أي من الأعداد التالية ينتمي إلى مجموعة الأعداد غير النسبية؟',
          skillArea: 'الأعداد الحقيقية',
          options: ['0.25', '√16', '√5', '2/3'],
          correctIndex: 2,
          explanation: '√5 غير نسبي لأنه لا ينتج عدداً صحيحاً أو كسراً دورياً.'
        }
      ]
    }
  },
  {
    id: 'science_prep',
    name: 'General Science',
    nameAr: 'العلوم الطبيعية',
    iconName: 'FlaskConical',
    color: 'teal',
    bgGradient: 'from-teal-600 to-emerald-800',
    gradeId: 'second_prep',
    units: [
      {
        id: 'u_sc_1',
        title: 'الوحدة 1: دورية العناصر وخواصها والجدول الدوري الحديث',
        order: 1,
        description: 'تصنيف مندليف وموزلي والجدول الدوري الحديث وتدرج الخواص الكيميائية.',
        lessons: [
          {
            id: 'science_prep_l1',
            subjectId: 'science_prep',
            unitId: 'u_sc_1',
            title: '1. محاولات تصنيف العناصر والجدول الدوري',
            order: 1,
            status: 'completed',
            xpReward: 45,
            estimatedMinutes: 15,
            content: {
              explanation: 'تعددت محاولات العلماء لتصنيف العناصر الكيميائية بهدف تسهيل دراستها وإيجاد العلاقة بين العناصر وخواصها الفيزيائية والكيميائية.',
              summaryPoints: [
                'جدول مندليف: رتب العناصر تصاعدياً حسب أوزانها الذرية.',
                'جدول موزلي: رتب العناصر تصاعدياً حسب أعدادها الذرية بناءً على دراسة الأشعة السينية.',
                'الجدول الدوري الحديث: رُتبت العناصر حسب العدد الذري وطريقة ملء مستويات الطاقة الفرعية بالإلكترونات.'
              ],
              example: {
                title: 'تحديد موقع العنصر بالجدول',
                problem: 'حدد رقم الدورة والمجموعة لعنصر الصوديوم Na (عدده الذري 11).',
                solutionSteps: [
                  'التوزيع الإلكتروني: K=2, L=8, M=1',
                  'عدد مستويات الطاقة المشغولة = 3، إذن العنصر يقع في الدورة الثالثة.',
                  'عدد إلكترونات مستوى الطاقة الأخير = 1، إذن العنصر يقع في المجموعة 1A.'
                ],
                takeaway: 'رقم الدورة = عدد مستويات الطاقة، ورقم المجموعة = عدد إلكترونات المستوى الخارجي.'
              },
              practiceQuestions: [
                {
                  id: 'pr_sc1',
                  prompt: 'عنصر توزيعه الإلكتروني 2, 8, 2. ما هو رقم دورته ومجموعته؟',
                  hint: 'احسب عدد مستويات الطاقة أولاً، ثم انظر لآخر رقم.',
                  stepByStepGuide: [
                    'المستويات: 3 مستويات -> الدورة الثالثة.',
                    'الإلكترونات في المستوى الأخير: 2 -> المجموعة 2A.'
                  ],
                  options: ['الدورة 3، المجموعة 2A', 'الدورة 2، المجموعة 3A', 'الدورة 1، المجموعة 8A', 'الدورة 4، المجموعة 2A'],
                  correctAnswerIndex: 0,
                  explanation: '3 مستويات تعني الدورة 3، والعدد 2 في الغلاف الأخير يعني المجموعة 2A (المغنيسيوم).'
                }
              ],
              quiz: [
                {
                  id: 'qz_sc1',
                  question: 'رتب العالم موزلي العناصر في جدوله تصاعدياً حسب:',
                  options: ['أوزانها الذرية', 'أعدادها الذرية', 'كثافتها', 'درجة انصهارها'],
                  correctIndex: 1,
                  explanation: 'رتب موزلي العناصر حسب أعدادها الذرية.'
                }
              ]
            }
          }
        ]
      }
    ],
    diagnosticTest: {
      subjectId: 'science_prep',
      subjectNameAr: 'العلوم الطبيعية',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'dg_sc_1',
          question: 'كم عدد إلكترونات المستوى الأخير في الغازات الخاملة (عدا الهيليوم)؟',
          skillArea: 'التركيب الذري',
          options: ['2', '4', '6', '8'],
          correctIndex: 3,
          explanation: 'مستواها الأخير مكتمل بـ 8 إلكترونات.'
        },
        {
          id: 'dg_sc_2',
          question: 'أي من الغازات التالية يُعتبر من غازات الدفيئة المسؤولة عن ظاهرة الاحتباس الحراري؟',
          skillArea: 'الغلاف الجوي والبيئة',
          options: ['الأكسجين', 'النيتروجين', 'ثاني أكسيد الكربون', 'الهيليوم'],
          correctIndex: 2,
          explanation: 'ثاني أكسيد الكربون (CO2) هو أشهر غازات الاحتباس الحراري.'
        }
      ]
    }
  },
  {
    id: 'arabic_prep',
    name: 'Arabic Language (Prep)',
    nameAr: 'اللغة العربية',
    iconName: 'BookOpen',
    color: 'amber',
    bgGradient: 'from-amber-600 to-orange-800',
    gradeId: 'second_prep',
    units: [
      {
        id: 'u_arprep_1',
        title: 'الوحدة 1: قواعد النحو والإعراب',
        order: 1,
        description: 'الإعراب والبناء، المعرب والمبني من الأسماء والأفعال.',
        lessons: [
          {
            id: 'arabic_prep_l1',
            subjectId: 'arabic_prep',
            unitId: 'u_arprep_1',
            title: '1. المعرب والمبني من الأسماء',
            order: 1,
            status: 'completed',
            xpReward: 40,
            estimatedMinutes: 15,
            content: {
              explanation: 'الاسم المعرب هو ما يتغير تشكيل آخره بتغير موقعه في الجملة (رفعاً ونصباً وجراً). أما المبني فهو ما يثبت آخره على حركة واحدة لا تتغير مهما اختلف موقعه الإعرابي.',
              summaryPoints: [
                'الأصل في الأسماء الإعراب، ما عدا فئات محددة تكون مبنية.',
                'الأسماء المبنية تشمل: الضمائر، أسماء الإشارة (عدا المثنى)، الأسماء الموصولة (عدا المثنى)، وأسماء الاستفهام والشرط.'
              ],
              example: {
                title: 'مقارنة بين اسم معرب واسم مبني',
                problem: 'تأمل كلمة "الطالبُ" مقابل اسم الإشارة "هذا".',
                solutionSteps: [
                  'جاء الطالبُ (مرفوع بالضمة) / رأيتُ الطالبَ (منصوب بالفتحة) -> معرب',
                  'جاء هذا / رأيتُ هذا -> كلمة "هذا" ثبتت على السكون في الحالتين -> مبني'
                ],
                takeaway: 'الاسم المبني يعرب دائماً في محل (رفع أو نصب أو جر) ولا تظهر عليه الحركات الإعرابية الأصلية.'
              },
              practiceQuestions: [
                {
                  id: 'pr_ap1',
                  prompt: 'أي من أسماء الإشارة التالية يُعتبر معرباً ويعامل معاملة المثنى؟',
                  hint: 'ابحث عن الاسم الدال على اثنين.',
                  stepByStepGuide: ['هذان وهاتان يعربان إعراب المثنى بالألف رفعاً وبالياء نصباً وجراً.'],
                  options: ['هذا', 'هذه', 'هذان', 'هؤلاء'],
                  correctAnswerIndex: 2,
                  explanation: 'هذان وهاتان معربان بالألف رفعاً والياء نصباً وجراً.'
                }
              ],
              quiz: [
                {
                  id: 'qz_ap1',
                  question: 'جميع الضمائر المنفصلة والمتصلة في اللغة العربية تعتبر أسماء:',
                  options: ['معربة دائماً', 'مبنية دائماً', 'ممنوعة من الصرف', 'حروف وليست أسماء'],
                  correctIndex: 1,
                  explanation: 'الضمائر كلها مبنية في محل رفع أو نصب أو جر.'
                }
              ]
            }
          }
        ]
      }
    ],
    diagnosticTest: {
      subjectId: 'arabic_prep',
      subjectNameAr: 'اللغة العربية',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'dg_ap_1',
          question: 'أي من الكلمات التالية اسم مبني؟',
          skillArea: 'الإعراب والبناء',
          options: ['المدرسة', 'كتاب', 'هؤلاء', 'قلم'],
          correctIndex: 2,
          explanation: '"هؤلاء" اسم إشارة مبني على الكسر.'
        }
      ]
    }
  },
  {
    id: 'english_prep',
    name: 'English (Prep)',
    nameAr: 'اللغة الإنجليزية',
    iconName: 'Globe',
    color: 'sky',
    bgGradient: 'from-sky-600 to-blue-800',
    gradeId: 'second_prep',
    units: [
      {
        id: 'u_enprep_1',
        title: 'Unit 1: Coming Home & Daily Routines',
        order: 1,
        description: 'Adverbs of frequency, present simple for habits, and vocabulary of daily life.',
        lessons: [
          {
            id: 'english_prep_l1',
            subjectId: 'english_prep',
            unitId: 'u_enprep_1',
            title: '1. Present Simple and Adverbs of Frequency',
            order: 1,
            status: 'completed',
            xpReward: 40,
            estimatedMinutes: 15,
            content: {
              explanation: 'We use the present simple tense to talk about daily habits, routines, and permanent facts. Adverbs of frequency show how often we do things.',
              summaryPoints: [
                'Adverbs: always (100%), usually (80%), often (70%), sometimes (50%), never (0%).',
                'Position: before the main verb, but after verb to be.'
              ],
              example: {
                title: 'Correct Adverb Position',
                problem: 'Where do we place "always" in "He eats breakfast at 7 AM"?',
                solutionSteps: [
                  'Subject: He',
                  'Adverb: always',
                  'Main verb: eats',
                  'Correct: "He always eats breakfast at 7 AM."'
                ],
                takeaway: 'Before normal verbs, but after "am / is / are". (e.g. He is always on time).'
              },
              practiceQuestions: [
                {
                  id: 'pr_ep1',
                  prompt: 'Choose the correct sentence:',
                  hint: 'Remember the adverb comes after verb to be.',
                  stepByStepGuide: ['She is + always + polite.'],
                  options: ['She is always helpful.', 'She always is helpful.', 'She helpful is always.', 'Always she is helpful.'],
                  correctAnswerIndex: 0,
                  explanation: 'Adverbs of frequency come after verb to be (is always).'
                }
              ],
              quiz: [
                {
                  id: 'qz_ep1',
                  question: 'They ________ watch television in the morning before school (0% frequency).',
                  options: ['always', 'usually', 'never', 'sometimes'],
                  correctIndex: 2,
                  explanation: '"never" expresses zero frequency.'
                }
              ]
            }
          }
        ]
      }
    ],
    diagnosticTest: {
      subjectId: 'english_prep',
      subjectNameAr: 'اللغة الإنجليزية',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'dg_ep_1',
          question: 'He _______ to school by bus every morning.',
          skillArea: 'Present Simple Grammar',
          options: ['go', 'goes', 'went', 'going'],
          correctIndex: 1,
          explanation: 'Third person singular (he/she/it) takes -s or -es in present simple.'
        }
      ]
    }
  },
  {
    id: 'social_prep',
    name: 'Social Studies',
    nameAr: 'الدراسات الاجتماعية',
    iconName: 'Map',
    color: 'emerald',
    bgGradient: 'from-emerald-700 to-green-900',
    gradeId: 'second_prep',
    units: [
      {
        id: 'u_soc_1',
        title: 'الوحدة 1: جغرافية الوطن العربي والموقع الاستراتيجي',
        order: 1,
        description: 'الموقع الجغرافي والفلكي والمظاهر التضاريسية في الوطن العربي.',
        lessons: [
          {
            id: 'social_prep_l1',
            subjectId: 'social_prep',
            unitId: 'u_soc_1',
            title: '1. موقع الوطن العربي وأهميته الاستراتيجية',
            order: 1,
            status: 'in_progress',
            xpReward: 40,
            estimatedMinutes: 15,
            content: {
              explanation: 'يحتل الوطن العربي موقعاً جغرافياً فريداً في قلب العالم القديم، ويطل على أهم البحار والمحيطات والممرات المائية التي تتحكم في التجارة العالمية.',
              summaryPoints: [
                'يقع بين قارتي آسيا وإفريقيا.',
                'يتحكم في 4 ممرات مائية حيوية: مضيق هرمز، مضيق باب المندب، قناة السويس، ومضيق جبل طارق.'
              ],
              example: {
                title: 'أهمية مضيق باب المندب',
                problem: 'ما الذي يميز مضيق باب المندب عن غيره؟',
                solutionSteps: [
                  'يصل البحر الأحمر بالمحيط الهندي عبر خليج عدن.',
                  'يخضع لإشراف عربي خالص من الجانبين (اليمن وجيبوتي).'
                ],
                takeaway: 'الممرات المائية تكسب الوطن العربي وزناً استراتيجياً وتجارياً هائلاً.'
              },
              practiceQuestions: [
                {
                  id: 'pr_sp1',
                  prompt: 'أي ممر مائي يربط بين البحر الأحمر والبحر المتوسط؟',
                  hint: 'ممر مائي مصري شهير تم حفره في القرن التاسع عشر.',
                  stepByStepGuide: ['قناة السويس هي الشريان الرابط بين البحرين.'],
                  options: ['مضيق جبل طارق', 'قناة السويس', 'مضيق هرمز', 'مضيق باب المندب'],
                  correctAnswerIndex: 1,
                  explanation: 'قناة السويس تربط البحر الأحمر بالبحر المتوسط.'
                }
              ],
              quiz: [
                {
                  id: 'qz_sp1',
                  question: 'مضيق جبل طارق يربط بين البحر المتوسط و:',
                  options: ['المحيط الأطلسي', 'المحيط الهندي', 'البحر الأحمر', 'الخليج العربي'],
                  correctIndex: 0,
                  explanation: 'مضيق جبل طارق يربط البحر المتوسط بالمحيط الأطلسي.'
                }
              ]
            }
          }
        ]
      }
    ],
    diagnosticTest: {
      subjectId: 'social_prep',
      subjectNameAr: 'الدراسات الاجتماعية',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'dg_sp_1',
          question: 'ما هو المضيق العربي الخالص الذي تشرف عليه دولتان عربيتان؟',
          skillArea: 'الجغرافيا والممرات البحرية',
          options: ['مضيق هرمز', 'مضيق باب المندب', 'مضيق جبل طارق', 'مضيق البوسفور'],
          correctIndex: 1,
          explanation: 'مضيق باب المندب تشرف عليه اليمن وجيبوتي.'
        }
      ]
    }
  }
];

export const EDUCATION_STAGES_CONFIG = [
  {
    id: 'secondary',
    title: 'المرحلة الثانوية / البكالوريا',
    years: [
      { id: 'first_sec', title: 'الأولى ثانوي / الجذع المشترك' },
      { id: 'second_sec', title: 'الثانية ثانوي' },
      { id: 'second_baccalaureate', title: 'الثانية بكالوريا / الثالث الثانوي' }
    ],
    tracks: [
      { id: 'engineering_cs', title: 'مسار الهندسة وعلوم الحاسوب', defaultSubjects: ['arabic_bac', 'english_bac', 'history_bac', 'prog_ai'] },
      { id: 'science_math', title: 'مسار العلوم والرياضيات', defaultSubjects: ['math_bac', 'arabic_bac', 'english_bac'] },
      { id: 'humanities', title: 'مسار الآداب والعلوم الإنسانية', defaultSubjects: ['arabic_bac', 'english_bac', 'history_bac'] }
    ]
  },
  {
    id: 'preparatory',
    title: 'المرحلة الإعدادية / المتوسطة',
    years: [
      { id: 'first_prep', title: 'الصف الأول الإعدادي' },
      { id: 'second_prep', title: 'الصف الثاني الإعدادي' },
      { id: 'third_prep', title: 'الصف الثالث الإعدادي' }
    ],
    tracks: [
      { id: 'general_prep', title: 'التعليم العام المعتمد', defaultSubjects: ['math_prep', 'science_prep', 'arabic_prep', 'english_prep', 'social_prep'] }
    ]
  }
];
