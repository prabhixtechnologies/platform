"use client";

import { Money } from "@/components/commerce/money";
import type { CartView } from "@/lib/commerce/schemas";

interface CartTotalsProps {
  cart: CartView;
  className?: string;
}

export function CartTotals({ cart, className }: CartTotalsProps) {
  return (
    <dl className={className ?? "space-y-2 text-sm"}>
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd>
          <Money amountMinor={cart.subtotalMinor} currency={cart.currency} />
        </dd>
      </div>
      {cart.discountMinor > 0 && (
        <div className="flex justify-between gap-4 text-emerald-600 dark:text-emerald-400">
          <dt>
            Discount{cart.discountCode ? ` (${cart.discountCode})` : ""}
          </dt>
          <dd>
            −<Money amountMinor={cart.discountMinor} currency={cart.currency} />
          </dd>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">GST</dt>
        <dd>
          <Money amountMinor={cart.taxMinor} currency={cart.currency} />
        </dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">Shipping</dt>
        <dd>
          {cart.shippingMinor === 0 ? (
            "Free"
          ) : (
            <Money amountMinor={cart.shippingMinor} currency={cart.currency} />
          )}
        </dd>
      </div>
      <div className="flex justify-between gap-4 border-t border-border pt-2 text-base font-semibold">
        <dt>Total</dt>
        <dd>
          <Money amountMinor={cart.totalMinor} currency={cart.currency} />
        </dd>
      </div>
      <p className="text-xs text-muted-foreground">
        Prices include applicable GST. Final tax split shown on your invoice.
      </p>
    </dl>
  );
}
