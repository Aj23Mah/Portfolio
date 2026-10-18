const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../out/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const checks = [
  { section: 'About', phrase: 'About Me' },
  { section: 'Experience', phrase: 'CAREER PATH' },
  { section: 'Projects', phrase: 'SELECTED WORK' },
  { section: 'Services', phrase: 'WHAT I CAN DO' },
  { section: 'Skills/Tools', phrase: 'PostgreSQL' },
  { section: 'Contact', phrase: 'Have an idea, a project, or a problem that needs solving?' }
];

console.log('=== /out/index.html CONTENT VERIFICATION ===');
let allFound = true;
for (const c of checks) {
  const found = html.includes(c.phrase);
  if (!found) allFound = false;
  console.log(`[${found ? 'PASS' : 'FAIL'}] ${c.section}: "${c.phrase}" (found: ${found})`);
}

if (allFound) {
  console.log('\nSUCCESS: All 6 sections are confirmed present in static /out/index.html for SEO and progressive enhancement!');
  process.exit(0);
} else {
  console.log('\nFAILURE: One or more section phrases were missing from /out/index.html');
  process.exit(1);
}
