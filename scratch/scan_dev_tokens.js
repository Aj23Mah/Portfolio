const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '../out');
const tokens = [
  'cubeDebug',
  'cubeTest',
  '__triggerEasterEgg',
  '__testCubeController',
  '__testCubeRealController',
  '__testPhase5Matrix',
];

let totalFiles = 0;
let totalMatches = 0;
const matchedDetails = [];

function walkDir(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile()) {
      totalFiles++;
      const ext = path.extname(entry.name).toLowerCase();
      // Only scan code / text files
      if (['.js', '.html', '.css', '.json', '.txt', '.map'].includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const token of tokens) {
          if (content.includes(token)) {
            totalMatches++;
            matchedDetails.push({
              file: path.relative(outDir, fullPath),
              token,
            });
          }
        }
      }
    }
  }
}

console.log(`Scanning directory: ${outDir}`);
walkDir(outDir);

console.log(`\n=== SCAN REPORT ===`);
console.log(`Total files scanned: ${totalFiles}`);
console.log(`Tokens searched: ${tokens.join(', ')}`);
console.log(`Total matches found: ${totalMatches}`);

if (totalMatches > 0) {
  console.log('\nMatches:');
  matchedDetails.forEach((m) => console.log(`  - [${m.token}] in ${m.file}`));
  process.exit(1);
} else {
  console.log('\nVERIFIED: 0 dev tokens found across all files in /out directory.');
  process.exit(0);
}
