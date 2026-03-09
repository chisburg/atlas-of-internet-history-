/**
 * Phase 1 — Wayback Snapshot Discovery
 *
 * Reads thumbnail_targets_v2.csv (passed as arg or uses default path),
 * queries the Wayback Machine Availability API + CDX API for each target,
 * picks the best snapshot near preferred_year, and writes/merges into:
 *
 *   src/data/thumbnailManifest.json
 *
 * Usage:
 *   node scripts/fetch-wayback-snapshots.mjs
 *   node scripts/fetch-wayback-snapshots.mjs /path/to/thumbnail_targets_v2.csv
 *
 * After this runs, each manifest entry has:
 *   status: "found"  — snapshot URL discovered, screenshot not yet taken
 *   status: "ok"     — snapshot + thumbnail both exist (set by Phase 2)
 *   status: "missing"— no usable Wayback snapshot found
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, '..');
const CSV_PATH   = process.argv[2] ?? join(ROOT, 'src/data/thumbnail_targets_v2.csv');
const MANIFEST_PATH = join(ROOT, 'src/data/thumbnailManifest.json');

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function fetchText(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: { 'User-Agent': 'AtlasOfInternet/1.0 (snapshot discovery script)' },
      timeout: 12000,
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        fetchText(res.headers.location, retries).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode === 429 && retries > 0) {
        const wait = 4000 + Math.random() * 3000;
        res.resume();
        setTimeout(() => fetchText(url, retries - 1).then(resolve).catch(reject), wait);
        return;
      }
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`timeout: ${url}`)); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCsv(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Handle quoted fields
    const fields = [];
    let inQuote = false, cur = '';
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === ',' && !inQuote) { fields.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    fields.push(cur.trim());
    const row = {};
    headers.forEach((h, i) => { row[h.trim()] = (fields[i] ?? '').trim(); });
    rows.push(row);
  }
  return rows;
}

// ── Wayback Availability API ──────────────────────────────────────────────────

async function queryAvailability(url, year) {
  const ts = `${year}0701`; // mid-year as target timestamp
  const apiUrl = `http://archive.org/wayback/available?url=${encodeURIComponent(url)}&timestamp=${ts}`;
  try {
    const { status, body } = await fetchText(apiUrl);
    if (status !== 200) return null;
    const data = JSON.parse(body);
    const snap = data?.archived_snapshots?.closest;
    if (!snap?.available) return null;
    return { timestamp: snap.timestamp, url: snap.url };
  } catch { return null; }
}

// ── CDX API — find best snapshot near preferred_year ─────────────────────────

async function queryCdx(cdxUrl) {
  try {
    const { status, body } = await fetchText(cdxUrl);
    if (status !== 200) return null;
    const rows = JSON.parse(body);
    if (!Array.isArray(rows) || rows.length < 2) return null;
    // rows[0] is header, rest are data
    const [tsIdx] = [0]; // timestamp is index 0
    const dataRows = rows.slice(1);
    if (dataRows.length === 0) return null;
    // Pick the first (earliest in range, which is closest to from-year)
    const [ts, orig] = dataRows[0];
    return {
      timestamp: ts,
      url: `https://web.archive.org/web/${ts}/${orig}`,
    };
  } catch { return null; }
}

// ── Main ──────────────────────────────────────────────────────────────────────

// Load existing manifest (or start fresh)
let manifest = {};
if (existsSync(MANIFEST_PATH)) {
  try { manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')); }
  catch { manifest = {}; }
}

// Read and deduplicate CSV targets (Tier 1 preferred over Tier 2 for same slug)
const rawText = readFileSync(CSV_PATH, 'utf8');
const rows = parseCsv(rawText);
const targets = new Map();
for (const row of rows) {
  const slug = row.slug;
  if (!slug) continue;
  const tier = parseInt(row.tier) || 2;
  const existing = targets.get(slug);
  if (!existing || tier < existing.tier) targets.set(slug, { ...row, tier });
}
console.log(`Loaded ${targets.size} unique targets from CSV.\n`);

let found = 0, missing = 0, skipped = 0;

for (const [slug, target] of targets) {
  const existing = manifest[slug];

  // Skip if we already have a confirmed thumbnail or a found snapshot
  if (existing?.status === 'ok') {
    console.log(`  ✓ skip  [ok]     ${slug}`);
    skipped++;
    continue;
  }
  if (existing?.status === 'found' && existing?.snapshot_url) {
    console.log(`  ✓ skip  [found]  ${slug}`);
    skipped++;
    continue;
  }

  const year = parseInt(target.preferred_year) || 2000;
  const url  = target.canonical_url;

  // 1. Try Availability API
  let snap = await queryAvailability(url, year);
  await sleep(500);

  // 2. Fallback to CDX API
  if (!snap && target.wayback_cdx_url) {
    snap = await queryCdx(target.wayback_cdx_url);
    await sleep(600);
  }

  if (snap) {
    manifest[slug] = {
      slug,
      title:         target.title,
      tier:          parseInt(target.tier) || 2,
      canonical_url: url,
      preferred_year: year,
      timestamp:     snap.timestamp,
      snapshot_url:  snap.url.replace(/^http:\/\//, 'https://'),
      thumbnail_path: `/thumbnails/${slug}.png`,
      source:        'wayback',
      status:        'found',
    };
    console.log(`  ✓ found  T${target.tier}  ${slug.padEnd(28)} ${snap.timestamp}`);
    found++;
  } else {
    manifest[slug] = {
      slug,
      title:         target.title,
      tier:          parseInt(target.tier) || 2,
      canonical_url: url,
      preferred_year: year,
      timestamp:     null,
      snapshot_url:  null,
      thumbnail_path: null,
      source:        null,
      status:        'missing',
    };
    console.log(`  ✗ miss   T${target.tier}  ${slug}`);
    missing++;
  }

  await sleep(300); // gentle pacing
}

// Also seed manifest with existing Wikipedia JPEGs we already have
const existingJpegs = [
  '4chan','altavista','aol-instant-messenger','ask-jeeves','blogger','chrome',
  'craigslist','deviantart','discord','ebay','facebook','firefox','geocities',
  'google','homestar-runner','icq','instagram','internet-archive','internet-explorer',
  'know-your-meme','limewire','livejournal','mosaic','msn-messenger','netscape-navigator',
  'newgrounds','paypal','reddit','skype','something-awful','the-pirate-bay','tiktok',
  'tumblr','twitter','wayback-machine','wikipedia','winamp','wordpress','world-wide-web',
  'yahoo','ytmnd',
];
for (const slug of existingJpegs) {
  if (!manifest[slug]) {
    manifest[slug] = {
      slug, tier: 2, source: 'wikipedia',
      thumbnail_path: `/thumbnails/${slug}.jpg`,
      status: 'ok',
    };
  } else if (manifest[slug].status !== 'ok') {
    // Keep wayback data but also record that a jpeg fallback exists
    manifest[slug].wikipedia_fallback = `/thumbnails/${slug}.jpg`;
  }
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`\nDone. found=${found} missing=${missing} skipped=${skipped}`);
console.log(`Manifest written to ${MANIFEST_PATH}`);
console.log(`Next: node scripts/generate-thumbnails.mjs`);
