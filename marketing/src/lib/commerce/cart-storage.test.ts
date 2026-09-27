import { afterEach, describe, expect, it } from "vitest";
import {
  clearPendingCheckout,
  readPendingCheckout,
  writePendingCheckout,
} from "./cart-storage";

describe("pending checkout (abandoned payment resume)", () => {
  afterEach(() => {
    clearPendingCheckout();
  });

  it("stores Razorpay resume metadata without order access tokens", () => {
    writePendingCheckout({
      razorpayOrderId: "order_xyz",
      orderNumber: "PX-1001",
      orderId: "11111111-1111-4111-8111-111111111111",
      totalPaise: 49900,
      currency: "INR",
      razorpayKeyId: "rzp_test",
      createdAt: Date.now(),
    });

    const pending = readPendingCheckout();
    expect(pending?.razorpayOrderId).toBe("order_xyz");
    expect(pending?.orderNumber).toBe("PX-1001");
    const raw = sessionStorage.getItem("prabhix_pending_checkout");
    expect(raw).not.toMatch(/accessToken|cartToken/i);
  });
});
