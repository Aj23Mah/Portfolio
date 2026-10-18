import * as THREE from 'three';
import { CubeInstance } from './cube';

export interface SolvedCheckResult {
  isSolved: boolean;
  facesUniform: boolean;
  faceColors: Record<string, string>;
  groupCounts: Record<string, number>;
}

/**
 * Orientation-agnostic solve detection for 3x3 Rubik's cube.
 *
 * Checks all 54 stickers in cubeGroup-LOCAL space:
 * 1. Computes current outward normal for each sticker in cubeGroup local space.
 * 2. Groups stickers by rounded local normal into 6 face groups.
 * 3. Asserts each of the 6 groups has exactly 9 stickers.
 * 4. Asserts all 9 stickers in each group have the identical sticker color.
 * 5. Asserts the 6 face colors are all distinct.
 *
 * Does NOT compare positions, and works regardless of whole-cube or slice orientation.
 */
export function checkCubeSolved(cube: CubeInstance): SolvedCheckResult {
  // Key format: "nx,ny,nz" (e.g., "1,0,0", "0,1,0", etc.)
  const groups: Record<string, { colorId: string; face: string }[]> = {
    '1,0,0': [],
    '-1,0,0': [],
    '0,1,0': [],
    '0,-1,0': [],
    '0,0,1': [],
    '0,0,-1': [],
  };

  for (const sticker of cube.stickerMeshes) {
    const cubie = sticker.parent as THREE.Group;
    if (!cubie) continue;

    // Get outward normal in cubeGroup's local coordinate system
    const origNormal = (sticker.userData.originalNormal as THREE.Vector3) || new THREE.Vector3(0, 0, 1);
    const localNormal = origNormal.clone().applyQuaternion(cubie.quaternion);

    const nx = Math.round(localNormal.x);
    const ny = Math.round(localNormal.y);
    const nz = Math.round(localNormal.z);
    const key = `${nx},${ny},${nz}`;

    if (groups[key]) {
      groups[key].push({
        colorId: (sticker.userData.colorId || sticker.userData.face) as string,
        face: sticker.userData.face as string,
      });
    }
  }

  const groupCounts: Record<string, number> = {};
  const faceColors: Record<string, string> = {};
  const uniqueColors = new Set<string>();
  let facesUniform = true;

  const standardKeys = ['1,0,0', '-1,0,0', '0,1,0', '0,-1,0', '0,0,1', '0,0,-1'];

  for (const key of standardKeys) {
    const stickerList = groups[key] || [];
    groupCounts[key] = stickerList.length;

    // Must have exactly 9 stickers per face
    if (stickerList.length !== 9) {
      facesUniform = false;
      continue;
    }

    const firstColor = stickerList[0].colorId;
    faceColors[key] = firstColor;
    uniqueColors.add(firstColor);

    // Every sticker in the group must have identical colorId (never inspects material.color or texture)
    for (let i = 1; i < stickerList.length; i++) {
      if (stickerList[i].colorId !== firstColor) {
        facesUniform = false;
        break;
      }
    }
  }

  // All 6 faces must be uniform AND all 6 colors must be distinct
  const isSolved = facesUniform && uniqueColors.size === 6;

  return {
    isSolved,
    facesUniform,
    faceColors,
    groupCounts,
  };
}
