'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Volume2, VolumeX } from 'lucide-react';

// Stars ab mouse move pe bhi react karenge — parallax depth ke liye
function MovingStars({ mouseX, mouseY }: { mouseX: React.MutableRefObject<number>; mouseY: React.MutableRefObject<number> }) {
  const starsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
      starsRef.current.rotation.x += 0.0001;
      // subtle mouse-parallax — bahut halka, taaki cinematic lage, gimmicky nahi
      starsRef.current.rotation.y += (mouseX.current * 0.00005 - starsRef.current.rotation.y * 0);
      starsRef.current.rotation.x += (mouseY.current * 0.00003);
    }
  });

  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
    </group>
  );
}

// Occasional shooting star — rare, subtle, magical without being distracting
function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  const active = useRef(false);
  const progress = useRef(0);
  const nextTrigger = useRef(Math.random() * 8 + 4);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    if (!active.current && elapsed.current > nextTrigger.current) {
      active.current = true;
      progress.current = 0;
      if (ref.current) {
        ref.current.position.set(-30 + Math.random() * 10, 15 + Math.random() * 10, -20);
      }
    }
    if (active.current && ref.current) {
      progress.current += delta * 0.6;
      ref.current.position.x += delta * 40;
      ref.current.position.y -= delta * 18;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 1 - progress.current;
      if (progress.current >= 1) {
        active.current = false;
        elapsed.current = 0;
        nextTrigger.current = Math.random() * 10 + 6;
      }
    }
  });

  return (
    <mesh ref={ref} position={[-100, 100, -20]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  );
}

export default function HeroNightSky() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioOn, setAudioOn] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  // Mouse-follow glow (moon) — smooth spring, subtle
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const springX = useSpring(glowX, { stiffness: 40, damping: 20 });
  const springY = useSpring(glowY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {
        // Autoplay blocked by browser — tell the user instead of failing silently
        setAudioBlocked(true);
        setAudioOn(false);
      });
    }
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.current = x;
      mouseY.current = y;
      glowX.set(x * 24);
      glowY.set(y * 24);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [glowX, glowY]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioOn) {
      audioRef.current.pause();
      setAudioOn(false);
    } else {
      audioRef.current.play().catch(() => {});
      setAudioOn(true);
      setAudioBlocked(false);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-[#030305] overflow-hidden flex flex-col items-center justify-center">
      <audio ref={audioRef} src="/audio/bg-piano.mp3" loop preload="auto" />

      {/* 3D Rotating Starry Background with occasional shooting star */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <MovingStars mouseX={mouseX} mouseY={mouseY} />
          <ShootingStar />
        </Canvas>
      </div>

      {/* Center Atmospheric Glow — now follows the mouse gently, and breathes */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none z-0"
      />

      {/* Audio toggle — small, unobtrusive, top-right */}
      <button
        onClick={toggleAudio}
        aria-label={audioOn ? 'Mute music' : 'Play music'}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/60 backdrop-blur-sm transition hover:text-white/90 hover:border-white/20"
      >
        {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      {audioBlocked && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute top-16 right-6 z-20 text-[11px] text-white/40 tracking-wide"
        >
          tap for music
        </motion.p>
      )}

      {/* Foreground Cinematic Text */}
      <div className="z-10 text-center px-6 max-w-2xl flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1], delay: 1 }}
          className="text-5xl md:text-7xl font-light text-white/90 mb-8 tracking-widest font-[family-name:var(--font-cormorant)]"
        >
          Hi Douaa{' '}
          <motion.span
            animate={{ scale: [1, 1.25, 1, 1.15, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
            className="inline-block text-red-500/80 text-4xl md:text-6xl"
          >
            ❤️
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 4 }}
          className="text-lg md:text-2xl font-light text-white/60 mb-4 tracking-[0.2em] uppercase text-sm"
        >
          This is not just a website.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 6.5 }}
          className="text-2xl md:text-4xl font-light text-white/80 font-[family-name:var(--font-cormorant)] italic"
        >
          This is my heart...
        </motion.p>
      </div>

      {/* Scroll cue — tells her there's more below */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 9 }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-8 w-[1px] bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </div>
  );
}