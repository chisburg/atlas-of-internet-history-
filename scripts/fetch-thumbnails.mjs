/**
 * Thumbnail Acquisition Script
 * Usage: node scripts/fetch-thumbnails.mjs
 *
 * Strategy per artifact:
 *   1. Wikipedia REST summary API  → thumbnail.source (lead image / screenshot)
 *   2. Wayback Machine CDX API     → find earliest good snapshot URL
 *      then Wayback Machine screenshot endpoint → /screenshot/{url}
 *   3. Skip if all sources fail
 *
 * Writes to:
 *   public/thumbnails/{slug}.jpg
 *   src/data/availableThumbnails.ts  (updated with successful slugs)
 */

import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { pipeline } from 'stream/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const OUT_DIR   = join(ROOT, 'public', 'thumbnails');
mkdirSync(OUT_DIR, { recursive: true });

// ── Target list ──────────────────────────────────────────────────────────────

const TARGETS = [
  // slug, tier, wikipedia article title, canonical_url for wayback fallback
  // Tier 1
  { slug: 'world-wide-web',     tier: 1, wikipedia: 'World_Wide_Web',          canonical_url: 'http://info.cern.ch/' },
  { slug: 'netscape-navigator', tier: 1, wikipedia: 'Netscape_Navigator',       canonical_url: 'http://home.netscape.com/' },
  { slug: 'geocities',          tier: 1, wikipedia: 'GeoCities',                canonical_url: 'http://www.geocities.com/' },
  { slug: 'google',             tier: 1, wikipedia: 'Google',                   canonical_url: 'http://www.google.com/' },
  { slug: 'blogger',            tier: 1, wikipedia: 'Blogger_(service)',        canonical_url: 'http://www.blogger.com/' },
  { slug: 'icq',                tier: 1, wikipedia: 'ICQ',                      canonical_url: 'http://www.icq.com/' },
  { slug: 'napster',            tier: 1, wikipedia: 'Napster',                  canonical_url: 'http://www.napster.com/' },
  { slug: 'newgrounds',         tier: 1, wikipedia: 'Newgrounds',               canonical_url: 'http://www.newgrounds.com/' },
  { slug: 'myspace',            tier: 1, wikipedia: 'Myspace',                  canonical_url: 'http://www.myspace.com/' },
  { slug: 'reddit',             tier: 1, wikipedia: 'Reddit',                   canonical_url: 'http://www.reddit.com/' },
  { slug: 'facebook',           tier: 1, wikipedia: 'Facebook',                 canonical_url: 'http://www.facebook.com/' },
  { slug: 'wikipedia',          tier: 1, wikipedia: 'Wikipedia',                canonical_url: 'http://www.wikipedia.org/' },
  // Tier 2
  { slug: 'mosaic',             tier: 2, wikipedia: 'Mosaic_(web_browser)',     canonical_url: 'http://www.ncsa.uiuc.edu/' },
  { slug: 'internet-explorer',  tier: 2, wikipedia: 'Internet_Explorer',        canonical_url: 'http://www.microsoft.com/windows/ie/' },
  { slug: 'firefox',            tier: 2, wikipedia: 'Firefox',                  canonical_url: 'http://www.mozilla.org/products/firefox/' },
  { slug: 'chrome',             tier: 2, wikipedia: 'Google_Chrome',            canonical_url: 'http://www.google.com/chrome/' },
  { slug: 'yahoo',              tier: 2, wikipedia: 'Yahoo!',                   canonical_url: 'http://www.yahoo.com/' },
  { slug: 'altavista',          tier: 2, wikipedia: 'AltaVista',                canonical_url: 'http://www.altavista.com/' },
  { slug: 'slashdot',           tier: 2, wikipedia: 'Slashdot',                 canonical_url: 'http://slashdot.org/' },
  { slug: 'digg',               tier: 2, wikipedia: 'Digg',                     canonical_url: 'http://digg.com/' },
  { slug: 'livejournal',        tier: 2, wikipedia: 'LiveJournal',              canonical_url: 'http://www.livejournal.com/' },
  { slug: 'wordpress',          tier: 2, wikipedia: 'WordPress',                canonical_url: 'http://wordpress.org/' },
  { slug: 'tumblr',             tier: 2, wikipedia: 'Tumblr',                   canonical_url: 'http://www.tumblr.com/' },
  { slug: 'aol-instant-messenger', tier: 2, wikipedia: 'AIM_(software)',        canonical_url: 'http://www.aim.com/' },
  { slug: 'msn-messenger',      tier: 2, wikipedia: 'Windows_Live_Messenger',   canonical_url: 'http://messenger.msn.com/' },
  { slug: 'skype',              tier: 2, wikipedia: 'Skype',                    canonical_url: 'http://www.skype.com/' },
  { slug: 'discord',            tier: 2, wikipedia: 'Discord',                  canonical_url: 'http://discord.com/' },
  { slug: 'limewire',           tier: 2, wikipedia: 'LimeWire',                 canonical_url: 'http://www.limewire.com/' },
  { slug: 'bittorrent',         tier: 2, wikipedia: 'BitTorrent',               canonical_url: 'http://www.bittorrent.com/' },
  { slug: 'the-pirate-bay',     tier: 2, wikipedia: 'The_Pirate_Bay',           canonical_url: 'http://thepiratebay.org/' },
  { slug: 'winamp',             tier: 2, wikipedia: 'Winamp',                   canonical_url: 'http://www.winamp.com/' },
  { slug: 'spotify',            tier: 2, wikipedia: 'Spotify',                  canonical_url: 'http://www.spotify.com/' },
  { slug: 'something-awful',    tier: 2, wikipedia: 'Something_Awful',          canonical_url: 'http://www.somethingawful.com/' },
  { slug: 'macromedia-flash',   tier: 2, wikipedia: 'Adobe_Flash',              canonical_url: 'http://www.macromedia.com/software/flash/' },
  { slug: 'homestar-runner',    tier: 2, wikipedia: 'Homestar_Runner',          canonical_url: 'http://www.homestarrunner.com/' },
  { slug: 'friendster',         tier: 2, wikipedia: 'Friendster',               canonical_url: 'http://www.friendster.com/' },
  { slug: 'twitter',            tier: 2, wikipedia: 'Twitter',                  canonical_url: 'http://twitter.com/' },
  { slug: 'instagram',          tier: 2, wikipedia: 'Instagram',                canonical_url: 'http://instagram.com/' },
  { slug: '4chan',               tier: 2, wikipedia: '4chan',                    canonical_url: 'http://www.4chan.org/' },
  { slug: 'deviantart',         tier: 2, wikipedia: 'DeviantArt',               canonical_url: 'http://www.deviantart.com/' },
  { slug: 'ebay',               tier: 2, wikipedia: 'EBay',                     canonical_url: 'http://www.ebay.com/' },
  { slug: 'craigslist',         tier: 2, wikipedia: 'Craigslist',               canonical_url: 'http://www.craigslist.org/' },
  { slug: 'paypal',             tier: 2, wikipedia: 'PayPal',                   canonical_url: 'http://www.paypal.com/' },
  { slug: 'internet-archive',   tier: 2, wikipedia: 'Internet_Archive',         canonical_url: 'http://www.archive.org/' },
  { slug: 'wayback-machine',    tier: 2, wikipedia: 'Wayback_Machine',          canonical_url: 'http://web.archive.org/' },
  { slug: 'know-your-meme',     tier: 2, wikipedia: 'Know_Your_Meme',           canonical_url: 'http://knowyourmeme.com/' },
  { slug: 'lunarstorm',         tier: 2, wikipedia: 'LunarStorm',               canonical_url: 'http://www.lunarstorm.se/' },
  { slug: 'ytmnd',              tier: 2, wikipedia: 'YTMND',                    canonical_url: 'http://ytmnd.com/' },
  { slug: 'tiktok',             tier: 2, wikipedia: 'TikTok',                   canonical_url: 'http://www.tiktok.com/' },
  { slug: 'stumbleupon',        tier: 2, wikipedia: 'StumbleUpon',              canonical_url: 'http://www.stumbleupon.com/' },
  { slug: 'ask-jeeves',         tier: 2, wikipedia: 'Ask.com',                  canonical_url: 'http://www.askjeeves.com/' },
  { slug: 'hamster-dance',      tier: 2, wikipedia: 'Hampster_Dance',           canonical_url: 'http://www.hamsterdance.com/' },
  { slug: 'lolcats',            tier: 2, wikipedia: 'I_Can_Has_Cheezburger%3F', canonical_url: 'http://icanhas.cheezburger.com/' },
];

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function fetchJson(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'AtlasOfInternet/1.0 (https://github.com/atlas-of-internet; thumbnail fetch)',
        'Accept': 'application/json',
      },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchJson(res.headers.location, retries).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode === 429 && retries > 0) {
        const wait = 4000 + Math.random() * 3000;
        console.log(`    ⏳ 429 rate limit, retrying in ${Math.round(wait/1000)}s...`);
        setTimeout(() => fetchJson(url, retries - 1).then(resolve).catch(reject), wait);
        res.resume();
        return;
      }
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`JSON parse error for ${url}`)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

