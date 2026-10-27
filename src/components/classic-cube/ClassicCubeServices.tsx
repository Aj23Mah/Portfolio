"use client";

import React from "react";
import Image from "next/image";
import CubeReveal from "./CubeReveal";
import CubeSectionHeader from "./CubeSectionHeader";
import { CUBE_PALETTE } from "./config";
import { serviceData } from "@/utils/constrants/data";
import { getImageUrl } from "@/utils/helpers/imageUrlHandler";

export default function ClassicCubeServices() {
  return (
    <section
      id="services"
      className="py-16 sm:py-20 px-6 sm:px-10 lg:px-16 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <CubeReveal direction="x" delayMs={50}>
          <CubeSectionHeader
            label="Face D · Bottom Face"
            title="WHAT I CAN DO"
            subtitle="From frontend architecture to scalable backend systems, I build all the pieces required for high-performing web platforms."
            accentColor={CUBE_PALETTE.yellow}
          />
        </CubeReveal>

        {/* 3x3 Style Grid of Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {serviceData?.map((v: any, key: number) => (
            <CubeReveal
              key={key}
              direction="y"
              delayMs={key * 60}
              className="h-full"
            >
              <div className="h-full relative group bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-7 border border-gray-200/90 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer">
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

                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            </CubeReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
