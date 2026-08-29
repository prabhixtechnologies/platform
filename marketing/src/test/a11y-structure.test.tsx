import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/Button";
import { CartTotals } from "@/components/commerce/cart-totals";
import { StatBand } from "@/components/stat-band";
import type { CartView } from "@/lib/commerce/schemas";

// A <dl> whose <dt>/<dd> pairs are buried under two wrapper elements, or which carries a stray <p>,
// still looks correct on screen — the grid renders, the numbers line up, nothing throws. It is only
// broken in the accessibility tree, so it survived review and shipped, and was caught by running
// Lighthouse against production by hand. These rules are the machine-checkable part of that.
const STRUCTURE_RULES = [
  "definition-list",
  "dlitem",
  "list",
  "listitem",
  "link-name",
  "button-name",
  "aria-required-children",
  "aria-required-parent",
];

async function structuralViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    runOnly: { type: "rule", values: STRUCTURE_RULES },
  });
  return results.violations.map((violation) => ({
    rule: violation.id,
    help: violation.help,
    html: violation.nodes.map((node) => node.html),
  }));
}

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

describe("structural accessibility", () => {
  it("renders the stat band as a real definition list", async () => {
    const { container } = render(
      <StatBand
        stats={[
          { value: "99.9%", label: "Uptime" },
          { value: "24/7", label: "Support" },
        ]}
      />,
    );

    expect(await structuralViolations(container)).toEqual([]);
  });

  it("renders cart totals as a definition list containing only terms and definitions", async () => {
    const { container } = render(<CartTotals cart={cart} />);

    expect(await structuralViolations(container)).toEqual([]);
  });

  it("tells assistive technology when a link opens a new tab", () => {
    const { getByRole } = render(
      <Button href="https://example.com" external>
        Sign in to MobiStack
      </Button>,
    );

    // Matched loosely on whitespace: name computation joins inline children without inserting a
    // separator, and how much of the leading space survives differs between implementations. What
    // matters is that the warning is part of the name and the visible label still starts it.
    expect(
      getByRole("link", { name: /^Sign in to MobiStack\s*\(opens in a new tab\)$/ }),
    ).toBeInTheDocument();
  });
});
