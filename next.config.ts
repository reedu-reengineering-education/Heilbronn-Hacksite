import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uploaded images are served from the app itself. Remote images (e.g. a CDN
  // or an external image host you add later) must be allowlisted here.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
