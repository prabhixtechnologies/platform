import { afterEach, describe, expect, it, vi } from "vitest";
import { ChatBffError } from "./errors";
import { fetchMessages, startConversation } from "./chat-client";

describe("chat-client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps 401 responses to NO_SESSION for recovery UX", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ message: "No chat session" }, { status: 401 }),
      ),
    );

    await expect(fetchMessages("22222222-2222-4222-8222-222222222222")).rejects.toMatchObject({
      status: 401,
      code: "NO_SESSION",
    } satisfies Partial<ChatBffError>);
  });

  it("propagates rate limit retry hints", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          { code: "RATE_LIMITED", message: "Slow down", retryAfterSeconds: 5 },
          { status: 429, headers: { "Retry-After": "5" } },
        ),
      ),
    );

    await expect(
      startConversation({ name: "Ada", email: "ada@example.com" }),
    ).rejects.toMatchObject({
      code: "RATE_LIMITED",
      retryAfterSeconds: 5,
    });
  });
});
