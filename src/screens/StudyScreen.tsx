import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Lock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Check,
  X,
  Zap,
  Info,
  Play
} from 'lucide-react';
import { StudentProfile, Subject, Lesson, LessonStatus, PracticeQuestion, QuizQuestion } from '../types';
import { ALL_SUBJECTS } from '../data/demoCurriculum';
import { completeLessonInProfile } from '../services/storageService';

interface StudyScreenProps {
  student: StudentProfile;
  selectedSubjectId?: string;
  initialLessonId?: string;
  onProfileUpdate: (updated: StudentProfile) => void;
  onNavigateToTutor: (subjectName?: string) => void;
}

export const StudyScreen: React.FC<StudyScreenProps> = ({
  student,
  selectedSubjectId,
  initialLessonId,
  onProfileUpdate,
  onNavigateToTutor,
}) => {
  // Filter student subjects
  const studentSubjects = ALL_SUBJECTS.filter((s) => student.subjects.includes(s.id));
  const [activeSubjectId, setActiveSubjectId] = useState<string>(
    selectedSubjectId || (studentSubjects[0]?.id ?? ALL_SUBJECTS[0].id)
  );

  // Active lesson modal state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(() => {
    if (initialLessonId) {
      for (const s of ALL_SUBJECTS) {
        for (const u of s.units) {
          const l = u.lessons.find((item) => item.id === initialLessonId);
          if (l) return l;
        }
      }
    }
    return null;
  });

  // Current Subject
  const currentSubject = ALL_SUBJECTS.find((s) => s.id === activeSubjectId) || studentSubjects[0];

  // Helper to determine status for a lesson in student's profile context
  const getLessonComputedStatus = (lesson: Lesson, subject: Subject): LessonStatus => {
    if (student.completedLessonIds.includes(lesson.id)) {
      return 'completed';
    }
    if (student.currentLessonId === lesson.id) {
      return 'in_progress';
    }
    // Check if previous lesson in the unit is completed
    const allUnitLessons = subject.units.flatMap((u) => u.lessons);
    const index = allUnitLessons.findIndex((l) => l.id === lesson.id);
    if (index === 0) return 'in_progress';
    const prev = allUnitLessons[index - 1];
    if (prev && student.completedLessonIds.includes(prev.id)) {
      return 'in_progress';
    }
    return 'locked';
  };

  // Subject progress stats
  const allLessons = currentSubject.units.flatMap((u) => u.lessons);
  const completedCount = allLessons.filter((l) => student.completedLessonIds.includes(l.id)).length;
  const progressPct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Disclaimer Banner */}
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-400">
        <Info size={16} className="text-emerald-400 shrink-0" />
        <span>محتوى تعليمي تجريبي (Demo Content) — قيد التحقق والمطابقة الرسمية؛ هيكلية متوافقة مع المناهج الوطنية.</span>
      </div>

      {/* Subject Horizontal Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {studentSubjects.map((sub) => {
          const isSelected = sub.id === currentSubject.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubjectId(sub.id);
                setActiveLesson(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/40'
              }`}
            >
              <span>{sub.nameAr}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Overview Header */}
      <div className="p-4 rounded-3xl bg-slate-800/40 border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100">{currentSubject.nameAr}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{currentSubject.name}</p>
          </div>
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-emerald-400">{completedCount}</span>
            <span className="text-xs text-slate-400"> / {allLessons.length} مكتمل</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Units & Lessons Accordion List */}
      <div className="space-y-4">
        {currentSubject.units.map((unit) => (
          <div key={unit.id} className="space-y-2">
            <div className="px-1 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300">{unit.title}</h3>
              <span className="text-[11px] text-slate-400">{unit.lessons.length} دروس</span>
            </div>

            <div className="space-y-2">
              {unit.lessons.map((lesson) => {
                const status = getLessonComputedStatus(lesson, currentSubject);
                const isLocked = status === 'locked';

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      if (!isLocked) {
                        setActiveLesson(lesson);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      isLocked
                        ? 'bg-slate-900/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                        : status === 'completed'
                        ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 cursor-pointer'
                        : 'bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-950/30 cursor-pointer shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : status === 'in_progress'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle size={18} />
                        ) : status === 'in_progress' ? (
                          <Play size={15} className="fill-slate-950" />
                        ) : (
                          <Lock size={15} />
                        )}
                      </div>

                      <div>
                        <p className={`text-xs font-bold ${isLocked ? 'text-slate-400' : 'text-slate-100'}`}>
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{lesson.estimatedMinutes} دقيقة</span>
                          <span>·</span>
                          <span className="text-amber-400 font-mono">+{lesson.xpReward} XP</span>
                          <span>·</span>
                          <span className={status === 'completed' ? 'text-emerald-400' : status === 'in_progress' ? 'text-sky-400' : 'text-slate-500'}>
                            {status === 'completed' ? 'مكتمل' : status === 'in_progress' ? 'قيد التعلّم' : 'مغلق'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isLocked && (
                      <ChevronLeft size={16} className="text-slate-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Lesson Runner Modal */}
      {activeLesson && (
        <LessonPlayerModal
          lesson={activeLesson}
          subject={currentSubject}
          onClose={() => setActiveLesson(null)}
          onCompleteLesson={(xp) => {
            const updated = completeLessonInProfile(student.id, activeLesson.id, xp);
            if (updated) {
              onProfileUpdate(updated);
            }
            setActiveLesson(null);
          }}
          onAskTutor={() => {
            setActiveLesson(null);
            onNavigateToTutor(currentSubject.nameAr);
          }}
        />
      )}
    </div>
  );
};

// Sub-component: Lesson Player with 5 Tabs (Explanation, Example, Practice, Quiz, Result)
interface LessonPlayerModalProps {
  lesson: Lesson;
  subject: Subject;
  onClose: () => void;
  onCompleteLesson: (xpReward: number) => void;
  onAskTutor: () => void;
}

const LessonPlayerModal: React.FC<LessonPlayerModalProps> = ({
  lesson,
  subject,
  onClose,
  onCompleteLesson,
  onAskTutor,
}) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'example' | 'practice' | 'quiz' | 'result'>('explanation');

  // Practice state
  const [practiceHintRevealed, setPracticeHintRevealed] = useState(false);
  const [practiceAnswerSelected, setPracticeAnswerSelected] = useState<number | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const practice = lesson.content.practiceQuestions[0];
  const quiz = lesson.content.quiz;

  // Calculate Quiz Score
  const calculateQuizScore = () => {
    if (!quiz || quiz.length === 0) return { score: 1, max: 1 };
    let score = 0;
    quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return { score, max: quiz.length };
  };

  const { score: quizScore, max: quizMax } = calculateQuizScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg flex flex-col max-h-[92vh] overflow-hidden shadow-2xl">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-400 font-semibold">{subject.nameAr}</span>
            <h2 className="text-xs font-bold text-slate-100 truncate max-w-[260px]">{lesson.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* 5-Phase Navigation Tabs */}
        <div className="flex border-b border-slate-800/80 bg-slate-900/90 text-xs font-medium px-2 py-1 justify-between">
          {[
            { id: 'explanation', label: '1. الشرح' },
            { id: 'example', label: '2. مثال' },
            { id: 'practice', label: '3. تدريب' },
            { id: 'quiz', label: '4. اختبار' },
            { id: 'result', label: '5. النتيجة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-1.5 rounded-lg transition text-[11px] ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-right">
          {/* 1. Explanation */}
          {activeTab === 'explanation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 leading-relaxed text-xs text-slate-200">
                <p className="font-medium text-slate-100 mb-2 leading-relaxed">
                  {lesson.content.explanation}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-emerald-400 mb-2">أهم المفاهيم المستفادة:</h4>
                <ul className="space-y-2">
                  {lesson.content.summaryPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 2. Example */}
          {activeTab === 'example' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <span className="text-[10px] text-indigo-400 font-bold block">{lesson.content.example.title}</span>
                <p className="text-xs font-bold text-slate-100">{lesson.content.example.problem}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2">خطوات الحل والتطبيق:</h4>
                <div className="space-y-2">
                  {lesson.content.example.solutionSteps.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-200 flex items-start gap-2 font-mono">
                      <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                      <span className="font-sans">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                <span className="font-bold">خلاصة ذكية: </span>
                <span>{lesson.content.example.takeaway}</span>
              </div>
            </div>
          )}

          {/* 3. Practice Questions */}
          {activeTab === 'practice' && (
            <div className="space-y-4">
              {practice ? (
                <>
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                    <span className="text-[10px] text-amber-400 font-bold block">سؤال تدريبي موجه</span>
                    <p className="text-xs font-bold text-slate-100 whitespace-pre-line">{practice.prompt}</p>

                    <div className="space-y-2 pt-1">
                      {practice.options.map((opt, optIdx) => {
                        const isChosen = practiceAnswerSelected === optIdx;
                        const isCorrect = optIdx === practice.correctAnswerIndex;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => setPracticeAnswerSelected(optIdx)}
                            className={`w-full text-right p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                              practiceAnswerSelected === null
                                ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200'
                                : isChosen && isCorrect
                                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                                : isChosen && !isCorrect
                                ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                                : 'bg-slate-800/20 border-slate-800/60 text-slate-400'
                            }`}
                          >
                            <span>{opt}</span>
                            {practiceAnswerSelected !== null && (
                              <span>
                                {isCorrect ? <Check size={16} className="text-emerald-400" /> : isChosen ? <X size={16} className="text-rose-400" /> : null}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hint Reveal */}
                  <div>
                    {!practiceHintRevealed ? (
                      <button
                        onClick={() => setPracticeHintRevealed(true)}
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <HelpCircle size={14} />
                        <span>تحتاج إلى تلميح لمساعدتك؟ (اضغط هنا)</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 space-y-1">
                        <span className="font-bold block">💡 التلميح التوجيهي:</span>
                        <p>{practice.hint}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-400">لا توجد أسئلة تدريبية إضافية لهذا الدرس.</p>
              )}
            </div>
          )}

          {/* 4. Short Quiz */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {quiz && quiz.length > 0 ? (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>اختبر استيعابك للمفاهيم الأساسية</span>
                    <span>{quiz.length} أسئلة</span>
                  </div>

                  <div className="space-y-4">
                    {quiz.map((q, qIdx) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                        <p className="text-xs font-bold text-slate-100">{qIdx + 1}. {q.question}</p>

                        <div className="space-y-1.5 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = quizAnswers[qIdx] === optIdx;
                            const isCorrect = optIdx === q.correctIndex;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  if (!quizSubmitted) {
                                    setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx });
                                  }
                                }}
                                disabled={quizSubmitted}
                                className={`w-full text-right p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                                  !quizSubmitted
                                    ? isSelected
                                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                                    : isCorrect
                                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                                    : isSelected
                                    ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                                    : 'bg-slate-800/20 border-slate-800 text-slate-500'
                                }`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isCorrect && <Check size={14} className="text-emerald-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={() => {
                        setQuizSubmitted(true);
                        setActiveTab('result');
                      }}
                      disabled={Object.keys(quizAnswers).length < quiz.length}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition"
                    >
                      تسليم الإجابات والاطلاع على النتيجة
                    </button>
                  ) : null}
                </>
              ) : (
                <p className="text-xs text-slate-400">انتقل مباشرة لمرحلة النتيجة وإتمام الدرس.</p>
              )}
            </div>
          )}

          {/* 5. Result & Lesson Completion */}
          {activeTab === 'result' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle size={32} />
              </div>

              <div>
                <h3 className="text-base font-black text-slate-100">عمل رائع! أكملت خطوات الدرس</h3>
                <p className="text-xs text-slate-400 mt-1">
                  أظهرت فهماً متميزاً لمفاهيم {lesson.title}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-right">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">نتيجة الاختبار</span>
                  <span className="text-sm font-bold text-slate-100 font-mono">
                    {quizScore} / {quizMax}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">نقاط الخبرة المكتسبة</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    +{lesson.xpReward} XP
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onCompleteLesson(lesson.xpReward)}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  حفظ الإنجاز وفتح الدرس التالي ✓
                </button>

                <button
                  onClick={onAskTutor}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  لديك استفسار حول الدرس؟ اسأل المرشد الذكي
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={() => {
              if (activeTab === 'result') setActiveTab('quiz');
              else if (activeTab === 'quiz') setActiveTab('practice');
              else if (activeTab === 'practice') setActiveTab('example');
              else if (activeTab === 'example') setActiveTab('explanation');
            }}
            disabled={activeTab === 'explanation'}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 transition"
          >
            <ChevronRight size={15} />
            <span>السابق</span>
          </button>

          <button
            onClick={() => {
              if (activeTab === 'explanation') setActiveTab('example');
              else if (activeTab === 'example') setActiveTab('practice');
              else if (activeTab === 'practice') setActiveTab('quiz');
              else if (activeTab === 'quiz') setActiveTab('result');
              else if (activeTab === 'result') onCompleteLesson(lesson.xpReward);
            }}
            className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>{activeTab === 'result' ? 'إنهاء الدرس' : 'المرحلة التالية'}</span>
            <ChevronLeft size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
