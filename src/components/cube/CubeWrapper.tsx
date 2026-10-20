"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { useViewMode } from "@/context/ViewModeContext";
import { isLowPowerGated } from "@/utils/lowPowerGate";

const CubeCanvas = dynamic(() => import("./CubeCanvas"), {
  ssr: false,
  loading: () => null,
});

interface CubeWrapperProps {
  className?: string;
  onCubeReady?: (instance: any) => void;
}

export default function CubeWrapper({ className = "", onCubeReady }: CubeWrapperProps) {
  const { mode } = useViewMode();
  const [canMount, setCanMount] = useState(false);

  useEffect(() => {
    // If in Classic mode (or marked classic-mode pre-hydration),
    // NEVER load or mount the cube chunk!
    if (
      document.documentElement.classList.contains("classic-mode") ||
      mode === "classic"
    ) {
      setCanMount(false);
      return;
    }

    // Low-power gate:
    // Gate ONLY on (pointer: coarse) AND (deviceMemory <= 2 OR hardwareConcurrency <= 2 OR navigator.connection?.saveData),
    // treating undefined as "not low-power" (never gated). Never gate desktop/laptop visitors.
    const isLowPower = isLowPowerGated();

    const bypassGate =
      process.env.NODE_ENV !== "production" &&
      typeof window !== "undefined" &&
      window.location.search.includes("cubeTest");

    const handleLoadRequest = () => {
      setCanMount(true);
    };
    window.addEventListener("cube:load-requested", handleLoadRequest);

    if (isLowPower && !bypassGate) {
      // On low-power mobile devices, keep cube chunk unmounted until user clicks "Load 3D cube"
      return () => {
        window.removeEventListener("cube:load-requested", handleLoadRequest);
      };
    }

    // Mount triggers:
    // 1. Direct user interactions: pointerdown, touchstart, keydown
    // 2. Scroll interaction: mount on scroll ONLY if hero (#home) is in viewport (IntersectionObserver)
    // 3. Idle timeout: after 4 seconds of idle (requestIdleCallback after load + 4s timeout)
    let idleHandle: any = null;
    let timerHandle: any = null;
    let isTriggered = false;
    let isHeroInViewport = true;
    let observer: IntersectionObserver | null = null;

    const directEvents = ["pointerdown", "touchstart", "keydown"];

    function cleanup() {
      directEvents.forEach((evt) => {
        window.removeEventListener(evt, onDirectInteraction);
      });
      window.removeEventListener("scroll", onScroll);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      window.removeEventListener("load", scheduleIdleAfterLoad);
      if (timerHandle) clearTimeout(timerHandle);
      if (idleHandle && typeof window !== "undefined" && "cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(idleHandle);
      }
    }

    function triggerMount() {
      if (isTriggered) return;
      isTriggered = true;
      setCanMount(true);
      cleanup();
    }

    function onDirectInteraction() {
      triggerMount();
    }

    function onScroll() {
      if (isHeroInViewport) {
        triggerMount();
      }
    }

    // Set up IntersectionObserver on hero to gate scroll trigger
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const heroEl = document.getElementById("home");
      if (heroEl) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isHeroInViewport = entry.isIntersecting;
            });
          },
          { threshold: 0.05 }
        );
        observer.observe(heroEl);
      }
    }

    function scheduleIdleAfterLoad() {
      // after 4 seconds of idle (requestIdleCallback after load + 4s timeout)
      timerHandle = setTimeout(() => {
        if ("requestIdleCallback" in window) {
          idleHandle = (window as any).requestIdleCallback(
            () => triggerMount(),
            { timeout: 4000 }
          );
        } else {
          triggerMount();
        }
      }, 4000);
    }

    directEvents.forEach((evt) => {
      window.addEventListener(evt, onDirectInteraction, { passive: true, once: true });
    });
    window.addEventListener("scroll", onScroll, { passive: true });

    if (bypassGate) {
      triggerMount();
    } else if (document.readyState === "complete") {
      scheduleIdleAfterLoad();
    } else {
      window.addEventListener("load", scheduleIdleAfterLoad, { once: true });
    }

    return () => {
      window.removeEventListener("cube:load-requested", handleLoadRequest);
      cleanup();
    };
  }, [mode]);

  // If in classic mode or before interaction/idle, the real cube poster in HeroSection displays
  if (!canMount || mode === "classic") {
    return null;
  }

  return <CubeCanvas className={className} onCubeReady={onCubeReady} />;
}
