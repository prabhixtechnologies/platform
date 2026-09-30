import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  // Next requires these two to match, and this app is the root of both.
  //
  // They used to be computed: @prabhixtechnologies/brand was a `file:` link into a sibling
  // web-kit checkout, which is outside this directory, and Turbopack refuses a CSS import that
  // leaves its root — so the root widened to the parent whenever that sibling existed. It does
  // not exist inside the image, which vendored the package instead, so the value differed
  // between a laptop and a build. The package is an ordinary dependency in node_modules now, so
  // it is inside the root everywhere and there is nothing left to detect.
  outputFileTracingRoot: configDir,
  turbopack: { root: configDir },
  // Allow a parallel dist when Cursor/tsserver locks `.next/standalone` on Windows.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@prabhixtechnologies/oneops-api", "@prabhixtechnologies/brand"],
  // Put <title>, the description, og: tags, canonical and the manifest link in <head> for every
  // request instead of streaming them into <body>.
  //
  // Streaming metadata is the default and it is the right default when generateMetadata has to wait
  // on something slow, because the shell can be sent first and the tags appended once they resolve.
  // Nothing here waits: the marketing pages export a static metadata object, and the content-backed
  // routes read from local files. The one route that does fetch, /shop/[slug], awaits the same
  // request to render its body, and Next dedupes it — so blocking costs it nothing either.
  //
  // Streaming is not free for us, though. React does not relocate server-rendered tags during
  // hydration, so they stay in <body> in the final DOM: Google ignores a canonical outside <head>,
  // Chrome does not pick up a manifest link there, and every SEO tool that parses the served HTML
  // reports the description as missing — which is what Lighthouse was reporting.
  htmlLimitedBots: /.*/,
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
