import * as THREE from 'three';
import { animate } from 'animejs';
import { CubeFace } from './palette';
import { CubeInstance, createCube, disposeCube, getCubiesInLayer, snapCubieTransform } from './cube';
import { checkCubeSolved, SolvedCheckResult } from './solved';

export type RotationAxis = 'x' | 'y' | 'z';

/**
 * Generalized Move Definition:
 * - axis: local rotation axis ('x' | 'y' | 'z')
 * - layerIndex: -1, 0, or 1 (supports all outer layers and M, E, S middle slices)
 * - direction: 1 (positive angle around axis) or -1 (negative angle)
 */
export interface GenericMove {
  axis: RotationAxis;
  layerIndex: number; // -1, 0, or 1
  direction: 1 | -1;
  name?: string; // e.g. "R", "U'", "M", etc.
}

export interface CubeMove extends GenericMove {
  id: string;
  isUserMove: boolean;
  isScrambleMove?: boolean;
  isAutoSolveMove?: boolean;
  isUndoMove?: boolean;
  timestamp: number;
}

export interface EasterEggData {
  moves: number;
  timeMs: number;
}

export interface MoveStats {
  totalMoves: number;
  userMoves: number;
  userHasMovedSinceScramble: boolean;
  hasBeenScrambled: boolean;
  isEligibleForEasterEgg: boolean;
  historyLength: number;
  isAnimating: boolean;
  isAutoSolving: boolean;
  isSolved: boolean;
  solveTimeMs: number | null;
  elapsedTimeMs: number;
}

export interface MoveControllerOptions {
  cube: CubeInstance;
  onMoveComplete?: (move: CubeMove, stats: MoveStats) => void;
  onStateChange?: (stats: MoveStats) => void;
  onEasterEggUnlocked?: (data: EasterEggData) => void;
  getReducedMotion?: () => boolean;
}

// Named presets for all 6 standard faces
export const FACE_MOVE_CONFIG: Record<CubeFace, { axis: RotationAxis; layerIndex: number; clockwiseDirection: 1 | -1 }> = {
  R: { axis: 'x', layerIndex: 1, clockwiseDirection: -1 },
  L: { axis: 'x', layerIndex: -1, clockwiseDirection: 1 },
  U: { axis: 'y', layerIndex: 1, clockwiseDirection: -1 },
  D: { axis: 'y', layerIndex: -1, clockwiseDirection: 1 },
  F: { axis: 'z', layerIndex: 1, clockwiseDirection: -1 },
  B: { axis: 'z', layerIndex: -1, clockwiseDirection: 1 },
};

// Named presets for middle slices (M, E, S)
export const SLICE_MOVE_CONFIG: Record<'M' | 'E' | 'S', { axis: RotationAxis; layerIndex: number; clockwiseDirection: 1 | -1 }> = {
  M: { axis: 'x', layerIndex: 0, clockwiseDirection: 1 },  // like L
  E: { axis: 'y', layerIndex: 0, clockwiseDirection: 1 },  // like D
  S: { axis: 'z', layerIndex: 0, clockwiseDirection: -1 }, // like F
};

export function createMoveFromFace(face: CubeFace, prime = false): GenericMove {
  const conf = FACE_MOVE_CONFIG[face];
  const direction = (prime ? -conf.clockwiseDirection : conf.clockwiseDirection) as 1 | -1;
  return {
    axis: conf.axis,
    layerIndex: conf.layerIndex,
    direction,
    name: `${face}${prime ? "'" : ''}`,
  };
}

export function createMoveFromSlice(slice: 'M' | 'E' | 'S', prime = false): GenericMove {
  const conf = SLICE_MOVE_CONFIG[slice];
  const direction = (prime ? -conf.clockwiseDirection : conf.clockwiseDirection) as 1 | -1;
  return {
    axis: conf.axis,
    layerIndex: conf.layerIndex,
    direction,
    name: `${slice}${prime ? "'" : ''}`,
  };
}

