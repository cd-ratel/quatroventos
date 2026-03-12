import type { NextConfig } from 'next';

const publicUrl = process.env.APP_URL || 'https://quatroventos.redecm.com.br';
const adminUrl = process.env.ADMIN_URL || 'https://adminquatroventos.redecm.com.br';
const allowedOrigins = [publicUrl, adminUrl].join(' ');
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  `connect-src 'self' ${allowedOrigins}`,
  "font-src 'self' data: https://fonts.gstatic.com",
  `form-action 'self' ${allowedOrigins}`,
  "frame-ancestors 'self'",
  `img-src 'self' data: blob: ${allowedOrigins}`,
  "manifest-src 'self'",
  `media-src 'self' blob: ${allowedOrigins}`,
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "worker-src 'self' blob:",
  'upgrade-insecure-requests',
].join('; ');

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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Origin-Agent-Cluster', value: '?1' },
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=()' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
