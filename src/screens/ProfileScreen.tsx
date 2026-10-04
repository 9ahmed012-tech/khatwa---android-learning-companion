import React, { useState } from 'react';
import {
  User,
  Award,
  Zap,
  Flame,
  Shield,
  BookOpen,
  Share2,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Facebook,
  ExternalLink,
  Info,
  Heart,
  Clock,
  Settings as SettingsIcon,
  CheckCircle,
  Copy,
  ChevronLeft
} from 'lucide-react';
import { StudentProfile } from '../types';
import { ALL_SUBJECTS, ALL_SKILLS } from '../data/demoCurriculum';

interface ProfileScreenProps {
  student: StudentProfile;
  onNavigateToSettings: () => void;
  onNavigateToExplore: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  student,
  onNavigateToSettings,
  onNavigateToExplore,
}) => {
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const studentSubjects = ALL_SUBJECTS.filter((s) => student.subjects.includes(s.id));
  const studentSkills = ALL_SKILLS.filter((s) => student.skills.includes(s.id));

  // Developer contact details (Section 54)
  const CONTACT = {
    developerName: 'أحمد عادل',
    developerRole: 'Founder & Developer (صاحب الفكرة والمطور)',
    phone: '01140593878',
    whatsapp: 'https://wa.me/201140593878',
    telegram: 'https://t.me/Ahmed_Ebeid1',
    facebook: 'https://www.facebook.com/share/19iedrzTfr/',
    email: '9ahmed012@gmail.com',
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'تطبيق خُطوة (Khatwa) — رفيق التعلّم الذكي',
      text: 'جرّب تطبيق "خُطوة" التعليمي الذكي: مناهج دراسية، مرشد ذكي بأسلوب سقراطي، مهارات برمجية، وتطوير شخصي!\nفكرة وتطوير: أحمد عادل (2026)',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // ignore
      }
    } else {
      navigator.clipboard?.writeText(`${shareData.title}\n${shareData.text}`);
      setCopiedText('تم نسخ رابط ووصف التطبيق!');
      setTimeout(() => setCopiedText(null), 3000);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(`تم نسخ ${label}!`);
    setTimeout(() => setCopiedText(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 pb-16">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <User size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100">الملف الشخصي والحساب</h2>
            <span className="text-[10px] text-emerald-400 block -mt-0.5">
              بيانات الطالب · الإنجازات · مطور التطبيق
            </span>
          </div>
        </div>

        <button
          onClick={onNavigateToSettings}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition"
          title="الإعدادات"
        >
          <SettingsIcon size={16} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Copied Alert Toast */}
        {copiedText && (
          <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500 text-xs text-emerald-300 text-center font-semibold animate-fade-in">
            {copiedText}
          </div>
        )}

        {/* Profile Card */}
        <div className="p-4 rounded-3xl bg-slate-800/50 border border-slate-700/70 space-y-3.5 shadow-sm text-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shadow-emerald-500/20">
                {student.name.charAt(0)}
              </div>
              <div className="text-right">
                <h3 className="text-sm font-black text-slate-100">{student.name}</h3>
                <span className="text-[11px] text-emerald-400 font-semibold block">{student.gradeAr}</span>
                <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">{student.track}</span>
              </div>
            </div>

            <div className="text-center bg-slate-900/80 px-2.5 py-1.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">المستوى</span>
              <span className="text-sm font-black text-emerald-400 font-mono">{student.level}</span>
            </div>
          </div>

          {/* KPI Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-700/50 text-center">
            <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">نقاط XP</span>
              <span className="text-xs font-bold text-amber-400 font-mono">{student.xp}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">أيام الحماس</span>
              <span className="text-xs font-bold text-orange-400 font-mono">{student.streakDays} أيام 🔥</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">الدروس المنجزة</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{student.completedLessonIds.length}</span>
            </div>
          </div>
        </div>

        {/* Subjects Enrolled */}
        <div className="p-4 rounded-3xl bg-slate-800/40 border border-slate-700/60 space-y-2.5 text-right">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-100">المواد الدراسية الأساسية المعتمدة</h4>
            <span className="text-[10px] text-slate-400">{studentSubjects.length} مواد</span>
          </div>

          <div className="space-y-1.5">
            {studentSubjects.map((sub) => (
              <div
                key={sub.id}
                className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-slate-200">{sub.nameAr}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{sub.units.length} وحدات</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick App Actions (About, Contact Developer, Share) */}
        <div className="space-y-2">
          {/* About Khatwa Modal Trigger */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 transition flex items-center justify-between text-right text-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Info size={15} />
              </div>
              <div>
                <span className="font-bold text-slate-100 block">عن تطبيق خطوة (About Khatwa)</span>
                <span className="text-[10px] text-slate-400">فكرة التطبيق، الفلسفة، وحقوق الملكية</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-slate-500" />
          </button>

          {/* Contact Developer Modal Trigger */}
          <button
            onClick={() => setShowContactModal(true)}
            className="w-full p-3.5 rounded-2xl bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/30 transition flex items-center justify-between text-right text-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Phone size={15} />
              </div>
              <div>
                <span className="font-bold text-emerald-300 block">تواصل مع المطور (Contact Developer)</span>
                <span className="text-[10px] text-emerald-400/80">واتساب، اتصال، تيليجرام، فيسبوك، وإيميل</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-emerald-400" />
          </button>

          {/* Share App Button */}
          <button
            onClick={handleShareApp}
            className="w-full p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 transition flex items-center justify-between text-right text-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Share2 size={15} />
              </div>
              <div>
                <span className="font-bold text-slate-100 block">مشاركة تطبيق خطوة (Share Khatwa)</span>
                <span className="text-[10px] text-slate-400">شارك التطبيق مع أصدقائك وزملائك</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Authorship Footer (Section 53) */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-1">
          <p className="text-xs font-bold text-slate-200">
            فكرة وتطوير: <span className="text-emerald-400 font-black">{CONTACT.developerName}</span>
          </p>
          <p className="text-[10px] text-slate-400">
            Khatwa — Intelligent Learning Companion
          </p>
          <p className="text-[9px] text-slate-500 font-mono">
            © 2026 Ahmed Adel · جميع الحقوق محفوظة
          </p>
        </div>
      </div>

      {/* About Khatwa Modal (Section 51, 52, 53) */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-5 space-y-4 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  خـ
                </div>
                <h3 className="text-xs font-bold text-slate-100">عن تطبيق خُطوة (Khatwa)</h3>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                ✕ إغلاق
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>«خُطوة»</strong> هو تطبيق تعليمي ذكي ورفيق للتطوير الشخصي للطلاب، يجمع بين المناهج الدراسية، الإرشاد السقراطي الذكي بالذكاء الاصطناعي، المهارات البرمجية، الوعي الصحي والنفسي، والقيم الإسلامية الأصيلة.
              </p>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span className="font-bold text-emerald-400 block text-xs">فلسفة التطبيق:</span>
                <p className="text-[11px] text-slate-300 italic">
                  «تعلم. انمُ. استمتع. خذ خطوتك التالية.»
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1 text-[11px]">
                <p>
                  <strong>صاحب الفكرة والمطور:</strong> {CONTACT.developerName} ({CONTACT.developerRole})
                </p>
                <p className="text-slate-400">
                  مشروع تعليمي مستقل يهدف إلى دعم الطالب في بناء مستقبل مشرق ومتوازن علمياً وشخصياً.
                </p>
                <p className="text-slate-500 font-mono pt-1">
                  الإصدار: 1.0.0 · سنة الإصدار: 2026
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Contact Developer Modal (Section 54) */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-100">تواصل مع المطور: {CONTACT.developerName}</h3>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                ✕ إغلاق
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              يسعدنا دائماً استقبال استفساراتكم، مقترحاتكم، وتقاريركم لتطوير تطبيق خطوة:
            </p>

            <div className="space-y-2">
              {/* WhatsApp Button */}
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-full p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between transition shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  <span>محادثة عبر واتساب (WhatsApp)</span>
                </div>
                <ExternalLink size={14} />
              </a>

              {/* Phone Call Button */}
              <a
                href={`tel:${CONTACT.phone}`}
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-between border border-slate-700 transition"
              >
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-emerald-400" />
                  <span>اتصال هاتفي: {CONTACT.phone}</span>
                </div>
                <ExternalLink size={14} />
              </a>

              {/* Telegram Button */}
              <a
                href={CONTACT.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-full p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-between transition shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Send size={16} />
                  <span>قناة وتواصل تيليجرام (Telegram)</span>
                </div>
                <ExternalLink size={14} />
              </a>

              {/* Facebook Button */}
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-full p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-between transition shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Facebook size={16} />
                  <span>صفحة فيسبوك (Facebook)</span>
                </div>
                <ExternalLink size={14} />
              </a>

              {/* Email Button */}
              <a
                href={`mailto:${CONTACT.email}`}
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-between border border-slate-700 transition"
              >
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-amber-400" />
                  <span className="font-mono">{CONTACT.email}</span>
                </div>
                <ExternalLink size={14} />
              </a>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition mt-2"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
