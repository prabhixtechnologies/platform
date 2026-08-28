"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CartTotals } from "@/components/commerce/cart-totals";
import { useCart } from "@/components/commerce/cart-provider";
import {
  resolveVisitorId,
  startCheckout,
  verifyPayment,
} from "@/lib/commerce/api";
import {
  clearCartToken,
  clearPendingCheckout,
  readPendingCheckout,
  writeOrderAccessToken,
  writePendingCheckout,
} from "@/lib/commerce/cart-storage";
import { INDIAN_STATES } from "@/lib/commerce/constants";
import { friendlyCommerceError } from "@/lib/commerce/errors";
import { openRazorpayCheckout } from "@/lib/commerce/razorpay";
import { allowsAnalytics } from "@/lib/visitor/consent";
import { readUiConsent } from "@/lib/visitor/consent";
import { trackEvent } from "@/lib/visitor/tracker";

type AddressForm = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

const emptyAddress = (): AddressForm => ({
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "Karnataka",
  pincode: "",
  phone: "",
});

type PaymentPhase =
  | "idle"
  | "creating_order"
  | "awaiting_payment"
  | "verifying"
  | "cancelled"
  | "failed"
  | "network_error";

export function CheckoutClient() {
  const router = useRouter();
  const { cart, hasPhysical, refresh } = useCart();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [billing, setBilling] = useState<AddressForm>(emptyAddress);
  const [shipping, setShipping] = useState<AddressForm>(emptyAddress);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [phase, setPhase] = useState<PaymentPhase>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const submittingRef = useRef(false);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }
    if (!billing.name.trim()) errors.billingName = "Billing name is required";
    if (!billing.line1.trim()) errors.billingLine1 = "Address line is required";
    if (!billing.city.trim()) errors.billingCity = "City is required";
    if (!billing.state.trim()) errors.billingState = "State is required";
    if (!/^\d{6}$/.test(billing.pincode.trim())) {
      errors.billingPincode = "Enter a valid 6-digit PIN code";
    }
    if (hasPhysical && !sameAsBilling) {
      if (!shipping.name.trim()) errors.shippingName = "Shipping name is required";
      if (!shipping.line1.trim()) errors.shippingLine1 = "Shipping address is required";
      if (!shipping.city.trim()) errors.shippingCity = "City is required";
      if (!/^\d{6}$/.test(shipping.pincode.trim())) {
        errors.shippingPincode = "Enter a valid 6-digit PIN code";
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, billing, shipping, hasPhysical, sameAsBilling]);

  const runPayment = useCallback(
    async (checkout: ReturnType<typeof readPendingCheckout> extends infer T ? NonNullable<T> : never) => {
      setPhase("awaiting_payment");
      setStatusMessage("Complete payment in the Razorpay window. Do not close this page until finished.");

      const result = await openRazorpayCheckout({
        key: checkout.razorpayKeyId,
        amount: checkout.totalMinor,
        currency: checkout.currency,
        name: "Prabhix Technologies",
        description: `Order ${checkout.orderNumber}`,
        order_id: checkout.razorpayOrderId,
        prefill: { name, email, contact: phone || undefined },
        theme: { color: "#7c3aed" },
      });

      if (result.status === "dismissed") {
        setPhase("cancelled");
        setStatusMessage(
          "Payment cancelled — you were not charged. Your order is pending; you can retry payment or contact support with order " +
            checkout.orderNumber,
        );
        return;
      }

      if (result.status === "failed") {
        setPhase("failed");
        setStatusMessage(
          `Payment failed: ${result.message}. You were not charged. You may retry checkout.`,
        );
        clearPendingCheckout();
        submittingRef.current = false;
        return;
      }

      setPhase("verifying");
      setStatusMessage("Confirming payment — please wait…");

      try {
        await verifyPayment({
          razorpayOrderId: result.orderId,
          razorpayPaymentId: result.paymentId,
          razorpaySignature: result.signature,
        });
      } catch (err) {
        setPhase("network_error");
        setStatusMessage(
          `${friendlyCommerceError(err)} If money was deducted, save your payment ID and contact support with order ${checkout.orderNumber}.`,
        );
        submittingRef.current = false;
        return;
      }

      clearPendingCheckout();
      clearCartToken();
      writeOrderAccessToken(checkout.accessToken);

      if (allowsAnalytics(readUiConsent())) {
        trackEvent("commerce_purchase", {
          orderNumber: checkout.orderNumber,
          totalMinor: checkout.totalMinor,
        });
      }

      router.replace("/shop/order");
    },
    [email, name, phone, router],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!cart || cart.items.length === 0) {
      setStatusMessage("Your cart is empty.");
      return;
    }
    if (!validate()) return;

    const pending = readPendingCheckout();
    if (pending && Date.now() - pending.createdAt < 30 * 60_000) {
      submittingRef.current = true;
      await runPayment(pending);
      return;
    }

    submittingRef.current = true;
    setPhase("creating_order");
    setStatusMessage(null);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("prabhix_cart_token")
          : null;
      if (!token) throw new Error("Cart not found");

      const payload = {
        email: email.trim(),
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        marketingConsent,
        visitorId: resolveVisitorId(),
        billingAddress: {
          name: billing.name.trim(),
          line1: billing.line1.trim(),
          line2: billing.line2.trim() || undefined,
          city: billing.city.trim(),
          state: billing.state,
          pincode: billing.pincode.trim(),
          phone: billing.phone.trim() || phone.trim() || undefined,
        },
        shippingAddress:
          hasPhysical && !sameAsBilling
            ? {
                name: shipping.name.trim(),
                line1: shipping.line1.trim(),
                line2: shipping.line2.trim() || undefined,
                city: shipping.city.trim(),
                state: shipping.state,
                pincode: shipping.pincode.trim(),
                phone: shipping.phone.trim() || phone.trim() || undefined,
              }
            : undefined,
      };

      const checkout = await startCheckout(token, payload);
      const pendingCheckout = {
        razorpayOrderId: checkout.razorpayOrderId,
        accessToken: checkout.accessToken,
        orderNumber: checkout.orderNumber,
        orderId: checkout.orderId,
        totalMinor: checkout.totalMinor,
        currency: checkout.currency,
        razorpayKeyId: checkout.razorpayKeyId,
        createdAt: Date.now(),
      };
      writePendingCheckout(pendingCheckout);
      await runPayment(pendingCheckout);
    } catch (err) {
      setPhase("failed");
      setStatusMessage(friendlyCommerceError(err));
      submittingRef.current = false;
    }
  };

  if (!cart) {
    return (
      <Card>
        <p className="text-muted-foreground">Loading checkout…</p>
      </Card>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Card className="text-center">
        <p className="font-medium">Your cart is empty</p>
        <Button href="/shop" className="mt-4">
          Continue shopping
        </Button>
      </Card>
    );
  }

  const busy =
    phase === "creating_order" ||
    phase === "awaiting_payment" ||
    phase === "verifying";

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">Email *</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 py-2.5"
              />
              {fieldErrors.email && (
                <span className="text-xs text-destructive">{fieldErrors.email}</span>
              )}
            </label>
            <label className="block text-sm">
              <span className="font-medium">Full name</span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 py-2.5"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Phone</span>
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 py-2.5"
              />
            </label>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-1 size-4 accent-primary"
            />
            Send me product updates and offers
          </label>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Billing address</h2>
          <AddressFields
            value={billing}
            onChange={setBilling}
            prefix="billing"
            errors={fieldErrors}
          />
        </Card>

        {hasPhysical && (
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">Shipping address</h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={(e) => setSameAsBilling(e.target.checked)}
                className="size-4 accent-primary"
              />
              Same as billing address
            </label>
            {!sameAsBilling && (
              <AddressFields
                value={shipping}
                onChange={setShipping}
                prefix="shipping"
                errors={fieldErrors}
              />
            )}
          </Card>
        )}

        {statusMessage && (
          <div
            role="status"
            className={`rounded-xl border px-4 py-3 text-sm ${
              phase === "cancelled" || phase === "failed" || phase === "network_error"
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-border bg-surface"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={busy}
        >
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {phase === "verifying"
                ? "Confirming payment…"
                : phase === "awaiting_payment"
                  ? "Waiting for payment…"
                  : "Preparing checkout…"}
            </>
          ) : (
            `Pay securely — ₹${(cart.totalMinor / 100).toFixed(2)}`
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          You will only be charged once Razorpay confirms payment. Closing the payment window cancels the attempt without charging your card.
        </p>
      </div>

      <aside className="lg:col-span-2">
        <Card className="space-y-4 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="divide-y divide-border text-sm">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 py-2">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span className="tabular-nums">
                  ₹{(item.lineTotalMinor / 100).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <CartTotals cart={cart} />
        </Card>
      </aside>
    </form>
  );
}

function AddressFields({
  value,
  onChange,
  prefix,
  errors,
}: {
  value: AddressForm;
  onChange: (v: AddressForm) => void;
  prefix: string;
  errors: Record<string, string>;
}) {
  const set = (key: keyof AddressForm, v: string) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm sm:col-span-2">
        <span className="font-medium">Name *</span>
        <input
          value={value.name}
          onChange={(e) => set("name", e.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 py-2.5"
        />
        {errors[`${prefix}Name`] && (
          <span className="text-xs text-destructive">{errors[`${prefix}Name`]}</span>
        )}
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="font-medium">Address line 1 *</span>
        <input
          value={value.line1}
          onChange={(e) => set("line1", e.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 py-2.5"
        />
        {errors[`${prefix}Line1`] && (
          <span className="text-xs text-destructive">{errors[`${prefix}Line1`]}</span>
        )}
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="font-medium">Address line 2</span>
        <input
          value={value.line2}
          onChange={(e) => set("line2", e.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">City *</span>
        <input
          value={value.city}
          onChange={(e) => set("city", e.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">State *</span>
        <select
          value={value.state}
          onChange={(e) => set("state", e.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 py-2.5"
        >
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="font-medium">PIN code *</span>
        <input
          inputMode="numeric"
          maxLength={6}
          value={value.pincode}
          onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
          className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 py-2.5"
        />
        {errors[`${prefix}Pincode`] && (
          <span className="text-xs text-destructive">{errors[`${prefix}Pincode`]}</span>
        )}
      </label>
      <label className="block text-sm">
        <span className="font-medium">Phone</span>
        <input
          type="tel"
          value={value.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 py-2.5"
        />
      </label>
    </div>
  );
}
