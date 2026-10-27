"use client";

import React from "react";
import Image from "next/image";
import SectionShell from "./SectionShell";
import TiltCard from "./TiltCard";
import { ASSEMBLE_SECTIONS } from "./config";
import { serviceData } from "@/utils/constrants/data";
import { getImageUrl } from "@/utils/helpers/imageUrlHandler";

export default function AssembleServices() {
  const section = ASSEMBLE_SECTIONS[4]; // Face D · Sunflower Yellow · Services

  // Stagger offsets for alternating vertical rhythm
  const getOffsetClass = (idx: number) => {
    const col = idx % 3;
    if (col === 1) return "lg:translate-y-8";
    if (col === 2) return "lg:translate-y-16";
    return "lg:translate-y-0";
  };

  return (
    <SectionShell section={section} className="pb-28">
      {/* 🔹 Staggered / Offset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
        {serviceData?.map((item: any, key: number) => {
          const numberStr = item.number || String(key + 1).padStart(2, "0");
          const offsetClass = getOffsetClass(key);

          return (
            <div key={key} className={`transition-transform duration-300 ${offsetClass}`}>
              <TiltCard className="relative bg-white/95 backdrop-blur-md rounded-3xl p-7 border border-amber-200/80 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between h-full group overflow-hidden">
                {/* 🔹 Large Faded Watermark Number (01-06) Behind Card Title */}
                <span
                  className="absolute -top-4 right-4 text-7xl sm:text-8xl font-black font-mono text-amber-500/15 pointer-events-none select-none transition-transform duration-300 group-hover:scale-105 group-hover:text-amber-500/25"
                  aria-hidden="true"
                >
                  {numberStr}
                </span>

                <div className="relative z-10">
                  {/* Service Icon */}
                  {item.image && (
                    <div className="w-14 h-14 rounded-2xl bg-amber-100/90 border border-amber-200 flex items-center justify-center p-3 mb-5 transition-transform duration-200 group-hover:scale-110 shadow-2xs">
                      <Image
                        src={getImageUrl(item.image ?? "")}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-bold text-xl sm:text-2xl text-gray-900 group-hover:text-amber-700 transition-colors mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Section: Delivery Focus */}
                <div className="pt-6 mt-6 border-t border-amber-100/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                    Production Ready
                  </span>
                  <span className="text-xs font-mono font-extrabold text-gray-400">
                    Phase {key + 1}
                  </span>
                </div>
              </TiltCard>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
