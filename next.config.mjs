/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    UPLOAD_LINK: process.env.UPLOAD_LINK,
  },
};

export default nextConfig;
