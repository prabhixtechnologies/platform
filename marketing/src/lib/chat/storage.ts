import { siteConfig } from "@/lib/site-config";
import type { StoredChatSession } from "./types";

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function storageKey(): string {
  return `prabhix_chat_${siteConfig.orgSlug || "default"}`;
}

export type PublicChatSession = Omit<StoredChatSession, "conversationToken"> & {
  conversationToken?: string;
};

export function readChatSession(): PublicChatSession | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(storageKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PublicChatSession;
    if (parsed.expiresAt < Date.now()) {
      sessionStorage.removeItem(storageKey());
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeChatSession(
  session: Omit<PublicChatSession, "expiresAt" | "conversationToken">,
): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const payload: PublicChatSession = {
      ...session,
      expiresAt: Date.now() + TOKEN_TTL_MS,
    };
    delete payload.conversationToken;
    sessionStorage.setItem(storageKey(), JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function clearChatSession(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(storageKey());
  } catch {
    /* ignore */
  }
}

export async function migrateLegacyChatToken(): Promise<void> {
  const stored = readChatSession();
  const token = stored?.conversationToken;
  if (!token) return;
  try {
    await fetch("/api/chat/adopt", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationToken: token }),
    });
    writeChatSession({
      conversationId: stored.conversationId,
      name: stored.name,
      email: stored.email,
      agentsAvailable: stored.agentsAvailable,
    });
  } catch {
    /* retry next load */
  }
}
