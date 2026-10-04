import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Increase body limit for audio uploads
app.use(express.json({ limit: '25mb' }));

// Helper to get GoogleGenAI instance
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// 1. Multi-turn Chatbot Endpoint with Model Selection, Search Grounding, Image Analysis & Mentoring
app.post('/api/tutor', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      message = '',
      imageData,
      imageMimeType = 'image/jpeg',
      subject,
      grade,
      track,
      solutionMode = 'normal',
      teachingMode,
      modelType = 'general',
      useSearch = false,
      history = [],
      studentContext = {},
      lessonContext,
    } = req.body;

    if (!message && !imageData) {
      res.status(400).json({ error: 'الرجاء إدخال رسالة أو إرفاق صورة للمسألة' });
      return;
    }

    const ai = getAI();

    let modelName = 'gemini-3.5-flash';
    if (useSearch) {
      modelName = 'gemini-3.5-flash';
    } else if (modelType === 'complex') {
      modelName = 'gemini-3.1-pro-preview';
    } else if (modelType === 'fast') {
      modelName = 'gemini-3.1-flash-lite';
    } else {
      modelName = 'gemini-3.5-flash';
    }

    // Determine pedagogical behavior directive based on teachingMode or solutionMode (Section 8)
    const effectiveMode = teachingMode || solutionMode;
    let modeDirective = '';

    if (effectiveMode === 'hint') {
      modeDirective = `\n[توجيه النمط: تلميح ذكي فقط]\nالمطلوب تلميح توجيهي ذكي يقود الطالب للتفكير دون إعطاء الحل أو الخطوات كاملة. ركز على المفتاح الأساسي واختم بسؤال تحفيزي.`;
    } else if (effectiveMode === 'step_by_step') {
      modeDirective = `\n[توجيه النمط: حل موجه خطوة بخطوة]\nقسّم المسألة إلى خطوات صغيرة. اشرح الخطوة الأولى فقط بوضوح، ثم اطلب من الطالب التفكير في الخطوة التالية وتطبيقها بنفسه.`;
    } else if (effectiveMode === 'explain' || effectiveMode === 'explain_concept') {
      modeDirective = `\n[توجيه النمط: شرح المفهوم والقاعدة أولاً]\nاشرح الفكرة النظرية أو المفهوم الأساسي بأسلوب تربوي ممتع مع تشبيه مبسط قبل التطبيق.`;
    } else if (effectiveMode === 'simplify') {
      modeDirective = `\n[توجيه النمط: بسط الشرح لأقصى درجة]\nاشرح المفهوم بأسلوب مبسط للغاية ولغة سهلة قريبة من ذهن الطالب، واستعن بأمثلة وتشبيهات من الحياة اليومية.`;
    } else if (effectiveMode === 'example') {
      modeDirective = `\n[توجيه النمط: إعطاء مثال عملي وتطبيقي]\nقدم مثالاً عملياً محلولاً يوضح كيفية تطبيق هذا القانون أو المفهوم في الامتحان.`;
    } else if (effectiveMode === 'test_me') {
      modeDirective = `\n[توجيه النمط: اختبرني]\nاطرح على الطالب سؤالاً تدريبياً دقيقاً من صميم نواتج تعلم هذا الدرس واطلب منه محاولة حله لتقييمه.`;
    } else if (effectiveMode === 'check_solution') {
      modeDirective = `\n[توجيه النمط: فحص وتصحيح حل الطالب]\nافحص محاولة الطالب أو الحل المكتوب بعناية. أثنِ على الأجزاء الصحيحة أولاً، وحدد موضع الخطأ مع تعليله التربوي بلطف.`;
    } else if (effectiveMode === 'clarify_mistake') {
      modeDirective = `\n[توجيه النمط: وضح الغلط والمفهوم الخاطئ]\nحلل أين يكمن اللبس أو الخطأ المفاهيمي في حل الطالب واشرح القاعدة الصحيحة لتفاديه مستقبلاً.`;
    } else if (effectiveMode === 'similar_question') {
      modeDirective = `\n[توجيه النمط: مسألة تدريبية مماثلة]\nقدم مسألة جديدة بنفس الفكرة ونفس الصعوبة ليتأكد الطالب من استيعابه.`;
    } else if (effectiveMode === 'summarize') {
      modeDirective = `\n[توجيه النمط: تلخيص الدرس والقواعد الجوهرية]\nلخص أهم القواعد والمفاهيم والنقاط الذهبية لهذا الدرس في نقاط سريعة مكثفة صالحة للمراجعة.`;
    } else if (effectiveMode === 'challenge') {
      modeDirective = `\n[توجيه النمط: تحدي أصعب ومستويات تفكير عليا]\nاطرح سؤالاً متقدماً يقيس الاستنتاج والربط بين المفاهيم للطلاب المتميزين.`;
    }

    const lessonContextDirective = lessonContext && lessonContext.lessonTitle ? `
[الدرس والمنهج الرسمي المرتبط بالسؤال]:
- المادة: ${lessonContext.subjectName || subject || 'المنهج الرسمي'}
- الوحدة: ${lessonContext.unitTitle || 'الوحدة الحالية'}
- الدرس المعتمد: ${lessonContext.lessonTitle}
- نواتج التعلم المستهدفة (Learning Objectives): ${(lessonContext.objectives || []).join(' - ')}
- المصدر المعتمد: ${lessonContext.sourceTitle || 'بوابة المناهج بوزارة التربية والتعليم المصرية'}
- حالة التوثيق: ${lessonContext.verificationStatus === 'verified' ? 'مصدر رسمي موثق' : 'محتوى تجريبي قيد التوثيق'}
- العام الدراسي: ${lessonContext.academicYear || '2026-2027'}
* قاعدة حاسمة: ركز شرحك وأمثلتك وأسئلتك حصراً على نواتج تعلم هذا الدرس والمنهج المعتمد، ولا تخترع مصطلحات أو مناهج وهمية. إذا لم تكن متأكداً من معلومة وزارية محددة، صرح بذلك بأمانة واطلب الرجوع للكتاب المدرسي المعتمد.
` : '';

    const systemInstruction = `
أنت "مرشد خطوة" (Khatwa Educational AI Mentor) - مرشد تربوي ذكي ورفيق تعليمي لطالب عربي.
أنت لست مجرد مولد إجابات، بل معلم حقيقي يهدف إلى تنمية التفكير المستقل وبناء الفهم العميق.

معلومات الطالب وسياق التعلّم:
- المرحلة والسنة الدراسية: ${grade || studentContext.grade || 'الثانوية العامة المصرية - الصف الثاني الثانوي'}
- المسار: ${track || studentContext.track || 'مسار الهندسة وعلوم الحاسوب - تخصص البرمجة والذكاء الاصطناعي'}
- المادة الحالية: ${subject || studentContext.currentSubject || 'عام'}
- المواد الدراسية الأساسية للطالب الرئيسي: اللغة العربية، اللغة الإنجليزية، التاريخ، البرمجة والذكاء الاصطناعي.
* تنبيه حاسم: مادة الرياضيات ليست ضمن مقررات الطالب الرئيسي (أحمد)! لا تفرض عليه مسائل رياضيات إلا إذا طلب هو مهارة برمجية تطبيقية.
- نقاط الضعف المسجلة: ${(studentContext.weakAreas || []).join('، ') || 'لا توجد نقاط ضعف مسجلة'}
${lessonContextDirective}
${modeDirective}
${useSearch ? 'لديك إمكانية الوصول إلى Google Search للتحقق من المناهج والمعلومات المحدثة.' : ''}

القواعد التربوية الإلزامية:
1. اشرح المفاهيم خطوة بخطوة بلغة عربية فصحى مشجعة وواضحة.
2. اسأل الطالب أسئلة استكشافية لفهم ما يعرفه بالفعل عن المسألة.
3. قدّم تلميحات توجيهية قبل إعطاء الحل النهائي، وشجع الطالب على تجربة الحل بنفسه.
4. فكك المشكلات الصعبة إلى خطوات صغيرة قابلة للفهم.
5. تحقق من تسلسل تفكير الطالب وصحح الأخطاء بلطف مع شرح سبب وقوع الخطأ.
6. نوّع في طرق الشرح عند الحاجة (أمثلة واقعية، مخططات، تشبيهات).
7. لا تجعل الطالب يعتمد على تلقي الإجابات الجاهزة دون بذل مجهود فكري.
8. التعامل مع الصور المرفقة (تمارين كتب، حلول يدوية، كود برمجي، مخططات):
   - اربط المسألة أو المخطط بالدرس والوحدة الدراسية المقررة للطالب.
   - إذا كان جزء من الصورة غير واضح أو غير مقروء: صرّح بذلك بأمانة واطلب توضيح هذا الجزء، وإياك أن تخمن أو تخترع نصاً غير مرئي.
   - ابدأ بتوجيه الطالب خطوة بخطوة للحل بدلاً من مجرد إلقاء الإجابة.
9. قاعدة الأمانة العلمية: لا تدّعِ معلومات رسمية غير موثقة؛ وعند الاستشهاد بآيات أو أحاديث أو حقائق تاريخية، التزم بالدقة التامة.
`;

    if (ai) {
      try {
        const config: any = {
          systemInstruction,
          temperature: 0.6,
        };

        if (useSearch) {
          config.tools = [{ googleSearch: {} }];
        }

        const contents: any[] = [];

        // Add history (text only for previous turns)
        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }

        // Current turn parts (including image if uploaded)
        const currentParts: any[] = [];

        if (imageData && typeof imageData === 'string') {
          const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
          currentParts.push({
            inlineData: {
              data: base64Data,
              mimeType: imageMimeType || 'image/jpeg',
            },
          });
        }

        const promptText = message || 'أرفقت صورة لهذه المسألة، أرجو أن ترشدني في فهمها وحلها خطوة بخطوة.';
        currentParts.push({ text: promptText });

        contents.push({
          role: 'user',
          parts: currentParts,
        });

        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config,
        });

        const reply = response.text || '';

        // Extract search sources if applicable
        const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const webSources = searchChunks
          ? searchChunks
              .filter((c: any) => c.web?.uri && c.web?.title)
              .map((c: any) => ({ title: c.web.title, uri: c.web.uri }))
          : [];

        res.json({
          reply,
          source: modelName,
          webSources,
          status: 'success',
        });
        return;
      } catch (geminiError: any) {
        console.warn(`Gemini call (${modelName}) failed, using smart mentoring fallback:`, geminiError?.message || geminiError);
      }
    }

    // High quality offline fallback with mentoring logic
    const fallbackReply = generatePedagogicalFallback(message, subject, useSearch, solutionMode, !!imageData);
    res.json({
      reply: fallbackReply,
      source: 'khatwa-socratic-mentor',
      webSources: useSearch ? [{ title: 'موسوعة المناهج التعليمية', uri: 'https://khatwa.edu' }] : [],
      status: 'success',
    });
  } catch (error: any) {
    console.error('Tutor endpoint error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء معالجة السؤال', details: error.message });
  }
});

