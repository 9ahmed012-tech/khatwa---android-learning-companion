import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTabTitle?: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, activeTabTitle }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isFramed, setIsFramed] = useState<boolean>(true);
  const [batteryLevel] = useState<number>(88);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'م' : 'ص';
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${minutes} ${period}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 text-slate-100 selection:bg-emerald-600 selection:text-white">
      {/* Device Mode Toggle Bar (Visible on desktop/tablet) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-2 px-3 py-1.5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-300">تطبيق خطوة للأجهزة الذكية (Android Prototype)</span>
        </div>
        <button
          onClick={() => setIsFramed(!isFramed)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          title={isFramed ? 'التبديل إلى العرض الكامل' : 'التبديل إلى إطار هاتف أندرويد'}
        >
          {isFramed ? (
            <>
              <Maximize2 size={13} />
              <span>ملء الشاشة</span>
            </>
          ) : (
            <>
              <Smartphone size={13} />
              <span>إطار الهاتف</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container / Android Device */}
      <div
        className={`w-full transition-all duration-300 flex flex-col overflow-hidden bg-slate-900 ${
          isFramed
            ? 'sm:max-w-[420px] sm:h-[880px] sm:rounded-[44px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] relative'
            : 'max-w-2xl min-h-screen sm:rounded-2xl sm:my-4 sm:border sm:border-slate-800'
        }`}
      >
        {/* Android Punch-hole Camera (in framed mode) */}
        {isFramed && (
          <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-950 rounded-full z-50 border border-slate-800/80 shadow-inner" />
        )}

        {/* Android Status Bar */}
        <header className="w-full shrink-0 px-6 pt-3 pb-2 flex items-center justify-between text-xs font-medium text-slate-300 bg-slate-900/90 backdrop-blur select-none z-40 border-b border-slate-800/40">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <span>{currentTime || '9:41 ص'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-tight text-slate-400">5G</span>
            <Signal size={13} className="text-slate-300" />
            <Wifi size={13} className="text-slate-300" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-mono">{batteryLevel}%</span>
              <Battery size={14} className="text-emerald-400 fill-emerald-400/40" />
            </div>
          </div>
        </header>

        {/* Application Content Viewport */}
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative bg-slate-900 text-slate-100">
          {children}
        </main>

        {/* Android Gesture Bar / Bottom Bar */}
        <div className="shrink-0 w-full py-2 flex items-center justify-center bg-slate-950/90 backdrop-blur z-30">
          <div className="w-32 h-1 bg-slate-600 rounded-full opacity-60 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};
