import React, { useState } from 'react';
import {
  Heart,
  Moon,
  Clock,
  ShieldCheck,
  Brain,
  Droplets,
  Smartphone,
  Bookmark,
  CheckCircle,
  Share2,
  Sparkles,
  Zap,
  AlertCircle,
  ArrowRight,
  Filter
} from 'lucide-react';
import { StudentProfile, LifeTip } from '../types';
import { LIFE_TIPS_DATA } from '../data/lifeContent';

interface LifeWellnessScreenProps {
  student: StudentProfile;
  onProfileUpdate: (updated: StudentProfile) => void;
  onBack?: () => void;
}

export const LifeWellnessScreen: React.FC<LifeWellnessScreenProps> = ({
  student,
  onProfileUpdate,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTip, setActiveTip] = useState<LifeTip | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [savedTips, setSavedTips] = useState<string[]>(student.savedLifeTips || []);

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'tech_habits', label: '📱 السوشيال ميديا' },
    { id: 'sleep', label: '🌙 النوم والتركيز' },
    { id: 'time_mgmt', label: '⏳ إدارة الوقت' },
    { id: 'cyber_safety', label: '🛡️ الأمان الرقمي' },
    { id: 'mindset', label: '🧠 عقلية النمو' },
    { id: 'nutrition', label: '💧 الصحة والنشاط' },
  ];

  const filteredTips = selectedCategory === 'all'
    ? LIFE_TIPS_DATA
    : LIFE_TIPS_DATA.filter((t) => t.category === selectedCategory);

  const toggleSaveTip = (tipId: string) => {
    const isSaved = savedTips.includes(tipId);
    const updated = isSaved ? savedTips.filter((id) => id !== tipId) : [...savedTips, tipId];
    setSavedTips(updated);
    onProfileUpdate({
      ...student,
      savedLifeTips: updated,
    });
  };

  const handleCompleteChallenge = (tip: LifeTip) => {
    if (!tip.challenge || completedChallenges.includes(tip.id)) return;

    setCompletedChallenges((prev) => [...prev, tip.id]);
    const xpBonus = tip.challenge.xpReward;
    const newXP = student.xp + xpBonus;
    const newLevel = Math.floor(newXP / 250) + 1;

    onProfileUpdate({
      ...student,
      xp: newXP,
      level: newLevel,
    });
  };

  const handleShare = async (tip: LifeTip) => {
    const text = `💡 معلومة قيّمة من تطبيق خطوة: ${tip.title}\n${tip.practicalTip}\n#تطبيق_خطوة #تعلم_بذكاء`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: tip.title,
          text,
        });
      } catch {
        // ignore share cancellation
      }
    } else {
      navigator.clipboard?.writeText(text);
      alert('تم نسخ النص للمشاركة!');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 pb-16">
      {/* Top Header */}
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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <Heart size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100">حياتي وصحتي (Life & Wellness)</h2>
            <span className="text-[10px] text-rose-400 block -mt-0.5">
              عادات رقمية ذكية · تنظيم الوقت · التوازن النفسي
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 px-2 py-1 rounded-xl text-[10px] font-bold text-rose-300">
          <span>{savedTips.length} محفوظة</span>
        </div>
      </div>

      {/* Main Scroll Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Educational Health Disclaimer */}
        <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2 text-right">
          <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            محتوى توعوي وتربوي لبناء عادات صحية وإيجابية — ليس بديلاً عن التشخيص الطبي أو الإرشاد المهني المتخصص.
          </p>
        </div>

        {/* Hero Card: Today's Highlighted Micro-Lesson ("معلومة اليوم") */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-800/80 to-slate-900 border border-rose-500/30 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30">
              معلومة اليوم المركزة 🌟
            </span>
            <span className="text-[10px] text-slate-400 font-mono">قراءة في دقيقة</span>
          </div>

          <h3 className="text-sm font-black text-slate-100 leading-snug">
            {LIFE_TIPS_DATA[0].title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
            {LIFE_TIPS_DATA[0].summary}
          </p>

          <div className="pt-1 flex items-center justify-between border-t border-slate-700/40">
            <div className="text-[10px] text-rose-300 font-semibold flex items-center gap-1">
              <Zap size={12} />
              <span>تحدي: {LIFE_TIPS_DATA[0].challenge?.title}</span>
            </div>

            <button
              onClick={() => setActiveTip(LIFE_TIPS_DATA[0])}
              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold transition shadow-sm"
            >
              قراءة كاملة
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedCategory === c.id
                  ? 'bg-rose-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 border border-slate-700/50 hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Micro-lessons Grid */}
        <div className="space-y-3">
          {filteredTips.map((tip) => {
            const isSaved = savedTips.includes(tip.id);
            const isDone = completedChallenges.includes(tip.id);

            return (
              <div
                key={tip.id}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition space-y-2 text-right"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-[10px] text-rose-400 font-semibold">{tip.categoryAr}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleSaveTip(tip.id)}
                      className={`p-1.5 rounded-lg transition ${
                        isSaved ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={isSaved ? 'إزالة من المحفوظات' : 'حفظ'}
                    >
                      <Bookmark size={15} className={isSaved ? 'fill-amber-400' : ''} />
                    </button>

                    <button
                      onClick={() => handleShare(tip)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition"
                      title="مشاركة"
                    >
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-100">{tip.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{tip.summary}</p>

                {/* Practical Tip Box */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-emerald-300">
                  <span className="font-bold text-emerald-400 block mb-0.5">💡 خطوة عملية اليوم:</span>
                  <span>{tip.practicalTip}</span>
                </div>

                {/* Challenge Button if present */}
                {tip.challenge && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-amber-400 font-mono">
                      +{tip.challenge.xpReward} XP خبرة
                    </span>

                    {isDone ? (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle size={13} />
                        <span>أكملت التحدي بنجاح!</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCompleteChallenge(tip)}
                        className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold transition"
                      >
                        إتمام التحدي الآن
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Tip Modal */}
      {activeTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-5 space-y-4 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] text-rose-400 font-bold">{activeTip.categoryAr}</span>
              <button
                onClick={() => setActiveTip(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                ✕ إغلاق
              </button>
            </div>

            <h3 className="text-sm font-black text-slate-100">{activeTip.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{activeTip.content}</p>

            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
              <span className="font-bold text-emerald-400 block mb-1">الخلاصة والتطبيق:</span>
              <span>{activeTip.practicalTip}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleShare(activeTip)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                مشاركة
              </button>
              <button
                onClick={() => setActiveTip(null)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
