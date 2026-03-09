import { artifacts, edges, getArtifact, getSnapshot } from '@/data/seed';
import type { Connection, RelationType } from '@/lib/types';

const RELATION_PRIORITY: RelationType[] = ['before', 'after', 'sideways', 'sameEra', 'strangeJump'];

/**
 * Returns up to 5 connections for a given artifact slug — one per relation type.
 * Traverses both directions of edges (fromArtifact and toArtifact).
 */
export function getConnections(slug: string): Connection[] {
  const seen = new Map<RelationType, Connection>();
  const seenSlugs = new Set<string>(); // prevent same artifact appearing in two slots

  for (const edge of edges) {
    let connectedSlug: string | null = null;
    let relationType: RelationType = edge.relationType;

    if (edge.fromArtifact === slug) {
      connectedSlug = edge.toArtifact;
    } else if (edge.toArtifact === slug) {
      connectedSlug = edge.fromArtifact;
      // Flip directional types when traversing reverse
      if (edge.relationType === 'before') relationType = 'after';
      else if (edge.relationType === 'after') relationType = 'before';
    }

    if (!connectedSlug) continue;
    if (connectedSlug === slug) continue;
    if (seen.has(relationType)) continue;
    if (seenSlugs.has(connectedSlug)) continue;

    const artifact = getArtifact(connectedSlug);
    if (!artifact) continue;

    const snapshot = getSnapshot(connectedSlug) ?? null;

    seen.set(relationType, { artifact, snapshot, relationType, label: edge.label });
    seenSlugs.add(connectedSlug);
  }

  // Return in canonical order
  return RELATION_PRIORITY.filter((r) => seen.has(r)).map((r) => seen.get(r)!);
}

/**
 * Returns ALL unique direct connections for a given slug (up to 10).
 * Unlike getConnections(), this is NOT limited to one per relation type —
 * intended for the local map view where we want to show the full neighborhood.
 */
export function getAllConnections(slug: string): Connection[] {
  const seenSlugs = new Set<string>();
  const result: Connection[] = [];

  for (const edge of edges) {
    let connectedSlug: string | null = null;
    let relationType: RelationType = edge.relationType;

    if (edge.fromArtifact === slug) {
      connectedSlug = edge.toArtifact;
    } else if (edge.toArtifact === slug) {
      connectedSlug = edge.fromArtifact;
      if (edge.relationType === 'before') relationType = 'after';
      else if (edge.relationType === 'after') relationType = 'before';
    }

    if (!connectedSlug || connectedSlug === slug || seenSlugs.has(connectedSlug)) continue;
    seenSlugs.add(connectedSlug);

    const artifact = getArtifact(connectedSlug);
    if (!artifact) continue;

    result.push({ artifact, snapshot: getSnapshot(connectedSlug) ?? null, relationType, label: edge.label });
    if (result.length >= 10) break;
  }

  return result;
}

/**
 * Validate no dead ends: every artifact has at least 3 connections.
 * Used in development to verify seed integrity.
 */
export function validateNoDeadEnds(): { slug: string; count: number }[] {
  return artifacts
    .map((a) => ({ slug: a.slug, count: getConnections(a.slug).length }))
    .filter((r) => r.count < 3);
}
