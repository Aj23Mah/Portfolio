"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useViewMode } from "@/context/ViewModeContext";

export interface ViewSwitcherProps {
  className?: string;
  variant?: "floating" | "inline";
}

/**
 * ViewSwitcher Component
 * 
 * Unobtrusive pill switcher allowing instant movement between:
 * 1. Dynamic (3D Rubik's cube stage)
 * 2. Classic (traditional scrollable page)
 * 3. Classic Cube (experimental 3D-accented scrollable page)
 * 4. Assemble (experimental scroll-driven 3D cube assembly)
 */
export default function ViewSwitcher({
  className = "",
  variant = "floating",
}: ViewSwitcherProps) {
  const pathname = usePathname();
  const { setMode } = useViewMode();

  const isClassicCube = pathname === "/classic-cube";
  const isAssemble = pathname === "/assemble";
  const isRoot = pathname === "/";

  const handleSelectDynamic = () => {
    setMode("cube");
  };

  const handleSelectClassic = () => {
    setMode("classic");
  };

  const containerClasses =
    variant === "floating"
      ? "fixed top-5 right-5 sm:top-6 sm:right-8 z-40"
      : "inline-flex";

  return (
    <div
      role="group"
      aria-label="Portfolio View Switcher"
      className={`${containerClasses} p-1 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/90 shadow-md flex items-center gap-1 select-none text-xs font-mono font-bold ${className}`}
    >
      {/* 1. Dynamic 3D Cube */}
      <Link
        href="/"
        onClick={handleSelectDynamic}
        className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
          isRoot
            ? "bg-gray-100 text-gray-900 hover:text-orange-600"
            : "text-gray-600 hover:text-gray-950 hover:bg-gray-50"
        }`}
        title="Interactive 3D Rubik's Cube view"
      >
        <span>🌐</span>
        <span className="hidden sm:inline">3D</span>
        <span>Dynamic</span>
      </Link>

      {/* 2. Classic Scrollable */}
      <Link
        href="/?mode=classic"
        onClick={handleSelectClassic}
        className="px-3 py-1.5 rounded-full text-gray-600 hover:text-gray-950 hover:bg-gray-50 transition-all flex items-center gap-1.5"
        title="Traditional full scrollable portfolio view"
      >
        <span>📄</span>
        <span>Classic</span>
      </Link>

      {/* 3. Classic Cube (Experimental) */}
      <Link
        href="/classic-cube"
        className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
          isClassicCube
            ? "bg-orange-600 text-white shadow-2xs"
            : "text-gray-600 hover:text-gray-950 hover:bg-gray-50"
        }`}
        title="Experimental classic view with subtle 3D cube scroll animations"
      >
        <span>🎲</span>
        <span className="font-extrabold">Classic Cube</span>
      </Link>

      {/* 4. Assemble (Experimental) */}
      <Link
        href="/assemble"
        className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
          isAssemble
            ? "bg-orange-600 text-white shadow-2xs"
            : "text-gray-600 hover:text-gray-950 hover:bg-gray-50"
        }`}
        title="Experimental scroll-driven 3D Rubik's cube assembly view"
      >
        <span>🧩</span>
        <span className="font-extrabold">Assemble</span>
      </Link>
    </div>
  );
}
