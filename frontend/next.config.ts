import type { NextConfig } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const nextConfig: NextConfig = {
  turbopack: {
    root: '..',
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '5001', pathname: '/uploads/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '5001', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
