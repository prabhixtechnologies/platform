"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Clock,
  Loader2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Money } from "@/components/commerce/money";
import { ProductTypeBadge } from "@/components/commerce/product-type-badge";
import { useCart } from "@/components/commerce/cart-provider";
import {
  PRODUCT_TYPE_DESCRIPTIONS,
  PRODUCT_TYPE_ICONS,
} from "@/lib/commerce/constants";
import type { ProductDetail, VariantView } from "@/lib/commerce/schemas";
import { allowsAnalytics } from "@/lib/visitor/consent";
import { readUiConsent } from "@/lib/visitor/consent";
import { trackEvent } from "@/lib/visitor/tracker";

function intervalLabel(interval?: string | null): string {
  if (interval === "MONTHLY") return "/ month";
  if (interval === "ANNUAL") return "/ year";
  return "";
}

function TypeHighlights({ product }: { product: ProductDetail }) {
  const Icon = PRODUCT_TYPE_ICONS[product.productType];
  const variant = product.variants.find((v) => v.active) ?? product.variants[0];

  if (product.productType === "PHYSICAL") {
    return (
      <Card className="flex gap-3">
        <Truck className="size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="font-medium">Ships across India</p>
          <p className="text-sm text-muted-foreground">
            {variant?.deliverySlaDays
              ? `Estimated delivery in ${variant.deliverySlaDays} business days after fulfilment.`
              : "Delivery timeline confirmed after order processing."}
          </p>
        </div>
      </Card>
    );
  }

  if (product.productType === "DIGITAL") {
    return (
      <Card className="flex gap-3">
        <Icon className="size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="font-medium">Instant digital delivery</p>
          <p className="text-sm text-muted-foreground">
            Download links are issued after successful payment. Links expire — check your order confirmation for details.
          </p>
        </div>
      </Card>
    );
  }

  if (product.productType === "SERVICE") {
    return (
      <Card className="flex gap-3">
        <Clock className="size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="font-medium">Professional service delivery</p>
          <p className="text-sm text-muted-foreground">
            {variant?.serviceDurationDays
              ? `Typical engagement: ${variant.serviceDurationDays} days. Our team contacts you within 1 business day.`
              : "Our team will contact you within 1 business day to schedule delivery."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex gap-3">
      <Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <div>
        <p className="font-medium">Flexible subscription</p>
        <p className="text-sm text-muted-foreground">
          Billed {variant?.billingInterval === "ANNUAL" ? "annually" : "monthly"}.
          Manage or cancel from your account portal after purchase.
        </p>
      </div>
    </Card>
  );
}

function stockLabel(variant: VariantView): string | null {
  if (!variant.trackInventory) return null;
  if (variant.stockAvailable == null || variant.stockAvailable <= 0) {
    return "Out of stock";
  }
  if (variant.stockAvailable <= 5) {
    return `Only ${variant.stockAvailable} left`;
  }
  return "In stock";
}

interface ProductPurchasePanelProps {
  product: ProductDetail;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const activeVariants = useMemo(
    () => product.variants.filter((v) => v.active),
    [product.variants],
  );
  const [selectedId, setSelectedId] = useState(activeVariants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selected = activeVariants.find((v) => v.id === selectedId) ?? activeVariants[0];
  const outOfStock =
    selected?.trackInventory &&
    (selected.stockAvailable == null || selected.stockAvailable <= 0);

  const ctaLabel = useMemo(() => {
    switch (product.productType) {
      case "SUBSCRIPTION":
        return "Subscribe now";
      case "DIGITAL":
        return "Buy & download";
      case "SERVICE":
        return "Book service";
      default:
        return "Add to cart";
    }
  }, [product.productType]);

  async function handleAdd() {
    if (!selected || outOfStock) return;
    setBusy(true);
    setMessage(null);
    try {
      await addItem(selected.id, quantity, {
        productType: product.productType,
        slug: product.slug,
        productName: product.name,
      });
      if (allowsAnalytics(readUiConsent())) {
        trackEvent("commerce_view_product", {
          slug: product.slug,
          action: "add_to_cart",
        });
      }
      setMessage("Added to cart");
    } catch {
      /* error surfaced by cart provider */
    } finally {
      setBusy(false);
    }
  }

  if (activeVariants.length === 0) {
    return (
      <Card>
        <p className="text-muted-foreground">This product is not available for purchase right now.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-6">
      <div>
        <ProductTypeBadge type={product.productType} />
        <p className="mt-3 text-sm text-muted-foreground">
          {PRODUCT_TYPE_DESCRIPTIONS[product.productType]}
        </p>
      </div>

      {activeVariants.length > 1 && (
        <fieldset>
          <legend className="text-sm font-medium">
            {product.productType === "SUBSCRIPTION" ? "Choose plan" : "Choose option"}
          </legend>
          <div className="mt-2 grid gap-2">
            {activeVariants.map((variant) => {
              const stock = stockLabel(variant);
              const disabled =
                variant.trackInventory &&
                (variant.stockAvailable == null || variant.stockAvailable <= 0);
              return (
                <label
                  key={variant.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    selected?.id === variant.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  } ${disabled ? "opacity-50" : ""}`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="variant"
                      value={variant.id}
                      checked={selected?.id === variant.id}
                      disabled={disabled}
                      onChange={() => setSelectedId(variant.id)}
                      className="size-4 accent-primary"
                    />
                    <span>
                      <span className="font-medium">{variant.name}</span>
                      {stock && (
                        <span className="ml-2 text-xs text-muted-foreground">{stock}</span>
                      )}
                    </span>
                  </span>
                  <Money
                    amountMinor={variant.priceMinor}
                    currency={variant.currency}
                    compareAtMinor={variant.compareAtPriceMinor}
                  />
                  {product.productType === "SUBSCRIPTION" && (
                    <span className="text-xs text-muted-foreground">
                      {intervalLabel(variant.billingInterval)}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {selected && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">
              <Money
                amountMinor={selected.priceMinor}
                currency={selected.currency}
                compareAtMinor={selected.compareAtPriceMinor}
              />
              {product.productType === "SUBSCRIPTION" && (
                <span className="text-base font-normal text-muted-foreground">
                  {intervalLabel(selected.billingInterval)}
                </span>
              )}
            </p>
            {stockLabel(selected) && (
              <p className="mt-1 text-sm text-muted-foreground">{stockLabel(selected)}</p>
            )}
          </div>

          {product.productType === "PHYSICAL" && (
            <label className="text-sm">
              <span className="mb-1 block font-medium">Quantity</span>
              <input
                type="number"
                min={1}
                max={selected.trackInventory ? selected.stockAvailable ?? 99 : 99}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="min-h-11 w-20 rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                aria-label="Quantity"
              />
            </label>
          )}
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        disabled={busy || outOfStock || !selected}
        data-testid="shop-add-to-cart"
        onClick={() => void handleAdd()}
      >
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Adding…
          </>
        ) : outOfStock ? (
          "Out of stock"
        ) : (
          ctaLabel
        )}
      </Button>

      {message && (
        <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400" role="status">
          <Check className="size-4" aria-hidden />
          {message}
        </p>
      )}

      <ul className="space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden />
          Secure checkout via Razorpay
        </li>
        <li className="flex items-center gap-2">
          <Check className="size-4 shrink-0 text-primary" aria-hidden />
          GST-compliant invoice included
        </li>
      </ul>
    </Card>
  );
}

export function ProductTypeSection({ product }: { product: ProductDetail }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TypeHighlights product={product} />
      {product.hsnCode && (
        <Card>
          <p className="text-sm">
            <span className="font-medium">HSN:</span> {product.hsnCode}
          </p>
        </Card>
      )}
    </div>
  );
}
