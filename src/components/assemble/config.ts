/**
 * Assemble View Configuration
 * 
 * Centralized tunables for the experimental scroll-driven Rubik's cube assembly:
 * Track heights, phase breakpoints, scatter radius & seed, stagger spread,
 * camera dolly & orbit rotations, settle click effects, and visual styling.
 */

export const ASSEMBLE_CONFIG = {
  // 1. Scroll Track Heights
  trackHeightDesktop: "230vh", // ~220-230vh on desktop
  trackHeightMobile: "205vh",  // ~200-205vh on mobile

  // 2. Phase Breakpoints across scroll progress p in [0, 1]
  phaseFloatEnd: 0.10,     // [0.00, 0.10]: Idle drift / floating scattered pieces
  phaseFlyInStart: 0.10,   // 0.10: Pieces begin flying into place
  phaseFlyInEnd: 0.75,     // 0.75: All 27 pieces arrived and locked into 3x3x3 grid
  phaseSettleEnd: 0.90,    // [0.75, 0.90]: Whole cube settle overshoot & rotation to front face
  phaseStableEnd: 1.00,    // [0.90, 1.00]: Solved, stable, with interactive hint pulse

  // 3. Scatter Geometry & Seed (Deterministic)
  seed: 42,
  scatterRadiusMin: 6.2,   // Sphere minimum radius
  scatterRadiusMax: 8.4,   // Sphere maximum radius
  spiralPitch: 0.85,       // Height flattening factor for spherical spiral

  // 4. Stagger & Piece Travel
  staggerSpread: 0.38,     // Stagger spread window across the 27 pieces
  pieceTravelDuration: 0.30, // Local progress span each piece spends flying
  
  // 5. Settle "Click" Effect (Progress-driven scale 1.06 -> 1.0 upon lock)
  settleClickDuration: 0.04, // Progress window for scale pop
  settleClickScale: 1.06,    // Peak scale multiplier when piece clicks into place

  // 6. Whole Cube Settle Overshoot (Phase 3)
  cubeOvershootScale: 0.035, // Peak scale bounce during whole-cube settle

  // 7. Camera Dolly & Rotation
  cameraFov: 42,
  cameraDollyStart: 14.5,  // Camera distance at p = 0 (wide view of floating field)
  cameraDollyEnd: 9.2,     // Camera distance at p = 1 (intimate view of assembled cube)
  cameraDollyMobileStart: 16.0,
  cameraDollyMobileEnd: 11.8,
  totalRotationY: Math.PI, // 1/2 turn (180 degrees) continuous rotation tied to p
  cameraInitialElevation: 0.35, // Slight upward angle so top and front faces are visible

  // 8. World Offsets (Desktop sits right of text; mobile stays centered)
  desktopCubeOffsetX: 3.1, // Cleanly placed in the right half of desktop viewport
  desktopCubeOffsetY: 0.1,
  mobileCubeOffsetX: 0.0,
  mobileCubeOffsetY: -0.35,

  // 9. Idle Floating Drift (Phase 1)
  driftFrequency: 1.25,
  driftAmplitude: 0.16,

  // 10. Interactive Glow / Pulse (Phase 4 on Front face)
  pulseFrequency: 3.2,
  pulseMaxIntensity: 0.35,

  // 11. Persistent Cube Tunables (Sections 1-6)
  persistentCubeDesktopSize: 310, // px diameter on desktop
  persistentCubeMobileSize: 104,  // px diameter on mobile
  persistentCubeLerpSpeed: 0.08,  // Slerp/lerp speed for smooth face transitions
  cardTiltMaxDeg: 7,              // Subtle 3D tilt max degrees on hover
  cardPerspective: 900,           // Perspective depth in px
} as const;

export type AssembleConfig = typeof ASSEMBLE_CONFIG;

export interface AssembleSectionDef {
  id: string;
  moveNumber: number; // 1 to 6
  face: "F" | "L" | "U" | "R" | "D" | "B";
  faceLabel: string;
  title: string;
  subtitle: string;
  navLabel: string;
  accentHex: string;
  accentRgb: string;
  bgTint: string;
  borderAccent: string;
  targetRotation: [number, number, number]; // [rotX, rotY, rotZ]
  desktopSide: "left" | "right" | "center";
  decalName: "react" | "javascript" | "nodejs" | "nestjs" | "postgres" | "html";
}

