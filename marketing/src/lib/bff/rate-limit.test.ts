import { afterEach, describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimitsForTests } from "./rate-limit";

describe("checkRateLimit", () => {
  afterEach(() => {
    resetRateLimitsForTests();
  });

  it("allows traffic under the limit", () => {
    const now = 1_000_000;
    expect(checkRateLimit("k", 2, 60_000, now).allowed).toBe(true);
    expect(checkRateLimit("k", 2, 60_000, now + 1).allowed).toBe(true);
  });

  it("blocks traffic over the limit with retryAfterSeconds", () => {
    const now = 1_000_000;
    checkRateLimit("k", 1, 60_000, now);
    const blocked = checkRateLimit("k", 1, 60_000, now + 100);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    }
  });
});
