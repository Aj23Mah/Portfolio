"use client";

import React from "react";
import CubeReveal from "./CubeReveal";

export default function ClassicCubeCTA() {
  return (
    <section id="cta" className="py-12 sm:py-16 px-6 sm:px-10 scroll-mt-20">
      <CubeReveal direction="y" delayMs={50}>
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-orange-50 via-white to-amber-50/70 text-gray-900 rounded-3xl p-8 sm:p-12 text-center shadow-md border border-orange-200/90 relative overflow-hidden">
          {/* Subtle Rubik's cube sticker accent decoration */}
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-400/20 to-amber-300/10 blur-xl pointer-events-none"
            aria-hidden="true"
          />

          <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            Ready to collaborate?
          </span>

          <h3 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wider mb-3 text-primary">
            HAVE A PROJECT IN MIND?
          </h3>

          <p className="text-gray-700 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Let&apos;s create something useful, reliable, and worth using. Reach
            out to discuss full-stack opportunities or custom development.
          </p>

          <button
            onClick={() => {
              const el = document.getElementById("contact");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold py-3.5 px-8 rounded-full shadow-md hover:shadow-lg transition duration-200 uppercase text-xs sm:text-sm tracking-wider cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            <span>GET IN TOUCH</span>
            <span>→</span>
          </button>
        </div>
      </CubeReveal>
    </section>
  );
}
