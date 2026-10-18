const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const chunkDir = path.resolve(__dirname, '../out/_next/static/chunks');
const files = fs.readdirSync(chunkDir);

console.log('=== CUBE-RELATED PRODUCTION CHUNKS ===\n');

let totalRaw = 0;
let totalGzip = 0;

files.forEach((file) => {
  if (!file.endsWith('.js')) return;
  const fullPath = path.join(chunkDir, file);
  const content = fs.readFileSync(fullPath);
  const text = content.toString('utf8');

  let type = null;
  if (text.includes('WebGLRenderer') || text.includes('PerspectiveCamera')) {
    type = 'Three.js (Core 3D Engine)';
  } else if (text.includes('animejs') || text.includes('createTimeline') || (text.includes('animate(') && text.includes('targets'))) {
    type = 'Anime.js v4 (Animation Engine)';
  } else if (text.includes('CubeCanvas') || text.includes('createCube') || text.includes('MoveController') || text.includes('SphericalOrbit')) {
    type = 'Cube Component & Controls';
  }

  if (type) {
    const rawKB = content.length / 1024;
    const gzipKB = zlib.gzipSync(content).length / 1024;
    totalRaw += rawKB;
    totalGzip += gzipKB;
    console.log(`- ${file}`);
    console.log(`  Package: ${type}`);
    console.log(`  Raw:     ${rawKB.toFixed(2)} KB`);
    console.log(`  Gzipped: ${gzipKB.toFixed(2)} KB\n`);
  }
});

console.log('--- SUMMARY ---');
console.log(`Total Cube-Related JS Raw:     ${totalRaw.toFixed(2)} KB`);
console.log(`Total Cube-Related JS Gzipped: ${totalGzip.toFixed(2)} KB`);
