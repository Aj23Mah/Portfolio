"use client";

import React, { useState, useEffect } from "react";
import { ASSEMBLE_CONFIG } from "./config";

interface AssembleDebugOverlayProps {
  progress: number;
  lockedCount: number;
  onJumpToProgress?: (targetP: number) => void;
}

export default function AssembleDebugOverlay({
  progress,
  lockedCount,
  onJumpToProgress,
}: AssembleDebugOverlayProps) {
  const [enabled, setEnabled] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeSection, setActiveSection] = useState<{ id: string; moveNumber: number; face: string; accentHex: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const isDebug = searchParams.get("debug") === "1" || searchParams.get("debug") === "true";
    setEnabled(isDebug);
    if (window.innerWidth < 768) {
      setMinimized(true);
    }

    const onSection = (e: Event) => {
      setActiveSection((e as CustomEvent).detail);
    };
    window.addEventListener("assemble:section-enter", onSection);
    return () => window.removeEventListener("assemble:section-enter", onSection);
  }, []);

  if (!enabled) return null;

  // Compute active phase description
  let phaseName = "Phase 1: Float & Drift";
  let phaseColor = "text-sky-400";
  if (progress > ASSEMBLE_CONFIG.phaseFloatEnd && progress <= ASSEMBLE_CONFIG.phaseFlyInEnd) {
    phaseName = "Phase 2: Flying In & Locking";
    phaseColor = "text-amber-400";
  } else if (progress > ASSEMBLE_CONFIG.phaseFlyInEnd && progress <= ASSEMBLE_CONFIG.phaseSettleEnd) {
    phaseName = "Phase 3: Settle & Rotation";
    phaseColor = "text-emerald-400";
  } else if (progress > ASSEMBLE_CONFIG.phaseSettleEnd) {
    phaseName = "Phase 4: Solved & Hint Glow";
    phaseColor = "text-orange-400";
  }

  const pPercent = Math.round(progress * 100);

  return (
    <div
      role="region"
      aria-label="Assemble Debug Panel"
      className="fixed top-20 right-4 sm:top-24 sm:right-6 z-50 font-mono text-xs select-none transition-all duration-200"
    >
      <div className="bg-gray-950/90 text-gray-100 p-3.5 rounded-2xl border border-orange-500/50 shadow-2xl backdrop-blur-xl max-w-xs sm:max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-bold text-orange-400 uppercase tracking-widest text-[11px]">
              Assemble Debug
            </span>
          </div>
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-gray-400 hover:text-white transition px-1.5 py-0.5 rounded text-[10px] bg-gray-800/80 cursor-pointer"
          >
            {minimized ? "Expand" : "Minimize"}
          </button>
        </div>

        {/* Minimized View */}
        {minimized ? (
          <div className="flex items-center gap-2 text-[11px]">
            <span>p:</span>
            <span className="font-bold text-orange-400">{progress.toFixed(3)}</span>
            <span className="text-gray-400">({pPercent}%)</span>
            <span className="text-gray-500">•</span>
            <span>{lockedCount}/27 locked</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Progress metric */}
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-gray-400">Progress (p):</span>
              <span className="font-bold text-white tracking-wider">
                {progress.toFixed(4)}{" "}
                <span className="text-orange-400 font-normal text-xs">({pPercent}%)</span>
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden relative">
              {/* Breakpoint indicators */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-sky-500/60 z-10"
                style={{ left: `${ASSEMBLE_CONFIG.phaseFloatEnd * 100}%` }}
                title="Phase 1 float end (0.10)"
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-500/60 z-10"
                style={{ left: `${ASSEMBLE_CONFIG.phaseFlyInEnd * 100}%` }}
                title="Phase 2 fly-in end (0.75)"
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-500/60 z-10"
                style={{ left: `${ASSEMBLE_CONFIG.phaseSettleEnd * 100}%` }}
                title="Phase 3 settle end (0.90)"
              />
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-amber-500 to-orange-500 transition-all duration-75"
                style={{ width: `${Math.min(100, progress * 100)}%` }}
              />
            </div>

            {/* Active Phase & Locked count */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-gray-400">Phase:</span>
              <span className={`font-semibold ${phaseColor}`}>{phaseName}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400">Locked pieces:</span>
              <span className="font-bold text-white">
                {lockedCount} <span className="text-gray-500">/ 27</span>
              </span>
            </div>

            {/* Active Section & Accent */}
            {activeSection && (
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-800">
                <span className="text-gray-400">Section:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-[2px] inline-block"
                    style={{ backgroundColor: activeSection.accentHex }}
                  />
                  <span>Move {activeSection.moveNumber}/6 ({activeSection.id})</span>
                  <span className="text-gray-400 text-[10px] font-mono">{activeSection.accentHex}</span>
                </span>
              </div>
            )}

            {/* Quick-Jump Buttons for Tuning Breakpoints */}
            <div className="pt-2 mt-1 border-t border-gray-800/80 flex flex-wrap gap-1.5">
              <span className="text-[10px] text-gray-500 w-full mb-0.5">Jump to test:</span>
              {[0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0].map((target) => (
                <button
                  key={target}
                  onClick={() => onJumpToProgress?.(target)}
                  className="px-2 py-1 rounded bg-gray-900 hover:bg-orange-600 hover:text-white text-gray-300 text-[10px] transition border border-gray-800 cursor-pointer"
                >
                  p={target}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
