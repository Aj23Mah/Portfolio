"use client";

import React from "react";
import Link from "next/link";
import { CUBE_PALETTE } from "./config";

export interface HeroCubeTeaserProps {
  className?: string;
}

/**
 * HeroCubeTeaser Component
 * 
 * Renders a miniature slowly rotating CSS 3D Rubik's cube teaser in the Hero section
 * with a link button to explore the full interactive 3D Dynamic cube view.
 */
export default function HeroCubeTeaser({ className = "" }: HeroCubeTeaserProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
      {/* 3D Mini Cube Container */}
      <div
        className="w-16 h-16 flex items-center justify-center select-none"
        style={{ perspective: "400px" }}
        aria-hidden="true"
      >
        <div
          className="relative w-9 h-9 hero-rotating-cube"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* Front: Green */}
          <div
            className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner"
            style={{
              backgroundColor: CUBE_PALETTE.green.hex,
              transform: "translateZ(18px)",
            }}
          />
          {/* Back: Blue */}
          <div
            className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner"
            style={{
              backgroundColor: CUBE_PALETTE.blue.hex,
              transform: "rotateY(180deg) translateZ(18px)",
            }}
          />
          {/* Right: Red */}
          <div
            className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner"
            style={{
              backgroundColor: CUBE_PALETTE.red.hex,
              transform: "rotateY(90deg) translateZ(18px)",
            }}
          />
          {/* Left: Orange */}
          <div
            className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner"
            style={{
              backgroundColor: CUBE_PALETTE.orange.hex,
              transform: "rotateY(-90deg) translateZ(18px)",
            }}
          />
          {/* Top: White */}
          <div
            className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner"
            style={{
              backgroundColor: CUBE_PALETTE.white.hex,
              transform: "rotateX(90deg) translateZ(18px)",
            }}
          />
          {/* Bottom: Yellow */}
          <div
            className="absolute inset-0 rounded-[4px] border border-[#151518] shadow-inner"
            style={{
              backgroundColor: CUBE_PALETTE.yellow.hex,
              transform: "rotateX(-90deg) translateZ(18px)",
            }}
          />
        </div>
      </div>

      {/* Action link to dynamic 3D cube view */}
      <Link
        href="/"
        className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100/90 border border-orange-300/80 text-orange-800 text-xs sm:text-sm font-mono font-bold tracking-wide shadow-2xs hover:shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-orange-500"
        title="Switch to full interactive 3D Rubik's cube stage"
      >
        <span>🎲 Explore the 3D cube</span>
        <span className="group-hover:translate-x-1 transition-transform duration-200">
          →
        </span>
      </Link>

      <style jsx>{`
        .hero-rotating-cube {
          animation: slowCubeRotate 14s linear infinite;
        }
        @keyframes slowCubeRotate {
          0% {
            transform: rotateX(-22deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(-22deg) rotateY(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-rotating-cube {
            animation: none !important;
            transform: rotateX(-22deg) rotateY(35deg) !important;
          }
        }
      `}</style>
    </div>
  );
}
