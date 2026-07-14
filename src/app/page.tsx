'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';

// Components
import IntroSecret from '@/components/scenes/IntroSecret';
import HeroNightSky from '@/components/scenes/HeroNightSky';
import OurStory from '@/components/scenes/OurStory';
import GoldenThread from '@/components/scenes/GoldenThread';
import CinematicVideo from '@/components/scenes/CinematicVideo';
import AminaEmpire from '@/components/scenes/AminaEmpire';
import FinancialJourney from '@/components/scenes/FinancialJourney';
import HouseIntro from '@/components/scenes/HouseIntro';
import HouseTour from '@/components/scenes/house/HouseTour';
import BirthdayCakeGame from '@/components/scenes/BirthdayCakeGame';
import GardenOfPatience from '@/components/scenes/GardenOfPatience'; 

export default function Home() {
  const { isIntroComplete } = useAppContext();
  
  // Scene Manager State
  const [currentScene, setCurrentScene] = useState(0);

  // Auto-scroll to top when scene changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentScene]);

  // Go Forward
  const handleNextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    }
  };

  // Go Backward (NEW)
  const handlePrevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  };

  const scenes = [
    {
      id: 'hero',
      component: <HeroNightSky />,
      buttonText: "Commencer notre histoire"
    },
    {
      id: 'story',
      component: <OurStory />,
      buttonText: "Suivre le fil d'or"
    },
    {
      id: 'golden',
      component: <GoldenThread />,
      buttonText: "Voir nos rêves"
    },
    {
      id: 'cinematic',
      component: <CinematicVideo />,
      buttonText: "Construire notre empire"
    },
    {
      id: 'empire',
      component: <AminaEmpire />,
      buttonText: "Notre chemin"
    },
    {
      id: 'financial',
      component: <FinancialJourney onNext={handleNextScene} />, 
      buttonText: "" 
    },
    {
      id: 'houseintro',
      component: <HouseIntro onNext={handleNextScene} />,
      buttonText: "" 
    },
    {
      id: 'housetour',
      component: <HouseTour />,
      buttonText: "Célébrons ensemble" 
    },
    {
      id: 'birthdaygame',
      component: <BirthdayCakeGame onNext={handleNextScene} />,
      buttonText: "" 
    },
    {
      id: 'garden',
      component: <GardenOfPatience />,
      buttonText: "Attendre la nuit" 
    }
  ];

  return (
    <main className="relative w-full min-h-screen bg-[#030305] selection:bg-white/20">
      
      {!isIntroComplete ? (
        <IntroSecret />
      ) : (
        <div className="w-full min-h-screen flex flex-col relative">
          
          {/* --- CUTE FLOATING "BACK" BUTTON --- */}
          <AnimatePresence>
            {currentScene > 0 && (
              <motion.button
                key="back-button"
                onClick={handlePrevScene}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="fixed top-6 left-6 md:top-10 md:left-10 z-[100] group flex items-center gap-3 cursor-pointer"
              >
                {/* Frosted Glass Circle */}
                <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-[#fbbf24]/50 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  {/* Subtle Arrow Icon */}
                  <svg className="w-4 h-4 text-white/50 group-hover:text-[#fbbf24] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                {/* Reveal Text on Hover */}
                <span className="opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-[10px] uppercase tracking-[0.3em] text-[#fbbf24]">
                  Retour
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={scenes[currentScene].id}
              initial={{ opacity: 0, filter: 'blur(15px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(15px)' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="w-full flex-grow flex flex-col"
            >
              
              {/* RENDER CURRENT SCENE */}
              {scenes[currentScene].component}

              {/* GLOBAL GATEKEEPER NEXT BUTTON */}
              {scenes[currentScene].buttonText !== "" && (
                <div className="w-full bg-[#030305] pt-10 pb-32 flex items-center justify-center z-50">
                  <motion.button
                    onClick={handleNextScene}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="group relative px-10 py-5 bg-transparent cursor-pointer overflow-hidden rounded-full"
                  >
                    <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-full transition-all duration-500 group-hover:bg-white/10 group-hover:border-[#fbbf24]/50" />
                    
                    <span className="relative text-white/80 group-hover:text-[#fbbf24] tracking-[0.3em] uppercase text-[10px] md:text-xs transition-colors duration-500">
                      {scenes[currentScene].buttonText}
                    </span>
                    
                    <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(251,191,36,0)] group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-shadow duration-500" />
                  </motion.button>
                </div>
              )}
              
            </motion.div>
          </AnimatePresence>

        </div>
      )}

    </main>
  );
}