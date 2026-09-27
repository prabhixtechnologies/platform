import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearChatSession,
  migrateLegacyChatToken,
  readChatSession,
  writeChatSession,
} from "./storage";

describe("migrateLegacyChatToken", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearChatSession();
  });

  it("migrates a legacy sessionStorage JWT into the httpOnly cookie flow", async () => {
    sessionStorage.setItem(
      "prabhix_chat_default",
      JSON.stringify({
        conversationId: "22222222-2222-4222-8222-222222222222",
        conversationToken: "aaaa.bbbb.cccc",
        name: "Ada",
        email: "ada@example.com",
        agentsAvailable: true,
        expiresAt: Date.now() + 60_000,
      }),
    );

    await migrateLegacyChatToken();

    expect(fetch).toHaveBeenCalledWith(
      "/api/chat/adopt",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
      }),
    );
    const stored = readChatSession();
    expect(stored?.conversationToken).toBeUndefined();
    expect(stored?.conversationId).toBe("22222222-2222-4222-8222-222222222222");
  });

  it("clears invalid legacy tokens after a 403 adopt response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (String(url).includes("/api/chat/adopt")) {
          return new Response(JSON.stringify({ code: "TOKEN_INVALID" }), { status: 403 });
        }
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }),
    );
    sessionStorage.setItem(
      "prabhix_chat_default",
      JSON.stringify({
        conversationId: "22222222-2222-4222-8222-222222222222",
        conversationToken: "aaaa.bbbb.cccc",
        name: "Ada",
        email: "ada@example.com",
        agentsAvailable: true,
        expiresAt: Date.now() + 60_000,
      }),
    );

    await migrateLegacyChatToken();
    expect(readChatSession()).toBeNull();
  });
});

describe("writeChatSession", () => {
  afterEach(() => {
    clearChatSession();
  });

  it("never persists conversationToken in sessionStorage", () => {
    writeChatSession({
      conversationId: "22222222-2222-4222-8222-222222222222",
      name: "Ada",
      email: "ada@example.com",
      agentsAvailable: true,
    });
    const raw = sessionStorage.getItem("prabhix_chat_default");
    expect(raw).toBeTruthy();
    expect(raw).not.toContain("conversationToken");
  });
});
