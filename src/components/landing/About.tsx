"use client";
import React from "react";
import { IconCheck } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { staggerContainerVariants, staggerItemVariants } from "@/utils/motion";

export interface AboutProps {
  idPrefix?: string;
}

export default function About({ idPrefix }: AboutProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionId = idPrefix ? `${idPrefix}-about` : "about";

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

  const isOverlay = Boolean(idPrefix);

  return (
    <section id={sectionId} className="container mx-auto py-16 md:px-0 px-5">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainerVariants}
      >
        <motion.div variants={staggerItemVariants} className="roboto-slab-semibold">
          <div className="md:text-[2.5rem] sm:text-[2rem] text-[1.5rem] text-gray-700/50 font-bold sticky top-28">
            Besides, considering your <span className="text-primary">duty</span>, as a warrior you
            should not waver. Indeed, for a <span className="text-primary">warrior</span>, there is
            no better engagement than fighting for{" "}
            <span className="text-primary">upholding of righteousness</span>.
            <p className="text-2xl font-bold text-gray-700/50 mt-2">— BG 2.31</p>
          </div>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <div className="md:text-[2.5rem] text-3xl font-bold mb-4 text-gray-900">
            About Me
          </div>
          <div className="md:text-2xl text-xl text-gray-800 leading-relaxed">
            <p className="mb-4">
              Bringing life to code and building bridges between technology and user comfort! Hi,
              I&apos;m Ajay Kumar Maharjan, a full-stack JavaScript developer targeting the essence
              of innovation through my skills in MERN Stack. Born and raised in the tech heartbeat
              of Kathmandu, I currently enhance web applications with a flair for dynamic,
              user-centric solutions.
            </p>
            <p className="mb-6">
              Since commencing my educational journey in Information Management, I&apos;ve embraced
              every learning opportunity and technological challenge, turning them into stepping
              stones toward becoming an expert in my field. Throughout my career, my projects have
              not just been tasks, but adventures in creating impactful tech that addresses
              real-world needs.
            </p>
          </div>

          {/* What I Do Summary Card */}
          <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-6 sm:p-8 mt-6">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-gray-900 border-b border-orange-200/60 pb-3">
              Core Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {whatIDo.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-800">
                  <span className="p-1 bg-orange-500 text-white rounded-full shrink-0">
                    <IconCheck size={14} stroke={3} />
                  </span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
