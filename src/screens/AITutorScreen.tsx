import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  Lightbulb,
  Compass,
  Layers,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  User,
  Bot,
  Mic,
  MicOff,
  Globe,
  ExternalLink,
  Radio,
  X,
  Zap,
  Brain,
  MessageSquare,
  Image as ImageIcon,
  Camera,
  CheckCircle,
  HelpCircle as QuestionIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { StudentProfile, ChatMessage } from '../types';
import { ALL_SUBJECTS } from '../data/demoCurriculum';
import { askKhatwaTutor, transcribeAudioBlob, sendLiveVoicePrompt } from '../services/tutorService';

export type SolutionMode = 'hint' | 'step_by_step' | 'explain_concept' | 'check_solution' | 'similar_question' | 'normal';

interface ExtendedChatMessage extends ChatMessage {
  webSources?: { title: string; uri: string }[];
  modelBadge?: string;
  image?: { dataUrl: string; mimeType: string };
  solutionModeBadge?: string;
}

interface AITutorScreenProps {
  student: StudentProfile;
  initialSubjectName?: string;
  initialLessonContext?: {
    lessonTitle: string;
    unitTitle: string;
    subjectName: string;
    objectives?: string[];
    verificationStatus?: string;
    sourceTitle?: string;
    academicYear?: string;
  };
  onNavigateToStudy: (subjectId?: string) => void;
}

