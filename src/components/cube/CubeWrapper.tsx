"use client";

import dynamic from "next/dynamic";
import React from "react";

// Client-only dynamic import with ssr: false so server components and static export build cleanly
const CubeCanvas = dynamic(() => import("./CubeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center gap-3 text-gray-500">
      <div className="w-10 h-10 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
      <span className="text-xs uppercase tracking-widest font-mono text-gray-400">Loading 3D Canvas...</span>
    </div>
  ),
});

interface CubeWrapperProps {
  className?: string;
  onCubeReady?: (instance: any) => void;
}

export default function CubeWrapper({ className = "", onCubeReady }: CubeWrapperProps) {
  return <CubeCanvas className={className} onCubeReady={onCubeReady} />;
}
