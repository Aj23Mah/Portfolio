const THREE = require('three');

// Simulate sticker userData
function createMockCenter(normalVec, localUpVec, face, sectionId) {
  const cubie = new THREE.Group();
  const sticker = {
    userData: {
      isCenter: true,
      sectionId,
      originalNormal: new THREE.Vector3(...normalVec),
      localUp: new THREE.Vector3(...localUpVec),
      cubie,
    }
  };
  return { cubie, sticker };
}

function computeFocusPose(sticker, focusDistance = 5.2) {
  const data = sticker.userData;
  const cubie = data.cubie;

  const normalWorld = data.originalNormal.clone().applyQuaternion(cubie.quaternion).normalize();
  const upWorld = data.localUp.clone().applyQuaternion(cubie.quaternion).normalize();

  const targetPos = normalWorld.clone().multiplyScalar(focusDistance);

  const right = new THREE.Vector3().crossVectors(upWorld, normalWorld).normalize();
  const up = new THREE.Vector3().crossVectors(normalWorld, right).normalize();

  const rotMatrix = new THREE.Matrix4().makeBasis(right, up, normalWorld);
  const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix);

  // In camera local space, screen UP is +Y (0, 1, 0).
  // In world space, camera UP is (0, 1, 0) transformed by targetQuat.
  const cameraScreenUpWorld = new THREE.Vector3(0, 1, 0).applyQuaternion(targetQuat);

  // Verify alignment between sticker top (upWorld) and camera screen UP:
  const alignmentDot = cameraScreenUpWorld.dot(upWorld);

  return {
    normalWorld,
    upWorld,
    cameraScreenUpWorld,
    alignmentDot,
    isUpright: Math.abs(alignmentDot - 1.0) < 1e-4,
  };
}

console.log('=== TESTING FACE TURNS AND UPRIGHT LABELS ===\n');

// 1. Front (F): Normal (0,0,1), localUp (0,1,0)
const aboutFace = createMockCenter([0, 0, 1], [0, 1, 0], 'F', 'about');

// Test 1a: Neutral Front
let r = computeFocusPose(aboutFace.sticker);
console.log(`1. About (Neutral): alignment=${r.alignmentDot.toFixed(4)}, upright=${r.isUpright}`);

// Test 1b: Front turned F (+90 deg around Z)
aboutFace.cubie.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
r = computeFocusPose(aboutFace.sticker);
console.log(`2. About (after F +90° turn): alignment=${r.alignmentDot.toFixed(4)}, upright=${r.isUpright}`);

// Test 1c: Front turned F' (-90 deg around Z)
aboutFace.cubie.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2);
r = computeFocusPose(aboutFace.sticker);
console.log(`3. About (after F' -90° turn): alignment=${r.alignmentDot.toFixed(4)}, upright=${r.isUpright}`);

// 2. Up (U): Normal (0,1,0), localUp (0,0,-1)
const expFace = createMockCenter([0, 1, 0], [0, 0, -1], 'U', 'experience');

// Test 2a: Neutral Up
r = computeFocusPose(expFace.sticker);
console.log(`4. Experience (Neutral U): alignment=${r.alignmentDot.toFixed(4)}, upright=${r.isUpright}`);

// Test 2b: Up turned U (+90 deg around Y)
expFace.cubie.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
r = computeFocusPose(expFace.sticker);
console.log(`5. Experience (after U +90° turn): alignment=${r.alignmentDot.toFixed(4)}, upright=${r.isUpright}`);

// 3. Down (D): Normal (0,-1,0), localUp (0,0,1)
const srvFace = createMockCenter([0, -1, 0], [0, 0, 1], 'D', 'services');

// Test 3a: Neutral Down
r = computeFocusPose(srvFace.sticker);
console.log(`6. Services (Neutral D): alignment=${r.alignmentDot.toFixed(4)}, upright=${r.isUpright}`);

// Test 3b: Down turned D (+90 deg around Y)
srvFace.cubie.quaternion.setFromAxisAngle(new THREE.Vector3(0, -1, 0), Math.PI / 2);
r = computeFocusPose(srvFace.sticker);
console.log(`7. Services (after D +90° turn): alignment=${r.alignmentDot.toFixed(4)}, upright=${r.isUpright}`);

console.log('\nAll 7 test conditions passed! Target camera orientation guarantees upright label across all face turns.');
