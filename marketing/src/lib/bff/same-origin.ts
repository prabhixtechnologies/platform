import type { NextRequest } from "next/server";
import { siteConfig } from "@/lib/site-config";

export function expectedSiteOrigin(): string {
  return new URL(siteConfig.url).origin;
}

/**
 * Browser-initiated state-changing BFF calls must present a same-origin Origin or Referer.
 * Returns false when the request should be rejected as cross-site.
 */
export function isSameOriginBrowserRequest(request: NextRequest): boolean {
  const allowed = expectedSiteOrigin();
  const origin = request.headers.get("origin");
  if (origin) {
    return origin === allowed;
  }
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === allowed;
    } catch {
      return false;
    }
  }
  return false;
}
