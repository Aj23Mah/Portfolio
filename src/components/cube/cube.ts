import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { CUBE_PALETTE, CUBIE_BODY_COLOR, CubeFace } from './palette';
import { createCenterTexture, createTechDecalTexture, CUBE_SECTIONS, TECH_DECALS } from './textures';

/**
 * STANDARD LOCAL CUBE FACE ORIENTATION & STICKER COLOR MAPPING:
 * - U (Up / +Y):    White  (#E8ECF0) -> local outward normal (0, 1, 0)
 * - D (Down / -Y):  Yellow (#F5C518) -> local outward normal (0, -1, 0)
 * - F (Front / +Z): Green  (#10AC84) -> local outward normal (0, 0, 1)
 * - B (Back / -Z):  Blue   (#2E86DE) -> local outward normal (0, 0, -1)
 * - R (Right / +X): Red    (#D63031) -> local outward normal (1, 0, 0)
 * - L (Left / -X):  Orange (#FF9234) -> local outward normal (-1, 0, 0)
 */

export interface StickerUserData {
  isSticker: true;
  isCenter: boolean;
  sectionId?: string;
  colorId: CubeFace;
  face: CubeFace;
  colorHex: string;
  cubieIndex: number;
  cubie: THREE.Group;
  originalNormal: THREE.Vector3;
  localUp: THREE.Vector3;
}

export interface CubieUserData {
  isCubie: true;
  index: number;
  initialCoords: THREE.Vector3;
}

export interface CubeInstance {
  cubeGroup: THREE.Group;
  cubies: THREE.Group[];
  stickerMeshes: THREE.Mesh[];
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  textures: THREE.Texture[];
  setDecalsVisible: (visible: boolean) => void;
}

/**
 * Creates the 3x3 Rubik's cube with 27 cubies and colored stickers on outward faces.
 *
 * Architecture:
 * - Exactly 6 center textures (high-DPI canvas with section icon + label)
 * - Exactly 8 non-center decal textures (subtle 20-30% tech watermarks)
 * - Textures are shared across stickers and disposed exactly once on unmount.
 * - Materials remain per-sticker to support independent hover highlights.
 * - Solved detection relies strictly on sticker.userData.colorId, never material.color or texture.
 */
