"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { createCube, disposeCube, CubeInstance } from "@/components/cube/cube";
import {
  generateCubieScatterData,
  interpolateCubieTransform,
  computeAssembleSceneFrame,
  CubieScatterData,
} from "./scatterMath";
import { ASSEMBLE_CONFIG } from "./config";

export interface AssembleCanvas3DProps {
  scrollProgress: number; // Single source of truth p in [0, 1]
  className?: string;
  onLockedCountChange?: (count: number) => void;
}

/**
 * Creates an in-memory soft contact shadow radial texture
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 8, 128, 128, 120);
    gradient.addColorStop(0, "rgba(25, 25, 30, 0.35)");
    gradient.addColorStop(0.35, "rgba(25, 25, 30, 0.18)");
    gradient.addColorStop(0.7, "rgba(25, 25, 30, 0.05)");
    gradient.addColorStop(1, "rgba(25, 25, 30, 0.0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

export default function AssembleCanvas3D({
  scrollProgress,
  className = "",
  onLockedCountChange,
}: AssembleCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cubeInstanceRef = useRef<CubeInstance | null>(null);
  const scatterDataRef = useRef<CubieScatterData[]>([]);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const frontCenterMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const servicesCenterMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  const [isIntersecting, setIsIntersecting] = useState(true);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Responsive mobile breakpoint check
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // IntersectionObserver to pause rendering when canvas stage is completely scrolled off
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isDisposed = false;
    let animationFrameId: number | null = null;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const initialWidth = container.clientWidth || 300;
    const initialHeight = container.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(
      ASSEMBLE_CONFIG.cameraFov,
      initialWidth / initialHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.2, ASSEMBLE_CONFIG.cameraDollyStart);

    // 3. Renderer (with hardware cap & DPR limit)
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      const maxDpr = isTouch ? 1.5 : 2.0;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
      renderer.setSize(initialWidth, initialHeight, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
    } catch (e) {
      console.warn("Assemble view WebGL init fallback:", e);
      return;
    }

    // 4. Lighting (consistent with Dynamic view)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.1);
    keyLight.position.set(6, 9, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7590b8, 0.95);
    fillLight.position.set(-6, -3, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff9234, 0.45);
    rimLight.position.set(-5, 7, -6);
    scene.add(rimLight);

    // 5. Build 3D Cube using shared geometry and textures
    const cubeInstance = createCube(4);
    cubeInstanceRef.current = cubeInstance;
    scene.add(cubeInstance.cubeGroup);

    // 6. Contact Shadow plane beneath the cube
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(6.5, 6.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.15;
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // 7. Find Front ('F') and Bottom ('D' - SERVICES) center stickers for Phase 4 glow pulse
    cubeInstance.stickerMeshes.forEach((mesh) => {
      const data = mesh.userData as any;
      if (data?.isCenter && data?.face === "F") {
        frontCenterMaterialRef.current = mesh.material as THREE.MeshStandardMaterial;
      }
      if (data?.isCenter && data?.face === "D") {
        servicesCenterMaterialRef.current = mesh.material as THREE.MeshStandardMaterial;
      }
    });

    // 8. Generate deterministic scatter parameters
    const scatterData = generateCubieScatterData();
    scatterDataRef.current = scatterData;

    // Resize handler
    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Temp variables for render loop to eliminate allocations
    let lastRenderProgress = -999;
    let lockedCountReported = -1;

    // Render loop with demand throttling
    const render = (now: number) => {
      if (isDisposed) return;

      const p = progressRef.current;
      const timeSec = now * 0.001;

      // Determine if animation is dynamic:
      // - Phase 1 (p <= 0.10): idle floating drift is active
      // - Phase 4 (p >= 0.90): interactive pulse is active
      // - Progress changed since last frame
      const isProgressChanging = Math.abs(p - lastRenderProgress) > 0.0005;
      const isIdleDrifting = p <= ASSEMBLE_CONFIG.phaseFloatEnd && !shouldReduceMotion;
      const isPulsing = p >= ASSEMBLE_CONFIG.phaseSettleEnd && !shouldReduceMotion;

      const shouldRender =
        isProgressChanging || isIdleDrifting || isPulsing || lastRenderProgress === -999;

      if (shouldRender) {
        lastRenderProgress = p;

        // 1. Compute whole-scene camera & base cube transform
        const frame = computeAssembleSceneFrame(
          p,
          timeSec,
          isMobile,
          shouldReduceMotion
        );

        // Position camera
        camera.position.set(0, frame.cameraDistance * 0.32, frame.cameraDistance);
        const targetLookY = frame.cubePosition.y * 0.4;
        camera.lookAt(0, targetLookY, 0);

        // Whole cube placement & settle overshoot
        cubeInstance.cubeGroup.position.copy(frame.cubePosition);
        cubeInstance.cubeGroup.rotation.y = frame.cubeRotationY;
        cubeInstance.cubeGroup.rotation.x = frame.cubeRotationX;

        // Contact shadow position & dynamic opacity
        if (shadowMeshRef.current) {
          shadowMeshRef.current.position.x = frame.cubePosition.x;
          shadowMeshRef.current.position.z = frame.cubePosition.z;
          // Shadow tightens and darkens as cube comes together
          const shadowOpacity = 0.35 + clamp01((p - 0.1) / 0.65) * 0.55;
          (shadowMeshRef.current.material as THREE.MeshBasicMaterial).opacity = shadowOpacity;
        }

        // 2. Interpolate each of the 27 cubies
        let lockedCount = 0;
        const cubies = cubeInstance.cubies;

        for (let i = 0; i < cubies.length; i++) {
          const cubie = cubies[i];
          const data = scatterData[i];

          const pieceScale = interpolateCubieTransform(
            data,
            p,
            timeSec,
            shouldReduceMotion,
            cubie.position,
            cubie.quaternion
          );

          // Combined scale: whole cube settle overshoot * individual settle click
          const finalScale = frame.cubeScale * pieceScale;
          cubie.scale.set(finalScale, finalScale, finalScale);

          if (p >= data.pEnd || shouldReduceMotion) {
            lockedCount++;
          }
        }

        // Report locked pieces to callback (for debug / status)
        if (lockedCount !== lockedCountReported) {
          lockedCountReported = lockedCount;
          onLockedCountChange?.(lockedCount);
        }

        // 3. Subtle glow hint on Front and Services center stickers
        if (frontCenterMaterialRef.current) {
          if (frame.hintPulseFactor > 0.01) {
            frontCenterMaterialRef.current.emissive.setHex(0x10ac84);
            frontCenterMaterialRef.current.emissiveIntensity = frame.hintPulseFactor;
          } else {
            frontCenterMaterialRef.current.emissive.setHex(0x000000);
            frontCenterMaterialRef.current.emissiveIntensity = 0;
          }
        }
        if (servicesCenterMaterialRef.current) {
          if (frame.hintPulseFactor > 0.01) {
            servicesCenterMaterialRef.current.emissive.setHex(0xf5c518);
            servicesCenterMaterialRef.current.emissiveIntensity = frame.hintPulseFactor * 0.8;
          } else {
            servicesCenterMaterialRef.current.emissive.setHex(0x000000);
            servicesCenterMaterialRef.current.emissiveIntensity = 0;
          }
        }

        renderer.render(scene, camera);
      }

      // Schedule next frame:
      // Always request frame if visible so progress changes are instantly picked up
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isDisposed = true;
      window.removeEventListener("resize", handleResize);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      shadowTex.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      disposeCube(cubeInstance);
      renderer.dispose();
    };
  }, [shouldReduceMotion, isMobile, onLockedCountChange]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-none select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full block"
      />
    </div>
  );
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}
