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
    const cards = gsap.utils.toArray(".project-card"); // Select all cards with this class
    cards.forEach((card: any) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 }, // Start: transparent and slightly below
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card, // Animate when this card enters the viewport
            start: "top 80%", // Start animation when the top of the card hits 80% of the viewport
            end: "top 60%", // Animation ends when the top hits 60%
            toggleActions: "play none none none", // Play animation only once
          },
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Clean up
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`py-10 px-5 md:px-[15vw] lg:px-[10vw] xl:px-[15vw] text-black project-bg ${
        scrollPosition > 1950
          ? "dark text-white"
          : "blur-none md:backdrop-blur-md md:blur-md"
      }`}
    >
      <div className="text-2xl text-center mb-4">Explore Latest Work</div>
      <div className="md:text-[2.5rem] text-3xl font-bold text-center mb-6">
        Project
      </div>

      <div>
        {projectData?.map((v: any, key: number) => (
          <div
            key={key}
            className={`sticky top-36 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 rounded-3xl p-10   
                        project-card ${scrollPosition > 1950 ? "project-card" : "bg-white text-black"}
                       `}
          >
            <div className={"col-span-1"}>
              <div className="text-2xl font-bold mb-2">{v.title}</div>
              <div
                className={"text-lg"}
                dangerouslySetInnerHTML={{ __html: v.description }}
              />
              <div className={"mt-6 flex flex-wrap gap-3"}>
                {v.link && (
                  <a
                    href={v.link}
                    className="inline-flex items-center gap-1.5 bg-orange-600 text-white py-2 px-4 rounded-xl hover:bg-orange-700 font-bold transition shadow-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Demo
                  </a>
                )}
                <a
                  href={v.github || "https://github.com/Aj23Mah"}
                  className="inline-flex items-center gap-1.5 bg-gray-400 text-black py-2 px-4 rounded-xl hover:bg-gray-300 font-bold transition border border-black/20"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Code
                </a>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden col-span-1">
              <Image
                src={getImageUrl(v.image ?? "")}
                alt={v.title}
                width={800}
                height={800}
                style={{ width: "100%", backgroundSize: "cover" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
