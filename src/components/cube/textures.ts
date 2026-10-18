import * as THREE from 'three';
import { CubeFace, CUBE_PALETTE } from './palette';

export interface SectionMetadata {
  face: CubeFace;
  sectionId: string;
  title: string;
}

export const CUBE_SECTIONS: Record<CubeFace, SectionMetadata> = {
  F: { face: 'F', sectionId: 'about', title: 'ABOUT' },
  R: { face: 'R', sectionId: 'projects', title: 'PROJECTS' },
  L: { face: 'L', sectionId: 'skills', title: 'SKILLS' },
  U: { face: 'U', sectionId: 'experience', title: 'EXPERIENCE' },
  D: { face: 'D', sectionId: 'services', title: 'SERVICES' },
  B: { face: 'B', sectionId: 'contact', title: 'CONTACT' },
};

/**
 * Ajay's verified core tech stack (no Python, Docker, etc.)
 */
export const TECH_DECALS = [
  'html',
  'css',
  'javascript',
  'react',
  'nextjs',
  'nodejs',
  'nestjs',
  'postgres',
  'tailwind',
] as const;

export type TechDecalName = (typeof TECH_DECALS)[number];

/**
 * Creates high-DPI canvas texture for a center sticker.
 * Displays pure face background (matching plain stickers without darkening),
 * prominent crisp vector icon, and clean section title.
 */
export function createCenterTexture(face: CubeFace, maxAnisotropy = 4): THREE.CanvasTexture | THREE.Texture {
  if (typeof document === 'undefined') {
    return new THREE.Texture();
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context for center texture');
  }

  const section = CUBE_SECTIONS[face];
  const bgHex = CUBE_PALETTE[face].hex;

  // Decide high-contrast foreground color based on face luminance
  const isLightFace = face === 'U' || face === 'D';
  const fgColor = isLightFace ? '#18181B' : '#FFFFFF';
  const borderCol = isLightFace ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.20)';

  // 1. Pure solid face background fill (exact match with plain stickers)
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Subtle rounded inner card border
  ctx.save();
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 10;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(24, 24, 464, 464, 38);
  } else {
    ctx.rect(24, 24, 464, 464);
  }
  ctx.stroke();
  ctx.restore();

  // 3. Draw vector icon centered prominently in upper-middle area
  ctx.save();
  ctx.strokeStyle = fgColor;
  ctx.fillStyle = fgColor;
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (!isLightFace) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
  }

  drawSectionIcon(ctx, face, 256, 215);
  ctx.restore();

  // 4. Section Title Typography (clean, bold, no subtitle, no tap-to-explore text)
  ctx.save();
  ctx.fillStyle = fgColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (!isLightFace) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
  }

  ctx.font = '800 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(section.title, 256, 375);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.max(1, maxAnisotropy);
  texture.needsUpdate = true;

  return texture;
}

/**
 * Draws crisp vector icon for each section face.
 */
