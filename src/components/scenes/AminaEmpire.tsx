'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Simple line-art symbols instead of stock photography — each one ties
// directly to what that project actually is, and nothing here depends on
// an external image link that could break or feel impersonal.
const icons: Record<string, string> = {
  ai: "M50 5 L58 42 L95 50 L58 58 L50 95 L42 58 L5 50 L42 42 Z",
  dress: "M42 8 Q50 2 58 8 L64 26 L88 92 L12 92 L36 26 Z",
  book: "M10 22 Q50 10 50 22 L50 82 Q50 70 10 82 Z M90 22 Q50 10 50 22 L50 82 Q50 70 90 82 Z",
  sparkle: "M50 8 L61 42 L92 50 L61 58 L50 92 L39 58 L8 50 L39 42 Z",
  moon: "M62 15 A32 32 0 1 0 62 85 A24 24 0 1 1 62 15 Z",
};

function SceneIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d={path} />
    </svg>
  );
}

const empireScenes = [
  {
    number: "01",
    icon: icons.ai,
    title: "Amina AI",
    subtitle: "TA TOUTE PREMIÈRE COMPAGNE",
    description:
      "Le tout premier jour de notre histoire — avant même de savoir où elle nous mènerait — j'ai créé Amina. Une intelligence pensée uniquement pour toi, pour t'accompagner dans chaque tâche, chaque jour.",
    gradient: "radial-gradient(ellipse at 30% 20%, rgba(232,196,104,0.22), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,30,68,0.25), transparent 60%)",
    align: "md:items-start",
  },
  {
    number: "02",
    icon: icons.dress,
    title: "Amina Clothing",
    subtitle: "TON RÊVE, PROTÉGÉ",
    description:
      "Un jour, je t'ai trouvée triste. Ton idée — vendre des vêtements en ligne — t'avait été volée par une amie avant même que tu puisses la réaliser. Je t'ai promis une boutique entière, rien qu'à toi. Amina Clothing est née ce jour-là.",
    gradient: "radial-gradient(ellipse at 70% 20%, rgba(244,120,150,0.22), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(232,196,104,0.18), transparent 60%)",
    align: "md:items-end",
  },
  {
    number: "03",
    icon: icons.book,
    title: "Amina Academy",
    subtitle: "TON ÉDUCATION, SANS LIMITES",
    description:
      "Tu voulais suivre un cours de comptabilité, mais tu n'as pas pu t'inscrire. Alors j'ai construit toute une académie pour toi — anglais, marketing digital, comptabilité. Et j'ai compris que d'autres en avaient besoin aussi.",
    gradient: "radial-gradient(ellipse at 50% 15%, rgba(139,30,68,0.22), transparent 60%), radial-gradient(ellipse at 30% 85%, rgba(232,196,104,0.2), transparent 60%)",
    align: "md:items-start",
  },
  {
    number: "04",
    icon: icons.sparkle,
    title: "Amina Cosmetics",
    subtitle: "NOTRE RÊVE PARTAGÉ",
    description:
      "Celui-là, on l'a rêvé ensemble. Pas un besoin, pas une tristesse à réparer — juste toi et moi, en train de construire quelque chose de beau, main dans la main.",
    gradient: "radial-gradient(ellipse at 25% 25%, rgba(232,196,104,0.25), transparent 60%), radial-gradient(ellipse at 75% 75%, rgba(244,120,150,0.2), transparent 60%)",
    align: "md:items-end",
  },
  {
    number: "05",
    icon: icons.moon,
    title: "Nour",
    subtitle: "POUR QUE TU N'OUBLIES JAMAIS",
    description:
      "Tu m'as dit qu'il t'arrivait d'oublier des choses importantes. Alors j'ai créé Nour, rien que pour toi — avec Lulu, ta petite chatte compagne, les horaires de prière, et un journal du Coran. Pour que tu ne sois jamais seule face à l'oubli.",
    gradient: "radial-gradient(ellipse at 50% 20%, rgba(139,30,68,0.28), transparent 60%), radial-gradient(ellipse at 50% 90%, rgba(232,196,104,0.15), transparent 60%)",
    align: "md:items-center",
  },
];

