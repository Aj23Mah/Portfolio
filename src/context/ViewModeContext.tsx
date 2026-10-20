"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type ViewMode = "cube" | "classic";

interface ViewModeContextType {
  mode: ViewMode;
  isHydrated: boolean;
  toggleMode: () => void;
  setMode: (mode: ViewMode) => void;
  focusCubeSection: (sectionId: string) => void;
}

const ViewModeContext = createContext<ViewModeContextType>({
  mode: "cube",
  isHydrated: false,
  toggleMode: () => {},
  setMode: () => {},
  focusCubeSection: () => {},
});

const STORAGE_KEY = "portfolio_view_mode";

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  // Always default to 'cube' on initial render (matches server-rendered HTML 100%)
  const [mode, setModeState] = useState<ViewMode>("cube");
  const [isHydrated, setIsHydrated] = useState(false);

  // Read persisted preference in useEffect only after initial hydration
  useEffect(() => {
    setIsHydrated(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "classic" || saved === "cube") {
        setModeState(saved);
      }
    } catch {
      // Ignore storage errors in restricted/private modes
    }
  }, []);

  // Sync html.classic-mode class whenever mode changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("classic-mode", mode === "classic");
    }
  }, [mode]);

  const setMode = useCallback((newMode: ViewMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "cube" ? "classic" : "cube";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const focusCubeSection = useCallback((sectionId: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cube:focus-section", { detail: { sectionId } })
      );
    }
  }, []);

  return (
    <ViewModeContext.Provider
      value={{
        mode,
        isHydrated,
        toggleMode,
        setMode,
        focusCubeSection,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}
