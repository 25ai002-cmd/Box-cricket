const fs = require('fs');
const path = require('path');
const https = require('https');

const destDir = path.join(__dirname, '..', 'public', 'images', 'gear');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const items = [
  { name: 'cricket_ball.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Used_cricket_ball.jpg' },
  { name: 'cricket_bat.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/GandM_Flare_DXM_bat-Purist_156g_ball.jpg' },
  { name: 'soccer_football.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Soccerball.jpg' },
  { name: 'badminton_racket.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Badminton_racket.jpg' },
  { name: 'shuttlecocks.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Shuttlecock.jpg' },
  { name: 'tennis_racket.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Tennis_racket.jpg' },
  { name: 'tennis_balls.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Tennis_Ball.jpg' },
  { name: 'table_tennis.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Jason_ping_pong_paddle.jpg' },
  { name: 'snooker_cue.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Billiard_Chalk_and_Cue.jpg' },
  { name: 'pool_cue.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Billiard_Balls.jpg' },
  { name: 'keyboard.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Computer_Keyboard.jpg' },
  { name: 'headset.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Headphones.jpg' },
  { name: 'basketball.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png' },
  { name: 'volleyball.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Volleyball.jpg' },
  { name: 'golf_balls.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Golf_ball.jpg' },
  { name: 'hockey_stick.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Hockey_stick_held_in_front_of_an_outdoor_hockey_field.jpg' },
  { name: 'skates.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Inline-skate-adjustable.jpg' }
];

function downloadImage(item) {
  return new Promise((resolve, reject) => {
    const destPath = path.join(destDir, item.name);
    const file = fs.createWriteStream(destPath);
    
    // Parse host and path from URL
    const urlObj = new URL(item.url);
    
    const options = {
      host: urlObj.hostname,
      path: urlObj.pathname,
      headers: {
        'User-Agent': 'PlayfinityApp/1.0 (contact: admin@playfinity.com)'
      }
    };
    
    https.get(options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        https.get({
          host: new URL(response.headers.location).hostname,
          path: new URL(response.headers.location).pathname,
          headers: {
            'User-Agent': 'PlayfinityApp/1.0 (contact: admin@playfinity.com)'
          }
        }, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${item.name} from redirect`);
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${item.name}`);
          resolve();
        });
      } else {
        fs.unlink(destPath, () => {});
        reject(new Error(`Failed to download ${item.name}: Status code ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Starting download of 17 verified sports equipment photos...');
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
