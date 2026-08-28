import { siteConfig } from "./site-config";

/**
 * Base for backend calls that callers extend with a versioned path like `/v1/commerce/...`.
 *
 * In the browser this is the same-origin `/api/backend` prefix, which `next.config.ts` rewrites to
 * `${NEXT_PUBLIC_API_URL}/api/*`. Keeping browser traffic same-origin means no CORS preflight on
 * every storefront and chat call.
 *
 * On the server there is no rewrite, so the `/api` segment the rewrite would have supplied has to
 * be added here. Omitting it is silent rather than loud: the fetch wrappers return null on a
 * non-OK response, so a wrong base shows up as an empty catalog or a sitemap with no product
 * URLs instead of an error.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/backend";
  }
  return `${siteConfig.apiUrl.replace(/\/$/, "")}/api`;
}
