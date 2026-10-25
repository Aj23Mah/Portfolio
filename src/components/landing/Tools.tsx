"use client";
import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/utils/motion";
import { toolsList } from "@/utils/constrants/data";

export interface ToolsProps {
  idPrefix?: string;
}

export default function Tools({ idPrefix }: ToolsProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const sectionId = idPrefix ? `${idPrefix}-skills` : "tools";

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
        {toolsList.map((v, key) => (
          <motion.div
            key={key}
            variants={staggerItemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            transition={{ duration: 0.2 }}
            className="bg-white/85 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-3 group cursor-pointer"
          >
            <div className="w-12 h-12 flex items-center justify-center transition group-hover:scale-105">
              <Image
                src={v.img}
                alt={v.name}
                width={64}
                height={64}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:text-orange-600 transition">
              {v.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
