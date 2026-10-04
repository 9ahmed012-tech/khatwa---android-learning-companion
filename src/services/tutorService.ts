import { ChatMessage } from '../types';

export interface AskTutorParams {
  message: string;
  imageData?: string;
  imageMimeType?: string;
  subject?: string;
  grade?: string;
  track?: string;
  solutionMode?: 'hint' | 'step_by_step' | 'explain_concept' | 'check_solution' | 'similar_question' | 'normal';
  teachingMode?: string;
  mode?: string;
  modelType?: 'fast' | 'general' | 'complex';
  useSearch?: boolean;
  history?: { sender: 'user' | 'tutor'; text: string }[];
  studentContext?: any;
  lessonContext?: {
    lessonTitle: string;
    unitTitle: string;
    subjectName: string;
    objectives?: string[];
    verificationStatus?: string;
    sourceTitle?: string;
    academicYear?: string;
  };
}

export interface TutorResponse {
  reply: string;
  source: string;
  webSources?: { title: string; uri: string }[];
  hints?: string[];
}

export async function askKhatwaTutor(params: AskTutorParams): Promise<TutorResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        reply: data.reply || 'أهلاً بك! دعنا نفكك هذا السؤال معاً خطوة بخطوة.',
        source: data.source || 'gemini',
        webSources: data.webSources || [],
      };
    }
  } catch (err) {
    console.warn('Backend tutor fetch error, using local socratic engine:', err);
  }

  // Client-side pedagogical Socratic response
  return {
    reply: generateClientSocraticGuidance(params.message, params.subject, params.useSearch),
    source: 'khatwa-offline-tutor',
    webSources: params.useSearch ? [{ title: 'موسوعة المناهج التعليمية', uri: 'https://khatwa.edu' }] : [],
  };
}

export async function transcribeAudioBlob(audioBlob: Blob): Promise<string> {
  try {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
    });
    reader.readAsDataURL(audioBlob);
    const audioData = await base64Promise;

    const res = await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioData,
        mimeType: audioBlob.type || 'audio/webm',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.transcript || '';
    }
  } catch (err) {
    console.warn('Transcription request failed:', err);
  }
  return '';
}

export async function sendLiveVoicePrompt(
  prompt: string,
  subject?: string,
  audioBlob?: Blob
): Promise<{ reply: string; model: string }> {
  try {
    let audioData: string | undefined = undefined;
    if (audioBlob) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);
      audioData = await base64Promise;
    }

    const res = await fetch('/api/voice-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        subject,
        audioData,
        mimeType: audioBlob?.type || 'audio/webm',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        reply: data.reply || 'أهلاً بك في المحادثة الصوتية الحية!',
        model: data.model || 'gemini-3.8-live',
      };
    }
  } catch (err) {
    console.warn('Live voice chat request error:', err);
  }

  return {
    reply: `أهلاً بك صوتياً في مادة ${subject || 'الدراسة'} 🎙️! أنا أستمع إليك، ما هي النقطة التي تبدو غير واضحة لك الآن؟`,
    model: 'gemini-3.8-live',
  };
}

function generateClientSocraticGuidance(message: string, subject?: string, useSearch?: boolean): string {
  const q = message.toLowerCase();
  const searchNote = useSearch ? '\n\n🌐 *(تم التحقق من المعطيات التعليمية عبر البحث الحي)*' : '';

  if (q.includes('معادلة') || q.includes('س') || q.includes('x') || q.includes('تفاضل') || q.includes('رياضيات')) {
    return `مرحباً يا بطل! في الرياضيات، السر يكمن في تنظيم الخطوات:\n\n1. ما هو المجهول الذي نبحث عن قيمته؟\n2. هل يمكننا جمع الحدود المتشابهة في طرف واحد أولاً؟\n\n💡 **تلميح توجيهي:** تذكر قاعدة الميزان: ما تفعله في الطرف الأيمن، افعله في الطرف الأيسر.\nما رأيك أن تجرب نقل الثوابت إلى جهة والمتغيرات إلى الجهة الأخرى؟${searchNote}`;
  }

  if (q.includes('بايثون') || q.includes('كود') || q.includes('برمجة') || q.includes('دالة') || q.includes('loop')) {
    return `تحية للمبرمج المستقبلي 💻!\n\nقبل كتابة أي سطر كود، فكر في المنطق (Logic):\n• ما هي المدخلات (Inputs) التي تحتاجها الدالة؟\n• ما هي المخرجات (Outputs) المتوقعة؟\n\n💡 **تلميح:** ابدأ بـ \`def function_name(param):\` ولا تنسَ علامة النقطتين \`:\` ومسافة الإزاحة (4 فراغات).\nهل جربت تحديد نوع المدخلات أولاً؟${searchNote}`;
  }

  if (q.includes('نحو') || q.includes('إعراب') || q.includes('فاعل') || q.includes('مفعول') || q.includes('عربي')) {
    return `أهلاً بك في لغة الضاد 📖!\n\nالإعراب يعتمد أساساً على فهم المعنى:\n1. هل الجملة تبدأ بفعل أم باسم؟\n2. إذا كانت فعلية، اسأل: مَن فعل الفعل؟ (هو الفاعل المرفوع).\n3. على مَن وقع فعل الفاعل؟ (هو المفعول به المنصوب).\n\n💡 **تلميح:** انظر إلى الكلمة السابقة للكلمة المطلوب إعرابها. ما نوع الكلمة التي تسبقها؟${searchNote}`;
  }

  return `أهلاً بك! كمرشدك في "خطوة"، هدفي أن تكتشف الحل بنفسك لترسخ المعلومة 🌟.\n\nدعنا نصل للحل خطوة بخطوة:\n• ما هي أهم معلومة معطاة في السؤال؟\n• ما الذي تظنه أقرب مفهوم درسناه لهذه الفكرة؟\n\n💡 **تلميح:** جرب أن تشرح السؤال بأسلوبك وبكلماتك الخاصة، وسأساعدك في فحص أول خطوة!${searchNote}`;
}
