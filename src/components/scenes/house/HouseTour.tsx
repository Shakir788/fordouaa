'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Each "node" is a place Douaa can stand. If a node has more than one
// image, left/right lets her look around from that spot — exactly like
// turning your head. Forward/back moves between nodes.
type Node = {
  id: string;
  title: string;
  subtitle: string;
  images: string[];
};

const NODES: Node[] = [
  { id: 'exterior', title: "L'Immeuble", subtitle: 'Là où tout commence', images: ['/tour/01_Opening_Building.png'] },
  { id: 'walk', title: 'Vers Toi', subtitle: "En marchant vers l'entrée", images: ['/tour/002_Walk_to_Entrance.png'] },
  { id: 'entrance', title: "L'Entrée Principale", subtitle: 'Le seuil de notre avenir', images: ['/tour/003_Main_Entrance.png'] },
  { id: 'lobby-enter', title: 'Le Hall', subtitle: 'On entre, ensemble', images: ['/tour/04_Enter_Lobby.png'] },
  { id: 'lobby', title: 'Le Hall', subtitle: 'Un instant de calme', images: ['/tour/005_Lobby.png'] },
  { id: 'elevator-arrival', title: "L'Ascenseur", subtitle: 'Cinquième étage', images: ['/tour/06_Elevator_Arrival.png'] },
  { id: 'elevator-inside', title: "L'Ascenseur", subtitle: 'On monte vers chez nous', images: ['/tour/007_Inside_Elevator.png'] },
  { id: 'hallway', title: 'Le Couloir', subtitle: 'Presque arrivés', images: ['/tour/008_Fifth_Floor_Hallway.png'] },
  { id: 'door', title: 'Appartement 501', subtitle: 'Mohammad & Douaa', images: ['/tour/009_Apartment_Door.png'] },
  { id: 'enter-home', title: 'On Entre', subtitle: 'Premier regard chez nous', images: ['/tour/10_Enter_Home.png'] },
  {
    id: 'living-room',
    title: 'Le Salon',
    subtitle: 'Regarde autour de toi',
    images: [
      '/tour/11_Living_Room_Master.png',
      '/tour/12_Living_Room_Welcome.png',
      '/tour/013_Living_Room_Left_View.png',
      '/tour/014_Living_Room_TV_Wall.png',
      '/tour/015_Living_Room_Balcony.png',
      '/tour/016_Living_Room_to_Dining.png',
    ],
  },
  { id: 'dining', title: 'La Salle à Manger', subtitle: 'Nos repas en famille', images: ['/tour/017_Dining_Master.png'] },

  // The continuation — cinematic video covering kitchen, bedroom,
  // wardrobe, balcony at night, and a morning view.
  {
    id: 'rest-of-home',
    title: 'Le Reste de Notre Maison',
    subtitle: 'La cuisine, la chambre, le balcon...',
    images: ['/tour/018_Rest_Of_Home.mp4'],
  },

  // Add future rooms the same way — one entry, one or more image angles.
  // { id: 'bedroom', title: 'La Chambre', subtitle: 'Notre espace, paisible', images: ['/tour/18_Bedroom_1.png', '/tour/18_Bedroom_2.png'] },
];

