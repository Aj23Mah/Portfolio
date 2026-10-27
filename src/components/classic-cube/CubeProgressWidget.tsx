"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  CUBE_PALETTE,
  ORDERED_SECTIONS,
  SECTION_METADATA,
  SectionKey,
} from "./config";
import { IconChevronUp, IconChevronDown, IconX } from "@tabler/icons-react";

export interface CubeProgressWidgetProps {
  className?: string;
}

/**
 * CubeProgressWidget Component
 * 
 * Fixed 3D CSS Rubik's cube (~52px) that rotates smoothly based on scroll progress,
 * mapping sections to faces. Clicking opens a compact section navigator menu.
 * Uses requestAnimationFrame-throttled scroll handling with passive listeners.
 */
export default function CubeProgressWidget({ className = "" }: CubeProgressWidgetProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [rotation, setRotation] = useState({ x: -20, y: 30 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setShouldReduceMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Close menu on click outside or escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // RequestAnimationFrame-throttled scroll handler
  const handleScroll = useCallback(() => {
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - viewportHeight;
      const scrollFraction = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

      // Find current section based on scroll offset
      let currentSec: SectionKey = "hero";
      const scrollMid = scrollY + viewportHeight * 0.35;

      for (const key of ORDERED_SECTIONS) {
        const el = document.getElementById(key);
        if (el) {
          const top = el.offsetTop;
          if (scrollMid >= top - 80) {
            currentSec = key;
          }
        }
      }

      setActiveSection(currentSec);

      if (!shouldReduceMotion) {
        const targetRot = SECTION_METADATA[currentSec].cubeRotation;
        // Subtle dynamic rotation offset based on granular scroll progress
        const subtleXOffset = Math.sin(scrollFraction * Math.PI * 4) * 6;
        const subtleYOffset = (scrollFraction * 360) % 360;

        setRotation({
          x: targetRot.x + subtleXOffset,
          y: targetRot.y + subtleYOffset * 0.15,
        });
      }
    });
  }, [shouldReduceMotion]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [handleScroll]);

  const scrollToSection = (id: SectionKey) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    }
    setIsMenuOpen(false);
  };

  const scrollToNextSection = () => {
    const currentIndex = ORDERED_SECTIONS.indexOf(activeSection);
    const nextIndex = (currentIndex + 1) % ORDERED_SECTIONS.length;
    scrollToSection(ORDERED_SECTIONS[nextIndex]);
  };

  const scrollToPrevSection = () => {
    const currentIndex = ORDERED_SECTIONS.indexOf(activeSection);
    const prevIndex =
      (currentIndex - 1 + ORDERED_SECTIONS.length) % ORDERED_SECTIONS.length;
    scrollToSection(ORDERED_SECTIONS[prevIndex]);
  };

  const activeMeta = SECTION_METADATA[activeSection];

  return (
    <div
      ref={menuRef}
      className={`fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-40 select-none ${className}`}
      aria-label="3D scroll navigation cube"
    >
      {/* Section Menu Popover */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-label="Quick section navigator"
          className="absolute bottom-20 right-0 w-64 rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200/90 shadow-2xl p-4 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600">
                Cube Navigation
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-lg focus-visible:outline-2 focus-visible:outline-orange-500 cursor-pointer"
              aria-label="Close section menu"
            >
              <IconX size={16} />
            </button>
          </div>

          {/* Section List */}
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto py-1">
            {ORDERED_SECTIONS.map((key) => {
              const meta = SECTION_METADATA[key];
              const isCurrent = key === activeSection;

              return (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500 ${
                    isCurrent
                      ? "bg-orange-50 text-orange-800 font-bold border border-orange-200/80 shadow-2xs"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-950"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      style={{
                        backgroundColor: meta.color.hex,
                        borderColor: meta.color.border || "#151518",
                      }}
                      className="w-2.5 h-2.5 rounded-[3px] border shadow-2xs shrink-0"
                    />
                    <span>{meta.label}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-orange-600 font-bold">
                      CURRENT
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Step Buttons */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              onClick={scrollToPrevSection}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold font-mono transition cursor-pointer"
            >
              <IconChevronUp size={14} />
              <span>Prev</span>
            </button>
            <button
              onClick={scrollToNextSection}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold font-mono transition shadow-2xs cursor-pointer"
            >
              <span>Next</span>
              <IconChevronDown size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Cube Trigger */}
      <div className="flex items-center gap-2.5">
        {/* Floating pill badge showing current section name */}
        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/90 shadow-md text-xs font-bold text-gray-800 hover:text-orange-600 transition cursor-pointer hover:border-orange-300"
          title="Click to toggle section menu"
        >
          <span
            style={{
              backgroundColor: activeMeta.color.hex,
              borderColor: activeMeta.color.border || "#151518",
            }}
            className="w-2 h-2 rounded-full border shadow-2xs shrink-0"
          />
          <span className="capitalize">{activeMeta.label}</span>
        </div>

        {/* 3D Transform Cube Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={`Scroll navigation cube. Active section: ${activeMeta.label}. Click to open section menu.`}
          className="relative w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer group focus-visible:outline-2 focus-visible:outline-orange-500"
          style={{ perspective: "450px" }}
        >
          {/* 3D Cube Container */}
          <div
            className="relative w-8 h-8 pointer-events-none"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: shouldReduceMotion
                ? "none"
                : "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "transform",
            }}
          >
            {/* Front Face: Green (About) */}
            <div
              className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner flex items-center justify-center"
              style={{
                backgroundColor: CUBE_PALETTE.green.hex,
                transform: "translateZ(16px)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>

            {/* Back Face: Blue (Contact) */}
            <div
              className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner flex items-center justify-center"
              style={{
                backgroundColor: CUBE_PALETTE.blue.hex,
                transform: "rotateY(180deg) translateZ(16px)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>

            {/* Right Face: Red (Projects) */}
            <div
              className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner flex items-center justify-center"
              style={{
                backgroundColor: CUBE_PALETTE.red.hex,
                transform: "rotateY(90deg) translateZ(16px)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>

            {/* Left Face: Orange (Skills) */}
            <div
              className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner flex items-center justify-center"
              style={{
                backgroundColor: CUBE_PALETTE.orange.hex,
                transform: "rotateY(-90deg) translateZ(16px)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>

            {/* Top Face: White (Experience) */}
            <div
              className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner flex items-center justify-center"
              style={{
                backgroundColor: CUBE_PALETTE.white.hex,
                transform: "rotateX(90deg) translateZ(16px)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600/70" />
            </div>

            {/* Bottom Face: Yellow (Services) */}
            <div
              className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner flex items-center justify-center"
              style={{
                backgroundColor: CUBE_PALETTE.yellow.hex,
                transform: "rotateX(-90deg) translateZ(16px)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#151518]/70" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
