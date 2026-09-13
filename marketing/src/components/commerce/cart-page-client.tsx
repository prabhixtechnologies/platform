"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CartTotals } from "@/components/commerce/cart-totals";
import { Money } from "@/components/commerce/money";
import { useCart } from "@/components/commerce/cart-provider";

export function CartPageClient() {
  const {
    cart,
    isLoading,
    error,
    variantMeta,
    setQuantity,
    removeItem,
    applyCode,
    removeCode,
    clearError,
  } = useCart();
  const [code, setCode] = useState("");
  const [codeBusy, setCodeBusy] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  async function handleApplyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setCodeBusy(true);
    setCodeError(null);
    try {
      await applyCode(code);
      setCode("");
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setCodeBusy(false);
    }
  }

  if (isLoading && !cart) {
    return (
      <div className="space-y-3" role="status" aria-busy="true" aria-label="Loading cart">
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <Button href="/shop" className="mt-6">
          Browse the shop
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {error && (
          <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
            {error}
            <button type="button" className="ml-2 underline" onClick={clearError}>
              Dismiss
            </button>
          </div>
        )}

        <ul className="space-y-3">
          {cart.items.map((item) => (
            <li key={item.id}>
              <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1 min-w-0">
                  <Link
                    href={variantMeta[item.variantId]?.slug ? `/shop/${variantMeta[item.variantId].slug}` : "/shop"}
                    className="font-medium hover:text-primary"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.variantName}</p>
                  <p className="mt-1 text-sm">
                    <Money amountMinor={item.unitPriceMinor} currency={cart.currency} /> each
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      type="button"
                      className="inline-flex size-11 items-center justify-center"
                      aria-label="Decrease quantity"
                      onClick={() => void setQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="size-4" aria-hidden />
                    </button>
                    <span className="min-w-[2ch] text-center tabular-nums">{item.quantity}</span>
                    <button
                      type="button"
                      className="inline-flex size-11 items-center justify-center"
                      aria-label="Increase quantity"
                      onClick={() => void setQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="size-4" aria-hidden />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      <Money amountMinor={item.lineTotalMinor} currency={cart.currency} />
                    </p>
                    <button
                      type="button"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => void removeItem(item.id)}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Remove
                    </button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <Card>
          <form onSubmit={(e) => void handleApplyCode(e)} className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1 text-sm">
              <span className="font-medium">Discount code</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="mt-1 min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2 uppercase text-foreground"
                aria-describedby={codeError ? "code-error" : undefined}
              />
            </label>
            <Button type="submit" variant="secondary" disabled={codeBusy} className="sm:self-end">
              {codeBusy ? "Applying…" : "Apply"}
            </Button>
          </form>
          {codeError && (
            <p id="code-error" className="mt-2 text-sm text-destructive" role="alert">
              {codeError}
            </p>
          )}
          {cart.discountCode && (
            <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
              Code <strong>{cart.discountCode}</strong> applied.{" "}
              <button type="button" className="underline" onClick={() => void removeCode()}>
                Remove
              </button>
            </p>
          )}
        </Card>
      </div>

      <aside>
        <Card className="space-y-4 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Summary</h2>
          <CartTotals cart={cart} />
          <Button href="/shop/checkout" size="lg" className="w-full">
            Proceed to checkout
          </Button>
          <Button href="/shop" variant="secondary" className="w-full">
            Continue shopping
          </Button>
        </Card>
      </aside>
    </div>
  );
}