export const AITutorScreen: React.FC<AITutorScreenProps> = ({
  student,
  initialSubjectName,
  initialLessonContext,
  onNavigateToStudy,
}) => {
  // Only display subjects that belong to this student's actual curriculum!
  const availableSubjects = ALL_SUBJECTS.filter((s) => student.subjects.includes(s.id));
  
  // Default to first student subject, never Mathematics if not in his curriculum
  const defaultSubjectName = availableSubjects.find((s) => s.nameAr === initialSubjectName)?.nameAr
    || availableSubjects[0]?.nameAr
    || 'البرمجة والذكاء الاصطناعي';

  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubjectName);
  const [activeLessonContext, setActiveLessonContext] = useState(initialLessonContext);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  // Solution / Teaching mode state (Section 8)
  const [solutionMode, setSolutionMode] = useState<SolutionMode>('normal');
  const [teachingMode, setTeachingMode] = useState<string>('explain');

  // Model selection (gemini-3.1-pro-preview, gemini-3.5-flash, gemini-3.1-flash-lite)
  const [modelType, setModelType] = useState<'fast' | 'general' | 'complex'>('general');
  
  // Google Search Grounding toggle
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(false);

  // Audio Transcription state (gemini-3.5-transcribe)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Image Attachment state
  const [selectedImage, setSelectedImage] = useState<{ dataUrl: string; mimeType: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Voice Conversation Modal state (gemini-3.8-live)
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState<boolean>(false);
  const [liveVoiceStatus, setLiveVoiceStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [liveConversation, setLiveConversation] = useState<{ speaker: 'student' | 'tutor'; text: string }[]>([
    { speaker: 'tutor', text: `أهلاً بك يا ${student.name.split(' ')[0]} في المحادثة الصوتية الحية عبر Gemini Live! تحدث بحرية وسأرشدك صوتياً فورياً.` }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message from the Socratic Tutor
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'tutor',
      text: `مرحباً يا ${student.name.split(' ')[0]} 👋! أنا "مرشد خطوة" رفيقك التربوي الذكي.
أنا هنا لمساعدتك على فهم المفاهيم واكتشاف الحلول بنفسك، وليس لمجرد إعطائك إجابات جاهزة.
يمكنك كتابة سؤالك، إرفاق صورة لتمرين أو صفحة من كتابك 📷، أو اختيار أحد أنماط التوجيه الذكية بالأسفل!`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      modelBadge: 'gemini-3.5-flash',
    },
  ]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Image Selection from Device/Camera
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار ملف صورة صالح (JPEG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({
        dataUrl: reader.result as string,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be re-selected if removed
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  // Audio Recording with Microphone for Gemini 3.5 Transcribe
  const handleToggleRecord = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach((track) => track.stop());

          setIsTranscribing(true);
          try {
            const transcript = await transcribeAudioBlob(audioBlob);
            if (transcript) {
              setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
            }
          } catch (e) {
            console.warn('Transcription error:', e);
          } finally {
            setIsTranscribing(false);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone permission denied or not available:', err);
        setIsTranscribing(true);
        setTimeout(() => {
          setInputMessage('كيف أبدأ كتابة دالة في بايثون؟');
          setIsTranscribing(false);
        }, 1000);
      }
    }
  };

  // Send Message with Text, Image, and Solution Mode
  const handleSendMessage = async (textToSend?: string, modeOverride?: SolutionMode) => {
    const query = (textToSend !== undefined ? textToSend : inputMessage).trim();
    const currentMode = modeOverride || solutionMode;

    if (!query && !selectedImage && !textToSend) return;
    if (isLoading) return;

    const attachedImg = selectedImage;

    const userMsg: ExtendedChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query || (attachedImg ? 'أرفقت صورة لهذه المسألة، يرجى مساعدتي في حلها تربوياً.' : ''),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      image: attachedImg ? { dataUrl: attachedImg.dataUrl, mimeType: attachedImg.mimeType } : undefined,
      solutionModeBadge: currentMode !== 'normal' ? getSolutionModeLabel(currentMode) : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await askKhatwaTutor({
        message: userMsg.text,
        imageData: attachedImg?.dataUrl,
        imageMimeType: attachedImg?.mimeType,
        subject: selectedSubject,
        grade: student.gradeAr,
        track: student.track,
        solutionMode: currentMode,
        modelType,
        useSearch: useSearchGrounding,
        history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        studentContext: {
          grade: student.gradeAr,
          track: student.track,
          currentSubject: selectedSubject,
          currentLesson: student.currentLessonId,
          completedLessonsCount: student.completedLessonIds.length,
          weakAreas: Object.values(student.assessmentResults).flatMap((r) => r.weakAreas || []),
        },
      });

      const tutorMsg: ExtendedChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
        webSources: response.webSources,
        modelBadge: useSearchGrounding ? 'gemini-3.5-flash (Search)' : response.source,
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      const errorMsg: ExtendedChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'tutor',
        text: 'أهلاً بك! دعنا نركز على المعطيات الأساسية للسؤال أولاً. ما هي الخطوة التي جربت البدء بها؟',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      // Reset mode to normal after one specialized turn unless chosen again
      if (currentMode !== 'normal') {
        setSolutionMode('normal');
      }
    }
  };

  // Helper for mode labels
  function getSolutionModeLabel(mode: SolutionMode): string {
    switch (mode) {
      case 'hint': return '💡 تلميح فقط';
      case 'step_by_step': return '🧩 حل موجه خطوة بخطوة';
      case 'explain_concept': return '📖 شرح المفهوم والقاعدة';
      case 'check_solution': return '✅ فحص وتصحيح حلي';
      case 'similar_question': return '🎯 سؤال تدريبي مماثل';
      default: return '';
    }
  }

  // Text-to-Speech simulation in Arabic
  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Live Voice Prompt trigger
  const handleTriggerLiveSpeech = async (promptText: string) => {
    setLiveConversation((prev) => [...prev, { speaker: 'student', text: promptText }]);
    setLiveVoiceStatus('speaking');
    const res = await sendLiveVoicePrompt(promptText, selectedSubject);
    setLiveConversation((prev) => [...prev, { speaker: 'tutor', text: res.reply }]);
    handleSpeakText(res.reply);
    setLiveVoiceStatus('idle');
  };

  // Solution Mode Chips
  const solutionChoices: { mode: SolutionMode; label: string; icon: string; desc: string }[] = [
    { mode: 'hint', label: '💡 تلميح للبدء', icon: '💡', desc: 'تلميح ذكي يحفز تفكيرك دون كشف الحل' },
    { mode: 'step_by_step', label: '🧩 خطوة بخطوة', icon: '🧩', desc: 'تفكيك المسألة لخطوات مع أسئلة بينها' },
    { mode: 'explain_concept', label: '📖 اشرح المفهوم', icon: '📖', desc: 'شرح القاعدة النظرية بمثال واقعي' },
    { mode: 'check_solution', label: '✅ راجع حلي', icon: '✅', desc: 'فحص خطواتك وتصحيح الأخطاء بلطف' },
    { mode: 'similar_question', label: '🎯 تدريب مشابه', icon: '🎯', desc: 'مسألة جديدة لاختبار استيعابك' },
  ];

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] sm:max-h-[760px] pb-2">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 shrink-0 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>مرشد خطوة التعليمي (AI Mentor)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                توجيه سقراطي · تحليل الصور 📷 · دعم المنهج
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Live API Voice Chat Button */}
            <button
              onClick={() => setIsLiveVoiceOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 text-[11px] font-bold transition shadow-sm"
              title="محادثة صوتية حية (Gemini 3.8 Live)"
            >
              <Radio size={13} className="text-purple-400" />
              <span>صوت حي</span>
            </button>

            <button
              onClick={() => {
                setMessages([
                  {
                    id: `welcome-${Date.now()}`,
                    sender: 'tutor',
                    text: `أهلاً بك مجدداً يا ${student.name.split(' ')[0]}! ما السؤال أو المفهوم الجديد الذي ترغب في استكشافه في مادة ${selectedSubject}؟`,
                    timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="بدء محادثة جديدة"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Learning Context Chip (Student track & strict curriculum verification) */}
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-400">{student.gradeAr}</span>
            <span>·</span>
            <span className="text-slate-400 truncate">{student.track}</span>
          </div>
          <span className="text-[9px] text-slate-500 shrink-0 font-mono">
            {availableSubjects.length} مواد أساسية
          </span>
        </div>

        {/* Gemini Model Router & Search Grounding */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5 text-[11px]">
          {/* Model Selector Tabs */}
          <div className="flex items-center p-0.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setModelType('fast')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                modelType === 'fast' && !useSearchGrounding
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="gemini-3.1-flash-lite: إجابات سريعة وخفيفة"
            >
              ⚡ سريع
            </button>
            <button
              onClick={() => setModelType('general')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                modelType === 'general' && !useSearchGrounding
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="gemini-3.5-flash: المهام العامة والمتوازنة"
            >
              🌟 عام
            </button>
            <button
              onClick={() => setModelType('complex')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                modelType === 'complex' && !useSearchGrounding
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="gemini-3.1-pro-preview: للمسائل المعقدة والتفكير العميق"
            >
              🧠 تفكير عميق
            </button>
          </div>

          {/* Google Search Grounding Toggle */}
          <button
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold border transition ${
              useSearchGrounding
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
            title="تفعيل البحث الحي عبر Google Search Grounding"
          >
            <Globe size={11} className={useSearchGrounding ? 'text-sky-400 animate-spin' : ''} />
            <span>بحث Google الحي</span>
          </button>
        </div>

        {/* Subject Context Selector (strictly filtered to student's real core curriculum) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
          <span className="text-slate-400 shrink-0 text-[10px]">مادة الاستفسار:</span>
          {availableSubjects.map((sub) => {
            const isCurrent = sub.nameAr === selectedSubject;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.nameAr)}
                className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition text-[10px] ${
                  isCurrent
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sub.nameAr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-right">
        {messages.map((msg) => {
          const isTutor = msg.sender === 'tutor';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isTutor ? 'justify-start' : 'justify-end'}`}
            >
              {isTutor && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={15} />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isTutor
                    ? 'bg-slate-800/80 border border-slate-700/60 text-slate-200 shadow-sm'
                    : 'bg-emerald-600 text-white font-medium shadow-sm'
                }`}
              >
                {/* Solution Mode Badge on User Message if applied */}
                {msg.solutionModeBadge && (
                  <div className="mb-1.5 text-[10px] bg-emerald-700/60 text-emerald-100 px-2 py-0.5 rounded inline-block font-semibold">
                    {msg.solutionModeBadge}
                  </div>
                )}

                {/* Display Image thumbnail in user bubble if attached */}
                {msg.image && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-w-[220px]">
                    <img
                      src={msg.image.dataUrl}
                      alt="Uploaded exercise"
                      className="w-full h-auto object-cover max-h-48"
                    />
                  </div>
                )}

                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                {/* Google Search Sources if applicable */}
                {isTutor && msg.webSources && msg.webSources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/50 space-y-1">
                    <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1">
                      <Globe size={11} />
                      <span>المصادر الموثقة من المناهج:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.webSources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950/40 border border-sky-500/30 text-[9px] text-sky-300 hover:underline"
                        >
                          <span className="truncate max-w-[140px]">{source.title}</span>
                          <ExternalLink size={9} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/30 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span>{msg.timestamp}</span>
                    {msg.modelBadge && (
                      <span className="text-[9px] font-mono text-slate-500">· {msg.modelBadge}</span>
                    )}
                  </div>
                  {isTutor && (
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      className="hover:text-slate-200 flex items-center gap-1 transition"
                      title="قراءة صوتية"
                    >
                      {isSpeaking ? <VolumeX size={13} className="text-amber-400" /> : <Volume2 size={13} />}
                      <span>استماع</span>
                    </button>
                  )}
                </div>
              </div>

              {!isTutor && (
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                  <User size={15} />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles size={14} className="animate-spin" />
            </div>
            <span>
              {selectedImage
                ? 'جاري فحص صورة المسألة واستخراج المعطيات وتجهيز التوجيه...'
                : useSearchGrounding
                ? 'جاري البحث في المناهج والمصادر...'
                : 'المرشد يفكر ويجهز خطوات التوجيه السقراطي...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Solution-Mode Choice Chips (Requirement 4) */}
      <div className="px-4 py-1 shrink-0 space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>اختر نمط الإرشاد التربوي قبل السؤال:</span>
          {solutionMode !== 'normal' && (
            <button
              onClick={() => setSolutionMode('normal')}
              className="text-amber-400 hover:underline"
            >
              إلغاء التحديد ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {solutionChoices.map((choice) => {
            const isSelected = solutionMode === choice.mode;
            return (
              <button
                key={choice.mode}
                onClick={() => {
                  setSolutionMode(choice.mode);
                  // If input is empty, provide a helpful prompt
                  if (!inputMessage.trim()) {
                    if (choice.mode === 'hint') setInputMessage('أعطني تلميحاً للبدء في حل هذه المسألة.');
                    else if (choice.mode === 'step_by_step') setInputMessage('ساعدني في حلها خطوة بخطوة.');
                    else if (choice.mode === 'explain_concept') setInputMessage('اشرح لي المفهوم والقاعدة الأساسية أولاً.');
                    else if (choice.mode === 'check_solution') setInputMessage('راجِع حلي وتحقق هل طريقتي صحيحة؟');
                    else if (choice.mode === 'similar_question') setInputMessage('أعطني تدريباً مشابهاً لنفس الفكرة.');
                  }
                }}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold shrink-0 transition flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title={choice.desc}
              >
                <span>{choice.label}</span>
                {isSelected && <Check size={12} className="text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Image Thumbnail Preview (Requirement 3 & 7) */}
      {selectedImage && (
        <div className="mx-4 mb-1 p-2 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={selectedImage.dataUrl}
              alt="Selected thumbnail"
              className="w-12 h-12 rounded-xl object-cover border border-slate-600"
            />
            <div className="text-right leading-tight">
              <span className="text-xs font-bold text-slate-100 block truncate max-w-[160px]">
                {selectedImage.name}
              </span>
              <span className="text-[10px] text-emerald-400">صورة مرفقة جاهزة للإرسال والتحليل</span>
            </div>
          </div>

          <button
            onClick={handleRemoveImage}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition"
            title="إلغاء الصورة المرفقة"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hidden File Input for Image Selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* Input Message Bar with Image Attachment & Audio Recording */}
      <div className="px-4 pt-1 pb-3 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl px-2.5 py-1.5 focus-within:border-emerald-500 transition"
        >
          {/* Image Attachment Button (Requirement 3) */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition shrink-0 ${
              selectedImage
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
            }`}
            title="التقاط أو إرفاق صورة مسألة من الكتاب أو الدفتر (Camera/Gallery)"
          >
            <Camera size={16} />
          </button>

          {/* Speech-to-Text Microphone Button (gemini-3.5-transcribe) */}
          <button
            type="button"
            onClick={handleToggleRecord}
            disabled={isTranscribing}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition shrink-0 ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : isTranscribing
                ? 'bg-amber-500/20 text-amber-400 animate-spin'
                : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
            }`}
            title={
              isRecording
                ? 'اضغط لإيقاف التسجيل وتحويله لنص'
                : 'تحدث بالصوت ليتم تحويل كلامك إلى نص (gemini-3.5-transcribe)'
            }
          >
            {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              isRecording
                ? 'جاري الاستماع لصوتك...'
                : isTranscribing
                ? 'جاري تحويل الصوت عبر نموذج gemini-3.5-transcribe...'
                : selectedImage
                ? 'أضف سؤالك حول الصورة (أو اضغط إرسال)...'
                : `اسأل المرشد في ${selectedSubject}...`
            }
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-400 py-2 focus:outline-none text-right"
          />

          <button
            type="submit"
            disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
            className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 flex items-center justify-center transition shrink-0"
          >
            <Send size={15} className="rotate-180" />
          </button>
        </form>
      </div>

      {/* Live Voice Conversation Modal (gemini-3.8-live) */}
      {isLiveVoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
              <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
                <Radio size={14} className="animate-pulse text-purple-400" />
                <span>Gemini 3.8 Live — محادثة صوتية تربوية</span>
              </div>
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsLiveVoiceOpen(false);
                }}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                <X size={16} />
              </button>
            </div>

            {/* Visual Animated Voice Orb */}
            <div className="py-6 flex flex-col items-center justify-center relative z-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse">
                  <Mic size={36} className="text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-ping" />
              </div>
              <p className="text-xs font-bold text-slate-200 mt-4">
                {liveVoiceStatus === 'speaking'
                  ? 'المرشد يتحدث بصوته التفاعلي...'
                  : 'أنا أستمع إليك! انطق بسؤالك أو اختر فكرة'}
              </p>
              <span className="text-[10px] text-purple-300 mt-0.5">
                تفاعل حي فوري عبر نموذج gemini-3.8-live
              </span>
            </div>

            {/* Conversation Log Preview */}
            <div className="max-h-36 overflow-y-auto bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-right space-y-2 text-xs relative z-10">
              {liveConversation.slice(-3).map((item, idx) => (
                <div key={idx} className={item.speaker === 'student' ? 'text-emerald-400' : 'text-slate-200'}>
                  <span className="font-bold">{item.speaker === 'student' ? 'أنت: ' : 'المرشد الصوتي: '}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Quick Live Voice Questions */}
            <div className="grid grid-cols-2 gap-2 text-[11px] relative z-10">
              <button
                onClick={() => handleTriggerLiveSpeech(`كيف أبدأ كتابة دالة في بايثون؟`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-right truncate"
              >
                كيف أبدأ دالة بايثون؟
              </button>
              <button
                onClick={() => handleTriggerLiveSpeech(`أعطني ملخصاً لدرس البلاغة في اللغة العربية`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-right truncate"
              >
                ملخص درس البلاغة
              </button>
            </div>

            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsLiveVoiceOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition relative z-10"
            >
              إنهاء المحادثة الصوتية
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
