"use client";

import React from "react";
import { useViewMode } from "@/context/ViewModeContext";
import About from "@/components/landing/About";
import Experience from "@/components/landing/Experience";
import InfiniteScroll from "@/components/landing/InfiniteScroll";
import Work from "@/components/landing/Work";
import Service from "@/components/landing/Service";
import Tools from "@/components/landing/Tools";
import Contact from "@/components/landing/Contact";

export default function ClassicSections() {
  const { mode, isHydrated } = useViewMode();

  // Progressive enhancement & SEO:
  // Server-rendered HTML (and clients with JS disabled) has isHydrated = false,
  // so this renders with full display:block in /out/index.html.
  // After hydration on the client, if mode is 'cube', we hide it so the page
  // does not duplicate sections below the full-viewport 3D Rubik's stage.
  // When the visitor toggles to 'classic' mode, it becomes block and scrolls smoothly.
  const isHidden = isHydrated && mode === "cube";

  return (
    <div
      id="classic-sections"
      className={`classic-sections-container ${isHidden ? "hidden" : "block"}`}
    >
      <About />
      <Experience />
      <InfiniteScroll />
      <Work />
      <Service />
      <Tools />
      <Contact />
    </div>
  );
}
