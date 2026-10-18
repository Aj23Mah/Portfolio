const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'out');
const tokens = [
  'cubeDebug',
  'cubeTest',
  '__triggerEasterEgg',
  '__testCubeController',
  '__testCubeRealController',
  '__testPhase5Matrix'
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(outDir);
let foundAny = false;

console.log(`Checking ${allFiles.length} files in /out for forbidden dev tokens...\n`);

for (const token of tokens) {
  let matches = [];
  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes(token)) {
      matches.push(path.relative(outDir, filePath));
    }
  }
  if (matches.length > 0) {
    foundAny = true;
    console.error(`❌ TOKEN FOUND: "${token}" in: ${matches.join(', ')}`);
  } else {
    console.log(`✓ Token "${token}": 0 matches (CLEAN)`);
  }
}

if (!foundAny) {
  console.log('\n✅ ALL DEV TOKENS ARE 100% ELIMINATED FROM PRODUCTION BUILD /out');
} else {
  process.exit(1);
}
