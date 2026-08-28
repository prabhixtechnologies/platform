/**
 * The single source of truth for identity and every outbound URL on the marketing site.
 *
 * Nothing else in `marketing/` should read `process.env.NEXT_PUBLIC_*` for a URL. Two modules used
 * to declare `SITE_URL`, `API_BASE_URL` and `CONSOLE_URL` independently, which is how the console
 * link and the site URL drifted apart between them.
 *
 * These are `NEXT_PUBLIC_*`, so they are inlined at build time, not read at runtime. A Docker image
 * therefore has to be built with the right values — see `docker-compose.prod.yml`.
 */

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

export const siteConfig = {
  name: "Prabhix Technologies",
  tagline: "Building software that simplifies business.",
  acronym:
    "Progressive Research & Automation Business Hub for Innovation & eXperience",
  url: trimTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://prabhixtechnologies.com",
  ),
  apiUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  ),
  /**
   * OneOps, the operator console. Historically `app.prabhixtechnologies.com`; `oneops.` is the
   * name now and the old host redirects to it in `deploy/Caddyfile`.
   */
  consoleUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_CONSOLE_URL ?? "https://oneops.prabhixtechnologies.com",
  ),
  /**
   * Prabhix's own tenant. The storefront, chat widget and visitor beacon are public API clients
   * addressed by organization, so the public site has to say which organization it belongs to.
   * Blank disables those features rather than breaking the page.
   */
  orgSlug: process.env.NEXT_PUBLIC_ORG_SLUG ?? "",
  orgId: process.env.NEXT_PUBLIC_ORG_ID ?? "",
  email: "hello@prabhixtechnologies.com",
  address: "Bengaluru, Karnataka, India",
} as const;

/**
 * Where each shipped application actually lives.
 *
 * This is what makes "Open app" honest. A product entry in `content/products.ts` marked
 * `kind: "app"` points at one of these; anything that is a capability *inside* OneOps is marked
 * `kind: "module"` and must not offer an "Open app" link, because there is no separate app to open.
 */
export const appUrls = {
  oneops: siteConfig.consoleUrl,
  mobistack: trimTrailingSlash(
    process.env.NEXT_PUBLIC_MOBISTACK_URL ??
      "https://mobistack.prabhixtechnologies.com",
  ),
} as const;

export type AppKey = keyof typeof appUrls;
