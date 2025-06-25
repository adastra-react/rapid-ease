/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image configuration
  images: {
    domains: ["res.cloudinary.com"],
    // Add unoptimized: true if you're doing static export or having image optimization issues
    // unoptimized: true,
  },

  // Enable SWC minification for better performance
  swcMinify: true,

  // Reduce build output noise
  typescript: {
    // Only run type checking in development, skip in production builds
    // This can help if TypeScript errors are causing build failures
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Ignore ESLint errors during builds to allow deployment
    ignoreDuringBuilds: true,
  },

  // Output configuration for different deployment types
  // Uncomment the line below if you need static export
  // output: 'export',

  // Trailing slash configuration
  trailingSlash: false,

  // Redirect configuration
  async redirects() {
    return [];
  },

  // Custom webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add any custom webpack configurations here if needed
    return config;
  },

  // Environment variables (optional - you can also use .env files)
  env: {
    // Add any environment variables here if needed
    // CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Experimental features (use with caution)
  experimental: {
    // Enable if you're using app directory (Next.js 13+)
    // appDir: true,
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Power pack for better performance
  poweredByHeader: false,

  // Compression
  compress: true,

  // Generate build ID
  generateBuildId: async () => {
    // You can return any string here
    return "my-build-id";
  },
};

module.exports = nextConfig;
