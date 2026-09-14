"use client";
import React from "react";
import { IconBriefcase2, IconSchool, IconCheck } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/utils/motion";

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  const experiences = [
    {
      label: "Junior JS Developer",
      company: "Next In Tech Pvt Ltd",
      duration: "Sep 2024 – Present",
      location: "Tahachal, Kathmandu",
    },
    {
      label: "Internship (Full Stack JS)",
      company: "Krafters Technology",
      duration: "Mar 2024 – Aug 2024 (6 Months)",
      location: "Kumaripati, Lalitpur",
    },
  ];

  const education = [
    {
      studyAt: "Krafters Technology",
      location: "Kumaripati, Lalitpur",
      course: "Full Stack JS Development Certification",
      year: "2024",
    },
  ];

  const whatIDo = [
    "Full-Stack Web Development",
    "REST API Development",
    "Database Design & Management",
    "Frontend Development",
    "Backend Development",
    "Testing & Debugging",
    "API Integration",
    "Responsive Web Design",
  ];

  return (
    <section id="about" className="container mx-auto py-16 md:px-0 px-5">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainerVariants}
      >
        {/* Left Column: About Copy & Philosophy */}
        <motion.div variants={staggerItemVariants} className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <h2 className="md:text-[2.5rem] text-3xl font-bold uppercase tracking-wider mb-6 text-gray-900">
              ABOUT ME
            </h2>
            
            <p className="text-xl sm:text-2xl font-semibold text-orange-700 leading-snug mb-6">
              I’m a Full-Stack Developer who enjoys turning complex problems into simple, reliable, and intuitive digital experiences.
            </p>

            <div className="text-gray-700 text-base sm:text-lg leading-relaxed space-y-4 mb-8">
              <p>
                I work across the frontend and backend to build complete web applications — from designing responsive interfaces and developing APIs to structuring databases and integrating the systems that power them.
              </p>
              <p>
                I care about more than just making things work. I focus on writing maintainable code, creating smooth user experiences, and building products that are practical, scalable, and easy to use.
              </p>
              <p className="font-bold text-gray-900 italic border-l-4 border-orange-600 pl-4 py-1 text-lg">
                "For me, good development is where clean engineering meets thoughtful design."
              </p>
            </div>
          </div>

          {/* 🔹 Secondary Philosophy Quote */}
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm mt-4">
            <div className="roboto-slab-semibold text-gray-800 text-base sm:text-lg leading-relaxed">
              Besides, considering your <span className="text-orange-700 font-bold">duty</span>, as a warrior you should not waver. Indeed, for a <span className="text-orange-700 font-bold">warrior</span>, there is no better engagement than fighting for <span className="text-orange-700 font-bold">upholding of righteousness</span>.
              <p className="text-sm font-bold text-gray-500 mt-2">— BG 2.31</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Skill Summary & Career Timeline */}
        <motion.div variants={staggerItemVariants} className="lg:col-span-5 flex flex-col gap-8">
          {/* WHAT I DO Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-5 text-gray-900 border-b pb-3">
              WHAT I DO
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {whatIDo.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-800">
                  <span className="p-1 bg-orange-100 text-orange-600 rounded-full shrink-0">
                    <IconCheck size={14} stroke={3} />
                  </span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div>
            <div className="text-2xl font-bold flex gap-2 items-center mb-4 text-gray-900">
              <IconBriefcase2 className="text-orange-600" size={28} />
              <span>Experience</span>
            </div>
            <div className="flex flex-col gap-3">
              {experiences.map((exp, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">
                    {exp.duration}
                  </div>
                  <div className="text-lg font-bold text-gray-900">{exp.label}</div>
                  <p className="text-sm text-gray-600">
                    {exp.company} • {exp.location}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certificates */}
          <div>
            <div className="text-2xl font-bold flex gap-2 items-center mb-4 text-gray-900">
              <IconSchool className="text-orange-600" size={28} />
              <span>Certificates</span>
            </div>
            <div className="flex flex-col gap-3">
              {education.map((edu, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">
                    {edu.year}
                  </div>
                  <div className="text-lg font-bold text-gray-900">{edu.course}</div>
                  <p className="text-sm text-gray-600">
                    {edu.studyAt} • {edu.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