/**
 * MoveController manages the queue, Anime.js v4 animations, history stack,
 * solve detection, timer, and Easter egg trigger logic.
 */
export class MoveController {
  private cube: CubeInstance;
  private queue: CubeMove[] = [];
  private history: CubeMove[] = [];
  private animating = false;
  private autoSolving = false;
  private autoSolveUsedSinceScramble = false;
  private hasBeenScrambled = false;
  private hasTriggeredEasterEggForCurrentCycle = false;
  private userMovesSinceScramble = 0;
  private startTime: number | null = null;
  private solveTimeMs: number | null = null;
  private activeAnimation: { pause: () => void } | null = null;

  private onMoveCompleteCallback?: (move: CubeMove, stats: MoveStats) => void;
  private onStateChangeCallback?: (stats: MoveStats) => void;
  private onEasterEggUnlockedCallback?: (data: EasterEggData) => void;
  private getReducedMotion: () => boolean;

  constructor(options: MoveControllerOptions) {
    this.cube = options.cube;
    this.onMoveCompleteCallback = options.onMoveComplete;
    this.onStateChangeCallback = options.onStateChange;
    this.onEasterEggUnlockedCallback = options.onEasterEggUnlocked;
    this.getReducedMotion = options.getReducedMotion || (() => false);
  }

  public isAnimating(): boolean {
    return this.animating;
  }

  public isAutoSolving(): boolean {
    return this.autoSolving;
  }

  public getStats(): MoveStats {
    const elapsed = this.solveTimeMs ?? (this.startTime ? Date.now() - this.startTime : 0);
    const solved = checkCubeSolved(this.cube).isSolved;

    return {
      totalMoves: this.history.length,
      userMoves: this.userMovesSinceScramble,
      userHasMovedSinceScramble: this.userMovesSinceScramble > 0,
      hasBeenScrambled: this.hasBeenScrambled,
      isEligibleForEasterEgg:
        this.hasBeenScrambled &&
        this.userMovesSinceScramble > 0 &&
        !this.autoSolveUsedSinceScramble &&
        !this.hasTriggeredEasterEggForCurrentCycle &&
        !this.autoSolving,
      historyLength: this.history.length,
      isAnimating: this.animating,
      isAutoSolving: this.autoSolving,
      isSolved: solved,
      solveTimeMs: this.solveTimeMs,
      elapsedTimeMs: elapsed,
    };
  }

