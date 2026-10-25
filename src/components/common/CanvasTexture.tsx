import React from "react";

export interface CanvasTextureProps {
  className?: string;
  opacity?: number;
  fixed?: boolean;
}

/**
 * Shared CanvasTexture component that applies the portfolio's paper/canvas texture.
 * Reuses /image/paper-texture.webp across the Hero, Classic sections, and the slide-in drawer.
 */
export default function CanvasTexture({
  className = "",
  opacity = 0.6,
  fixed = false,
}: CanvasTextureProps) {
  return (
    <div
      aria-hidden="true"
      className={`canvas-texture absolute inset-0 pointer-events-none select-none z-0 ${
        fixed ? "bg-fixed" : ""
      } ${className}`}
      style={{
        opacity,
      }}
    />
  );
}
