"use client";

import React, { useState } from "react";
import Logo from "@/components/partials/logo";
import ViewSwitcher from "@/components/classic-cube/ViewSwitcher";
import { ORDERED_SECTIONS, SECTION_METADATA, SectionKey } from "@/components/classic-cube/config";
import { IconMenu2, IconX } from "@tabler/icons-react";

export default function AssembleNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: SectionKey) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = ORDERED_SECTIONS.filter((s) => s !== "hero" && s !== "cta");

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-gray-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo & View Badge */}
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100/80 text-orange-800 text-[11px] font-mono font-bold tracking-wide border border-orange-200">
            <span>🧩</span>
            <span>Assemble</span>
          </span>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider text-gray-700"
          aria-label="Assemble view sections navigation"
        >
          {navLinks.map((key) => {
            const meta = SECTION_METADATA[key];
            return (
              <button
                key={key}
                onClick={() => scrollTo(key)}
                className="hover:text-orange-600 transition cursor-pointer flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-orange-500 rounded-sm"
              >
                <span
                  style={{ backgroundColor: meta.color.hex }}
                  className="w-1.5 h-1.5 rounded-full"
                />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side: View Switcher & Mobile menu button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ViewSwitcher variant="inline" />

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500"
            aria-label={mobileMenuOpen ? "Close menu" : "Open section menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/80 bg-white/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-mono text-gray-500 font-bold uppercase tracking-widest pb-1 border-b border-gray-100">
            Sections
          </div>
          {navLinks.map((key) => {
            const meta = SECTION_METADATA[key];
            return (
              <button
                key={key}
                onClick={() => scrollTo(key)}
                className="flex items-center gap-3 py-2 text-sm font-semibold text-gray-800 hover:text-orange-600 text-left cursor-pointer"
              >
                <span
                  style={{ backgroundColor: meta.color.hex }}
                  className="w-2.5 h-2.5 rounded-[3px] border border-gray-900/20"
                />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
