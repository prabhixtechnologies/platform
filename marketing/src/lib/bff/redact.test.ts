import { describe, expect, it } from "vitest";
import { redactForLog } from "./redact";

describe("redactForLog", () => {
  it("redacts token and payment shaped keys", () => {
    expect(
      redactForLog({
        cartToken: "secret",
        accessToken: "secret",
        conversationToken: "jwt",
        razorpayPaymentId: "pay_123",
        nested: { claimCode: "SAVE10" },
        publicBffCredential: "secret",
        ok: true,
      }),
    ).toEqual({
      cartToken: "[redacted]",
      accessToken: "[redacted]",
      conversationToken: "[redacted]",
      razorpayPaymentId: "[redacted]",
      nested: { claimCode: "[redacted]" },
      publicBffCredential: "[redacted]",
      ok: true,
    });
  });
});
