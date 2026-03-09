import type { Metadata } from 'next';
import AtlasV2 from '@/components/v2/AtlasV2';

export const metadata: Metadata = {
  title: 'Atlas of the Internet — Discovery Engine',
  description:
    'Explore the evolution of the internet through territories, landmarks, and artifacts. A digital archaeology of the web.',
};

export default function AtlasV2Page() {
  return <AtlasV2 />;
}
