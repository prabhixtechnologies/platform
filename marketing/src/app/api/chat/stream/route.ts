import { type NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/api-url";
import { siteConfig } from "@/lib/site-config";
import { CHAT_COOKIE, isChatJwt } from "@/lib/chat/bff-cookies";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(CHAT_COOKIE)?.value;
  const conversationId = request.nextUrl.searchParams.get("conversationId");
  if (!isChatJwt(token) || !conversationId || !siteConfig.orgId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const params = new URLSearchParams({
    organizationId: siteConfig.orgId,
    conversationId,
    token,
  });
  const upstream = await fetch(
    `${getApiBaseUrl()}/v1/chat/public/stream?${params.toString()}`,
    { headers: { Accept: "text/event-stream" } },
  );
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
