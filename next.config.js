const withNextIntl = require('next-intl/plugin')(
  './lib/i18n/config.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.cache = {
        type: 'filesystem',
        compression: 'gzip',
        maxMemoryGenerations: 1,
        idleTimeout: 60000,
        maxAge: 5184000000,
        allowCollectingMemory: true,
        memoryCacheUnaffected: true,
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
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
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/youtube/:path*",
        destination: "https://www.googleapis.com/youtube/v3/:path*",
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
