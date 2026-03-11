import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quatroventos.redecm.com.br',
      },
    ],
  },
  serverExternalPackages: ['sharp', 'bcryptjs'],
};

export default nextConfig;