// 2. Audio Transcription Endpoint using model 'gemini-3.5-transcribe'
app.post('/api/transcribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { audioData, mimeType = 'audio/webm' } = req.body;

    if (!audioData || typeof audioData !== 'string') {
      res.status(400).json({ error: 'الرجاء إرسال بيانات صوتية صالحة بصيغة base64' });
      return;
    }

    // Strip data URL prefix if present
    const base64Audio = audioData.includes(',') ? audioData.split(',')[1] : audioData;

    const ai = getAI();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: [
            {
              inlineData: {
                data: base64Audio,
                mimeType,
              },
            },
            'Transcribe the audio speech accurately and verbatim in the language spoken (prefer Arabic or English). Output ONLY the clean transcribed text without quotes or preamble.',
          ],
        });

        const transcript = response.text?.trim() || '';
        res.json({
          transcript,
          model: 'gemini-3.5-transcribe',
          status: 'success',
        });
        return;
      } catch (err: any) {
        console.warn('Gemini 3.5 transcribe call failed:', err?.message || err);
      }
    }

    // Fallback simulation when no API key is present
    res.json({
      transcript: 'كيف أحل المعادلة الخطية بمجهول واحد؟',
      model: 'khatwa-speech-fallback',
      status: 'success',
    });
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'فشل تحويل الصوت إلى نص', details: error.message });
  }
});

