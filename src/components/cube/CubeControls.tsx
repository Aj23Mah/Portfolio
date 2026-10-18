"use client";

import React from "react";
import {
  IconRotateClockwise,
  IconArrowsShuffle,
  IconArrowBackUp,
  IconRefresh,
  IconLoader2,
  IconSparkles,
} from "@tabler/icons-react";
import { MoveController, MoveStats } from "./moves";

interface CubeControlsProps {
  controller: MoveController | null;
  stats: MoveStats;
  showDecals?: boolean;
  onToggleDecals?: () => void;
  onScramble: () => void;
  onAutoSolve: () => void;
  onUndo: () => void;
  onReset: () => void;
  onCancelAutoSolve?: () => void;
}

export default function CubeControls({
  controller,
  stats,
  showDecals = true,
  onToggleDecals,
  onScramble,
  onAutoSolve,
  onUndo,
  onReset,
  onCancelAutoSolve,
}: CubeControlsProps) {
  const isAnimating = controller?.isAnimating() ?? false;
  const isAutoSolving = stats.isAutoSolving;
  const canUndo = stats.historyLength > 0 && !isAnimating && !isAutoSolving;
  const canAutoSolve = stats.historyLength > 0 && !isAnimating && !isAutoSolving;

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[460px] mx-auto mt-3 select-none">
      {/* Action Buttons Toolbar */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-800 shadow-xl w-full">
        {/* Scramble Button */}
        <button
          id="cube-scramble-btn"
          onClick={onScramble}
          disabled={isAnimating || isAutoSolving}
          aria-label="Scramble the cube with 5 random moves"
          title="Scramble 5 random moves"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition duration-150 cursor-pointer"
        >
          <IconArrowsShuffle size={16} className="text-orange-400" />
          <span>Scramble</span>
        </button>

        {/* Auto-Solve / Solving status Button */}
        {isAutoSolving ? (
          <button
            id="cube-cancel-autosolve-btn"
            onClick={onCancelAutoSolve}
            aria-label="Cancel auto-solve and keep remaining unsolved moves"
            title="Click to cancel auto-solve"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/80 transition duration-150 cursor-pointer animate-pulse"
          >
            <IconLoader2 size={16} className="animate-spin text-emerald-400" />
            <span>Solving...</span>
          </button>
        ) : (
          <button
            id="cube-autosolve-btn"
            onClick={onAutoSolve}
            disabled={!canAutoSolve}
            aria-label="Auto-solve the cube back to initial state"
            title="Replay inverse sequence to solve the cube"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition duration-150 cursor-pointer"
          >
            <IconRotateClockwise size={16} className="text-emerald-400" />
            <span>Auto-Solve</span>
          </button>
        )}

        {/* Undo Button */}
        <button
          id="cube-undo-btn"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo last move"
          title="Undo last move"
          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition duration-150 cursor-pointer"
        >
          <IconArrowBackUp size={16} className="text-blue-400" />
          <span className="hidden sm:inline">Undo</span>
        </button>

        {/* Reset Button */}
        <button
          id="cube-reset-btn"
          onClick={onReset}
          disabled={isAnimating || isAutoSolving}
          aria-label="Reset cube to solved state and clear history"
          title="Reset to solved state"
          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition duration-150 cursor-pointer"
        >
          <IconRefresh size={16} className="text-yellow-400" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Decals Toggle Button */}
        {onToggleDecals && (
          <button
            id="cube-decals-btn"
            onClick={onToggleDecals}
            aria-label={`Toggle non-center tech decals ${showDecals ? "off" : "on"}`}
            title={`Toggle subtle tech decals (${showDecals ? "Active" : "Hidden"})`}
            className={`flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer border ${
              showDecals
                ? "bg-purple-950/60 text-purple-300 border-purple-800/60 hover:bg-purple-900/80"
                : "text-gray-400 border-transparent hover:text-white hover:bg-gray-800"
            }`}
          >
            <IconSparkles size={16} className={showDecals ? "text-purple-400" : "text-gray-400"} />
            <span className="hidden sm:inline">Decals</span>
          </button>
        )}
      </div>

      {/* Stats Counter & Keyboard Shortcut Hint */}
      <div className="flex items-center justify-between w-full px-2 text-[11px] font-mono text-gray-400">
        <div className="flex items-center gap-2">
          <span>Moves:</span>
          <span className="bg-gray-800/90 text-orange-400 font-bold px-2 py-0.5 rounded-full border border-gray-700">
            {stats.userMoves}
          </span>
          {stats.historyLength > stats.userMoves && (
            <span className="text-gray-500 text-[10px]" title="Total moves including scramble/undo">
              (total: {stats.historyLength})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="hidden sm:inline text-gray-400">Keys:</span>
          <span className="font-semibold text-gray-300">U D L R F B</span>
          <span className="text-[10px] text-gray-400">(+Shift for &apos;)</span>
        </div>
      </div>
    </div>
  );
}
