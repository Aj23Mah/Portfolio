"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  IconTerminal2,
  IconCheck,
  IconCopy,
  IconX,
  IconLockOpen,
  IconSparkles,
  IconExternalLink,
  IconBrandGithub,
} from "@tabler/icons-react";

export interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: number;
  timeMs: number;
  cubeContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export const LOCAL_STORAGE_KEY = "portfolio_cube_solved_secret";

// DevTools ASCII art cube (logged once only per session)
let asciiLogged = false;
export function logDevToolsAsciiCube(): void {
  if (asciiLogged || typeof window === "undefined") return;
  asciiLogged = true;

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `%c
   +------+
  /      /|
 +------+ |
 |  🎲  | +
 | AJAY |/
 +------+
%c✨ You found the Rubik's Cube DevTools console!
Solve the 3D hero cube to trigger the secret developer build terminal,
or invoke window.__triggerEasterEgg() in development to inspect the secret!`,
      "color: #ff9234; font-weight: bold; font-family: monospace; font-size: 14px;",
      "color: #10ac84; font-family: sans-serif; font-size: 12px;"
    );
  } else {
    console.log(
      `%c
   +------+
  /      /|
 +------+ |
 |  🎲  | +
 | AJAY |/
 +------+
%c✨ Welcome to Ajay's portfolio! Solve the 3D hero cube to unlock the developer build terminal.`,
      "color: #ff9234; font-weight: bold; font-family: monospace; font-size: 14px;",
      "color: #10ac84; font-family: sans-serif; font-size: 12px;"
    );
  }
}

