'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Jugnu (Fireflies) and Magical Spores
const generateParticles = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 6 + 6,
    delay: Math.random() * 5,
    xOffset: (Math.random() - 0.5) * 60,
  }));
};

export default function GardenOfPatience() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(generateParticles(60));
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#010804]">
      
      {/* --- BACKGROUND AMBIENT GLOWS --- */}
      <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-[#064e3b]/30 to-transparent z-0 pointer-events-none" />
      <div className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-[#fbbf24]/20 via-[#064e3b]/20 to-transparent z-0 pointer-events-none" />

      {/* --- MAGICAL FIREFLIES --- */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#fbbf24]"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              boxShadow: '0 0 15px 2px rgba(251,191,36,0.8)',
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, p.xOffset, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* --- THE HANGING VINES (LEFT & RIGHT FRAMING) --- */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-50">
        {/* Left Vine */}
        <svg className="absolute left-0 top-0 h-full w-32 md:w-64 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" preserveAspectRatio="none" viewBox="0 0 100 400" fill="none">
          <motion.path d="M 0 0 C 40 100 10 250 60 400" stroke="url(#vineGrad)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, ease: "easeInOut" }} />
          <motion.path d="M 0 0 C 60 150 20 300 90 400" stroke="url(#vineGrad)" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 5, delay: 1, ease: "easeInOut" }} />
          <defs>
            <linearGradient id="vineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>

        {/* Right Vine */}
        <svg className="absolute right-0 top-0 h-full w-32 md:w-64 transform scale-x-[-1] drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" preserveAspectRatio="none" viewBox="0 0 100 400" fill="none">
          <motion.path d="M 0 0 C 40 100 10 250 60 400" stroke="url(#vineGrad)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, ease: "easeInOut" }} />
          <motion.path d="M 0 0 C 60 150 20 300 90 400" stroke="url(#vineGrad)" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 5, delay: 1.5, ease: "easeInOut" }} />
        </svg>
      </div>

      {/* --- THE SWING (JHOOLA) IN DEEP BACKGROUND --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 md:w-64 h-[50vh] z-10 opacity-30 pointer-events-none">
        <motion.svg
          width="100%" height="100%" viewBox="0 0 100 200"
          style={{ transformOrigin: 'top center' }}
          animate={{ rotate: [-2.5, 2.5, -2.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Ropes */}
          <line x1="30" y1="0" x2="30" y2="160" stroke="#fbbf24" strokeWidth="0.5" />
          <line x1="70" y1="0" x2="70" y2="160" stroke="#fbbf24" strokeWidth="0.5" />
          {/* Wooden Seat */}
          <rect x="25" y="160" width="50" height="3" fill="#fbbf24" rx="1.5" className="drop-shadow-[0_0_10px_#fbbf24]" />
          {/* Vines wrapped around ropes */}
          <path d="M 30 0 Q 25 30 30 60 T 30 120" stroke="#059669" strokeWidth="1" fill="none" />
          <path d="M 70 20 Q 75 50 70 80 T 70 140" stroke="#059669" strokeWidth="1" fill="none" />
        </motion.svg>
      </div>

      {/* --- THE MASSIVE GLOWING LOTUS (BOTTOM) --- */}
      <div className="absolute -bottom-[5vh] md:-bottom-[10vh] left-1/2 -translate-x-1/2 w-[250px] h-[250px] md:w-[400px] md:h-[400px] z-20 pointer-events-none">
        <motion.svg
          width="100%" height="100%" viewBox="0 0 200 200"
          className="drop-shadow-[0_0_40px_rgba(251,191,36,0.6)]"
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Center Petal */}
          <motion.path d="M 100 180 C 100 100, 70 60, 100 20 C 130 60, 100 100, 100 180" fill="rgba(251,191,36,0.1)" stroke="#fbbf24" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3 }} />
          {/* Inner Petals */}
          <motion.path d="M 100 180 C 80 120, 40 100, 60 50 C 70 90, 90 120, 100 180" fill="rgba(251,191,36,0.05)" stroke="#fbbf24" strokeWidth="0.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 0.5 }} />
          <motion.path d="M 100 180 C 120 120, 160 100, 140 50 C 130 90, 110 120, 100 180" fill="rgba(251,191,36,0.05)" stroke="#fbbf24" strokeWidth="0.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 0.5 }} />
          {/* Outer Petals */}
          <motion.path d="M 100 180 C 60 140, 10 120, 20 80 C 40 110, 70 140, 100 180" fill="transparent" stroke="#fbbf24" strokeWidth="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1 }} />
          <motion.path d="M 100 180 C 140 140, 190 120, 180 80 C 160 110, 130 140, 100 180" fill="transparent" stroke="#fbbf24" strokeWidth="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1 }} />
        </motion.svg>
      </div>

      {/* --- TEXT CONTENT AREA (FROSTED GLASS EFFECT) --- */}
      <div className="relative z-30 flex flex-col items-center text-center px-8 py-12 max-w-3xl mx-auto rounded-3xl bg-[#010804]/30 backdrop-blur-md border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="text-[#fbbf24] tracking-[0.5em] uppercase text-xs font-semibold mb-6"
        >
          Le Jardin de la Patience
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1.5 }}
          className="text-3xl md:text-5xl font-light text-white font-[family-name:var(--font-cormorant)] italic leading-relaxed mb-6"
        >
          Chaque seconde d'attente est une graine plantée.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 2 }}
          className="text-white/60 font-extralight tracking-widest text-sm md:text-base max-w-lg mx-auto leading-relaxed"
        >
          Et chaque prière, une fleur qui éclot dans ce jardin que nous appelons notre amour.
        </motion.p>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 5.5, duration: 2 }}
           className="mt-6 flex items-center justify-center gap-4 opacity-40"
        >
          <div className="w-10 h-[1px] bg-[#fbbf24]" />
          <p className="text-[#fbbf24] text-[9px] uppercase tracking-[0.3em]">
            (Every prayer is a flower)
          </p>
          <div className="w-10 h-[1px] bg-[#fbbf24]" />
        </motion.div>

      </div>
    </div>
  );
}