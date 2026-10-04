import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Trophy,
  Flame,
  RotateCcw,
  Play,
  ArrowRight,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Car
} from 'lucide-react';
import { StudentProfile, GameRecord } from '../types';

interface GamesScreenProps {
  student: StudentProfile;
  onProfileUpdate: (updated: StudentProfile) => void;
  onBack?: () => void;
}

type ActiveGameMode = 'hub' | 'racing' | 'memory' | 'quick_math' | 'adventure';

export const GamesScreen: React.FC<GamesScreenProps> = ({
  student,
  onProfileUpdate,
  onBack,
}) => {
  const [activeMode, setActiveMode] = useState<ActiveGameMode>('hub');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [playMinutesSession, setPlayMinutesSession] = useState<number>(0);
  const [showBreakReminder, setShowBreakReminder] = useState<boolean>(false);

  // Stored game records
  const gameStats: GameRecord = student.gameRecords || {
    racingHighScore: 240,
    racingTracksUnlocked: 1,
    selectedCarColor: '#10b981',
    selectedCarModel: 'روبو-سبيد',
    brainScore: 120,
    adventureStage: 1,
    totalGamesPlayed: 6,
    totalPlayMinutesToday: 8,
  };

  // Screen-time session counter (Section 39-40)
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayMinutesSession((prev) => {
        const next = prev + 1;
        // After 15 minutes of continuous gaming, trigger gentle break reminder
        if (next === 15 || next === 30) {
          setShowBreakReminder(true);
        }
        return next;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Racing Game Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [racingScore, setRacingScore] = useState<number>(0);
  const [racingGameOver, setRacingGameOver] = useState<boolean>(false);
  const [racingActive, setRacingActive] = useState<boolean>(false);
  const carXRef = useRef<number>(140);
  const obstaclesRef = useRef<{ x: number; y: number; width: number; height: number; type: 'car' | 'star' }[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Car Customization Colors
  const CAR_COLORS = [
    { name: 'زمردي خطوة', hex: '#10b981', minXP: 0 },
    { name: 'سايبر تركوازي', hex: '#06b6d4', minXP: 200 },
    { name: 'ياقوت أحمر', hex: '#f43f5e', minXP: 450 },
    { name: 'ذهبي الامتياز', hex: '#f59e0b', minXP: 800 },
  ];

  // Start Racing Game
  const startRacingGame = () => {
    setRacingScore(0);
    setRacingGameOver(false);
    setRacingActive(true);
    carXRef.current = 140;
    obstaclesRef.current = [
      { x: 70, y: -50, width: 35, height: 50, type: 'car' },
      { x: 200, y: -220, width: 35, height: 50, type: 'car' },
      { x: 140, y: -120, width: 22, height: 22, type: 'star' },
    ];
  };

  // Racing Game Loop
  useEffect(() => {
    if (activeMode !== 'racing' || !racingActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scoreCounter = 0;
    let speed = 4;

    const gameLoop = () => {
      scoreCounter++;
      if (scoreCounter % 5 === 0) {
        setRacingScore((s) => s + 1);
      }

      // Draw road
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road borders & lane lines
      ctx.fillStyle = '#334155';
      ctx.fillRect(20, 0, 8, canvas.height);
      ctx.fillRect(canvas.width - 28, 0, 8, canvas.height);

      // Dashed lane lines
      ctx.fillStyle = '#64748b';
      const offset = (scoreCounter * 6) % 40;
      for (let y = -40 + offset; y < canvas.height; y += 40) {
        ctx.fillRect(canvas.width / 2 - 2, y, 4, 20);
      }

      // Draw Player Car
      const carW = 34;
      const carH = 55;
      const carY = canvas.height - 80;

      ctx.fillStyle = gameStats.selectedCarColor || '#10b981';
      ctx.beginPath();
      ctx.roundRect(carXRef.current, carY, carW, carH, 8);
      ctx.fill();

      // Car windshield & wheels
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(carXRef.current + 5, carY + 12, carW - 10, 14);
      ctx.fillStyle = '#020617';
      ctx.fillRect(carXRef.current - 3, carY + 8, 4, 12);
      ctx.fillRect(carXRef.current + carW - 1, carY + 8, 4, 12);
      ctx.fillRect(carXRef.current - 3, carY + 36, 4, 12);
      ctx.fillRect(carXRef.current + carW - 1, carY + 36, 4, 12);

      // Move & Draw Obstacles
      for (let i = 0; i < obstaclesRef.current.length; i++) {
        const obs = obstaclesRef.current[i];
        obs.y += speed;

        if (obs.type === 'car') {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 6);
          ctx.fill();

          // Obstacle windshield
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(obs.x + 4, obs.y + 10, obs.width - 8, 12);

          // Collision detection
          if (
            carXRef.current < obs.x + obs.width &&
            carXRef.current + carW > obs.x &&
            carY < obs.y + obs.height &&
            carY + carH > obs.y
          ) {
            // Collision!
            setRacingActive(false);
            setRacingGameOver(true);

            // Update high score & XP
            const finalScore = scoreCounter;
            const newHigh = Math.max(gameStats.racingHighScore, finalScore);
            const gainedXP = Math.floor(finalScore / 10);

            const updatedStats: GameRecord = {
              ...gameStats,
              racingHighScore: newHigh,
              totalGamesPlayed: gameStats.totalGamesPlayed + 1,
            };

            onProfileUpdate({
              ...student,
              xp: student.xp + gainedXP,
              gameRecords: updatedStats,
            });
            return;
          }
        } else {
          // XP Star Collectible
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(obs.x + 10, obs.y + 10, 9, 0, Math.PI * 2);
          ctx.fill();

          // Star pickup collision
          if (
            carXRef.current < obs.x + obs.width &&
            carXRef.current + carW > obs.x &&
            carY < obs.y + obs.height &&
            carY + carH > obs.y
          ) {
            setRacingScore((s) => s + 25);
            obs.y = -100 - Math.random() * 200;
            obs.x = 40 + Math.random() * (canvas.width - 90);
          }
        }

        // Recycle obstacles when out of screen
        if (obs.y > canvas.height) {
          obs.y = -60 - Math.random() * 180;
          obs.x = 40 + Math.random() * (canvas.width - 90);
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeMode, racingActive, gameStats.selectedCarColor]);

  // Touch Steering
  const handleSteer = (direction: 'left' | 'right') => {
    if (!racingActive) return;
    const step = 28;
    if (direction === 'left') {
      carXRef.current = Math.max(35, carXRef.current - step);
    } else {
      carXRef.current = Math.min(235, carXRef.current + step);
    }
  };

  // Memory Game State
  const MEMORY_ICONS = ['💻', '🧠', '🚀', '🌟', '📚', '⚡'];
  const [memoryCards, setMemoryCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryScore, setMemoryScore] = useState<number>(0);
  const [memoryWon, setMemoryWon] = useState<boolean>(false);

  const startMemoryGame = () => {
    const deck = [...MEMORY_ICONS, ...MEMORY_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, idx) => ({ id: idx, symbol, flipped: false, matched: false }));
    setMemoryCards(deck);
    setFlippedCards([]);
    setMemoryScore(0);
    setMemoryWon(false);
  };

  const handleFlipCard = (id: number) => {
    if (flippedCards.length === 2) return;
    const card = memoryCards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newCards = memoryCards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setMemoryCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const c1 = newCards.find((c) => c.id === firstId);
      const c2 = newCards.find((c) => c.id === secondId);

      if (c1 && c2 && c1.symbol === c2.symbol) {
        // Matched!
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, matched: true } : c))
          );
          setFlippedCards([]);
          setMemoryScore((s) => s + 20);

          // Check if all matched
          const remaining = newCards.filter((c) => !c.matched && c.id !== firstId && c.id !== secondId);
          if (remaining.length === 0) {
            setMemoryWon(true);
            onProfileUpdate({
              ...student,
              xp: student.xp + 50,
            });
          }
        }, 500);
      } else {
        // Mismatch, flip back
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c))
          );
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 pb-16">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {activeMode !== 'hub' ? (
            <button
              onClick={() => {
                setRacingActive(false);
                setActiveMode('hub');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition"
              title="العودة لصالة الألعاب"
            >
              <ArrowRight size={18} />
            </button>
          ) : (
            onBack && (
              <button
                onClick={onBack}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition"
                title="رجوع"
              >
                <ArrowRight size={18} />
              </button>
            )
          )}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <Gamepad2 size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100">ألعاب خطوة (Khatwa Mini-Games)</h2>
            <span className="text-[10px] text-amber-400 block -mt-0.5">
              ترفيه آمن وهادف · تدريب الذاكرة والسرعة
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
            title="الصوت"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Session Play Time Pill */}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl text-[10px] text-slate-300 font-mono">
            <Clock size={11} className="text-amber-400" />
            <span>{playMinutesSession} دقيقة</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Balanced Screen Time Banner (Section 39) */}
        <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 text-right">
            <Sparkles size={16} className="text-emerald-400 shrink-0" />
            <span>الهدف الأساسي هو التعلّم وبناء المهارات، والألعاب وسيلة لتجديد النشاط!</span>
          </div>
        </div>

        {/* 1. Hub View: Selection Cards */}
        {activeMode === 'hub' && (
          <div className="space-y-3.5">
            {/* Khatwa Racing Hero Card */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-800/80 to-slate-900 border border-amber-500/30 shadow-sm space-y-3 text-right">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  لعبة مميزة 🏎️
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  أعلى سكور: {gameStats.racingHighScore}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-100">سباق خطوة (Khatwa Racing)</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  تفادَ السيارات والعقبات، واجمع نجوم نقاط الخبرة XP، وخصص لون سيارتك بتقدمك في المذاكرة!
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: gameStats.selectedCarColor }} />
                  <span>السيارة المختارة: {gameStats.selectedCarModel}</span>
                </div>

                <button
                  onClick={() => {
                    setActiveMode('racing');
                    startRacingGame();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95"
                >
                  <Play size={14} className="fill-slate-950" />
                  <span>انطلاق السباق</span>
                </button>
              </div>
            </div>

            {/* Other Mini-Games Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Brain Memory Cards */}
              <div
                onClick={() => {
                  setActiveMode('memory');
                  startMemoryGame();
                }}
                className="p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 cursor-pointer transition text-right space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-2">
                    🧠
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">تحدي الذاكرة السريعة</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    اقلب البطاقات وطابق الرموز العلمية بأقل عدد محاولات.
                  </p>
                </div>
                <div className="text-[10px] text-purple-400 font-semibold pt-1 border-t border-slate-700/40 flex items-center justify-between">
                  <span>+50 XP</span>
                  <span>العب الآن ←</span>
                </div>
              </div>

              {/* Khatwa Adventure Milestone */}
              <div
                onClick={() => setActiveMode('adventure')}
                className="p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 cursor-pointer transition text-right space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-2">
                    🗺️
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">مغامرة خطوة (Adventure)</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    مراحل متتالية تجمع بين التحديات والأسئلة لفتح الأوسمة.
                  </p>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold pt-1 border-t border-slate-700/40 flex items-center justify-between">
                  <span>المرحلة {gameStats.adventureStage}</span>
                  <span>استكشف ←</span>
                </div>
              </div>
            </div>

            {/* Car Customization (Section 33) */}
            <div className="p-4 rounded-3xl bg-slate-800/40 border border-slate-700/60 space-y-3 text-right">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">تخصيص سيارة السباق (Car Tuning)</span>
                <span className="text-[10px] text-slate-400">تُفتح بنقاط خبرة المذاكرة (بدون دفع مالي)</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {CAR_COLORS.map((c) => {
                  const isUnlocked = student.xp >= c.minXP;
                  const isSelected = gameStats.selectedCarColor === c.hex;

                  return (
                    <button
                      key={c.hex}
                      disabled={!isUnlocked}
                      onClick={() => {
                        const updated: GameRecord = { ...gameStats, selectedCarColor: c.hex };
                        onProfileUpdate({ ...student, gameRecords: updated });
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-right text-xs transition ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                          : isUnlocked
                          ? 'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
                          : 'border-slate-800 bg-slate-900/40 text-slate-600 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {isUnlocked ? (isSelected ? '✓' : '') : `${c.minXP} XP`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. Khatwa Racing Canvas Game Mode */}
        {activeMode === 'racing' && (
          <div className="flex flex-col items-center space-y-3">
            {/* Score Bar */}
            <div className="w-full flex items-center justify-between px-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold">النقاط: {racingScore}</span>
              <span className="text-slate-400">الرقم القياسي: {gameStats.racingHighScore}</span>
            </div>

            {/* Game Canvas */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950">
              <canvas
                ref={canvasRef}
                width={300}
                height={380}
                className="block mx-auto"
              />

              {/* Game Over Overlay */}
              {racingGameOver && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-3 z-20">
                  <Trophy size={36} className="text-amber-400 animate-bounce" />
                  <h3 className="text-base font-black text-slate-100">انتهى السباق!</h3>
                  <p className="text-xs text-slate-300">
                    حققت <span className="text-amber-400 font-bold font-mono">{racingScore} نقطة</span>!
                  </p>
                  <p className="text-[10px] text-emerald-400">
                    +{Math.floor(racingScore / 10)} XP خبرة أضيفت لملفك
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={startRacingGame}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      إعادة المحاولة
                    </button>
                    <button
                      onClick={() => setActiveMode('hub')}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                    >
                      صالة الألعاب
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* On-screen Touch Controls */}
            <div className="w-full max-w-xs flex items-center justify-between gap-4 pt-1">
              <button
                onClick={() => handleSteer('left')}
                className="flex-1 py-3.5 rounded-2xl bg-slate-800 active:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-sm flex items-center justify-center gap-1 shadow-sm select-none"
              >
                <ChevronRight size={20} />
                <span>يسار</span>
              </button>

              <button
                onClick={() => handleSteer('right')}
                className="flex-1 py-3.5 rounded-2xl bg-slate-800 active:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-sm flex items-center justify-center gap-1 shadow-sm select-none"
              >
                <span>يمين</span>
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>
        )}

        {/* 3. Memory Match Mini-Game Mode */}
        {activeMode === 'memory' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-between px-2 text-xs">
              <span className="font-bold text-purple-400 font-mono">النقاط: {memoryScore}</span>
              <button
                onClick={startMemoryGame}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw size={12} />
                <span>إعادة خلط</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
              {memoryCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleFlipCard(card.id)}
                  className={`w-16 h-16 rounded-2xl text-2xl flex items-center justify-center font-bold border transition-all duration-300 ${
                    card.flipped || card.matched
                      ? 'bg-purple-950/60 border-purple-500 scale-105'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {card.flipped || card.matched ? card.symbol : '❓'}
                </button>
              ))}
            </div>

            {memoryWon && (
              <div className="p-4 rounded-3xl bg-emerald-950/40 border border-emerald-500/50 space-y-2">
                <h3 className="text-sm font-bold text-emerald-300">أحسنت! ذاكرة حديدية 🌟</h3>
                <p className="text-xs text-slate-300">ربحت +50 XP خبرة إضافية لسرعة البديهة والتركيز!</p>
                <button
                  onClick={startMemoryGame}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  العب مجدداً
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. Adventure Roadmap Mode */}
        {activeMode === 'adventure' && (
          <div className="space-y-3.5 text-right">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-2">
              <h3 className="text-xs font-bold text-slate-100">مسار مغامرة خطوة (Stages)</h3>
              <p className="text-[11px] text-slate-300">
                أكمل التحديات العلمية والترفيهية لفتح الأوسمة الحصرية.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { stage: 1, title: 'محطة الانطلاق: سرعة البديهة', desc: 'أكمل سباق سيارات بنتيجة 100+ نقطة', xp: 50, done: true },
                { stage: 2, title: 'محطة الذاكرة: الذكاء الاصطناعي', desc: 'طابق جميع بطاقات الرموز العلمية', xp: 60, done: false },
                { stage: 3, title: 'محطة التحدي البرمجي: كود التحدي', desc: 'حل مسألة برمجية سريعة مع المرشد', xp: 80, done: false },
                { stage: 4, title: 'قمة الإتقان: الاختبار الشامل', desc: 'إتمام 3 مهام يومية متتالية', xp: 100, done: false },
              ].map((st) => (
                <div
                  key={st.stage}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    st.done
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div className="text-right">
                    <span className="text-xs font-bold block text-slate-200">
                      مرحلة {st.stage}: {st.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{st.desc}</span>
                  </div>

                  <span className="text-xs font-bold font-mono">
                    {st.done ? 'مكتملة ✓' : `+${st.xp} XP`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gentle Screen-Time Break Reminder Dialog (Section 39) */}
      {showBreakReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-sm p-5 space-y-3.5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Clock size={24} />
            </div>

            <h3 className="text-sm font-black text-slate-100">
              أحسنت! أتممت جولة ترفيهية ممتعة 👏
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              للحفاظ على صحة عينيك وصفاء ذهنك، ننصحك بأخذ استراحة قصيرة، شرب كوب ماء 💧، والعودة إلى خطتك الدراسية.
            </p>

            <button
              onClick={() => setShowBreakReminder(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
