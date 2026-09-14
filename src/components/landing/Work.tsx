"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import useScrollPosition from "@/utils/hooks/useScrollPosition";
import { getImageUrl } from "@/utils/helpers/imageUrlHandler";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectData } from "@/utils/constrants/data";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const scrollPosition = useScrollPosition();
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray(".project-card");
    cards.forEach((card: any) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-20 px-5 md:px-[8vw] lg:px-[10vw] xl:px-[12vw] bg-gray-950 text-white dark project-bg"
    >
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="md:text-[2.5rem] text-3xl font-extrabold uppercase tracking-widest text-orange-500 mb-3">
          SELECTED WORK
        </h2>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          A selection of projects where I’ve combined development, problem-solving, and thoughtful user experience to build useful digital products.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {projectData?.map((v: any, key: number) => (
          <div
            key={key}
            className="sticky top-28 grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-3xl p-6 sm:p-8 lg:p-10 project-card bg-gray-900 border border-gray-800 shadow-2xl transition duration-300"
          >
            {/* Project Image Column */}
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-xl border border-gray-800 flex items-center justify-center bg-gray-950 order-1 lg:order-2">
              <Image
                src={getImageUrl(v.image ?? "")}
                alt={v.title}
                width={800}
                height={500}
                className="w-full h-auto max-h-[360px] object-cover rounded-2xl hover:scale-102 transition duration-500"
              />
            </div>

            {/* Project Content Column */}
            <div className="lg:col-span-6 flex flex-col justify-between order-2 lg:order-1">
              <div>
                {/* 1. PROJECT NAME */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  {v.title}
                </h3>

                {/* 2. CATEGORY */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-950/80 border border-orange-800/60 px-3 py-1 rounded-full">
                    {v.category || "WEB APPLICATION"}
                  </span>
                </div>

                {/* 3. DESCRIPTION */}
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                  {v.description}
                </p>

                {/* 4. ROLE */}
                {v.role && (
                  <div className="mb-4 bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      ROLE
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-orange-300">
                      {v.role}
                    </span>
                  </div>
                )}

                {/* 5. TECHNOLOGIES */}
                {v.technologies && v.technologies.length > 0 && (
                  <div className="mb-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      TECHNOLOGIES
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {v.technologies.map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs font-semibold px-3 py-1 bg-gray-800 border border-gray-700 text-orange-300 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 6. LIVE DEMO / VIEW CODE */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {v.link && (
                  <a
                    href={v.link}
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-2.5 px-5 rounded-xl font-bold transition shadow-md text-xs sm:text-sm uppercase tracking-wider"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LIVE DEMO →
                  </a>
                )}
                {v.github && (
                  <a
                    href={v.github}
                    className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-5 rounded-xl font-bold transition border border-gray-700 text-xs sm:text-sm uppercase tracking-wider"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    VIEW CODE →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Transition CTA Banner */}
      <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white rounded-3xl p-8 sm:p-10 text-center shadow-2xl border border-gray-800">
        <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider mb-3 text-orange-400">
          HAVE A PROJECT IN MIND?
        </h3>
        <p className="text-gray-300 text-base sm:text-lg mb-6 max-w-xl mx-auto">
          Let's create something useful, reliable, and worth using.
        </p>
        <button
          onClick={() => {
            const el = document.getElementById("contact");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition transform hover:scale-105 uppercase text-xs sm:text-sm tracking-wider"
        >
          GET IN TOUCH →
        </button>
      </div>
    </section>
  );
}
