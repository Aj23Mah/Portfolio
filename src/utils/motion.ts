import { Variants } from "motion/react";

// Standard Easing curves
export const easeOutCubic = [0.215, 0.61, 0.355, 1];
export const easeOutQuart = [0.165, 0.84, 0.44, 1];

// Hero Stagger Container
export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Hero Item Reveal
export const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOutCubic,
    },
  },
};

// Section Reveal Variants (Scroll-triggered)
export const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOutQuart,
    },
  },
};

// Stagger Container for Lists (Services, Tools, Projects)
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Stagger Item Variant
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOutCubic,
    },
  },
};

// Button Micro-interactions
export const buttonHoverVariants = {
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1 },
  },
};

// Arrow icon hover animation variant
export const arrowHoverVariants = {
  rest: { x: 0 },
  hover: { x: 5, transition: { duration: 0.2, ease: "easeOut" } },
};
