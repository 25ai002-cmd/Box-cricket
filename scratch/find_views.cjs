const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
const lines = code.split('\n');

const targets = [
  'function VenueOnboardingView',
  'function PlayerHomeView',
  'function VenueDetailView',
  'function TeamsView',
  'function RewardsView',
  'function GamingHubView',
  'function MySportsView'
];

targets.forEach(target => {
  const index = lines.findIndex(line => line.includes(target));
  if (index !== -1) {
    console.log(`${target} starts at line ${index + 1}`);
  } else {
    console.log(`${target} not found`);
  }
});
