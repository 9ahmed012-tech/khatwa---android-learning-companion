import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Share2,
  Bookmark,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { StudentProfile, IslamicBenefit, IslamicQuizItem } from '../types';
import { ISLAMIC_BENEFITS, ISLAMIC_QUIZZES } from '../data/islamicContent';

interface IslamicKnowledgeScreenProps {
  student: StudentProfile;
  onProfileUpdate: (updated: StudentProfile) => void;
  onBack?: () => void;
}

export const IslamicKnowledgeScreen: React.FC<IslamicKnowledgeScreenProps> = ({
  student,
  onProfileUpdate,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'quizzes'>('benefits');
  const [savedBenefits, setSavedBenefits] = useState<string[]>(student.savedIslamicBenefits || []);
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    const isSaved = savedBenefits.includes(id);
    const updated = isSaved ? savedBenefits.filter((item) => item !== id) : [...savedBenefits, id];
    setSavedBenefits(updated);
    onProfileUpdate({
      ...student,
      savedIslamicBenefits: updated,
    });
  };

  const handleShare = async (benefit: IslamicBenefit) => {
    const text = `📖 فائدة إسلامية من تطبيق خطوة:\n${benefit.arabicText}\nالمصدر: ${benefit.reference}\n#زاد_المسلم #تطبيق_خطوة`;
    if (navigator.share) {
      try {
        await navigator.share({ title: benefit.title, text });
      } catch {
        // ignore
      }
    } else {
      navigator.clipboard?.writeText(text);
      alert('تم نسخ الفائدة للمشاركة!');
    }
  };

  const currentQuiz = ISLAMIC_QUIZZES[currentQuizIndex];

  const handleSelectAnswer = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerChecked) return;
    setIsAnswerChecked(true);

    const isCorrect = selectedOption === currentQuiz.correctIndex;
    if (isCorrect && !completedQuizIds.includes(currentQuiz.id)) {
      setQuizScore((prev) => prev + 1);
      setCompletedQuizIds((prev) => [...prev, currentQuiz.id]);
      
      const newXP = student.xp + currentQuiz.xpReward;
      const newLevel = Math.floor(newXP / 250) + 1;
      onProfileUpdate({
        ...student,
        xp: newXP,
        level: newLevel,
      });
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    if (currentQuizIndex < ISLAMIC_QUIZZES.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setCurrentQuizIndex(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 pb-16">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition"
              title="رجوع"
            >
              <ArrowRight size={18} />
            </button>
          )}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <BookOpen size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100">زاد المعرفة الإسلامية</h2>
            <span className="text-[10px] text-emerald-400 block -mt-0.5">
              آيات وتدبر · أحاديث صحيحة · مسابقات دينية
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-0.5 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'benefits'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            فوائد وتدبر
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'quizzes'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مسابقات المعرفة
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Verification & Authenticity Disclaimer */}
        <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-right">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <p className="text-[10px] text-emerald-300 leading-relaxed">
            جميع الأحاديث النبوية مخرجة ومحققة من صحيحي البخاري ومسلم والسنن المعتمدة، مع التزام الأمانة العلمية التامة.
          </p>
        </div>

        {activeTab === 'benefits' ? (
          <div className="space-y-3.5">
            {/* Today's Benefit Card */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-800/80 to-slate-900 border border-emerald-500/30 shadow-sm space-y-2.5 text-right">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  فائدة اليوم المختارة 🌟
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {ISLAMIC_BENEFITS[0].typeAr}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-100">{ISLAMIC_BENEFITS[0].title}</h3>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-sm font-arabic leading-loose text-emerald-300">
                {ISLAMIC_BENEFITS[0].arabicText}
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                المصدر: {ISLAMIC_BENEFITS[0].reference}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {ISLAMIC_BENEFITS[0].explanation}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-amber-300">
                <span className="font-bold text-amber-400 block mb-0.5">التطبيق العملي:</span>
                <span>{ISLAMIC_BENEFITS[0].reflection}</span>
              </div>
            </div>

            {/* List of Other Benefits */}
            <div className="space-y-3">
              {ISLAMIC_BENEFITS.slice(1).map((item) => {
                const isSaved = savedBenefits.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition space-y-2 text-right"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                        {item.typeAr}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleSave(item.id)}
                          className={`p-1.5 rounded-lg transition ${
                            isSaved ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="حفظ"
                        >
                          <Bookmark size={15} className={isSaved ? 'fill-amber-400' : ''} />
                        </button>
                        <button
                          onClick={() => handleShare(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition"
                          title="مشاركة"
                        >
                          <Share2 size={15} />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-arabic leading-relaxed text-slate-200">
                      {item.arabicText}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono">
                      المصدر: {item.reference}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {item.explanation}
                    </p>

                    <div className="p-2 rounded-lg bg-emerald-950/30 text-[10px] text-emerald-300 border border-emerald-500/20">
                      💡 {item.reflection}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Interactive Quizzes Tab */
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-800/50 border border-slate-700/70 space-y-4 text-right shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-2.5">
                <span className="text-xs font-bold text-slate-100">
                  سؤال {currentQuizIndex + 1} من {ISLAMIC_QUIZZES.length}
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                  +{currentQuiz.xpReward} XP خبرة
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 leading-relaxed">
                {currentQuiz.question}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {currentQuiz.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQuiz.correctIndex;

                  let optionStyle = 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-800';

                  if (isAnswerChecked) {
                    if (isCorrectAnswer) {
                      optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrectAnswer) {
                      optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    } else {
                      optionStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-emerald-950/40 border-emerald-500 text-slate-100 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={isAnswerChecked}
                      className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerChecked && isCorrectAnswer && (
                        <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                      )}
                      {isAnswerChecked && isSelected && !isCorrectAnswer && (
                        <XCircle size={16} className="text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Check / Next Button */}
              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition shadow-sm"
                >
                  تحقق من الإجابة
                </button>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-emerald-400 block">التوضيح والمصدر:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{currentQuiz.explanation}</p>
                    <span className="text-[10px] text-slate-500 font-mono block pt-1">
                      المصدر: {currentQuiz.reference}
                    </span>
                  </div>

                  <button
                    onClick={handleNextQuiz}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-sm"
                  >
                    السؤال التالي →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
