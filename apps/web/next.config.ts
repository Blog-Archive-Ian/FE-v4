import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@blog/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
}

export default nextConfig
