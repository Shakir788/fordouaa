'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';

// Halke CSS stars — sirf continuity ke liye taaki HeroNightSky mein transition
// smooth lage, koi heavy 3D canvas ki zaroorat nahi ek chhoti intro screen ke liye
function AmbientStars() {
  const stars = useRef(
    Array.from({ length: 60 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 4,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: 3 + s.delay, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
        />
      ))}
    </div>
  );
}

export default function IntroSecret() {
  const { isIntroComplete, completeIntro } = useAppContext();
  const [step, setStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginExit = () => {
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    setIsExiting(true);
    // Exit animation ko saans lene do, phir hi asli content mount karo
    setTimeout(() => completeIntro(), 1200);
  };

  const handleStart = () => {
    setStep(1);

    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Audio block ho gaya toh bhi text apne aap chalta rahe, atka na rahe
        fallbackTimer.current = setTimeout(beginExit, 18000);
      });
    } else {
      fallbackTimer.current = setTimeout(beginExit, 18000);
    }

    // Fallback: agar 'ended' event kisi wajah se fire na ho (browser quirks),
    // ye 18s wala timer safety net ka kaam karega. Apni French audio ki
    // length ke hisaab se adjust kar lena.
    fallbackTimer.current = setTimeout(beginExit, 18000);
  };

  // Audio khatam hote hi turant aage badho — timeout guess pe depend nahi karna
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const handleEnded = () => beginExit();
    audioEl.addEventListener('ended', handleEnded);
    return () => audioEl.removeEventListener('ended', handleEnded);
  }, []);

  useEffect(() => {
    return () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, []);

  if (isIntroComplete) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="intro-wrapper"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white font-sans overflow-hidden"
        >
          <audio ref={audioRef} src="/audio/intro-voice.mp3" preload="auto" />
          <AmbientStars />

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1 }}
                className="relative z-10 flex flex-col items-center"
              >
                <button
                  onClick={handleStart}
                  className="px-8 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm tracking-[0.2em] uppercase hover:bg-white/10 hover:border-white/30 transition-all duration-500"
                >
                  Headphones Recommended 🎧
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="relative z-10 max-w-4xl px-8 text-center space-y-8"
              >
                <p className="text-3xl md:text-5xl leading-relaxed font-light italic text-white/90 tracking-wide font-[family-name:var(--font-cormorant)]">
                  &quot;Assalamu Alaikum, Douaa...&quot;
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, delay: 3 }}
                  className="text-lg md:text-2xl leading-relaxed font-extralight text-white/60 space-y-6"
                >
                  <span className="block">Avant que tu ne continues, je veux que tu saches une chose.</span>
                  <span className="block">Ce site n&apos;a pas été créé avec des lignes de code. Il a été créé avec chaque doua, chaque souvenir, et chaque rêve que je chéris pour nous.</span>
                  <span className="block">Même si dix mille kilomètres nous séparent aujourd&apos;hui... ici, dans cet espace, nous sommes déjà ensemble à Casablanca.</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip — subtle, sirf tab dikhta hai jab audio start ho chuki ho */}
          {step === 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4 }}
              onClick={beginExit}
              className="absolute bottom-8 right-8 z-20 text-[11px] uppercase tracking-[0.25em] text-white/30 hover:text-white/60 transition-colors"
            >
              Skip
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}