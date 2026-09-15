/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local backend (B2 / S3 proxy)
      {
        protocol: "http",
        hostname: "localhost",
        port: "3003",
        pathname: "/api/s3/download/**",
      },

      // UI Avatars
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },

      // Unsplash (your error source)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
