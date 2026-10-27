"use client";

import React from "react";
import ClassicCubeNavbar from "./ClassicCubeNavbar";
import ClassicCubeHero from "./ClassicCubeHero";
import ClassicCubeAbout from "./ClassicCubeAbout";
import ClassicCubeSkills from "./ClassicCubeSkills";
import ClassicCubeExperience from "./ClassicCubeExperience";
import ClassicCubeProjects from "./ClassicCubeProjects";
import ClassicCubeServices from "./ClassicCubeServices";
import ClassicCubeCTA from "./ClassicCubeCTA";
import ClassicCubeContact from "./ClassicCubeContact";
import CubeSectionDivider from "./CubeSectionDivider";
import CubeProgressWidget from "./CubeProgressWidget";
import Footer from "@/components/partials/Footer";

/**
 * ClassicCubeView Component
 * 
 * Experimental 3rd layout combining the clean readability of the classic scrollable view
 * with subtle Rubik's-cube-themed scroll animations, 3D progress tracker, and reordered section flow:
 * Hero → About → Skills → Experience → Projects → Services → CTA → Contact → Footer.
 */
export default function ClassicCubeView() {
  return (
    <div className="relative min-h-screen w-full bg-paper-texture text-gray-900 selection:bg-orange-500 selection:text-white">
      {/* Top Navbar with Switcher & Quick Navigation */}
      <ClassicCubeNavbar />

      {/* Main Content Sections */}
      <main id="classic-cube-content" className="relative z-10 w-full overflow-x-hidden">
        {/* 1. HERO */}
        <ClassicCubeHero />
        <CubeSectionDivider />

        {/* 2. ABOUT */}
        <ClassicCubeAbout />
        <CubeSectionDivider />

        {/* 3. SKILLS */}
        <ClassicCubeSkills />
        <CubeSectionDivider />

        {/* 4. EXPERIENCE */}
        <ClassicCubeExperience />
        <CubeSectionDivider />

        {/* 5. PROJECTS */}
        <ClassicCubeProjects />
        <CubeSectionDivider />

        {/* 6. SERVICES */}
        <ClassicCubeServices />
        <CubeSectionDivider />

        {/* 7. CTA */}
        <ClassicCubeCTA />
        <CubeSectionDivider />

        {/* 8. CONTACT */}
        <ClassicCubeContact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating 3D Scroll Progress Cube Widget */}
      <CubeProgressWidget />
    </div>
  );
}
