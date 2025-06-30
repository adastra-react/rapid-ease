/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },

  // Enable React Strict Mode (helps catch hydration issues during development)
  reactStrictMode: true,

  // Use SWC minifier for better performance
  swcMinify: true,

  // This can help with hydration issues
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig;
