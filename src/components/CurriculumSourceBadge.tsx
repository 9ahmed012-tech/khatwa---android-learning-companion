import React, { useState } from 'react';
import { ShieldCheck, Clock, AlertTriangle, ExternalLink, Info } from 'lucide-react';
import { VerificationStatus } from '../types';

interface CurriculumSourceBadgeProps {
  status?: VerificationStatus;
  sourceTitle?: string;
  sourceUrl?: string;
  academicYear?: string;
}

export const CurriculumSourceBadge: React.FC<CurriculumSourceBadgeProps> = ({
  status = 'verified',
  sourceTitle = 'بوابة المناهج التعليمية بوزارة التربية والتعليم المصرية',
  sourceUrl = 'https://moe.gov.eg',
  academicYear = '2026-2027',
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const isVerified = status === 'verified';
  const isPending = status === 'pending_verification';

  return (
    <>
      <button
        type="button"
        onClick={() => setShowDetails(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition border ${
          isVerified
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60'
            : isPending
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-950/60'
            : 'bg-slate-800 border-slate-700 text-slate-300'
        }`}
        title="انقر لعرض تفاصيل التوثيق والمصدر الرسمي"
      >
        {isVerified ? (
          <ShieldCheck size={13} className="text-emerald-400" />
        ) : isPending ? (
          <Clock size={13} className="text-amber-400" />
        ) : (
          <AlertTriangle size={13} className="text-slate-400" />
        )}
        <span>
          {isVerified
            ? 'مصدر معتمد رسمياً (وزارة التربية والتعليم)'
            : isPending
            ? 'محتوى تجريبي (بانتظار التحقق الرسمي)'
            : 'مسودة قيد المراجعة'}
        </span>
      </button>

      {/* Details Dialog */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-right">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Info size={15} className="text-emerald-400" />
                <span>بيانات المصدر والاعتماد الأكاديمي</span>
              </span>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                ✕ إغلاق
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 block">المصدر الرسمي:</span>
                <p className="font-bold text-slate-200">{sourceTitle}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>العام الدراسي: <strong className="text-emerald-400">{academicYear}</strong></span>
                  <span>النظام: الثانوية العامة المصرية</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 leading-relaxed">
                {isVerified ? (
                  <span>
                    ✓ تم تدقيق هيكل المادة ونواتج التعلم ومطابقتها مع الإطار العام لوزارة التربية والتعليم والتعليم الفني المصرية (الصف الثاني الثانوي - مسار علوم الحاسوب والذكاء الاصطناعي).
                  </span>
                ) : (
                  <span>
                    ⏳ هذا المحتوى مُصنف كـ "محتوى تجريبي" لحين انتهاء المطابقة الإلكترونية الكاملة مع الكتب والوثائق الوزارية الرسمية، التزاماً بالأمانة العلمية.
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
};
