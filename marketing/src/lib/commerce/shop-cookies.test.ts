import { describe, expect, it } from "vitest";
import { cartViewSchema } from "./schemas";
import { isOpaqueToken, secretCookieOptions } from "./shop-cookies";

describe("isOpaqueToken", () => {
  it("accepts URL-safe Base64 of the length CommerceTokens emits", () => {
    expect(isOpaqueToken("abcdefghijklmnopqrstuvwxyz0123456789_-ABCDE")).toBe(true);
  });

  it("rejects empty, short, and non-token values", () => {
    expect(isOpaqueToken("")).toBe(false);
    expect(isOpaqueToken("short")).toBe(false);
    expect(isOpaqueToken("has spaces in it...................")).toBe(false);
    expect(isOpaqueToken(null)).toBe(false);
  });
});

describe("shop BFF cart payload", () => {
  it("parses a cart with the token stripped", () => {
    expect(
      cartViewSchema.parse({
        currency: "INR",
        items: [],
        subtotalMinor: 0,
        discountMinor: 0,
        taxMinor: 0,
        shippingMinor: 0,
        totalMinor: 0,
        expiresAt: "2026-12-31T00:00:00Z",
      }),
    ).toMatchObject({ currency: "INR", totalMinor: 0 });
  });
});

describe("secretCookieOptions", () => {
  it("is httpOnly and Lax so XSS cannot read the token", () => {
    const options = secretCookieOptions(60);
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe("/");
  });
});
