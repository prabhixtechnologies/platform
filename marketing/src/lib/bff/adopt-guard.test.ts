import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { guardAdoptRequest } from "./adopt-guard";
import { resetRateLimitsForTests } from "./rate-limit";

describe("guardAdoptRequest", () => {
  afterEach(() => {
    resetRateLimitsForTests();
  });

  it("returns 403 for cross-origin adopt attempts", async () => {
    const request = new NextRequest("http://localhost:3000/api/shop/cart/adopt", {
      method: "POST",
      headers: { origin: "https://attacker.example" },
    });
    const blocked = guardAdoptRequest(request, "cart");
    expect(blocked?.status).toBe(403);
    const body = (await blocked?.json()) as { code: string };
    expect(body.code).toBe("ORIGIN_NOT_ALLOWED");
  });

  it("returns 429 when the adopt budget is exhausted", async () => {
    for (let i = 0; i < 21; i++) {
      const request = new NextRequest("http://localhost:3000/api/shop/cart/adopt", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "x-forwarded-for": "203.0.113.50",
        },
      });
      const blocked = guardAdoptRequest(request, "cart");
      if (i < 20) {
        expect(blocked).toBeNull();
      } else {
        expect(blocked?.status).toBe(429);
        expect(blocked?.headers.get("Retry-After")).toBeTruthy();
      }
    }
  });
});
