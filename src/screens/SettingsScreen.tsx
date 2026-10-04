import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Save,
  CheckCircle,
  Cloud,
  RefreshCw,
  Sparkles,
  Shield,
  BookOpen,
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';
import { StudentProfile, StudentSettings } from '../types';
import { saveStudentSettingsToCloud, loadStudentSettingsFromCloud, auth } from '../services/firebase';

interface SettingsScreenProps {
  student: StudentProfile;
  onBack?: () => void;
}

const DEFAULT_SETTINGS: StudentSettings = {
  studyRemindersEnabled: true,
  studyReminderTime: '17:00',
  studyDurationGoal: 45,
  soundEnabled: true,
  weekendRemindersEnabled: false,
  prayerAlertsEnabled: true,
  prayerTiming: 'before_10m',
  fajrEnabled: true,
  dhuhrEnabled: true,
  asrEnabled: true,
  maghribEnabled: true,
  ishaEnabled: true,
  athanTone: 'makkah',
};

const PRAYERS = [
  { id: 'fajr', key: 'fajrEnabled' as const, nameAr: 'صلاة الفجر', defaultTime: '04:45 ص' },
  { id: 'dhuhr', key: 'dhuhrEnabled' as const, nameAr: 'صلاة الظهر', defaultTime: '12:05 م' },
  { id: 'asr', key: 'asrEnabled' as const, nameAr: 'صلاة العصر', defaultTime: '03:30 م' },
  { id: 'maghrib', key: 'maghribEnabled' as const, nameAr: 'صلاة المغرب', defaultTime: '05:55 م' },
  { id: 'isha', key: 'ishaEnabled' as const, nameAr: 'صلاة العشاء', defaultTime: '07:15 م' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ student, onBack }) => {
  const [settings, setSettings] = useState<StudentSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Load preferences on mount from Firestore / LocalStorage
  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      const storageKey = `khatwa_settings_${student.id}`;
      const localData = localStorage.getItem(storageKey);
      if (localData) {
        try {
          setSettings(JSON.parse(localData));
        } catch {
          // ignore
        }
      }

      // Check Firestore
      try {
        const uid = auth.currentUser?.uid || student.id;
        const cloudData = await loadStudentSettingsFromCloud(uid);
        if (cloudData) {
          setSettings((prev) => ({ ...prev, ...cloudData }));
          localStorage.setItem(storageKey, JSON.stringify(cloudData));
        }
      } catch (err) {
        console.warn('Could not load settings from Firestore:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, [student.id]);

  // Handle Save to Firestore & Local Storage
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const storageKey = `khatwa_settings_${student.id}`;
    localStorage.setItem(storageKey, JSON.stringify(settings));

    try {
      const uid = auth.currentUser?.uid || student.id;
      const success = await saveStudentSettingsToCloud(uid, settings);
      setSaveSuccess(true);
      setLastSavedTime(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.warn('Error saving settings to cloud:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = <K extends keyof StudentSettings>(key: K, value: StudentSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <Bell size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100">تخصيص التنبيهات والإعدادات</h2>
            <span className="text-[10px] text-emerald-400 block -mt-0.5">
              مواعيد المذاكرة والصلاة · مزامنة Firestore
            </span>
          </div>
        </div>

        {/* Save button in header for quick access */}
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition shadow-sm"
        >
          {isSaving ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : saveSuccess ? (
            <CheckCircle size={13} className="text-emerald-950" />
          ) : (
            <Save size={13} />
          )}
          <span>{isSaving ? 'جاري الحفظ...' : saveSuccess ? 'تم الحفظ!' : 'حفظ في السحابة'}</span>
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status Alert if Saved */}
        {saveSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>تم حفظ تفضيلاتك بنجاح في قاعدة بيانات Firestore السحابية!</span>
            </div>
            {lastSavedTime && <span className="text-[10px] font-mono text-emerald-400/80">{lastSavedTime}</span>}
          </div>
        )}

        {/* Student Info Card */}
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-100 block">{student.name}</span>
            <span className="text-[11px] text-slate-400">{student.gradeAr}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-semibold">
            <Cloud size={12} />
            <span>متزامن مع Firestore</span>
          </div>
        </div>

        {/* SECTION 1: Daily Study Reminders */}
        <div className="p-4 rounded-3xl bg-slate-800/50 border border-slate-700/70 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock size={16} />
              </div>
              <div className="text-right">
                <h3 className="text-xs font-bold text-slate-100">تذكيرات المذاكرة اليومية</h3>
                <span className="text-[10px] text-slate-400">تخصيص وقت وجلسات الاستذكار</span>
              </div>
            </div>

            {/* Main Study Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.studyRemindersEnabled}
                onChange={(e) => updateSetting('studyRemindersEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>

          {settings.studyRemindersEnabled && (
            <div className="space-y-3.5 pt-1">
              {/* Reminder Time Picker */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50">
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-200 block">موعد التنبيه اليومي</span>
                  <span className="text-[10px] text-slate-400">إشعار لبدء جلسة الاستذكار</span>
                </div>
                <input
                  type="time"
                  value={settings.studyReminderTime}
                  onChange={(e) => updateSetting('studyReminderTime', e.target.value)}
                  className="bg-slate-800 border border-slate-600 text-slate-100 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Study Duration Goal Selector */}
              <div className="space-y-1.5 text-right">
                <span className="text-xs font-semibold text-slate-200 block">مدة جلسة المذاكرة المستهدفة</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { minutes: 25, label: '25 دقيقة (بومودورو)' },
                    { minutes: 45, label: '45 دقيقة (جلسة قياسية)' },
                    { minutes: 60, label: '60 دقيقة (جلسة عميقة)' },
                  ].map((item) => (
                    <button
                      key={item.minutes}
                      type="button"
                      onClick={() => updateSetting('studyDurationGoal', item.minutes)}
                      className={`p-2 rounded-xl border text-[10px] font-semibold transition ${
                        settings.studyDurationGoal === item.minutes
                          ? 'bg-amber-500/20 border-amber-500/70 text-amber-300 shadow-sm'
                          : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekend Reminders Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/40 border border-slate-700/40">
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-300 block">تنبيهات عطلة نهاية الأسبوع</span>
                  <span className="text-[10px] text-slate-400">إرسال تذكيرات يومي الجمعة والسبت</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weekendRemindersEnabled}
                  onChange={(e) => updateSetting('weekendRemindersEnabled', e.target.checked)}
                  className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500"
                />
              </div>

              {/* Sound & Vibration Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/40 border border-slate-700/40">
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-300 block">صوت التنبيه والاهتزاز</span>
                  <span className="text-[10px] text-slate-400">نغمة مميزة لتذكيرات المذاكرة</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                  className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Prayer Times Notifications */}
        <div className="p-4 rounded-3xl bg-slate-800/50 border border-slate-700/70 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Compass size={16} />
              </div>
              <div className="text-right">
                <h3 className="text-xs font-bold text-slate-100">تنبيهات مواعيد الصلاة</h3>
                <span className="text-[10px] text-slate-400">إشعارات الصلوات الخمس والاستعداد لها</span>
              </div>
            </div>

            {/* Main Prayer Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.prayerAlertsEnabled}
                onChange={(e) => updateSetting('prayerAlertsEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500" />
            </label>
          </div>

          {settings.prayerAlertsEnabled && (
            <div className="space-y-3.5 pt-1">
              {/* Alert Timing Selection */}
              <div className="space-y-1.5 text-right">
                <span className="text-xs font-semibold text-slate-200 block">توقيت التنبيه المفضل</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'at_time' as const, label: 'عند الأذان مباشرة' },
                    { id: 'before_10m' as const, label: 'قبل الأذان بـ 10 دقائق' },
                    { id: 'before_15m' as const, label: 'قبل الأذان بـ 15 دقيقة' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateSetting('prayerTiming', t.id)}
                      className={`p-2 rounded-xl border text-[10px] font-semibold transition ${
                        settings.prayerTiming === t.id
                          ? 'bg-teal-500/20 border-teal-500/70 text-teal-300 shadow-sm'
                          : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Prayer Toggles List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-200 block text-right">
                  حدد الصلوات المراد تفعيل تنبيهاتها:
                </span>
                <div className="space-y-1.5">
                  {PRAYERS.map((prayer) => {
                    const isChecked = settings[prayer.key];
                    return (
                      <div
                        key={prayer.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/50 border border-slate-700/40"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">{prayer.nameAr}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {prayer.defaultTime}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => updateSetting(prayer.key, e.target.checked)}
                          className="w-4 h-4 text-teal-500 bg-slate-800 border-slate-600 rounded focus:ring-teal-500 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Athan Tone Selector */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-center justify-between">
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-200 block">نغمة التنبيه</span>
                  <span className="text-[10px] text-slate-400">أسلوب صوت الأذان</span>
                </div>
                <select
                  value={settings.athanTone}
                  onChange={(e) => updateSetting('athanTone', e.target.value as any)}
                  className="bg-slate-800 border border-slate-600 text-slate-100 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
                >
                  <option value="makkah">أذان الحرم المكي</option>
                  <option value="madinah">أذان المسجد النبوي</option>
                  <option value="calm">نغمة هادئة ومختصرة</option>
                  <option value="standard">صوت تنبيه الهاتف القياسي</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Big Save Button at bottom */}
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Cloud size={16} />
          )}
          <span>حفظ الإعدادات والتفضيلات في سحابة Firestore</span>
        </button>
      </div>
    </div>
  );
};
