"use client";

import React from "react";
import CubeReveal from "./CubeReveal";
import CubeSectionHeader from "./CubeSectionHeader";
import { CUBE_PALETTE } from "./config";
import { experiencesList, educationList } from "@/utils/constrants/data";
import { IconBriefcase2, IconSchool } from "@tabler/icons-react";

export default function ClassicCubeExperience() {
  return (
    <section
      id="experience"
      className="py-16 sm:py-20 px-6 sm:px-10 lg:px-16 scroll-mt-20"
    >
      <div className="max-w-5xl mx-auto">
        <CubeReveal direction="x" delayMs={50}>
          <CubeSectionHeader
            label="Face U · Top Face"
            title="EXPERIENCE & EDUCATION"
            subtitle="My professional work history, internships, and educational qualifications."
            accentColor={CUBE_PALETTE.white}
          />
        </CubeReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* Work Experience */}
          <div className="flex flex-col gap-6">
            <CubeReveal direction="x" delayMs={100}>
              <div className="text-xl sm:text-2xl font-bold flex gap-3 items-center text-gray-900 border-b border-gray-200/90 pb-3">
                <span className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                  <IconBriefcase2 size={22} />
                </span>
                <span>Work Experience</span>
              </div>
            </CubeReveal>

            <div className="flex flex-col gap-4">
              {experiencesList.map((exp, index) => (
                <CubeReveal
                  key={index}
                  direction="y"
                  delayMs={150 + index * 80}
                >
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider mb-2">
                      {exp.duration}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                      {exp.label}
                    </h3>
                    <div className="text-sm text-gray-600 font-medium mb-3">
                      {exp.company} • {exp.location}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </CubeReveal>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="flex flex-col gap-6">
            <CubeReveal direction="x" delayMs={120}>
              <div className="text-xl sm:text-2xl font-bold flex gap-3 items-center text-gray-900 border-b border-gray-200/90 pb-3">
                <span className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                  <IconSchool size={22} />
                </span>
                <span>Certifications & Degrees</span>
              </div>
            </CubeReveal>

            <div className="flex flex-col gap-4">
              {educationList.map((edu, index) => (
                <CubeReveal
                  key={index}
                  direction="y"
                  delayMs={170 + index * 80}
                >
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider mb-2">
                      {edu.year}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                      {edu.course}
                    </h3>
                    <div className="text-sm text-gray-600 font-medium">
                      {edu.studyAt} • {edu.location}
                    </div>
                  </div>
                </CubeReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
