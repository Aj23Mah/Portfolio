import {
  Group,
  Mesh,
  BufferGeometry,
  Material,
  Texture,
  MeshStandardMaterial,
  Color,
  Vector3,
  Euler,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { CUBE_PALETTE, CUBIE_BODY_COLOR, CubeFace } from './palette';
import { createCenterTexture, createTechDecalTexture, CUBE_SECTIONS, TECH_DECALS } from './textures';

export interface StickerUserData {
  isSticker: true;
  isCenter: boolean;
  sectionId?: string;
  colorId: CubeFace;
  face: CubeFace;
  colorHex: string;
  cubieIndex: number;
  cubie: Group;
  originalNormal: Vector3;
  localUp: Vector3;
}

export interface CubieUserData {
  isCubie: true;
  index: number;
  initialCoords: Vector3;
}

export interface CubeInstance {
  cubeGroup: Group;
  cubies: Group[];
  stickerMeshes: Mesh[];
  geometries: BufferGeometry[];
  materials: Material[];
  textures: Texture[];
  setDecalsVisible: (visible: boolean) => void;
  initTexturesProgressively?: () => void;
}

// One shared rounded-box body geometry and one shared sticker geometry across all instances
let sharedCubieBodyGeometry: RoundedBoxGeometry | null = null;
let sharedStickerGeometry: RoundedBoxGeometry | null = null;

function getSharedGeometries() {
  if (!sharedCubieBodyGeometry) {
    sharedCubieBodyGeometry = new RoundedBoxGeometry(0.96, 0.96, 0.96, 2, 0.05);
  }
  if (!sharedStickerGeometry) {
    sharedStickerGeometry = new RoundedBoxGeometry(0.82, 0.82, 0.015, 2, 0.04);
  }
  return { cubieBodyGeometry: sharedCubieBodyGeometry, stickerGeometry: sharedStickerGeometry };
}

export function createCube(
  maxAnisotropy = 4,
  onComplete?: (cube: CubeInstance) => void
): CubeInstance {
  const cubeGroup = new Group();
  cubeGroup.name = 'RubiksCube';

  const cubies: Group[] = [];
  const stickerMeshes: Mesh[] = [];
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const textures: Texture[] = [];
  const decalAssignments: { material: MeshStandardMaterial; tech: typeof TECH_DECALS[number] }[] = [];
  const centerAssignments: { material: MeshStandardMaterial; face: CubeFace }[] = [];

  const { cubieBodyGeometry, stickerGeometry } = getSharedGeometries();
  geometries.push(cubieBodyGeometry, stickerGeometry);

  const cubieBodyMaterial = new MeshStandardMaterial({
    color: new Color(CUBIE_BODY_COLOR),
    roughness: 0.8,
    metalness: 0.2,
  });
  materials.push(cubieBodyMaterial);

  let cubieIndex = 0;
  let nonCenterIndex = 0;

  const createFaceSticker = (
    face: CubeFace,
    isCenter: boolean,
    offsetPos: [number, number, number],
    rotationEuler: [number, number, number] | undefined,
    normalVec: [number, number, number],
    cubie: Group,
    currentCubieIndex: number
  ) => {
    let mat: MeshStandardMaterial;
    let sectionId: string | undefined;

    if (isCenter) {
      sectionId = CUBE_SECTIONS[face].sectionId;
      mat = new MeshStandardMaterial({
        color: new Color(CUBE_PALETTE[face].hex),
        roughness: 0.25,
        metalness: 0.08,
      });
      centerAssignments.push({ material: mat, face });
    } else {
      const tech = TECH_DECALS[nonCenterIndex % TECH_DECALS.length];
      nonCenterIndex++;
      mat = new MeshStandardMaterial({
        color: new Color(CUBE_PALETTE[face].hex),
        roughness: 0.25,
        metalness: 0.08,
      });
      decalAssignments.push({ material: mat, tech });
    }

    materials.push(mat);

    const sticker = new Mesh(stickerGeometry, mat);
    sticker.position.set(offsetPos[0], offsetPos[1], offsetPos[2]);
    if (rotationEuler) {
      sticker.rotation.set(rotationEuler[0], rotationEuler[1], rotationEuler[2]);
    }

    const localUp = new Vector3(0, 1, 0);
    if (rotationEuler) {
      localUp.applyEuler(new Euler(rotationEuler[0], rotationEuler[1], rotationEuler[2]));
    }

    sticker.userData = {
      isSticker: true,
      isCenter,
      sectionId,
      colorId: face,
      face,
      colorHex: CUBE_PALETTE[face].hex,
      cubieIndex: currentCubieIndex,
      cubie,
      originalNormal: new Vector3(normalVec[0], normalVec[1], normalVec[2]),
      localUp,
    } as StickerUserData;

    cubie.add(sticker);
    stickerMeshes.push(sticker);
  };

  const buildCubie = (x: number, y: number, z: number) => {
    const cubie = new Group();
    cubie.name = `Cubie_${x}_${y}_${z}`;
    cubie.position.set(x, y, z);

    cubie.userData = {
      isCubie: true,
      index: cubieIndex,
      initialCoords: new Vector3(x, y, z),
    } as CubieUserData;

    const bodyMesh = new Mesh(cubieBodyGeometry, cubieBodyMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    cubie.add(bodyMesh);

    const stickerOffset = 0.485;

    // +X: Right (R)
    if (x === 1) {
      createFaceSticker('R', y === 0 && z === 0, [stickerOffset, 0, 0], [0, Math.PI / 2, 0], [1, 0, 0], cubie, cubieIndex);
    }
    // -X: Left (L)
    if (x === -1) {
      createFaceSticker('L', y === 0 && z === 0, [-stickerOffset, 0, 0], [0, -Math.PI / 2, 0], [-1, 0, 0], cubie, cubieIndex);
    }
    // +Y: Up (U)
    if (y === 1) {
      createFaceSticker('U', x === 0 && z === 0, [0, stickerOffset, 0], [-Math.PI / 2, 0, 0], [0, 1, 0], cubie, cubieIndex);
    }
    // -Y: Down (D)
    if (y === -1) {
      createFaceSticker('D', x === 0 && z === 0, [0, -stickerOffset, 0], [Math.PI / 2, 0, 0], [0, -1, 0], cubie, cubieIndex);
    }
    // +Z: Front (F)
    if (z === 1) {
      createFaceSticker('F', x === 0 && y === 0, [0, 0, stickerOffset], undefined, [0, 0, 1], cubie, cubieIndex);
    }
    // -Z: Back (B)
    if (z === -1) {
      createFaceSticker('B', x === 0 && y === 0, [0, 0, -stickerOffset], [0, Math.PI, 0], [0, 0, -1], cubie, cubieIndex);
    }

    cubeGroup.add(cubie);
    cubies.push(cubie);
    cubieIndex++;
  };

  const loadedDecalTextures: Texture[] = [];
  const initTexturesProgressively = () => {
    const schedule = (cb: () => void) => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(cb, { timeout: 4000 });
      } else {
        setTimeout(cb, 60);
      }
    };

    const centerFaces: CubeFace[] = ['U', 'D', 'L', 'R', 'F', 'B'];
    let centerIndex = 0;

    const processNextCenter = () => {
      if (centerIndex < centerFaces.length) {
        const face = centerFaces[centerIndex++];
        const tex = createCenterTexture(face, maxAnisotropy);
        textures.push(tex);
        const match = centerAssignments.find((a) => a.face === face);
        if (match) {
          match.material.map = tex;
          match.material.color.set('#FFFFFF');
          match.material.needsUpdate = true;
        }
        schedule(processNextCenter);
      } else {
        let decalIndex = 0;
        const processNextDecal = () => {
          if (decalIndex < TECH_DECALS.length) {
            const tech = TECH_DECALS[decalIndex];
            const tex = createTechDecalTexture(tech, maxAnisotropy);
            loadedDecalTextures.push(tex);
            textures.push(tex);

            decalAssignments.forEach(({ material }, idx) => {
              if (idx % TECH_DECALS.length === decalIndex) {
                material.map = tex;
                material.needsUpdate = true;
              }
            });

            decalIndex++;
            schedule(processNextDecal);
          }
        };
        schedule(processNextDecal);
      }
    };

    schedule(processNextCenter);
  };

  const setDecalsVisible = (visible: boolean) => {
    if (loadedDecalTextures.length === 0) return;
    decalAssignments.forEach(({ material }, idx) => {
      const tex = loadedDecalTextures[idx % loadedDecalTextures.length];
      material.map = visible ? tex : null;
      material.needsUpdate = true;
    });
  };

  const cubeInstance: CubeInstance = {
    cubeGroup,
    cubies,
    stickerMeshes,
    geometries,
    materials,
    textures,
    setDecalsVisible,
    initTexturesProgressively,
  };

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        buildCubie(x, y, z);
      }
    }
  }
  initTexturesProgressively();
  if (onComplete) {
    onComplete(cubeInstance);
  }

  return cubeInstance;
}

/**
 * Returns all 9 cubies in a given layer along local axis ('x' | 'y' | 'z') matching the layer index (-1 | 0 | 1).
 * Always evaluated in the cube's local coordinates.
 */
export function getCubiesInLayer(
  cubies: Group[],
  axis: 'x' | 'y' | 'z',
  value: number
): Group[] {
  return cubies.filter((c) => Math.round(c.position[axis]) === value);
}

/**
 * Snaps cubie positions and rotations to clean integers after rotation to prevent floating-point drift.
 */
export function snapCubieTransform(cubie: Group): void {
  cubie.position.x = Math.round(cubie.position.x);
  cubie.position.y = Math.round(cubie.position.y);
  cubie.position.z = Math.round(cubie.position.z);

  // Snap quaternion / rotation to nearest 90-degree increments
  const snapAngle = (a: number) => Math.round(a / (Math.PI / 2)) * (Math.PI / 2);
  cubie.rotation.x = snapAngle(cubie.rotation.x);
  cubie.rotation.y = snapAngle(cubie.rotation.y);
  cubie.rotation.z = snapAngle(cubie.rotation.z);
  cubie.quaternion.setFromEuler(cubie.rotation);
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
