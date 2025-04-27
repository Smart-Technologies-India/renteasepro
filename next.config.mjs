/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["192.168.0.106", "localhost"],
  },
  env: {
    UPLOAD_LINK: process.env.UPLOAD_LINK,
    YOUR_BASE_URL: process.env.YOUR_BASE_URL,
  },
};

export default nextConfig;
