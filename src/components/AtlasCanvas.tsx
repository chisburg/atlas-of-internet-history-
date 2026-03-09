'use client';

import React, {
  useState, useRef, useEffect, useCallback, useMemo,
} from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { artifacts, edges, getArtifact } from '@/data/seed';
import { ARTIFACT_REGISTRY, ARTIFACT_ROW_MAP, ARTIFACT_TIER_MAP, type ArtifactCsvRow } from '@/data/parseArtifacts';
import { ArtifactIcon, ArtifactCard, BadgeNode, SelectedThumbnailHero } from '@/components/NodeVisuals';
import { hasThumbnail, getThumbnailPath } from '@/lib/thumbnails';
import { getConnections, getAllConnections } from '@/lib/navigation';
import { useTrailStore } from '@/store/trail';
import { useUIStore } from '@/store/ui';
import {
  REGIONS, ARTIFACT_POSITIONS, ANCHOR_SLUGS,
  CANVAS_WIDTH, CANVAS_HEIGHT, getRegion,
  TIER_MIN_SCALE, getArtifactTier, TIER_1,
} from '@/data/regions';
import {
  getRegionLandmarks, getLandmarkNeighborhood, NEIGHBORHOOD_RADIUS,
} from '@/data/explorationGraph';
import type { Artifact, Connection, RelationType } from '@/lib/types';

// Slugs that have full artifact pages in seed.ts
const SEED_SLUGS = new Set(artifacts.map((a) => a.slug));

// ── Constants ─────────────────────────────────────────────────────────────────

const RELATION_CONFIG: Record<RelationType, { color: string; label: string; sublabel: string }> = {
  before:      { color: '#3b82f6', label: 'Before',      sublabel: 'Historical predecessor' },
  after:       { color: '#34d399', label: 'After',        sublabel: 'What followed'          },
  sideways:    { color: '#8b5cf6', label: 'Sideways',     sublabel: 'Parallel existence'     },
  sameEra:     { color: '#f59e0b', label: 'Same Era',     sublabel: 'Shared moment in time'  },
  strangeJump: { color: '#f43f5e', label: 'Strange Jump', sublabel: 'Surprising connection'  },
};

const TIME_MIN = 1990;
const TIME_MAX = 2020;
const TICK_YEARS = [1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2020];

const ZOOM_MIN     = 0.13;
const ZOOM_MAX     = 2.5;
const ZOOM_REGION  = 0.34;   // below: region view
const ZOOM_CLUSTER = 0.75;   // below: cluster view; above: artifact view

// ── Pure helpers ──────────────────────────────────────────────────────────────

/** Time-layer visibility for registry rows using preferred_year ± window */
function rowVisible(row: ArtifactCsvRow, year: number): boolean {
  const start = row.preferred_year - 3;
  const end   = row.preferred_year + 10;
  return year >= start && year <= end;
}

function getDefaultYear(a: Artifact): number {
  const mid = Math.round((a.startYear + (a.endYear ?? 2022)) / 2);
  return Math.max(TIME_MIN, Math.min(TIME_MAX, mid));
}

/** Whether a label should be shown for a given label_mode at current scale */
function shouldShowLabel(labelMode: string, scale: number): boolean {
  switch (labelMode) {
    case 'always':   return true;
    case 'medium+':  return scale >= TIER_MIN_SCALE[2];
    case 'close+':   return scale >= TIER_MIN_SCALE[3];
    case 'closest':  return scale >= TIER_MIN_SCALE[4];
    default:         return false;
  }
}

function getEraLabel(year: number): string {
  if (year >= 2018) return 'Platform Consolidation';
  if (year >= 2014) return 'Post-Social Web';
  if (year >= 2011) return 'Mobile-First Era';
  if (year >= 2008) return 'Mobile Begins';
  if (year >= 2004) return 'Social Web';
  if (year >= 2001) return 'Web 2.0';
  if (year >= 1999) return 'Dot-Com Boom';
  if (year >= 1996) return 'Early Web';
  if (year >= 1993) return 'Web Goes Public';
  return 'Pre-Web Era';
}

function yearRange(a: Artifact): string {
  return a.endYear ? `${a.startYear}–${a.endYear}` : `${a.startYear}–present`;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Whether a node tier is revealed at the given canvas scale */
function isTierVisible(tier: 1 | 2 | 3 | 4, scale: number): boolean {
  return scale >= TIER_MIN_SCALE[tier];
}

/** Used in the wheel-handler closure (no state, only refs) */
function isTierVisibleByScale(slug: string, s: number): boolean {
  return s >= TIER_MIN_SCALE[getArtifactTier(slug)];
}

// ── Node render mode ──────────────────────────────────────────────────────────
// Progressive visual richness: card → badge → icon-circle → glow-dot → dot
// (ArtifactIcon, ArtifactCard, BadgeNode are imported from NodeVisuals.tsx)

type RenderMode = 'card' | 'badge' | 'icon-circle' | 'glow-dot' | 'dot';

// ── FocusCard sub-component ───────────────────────────────────────────────────

interface FocusCardProps {
  slug: string;
  selectedYear: number;
  visibleSlugs: Set<string>;
  onExplore: (slug: string) => void;
  onSelectNode: (slug: string) => void;
  onClose: () => void;
  nodeScreenPos: { x: number; y: number } | null;
  containerSize: { w: number; h: number };
}

function FocusCard({
  slug, selectedYear, visibleSlugs,
  onExplore, onSelectNode, onClose,
  nodeScreenPos, containerSize,
}: FocusCardProps) {
  const seedArtifact = getArtifact(slug);
  const regRow       = ARTIFACT_ROW_MAP.get(slug);
  if (!seedArtifact && !regRow) return null;

  const connections = getConnections(slug); // empty for non-seed slugs — graceful
  const region  = getRegion(slug);
  const color   = region?.color ?? '#aaaaaa';
  const title   = seedArtifact?.title ?? regRow?.title ?? slug;
  const yr      = seedArtifact
    ? yearRange(seedArtifact)
    : `${regRow?.preferred_year ?? '—'}`;
  const isActive = visibleSlugs.has(slug);
  const canNavigate = SEED_SLUGS.has(slug);

  // Build route hints from existing connections
  type RouteHint = { label: string; arrow: string; conn: Connection; color: string };
  const routes: RouteHint[] = [];
  const before = connections.find((c) => c.relationType === 'before');
  const after  = connections.find((c) => c.relationType === 'after');
  const strange = connections.find((c) => c.relationType === 'strangeJump');
  const side    = connections.find((c) => c.relationType === 'sideways');
  const same    = connections.find((c) => c.relationType === 'sameEra');

  if (before)  routes.push({ label: 'Trace origins',       arrow: '←', conn: before,  color: '#3b82f6' });
  if (after)   routes.push({ label: 'Follow what came next', arrow: '→', conn: after,   color: '#34d399' });
  if (strange) routes.push({ label: 'Take a strange jump',  arrow: '⤴', conn: strange, color: '#f43f5e' });
  else if (side && routes.length < 3)
    routes.push({ label: 'Explore parallels', arrow: '↔', conn: side, color: '#8b5cf6' });
  else if (same && routes.length < 3)
    routes.push({ label: 'Same moment in time', arrow: '~', conn: same, color: '#f59e0b' });

  const topRoutes = routes.slice(0, 3);

  // Tether: line from card's top-right corner to the selected node's screen position
  // Card is at bottom: 80px, left: 16px, width: 336px
  const CARD_W   = 336;
  const cardLeft = 16;
  const cardTopApprox = containerSize.h - 80 - 300; // rough card height estimate
  const tetherFrom = { x: cardLeft + CARD_W / 2, y: cardTopApprox };
  const showTether =
    nodeScreenPos !== null &&
    nodeScreenPos.x > 0 && nodeScreenPos.x < containerSize.w &&
    nodeScreenPos.y > 0 && nodeScreenPos.y < containerSize.h;

  return (
    <>
      {/* Tether line rendered in a sibling SVG overlay */}
      {showTether && nodeScreenPos && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ overflow: 'visible' }}
        >
          <line
            x1={tetherFrom.x} y1={tetherFrom.y}
            x2={nodeScreenPos.x} y2={nodeScreenPos.y}
            stroke={color}
            strokeOpacity={0.18}
            strokeWidth={1}
            strokeDasharray="4 6"
          />
          <circle cx={nodeScreenPos.x} cy={nodeScreenPos.y} r={4} fill={color} fillOpacity={0.4} />
        </svg>
      )}

      <motion.div
        key={slug}
        data-no-pan
        className="absolute bottom-20 left-4 z-20 rounded-xl border bg-[#0a0a14]/97 backdrop-blur-xl shadow-2xl overflow-hidden"
        style={{
          width: CARD_W,
          borderColor: `${color}28`,
          boxShadow: `0 0 0 1px ${color}18, 0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${color}08`,
        }}
        initial={{ opacity: 0, x: -20, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Accent strip */}
        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}55 80%, transparent)` }} />

        <div className="px-4 pt-3.5 pb-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
                  style={{ color, background: `${color}1a`, border: `1px solid ${color}35` }}
                >
                  {region?.label ?? 'Unknown'}
                </span>
                <span className="text-[10px] font-mono text-white/25">{yr}</span>
                {!isActive && (
                  <span className="text-[9px] text-white/20 italic">
                    not active in {selectedYear}
                  </span>
                )}
              </div>
              <h2 className="text-[19px] font-bold text-white leading-tight tracking-tight" style={{ textShadow: `0 0 24px ${color}40` }}>
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center text-white/20 hover:text-white/55 hover:bg-white/[0.06] transition-colors"
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1 1l7 7M8 1l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Description */}
          {seedArtifact?.shortDescription && (
            <p className="text-[12px] text-white/45 leading-relaxed mb-3.5 line-clamp-2">
              {seedArtifact.shortDescription}
            </p>
          )}
          {!seedArtifact?.shortDescription && regRow && (
            <p className="text-[12px] text-white/30 leading-relaxed mb-3.5">
              {regRow.region} · {regRow.preferred_year}
            </p>
          )}

          {/* Route hints */}
          {topRoutes.length > 0 && (
            <div className="mb-3.5">
              <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.18em] mb-2">
                Where to next
              </div>
              <div className="space-y-1">
                {topRoutes.map((route) => {
                  const targetActive = visibleSlugs.has(route.conn.artifact.slug);
                  return (
                    <button
                      key={route.conn.artifact.slug}
                      onClick={() => onSelectNode(route.conn.artifact.slug)}
                      className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150 hover:bg-white/[0.05] group"
                    >
                      <span
                        className="flex-shrink-0 text-[12px] font-bold w-4 text-center"
                        style={{ color: route.color }}
                      >
                        {route.arrow}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] text-white/30 group-hover:text-white/50 transition-colors leading-none mb-0.5">
                          {route.label}
                        </div>
                        <div
                          className={`text-[12px] font-semibold leading-tight truncate transition-colors ${targetActive ? 'text-white/80' : 'text-white/35'}`}
                          style={{ color: targetActive ? undefined : undefined }}
                        >
                          {route.conn.artifact.title}
                        </div>
                      </div>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: route.color }}>
                        <path d="M1 4h6M4 1.5l2.5 2.5L4 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Explore CTA */}
          {canNavigate ? (
            <button
              onClick={() => onExplore(slug)}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-[12px] font-semibold transition-all duration-200 hover:brightness-120 active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${color}25, ${color}10)`,
                color,
                border: `1px solid ${color}35`,
              }}
            >
              Full artifact view
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 2.5l3.5 3.5L7 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-[11px]"
              style={{ color: `${color}55`, border: `1px solid ${color}18` }}>
              Not yet in atlas
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
  currentArtifactSlug: string;
  artifact: Artifact;
}

