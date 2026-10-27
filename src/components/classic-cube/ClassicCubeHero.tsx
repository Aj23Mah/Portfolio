"use client";

import React from "react";
import { TypeAnimation } from "react-type-animation";
import HeroCubeTeaser from "./HeroCubeTeaser";
import CubeReveal from "./CubeReveal";

export default function ClassicCubeHero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[85vh] flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-28 pb-16 bg-gradient-to-b from-orange-50/40 via-white to-white/90 overflow-hidden"
    >
      {/* Ambient background blur */}
      <div
        className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto w-full flex flex-col items-start pl-14 sm:pl-20 md:pl-24 relative z-10">
        <CubeReveal direction="x" delayMs={50}>
          <div className="font-bold text-primary uppercase tracking-widest text-xs sm:text-sm mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-[2px] bg-orange-600 inline-block" />
            <span>HELLO, I&apos;M</span>
          </div>
        </CubeReveal>

        <CubeReveal direction="x" delayMs={100}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold my-1 tracking-tight text-gray-900">
            <span className="smooch block text-6xl sm:text-7xl md:text-8xl font-normal leading-none text-gray-950">
              Ajay Kumar
            </span>
            <span className="relative text-3xl sm:text-4xl md:text-5xl text-primary uppercase tracking-widest font-bold -mt-2 block">
              Maharjan
            </span>
          </h1>
        </CubeReveal>

        <CubeReveal direction="x" delayMs={150}>
          <div className="flex gap-2 items-center mt-3 text-gray-800">
            <TypeAnimation
              sequence={[
                "Full-Stack JS Developer",
                1200,
                "Software Developer",
                1200,
              ]}
              wrapper="span"
              speed={20}
              style={{
                fontSize: "1.35em",
                display: "inline-block",
                fontWeight: 700,
              }}
              repeat={Infinity}
            />
          </div>
        </CubeReveal>

        <CubeReveal direction="x" delayMs={200}>
          <p className="text-gray-700 text-base sm:text-lg font-normal leading-relaxed mt-4 max-w-2xl">
            I work across the frontend and backend to build complete, scalable,
            and user-friendly web applications — from designing dynamic
            interfaces to engineering secure APIs and database architectures.
          </p>
        </CubeReveal>

        {/* Hero Cube Teaser with link to 3D Dynamic view */}
        <CubeReveal direction="y" delayMs={250} className="mt-6">
          <HeroCubeTeaser />
        </CubeReveal>

        {/* Action Buttons */}
        <CubeReveal direction="y" delayMs={300} className="mt-8">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById("projects");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition text-sm shadow-md cursor-pointer hover:shadow-lg focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              View Projects ↓
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("contact");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="py-3 px-6 rounded-xl border border-gray-300 hover:border-orange-500 text-gray-800 hover:text-orange-600 transition text-sm font-semibold bg-white cursor-pointer shadow-2xs hover:shadow-xs focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              Contact Me
            </button>
          </div>
        </CubeReveal>
      </div>
    </section>
  );
}
