import React, { useState } from 'react';
import { Sparkles, Check, ChevronLeft, ChevronRight, User, BookOpen, GraduationCap, Award, Compass, School } from 'lucide-react';
import { StudentProfile, EducationStage } from '../types';
import { ALL_SUBJECTS, ALL_SKILLS, DEMO_STUDENT_1, DEMO_STUDENT_2 } from '../data/demoCurriculum';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: StudentProfile) => void;
  onClose?: () => void;
  onSelectPreset?: (presetId: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onClose,
  onSelectPreset,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 8;

  // Form state for custom profile
  const [studentName, setStudentName] = useState<string>('عمر التلمساني');
  const [stage, setStage] = useState<EducationStage>('secondary');
  const [schoolYear, setSchoolYear] = useState<string>('second_baccalaureate');
  const [schoolYearAr, setSchoolYearAr] = useState<string>('الثانية بكالوريا');
  const [track, setTrack] = useState<string>('مسار الهندسة وعلوم الحاسوب');
  const [educationSystem, setEducationSystem] = useState<string>('المنهاج الوطني المطور');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'arabic_bac',
    'english_bac',
    'history_bac',
    'prog_ai',
  ]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'skill_python',
    'skill_english_talk',
  ]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      finishCustomProfile();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleSubject = (id: string) => {
    if (selectedSubjects.includes(id)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== id));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, id]);
    }
  };

  const toggleSkill = (id: string) => {
    if (selectedSkills.includes(id)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== id));
      }
    } else {
      setSelectedSkills([...selectedSkills, id]);
    }
  };

  const finishCustomProfile = () => {
    const newProfile: StudentProfile = {
      id: `custom_${Date.now()}`,
      name: studentName.trim() || 'طالب خطوة',
      stage,
      grade: schoolYear,
      gradeAr: schoolYearAr,
      track,
      educationSystem,
      subjects: selectedSubjects,
      skills: selectedSkills,
      xp: 200,
      level: 1,
      streakDays: 1,
      todayGoalMinutes: 20,
      completedMinutesToday: 0,
      todayGoalSubject: ALL_SUBJECTS.find((s) => s.id === selectedSubjects[0])?.nameAr || 'المادة الأولى',
      currentLessonId: ALL_SUBJECTS.find((s) => s.id === selectedSubjects[0])?.units[0]?.lessons[0]?.id || 'prog_ai_l1',
      currentSkillId: selectedSkills[0] || 'skill_python',
      completedLessonIds: [],
      assessmentResults: {},
      quranProgress: {
        currentSurah: 'سورة الفاتحة',
        surahNumber: 1,
        currentPage: 1,
        totalPages: 604,
        targetDailyPages: 2,
        isReadToday: false,
        streakDays: 1,
      },
      isCustomProfile: true,
    };

    onComplete(newProfile);
  };

  const chooseDemo = (preset: StudentProfile) => {
    if (onSelectPreset) {
      onSelectPreset(preset.id);
    } else {
      onComplete(preset);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Step indicator header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              {step}
            </div>
            <div>
              <span className="text-xs text-slate-400">إعداد خطوتك الأولى</span>
              <p className="text-xs text-slate-300 font-medium">الخطوة {step} من {totalSteps}</p>
            </div>
          </div>

          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-1 rounded-full transition-all ${
                  step === i + 1 ? 'w-5 bg-emerald-400' : step > i + 1 ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 text-right">
          {/* Step 1: Welcome Screen */}
          {step === 1 && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-extrabold text-2xl">
                خـ
              </div>
              <h2 className="text-xl font-bold text-slate-100">أهلاً بك في تطبيق خُطوة</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                رفيقك التعليمي الذكي المصمم لمساعدتك على التفوق الدراسي، اكتشاف نقاط الضعف وتقويتها، وتعلّم مهارات المستقبل بأسلوب تفاعلي ممتع.
              </p>

              <div className="pt-2 text-right bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/40">
                <span className="text-xs font-semibold text-emerald-400 block mb-2">أو جرّب مباشرة حساباً تجريبياً:</span>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => chooseDemo(DEMO_STUDENT_1)}
                    className="w-full text-right p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">{DEMO_STUDENT_1.name}</p>
                      <p className="text-[11px] text-slate-400">{DEMO_STUDENT_1.gradeAr} · {DEMO_STUDENT_1.track}</p>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium">دخول فوري ←</span>
                  </button>

                  <button
                    onClick={() => chooseDemo(DEMO_STUDENT_2)}
                    className="w-full text-right p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">{DEMO_STUDENT_2.name}</p>
                      <p className="text-[11px] text-slate-400">{DEMO_STUDENT_2.gradeAr} · {DEMO_STUDENT_2.educationSystem}</p>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium">دخول فوري ←</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Create student profile */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <User size={20} />
                <h3 className="text-base font-bold text-slate-100">إنشاء الملف الشخصي للطالب</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                سنقوم الآن بتهيئة مسارك التعليمي المخصص وفقاً لمنهجك وسنتك الدراسية لنقدم لك أهدافاً يومية واختبارات تشخيصية تناسب مستواك تماماً.
              </p>
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>تتبع التقدم الدراسي والدروس المكتملة</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>تشخيص فوري للمفاهيم ونقاط الضعف</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>مرشد ذكي يوجهك خطوة بخطوة بالأسلوب السقراطي</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Enter student's name */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100">ما اسمك يا بطل؟</h3>
              <p className="text-xs text-slate-400">
                سنستخدم اسمك لتحيتك يومياً وتخصيص تجربة التعلّم وتوثيق إنجازاتك.
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">اسم الطالب</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="مثال: أحمد عبد الله"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Step 4: Select education stage */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100">حدد مرحلتك التعليمية</h3>
              <p className="text-xs text-slate-400">اختر المرحلة الحالية التي تدرس بها:</p>

              <div className="space-y-2.5">
                {[
                  { id: 'secondary' as EducationStage, title: 'المرحلة الثانوية / البكالوريا', desc: 'التحضير للامتحانات الوطنية وتحديد التخصص الجامعي' },
                  { id: 'preparatory' as EducationStage, title: 'المرحلة الإعدادية / المتوسطة', desc: 'تأسيس المعارف العلمية والرياضية واللغوية' },
                  { id: 'primary' as EducationStage, title: 'المرحلة الابتدائية', desc: 'بناء المهارات الأساسية (قريباً في التحديثات)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (s.id !== 'primary') {
                        setStage(s.id);
                        if (s.id === 'secondary') {
                          setSchoolYear('second_baccalaureate');
                          setSchoolYearAr('الثانوية العامة المصرية - الصف الثاني الثانوي');
                          setSelectedSubjects(['arabic_bac', 'english_bac', 'history_bac', 'prog_ai']);
                        } else {
                          setSchoolYear('second_prep');
                          setSchoolYearAr('الصف الثاني الإعدادي');
                          setSelectedSubjects(['math_prep', 'science_prep', 'arabic_prep', 'english_prep', 'social_prep']);
                        }
                      }
                    }}
                    className={`w-full text-right p-3.5 rounded-2xl border transition-all ${
                      stage === s.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-slate-100'
                        : s.id === 'primary'
                        ? 'opacity-40 bg-slate-800/20 border-slate-800 cursor-not-allowed'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs">{s.title}</span>
                      {stage === s.id && <Check size={16} className="text-emerald-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Select school year */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100">اختر سنتك الدراسية</h3>
              <p className="text-xs text-slate-400">حدد السنة الحالية بدقة:</p>

              <div className="space-y-2">
                {stage === 'secondary' ? (
                  <>
                    {[
                      { id: 'first_sec', title: 'الأولى ثانوي / الجذع المشترك' },
                      { id: 'second_sec', title: 'الثانية ثانوي' },
                      { id: 'second_baccalaureate', title: 'الثانية بكالوريا (الصف الثالث الثانوي)' },
                    ].map((y) => (
                      <button
                        key={y.id}
                        onClick={() => {
                          setSchoolYear(y.id);
                          setSchoolYearAr(y.title);
                        }}
                        className={`w-full text-right p-3 rounded-xl border transition ${
                          schoolYear === y.id
                            ? 'bg-emerald-950/40 border-emerald-500 text-slate-100'
                            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{y.title}</span>
                          {schoolYear === y.id && <Check size={15} className="text-emerald-400" />}
                        </div>
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { id: 'first_prep', title: 'الصف الأول الإعدادي' },
                      { id: 'second_prep', title: 'الصف الثاني الإعدادي' },
                      { id: 'third_prep', title: 'الصف الثالث الإعدادي (الشهادة الإعدادية)' },
                    ].map((y) => (
                      <button
                        key={y.id}
                        onClick={() => {
                          setSchoolYear(y.id);
                          setSchoolYearAr(y.title);
                        }}
                        className={`w-full text-right p-3 rounded-xl border transition ${
                          schoolYear === y.id
                            ? 'bg-emerald-950/40 border-emerald-500 text-slate-100'
                            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{y.title}</span>
                          {schoolYear === y.id && <Check size={15} className="text-emerald-400" />}
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Select education system */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100">اختر النظام التعليمي والمسار</h3>
              <p className="text-xs text-slate-400">يساعدنا ذلك في مطابقة معايير الامتحانات والمقررات:</p>

              <div className="space-y-2">
                {[
                  {
                    system: 'النظام الوطني العام',
                    trackName: 'مسار الهندسة وعلوم الحاسوب',
                    desc: 'تركيز مكثف على البرمجة والذكاء الاصطناعي والرياضيات المتقدمة',
                  },
                  {
                    system: 'المنهاج الإعدادي المعتمد',
                    trackName: 'التعليم العام المطور',
                    desc: 'منهج شامل يغطي العلوم والرياضيات واللغات والدراسات',
                  },
                  {
                    system: 'نظام الثانوي التخصصي',
                    trackName: 'مسار العلوم الطبيعية والتجريبية',
                    desc: 'تركيز على الفيزياء والكيمياء والأحياء',
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setEducationSystem(item.system);
                      setTrack(item.trackName);
                    }}
                    className={`w-full text-right p-3.5 rounded-2xl border transition ${
                      track === item.trackName
                        ? 'bg-emerald-950/40 border-emerald-500 text-slate-100'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{item.trackName}</span>
                      {track === item.trackName && <Check size={15} className="text-emerald-400" />}
                    </div>
                    <span className="text-[11px] text-emerald-400/90 block mt-0.5">{item.system}</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Select subjects */}
          {step === 7 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100">حدد المواد الدراسية</h3>
              <p className="text-xs text-slate-400">انقر على المواد التي ترغب في دراستها ومتابعتها:</p>

              <div className="space-y-2">
                {ALL_SUBJECTS.map((sub) => {
                  const isChecked = selectedSubjects.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => toggleSubject(sub.id)}
                      className={`w-full text-right p-3 rounded-xl border flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-slate-800 border-emerald-500/80 text-slate-100'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${isChecked ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <div>
                          <p className="text-xs font-bold">{sub.nameAr}</p>
                          <p className="text-[10px] text-slate-400">{sub.units.length} وحدات تعليمية</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700'
                      }`}>
                        {isChecked && <Check size={13} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 8: Select skills the student wants to learn */}
          {step === 8 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100">اختر مهارات المستقبل الإضافية</h3>
              <p className="text-xs text-slate-400">مهارات تفاعلية تعتمد نظام التدرج التلعيبي (XP):</p>

              <div className="space-y-2.5">
                {ALL_SKILLS.map((sk) => {
                  const isSelected = selectedSkills.includes(sk.id);
                  return (
                    <button
                      key={sk.id}
                      onClick={() => toggleSkill(sk.id)}
                      className={`w-full text-right p-3.5 rounded-2xl border transition ${
                        isSelected
                          ? 'bg-emerald-950/30 border-emerald-500 text-slate-100'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{sk.titleAr}</span>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                          isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700'
                        }`}>
                          {isSelected && <Check size={13} />}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">{sk.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
            >
              <ChevronRight size={16} />
              <span>السابق</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
          >
            <span>{step === totalSteps ? 'إنهاء وبدء التعلّم' : 'متابعة'}</span>
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