export default function EasterEggModal({
  isOpen,
  onClose,
  moves,
  timeMs,
  cubeContainerRef,
}: EasterEggModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [typedText, setTypedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "⚠️ [Portfolio Notice] Easter egg modal contains placeholder content ('Autonomous Neural Code Engine'). Update before official release!"
      );
    }
  }, []);

  // Format elapsed time (e.g., "1m 14s" or "24.6s")
  const formattedTime = (() => {
    const totalSeconds = Math.max(0.1, timeMs / 1000);
    if (totalSeconds >= 60) {
      const minutes = Math.floor(totalSeconds / 60);
      const remainingSeconds = Math.round(totalSeconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${totalSeconds.toFixed(1)}s`;
  })();

  const fullTerminalText = `> npm run solve:cube\n[OPTIMIZER] Analyzing 3D layer state... OK\n[VERIFIER] 6/6 faces verified uniform. Orientation: valid.\n✔ build succeeded in ${moves} moves, ${formattedTime}.\n[REVEAL] Access granted: Developer Secret unlocked.`;

  // Typing animation with cleanup and reduced-motion support
  useEffect(() => {
    if (!isOpen) {
      setTypedText("");
      setTypingComplete(false);
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setTypedText(fullTerminalText);
      setTypingComplete(true);
      return;
    }

    let currentIndex = 0;
    let timerId: NodeJS.Timeout | null = null;

    const typeNextChar = () => {
      if (currentIndex <= fullTerminalText.length) {
        setTypedText(fullTerminalText.slice(0, currentIndex));
        currentIndex++;
        const delay = fullTerminalText[currentIndex - 1] === "\n" ? 120 : 18;
        timerId = setTimeout(typeNextChar, delay);
      } else {
        setTypingComplete(true);
      }
    };

    timerId = setTimeout(typeNextChar, 100);

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isOpen, fullTerminalText]);

  // Focus trap and Escape key listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Auto focus the close button or modal container
      setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector<HTMLElement>("button");
        closeBtn?.focus();
      }, 50);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Return focus to cube container on modal close
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      cubeContainerRef?.current?.focus();
    }, 50);
  };

  // Copy result to clipboard with fallback
  const handleCopyResult = async () => {
    const textToCopy = `🎲 Solved Ajay's 3D Portfolio Rubik's Cube in ${moves} moves, ${formattedTime}! Check it out: https://ajayakumarmaharjan.com.np/`;
    let success = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } catch {
        success = false;
      }
    }

    // Fallback if clipboard API is blocked or document is not focused
    if (!success) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {
        // Fallback for sandboxed environments
      }
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="easter-egg-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-[#0d1117] text-gray-200 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden font-mono text-sm flex flex-col max-h-[90vh]"
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-xs font-semibold text-gray-400 flex items-center gap-1.5">
              <IconTerminal2 size={16} className="text-emerald-400" />
              cube-solver@ajay-portfolio:~
            </span>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close terminal"
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Terminal Output Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Animated Typed Text */}
          <div className="bg-black/60 rounded-xl p-4 border border-gray-800/80 text-emerald-400 whitespace-pre-line leading-relaxed text-xs sm:text-sm">
            {typedText}
            {!typingComplete && (
              <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle" />
            )}
          </div>

          {/* Reveal Content (Appears once typed or immediately on reduced-motion) */}
          {typingComplete && (
            <div className="space-y-6 animate-fadeIn">
              {/* Stat Summary & Copy Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-gray-900/60 border border-gray-800">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Moves</span>
                    <span className="text-xl font-bold text-orange-400">{moves}</span>
                  </div>
                  <div className="h-8 w-px bg-gray-800" />
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Time</span>
                    <span className="text-xl font-bold text-emerald-400">{formattedTime}</span>
                  </div>
                </div>

                <button
                  onClick={handleCopyResult}
                  className="flex items-center gap-2 py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-sans text-xs font-bold transition shadow-md cursor-pointer"
                >
                  {copied ? (
                    <>
                      <IconCheck size={16} /> Copied Result!
                    </>
                  ) : (
                    <>
                      <IconCopy size={16} /> Copy Result
                    </>
                  )}
                </button>
              </div>

              {/* Dev-only warning if placeholder content is still present */}
              {process.env.NODE_ENV !== "production" && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-300 text-xs font-mono flex items-start gap-2">
                  <span className="text-base leading-none">⚠️</span>
                  <div>
                    <strong className="block text-amber-200">Dev Notice: Placeholder Content</strong>
                    This modal is displaying placeholder content. Fill in your real secret project details and links in EasterEggModal.tsx (look for TODO comments).
                  </div>
                </div>
              )}

              {/* Secret Project Card */}
              {/* TODO: Ajay - Replace the placeholder below with your secret project or exclusive case study */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-gray-900 to-[#12161f] border border-orange-500/40 shadow-lg relative overflow-hidden group">
                <div className="absolute top-3 right-3 text-xs uppercase tracking-widest px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                  <IconSparkles size={12} />
                  Secret Project
                </div>

                <h3 id="easter-egg-title" className="text-lg font-bold text-white mb-1">
                  {/* TODO: Ajay - Insert Secret Project Title */}
                  Autonomous Neural Code Engine (Preview)
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
                  {/* TODO: Ajay - Insert Secret Project Description */}
                  An experimental algorithmic tool developed to analyze and automate reactive UI state machines in real time. Unlocked exclusively for developers who solve the cube!
                </p>

                <div className="flex flex-wrap items-center gap-3 font-sans text-xs">
                  {/* TODO: Ajay - Update link to your secret repo or live demo */}
                  <a
                    href="https://github.com/Aj23Mah"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold transition border border-gray-700"
                  >
                    <IconBrandGithub size={15} />
                    <span>View Secret Repo</span>
                    <IconExternalLink size={13} />
                  </a>

                  {/* Hidden Contact Link */}
                  {/* TODO: Ajay - Update direct private email or secret calendar link */}
                  <a
                    href={`mailto:ajaymaharjan758@gmail.com?subject=Cube%20Solved%20Easter%20Egg%20(${moves}%20moves)&body=Hi%20Ajay,%20I%20solved%20your%20portfolio%20Rubik's%20cube%20in%20${moves}%20moves!`}
                    className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 font-semibold transition border border-orange-500/30"
                  >
                    <IconLockOpen size={15} />
                    <span>Secret Direct Inquiry →</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
