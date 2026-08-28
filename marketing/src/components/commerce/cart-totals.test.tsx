import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CartTotals } from "@/components/commerce/cart-totals";
import type { CartView } from "@/lib/commerce/schemas";

describe("CartTotals", () => {
  it("displays subtotal, tax, and total from the server payload without client-side recomputation", () => {
    const cart: CartView = {
      cartToken: "tok",
      currency: "INR",
      items: [
        {
          id: "item-1",
          variantId: "var-1",
          productName: "Widget",
          variantName: "Standard",
          sku: "W-1",
          quantity: 2,
          unitPriceMinor: 4000,
          lineTotalMinor: 99999,
        },
      ],
      subtotalMinor: 8000,
      discountMinor: 0,
      taxMinor: 1440,
      shippingMinor: 0,
      totalMinor: 9440,
      expiresAt: "2026-12-31T00:00:00Z",
    };

    render(<CartTotals cart={cart} />);

    expect(screen.getByText("₹80.00")).toBeInTheDocument();
    expect(screen.getByText("₹14.40")).toBeInTheDocument();
    expect(screen.getByText("₹94.40")).toBeInTheDocument();
    expect(screen.queryByText("₹999.99")).not.toBeInTheDocument();
  });

  it("shows discount and shipping amounts from the server", () => {
    const cart: CartView = {
      cartToken: "tok",
      currency: "INR",
      items: [],
      subtotalMinor: 10000,
      discountMinor: 1000,
      taxMinor: 1620,
      shippingMinor: 500,
      totalMinor: 11120,
      discountCode: "SAVE10",
      expiresAt: "2026-12-31T00:00:00Z",
    };

    render(<CartTotals cart={cart} />);

    expect(screen.getByText(/Discount \(SAVE10\)/)).toBeInTheDocument();
    expect(screen.getByText("₹10.00")).toBeInTheDocument();
    expect(screen.getByText("₹5.00")).toBeInTheDocument();
    expect(screen.getByText("₹111.20")).toBeInTheDocument();
  });
});
