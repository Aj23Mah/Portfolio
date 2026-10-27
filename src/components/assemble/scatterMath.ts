import * as THREE from 'three';
import { ASSEMBLE_CONFIG } from './config';

export interface CubieScatterData {
  index: number;
  gridCoords: THREE.Vector3; // Solved target (x, y, z in {-1, 0, 1})
  scatterPos: THREE.Vector3; // Scattered start position
  scatterQuat: THREE.Quaternion; // Scattered start orientation
  targetQuat: THREE.Quaternion;  // Solved target orientation (identity)
  staggerIndex: number;      // 0 to 26 sorted by arrival
  pStart: number;            // Progress at which piece begins flying in
  pEnd: number;              // Progress at which piece locks into place
  driftFreq: THREE.Vector3;
  driftPhase: THREE.Vector3;
}

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 */
function createMulberry32(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Cubic ease-out curve for natural deceleration upon arrival
 */
export function easeOutCubic(t: number): number {
  const inv = 1 - t;
  return 1 - inv * inv * inv;
}

/**
 * Gentle spring ease with subtle settling feel
 */
export function easeOutSpring(t: number): number {
  if (t >= 1) return 1;
  if (t <= 0) return 0;
  return 1 - Math.cos(t * Math.PI * 0.5) * Math.pow(1 - t, 2.2);
}

/**
 * Clamp a number between 0 and 1
 */
export function clamp01(val: number): number {
  return Math.min(1, Math.max(0, val));
}

/**
 * Generates the deterministic scatter data for all 27 cubies.
 */
export function generateCubieScatterData(): CubieScatterData[] {
  const rand = createMulberry32(ASSEMBLE_CONFIG.seed);
  const pieces: Array<{
    index: number;
    gridCoords: THREE.Vector3;
    dist: number;
    rawStagger: number;
  }> = [];

  // 1. Enumerate all 27 cubies on 3x3x3 grid
  let index = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const gridCoords = new THREE.Vector3(x, y, z);
        const dist = Math.sqrt(x * x + y * y + z * z);
        // Stagger priority: center core first (dist=0), centers second (dist=1), edges third (dist~1.41), corners last (dist~1.73)
        // With a seeded micro-jitter so pieces within the same shell arrive in an aesthetically varied spiral order
        const rawStagger = dist * 1.8 + rand() * 0.7;
        pieces.push({ index, gridCoords, dist, rawStagger });
        index++;
      }
    }
  }

  // 2. Sort by stagger priority to assign clean 0..26 sequence
  pieces.sort((a, b) => a.rawStagger - b.rawStagger);

  const result: CubieScatterData[] = [];
  const goldenRatio = 1.61803398875;
  const twoPi = Math.PI * 2;

  const flyInSpan = ASSEMBLE_CONFIG.phaseFlyInEnd - ASSEMBLE_CONFIG.phaseFlyInStart;
  const maxAvailableStartOffset = Math.max(0.01, flyInSpan - ASSEMBLE_CONFIG.pieceTravelDuration);

  for (let rank = 0; rank < pieces.length; rank++) {
    const item = pieces[rank];
    const normalizedRank = rank / (pieces.length - 1); // 0 to 1

    // Spherical spiral distribution (Fibonacci spiral on sphere)
    const theta = rank * twoPi * goldenRatio + (rand() - 0.5) * 0.4;
    const yNorm = 1 - (rank / (pieces.length - 1)) * 2; // +1 to -1
    const radiusXY = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));

    const radius =
      ASSEMBLE_CONFIG.scatterRadiusMin +
      rand() * (ASSEMBLE_CONFIG.scatterRadiusMax - ASSEMBLE_CONFIG.scatterRadiusMin);

    const scatterPos = new THREE.Vector3(
      radiusXY * Math.cos(theta) * radius + (rand() - 0.5) * 0.8,
      yNorm * radius * ASSEMBLE_CONFIG.spiralPitch + (rand() - 0.5) * 0.8,
      radiusXY * Math.sin(theta) * radius + (rand() - 0.5) * 0.8
    );

    // Random initial rotation
    const euler = new THREE.Euler(
      (rand() - 0.5) * Math.PI * 2,
      (rand() - 0.5) * Math.PI * 2,
      (rand() - 0.5) * Math.PI * 2,
      'XYZ'
    );
    const scatterQuat = new THREE.Quaternion().setFromEuler(euler);
    const targetQuat = new THREE.Quaternion(); // Identity (0, 0, 0, 1)

    // Stagger arrival times
    const pStart =
      ASSEMBLE_CONFIG.phaseFlyInStart +
      normalizedRank * maxAvailableStartOffset;
    const pEnd = pStart + ASSEMBLE_CONFIG.pieceTravelDuration;

    // Subtle drift frequencies for idle floating
    const driftFreq = new THREE.Vector3(
      0.8 + rand() * 0.8,
      0.8 + rand() * 0.8,
      0.8 + rand() * 0.8
    );
    const driftPhase = new THREE.Vector3(
      rand() * Math.PI * 2,
      rand() * Math.PI * 2,
      rand() * Math.PI * 2
    );

    result.push({
      index: item.index,
      gridCoords: item.gridCoords,
      scatterPos,
      scatterQuat,
      targetQuat,
      staggerIndex: rank,
      pStart,
      pEnd,
      driftFreq,
      driftPhase,
    });
  }

  // Restore ordering by cubie index 0..26 so array index matches cubie.userData.index
  result.sort((a, b) => a.index - b.index);
  return result;
}

