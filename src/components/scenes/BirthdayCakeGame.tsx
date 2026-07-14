'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Multi-color Confetti Generator
const generateConfetti = (count: number) => {
  const colors = ['#fbbf24', '#f43f5e', '#3b82f6', '#10b981', '#a855f7', '#e8c468'];
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 2.5 + 2,
    delay: Math.random() * 0.6,
    size: Math.random() * 4 + 8,
  }));
};

export default function BirthdayCakeGame({ onNext }: { onNext?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [phase, setPhase] = useState<'intro' | 'drag' | 'lit' | 'blown' | 'wishes'>('intro');
  const [confetti, setConfetti] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('drag'), 2500);
    audioRef.current = new Audio('/happy-birthday.mp3');
    return () => clearTimeout(timer);
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    // Check if lighter is dragged close to the center candle position
    if (info.offset.x < -40 || info.point.x < window.innerWidth / 2 + 60) {
      setPhase('lit');
    }
  };

  const handleBlow = () => {
    setPhase('blown');
    setConfetti(generateConfetti(180)); 
    
    if (audioRef.current) {
      audioRef.current.play(); 
    }

    setTimeout(() => {
      setPhase('wishes');
    }, 4500);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex flex-col items-center justify-center pt-24">
      
      {/* --- REALISTIC BACKGROUND DECORATIONS --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex flex-col items-center">
        {/* Luxury Ambient Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-[140px] transition-all duration-1000 ${phase === 'blown' || phase === 'wishes' ? 'bg-[#E8C468]/15' : 'bg-[#8b1e44]/10'}`} />
        
        {/* Grand Cinematic Backdrop Text (Moved to top and made subtle) */}
        <div className="absolute top-10 md:top-16 w-full flex flex-col items-center text-center opacity-40">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8 }}
            className="text-3xl md:text-5xl font-light text-[#E8C468]/60 font-[family-name:var(--font-cormorant)] italic tracking-wide mb-2"
          >
            Joyeux Anniversaire
          </motion.h1>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.4 }}
            className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-[#E8C468] to-yellow-600 tracking-[0.2em] uppercase drop-shadow-[0_0_30px_rgba(232,196,104,0.25)] font-[family-name:var(--font-cormorant)]"
          >
            DOUAA
          </motion.h1>
        </div>

        {/* Cinematic Floating Orbs (Replacing broken Balloon images) */}
        <motion.div 
          className="absolute top-1/4 left-10 w-24 h-24 bg-[#E8C468]/10 rounded-full blur-xl"
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-10 w-32 h-32 bg-[#8b1e44]/20 rounded-full blur-2xl"
          animate={{ y: [20, -20, 20], x: [10, -10, 10], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* --- SHIMMERING CONFETTI WIPE --- */}
      {confetti.length > 0 && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {confetti.map((c) => (
            <motion.div
              key={c.id}
              className="absolute rounded-sm opacity-90"
              style={{ left: c.left, backgroundColor: c.color, top: '-5%', width: `${c.size}px`, height: `${c.size}px`, boxShadow: `0 0 10px ${c.color}` }}
              animate={{ y: ['0vh', '105vh'], rotate: [0, 720], x: [0, (Math.random() - 0.5) * 120] }}
              transition={{ duration: c.duration, delay: c.delay, ease: [0.25, 1, 0.5, 1] }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* --- ACT 1: INTERACTIVE REAL CAKE & DRAG LIGHTER --- */}
        {(phase === 'intro' || phase === 'drag' || phase === 'lit') && (
          <motion.div
            key="cake-scene"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="relative z-20 flex flex-col items-center mt-32 md:mt-48 w-full"
          >
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[#E8C468] tracking-[0.4em] uppercase text-[10px] md:text-xs font-medium mb-10 text-center bg-[#030305]/80 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-md shadow-2xl z-30"
            >
              {phase === 'intro' ? "Il manque quelque chose..." : phase === 'drag' ? "Approche le briquet de la bougie" : "Fais un vœu et souffle"}
            </motion.p>

            <div className="relative flex items-center justify-center w-full max-w-xl h-64 mt-4">
              
              {/* THE LOCAL PHOTOGRAPHIC CAKE */}
              <div className="relative z-10 w-64 md:w-80 flex justify-center">
                <img 
                  src="/cake.png" 
                  alt="Birthday Cake" 
                  className="w-full h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] object-contain select-none pointer-events-none"
                  onError={(e) => {
                    // Fallback CSS cake if image is missing
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('fallback-cake');
                  }}
                />
                
                {/* Fallback CSS Cake (Shows only if /cake.png is missing) */}
                <div className="hidden fallback-cake w-48 h-24 bg-[#2a1a10] rounded-xl border-t-8 border-[#E8C468] shadow-2xl relative">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3 h-8 bg-red-500 rounded-t-sm" />
                </div>
                
                {/* DYNAMIC REAL CSS FLAME OVER THE CAKE CANDLE */}
                <AnimatePresence>
                  {phase === 'lit' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: [1, 1.15, 0.95, 1.05, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror" }}
                      className="absolute top-[4%] left-[49.5%] -translate-x-1/2 w-6 h-10 bg-gradient-to-t from-yellow-300 via-orange-500 to-transparent rounded-full blur-[0.5px] shadow-[0_0_35px_#E8C468] z-20"
                      style={{ borderRadius: '50% 50% 20% 20% / 60% 60% 40% 40%' }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* THE DRAGGABLE LOCAL LIGHTER PROP */}
              <AnimatePresence>
                {phase === 'drag' && (
                  <motion.div
                    drag
                    dragConstraints={containerRef}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, x: 120, y: 40 }}
                    animate={{ opacity: 1, x: 120, y: 40 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
                    whileDrag={{ scale: 1.08 }}
                    className="absolute z-40 cursor-grab active:cursor-grabbing flex flex-col items-center touch-none"
                  >
                    <div className="mb-3 px-2.5 py-1 bg-[#E8C468]/20 backdrop-blur-md rounded-md text-[9px] text-[#E8C468] font-semibold uppercase tracking-[0.2em] border border-[#E8C468]/30 whitespace-nowrap animate-pulse shadow-lg">
                      Glisse-moi (Drag)
                    </div>
                    <img 
                      src="/lighter.png" 
                      alt="Lighter" 
                      className="w-16 md:w-20 drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] pointer-events-none select-none"
                      onError={(e) => {
                         // Fallback CSS Lighter
                         e.currentTarget.style.display = 'none';
                         e.currentTarget.parentElement?.classList.add('fallback-lighter');
                      }}
                    />
                    {/* Fallback CSS Lighter (Shows only if /lighter.png is missing) */}
                    <div className="hidden fallback-lighter w-8 h-14 bg-zinc-400 rounded-sm border-2 border-zinc-600 relative">
                       <div className="absolute -top-3 left-0 w-full h-3 bg-zinc-300" />
                       <div className="absolute -top-4 right-1 w-2 h-2 bg-red-600 rounded-full" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* THE LUXURY CINEMATIC BLOW BUTTON */}
            <AnimatePresence>
              {phase === 'lit' && (
                <motion.button
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleBlow}
                  className="mt-14 px-10 py-4 bg-[#030305]/80 backdrop-blur-md border border-[#E8C468]/40 rounded-full text-[#E8C468] tracking-[0.3em] uppercase text-xs hover:bg-[#E8C468]/10 hover:shadow-[0_0_40px_rgba(232,196,104,0.2)] transition-all flex items-center gap-3 z-50 cursor-pointer"
                >
                  <span className="text-base animate-bounce">💨</span> Souffler la bougie
                </motion.button>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* --- ACT 2: DEEP ROMANTIC EMOTION & GRAPHIC OVERLAY --- */}
        {phase === 'wishes' && (
          <motion.div
            key="wishes-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8 }}
            className="relative z-20 flex flex-col items-center text-center px-6 max-w-3xl mt-32"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="text-3xl md:text-5xl font-light text-white font-[family-name:var(--font-cormorant)] italic leading-relaxed mb-6"
            >
              Que tous tes vœux se réalisent...
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 1.5 }}
              className="text-[#E8C468] font-extralight tracking-widest text-base md:text-xl max-w-xl leading-relaxed mb-16"
            >
              Parce que le mien s'est déjà réalisé le jour où je t'ai rencontrée.
            </motion.p>

            {/* The Blockbuster Climax Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 5.2, duration: 2 }}
              className="flex flex-col items-center bg-white/[0.02] border border-white/5 rounded-2xl px-12 py-6 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30"
            >
              <p className="text-white/30 uppercase tracking-[0.5em] text-[10px] mb-3">
                To be continued...
              </p>
              <p className="text-white/80 font-light italic text-xl md:text-2xl font-[family-name:var(--font-cormorant)] tracking-wide">
                Notre histoire ne fait que commencer.
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 7.5, duration: 1.2 }}
              onClick={onNext}
              className="mt-14 px-8 py-3.5 border border-white/10 text-white/40 text-[10px] uppercase tracking-[0.4em] rounded-full hover:bg-white/5 hover:text-[#E8C468] hover:border-[#E8C468]/40 transition-all cursor-pointer z-40"
            >
              Entrer dans le jardin
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}