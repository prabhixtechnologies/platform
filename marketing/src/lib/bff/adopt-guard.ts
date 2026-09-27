import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/bff/rate-limit";
import { isSameOriginBrowserRequest } from "@/lib/bff/same-origin";
import { originRejected, rateLimited } from "@/lib/bff/security-response";

const ADOPT_LIMIT = 20;
const ADOPT_WINDOW_MS = 60_000;

export function guardAdoptRequest(request: NextRequest, scope: string): NextResponse | null {
  if (!isSameOriginBrowserRequest(request)) {
    return originRejected();
  }
  const ip = clientIp(request);
  const limited = checkRateLimit(`adopt:${scope}:${ip}`, ADOPT_LIMIT, ADOPT_WINDOW_MS);
  if (!limited.allowed) {
    return rateLimited(limited.retryAfterSeconds);
  }
  return null;
}
