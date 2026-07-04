/** @type {import('next').NextConfig} */
const nextConfig = {
  // knowledge-base/ читается через fs.readFile в M6/M7/M8/M0 во время работы
  // API-роута — без этой настройки файлы могут не попасть в бандл
  // serverless-функции ни на Vercel, ни на Netlify.
  outputFileTracingIncludes: {
    "/api/create-path": ["./knowledge-base/**/*"],
    "/library": ["./knowledge-base/content-library/**/*"],
    "/growth-map": ["./knowledge-base/**/*"],
  },
};
module.exports = nextConfig;