// Module-level temporary math objects for zero garbage collection allocations
const _tempVecA = new THREE.Vector3();
const _tempVecB = new THREE.Vector3();

/**
 * Computes the interpolated transform for a single cubie given global scroll progress p and time.
 * Writes directly into outPos and outQuat to avoid any per-frame object allocation.
 * Returns the computed scale factor (including settle click pop).
 */
export function interpolateCubieTransform(
  data: CubieScatterData,
  p: number,
  timeSec: number,
  shouldReduceMotion: boolean,
  outPos: THREE.Vector3,
  outQuat: THREE.Quaternion
): number {
  // If user requests reduced motion: immediately render in solved position
  if (shouldReduceMotion) {
    outPos.copy(data.gridCoords);
    outQuat.copy(data.targetQuat);
    return 1.0;
  }

  let scale = 1.0;

  // Phase 1: Idle Drift & Floating (p < 0.10)
  if (p <= ASSEMBLE_CONFIG.phaseFloatEnd) {
    const floatFactor = 1.0 - clamp01(p / ASSEMBLE_CONFIG.phaseFloatEnd);
    const amp = ASSEMBLE_CONFIG.driftAmplitude * floatFactor;

    _tempVecA.set(
      Math.sin(timeSec * data.driftFreq.x * ASSEMBLE_CONFIG.driftFrequency + data.driftPhase.x) * amp,
      Math.cos(timeSec * data.driftFreq.y * ASSEMBLE_CONFIG.driftFrequency + data.driftPhase.y) * amp,
      Math.sin(timeSec * data.driftFreq.z * ASSEMBLE_CONFIG.driftFrequency + data.driftPhase.z) * amp
    );

    outPos.copy(data.scatterPos).add(_tempVecA);
    outQuat.copy(data.scatterQuat);
    return scale;
  }

  // Phase 2: Flying In & Locking (pStart <= p <= pEnd)
  if (p < data.pStart) {
    // Piece has not yet departed: remains at scattered position
    outPos.copy(data.scatterPos);
    outQuat.copy(data.scatterQuat);
    return scale;
  }

  if (p >= data.pStart && p < data.pEnd) {
    // Piece is in transit
    const localProgress = (p - data.pStart) / (data.pEnd - data.pStart);
    const eased = easeOutCubic(localProgress);

    outPos.lerpVectors(data.scatterPos, data.gridCoords, eased);
    outQuat.slerpQuaternions(data.scatterQuat, data.targetQuat, eased);
    return scale;
  }

  // Piece has arrived at gridCoords (p >= data.pEnd)
  outPos.copy(data.gridCoords);
  outQuat.copy(data.targetQuat);

  // Settle "Click" Scale Bump:
  // When p crosses pEnd, scale smoothly bumps to 1.06 then returns to 1.0 over settleClickDuration
  const clickWindow = ASSEMBLE_CONFIG.settleClickDuration;
  if (p >= data.pEnd && p <= data.pEnd + clickWindow) {
    const clickU = (p - data.pEnd) / clickWindow;
    const bump = Math.sin(clickU * Math.PI) * (ASSEMBLE_CONFIG.settleClickScale - 1.0);
    scale = 1.0 + bump;
  }

  return scale;
}

/**
 * Computes whole-cube rotation, settle overshoot, and camera positioning
 */
