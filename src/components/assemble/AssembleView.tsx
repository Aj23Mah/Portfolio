"use client";

import React from "react";
import AssembleNavbar from "./AssembleNavbar";
import AssembleHeroTrack from "./AssembleHeroTrack";
import AssembleAbout from "./AssembleAbout";
import AssembleSkills from "./AssembleSkills";
import AssembleExperience from "./AssembleExperience";
import AssembleProjects from "./AssembleProjects";
import AssembleServices from "./AssembleServices";
import AssembleContact from "./AssembleContact";
import SquareDivider from "./SquareDivider";
import dynamic from "next/dynamic";
import Footer from "@/components/partials/Footer";
import { ASSEMBLE_SECTIONS } from "./config";

const PersistentCube = dynamic(() => import("./PersistentCube"), { ssr: false });

/**
 * AssembleView Component (v2 Polish Pass)
 * 
 * Continuous Rubik's cube journey:
 * 1. Hero: 27 scattered cubies fly and lock on scroll.
 * 2. Persistent Cube: A real 3D companion cube stays sticky/fixed past the hero,
 *    smoothly rotating to face F, L, U, R, D, B for each corresponding section,
 *    alternating sides on desktop, updating page accent color (--section-accent),
 *    and opening an interactive face navigation menu on click.
 * 3. Section Shells: Each section gets a full-width color band, faint decal watermark with parallax,
 *    and a subtle 4-6% background wash over the canvas paper texture.
 * 4. Varied Editorial Layouts:
 *    - About: 2-column editorial with oversized pull-quote, stats grid, and quick facts.
 *    - Skills: 3x3 category tile grids with accent hover tints.
 *    - Experience: Alternating vertical timeline with colored cube square nodes.
 *    - Projects: Heroic full-width featured card with edge breakout + 2-col grid.
 *    - Services: Staggered vertical offsets with large faded watermark numbers (01-06).
 *    - Contact: Finale with centered solved cube, wide single card, and 6-color confetti burst.
 */
export default function AssembleView() {
  return (
    <div className="relative min-h-screen w-full bg-paper-texture text-gray-900 selection:bg-orange-500 selection:text-white transition-colors duration-500">
      {/* Top Navbar with Switcher & Quick Navigation */}
      <AssembleNavbar />

      {/* Main Content Sections */}
      <main id="assemble-content" className="relative z-10 w-full">
        {/* 1. HERO & SCROLL-DRIVEN 3D ASSEMBLY TRACK */}
        <AssembleHeroTrack />
        <SquareDivider accentColor={ASSEMBLE_SECTIONS[0].accentHex} />

        {/* 2. ABOUT (Face F · Emerald Green · 2-Column Editorial Pull-Quote Layout) */}
        <AssembleAbout />
        <SquareDivider accentColor={ASSEMBLE_SECTIONS[1].accentHex} />

        {/* 3. SKILLS (Face L · Amber Orange · 3x3 Category Tile Grid) */}
        <AssembleSkills />
        <SquareDivider accentColor={ASSEMBLE_SECTIONS[2].accentHex} />

        {/* 4. EXPERIENCE (Face U · Slate White · Alternating Cube-Node Timeline) */}
        <AssembleExperience />
        <SquareDivider accentColor={ASSEMBLE_SECTIONS[3].accentHex} />

        {/* 5. PROJECTS (Face R · Crimson Red · Featured Edge Breakout + 2-Col Grid) */}
        <AssembleProjects />
        <SquareDivider accentColor={ASSEMBLE_SECTIONS[4].accentHex} />

        {/* 6. SERVICES (Face D · Sunflower Yellow · Staggered Cards with Faded Numbers) */}
        <AssembleServices />
        <SquareDivider accentColor={ASSEMBLE_SECTIONS[5].accentHex} />

        {/* 7. CONTACT FINALE (Face B · Cobalt Blue · Centered Solved Cube + Wide Card + Confetti) */}
        <AssembleContact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent 3D Rubik's Companion Cube (Rotates per section, alternating sides, clickable menu) */}
      <PersistentCube />
    </div>
  );
}
