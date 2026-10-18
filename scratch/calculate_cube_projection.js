const THREE = require('three');

function measureCubeAtViewport(width, height) {
  const aspect = width / height;

  let r;
  if (aspect <= 0.50) {
    r = 12.0;
  } else if (aspect <= 0.65) {
    r = 11.2;
  } else if (aspect <= 0.85) {
    r = 10.5;
  } else if (aspect < 1.2) {
    r = 8.6;
  } else {
    r = 7.4;
  }

  const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
  const target = new THREE.Vector3(0, -0.2, 0);

  // Initial spherical angles from camera.position.set(4.4, 3.4, 4.9) relative to target (0, -0.2, 0)
  const initOffset = new THREE.Vector3(4.4, 3.4 - (-0.2), 4.9);
  const radiusOrig = initOffset.length();
  const dir = initOffset.clone().normalize();

  camera.position.copy(target).addScaledVector(dir, r);
  camera.lookAt(target);
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();

  // 8 bounding box corners of the 3x3x3 Rubik's cube in world coordinates
  const corners = [
    new THREE.Vector3(-1.5, -1.5, -1.5),
    new THREE.Vector3(-1.5, -1.5,  1.5),
    new THREE.Vector3(-1.5,  1.5, -1.5),
    new THREE.Vector3(-1.5,  1.5,  1.5),
    new THREE.Vector3( 1.5, -1.5, -1.5),
    new THREE.Vector3( 1.5, -1.5,  1.5),
    new THREE.Vector3( 1.5,  1.5, -1.5),
    new THREE.Vector3( 1.5,  1.5,  1.5),
  ];

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  corners.forEach((corner) => {
    const p = corner.clone().project(camera);
    // NDC (-1 to 1) to screen pixels (0 to width/height, top-left origin)
    const sx = ((p.x + 1) / 2) * width;
    const sy = ((1 - p.y) / 2) * height;

    if (sx < minX) minX = sx;
    if (sx > maxX) maxX = sx;
    if (sy < minY) minY = sy;
    if (sy > maxY) maxY = sy;
  });

  const cubeWidth = Math.round(maxX - minX);
  const cubeHeight = Math.round(maxY - minY);
  const widthPercent = ((cubeWidth / width) * 100).toFixed(1);

  // Toolbar position: bottom 24px (bottom-6) or 32px (sm:bottom-8), height ~52px
  const toolbarTop = height - (width >= 640 ? 32 : 24) - 52;
  const clearance = Math.round(toolbarTop - maxY);

  return {
    viewport: `${width}x${height}`,
    radius: r,
    boundingBox: {
      left: Math.round(minX),
      right: Math.round(maxX),
      top: Math.round(minY),
      bottom: Math.round(maxY),
      width: cubeWidth,
      height: cubeHeight,
    },
    widthPercent: `${widthPercent}%`,
    toolbarTop: Math.round(toolbarTop),
    clearance: `${clearance}px`,
  };
}

console.log('=== MEASURED ON-SCREEN CUBE BOUNDS & TOOLBAR CLEARANCE ===\n');

const viewports = [
  [360, 640],
  [390, 844],
  [768, 1024],
];

viewports.forEach(([w, h]) => {
  const res = measureCubeAtViewport(w, h);
  console.log(`Viewport: ${res.viewport}`);
  console.log(`  - Camera Radius:     ${res.radius}`);
  console.log(`  - Projected Box:     ${res.boundingBox.width}px x ${res.boundingBox.height}px (X: [${res.boundingBox.left}, ${res.boundingBox.right}], Y: [${res.boundingBox.top}, ${res.boundingBox.bottom}])`);
  console.log(`  - Width Coverage:    ${res.widthPercent} of viewport width`);
  console.log(`  - Toolbar Top (Y):   ${res.toolbarTop}px`);
  console.log(`  - Toolbar Clearance: ${res.clearance}\n`);
});
