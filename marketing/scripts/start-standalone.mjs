// Runs the production build locally the same way the container does.
//
// `next start` is the obvious command and the wrong one: next.config.ts sets `output: "standalone"`,
// and Next.js warns that the two do not go together. It still serves pages, which is the trap — the
// warning scrolls past and you end up smoke-testing a server that is not the one you deploy.
//
// Standalone output deliberately excludes `public/` and `.next/static/`, on the assumption that a
// CDN serves them. Nothing here uses a CDN: the Dockerfile copies both in beside `server.js`, so
// this does the same. Without that step the server starts and every stylesheet and script 404s,
// which is a more confusing failure than the warning it replaces.

import { cpSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = process.env.NEXT_DIST_DIR || ".next";
const standalone = join(root, distDir, "standalone");

if (!existsSync(join(standalone, "server.js"))) {
  console.error(`No standalone build found under ${distDir}/standalone. Run \`npm run build\` first.`);
  process.exit(1);
}

cpSync(join(root, distDir, "static"), join(standalone, distDir, "static"), { recursive: true });
if (existsSync(join(root, "public"))) {
  cpSync(join(root, "public"), join(standalone, "public"), { recursive: true });
}

// Bound to localhost rather than the container's 0.0.0.0, since this is a local smoke test and there
// is no reason to expose it to the network.
spawn(process.execPath, ["server.js"], {
  cwd: standalone,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: process.env.PORT ?? "3000",
    HOSTNAME: process.env.HOSTNAME ?? "127.0.0.1",
  },
}).on("exit", (code) => process.exit(code ?? 0));
