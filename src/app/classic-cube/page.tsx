import type { Metadata } from "next";
import ClassicCubeView from "@/components/classic-cube/ClassicCubeView";

export const metadata: Metadata = {
  title: "Classic Cube (Experimental View) — Ajay Kumar Maharjan",
  description:
    "Explore the experimental Classic Cube view of Ajay Kumar Maharjan's portfolio, featuring a scrollable full-stack showcase with subtle 3D Rubik's cube scroll reveals and progress tracking.",
};

export default function ClassicCubePage() {
  return <ClassicCubeView />;
}
