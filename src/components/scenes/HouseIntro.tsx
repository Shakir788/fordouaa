'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Phase = 'idle' | 'intro1' | 'intro2' | 'intro3' | 'question' | 'count3' | 'count2' | 'count1' | 'doorReveal' | 'whiteout' | 'done';

// YAHAN HUA HAI TYPESCRIPT FIX: Component ab onNext prop accept karega
export default function HouseIntro({ onNext }: { onNext?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  const [hasStarted, setHasStarted] = useState(false);
  
  const [phase, setPhase] = useState<Phase>('idle');
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isInView || hasStarted) return;
    setHasStarted(true);

    const runIntro = async () => {
      setPhase('intro1');
      await delay(2500);
      setPhase('intro2');
      await delay(2500);
      setPhase('intro3');
      await delay(2500);
      setPhase('question'); 
    };

    runIntro();
  }, [isInView, hasStarted]);

  // The Countdown & Door Opening Timeline with FULLSCREEN MAGIC
  const handleYesClick = async () => {
    // --- BROWSER FULLSCREEN TRIGGER ---
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await ((document.documentElement as any).webkitRequestFullscreen)();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        await ((document.documentElement as any).msRequestFullscreen)();
      }
    } catch (err) {
      console.log("Fullscreen blocked by browser, but continuing the animation.", err);
    }
    // -----------------------------------

    setPhase('count3');
    await delay(1200);
    setPhase('count2');
    await delay(1200);
    setPhase('count1');
    await delay(1200);
    
    // Trigger Door Animation
    setPhase('doorReveal');
    await delay(3500); // Wait for doors to fully open and text to shine
    
    // Blinding light transition instead of blackout
    setPhase('whiteout');
    await delay(1000);
    
    setPhase('done');
    
    // YAHAN HUA HAI SCROLL FIX: Ab ye agla scene trigger karega!
    if (onNext) {
      onNext();
    }
  };

  const handleNoHover = () => {
    const randomX = (Math.random() - 0.5) * 350;
    const randomY = (Math.random() - 0.5) * 350;
    setNoPos({ x: randomX, y: randomY });
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#030305] overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[50vw] h-[50vw] bg-[#fbbf24]/5 rounded-full blur-[150px]" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- PHASE 1: SUSPENSE TEXTS --- */}
        {phase === 'intro1' && (
          <motion.p key="intro1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1 }} className="absolute z-10 text-3xl md:text-5xl font-light text-white/80 font-[family-name:var(--font-cormorant)] italic text-center px-6">
            Nous avons rêvé...
          </motion.p>
        )}

        {phase === 'intro2' && (
          <motion.p key="intro2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1 }} className="absolute z-10 text-3xl md:text-5xl font-light text-white/80 font-[family-name:var(--font-cormorant)] italic text-center px-6">
            Nous avons patienté...
          </motion.p>
        )}

        {phase === 'intro3' && (
          <motion.p key="intro3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1 }} className="absolute z-10 text-3xl md:text-5xl font-light text-[#fbbf24] font-[family-name:var(--font-cormorant)] italic text-center px-6">
            Et maintenant...
          </motion.p>
        )}

        {/* --- PHASE 2: QUESTION & RUNAWAY BUTTON --- */}
        {phase === 'question' && (
          <motion.div key="question" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 1 }} className="relative z-20 flex flex-col items-center text-center px-6 w-full max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-white font-[family-name:var(--font-cormorant)] italic mb-16 leading-relaxed">
              Es-tu prête à franchir cette porte avec moi ?
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative w-full h-40">
              <button 
                onClick={handleYesClick}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white tracking-widest uppercase text-xs backdrop-blur-md transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] z-30 cursor-pointer"
              >
                💖 Oui, pour toujours
              </button>

              <motion.button 
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onMouseEnter={handleNoHover}
                onClick={handleNoHover} 
                className="relative px-8 py-4 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 rounded-full text-white/70 tracking-widest uppercase text-xs backdrop-blur-md z-30 cursor-pointer"
              >
                💔 Non, je veux attendre
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* --- PHASE 3: COUNTDOWN --- */}
        {(phase === 'count3' || phase === 'count2' || phase === 'count1') && (
          <motion.div
            key={phase}
            initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute z-20 flex items-center justify-center"
          >
            <span 
              className="text-[15rem] md:text-[25rem] font-light text-white/90 font-[family-name:var(--font-cormorant)] leading-none"
              style={{ textShadow: '0 0 80px rgba(251,191,36,0.8)' }}
            >
              {phase === 'count3' ? '3' : phase === 'count2' ? '2' : '1'}
            </span>
          </motion.div>
        )}

        {/* --- PHASE 4: 3D DOOR REVEAL --- */}
        {phase === 'doorReveal' && (
          <motion.div 
            key="doorReveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 perspective-[2000px] flex items-center justify-center"
          >
            {/* The Text & Glowing Light inside the house */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
               {/* Massive golden light burst */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 2 }}
                 transition={{ duration: 3, ease: "easeIn" }}
                 className="absolute w-[40vw] h-[40vw] bg-[#fbbf24] rounded-full blur-[100px]"
               />
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1, duration: 1.5 }}
                 className="relative z-10 text-center"
               >
                 <p className="text-[#fbbf24] tracking-[0.5em] uppercase text-xs font-semibold mb-4 drop-shadow-md">
                   Ferme les yeux
                 </p>
                 <h1 className="text-5xl md:text-8xl font-light text-white font-[family-name:var(--font-cormorant)] italic drop-shadow-2xl">
                   Bienvenue chez nous
                 </h1>
               </motion.div>
            </div>

            {/* Left Door Panel */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -105 }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute left-0 top-0 w-1/2 h-full bg-[#08080a] border-r border-white/10 origin-left z-20 shadow-[20px_0_50px_rgba(0,0,0,0.8)] flex justify-end items-center"
            >
              {/* Golden Handle */}
              <div className="w-2 h-16 bg-gradient-to-b from-[#fbbf24] to-yellow-600 rounded-l-md mr-4 shadow-lg opacity-80" />
            </motion.div>

            {/* Right Door Panel */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 105 }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute right-0 top-0 w-1/2 h-full bg-[#08080a] border-l border-white/10 origin-right z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex justify-start items-center"
            >
              {/* Golden Handle */}
              <div className="w-2 h-16 bg-gradient-to-b from-[#fbbf24] to-yellow-600 rounded-r-md ml-4 shadow-lg opacity-80" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PHASE 5: THE GLOWING TRANSITION WIPE (WHITEOUT) --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: (phase === 'whiteout' || phase === 'done') ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[#030305] z-40 pointer-events-none"
      />

    </div>
  );
}