import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Zap,
  BookHeart,
  Gift,
  ChevronRight,
  Award,
  Flame,
  Check
} from 'lucide-react';
import { StudentProfile } from '../types';

interface DailyChallengesCardProps {
  student: StudentProfile;
  onProfileUpdate: (updated: StudentProfile) => void;
  onNavigateToStudy: () => void;
  onNavigateToTutor: () => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{ size?: number; className?: string }>;
  current: number;
  target: number;
  unit: string;
  xpReward: number;
  category: 'study' | 'lesson' | 'tutor' | 'quran';
  actionLabel?: string;
  onAction?: () => void;
}

export const DailyChallengesCard: React.FC<DailyChallengesCardProps> = ({
  student,
  onProfileUpdate,
  onNavigateToStudy,
  onNavigateToTutor,
}) => {
  const todayKey = new Date().toISOString().split('T')[0];
  const storageKey = `khatwa_claimed_challenges_${student.id}_${todayKey}`;

  const [claimedIds, setClaimedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [justClaimedId, setJustClaimedId] = useState<string | null>(null);

  // Synchronize claimed items
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(claimedIds));
    } catch {
      // ignore
    }
  }, [claimedIds, storageKey]);

  // Define dynamic challenges based on student state
  const challenges: Challenge[] = [
    {
      id: 'ch_study_minutes',
      title: 'جلسة تركيز واستذكار',
      description: 'أكمل 15 دقيقة على الأقل من المذاكرة المركزة اليوم.',
      icon: Clock,
      current: student.completedMinutesToday,
      target: 15,
      unit: 'دقيقة',
      xpReward: 50,
      category: 'study',
    },
    {
      id: 'ch_complete_lesson',
      title: 'إنجاز درس تعليمي جديد',
      description: 'أكمل أي درس في مقرراتك المدرسية المعتمدة.',
      icon: BookOpen,
      current: Math.min(1, student.completedLessonIds.length),
      target: 1,
      unit: 'درس',
      xpReward: 80,
      category: 'lesson',
      actionLabel: 'تصفح الدروس',
      onAction: onNavigateToStudy,
    },
    {
      id: 'ch_ask_tutor',
      title: 'استشارة المرشد الذكي',
      description: 'ناقش مسألة أو اطلب تلميحاً من مرشد خطوة التربوي.',
      icon: Sparkles,
      current: 1, // Available for student engagement
      target: 1,
      unit: 'استشارة',
      xpReward: 40,
      category: 'tutor',
      actionLabel: 'فتح المرشد',
      onAction: onNavigateToTutor,
    },
    {
      id: 'ch_quran_portion',
      title: 'الورد القرآني اليومي',
      description: 'قراءة صفحتين من سورة الكهف والتدبر في معانيها.',
      icon: BookHeart,
      current: student.quranProgress?.isReadToday ? 2 : 1,
      target: 2,
      unit: 'صفحة',
      xpReward: 60,
      category: 'quran',
    },
  ];

  // Calculate completed count
  const completedChallenges = challenges.filter((c) => c.current >= c.target);
  const totalCompleted = completedChallenges.length;
  const overallPercentage = Math.round((totalCompleted / challenges.length) * 100);

  // Bonus for completing all challenges
  const allCompleted = totalCompleted === challenges.length;
  const bonusClaimed = claimedIds.includes('bonus_all_completed');

  // Claim reward handler
  const handleClaim = (challenge: Challenge) => {
    if (claimedIds.includes(challenge.id)) return;

    const newClaimed = [...claimedIds, challenge.id];
    setClaimedIds(newClaimed);
    setJustClaimedId(challenge.id);

    // Update student XP and level
    const newXP = student.xp + challenge.xpReward;
    const newLevel = Math.floor(newXP / 250) + 1;

    const updatedStudent: StudentProfile = {
      ...student,
      xp: newXP,
      level: newLevel,
    };

    onProfileUpdate(updatedStudent);

    setTimeout(() => {
      setJustClaimedId(null);
    }, 2500);
  };

  // Claim all challenges bonus
  const handleClaimBonus = () => {
    if (bonusClaimed || !allCompleted) return;

    const newClaimed = [...claimedIds, 'bonus_all_completed'];
    setClaimedIds(newClaimed);

    const bonusXP = 100;
    const newXP = student.xp + bonusXP;
    const newLevel = Math.floor(newXP / 250) + 1;

    const updatedStudent: StudentProfile = {
      ...student,
      xp: newXP,
      level: newLevel,
    };

    onProfileUpdate(updatedStudent);
  };

  return (
    <section className="p-4 rounded-3xl bg-slate-800/40 border border-slate-700/60 space-y-3.5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <Zap size={16} className="fill-slate-950" />
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>تحديات اليوم (Daily Challenges)</span>
              <span className="text-[10px] text-amber-400 font-bold font-mono">
                {totalCompleted}/{challenges.length}
              </span>
            </h3>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              أكمل المهام اليومية لربح نقاط خبرة XP مضاعفة
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-xl text-[10px] font-bold text-amber-300">
          <Flame size={13} className="text-orange-400 animate-pulse" />
          <span>+230 XP متاح</span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-300 font-medium">نسبة إنجاز مهام اليوم:</span>
          <span className="font-bold text-emerald-400 font-mono">{overallPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-emerald-400 via-teal-400 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-2.5">
        {challenges.map((challenge) => {
          const Icon = challenge.icon;
          const isDone = challenge.current >= challenge.target;
          const isClaimed = claimedIds.includes(challenge.id);
          const percent = Math.min(100, Math.round((challenge.current / challenge.target) * 100));

          return (
            <div
              key={challenge.id}
              className={`p-3 rounded-2xl border transition-all ${
                isClaimed
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
                  : isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5">
                {/* Challenge Details */}
                <div className="flex items-start gap-2.5 flex-1 text-right">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    <Icon size={14} />
                  </div>

                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-100">{challenge.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                        +{challenge.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-1">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {/* Claim / Status Action Button */}
                <div className="shrink-0 pt-0.5">
                  {isClaimed ? (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-800 text-slate-400 text-[10px] font-semibold">
                      <Check size={12} className="text-emerald-400" />
                      <span>تم الاستلام</span>
                    </span>
                  ) : isDone ? (
                    <button
                      onClick={() => handleClaim(challenge)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold text-[10px] shadow-sm transition active:scale-95 ${
                        justClaimedId === challenge.id
                          ? 'bg-emerald-400 text-slate-950 scale-105'
                          : 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 hover:brightness-110 animate-bounce'
                      }`}
                    >
                      <Gift size={12} />
                      <span>استلم +{challenge.xpReward} XP</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-900/60">
                      {challenge.current} / {challenge.target} {challenge.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Progress Bar per Challenge */}
              <div className="mt-2.5 space-y-1">
                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>التقدم:</span>
                  <span className="font-mono text-slate-300 font-semibold">{percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDone
                        ? 'bg-gradient-to-l from-emerald-400 to-teal-400'
                        : 'bg-gradient-to-l from-amber-400 to-orange-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonus Box for Completing All Challenges */}
      {allCompleted && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-emerald-500/20 border border-amber-500/40 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-400 shrink-0" />
            <div className="text-right">
              <span className="text-xs font-black text-slate-100 block">مكافأة إتقان جميع التحديات!</span>
              <span className="text-[10px] text-amber-300">أنجزت كافة مهام اليوم بنجاح استثنائي</span>
            </div>
          </div>

          {bonusClaimed ? (
            <span className="text-[10px] text-emerald-400 font-bold px-2 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              تم استلام +100 XP ✓
            </span>
          ) : (
            <button
              onClick={handleClaimBonus}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-[11px] shadow-sm transition active:scale-95 animate-pulse"
            >
              استلام +100 XP 🌟
            </button>
          )}
        </div>
      )}
    </section>
  );
};
