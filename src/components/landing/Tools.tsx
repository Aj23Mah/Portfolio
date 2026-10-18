"use client";
import React from "react";
import htmlLogo from "../../../public/image/html-logo.png";
import cssLogo from "../../../public/image/css-logo.png";
import reactLogo from "../../../public/image/React_logo.webp";
import jsLogo from "../../../public/image/JS-logo.png";
import nodeLogo from "../../../public/image/node-logo.png";
import nestLogo from "../../../public/image/Nest-logo.webp";
import nextLogo from "../../../public/image/Next-logo.webp";
import postgreLogo from "../../../public/image/postgresql-logo.png";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/utils/motion";

export interface ToolsProps {
  idPrefix?: string;
}

export default function Tools({ idPrefix }: ToolsProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const sectionId = idPrefix ? `${idPrefix}-skills` : "tools";

  const items = [
    { name: "HTML5", img: htmlLogo },
    { name: "CSS3", img: cssLogo },
    { name: "JavaScript", img: jsLogo },
    { name: "React", img: reactLogo },
    { name: "Next.js", img: nextLogo },
    { name: "Node.js", img: nodeLogo },
    { name: "NestJS", img: nestLogo },
    { name: "PostgreSQL", img: postgreLogo },
  ];

  const isOverlay = Boolean(idPrefix);

  return (
    <section id={sectionId} className="container mx-auto py-16 sm:px-0 px-5">
      <motion.div
        className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-wider text-center mb-8 text-gray-900"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerItemVariants}
      >
        TOOLS & TECHNOLOGIES
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 justify-center gap-5"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainerVariants}
      >
        {items.map((v, key) => (
          <motion.div
            key={key}
            variants={staggerItemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            transition={{ duration: 0.2 }}
            className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-3 group cursor-pointer"
          >
            <div className="w-12 h-12 flex items-center justify-center transition group-hover:scale-105">
              <Image
                src={v.img}
                alt={v.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-600 transition">
              {v.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
