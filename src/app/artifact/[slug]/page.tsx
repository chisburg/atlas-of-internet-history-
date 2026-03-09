import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getArtifact } from '@/data/seed';
import { getConnections } from '@/lib/navigation';
import ArtifactView from '@/components/ArtifactView';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artifact = getArtifact(slug);
  if (!artifact) return { title: 'Not Found' };
  return {
    title: `${artifact.title} — Atlas of the Internet`,
    description: artifact.shortDescription,
  };
}

export default async function ArtifactPage({ params }: Props) {
  const { slug } = await params;
  const artifact = getArtifact(slug);

  if (!artifact) notFound();

  const connections = getConnections(slug);

  return <ArtifactView artifact={artifact} connections={connections} />;
}