export function createCube(maxAnisotropy = 4): CubeInstance {
  const cubeGroup = new THREE.Group();
  cubeGroup.name = 'RubiksCube';

  const cubies: THREE.Group[] = [];
  const stickerMeshes: THREE.Mesh[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const decalAssignments: { material: THREE.MeshStandardMaterial; texture: THREE.Texture }[] = [];

  // Shared cubie body geometry (rounded edges for a sleek, tactile feel)
  const cubieBodyGeometry = new RoundedBoxGeometry(0.96, 0.96, 0.96, 2, 0.05);
  geometries.push(cubieBodyGeometry);

  const cubieBodyMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(CUBIE_BODY_COLOR),
    roughness: 0.8,
    metalness: 0.2,
  });
  materials.push(cubieBodyMaterial);

  // Shared sticker geometry (thin rounded plate to prevent z-fighting and add depth)
  const stickerGeometry = new RoundedBoxGeometry(0.82, 0.82, 0.015, 2, 0.04);
  geometries.push(stickerGeometry);

  // 1. Create single texture instances for the 6 center section stickers
  const centerFaces: CubeFace[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  const centerTextures: Record<CubeFace, THREE.Texture> = {
    U: createCenterTexture('U', maxAnisotropy),
    D: createCenterTexture('D', maxAnisotropy),
    L: createCenterTexture('L', maxAnisotropy),
    R: createCenterTexture('R', maxAnisotropy),
    F: createCenterTexture('F', maxAnisotropy),
    B: createCenterTexture('B', maxAnisotropy),
  };
  centerFaces.forEach((f) => textures.push(centerTextures[f]));

  // 2. Create single texture instances for the subtle tech decals
  const decalTextures: THREE.Texture[] = TECH_DECALS.map((tech) =>
    createTechDecalTexture(tech, maxAnisotropy)
  );
  decalTextures.forEach((t) => textures.push(t));

  let cubieIndex = 0;
  let nonCenterIndex = 0;

  // Build 27 cubies at local coordinates x, y, z in {-1, 0, 1}
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const cubie = new THREE.Group();
        cubie.name = `Cubie_${x}_${y}_${z}`;
        cubie.position.set(x, y, z);

        cubie.userData = {
          isCubie: true,
          index: cubieIndex,
          initialCoords: new THREE.Vector3(x, y, z),
        } as CubieUserData;

        // Add black core body
        const bodyMesh = new THREE.Mesh(cubieBodyGeometry, cubieBodyMaterial);
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        cubie.add(bodyMesh);

        // Add stickers only on outward faces
        const stickerOffset = 0.485;

        const createFaceSticker = (
          face: CubeFace,
          isCenter: boolean,
          offsetPos: [number, number, number],
          rotationEuler?: [number, number, number],
          normalVec: [number, number, number] = [0, 0, 1]
        ) => {
          let mat: THREE.MeshStandardMaterial;
          let sectionId: string | undefined;

          if (isCenter) {
            sectionId = CUBE_SECTIONS[face].sectionId;
            mat = new THREE.MeshStandardMaterial({
              map: centerTextures[face],
              color: new THREE.Color('#FFFFFF'),
              roughness: 0.25,
              metalness: 0.08,
            });
          } else {
            const decal = decalTextures[nonCenterIndex % decalTextures.length];
            nonCenterIndex++;
            mat = new THREE.MeshStandardMaterial({
              map: decal,
              color: new THREE.Color(CUBE_PALETTE[face].hex),
              roughness: 0.25,
              metalness: 0.08,
            });
            decalAssignments.push({ material: mat, texture: decal });
          }

          materials.push(mat);

          const sticker = new THREE.Mesh(stickerGeometry, mat);
          sticker.position.set(offsetPos[0], offsetPos[1], offsetPos[2]);
          if (rotationEuler) {
            sticker.rotation.set(rotationEuler[0], rotationEuler[1], rotationEuler[2]);
          }

          const localUp = new THREE.Vector3(0, 1, 0);
          if (rotationEuler) {
            localUp.applyEuler(new THREE.Euler(rotationEuler[0], rotationEuler[1], rotationEuler[2]));
          }

          sticker.userData = {
            isSticker: true,
            isCenter,
            sectionId,
            colorId: face,
            face,
            colorHex: CUBE_PALETTE[face].hex,
            cubieIndex,
            cubie,
            originalNormal: new THREE.Vector3(normalVec[0], normalVec[1], normalVec[2]),
            localUp,
          } as StickerUserData;

          cubie.add(sticker);
          stickerMeshes.push(sticker);
        };

        // +X: Right (R)
        if (x === 1) {
          createFaceSticker('R', y === 0 && z === 0, [stickerOffset, 0, 0], [0, Math.PI / 2, 0], [1, 0, 0]);
        }

        // -X: Left (L)
        if (x === -1) {
          createFaceSticker('L', y === 0 && z === 0, [-stickerOffset, 0, 0], [0, -Math.PI / 2, 0], [-1, 0, 0]);
        }

        // +Y: Up (U)
        if (y === 1) {
          createFaceSticker('U', x === 0 && z === 0, [0, stickerOffset, 0], [-Math.PI / 2, 0, 0], [0, 1, 0]);
        }

        // -Y: Down (D)
        if (y === -1) {
          createFaceSticker('D', x === 0 && z === 0, [0, -stickerOffset, 0], [Math.PI / 2, 0, 0], [0, -1, 0]);
        }

        // +Z: Front (F)
        if (z === 1) {
          createFaceSticker('F', x === 0 && y === 0, [0, 0, stickerOffset], undefined, [0, 0, 1]);
        }

        // -Z: Back (B)
        if (z === -1) {
          createFaceSticker('B', x === 0 && y === 0, [0, 0, -stickerOffset], [0, Math.PI, 0], [0, 0, -1]);
        }

        cubeGroup.add(cubie);
        cubies.push(cubie);
        cubieIndex++;
      }
    }
  }

  const setDecalsVisible = (visible: boolean) => {
    for (const item of decalAssignments) {
      item.material.map = visible ? item.texture : null;
      item.material.needsUpdate = true;
    }
  };

  return {
    cubeGroup,
    cubies,
    stickerMeshes,
    geometries,
    materials,
    textures,
    setDecalsVisible,
  };
}

/**
 * Returns all 9 cubies in a given layer along local axis ('x' | 'y' | 'z') matching the layer index (-1 | 0 | 1).
 * Always evaluated in the cube's local coordinates.
 */
export function getCubiesInLayer(
  cubies: THREE.Group[],
  axis: 'x' | 'y' | 'z',
  value: number
): THREE.Group[] {
  return cubies.filter((c) => Math.round(c.position[axis]) === value);
}

/**
 * Snaps cubie positions and rotations to clean integers after rotation to prevent floating-point drift.
 */
export function snapCubieTransform(cubie: THREE.Group): void {
  cubie.position.x = Math.round(cubie.position.x);
  cubie.position.y = Math.round(cubie.position.y);
  cubie.position.z = Math.round(cubie.position.z);

  // Snap quaternion / rotation to nearest 90-degree increments
  const euler = new THREE.Euler().setFromQuaternion(cubie.quaternion, 'XYZ');
  const snapAngle = (a: number) => Math.round(a / (Math.PI / 2)) * (Math.PI / 2);
  euler.x = snapAngle(euler.x);
  euler.y = snapAngle(euler.y);
  euler.z = snapAngle(euler.z);
  cubie.quaternion.setFromEuler(euler);
  cubie.updateMatrix();
  cubie.updateMatrixWorld(true);
}

/**
 * Cleanly disposes all geometries, materials, and textures of the cube instance.
 */
export function disposeCube(cube: CubeInstance): void {
  cube.textures.forEach((t) => t.dispose());
  cube.geometries.forEach((g) => g.dispose());
  cube.materials.forEach((m) => m.dispose());
}
