"use client";

import React from "react";
import CubeReveal from "./CubeReveal";
import CubeSectionHeader from "./CubeSectionHeader";
import { CUBE_PALETTE } from "./config";
import { aboutStats } from "@/utils/constrants/data";
import {
  IconMapPin,
  IconClock,
  IconBriefcase,
  IconDownload,
  IconMail,
} from "@tabler/icons-react";

export default function ClassicCubeAbout() {
  const quickFacts = [
    {
      icon: <IconMapPin size={14} className="text-orange-600" />,
      label: "Kathmandu, Nepal",
    },
    {
      icon: <IconClock size={14} className="text-orange-600" />,
      label: "UTC+5:45 (Available)",
    },
    {
      icon: <IconBriefcase size={14} className="text-orange-600" />,
      label: "Open to Full-Time & Contracts",
    },
  ];

  const renderQuote = () => (
    <blockquote className="border-l-4 border-orange-500/90 pl-4 sm:pl-6 py-2 my-2 bg-gradient-to-r from-orange-50/70 to-transparent rounded-r-2xl text-gray-800">
      <p
        className="font-medium text-gray-800 leading-snug"
        style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.65rem)" }}
      >
        Besides, considering your{" "}
        <span className="text-orange-600 font-bold">duty</span>, as a warrior
        you should not waver. Indeed, for a{" "}
        <span className="text-orange-600 font-bold">warrior</span>, there is no
        better engagement than fighting for{" "}
        <span className="text-orange-600 font-bold">
          upholding of righteousness
        </span>
        .
      </p>
      <footer className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mt-2 font-mono">
        — BG 2.31
      </footer>
    </blockquote>
  );

  return (
    <section id="about" className="py-16 sm:py-20 px-6 sm:px-10 lg:px-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <CubeReveal direction="x" delayMs={50}>
          <CubeSectionHeader
            label="Face F · Front Face"
            title="ABOUT ME"
            subtitle="My journey, core philosophy, and drive for building impactful digital products."
            accentColor={CUBE_PALETTE.green}
          />
        </CubeReveal>

        {/* 2-Column Desktop Grid aligned to same top baseline */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start mt-6">
          {/* Left Column: Portrait & Desktop Quote */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start gap-6">
            <CubeReveal direction="x" delayMs={100} className="w-full">
              {/* Portrait Badge */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 mx-auto md:mx-0">
                <div
                  className="absolute inset-0 rounded-3xl border-2 border-orange-500/80 translate-x-2.5 translate-y-2.5 pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-white border border-orange-200 shadow-sm flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center p-3 select-none">
                    <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md mb-2 font-mono">
                      AM
                    </div>
                    <span className="text-xs font-bold text-gray-900 tracking-wide">
                      Ajay Maharjan
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-orange-700 font-semibold mt-0.5">
                      Full-Stack JS Developer
                    </span>
                  </div>
                </div>
              </div>
            </CubeReveal>

            {/* Desktop Pull-Quote (hidden on mobile) */}
            <CubeReveal direction="x" delayMs={160} className="w-full hidden md:block">
              {renderQuote()}
            </CubeReveal>
          </div>

          {/* Right Column: Bio, Stats, Quick Facts, and CTAs */}
          <div className="md:col-span-7 flex flex-col">
            <CubeReveal direction="y" delayMs={120}>
              {/* Quick Facts */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {quickFacts.map((fact, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-gray-200/90 text-xs font-medium text-gray-800 shadow-2xs"
                  >
                    {fact.icon}
                    <span>{fact.label}</span>
                  </div>
                ))}
              </div>
            </CubeReveal>

            {/* 3 Compact Stat Chips */}
            <CubeReveal direction="y" delayMs={160}>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 my-2">
                {aboutStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/90 backdrop-blur-sm border border-gray-200/90 rounded-2xl p-3 text-center shadow-2xs hover:border-orange-300 transition-colors"
                  >
                    <div className="text-base sm:text-lg font-extrabold text-orange-600 font-mono leading-tight">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-gray-600 uppercase tracking-wider mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CubeReveal>

            {/* Bio text */}
            <CubeReveal direction="y" delayMs={200}>
              <div className="text-gray-800 leading-[1.7] text-sm sm:text-base space-y-3 mt-4">
                <p className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
                  Bringing life to code and building bridges between technology
                  and user comfort!
                </p>
                <p>
                  Hi, I&apos;m Ajay Kumar Maharjan, a{" "}
                  <strong className="text-orange-700 font-bold">
                    full-stack JavaScript developer
                  </strong>{" "}
                  targeting the essence of innovation through my skills in{" "}
                  <strong className="text-orange-700 font-bold">
                    MERN Stack & Next.js
                  </strong>
                  . Born and raised in Kathmandu, I build dynamic, user-centric
                  solutions that solve real problems.
                </p>
                <p>
                  Since commencing my journey in Information Management, I&apos;ve
                  embraced every architectural challenge as a stepping stone toward
                  engineering excellence.
                </p>
              </div>
            </CubeReveal>

            {/* Mobile Pull-Quote (renders after bio on small screens) */}
            <div className="w-full block md:hidden my-4">
              {renderQuote()}
            </div>

            {/* CTAs */}
            <CubeReveal direction="y" delayMs={240}>
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <IconDownload size={16} />
                  <span>Download Resume</span>
                </a>
                <button
                  onClick={() => {
                    const el = document.getElementById("contact");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 hover:border-orange-500 text-gray-800 hover:text-orange-600 font-bold text-xs uppercase tracking-wider bg-white/80 transition cursor-pointer"
                >
                  <IconMail size={16} />
                  <span>Let&apos;s Connect</span>
                </button>
              </div>
            </CubeReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
