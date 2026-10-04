import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Sparkles, ChevronLeft, ShieldCheck, X } from 'lucide-react';
import { searchCurriculum } from '../services/curriculumService';
import { CurriculumSearchResult } from '../types';

interface CurriculumSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentSubjectIds?: string[];
  onSelectLesson: (subjectId: string, lessonId: string) => void;
  onAskTutorAboutLesson?: (subjectName: string, lessonTitle: string) => void;
}

export const CurriculumSearchModal: React.FC<CurriculumSearchModalProps> = ({
  isOpen,
  onClose,
  studentSubjectIds,
  onSelectLesson,
  onAskTutorAboutLesson,
}) => {
  const [query, setQuery] = useState<string>('');

  const searchResults: CurriculumSearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    return searchCurriculum(query, studentSubjectIds);
  }, [query, studentSubjectIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 text-right">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Search size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100">البحث في المنهج المعتمد</h3>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                ابحث عن المفاهيم، الدروس، ونواتج التعلم
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative shrink-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب كلمة مفتاحية (مثال: المتغيرات، التشبيه، الدستور، الخوارزميات)..."
            className="w-full bg-slate-800/80 border border-slate-750 focus:border-emerald-500 text-slate-100 text-xs rounded-2xl py-3 pr-10 pl-3 focus:outline-none transition placeholder:text-slate-500"
            autoFocus
          />
          <Search size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-slate-500 space-y-1">
              <BookOpen size={28} className="mx-auto text-slate-600 mb-2" />
              <p className="text-xs font-semibold">ابحث في مقرراتك المدرسية المعتمدة</p>
              <p className="text-[10px]">اللغة العربية، الإنجليزية، التاريخ، البرمجة والذكاء الاصطناعي</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-1">
              <p className="text-xs font-bold text-slate-300">لم يتم العثور على نتائج مطابقة لـ "{query}"</p>
              <p className="text-[10px] text-slate-500">جرب البحث بكلمة مرادفة أو راجع الفهرس في قسم المواد</p>
            </div>
          ) : (
            searchResults.map((item) => (
              <div
                key={item.lessonId}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    {item.subjectNameAr}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.unitTitle}
                  </span>
                </div>

                <h4 className="text-xs font-black text-slate-100">{item.lessonTitle}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed font-arabic">
                  {item.matchSnippet}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-700/40">
                  {onAskTutorAboutLesson && (
                    <button
                      onClick={() => {
                        onClose();
                        onAskTutorAboutLesson(item.subjectNameAr, item.lessonTitle);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold flex items-center gap-1 transition"
                    >
                      <Sparkles size={11} />
                      <span>اسأل المرشد الذكي</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onClose();
                      onSelectLesson(item.subjectId, item.lessonId);
                    }}
                    className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold flex items-center gap-1 transition shadow-sm"
                  >
                    <span>فتح الدرس</span>
                    <ChevronLeft size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
