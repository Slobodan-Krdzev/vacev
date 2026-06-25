'use client';

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { hasSeenIntro } from './intro-storage';

interface IntroContextValue {
  introComplete: boolean;
  setIntroComplete: (value: boolean) => void;
  logoRef: React.RefObject<HTMLAnchorElement | null>;
}

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [introComplete, setIntroComplete] = useState(true);
  const logoRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    if (!hasSeenIntro()) {
      setIntroComplete(false);
    }
  }, []);

  return (
    <IntroContext.Provider value={{ introComplete, setIntroComplete, logoRef }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error('useIntro must be used within IntroProvider');
  return ctx;
}
