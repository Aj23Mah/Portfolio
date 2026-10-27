"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { isLowPowerGated } from "@/utils/lowPowerGate";
import { CUBE_PALETTE } from "@/components/classic-cube/config";

// Lazy-load the heavy Three.js assembly canvas with ssr: false
const AssembleCanvas3D = dynamic(() => import("./AssembleCanvas3D"), {
  ssr: false,
  loading: () => <AssembleCubeSkeleton />,
});

interface AssembleCanvasWrapperProps {
  scrollProgress: number;
  className?: string;
  onLockedCountChange?: (count: number) => void;
}

/**
 * Lightweight static CSS assembled cube for low-power or WebGL-disabled devices
 */
function StaticAssembleCubeFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none select-none">
      <div
        className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center"
        style={{ perspective: "600px" }}
        aria-hidden="true"
      >
        <div
          className="relative w-28 h-28 sm:w-36 sm:h-36"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(-20deg) rotateY(32deg)",
          }}
        >
          {/* Front: Green */}
          <div
            className="absolute inset-0 rounded-xl border-4 border-[#151518] shadow-md flex items-center justify-center font-bold text-white text-xs sm:text-sm tracking-widest"
            style={{
              backgroundColor: CUBE_PALETTE.green.hex,
              transform: "translateZ(56px)",
            }}
          >
            ABOUT
          </div>
          {/* Back: Blue */}
          <div
            className="absolute inset-0 rounded-xl border-4 border-[#151518] shadow-md flex items-center justify-center font-bold text-white text-xs sm:text-sm tracking-widest"
            style={{
              backgroundColor: CUBE_PALETTE.blue.hex,
              transform: "rotateY(180deg) translateZ(56px)",
            }}
          >
            CONTACT
          </div>
          {/* Right: Red */}
          <div
            className="absolute inset-0 rounded-xl border-4 border-[#151518] shadow-md flex items-center justify-center font-bold text-white text-xs sm:text-sm tracking-widest"
            style={{
              backgroundColor: CUBE_PALETTE.red.hex,
              transform: "rotateY(90deg) translateZ(56px)",
            }}
          >
            PROJECTS
          </div>
          {/* Left: Orange */}
          <div
            className="absolute inset-0 rounded-xl border-4 border-[#151518] shadow-md flex items-center justify-center font-bold text-white text-xs sm:text-sm tracking-widest"
            style={{
              backgroundColor: CUBE_PALETTE.orange.hex,
              transform: "rotateY(-90deg) translateZ(56px)",
            }}
          >
            SKILLS
          </div>
          {/* Top: White */}
          <div
            className="absolute inset-0 rounded-xl border-4 border-[#151518] shadow-md flex items-center justify-center font-bold text-gray-900 text-xs sm:text-sm tracking-widest"
            style={{
              backgroundColor: CUBE_PALETTE.white.hex,
              transform: "rotateX(90deg) translateZ(56px)",
            }}
          >
            EXPERIENCE
          </div>
          {/* Bottom: Yellow */}
          <div
            className="absolute inset-0 rounded-xl border-4 border-[#151518] shadow-md flex items-center justify-center font-bold text-gray-900 text-xs sm:text-sm tracking-widest"
            style={{
              backgroundColor: CUBE_PALETTE.yellow.hex,
              transform: "rotateX(-90deg) translateZ(56px)",
            }}
          >
            SERVICES
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Lightweight loading skeleton while 3D bundle loads
 */
function AssembleCubeSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none select-none">
      <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl bg-orange-100/40 border border-orange-200/60 animate-pulse flex items-center justify-center shadow-inner">
        <span className="text-3xl sm:text-4xl opacity-60">🎲</span>
      </div>
    </div>
  );
}

export default function AssembleCanvasWrapper({
  scrollProgress,
  className = "",
  onLockedCountChange,
}: AssembleCanvasWrapperProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // 1. Check low-power gate (hardwareConcurrency <= 2, coarse pointer + low memory, etc.)
    if (isLowPowerGated()) {
      setUseFallback(true);
      return;
    }

    // 2. Test WebGL context support
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl2") ||
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setUseFallback(true);
      }
    } catch {
      setUseFallback(true);
    }
  }, []);

  if (!isClient) {
    return <AssembleCubeSkeleton />;
  }

  if (useFallback) {
    return <StaticAssembleCubeFallback />;
  }

  return (
    <AssembleCanvas3D
      scrollProgress={scrollProgress}
      className={className}
      onLockedCountChange={onLockedCountChange}
    />
  );
}
