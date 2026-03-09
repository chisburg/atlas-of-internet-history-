/**
 * Thumbnail resolution — manifest-driven with graceful fallback.
 *
 * Source priority (per slug):
 *   1. Wayback Machine screenshot (.png)  — source: "wayback", status: "ok"
 *   2. Wikipedia / static image (.jpg)    — source: "wikipedia", status: "ok"
 *   3. Icon (SVG, rendered in canvas)
 *   4. Badge
 *   5. Dot
 *
 * The manifest (src/data/thumbnailManifest.json) is the single source
 * of truth. It is populated by two pipeline scripts:
 *   node scripts/fetch-wayback-snapshots.mjs   ← Phase 1: discover snapshots
 *   node scripts/generate-thumbnails.mjs        ← Phase 2: screenshot them
 *
 * The legacy AVAILABLE_THUMBNAILS Set is kept as a fallback for slugs
 * that exist as .jpg but are not yet in the manifest.
 */

import rawManifest from '@/data/thumbnailManifest.json';
import { AVAILABLE_THUMBNAILS } from '@/data/availableThumbnails';

export interface ThumbnailEntry {
  slug:           string;
  tier?:          number;
  source?:        'wayback' | 'wikipedia' | string;
  snapshot_url?:  string | null;
  timestamp?:     string | null;
  thumbnail_path: string;
  status:         'ok' | 'found' | 'missing' | 'failed';
  wikipedia_fallback?: string;
}

const manifest = rawManifest as Record<string, ThumbnailEntry>;

/**
 * Returns true if a usable thumbnail image is available for this slug.
 * Checks the manifest first, then the legacy set.
 */
export function hasThumbnail(slug: string): boolean {
  const entry = manifest[slug];
  if (entry?.status === 'ok' && entry.thumbnail_path) return true;
  // Legacy fallback: wikipedia JPEG from previous pass
  if (AVAILABLE_THUMBNAILS.has(slug)) return true;
  return false;
}

/**
 * Returns the best available thumbnail path for a slug.
 *
 * Preference order:
 *   Wayback .png  >  Wikipedia .jpg  >  legacy .jpg
 */
export function getThumbnailPath(slug: string): string {
  const entry = manifest[slug];

  if (entry?.status === 'ok' && entry.thumbnail_path) {
    // If this slug also has a wayback .png as a wikipedia_fallback upgrade,
    // prefer the wayback one (wayback entries use .png).
    return entry.thumbnail_path;
  }

  // Legacy .jpg from AVAILABLE_THUMBNAILS
  if (AVAILABLE_THUMBNAILS.has(slug)) return `/thumbnails/${slug}.jpg`;

  // Default (will likely 404 gracefully in the browser)
  return `/thumbnails/${slug}.jpg`;
}

/**
 * Returns the manifest entry for a slug, or null.
 * Useful for displaying snapshot_url, timestamp, etc. in the UI.
 */
export function getThumbnailEntry(slug: string): ThumbnailEntry | null {
  return manifest[slug] ?? null;
}

/**
 * Returns all slugs that have status "ok" in the manifest.
 */
export function getAvailableSlugs(): string[] {
  return Object.values(manifest)
    .filter(e => e.status === 'ok' && e.thumbnail_path)
    .map(e => e.slug);
}
