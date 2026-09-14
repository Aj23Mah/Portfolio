"use client";
import "@/assets/css/TypingAnimation.css";
import { TypeAnimation } from "react-type-animation";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="w-full min-h-[85vh] flex items-center justify-center container mx-auto px-5 py-16"
    >
      <div className="max-w-4xl text-center">
        <div className="font-bold text-orange-700 uppercase tracking-widest text-xs sm:text-sm mb-3 motion-blur-in-[10px] motion-duration-[0.8s]">
          HELLO, I'M
        </div>
        <div className="text-4xl sm:text-6xl md:text-8xl text-center font-medium my-4 motion-preset-pop motion-blur-in-[15px] motion-duration-[1s] motion-duration-[1s]/translate">
          <div className={"relative z-10 smooch"}> Ajay Kumar </div>
          <div
            className={
              "relative text-3xl sm:text-4xl text-orange-700 uppercase mt-[-8px] tracking-widest"
            }
          >
            {" "}
            Maharjan
          </div>
        </div>
        {/* <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 tracking-tight leading-none uppercase mb-4 roboto-slab-semibold motion-preset-pop">
                    AJAY KUMAR MAHARJAN
                </h1> */}
        <div className="flex gap-2 items-center justify-center mb-4">
          <TypeAnimation
            sequence={[
              "Full-Stack JS Developer",
              1000,
              "Software Developer",
              1000,
            ]}
            wrapper="span"
            speed={20}
            style={{ fontSize: "2em", display: "inline-block" }}
            repeat={Infinity}
          />
        </div>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg sm:text-xl font-normal leading-relaxed mb-10">
          I build modern, scalable, and user-focused web applications that turn
          ideas into reliable digital products.
        </p>

        {/* 🔹 Hero CTAs - Visual Hierarchy: Primary (View My Work) -> Secondary (Let's Talk) -> Tertiary (Download Resume) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              const el = document.getElementById("projects");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3.5 px-7 sm:px-9 rounded-full shadow-lg transition duration-300 transform hover:scale-105 tracking-wider text-xs sm:text-sm uppercase ring-2 ring-orange-500/20"
          >
            VIEW MY WORK
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("contact");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-transparent hover:bg-gray-200/60 text-gray-700 font-medium py-3.5 px-6 rounded-full border border-gray-400/80 transition duration-300 transform hover:scale-105 tracking-wider text-xs sm:text-sm uppercase"
          >
            DOWNLOAD RESUME ↓
          </button>
        </div>
      </div>
    </section>
  );
}