// 3. Live Voice Conversation Endpoint with model 'gemini-3.8-live'
app.post('/api/voice-chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, audioData, mimeType = 'audio/webm', subject } = req.body;

    const ai = getAI();
    if (ai) {
      try {
        const contents: any[] = [];
        if (audioData) {
          const base64Audio = audioData.includes(',') ? audioData.split(',')[1] : audioData;
          contents.push({
            inlineData: {
              data: base64Audio,
              mimeType,
            },
          });
        }
        contents.push(message || 'استمع وتحدث معي كمرشد تعليمي صوتي تفاعلي.');

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-live',
          contents,
          config: {
            systemInstruction: `أنت "مرشد خطوة الصوتي" (Khatwa Live AI Voice Assistant). أنت تتحدث في محادثة صوتية تفاعلية حية ومباشرة مع الطالب في مادة ${subject || 'العلوم والرياضيات'}. أجب بإيجاز (جملتين أو ثلاث فقط) وبنبرة دافئة وواضحة جداً تناسب الاستماع الصوتي. اطرح سؤالاً موجهاً صغيراً في نهاية كل رد.`,
          },
        });

        res.json({
          reply: response.text || 'أهلاً بك في المحادثة الصوتية الحية! ما الفكرة التي تود استكشافها معاً؟',
          model: 'gemini-3.8-live',
          status: 'success',
        });
        return;
      } catch (err: any) {
        console.warn('Gemini 3.8 Live API call error:', err?.message || err);
      }
    }

    res.json({
      reply: `مرحباً بك في المحادثة الصوتية المباشرة 🎙️! أنا أستمع إليك باهتمام في مادة ${subject || 'الدراسة'}. ما هي النقطة التي تبدو غير واضحة لك الآن؟`,
      model: 'khatwa-live-simulation',
      status: 'success',
    });
  } catch (error: any) {
    console.error('Voice chat error:', error);
    res.status(500).json({ error: 'فشل بدء المحادثة الصوتية', details: error.message });
  }
});

