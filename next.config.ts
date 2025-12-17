import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    return [
      {
        source: '/api/:path*',
        destination: `${backend.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  }
};

export default nextConfig;
