"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { SphericalOrbit } from "./orbit";
import { createCube, disposeCube, CubeInstance } from "./cube";
import {
  MoveController,
  MoveStats,
  createMoveFromFace,
  createMoveFromSlice,
  runDetachedControllerTest,
  runPhase5EligibilityTests,
} from "./moves";
import { CubeInputManager } from "./input";
import CubeControls from "./CubeControls";
import EasterEggModal, {
  LOCAL_STORAGE_KEY,
  logDevToolsAsciiCube,
} from "./EasterEggModal";
import { CubeFace } from "./palette";
import { IconLockOpen } from "@tabler/icons-react";
import SectionOverlay from "./SectionOverlay";
import {
  computeFocusPose,
  animateCameraArc,
  animateCameraReturn,
  normalizeSectionId,
} from "./focus";
import { StickerUserData } from "./cube";

interface CubeCanvasProps {
  className?: string;
  onCubeReady?: (instance: CubeInstance, controller: MoveController) => void;
}

export default function CubeCanvas({ className = "", onCubeReady }: CubeCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cubeInstanceRef = useRef<CubeInstance | null>(null);
  const controllerRef = useRef<MoveController | null>(null);
  const inputManagerRef = useRef<CubeInputManager | null>(null);
  const isHoveredOrFocusedRef = useRef(false);

  const [webGLError, setWebGLError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  const [easterEggData, setEasterEggData] = useState({ moves: 0, timeMs: 0 });
  const [solveAnnouncement, setSolveAnnouncement] = useState("");

  // Section exploration & overlay state
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isFocusAnimating, setIsFocusAnimating] = useState(false);

  const isOverlayOpenRef = useRef(false);
  isOverlayOpenRef.current = isOverlayOpen;

  const isFocusAnimatingRef = useRef(false);
  isFocusAnimatingRef.current = isFocusAnimating;

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isInteractiveTouch, setIsInteractiveTouch] = useState(false);

  // Stage (d) Touch device detection:
  // Requires coarse pointer (direct finger touch screen) AND hardware touch points.
  // Touch laptops (which have pointer: fine with trackpad/mouse) and small desktop windows
  // do not show the mobile touch toggle unnecessarily.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkTouch = () => {
      const hasCoarse = window.matchMedia("(pointer: coarse)").matches;
      const hasTouch = "ontouchstart" in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      setIsTouchDevice(Boolean(hasCoarse && hasTouch));
    };

    checkTouch();
    const mql = window.matchMedia("(pointer: coarse)");
    mql.addEventListener?.("change", checkTouch);
    return () => {
      mql.removeEventListener?.("change", checkTouch);
    };
  }, []);

  const hasPushedHistoryRef = useRef(false);
  const isProgrammaticBackRef = useRef(false);
  const pendingFocusSectionRef = useRef<string | null>(null);
  const orbitRef = useRef<SphericalOrbit | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const focusSection = useCallback(
    (
      sectionId: string,
      options?: { skipPushState?: boolean; triggerEl?: HTMLElement | null }
    ) => {
      const clean = normalizeSectionId(sectionId);

      // WebGL unavailable fallback: open overlay directly without camera tween
      if (webGLError || !cubeInstanceRef.current || !cameraRef.current || !orbitRef.current) {
        setActiveSection(clean);
        setIsOverlayOpen(true);
        if (!options?.skipPushState) {
          hasPushedHistoryRef.current = true;
          window.history.pushState({ section: clean }, "", `#${clean}`);
        }
        return;
      }

      const controller = controllerRef.current;
      const cube = cubeInstanceRef.current;
      const camera = cameraRef.current;
      const orbit = orbitRef.current;

      // Ignore or queue focus request while a twist, scramble, or auto-solve is running
      if (controller && (controller.isAnimating() || controller.isAutoSolving())) {
        pendingFocusSectionRef.current = clean;
        return;
      }

      // Halts idle auto-rotate
      orbit.recordInteraction();
      orbit.autoRotate = false;
      orbit.enabled = false;
      setShowHint(false);

      const target = computeFocusPose(cube, clean);
      if (!target) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        animateCameraArc(camera, target.targetPos, target.targetQuat, {
          shouldReduceMotion: true,
        });
        setActiveSection(target.sectionId);
        setIsOverlayOpen(true);
        if (!options?.skipPushState) {
          hasPushedHistoryRef.current = true;
          window.history.pushState({ section: target.sectionId }, "", `#${target.sectionId}`);
        }
      } else {
        setIsFocusAnimating(true);
        animateCameraArc(camera, target.targetPos, target.targetQuat, {
          duration: 750,
          onComplete: () => {
            setIsFocusAnimating(false);
            setActiveSection(target.sectionId);
            setIsOverlayOpen(true);
            if (!options?.skipPushState) {
              hasPushedHistoryRef.current = true;
              window.history.pushState({ section: target.sectionId }, "", `#${target.sectionId}`);
            }
          },
        });
      }
    },
    [webGLError]
  );

  const closeOverlay = useCallback(
    (options?: { skipPushState?: boolean }) => {
      // Guard: do nothing if overlay is already closed
      if (!isOverlayOpenRef.current && !activeSection) {
        return;
      }

      // Fix 6: Restore full frame rate BEFORE exit camera tween starts!
      isOverlayOpenRef.current = false;
      setIsOverlayOpen(false);
      setActiveSection(null);

      // Fix 4 & 5: If the overlay open pushed a history entry, close via history.back()
      // so repeated open/close cycles DO NOT grow the browser history!
      // Set isProgrammaticBackRef to true so handlePopState does not double-fire!
      if (!options?.skipPushState && hasPushedHistoryRef.current) {
        hasPushedHistoryRef.current = false;
        if (window.location.hash) {
          isProgrammaticBackRef.current = true;
          window.history.back();
          // Requirement 6: Clear isProgrammaticBackRef with a short timeout
          // so a missed popstate cannot swallow a later real Back press
          setTimeout(() => {
            isProgrammaticBackRef.current = false;
          }, 300);
        }
      } else if (!options?.skipPushState && window.location.hash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }

      const camera = cameraRef.current;
      const orbit = orbitRef.current;
      if (!camera || !orbit) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      animateCameraReturn(camera, orbit, {
        duration: prefersReduced ? 0 : 650,
        shouldReduceMotion: prefersReduced,
        onComplete: () => {
          orbit.enabled = true;
        },
      });
    },
    [activeSection]
  );

  const focusSectionRef = useRef(focusSection);
  focusSectionRef.current = focusSection;

  const closeOverlayRef = useRef(closeOverlay);
  closeOverlayRef.current = closeOverlay;

  const [stats, setStats] = useState<MoveStats>({
    totalMoves: 0,
    userMoves: 0,
    userHasMovedSinceScramble: false,
    hasBeenScrambled: false,
    isEligibleForEasterEgg: false,
    historyLength: 0,
    isAnimating: false,
    isAutoSolving: false,
    isSolved: true,
    solveTimeMs: null,
    elapsedTimeMs: 0,
  });

  // Decals visibility state for non-center stickers
  const [showDecals, setShowDecals] = useState(true);

  const handleToggleDecals = useCallback(() => {
    setShowDecals((prev) => {
      const nextVal = !prev;
      if (cubeInstanceRef.current) {
        cubeInstanceRef.current.setDecalsVisible(nextVal);
      }
      return nextVal;
    });
  }, []);

  // Read persisted secret from localStorage and log DevTools ASCII cube
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.solved) {
          setIsSecretUnlocked(true);
          setEasterEggData({
            moves: parsed.moves || 0,
            timeMs: parsed.timeMs || 0,
          });
        }
      }
    } catch {
      // ignore localStorage access issues in sandbox/private mode
    }

    logDevToolsAsciiCube();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isDisposed = false;
    let animationFrameId: number | null = null;
    let isVisible = true;
    let isTabFocused = !document.hidden;

    // --- 1. Scene & Camera ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / (container.clientHeight || 1),
      0.1,
      100
    );
    // Elevated angle calibrated tightly around cube to minimize dead-zones
    camera.position.set(4.4, 3.4, 4.9);
    cameraRef.current = camera;

    // --- 2. Renderer Creation (with fail-safe fallback) ---
    let renderer: THREE.WebGLRenderer | null = null;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (isDisposed) return;
      console.warn("WebGL context lost. Pausing 3D simulation.");
      setWebGLError("WebGL context was interrupted. Pausing 3D simulation.");
    };

    const handleContextRestored = () => {
      if (isDisposed) return;
      console.info("WebGL context restored. Resuming 3D simulation.");
      setWebGLError(null);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "default",
      });
      const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      const maxPixelRatio = isTouchDevice ? 1.5 : 2;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
      const initialWidth = container.clientWidth || 300;
      const initialHeight = container.clientHeight || 300;
      renderer.setSize(initialWidth, initialHeight, false);
      camera.aspect = initialWidth / initialHeight;
      camera.updateProjectionMatrix();
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
    } catch (err: unknown) {
      console.error("WebGL initialization error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setWebGLError(msg);
      return;
    }

    // --- 3. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.0);
    keyLight.position.set(6, 9, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7590b8, 0.9);
    fillLight.position.set(-6, -3, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff9234, 0.4);
    rimLight.position.set(-5, 7, -6);
    scene.add(rimLight);

    // --- 4. Ground Glow Plane ---
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const ctx = glowCanvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.45)");
      grad.addColorStop(0.4, "rgba(0, 0, 0, 0.18)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowGeo = new THREE.PlaneGeometry(6.5, 6.5);
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const groundGlow = new THREE.Mesh(glowGeo, glowMat);
    groundGlow.rotation.x = -Math.PI / 2;
    groundGlow.position.y = -2.25;
    scene.add(groundGlow);

    // --- 5. Rubik's Cube & MoveController Instance ---
    const maxAnisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 4;
    const cube = createCube(maxAnisotropy);
    scene.add(cube.cubeGroup);
    cubeInstanceRef.current = cube;

    const controller = new MoveController({
      cube,
      onMoveComplete: (_move, newStats) => {
        setStats(newStats);
        if (newStats.userMoves > 0) {
          setShowHint(false);
        }
        if (
          pendingFocusSectionRef.current &&
          !controller.isAnimating() &&
          !controller.isAutoSolving()
        ) {
          const next = pendingFocusSectionRef.current;
          pendingFocusSectionRef.current = null;
          focusSectionRef.current(next);
        }
      },
      onStateChange: (newStats) => {
        setStats(newStats);
      },
      onEasterEggUnlocked: (data) => {
        setEasterEggData(data);
        setIsEasterEggOpen(true);
        setIsSecretUnlocked(true);
        setSolveAnnouncement(
          `Congratulations! You solved Ajay's 3D Rubik's Cube in ${data.moves} moves! Developer terminal unlocked.`
        );
        try {
          localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
              solved: true,
              moves: data.moves,
              timeMs: data.timeMs,
              unlockedAt: Date.now(),
            })
          );
        } catch {
          // ignore
        }
      },
      getReducedMotion: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    controllerRef.current = controller;

    if (onCubeReady) {
      onCubeReady(cube, controller);
    }

    const getCalibratedRadius = (w: number, h: number): number => {
      const aspect = w / Math.max(1, h);
      if (aspect <= 0.50) {
        // e.g. 390x844: radius 13.8 ensures >= 15px margin on both sides (no clipping)
        return 13.8;
      }
      if (aspect <= 0.65) {
        // e.g. 360x640: radius 12.4 ensures >= 25px margin on both sides
        return 12.4;
      }
      if (aspect <= 0.85) {
        // e.g. 768x1024: radius 11.2 ensures >= 90px margin on both sides
        return 11.2;
      }
      if (aspect < 1.2) {
        return 9.2;
      }
      // Desktop landscape
      return 7.4;
    };

    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      (window as any).__measureCubeBounds = () => {
        const cam = cameraRef.current;
        const cont = containerRef.current;
        if (!cam || !cont) return null;

        const cw = cont.clientWidth;
        const ch = cont.clientHeight;
        const corners = [
          new THREE.Vector3(-1.5, -1.5, -1.5),
          new THREE.Vector3(-1.5, -1.5, 1.5),
          new THREE.Vector3(-1.5, 1.5, -1.5),
          new THREE.Vector3(-1.5, 1.5, 1.5),
          new THREE.Vector3(1.5, -1.5, -1.5),
          new THREE.Vector3(1.5, -1.5, 1.5),
          new THREE.Vector3(1.5, 1.5, -1.5),
          new THREE.Vector3(1.5, 1.5, 1.5),
        ];

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        corners.forEach((c) => {
          const p = c.clone().project(cam);
          const sx = ((p.x + 1) / 2) * cw;
          const sy = ((1 - p.y) / 2) * ch;
          if (sx < minX) minX = sx;
          if (sx > maxX) maxX = sx;
          if (sy < minY) minY = sy;
          if (sy > maxY) maxY = sy;
        });

        const toolbarEl = document.querySelector('[role="toolbar"]') || document.querySelector('.bottom-6') || document.querySelector('.sm\\:bottom-8');
        const toolbarTop = toolbarEl ? toolbarEl.getBoundingClientRect().top : ch - 76;
        const clearance = Math.round(toolbarTop - maxY);

        return {
          viewport: `${cw}x${ch}`,
          left: Math.round(minX),
          right: Math.round(maxX),
          top: Math.round(minY),
          bottom: Math.round(maxY),
          width: Math.round(maxX - minX),
          height: Math.round(maxY - minY),
          marginLeft: Math.round(minX),
          marginRight: Math.round(cw - maxX),
          toolbarTop: Math.round(toolbarTop),
          toolbarClearance: clearance,
        };
      };
    }

    // --- 6. SphericalOrbit (Custom Camera Orbit with Idle Rotation & Smooth Damping) ---
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const initialH = container.clientHeight || 800;
    const initialW = container.clientWidth || 800;
    const initialTargetY = initialH <= 700 ? 0.18 : -0.2;
    const orbit = new SphericalOrbit({
      camera,
      target: new THREE.Vector3(0, initialTargetY, 0),
      initialRadius: getCalibratedRadius(initialW, initialH),
      autoRotate: !prefersReduced,
      autoRotateSpeed: 0.16,
      onFirstInteraction: () => {
        setShowHint(false);
      },
    });

    orbitRef.current = orbit;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        orbit.autoRotate = false;
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    // --- 7. CubeInputManager (Drag-to-Twist, Middle-layer Orbit, Hover & Center Taps) ---
    const inputManager = new CubeInputManager({
      canvas,
      container,
      camera,
      cube,
      orbit,
      controller,
      isInputDisabled: () => isOverlayOpenRef.current || isFocusAnimatingRef.current,
      onFirstInteraction: () => {
        setShowHint(false);
      },
      onCenterTap: (_cubie, _normalLocal, hitSticker) => {
        const data = hitSticker?.userData as StickerUserData;
        if (data?.sectionId) {
          focusSectionRef.current(data.sectionId, { triggerEl: canvas });
        }
      },
    });
    inputManagerRef.current = inputManager;

    // --- 8. Initial Scramble & Reduced Motion Handling ---
    controller.scramble(5, { instant: true });

    // Dev test helper & cycle verification (gated strictly behind NODE_ENV !== 'production')
    if (process.env.NODE_ENV !== "production") {
      if (typeof window !== "undefined") {
        const devWindow = window as unknown as Record<string, unknown>;
        devWindow.__testCubeController = () => runDetachedControllerTest();
        devWindow.__testCubeRealController = () => runDetachedControllerTest();
        devWindow.__testPhase5Matrix = () => runPhase5EligibilityTests();
        devWindow.__cubeController = controller;
        devWindow.__cube = cube;
        devWindow.__triggerEasterEgg = (moves = 18, timeMs = 24500) => {
          setEasterEggData({ moves, timeMs });
          setIsEasterEggOpen(true);
          // Note: Debug triggers do NOT write to localStorage or unlock persistent state
        };

        // Automatically run detached tests in development mode or with ?cubeTest flag
        if (window.location.search.includes("cubeTest")) {
          runDetachedControllerTest();
          runPhase5EligibilityTests();
        }

        // Check ?cubeDebug flag to force-open Easter egg modal for styling review
        if (window.location.search.includes("cubeDebug")) {
          setTimeout(() => {
            setIsEasterEggOpen(true);
            setEasterEggData({ moves: 16, timeMs: 21800 });
            // Note: Debug triggers do NOT write to localStorage or unlock persistent state
          }, 500);
        }
      }
    }

    // --- 9. Keyboard Accessibility (Amendment 2 & Fix 5) ---
    const onKeyDown = (e: KeyboardEvent) => {
      // Disable shortcuts while overlay is open or transition is animating
      if (isOverlayOpenRef.current || isFocusAnimatingRef.current) {
        return;
      }

      // Ignore if user is holding ctrl, meta (Cmd), or alt
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Ignore if focus is in an input, textarea, select, or contenteditable
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      // Only active when cube container is hovered OR focused
      if (!isHoveredOrFocusedRef.current) {
        return;
      }

      const key = e.key.toUpperCase();
      const validFaces: CubeFace[] = ["U", "D", "L", "R", "F", "B"];
      const validSlices: Array<"M" | "E" | "S"> = ["M", "E", "S"];
      const prime = e.shiftKey;

      if (validFaces.includes(key as CubeFace)) {
        e.preventDefault();
        controller.enqueueMove(createMoveFromFace(key as CubeFace, prime), {
          isUserMove: true,
        });
        setShowHint(false);
      } else if (validSlices.includes(key as "M" | "E" | "S")) {
        e.preventDefault();
        controller.enqueueMove(createMoveFromSlice(key as "M" | "E" | "S", prime), {
          isUserMove: true,
        });
        setShowHint(false);
      }
    };

    const onPointerEnter = () => {
      isHoveredOrFocusedRef.current = true;
    };

    const onPointerLeave = () => {
      if (document.activeElement !== container) {
        isHoveredOrFocusedRef.current = false;
      }
    };

    const onFocus = () => {
      isHoveredOrFocusedRef.current = true;
    };

    const onBlur = () => {
      isHoveredOrFocusedRef.current = false;
    };

    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("focus", onFocus);
    container.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onKeyDown);

    // --- 10. Render Loop (Render-on-demand & idle auto-rotate <= 30fps stopping after ~12s) ---
    let lastRenderTimestamp = 0;
    let lastDeltaTimestamp = 0;
    let needsDemandRender = true;
    let hasDispatchedFirstFrame = false;

    const notifyFirstFrame = () => {
      if (!hasDispatchedFirstFrame) {
        hasDispatchedFirstFrame = true;
        if (typeof performance !== "undefined" && performance.mark) {
          performance.mark("cube:first-frame");
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cube:first-frame"));
        }
      }
    };

    const requestDemandRender = () => {
      needsDemandRender = true;
    };

    const animateLoop = (time: number) => {
      if (isDisposed) return;

      animationFrameId = requestAnimationFrame(animateLoop);

      if (!isVisible || !isTabFocused || !renderer) return;

      // While overlay is open, cube is static behind it: throttle to 10 FPS (~100ms)
      if (isOverlayOpenRef.current) {
        if (time - lastRenderTimestamp < 100) return;
        lastRenderTimestamp = time;
        renderer.render(scene, camera);
        notifyFirstFrame();
        return;
      }

      const isIdleAutoRotating = orbit.autoRotate && !orbit.hasUserInteracted;
      const isControllerBusy = controller.isAnimating() || controller.isAutoSolving();
      const isFocusBusy = isFocusAnimatingRef.current;
      const isOrbitMoving = orbit.isMoving();
      const isDragging = inputManager.isDragging;

      // Idle auto-rotate runs at <= 30fps (~33.3ms interval) and stops after ~12s
      if (isIdleAutoRotating && !isControllerBusy && !isFocusBusy && !isDragging) {
        if (time - lastRenderTimestamp < 33.3) {
          return;
        }
      }

      // Render-on-demand: skip rendering when completely idle
      const shouldRender =
        needsDemandRender ||
        isControllerBusy ||
        isFocusBusy ||
        isOrbitMoving ||
        isDragging;

      if (!shouldRender) {
        return;
      }

      needsDemandRender = false;
      lastRenderTimestamp = time;

      const dt = lastDeltaTimestamp ? Math.min(0.05, (time - lastDeltaTimestamp) / 1000) : 0.016;
      lastDeltaTimestamp = time;

      orbit.update(dt);
      inputManager.updateHover();
      renderer.render(scene, camera);
      notifyFirstFrame();
    };

    animationFrameId = requestAnimationFrame(animateLoop);

    // --- 11. Visibility & Intersection Observers ---
    const onVisibilityChange = () => {
      isTabFocused = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        if (width > 0 && height > 0 && renderer) {
          camera.aspect = width / height;
          orbit.targetRadius = getCalibratedRadius(width, height);
          orbit.target.y = height <= 700 ? 0.18 : -0.2;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          requestDemandRender();
        }
      }
    });
    resizeObserver.observe(container);

    // --- 12. External Focus Events & URL Hash Synchronization ---
    const handleExternalFocus = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.sectionId) {
        focusSectionRef.current(detail.sectionId);
      }
    };

    const handleExternalClose = () => {
      closeOverlayRef.current();
    };

    const handlePopState = () => {
      // Guard against double-firing when closeOverlay programmatically invoked history.back()
      if (isProgrammaticBackRef.current) {
        isProgrammaticBackRef.current = false;
        return;
      }

      const hash = window.location.hash.replace(/^#/, "");
      if (hash) {
        const clean = normalizeSectionId(hash);
        if (["about", "projects", "skills", "experience", "services", "contact"].includes(clean)) {
          focusSectionRef.current(clean, { skipPushState: true });
          return;
        }
      }
      closeOverlayRef.current({ skipPushState: true });
    };

    window.addEventListener("cube:focus-section", handleExternalFocus);
    window.addEventListener("cube:close-overlay", handleExternalClose);
    window.addEventListener("popstate", handlePopState);

    // Initial check for hash on page load
    const initialHash = window.location.hash.replace(/^#/, "");
    if (initialHash) {
      const clean = normalizeSectionId(initialHash);
      if (["about", "projects", "skills", "experience", "services", "contact"].includes(clean)) {
        setTimeout(() => {
          if (!isDisposed) {
            focusSectionRef.current(clean, { skipPushState: true });
          }
        }, 400);
      }
    }

    // --- 12. Strict-Mode Safe Cleanup ---
    return () => {
      isDisposed = true;

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("focus", onFocus);
      container.removeEventListener("blur", onBlur);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("cube:focus-section", handleExternalFocus);
      window.removeEventListener("cube:close-overlay", handleExternalClose);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();

      inputManager.dispose();
      controller.dispose();
      orbit.dispose();

      glowGeo.dispose();
      glowMat.dispose();
      glowTexture.dispose();

      disposeCube(cube);
      cubeInstanceRef.current = null;
      controllerRef.current = null;
      inputManagerRef.current = null;

      scene.clear();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [onCubeReady]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Accessible polite announcement on solve only (never spams every move) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {solveAnnouncement}
      </div>

      {/*
        Focusable container (tabIndex=0) with visible focus ring.
        Active on hover OR keyboard focus.
      */}
      <div
        ref={containerRef}
        role="region"
        tabIndex={0}
        aria-label="Interactive 3D Rubik's Cube. Use drag gestures or keyboard keys U, D, L, R, F, B (with Shift for prime) to twist layers. Tab to toolbar controls below."
        className={`w-full h-full relative select-none outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${className}`}
        style={{ touchAction: isInteractiveTouch ? "none" : "pan-y" }}
      >
        <canvas
          ref={canvasRef}
          className={`w-full h-full block cursor-grab active:cursor-grabbing outline-none ${
            webGLError ? "hidden" : ""
          }`}
          style={{ touchAction: isInteractiveTouch ? "none" : "pan-y" }}
        />

        {/* noscript fallback */}
        <noscript>
          <div className="w-full h-full min-h-[240px] flex flex-col items-center justify-center p-6 bg-gray-900/60 border border-gray-800 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-950/60 border border-orange-800/40 flex items-center justify-center text-orange-400 text-2xl mb-3">
              🎲
            </div>
            <p className="text-sm font-semibold text-gray-200">3D Rubik&apos;s Cube Playground</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              JavaScript is required to render the interactive 3D simulation.
            </p>
          </div>
        </noscript>

        {webGLError && (
          <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center p-6 rounded-3xl bg-gray-900/40 border border-gray-800 text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-950/60 border border-orange-800/40 flex items-center justify-center text-orange-400 text-2xl mb-3">
              🎲
            </div>
            <p className="text-sm font-semibold text-gray-300">3D Rubik&apos;s Cube Playground</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Interactive 3D simulation active in WebGL-enabled desktop & mobile browsers.
            </p>
          </div>
        )}
      </div>

      {/* Floating Toolbar with Scramble, Auto-Solve, Undo, Reset, and Move Counter */}
      <div className="absolute bottom-3 sm:bottom-8 z-20 flex flex-col items-center pointer-events-auto">
        {/* Stage (d) Mobile Touch Mode Toggle (Interact 3D vs Exit to Scroll) */}
        {isTouchDevice && !webGLError && (
          <button
            onClick={() => setIsInteractiveTouch((prev) => !prev)}
            className={`mb-2.5 px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isInteractiveTouch
                ? "bg-gray-900/95 border border-orange-500/80 text-orange-400 hover:bg-gray-800"
                : "bg-orange-600 hover:bg-orange-500 text-white"
            }`}
            aria-label={
              isInteractiveTouch
                ? "Exit to Scroll - Restore vertical page scrolling"
                : "Interact 3D - Enable full 3D cube twisting and gestures"
            }
          >
            {isInteractiveTouch ? (
              <>
                <span>✕</span>
                <span>Exit to Scroll</span>
              </>
            ) : (
              <>
                <span>🎮</span>
                <span>Interact 3D</span>
              </>
            )}
          </button>
        )}

        {/* Fading first-time interaction hint (positioned directly above controls) */}
        {!webGLError && (
          <div
            className={`mb-3 px-4 py-1.5 rounded-full bg-gray-950/85 backdrop-blur-md border border-gray-800 text-xs font-mono text-gray-200 pointer-events-none transition-opacity duration-700 shadow-xl ${
              showHint ? "opacity-95" : "opacity-0"
            }`}
          >
            Twist to play · Tap a center sticker to explore
          </div>
        )}

        <CubeControls
          controller={controllerRef.current}
          stats={stats}
          showDecals={showDecals}
          onToggleDecals={handleToggleDecals}
          onScramble={() => controllerRef.current?.scramble(5)}
          onAutoSolve={() => controllerRef.current?.autoSolve()}
          onUndo={() => controllerRef.current?.undo()}
          onReset={() => controllerRef.current?.reset()}
          onCancelAutoSolve={() => controllerRef.current?.cancelAutoSolve()}
        />

        {/* Persistent button to re-open the secret terminal if unlocked */}
        {isSecretUnlocked && (
          <button
            onClick={() => setIsEasterEggOpen(true)}
            className="mt-3 text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 transition shadow-sm cursor-pointer"
            title="Reopen unlocked secret developer terminal"
          >
            <IconLockOpen size={14} className="text-emerald-400" />
            <span>Secret Terminal Unlocked (Click to view)</span>
          </button>
        )}
      </div>

      {/* Easter Egg Terminal Modal */}
      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
        moves={easterEggData.moves}
        timeMs={easterEggData.timeMs}
        cubeContainerRef={containerRef}
      />

      {/* Slide-in Section Overlay */}
      <SectionOverlay
        isOpen={isOverlayOpen}
        sectionId={activeSection}
        onClose={closeOverlay}
      />
    </div>
  );
}
