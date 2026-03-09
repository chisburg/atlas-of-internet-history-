/**
 * Phase 2 — Wayback Screenshot Generator
 *
 * Reads thumbnailManifest.json, takes a headless screenshot of each
 * "found" entry's snapshot_url, saves as /public/thumbnails/{slug}.png,
 * and marks the entry as status "ok" in the manifest.
 *
 * Usage:
 *   node scripts/generate-thumbnails.mjs           # process all "found" entries
 *   node scripts/generate-thumbnails.mjs geocities  # process single slug
 *   node scripts/generate-thumbnails.mjs --tier=1   # process only Tier 1
 *   node scripts/generate-thumbnails.mjs --force     # re-process "ok" entries too
 *
 * Requirements:
 *   npm install --save-dev puppeteer
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname   = dirname(fileURLToPath(import.meta.url));
const ROOT        = join(__dirname, '..');
const MANIFEST_PATH = join(ROOT, 'src/data/thumbnailManifest.json');
const THUMB_DIR   = join(ROOT, 'public', 'thumbnails');
mkdirSync(THUMB_DIR, { recursive: true });

// ── CLI args ──────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const force   = args.includes('--force');
const tierArg = args.find(a => a.startsWith('--tier='));
const onlyTier = tierArg ? parseInt(tierArg.split('=')[1]) : null;
const onlySlug = args.find(a => !a.startsWith('--'));

// ── Config ────────────────────────────────────────────────────────────────────
const VIEWPORT   = { width: 1280, height: 900 };
const CLIP_HEIGHT = 660;  // how many pixels from the top of the page to capture
const TIMEOUT     = 30000; // ms to wait for page

// ── Load manifest ─────────────────────────────────────────────────────────────
let manifest = {};
if (existsSync(MANIFEST_PATH)) {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
}

const entries = Object.values(manifest).filter(e => {
  if (!e.snapshot_url) return false;
  if (onlySlug && e.slug !== onlySlug) return false;
  if (onlyTier && e.tier !== onlyTier) return false;
  if (!force && e.status === 'ok' && existsSync(join(THUMB_DIR, `${e.slug}.png`))) return false;
  return e.status === 'found' || force;
});

if (entries.length === 0) {
  console.log('Nothing to process. Run fetch-wayback-snapshots.mjs first, or use --force.');
  process.exit(0);
}

// Sort: Tier 1 first
entries.sort((a, b) => (a.tier ?? 2) - (b.tier ?? 2));
console.log(`Processing ${entries.length} entries (${entries.filter(e => e.tier === 1).length} Tier 1).\n`);

// ── Browser launch ────────────────────────────────────────────────────────────
const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
    '--ignore-certificate-errors',
  ],
});

let ok = 0, failed = 0;

for (const entry of entries) {
  const { slug, snapshot_url, tier } = entry;
  const destPath = join(THUMB_DIR, `${slug}.png`);

  console.log(`  → T${tier} ${slug.padEnd(30)} ${snapshot_url.slice(0, 70)}`);

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // Suppress JS errors
  page.on('pageerror', () => {});
  page.on('requestfailed', () => {});

  try {
    await page.goto(snapshot_url, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT,
    });

    // Wait a moment for CSS/layout
    await new Promise(r => setTimeout(r, 1200));

    // Remove the Wayback Machine toolbar so we capture only the original page
    await page.evaluate(() => {
      for (const id of ['wm-ipp-base', 'wm-ipp', 'wb-header', 'wm-toolbar']) {
        document.getElementById(id)?.remove();
      }
      document.querySelectorAll(
        '#wm-ipp-base, .wb-header, [id^="wm-"], [class*="wb-"], ' +
        '#playback, .playback-toolbar, #donato'
      ).forEach(el => el.remove());
      // Scroll to top
      window.scrollTo(0, 0);
    });

    await new Promise(r => setTimeout(r, 300));

    // Screenshot the top CLIP_HEIGHT pixels of the page
    await page.screenshot({
      path: destPath,
      type: 'png',
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: CLIP_HEIGHT },
    });

    manifest[slug] = {
      ...entry,
      thumbnail_path: `/thumbnails/${slug}.png`,
      status: 'ok',
    };

    console.log(`     ✓ saved ${slug}.png`);
    ok++;
  } catch (e) {
    console.log(`     ✗ fail: ${e.message.slice(0, 80)}`);
    manifest[slug] = { ...entry, status: 'failed', error: e.message.slice(0, 120) };
    failed++;
  } finally {
    await page.close();
  }

  // Save manifest progress after each entry (crash-safe)
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

  // Brief pause between pages
  await new Promise(r => setTimeout(r, 800));
}

await browser.close();

console.log(`\nDone. ok=${ok} failed=${failed}`);
console.log(`Manifest updated at ${MANIFEST_PATH}`);
