const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Comprehensive emoji regex - covers all emoji unicode ranges
const emojiRegex = /(?:[\u2600-\u27BF]|[\u2B05-\u2B55]|[\u2934-\u2935]|[\u3030\u303D\u3297\u3299]|[\u231A\u231B]|[\u23E9-\u23FA]|[\u25AA-\u25FE]|\u2139|[\uFE00-\uFE0F]|\u200D|\u20E3|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])+/g;

function getFiles(dir, exts) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item === 'node_modules') continue;
      // Skip ui components directory
      if (dir.endsWith('components') && item === 'ui') continue;
      results = results.concat(getFiles(fullPath, exts));
    } else if (exts.some(ext => item.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getFiles(srcDir, ['.tsx', '.ts']);
let totalCleaned = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const cleaned = content.replace(emojiRegex, '');
  if (content !== cleaned) {
    fs.writeFileSync(file, cleaned, 'utf8');
    totalCleaned++;
    const matches = content.match(emojiRegex);
    console.log(`Cleaned: ${path.relative(__dirname, file)} (${matches ? matches.length : 0} emoji instances)`);
  }
}

console.log(`\nTotal files cleaned: ${totalCleaned}`);
