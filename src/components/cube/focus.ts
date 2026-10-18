import * as THREE from 'three';
import { animate } from 'animejs';
import { CubeInstance, StickerUserData } from './cube';
import { SphericalOrbit } from './orbit';

export interface CameraPose {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  distance: number;
}

export interface FocusTargetResult {
  targetPos: THREE.Vector3;
  targetQuat: THREE.Quaternion;
  targetDir: THREE.Vector3;
  distance: number;
  sticker: THREE.Mesh;
  sectionId: string;
}

/**
 * Normalizes section ID aliases to canonical keys:
 * 'work' -> 'projects'
 * 'tools' -> 'skills'
 */
export function normalizeSectionId(id: string): string {
  const clean = id.toLowerCase().replace(/^#/, '');
  if (clean === 'work') return 'projects';
  if (clean === 'tools') return 'skills';
  return clean;
}

/**
 * Computes the ideal camera pose for viewing a section center face.
 * The pose is derived from the center cubie's current world normal and upright vector,
 * guaranteeing the label is upright and centered in view regardless of how the cube was turned.
 */
export function computeFocusPose(
  cube: CubeInstance,
  sectionId: string,
  focusDistance: number = 5.2
): FocusTargetResult | null {
  const normalizedId = normalizeSectionId(sectionId);

  // Find corresponding center sticker
  const sticker = cube.stickerMeshes.find((mesh) => {
    const data = mesh.userData as StickerUserData;
    return (
      data &&
      data.isCenter &&
      (data.sectionId === normalizedId || data.colorId === sectionId.toUpperCase())
    );
  });

  if (!sticker) return null;

  const data = sticker.userData as StickerUserData;
  const cubie = data.cubie;

  // Compute world vectors from cubie's current rotation
  const normalWorld = data.originalNormal.clone().applyQuaternion(cubie.quaternion).normalize();
  const upWorld = data.localUp.clone().applyQuaternion(cubie.quaternion).normalize();

  // Target camera position: offset along normalWorld at focusDistance
  const targetPos = normalWorld.clone().multiplyScalar(focusDistance);

  // Compute camera orientation basis:
  // Camera forward (-Z) points along -normalWorld towards cube center (0, 0, 0)
  // Camera up (+Y) points along upWorld
  // Camera right (+X) is upWorld x normalWorld
  const right = new THREE.Vector3().crossVectors(upWorld, normalWorld).normalize();
  const up = new THREE.Vector3().crossVectors(normalWorld, right).normalize();

  const rotMatrix = new THREE.Matrix4().makeBasis(right, up, normalWorld);
  const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix);

  return {
    targetPos,
    targetQuat,
    targetDir: normalWorld,
    distance: focusDistance,
    sticker,
    sectionId: normalizedId,
  };
}

/**
 * Slerps camera on a spherical arc from its current pose to target pose using Anime.js v4.
 * - Interpolates normalized direction on a great-circle arc (slerp)
 * - Interpolates distance (lerp)
 * - Interpolates camera orientation (slerp)
 * Never cuts through the cube geometry.
 */
export function animateCameraArc(
  camera: THREE.PerspectiveCamera,
  targetPos: THREE.Vector3,
  targetQuat: THREE.Quaternion,
  options: {
    duration?: number;
    shouldReduceMotion?: boolean;
    onUpdate?: (progress: number) => void;
    onComplete?: () => void;
  } = {}
) {
  const { duration = 750, shouldReduceMotion = false, onUpdate, onComplete } = options;

  const startPos = camera.position.clone();
  const startQuat = camera.quaternion.clone();

  const startDist = startPos.length() || 7.4;
  const targetDist = targetPos.length() || 5.2;

  const dirStart = startPos.clone().normalize();
  const dirTarget = targetPos.clone().normalize();

  // Quaternion rotating dirStart into dirTarget
  const dot = THREE.MathUtils.clamp(dirStart.dot(dirTarget), -1, 1);
  const qArc = new THREE.Quaternion();
  if (dot < -0.9999) {
    // 180° antipodal: pick smooth orthogonal orbit axis
    const axis = new THREE.Vector3(0, 1, 0);
    if (Math.abs(dirStart.dot(axis)) > 0.9) {
      axis.set(1, 0, 0);
    }
    axis.cross(dirStart).normalize();
    qArc.setFromAxisAngle(axis, Math.PI);
  } else {
    qArc.setFromUnitVectors(dirStart, dirTarget);
  }

  if (shouldReduceMotion || duration === 0) {
    camera.position.copy(targetPos);
    camera.quaternion.copy(targetQuat);
    onUpdate?.(1);
    onComplete?.();
    return null;
  }

  const animState = { t: 0 };
  const anim = animate(animState, {
    t: 1,
    duration,
    ease: 'outCubic',
    onUpdate: () => {
      const t = animState.t;
      // 1. Slerp normalized direction on great-circle arc
      const qT = new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion(), qArc, t);
      const currentDir = dirStart.clone().applyQuaternion(qT).normalize();

      // 2. Lerp distance
      const currentDist = THREE.MathUtils.lerp(startDist, targetDist, t);

      // 3. Set camera position on arc
      camera.position.copy(currentDir.multiplyScalar(currentDist));

      // 4. Slerp orientation quaternion
      camera.quaternion.slerpQuaternions(startQuat, targetQuat, t);

      onUpdate?.(t);
    },
    onComplete: () => {
      camera.position.copy(targetPos);
      camera.quaternion.copy(targetQuat);
      onUpdate?.(1);
      onComplete?.();
    },
  });

  return anim;
}

/**
 * Resets camera back to neutral orbit viewing position (4.4, 3.4, 4.9) and resyncs orbit controller.
 */
export function animateCameraReturn(
  camera: THREE.PerspectiveCamera,
  orbit: SphericalOrbit,
  options: {
    duration?: number;
    shouldReduceMotion?: boolean;
    onComplete?: () => void;
  } = {}
) {
  const restingPos = new THREE.Vector3(4.4, 3.4, 4.9);
  const dummyCam = camera.clone();
  dummyCam.position.copy(restingPos);
  dummyCam.up.set(0, 1, 0);
  dummyCam.lookAt(0, 0, 0);
  const restingQuat = dummyCam.quaternion.clone();

  return animateCameraArc(camera, restingPos, restingQuat, {
    duration: options.duration ?? 650,
    shouldReduceMotion: options.shouldReduceMotion,
    onComplete: () => {
      camera.up.set(0, 1, 0);
      orbit.resyncFromCamera();
      options.onComplete?.();
    },
  });
}