function drawSectionIcon(ctx: CanvasRenderingContext2D, face: CubeFace, cx: number, cy: number): void {
  switch (face) {
    case 'F': {
      // About: User Silhouette
      // Head
      ctx.beginPath();
      ctx.arc(cx, cy - 36, 34, 0, Math.PI * 2);
      ctx.fill();
      // Shoulders
      ctx.beginPath();
      ctx.arc(cx, cy + 54, 52, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.lineTo(cx + 46, cy + 60);
      ctx.arcTo(cx, cy + 32, cx - 46, cy + 60, 52);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'R': {
      // Projects: Code Brackets < / >
      // Left bracket <
      ctx.beginPath();
      ctx.moveTo(cx - 38, cy - 40);
      ctx.lineTo(cx - 78, cy);
      ctx.lineTo(cx - 38, cy + 40);
      ctx.stroke();
      // Slash /
      ctx.beginPath();
      ctx.moveTo(cx + 16, cy - 46);
      ctx.lineTo(cx - 16, cy + 46);
      ctx.stroke();
      // Right bracket >
      ctx.beginPath();
      ctx.moveTo(cx + 38, cy - 40);
      ctx.lineTo(cx + 78, cy);
      ctx.lineTo(cx + 38, cy + 40);
      ctx.stroke();
      break;
    }
    case 'L': {
      // Skills: Lightning Bolt
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy - 58);
      ctx.lineTo(cx - 50, cy + 2);
      ctx.lineTo(cx - 4, cy + 2);
      ctx.lineTo(cx - 18, cy + 58);
      ctx.lineTo(cx + 50, cy - 6);
      ctx.lineTo(cx + 4, cy - 6);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'U': {
      // Experience: Briefcase
      const bw = 114;
      const bh = 72;
      const bx = cx - bw / 2;
      const by = cy - 16;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(bx, by, bw, bh, 14);
      } else {
        ctx.rect(bx, by, bw, bh);
      }
      ctx.stroke();
      // Handle
      ctx.beginPath();
      ctx.moveTo(cx - 26, by);
      ctx.lineTo(cx - 26, by - 24);
      ctx.lineTo(cx + 26, by - 24);
      ctx.lineTo(cx + 26, by);
      ctx.stroke();
      // Latch line
      ctx.beginPath();
      ctx.moveTo(bx, by + 26);
      ctx.lineTo(bx + bw, by + 26);
      ctx.stroke();
      break;
    }
    case 'D': {
      // Services: Diamond Star / Sparkles
      ctx.beginPath();
      ctx.moveTo(cx, cy - 54);
      ctx.quadraticCurveTo(cx, cy, cx + 54, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy + 54);
      ctx.quadraticCurveTo(cx, cy, cx - 54, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy - 54);
      ctx.closePath();
      ctx.fill();
      // Satellite sparkle
      const sx = cx + 58;
      const sy = cy - 40;
      ctx.beginPath();
      ctx.moveTo(sx, sy - 20);
      ctx.quadraticCurveTo(sx, sy, sx + 20, sy);
      ctx.quadraticCurveTo(sx, sy, sx, sy + 20);
      ctx.quadraticCurveTo(sx, sy, sx - 20, sy);
      ctx.quadraticCurveTo(sx, sy, sx, sy - 20);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'B': {
      // Contact: Mail Envelope
      const ew = 114;
      const eh = 74;
      const ex = cx - ew / 2;
      const ey = cy - eh / 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(ex, ey, ew, eh, 12);
      } else {
        ctx.rect(ex, ey, ew, eh);
      }
      ctx.stroke();
      // Flap folds
      ctx.beginPath();
      ctx.moveTo(ex + 4, ey + 4);
      ctx.lineTo(cx, cy + 12);
      ctx.lineTo(ex + ew - 4, ey + 4);
      ctx.stroke();
      break;
    }
  }
}

/**
 * Creates subtle tech logo decal texture for non-center stickers.
 *
 * Canvas is solid white with logo drawn in dark charcoal at ~18% opacity.
 * When applied to MeshStandardMaterial (diffuseColor *= sampledDiffuseColor),
 * the white canvas leaves the original sticker color completely vibrant,
 * ensuring White, Yellow, and Orange remain easily distinguishable.
 */
export function createTechDecalTexture(tech: TechDecalName, maxAnisotropy = 4): THREE.CanvasTexture | THREE.Texture {
  if (typeof document === 'undefined') {
    return new THREE.Texture();
  }
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context for decal texture');
  }

  // 1. Pure white base (multiplies to 100% of material.color)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 256, 256);

  // 2. Logo drawn in subtle dark charcoal at ~15% opacity for maximum color legibility
  ctx.save();
  ctx.fillStyle = 'rgba(24, 24, 27, 0.15)';
  ctx.strokeStyle = 'rgba(24, 24, 27, 0.15)';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const cx = 128;
  const cy = 128;

  switch (tech) {
    case 'html': {
      // HTML5 Shield
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(cx - 52, cy - 64);
      ctx.lineTo(cx + 52, cy - 64);
      ctx.lineTo(cx + 42, cy + 44);
      ctx.lineTo(cx, cy + 64);
      ctx.lineTo(cx - 42, cy + 44);
      ctx.closePath();
      ctx.stroke();

      // Bold number '5'
      ctx.font = '900 68px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('5', cx, cy + 2);
      break;
    }
    case 'css': {
      // CSS3 Shield
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(cx - 52, cy - 64);
      ctx.lineTo(cx + 52, cy - 64);
      ctx.lineTo(cx + 42, cy + 44);
      ctx.lineTo(cx, cy + 64);
      ctx.lineTo(cx - 42, cy + 44);
      ctx.closePath();
      ctx.stroke();

      // Bold number '3'
      ctx.font = '900 68px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('3', cx, cy + 2);
      break;
    }
    case 'javascript': {
      // JS Rounded Badge
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(cx - 64, cy - 64, 128, 128, 20);
      } else {
        ctx.rect(cx - 64, cy - 64, 128, 128);
      }
      ctx.stroke();

      // Bold 'JS'
      ctx.font = '900 60px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('JS', cx, cy + 4);
      break;
    }
    case 'react': {
      // Center nucleus
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();

      // 3 overlapping orbits
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 68, 26, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      break;
    }
    case 'nextjs': {
      // Circle badge
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.stroke();

      // N monogram
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(cx - 32, cy - 38);
      ctx.lineTo(cx - 32, cy + 42);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 32, cy - 38);
      ctx.lineTo(cx + 34, cy + 42);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 32, cy - 20);
      ctx.lineTo(cx + 32, cy + 42);
      ctx.stroke();
      break;
    }
    case 'nodejs': {
      // Node Hexagon
      const r = 68;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Inner 'NODE'
      ctx.font = '900 36px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '1px';
      ctx.fillText('NODE', cx, cy + 2);
      break;
    }
    case 'nestjs': {
      // NestJS Cat Crest
      ctx.lineWidth = 10;
      ctx.beginPath();
      // Shield with cat ears
      ctx.moveTo(cx - 50, cy - 30);
      ctx.lineTo(cx - 40, cy - 64); // left ear tip
      ctx.lineTo(cx - 16, cy - 42);
      ctx.lineTo(cx + 16, cy - 42);
      ctx.lineTo(cx + 40, cy - 64); // right ear tip
      ctx.lineTo(cx + 50, cy - 30);
      ctx.quadraticCurveTo(cx + 50, cy + 30, cx, cy + 64);
      ctx.quadraticCurveTo(cx - 50, cy + 30, cx - 50, cy - 30);
      ctx.closePath();
      ctx.stroke();

      ctx.font = '900 34px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('NEST', cx, cy + 6);
      break;
    }
    case 'postgres': {
      // PostgreSQL Database Cylinder Stack
      ctx.lineWidth = 10;
      const dw = 110;
      const dh = 24;
      const dx = cx - dw / 2;

      // Top oval
      ctx.beginPath();
      ctx.ellipse(cx, cy - 40, dw / 2, dh / 2, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Middle tier
      ctx.beginPath();
      ctx.moveTo(dx, cy - 40);
      ctx.lineTo(dx, cy);
      ctx.ellipse(cx, cy, dw / 2, dh / 2, 0, 0, Math.PI);
      ctx.lineTo(dx + dw, cy - 40);
      ctx.stroke();

      // Bottom tier
      ctx.beginPath();
      ctx.moveTo(dx, cy);
      ctx.lineTo(dx, cy + 40);
      ctx.ellipse(cx, cy + 40, dw / 2, dh / 2, 0, 0, Math.PI);
      ctx.lineTo(dx + dw, cy);
      ctx.stroke();
      break;
    }
    case 'tailwind': {
      // Twin waves
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy - 10);
      ctx.bezierCurveTo(cx - 40, cy - 45, cx - 10, cy - 45, cx + 10, cy - 20);
      ctx.bezierCurveTo(cx + 25, cy + 5, cx + 45, cy + 5, cx + 60, cy - 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 50, cy + 24);
      ctx.bezierCurveTo(cx - 30, cy - 10, cx - 5, cy - 10, cx + 15, cy + 14);
      ctx.bezierCurveTo(cx + 30, cy + 38, cx + 50, cy + 38, cx + 62, cy + 24);
      ctx.stroke();
      break;
    }
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.max(1, maxAnisotropy);
  texture.needsUpdate = true;

  return texture;
}
