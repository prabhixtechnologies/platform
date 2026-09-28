#!/usr/bin/env node
/**
 * Every page that renders must render exactly one top-level heading.
 *
 * <p>Sixteen of thirty did not. `Section` takes a `titleAs` prop and defaults to `h2`, so a page
 * whose author never thought about it produced a document that starts at level two - the whole
 * page framed as a subsection of nothing.
 *
 * <p>Two things break. A screen reader's heading list, which is how people who use one skim a
 * page, opens with no title and no sense of what the page is. And search engines take the h1 as
 * the page's subject, so About, Pricing, Careers and Docs were all offering nothing.
 *
 * <p>It is exactly the kind of thing nobody notices for a year and then fixes everywhere at
 * once, which is why it is a check rather than a commit message.
 *
 * <p>Resolves through local components, because most pages do not write the tag themselves -
 * they render `<Section titleAs="h1">` or a client component that does.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "..", "src");
const appDir = join(src, "app");

/**
 * Pages that redirect and never render.
 *
 * <p>Listed by route, and verified below to actually redirect - an entry that stops being a
 * redirect stops being exempt, rather than quietly staying on the list.
 */
const REDIRECT_ONLY = new Set([
  "/download",
  "/download/[token]",
  "/shop/order/claim/[token]",
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) out.push(full);
  }
  return out;
}

const files = walk(src);
const read = (path) => readFileSync(path, "utf8");

/** Exported component name to its source, so `<PricingContent/>` can be followed. */
const byExport = new Map();
for (const file of files) {
  const text = read(file);
  for (const match of text.matchAll(/export\s+(?:default\s+)?function\s+(\w+)/g)) {
    byExport.set(match[1], text);
  }
}

const HEADING = /<h1[\s>]|titleAs=["']h1["']|as=["']h1["']/;

/** Whether this source, or anything it renders within a couple of levels, produces an h1. */
function rendersHeading(text, depth = 0, seen = new Set()) {
  if (HEADING.test(text)) return true;
  if (depth >= 3) return false;
  for (const match of text.matchAll(/<([A-Z]\w+)/g)) {
    const child = byExport.get(match[1]);
    if (!child || seen.has(child)) continue;
    seen.add(child);
    if (rendersHeading(child, depth + 1, seen)) return true;
  }
  return false;
}

const problems = [];
const stale = [];
let checked = 0;

for (const file of walk(appDir)) {
  if (!file.endsWith(`${sep}page.tsx`)) continue;
  const route = `/${relative(appDir, dirname(file)).split(sep).join("/")}`.replace(/\/$/, "") || "/";
  const text = read(file);

  if (REDIRECT_ONLY.has(route)) {
    // Still verified, so the exemption cannot outlive the reason for it.
    if (!/\bredirect\(/.test(text)) {
      stale.push(route);
    }
    continue;
  }

  checked += 1;
  if (!rendersHeading(text)) problems.push({ route, file: relative(src, file) });
}

if (stale.length > 0) {
  console.error(
    `${stale.length} route(s) are exempt as redirect-only but no longer redirect:\n` +
      stale.map((route) => `  ${route}`).join("\n") +
      "\n\nGive them a heading and take them off REDIRECT_ONLY in this script.",
  );
  process.exit(1);
}

if (problems.length > 0) {
  console.error(`${problems.length} of ${checked} page(s) render no top-level heading:\n`);
  for (const { route, file } of problems) console.error(`  ${route.padEnd(32)} ${file}`);
  console.error(
    "\nA page with no h1 starts its document at level two, so a screen reader's heading list\n" +
      "opens with no title, and search engines see no subject. Add `titleAs=\"h1\"` to the page's\n" +
      "first <Section>, or an <h1> where it writes its own.",
  );
  process.exit(1);
}

// The count is printed on the passing path too. A check that found no pages and a check that
// passed should not look the same.
console.log(`all ${checked} rendered page(s) have a top-level heading`);
