const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'server.cjs'), 'utf8');
const lines = content.split('\n');

console.log("API Endpoints in server.cjs:");
lines.forEach((line, index) => {
  if (line.includes('app.get(') || line.includes('app.post(') || line.includes('app.put(') || line.includes('app.delete(') || line.includes('app.patch(')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
