"use client";

import React from "react";
import Image from "next/image";
import CubeReveal from "./CubeReveal";
import CubeSectionHeader from "./CubeSectionHeader";
import { CUBE_PALETTE } from "./config";
import { skillCategories, SkillItem } from "@/utils/constrants/data";

export default function ClassicCubeSkills() {
  const renderSkillIcon = (item: SkillItem) => {
    if (item.img) {
      return (
        <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
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
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
          aria-hidden="true"
        >
          {item.icon}
        </div>
      );
    }

    // Clean text-initial fallback
    return (
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200/90 text-orange-700 font-extrabold text-sm flex items-center justify-center font-mono shadow-2xs transition-transform duration-200 group-hover:scale-105"
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
    <section id="skills" className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <CubeReveal direction="x" delayMs={50}>
          <CubeSectionHeader
            label="Face L · Left Face"
            title="TOOLS & TECHNOLOGIES"
            subtitle="The tech stack and workflow tools I use to architect full-stack digital products."
            accentColor={CUBE_PALETTE.orange}
          />
        </CubeReveal>

        {/* Grouped Category Blocks */}
        <div className="space-y-10 mt-8">
          {skillCategories.map((cat, catIdx) => (
            <div key={cat.category} className="flex flex-col">
              {/* Category label with thin divider line */}
              <CubeReveal direction="x" delayMs={catIdx * 60}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold shrink-0">
                    {cat.category}
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-orange-300/80 via-gray-200 to-transparent" />
                  <span className="text-[11px] font-mono text-gray-500 font-medium shrink-0">
                    {cat.skills.length} tools
                  </span>
                </div>
              </CubeReveal>

              {/* 3x3 style responsive grid: minmax 96px on mobile, 110px on desktop */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3 sm:gap-4">
                {cat.skills.map((item, idx) => {
                  const dotCount =
                    item.level === "strong"
                      ? 3
                      : item.level === "comfortable"
                      ? 2
                      : 1;

                  return (
                    <CubeReveal
                      key={item.name}
                      direction="x"
                      delayMs={catIdx * 40 + idx * 40}
                    >
                      <div
                        tabIndex={0}
                        role="article"
                        aria-label={`${item.name}: ${item.tagline || item.level}`}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-gray-200/90 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-between text-center gap-2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500 min-h-[114px]"
                      >
                        {/* Icon */}
                        {renderSkillIcon(item)}

                        {/* Name */}
                        <span className="text-xs sm:text-[13px] font-bold text-gray-900 group-hover:text-orange-700 transition-colors leading-tight">
                          {item.name}
                        </span>

                        {/* Tagline & Proficiency dots */}
                        <div className="flex flex-col items-center gap-1 w-full mt-auto">
                          {item.tagline && (
                            <span className="text-[10px] font-medium text-gray-500 line-clamp-1 group-hover:text-gray-700 transition-colors">
                              {item.tagline}
                            </span>
                          )}

                          <div
                            className="flex gap-1 items-center justify-center pt-0.5"
                            role="meter"
                            aria-label={`Proficiency: ${item.level}`}
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
                          </div>
                        </div>
                      </div>
                    </CubeReveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