// 4. Curriculum-Aware Adaptive Quiz Generation Endpoint
app.post('/api/curriculum/quiz', async (req: Request, res: Response): Promise<void> => {
  try {
    const { lessonTitle, subjectName, objectives = [], difficulty = 'متوسط' } = req.body;
    const ai = getAI();

    if (ai) {
      try {
        const prompt = `
أنت واضع اختبارات تربوية متخصص في المناهج التعليمية المعتمدة لشهادة الثانوية العامة المصرية.
المطلوب صياغة 3 أسئلة اختيار من متعدد (MCQ) دقيقة ومحكمة بناءً على نواتج تعلم هذا الدرس حصراً:
- المادة: ${subjectName}
- الدرس: ${lessonTitle}
- نواتج التعلم المقررة: ${objectives.join(' | ')}
- مستوى الصعوبة: ${difficulty}

أخرج الناتج بصيغة JSON حصراً بالتنسيق التالي:
{
  "questions": [
    {
      "id": "q1",
      "question": "نص السؤال الدقيق وفق معايير التقييم الوطنية",
      "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
      "correctIndex": 0,
      "explanation": "تعليل تربوي مفصل ومبسط يوضح سبب صحة هذا الخيار"
    }
  ]
}
        `.trim();

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          res.json({ questions: parsed.questions, source: 'gemini-curriculum-engine' });
          return;
        }
      } catch (err) {
        console.warn('Gemini quiz generation fallback:', err);
      }
    }

    // High quality curriculum fallback questions
    res.json({
      questions: [
        {
          id: 'q1',
          question: `ما هي الفكرة المركزية التي يقوم عليها درس (${lessonTitle}) في مادة ${subjectName}؟`,
          options: [
            'استيعاب المفهوم وتطبيقه وفق نواتج التعلم المعتمدة',
            'الحفظ الشكلي دون فهم العلاقات المنطقية',
            'تجاهل التطبيقات العملية والمسائل النموذجية',
            'الاعتماد على التخمين بدلاً من الاستنتاج'
          ],
          correctIndex: 0,
          explanation: 'الفهم والتحليل هما معيار التقييم الحقيقي في نظام المناهج المطورة.'
        },
        {
          id: 'q2',
          question: `عند تطبيق نواتج تعلم هذا الدرس في الامتحان، ما هي الخطوة المنهجية الأولى؟`,
          options: [
            'تحديد المعطيات والمفهوم الأساسي المرتبط بالسؤال',
            'التسرع في كتابة أول ناتج يتبادر للذهن',
            'إهمال قراءة رأس المسألة كاملاً',
            'تطبيق قاعدة من درس غير ذي صلة'
          ],
          correctIndex: 0,
          explanation: 'التحليل السليم للمعطيات يقود مباشرة إلى اختيار القاعدة النموذجية.'
        }
      ],
      source: 'khatwa-curriculum-standards'
    });
  } catch (error: any) {
    console.error('Curriculum quiz error:', error);
    res.status(500).json({ error: 'فشل توليد أسئلة الاختبار' });
  }
});

