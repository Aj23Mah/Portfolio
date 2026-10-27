"use client";

import React, { useEffect, useRef, useState } from "react";
import { ANIMATION_CONFIG } from "./config";

export interface CubeRevealProps {
  children: React.ReactNode;
  as?: "div" | "article" | "section" | "li";
  direction?: "x" | "y";
  delayMs?: number;
  className?: string;
  angleDeg?: number;
  threshold?: number;
}

/**
 * CubeReveal Component
 * 
 * Provides subtle 3D Rubik's cube tile-flip entrance reveals using pure CSS transforms
 * and an IntersectionObserver. Respects prefers-reduced-motion and progressive enhancement
 * (starts 100% visible, applies initial transforms only via JS observer).
 */
export default function CubeReveal({
  children,
  as: Component = "div",
  direction = "x",
  delayMs = 0,
  className = "",
  angleDeg = ANIMATION_CONFIG.tileRotateDeg,
  threshold = ANIMATION_CONFIG.observerThreshold,
}: CubeRevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isObserving, setIsObserving] = useState(false);

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setHasTriggered(true);
        return;
      }
    }

    // 2. Check IntersectionObserver support
    if (!("IntersectionObserver" in window)) {
      setHasTriggered(true);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    // Element is now verified to have JS & observer available
    setIsObserving(true);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setHasTriggered(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // CSS Styles:
  // Before observation/without JS: natural layout (visible).
  // Once observer active but not yet intersecting: rotated by angleDeg and lower opacity.
  // Once intersecting: smooth flip back to 0deg and full opacity.
  const isHiddenState = isObserving && !hasTriggered;

  const transformStyle = isHiddenState
    ? direction === "x"
      ? `perspective(800px) rotateX(${angleDeg}deg) translateY(16px)`
      : `perspective(800px) rotateY(${angleDeg}deg) translateX(16px)`
    : "perspective(800px) rotateX(0deg) rotateY(0deg) translate(0px, 0px)";

  const style: React.CSSProperties = {
    opacity: isHiddenState ? 0 : 1,
    transform: transformStyle,
    transitionProperty: "opacity, transform",
    transitionDuration: `${ANIMATION_CONFIG.tileFlipDurationMs}ms`,
    transitionDelay: `${delayMs}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: isHiddenState ? "transform, opacity" : "auto",
  };

  return (
    <Component
      ref={elementRef as any}
      style={style}
      className={`cube-reveal-item ${className}`}
    >
      {children}
    </Component>
  );
}
