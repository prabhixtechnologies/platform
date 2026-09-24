"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { CartTotals } from "@/components/commerce/cart-totals";
import { Money } from "@/components/commerce/money";
import { useCart } from "@/components/commerce/cart-provider";
import { trapTab } from "@/lib/focus-trap";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, isLoading, error, setQuantity, removeItem, clearError } =
    useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (panelRef.current) trapTab(panelRef.current, e);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-label="Close cart"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="relative flex h-[100dvh] w-full max-w-md flex-col bg-background shadow-2xl sm:max-w-lg"
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <h2 id="cart-drawer-title" className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="size-5" aria-hidden />
            Your cart
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border"
            aria-label="Close cart drawer"
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {error && (
            <div
              className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {error}
              <button
                type="button"
                className="ml-2 underline"
                onClick={clearError}
              >
                Dismiss
              </button>
            </div>
          )}

          {isLoading && !cart && (
            <div className="space-y-3" role="status" aria-busy="true" aria-label="Loading cart">
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
            </div>
          )}

          {!isLoading && (!cart || cart.items.length === 0) && (
            <div className="py-12 text-center">
              <ShoppingBag className="mx-auto size-12 text-muted-foreground/50" aria-hidden />
              <p className="mt-4 font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse the shop and add something you like.
              </p>
              <Button href="/shop" className="mt-6" onClick={onClose}>
                Browse shop
              </Button>
            </div>
          )}

          {cart && cart.items.length > 0 && (
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.productName}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.variantName}
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      <Money
                        amountPaise={item.lineTotalPaise}
                        currency={cart.currency}
                      />
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center rounded-lg border border-border">
                      <button
                        type="button"
                        className="inline-flex size-11 items-center justify-center"
                        aria-label={`Decrease quantity of ${item.productName}`}
                        onClick={() => void setQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="size-4" aria-hidden />
                      </button>
                      <span className="min-w-[2ch] text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="inline-flex size-11 items-center justify-center"
                        aria-label={`Increase quantity of ${item.productName}`}
                        onClick={() => void setQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="size-4" aria-hidden />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${item.productName}`}
                      onClick={() => void removeItem(item.id)}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <footer className="border-t border-border px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <CartTotals cart={cart} className="mb-4 space-y-2 text-sm" />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button href="/shop/cart" variant="secondary" className="flex-1" onClick={onClose}>
                View cart
              </Button>
              <Button href="/shop/checkout" className="flex-1" onClick={onClose}>
                Checkout
              </Button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export function CartButton() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative inline-flex size-11 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
        aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      >
        <ShoppingBag className="size-5" aria-hidden />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={close} />
    </>
  );
}