export const ASSEMBLE_SECTIONS: AssembleSectionDef[] = [
  {
    id: "about",
    moveNumber: 1,
    face: "F",
    faceLabel: "Face F · Front Face",
    title: "ABOUT ME",
    subtitle: "My journey, core philosophy, and drive for building impactful digital products.",
    navLabel: "About",
    accentHex: "#10AC84", // Minty Emerald Green
    accentRgb: "16, 172, 132",
    bgTint: "rgba(16, 172, 132, 0.045)",
    borderAccent: "rgba(16, 172, 132, 0.8)",
    targetRotation: [0.18, 0.22, 0.0],
    desktopSide: "right",
    decalName: "react",
  },
  {
    id: "skills",
    moveNumber: 2,
    face: "L",
    faceLabel: "Face L · Left Face",
    title: "TOOLS & TECHNOLOGIES",
    subtitle: "The tech stack and workflow tools I use to architect full-stack digital products.",
    navLabel: "Skills",
    accentHex: "#FF9234", // Amber Orange
    accentRgb: "255, 146, 52",
    bgTint: "rgba(255, 146, 52, 0.045)",
    borderAccent: "rgba(255, 146, 52, 0.8)",
    targetRotation: [0.18, 1.77, 0.0],
    desktopSide: "left",
    decalName: "javascript",
  },
  {
    id: "experience",
    moveNumber: 3,
    face: "U",
    faceLabel: "Face U · Top Face",
    title: "EXPERIENCE & EDUCATION",
    subtitle: "My professional work history, internships, and educational qualifications.",
    navLabel: "Experience",
    accentHex: "#64748B", // Slate Outline for Top White Face
    accentRgb: "100, 116, 139",
    bgTint: "rgba(100, 116, 139, 0.045)",
    borderAccent: "rgba(100, 116, 139, 0.8)",
    targetRotation: [1.45, 0.22, 0.0],
    desktopSide: "right",
    decalName: "nodejs",
  },
  {
    id: "projects",
    moveNumber: 4,
    face: "R",
    faceLabel: "Face R · Right Face",
    title: "SELECTED WORK",
    subtitle: "Full-stack web applications, platforms, and interactive interfaces built for real users.",
    navLabel: "Projects",
    accentHex: "#D63031", // Crimson Red
    accentRgb: "214, 48, 49",
    bgTint: "rgba(214, 48, 49, 0.045)",
    borderAccent: "rgba(214, 48, 49, 0.8)",
    targetRotation: [0.18, -1.37, 0.0],
    desktopSide: "left",
    decalName: "nestjs",
  },
  {
    id: "services",
    moveNumber: 5,
    face: "D",
    faceLabel: "Face D · Bottom Face",
    title: "WHAT I CAN DO",
    subtitle: "From frontend architecture to scalable backend systems, I build all the pieces required for high-performing web platforms.",
    navLabel: "Services",
    accentHex: "#F5C518", // Sunflower Yellow
    accentRgb: "245, 197, 24",
    bgTint: "rgba(245, 197, 24, 0.05)",
    borderAccent: "rgba(245, 197, 24, 0.85)",
    targetRotation: [-1.45, 0.22, 0.0],
    desktopSide: "right",
    decalName: "postgres",
  },
  {
    id: "contact",
    moveNumber: 6,
    face: "B",
    faceLabel: "Face B · Back Face",
    title: "LET'S BUILD SOMETHING",
    subtitle: "Have an idea, a project, or a problem that needs solving? I’d love to hear about it.",
    navLabel: "Contact",
    accentHex: "#2E86DE", // Tech Cobalt Blue
    accentRgb: "46, 134, 222",
    bgTint: "rgba(46, 134, 222, 0.05)",
    borderAccent: "rgba(46, 134, 222, 0.85)",
    targetRotation: [0.18, 3.34, 0.0],
    desktopSide: "center",
    decalName: "html",
  },
];
