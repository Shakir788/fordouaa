'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';

// Soft ambient dust
function AmbientDust() {
  const dust = useRef(
    Array.from({ length: 26 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 8,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {dust.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#E8C468]"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ opacity: [0, 0.6, 0], y: [0, -30, -60] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function Divider({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: 'easeOut' }}
      className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#E8C468]/60 to-transparent my-10 md:my-14"
    />
  );
}

function Line({
  children,
  delay,
  size = 'md',
  gold = false,
}: {
  children: React.ReactNode;
  delay: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gold?: boolean;
}) {
  const sizes: Record<string, string> = {
    sm: 'text-xs tracking-[0.4em] uppercase',
    md: 'text-2xl md:text-3xl font-light italic',
    lg: 'text-3xl md:text-5xl font-light italic',
    xl: 'text-4xl md:text-6xl font-light italic',
  };

  return (
    <motion.p
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`${sizes[size]} font-[family-name:var(--font-cormorant)] leading-relaxed ${
        gold ? 'text-[#E8C468]' : 'text-white/90'
      }`}
    >
      {children}
    </motion.p>
  );
}

// YAHAN CHANGE HUA HAI: onNext prop add kiya gaya hai
export default function FinancialJourney({ onNext }: { onNext?: () => void }) {
  
  // YAHAN CHANGE HUA HAI: Ab ye scroll nahi karega, balki agla scene trigger karega
  const transitionToHouse = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#030305] flex flex-col items-center justify-center overflow-hidden py-32 px-6">
      {/* Ambient glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8b1e44]/12 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E8C468]/10 rounded-full blur-[130px]" />
      </div>
      <AmbientDust />

      <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[#E8C468] tracking-[0.5em] uppercase text-xs font-semibold mb-16"
        >
          Notre Chemin
        </motion.p>

        <Line delay={0} size="sm" gold>
          Les belles choses prennent du temps
        </Line>

        <div className="h-6" />

        <Line delay={0.2} size="lg">
          Chaque effort est une graine,
        </Line>
        <Line delay={0.4} size="lg">
          chaque nuit blanche, une racine profonde.
        </Line>

        <Divider delay={0.6} />

        <Line delay={0.7} size="md">
          Je sais que la route est longue...
        </Line>

        <div className="h-4" />

        <Line delay={1.0} size="xl" gold>
          mais reste avec moi.
        </Line>

        <Divider delay={1.3} />

        <Line delay={1.4} size="lg">
          Je vais changer le monde —
        </Line>
        <Line delay={1.6} size="lg">
          pour toi, pour nous.
        </Line>

        <div className="h-10" />

        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#E8C468] text-sm tracking-[0.4em] uppercase mb-16"
        >
          Fais-moi confiance
        </motion.p>

        {/* --- THE CINEMATIC TRANSITION BUTTON --- */}
        <motion.button
          onClick={transitionToHouse}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 3, duration: 1.5 }}
          className="group relative px-8 py-4 bg-transparent cursor-pointer overflow-hidden rounded-full"
        >
          {/* Subtle glowing background */}
          <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-full transition-all duration-500 group-hover:bg-white/10 group-hover:border-[#E8C468]/50" />
          
          {/* Text inside button */}
          <span className="relative text-white/80 group-hover:text-[#E8C468] tracking-[0.3em] uppercase text-xs transition-colors duration-500">
            Donne-moi ta main
          </span>

          {/* Pulse effect on hover */}
          <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(232,196,104,0)] group-hover:shadow-[0_0_30px_rgba(232,196,104,0.3)] transition-shadow duration-500" />
        </motion.button>

      </div>
    </div>
  );
}