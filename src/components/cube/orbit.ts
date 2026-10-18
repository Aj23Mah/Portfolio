import * as THREE from 'three';

export interface SphericalOrbitOptions {
  camera: THREE.PerspectiveCamera;
  target?: THREE.Vector3;
  initialRadius?: number;
  initialTheta?: number;
  initialPhi?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  minRadius?: number;
  maxRadius?: number;
  dampingFactor?: number;
  rotateSpeed?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number; // radians per second
  onFirstInteraction?: () => void;
}

/**
 * SphericalOrbit is a custom lightweight camera orbit controller.
 * It replaces Three.js OrbitControls, provides smooth spherical damping,
 * supports slow idle auto-rotation, and directly exposes theta, phi, and radius
 * for seamless camera tweening with Anime.js v4.
 */
export class SphericalOrbit {
  public camera: THREE.PerspectiveCamera;
  public target: THREE.Vector3;

  // Spherical coordinates (target values)
  public targetTheta: number;
  public targetPhi: number;
  public targetRadius: number;

  // Spherical coordinates (current smoothed values)
  public currentTheta: number;
  public currentPhi: number;
  public currentRadius: number;

  public minPolarAngle: number;
  public maxPolarAngle: number;
  public minRadius: number;
  public maxRadius: number;
  public dampingFactor: number;
  public rotateSpeed: number;

  public autoRotate: boolean;
  public autoRotateSpeed: number;
  public hasUserInteracted: boolean = false;
  public enabled: boolean = true;
  private onFirstInteraction?: () => void;

  constructor(options: SphericalOrbitOptions) {
    this.camera = options.camera;
    this.target = options.target ? options.target.clone() : new THREE.Vector3(0, 0, 0);

    // Derive initial spherical coordinates from camera position if not explicitly supplied
    const offset = new THREE.Vector3().subVectors(this.camera.position, this.target);
    const r = offset.length() || 7.4;
    const phi = Math.acos(THREE.MathUtils.clamp(offset.y / r, -1, 1));
    const theta = Math.atan2(offset.x, offset.z);

    this.targetRadius = options.initialRadius ?? r;
    this.targetTheta = options.initialTheta ?? theta;
    this.targetPhi = options.initialPhi ?? phi;

    this.currentRadius = this.targetRadius;
    this.currentTheta = this.targetTheta;
    this.currentPhi = this.targetPhi;

    this.minPolarAngle = options.minPolarAngle ?? Math.PI * 0.10; // ~18° prevents pole flipping
    this.maxPolarAngle = options.maxPolarAngle ?? Math.PI * 0.90; // ~162°
    this.minRadius = options.minRadius ?? 3.5;
    this.maxRadius = options.maxRadius ?? 22.0;
    this.dampingFactor = options.dampingFactor ?? 0.08;
    this.rotateSpeed = options.rotateSpeed ?? 0.005;

    this.autoRotate = options.autoRotate ?? true;
    this.autoRotateSpeed = options.autoRotateSpeed ?? 0.16; // gentle idle rotation
    this.onFirstInteraction = options.onFirstInteraction;

    this.applyToCamera();
  }

  /**
   * Halts idle auto-rotation on the first user interaction.
   */
  public recordInteraction(): void {
    if (!this.hasUserInteracted) {
      this.hasUserInteracted = true;
      this.autoRotate = false;
      this.onFirstInteraction?.();
    }
  }

  /**
   * Increments azimuthal (theta) and polar (phi) angles based on screen drag deltas.
   */
  public rotate(deltaPixelsX: number, deltaPixelsY: number): void {
    this.recordInteraction();
    this.targetTheta -= deltaPixelsX * this.rotateSpeed;
    this.targetPhi = THREE.MathUtils.clamp(
      this.targetPhi - deltaPixelsY * this.rotateSpeed,
      this.minPolarAngle,
      this.maxPolarAngle
    );
  }

  /**
   * Sets target angles and radius (smoothed via damping).
   */
  public setAngles(theta: number, phi: number, radius?: number): void {
    this.targetTheta = theta;
    this.targetPhi = THREE.MathUtils.clamp(phi, this.minPolarAngle, this.maxPolarAngle);
    if (radius !== undefined) {
      this.targetRadius = THREE.MathUtils.clamp(radius, this.minRadius, this.maxRadius);
    }
  }

  /**
   * Immediately snaps camera to specified spherical coordinates without damping.
   */
  public setImmediate(theta: number, phi: number, radius?: number): void {
    this.setAngles(theta, phi, radius);
    this.currentTheta = this.targetTheta;
    this.currentPhi = this.targetPhi;
    if (radius !== undefined) {
      this.currentRadius = this.targetRadius;
    }
    this.applyToCamera();
  }

  /**
   * Resynchronizes theta, phi, and radius from current camera position.
   * Ensures smooth continuation when switching back from camera transitions.
   */
  public resyncFromCamera(): void {
    const offset = new THREE.Vector3().subVectors(this.camera.position, this.target);
    const r = offset.length() || 7.4;
    const phi = Math.acos(THREE.MathUtils.clamp(offset.y / r, -1, 1));
    const theta = Math.atan2(offset.x, offset.z);

    this.targetRadius = r;
    this.targetTheta = theta;
    this.targetPhi = phi;

    this.currentRadius = r;
    this.currentTheta = theta;
    this.currentPhi = phi;

    this.camera.up.set(0, 1, 0);
  }

  /**
   * Per-frame update step applying idle rotation, damping interpolation, and camera lookAt.
   */
  public update(dtSeconds: number = 0.016): void {
    if (!this.enabled) return;

    if (this.autoRotate && !this.hasUserInteracted) {
      this.targetTheta += this.autoRotateSpeed * dtSeconds;
    }

    // Smooth spherical interpolation (damping)
    this.currentTheta += (this.targetTheta - this.currentTheta) * this.dampingFactor;
    this.currentPhi += (this.targetPhi - this.currentPhi) * this.dampingFactor;
    this.currentRadius += (this.targetRadius - this.currentRadius) * this.dampingFactor;

    this.applyToCamera();
  }

  private applyToCamera(): void {
    const sinPhi = Math.sin(this.currentPhi);
    this.camera.position.x = this.target.x + this.currentRadius * sinPhi * Math.sin(this.currentTheta);
    this.camera.position.y = this.target.y + this.currentRadius * Math.cos(this.currentPhi);
    this.camera.position.z = this.target.z + this.currentRadius * sinPhi * Math.cos(this.currentTheta);
    this.camera.lookAt(this.target);
  }

  public dispose(): void {
    // No external DOM listeners registered directly on document, everything cleaned up via stage
  }
}
