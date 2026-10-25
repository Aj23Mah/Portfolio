"use client";
import React from "react";
import "@/assets/css/Service.css";
import { getImageUrl } from "@/utils/helpers/imageUrlHandler";
import Image from "next/image";
import { serviceData } from "@/utils/constrants/data";
import { motion, useReducedMotion } from "motion/react";
import { staggerContainerVariants, staggerItemVariants } from "@/utils/motion";

export interface ServiceProps {
  idPrefix?: string;
}

export default function Service({ idPrefix }: ServiceProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const sectionId = idPrefix ? `${idPrefix}-services` : "services";

  const isOverlay = Boolean(idPrefix);

  return (
    <section id={sectionId} className="container mx-auto py-16 px-5">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerItemVariants}
      >
        <h2 className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-wider text-gray-900 mb-3">
          WHAT I CAN DO
        </h2>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
          From frontend interfaces to backend systems, I build the pieces that
          turn an idea into a working digital product.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        initial={isOverlay || shouldReduceMotion ? "visible" : "hidden"}
        animate={isOverlay ? "visible" : undefined}
        whileInView={isOverlay ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainerVariants}
      >
        {serviceData?.map((v: any, key: number) => (
          <motion.div
            key={key}
            variants={staggerItemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -3 }}
            transition={{ duration: 0.2 }}
            className="relative group cursor-pointer bg-white/85 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                {v.image && (
                  <div className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center p-2.5 transition-transform duration-200 group-hover:scale-105">
                    <Image
                      src={getImageUrl(v.image ?? "")}
                      alt={v.title}
                      width={48}
                      height={48}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                )}
                {v.number && (
                  <span className="text-xs font-mono font-extrabold text-orange-600 tracking-widest bg-orange-50/80 px-2.5 py-1 rounded-full border border-orange-200/60">
                    {v.number}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-orange-700 transition-colors">
                {v.title}
              </h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                {v.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
