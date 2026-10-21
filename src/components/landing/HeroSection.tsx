"use client";
import React from "react";
import Image from "next/image";
import "@/assets/css/TypingAnimation.css";
import { TypeAnimation } from "react-type-animation";
import CubeWrapper from "@/components/cube/CubeWrapper";
import { useViewMode } from "@/context/ViewModeContext";
import { isLowPowerGated } from "@/utils/lowPowerGate";

export default function HeroSection() {
  const { mode, toggleMode } = useViewMode();
  const [showPaperTexture, setShowPaperTexture] = React.useState(false);
  const [isGated, setIsGated] = React.useState(false);
  const [cubeLoaded, setCubeLoaded] = React.useState(false);
  const [firstFrameRendered, setFirstFrameRendered] = React.useState(false);

  React.useEffect(() => {
    setIsGated(isLowPowerGated());

    const onFirstFrame = () => {
      setFirstFrameRendered(true);
    };
    window.addEventListener("cube:first-frame", onFirstFrame, { once: true });

    // Restore paper texture after first paint without impacting initial FCP
    if (typeof window !== "undefined") {
      const schedule =
        "requestIdleCallback" in window
          ? (window as any).requestIdleCallback(() => setShowPaperTexture(true))
          : setTimeout(() => setShowPaperTexture(true), 200);
      return () => {
        window.removeEventListener("cube:first-frame", onFirstFrame);
        if ("cancelIdleCallback" in window && typeof schedule === "number") {
          (window as any).cancelIdleCallback(schedule);
        } else {
          clearTimeout(schedule);
        }
      };
    }

    return () => {
      window.removeEventListener("cube:first-frame", onFirstFrame);
    };
  }, []);

  if (mode === "classic") {
    // --- Classic View: Clean, compact hero layout ---
    return (
      <section
        id="home"
        className="w-full min-h-[75vh] flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-28 pb-16 bg-gradient-to-b from-orange-50/40 via-white to-white"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-start pl-16 sm:pl-20 md:pl-24">
          <div className="font-bold text-primary uppercase tracking-widest text-xs sm:text-sm mb-2">
            HELLO, I&apos;M
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold my-1 tracking-tight text-gray-900">
            <span className="smooch block text-6xl sm:text-7xl md:text-8xl font-normal leading-none text-gray-950">
              Ajay Kumar
            </span>
            <span className="relative text-3xl sm:text-4xl md:text-5xl text-primary uppercase tracking-widest font-bold -mt-2 block">
              Maharjan
            </span>
          </h1>

          <div className="flex gap-2 items-center mt-3 text-gray-800">
            <TypeAnimation
              sequence={[
                "Full-Stack JS Developer",
                1200,
                "Software Developer",
                1200,
              ]}
              wrapper="span"
              speed={20}
              style={{ fontSize: "1.4em", display: "inline-block", fontWeight: 700 }}
              repeat={Infinity}
            />
          </div>

          <p className="text-gray-700 text-base sm:text-lg font-normal leading-relaxed mt-4 max-w-2xl">
            I work across the frontend and backend to build complete, scalable, and user-friendly web applications — from designing dynamic interfaces to engineering secure APIs and database architectures.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={() => {
                const el = document.getElementById("projects");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition text-sm shadow-md cursor-pointer"
            >
              View Projects ↓
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("contact");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="py-3 px-6 rounded-xl border border-gray-300 hover:border-orange-500 text-gray-800 hover:text-orange-600 transition text-sm font-semibold bg-white cursor-pointer"
            >
              Contact Me
            </button>
            <button
              onClick={() => {
                toggleMode();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="py-3 px-6 rounded-xl border border-orange-500/80 bg-orange-50 hover:bg-orange-100 text-orange-700 font-mono font-bold transition text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer ml-auto"
              title="Return to interactive 3D Rubik's cube exploration"
            >
              <span>🌐 3D Cube Explore</span>
              <span>↑</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // --- 3D Exploration Mode: Full-viewport interactive 3D Rubik's stage ---
  return (
    <section
      id="home"
      className="relative w-full h-[100dvh] min-h-[100svh] overflow-hidden flex flex-col justify-between select-none bg-transparent"
    >
      {/* 
        Hero Poster (~36KB WebP) & Ambient Backdrop (Server-rendered behind canvas).
        Ensures first paint renders the actual cube with decals on and no layout shift (CLS stays near 0).
        Cross-fades to the canvas when the first frame renders.
      */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
        <div className="absolute w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent blur-3xl opacity-75" />
      </div>

      {/* Real Cube Poster with zero layout shift (sits exactly where canvas appears) */}
      <div
        id="hero-cube-poster-container"
        className={`absolute inset-0 z-10 w-full h-full flex items-center justify-center pointer-events-none select-none transition-opacity duration-700 ease-out ${
          firstFrameRendered ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
        suppressHydrationWarning
      >
        <Image
          id="hero-cube-poster-img"
          src="/image/cube-poster.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover pointer-events-none select-none"
          width={1184}
          height={649}
          priority
        />
        {isGated && !cubeLoaded && (
          <div className="absolute w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] rounded-3xl border border-orange-500/20 bg-orange-950/70 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center p-6 text-center opacity-95 pointer-events-auto">
            <div className="text-4xl mb-2">🎲</div>
            <span className="text-[11px] uppercase tracking-widest font-mono text-orange-200 font-semibold mb-3">
              Interactive 3D Stage
            </span>
            <button
              onClick={() => {
                setCubeLoaded(true);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("cube:load-requested"));
                }
              }}
              aria-label="Load 3D cube"
              className="py-2.5 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md transition duration-200 cursor-pointer pointer-events-auto"
            >
              Load 3D Cube
            </button>
          </div>
        )}
      </div>

      {/* Restored paper texture: loaded after first paint as lightweight WebP (25.6 KB) */}
      {showPaperTexture && (
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-60 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: "url(/image/paper-texture.webp)",
            backgroundAttachment: "fixed",
          }}
        />
      )}

      {/* Full-Viewport 3D Stage Canvas */}
      <div className="absolute inset-0 z-10 w-full h-full">
        <CubeWrapper className="w-full h-full" />
      </div>

      {/* Real HTML Overlay: Name, Title & Classic View Link */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between pointer-events-none p-6 sm:p-10 lg:p-12 pt-6 sm:pt-8 pl-24 sm:pl-28 md:pl-32 lg:pl-36">
        {/* Top-left Branding & Title */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left max-w-xl pointer-events-auto">
          <div className="font-bold text-primary uppercase tracking-widest text-xs sm:text-sm mb-1">
            HELLO, I&apos;M
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold my-1 tracking-tight">
            <span className="smooch block text-5xl sm:text-7xl md:text-8xl font-normal leading-none">
              Ajay Kumar
            </span>
            <span className="relative text-2xl sm:text-4xl md:text-5xl text-primary uppercase tracking-widest font-bold -mt-2 block">
              Maharjan
            </span>
          </h1>

          <div className="flex gap-2 items-center justify-center sm:justify-start mt-1">
            <TypeAnimation
              sequence={[
                "Full-Stack JS Developer",
                1200,
                "Software Developer",
                1200,
              ]}
              wrapper="span"
              speed={20}
              style={{ fontSize: "1.25em", display: "inline-block", fontWeight: 600 }}
              repeat={Infinity}
            />
          </div>

          <p className="text-gray-700 text-xs sm:text-sm md:text-base font-normal leading-relaxed mt-2 max-w-md hidden sm:block">
            I build modern, scalable, and user-focused web applications.
          </p>
        </div>

        {/* Bottom Area: Classic View Link (pinned to bottom-right to avoid center toolbar collision) */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 pointer-events-auto z-30">
          <button
            onClick={() => {
              toggleMode();
              const el = document.getElementById("about");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group text-xs font-mono uppercase tracking-widest text-gray-700 hover:text-orange-600 transition flex items-center gap-2 py-2 px-4 rounded-full bg-white/70 hover:bg-white/95 border border-gray-300/80 backdrop-blur-md shadow-md cursor-pointer"
            title="Switch to traditional scrollable portfolio"
          >
            <span>Classic View</span>
            <span className="group-hover:translate-y-0.5 transition-transform duration-200">↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}
