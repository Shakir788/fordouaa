'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

const timelineData = [
  {
    id: 1,
    title: "Le Premier Regard",
    date: "22 Août 2025",
    desc: "J'ai failli passer ton live, mais mon cœur m'a arrêté. Il m'a murmuré : 'C'est celle qu'Allah a créée pour toi.' Mon cœur battait si fort... mais une peur s'est installée aussi. Toi et moi, on ne se ressemblait même pas — comment comparer nos mondes ? Pendant deux jours, je n'ai pas osé t'écrire. Je venais juste m'asseoir dans tes lives, en silence, sans dire un mot.",
    key: true,
  },
  {
    id: 2,
    title: "Le Courage",
    date: "24 Août 2025",
    desc: "Puis un jour, j'ai rassemblé tout mon courage. 'Assalamu Alaikum...' Tu as répondu. Notre première conversation a commencé. Tu m'as dit que tu étais comptable, et que tu travaillais si dur. Je t'ai promis : je créerai une IA pour t'aider. Ce jour-là, sans le savoir, on posait la première pierre de tout ça.",
    key: true,
  },
  {
    id: 3,
    title: "Le Premier Numéro",
    date: "19 Septembre 2025",
    desc: "Le jour où nous sommes passés sur WhatsApp. J'ai préparé des notes d'anglais pour toi, et j'ai essayé de parler arabe 'juste pour toi' (فقط من أجلك). La distance de 10 000 km a commencé à s'effacer.",
    key: false,
  },
  {
    id: 4,
    title: "Le Premier Émoji Bisou",
    date: "20 Septembre 2025",
    desc: "Tu m'as envoyé le premier émoji bisou. Un petit instant numérique qui a fait battre mon cœur à l'autre bout du monde.",
    key: false,
  },
  {
    id: 5,
    title: "Comment tu me manques si vite ?",
    date: "21 Septembre 2025",
    desc: "Je t'ai dit que tu me manquais. Tu m'as demandé : 'Comment je peux te manquer si vite ?' Tu ne savais pas que mon âme t'avait attendue toute ma vie.",
    key: false,
  },
  {
    id: 6,
    title: "La Première Note Vocale",
    date: "22 Septembre 2025",
    desc: "La première fois que j'ai reçu ta note vocale. Entendre ta voix pour la première fois, c'était comme découvrir ma mélodie préférée.",
    key: false,
  },
  {
    id: 7,
    title: "Le Premier 'Je t'aime aussi'",
    date: "23 Septembre 2025",
    desc: "Tu as dit 'Je t'aime aussi'. L'écran numérique ne pouvait plus contenir notre magie. Mon univers a changé ce jour-là.",
    key: true,
  },
  {
    id: 8,
    title: "Le Premier Appel Manqué",
    date: "3 Octobre 2025",
    desc: "J'ai enfin trouvé le courage de t'appeler. Tu n'as pas répondu, mais le simple fait de composer ton numéro m'a donné des papillons inoubliables.",
    key: false,
  },
  {
    id: 9,
    title: "Le Premier Appel",
    date: "21 Octobre 2025",
    desc: "Inde 2h30 du matin, Maroc 22h00. Notre premier véritable appel a duré 61 minutes. Entendre ta voix résonner en moi... J'ai su que notre histoire serait éternelle.",
    key: true,
  },
];

// A clean vector heart instead of an emoji — reads as designed, not clip-art.
function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 29" className={className} fill="currentColor">
      <path d="M16 29C16 29 0 19.5 0 9.5C0 4.25 4.02 0 9 0C11.9 0 14.4 1.55 16 3.9C17.6 1.55 20.1 0 23 0C27.98 0 32 4.25 32 9.5C32 19.5 16 29 16 29Z" />
    </svg>
  );
}

// Subtle grain overlay — the kind of detail that separates "AI slop" from a
// crafted site. Barely visible, but it kills the flat/plasticky look of a
// pure gradient background.
function GrainOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.035, mixBlendMode: 'overlay' }}
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

