import React from 'react';
import { Home, BookOpen, Sparkles, Award, Compass, User } from 'lucide-react';

export type TabKey =
  | 'home'
  | 'study'
  | 'skills'
  | 'tutor'
  | 'explore'
  | 'profile'
  | 'settings'
  | 'assessment'
  | 'life'
  | 'islamic'
  | 'games';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  weakCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, weakCount = 0 }) => {
  const tabs: { key: TabKey; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { key: 'home', label: 'الرئيسية', icon: Home },
    { key: 'study', label: 'المواد', icon: BookOpen },
    { key: 'skills', label: 'المهارات', icon: Award },
    { key: 'tutor', label: 'المرشد', icon: Sparkles },
    { key: 'explore', label: 'استكشف', icon: Compass },
    { key: 'profile', label: 'حسابي', icon: User },
  ];

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="shrink-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-1 py-1 z-40"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.key ||
            (tab.key === 'explore' && ['life', 'islamic', 'games'].includes(activeTab)) ||
            (tab.key === 'study' && activeTab === 'assessment');

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center justify-center flex-1 min-h-[46px] py-0.5 transition-colors relative ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`flex items-center justify-center w-9 h-6 rounded-full transition-all duration-200 mb-0.5 relative ${
                  isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
                }`}
              >
                <Icon size={18} />
                {tab.key === 'study' && weakCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
