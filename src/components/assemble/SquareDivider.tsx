"use client";

import React, { useEffect, useRef, useState } from "react";
import { CUBE_PALETTE } from "@/components/cube/palette";

export interface SquareDividerProps {
  className?: string;
  accentColor?: string;
}

// 9 squares representing a 3x3 Rubik's cube face
const NINE_SQUARE_COLORS = [
  CUBE_PALETTE.F.hex, // Green
  CUBE_PALETTE.L.hex, // Orange
  CUBE_PALETTE.U.hex, // White
  CUBE_PALETTE.R.hex, // Red
  CUBE_PALETTE.D.hex, // Yellow
  CUBE_PALETTE.B.hex, // Blue
  CUBE_PALETTE.F.hex, // Green
  CUBE_PALETTE.L.hex, // Orange
  CUBE_PALETTE.R.hex, // Red
];

export default function SquareDivider({ className = "", accentColor }: SquareDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [pulsed, setPulsed] = useState(false);
  const [isObserving, setIsObserving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setInView(true);
        setPulsed(true);
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

          // Pulse once after the 9 squares finish sliding in
          setTimeout(() => {
            setPulsed(true);
          }, 550);
        }
      },
      { threshold: 0.25 }
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

      {/* Row of 9 small squares (3x3 hint) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {NINE_SQUARE_COLORS.map((colHex, idx) => {
          const delay = idx * 35;
          const bg = accentColor && idx === 4 ? accentColor : colHex; // Center square can highlight section accent

          return (
            <span
              key={idx}
              style={{
                backgroundColor: bg,
                borderColor: idx === 2 ? "#94A3B8" : "rgba(21, 21, 24, 0.8)",
                opacity: isHidden ? 0 : 1,
                transform: isHidden
                  ? "translateY(14px) scale(0.5)"
                  : pulsed
                  ? "translateY(0px) scale(1)"
                  : "translateY(0px) scale(1.08)",
                transition: `transform 420ms cubic-bezier(0.2, 0.9, 0.3, 1.2) ${delay}ms, opacity 350ms ease ${delay}ms`,
              }}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] border shadow-2xs block shrink-0"
            />
          );
        })}
      </div>

      {/* Right divider line */}
      <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-transparent" />
    </div>
  );
}
