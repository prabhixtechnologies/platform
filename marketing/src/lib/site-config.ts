/**
 * The single source of truth for identity and every outbound URL on the marketing site.
 *
 * Nothing else in `marketing/` should read `process.env.NEXT_PUBLIC_*` for a URL.
 *
 * These are `NEXT_PUBLIC_*`, so they are inlined at **build** time. Docker local compose must
 * pass localhost values; production compose must pass https://… hostnames. Defaults below are
 * laptop-safe so a missing env cannot silently send visitors to production.
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
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  apiUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  ),
  consoleUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_CONSOLE_URL ?? "http://localhost:5173",
  ),
  /** Hosted Identity login (OIDC). Products redirect here; marketing links products, not this bare. */
  identityIssuer: trimTrailingSlash(
    process.env.NEXT_PUBLIC_IDENTITY_ISSUER ?? "http://localhost:8081",
  ),
  orgSlug: process.env.NEXT_PUBLIC_ORG_SLUG ?? "",
  orgId: process.env.NEXT_PUBLIC_ORG_ID ?? "",
  email: "hello@prabhixtechnologies.com",
  address: "Bengaluru, Karnataka, India",
} as const;

/**
 * Where each shipped application actually lives.
 *
 * A product entry in `content/products.ts` marked `kind: "app"` points at one of these.
 */
export const appUrls = {
  oneops: siteConfig.consoleUrl,
  mobistack: trimTrailingSlash(
    process.env.NEXT_PUBLIC_MOBISTACK_URL ?? "http://localhost:5176",
  ),
  mailroom: trimTrailingSlash(
    process.env.NEXT_PUBLIC_MAILROOM_URL ?? "http://localhost:5175",
  ),
  store: trimTrailingSlash(
    process.env.NEXT_PUBLIC_STORE_URL ?? "http://localhost:8090",
  ),
} as const;

export type AppKey = Exclude<keyof typeof appUrls, "store">;
