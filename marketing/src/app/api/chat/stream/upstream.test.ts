import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/site-config", () => ({
  siteConfig: {
    orgId: "11111111-1111-4111-8111-111111111111",
    orgSlug: "prabhix",
  },
}));

import { buildUpstreamStreamUrl } from "@/lib/chat/api";

describe("chat SSE upstream URL", () => {
  it("does not place the JWT in the query string", () => {
    const url = buildUpstreamStreamUrl("22222222-2222-4222-8222-222222222222");
    expect(url).toBeTruthy();
    expect(url).toContain(
      "conversationId=22222222-2222-4222-8222-222222222222",
    );
    expect(url).not.toMatch(/([?&])token=/);
  });
});
