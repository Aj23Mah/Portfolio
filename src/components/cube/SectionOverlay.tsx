"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconArrowLeft, IconX } from "@tabler/icons-react";
import About from "@/components/landing/About";
import Work from "@/components/landing/Work";
import Tools from "@/components/landing/Tools";
import Experience from "@/components/landing/Experience";
import Service from "@/components/landing/Service";
import Contact from "@/components/landing/Contact";

export interface SectionOverlayProps {
  isOpen: boolean;
  sectionId: string | null;
  onClose: () => void;
  triggerElement?: HTMLElement | null;
}

const SECTION_TITLES: Record<string, string> = {
  about: "About Me",
  projects: "Featured Projects",
  skills: "Skills & Tech Stack",
  experience: "Work Experience & Certifications",
  services: "Services & Capabilities",
  contact: "Let's Connect",
};

export default function SectionOverlay({
  isOpen,
  sectionId,
  onClose,
  triggerElement,
}: SectionOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Manage focus restoration and inert background
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = triggerElement || (document.activeElement as HTMLElement);

      // Apply inert to main content in background (portalled dialog outside main-content stays interactive!)
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.setAttribute("inert", "");
      }

      // Focus initial interactive element
      setTimeout(() => {
        backButtonRef.current?.focus();
      }, 50);

      // Lock body scroll while overlay is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        if (mainContent) {
          mainContent.removeAttribute("inert");
        }
        document.body.style.overflow = originalOverflow;
        previouslyFocusedRef.current?.focus();
      };
    }
  }, [isOpen, triggerElement]);

  // 2. Keyboard listeners: Esc key to close, Tab key focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!dialogRef.current) return;
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !sectionId || !mounted) {
    return null;
  }

  const title = SECTION_TITLES[sectionId] || sectionId.toUpperCase();

  // Render exactly the active section component with idPrefix="overlay"
  // to avoid duplicate IDs in the DOM and guarantee no duplicate contact forms
  const renderActiveSection = () => {
    switch (sectionId) {
      case "about":
        return <About idPrefix="overlay" />;
      case "projects":
        return <Work idPrefix="overlay" />;
      case "skills":
        return <Tools idPrefix="overlay" />;
      case "experience":
        return <Experience idPrefix="overlay" />;
      case "services":
        return <Service idPrefix="overlay" />;
      case "contact":
        return <Contact idPrefix="overlay" />;
      default:
        return null;
    }
  };

  const overlayContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      ref={dialogRef}
      className="fixed inset-0 z-50 flex justify-end items-stretch pointer-events-auto"
    >
      {/* 
        Dimmed Backdrop:
        Keeps 3D cube scene visible and dimmed behind it.
        Clicking backdrop closes the overlay.
      */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 
        Slide-in Section Panel:
        Full-screen sheet on mobile devices (<768px) with safe-area padding;
        Slide-in drawer on tablet/desktop (w-[70vw] lg:w-[60vw] xl:w-[52vw]).
      */}
      <div className="relative z-10 w-full md:w-[70vw] lg:w-[60vw] xl:w-[52vw] h-full bg-white dark:bg-gray-950 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Sticky Header with Safe-Area Top Padding */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 pt-[max(1rem,env(safe-area-inset-top,0px))] bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 shadow-sm shrink-0">
          <button
            ref={backButtonRef}
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:text-orange-600 transition px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            aria-label="Back to 3D cube exploration"
          >
            <IconArrowLeft size={16} />
            <span>Back to Cube</span>
          </button>

          <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-semibold hidden sm:inline-block">
            {sectionId.toUpperCase()}
          </span>

          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <IconX size={20} />
          </button>
        </header>

        {/* Scrollable Section Content Container with Momentum Scroll & Safe-Area Bottom Padding */}
        <div
          tabIndex={0}
          style={{ WebkitOverflowScrolling: "touch" }}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-[max(2rem,calc(1.5rem+env(safe-area-inset-bottom,0px)))] focus:outline-none"
        >
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(overlayContent, document.body)
    : null;
}
