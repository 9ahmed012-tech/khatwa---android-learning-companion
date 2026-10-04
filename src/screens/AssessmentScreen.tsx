import React, { useState } from 'react';
import {
  Target,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  ChevronLeft,
  Award,
  ArrowRight,
  HelpCircle,
  Check,
  X
} from 'lucide-react';
import { StudentProfile, Subject, AssessmentResult, AssessmentLevel } from '../types';
import { ALL_SUBJECTS } from '../data/demoCurriculum';
import { saveAssessmentResult } from '../services/storageService';

interface AssessmentScreenProps {
  student: StudentProfile;
  onProfileUpdate: (updated: StudentProfile) => void;
  onNavigateToStudy: (subjectId?: string, lessonId?: string) => void;
  onNavigateToTutor: (subjectName?: string) => void;
}

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  student,
  onProfileUpdate,
  onNavigateToStudy,
  onNavigateToTutor,
}) => {
  const studentSubjects = ALL_SUBJECTS.filter((s) => student.subjects.includes(s.id));
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    studentSubjects[0]?.id || ALL_SUBJECTS[0].id
  );

  // Active Test State
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [activeResult, setActiveResult] = useState<AssessmentResult | null>(null);

  const currentSubject = ALL_SUBJECTS.find((s) => s.id === selectedSubjectId) || studentSubjects[0];
  const diagnosticTest = currentSubject.diagnosticTest;
  const pastResult = student.assessmentResults[selectedSubjectId];

  // Start new test
  const handleStartTest = () => {
    setIsTakingTest(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTestCompleted(false);
    setActiveResult(null);
  };

  // Submit test and calculate score & diagnose weak areas
  const handleSubmitTest = () => {
    const questions = diagnosticTest.questions;
    let correctCount = 0;
    const weakAreasDetected: string[] = [];

    questions.forEach((q, idx) => {
      const answer = userAnswers[idx];
      if (answer === q.correctIndex) {
        correctCount++;
      } else {
        if (!weakAreasDetected.includes(q.skillArea)) {
          weakAreasDetected.push(q.skillArea);
        }
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    let level: AssessmentLevel = 'مبتدئ';
    if (percentage >= 80) level = 'متقدم';
    else if (percentage >= 50) level = 'متوسط';

    let recommendation = '';
    if (weakAreasDetected.length === 0) {
      recommendation = `أداء استثنائي في ${currentSubject.nameAr}! يمكنك التقدم مباشرة في الدروس المتقدمة.`;
    } else {
      recommendation = `يُنصح بمراجعة درس (${weakAreasDetected.join(' و ')}) وممارسة تمارين تدريبية إضافية لتعزيز الفهم.`;
    }

    const firstLessonId = currentSubject.units[0]?.lessons[0]?.id;

    const result: AssessmentResult = {
      subjectId: currentSubject.id,
      subjectNameAr: currentSubject.nameAr,
      score: correctCount,
      maxScore: questions.length,
      percentage,
      level,
      weakAreas: weakAreasDetected,
      recommendation,
      recommendedLessonId: firstLessonId,
      completedAt: new Date().toISOString().split('T')[0],
    };

    setActiveResult(result);
    setTestCompleted(true);
    setIsTakingTest(false);

    // Save to profile
    const updated = saveAssessmentResult(student.id, result);
    if (updated) {
      onProfileUpdate(updated);
    }
  };

  // Display either the active test result or the past result
  const displayResult = activeResult || pastResult;

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Top Header */}
      <section className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-400">
          <Target size={20} />
          <h1 className="text-base font-bold text-slate-100">نظام تقييم المستوى والتشخيص</h1>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          اختبارات تشخيصية ذكية وسريعة لتقدير مستواك الحقيقي وتحديد نقاط الضعف بدقة لتقديم توصيات مخصصة.
        </p>
      </section>

      {/* Subject Horizontal Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {studentSubjects.map((sub) => {
          const isSelected = sub.id === selectedSubjectId;
          const hasResult = !!student.assessmentResults[sub.id];
          return (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubjectId(sub.id);
                setIsTakingTest(false);
                setActiveResult(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/40'
              }`}
            >
              <span>{sub.nameAr}</span>
              {hasResult && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Test Running View */}
      {isTakingTest ? (
        <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-700/70 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700/60 pb-3">
            <span className="font-bold text-emerald-400">
              السؤال {currentQuestionIndex + 1} من {diagnosticTest.questions.length}
            </span>
            <span className="font-mono">{diagnosticTest.questions[currentQuestionIndex].skillArea}</span>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-slate-100 leading-relaxed">
              {diagnosticTest.questions[currentQuestionIndex].question}
            </p>

            <div className="space-y-2 pt-2">
              {diagnosticTest.questions[currentQuestionIndex].options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: optIdx })}
                    className={`w-full text-right p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{option}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-600'
                    }`}>
                      {isSelected && <Check size={11} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30"
            >
              السؤال السابق
            </button>

            {currentQuestionIndex < diagnosticTest.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                disabled={userAnswers[currentQuestionIndex] === undefined}
                className="px-4 py-2 rounded-xl bg-emerald-500 disabled:opacity-50 text-slate-950 text-xs font-bold"
              >
                السؤال التالي ←
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={userAnswers[currentQuestionIndex] === undefined}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-lg"
              >
                إنهاء التقييم واكتشاف النتيجة
              </button>
            )}
          </div>
        </div>
      ) : displayResult ? (
        /* Result & Weak Areas Display (as required in concept example) */
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-800/40 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">المادة المقيمة</span>
                <h3 className="text-base font-bold text-slate-100">{displayResult.subjectNameAr}</h3>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">المستوى المقدر</span>
                <span className={`text-sm font-black ${
                  displayResult.level === 'متقدم' ? 'text-emerald-400' : displayResult.level === 'متوسط' ? 'text-sky-400' : 'text-amber-400'
                }`}>
                  {displayResult.level}
                </span>
              </div>
            </div>

            {/* Score & percentage */}
            <div className="grid grid-cols-2 gap-2 text-right">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
                <span className="text-[10px] text-slate-400 block">الدرجة المحققة</span>
                <span className="text-sm font-bold text-slate-200 font-mono">
                  {displayResult.score} / {displayResult.maxScore}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
                <span className="text-[10px] text-slate-400 block">النسبة المئوية</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {displayResult.percentage}%
                </span>
              </div>
            </div>

            {/* Weak Areas (نقاط الضعف المكتشفة) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <AlertTriangle size={15} />
                <span>نقاط الضعف التي تم تحديدها (Weak Areas):</span>
              </div>

              {displayResult.weakAreas.length > 0 ? (
                <div className="space-y-1.5">
                  {displayResult.weakAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between"
                    >
                      <span className="font-semibold">{area}</span>
                      <span className="text-[11px] text-amber-400/80">بحاجة لتركيز</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                  لم يتم رصد أي نقاط ضعف جوهرية. استمر في هذا الأداء الرائع!
                </div>
              )}
            </div>

            {/* Recommendation (التوصية) */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-300 block">توصية خطوة:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {displayResult.recommendation}
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => onNavigateToStudy(currentSubject.id, displayResult.recommendedLessonId)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                <BookOpen size={15} />
                <span>بدء مراجعة الدرس الموصى به</span>
              </button>

              <button
                onClick={() => onNavigateToTutor(currentSubject.nameAr)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <Sparkles size={15} className="text-indigo-400" />
                <span>شرح نقاط الضعف مع المرشد الذكي</span>
              </button>

              <button
                onClick={handleStartTest}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <RotateCcw size={13} />
                <span>إعادة الاختبار التشخيصي</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State / Not Assessed Yet */
        <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Target size={28} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-100">
              لم تجرِ تقييماً تشخيصياً لمادة {currentSubject.nameAr} بعد
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              يستغرق الاختبار قرابة {diagnosticTest.estimatedMinutes} دقائق ويتضمن أسئلة موجهة لتحديد مستواك ومواطن الضعف.
            </p>
          </div>

          <button
            onClick={handleStartTest}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            بدء التقييم التشخيصي الآن
          </button>
        </div>
      )}
    </div>
  );
};