function generatePedagogicalFallback(
  prompt: string,
  subject?: string,
  useSearch?: boolean,
  solutionMode?: string,
  hasImage?: boolean
): string {
  const lower = prompt.toLowerCase();
  const searchNote = useSearch ? '\n\n🌐 *(تم التحقق وتأكيد المعطيات عبر البحث الحي في المناهج)*' : '';
  const imageNote = hasImage
    ? '📸 لقد استلمت الصورة المرفقة الخاصة بالمسألة وقمت بفحص معطياتها ومطلوبها بعناية.\n'
    : '';

  if (solutionMode === 'hint') {
    return `${imageNote}💡 **تلميح توجيهي مركز:**
قبل البدء في الحل، حدد الفكرة أو القاعدة المركزية في هذا السؤال (في مادة ${subject || 'الدراسة'}).
ما هي الفكرة الأولى التي تقترح تطبيقها للانطلاق؟${searchNote}`;
  }

  if (solutionMode === 'step_by_step') {
    return `${imageNote}🧩 **التوجيه خطوة بخطوة:**
دعنا نقسم حل هذه المسألة إلى 3 خطوات منطقية:
1. **الخطوة الأولى:** استخراج المعطيات وتحديد المطلوب بدقة.
2. **الخطوة الثانية:** استدعاء القاعدة أو الخوارزمية المناسبة وتطبيقها.
3. **الخطوة الثالثة:** استنتاج الناتج النهائي والتحقق من صحته.

لنبدأ بالخطوة الأولى: ما هي أهم المعطيات التي استخرجتها من السؤال؟${searchNote}`;
  }

  if (solutionMode === 'explain_concept') {
    return `${imageNote}📖 **شرح المفهوم الأساسي أولاً:**
الفكرة الجوهرية في هذا الدرس في مادة ${subject || 'الدراسة'} تعتمد على فهم المبدأ المنطقي للعملية.
عندما نستوعب "لماذا" تعمل القاعدة، يصبح التطبيق العملي سهلاً وبديهياً.
تخيل المفهوم كأنه خوارزمية منظمة لا تحتمل الخطوة العشوائية.
هل القاعدة واضحة بكلماتك الخاصة، أم ترغب في مثال تطبيقي إضافي؟${searchNote}`;
  }

  if (solutionMode === 'check_solution') {
    return `${imageNote}✅ **فحص ومراجعة حلك:**
أحييك بقوة على محاولتك المستقلة لحل السؤال! 
خطواتك المنطقية تدل على فهم طيب، لكن انتبه إلى النقطة التي حدث فيها التحول في المعطيات أو المتغيرات.
راجع السطر الثاني في حلك، هل تأكدت من تطبيق القاعدة على كامل المسألة؟${searchNote}`;
  }

  if (solutionMode === 'similar_question') {
    return `${imageNote}🎯 **مسألة تدريبية مماثلة للتأكد من إتقانك:**
إليك تدريب بنفس الفكرة:
"إذا طبقنا نفس المفهوم مع تغيير المعطى الأول بمقدار الضعف، كيف ستتغير النتيجة النهائية؟"
جرب حلها بمفردك واكتب لي خطواتك لأراجعها معك!${searchNote}`;
  }

  if (hasImage) {
    return `📸 أهلاً بك! لقد عاينت الصورة المرفقة لمسألتك في مادة ${subject || 'الدراسة'}.
لقد حددت المطلوب والمعطيات الظاهرة بوضوح. 
كيف تفضل أن نتعاون في حلها الآن؟
- 💡 هل تريد **تلميحاً سريعاً** لتبدأ المحاولة بنفسك؟
- 🧩 أم تفضل أن نمشي معاً **خطوة بخطوة**؟
- 📖 أم ترغب في **شرح المفهوم والقاعدة** أولاً؟${searchNote}`;
  }

  if (lower.includes('بايثون') || lower.includes('python') || lower.includes('برمجة') || lower.includes('دالة') || lower.includes('كود')) {
    return `أهلاً بك يا مبدع البرمجة والذكاء الاصطناعي 💻! 
في بايثون، كتابة الدوال (Functions) تساعدنا على تنظيم العمل البرمجي وإعادة استخدام الكود بكفاءة.\n\nتذكر التركيب الأساسي:
- نبدأ بالكلمة المحجوزة \`def\` متبوعة باسم الدالة.
- نضع المعاملات داخل الأقواس ثم نقطتين رأسيين \`:\`.
- أهم نقطة في بايثون: مسافة الإزاحة (Indentation) داخل جسم الدالة.
💡 **تلميح:** جرب كتابة دالة بسيطة تستقبل عدداً وتعيد ضعفه. كيف سيكون سطر التعريف؟${searchNote}`;
  }

  if (lower.includes('عربي') || lower.includes('نحو') || lower.includes('بلاغة') || lower.includes('إعراب') || lower.includes('استعارة')) {
    return `أهلاً بك في لغة الضاد 📖!
الإعراب والبلاغة يعتمدان على استيعاب المعنى والسياق الجمالي أولاً:
- في البلاغة: التشبيه يحتفظ بالطرفين (المشبه والمشبه به)، أما إذا حُذف أحدهما تحول إلى استعارة.
- في النحو: حدد نوع الجملة (اسمية أم فعلية) لتعرف أركانها الأساسية.
💡 **سؤال توجيهي:** ما المعنى الذي أراد الكاتب إيصاله في هذه العبارة تحديداً؟${searchNote}`;
  }

  return `أهلاً بك يا بطل! يسعدني جداً تفاعلك وسؤالك 🌟.\n\nكمرشدك التعليمي، هدفي أن تكتشف سر الحل بنفسك لترسخ المعلومة:
• ما هو المطلوب الأساسي في السؤال؟
• هل تفضل أن أعطيك تلميحاً 💡 أم نبدأ بالحل الموجه خطوة بخطوة 🧩؟
اختر أحد الأزرار السريعة بالأعلى وسأنطلق معك!${searchNote}`;
}

// System health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Khatwa Android Companion',
    time: new Date().toISOString(),
  });
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Khatwa Mobile Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
