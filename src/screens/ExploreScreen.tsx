import React from 'react';
import {
  Compass,
  BookOpen,
  Sparkles,
  Award,
  Heart,
  Gamepad2,
  Moon,
  ChevronLeft,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { StudentProfile } from '../types';

interface ExploreScreenProps {
  student: StudentProfile;
  onNavigate: (section: 'study' | 'tutor' | 'skills' | 'life' | 'islamic' | 'games') => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ student, onNavigate }) => {
  const sections = [
    {
      id: 'study' as const,
      title: 'المناهج والمقررات الدراسية',
      desc: 'وحدات ودروس وشروحات واختبارات تفاعلية لمنهجك المعتمد.',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-400',
      tag: `${student.subjects.length} مواد مسجلة`,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'tutor' as const,
      title: 'مرشد خطوة الذكي (AI Mentor)',
      desc: 'توجيه سقراطي متطور، تحليل صور المسائل 📷، وحوار صوتي حي.',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-500',
      tag: 'مدعوم بنماذج Gemini',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    {
      id: 'skills' as const,
      title: 'المهارات والبرمجة واللغات',
      desc: 'بايثون، تطوير الويب، الإنجليزية التطبيقية، وأساسيات الذكاء الاصطناعي.',
      icon: Award,
      color: 'from-blue-500 to-cyan-400',
      tag: '5 مسارات تطويرية',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      id: 'life' as const,
      title: 'حياتي وصحتي (Life & Wellness)',
      desc: 'السوشيال ميديا بذكاء، عادات النوم والتركيز، والأمان الرقمي.',
      icon: Heart,
      color: 'from-pink-500 to-rose-400',
      tag: 'معلومة وتحدي يومي',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    },
    {
      id: 'islamic' as const,
      title: 'زاد المعرفة الإسلامية',
      desc: 'آيات وتدبر، أحاديث نبوية صحيحة موثقة، ومسابقات إسلامية هادفة.',
      icon: Moon,
      color: 'from-emerald-600 to-teal-600',
      tag: 'مخرجة ومحققة',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    },
    {
      id: 'games' as const,
      title: 'ألعاب خطوة (Khatwa Games)',
      desc: 'سباق سيارات 🏎️، تحديات الذاكرة والسرعة، ومغامرات معرفية ممتعة.',
      icon: Gamepad2,
      color: 'from-amber-500 to-orange-400',
      tag: 'ترفيه آمن وهادف',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 pb-16">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-sm">
            <Compass size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100">استكشف خطوة (Explore Hub)</h2>
            <span className="text-[10px] text-sky-400 block -mt-0.5">
              بوابتك الشاملة للتعلّم، المهارات، الصحة، والترفيه
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-amber-400">
          <Flame size={12} className="text-orange-400" />
          <span>{student.xp} XP</span>
        </div>
      </div>

      {/* Main Content List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-slate-700/60 shadow-sm text-right space-y-1.5">
          <span className="text-[10px] font-bold text-emerald-400 block">منصة خطوة التعليمية المتكاملة</span>
          <h3 className="text-xs font-bold text-slate-100">
            «تعلم. انمُ. استمتع. خذ خطوتك التالية.»
          </h3>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            جميع الأقسام مصممة لمساعدتك على التفوق الدراسي وبناء الشخصية المتوازنة بوعي وهدوء.
          </p>
        </div>

        {/* Section Cards */}
        <div className="space-y-2.5">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => onNavigate(sec.id)}
                className="w-full text-right p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition flex items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${sec.color} flex items-center justify-center text-slate-950 font-bold shrink-0 mt-0.5 shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{sec.title}</h4>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${sec.badgeColor}`}>
                        {sec.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{sec.desc}</p>
                  </div>
                </div>

                <ChevronLeft size={16} className="text-slate-500 group-hover:text-slate-200 transition-colors shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
