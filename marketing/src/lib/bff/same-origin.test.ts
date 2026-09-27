import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { isSameOriginBrowserRequest } from "./same-origin";

function request(headers: Record<string, string>): NextRequest {
  return new NextRequest("http://localhost:3000/api/shop/cart/adopt", { headers });
}

describe("isSameOriginBrowserRequest", () => {
  it("accepts matching Origin", () => {
    expect(
      isSameOriginBrowserRequest(request({ origin: "http://localhost:3000" })),
    ).toBe(true);
  });

  it("accepts matching Referer when Origin is absent", () => {
    expect(
      isSameOriginBrowserRequest(
        request({ referer: "http://localhost:3000/shop/checkout" }),
      ),
    ).toBe(true);
  });

  it("rejects cross-origin Origin", () => {
    expect(
      isSameOriginBrowserRequest(request({ origin: "https://evil.example" })),
    ).toBe(false);
  });

  it("rejects requests with no Origin or Referer", () => {
    expect(isSameOriginBrowserRequest(request({}))).toBe(false);
  });
});