export default function HouseTour() {
  const [nodeIndex, setNodeIndex] = useState(0);
  const [angleIndex, setAngleIndex] = useState(0);
  const [moveDir, setMoveDir] = useState<'forward' | 'backward' | 'left' | 'right'>('forward');
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const node = NODES[nodeIndex];
  const hasMultipleAngles = node.images.length > 1;

  const goForward = useCallback(() => {
    setShowHint(false);
    setNodeIndex((i) => {
      if (i >= NODES.length - 1) return i;
      setMoveDir('forward');
      setAngleIndex(0);
      return i + 1;
    });
  }, []);

  const goBackward = useCallback(() => {
    setShowHint(false);
    setNodeIndex((i) => {
      if (i <= 0) return i;
      setMoveDir('backward');
      setAngleIndex(0);
      return i - 1;
    });
  }, []);

  const lookLeft = useCallback(() => {
    setShowHint(false);
    setMoveDir('left');
    setAngleIndex((a) => (a - 1 + node.images.length) % node.images.length);
  }, [node.images.length]);

  const lookRight = useCallback(() => {
    setShowHint(false);
    setMoveDir('right');
    setAngleIndex((a) => (a + 1) % node.images.length);
  }, [node.images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) { e.preventDefault(); goForward(); }
      else if (['ArrowDown', 's', 'S'].includes(e.key)) { e.preventDefault(); goBackward(); }
      else if (['ArrowLeft', 'a', 'A'].includes(e.key)) { e.preventDefault(); lookLeft(); }
      else if (['ArrowRight', 'd', 'D'].includes(e.key)) { e.preventDefault(); lookRight(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goForward, goBackward, lookLeft, lookRight]);

  const currentImage = node.images[angleIndex];

  // Simple, honest crossfade. Real "walking forward" motion needs actual
  // depth data — which only comes from depth-based video (Immersity AI etc),
  // not a CSS trick on a flat photo. Once a node's images[] are swapped
  // for `type: 'video'` depth-parallax clips, this same transition will
  // carry real motion instead of faking it.
  const variants = {
    enter: (dir: string) => {
      if (dir === 'left') return { opacity: 0, x: -50 };
      if (dir === 'right') return { opacity: 0, x: 50 };
      return { opacity: 0 };
    },
    center: { opacity: 1, x: 0 },
    exit: (dir: string) => {
      if (dir === 'left') return { opacity: 0, x: 50 };
      if (dir === 'right') return { opacity: 0, x: -50 };
      return { opacity: 0 };
    },
  };

  // Subtle mouse-parallax "look around" — honest about what it is: a
  // small look-around cue, not simulated depth or walking.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const parallaxX = useTransform(springX, [-1, 1], [-14, 14]);
  const parallaxY = useTransform(springY, [-1, 1], [-10, 10]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  return (
    <div
      ref={containerRef}
      id="house-tour"
      onPointerMove={handlePointerMove}
      className="relative w-full h-screen bg-[#030305] overflow-hidden select-none"
      tabIndex={0}
    >
      <AnimatePresence mode="wait" custom={moveDir}>
        <motion.div
          key={`${node.id}-${angleIndex}`}
          custom={moveDir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 overflow-hidden"
        >
          {node.images[angleIndex].endsWith('.mp4') ? (
            <video
              src={currentImage}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <motion.div
              key={`kb-${node.id}-${angleIndex}`}
              initial={{ scale: 1 }}
              animate={{ scale: 1.06 }}
              transition={{ duration: 7, ease: 'linear' }}
              className="absolute inset-0"
            >
              <motion.div style={{ x: parallaxX, y: parallaxY, scale: 1.04 }} className="absolute inset-0">
                <img src={currentImage} alt={node.title} className="absolute inset-0 w-full h-full object-cover" />
              </motion.div>
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305]/80 via-transparent to-[#030305]/30 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Room label */}
      <div className="absolute top-10 inset-x-0 text-center px-6 z-20 pointer-events-none">
        <p className="text-[#E8C468] tracking-[0.4em] uppercase text-xs font-semibold mb-2">
          {node.subtitle}
        </p>
        <h2 className="text-2xl md:text-4xl font-light text-white font-[family-name:var(--font-cormorant)] italic drop-shadow-lg">
          {node.title}
        </h2>
      </div>

      {/* Progress dots */}
      <div className="absolute top-6 inset-x-0 flex justify-center gap-1.5 z-20">
        {NODES.map((n, i) => (
          <div
            key={n.id}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === nodeIndex ? 'w-6 bg-[#E8C468]' : 'w-1 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* First-time hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 bottom-40 text-center z-20 pointer-events-none px-6"
          >
            <p className="text-white/70 text-sm tracking-widest uppercase">
              Utilise les flèches pour avancer et regarder autour de toi
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* On-screen controls — works with mouse/touch, essential for mobile */}
      <div className="absolute bottom-10 inset-x-0 z-20 flex flex-col items-center gap-2">
        <button
          onClick={goForward}
          disabled={nodeIndex >= NODES.length - 1}
          className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/80 disabled:opacity-20 hover:bg-white/20 transition-colors active:scale-90"
          aria-label="Avancer"
        >
          <ChevronUp size={22} />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={lookLeft}
            disabled={!hasMultipleAngles}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/80 disabled:opacity-20 hover:bg-white/20 transition-colors active:scale-90"
            aria-label="Regarder à gauche"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={goBackward}
            disabled={nodeIndex <= 0}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/80 disabled:opacity-20 hover:bg-white/20 transition-colors active:scale-90"
            aria-label="Reculer"
          >
            <ChevronDown size={22} />
          </button>
          <button
            onClick={lookRight}
            disabled={!hasMultipleAngles}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/80 disabled:opacity-20 hover:bg-white/20 transition-colors active:scale-90"
            aria-label="Regarder à droite"
          >
            <ChevronRight size={22} />
          </button>
        </div>
        {hasMultipleAngles && (
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mt-1">
            {angleIndex + 1} / {node.images.length}
          </p>
        )}
      </div>
    </div>
  );
}