import { siteConfig } from "@/lib/site-config";
import type { StoredChatSession } from "./types";

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function storageKey(): string {
  return `prabhix_chat_${siteConfig.orgSlug || "default"}`;
}

export function readChatSession(): StoredChatSession | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(storageKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredChatSession;
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
  session: Omit<StoredChatSession, "expiresAt">,
): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const payload: StoredChatSession = {
      ...session,
      expiresAt: Date.now() + TOKEN_TTL_MS,
    };
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

export function touchChatSession(): void {
  const current = readChatSession();
  if (!current) return;
  writeChatSession(current);
}
