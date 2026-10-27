"use client";

import React from "react";
import CubeReveal from "./CubeReveal";
import CubeSectionHeader from "./CubeSectionHeader";
import { CUBE_PALETTE } from "./config";
import { socialLinks } from "@/utils/constrants/data";
import ClassicContactForm from "@/components/landing/ClassicContactForm";
import { IconMail, IconMapPin } from "@tabler/icons-react";

export default function ClassicCubeContact() {
  return (
    <section
      id="contact"
      className="py-16 sm:py-20 px-6 sm:px-10 lg:px-16 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <CubeReveal direction="x" delayMs={50}>
          <CubeSectionHeader
            label="Face B · Back Face"
            title="LET'S BUILD SOMETHING"
            subtitle="Have an idea, a project, or a problem that needs solving? I’d love to hear about it."
            accentColor={CUBE_PALETTE.blue}
          />
        </CubeReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* Contact Details Card */}
          <CubeReveal direction="x" delayMs={100} className="h-full">
            <div className="h-full bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/90 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wider text-gray-900 mb-6 border-b border-gray-100 pb-3">
                  CONTACT DETAILS
                </h3>

                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shrink-0">
                    <IconMail size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">
                      EMAIL
                    </h4>
                    <a
                      href="mailto:ajaymaharjan758@gmail.com"
                      className="text-base sm:text-lg font-bold text-gray-900 hover:text-orange-600 transition"
                    >
                      ajaymaharjan758@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-8">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shrink-0">
                    <IconMapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">
                      LOCATION
                    </h4>
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      Kathmandu, Nepal
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-3">
                  CONNECT SOCIALLY
                </h4>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.route}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl transition-all duration-200 w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-orange-600 hover:text-white bg-gray-100 shadow-2xs hover:shadow-xs focus-visible:outline-2 focus-visible:outline-orange-500"
                      title={s.name}
                    >
                      {s.icons}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </CubeReveal>

          {/* Interactive Form Card */}
          <CubeReveal direction="y" delayMs={140} className="h-full">
            <div className="h-full bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/90">
              <ClassicContactForm />
            </div>
          </CubeReveal>
        </div>
      </div>
    </section>
  );
}
