"use client";

import React from "react";
import Image from "next/image";
import SectionShell from "./SectionShell";
import TiltCard from "./TiltCard";
import { ASSEMBLE_SECTIONS } from "./config";
import { projectData, socialLinks } from "@/utils/constrants/data";
import { getImageUrl } from "@/utils/helpers/imageUrlHandler";
import { IconBrandGithub, IconExternalLink, IconSparkles } from "@tabler/icons-react";

export default function AssembleProjects() {
  const section = ASSEMBLE_SECTIONS[3]; // Face R · Red · Projects

  const githubUrl =
    socialLinks.find((item) => item.name.toLowerCase() === "github")?.route ||
    "https://github.com/Aj23Mah";

  if (!projectData || projectData.length === 0) return null;

  const featuredProject = projectData[0];
  const otherProjects = projectData.slice(1);

  return (
    <SectionShell section={section}>
      <div className="flex flex-col gap-10">
        {/* 🔹 1. Heroic Full-Width Featured Project Card with Edge Breakout */}
        {featuredProject && (
          <div className="w-full">
            <TiltCard
              featured
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-red-200/90 shadow-xl overflow-hidden group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Info */}
                <div className="lg:col-span-6 flex flex-col items-start gap-4 order-2 lg:order-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200 shadow-2xs">
                      <IconSparkles size={14} />
                      <span>Featured Architecture</span>
                    </span>
                    <span className="text-xs font-mono font-extrabold text-gray-400">
                      #{featuredProject.number || "01"}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover:text-red-700 transition-colors">
                    {featuredProject.title}
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {featuredProject.description}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {featuredProject.technologies?.map((tech: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-red-50 text-red-800 border border-red-200/80 shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    {featuredProject.link && (
                      <a
                        href={featuredProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-red-500"
                      >
                        <IconExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {(featuredProject.github || githubUrl) && (
                      <a
                        href={featuredProject.github || githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-5 rounded-xl border border-gray-300 hover:border-red-600 text-gray-800 hover:text-red-700 bg-white transition text-xs font-semibold uppercase tracking-wider shadow-2xs flex items-center gap-2 cursor-pointer"
                      >
                        <IconBrandGithub size={16} />
                        <span>View Source</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: Breakout Screenshot */}
                <div className="lg:col-span-6 relative order-1 lg:order-2">
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-gray-200 shadow-md transform lg:translate-x-4 lg:-translate-y-2 lg:scale-105 group-hover:scale-108 transition-transform duration-500 ease-out">
                    <Image
                      src={getImageUrl(featuredProject.image ?? "")}
                      alt={featuredProject.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top"
                      priority
                    />
                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        )}

        {/* 🔹 2. Two-Column Grid for Remaining Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {otherProjects.map((project: any, key: number) => {
            const indexNumber = project.number || String(key + 2).padStart(2, "0");

            return (
              <TiltCard
                key={key}
                className="bg-white/95 backdrop-blur-md rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* 16:9 Image with Hover Live Demo Overlay */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 border-b border-gray-100">
                  <Image
                    src={getImageUrl(project.image ?? "")}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Hover "Live Demo" Overlay */}
                  <a
                    href={project.link || project.github || "#"}
                    target={project.link || project.github ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-red-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-mono font-bold text-xs uppercase tracking-wider"
                    aria-label={`Open demo for ${project.title}`}
                  >
                    <span>Launch Project</span>
                    <IconExternalLink size={16} />
                  </a>

                  {/* Corner Number */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[11px] font-mono font-extrabold text-gray-800 shadow-2xs border border-gray-200">
                    #{indexNumber}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors mb-2">
                      {project.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies?.map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-red-50 text-red-700 border border-red-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-auto">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <span>Demo</span>
                        <IconExternalLink size={14} />
                      </a>
                    )}
                    {(project.github || githubUrl) && (
                      <a
                        href={project.github || githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl border border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-700 transition text-xs font-semibold flex items-center gap-1.5"
                      >
                        <IconBrandGithub size={14} />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
