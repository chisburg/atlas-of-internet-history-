/**
 * Targeted recovery for key missing thumbnails.
 * Uses specific known Wikipedia image file URLs.
 * Usage: node scripts/recover-thumbnails.mjs
 */
import https from 'https';
import { createWriteStream, existsSync } from 'fs';
import { pipeline } from 'stream/promises';

const DIRECT = [
  // Key Tier 1 — confirmed real Wikipedia file URLs from media-list API
  { slug: 'geocities',  url: 'https://upload.wikimedia.org/wikipedia/en/2/28/VeryFirstGeologo.png' },
  { slug: 'yahoo',      url: 'https://upload.wikimedia.org/wikipedia/en/3/34/Yahoo_screenshot_1994.png' },
  { slug: 'newgrounds', url: 'https://upload.wikimedia.org/wikipedia/en/8/85/Newgrounds_Tankman_logo.png' },
  { slug: 'spotify',    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Spotify_for_Android_screenshot.png/300px-Spotify_for_Android_screenshot.png' },
  { slug: 'blogger',    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Blogger_icon_2017.svg/250px-Blogger_icon_2017.svg.png' },
  { slug: 'slashdot',   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Slashdot_logo.png/300px-Slashdot_logo.png' },
  { slug: 'bittorrent', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/BitTorrent_logo.svg/300px-BitTorrent_logo.svg.png' },
  { slug: 'stumbleupon',url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/StumbleUpon_Logo.svg/300px-StumbleUpon_Logo.svg.png' },
  // For napster, myspace, friendster, lunarstorm — Wikipedia has no good images.
  // Use distinctive Wikipedia logos / representative images as fallback.
  { slug: 'napster',    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Napster_corporate_logo.svg/300px-Napster_corporate_logo.svg.png' },
  { slug: 'myspace',    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Myspace_logo.svg/300px-Myspace_logo.svg.png' },
  { slug: 'friendster', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Friendster_logo.svg/300px-Friendster_logo.svg.png' },
  { slug: 'lunarstorm', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LunarStorm.png/300px-LunarStorm.png' },
  { slug: 'hamster-dance', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Hamster_dance.jpg/240px-Hamster_dance.jpg' },
  { slug: 'lolcats',    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/I_has_a_hotdog_3.jpg/240px-I_has_a_hotdog_3.jpg' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'AtlasOfInternet/1.0' },
      timeout: 20000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const ct = res.headers['content-type'] ?? '';
      if (!ct.startsWith('image/')) {
        res.resume();
        reject(new Error(`Not image: ${ct}`));
        return;
      }
      pipeline(res, createWriteStream(dest)).then(resolve).catch(reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

for (const { slug, url } of DIRECT) {
  const dest = `public/thumbnails/${slug}.jpg`;
  if (existsSync(dest)) { console.log(`  skip ${slug}`); continue; }
  try {
    await download(url, dest);
    console.log(`  ✓ ${slug}`);
  } catch(e) {
    console.log(`  ✗ ${slug}: ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 1000));
}
console.log('\nDone recovery pass.');
