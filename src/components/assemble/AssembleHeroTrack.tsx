"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { TypeAnimation } from "react-type-animation";
import AssembleCanvasWrapper from "./AssembleCanvasWrapper";
import AssembleDebugOverlay from "./AssembleDebugOverlay";
import { ASSEMBLE_CONFIG } from "./config";

interface AssembleHeroTrackProps {
  onProgressChange?: (p: number) => void;
}

export default function AssembleHeroTrack({ onProgressChange }: AssembleHeroTrackProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [lockedCount, setLockedCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  // Responsive breakpoint check
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Passive scroll progress calculator with requestAnimationFrame throttling
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const computeProgress = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const trackHeight = rect.height;
      const viewportH = window.innerHeight;
      const travelDistance = trackHeight - viewportH;

      if (travelDistance <= 0) {
        setProgress(1);
        onProgressChange?.(1);
        return;
      }

      const scrolled = window.scrollY - trackTop;
      const p = Math.min(1, Math.max(0, scrolled / travelDistance));
      setProgress(p);
      onProgressChange?.(p);
    };

    const onScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        computeProgress();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    computeProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [onProgressChange]);

  // Jump to specific progress (used by debug overlay buttons)
  const handleJumpToProgress = useCallback((targetP: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const travelDistance = rect.height - window.innerHeight;
    const targetScrollY = trackTop + targetP * travelDistance;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  }, []);

  const trackHeight = isMobile
    ? ASSEMBLE_CONFIG.trackHeightMobile
    : ASSEMBLE_CONFIG.trackHeightDesktop;

  return (
    <section
      ref={trackRef}
      id="hero-track"
      aria-label="Cube Assembly Stage & Hero Introduction"
      className="relative w-full"
      style={{ height: trackHeight }}
    >
      {/* 🔹 Position: Sticky Full-Viewport Stage */}
      <div
        className="sticky top-0 w-full h-[100svh] min-h-[100dvh] overflow-hidden flex items-center justify-center bg-paper-texture pt-14 sm:pt-16"
        style={{ position: "sticky", top: 0 }}
      >
        {/* Subtle ambient lighting blob */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-orange-400/15 via-amber-300/10 to-transparent blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* 3D WebGL Cube Canvas Layer (Absolute background / side) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <AssembleCanvasWrapper
            scrollProgress={progress}
            onLockedCountChange={setLockedCount}
          />
        </div>

        {/* Hero DOM Content Layer (Always visible, interactive, readable) */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full h-full flex flex-col justify-center pointer-events-auto">
          <div className="w-full lg:max-w-xl flex flex-col items-start">
            <div className="w-full bg-white/70 lg:bg-transparent backdrop-blur-[2px] lg:backdrop-blur-none p-4 sm:p-6 lg:p-0 rounded-2xl border border-orange-200/40 lg:border-none shadow-2xs lg:shadow-none flex flex-col items-start">
              {/* Header Badge */}
              <div className="font-bold text-primary uppercase tracking-widest text-xs sm:text-sm mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-[2px] bg-orange-600 inline-block" />
                <span>HELLO, I&apos;M</span>
              </div>

              {/* Name Heading with Typography Tokens */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold my-1 tracking-tight text-gray-900">
                <span className="smooch block text-6xl sm:text-7xl md:text-8xl font-normal leading-none text-gray-950">
                  Ajay Kumar
                </span>
                <span className="relative text-3xl sm:text-4xl md:text-5xl text-primary uppercase tracking-widest font-bold -mt-2 block">
                  Maharjan
                </span>
              </h1>

              {/* Role line */}
              <div className="flex gap-2 items-center mt-3 text-gray-800">
                <TypeAnimation
                  sequence={[
                    "Full-Stack JS Developer",
                    1200,
                    "Software Developer",
                    1200,
                  ]}
                  wrapper="span"
                  speed={20}
                  style={{
                    fontSize: "1.3em",
                    display: "inline-block",
                    fontWeight: 700,
                  }}
                  repeat={Infinity}
                />
              </div>

              {/* Short Intro */}
              <p className="text-gray-700 text-sm sm:text-base md:text-lg font-normal leading-relaxed mt-4 max-w-xl">
                I work across the frontend and backend to build complete, scalable,
                and user-friendly web applications — from designing dynamic
                interfaces to engineering secure APIs and database architectures.
              </p>

              {/* Dynamic Scroll Cue / Status */}
              <div className="mt-5 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-orange-200/90 shadow-2xs backdrop-blur-md">
                <span className="text-base animate-bounce">
                  {progress >= 0.85 ? "✓" : "↓"}
                </span>
                <span className="text-xs font-mono font-bold text-gray-800">
                  {progress < 0.1
                    ? "Scroll down to fly pieces together"
                    : progress < 0.75
                    ? `Assembling cube... (${lockedCount}/27 pieces locked)`
                    : progress < 0.9
                    ? "Cube settled! Final alignment..."
                    : "Cube solved! Keep scrolling to explore ↓"}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <button
                  onClick={() => {
                    const el = document.getElementById("projects");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition text-sm shadow-md cursor-pointer hover:shadow-lg focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  View Projects ↓
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("contact");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="py-3 px-6 rounded-xl border border-gray-300 hover:border-orange-500 text-gray-800 hover:text-orange-600 transition text-sm font-semibold bg-white cursor-pointer shadow-2xs hover:shadow-xs focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  Contact Me
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Overlay (?debug=1) */}
      <AssembleDebugOverlay
        progress={progress}
        lockedCount={lockedCount}
        onJumpToProgress={handleJumpToProgress}
      />
    </section>
  );
}
