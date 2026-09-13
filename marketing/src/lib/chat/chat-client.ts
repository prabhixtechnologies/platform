import type {
  MessagePage,
  MessageView,
  PreChatRequest,
  SendMessageRequest,
  StartConversationResponse,
} from "./types";

async function chatBff<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  try {
    const response = await fetch(`/api/chat${path}`, {
      ...init,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
    if (!response.ok) return null;
    if (response.status === 204) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export type PublicStart = Omit<StartConversationResponse, "conversationToken">;

export function startConversation(body: PreChatRequest): Promise<PublicStart | null> {
  return chatBff<PublicStart>("/conversations", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function fetchMessages(
  conversationId: string,
  cursor?: string,
): Promise<MessagePage | null> {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  const qs = params.toString();
  return chatBff<MessagePage>(
    `/conversations/${encodeURIComponent(conversationId)}/messages${qs ? `?${qs}` : ""}`,
    { method: "GET" },
  );
}

export function sendMessage(
  conversationId: string,
  body: SendMessageRequest,
): Promise<MessageView | null> {
  return chatBff<MessageView>(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
    { method: "POST", body: JSON.stringify(body) },
  );
}

export function chatStreamUrl(conversationId: string): string {
  return `/api/chat/stream?conversationId=${encodeURIComponent(conversationId)}`;
}
