"use client";
import React from "react";
import "@/assets/css/Service.css";
import { getImageUrl } from "@/utils/helpers/imageUrlHandler";
import Image from "next/image";
import { serviceData } from "@/utils/constrants/data";
import { motion, useReducedMotion } from "motion/react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/utils/motion";

export default function Service() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="services" className="container mx-auto py-16 px-5">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerItemVariants}
      >
        <h2 className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-wider text-gray-900 mb-3">
          WHAT I CAN DO
        </h2>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          From frontend interfaces to backend systems, I build the pieces that
          turn an idea into a working digital product.
        </p>
      </motion.div>

      <motion.div
        className="parallex_setupItems"
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainerVariants}
      >
        {serviceData?.map((v: any, key: number) => (
          <motion.div
            key={key}
            variants={staggerItemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -3 }}
            transition={{ duration: 0.2 }}
            className="setUp_items relative group cursor-pointer"
          >
            {v.number && (
              <span className="absolute top-4 right-4 text-sm font-extrabold text-orange-600/70 tracking-widest">
                {v.number}
              </span>
            )}
            <Image
              src={getImageUrl(v.image ?? "")}
              alt={v.title}
              width={56}
              height={56}
              className="object-contain"
            />
            <h3 className="mt-4 font-bold text-xl text-gray-900">{v.title}</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
              {v.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
