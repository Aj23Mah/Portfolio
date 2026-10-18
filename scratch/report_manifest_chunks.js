const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const manifestPath = path.resolve(__dirname, '../.next/react-loadable-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const entryKey = 'components\\cube\\CubeWrapper.tsx -> ./CubeCanvas';
const files = manifest[entryKey]?.files || [];

console.log('=== OFFICIAL IMPORT-DERIVED CUBE CHUNK REPORT ===');
console.log(`Source Entry: ${entryKey}\n`);

let totalRaw = 0;
let totalGz = 0;

const descriptions = {
  'b536a0f1': 'Three.js (WebGLRenderer, Camera, Core 3D Math)',
  'bd904a5c': 'Three.js (Geometries, Materials, CanvasTexture)',
  '137': 'Anime.js v4 (Camera Tweens & Arc Easing)',
  '194': 'Cube Canvas & Engine (Controller, Solved Detection, Overlay)',
};

files.forEach((fileRel) => {
  const fullPath = path.resolve(__dirname, '../out/_next', fileRel);
  if (!fs.existsSync(fullPath)) {
    console.log(`[Missing] ${fileRel}`);
    return;
  }
  const rawBytes = fs.statSync(fullPath).size;
  const content = fs.readFileSync(fullPath);
  const gzBytes = zlib.gzipSync(content).length;

  totalRaw += rawBytes;
  totalGz += gzBytes;

  const fileName = path.basename(fileRel);
  const prefix = fileName.split('.')[0];
  const desc = descriptions[prefix] || 'Cube Module';

  console.log(`- ${fileName}`);
  console.log(`  Package: ${desc}`);
  console.log(`  Raw:     ${(rawBytes / 1024).toFixed(2)} KB (${rawBytes.toLocaleString()} bytes)`);
  console.log(`  Gzipped: ${(gzBytes / 1024).toFixed(2)} KB (${gzBytes.toLocaleString()} bytes)\n`);
});

console.log('--------------------------------------------------');
console.log(`Total Cube-Related JS Raw:     ${(totalRaw / 1024).toFixed(2)} KB (${totalRaw.toLocaleString()} bytes)`);
console.log(`Total Cube-Related JS Gzipped: ${(totalGz / 1024).toFixed(2)} KB (${totalGz.toLocaleString()} bytes)`);