function EmpireScene({ scene }: { scene: typeof empireScenes[number] }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start end', 'end start'],
  });
  const iconScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const iconRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);

  return (
    <div
      ref={sceneRef}
      className="h-screen w-full sticky top-0 flex flex-col justify-center px-6 md:px-24 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.8)] bg-[#030305]"
    >
      {/* Themed gradient backdrop, unique per project */}
      <div className="absolute inset-0 z-0" style={{ background: scene.gradient }} />

      {/* Large symbolic icon, slow scroll-linked drift for life without needing a photo */}
      <motion.div
        style={{ scale: iconScale, rotate: iconRotate }}
        className="absolute -right-10 top-1/2 -translate-y-1/2 w-[60vw] max-w-[600px] aspect-square text-white/[0.04] pointer-events-none z-0"
      >
        <SceneIcon path={scene.icon} className="w-full h-full" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-[#030305]/10 z-0" />

      <div className={`w-full max-w-7xl mx-auto flex flex-col ${scene.align} relative z-10`}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative p-8 md:p-14 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden max-w-2xl"
          style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="absolute -top-10 -right-6 text-[8rem] md:text-[12rem] font-bold text-white/5 pointer-events-none select-none leading-none">
            {scene.number}
          </div>

          <div className="flex items-center space-x-4 mb-4 relative z-10">
            <div className="w-8 h-[1px] bg-[#E8C468]" />
            <span className="text-[#E8C468] tracking-[0.4em] text-[10px] md:text-xs font-semibold">
              {scene.subtitle}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-light text-white font-[family-name:var(--font-cormorant)] relative z-10 mb-6 drop-shadow-lg">
            {scene.title}
          </h2>

          <p className="text-white/70 text-base md:text-xl font-extralight tracking-wide leading-relaxed relative z-10">
            {scene.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function AminaEmpire() {
  return (
    <div className="relative w-full bg-[#030305] pb-[5vh]">
      {/* The laptop story — the quiet beginning, before either of them knew */}
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center py-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="text-[#E8C468] tracking-[0.5em] uppercase text-xs font-semibold mb-6"
        >
          Avant même de te connaître
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.15 }}
          className="max-w-2xl text-lg md:text-2xl font-extralight text-white/70 leading-relaxed mb-16"
        >
          Dix jours avant de te rencontrer, j&apos;ai acheté un ordinateur portable — sans vraiment savoir pourquoi. Il est resté fermé, presque inutilisé. Peut-être qu&apos;Allah me préparait déjà, sans que je le sache, pour toi.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="text-[#E8C468] tracking-[0.5em] uppercase text-xs font-semibold mb-4"
        >
          Depuis ce jour-là
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.45 }}
          className="text-3xl md:text-5xl font-light text-white font-[family-name:var(--font-cormorant)] italic"
        >
          Tout ce que j&apos;ai construit pour toi
        </motion.h2>
      </div>

      {empireScenes.map((scene, index) => (
        <EmpireScene key={index} scene={scene} />
      ))}

      {/* Closing line after the stack */}
      <div className="min-h-[40vh] flex flex-col items-center justify-center px-6 text-center py-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="max-w-xl text-xl md:text-3xl font-light text-white/80 font-[family-name:var(--font-cormorant)] italic leading-relaxed"
        >
          Et notre histoire continue, projet après projet, jusqu&apos;à ce qu&apos;on atteigne notre destination.
          <span className="block text-[#E8C468] not-italic text-sm tracking-[0.3em] uppercase mt-6">
            Inch&apos;Allah
          </span>
        </motion.p>
      </div>
    </div>
  );
}