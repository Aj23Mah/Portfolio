"use client";
import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils/helpers/imageUrlHandler";
import { projectData, socialLinks } from "@/utils/constrants/data";
import { motion, useReducedMotion } from "motion/react";
import { staggerContainerVariants, staggerItemVariants } from "@/utils/motion";

export interface WorkProps {
  idPrefix?: string;
}

export default function Work({ idPrefix }: WorkProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const sectionId = idPrefix ? `${idPrefix}-projects` : "projects";
  const isOverlay = Boolean(idPrefix);

  const githubUrl =
    socialLinks.find((item) => item.name.toLowerCase() === "github")?.route ||
    "https://github.com/Aj23Mah";

  return (
    <section
      id={sectionId}
      className="pt-2 sm:pt-4 pb-12 px-1 sm:px-3 bg-transparent text-gray-900 scroll-mt-20"
    >
      <motion.div
        className="max-w-2xl mx-auto text-center mb-8 sm:mb-10"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerItemVariants}
      >
        <h2 className="md:text-[2.25rem] text-3xl font-extrabold uppercase tracking-widest text-primary mb-2.5">
          SELECTED WORK
        </h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          A selection of projects where I’ve combined development,
          problem-solving, and thoughtful user experience to build useful
          digital products.
        </p>
      </motion.div>

      {/* Vertical Project Cards List */}
      <motion.div
        className="flex flex-col gap-8 max-w-2xl mx-auto"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainerVariants}
      >
        {projectData?.map((v: any, key: number) => {
          const indexNumber = v.number || String(key + 1).padStart(2, "0");

          return (
            <motion.article
              key={key}
              variants={staggerItemVariants}
              className="w-full rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-md border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col group/card"
            >
              {/* Full-width 16/9 Screenshot with subtle hover zoom & Live Demo overlay */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 rounded-t-2xl sm:rounded-t-3xl border-b border-gray-100">
                <a
                  href={v.link || v.github || "#"}
                  target={v.link || v.github ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block w-full h-full relative group/img cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500"
                  aria-label={`Open live demo for ${v.title}`}
                >
                  <Image
                    src={getImageUrl(v.image ?? "")}
                    alt={v.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                    className={`object-cover object-top transition-transform duration-500 ease-out ${
                      shouldReduceMotion ? "" : "group-hover/img:scale-[1.03]"
                    }`}
                    priority={key === 0}
                  />

                  {/* Hover Overlay with Live Demo badge */}
                  <div
                    className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <span
                      className={`px-3.5 py-1.5 rounded-full bg-white/95 text-gray-950 text-xs font-bold font-mono tracking-wider shadow-lg flex items-center gap-1.5 transition-transform duration-300 ${
                        shouldReduceMotion
                          ? ""
                          : "transform translate-y-2 group-hover/img:translate-y-0"
                      }`}
                    >
                      <span>Live Demo</span>
                      <span>↗</span>
                    </span>
                  </div>
                </a>

                {/* Top Badges: Featured (left) and Orange Index Number (right) */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  {v.featured ? (
                    <span className="px-2.5 py-1 rounded-full bg-orange-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md pointer-events-auto">
                      Featured
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-orange-200/70 text-orange-600 font-extrabold text-xs sm:text-sm font-mono tracking-widest shadow-sm pointer-events-auto">
                    {indexNumber}
                  </span>
                </div>
              </div>

              {/* Text & Content Column */}
              <div className="p-6 sm:p-7 flex flex-col gap-3.5">
                {/* Merged Category · Role row */}
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider">
                  <span className="font-bold text-orange-700 bg-orange-100/90 border border-orange-200/80 px-2.5 py-0.5 rounded-full">
                    {v.category || "WEB APPLICATION"}
                  </span>
                  {v.role && (
                    <>
                      <span className="text-gray-400 font-normal">·</span>
                      <span className="text-gray-600 font-semibold">{v.role}</span>
                    </>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                  {v.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {v.description}
                </p>

                {/* Technologies: at most 5 chips with +N overflow */}
                {v.technologies && v.technologies.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {v.technologies.slice(0, 5).map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1 bg-gray-100 border border-gray-200/90 text-gray-800 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {v.technologies.length > 5 && (
                      <span
                        className="text-xs font-bold px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-full"
                        title={v.technologies.slice(5).join(", ")}
                      >
                        +{v.technologies.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Button actions: Live Demo (filled orange) & View Code (ghost/outline navy) */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {v.link && (
                    <a
                      href={v.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-sm transition cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
                    >
                      <span>Live Demo</span>
                      <span>↗</span>
                    </a>
                  )}
                  {v.github && (
                    <a
                      href={v.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-transparent hover:bg-gray-900 border border-gray-800 text-gray-900 hover:text-white active:scale-95 font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer focus-visible:outline-2 focus-visible:outline-gray-800 focus-visible:outline-offset-2"
                    >
                      <span>View Code</span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Closing link to GitHub */}
      <div className="pt-8 pb-4 text-center">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-orange-600 transition tracking-wide group focus-visible:outline-2 focus-visible:outline-orange-500 rounded-lg px-3 py-1.5"
        >
          <span>More on GitHub</span>
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </a>
      </div>
    </section>
  );
}
