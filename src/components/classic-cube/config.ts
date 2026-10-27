/**
 * Classic Cube (Experimental View) Configuration
 * 
 * Centralized config for all cube sticker colors, section-to-face mappings,
 * animation timings, and 3D transform rotations.
 */

export interface CubeColor {
  name: string;
  hex: string;
  border?: string;
  text?: string;
}

export const CUBE_PALETTE = {
  green: { name: 'Green', hex: '#10AC84', text: '#FFFFFF', border: '#0A785C' },
  orange: { name: 'Orange', hex: '#FF9234', text: '#FFFFFF', border: '#D36A15' },
  white: { name: 'White', hex: '#E8ECF0', text: '#151518', border: '#CBD5E1' },
  red: { name: 'Red', hex: '#D63031', text: '#FFFFFF', border: '#991B1B' },
  yellow: { name: 'Yellow', hex: '#F5C518', text: '#151518', border: '#B48E08' },
  blue: { name: 'Blue', hex: '#2E86DE', text: '#FFFFFF', border: '#1B5CAB' },
  body: { name: 'Cube Body', hex: '#151518', text: '#FFFFFF' },
  primaryOrange: { name: 'Portfolio Orange', hex: '#C2410C' },
} as const;

export type SectionKey =
  | 'hero'
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'services'
  | 'cta'
  | 'contact';

export interface SectionMeta {
  id: SectionKey;
  label: string;
  faceName: string;
  color: CubeColor;
  cubeRotation: { x: number; y: number };
}

export const SECTION_METADATA: Record<SectionKey, SectionMeta> = {
  hero: {
    id: 'hero',
    label: 'Home',
    faceName: 'Isometric',
    color: CUBE_PALETTE.orange,
    cubeRotation: { x: -20, y: 30 },
  },
  about: {
    id: 'about',
    label: 'About Me',
    faceName: 'Front (Green)',
    color: CUBE_PALETTE.green,
    cubeRotation: { x: 0, y: 0 },
  },
  skills: {
    id: 'skills',
    label: 'Skills',
    faceName: 'Left (Orange)',
    color: CUBE_PALETTE.orange,
    cubeRotation: { x: 0, y: 90 },
  },
  experience: {
    id: 'experience',
    label: 'Experience',
    faceName: 'Top (White)',
    color: CUBE_PALETTE.white,
    cubeRotation: { x: -90, y: 0 },
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    faceName: 'Right (Red)',
    color: CUBE_PALETTE.red,
    cubeRotation: { x: 0, y: -90 },
  },
  services: {
    id: 'services',
    label: 'Services',
    faceName: 'Bottom (Yellow)',
    color: CUBE_PALETTE.yellow,
    cubeRotation: { x: 90, y: 0 },
  },
  cta: {
    id: 'cta',
    label: 'Get In Touch',
    faceName: 'Angle (Orange/Yellow)',
    color: CUBE_PALETTE.orange,
    cubeRotation: { x: 45, y: -45 },
  },
  contact: {
    id: 'contact',
    label: 'Contact',
    faceName: 'Back (Blue)',
    color: CUBE_PALETTE.blue,
    cubeRotation: { x: 0, y: 180 },
  },
};

export const ORDERED_SECTIONS: SectionKey[] = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'services',
  'cta',
  'contact',
];

export const ANIMATION_CONFIG = {
  tileFlipDurationMs: 460,
  tileFlipStaggerMs: 60,
  tileRotateDeg: 14,
  observerThreshold: 0.18,
  dividerStaggerMs: 50,
} as const;

export const CUBE_STICKER_RHYTHM: CubeColor[] = [
  CUBE_PALETTE.green,
  CUBE_PALETTE.orange,
  CUBE_PALETTE.white,
  CUBE_PALETTE.red,
  CUBE_PALETTE.yellow,
  CUBE_PALETTE.blue,
];
