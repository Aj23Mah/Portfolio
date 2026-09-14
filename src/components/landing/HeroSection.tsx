"use client";
import React from "react";
import "@/assets/css/TypingAnimation.css";
import { TypeAnimation } from "react-type-animation";
import { motion, useReducedMotion } from "motion/react";
import {
  heroContainerVariants,
  heroItemVariants,
} from "@/utils/motion";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="w-full min-h-[85vh] flex items-center justify-center container mx-auto px-5 py-16"
    >
      <motion.div
        className="max-w-4xl text-center"
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate="visible"
        variants={heroContainerVariants}
      >
        {/* Step 1: Small Intro */}
        <motion.div
          variants={heroItemVariants}
          className="font-bold text-orange-700 uppercase tracking-widest text-xs sm:text-sm mb-3"
        >
          HELLO, I'M
        </motion.div>

        {/* Step 1 (cont.): Name Reveal */}
        <motion.div
          variants={heroItemVariants}
          className="text-4xl sm:text-6xl md:text-8xl text-center font-medium my-4"
        >
          <div className="relative z-10 smooch"> Ajay Kumar </div>
          <div className="relative text-3xl sm:text-4xl text-orange-700 uppercase mt-[-8px] tracking-widest">
            Maharjan
          </div>
        </motion.div>

        {/* Step 2: Professional Title with TypeAnimation */}
        <motion.div
          variants={heroItemVariants}
          className="flex gap-2 items-center justify-center mb-4"
        >
          <TypeAnimation
            sequence={[
              "Full-Stack JS Developer",
              1000,
              "Software Developer",
              1000,
            ]}
            wrapper="span"
            speed={20}
            style={{ fontSize: "2em", display: "inline-block" }}
            repeat={Infinity}
          />
        </motion.div>

        {/* Step 3: Supporting Description */}
        <motion.p
          variants={heroItemVariants}
          className="max-w-3xl mx-auto text-gray-700 text-lg sm:text-xl font-normal leading-relaxed mb-10"
        >
          I build modern, scalable, and user-focused web applications that turn
          ideas into reliable digital products.
        </motion.p>

        {/* Step 4: Hero CTAs with Motion Micro-interactions */}
        <motion.div
          variants={heroItemVariants}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <motion.button
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            onClick={() => {
              const el = document.getElementById("projects");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3.5 px-7 sm:px-9 rounded-full shadow-lg transition duration-200 tracking-wider text-xs sm:text-sm uppercase ring-2 ring-orange-500/20 cursor-pointer"
          >
            VIEW MY WORK
          </motion.button>
          <motion.button
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            onClick={() => {
              const el = document.getElementById("contact");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-transparent hover:bg-gray-200/60 text-gray-700 font-medium py-3.5 px-6 rounded-full border border-gray-400/80 transition duration-200 tracking-wider text-xs sm:text-sm uppercase cursor-pointer"
          >
            DOWNLOAD RESUME ↓
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
