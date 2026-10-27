"use client";

import React, { useEffect, useRef, useState } from "react";
import { AssembleSectionDef } from "./config";

export interface SectionShellProps {
  section: AssembleSectionDef;
  children: React.ReactNode;
  className?: string;
  hideDefaultHeader?: boolean;
}

/**
 * Clean SVG Decal watermark outlines (matching existing cube stickers)
 */
function DecalWatermark({ name }: { name: AssembleSectionDef["decalName"] }) {
  const commonClasses = "w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 text-gray-900 pointer-events-none select-none";

  switch (name) {
    case "react":
      return (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="0" cy="0" r="2.05" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case "javascript":
      return (
        <svg viewBox="0 0 24 24" className={commonClasses} fill="currentColor">
          <path d="M3 3h18v18H3V3zm13.7 13.9c.7 0 1.2-.2 1.5-.6.3-.4.4-.9.4-1.6 0-.8-.3-1.4-.8-1.8-.5-.4-1.3-.7-2.3-1-.8-.2-1.4-.5-1.7-.8-.3-.3-.4-.7-.4-1.2 0-.6.2-1 .6-1.3.4-.3 1-.5 1.7-.5.8 0 1.4.2 1.9.6.5.4.8.9.9 1.6l-1.8.4c-.1-.4-.2-.7-.5-.9-.3-.2-.7-.3-1.2-.3-.5 0-.9.1-1.2.3-.3.2-.4.5-.4.9 0 .4.1.7.4.9.3.2.8.4 1.6.7 1 .3 1.8.7 2.3 1.2.5.5.8 1.1.8 2 0 .9-.3 1.6-.9 2.1-.6.5-1.5.8-2.6.8-1 0-1.8-.3-2.4-.8-.6-.5-.9-1.2-1-2.1l1.8-.4c.1.6.3 1 .7 1.3.3.2.9.4 1.7.4zm-6.2.1c-.5.8-1.3 1.2-2.3 1.2-.9 0-1.6-.3-2.1-.8-.5-.5-.8-1.3-.8-2.3V8.8h1.9v6.3c0 .5.1.9.4 1.2.3.3.6.4 1.1.4.5 0 .9-.2 1.1-.5.3-.3.4-.8.4-1.4V8.8h1.9v6.3c0 1.2-.5 2-1.6 2.9z" />
        </svg>
      );
    case "nodejs":
      return (
        <svg viewBox="0 0 24 24" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2L3.5 7v10L12 22l8.5-5V7L12 2z" />
          <path d="M12 22V12m0 0L3.5 7M12 12l8.5-5" />
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
        </svg>
      );
    case "nestjs":
      return (
        <svg viewBox="0 0 24 24" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2L3 6.5V17.5L12 22L21 17.5V6.5L12 2Z" />
          <path d="M8 8.5L12 15L16 8.5" />
          <path d="M12 4.5V15" />
        </svg>
      );
    case "postgres":
      return (
        <svg viewBox="0 0 24 24" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="1">
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
        </svg>
      );
    case "html":
    default:
      return (
        <svg viewBox="0 0 24 24" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M4 3l1.8 16.2L12 21l6.2-1.8L20 3H4z" />
          <path d="M16.5 7H7.5l.4 4h8.2l-.6 6-3.5 1-3.5-1-.2-2.5" />
        </svg>
      );
  }
}

export default function SectionShell({
  section,
  children,
  className = "",
  hideDefaultHeader = false,
}: SectionShellProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Prefers reduced motion check
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // Update dynamic CSS variable and notify active section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Set CSS variable on root for continuous theme accent
          document.documentElement.style.setProperty("--section-accent", section.accentHex);
          document.documentElement.style.setProperty("--section-accent-rgb", section.accentRgb);

          // Dispatch custom event for persistent cube synchronization
          window.dispatchEvent(
            new CustomEvent("assemble:section-enter", {
              detail: {
                id: section.id,
                moveNumber: section.moveNumber,
                face: section.face,
                accentHex: section.accentHex,
              },
            })
          );
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [section]);

  // Gentle parallax offset for decal watermark
  useEffect(() => {
    if (reducedMotion) return;
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        setScrollY(rect.top);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const parallaxOffset = reducedMotion ? 0 : scrollY * -0.06;

  // Asymmetric padding on desktop so the alternating 3D persistent cube never overlaps content
  const desktopPaddingClass =
    section.desktopSide === "left"
      ? "lg:pl-[340px] lg:pr-6"
      : section.desktopSide === "right"
      ? "lg:pr-[340px] lg:pl-6"
      : "max-w-5xl mx-auto";

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className={`relative w-full py-16 sm:py-24 px-6 sm:px-10 lg:px-12 scroll-mt-20 overflow-hidden transition-colors duration-500 ${className}`}
      style={{
        backgroundColor: section.bgTint,
      }}
    >
      {/* 🔹 1. Full-Width Thin Color Band at Section Top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 pointer-events-none select-none z-10"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${section.accentHex} 15%, ${section.accentHex} 85%, transparent 100%)`,
        }}
        aria-hidden="true"
      />

      {/* 🔹 2. Large Faint Decal Watermark with Slow Parallax */}
      <div
        className="absolute top-10 right-8 sm:right-16 md:right-24 opacity-[0.07] pointer-events-none select-none transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
        }}
        aria-hidden="true"
      >
        <DecalWatermark name={section.decalName} />
      </div>

      <div className={`relative z-20 w-full mx-auto ${desktopPaddingClass}`}>
        {/* Default Section Header if not customized */}
        {!hideDefaultHeader && (
          <header className={`mb-10 sm:mb-14 flex flex-col ${section.desktopSide === 'left' ? 'lg:items-start lg:text-left items-center text-center' : 'items-center text-center'}`}>
            {/* Top Chip with Face Name & Move Counter */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-2xs border backdrop-blur-xs"
                style={{
                  color: section.accentHex === "#E8ECF0" ? "#1E293B" : section.accentHex,
                  borderColor: section.borderAccent,
                  backgroundColor: "rgba(255, 255, 255, 0.90)",
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-[2px] inline-block shadow-2xs"
                  style={{ backgroundColor: section.accentHex }}
                />
                <span>{section.faceLabel}</span>
              </span>

              <span className="text-[11px] font-mono font-semibold text-gray-500 bg-white/70 px-2.5 py-1 rounded-full border border-gray-200/80">
                Move {section.moveNumber} / 6
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              {section.subtitle}
            </p>
          </header>
        )}

        {/* Section Main Content */}
        {children}
      </div>
    </section>
  );
}
