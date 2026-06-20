const fs = require('fs');
const path = require('path');
const https = require('https');

const destDir = path.join(__dirname, '..', 'public', 'images', 'gear');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const items = [
  { name: 'cricket_ball.jpg', query: 'cricket,ball' },
  { name: 'cricket_bat.jpg', query: 'cricket,bat' },
  { name: 'soccer_football.jpg', query: 'soccer,ball' },
  { name: 'badminton_racket.jpg', query: 'badminton,racket' },
  { name: 'shuttlecocks.jpg', query: 'badminton,shuttlecock' },
  { name: 'tennis_racket.jpg', query: 'tennis,racket' },
  { name: 'tennis_balls.jpg', query: 'tennis,ball' },
  { name: 'table_tennis.jpg', query: 'pingpong,paddle' },
  { name: 'snooker_cue.jpg', query: 'billiards,cue' },
  { name: 'pool_cue.jpg', query: 'pool,cue,stick' },
  { name: 'keyboard.jpg', query: 'keyboard,gaming' },
  { name: 'headset.jpg', query: 'gaming,headset' },
  { name: 'basketball.jpg', query: 'basketball,ball' },
  { name: 'volleyball.jpg', query: 'volleyball,ball' },
  { name: 'golf_balls.jpg', query: 'golf,ball' },
  { name: 'hockey_stick.jpg', query: 'hockey,stick' },
  { name: 'skates.jpg', query: 'inline,skates' }
];

function downloadImage(item) {
  return new Promise((resolve, reject) => {
    const url = `https://loremflickr.com/150/150/${encodeURIComponent(item.query)}`;
    const destPath = path.join(destDir, item.name);
    const file = fs.createWriteStream(destPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        let redirectUrl = response.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = 'https://loremflickr.com' + redirectUrl;
        }
        https.get(redirectUrl, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${item.name} using tags: ${item.query}`);
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${item.name} using tags: ${item.query}`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Starting download of 17 real images from LoremFlickr...');
  for (const item of items) {
    try {
      await downloadImage(item);
    } catch (e) {
      console.error(`Failed to download ${item.name}:`, e.message);
    }
  }
  console.log('All downloads finished successfully!');
}

run();