// Hearts stay in the outer margins (0-22% and 78-100%) so they never sit on
// top of card text, and are depth-blurred (far = smaller/blurrier/dimmer,
// near = bigger/sharper) for actual visual depth instead of flat scatter.
function RomanticBackground() {
  const orbs = useRef(
    Array.from({ length: 4 }, (_, i) => ({
      top: 5 + Math.random() * 80,
      left: i % 2 === 0 ? 2 + Math.random() * 12 : 82 + Math.random() * 12,
      size: 260 + Math.random() * 180,
      rose: i % 2 === 0,
      duration: 20 + Math.random() * 12,
    }))
  ).current;

  const hearts = useRef(
    Array.from({ length: 20 }, () => {
      const onLeft = Math.random() > 0.5;
      const depth = Math.random(); // 0 = far/background, 1 = near/foreground
      return {
        left: onLeft ? Math.random() * 20 : 80 + Math.random() * 20,
        size: 8 + depth * 22,
        blur: (1 - depth) * 3,
        duration: 20 + Math.random() * 16,
        delay: Math.random() * 16,
        drift: (Math.random() - 0.5) * 40,
        opacity: 0.25 + depth * 0.45,
        gold: Math.random() > 0.65,
      };
    })
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[100px]"
          style={{
            top: `${o.top}%`,
            left: `${o.left}%`,
            width: o.size,
            height: o.size,
            background: o.rose
              ? 'radial-gradient(circle, rgba(244,120,150,0.26), transparent 70%)'
              : 'radial-gradient(circle, rgba(232,196,104,0.20), transparent 70%)',
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: o.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {hearts.map((h, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${h.left}%`,
            bottom: '-5%',
            width: h.size,
            height: h.size,
            filter: `blur(${h.blur}px)`,
            color: h.gold ? '#E8C468' : '#F4789A',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -500, -1000],
            x: [0, h.drift * 0.5, h.drift],
            opacity: [0, h.opacity, h.opacity, 0],
            rotate: [0, h.drift > 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: 'linear',
          }}
        >
          <HeartIcon className="w-full h-full drop-shadow-[0_0_6px_rgba(244,120,150,0.4)]" />
        </motion.div>
      ))}
    </div>
  );
}

function TiltCard({
  children,
  isKey,
  index,
}: {
  children: React.ReactNode;
  isKey: boolean;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-60, 60], [8, -8]);
  const rotateY = useTransform(x, [-60, 60], [-8, 8]);
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 22 });
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 22 });

  const glowX = useTransform(x, [-60, 60], [0, 100]);
  const glowY = useTransform(y, [-60, 60], [0, 100]);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.07), transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
      }}
      className={`relative w-[85%] md:w-[42%] rounded-[1.75rem] p-6 md:p-8 text-center md:text-left mt-6 z-20 backdrop-blur-xl overflow-hidden transition-shadow duration-500 ${
        isKey
          ? 'bg-gradient-to-b from-[#E8C468]/[0.10] to-[#1a1108]/80 shadow-[0_8px_40px_-12px_rgba(232,196,104,0.25)] hover:shadow-[0_8px_50px_-10px_rgba(232,196,104,0.4)]'
          : 'bg-gradient-to-b from-white/[0.07] to-black/60 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_40px_-10px_rgba(244,120,150,0.15)]'
      }`}
    >
      {/* Hairline border via gradient mask — reads as a lit edge, not a flat stroke */}
      <div
        className="absolute inset-0 rounded-[1.75rem] pointer-events-none"
        style={{
          padding: 1,
          background: isKey
            ? 'linear-gradient(160deg, rgba(232,196,104,0.35), rgba(232,196,104,0.05) 40%, transparent 70%)'
            : 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02) 40%, transparent 70%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ background: glowBackground }}
      />

      {/* Chapter numeral — this is a real sequence, so a number earns its place */}
      <span
        className={`absolute top-5 right-6 text-[11px] font-[family-name:var(--font-cormorant)] tracking-widest ${
          isKey ? 'text-[#E8C468]/50' : 'text-white/20'
        }`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function OurStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 60%'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      className="relative w-full min-h-screen py-24 px-6 flex flex-col items-center z-10 overflow-hidden bg-[#030305]"
    >
      {/* Wine-toned ambience — kept away from the top/bottom edges so it
          blends into the black sections above and below instead of
          creating a hard seam */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(139,30,68,0.35) 0%, rgba(139,30,68,0.12) 40%, transparent 75%)',
        }}
      />
      <RomanticBackground />
      <GrainOverlay />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.5 }}
        className="relative z-10 text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-light text-white/90 tracking-widest font-[family-name:var(--font-cormorant)] mb-4">
          Notre Voyage
        </h2>
        <p className="text-sm tracking-[0.2em] uppercase text-white/50">
          Pas à pas, plus près de toi
        </p>
      </motion.div>

      <div ref={containerRef} className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <div className="absolute top-0 bottom-0 w-[1px] bg-white/[0.08] left-1/2 -translate-x-1/2" />
        <motion.div
          style={{ height: lineHeight }}
          className="absolute top-0 w-[1px] left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#E8C468]/70 via-[#E8C468]/40 to-transparent shadow-[0_0_8px_rgba(232,196,104,0.5)]"
        />

        {timelineData.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50, rotateY: isLeft ? -20 : 20 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: '-150px' }}
              transition={{ duration: 1.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1200 }}
              className={`relative w-full flex mb-16 ${
                isLeft ? 'md:justify-start' : 'md:justify-end'
              } justify-center`}
            >
              {/* Marker — soft breathing halo behind a solid core, not a flat dot */}
              <div className="absolute left-1/2 -translate-x-1/2 top-6 z-10 flex items-center justify-center">
                {item.key && (
                  <motion.div
                    className="absolute rounded-full bg-[#E8C468]/40"
                    style={{ width: 24, height: 24 }}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <div
                  className={`rounded-full ${
                    item.key
                      ? 'w-4 h-4 bg-[#E8C468] shadow-[0_0_20px_rgba(232,196,104,0.7)]'
                      : 'w-3 h-3 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                  }`}
                />
              </div>

              <TiltCard isKey={item.key} index={index}>
              <div className="flex justify-center md:justify-start mb-4">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    border: item.key ? '1px solid rgba(232,196,104,0.5)' : '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: item.key ? '#E8C468' : '#FFFFFF',
                      fontFamily: 'inherit',
                    }}
                  >
                    {item.date}
                  </span>
                </div>
              </div>
                <h3 className="text-2xl font-light text-white/90 mb-3 font-[family-name:var(--font-cormorant)]">
                  {item.title}
                </h3>
                <p className="text-white/60 font-extralight leading-relaxed text-sm md:text-base">
                  {item.desc}
                </p>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}