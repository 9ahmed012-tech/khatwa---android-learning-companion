import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  RefreshCw,
  X,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { Lesson, QuizQuestion, StudentProfile } from '../types';

interface LessonAIQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson;
  subjectName: string;
  student: StudentProfile;
  onProfileUpdate: (updated: StudentProfile) => void;
}

export const LessonAIQuizModal: React.FC<LessonAIQuizModalProps> = ({
  isOpen,
  onClose,
  lesson,
  subjectName,
  student,
  onProfileUpdate,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchCurriculumQuiz() {
      setLoading(true);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsChecked(false);
      setScore(0);
      setQuizFinished(false);

      try {
        const res = await fetch('/api/curriculum/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonTitle: lesson.title,
            subjectName,
            objectives: lesson.objectives || ['استيعاب المفاهيم', 'التطبيق العملي'],
            difficulty: 'متوسط',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend quiz error, using lesson quiz content:', err);
      }

      // Fallback to internal lesson content quiz
      if (lesson.content.quiz && lesson.content.quiz.length > 0) {
        setQuestions(lesson.content.quiz);
      } else {
        setQuestions([
          {
            id: 'fallback-1',
            question: `ما هو المفهوم الأساسي المستهدف في درس (${lesson.title})؟`,
            options: [
              'فهم وتطبيق نواتج التعلم المحددة للمنهج',
              'الحفظ الآلي دون استيعاب العلاقات المنطقية',
              'تجاوز الخطوات المنهجية وحل المسائل عشوائياً',
              'عدم مراجعة الأمثلة التطبيقية المحلولة',
            ],
            correctIndex: 0,
            explanation: 'الهدف من المنهج المعتمد هو تمكين الطالب من الربط والتطبيق العملي.',
          },
        ]);
      }
      setLoading(false);
    }

    fetchCurriculumQuiz();
  }, [isOpen, lesson.id, lesson.title, subjectName]);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isChecked) return;
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (selectedOption === null || isChecked) return;
    setIsChecked(true);

    if (selectedOption === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      // Quiz Finished, calculate XP reward
      setQuizFinished(true);
      const earnedXP = Math.max(30, score * 25);
      const newXP = student.xp + earnedXP;
      const newLevel = Math.floor(newXP / 250) + 1;

      // Mark lesson as completed if score is high
      const completedList = student.completedLessonIds.includes(lesson.id)
        ? student.completedLessonIds
        : [...student.completedLessonIds, lesson.id];

      onProfileUpdate({
        ...student,
        xp: newXP,
        level: newLevel,
        completedLessonIds: completedList,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 text-right">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100">اختبار نواتج تعلم الدرس</h3>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                {subjectName} — {lesson.title}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <RefreshCw size={24} className="animate-spin text-emerald-400 mx-auto" />
            <p className="text-xs text-slate-300 font-bold">جاري إعداد الأسئلة من نواتج التعلم المعتمدة...</p>
            <span className="text-[10px] text-slate-500">تحليل محتوى الدرس وتوليد اختبار دقيق</span>
          </div>
        ) : quizFinished ? (
          /* Finished State */
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Award size={32} />
            </div>
            <h4 className="text-sm font-black text-slate-100">أحسنت! أتممت اختبار الدرس بنجاح</h4>
            <p className="text-xs text-slate-300 font-mono">
              النتيجة: <strong className="text-emerald-400 text-sm">{score}</strong> من أصل {questions.length}
            </p>
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
              +{Math.max(30, score * 25)} XP خبرة أضيفت لملفك الأكاديمي!
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
            >
              العودة للدرس
            </button>
          </div>
        ) : (
          /* Question Display */
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                سؤال {currentIndex + 1} من {questions.length}
              </span>
              <span className="text-emerald-400 font-mono font-bold">+25 XP</span>
            </div>

            <h4 className="text-xs font-bold text-slate-100 leading-relaxed">
              {currentQ.question}
            </h4>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectAnswer = idx === currentQ.correctIndex;

                let optClass = 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800';

                if (isChecked) {
                  if (isCorrectAnswer) {
                    optClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrectAnswer) {
                    optClass = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  } else {
                    optClass = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  optClass = 'bg-indigo-950/40 border-indigo-500 text-slate-100 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    disabled={isChecked}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${optClass}`}
                  >
                    <span>{option}</span>
                    {isChecked && isCorrectAnswer && (
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    )}
                    {isChecked && isSelected && !isCorrectAnswer && (
                      <XCircle size={16} className="text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Check / Next */}
            {!isChecked ? (
              <button
                onClick={handleCheck}
                disabled={selectedOption === null}
                className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-bold text-xs transition shadow-sm"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  <span className="font-bold text-emerald-400 block mb-0.5">التوضيح وناتج التعلم:</span>
                  <span>{currentQ.explanation}</span>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-sm"
                >
                  {currentIndex < questions.length - 1 ? 'السؤال التالي ←' : 'عرض النتيجة النهائية'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
