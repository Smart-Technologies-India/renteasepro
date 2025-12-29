/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.106",
      },
      {
        protocol: "https",
        hostname: "pdadnhrent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "194.238.22.198",
      },
      {
        protocol: "https",
        hostname: "192.168.0.106",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "194.238.22.198",
      },
    ],
  },
  env: {
    UPLOAD_LINK: process.env.UPLOAD_LINK,
    YOUR_BASE_URL: process.env.YOUR_BASE_URL,
  },
  transpilePackages: ["./generated/prisma"],
};

export default nextConfig;
