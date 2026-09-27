import { type NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/api-url";
import { siteConfig } from "@/lib/site-config";
import { CHAT_COOKIE, isChatJwt } from "@/lib/chat/bff-cookies";
import { readHostCookie } from "@/lib/commerce/shop-cookies";
import { fetchPublicUpstream } from "@/lib/bff/public-upstream";
import { forwardRetryAfter } from "@/lib/bff/security-response";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = readHostCookie(request.cookies, CHAT_COOKIE);
  const conversationId = request.nextUrl.searchParams.get("conversationId");
  if (!isChatJwt(token) || !conversationId || !siteConfig.orgId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const params = new URLSearchParams({
    organizationId: siteConfig.orgId,
    conversationId,
  });
  const upstream = await fetchPublicUpstream(
    `${getApiBaseUrl()}/v1/oneops/chat/public/stream?${params.toString()}`,
    {
      headers: {
        Accept: "text/event-stream",
        "X-Chat-Token": token,
      },
    },
  );
  if (!upstream.ok) {
    return new Response(upstream.statusText || "Upstream stream failed", {
      status: upstream.status,
      headers: forwardRetryAfter(upstream),
    });
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
