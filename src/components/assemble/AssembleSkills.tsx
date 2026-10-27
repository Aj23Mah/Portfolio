"use client";

import React from "react";
import Image from "next/image";
import SectionShell from "./SectionShell";
import TiltCard from "./TiltCard";
import { ASSEMBLE_SECTIONS } from "./config";
import { skillCategories, SkillItem } from "@/utils/constrants/data";

export default function AssembleSkills() {
  const section = ASSEMBLE_SECTIONS[1]; // Face L · Orange · Skills

  const renderSkillIcon = (item: SkillItem) => {
    if (item.img) {
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
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
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          aria-hidden="true"
        >
          {item.icon}
        </div>
      );
    }

    // Text initials fallback
    return (
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-100 text-orange-800 font-extrabold text-sm flex items-center justify-center font-mono shadow-2xs group-hover:scale-110 transition-transform"
        aria-label={`${item.name} logo`}
      >
        {item.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "JS"}
      </div>
    );
  };

  return (
    <SectionShell section={section}>
      <div className="flex flex-col gap-10">
        {skillCategories.map((cat, catIdx) => (
          <div key={cat.category} className="flex flex-col gap-4">
            {/* Category Subheader */}
            <div className="flex items-center gap-3 pb-2 border-b border-orange-200/80">
              <span className="w-3 h-3 rounded-[3px] bg-orange-500 shadow-2xs" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {cat.category} Development
              </h3>
              <span className="text-xs font-mono font-semibold text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full ml-auto">
                {cat.skills.length} Technologies
              </span>
            </div>

            {/* 3x3 Style Tile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {cat.skills.map((skill, skillIdx) => (
                <TiltCard
                  key={skill.name}
                  className="group bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-gray-200/90 hover:border-orange-500/70 hover:bg-orange-50/40 transition-all duration-200 flex flex-col items-center text-center justify-between gap-3 cursor-default"
                >
                  {/* Icon */}
                  <div className="p-2 rounded-xl bg-gray-50/80 group-hover:bg-white transition-colors duration-200 shadow-2xs">
                    {renderSkillIcon(skill)}
                  </div>

                  {/* Name */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                      {skill.name}
                    </h4>
                  </div>

                  {/* 3-Cube Dot Proficiency Indicator */}
                  <div className="flex items-center gap-1 mt-auto pt-1" title="Proficiency">
                    {[1, 2, 3].map((dot) => (
                      <span
                        key={dot}
                        className={`w-2 h-2 rounded-[2px] transition-colors duration-200 ${
                          dot <= 3
                            ? "bg-orange-500 shadow-2xs group-hover:bg-orange-600"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
