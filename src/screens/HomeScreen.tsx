import React, { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Compass,
  ArrowLeft,
  BookOpen,
  Award,
  ChevronLeft,
  Moon,
  Sparkles,
  AlertCircle,
  Heart,
  Gamepad2
} from 'lucide-react';
import { StudentProfile, Subject, Lesson } from '../types';
import { ALL_SUBJECTS, ALL_SKILLS } from '../data/demoCurriculum';
import { getTodayPrayerTimes, formatRemainingTime } from '../utils/prayerTimes';
import { toggleQuranReadStatus } from '../services/storageService';
import { WeeklyStudyChart } from '../components/WeeklyStudyChart';
import { DailyChallengesCard } from '../components/DailyChallengesCard';

interface HomeScreenProps {
  student: StudentProfile;
  onNavigateToStudy: (subjectId?: string, lessonId?: string) => void;
  onNavigateToAssessment: () => void;
  onNavigateToTutor: (subjectName?: string) => void;
  onNavigateToSkills: () => void;
  onNavigateToSection?: (section: 'life' | 'islamic' | 'games' | 'explore') => void;
  onProfileUpdate: (updated: StudentProfile) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  student,
  onNavigateToStudy,
  onNavigateToAssessment,
  onNavigateToTutor,
  onNavigateToSkills,
  onNavigateToSection,
  onProfileUpdate,
}) => {
  const [prayerData, setPrayerData] = useState(() => getTodayPrayerTimes());
  const [showPrayersModal, setShowPrayersModal] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [studyMinutesRemaining, setStudyMinutesRemaining] = useState(student.todayGoalMinutes - student.completedMinutesToday);

  // Update prayer time every 60s
  useEffect(() => {
    const timer = setInterval(() => {
      setPrayerData(getTodayPrayerTimes());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Find current lesson object
  const currentLesson: { lesson?: Lesson; subject?: Subject } = (() => {
    for (const sub of ALL_SUBJECTS) {
      for (const unit of sub.units) {
        const found = unit.lessons.find((l) => l.id === student.currentLessonId);
        if (found) {
          return { lesson: found, subject: sub };
        }
      }
    }
    // Fallback first lesson of first student subject
    const firstSub = ALL_SUBJECTS.find((s) => student.subjects.includes(s.id)) || ALL_SUBJECTS[0];
    return {
      lesson: firstSub.units[0]?.lessons[0],
      subject: firstSub,
    };
  })();

  // Find current skill
  const currentSkill = ALL_SKILLS.find((s) => s.id === student.currentSkillId) || ALL_SKILLS[0];

  // Calculate overall progress across student's subjects
  const studentSubjects = ALL_SUBJECTS.filter((s) => student.subjects.includes(s.id));
  const totalLessons = studentSubjects.reduce((acc, sub) => {
    return acc + sub.units.reduce((uAcc, u) => uAcc + u.lessons.length, 0);
  }, 0);
  const completedLessonsCount = student.completedLessonIds.length;
  const overallPercentage = totalLessons > 0 ? Math.min(100, Math.round((completedLessonsCount / totalLessons) * 100)) : 0;

  // Handle toggling Quran read
  const handleQuranToggle = () => {
    const updated = toggleQuranReadStatus(student.id);
    if (updated) {
      onProfileUpdate(updated);
    }
  };

  // Determine greeting based on local hour
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'صباح الخير' : currentHour < 17 ? 'مساء الخير' : 'مرحباً بك';

  // Weak area recommendation if any exists
  const weakAssessments = Object.values(student.assessmentResults).filter((a) => a.weakAreas && a.weakAreas.length > 0);
  const primaryWeakAssessment = weakAssessments[0];

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* 1. Header Greeting & XP / Level Badges */}
      <section className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-1.5">
            <span>{greeting}، {student.name.split(' ')[0]}</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {student.gradeAr} · {student.track || student.educationSystem}
          </p>
        </div>

        {/* Gamification Stats: XP and Level */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToSkills}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition"
            title="النقاط التراكمية"
          >
            <Zap size={14} className="fill-amber-400" />
            <span className="text-xs font-black">{student.xp}</span>
            <span className="text-[10px] text-amber-500/80">XP</span>
          </button>

          <button
            onClick={onNavigateToSkills}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition"
            title="أيام الالتزام"
          >
            <Flame size={14} className="fill-orange-400 text-orange-400" />
            <span className="text-xs font-black">{student.streakDays}</span>
          </button>
        </div>
      </section>

      {/* 2. Overall Learning Progress Bar */}
      <section className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-200">التقدم الدراسي العام</span>
          <span className="font-bold text-emerald-400">{overallPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-emerald-400 to-teal-500 transition-all duration-500 rounded-full"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
          <span>{completedLessonsCount} من أصل {totalLessons} درساً مكتملاً</span>
          <span className="text-slate-400">المستوى {student.level}</span>
        </div>
      </section>

      {/* 3. Hero Card: Current Lesson & "Continue Learning" */}
      <section className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-emerald-900/40 via-slate-800/80 to-slate-900 border border-emerald-500/30 shadow-lg">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-400 tracking-wide">الدرس الحالي</span>
            <span className="text-[11px] text-slate-400">
              {currentLesson.lesson?.estimatedMinutes || 20} دقيقة
            </span>
          </div>

          <div>
            <h2 className="text-base font-black text-slate-100">
              {currentLesson.subject?.nameAr} — {currentLesson.lesson?.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {currentLesson.lesson?.content.summaryPoints[0] || 'واصل التقدم واكتساب نقاط الخبرة.'}
            </p>
          </div>

          <button
            onClick={() => onNavigateToStudy(currentLesson.subject?.id, currentLesson.lesson?.id)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 transition active:scale-[0.98]"
          >
            <Play size={16} className="fill-slate-950" />
            <span>متابعة التعلّم</span>
          </button>
        </div>
      </section>

      {/* 4. Today's Goal Card */}
      <section className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-slate-400 block">هدف اليوم الدراسي</span>
          <p className="text-xs font-bold text-slate-100">
            {student.todayGoalSubject} — {student.todayGoalMinutes} دقيقة
          </p>
          <p className="text-[11px] text-slate-400">
            أنجزت {student.completedMinutesToday} دقيقة حتى الآن
          </p>
        </div>

        <button
          onClick={() => {
            if (student.completedMinutesToday < student.todayGoalMinutes) {
              const updated = {
                ...student,
                completedMinutesToday: Math.min(student.todayGoalMinutes, student.completedMinutesToday + 10),
                xp: student.xp + 15,
              };
              onProfileUpdate(updated);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
            student.completedMinutesToday >= student.todayGoalMinutes
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
          }`}
        >
          {student.completedMinutesToday >= student.todayGoalMinutes ? (
            <>
              <CheckCircle2 size={15} />
              <span>مكتمل اليوم</span>
            </>
          ) : (
            <>
              <Clock size={14} />
              <span>+10 د مذاكرة</span>
            </>
          )}
        </button>
      </section>

      {/* 5. Daily Challenges System with Visual Progress Bars & Extra XP */}
      <DailyChallengesCard
        student={student}
        onProfileUpdate={onProfileUpdate}
        onNavigateToStudy={() => onNavigateToStudy()}
        onNavigateToTutor={() => onNavigateToTutor()}
      />

      {/* 6. 7-Day Study Time & Completed Lessons Bar Chart (Recharts) */}
      <WeeklyStudyChart
        stats={student.weeklyStats}
        todayMinutes={student.completedMinutesToday}
        todayLessons={Math.max(1, student.completedLessonIds.length % 3 + 1)}
      />

      {/* 6. Dual Cards: Next Prayer & Quran Progress */}
      <section className="grid grid-cols-2 gap-3">
        {/* Next Prayer Card */}
        <div
          onClick={() => setShowPrayersModal(true)}
          className="p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/60 cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-medium text-sky-400">الصلاة القادمة</span>
              <Moon size={14} className="text-sky-400" />
            </div>
            <p className="text-xs font-bold text-slate-100">{prayerData.nextPrayer.nameAr}</p>
          </div>
          <div className="mt-2 text-[11px] text-slate-300 font-medium">
            {prayerData.nextPrayer.remainingMinutes !== undefined
              ? formatRemainingTime(prayerData.nextPrayer.remainingMinutes)
              : prayerData.nextPrayer.timeString}
          </div>
        </div>

        {/* Quran Progress Card */}
        <div
          onClick={handleQuranToggle}
          className="p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/60 cursor-pointer transition flex flex-col justify-between relative group"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-medium text-emerald-400">الورد القرآني</span>
              <BookOpen size={14} className="text-emerald-400" />
            </div>
            <p className="text-xs font-bold text-slate-100 truncate">{student.quranProgress.currentSurah}</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-300 font-mono">ص {student.quranProgress.currentPage}</span>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition ${
              student.quranProgress.isReadToday
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-slate-600 text-transparent'
            }`}>
              <CheckCircle2 size={12} className={student.quranProgress.isReadToday ? 'opacity-100' : 'opacity-0'} />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Current Skill Card */}
      <section className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">المهارة الحالية</span>
          </div>
          <button
            onClick={onNavigateToSkills}
            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            <span>كل المهارات</span>
            <ChevronLeft size={13} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-100">{currentSkill.titleAr}</p>
            <p className="text-[11px] text-slate-400">المستوى {currentSkill.level}</p>
          </div>
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-emerald-400">{currentSkill.currentXP}</span>
            <span className="text-[10px] text-slate-400"> / {currentSkill.maxXP} XP</span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${Math.round((currentSkill.currentXP / currentSkill.maxXP) * 100)}%` }}
          />
        </div>
      </section>

      {/* 7. Discover More in Khatwa (Life, Islamic, Games) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-200">استكشف المزيد في خطوة</span>
          {onNavigateToSection && (
            <button
              onClick={() => onNavigateToSection('explore')}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <span>عرض الكل</span>
              <ChevronLeft size={13} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Life & Wellness */}
          <button
            onClick={() => onNavigateToSection?.('life')}
            className="p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 text-right space-y-1.5 transition active:scale-[0.98]"
          >
            <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
              <Heart size={14} />
            </div>
            <span className="text-xs font-bold text-slate-100 block">حياتي وصحتي</span>
            <span className="text-[9px] text-slate-400 block leading-tight">عادات وسوشيال ميديا</span>
          </button>

          {/* Islamic Knowledge */}
          <button
            onClick={() => onNavigateToSection?.('islamic')}
            className="p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 text-right space-y-1.5 transition active:scale-[0.98]"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <BookOpen size={14} />
            </div>
            <span className="text-xs font-bold text-slate-100 block">زاد المعرفة</span>
            <span className="text-[9px] text-slate-400 block leading-tight">أحاديث وتدبر ومسابقات</span>
          </button>

          {/* Games */}
          <button
            onClick={() => onNavigateToSection?.('games')}
            className="p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 text-right space-y-1.5 transition active:scale-[0.98]"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Gamepad2 size={14} />
            </div>
            <span className="text-xs font-bold text-slate-100 block">ألعاب خطوة</span>
            <span className="text-[9px] text-slate-400 block leading-tight">سباق سيارات وتحديات</span>
          </button>
        </div>
      </section>

      {/* 7. Weak Area Diagnostic Recommendation Banner (if diagnosed) */}
      {primaryWeakAssessment && (
        <section className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400">
            <AlertCircle size={15} />
            <span className="text-xs font-bold">توصية تشخيصية لمعالجة نقطة ضعف</span>
          </div>
          <p className="text-xs text-slate-200 font-medium">
            {primaryWeakAssessment.subjectNameAr}: {primaryWeakAssessment.weakAreas[0]}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {primaryWeakAssessment.recommendation}
          </p>
          <div className="pt-1 flex gap-2">
            <button
              onClick={() => onNavigateToTutor(primaryWeakAssessment.subjectNameAr)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition"
            >
              <Sparkles size={12} />
              <span>اطلب مساعدة المرشد الذكي</span>
            </button>
            <button
              onClick={onNavigateToAssessment}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
            >
              عرض تقرير المستوى
            </button>
          </div>
        </section>
      )}

      {/* 8. Ask Socratic AI Tutor Quick Action */}
      <section className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-100">مرشد خطوة الذكي</p>
            <p className="text-[11px] text-slate-400">توجيه سقراطي وتلميحات خطوة بخطوة</p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTutor()}
          className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1"
        >
          <span>تحدث للمرشد</span>
          <ChevronLeft size={14} />
        </button>
      </section>

      {/* Prayer Schedule Modal */}
      {showPrayersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">مواقيت الصلاة اليومية</h3>
              <button
                onClick={() => setShowPrayersModal(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                إغلاق ✕
              </button>
            </div>
            <div className="space-y-2">
              {prayerData.prayers.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl flex items-center justify-between text-xs ${
                    p.isNext
                      ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-bold'
                      : p.isPassed
                      ? 'text-slate-500 bg-slate-800/20'
                      : 'text-slate-200 bg-slate-800/40'
                  }`}
                >
                  <span>{p.nameAr}</span>
                  <div className="flex items-center gap-2">
                    {p.isNext && <span className="text-[10px] text-emerald-400">(القادمة)</span>}
                    <span className="font-mono">{p.timeString}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              "إن الصلاة كانت على المؤمنين كتاباً موقوتاً"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
