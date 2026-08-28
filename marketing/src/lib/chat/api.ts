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
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...rest,
      headers,
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
    `/v1/chat/public/${encodeURIComponent(siteConfig.orgSlug)}/conversations`,
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
    `/v1/chat/public/${encodeURIComponent(siteConfig.orgSlug)}/conversations/${conversationId}/messages${qs ? `?${qs}` : ""}`,
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
    `/v1/chat/public/${encodeURIComponent(siteConfig.orgSlug)}/conversations/${conversationId}/messages`,
    { method: "POST", body: JSON.stringify(body), token },
  );
}

export function buildStreamUrl(
  conversationId: string,
  token: string,
): string | null {
  if (!siteConfig.orgId || !siteConfig.orgSlug) return null;
  const params = new URLSearchParams({
    organizationId: siteConfig.orgId,
    conversationId,
    token,
  });
  return `${getApiBaseUrl()}/v1/chat/public/stream?${params.toString()}`;
}
