import type {
  MessagePage,
  MessageView,
  PreChatRequest,
  SendMessageRequest,
  StartConversationResponse,
} from "./types";
import { ChatBffError, type ChatErrorBody } from "./errors";

function parseRetryAfter(response: Response): number | undefined {
  const raw = response.headers.get("Retry-After");
  if (!raw) return undefined;
  const seconds = Number.parseInt(raw, 10);
  if (Number.isFinite(seconds) && seconds > 0) return seconds;
  return undefined;
}

async function chatBff<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/chat${path}`, {
    ...init,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (response.status === 204) {
    return null as T;
  }
  if (!response.ok) {
    let body: ChatErrorBody = {
      message: response.statusText || "Request failed",
    };
    try {
      const json = (await response.json()) as ChatErrorBody;
      body = { ...json, retryAfterSeconds: json.retryAfterSeconds ?? parseRetryAfter(response) };
    } catch {
      body.retryAfterSeconds = parseRetryAfter(response);
    }
    if (response.status === 401) {
      body.code = body.code ?? "NO_SESSION";
    }
    throw new ChatBffError(response.status, body);
  }
  return (await response.json()) as T;
}

export type PublicStart = Omit<StartConversationResponse, "conversationToken">;

export function startConversation(body: PreChatRequest): Promise<PublicStart> {
  return chatBff<PublicStart>("/conversations", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function fetchMessages(
  conversationId: string,
  cursor?: string,
): Promise<MessagePage> {
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
): Promise<MessageView> {
  return chatBff<MessageView>(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
    { method: "POST", body: JSON.stringify(body) },
  );
}

export function clearChatSessionCookie(): Promise<void> {
  return chatBff<{ ok: boolean }>("", { method: "DELETE" }).then(() => undefined);
}

export function chatStreamUrl(conversationId: string): string {
  return `/api/chat/stream?conversationId=${encodeURIComponent(conversationId)}`;
}
