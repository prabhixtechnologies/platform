"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Loader2, Package } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Money } from "@/components/commerce/money";
import { ProductTypeBadge } from "@/components/commerce/product-type-badge";
import {
  clearOrderAccessToken,
  readOrderAccessToken,
} from "@/lib/commerce/cart-storage";
import { getOrder } from "@/lib/commerce/api";
import { friendlyCommerceError } from "@/lib/commerce/errors";
import type { OrderDetail } from "@/lib/commerce/schemas";

export function OrderConfirmationClient() {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = readOrderAccessToken();
    if (!token) {
      setError("No order found. If you completed a purchase, use the link from your confirmation email.");
      setLoading(false);
      return;
    }

    void getOrder(token)
      .then(setOrder)
      .catch((err) => setError(friendlyCommerceError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        Loading your order…
      </div>
    );
  }

  if (error || !order) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <p className="text-muted-foreground">{error ?? "Order not found"}</p>
        <Button href="/shop" className="mt-6">
          Back to shop
        </Button>
      </Card>
    );
  }

  const paid = order.status === "PAID" || order.status === "FULFILLED";
  const taxTotal = order.cgstMinor + order.sgstMinor + order.igstMinor;
  const digitalItems = order.items.filter((i) => i.productType === "DIGITAL");
  const physicalItems = order.items.filter((i) => i.productType === "PHYSICAL");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        {paid ? (
          <CheckCircle2 className="mx-auto size-14 text-emerald-500" aria-hidden />
        ) : (
          <Loader2 className="mx-auto size-14 animate-spin text-primary" aria-hidden />
        )}
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
          {paid ? "Thank you for your order!" : "Order received"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Order <span className="font-mono font-medium text-foreground">{order.orderNumber}</span>
          {order.customerEmail && <> — confirmation sent to {order.customerEmail}</>}
        </p>
        {!paid && (
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400" role="status">
            Payment is being processed. Refresh this page in a moment if status does not update.
          </p>
        )}
      </div>

      <Card className="space-y-4">
        <h2 className="font-semibold">Items</h2>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-muted-foreground">{item.variantName}</p>
                <ProductTypeBadge type={item.productType} className="mt-2" />
              </div>
              <div className="text-right text-sm">
                <p>Qty {item.quantity}</p>
                <p className="font-medium">
                  <Money amountMinor={item.lineSubtotalMinor} currency={order.currency} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Totals</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd><Money amountMinor={order.subtotalMinor} currency={order.currency} /></dd>
            </div>
            {order.discountMinor > 0 && (
              <div className="flex justify-between text-emerald-600">
                <dt>Discount</dt>
                <dd>−<Money amountMinor={order.discountMinor} currency={order.currency} /></dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">GST</dt>
              <dd><Money amountMinor={taxTotal} currency={order.currency} /></dd>
            </div>
            {order.cgstMinor > 0 && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <dt>CGST / SGST</dt>
                <dd>
                  <Money amountMinor={order.cgstMinor} currency={order.currency} /> /{" "}
                  <Money amountMinor={order.sgstMinor} currency={order.currency} />
                </dd>
              </div>
            )}
            {order.igstMinor > 0 && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <dt>IGST</dt>
                <dd><Money amountMinor={order.igstMinor} currency={order.currency} /></dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>
                {order.shippingMinor === 0 ? (
                  "Free"
                ) : (
                  <Money amountMinor={order.shippingMinor} currency={order.currency} />
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>Total paid</dt>
              <dd><Money amountMinor={order.totalMinor} currency={order.currency} /></dd>
            </div>
          </dl>
        </Card>

        {order.addresses.length > 0 && (
          <Card>
            <h2 className="font-semibold">Delivery details</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {order.addresses.map((addr) => (
                <li key={addr.addressType}>
                  <p className="font-medium capitalize">{addr.addressType.toLowerCase()}</p>
                  <p>{addr.name}</p>
                  <p className="text-muted-foreground">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}
                    <br />
                    {addr.city}, {addr.state} {addr.pincode}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {digitalItems.length > 0 && paid && (
        <Card className="space-y-3">
          <h2 className="flex items-center gap-2 font-semibold">
            <Download className="size-5 text-primary" aria-hidden />
            Digital downloads
          </h2>
          <p className="text-sm text-muted-foreground">
            Download links are issued separately and expire after a limited time and number of downloads.
            Check your email for secure download links, or contact{" "}
            <a href="mailto:hello@prabhixtechnologies.com" className="text-primary underline">
              hello@prabhixtechnologies.com
            </a>{" "}
            with order {order.orderNumber} if you need assistance.
          </p>
          <ul className="text-sm">
            {digitalItems.map((item) => (
              <li key={item.id} className="py-1">
                {item.productName} — {item.variantName}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {physicalItems.length > 0 && paid && (
        <Card className="flex gap-3">
          <Package className="size-5 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="font-medium">Physical shipment</p>
            <p className="text-sm text-muted-foreground">
              We will ship your items to the address above. You will receive tracking details by email when dispatched.
            </p>
          </div>
        </Card>
      )}

      {order.invoiceId && paid && (
        <Card>
          <p className="text-sm">
            Your GST invoice has been generated. A copy was sent to your email.
          </p>
        </Card>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/shop">Continue shopping</Button>
        <Button
          variant="secondary"
          onClick={() => {
            clearOrderAccessToken();
          }}
        >
          Clear saved order
        </Button>
      </div>
    </div>
  );
}
