import React from "react";
import { CubeColor } from "./config";

export interface CubeSectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  accentColor: CubeColor;
  className?: string;
}

/**
 * CubeSectionHeader Component
 * 
 * Consistent section heading featuring a small Rubik's cube sticker accent square
 * and subtle colored accent bar in the section's designated cube color.
 */
export default function CubeSectionHeader({
  label,
  title,
  subtitle,
  accentColor,
  className = "",
}: CubeSectionHeaderProps) {
  return (
    <div className={`max-w-3xl mx-auto text-center mb-10 sm:mb-12 ${className}`}>
      {/* Category / Section tag with colored cube sticker accent */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/90 shadow-2xs mb-3">
        <span
          style={{
            backgroundColor: accentColor.hex,
            borderColor: accentColor.border || "#151518",
          }}
          className="w-2.5 h-2.5 rounded-[3px] border shadow-2xs shrink-0"
          aria-hidden="true"
        />
        <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-gray-700 font-bold">
          {label}
        </span>
      </div>

      {/* Primary Section Title */}
      <h2 className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-widest text-primary mb-3">
        {title}
      </h2>

      {/* Subtitle / intro line */}
      {subtitle && (
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
