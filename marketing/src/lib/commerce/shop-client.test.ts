import { afterEach, describe, expect, it, vi } from "vitest";
import { CommerceApiError } from "./errors";
import { migrateLegacySecrets, shopGetCart } from "./shop-client";

describe("shop-client BFF errors", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("surfaces Retry-After from the shop BFF", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          { code: "RATE_LIMITED", message: "Slow down" },
          { status: 429, headers: { "Retry-After": "12" } },
        ),
      ),
    );

    await expect(shopGetCart()).rejects.toMatchObject({
      code: "RATE_LIMITED",
      retryAfterSeconds: 12,
    } satisfies Partial<CommerceApiError>);
  });
});

describe("migrateLegacySecrets", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("adopts a legacy cart token then removes it from localStorage", async () => {
    localStorage.setItem("prabhix_cart_token", "abcdefghijklmnopqrstuvwxyz0123456789_-ABCDE");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    );

    await migrateLegacySecrets();

    expect(localStorage.getItem("prabhix_cart_token")).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      "/api/shop/cart/adopt",
      expect.objectContaining({ credentials: "same-origin" }),
    );
  });

  it("adopts a legacy order access token from sessionStorage", async () => {
    sessionStorage.setItem(
      "prabhix_order_access",
      "abcdefghijklmnopqrstuvwxyz0123456789_-ABCDE",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    );

    await migrateLegacySecrets();

    expect(sessionStorage.getItem("prabhix_order_access")).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      "/api/shop/order/adopt",
      expect.objectContaining({ credentials: "same-origin" }),
    );
  });
});