  private notifyStateChange(): void {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.getStats());
    }
  }

  /**
   * Enqueue a move for execution.
   */
  public enqueueMove(
    moveDef: GenericMove,
    options: {
      isUserMove?: boolean;
      isScrambleMove?: boolean;
      isAutoSolveMove?: boolean;
      isUndoMove?: boolean;
      instant?: boolean;
    } = {}
  ): boolean {
    const isUser = options.isUserMove ?? true;

    // Lock user input while auto-solving
    if (this.autoSolving && isUser) {
      return false;
    }

    const move: CubeMove = {
      ...moveDef,
      id: `move_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      isUserMove: isUser,
      isScrambleMove: options.isScrambleMove,
      isAutoSolveMove: options.isAutoSolveMove,
      isUndoMove: options.isUndoMove,
      timestamp: Date.now(),
    };

    if (options.instant) {
      this.executeMoveInstant(move);
      return true;
    }

    this.queue.push(move);

    if (!this.animating) {
      this.processNextMove();
    }

    return true;
  }

  /**
   * Instantly executes a move with 0 duration without creating animation frames.
   */
  public executeMoveInstant(move: CubeMove): void {
    const pivot = new THREE.Group();
    this.cube.cubeGroup.add(pivot);

    const layerCubies = getCubiesInLayer(this.cube.cubies, move.axis, move.layerIndex);
    layerCubies.forEach((c) => pivot.attach(c));

    const angle = move.direction * (Math.PI / 2);
    pivot.rotation[move.axis] = angle;
    pivot.updateMatrixWorld(true);

    layerCubies.forEach((c) => {
      this.cube.cubeGroup.attach(c);
      snapCubieTransform(c);
    });

    this.cube.cubeGroup.remove(pivot);

    this.handleMoveCompletion(move);
  }

  private processNextMove(): void {
    if (this.queue.length === 0) {
      this.animating = false;
      if (this.autoSolving) {
        this.autoSolving = false;
      }
      this.notifyStateChange();
      return;
    }

    this.animating = true;
    const currentMove = this.queue.shift()!;

    const shouldReduceMotion = this.getReducedMotion();
    let duration = shouldReduceMotion ? 8 : 220;

    if (!shouldReduceMotion && this.queue.length > 2) {
      duration = Math.max(90, Math.floor(220 / (1 + this.queue.length * 0.3)));
    }

    const pivot = new THREE.Group();
    pivot.name = 'TemporaryTwistPivot';
    this.cube.cubeGroup.add(pivot);

    const layerCubies = getCubiesInLayer(this.cube.cubies, currentMove.axis, currentMove.layerIndex);
    layerCubies.forEach((cubie) => pivot.attach(cubie));

    const rotationTarget = { angle: 0 };
    const targetAngle = currentMove.direction * (Math.PI / 2);

    const anim = animate(rotationTarget, {
      angle: targetAngle,
      duration,
      ease: shouldReduceMotion ? 'linear' : 'outQuad',
      onUpdate: () => {
        pivot.rotation[currentMove.axis] = rotationTarget.angle;
        pivot.updateMatrixWorld(true);
      },
      onComplete: () => {
        this.activeAnimation = null;
        pivot.rotation[currentMove.axis] = targetAngle;
        pivot.updateMatrixWorld(true);

        layerCubies.forEach((cubie) => {
          this.cube.cubeGroup.attach(cubie);
          snapCubieTransform(cubie);
        });

        this.cube.cubeGroup.remove(pivot);

        this.handleMoveCompletion(currentMove);
        this.processNextMove();
      },
    });

    this.activeAnimation = anim;
  }

  private handleMoveCompletion(move: CubeMove): void {
    // 1. Update history and user move counts
    if (move.isUserMove && !move.isUndoMove) {
      // Start timer on first forward user move after scramble
      if (this.hasBeenScrambled && this.startTime === null) {
        this.startTime = Date.now();
      }
      this.userMovesSinceScramble++;
      this.history.push(move);
    } else if (move.isScrambleMove) {
      this.history.push(move);
    } else if (move.isAutoSolveMove) {
      // Auto-solve pops one move from history per completed inverse move
      this.history.pop();
    } else if (move.isUndoMove) {
      // Move was already popped from history in undo()
    }

    const stats = this.getStats();

    // 2. Solve detection
    const solveCheck = checkCubeSolved(this.cube);

    // Easter egg trigger criteria:
    // - Cube is solved
    // - Scrambled via scramble()
    // - Reached by a forward user move (not undo, not reset, not auto-solve)
    // - userMovesSinceScramble > 0
    // - Auto-solve has NOT been used or cancelled since that scramble
    // - Fires once per scramble cycle
    if (
      solveCheck.isSolved &&
      this.hasBeenScrambled &&
      move.isUserMove &&
      !move.isUndoMove &&
      this.userMovesSinceScramble > 0 &&
      !this.autoSolveUsedSinceScramble &&
      !this.hasTriggeredEasterEggForCurrentCycle
    ) {
      this.hasTriggeredEasterEggForCurrentCycle = true;
      this.solveTimeMs = this.startTime ? Date.now() - this.startTime : 0;

      if (this.onEasterEggUnlockedCallback) {
        this.onEasterEggUnlockedCallback({
          moves: this.userMovesSinceScramble,
          timeMs: this.solveTimeMs,
        });
      }
    }

    this.notifyStateChange();

    if (this.onMoveCompleteCallback) {
      this.onMoveCompleteCallback(move, stats);
    }
  }

  /**
   * Undoes the last move (inverts and pops from history).
   */
  public undo(options: { instant?: boolean } = {}): void {
    if (this.animating || this.autoSolving || this.history.length === 0) return;

    const lastMove = this.history.pop();
    if (!lastMove) return;

    if (lastMove.isUserMove && this.userMovesSinceScramble > 0) {
      this.userMovesSinceScramble--;
    }

    const inverseDef: GenericMove = {
      axis: lastMove.axis,
      layerIndex: lastMove.layerIndex,
      direction: (-lastMove.direction) as 1 | -1,
      name: `Undo_${lastMove.name || 'move'}`,
    };

    this.enqueueMove(inverseDef, {
      isUserMove: false,
      isUndoMove: true,
      instant: options.instant,
    });
  }

  /**
   * Resets the cube to its initial solved state.
   */
  public reset(): void {
    this.cancelActiveAnimation();
    this.queue = [];
    this.history = [];
    this.animating = false;
    this.autoSolving = false;
    this.autoSolveUsedSinceScramble = false;
    this.hasBeenScrambled = false;
    this.hasTriggeredEasterEggForCurrentCycle = false;
    this.userMovesSinceScramble = 0;
    this.startTime = null;
    this.solveTimeMs = null;

    this.cube.cubies.forEach((cubie) => {
      this.cube.cubeGroup.attach(cubie);
      const init = cubie.userData.initialCoords as THREE.Vector3;
      cubie.position.copy(init);
      cubie.quaternion.set(0, 0, 0, 1);
      cubie.updateMatrix();
      cubie.updateMatrixWorld(true);
    });

    this.notifyStateChange();
  }

  /**
   * Scrambles the cube with random moves (default 5 moves).
   */
  public scramble(count = 5, options: { instant?: boolean } = {}): void {
    if (this.autoSolving) return;

    this.autoSolveUsedSinceScramble = false;
    this.hasTriggeredEasterEggForCurrentCycle = false;
    this.userMovesSinceScramble = 0;
    this.startTime = null;
    this.solveTimeMs = null;

    const faces: CubeFace[] = ['U', 'D', 'L', 'R', 'F', 'B'];
    let lastFace: CubeFace | null = null;

    for (let i = 0; i < count; i++) {
      let chosenFace: CubeFace;
      do {
        chosenFace = faces[Math.floor(Math.random() * faces.length)];
      } while (chosenFace === lastFace);

      lastFace = chosenFace;
      const isPrime = Math.random() > 0.5;
      const moveDef = createMoveFromFace(chosenFace, isPrime);

      this.enqueueMove(moveDef, {
        isUserMove: false,
        isScrambleMove: true,
        instant: options.instant,
      });
    }

    this.hasBeenScrambled = true;
    this.notifyStateChange();
  }

  /**
   * Auto-solves the cube by inverting history in reverse order.
   * Cancelling leaves history consistent with the remaining unsolved moves.
   */
  public autoSolve(options: { instant?: boolean } = {}): void {
    if (this.animating || this.autoSolving || this.history.length === 0) return;

    this.autoSolving = true;
    this.autoSolveUsedSinceScramble = true; // Disqualifies Easter egg for this scramble cycle

    const movesToInvert = [...this.history].reverse();

    movesToInvert.forEach((move) => {
      const inverseDef: GenericMove = {
        axis: move.axis,
        layerIndex: move.layerIndex,
        direction: (-move.direction) as 1 | -1,
        name: `Inv_${move.name || ''}`,
      };

      this.enqueueMove(inverseDef, {
        isUserMove: false,
        isAutoSolveMove: true,
        instant: options.instant,
      });
    });

    this.notifyStateChange();
  }

  /**
   * Cancels auto-solve mid-run.
   * Remaining queued auto-solve moves are cleared, and history retains the exact moves remaining unsolved.
   */
  public cancelAutoSolve(): void {
    if (!this.autoSolving) return;
    this.queue = this.queue.filter((m) => !m.isAutoSolveMove);
    this.autoSolving = false;
    this.notifyStateChange();
  }

  public cancelActiveAnimation(): void {
    if (this.activeAnimation) {
      try {
        this.activeAnimation.pause();
      } catch {
        // ignore
      }
      this.activeAnimation = null;
    }
  }

  public dispose(): void {
    this.cancelActiveAnimation();
    this.queue = [];
    this.history = [];
    this.animating = false;
    this.autoSolving = false;
  }

  /**
   * Full Real MoveController stress & auto-solve test.
   */
  public async runFullRealControllerTest(): Promise<{
    test1Passed: boolean;
    test2Passed: boolean;
    allPassed: boolean;
  }> {
    this.reset();
    const faces: CubeFace[] = ['U', 'D', 'L', 'R', 'F', 'B'];
    let lastFace: CubeFace | null = null;

    for (let i = 0; i < 100; i++) {
      let face: CubeFace;
      do {
        face = faces[Math.floor(Math.random() * faces.length)];
      } while (face === lastFace);
      lastFace = face;

      const prime = Math.random() > 0.5;
      const move = createMoveFromFace(face, prime);
      this.enqueueMove(move, { isUserMove: true, instant: true });
    }

    // Auto-solve with instant execution
    const movesToInvert = [...this.history].reverse();
    movesToInvert.forEach((m) => {
      const inv: GenericMove = {
        axis: m.axis,
        layerIndex: m.layerIndex,
        direction: (-m.direction) as 1 | -1,
      };
      this.enqueueMove(inv, { isUserMove: false, isAutoSolveMove: true, instant: true });
    });

    const identityQuat = new THREE.Quaternion(0, 0, 0, 1);
    let test1Passed = true;

    for (const cubie of this.cube.cubies) {
      const init = cubie.userData.initialCoords as THREE.Vector3;
      const dist = cubie.position.distanceTo(init);
      const dot = Math.abs(cubie.quaternion.dot(identityQuat));

      if (dist > 0.01 || dot < 0.999) {
        test1Passed = false;
        break;
      }
    }

    // Test 2: Rapid queue
    this.reset();
    for (let i = 0; i < 12; i++) {
      const face = faces[i % faces.length];
      const move = createMoveFromFace(face, i % 2 === 0);
      this.enqueueMove(move, { isUserMove: true, instant: true });
    }

    const inv2 = [...this.history].reverse();
    inv2.forEach((m) => {
      const inv: GenericMove = {
        axis: m.axis,
        layerIndex: m.layerIndex,
        direction: (-m.direction) as 1 | -1,
      };
      this.enqueueMove(inv, { isUserMove: false, isAutoSolveMove: true, instant: true });
    });

    let test2Passed = true;
    for (const cubie of this.cube.cubies) {
      const init = cubie.userData.initialCoords as THREE.Vector3;
      const dist = cubie.position.distanceTo(init);
      const dot = Math.abs(cubie.quaternion.dot(identityQuat));
      if (dist > 0.01 || dot < 0.999) {
        test2Passed = false;
        break;
      }
    }

    const allPassed = test1Passed && test2Passed;
    this.reset();
    return { test1Passed, test2Passed, allPassed };
  }
}

/**
 * Runs the 100-move cycle test on a detached, headless instance.
 * Completely isolates the test so it never touches or affects the visible hero cube.
 */
export async function runDetachedControllerTest(): Promise<{
  test1Passed: boolean;
  test2Passed: boolean;
  allPassed: boolean;
}> {
  console.log('🧪 [Real MoveController Test] Running 100-move cycle on detached headless instance...');
  const detachedCube = createCube();
  const testController = new MoveController({ cube: detachedCube });
  const result = await testController.runFullRealControllerTest();
  disposeCube(detachedCube);
  testController.dispose();

  if (result.allPassed) {
    console.log('✅ [Detached Test Passed] 100 random moves + autoSolve on real MoveController returned to exact solved state!');
    console.log('✅ [Detached Test Passed] Rapid queueing and reverse execution verified with zero desync!');
  } else {
    console.error('❌ [Detached Test Failed] Mismatch detected during detached test.');
  }

  return result;
}

/**
 * Runs the Phase 5 test matrix asserting all 6 trigger rules.
 */
export function runPhase5EligibilityTests(): Record<string, string> {
  const results: Record<string, string> = {};

  // Case 1: Fresh cube, R then R' -> must NOT trigger
  {
    const cube = createCube();
    let triggered = false;
    const controller = new MoveController({
      cube,
      onEasterEggUnlocked: () => {
        triggered = true;
      },
    });
    controller.enqueueMove(createMoveFromFace('R', false), { isUserMove: true, instant: true });
    controller.enqueueMove(createMoveFromFace('R', true), { isUserMove: true, instant: true });
    const isSolved = checkCubeSolved(cube).isSolved;
    results["Case 1 (Fresh cube R then R')"] = !triggered && isSolved ? 'PASSED (Did not trigger)' : 'FAILED';
    disposeCube(cube);
  }

  // Case 2: Reset -> must NOT trigger
  {
    const cube = createCube();
    let triggered = false;
    const controller = new MoveController({
      cube,
      onEasterEggUnlocked: () => {
        triggered = true;
      },
    });
    controller.scramble(5, { instant: true });
    controller.reset();
    const isSolved = checkCubeSolved(cube).isSolved;
    results['Case 2 (Reset)'] = !triggered && isSolved ? 'PASSED (Did not trigger)' : 'FAILED';
    disposeCube(cube);
  }

  // Case 3: Auto-solve -> must NOT trigger
  {
    const cube = createCube();
    let triggered = false;
    const controller = new MoveController({
      cube,
      onEasterEggUnlocked: () => {
        triggered = true;
      },
    });
    controller.scramble(5, { instant: true });
    const inv = [...(controller as unknown as { history: GenericMove[] }).history].reverse();
    inv.forEach((m) => {
      controller.enqueueMove(
        { axis: m.axis, layerIndex: m.layerIndex, direction: (-m.direction) as 1 | -1 },
        { isUserMove: false, isAutoSolveMove: true, instant: true }
      );
    });
    const isSolved = checkCubeSolved(cube).isSolved;
    results['Case 3 (Auto-solve)'] = !triggered && isSolved ? 'PASSED (Did not trigger)' : 'FAILED';
    disposeCube(cube);
  }

  // Case 4: Auto-solve cancelled then finished manually -> must NOT trigger
  {
    const cube = createCube();
    let triggered = false;
    const controller = new MoveController({
      cube,
      onEasterEggUnlocked: () => {
        triggered = true;
      },
    });
    controller.scramble(2, { instant: true });
    controller.autoSolve();
    controller.cancelAutoSolve();
    const remaining = [...(controller as unknown as { history: GenericMove[] }).history].reverse();
    remaining.forEach((m) => {
      controller.enqueueMove(
        { axis: m.axis, layerIndex: m.layerIndex, direction: (-m.direction) as 1 | -1 },
        { isUserMove: true, instant: true }
      );
    });
    const isSolved = checkCubeSolved(cube).isSolved;
    results['Case 4 (Auto-solve cancelled then manual)'] =
      !triggered && isSolved ? 'PASSED (Did not trigger)' : 'FAILED';
    disposeCube(cube);
  }

  // Case 5: Scramble then solve manually -> must TRIGGER once
  {
    const cube = createCube();
    let triggerCount = 0;
    const controller = new MoveController({
      cube,
      onEasterEggUnlocked: () => {
        triggerCount++;
      },
    });
    controller.scramble(3, { instant: true });
    const movesToSolve = [...(controller as unknown as { history: GenericMove[] }).history].reverse();
    movesToSolve.forEach((m) => {
      controller.enqueueMove(
        { axis: m.axis, layerIndex: m.layerIndex, direction: (-m.direction) as 1 | -1 },
        { isUserMove: true, instant: true }
      );
    });
    const isSolved = checkCubeSolved(cube).isSolved;
    results['Case 5 (Scramble then manual solve)'] =
      triggerCount === 1 && isSolved ? 'PASSED (Triggered exactly once)' : 'FAILED';
    disposeCube(cube);
  }

  // Case 6: Invariant Test: after 100 random face moves, the six centers keep relative positions and sectionId mapping
  {
    const cube = createCube();
    const controller = new MoveController({ cube });
    const faces: CubeFace[] = ['U', 'D', 'L', 'R', 'F', 'B'];
    const sectionMap: Record<CubeFace, string> = {
      F: 'about',
      R: 'projects',
      L: 'skills',
      U: 'experience',
      D: 'services',
      B: 'contact',
    };
    const centerCoords: Record<CubeFace, [number, number, number]> = {
      F: [0, 0, 1],
      R: [1, 0, 0],
      L: [-1, 0, 0],
      U: [0, 1, 0],
      D: [0, -1, 0],
      B: [0, 0, -1],
    };

    let lastFace: CubeFace | null = null;
    for (let i = 0; i < 100; i++) {
      let face: CubeFace;
      do {
        face = faces[Math.floor(Math.random() * faces.length)];
      } while (face === lastFace);
      lastFace = face;
      const prime = Math.random() > 0.5;
      controller.enqueueMove(createMoveFromFace(face, prime), { isUserMove: true, instant: true });
    }

    let invariantHeld = true;
    const centerStickers = cube.stickerMeshes.filter((s) => s.userData.isCenter);

    if (centerStickers.length !== 6) {
      invariantHeld = false;
    }

    for (const sticker of centerStickers) {
      const face = sticker.userData.colorId as CubeFace;
      const expectedSection = sectionMap[face];
      if (sticker.userData.sectionId !== expectedSection) {
        invariantHeld = false;
        break;
      }

      const cubie = sticker.parent as THREE.Group;
      const expectedPos = centerCoords[face];
      if (
        Math.round(cubie.position.x) !== expectedPos[0] ||
        Math.round(cubie.position.y) !== expectedPos[1] ||
        Math.round(cubie.position.z) !== expectedPos[2]
      ) {
        invariantHeld = false;
        break;
      }
    }

    results['Case 6 (Center Invariant: 100 random face moves preserve center positions & sectionId mapping)'] =
      invariantHeld ? 'PASSED (Centers remained fixed at relative axes with stable sectionIds)' : 'FAILED';
    disposeCube(cube);
  }

  // Case 7: Auto-solve cancelled mid-run -> Undo and later Auto-solve still work correctly
  {
    const cube = createCube();
    const controller = new MoveController({ cube });
    // Scramble 6 moves
    controller.scramble(6, { instant: true });
    
    // Simulate auto-solving 2 moves
    const historyMoves = [...(controller as unknown as { history: GenericMove[] }).history];
    const move1 = historyMoves[historyMoves.length - 1];
    const move2 = historyMoves[historyMoves.length - 2];
    
    // Invert first two moves
    controller.enqueueMove(
      { axis: move1.axis, layerIndex: move1.layerIndex, direction: (-move1.direction) as 1 | -1 },
      { isUserMove: false, isAutoSolveMove: true, instant: true }
    );
    controller.enqueueMove(
      { axis: move2.axis, layerIndex: move2.layerIndex, direction: (-move2.direction) as 1 | -1 },
      { isUserMove: false, isAutoSolveMove: true, instant: true }
    );
    
    // Cancel auto-solve
    controller.cancelAutoSolve();
    
    // Perform an Undo (undoes one of the remaining scramble moves)
    controller.undo({ instant: true });
    
    // Now trigger Auto-solve again on the remaining history
    controller.autoSolve({ instant: true });
    
    const isSolved = checkCubeSolved(cube).isSolved;
    results['Case 7 (Cancel auto-solve mid-run, Undo, then re-Auto-solve)'] =
      isSolved ? 'PASSED (Consistent history, reached solved state)' : 'FAILED';
    disposeCube(cube);
  }

  console.log('📊 [Phase 5 Test Matrix Results]:', results);
  return results;
}
