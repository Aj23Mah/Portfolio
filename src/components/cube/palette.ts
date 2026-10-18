export type CubeFace = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';

export interface StickerColorInfo {
  face: CubeFace;
  name: string;
  hex: string;
  normal: [number, number, number]; // outward normal in local cube coordinates
  description: string;
}

export const CUBE_PALETTE: Record<CubeFace, StickerColorInfo> = {
  U: {
    face: 'U',
    name: 'White',
    hex: '#E8ECF0',
    normal: [0, 1, 0],
    description: 'Slate off-white (Top face)',
  },
  D: {
    face: 'D',
    name: 'Yellow',
    hex: '#F5C518',
    normal: [0, -1, 0],
    description: 'Matte sunflower yellow (Bottom face)',
  },
  L: {
    face: 'L',
    name: 'Orange',
    hex: '#FF9234',
    normal: [-1, 0, 0],
    description: 'Vibrant luminous amber-orange (Left face - distinct from portfolio #C2410C)',
  },
  R: {
    face: 'R',
    name: 'Red',
    hex: '#D63031',
    normal: [1, 0, 0],
    description: 'Crimson red (Right face)',
  },
  F: {
    face: 'F',
    name: 'Green',
    hex: '#10AC84',
    normal: [0, 0, 1],
    description: 'Minty emerald green (Front face)',
  },
  B: {
    face: 'B',
    name: 'Blue',
    hex: '#2E86DE',
    normal: [0, 0, -1],
    description: 'Tech cobalt blue (Back face)',
  },
};

export const CUBIE_BODY_COLOR = '#151518'; // Deep matte zinc black
export const PORTFOLIO_PRIMARY_COLOR = '#C2410C'; // Burnt rust orange for comparison
