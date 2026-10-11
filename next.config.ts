import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // AGENTS.md is the guide; keep `next dev` from writing its own block into it.
  agentRules: false,
  images: {
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com' },
    ],
  },
  serverExternalPackages: ['qrcode'],
  async redirects() {
    return [
      {
        source: '/blog/building-tools-is-easier-than-you-think',
        destination: '/blog/hello-world',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
