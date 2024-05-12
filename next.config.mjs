/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    UPLOAD_LINK: process.env.UPLOAD_LINK,
    FEES_MERCHANT_ID: process.env.FEES_MERCHANT_ID,
    FEES_WORKING_KEY: process.env.FEES_WORKING_KEY,
    FEES_ACCESS_CODE: process.env.FEES_ACCESS_CODE,
    EMD_MERCHANT_ID: process.env.EMD_MERCHANT_ID,
    EMD_WORKING_KEY: process.env.EMD_WORKING_KEY,
    EMD_ACCESS_CODE: process.env.EMD_ACCESS_CODE,
  },
};

export default nextConfig;
