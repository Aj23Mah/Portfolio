"use client";

import React from "react";
import SectionShell from "./SectionShell";
import TiltCard from "./TiltCard";
import { ASSEMBLE_SECTIONS } from "./config";
import { aboutStats } from "@/utils/constrants/data";
import {
  IconMapPin,
  IconClock,
  IconBriefcase,
  IconDownload,
  IconMail,
  IconQuote,
} from "@tabler/icons-react";

export default function AssembleAbout() {
  const section = ASSEMBLE_SECTIONS[0]; // Face F · Green · About Me

  const quickFacts = [
    {
      icon: <IconMapPin size={15} className="text-emerald-600" />,
      label: "Kathmandu, Nepal",
    },
    {
      icon: <IconClock size={15} className="text-emerald-600" />,
      label: "UTC+5:45 (Available)",
    },
    {
      icon: <IconBriefcase size={15} className="text-emerald-600" />,
      label: "Open to Full-Time & Contracts",
    },
  ];

  return (
    <SectionShell section={section}>
      {/* 2-Column Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Oversized Pull-Quote & Identity Badge */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Identity Card */}
          <TiltCard className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-sm flex items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white font-extrabold text-2xl flex items-center justify-center font-mono shadow-md">
              <span>AM</span>
              <div className="absolute inset-0 border border-white/20 rounded-2xl pointer-events-none" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
                Full-Stack JS Developer
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                Ajay Kumar Maharjan
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                Crafting performant web architecture
              </p>
            </div>
          </TiltCard>

          {/* Oversized Editorial Pull-Quote */}
          <div className="relative bg-gradient-to-br from-emerald-50/80 via-white/95 to-teal-50/40 rounded-3xl p-6 sm:p-8 border-l-4 border-l-emerald-600 border border-emerald-100 shadow-md">
            <IconQuote size={38} className="text-emerald-500/30 mb-2" />
            <blockquote className="text-gray-800 leading-relaxed font-medium text-base sm:text-lg">
              &ldquo;Besides, considering your{" "}
              <span className="text-emerald-700 font-bold">duty</span>, as a warrior
              you should not waver. Indeed, for a{" "}
              <span className="text-emerald-700 font-bold">warrior</span>, there is no
              better engagement than fighting for{" "}
              <span className="text-emerald-700 font-bold">
                upholding of righteousness
              </span>
              .&rdquo;
            </blockquote>
            <footer className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mt-4">
              — Bhagavad Gita 2.31
            </footer>
          </div>
        </div>

        {/* Right Column: Bio Narrative, Quick Facts, and Stats Grid */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <TiltCard className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600" />
              <span>Bio & Engineering Philosophy</span>
            </h3>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              I am a dedicated software engineer specializing in JavaScript and TypeScript ecosystems.
              With hands-on expertise building production-ready architectures with Next.js, Node.js,
              and PostgreSQL, I focus on building robust, scalable applications with clean component
              patterns and responsive user experiences.
            </p>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Whether optimizing database queries, engineering secure REST/GraphQL endpoints,
              or implementing accessible design systems, I take ownership from architecture
              to deployment.
            </p>

            {/* Quick Facts Chips */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {quickFacts.map((fact, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/70 border border-emerald-200/70 text-xs font-medium text-gray-800 shadow-2xs"
                >
                  {fact.icon}
                  <span>{fact.label}</span>
                </div>
              ))}
            </div>
          </TiltCard>

          {/* Interactive Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {aboutStats.map((stat, idx) => (
              <TiltCard
                key={idx}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-2xs text-center flex flex-col items-center justify-center"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wide">
                  {stat.label}
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition text-sm shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              <IconDownload size={18} />
              <span>Download Resume</span>
            </a>
            <button
              onClick={() => {
                const el = document.getElementById("contact");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="py-3 px-6 rounded-xl border border-gray-300 hover:border-emerald-600 text-gray-800 hover:text-emerald-700 bg-white transition text-sm font-semibold shadow-2xs cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <IconMail size={18} />
              <span>Get In Touch</span>
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
