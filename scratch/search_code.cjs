const fs = require('fs');
const path = require('path');

const query = process.argv[2];
const fileArg = process.argv[3] || 'src/App.jsx';

if (!query) {
  console.log("Usage: node search_code.cjs <query> [relative_file_path]");
  process.exit(1);
}

const filePath = path.join(__dirname, '..', fileArg);
if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log(`Searching for "${query}" in ${fileArg}...`);
let found = 0;
lines.forEach((line, index) => {
  if (line.toLowerCase().includes(query.toLowerCase())) {
    console.log(`${index + 1}: ${line.trim()}`);
    found++;
  }
});
console.log(`Found ${found} matches.`);
