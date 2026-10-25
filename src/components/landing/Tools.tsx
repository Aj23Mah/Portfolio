"use client";
import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { staggerItemVariants } from "@/utils/motion";
import {
  skillCategories,
  currentlyLearningList,
  SkillItem,
} from "@/utils/constrants/data";

export interface ToolsProps {
  idPrefix?: string;
}

export default function Tools({ idPrefix }: ToolsProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const sectionId = idPrefix ? `${idPrefix}-skills` : "tools";
  const isOverlay = Boolean(idPrefix);

  // Staggered animation for category blocks (~60ms stagger)
  const categoryVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.06,
        duration: shouldReduceMotion ? 0.01 : 0.35,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  const renderSkillIcon = (item: SkillItem) => {
    if (item.img) {
      return (
        <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105">
          <Image
            src={item.img}
            alt={`${item.name} logo`}
            width={44}
            height={44}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );
    }

    if (item.icon) {
      return (
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105"
          aria-hidden="true"
        >
          {item.icon}
        </div>
      );
    }

    // Clean text-initial fallback for skills without dedicated icon asset (e.g. Postman)
    // TODO: Drop custom Postman SVG or PNG asset when available; falls back to text-initial badge
    return (
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200/90 text-orange-700 font-extrabold text-sm flex items-center justify-center font-mono shadow-2xs transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105"
        aria-label={`${item.name} logo`}
      >
        {item.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "PM"}
      </div>
    );
  };

  return (
    <section
      id={sectionId}
      className="pt-2 sm:pt-4 pb-12 px-2 sm:px-4 text-gray-900 scroll-mt-20"
    >
      {/* Heading & Intro Line */}
      <motion.div
        className="max-w-2xl mx-auto text-center mb-8 sm:mb-10"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerItemVariants}
      >
        <h2 className="md:text-[2.25rem] text-3xl font-extrabold uppercase tracking-widest text-primary mb-2">
          TOOLS & TECHNOLOGIES
        </h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          The stack I use to build full-stack products, from UI to database.
        </p>
      </motion.div>

      {/* Grouped Category Blocks with ~60ms Staggered Entrance */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {skillCategories.map((cat, catIdx) => (
          <motion.div
            key={cat.category}
            custom={catIdx}
            variants={categoryVariants}
            initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
            animate="visible"
            className="flex flex-col"
          >
            {/* Category header label with orange accent and thin divider line */}
            <div className="flex items-center gap-3 mb-3.5">
              <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold shrink-0">
                {cat.category}
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-orange-300/70 via-gray-200 to-transparent" />
              <span className="text-[11px] font-mono text-gray-500 font-medium shrink-0">
                {cat.skills.length} tools
              </span>
            </div>

            {/* Responsive grid of skill tiles (minmax 96px mobile, 110px desktop) */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3 sm:gap-4">
              {cat.skills.map((item, idx) => {
                const dotCount =
                  item.level === "strong"
                    ? 3
                    : item.level === "comfortable"
                      ? 2
                      : 1;

                return (
                  <motion.div
                    key={idx}
                    tabIndex={0}
                    role="article"
                    aria-label={`${item.name}: ${item.tagline || item.level}`}
                    whileHover={shouldReduceMotion ? {} : { y: -4 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col items-center justify-between text-center gap-2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2 min-h-[114px]"
                  >
                    {/* Icon */}
                    {renderSkillIcon(item)}

                    {/* Skill Name */}
                    <span className="text-xs sm:text-[13px] font-bold text-gray-900 group-hover:text-orange-700 transition-colors leading-tight">
                      {item.name}
                    </span>

                    {/* Tagline & 3-dot Level Indicator */}
                    <div className="flex flex-col items-center gap-1 w-full mt-auto">
                      {item.tagline && (
                        <span className="text-[10px] font-medium text-gray-500 line-clamp-1 group-hover:text-gray-700 transition-colors">
                          {item.tagline}
                        </span>
                      )}

                      {/* 3-Dot Level Indicator (Learning = 1, Comfortable = 2, Strong = 3) */}
                      {/* <div
                        className="flex gap-1 items-center justify-center pt-0.5"
                        role="meter"
                        aria-label={`Skill level: ${item.level}`}
                        aria-valuenow={dotCount}
                        aria-valuemin={1}
                        aria-valuemax={3}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            dotCount >= 1 ? "bg-orange-600" : "bg-orange-200"
                          }`}
                        />
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            dotCount >= 2 ? "bg-orange-600" : "bg-orange-200"
                          }`}
                        />
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            dotCount >= 3 ? "bg-orange-600" : "bg-orange-200"
                          }`}
                        />
                      </div> */}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dot Level Legend */}
      {/* <div className="mt-10 pt-6 border-t border-gray-200/80 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-gray-600 max-w-4xl mx-auto">
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
          Proficiency:
        </span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-orange-600" />
            <span className="w-2 h-2 rounded-full bg-orange-200" />
            <span className="w-2 h-2 rounded-full bg-orange-200" />
          </div>
          <span className="font-medium text-gray-700">Learning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-orange-600" />
            <span className="w-2 h-2 rounded-full bg-orange-600" />
            <span className="w-2 h-2 rounded-full bg-orange-200" />
          </div>
          <span className="font-medium text-gray-700">Comfortable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-orange-600" />
            <span className="w-2 h-2 rounded-full bg-orange-600" />
            <span className="w-2 h-2 rounded-full bg-orange-600" />
          </div>
          <span className="font-medium text-gray-700">Strong</span>
        </div>
      </div> */}

      {/* Currently Learning Strip */}
      {/* <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono uppercase tracking-widest text-orange-600 font-bold">
            CURRENTLY LEARNING
          </span>
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {currentlyLearningList.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-orange-50/90 border border-orange-200 text-xs font-semibold text-orange-700 shadow-2xs"
            >
              {item}
            </span>
          ))}
        </div>
      </div> */}
    </section>
  );
}