export default function AtlasCanvas({ currentArtifactSlug, artifact }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Camera state — also tracked in refs for use inside closures/RAF
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.45);
  const panRef   = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(0.45);

  // Sync refs → state whenever state changes
  useEffect(() => { panRef.current = pan; }, [pan]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  const [isReady, setIsReady] = useState(false);

  // Animation
  const animFrameRef = useRef<number | null>(null);

  // Panning
  const isPanningRef  = useRef(false);
  const panStartRef   = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const didDragRef    = useRef(false);
  const [isCursorGrabbing, setIsCursorGrabbing] = useState(false);

  // Node dragging — tracked via refs so mousemove never waits for React render
  const draggingNodeRef = useRef<{
    slug: string;
    origPos: [number, number];
    startCanvasX: number;
    startCanvasY: number;
  } | null>(null);
  const overridePositionsRef = useRef<Record<string, [number, number]>>({});
  const rafPendingRef        = useRef(false);
  const [dragVersion, setDragVersion] = useState(0); // bumped by RAF to trigger re-render

  // Selection / hover
  const [selectedSlug, setSelectedSlug] = useState<string | null>(currentArtifactSlug);
  const [hoverSlug, setHoverSlug]   = useState<string | null>(null);
  const hoverSlugRef = useRef<string | null>(null); // always-fresh ref for use inside wheel closure
  useEffect(() => { hoverSlugRef.current = hoverSlug; }, [hoverSlug]);

  // ── Exploration state — the core navigation model ─────────────────────────
  // Levels: 'world' → 'region' → 'landmark'
  type ExploreLevel = 'world' | 'region' | 'landmark';
  const [exploreLevel,       setExploreLevel]       = useState<ExploreLevel>('world');
  const [activeRegionId,     setActiveRegionId]      = useState<string | null>(null);
  const [activeLandmarkSlug, setActiveLandmarkSlug]  = useState<string | null>(null);

  // Refs so event-handler closures (wheel, etc.) always see fresh values
  const explorationVisibleSlugsRef = useRef<Set<string>>(new Set());
  const dynamicPositionsRef        = useRef<Record<string, [number, number]>>({});
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Container size (for tether)
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  // Time
  const [selectedYear, setSelectedYear] = useState(() => {
    const regRow = ARTIFACT_ROW_MAP.get(currentArtifactSlug);
    return Math.max(TIME_MIN, Math.min(TIME_MAX, regRow?.preferred_year ?? getDefaultYear(artifact)));
  });
  const [isPlaying, setIsPlaying]       = useState(false);

  const router    = useRouter();
  const addToTrail  = useTrailStore((s) => s.addToTrail);
  const setViewMode = useUIStore((s) => s.setViewMode);

  const zoomLevel = scale < ZOOM_REGION ? 'region' : scale < ZOOM_CLUSTER ? 'cluster' : 'artifact';

  // ── Animation system ──────────────────────────────────────────────────────

  const animateTo = useCallback(
    (targetPan: { x: number; y: number }, targetScale: number, durationMs = 480) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      const fromPan   = { ...panRef.current };
      const fromScale = scaleRef.current;
      const t0 = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - t0) / durationMs);
        const ease = easeOutCubic(progress);

        const newScale = fromScale + (targetScale - fromScale) * ease;
        const nx       = fromPan.x + (targetPan.x - fromPan.x) * ease;
        const ny       = fromPan.y + (targetPan.y - fromPan.y) * ease;

        panRef.current   = { x: nx, y: ny };
        scaleRef.current = newScale;
        setPan({ x: nx, y: ny });
        setScale(newScale);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(tick);
        } else {
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = requestAnimationFrame(tick);
    },
    [],
  );

  // ── Initialise: start at World level (all regions visible, no nodes) ──────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setContainerSize({ w: width, h: height });

    // World view: zoom out enough to see all regions calmly
    const worldScale = 0.28;
    scaleRef.current = worldScale;
    const initialPan = {
      x: (width  - CANVAS_WIDTH  * worldScale) / 2,
      y: (height - CANVAS_HEIGHT * worldScale) / 2,
    };
    panRef.current = initialPan;
    setPan(initialPan);
    setScale(worldScale);
    setIsReady(true);
  }, []); // Only on mount

  // When the artifact prop changes (new page), update selected/year.
  useEffect(() => {
    const regRow = ARTIFACT_ROW_MAP.get(currentArtifactSlug);
    const yr = regRow?.preferred_year ?? getDefaultYear(artifact);
    setSelectedYear(Math.max(TIME_MIN, Math.min(TIME_MAX, yr)));
    // Don't auto-select in world mode — user navigates by clicking regions.
    // Only update selectedSlug when already inside a region/landmark.
    if (exploreLevel !== 'world') {
      setSelectedSlug(currentArtifactSlug);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentArtifactSlug, artifact]);

  // ── Wheel zoom — semantic target anchoring ────────────────────────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Find the nearest exploration-visible node or region center near screen coords (mx, my)
    const findSemanticTarget = (mx: number, my: number): { x: number; y: number } | null => {
      const s = scaleRef.current;
      const p = panRef.current;

      let closest: { dist: number; sx: number; sy: number } | null = null;

      // Only consider currently exploration-visible slugs (much smaller set than full registry)
      for (const slug of explorationVisibleSlugsRef.current) {
        const pos = overridePositionsRef.current[slug] ?? dynamicPositionsRef.current[slug] ?? ARTIFACT_POSITIONS[slug];
        if (!pos) continue;
        const sx   = pos[0] * s + p.x;
        const sy   = pos[1] * s + p.y;
        const dist = Math.hypot(mx - sx, my - sy);
        if (dist < 80 && (!closest || dist < closest.dist)) {
          closest = { dist, sx, sy };
        }
      }
      if (closest) return { x: closest.sx, y: closest.sy };

      // Fall back to region centers
      for (const r of REGIONS) {
        const sx = r.cx * s + p.x;
        const sy = r.cy * s + p.y;
        if (Math.hypot(mx - sx, my - sy) < 120) return { x: sx, y: sy };
      }

      return null;
    };

    const handler = (e: WheelEvent) => {
      if ((e.target as Element).closest('[data-no-pan]')) return;
      e.preventDefault();

      // Cancel any in-progress camera animation
      if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }

      const rect = el.getBoundingClientRect();
      const mx   = e.clientX - rect.left;
      const my   = e.clientY - rect.top;

      // Pivot: hovered node screen-pos → semantic target → raw cursor
      let pivotX = mx;
      let pivotY = my;
      const hoveredSlug = hoverSlugRef.current;
      if (hoveredSlug) {
        // Lock to the node the cursor is sitting on
        const pos = dynamicPositionsRef.current[hoveredSlug] ?? ARTIFACT_POSITIONS[hoveredSlug];
        if (pos) {
          pivotX = pos[0] * scaleRef.current + panRef.current.x;
          pivotY = pos[1] * scaleRef.current + panRef.current.y;
        }
      } else {
        const target = findSemanticTarget(mx, my);
        if (target) { pivotX = target.x; pivotY = target.y; }
      }

      const factor   = e.deltaY < 0 ? 1.1 : 0.91;
      const oldScale = scaleRef.current;
      const newScale = clamp(oldScale * factor, ZOOM_MIN, ZOOM_MAX);
      const ratio    = newScale / oldScale;
      const oldPan   = panRef.current;
      const newPan   = {
        x: pivotX - (pivotX - oldPan.x) * ratio,
        y: pivotY - (pivotY - oldPan.y) * ratio,
      };

      // Update refs IMMEDIATELY so the next wheel event sees fresh values
      scaleRef.current = newScale;
      panRef.current   = newPan;

      // Schedule React state update (triggers re-render)
      setScale(newScale);
      setPan(newPan);
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  // ── Timeline playback ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setSelectedYear((y) => {
        if (y >= TIME_MAX) { setIsPlaying(false); return TIME_MAX; }
        return y + 1;
      });
    }, 600);
    return () => clearInterval(id);
  }, [isPlaying]);

  // ── Cluster data (stable across renders) ─────────────────────────────────

  /** slug → all OTHER slugs in the same region+cluster (for spring reaction) */
  const slugToCluster = useMemo(() => {
    const byKey: Record<string, string[]> = {};
    for (const row of ARTIFACT_REGISTRY) {
      const key = `${row.region}::${row.cluster}`;
      if (!byKey[key]) byKey[key] = [];
      byKey[key].push(row.slug);
    }
    const result: Record<string, string[]> = {};
    for (const slugs of Object.values(byKey)) {
      for (const slug of slugs) {
        result[slug] = slugs.filter((s) => s !== slug);
      }
    }
    return result;
  }, []);

  /** Precomputed 2-nearest-neighbour edges within each cluster (cluster web) */
  const clusterEdges = useMemo((): [string, string][] => {
    const byKey: Record<string, ArtifactCsvRow[]> = {};
    for (const row of ARTIFACT_REGISTRY) {
      const key = `${row.region}::${row.cluster}`;
      if (!byKey[key]) byKey[key] = [];
      byKey[key].push(row);
    }
    const result: [string, string][] = [];
    for (const rows of Object.values(byKey)) {
      for (const rowA of rows) {
        const posA = ARTIFACT_POSITIONS[rowA.slug];
        if (!posA) continue;
        const sorted = rows
          .filter((r) => r.slug !== rowA.slug)
          .map((r) => {
            const posB = ARTIFACT_POSITIONS[r.slug];
            return posB ? { slug: r.slug, d: Math.hypot(posA[0] - posB[0], posA[1] - posB[1]) } : null;
          })
          .filter(Boolean)
          .sort((a, b) => a!.d - b!.d)
          .slice(0, 2);
        for (const n of sorted) {
          if (n && rowA.slug < n.slug) result.push([rowA.slug, n.slug]);
        }
      }
    }
    return result;
  }, []);

  // ── Exploration: visible slugs + dynamic positions ───────────────────────

  /** Which artifact slugs are currently active in the exploration hierarchy */
  const explorationVisibleSlugs = useMemo((): Set<string> => {
    if (exploreLevel === 'world') return new Set<string>();
    if (exploreLevel === 'region') {
      const region = REGIONS.find((r) => r.id === activeRegionId);
      if (!region) return new Set<string>();
      return new Set(getRegionLandmarks(region.label));
    }
    // landmark level
    if (!activeLandmarkSlug) return new Set<string>();
    const neighbors = getLandmarkNeighborhood(activeLandmarkSlug);
    return new Set([activeLandmarkSlug, ...neighbors]);
  }, [exploreLevel, activeRegionId, activeLandmarkSlug]);

  /**
   * Dynamic radial positions for neighborhood nodes.
   * These override ARTIFACT_POSITIONS for the neighborhood level,
   * creating a clean radial layout around the active landmark.
   */
  const dynamicPositions = useMemo((): Record<string, [number, number]> => {
    if (exploreLevel !== 'landmark' || !activeLandmarkSlug) return {};
    const lp = ARTIFACT_POSITIONS[activeLandmarkSlug];
    if (!lp) return {};
    const neighbors = getLandmarkNeighborhood(activeLandmarkSlug);
    const result: Record<string, [number, number]> = {};
    neighbors.forEach((slug, i) => {
      const angle = (i / neighbors.length) * 2 * Math.PI - Math.PI / 2;
      result[slug] = [
        lp[0] + Math.cos(angle) * NEIGHBORHOOD_RADIUS,
        lp[1] + Math.sin(angle) * NEIGHBORHOOD_RADIUS,
      ];
    });
    return result;
  }, [exploreLevel, activeLandmarkSlug]);

  // Keep refs fresh so the wheel-zoom closure always has current values
  useEffect(() => { explorationVisibleSlugsRef.current = explorationVisibleSlugs; }, [explorationVisibleSlugs]);
  useEffect(() => { dynamicPositionsRef.current = dynamicPositions; }, [dynamicPositions]);

  // ── Exploration navigation callbacks ──────────────────────────────────────

  const enterRegion = useCallback((regionId: string) => {
    setExploreLevel('region');
    setActiveRegionId(regionId);
    setActiveLandmarkSlug(null);
    setSelectedSlug(null);
    const region = REGIONS.find((r) => r.id === regionId);
    if (!region || !containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const regionScale = 0.50;
    animateTo(
      { x: width / 2 - region.cx * regionScale, y: height / 2 - region.cy * regionScale },
      regionScale, 520,
    );
  }, [animateTo]);

  const enterLandmark = useCallback((slug: string) => {
    setExploreLevel('landmark');
    setActiveLandmarkSlug(slug);
    setSelectedSlug(slug);
    const pos = ARTIFACT_POSITIONS[slug];
    if (!pos || !containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const targetScale = 0.72;
    animateTo(
      { x: width / 2 - pos[0] * targetScale, y: height / 2 - pos[1] * targetScale },
      targetScale, 520,
    );
  }, [animateTo]);

  const goBack = useCallback(() => {
    if (exploreLevel === 'landmark') {
      setExploreLevel('region');
      setActiveLandmarkSlug(null);
      setSelectedSlug(null);
      // Re-center on region
      const region = REGIONS.find((r) => r.id === activeRegionId);
      if (!region || !containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const regionScale = 0.50;
      animateTo(
        { x: width / 2 - region.cx * regionScale, y: height / 2 - region.cy * regionScale },
        regionScale, 400,
      );
    } else if (exploreLevel === 'region') {
      setExploreLevel('world');
      setActiveRegionId(null);
      setSelectedSlug(null);
      // Zoom back out to world view
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const worldScale = 0.28;
      animateTo(
        { x: (width  - CANVAS_WIDTH  * worldScale) / 2,
          y: (height - CANVAS_HEIGHT * worldScale) / 2 },
        worldScale, 500,
      );
    }
  }, [exploreLevel, activeRegionId, animateTo]);

  // ── Mouse handlers ────────────────────────────────────────────────────────

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as Element).closest('[data-no-pan]')) return;
    // Cancel animation on user interaction
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
    isPanningRef.current = true;
    didDragRef.current = false;
    setIsCursorGrabbing(true);
    panStartRef.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // ── Node drag ──────────────────────────────────────────────────────────
    if (draggingNodeRef.current) {
      const dn   = draggingNodeRef.current;
      const rect = containerRef.current!.getBoundingClientRect();
      const cx   = (e.clientX - rect.left - panRef.current.x) / scaleRef.current;
      const cy   = (e.clientY - rect.top  - panRef.current.y) / scaleRef.current;
      const dX   = cx - dn.startCanvasX;
      const dY   = cy - dn.startCanvasY;

      // Dragged node follows cursor exactly
      const overrides: Record<string, [number, number]> = {
        [dn.slug]: [dn.origPos[0] + dX, dn.origPos[1] + dY],
      };

      // Cluster neighbours spring along with decreasing weight
      for (const otherSlug of (slugToCluster[dn.slug] ?? [])) {
        const otherPos = ARTIFACT_POSITIONS[otherSlug];
        if (!otherPos) continue;
        const d      = Math.hypot(dn.origPos[0] - otherPos[0], dn.origPos[1] - otherPos[1]);
        const weight = Math.max(0, 1 - d / 200) * 0.22;
        if (weight > 0.005) {
          overrides[otherSlug] = [otherPos[0] + dX * weight, otherPos[1] + dY * weight];
        }
      }

      overridePositionsRef.current = overrides;
      didDragRef.current = true;

      // Throttle re-renders to RAF cadence for smooth performance
      if (!rafPendingRef.current) {
        rafPendingRef.current = true;
        requestAnimationFrame(() => {
          rafPendingRef.current = false;
          setDragVersion((v) => v + 1);
        });
      }
      return;
    }

    // ── Canvas pan ────────────────────────────────────────────────────────
    if (!isPanningRef.current || !panStartRef.current) return;
    const dx = e.clientX - panStartRef.current.mx;
    const dy = e.clientY - panStartRef.current.my;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDragRef.current = true;
    const newPan = { x: panStartRef.current.px + dx, y: panStartRef.current.py + dy };
    panRef.current = newPan; // sync ref immediately
    setPan(newPan);
  }, [slugToCluster]);

  const handleMouseUp = useCallback(() => {
    // ── Spring-back when releasing a node ─────────────────────────────────
    if (draggingNodeRef.current) {
      const snapOverrides = { ...overridePositionsRef.current };
      const startTime = performance.now();
      const DURATION  = 420;

      const springBack = (now: number) => {
        const t    = Math.min(1, (now - startTime) / DURATION);
        const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const lerped: Record<string, [number, number]> = {};
        for (const [slug, snapPos] of Object.entries(snapOverrides)) {
          const orig = ARTIFACT_POSITIONS[slug];
          if (!orig) continue;
          lerped[slug] = [
            snapPos[0] + (orig[0] - snapPos[0]) * ease,
            snapPos[1] + (orig[1] - snapPos[1]) * ease,
          ];
        }
        overridePositionsRef.current = t < 1 ? lerped : {};
        setDragVersion((v) => v + 1);
        if (t < 1) requestAnimationFrame(springBack);
        else        draggingNodeRef.current = null;
      };
      requestAnimationFrame(springBack);
    }

    isPanningRef.current = false;
    setIsCursorGrabbing(false);
    panStartRef.current = null;
  }, []);

  // ── Selection + camera snap ───────────────────────────────────────────────

  const selectAndFocus = useCallback((slug: string) => {
    setSelectedSlug(slug);

    const pos = dynamicPositions[slug] ?? ARTIFACT_POSITIONS[slug];
    const el  = containerRef.current;
    if (!pos || !el) return;

    const { width, height } = el.getBoundingClientRect();
    const cur = scaleRef.current;

    // Never auto-zoom out — just gently centre the camera.
    // Only zoom in if currently at a very far view.
    const targetScale = Math.max(cur, 0.50);

    animateTo(
      { x: width / 2 - pos[0] * targetScale, y: height / 2 - pos[1] * targetScale },
      targetScale, 380,
    );
  }, [animateTo, dynamicPositions]);

  const handleNodeClick = useCallback((slug: string) => {
    if (didDragRef.current) return;
    if (exploreLevel === 'region') {
      // In region level: clicking a landmark enters it
      enterLandmark(slug);
    } else if (exploreLevel === 'landmark') {
      // In landmark level: clicking a neighbor selects & focuses it
      // Double-click (handled separately) will enter its neighborhood
      selectAndFocus(slug);
    } else {
      selectAndFocus(slug);
    }
  }, [exploreLevel, enterLandmark, selectAndFocus]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const toScreen = useCallback((cx: number, cy: number) => ({
    x: cx * scale + pan.x,
    y: cy * scale + pan.y,
  }), [scale, pan]);

  const navigateTo = useCallback((slug: string) => {
    const a = getArtifact(slug);
    if (!a) return;
    setViewMode('map');
    addToTrail({ slug: a.slug, title: a.title });
    router.push(`/artifact/${slug}`);
  }, [router, setViewMode, addToTrail]);

  const zoomBy = useCallback((factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    animateTo(
      { x: width / 2 - (width / 2 - pan.x) * factor, y: height / 2 - (height / 2 - pan.y) * factor },
      clamp(scale * factor, ZOOM_MIN, ZOOM_MAX),
      320,
    );
  }, [pan, scale, animateTo]);

  const fitAll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const s = Math.min(width / CANVAS_WIDTH, height / CANVAS_HEIGHT) * 0.88;
    animateTo({ x: (width - CANVAS_WIDTH * s) / 2, y: (height - CANVAS_HEIGHT * s) / 2 }, s, 550);
  }, [animateTo]);

  const centerOnSlug = useCallback((slug: string) => {
    const pos = dynamicPositions[slug] ?? ARTIFACT_POSITIONS[slug];
    const el  = containerRef.current;
    if (!pos || !el) return;
    const { width, height } = el.getBoundingClientRect();
    animateTo({ x: width / 2 - pos[0] * scale, y: height / 2 - pos[1] * scale }, scale, 380);
  }, [scale, animateTo, dynamicPositions]);

  // ── Derived data ──────────────────────────────────────────────────────────

  // Time-visibility is now decoupled from exploration visibility.
  // It only affects the opacity of already-exploration-visible nodes, not which ones appear.
  const timeVisibleSlugs = useMemo(
    () => new Set(ARTIFACT_REGISTRY.filter((r) => rowVisible(r, selectedYear)).map((r) => r.slug)),
    [selectedYear],
  );
  // For API compatibility, keep `visibleSlugs` pointing to the same set:
  const visibleSlugs = timeVisibleSlugs;

  const connectedToSelected = useMemo(() => {
    if (!selectedSlug) return new Set<string>();
    const s = new Set<string>();
    for (const e of edges) {
      if (e.fromArtifact === selectedSlug) s.add(e.toArtifact);
      else if (e.toArtifact === selectedSlug) s.add(e.fromArtifact);
    }
    return s;
  }, [selectedSlug]);

  // Screen position of the selected node (for tether)
  const selectedNodeScreenPos = useMemo(() => {
    if (!selectedSlug) return null;
    const pos = dynamicPositions[selectedSlug] ?? ARTIFACT_POSITIONS[selectedSlug];
    if (!pos) return null;
    return toScreen(pos[0], pos[1]);
  }, [selectedSlug, toScreen, dynamicPositions]);

  // ── Opacity helpers (local focus field) ───────────────────────────────────

  const getNodeOpacity = (slug: string) => {
    const isTimeActive = visibleSlugs.has(slug);
    if (!selectedSlug) return isTimeActive ? 1 : 0.22;
    if (slug === selectedSlug) return 1;
    if (connectedToSelected.has(slug)) return isTimeActive ? 0.88 : 0.22;
    // In landmark level, dim non-connected neighborhood nodes more
    if (exploreLevel === 'landmark') return isTimeActive ? 0.28 : 0.10;
    return isTimeActive ? 0.22 : 0.07;
  };

  const getEdgeOpacity = (fromSlug: string, toSlug: string): number => {
    const bothActive = visibleSlugs.has(fromSlug) && visibleSlugs.has(toSlug);
    const isConnected = selectedSlug &&
      (fromSlug === selectedSlug || toSlug === selectedSlug);

    if (zoomLevel === 'region') {
      return isConnected && bothActive ? 0.38 : 0.0;
    }
    if (isConnected) return bothActive ? 0.65 : 0.14;
    return bothActive ? (selectedSlug ? 0.05 : 0.14) : 0.02;
  };

  // Node radius driven by visual_type + selection state
  const getCircleR = (row: ArtifactCsvRow) => {
    if (row.slug === selectedSlug) return 17;
    const { visual_type, tier } = row;
    if (visual_type === 'thumbnail') {
      if (scale >= 0.75) return 14;
      if (scale >= 0.52) return 13;
      if (scale >= 0.38) return 12;
      return tier === 1 ? 13 : 10;
    }
    if (visual_type === 'icon') {
      if (scale >= 0.65) return 11;
      if (scale >= 0.52) return 10;
      return tier === 1 ? 11 : 8;
    }
    if (visual_type === 'badge') return scale >= 0.55 ? 9 : 7;
    return tier === 1 ? 7 : tier === 2 ? 5 : 4; // dot
  };

  // Determines the full rendering mode for a node based on visual_type + zoom level
  const getNodeRenderMode = (row: ArtifactCsvRow, isSelectedNode: boolean): RenderMode => {
    const { visual_type, tier } = row;
    if (visual_type === 'dot') return 'dot';
    if (visual_type === 'thumbnail') {
      if (scale >= 0.75 || (isSelectedNode && scale >= 0.52)) return 'card';
      if (scale >= 0.38) return 'icon-circle';
      return 'glow-dot';
    }
    if (visual_type === 'icon') {
      return scale >= 0.52 ? 'icon-circle' : (tier <= 2 ? 'glow-dot' : 'dot');
    }
    if (visual_type === 'badge') {
      return scale >= 0.55 ? 'badge' : (tier <= 2 ? 'glow-dot' : 'dot');
    }
    return 'dot';
  };

  // Keep isBadgeMode for the label layer which still uses it
  const isBadgeMode = (row: ArtifactCsvRow) =>
    getNodeRenderMode(row, row.slug === selectedSlug) === 'card';

  const hoverArtifact = hoverSlug ? getArtifact(hoverSlug) : null;
  const hoverRegion   = hoverSlug ? getRegion(hoverSlug)   : null;
  const hoverRelationType = useMemo((): RelationType | null => {
    if (!hoverSlug || !selectedSlug) return null;
    const edge = edges.find(
      (e) => (e.fromArtifact === selectedSlug && e.toArtifact === hoverSlug) ||
             (e.toArtifact === selectedSlug && e.fromArtifact === hoverSlug),
    );
    return edge?.relationType ?? null;
  }, [hoverSlug, selectedSlug]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100dvh - 44px)', background: '#04040c', cursor: isCursorGrabbing ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        // Background click: deselect OR go back a level
        if (didDragRef.current) return;
        const target = e.target as Element;
        if (target.closest('[data-no-pan]')) return;
        // If clicked on a node, handled by the node's own onClick — don't intercept
        if (target.tagName === 'circle' || target.tagName === 'rect' || target.tagName === 'image' || target.tagName === 'text') return;
        if (selectedSlug) {
          setSelectedSlug(null);
        }
      }}
    >
      {/* ── SVG Canvas ─────────────────────────────────────────────────────── */}
      <svg width="100%" height="100%" style={{ display: isReady ? 'block' : 'none' }}>
        {/* Dot grid */}
        <defs>
          <pattern
            id="atlas-grid"
            width={40 * scale} height={40 * scale}
            patternUnits="userSpaceOnUse"
            x={pan.x % (40 * scale)}
            y={pan.y % (40 * scale)}
          >
            <circle cx={20 * scale} cy={20 * scale} r="0.7" fill="white" fillOpacity="0.035" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#atlas-grid)" />

        {/* ── Scaled layer ──────────────────────────────────────────────── */}
        <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`}>

          {/* Region zones — clickable entry points at world level */}
          {REGIONS.map((region) => {
            const isActive  = activeRegionId === region.id;
            const inRegion  = exploreLevel === 'region'   && isActive;
            const inLandmark = exploreLevel === 'landmark' && isActive;

            // Opacity depends on exploration level
            let fillOp: number;
            let strokeOp: number;
            if (exploreLevel === 'world') {
              fillOp   = 0.10;
              strokeOp = 0.25;
            } else if (inRegion) {
              fillOp   = 0.13;
              strokeOp = 0.38;
            } else if (inLandmark) {
              fillOp   = 0.06;
              strokeOp = 0.14;
            } else {
              // Other regions fade out when not active
              fillOp   = 0.025;
              strokeOp = 0.06;
            }

            const isClickable = exploreLevel === 'world';

            return (
              <g key={region.id}>
                <ellipse
                  cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry}
                  fill={region.color} fillOpacity={fillOp}
                  stroke={region.color} strokeOpacity={strokeOp} strokeWidth={isActive ? 1.2 : 0.7}
                  style={{
                    transition: 'fill-opacity 0.5s, stroke-opacity 0.5s',
                    cursor: isClickable ? 'pointer' : 'default',
                  }}
                  onClick={isClickable ? () => enterRegion(region.id) : undefined}
                />
                {/* Invisible hit area for clicking the region in world mode */}
                {isClickable && (
                  <ellipse
                    cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry}
                    fill="transparent" stroke="none"
                    style={{ cursor: 'pointer' }}
                    onClick={() => enterRegion(region.id)}
                  />
                )}
              </g>
            );
          })}

          {/* Neighborhood glow field — surrounds selected artifact & neighbors */}
          {selectedSlug && (() => {
            const pos    = dynamicPositions[selectedSlug] ?? ARTIFACT_POSITIONS[selectedSlug];
            const region = getRegion(selectedSlug);
            if (!pos || !region) return null;
            return (
              <>
                {/* Soft bloom for the connected neighborhood */}
                {[...connectedToSelected].map((nSlug) => {
                  const np = dynamicPositions[nSlug] ?? ARTIFACT_POSITIONS[nSlug];
                  if (!np) return null;
                  return (
                    <ellipse
                      key={nSlug}
                      cx={np[0]} cy={np[1]} rx={55} ry={45}
                      fill={region.color} fillOpacity={0.04}
                    />
                  );
                })}
                {/* Central glow on selected node */}
                <ellipse
                  cx={pos[0]} cy={pos[1]} rx={120} ry={100}
                  fill={region.color} fillOpacity={0.07}
                />
                <ellipse
                  cx={pos[0]} cy={pos[1]} rx={220} ry={180}
                  fill={region.color} fillOpacity={0.025}
                />
              </>
            );
          })()}

          {/* Cluster web — faint 2-nearest-neighbour edges inside each cluster */}
          {scale >= 0.52 && clusterEdges.map(([slugA, slugB], i) => {
            // In exploration mode, only draw edges between visible nodes
            if (!explorationVisibleSlugs.has(slugA) || !explorationVisibleSlugs.has(slugB)) return null;
            const posA = overridePositionsRef.current[slugA] ?? dynamicPositions[slugA] ?? ARTIFACT_POSITIONS[slugA];
            const posB = overridePositionsRef.current[slugB] ?? dynamicPositions[slugB] ?? ARTIFACT_POSITIONS[slugB];
            if (!posA || !posB) return null;
            const aTier = ARTIFACT_TIER_MAP.get(slugA) ?? 3;
            const bTier = ARTIFACT_TIER_MAP.get(slugB) ?? 3;
            if (!isTierVisible(aTier, scale) || !isTierVisible(bTier, scale)) return null;
            const isConnToSelected =
              connectedToSelected.has(slugA) && connectedToSelected.has(slugB);
            return (
              <line
                key={`ce-${i}`}
                x1={posA[0]} y1={posA[1]} x2={posB[0]} y2={posB[1]}
                stroke="white"
                strokeOpacity={isConnToSelected ? 0.12 : 0.042}
                strokeWidth={0.5}
              />
            );
          })}

          {/* Neighborhood spoke edges — landmark to each neighbor in landmark level */}
          {exploreLevel === 'landmark' && activeLandmarkSlug && (() => {
            const lp = dynamicPositions[activeLandmarkSlug] ?? ARTIFACT_POSITIONS[activeLandmarkSlug];
            if (!lp) return null;
            const region = getRegion(activeLandmarkSlug);
            const spokeColor = region?.color ?? '#ffffff';
            return getLandmarkNeighborhood(activeLandmarkSlug).map((nSlug) => {
              const np = dynamicPositions[nSlug] ?? ARTIFACT_POSITIONS[nSlug];
              if (!np) return null;
              const isConnected = connectedToSelected.has(nSlug);
              const isSelected  = selectedSlug === nSlug;
              return (
                <line
                  key={`spoke-${nSlug}`}
                  x1={lp[0]} y1={lp[1]} x2={np[0]} y2={np[1]}
                  stroke={spokeColor}
                  strokeOpacity={isSelected || isConnected ? 0.45 : 0.15}
                  strokeWidth={isSelected || isConnected ? 1.2 : 0.6}
                  strokeDasharray={isConnected ? 'none' : '4 8'}
                  style={{ transition: 'stroke-opacity 0.35s' }}
                />
              );
            });
          })()}

          {/* Seed edges — relation-typed explicit connections */}
          {edges.map((edge, i) => {
            // Only draw if both endpoints are exploration-visible
            if (!explorationVisibleSlugs.has(edge.fromArtifact) ||
                !explorationVisibleSlugs.has(edge.toArtifact)) return null;
            const fp = overridePositionsRef.current[edge.fromArtifact] ?? dynamicPositions[edge.fromArtifact] ?? ARTIFACT_POSITIONS[edge.fromArtifact];
            const tp = overridePositionsRef.current[edge.toArtifact]   ?? dynamicPositions[edge.toArtifact]   ?? ARTIFACT_POSITIONS[edge.toArtifact];
            if (!fp || !tp) return null;
            const opacity = getEdgeOpacity(edge.fromArtifact, edge.toArtifact);
            if (opacity < 0.01) return null;
            const color    = RELATION_CONFIG[edge.relationType]?.color ?? '#ffffff';
            const isConnected = selectedSlug &&
              (edge.fromArtifact === selectedSlug || edge.toArtifact === selectedSlug);
            return (
              <line
                key={i}
                x1={fp[0]} y1={fp[1]} x2={tp[0]} y2={tp[1]}
                stroke={color} strokeOpacity={opacity}
                strokeWidth={isConnected ? 1.5 : 0.7}
                style={{ transition: 'stroke-opacity 0.4s, stroke-width 0.3s' }}
              />
            );
          })}

          {/* Nodes — rendered only for exploration-visible artifacts */}
          {(() => {
            // Viewport bounds in canvas coords (recomputed once per render)
            const el = containerRef.current;
            const vw = el ? el.clientWidth  : 1920;
            const vh = el ? el.clientHeight : 1080;
            const MARGIN   = 180;
            const canMinX  = (-pan.x / scale) - MARGIN;
            const canMinY  = (-pan.y / scale) - MARGIN;
            const canMaxX  = (vw - pan.x) / scale + MARGIN;
            const canMaxY  = (vh - pan.y) / scale + MARGIN;
            // dragVersion read here so the closure re-evaluates during drag
            void dragVersion;

            // Only render exploration-visible slugs (max ~12 at a time)
            return [...explorationVisibleSlugs].map((slug) => {
            const row = ARTIFACT_ROW_MAP.get(slug);
            if (!row) return null;

            const pos = (overridePositionsRef.current[slug] ?? dynamicPositions[slug] ?? ARTIFACT_POSITIONS[slug]) as [number, number] | undefined;
            if (!pos) return null;

            const isSelected  = selectedSlug === slug;
            const isHovered   = hoverSlug === slug;
            const isConnected = connectedToSelected.has(slug);

            // Viewport cull — skip off-screen nodes
            if (!isSelected && !isConnected && !isHovered) {
              if (pos[0] < canMinX || pos[0] > canMaxX || pos[1] < canMinY || pos[1] > canMaxY) {
                return null;
              }
            }
            const region     = getRegion(slug);
            const color      = region?.color ?? '#ffffff';
            const focusOp    = getNodeOpacity(slug);
            const r          = getCircleR(row);
            const renderMode = getNodeRenderMode(row, isSelected);

            // Nodes always fully revealed in exploration mode (exploration controls visibility, not tiers)
            const revealOpacity = focusOp;
            const revealScale   = 1;

            return (
              <g key={slug} transform={`translate(${pos[0]},${pos[1]})`}>
                <g
                  style={{
                    opacity: revealOpacity,
                    transform: `scale(${revealScale})`,
                    transformOrigin: '0px 0px',
                    transition: 'opacity 0.55s ease, transform 0.55s ease',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                  }}
                  onMouseEnter={(e) => {
                    setHoverSlug(slug);
                    const rect = containerRef.current!.getBoundingClientRect();
                    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                  onMouseMove={(e) => {
                    if (hoverSlug === slug) {
                      const rect = containerRef.current!.getBoundingClientRect();
                      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }
                  }}
                  onMouseLeave={() => { setHoverSlug(null); setTooltipPos(null); }}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    didDragRef.current = false;
                    const rect = containerRef.current!.getBoundingClientRect();
                    const cx   = (e.clientX - rect.left - panRef.current.x) / scaleRef.current;
                    const cy   = (e.clientY - rect.top  - panRef.current.y) / scaleRef.current;
                    const rawPos = dynamicPositions[slug] ?? ARTIFACT_POSITIONS[slug];
                    draggingNodeRef.current = {
                      slug,
                      origPos:      rawPos ? [...rawPos] as [number, number] : [cx, cy],
                      startCanvasX: cx,
                      startCanvasY: cy,
                    };
                    setIsCursorGrabbing(true);
                  }}
                  onClick={() => handleNodeClick(slug)}
                  onDoubleClick={() => {
                    if (exploreLevel === 'landmark') {
                      // Enter the clicked neighbor's own neighborhood
                      enterLandmark(slug);
                    } else {
                      navigateTo(slug);
                    }
                  }}
                >
                  {renderMode === 'card' ? (
                    <>
                      {/* Hero thumbnail floats above the card for selected nodes */}
                      {isSelected && hasThumbnail(row.slug) && (
                        <SelectedThumbnailHero
                          slug={row.slug}
                          color={color}
                          thumbnailPath={getThumbnailPath(row.slug)}
                        />
                      )}
                      <ArtifactCard
                        slug={row.slug} color={color} title={row.title}
                        isSelected={isSelected} isHovered={isHovered} isConnected={isConnected}
                        thumbnailPath={hasThumbnail(row.slug) ? getThumbnailPath(row.slug) : null}
                      />
                    </>
                  ) : renderMode === 'badge' ? (
                    <BadgeNode
                      slug={row.slug} color={color} title={row.title}
                      isSelected={isSelected} isHovered={isHovered} isConnected={isConnected}
                    />
                  ) : renderMode === 'icon-circle' ? (()=>{
                    const hasThumb = hasThumbnail(row.slug);
                    const thumbPath = hasThumb ? getThumbnailPath(row.slug) : null;
                    const clipIdCircle = `ic-${row.slug}`;
                    return (<>
                    {isSelected && (
                      <circle r={r + 28} fill="none" stroke={color} strokeOpacity={0.08} strokeWidth={0.6}/>
                    )}
                    {(isSelected || isHovered || isConnected) && (
                      <circle r={r + 10}
                        fill={color} fillOpacity={isSelected ? 0.16 : isHovered ? 0.09 : 0.05}
                        stroke={color} strokeOpacity={isSelected ? 0.45 : 0.2} strokeWidth={0.7}
                      />
                    )}
                    <circle r={r}
                      fill={color} fillOpacity={isSelected ? 0.88 : isHovered ? 0.65 : 0.42}
                      stroke={color} strokeOpacity={isSelected ? 1 : 0.65}
                      strokeWidth={isSelected ? 2.2 : 1}
                      style={{ transition: 'fill-opacity 0.2s' }}
                    />
                    {hasThumb && thumbPath ? (
                      <>
                        <defs>
                          <clipPath id={clipIdCircle}>
                            <circle r={r - 1}/>
                          </clipPath>
                        </defs>
                        <image
                          href={thumbPath}
                          x={-r + 1} y={-r + 1} width={(r - 1) * 2} height={(r - 1) * 2}
                          preserveAspectRatio="xMidYMid slice"
                          clipPath={`url(#${clipIdCircle})`}
                        />
                        <circle r={r} fill="none"
                          stroke={color} strokeOpacity={isSelected ? 0.9 : 0.55}
                          strokeWidth={isSelected ? 2.2 : 1}
                        />
                      </>
                    ) : (
                      <ArtifactIcon slug={row.slug} color={isSelected ? 'white' : color} r={r} title={row.title}/>
                    )}
                  </>);
                  })() : renderMode === 'glow-dot' ? (<>
                    {/* Anchor ring — always on for Tier 1, giving them anchor presence at far zoom */}
                    {row.tier === 1 && (
                      <circle r={r + 14} fill="none" stroke={color} strokeOpacity={0.1} strokeWidth={0.8}/>
                    )}
                    {(isSelected || isHovered) && (
                      <circle r={r + 8}
                        fill={color} fillOpacity={isSelected ? 0.2 : 0.1}
                        stroke={color} strokeOpacity={isSelected ? 0.55 : 0.28} strokeWidth={0.7}
                      />
                    )}
                    <circle r={r}
                      fill={color}
                      fillOpacity={isSelected ? 0.92 : isHovered ? 0.72 : row.tier === 1 ? 0.62 : 0.42}
                      stroke={color}
                      strokeOpacity={isSelected ? 1 : row.tier === 1 ? 0.82 : 0.55}
                      strokeWidth={isSelected ? 2.4 : row.tier === 1 ? 1.8 : 1.2}
                    />
                  </>) : (
                    /* dot */
                    <circle r={r}
                      fill={color} fillOpacity={isHovered ? 0.72 : 0.32}
                      stroke={color} strokeOpacity={0.42} strokeWidth={0.5}
                    />
                  )}
                </g>
              </g>
            );
          });
          })()}
        </g>

        {/* ── Unscaled label layer ──────────────────────────────────────── */}

        {/* Region labels — prominent at world level, fade when inside a region/landmark */}
        {REGIONS.map((region) => {
          const s = toScreen(region.cx, region.cy);
          const isActive = activeRegionId === region.id;

          // Compute label opacity based on exploration level
          let mainOp: number;
          if (exploreLevel === 'world') {
            mainOp = 0.75;
          } else if (isActive) {
            mainOp = exploreLevel === 'region' ? 0.65 : 0.28;
          } else {
            mainOp = 0.12;
          }
          const subOp = exploreLevel === 'world' ? 0.42 : (isActive && exploreLevel === 'region' ? 0.32 : 0);
          const isClickable = exploreLevel === 'world';

          return (
            <g
              key={region.id}
              style={{
                userSelect: 'none',
                cursor: isClickable ? 'pointer' : 'default',
              }}
              onClick={isClickable ? () => enterRegion(region.id) : undefined}
            >
              <text
                x={s.x} y={s.y - (exploreLevel === 'world' ? 10 : 5)}
                textAnchor="middle" dominantBaseline="middle"
                fill={region.color} fillOpacity={mainOp}
                fontSize={exploreLevel === 'world' ? 15 : 13}
                fontWeight="700" letterSpacing="0.07em"
                fontFamily="ui-monospace, monospace"
                style={{ transition: 'fill-opacity 0.45s, font-size 0.35s' }}
              >
                {region.label.toUpperCase()}
              </text>
              {subOp > 0 && (
                <text
                  x={s.x} y={s.y + 12}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={region.color} fillOpacity={subOp}
                  fontSize={10} fontFamily="ui-sans-serif, sans-serif"
                  style={{ transition: 'fill-opacity 0.45s' }}
                >
                  {region.sublabel}
                </text>
              )}
            </g>
          );
        })}

        {/* Artifact title labels — only for exploration-visible slugs */}
        {[...explorationVisibleSlugs].map((slug) => {
          const row = ARTIFACT_ROW_MAP.get(slug);
          if (!row) return null;
          const pos = dynamicPositions[slug] ?? ARTIFACT_POSITIONS[slug];
          if (!pos) return null;

          const isSelected  = selectedSlug === slug;
          const isConnected = connectedToSelected.has(slug);

          // Always show labels in exploration mode — it's a small set of nodes
          // Skip badge-mode nodes — title is drawn inside the badge pill
          if (isBadgeMode(row)) return null;

          const isActive = visibleSlugs.has(slug);
          const screenR  = getCircleR(row) * scale;
          if (screenR < 2 && !isSelected) return null;

          const region = getRegion(slug);
          const color  = region?.color ?? 'white';
          const s      = toScreen(pos[0], pos[1]);

          // In exploration mode, labels are always visible for the small visible set
          const labelOp = isSelected ? 1 : isConnected ? 0.82 : isActive ? 0.65 : 0.35;

          return (
            <text
              key={slug}
              x={s.x} y={s.y + screenR + 12}
              textAnchor="middle"
              fill={isSelected || isConnected ? color : 'white'}
              fillOpacity={labelOp}
              fontSize={isSelected ? 12 : 10}
              fontWeight={isSelected ? 700 : isConnected ? 600 : 500}
              fontFamily="ui-sans-serif, sans-serif"
              style={{ pointerEvents: 'none', userSelect: 'none', transition: 'fill-opacity 0.35s' }}
            >
              {row.title}
            </text>
          );
        })}
      </svg>

      {/* ── Level hint ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {exploreLevel === 'world' && (
          <motion.div
            key="world-hint"
            className="absolute bottom-24 right-4 pointer-events-none z-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <p className="text-white/18 text-[10px] font-mono tracking-[0.14em] uppercase text-right">
              click a region to explore
            </p>
          </motion.div>
        )}
        {exploreLevel === 'region' && !selectedSlug && (
          <motion.div
            key="region-hint"
            className="absolute bottom-24 right-4 pointer-events-none z-5"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <p className="text-white/18 text-[10px] font-mono tracking-[0.14em] uppercase text-right">
              click a landmark to enter
            </p>
          </motion.div>
        )}
        {exploreLevel === 'landmark' && !selectedSlug && (
          <motion.div
            key="landmark-hint"
            className="absolute bottom-24 right-4 pointer-events-none z-5"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <p className="text-white/18 text-[10px] font-mono tracking-[0.14em] uppercase text-right">
              click a node to focus · double-click to enter
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Exploration breadcrumb ───────────────────────────────────────────── */}
      <AnimatePresence>
        {exploreLevel !== 'world' && (
          <motion.div
            data-no-pan
            key={exploreLevel + activeRegionId + activeLandmarkSlug}
            className="absolute top-14 left-4 z-30 flex items-center gap-1.5"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Back button */}
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#0d0d18]/90 backdrop-blur-md px-2.5 py-1.5 text-[10px] font-medium text-white/45 hover:text-white/75 hover:border-white/[0.15] transition-all"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M5 1.5L2.5 4L5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Back
            </button>

            {/* Breadcrumb trail */}
            <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-[#0d0d18]/80 backdrop-blur-md px-3 py-1.5 text-[10px] font-mono text-white/28">
              <span
                className="hover:text-white/55 cursor-pointer transition-colors"
                onClick={() => { setExploreLevel('world'); setActiveRegionId(null); setActiveLandmarkSlug(null); setSelectedSlug(null); }}
              >
                World
              </span>
              {activeRegionId && (() => {
                const region = REGIONS.find(r => r.id === activeRegionId);
                return region ? (
                  <>
                    <span className="text-white/15">→</span>
                    <span
                      className={exploreLevel === 'region' ? 'text-white/65' : 'hover:text-white/55 cursor-pointer transition-colors'}
                      style={{ color: exploreLevel === 'region' ? region.color + 'cc' : undefined }}
                      onClick={exploreLevel === 'landmark' ? () => {
                        setExploreLevel('region');
                        setActiveLandmarkSlug(null);
                        setSelectedSlug(null);
                      } : undefined}
                    >
                      {region.label}
                    </span>
                  </>
                ) : null;
              })()}
              {activeLandmarkSlug && (() => {
                const row = ARTIFACT_ROW_MAP.get(activeLandmarkSlug);
                const region = activeRegionId ? REGIONS.find(r => r.id === activeRegionId) : undefined;
                return row ? (
                  <>
                    <span className="text-white/15">→</span>
                    <span
                      className="text-white/65"
                      style={{ color: region ? region.color + 'cc' : undefined }}
                    >
                      {row.title}
                    </span>
                  </>
                ) : null;
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top-left overlay: view toggle + artifact pill ──────────────────── */}
      <div
        data-no-pan
        className="absolute top-3 left-4 z-30 flex items-center gap-2.5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-[#0d0d18]/92 backdrop-blur-md p-1">
          <button
            onClick={() => setViewMode('explore')}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white/35 hover:text-white/65 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="0.5" y="0.5" width="3.5" height="3.5" rx="0.8" stroke="currentColor" strokeWidth="1"/>
              <rect x="6" y="0.5" width="3.5" height="3.5" rx="0.8" stroke="currentColor" strokeWidth="1"/>
              <rect x="0.5" y="6" width="3.5" height="3.5" rx="0.8" stroke="currentColor" strokeWidth="1"/>
              <rect x="6" y="6" width="3.5" height="3.5" rx="0.8" stroke="currentColor" strokeWidth="1"/>
            </svg>
            Explore
          </button>
          <div className="relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white">
            <div className="absolute inset-0 rounded-md bg-white/[0.08]" />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="relative z-10">
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1"/>
              <circle cx="5" cy="5" r="1.3" fill="currentColor" fillOpacity="0.6"/>
            </svg>
            <span className="relative z-10">Atlas</span>
          </div>
        </div>

        {/* Current artifact pill */}
        <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-[#0d0d18]/80 backdrop-blur-md px-3 py-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: getRegion(currentArtifactSlug)?.color ?? '#ffffff' }}
          />
          <span className="text-[11px] font-medium text-white/70 max-w-[120px] truncate">
            {artifact.title}
          </span>
          <button
            onClick={() => centerOnSlug(currentArtifactSlug)}
            title="Center on current artifact"
            className="ml-0.5 text-[10px] text-white/20 hover:text-white/55 transition-colors"
          >
            ⊙
          </button>
        </div>
      </div>

      {/* ── Top-right: zoom controls ────────────────────────────────────────── */}
      <div
        data-no-pan
        className="absolute top-3 right-4 z-30 flex flex-col items-center gap-1.5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col rounded-lg border border-white/[0.07] bg-[#0d0d18]/92 backdrop-blur-md overflow-hidden">
          <button
            onClick={() => zoomBy(1.3)}
            className="w-8 h-8 flex items-center justify-center text-white/35 hover:text-white/75 hover:bg-white/[0.06] transition-colors text-base leading-none border-b border-white/[0.05]"
          >+</button>
          <button
            onClick={() => zoomBy(0.77)}
            className="w-8 h-8 flex items-center justify-center text-white/35 hover:text-white/75 hover:bg-white/[0.06] transition-colors text-base leading-none"
          >−</button>
        </div>

        <div className="text-[8px] font-mono text-white/18 text-center">{zoomLevel}</div>

        {/* Fit all */}
        <button
          onClick={fitAll}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] bg-[#0d0d18]/92 backdrop-blur-md text-white/28 hover:text-white/65 hover:bg-white/[0.05] transition-colors"
          title="Fit all"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 4V1h3M7 1h3v3M10 7v3H7M4 10H1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Hover tooltip ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {hoverSlug && tooltipPos && hoverSlug !== selectedSlug && hoverArtifact && (
          <motion.div
            key={hoverSlug}
            className="absolute z-40 pointer-events-none"
            style={{
              left: clamp(tooltipPos.x + 18, 4, (containerRef.current?.clientWidth ?? 800) - 220),
              top:  clamp(tooltipPos.y - 52, 4, (containerRef.current?.clientHeight ?? 500) - 140),
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <div
              className="rounded-lg border bg-[#0d0d18]/96 backdrop-blur-xl px-3 py-2.5 shadow-xl min-w-[160px]"
              style={{ borderColor: `${hoverRegion?.color ?? '#ffffff'}38` }}
            >
              <div className="flex items-center gap-2 mb-1">
                {hoverRelationType && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded"
                    style={{
                      color: RELATION_CONFIG[hoverRelationType].color,
                      background: `${RELATION_CONFIG[hoverRelationType].color}22`,
                    }}
                  >
                    {RELATION_CONFIG[hoverRelationType].label}
                  </span>
                )}
                <span className="text-[9px] font-mono text-white/25">{yearRange(hoverArtifact)}</span>
              </div>
              <div className="text-[13px] font-semibold text-white leading-snug">{hoverArtifact.title}</div>
              {hoverRegion && (
                <div className="text-[10px] mt-0.5" style={{ color: `${hoverRegion.color}88` }}>
                  {hoverRegion.label}
                </div>
              )}
              <div className="text-[9px] text-white/25 mt-1.5 font-mono">
                click to select · dbl-click to enter
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Artifact focus card (with tether) ─────────────────────────────── */}
      <AnimatePresence>
        {selectedSlug && (
          <FocusCard
            key={selectedSlug}
            slug={selectedSlug}
            selectedYear={selectedYear}
            visibleSlugs={visibleSlugs}
            onExplore={navigateTo}
            onSelectNode={selectAndFocus}
            onClose={() => setSelectedSlug(null)}
            nodeScreenPos={selectedNodeScreenPos}
            containerSize={containerSize}
          />
        )}
      </AnimatePresence>

      {/* ── Region legend (region level only) ─────────────────────────────── */}
      <AnimatePresence>
        {zoomLevel === 'region' && (
          <motion.div
            data-no-pan
            className="absolute bottom-20 right-4 z-20 rounded-lg border border-white/[0.07] bg-[#0d0d18]/92 backdrop-blur-md px-3 py-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="text-[8px] font-mono text-white/22 uppercase tracking-widest mb-2">Connections</div>
            {Object.entries(RELATION_CONFIG).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-2 mb-1 last:mb-0">
                <div className="w-4 h-px" style={{ background: cfg.color, opacity: 0.8 }} />
                <span className="text-[10px] text-white/42">{cfg.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hint (cluster level) ──────────────────────────────────────────── */}
      <AnimatePresence>
        {zoomLevel === 'cluster' && !selectedSlug && (
          <motion.div
            className="absolute bottom-20 right-4 z-20 text-right"
            style={{ pointerEvents: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-[9px] font-mono text-white/18">
              scroll to zoom · drag to pan<br />click a node to focus
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <div
        data-no-pan
        className="absolute bottom-0 left-0 right-0 h-[60px] bg-[#06060e]/96 backdrop-blur-sm border-t border-white/[0.04] flex items-center px-5 gap-4 z-20"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Year + era */}
        <div className="flex flex-col items-end w-20 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.span
              key={selectedYear}
              className="text-xl font-bold font-mono text-white/80 leading-none"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.16 }}
            >
              {selectedYear}
            </motion.span>
          </AnimatePresence>
          <span className="text-[8px] font-mono text-white/22 mt-0.5 truncate">{getEraLabel(selectedYear)}</span>
        </div>

        {/* Play/pause */}
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="flex-shrink-0 w-7 h-7 rounded-full border border-white/[0.1] flex items-center justify-center text-white/35 hover:text-white/65 hover:border-white/20 transition-colors"
        >
          {isPlaying ? (
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <rect x="1" y="1" width="2.5" height="7" rx="0.5" fill="currentColor"/>
              <rect x="5.5" y="1" width="2.5" height="7" rx="0.5" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M2 1.5l6 3-6 3V1.5z" fill="currentColor"/>
            </svg>
          )}
        </button>

        {/* Slider */}
        <div className="flex-1 flex flex-col justify-center">
          <input
            type="range"
            min={TIME_MIN} max={TIME_MAX} value={selectedYear}
            onChange={(e) => { setIsPlaying(false); setSelectedYear(Number(e.target.value)); }}
            className="atlas-range w-full"
          />
          <div className="flex justify-between mt-1 px-0.5">
            {TICK_YEARS.map((y) => (
              <span key={y} className="text-[7px] font-mono text-white/12">{y}</span>
            ))}
          </div>
        </div>

        {/* Active count */}
        <div className="flex-shrink-0 text-right">
          <span className="text-[10px] font-mono text-white/18">{visibleSlugs.size}/{ARTIFACT_REGISTRY.length}</span>
          <div className="text-[7px] font-mono text-white/10 mt-0.5">active</div>
        </div>
      </div>
    </div>
  );
}
