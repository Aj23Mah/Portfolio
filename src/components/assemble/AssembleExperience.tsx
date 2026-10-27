"use client";

import React from "react";
import SectionShell from "./SectionShell";
import TiltCard from "./TiltCard";
import { ASSEMBLE_SECTIONS } from "./config";
import { experiencesList, educationList } from "@/utils/constrants/data";
import { IconBriefcase2, IconSchool, IconCalendar } from "@tabler/icons-react";

export default function AssembleExperience() {
  const section = ASSEMBLE_SECTIONS[2]; // Face U · White / Slate · Experience

  return (
    <SectionShell section={section}>
      <div className="flex flex-col gap-14">
        {/* Subheader */}
        <div className="flex items-center gap-3 pb-2 border-b border-slate-300">
          <span className="p-2 bg-slate-100 text-slate-800 rounded-xl">
            <IconBriefcase2 size={22} />
          </span>
          <h3 className="text-2xl font-bold text-gray-900">Work Experience</h3>
        </div>

        {/* 🔹 Alternating Vertical Timeline */}
        <div className="relative w-full">
          {/* Central Vertical Line */}
          <div
            className="absolute top-0 bottom-0 left-4 lg:left-1/2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-200"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-8 lg:gap-12">
            {experiencesList.map((exp, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`relative flex items-center w-full ${
                    isEven ? "lg:flex-row-reverse" : "lg:flex-row"
                  }`}
                >
                  {/* Timeline Cube Square Node */}
                  <div
                    className="absolute left-4 lg:left-1/2 -translate-x-1/2 w-5 h-5 rounded-[4px] bg-white border-2 border-slate-700 shadow-sm z-20 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="w-2 h-2 rounded-[1px] bg-slate-800" />
                  </div>

                  {/* Spacer for 50% width on opposite side */}
                  <div className="hidden lg:block lg:w-1/2" />

                  {/* Timeline Entry Card */}
                  <div
                    className={`pl-12 lg:pl-0 w-full lg:w-1/2 ${
                      isEven ? "lg:pr-12 text-left lg:text-right" : "lg:pl-12 text-left"
                    }`}
                  >
                    <TiltCard className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all inline-block w-full text-left">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                        <IconCalendar size={14} />
                        <span>{exp.duration}</span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        {exp.label}
                      </h4>

                      <div className="text-xs sm:text-sm text-slate-600 font-semibold mb-3">
                        {exp.company} • {exp.location}
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {exp.description}
                      </p>
                    </TiltCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔹 Education & Qualifications Section at End */}
        <div className="pt-8">
          <div className="flex items-center gap-3 pb-2 mb-6 border-b border-slate-300">
            <span className="p-2 bg-slate-100 text-slate-800 rounded-xl">
              <IconSchool size={22} />
            </span>
            <h3 className="text-2xl font-bold text-gray-900">
              Education & Certifications
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {educationList.map((edu, idx) => (
              <TiltCard
                key={idx}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200/90 shadow-sm"
              >
                <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {edu.year}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {edu.course}
                </h4>
                <div className="text-sm text-slate-600 font-medium mb-1">
                  {edu.studyAt}
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  {edu.location}
                </p>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
