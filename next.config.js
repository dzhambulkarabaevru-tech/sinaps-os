/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/create-path": ["./knowledge-base/**/*"],
      "/library": ["./knowledge-base/content-library/**/*"],
      "/growth-map": ["./knowledge-base/**/*"],
    },
  },
};
module.exports = nextConfig;
