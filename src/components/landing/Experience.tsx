"use client";
import React from "react";
import { IconBriefcase2, IconSchool } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { staggerContainerVariants, staggerItemVariants } from "@/utils/motion";

export interface ExperienceProps {
  idPrefix?: string;
}

export const experiences = [
  {
    label: "Junior JS Developer",
    company: "Next In Tech Pvt Ltd",
    duration: "Sep 2024 – Present",
    location: "Tahachal, Kathmandu",
    description: "Developing scalable web applications, REST APIs, and interactive UI components with modern JavaScript frameworks.",
  },
  {
    label: "Internship (Full Stack JS)",
    company: "Krafters Technology",
    duration: "Mar 2024 – Aug 2024 (6 Months)",
    location: "Kumaripati, Lalitpur",
    description: "Hands-on experience developing full-stack web solutions, database modeling, and collaborating in agile sprints.",
  },
];

export const education = [
  {
    studyAt: "Krafters Technology",
    location: "Kumaripati, Lalitpur",
    course: "Full Stack JS Development Certification",
    year: "2024",
  },
];

export default function Experience({ idPrefix }: ExperienceProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionId = idPrefix ? `${idPrefix}-experience` : "experience";

  const isOverlay = Boolean(idPrefix);

  return (
    <section id={sectionId} className="container mx-auto py-16 px-5 sm:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainerVariants}
      >
        <motion.div variants={staggerItemVariants} className="text-center mb-12">
          <div className="font-bold text-primary uppercase tracking-widest text-xs sm:text-sm mb-2">
            CAREER PATH
          </div>
          <h2 className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-wider text-gray-900">
            Work Experience & Certifications
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
            Practical development background, professional roles, and verified technical credentials.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Experience Column */}
          <motion.div variants={staggerItemVariants} className="flex flex-col gap-6">
            <div className="text-2xl font-bold flex gap-3 items-center text-gray-900 border-b border-gray-200 pb-3">
              <span className="p-2 bg-orange-100 text-primary rounded-xl">
                <IconBriefcase2 size={24} />
              </span>
              <span>Work Experience</span>
            </div>

            <div className="flex flex-col gap-4">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    {exp.duration}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.label}</h3>
                  <div className="text-sm text-gray-600 font-medium mb-2">
                    {exp.company} • {exp.location}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certification / Education Column */}
          <motion.div variants={staggerItemVariants} className="flex flex-col gap-6">
            <div className="text-2xl font-bold flex gap-3 items-center text-gray-900 border-b border-gray-200 pb-3">
              <span className="p-2 bg-orange-100 text-primary rounded-xl">
                <IconSchool size={24} />
              </span>
              <span>Certifications</span>
            </div>

            <div className="flex flex-col gap-4">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    {edu.year}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.course}</h3>
                  <div className="text-sm text-gray-600 font-medium">
                    {edu.studyAt} • {edu.location}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
