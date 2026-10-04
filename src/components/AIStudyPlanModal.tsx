import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  X,
  Flame,
  Award,
  BookOpen,
  Gamepad2,
  RefreshCw
} from 'lucide-react';
import { StudentProfile, AIStudyPlan } from '../types';
import { createAIStudyPlan } from '../services/curriculumService';

interface AIStudyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onProfileUpdate: (updated: StudentProfile) => void;
  onNavigateToStudy: (lessonId?: string) => void;
}

export const AIStudyPlanModal: React.FC<AIStudyPlanModalProps> = ({
  isOpen,
  onClose,
  student,
  onProfileUpdate,
  onNavigateToStudy,
}) => {
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [planMode, setPlanMode] = useState<'balanced' | 'weak_spots' | 'exam_sprint'>('balanced');
  const [studyPlan, setStudyPlan] = useState<AIStudyPlan>(() =>
    createAIStudyPlan(student, 'balanced', 2)
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const fresh = createAIStudyPlan(student, planMode, dailyHours);
      setStudyPlan(fresh);
      setIsGenerating(false);
    }, 600);
  };

  const handleToggleTask = (taskId: string) => {
    const updatedSchedule = studyPlan.dailySchedule.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          // Award XP
          const newXP = student.xp + t.xpReward;
          const newLevel = Math.floor(newXP / 250) + 1;
          onProfileUpdate({
            ...student,
            xp: newXP,
            level: newLevel,
          });
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });

    setStudyPlan({ ...studyPlan, dailySchedule: updatedSchedule });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 text-right">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold">
              <Calendar size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100">الخطة الدراسية الذكية (AI Study Plan)</h3>
              <span className="text-[10px] text-emerald-400 block -mt-0.5">
                مبنية على المنهج المعتمد ونقاط قوتك
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Plan Config Controls */}
        <div className="space-y-2 shrink-0 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold">ساعات الاستذكار اليومية:</span>
            <div className="flex gap-1.5">
              {[1.5, 2, 3].map((h) => (
                <button
                  key={h}
                  onClick={() => setDailyHours(h)}
                  className={`px-2.5 py-1 rounded-xl font-bold font-mono transition ${
                    dailyHours === h
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {h} ساعة
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
            <span className="text-slate-300 font-semibold">نمط الخطة:</span>
            <div className="flex gap-1">
              {[
                { id: 'balanced', label: 'متوازن' },
                { id: 'weak_spots', label: 'تركيز على نقاط الضعف' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPlanMode(m.id as any)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    planMode === m.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Advice Banner */}
        <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1 shrink-0">
          <span className="font-bold flex items-center gap-1">
            <Sparkles size={13} className="text-emerald-400" />
            <span>توجيه المرشد التربوي:</span>
          </span>
          <p className="text-[11px] leading-relaxed text-slate-300 italic">{studyPlan.aiAdvice}</p>
        </div>

        {/* Task Items Schedule */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
          <span className="text-xs font-bold text-slate-200 block mb-1">جدول مهام اليوم المقترحة:</span>
          {studyPlan.dailySchedule.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                task.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                  : 'bg-slate-800/50 border-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-600 hover:border-emerald-400 text-transparent'
                  }`}
                >
                  <CheckCircle size={14} className={task.completed ? 'block' : 'hidden'} />
                </button>

                <div className="text-right">
                  <span className={`text-xs font-bold block ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span className="font-mono">{task.timeSlot}</span>
                    <span>• {task.durationMinutes} دقيقة</span>
                  </div>
                </div>
              </div>

              <div className="text-left shrink-0">
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                  +{task.xpReward} XP
                </span>
                {task.recommendedLessonId && !task.completed && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToStudy(task.recommendedLessonId);
                    }}
                    className="block mt-1 text-[9px] text-emerald-400 font-bold hover:underline"
                  >
                    ابدأ الدرس ←
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            <RefreshCw size={13} className={isGenerating ? 'animate-spin' : ''} />
            <span>تحديث الخطة</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition"
          >
            اعتماد الخطة والبدء
          </button>
        </div>
      </div>
    </div>
  );
};
