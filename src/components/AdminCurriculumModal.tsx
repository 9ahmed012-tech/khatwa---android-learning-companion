import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Plus,
  ShieldCheck,
  Clock,
  CheckCircle,
  X,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { CurriculumSource, VerificationStatus } from '../types';
import {
  getCurriculumSources,
  addCurriculumSource,
  updateCurriculumSourceStatus,
} from '../data/curriculumSources';
import { simulateCurriculumDocImport } from '../services/curriculumService';

interface AdminCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCurriculumModal: React.FC<AdminCurriculumModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sources, setSources] = useState<CurriculumSource[]>(() => getCurriculumSources());
  const [activeTab, setActiveTab] = useState<'sources' | 'import_doc'>('sources');

  // New source form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('البرمجة والذكاء الاصطناعي');
  const [newRef, setNewRef] = useState('');
  const [newStatus, setNewStatus] = useState<VerificationStatus>('verified');

  // Doc import state
  const [docFileName, setDocFileName] = useState('منهج_البرمجة_والذكاء_الاصطناعي_2026.pdf');
  const [docContent, setDocContent] = useState('');
  const [importResult, setImportResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const source: CurriculumSource = {
      id: `src-${Date.now()}`,
      title: newTitle.trim(),
      sourceType: 'ministry_platform',
      sourceTypeAr: 'منصة رسمية معتمدة',
      urlOrRef: newRef.trim() || 'https://moe.gov.eg',
      academicYear: '2026-2027',
      educationSystem: 'شهادة الثانوية العامة المصرية',
      grade: 'الصف الثاني الثانوي',
      subject: newSubject,
      verificationStatus: newStatus,
      lastUpdated: new Date().toISOString().split('T')[0],
      notes: 'تمت إضافتها وتوثيقها عبر لوحة إدارة المناهج.',
    };

    addCurriculumSource(source);
    setSources(getCurriculumSources());
    setNewTitle('');
    setNewRef('');
  };

  const handleToggleStatus = (id: string, current: VerificationStatus) => {
    const next: VerificationStatus =
      current === 'verified' ? 'pending_verification' : 'verified';
    updateCurriculumSourceStatus(id, next);
    setSources(getCurriculumSources());
  };

  const handleSimulateImport = () => {
    const res = simulateCurriculumDocImport(
      docFileName,
      docContent || 'الوحدة الأولى: أساسيات البرمجة\nالدرس الأول: المتغيرات والدوال'
    );
    setImportResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 text-right">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <FolderOpen size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100">إدارة مصادر وتحديثات المناهج</h3>
              <span className="text-[10px] text-purple-400 block -mt-0.5">
                لوحة التوثيق الأكاديمي واستيراد المناهج (Admin Foundation)
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'sources'
                ? 'bg-purple-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المصادر المعتمدة ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab('import_doc')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'import_doc'
                ? 'bg-purple-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            استيراد وثيقة منهجية (PDF/DOC)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5">
          {activeTab === 'sources' ? (
            <div className="space-y-3">
              {/* Add Source Mini-Form */}
              <form onSubmit={handleAddSource} className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2 text-xs">
                <span className="font-bold text-slate-200 block text-[11px]">إضافة مصدر معتمد جديد:</span>
                <input
                  type="text"
                  placeholder="عنوان المصدر (مثال: كتاب الذكاء الاصطناعي طبعة 2026/2027)..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="رابط أو ملف المصدر..."
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                  />
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100"
                  >
                    <option value="البرمجة والذكاء الاصطناعي">البرمجة والذكاء الاصطناعي</option>
                    <option value="اللغة العربية والآداب">اللغة العربية والآداب</option>
                    <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                    <option value="التاريخ المعاصر">التاريخ المعاصر</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-[11px] transition shadow-sm"
                >
                  + حفظ المصدر في قاعدة البيانات
                </button>
              </form>

              {/* Sources List */}
              <div className="space-y-2">
                {sources.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start justify-between gap-2 text-right"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-100">{s.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">{s.subject} • {s.academicYear}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[280px]">{s.urlOrRef}</p>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(s.id, s.verificationStatus)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                        s.verificationStatus === 'verified'
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {s.verificationStatus === 'verified' ? 'معتمد رسمياً ✓' : 'قيد المراجعة ⏳'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Document Import Simulation */
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <span className="font-bold text-slate-200 block text-[11px]">محاكي استخراج وهيكلة ملف المنهج:</span>
                <input
                  type="text"
                  value={docFileName}
                  onChange={(e) => setDocFileName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100"
                />
                <textarea
                  rows={4}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="الصق فهرس أو نصوص وثيقة المنهج المستخرجة من الكتاب المدرسي..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-mono"
                />
                <button
                  onClick={handleSimulateImport}
                  className="w-full py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition"
                >
                  معالجة واستخراج المنهج الرسمي
                </button>
              </div>

              {importResult && (
                <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                    <CheckCircle size={15} />
                    <span>تم التحليل والهيكلة المنهجية بنجاح:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                    <div>الوحدات المستخرجة: <strong className="text-white">{importResult.extractedUnitsCount}</strong></div>
                    <div>الدروس المقدرة: <strong className="text-white">{importResult.extractedLessonsCount}</strong></div>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">{importResult.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition shrink-0"
        >
          إغلاق اللوحة
        </button>
      </div>
    </div>
  );
};
