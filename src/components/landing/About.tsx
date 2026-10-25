"use client";
import React from "react";
import {
  IconMapPin,
  IconBriefcase2,
  IconSchool,
  IconCircleCheck,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { staggerContainerVariants, staggerItemVariants } from "@/utils/motion";
import { aboutStats } from "@/utils/constrants/data";

export interface AboutProps {
  idPrefix?: string;
}

export default function About({ idPrefix }: AboutProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionId = idPrefix ? `${idPrefix}-about` : "about";
  const isOverlay = Boolean(idPrefix);

  const quickFacts = [
    {
      icon: <IconMapPin size={15} className="text-orange-600 shrink-0" />,
      label: "Kathmandu, Nepal",
    },
    {
      icon: <IconBriefcase2 size={15} className="text-orange-600 shrink-0" />,
      label: "Junior JS Developer @ Next In Tech",
    },
    {
      icon: <IconSchool size={15} className="text-orange-600 shrink-0" />,
      label: "Information Management",
    },
    {
      icon: <IconCircleCheck size={15} className="text-emerald-600 shrink-0" />,
      label: "Open to work",
    },
  ];

  // Reusable pull-quote element (demoted to ~60-65% font size with thin orange left border)
  const renderQuote = (className = "") => (
    <blockquote
      className={`border-l-2 border-orange-600 pl-4 py-2.5 bg-orange-50/60 rounded-r-2xl border-y border-r border-orange-200/50 ${className}`}
    >
      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed italic">
        Besides, considering your{" "}
        <span className="text-primary font-bold not-italic">duty</span>, as a
        warrior you should not waver. Indeed, for a{" "}
        <span className="text-primary font-bold not-italic">warrior</span>, there
        is no better engagement than fighting for{" "}
        <span className="text-primary font-bold not-italic">
          upholding of righteousness
        </span>
        .
      </p>
      <cite className="block text-[11px] font-bold text-gray-500 mt-2 font-mono not-italic">
        — BG 2.31
      </cite>
    </blockquote>
  );

  return (
    <section id={sectionId} className="pt-2 sm:pt-4 pb-10 px-1 sm:px-3 text-gray-900 scroll-mt-20">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-4xl mx-auto"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainerVariants}
      >
        {/* Left Column: Portrait & Desktop Quote (aligned to same top baseline as Right Column) */}
        <motion.div
          variants={staggerItemVariants}
          className="md:col-span-5 flex flex-col items-center md:items-start gap-6"
        >
          {/* Portrait slot with offset orange border */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 mx-auto md:mx-0 mt-1">
            <div
              className="absolute inset-0 rounded-3xl border-2 border-orange-500/80 translate-x-2.5 translate-y-2.5 pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-white border border-orange-200 shadow-sm flex items-center justify-center">
              {/* 
                TODO: To display your photo, add /public/profile.jpg and replace the fallback below with:
                <Image src="/profile.jpg" alt="Ajay Kumar Maharjan" fill className="object-cover" priority />
              */}
              <div className="flex flex-col items-center justify-center text-center p-3 select-none">
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md mb-2 font-mono">
                  AM
                </div>
                <span className="text-xs font-bold text-gray-900 tracking-wide">
                  Ajay Maharjan
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-orange-700 font-semibold mt-0.5">
                  Software Developer
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Pull-Quote (hidden on mobile, rendered below bio on mobile) */}
          <div className="w-full hidden md:block">
            {renderQuote()}
          </div>
        </motion.div>

        {/* Right Column: Heading, Quick Facts, Stat Chips, Bio, Mobile Quote, CTAs */}
        <motion.div variants={staggerItemVariants} className="md:col-span-7 flex flex-col">
          {/* Section Heading */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            About Me
          </h2>

          {/* Quick-Facts Row */}
          <div className="flex flex-wrap items-center gap-2 my-3.5">
            {quickFacts.map((fact, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-gray-200/90 text-xs font-medium text-gray-800 shadow-xs"
              >
                {fact.icon}
                <span>{fact.label}</span>
              </div>
            ))}
          </div>

          {/* 3 Compact Stat Chips */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 my-3">
            {aboutStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm border border-gray-200/90 rounded-2xl p-2.5 sm:p-3 text-center shadow-xs hover:border-orange-300 transition-colors"
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

          {/* Bio text split into short paragraphs with ~1.7 line height and key phrases highlighted */}
          <div className="text-gray-800 leading-[1.7] text-sm sm:text-base space-y-3 mt-3">
            <p className="text-base sm:text-lg font-medium text-gray-900 leading-snug">
              Bringing life to code and building bridges between technology and user comfort!
            </p>
            <p>
              Hi, I&apos;m Ajay Kumar Maharjan, a{" "}
              <strong className="text-orange-700 font-bold">
                full-stack JavaScript developer
              </strong>{" "}
              targeting the essence of innovation through my skills in{" "}
              <strong className="text-orange-700 font-bold">MERN Stack</strong>. Born and
              raised in the tech heartbeat of Kathmandu, I currently enhance web applications
              with a flair for dynamic, user-centric solutions.
            </p>
            <p>
              Since commencing my educational journey in{" "}
              <strong className="text-gray-900 font-semibold">Information Management</strong>,
              I&apos;ve embraced every learning opportunity and technological challenge, turning
              them into stepping stones toward becoming an expert in my field.
            </p>
            <p>
              Throughout my career, my projects have not just been tasks, but adventures in
              creating impactful tech that addresses real-world needs.
            </p>
          </div>

          {/* Mobile Pull-Quote (appears after bio and before CTAs on mobile viewports) */}
          <div className="w-full block md:hidden my-4">
            {renderQuote()}
          </div>

          {/* CTA Row at the end */}
          <div className="flex flex-wrap items-center gap-3 pt-4 pb-2">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow-sm transition cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
            >
              <span>Let&apos;s talk</span>
              <span>→</span>
            </a>

            {/* 
              TODO: Add your resume file at /public/resume.pdf to enable direct download.
            */}
            <a
              href="/resume.pdf"
              download="Ajay_Kumar_Maharjan_Resume.pdf"
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-gray-900 border border-gray-800 text-gray-900 hover:text-white active:scale-95 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow-xs transition cursor-pointer focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2"
            >
              <span>Download Résumé</span>
              <span>↓</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
