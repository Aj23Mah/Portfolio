"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { sectionRevealVariants } from "@/utils/motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({
  children,
  id,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            delay: delay,
            ease: [0.165, 0.84, 0.44, 1],
          },
        },
      }}
    >
      {children}
    </motion.section>
  );
}
