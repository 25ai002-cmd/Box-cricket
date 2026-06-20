const fs = require('fs');
const path = require('path');
const https = require('https');

const destDir = path.join(__dirname, '..', 'public', 'images', 'gear');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const items = [
  { name: 'cricket_ball.jpg', id: 'photo-1607604276583-eef5d076aa5f' },
  { name: 'cricket_bat.jpg', id: 'photo-1531415080290-bc9e8d32be75' },
  { name: 'soccer_football.jpg', id: 'photo-1508098682722-e99c43a406b2' },
  { name: 'badminton_racket.jpg', id: 'photo-1626224583764-f87db24ac4ea' },
  { name: 'shuttlecocks.jpg', id: 'photo-1558497257-82502de57582' },
  { name: 'tennis_racket.jpg', id: 'photo-1617083934555-ac7d4fee8909' },
  { name: 'tennis_balls.jpg', id: 'photo-1592709823125-a191f07a2a5e' },
  { name: 'table_tennis.jpg', id: 'photo-1534158914592-062992fbe900' },
  { name: 'snooker_cue.jpg', id: 'photo-1544377193-33dcf4d68fb5' },
  { name: 'pool_cue.jpg', id: 'photo-1511512578047-dfb367046420' },
  { name: 'keyboard.jpg', id: 'photo-1618384887929-16ec33fab9ef' },
  { name: 'headset.jpg', id: 'photo-1546435770-a3e426bf472b' },
  { name: 'basketball.jpg', id: 'photo-1519766304817-4f37bda74a27' },
  { name: 'volleyball.jpg', id: 'photo-1592656094267-764a450285b6' },
  { name: 'golf_balls.jpg', id: 'photo-1587174486073-ae5e5cff23aa' },
  { name: 'hockey_stick.jpg', id: 'photo-1589801258579-18e0ae1f7ad8' },
  { name: 'skates.jpg', id: 'photo-1564982743477-83210741c497' }
];

function downloadImage(item) {
  return new Promise((resolve, reject) => {
    const url = `https://images.unsplash.com/${item.id}?w=150&auto=format&fit=crop&q=80`;
    const destPath = path.join(destDir, item.name);
    const file = fs.createWriteStream(destPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${item.name}`);
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
          console.log(`Downloaded ${item.name}`);
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
  console.log('Starting download of 17 images...');
  for (const item of items) {
    try {
      await downloadImage(item);
    } catch (e) {
      console.error(`Failed to download ${item.name}:`, e.message);
    }
  }
  console.log('All downloads finished!');
}

run();
