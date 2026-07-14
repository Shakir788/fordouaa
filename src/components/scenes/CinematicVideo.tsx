'use client';
import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

export default function CinematicVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { amount: 0.5 }); 

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);

  return (
    <div className="relative w-full min-h-screen bg-[#030305] flex flex-col items-center justify-center py-24 px-6 z-10 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-white/5 rounded-full blur-[110px] pointer-events-none"></div>

      {/* Top Poetic Text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-light text-white/95 font-[family-name:var(--font-cormorant)] italic tracking-wide">
          "Nos rêves partagés..."
        </h2>
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-4">
          Visualiser notre avenir
        </p>
      </motion.div>

      {/* The 9:16 Vertical Reel Frame */}
      <motion.div 
        ref={containerRef} // Scroll track karne ke liye ref attach kiya
        initial={{ opacity: 0, scale: 0.93, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-[290px] h-[515px] md:w-[360px] md:h-[640px] perspective-1000"
      >
        {/* FIX 1: Removed 'backdrop-blur-sm' so the video is 100% clear now! */}
        <div className="absolute inset-0 rounded-[2rem] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-20 pointer-events-none"></div>
        
        {/* Video Container */}
        <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-[#050507] relative">
          {/* FIX 2: Removed 'autoPlay' attribute. It is now controlled by the scroll position! */}
          <video 
            ref={videoRef}
            loop 
            muted={false} 
            controls 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/video/our-story.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Ambient Light Leak behind frame */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      </motion.div>
      
      {/* Subtext below the video */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 2 }}
        className="mt-12 text-center max-w-sm px-4"
      >
        <p className="text-white/40 text-sm font-extralight tracking-widest leading-relaxed italic">
          "Chaque image est une promesse de ce qui nous attend."
        </p>
        <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] mt-2">
          (Every picture is a promise of what awaits us)
        </p>
      </motion.div>

    </div>
  );
}