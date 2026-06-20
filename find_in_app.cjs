const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const query = process.argv[2];
if (!query) {
  console.log("Please provide a search query");
  process.exit(1);
}

console.log(`Searching for "${query}" in App.jsx...`);
let found = 0;
lines.forEach((line, index) => {
  if (line.toLowerCase().includes(query.toLowerCase())) {
    console.log(`${index + 1}: ${line.trim()}`);
    found++;
  }
});
console.log(`Found ${found} matches.`);
