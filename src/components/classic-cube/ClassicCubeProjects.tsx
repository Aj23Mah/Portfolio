"use client";

import React from "react";
import Image from "next/image";
import CubeReveal from "./CubeReveal";
import CubeSectionHeader from "./CubeSectionHeader";
import { CUBE_PALETTE } from "./config";
import { projectData, socialLinks } from "@/utils/constrants/data";
import { getImageUrl } from "@/utils/helpers/imageUrlHandler";

export default function ClassicCubeProjects() {
  const githubUrl =
    socialLinks.find((item) => item.name.toLowerCase() === "github")?.route ||
    "https://github.com/Aj23Mah";

  return (
    <section
      id="projects"
      className="py-16 sm:py-20 px-6 sm:px-10 lg:px-16 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <CubeReveal direction="x" delayMs={50}>
          <CubeSectionHeader
            label="Face R · Right Face"
            title="SELECTED WORK"
            subtitle="Full-stack web applications, platforms, and interactive interfaces built for real users."
            accentColor={CUBE_PALETTE.red}
          />
        </CubeReveal>

        {/* Vertical Project Cards Stack */}
        <div className="flex flex-col gap-10 mt-8">
          {projectData?.map((v: any, key: number) => {
            const indexNumber = v.number || String(key + 1).padStart(2, "0");

            return (
              <CubeReveal
                key={key}
                direction="y"
                delayMs={key * 90}
                as="article"
                className="w-full rounded-3xl bg-white/90 backdrop-blur-md border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* 16:9 Screenshot on top with subtle hover effect */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 rounded-t-3xl border-b border-gray-100">
                  <a
                    href={v.link || v.github || "#"}
                    target={v.link || v.github ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block w-full h-full relative cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500"
                    aria-label={`Open demo for ${v.title}`}
                  >
                    <Image
                      src={getImageUrl(v.image ?? "")}
                      alt={v.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                      className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      priority={key === 0}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <span className="px-4 py-2 rounded-full bg-white text-gray-950 text-xs font-bold font-mono tracking-wider shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <span>Live Demo</span>
                        <span>↗</span>
                      </span>
                    </div>
                  </a>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    {v.featured ? (
                      <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md pointer-events-auto">
                        Featured
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-orange-200 text-orange-600 font-extrabold text-xs sm:text-sm font-mono tracking-widest shadow-sm pointer-events-auto">
                      {indexNumber}
                    </span>
                  </div>
                </div>

                {/* Text Content Below */}
                <div className="p-6 sm:p-8 flex flex-col gap-4">
                  {/* Category · Role */}
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider">
                    <span className="font-bold text-orange-700 bg-orange-100/90 border border-orange-200/80 px-2.5 py-0.5 rounded-full">
                      {v.category || "WEB APPLICATION"}
                    </span>
                    {v.role && (
                      <>
                        <span className="text-gray-400 font-normal">·</span>
                        <span className="text-gray-600 font-semibold">
                          {v.role}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                    {v.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {v.description}
                  </p>

                  {/* Tech stack: 5 max + overflow chip */}
                  {v.technologies && v.technologies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {v.technologies
                        .slice(0, 5)
                        .map((tech: string, i: number) => (
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

                  {/* Actions: Live Demo (filled orange) & View Code (outlined) */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    {v.link && (
                      <a
                        href={v.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500"
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
                        className="inline-flex items-center gap-2 bg-transparent hover:bg-gray-900 border border-gray-800 text-gray-900 hover:text-white active:scale-95 font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer focus-visible:outline-2 focus-visible:outline-gray-800"
                      >
                        <span>View Code</span>
                        <span>→</span>
                      </a>
                    )}
                  </div>
                </div>
              </CubeReveal>
            );
          })}
        </div>

        {/* GitHub Link */}
        <div className="pt-10 pb-4 text-center">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-orange-600 transition tracking-wide group focus-visible:outline-2 focus-visible:outline-orange-500 rounded-lg px-3 py-1.5"
          >
            <span>Explore more repositories on GitHub</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
