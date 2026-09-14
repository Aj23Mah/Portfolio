"use client";
import { useState } from "react";
import { socialLinks } from "@/utils/constrants/data";

export default function Footer() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <footer className="py-8 container mx-auto px-5">
      <div className={"text-black grid justify-items-center"}>
        <div className="flex gap-4">
          {socialLinks.map((item: any, key: number) => (
            <a
              key={key}
              href={item.route}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIndex(key)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                backgroundColor: hoveredIndex === key ? item.color : "transparent",
              }}
              className={`p-2 rounded-full mb-2 cursor-pointer h-[42px] w-[42px] transition-all duration-300 flex items-center justify-center ${
                hoveredIndex === key ? "text-white" : "text-black"
              }`}
            >
              {item.icons}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 text-gray-500 pt-4 border-t border-gray-200">
          © {new Date().getFullYear()} <span className="text-black font-semibold">Ajay Kumar Maharjan.</span> All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
