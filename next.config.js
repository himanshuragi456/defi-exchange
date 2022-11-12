/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // basePath: "/launchpad",
};

module.exports = withPlugins([], {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `https://staging.wenbit.com/api/:path*`, // Proxy to Backend
      },
    ];
  },
  ...nextConfig,
});
