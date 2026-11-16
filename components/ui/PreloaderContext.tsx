"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface PreloaderContextValue {
  isLoading: boolean;
  isReady: boolean;
  completePreloader: () => void;
}

const PreloaderContext = createContext<PreloaderContextValue>({
  isLoading: false,
  isReady: true,
  completePreloader: () => {},
});

export const usePreloader = () => useContext(PreloaderContext);

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Skip preloader if reduced motion is preferred
    if (prefersReducedMotion()) {
      setIsReady(true);
      setIsLoading(false);
      return;
    }

    // Skip preloader if already played in this session
    try {
      const hasPreloaded = sessionStorage.getItem("portfolio_preloaded");
      if (hasPreloaded === "true") {
        // FIX: immediately set isReady so Hero animations fire on subsequent loads
        setIsReady(true);
        setIsLoading(false);
        return;
      }
    } catch {
      // sessionStorage blocked (e.g. private mode on some browsers)
    }

    // First visit: show preloader
    setIsLoading(true);
    setIsReady(false);
  }, []);

  const completePreloader = useCallback(() => {
    try {
      sessionStorage.setItem("portfolio_preloaded", "true");
    } catch {
      // ignore
    }
    setIsLoading(false);
    setIsReady(true);
  }, []);

  return (
    <PreloaderContext.Provider value={{ isLoading, isReady, completePreloader }}>
      {children}
    </PreloaderContext.Provider>
  );
}
