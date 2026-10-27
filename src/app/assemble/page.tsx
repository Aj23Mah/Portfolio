import type { Metadata } from "next";
import AssembleView from "@/components/assemble/AssembleView";

export const metadata: Metadata = {
  title: "Assemble (Experimental View) — Ajay Kumar Maharjan",
  description:
    "Experience the experimental Assemble view of Ajay Kumar Maharjan's portfolio: a scroll-driven 3D Rubik's cube assembly where floating cubies fly together and lock into a solved cube.",
};

export default function AssemblePage() {
  return <AssembleView />;
}
