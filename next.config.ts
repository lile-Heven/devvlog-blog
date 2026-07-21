import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* React Strict Mode: double-mount in dev to catch side-effects */
  reactStrictMode: true,

  /* Image optimization domains — extend as needed for cover images */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  /* Page extensions: include MDX for direct import */
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  /* Redirect legacy routes (future-proofing) */
  async redirects() {
    return [];
  },

  /* Custom headers for security & caching */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
