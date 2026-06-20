const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
const lines = content.split('\n');

const inputLines = [];
lines.forEach((line, index) => {
  if (line.includes('<input') || line.includes('<textarea')) {
    inputLines.push(index);
  }
});

inputLines.forEach(lineIdx => {
  console.log(`--- Line ${lineIdx + 1} ---`);
  for (let i = Math.max(0, lineIdx - 2); i <= Math.min(lines.length - 1, lineIdx + 4); i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
});
