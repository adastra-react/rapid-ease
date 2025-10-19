// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: { domains: ["res.cloudinary.com"] },
//   reactStrictMode: true,
//   swcMinify: true,
//   experimental: { esmExternals: false },

//   // ✅ Unblock CI on lint
//   eslint: { ignoreDuringBuilds: true },

//   // ✅ Unblock CI on TS type errors (if any)
//   typescript: { ignoreBuildErrors: true },
// };

// module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: { domains: ["res.cloudinary.com"] },
//   reactStrictMode: true,
//   swcMinify: true,
//   experimental: { esmExternals: false },

//   // Unblock CI on lint + TS type errors
//   eslint: { ignoreDuringBuilds: true },
//   typescript: { ignoreBuildErrors: true },
// };
// module.exports = nextConfig;

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
