import React, { useState } from 'react';
import {
  Award,
  Zap,
  Flame,
  CheckCircle,
  Lock,
  ChevronLeft,
  Star,
  Trophy,
  Code,
  Languages,
  Sparkles,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { StudentProfile, SkillItem, SkillMilestone } from '../types';
import { ALL_SKILLS } from '../data/demoCurriculum';
import { saveActiveProfile } from '../services/storageService';

interface SkillsScreenProps {
  student: StudentProfile;
  onProfileUpdate: (updated: StudentProfile) => void;
  onNavigateToTutor: (subjectName?: string) => void;
}

export const SkillsScreen: React.FC<SkillsScreenProps> = ({
  student,
  onProfileUpdate,
  onNavigateToTutor,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(
    student.currentSkillId || ALL_SKILLS[0].id
  );
  const [activeMilestone, setActiveMilestone] = useState<SkillMilestone | null>(null);

  const currentSkill = ALL_SKILLS.find((s) => s.id === selectedSkillId) || ALL_SKILLS[0];

  // Calculate Next Level XP Threshold
  const currentLevelXpBase = (student.level - 1) * 250;
  const nextLevelXpTarget = student.level * 250;
  const levelProgress = Math.min(100, Math.round(((student.xp - currentLevelXpBase) / 250) * 100));

  // Handle Completing a Skill Milestone
  const handleCompleteMilestone = (milestone: SkillMilestone) => {
    const updated = {
      ...student,
      xp: student.xp + milestone.xpValue,
      level: Math.floor((student.xp + milestone.xpValue) / 250) + 1,
    };
    milestone.isUnlocked = true;
    onProfileUpdate(updated);
    saveActiveProfile(updated);
    setActiveMilestone(null);
  };

  const badges = [
    { title: 'وسام الانطلاقة الأولى', desc: 'أتم أول خطوة في مساره التعليمي', isUnlocked: true, icon: Star },
    { title: 'وسام الالتزام الأسبوعي', desc: 'حافظ على سلسلة مذاكرة لأكثر من 3 أيام', isUnlocked: student.streakDays >= 3, icon: Flame },
    { title: 'وسام مبرمج المستقبل', desc: 'تقدم في مهارة برمجة بايثون', isUnlocked: student.skills.includes('skill_python'), icon: Code },
    { title: 'وسام المفكر المستقل', desc: 'أجرى تقييماً تشخيصياً وحدد نقاط قوته', isUnlocked: Object.keys(student.assessmentResults).length > 0, icon: ShieldCheck },
  ];

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Gamification Level & XP Overview Card */}
      <section className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-800/80 to-slate-900 border border-amber-500/30 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-xl">
              {student.level}
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">المستوى الحالي</span>
              <h2 className="text-sm font-black text-slate-100">المتعلم المتقدم — المستوى {student.level}</h2>
            </div>
          </div>

          <div className="text-left">
            <span className="text-sm font-black text-amber-400 font-mono">{student.xp}</span>
            <span className="text-xs text-slate-400"> / {nextLevelXpTarget} XP</span>
          </div>
        </div>

        {/* Level progress bar */}
        <div>
          <div className="w-full h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-amber-400 to-yellow-500 rounded-full transition-all duration-300"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
            <span>متبقي {nextLevelXpTarget - student.xp} XP للوصول للمستوى {student.level + 1}</span>
            <span>{levelProgress}%</span>
          </div>
        </div>
      </section>

      {/* Skills Selector */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300">مسارات المهارات الإضافية</h3>
          <span className="text-[10px] text-slate-400">نظام تعلم تلعيبي</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ALL_SKILLS.map((sk) => {
            const isSelected = sk.id === selectedSkillId;
            return (
              <button
                key={sk.id}
                onClick={() => setSelectedSkillId(sk.id)}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/40'
                }`}
              >
                <span>{sk.titleAr}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Skill Roadmap / Progression */}
      <section className="p-4 rounded-3xl bg-slate-800/40 border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">{currentSkill.titleAr}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{currentSkill.description}</p>
          </div>
          <div className="text-left shrink-0">
            <span className="text-xs font-mono font-bold text-emerald-400">المستوى {currentSkill.level}</span>
          </div>
        </div>

        {/* Milestones list */}
        <div className="space-y-2 pt-2">
          {currentSkill.milestones.map((m, idx) => {
            const isUnlocked = m.isUnlocked;
            return (
              <div
                key={m.id}
                onClick={() => setActiveMilestone(m)}
                className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                  isUnlocked
                    ? 'bg-slate-800/50 border-emerald-500/30 hover:bg-slate-800'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isUnlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? <CheckCircle size={15} /> : <Lock size={13} />}
                  </div>

                  <div>
                    <p className={`text-xs font-semibold ${isUnlocked ? 'text-slate-200' : 'text-slate-400'}`}>
                      {m.title}
                    </p>
                    <span className="text-[10px] text-amber-400 font-mono block">+{m.xpValue} XP عند الإنجاز</span>
                  </div>
                </div>

                <ChevronLeft size={15} className="text-slate-500" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges / Achievements Collection */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300">الأوسمة والإنجازات (Badges)</h3>
          <span className="text-[10px] text-slate-400">
            {badges.filter((b) => b.isUnlocked).length} من {badges.length} مكتمل
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between ${
                  b.isUnlocked
                    ? 'bg-slate-800/40 border-amber-500/30 text-slate-200 shadow-sm'
                    : 'bg-slate-900/30 border-slate-800/60 opacity-40 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    b.isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-600'
                  }`}>
                    <Icon size={16} />
                  </div>
                  {b.isUnlocked && <CheckCircle size={14} className="text-emerald-400" />}
                </div>

                <div>
                  <h4 className="text-xs font-bold leading-snug">{b.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Milestone Practice Modal */}
      {activeMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-emerald-400 font-semibold">{currentSkill.titleAr}</span>
                <h3 className="text-xs font-bold text-slate-100">{activeMilestone.title}</h3>
              </div>
              <button onClick={() => setActiveMilestone(null)} className="text-xs text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              هذه المرحلة تهدف إلى ترسيخ مهارة "{activeMilestone.title}" عبر التفكير التطبيقي.
            </p>

            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
              <span>مكافأة الإنجاز:</span>
              <span className="font-bold font-mono">+{activeMilestone.xpValue} XP</span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleCompleteMilestone(activeMilestone)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                تأكيد إنجاز المرحلة وحصد {activeMilestone.xpValue} XP
              </button>
              <button
                onClick={() => {
                  setActiveMilestone(null);
                  onNavigateToTutor(currentSkill.titleAr);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              >
                تدرب على هذه المهارة مع المرشد الذكي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
