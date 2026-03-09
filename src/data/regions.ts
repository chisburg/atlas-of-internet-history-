import {
  ARTIFACT_REGISTRY,
  ARTIFACT_TIER_MAP,
  COMPUTED_POSITIONS,
  REGION_LAYOUT,
  getTierFromRegistry,
} from './parseArtifacts';

// ── Canvas ─────────────────────────────────────────────────────────────────────

export const CANVAS_WIDTH  = 3200;
export const CANVAS_HEIGHT = 2200;

// ── Region interface (as expected by AtlasCanvas) ─────────────────────────────

export interface Region {
  id:       string;
  label:    string;
  sublabel: string;
  cx: number; cy: number;
  rx: number; ry: number;
  color:    string;
  artifacts: string[];   // anchor slugs in this region
}

/** Derive the REGIONS array from the layout definition + registry */
export const REGIONS: Region[] = Object.entries(REGION_LAYOUT).map(([name, def]) => {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  const anchors = ARTIFACT_REGISTRY
    .filter((r) => r.region === name && r.is_anchor)
    .map((r) => r.slug);
  return {
    id,
    label:     name,
    sublabel:  def.sublabel,
    cx: def.cx, cy: def.cy,
    rx: def.rx, ry: def.ry,
    color:     def.color,
    artifacts: anchors,
  };
});

// ── Artifact positions (generated from CSV cluster layout) ────────────────────

export const ARTIFACT_POSITIONS: Record<string, [number, number]> = COMPUTED_POSITIONS;

// ── Region lookup ─────────────────────────────────────────────────────────────

/** Pre-built slug → Region map for O(1) lookup */
const SLUG_TO_REGION: Map<string, Region> = new Map();
for (const row of ARTIFACT_REGISTRY) {
  const region = REGIONS.find((r) => r.label === row.region);
  if (region) SLUG_TO_REGION.set(row.slug, region);
}

export function getRegion(slug: string): Region | undefined {
  return SLUG_TO_REGION.get(slug);
}

// ── Progressive density tiers ─────────────────────────────────────────────────

/**
 * Minimum canvas scale at which each tier first becomes visible.
 *
 *  Tier 1 — anchors:    always visible  (calm, readable far view, ~13 nodes)
 *  Tier 2 — cluster:    scale ≥ 0.55   (medium zoom — fills the regions)
 *  Tier 3 — secondary:  scale ≥ 0.82   (close zoom — neighbourhood detail)
 *  Tier 4 — deep:       scale ≥ 1.10   (closest zoom — long tail discovery)
 */
export const TIER_MIN_SCALE: Record<1 | 2 | 3 | 4, number> = {
  1: 0,
  2: 0.55,
  3: 0.82,
  4: 1.10,
};

/** Tier 1 slugs (always-visible anchors) */
export const TIER_1 = new Set<string>(
  [...ARTIFACT_TIER_MAP.entries()].filter(([, t]) => t === 1).map(([s]) => s),
);

/** Tier 2 slugs */
export const TIER_2 = new Set<string>(
  [...ARTIFACT_TIER_MAP.entries()].filter(([, t]) => t === 2).map(([s]) => s),
);

/** Tier 3 slugs */
export const TIER_3 = new Set<string>(
  [...ARTIFACT_TIER_MAP.entries()].filter(([, t]) => t === 3).map(([s]) => s),
);

/** Tier 4 slugs */
export const TIER_4 = new Set<string>(
  [...ARTIFACT_TIER_MAP.entries()].filter(([, t]) => t === 4).map(([s]) => s),
);

/** Anchor slugs used as zoom targets (Tier 1 + prominent Tier 2 icons) */
export const ANCHOR_SLUGS: Set<string> = new Set([
  ...TIER_1,
  ...ARTIFACT_REGISTRY
    .filter((r) => r.tier === 2 && r.visual_type !== 'dot')
    .slice(0, 20)
    .map((r) => r.slug),
]);

/** Tier lookup backed by the CSV registry */
export function getArtifactTier(slug: string): 1 | 2 | 3 | 4 {
  return getTierFromRegistry(slug);
}
