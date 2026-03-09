import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    // Explicit root prevents Next.js from mis-detecting the workspace root
    // when a package.json exists in a parent directory.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
