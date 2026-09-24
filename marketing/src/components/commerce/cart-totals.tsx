"use client";

import { Money } from "@/components/commerce/money";
import type { CartView } from "@/lib/commerce/schemas";

interface CartTotalsProps {
  cart: CartView;
  className?: string;
}

export function CartTotals({ cart, className }: CartTotalsProps) {
  return (
    // The GST note is a caveat about the figures, not a term or a definition, so it sits beside the
    // <dl> rather than inside it: a <dl> may only contain <dt>/<dd> pairs and the <div>s grouping
    // them, and one stray <p> invalidates the whole list for a screen reader.
    <div className={className ?? "space-y-2 text-sm"}>
      <dl className="space-y-2">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>
            <Money amountPaise={cart.subtotalPaise} currency={cart.currency} />
          </dd>
        </div>
        {cart.discountPaise > 0 && (
          <div className="flex justify-between gap-4 text-emerald-600 dark:text-emerald-400">
            <dt>
              Discount{cart.discountCode ? ` (${cart.discountCode})` : ""}
            </dt>
            <dd>
              −<Money amountPaise={cart.discountPaise} currency={cart.currency} />
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">GST</dt>
          <dd>
            <Money amountPaise={cart.taxPaise} currency={cart.currency} />
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd>
            {cart.shippingPaise === 0 ? (
              "Free"
            ) : (
              <Money amountPaise={cart.shippingPaise} currency={cart.currency} />
            )}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>
            <Money amountPaise={cart.totalPaise} currency={cart.currency} />
          </dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">
        Prices include applicable GST. Final tax split shown on your invoice.
      </p>
    </div>
  );
}
