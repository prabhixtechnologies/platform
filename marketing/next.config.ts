import type { NextConfig } from "next";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      // "Ops Hub" is now OneOps. This URL was public, so it redirects instead of 404ing.
      {
        source: "/products/ops-hub",
        destination: "/products/oneops",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