function downloadBinary(url, destPath, retries = 3) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'AtlasOfInternet/1.0 (https://github.com/atlas-of-internet; thumbnail fetch)',
      },
      timeout: 30000,
    }, (res) => {
      if (res.statusCode === 429 && retries > 0) {
        const wait = 5000 + Math.random() * 3000;
        console.log(`    ⏳ 429 on binary, retrying in ${Math.round(wait/1000)}s...`);
        res.resume();
        setTimeout(() => downloadBinary(url, destPath, retries - 1).then(resolve).catch(reject), wait);
        return;
      }
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadBinary(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const ct = res.headers['content-type'] ?? '';
      if (!ct.startsWith('image/')) {
        reject(new Error(`Not an image (${ct}) for ${url}`));
        return;
      }
      const stream = createWriteStream(destPath);
      pipeline(res, stream).then(resolve).catch(reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Wikipedia source ─────────────────────────────────────────────────────────

async function tryWikipedia(target) {
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(target.wikipedia)}`;
  try {
    const data = await fetchJson(apiUrl);
    const thumb = data?.thumbnail?.source;
    if (!thumb) return null;
    return thumb; // Use as-is — avoid extra URL manipulation that could break
  } catch (e) {
    return null;
  }
}

// ── Wayback Machine screenshot source ────────────────────────────────────────
// Correct format: https://web.archive.org/screenshot/{canonical_url}
// This returns a PNG screenshot of the latest archived version.

async function tryWaybackScreenshot(canonicalUrl) {
  return `https://web.archive.org/screenshot/${canonicalUrl}`;
}

// ── Main loop ─────────────────────────────────────────────────────────────────

const succeeded = [];
const failed    = [];

for (const target of TARGETS) {
  const destPath = join(OUT_DIR, `${target.slug}.jpg`);

  if (existsSync(destPath)) {
    console.log(`  ✓ skip  ${target.slug}  (already exists)`);
    succeeded.push(target.slug);
    continue;
  }

  let imageUrl = null;

  // 1. Wikipedia — with generous rate-limit spacing
  if (target.wikipedia) {
    imageUrl = await tryWikipedia(target);
    if (imageUrl) {
      console.log(`  → wiki   ${target.slug}: ${imageUrl.slice(0, 80)}`);
    }
    await sleep(2000); // respect Wikipedia rate limits
  }

  // 2. Wayback Machine screenshot of the canonical URL (correct format)
  if (!imageUrl && target.canonical_url) {
    imageUrl = await tryWaybackScreenshot(target.canonical_url);
    console.log(`  → wayback ${target.slug}: ${imageUrl.slice(0, 80)}`);
    await sleep(1500);
  }

  if (!imageUrl) {
    console.log(`  ✗ skip  ${target.slug}: no source found`);
    failed.push(target.slug);
    continue;
  }

  try {
    await downloadBinary(imageUrl, destPath);
    console.log(`  ✓ saved ${target.slug}`);
    succeeded.push(target.slug);
  } catch (e) {
    console.log(`  ✗ fail  ${target.slug}: ${e.message}`);
    // Try wayback as fallback if Wikipedia failed
    const expectedWaybackUrl = target.canonical_url ? `https://web.archive.org/screenshot/${target.canonical_url}` : null;
    if (target.canonical_url && imageUrl !== expectedWaybackUrl) {
      const fallbackUrl = `https://web.archive.org/screenshot/${target.canonical_url}`;
      try {
        await downloadBinary(fallbackUrl, destPath);
        console.log(`    ↩ fallback saved ${target.slug}`);
        succeeded.push(target.slug);
      } catch (e2) {
        failed.push(target.slug);
      }
    } else {
      failed.push(target.slug);
    }
  }

  await sleep(200);
}

// ── Write availableThumbnails.ts ─────────────────────────────────────────────

const slugLines = succeeded.map(s => `  '${s}',`).join('\n');
const ts = `/**
 * AUTO-GENERATED by scripts/fetch-thumbnails.mjs
 * Do not edit manually — run \`node scripts/fetch-thumbnails.mjs\` to refresh.
 *
 * Contains the set of slugs for which a thumbnail file exists at
 * public/thumbnails/{slug}.jpg
 */
export const AVAILABLE_THUMBNAILS: ReadonlySet<string> = new Set([
${slugLines}
]);
`;

writeFileSync(join(ROOT, 'src/data/availableThumbnails.ts'), ts, 'utf8');

console.log(`\nDone. ${succeeded.length} thumbnails saved, ${failed.length} failed.`);
if (failed.length > 0) console.log('Failed:', failed.join(', '));
