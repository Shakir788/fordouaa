'use client';
import { motion } from 'framer-motion';

// Ye wo baatein hain jo hawa mein float karengi (Tum inhe apne hisaab se change bhi kar sakte ho)
const whispers = [
  { text: "Ton sourire est ma lumière.", top: "15%", left: "10%", delay: 0 },
  { text: "10 000 km ne sont rien pour nous.", top: "25%", left: "60%", delay: 1 },
  { text: "Tu es ma paix.", top: "45%", left: "8%", delay: 2 },
  { text: "J'aime ta façon de rire.", top: "60%", left: "70%", delay: 0.5 },
  { text: "Chaque jour, je te choisis.", top: "75%", left: "15%", delay: 1.5 },
  { text: "Mon cœur bat au Maroc.", top: "85%", left: "65%", delay: 2.5 },
  { text: "Tu es mon rêve devenu réalité.", top: "40%", left: "50%", delay: 1.2 },
];

export default function FloatingWhispers() {
  return (
    <div className="relative w-full min-h-screen bg-[#030305] flex flex-col items-center justify-center py-20 px-6 z-10 overflow-hidden">
      
      {/* Soft Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[60vw] h-[60vw] bg-[#fbbf24] opacity-[0.02] blur-[150px] rounded-full"></div>
      </div>

      {/* Main Title */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center z-20 mb-20"
      >
        <h2 className="text-4xl md:text-6xl font-light text-white/90 font-[family-name:var(--font-cormorant)] italic">
          Ce que mon cœur murmure...
        </h2>
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase mt-6">
          (What my heart whispers)
        </p>
      </motion.div>

      {/* Floating Texts Container */}
      <div className="absolute inset-0 z-10 pointer-events-none w-full max-w-7xl mx-auto">
        {whispers.map((whisper, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }} // Scroll up/down karne par wapas animate hoga
            transition={{ 
              delay: whisper.delay, 
              duration: 2, 
              ease: "easeOut" 
            }}
            className="absolute hidden md:block"
            style={{ top: whisper.top, left: whisper.left }}
          >
            {/* The continuous floating animation */}
            <motion.p
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-white/50 text-lg lg:text-xl font-extralight italic font-[family-name:var(--font-cormorant)] tracking-wide drop-shadow-md"
            >
              {whisper.text}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* Mobile Fallback - List view for small screens */}
      <div className="md:hidden z-20 flex flex-col space-y-8 items-center text-center mt-10">
        {whispers.map((whisper, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 1 }}
            className="text-white/60 text-xl font-extralight italic font-[family-name:var(--font-cormorant)] tracking-wide"
          >
            {whisper.text}
          </motion.p>
        ))}
      </div>

    </div>
  );
}