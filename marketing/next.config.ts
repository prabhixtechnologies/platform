import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const configDir = path.dirname(fileURLToPath(import.meta.url));
// Laptop and CI keep @prabhix/brand in the sibling web-kit checkout. The image build
// copies that package under vendor/ and the sibling is not there, so the root stays
// this app. Turbopack refuses a CSS import that leaves its root.
const siblingWebKit = path.resolve(configDir, "../../web-kit");
const turbopackRoot = fs.existsSync(siblingWebKit) ? path.resolve(configDir, "../..") : configDir;

const nextConfig: NextConfig = {
  output: "standalone",
  // Next requires these two to match. The image build vendors brand inside this app, so both
  // stay on configDir there. A laptop or CI build widens both to the checkout that holds web-kit.
  outputFileTracingRoot: turbopackRoot,
  turbopack: { root: turbopackRoot },
  // Allow a parallel dist when Cursor/tsserver locks `.next/standalone` on Windows.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@prabhix/oneops-api", "@prabhix/brand"],
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
