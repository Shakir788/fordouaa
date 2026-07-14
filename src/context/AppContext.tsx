'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  isIntroComplete: boolean;
  completeIntro: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Ye state check karegi ki intro scene chal raha hai ya main website
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  const completeIntro = () => {
    setIsIntroComplete(true);
  };

  return (
    <AppContext.Provider value={{ isIntroComplete, completeIntro }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};