export function computeAssembleSceneFrame(
  p: number,
  timeSec: number,
  isMobile: boolean,
  shouldReduceMotion: boolean
) {
  if (shouldReduceMotion) {
    return {
      cubePosition: new THREE.Vector3(
        isMobile ? ASSEMBLE_CONFIG.mobileCubeOffsetX : ASSEMBLE_CONFIG.desktopCubeOffsetX,
        isMobile ? ASSEMBLE_CONFIG.mobileCubeOffsetY : ASSEMBLE_CONFIG.desktopCubeOffsetY,
        0
      ),
      cubeRotationY: 0,
      cubeRotationX: 0,
      cubeScale: 1.0,
      cameraDistance: isMobile
        ? ASSEMBLE_CONFIG.cameraDollyMobileEnd
        : ASSEMBLE_CONFIG.cameraDollyEnd,
      hintPulseFactor: 0.3,
      piecesLockedCount: 27,
    };
  }

  const clampedP = clamp01(p);

  // 1. Camera Dolly
  const dollyStart = isMobile
    ? ASSEMBLE_CONFIG.cameraDollyMobileStart
    : ASSEMBLE_CONFIG.cameraDollyStart;
  const dollyEnd = isMobile
    ? ASSEMBLE_CONFIG.cameraDollyMobileEnd
    : ASSEMBLE_CONFIG.cameraDollyEnd;
  const cameraDistance = dollyStart + (dollyEnd - dollyStart) * easeOutCubic(clampedP);

  // 2. Whole Cube Continuous Rotation tied to p (~1/2 turn = 180 degrees)
  // Starts with an inviting angled view and smoothly rotates to face front (Green)
  const initialAngleY = 0.55; // Radians
  const rotProgress = easeOutCubic(clampedP);
  let cubeRotationY = initialAngleY + rotProgress * ASSEMBLE_CONFIG.totalRotationY;
  let cubeRotationX = 0.28 * (1.0 - rotProgress * 0.3); // Slight tilt

  // 3. Whole Cube Settle (Phase 3: p in [0.75, 0.90])
  let cubeScale = 1.0;
  if (
    clampedP >= ASSEMBLE_CONFIG.phaseFlyInEnd &&
    clampedP <= ASSEMBLE_CONFIG.phaseSettleEnd
  ) {
    const settleProgress =
      (clampedP - ASSEMBLE_CONFIG.phaseFlyInEnd) /
      (ASSEMBLE_CONFIG.phaseSettleEnd - ASSEMBLE_CONFIG.phaseFlyInEnd);
    
    // Overshoot bounce that dampens out as settleProgress approaches 1.0
    const bounce =
      Math.sin(settleProgress * Math.PI) *
      (1.0 - settleProgress * 0.7) *
      ASSEMBLE_CONFIG.cubeOvershootScale;
    cubeScale = 1.0 + bounce;

    // Smoothly snap rotation to settle squarely on Front face
    const settleBlend = easeOutCubic(settleProgress);
    cubeRotationY = initialAngleY + ASSEMBLE_CONFIG.totalRotationY * (0.95 + settleBlend * 0.05);
  } else if (clampedP > ASSEMBLE_CONFIG.phaseSettleEnd) {
    cubeRotationY = initialAngleY + ASSEMBLE_CONFIG.totalRotationY;
    cubeRotationX = 0.18;
  }

  // 4. Interactive Hint Pulse (Phase 4: p in [0.90, 1.00])
  let hintPulseFactor = 0;
  if (clampedP >= ASSEMBLE_CONFIG.phaseSettleEnd) {
    const pulseBlend =
      (clampedP - ASSEMBLE_CONFIG.phaseSettleEnd) /
      (ASSEMBLE_CONFIG.phaseStableEnd - ASSEMBLE_CONFIG.phaseSettleEnd);
    const sinePulse = (Math.sin(timeSec * ASSEMBLE_CONFIG.pulseFrequency) + 1) * 0.5;
    hintPulseFactor = pulseBlend * (0.15 + sinePulse * ASSEMBLE_CONFIG.pulseMaxIntensity);
  }

  // 5. World Position Offset
  const cubeOffsetX = isMobile
    ? ASSEMBLE_CONFIG.mobileCubeOffsetX
    : ASSEMBLE_CONFIG.desktopCubeOffsetX;
  const cubeOffsetY = isMobile
    ? ASSEMBLE_CONFIG.mobileCubeOffsetY
    : ASSEMBLE_CONFIG.desktopCubeOffsetY;

  return {
    cubePosition: new THREE.Vector3(cubeOffsetX, cubeOffsetY, 0),
    cubeRotationY,
    cubeRotationX,
    cubeScale,
    cameraDistance,
    hintPulseFactor,
    piecesLockedCount: 0, // will be populated per frame
  };
}
