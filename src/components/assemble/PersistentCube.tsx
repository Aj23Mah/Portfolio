"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { createCube, disposeCube, CubeInstance } from "@/components/cube/cube";
import { ASSEMBLE_CONFIG, ASSEMBLE_SECTIONS, AssembleSectionDef } from "./config";
import { IconX, IconArrowsShuffle, IconChevronRight } from "@tabler/icons-react";

export default function PersistentCube() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cubeInstanceRef = useRef<CubeInstance | null>(null);

  const [activeSection, setActiveSection] = useState<AssembleSectionDef>(ASSEMBLE_SECTIONS[0]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Animation refs to eliminate per-frame allocations
  const targetRotationRef = useRef<[number, number, number]>(ASSEMBLE_SECTIONS[0].targetRotation);
  const currentRotationRef = useRef<[number, number, number]>([0.18, 0.22, 0.0]);
  const scrambleVelRef = useRef<[number, number, number]>([0, 0, 0]);

  // Check reduced motion & mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Synchronize with section enter events dispatched by SectionShell
  useEffect(() => {
    const handleSectionEnter = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const found = ASSEMBLE_SECTIONS.find((s) => s.id === detail?.id);
      if (found) {
        setActiveSection(found);
        targetRotationRef.current = found.targetRotation;
      }
    };

    window.addEventListener("assemble:section-enter", handleSectionEnter);
    return () => window.removeEventListener("assemble:section-enter", handleSectionEnter);
  }, []);

  // Monitor scroll position: cube fades in past the hero assembly track
  useEffect(() => {
    const onScroll = () => {
      const heroTrack = document.getElementById("hero-track");
      if (!heroTrack) return;
      const heroBottom = heroTrack.offsetTop + heroTrack.offsetHeight - window.innerHeight * 0.45;
      setIsVisible(window.scrollY >= heroBottom);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Three.js Render Stage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDisposed = false;
    let animId: number | null = null;

    const size = isMobile
      ? ASSEMBLE_CONFIG.persistentCubeMobileSize
      : ASSEMBLE_CONFIG.persistentCubeDesktopSize;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 6.8);
    camera.lookAt(0, 0, 0);

    // 2. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      const maxDpr = isMobile ? 1.5 : 2.0;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
      renderer.setSize(size, size, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    } catch (e) {
      console.warn("PersistentCube WebGL fallback:", e);
      return;
    }

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.0);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7590b8, 0.9);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff9234, 0.4);
    rimLight.position.set(-4, 6, -5);
    scene.add(rimLight);

    // 4. Cube Instance (Solved cube with shared stickers & decals)
    const cubeInstance = createCube(4);
    cubeInstanceRef.current = cubeInstance;
    scene.add(cubeInstance.cubeGroup);

    // Render loop with smooth slerp/lerp
    const lerpSpeed = ASSEMBLE_CONFIG.persistentCubeLerpSpeed;

    const render = () => {
      if (isDisposed) return;

      const group = cubeInstance.cubeGroup;

      if (reducedMotion) {
        // Instant solved position
        group.rotation.set(
          targetRotationRef.current[0],
          targetRotationRef.current[1],
          targetRotationRef.current[2]
        );
      } else {
        // Scramble velocity decay
        if (scrambleVelRef.current[0] !== 0 || scrambleVelRef.current[1] !== 0) {
          currentRotationRef.current[0] += scrambleVelRef.current[0];
          currentRotationRef.current[1] += scrambleVelRef.current[1];
          currentRotationRef.current[2] += scrambleVelRef.current[2];

          scrambleVelRef.current[0] *= 0.94;
          scrambleVelRef.current[1] *= 0.94;
          scrambleVelRef.current[2] *= 0.94;

          if (Math.abs(scrambleVelRef.current[0]) < 0.002) {
            scrambleVelRef.current[0] = 0;
            scrambleVelRef.current[1] = 0;
            scrambleVelRef.current[2] = 0;
            setIsScrambling(false);
          }
        } else {
          // Smoothly lerp towards active section target rotation
          const target = targetRotationRef.current;
          currentRotationRef.current[0] += (target[0] - currentRotationRef.current[0]) * lerpSpeed;
          currentRotationRef.current[1] += (target[1] - currentRotationRef.current[1]) * lerpSpeed;
          currentRotationRef.current[2] += (target[2] - currentRotationRef.current[2]) * lerpSpeed;
        }

        group.rotation.set(
          currentRotationRef.current[0],
          currentRotationRef.current[1],
          currentRotationRef.current[2]
        );
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isDisposed = true;
      if (animId !== null) cancelAnimationFrame(animId);
      disposeCube(cubeInstance);
      renderer.dispose();
    };
  }, [isMobile, reducedMotion]);

  // Trigger scramble easter egg
  const handleScramble = useCallback(() => {
    if (reducedMotion || isScrambling) return;
    setIsScrambling(true);
    scrambleVelRef.current = [
      (Math.random() - 0.5) * 0.45,
      (Math.random() - 0.5) * 0.45,
      (Math.random() - 0.5) * 0.3,
    ];
  }, [reducedMotion, isScrambling]);

  // Navigate to section
  const handleNavigateToSection = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Compute position classes
  const isContact = activeSection.id === "contact";
  const sizePx = isMobile
    ? ASSEMBLE_CONFIG.persistentCubeMobileSize
    : ASSEMBLE_CONFIG.persistentCubeDesktopSize;

  let desktopPosStyle: React.CSSProperties = {};
  if (!isMobile) {
    if (activeSection.desktopSide === "left") {
      desktopPosStyle = {
        left: "24px",
        top: "24vh",
      };
    } else {
      desktopPosStyle = {
        left: `calc(100% - ${sizePx}px - 24px)`,
        top: "24vh",
      };
    }
  }

  // Fade out persistent cube in contact section where dedicated centered finale cube takes over
  const showCube = isVisible && !isContact;

  return (
    <>
      {/* 🔹 Persistent 3D Cube Canvas Widget */}
      <div
        ref={containerRef}
        className={`fixed z-40 transition-all duration-700 pointer-events-auto select-none ${
          showCube ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
        style={
          isMobile
            ? {
                top: "72px",
                right: "12px",
                width: `${sizePx}px`,
                height: `${sizePx}px`,
              }
            : {
                ...desktopPosStyle,
                width: `${sizePx}px`,
                height: `${sizePx}px`,
              }
        }
      >
        <button
          onClick={() => setMenuOpen(true)}
          aria-label={`Open Rubik's cube section menu. Currently on Move ${activeSection.moveNumber} of 6, ${activeSection.faceLabel}`}
          className="group relative w-full h-full rounded-3xl cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500 bg-transparent flex flex-col items-center justify-center"
        >
          {/* Subtle Glow Ring in Section Accent Color */}
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none"
            style={{ backgroundColor: activeSection.accentHex }}
          />

          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="w-full h-full block filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
          />

          {/* Corner Badge: Move X / 6 & Face */}
          {!isMobile && (
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-white/95 border shadow-md flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 group-hover:border-orange-500"
              style={{
                borderColor: activeSection.borderAccent,
                color: activeSection.accentHex === "#E8ECF0" ? "#1E293B" : activeSection.accentHex,
              }}
            >
              <span
                className="w-2 h-2 rounded-[2px]"
                style={{ backgroundColor: activeSection.accentHex }}
              />
              <span>Move {activeSection.moveNumber}/6</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-700">{activeSection.face}</span>
            </div>
          )}
        </button>
      </div>

      {/* 🔹 Accessible Section Menu Modal / Popover */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cube Face Section Navigator"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white/95 rounded-3xl p-6 sm:p-7 border border-orange-200/80 shadow-2xl backdrop-blur-xl font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎲</span>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    Cube Face Navigation
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    Move {activeSection.moveNumber} of 6 · {activeSection.faceLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                aria-label="Close menu"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* List of 6 Cube Faces */}
            <div className="flex flex-col gap-2">
              {ASSEMBLE_SECTIONS.map((sec) => {
                const isActive = sec.id === activeSection.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleNavigateToSection(sec.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer text-left border ${
                      isActive
                        ? "bg-orange-50/80 border-orange-400/90 shadow-2xs font-bold"
                        : "bg-white hover:bg-gray-50 border-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-[4px] border shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: sec.accentHex,
                          borderColor: sec.accentHex === "#E8ECF0" ? "#94A3B8" : "rgba(0,0,0,0.15)",
                        }}
                      />
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-gray-500">
                          {sec.faceLabel}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {sec.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-600 text-white font-mono text-[10px] uppercase font-bold">
                          Active
                        </span>
                      )}
                      <IconChevronRight size={16} className="text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer with Scramble Button */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={handleScramble}
                disabled={isScrambling}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-700 text-gray-700 text-xs font-mono font-bold transition cursor-pointer disabled:opacity-50"
              >
                <IconArrowsShuffle size={16} className={isScrambling ? "animate-spin" : ""} />
                <span>{isScrambling ? "Scrambling..." : "Scramble Cube"}</span>
              </button>

              <span className="text-[11px] text-gray-400 font-mono">
                Click any face to jump
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
