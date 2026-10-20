import * as THREE from 'three';
import { SphericalOrbit } from './orbit';
import { CubeInstance } from './cube';
import { MoveController, RotationAxis, GenericMove } from './moves';

export interface CubeInputManagerOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  camera: THREE.PerspectiveCamera;
  cube: CubeInstance;
  orbit: SphericalOrbit;
  controller: MoveController;
  onFirstInteraction?: () => void;
  onCenterTap?: (cubie: THREE.Group, normalLocal: THREE.Vector3, hitSticker?: THREE.Mesh) => void;
  isInputDisabled?: () => boolean;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  isCubeHit: boolean;
  isCenter: boolean;
  hitCubie?: THREE.Group;
  hitSticker?: THREE.Mesh;
  hitPointWorld?: THREE.Vector3;
  hitNormalLocal?: THREE.Vector3;
  candidateAxes?: RotationAxis[];
}

/**
 * CubeInputManager manages raycasting, drag-to-twist gestures, camera orbit handoff,
 * middle-layer fallback to orbit, hover highlights, and tap detection for center stickers.
 */
export class CubeInputManager {
  private canvas: HTMLCanvasElement;
  private container: HTMLElement;
  private camera: THREE.PerspectiveCamera;
  private cube: CubeInstance;
  private orbit: SphericalOrbit;
  private controller: MoveController;
  private onFirstInteraction?: () => void;
  private onCenterTap?: (cubie: THREE.Group, normalLocal: THREE.Vector3, hitSticker?: THREE.Mesh) => void;
  private isInputDisabled?: () => boolean;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-999, -999);
  private dragState: DragState | null = null;
  private hoveredSticker: THREE.Mesh | null = null;
  private hoveredOriginalEmissive: THREE.Color | null = null;
  private isDisposed = false;
  private hasInteracted = false;

  private DRAG_THRESHOLD = 9; // ~8-10px drag commit threshold

  public get isDragging(): boolean {
    return this.dragState !== null;
  }

  constructor(options: CubeInputManagerOptions) {
    this.canvas = options.canvas;
    this.container = options.container;
    this.camera = options.camera;
    this.cube = options.cube;
    this.orbit = options.orbit;
    this.controller = options.controller;
    this.onFirstInteraction = options.onFirstInteraction;
    this.onCenterTap = options.onCenterTap;
    this.isInputDisabled = options.isInputDisabled;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.container.addEventListener('pointerdown', this.onPointerDown, { capture: true });
    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerup', this.onPointerUp);
    this.container.addEventListener('pointercancel', this.onPointerCancel);
    this.container.addEventListener('pointerleave', this.onPointerLeave);
  }

  private triggerFirstInteraction(): void {
    if (!this.hasInteracted) {
      this.hasInteracted = true;
      this.orbit.recordInteraction();
      this.onFirstInteraction?.();
    }
  }

  private onPointerDown = (e: PointerEvent): void => {
    if (this.isDisposed || this.isInputDisabled?.()) return;

    // Clear any hover highlight immediately upon drag start
    this.clearHover();

    // Ignore second touches (only track primary pointer)
    if (this.dragState !== null || !e.isPrimary) {
      return;
    }

    // Ignore drag start if auto-solve is running or animation is in flight
    if (this.controller.isAutoSolving() || this.controller.isAnimating()) {
      return;
    }

    this.triggerFirstInteraction();

    // Compute normalized device coordinates
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cube.stickerMeshes, false);

    // Set pointer capture on canvas for robust drag tracking
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch {
      // Fallback for environments where pointer capture might not be permitted
    }

    if (intersects.length > 0) {
      const hit = intersects[0];
      if (!hit.face) return;
      const hitSticker = hit.object as THREE.Mesh;
      const hitCubie = hitSticker.parent as THREE.Group;

      const cubiePos = hitCubie.position;
      const isCenter = Math.round(Math.abs(cubiePos.x) + Math.abs(cubiePos.y) + Math.abs(cubiePos.z)) === 1;

      // Compute hit normal in cube-LOCAL space
      const hitNormalWorld = hit.face.normal.clone().transformDirection(hitSticker.matrixWorld);
      const invCubeMatrix = new THREE.Matrix4().copy(this.cube.cubeGroup.matrixWorld).invert();
      const hitNormalLocal = hitNormalWorld.clone().transformDirection(invCubeMatrix);

      // Round to clean axis unit vector
      const roundedNormal = new THREE.Vector3(
        Math.round(hitNormalLocal.x),
        Math.round(hitNormalLocal.y),
        Math.round(hitNormalLocal.z)
      ).normalize();

      // Determine the two candidate twist axes perpendicular to hitNormal
      const candidateAxes: RotationAxis[] = [];
      if (Math.abs(roundedNormal.x) > 0.5) {
        candidateAxes.push('y', 'z');
      } else if (Math.abs(roundedNormal.y) > 0.5) {
        candidateAxes.push('x', 'z');
      } else {
        candidateAxes.push('x', 'y');
      }

      this.dragState = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        isCubeHit: true,
        isCenter,
        hitCubie,
        hitSticker,
        hitPointWorld: hit.point.clone(),
        hitNormalLocal: roundedNormal,
        candidateAxes,
      };
    } else {
      // Missed cube: background drag orbits the camera
      this.dragState = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        isCubeHit: false,
        isCenter: false,
      };
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (this.isDisposed || this.isInputDisabled?.()) {
      this.clearHover();
      return;
    }

    // Ignore hover calculations on touch devices
    if (e.pointerType === 'touch') {
      this.clearHover();
      if (!this.dragState) return;
    }

    // Update mouse for hover raycasting when not actively dragging
    if (!this.dragState) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      return;
    }

    // Only process moves for the active pointer
    if (e.pointerId !== this.dragState.pointerId) return;

    const deltaX = e.clientX - this.dragState.lastX;
    const deltaY = e.clientY - this.dragState.lastY;
    this.dragState.lastX = e.clientX;
    this.dragState.lastY = e.clientY;

    if (!this.dragState.isCubeHit) {
      // Missed cube: orbit camera
      this.orbit.rotate(deltaX, deltaY);
      return;
    }

    // Drag started on the cube
    const totalDist = Math.hypot(e.clientX - this.dragState.startX, e.clientY - this.dragState.startY);

    if (totalDist >= this.DRAG_THRESHOLD) {
      // If drag started on a center sticker: orbit instead of twisting
      if (this.dragState.isCenter) {
        this.orbit.rotate(deltaX, deltaY);
        return;
      }

      // Check candidate twist move
      const move = this.resolveBestMove(e.clientX - this.dragState.startX, e.clientY - this.dragState.startY);

      // If drag resolves to middle slice (layerIndex === 0): orbit instead of twisting
      if (move && move.layerIndex === 0) {
        this.orbit.rotate(deltaX, deltaY);
        return;
      }

      // Valid outer face move
      if (move) {
        this.controller.enqueueMove(move, { isUserMove: true });
        this.releaseDrag();
      }
    }
  };

  private resolveBestMove(deltaX: number, deltaY: number): GenericMove | null {
    if (
      !this.dragState ||
      !this.dragState.hitCubie ||
      !this.dragState.hitPointWorld ||
      !this.dragState.hitNormalLocal ||
      !this.dragState.candidateAxes
    ) {
      return null;
    }

    const { hitCubie, hitPointWorld, hitNormalLocal, candidateAxes } = this.dragState;
    const dragVectorScreen = new THREE.Vector2(deltaX, deltaY);
    const rect = this.canvas.getBoundingClientRect();

    const projectToScreen = (posWorld: THREE.Vector3): THREE.Vector2 => {
      const p = posWorld.clone().project(this.camera);
      return new THREE.Vector2(
        ((p.x + 1) / 2) * rect.width,
        ((1 - p.y) / 2) * rect.height
      );
    };

    const screenP0 = projectToScreen(hitPointWorld);

    let bestAxis: RotationAxis = candidateAxes[0];
    let bestDot = 0;
    let bestDirection: 1 | -1 = 1;

    for (const axis of candidateAxes) {
      const axisUnit = new THREE.Vector3(
        axis === 'x' ? 1 : 0,
        axis === 'y' ? 1 : 0,
        axis === 'z' ? 1 : 0
      );

      // Tangent vector of motion for positive rotation
      const tangentLocal = new THREE.Vector3().crossVectors(axisUnit, hitNormalLocal);
      const tangentWorld = tangentLocal.clone().transformDirection(this.cube.cubeGroup.matrixWorld);

      // Project small offset point to screen to measure 2D screen direction
      const screenP1 = projectToScreen(hitPointWorld.clone().addScaledVector(tangentWorld, 0.4));
      const axisScreenDir = new THREE.Vector2().subVectors(screenP1, screenP0);

      const len = axisScreenDir.length();
      if (len > 0.001) {
        axisScreenDir.divideScalar(len);
        const dot = dragVectorScreen.dot(axisScreenDir);

        if (Math.abs(dot) > Math.abs(bestDot)) {
          bestDot = dot;
          bestAxis = axis;
          bestDirection = dot > 0 ? 1 : -1;
        }
      }
    }

    // Determine target layer index from the hit cubie's coordinate along the chosen twist axis
    const cubiePos = hitCubie.position;
    const layerIndex = Math.round(cubiePos[bestAxis]);

    return {
      axis: bestAxis,
      layerIndex,
      direction: bestDirection,
      name: `Drag_${bestAxis}_${layerIndex}`,
    };
  }

  private releaseDrag(): void {
    if (this.dragState) {
      try {
        this.canvas.releasePointerCapture(this.dragState.pointerId);
      } catch {
        // ignore
      }
      this.dragState = null;
    }
  }

  private onPointerUp = (e: PointerEvent): void => {
    if (this.dragState && e.pointerId === this.dragState.pointerId) {
      const totalDist = Math.hypot(e.clientX - this.dragState.startX, e.clientY - this.dragState.startY);

      // Check if this was a clean tap on a center sticker
      if (totalDist < this.DRAG_THRESHOLD && this.dragState.isCubeHit && this.dragState.isCenter) {
        if (this.dragState.hitCubie && this.dragState.hitNormalLocal) {
          this.onCenterTap?.(this.dragState.hitCubie, this.dragState.hitNormalLocal, this.dragState.hitSticker);
        }
      }

      this.releaseDrag();
    }
  };

  private onPointerCancel = (e: PointerEvent): void => {
    if (this.dragState && e.pointerId === this.dragState.pointerId) {
      this.releaseDrag();
    }
  };

  private onPointerLeave = (): void => {
    this.mouse.set(-999, -999);
    this.clearHover();
  };

  /**
   * Updates hover highlight on sticker under cursor.
   * Call inside the animation loop.
   */
  public updateHover(): void {
    if (this.isDisposed || this.dragState !== null || this.isInputDisabled?.()) {
      this.clearHover();
      return;
    }

    if (this.mouse.x > -2 && this.mouse.x < 2) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.cube.stickerMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit !== this.hoveredSticker) {
          this.clearHover();
          this.hoveredSticker = hit;
          const hitMat = hit.material as THREE.MeshStandardMaterial;
          this.hoveredOriginalEmissive = hitMat.emissive.clone();
          hitMat.emissive.setHex(0x383838);
        }
      } else {
        this.clearHover();
      }
    }
  }

  private clearHover(): void {
    if (this.hoveredSticker && this.hoveredOriginalEmissive) {
      const mat = this.hoveredSticker.material as THREE.MeshStandardMaterial;
      mat.emissive.copy(this.hoveredOriginalEmissive);
      this.hoveredSticker = null;
      this.hoveredOriginalEmissive = null;
    }
  }

  public dispose(): void {
    this.isDisposed = true;
    this.releaseDrag();
    this.clearHover();

    this.container.removeEventListener('pointerdown', this.onPointerDown, { capture: true });
    this.container.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('pointerup', this.onPointerUp);
    this.container.removeEventListener('pointercancel', this.onPointerCancel);
    this.container.removeEventListener('pointerleave', this.onPointerLeave);
  }
}
