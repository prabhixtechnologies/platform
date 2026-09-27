import { getApiBaseUrl } from "@/lib/api-url";
import { siteConfig } from "@/lib/site-config";
import type {
  MessagePage,
  MessageView,
  PreChatRequest,
  SendMessageRequest,
  StartConversationResponse,
} from "./types";

async function chatFetch<T>(
  path: string,
  init: RequestInit & { token?: string },
): Promise<T | null> {
  const { token, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("X-Chat-Token", token);
  }

  try {
    let outbound = headers;
    if (typeof window === "undefined") {
      const { mergePublicUpstreamHeaders } = await import("@/lib/bff/public-upstream.logic");
      outbound = mergePublicUpstreamHeaders(headers);
    }
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...rest,
      headers: outbound,
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function startConversation(
  body: PreChatRequest,
): Promise<StartConversationResponse | null> {
  if (!siteConfig.orgSlug) return Promise.resolve(null);
  return chatFetch<StartConversationResponse>(
    `/v1/oneops/chat/public/conversations?orgSlug=${encodeURIComponent(siteConfig.orgSlug)}`,
    { method: "POST", body: JSON.stringify(body) },
  );
}

export function fetchMessages(
  conversationId: string,
  token: string,
  cursor?: string,
): Promise<MessagePage | null> {
  if (!siteConfig.orgSlug) return Promise.resolve(null);
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  const qs = params.toString();
  return chatFetch<MessagePage>(
    `/v1/oneops/chat/public/conversations/messages?id=${encodeURIComponent(conversationId)}${qs ? `&${qs}` : ""}`,
    { method: "GET", token },
  );
}

export function sendMessage(
  conversationId: string,
  token: string,
  body: SendMessageRequest,
): Promise<MessageView | null> {
  if (!siteConfig.orgSlug) return Promise.resolve(null);
  return chatFetch<MessageView>(
    `/v1/oneops/chat/public/conversations/messages?orgSlug=${encodeURIComponent(siteConfig.orgSlug)}&id=${encodeURIComponent(conversationId)}`,
    { method: "POST", body: JSON.stringify(body), token },
  );
}

/**
 * @deprecated Browser code must use same-origin `/api/chat/stream` (httpOnly cookie).
 * Upstream SSE must receive `X-Chat-Token`, not a query token — see docs/BFF-ONEOPS-COUNTERPART.md.
 */
export function buildUpstreamStreamUrl(conversationId: string): string | null {
  if (!siteConfig.orgId) return null;
  const params = new URLSearchParams({
    organizationId: siteConfig.orgId,
    conversationId,
  });
  return `${getApiBaseUrl()}/v1/oneops/chat/public/stream?${params.toString()}`;
}
