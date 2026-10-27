"use client";

import React, { useEffect, useRef, useState } from "react";
import { CUBE_STICKER_RHYTHM, ANIMATION_CONFIG } from "./config";

export interface CubeSectionDividerProps {
  className?: string;
}

/**
 * CubeSectionDivider Component
 * 
 * Renders a row of 6 colored Rubik's cube sticker squares between sections
 * that slide into place with a subtle stagger when entering the viewport.
 */
export default function CubeSectionDivider({ className = "" }: CubeSectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isObserving, setIsObserving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setInView(true);
        return;
      }
    }

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    setIsObserving(true);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const isHidden = isObserving && !inView;

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-4xl mx-auto py-10 sm:py-14 flex items-center justify-center gap-4 px-6 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Left divider line */}
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-300 to-gray-200" />

      {/* Row of 6 Rubik's cube colored sticker squares */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {CUBE_STICKER_RHYTHM.map((color, idx) => {
          const delay = idx * ANIMATION_CONFIG.dividerStaggerMs;
          return (
            <span
              key={color.name}
              style={{
                backgroundColor: color.hex,
                borderColor: color.border || "#151518",
                opacity: isHidden ? 0 : 1,
                transform: isHidden
                  ? "translateY(12px) scale(0.6)"
                  : "translateY(0px) scale(1)",
                transition: `transform 400ms cubic-bezier(0.2, 0.9, 0.3, 1.2) ${delay}ms, opacity 350ms ease ${delay}ms`,
              }}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] border shadow-2xs block shrink-0"
              title={color.name}
            />
          );
        })}
      </div>

      {/* Right divider line */}
      <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-transparent" />
    </div>
  );
}
