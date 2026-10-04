import React, { useState } from 'react';
import { UserCheck, Users, Plus, ChevronDown, Check } from 'lucide-react';
import { StudentProfile } from '../types';

interface ProfileSwitcherProps {
  currentStudent: StudentProfile;
  allProfiles: Record<string, StudentProfile>;
  onSwitchStudent: (id: string) => void;
  onOpenOnboarding: () => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  currentStudent,
  allProfiles,
  onSwitchStudent,
  onOpenOnboarding,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-right transition"
      >
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
          {currentStudent.name.slice(0, 1)}
        </div>
        <div className="text-right leading-tight">
          <p className="text-xs font-bold text-slate-100 truncate max-w-[110px]">{currentStudent.name}</p>
          <span className="text-[10px] text-slate-400 block truncate max-w-[110px]">{currentStudent.gradeAr}</span>
        </div>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl p-2 z-50 text-right">
            <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">تبديل ملف الطالب</span>
              <Users size={14} />
            </div>

            <div className="py-1 space-y-1">
              {Object.values(allProfiles).map((p) => {
                const isSelected = p.id === currentStudent.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchStudent(p.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-right p-2.5 rounded-xl transition flex items-center justify-between ${
                      isSelected ? 'bg-emerald-950/40 text-emerald-300 font-semibold' : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{p.name}</p>
                      <span className="text-[10px] text-slate-400 block">{p.gradeAr} · {p.xp} XP</span>
                    </div>
                    {isSelected && <Check size={14} className="text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-1.5 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenOnboarding();
                }}
                className="w-full text-right p-2.5 rounded-xl hover:bg-slate-800 text-emerald-400 text-xs font-medium flex items-center gap-2 transition"
              >
                <Plus size={14} />
                <span>إعداد طالب جديد (معالج 8 خطوات)</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
