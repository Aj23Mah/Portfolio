"use client";

import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { ASSEMBLE_CONFIG } from "./config";

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  maxTiltDeg?: number;
  highlightIntensity?: number;
  as?: React.ElementType;
}

export default function TiltCard({
  children,
  className = "",
  featured = false,
  maxTiltDeg = ASSEMBLE_CONFIG.cardTiltMaxDeg,
  highlightIntensity = 0.18,
  as: Component = "div",
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [canTilt, setCanTilt] = useState(false);
  const [transform, setTransform] = useState("");
  const [highlightPos, setHighlightPos] = useState({ x: 50, y: 50, opacity: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanTilt(!isTouch && !prefersReducedMotion);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xNorm = (x / rect.width - 0.5) * 2; // -1 to 1
    const yNorm = (y / rect.height - 0.5) * 2; // -1 to 1

    const rotX = -yNorm * maxTiltDeg;
    const rotY = xNorm * maxTiltDeg;

    setTransform(
      `perspective(${ASSEMBLE_CONFIG.cardPerspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(6px)`
    );
    setHighlightPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: highlightIntensity,
    });
  };

  const handleMouseLeave = () => {
    if (!canTilt) return;
    setTransform(
      `perspective(${ASSEMBLE_CONFIG.cardPerspective}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`
    );
    setHighlightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  const shadowClass = featured
    ? "shadow-lg hover:shadow-2xl ring-1 ring-orange-500/20"
    : "shadow-2xs hover:shadow-md";

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform || undefined,
        transformStyle: canTilt ? "preserve-3d" : undefined,
        transition: transform ? "transform 120ms ease-out" : "transform 350ms ease",
        ...props.style,
      }}
      className={`relative transition-shadow duration-300 ${shadowClass} ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic Moving Sheen Highlight */}
      {canTilt && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle 280px at ${highlightPos.x}% ${highlightPos.y}%, rgba(255, 255, 255, ${highlightPos.opacity}), transparent 75%)`,
            opacity: highlightPos.opacity > 0 ? 1 : 0,
          }}
        />
      )}
    </Component>
  );
}
