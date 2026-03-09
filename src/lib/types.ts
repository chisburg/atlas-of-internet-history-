export type RelationType = 'before' | 'after' | 'sideways' | 'sameEra' | 'strangeJump';

export type ArtifactType =
  | 'platform'
  | 'protocol'
  | 'software'
  | 'community'
  | 'format'
  | 'phenomenon'
  | 'service'
  | 'tool';

export interface Artifact {
  slug: string;
  title: string;
  type: ArtifactType;
  startYear: number;
  endYear: number | null;
  shortDescription: string;
  gradient: string; // CSS gradient for hero
}

export interface Snapshot {
  artifactSlug: string;
  year: number;
  imageUrl: string;
}

export interface Edge {
  fromArtifact: string;
  toArtifact: string;
  relationType: RelationType;
  label: string; // one-line explanation shown on the card
}

export interface Connection {
  artifact: Artifact;
  snapshot: Snapshot | null;
  relationType: RelationType;
  label: string;
}
