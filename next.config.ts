import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL ?? 'https://video-editor-app-backend.onrender.com'}/api/:path*`,
      },
    ]
  }
};

export default nextConfig;
