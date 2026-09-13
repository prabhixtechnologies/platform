import { resolveVisitorId, type CheckoutPayload } from "./api";
import { CommerceApiError, type ApiErrorBody } from "./errors";
import {
  cartViewSchema,
  checkoutResponseSchema,
  orderDetailSchema,
  verifyPaymentResponseSchema,
  type CartView,
  type OrderDetail,
} from "./schemas";

async function shopFetch<T>(
  path: string,
  init: RequestInit,
  parse: (data: unknown) => T,
): Promise<T> {
  const response = await fetch(`/api/shop${path}`, {
    ...init,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    try {
      const json = (await response.json()) as ApiErrorBody;
      if (json.code && json.message) {
        throw new CommerceApiError(response.status, json);
      }
    } catch (err) {
      if (err instanceof CommerceApiError) throw err;
    }
    throw new CommerceApiError(response.status, {
      code: "UNKNOWN",
      message: response.statusText || "Request failed",
    });
  }

  if (response.status === 204) {
    return parse(null);
  }
  return parse(await response.json());
}

const cartEnvelope = (data: unknown): CartView => {
  const envelope = data as { cart?: unknown };
  return cartViewSchema.parse(envelope.cart);
};

export async function shopGetCart(): Promise<CartView | null> {
  const data = await shopFetch("/cart", { method: "GET" }, (raw) => raw as { cart: unknown });
  if (!data.cart) return null;
  return cartViewSchema.parse(data.cart);
}

export async function shopAddItem(
  variantId: string,
  quantity: number,
  visitorId?: string,
): Promise<CartView> {
  return shopFetch(
    "/cart/items",
    {
      method: "POST",
      body: JSON.stringify({
        variantId,
        quantity,
        visitorId: visitorId ?? resolveVisitorId(),
      }),
    },
    cartEnvelope,
  );
}

export async function shopUpdateItem(itemId: string, quantity: number): Promise<CartView> {
  return shopFetch(
    `/cart/items/${encodeURIComponent(itemId)}`,
    { method: "PUT", body: JSON.stringify({ quantity }) },
    cartEnvelope,
  );
}

export async function shopRemoveItem(itemId: string): Promise<CartView> {
  return shopFetch(
    `/cart/items/${encodeURIComponent(itemId)}`,
    { method: "DELETE" },
    cartEnvelope,
  );
}

export async function shopApplyCode(code: string): Promise<CartView> {
  return shopFetch(
    "/cart/discount",
    { method: "POST", body: JSON.stringify({ code }) },
    cartEnvelope,
  );
}

export async function shopClearCode(): Promise<CartView> {
  return shopFetch("/cart/discount", { method: "DELETE" }, cartEnvelope);
}

export async function shopCheckout(payload: CheckoutPayload) {
  return shopFetch(
    "/cart/checkout",
    { method: "POST", body: JSON.stringify(payload) },
    (data) => checkoutResponseSchema.parse(data),
  );
}

export async function shopVerifyPayment(body: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  return shopFetch(
    "/payments/verify",
    { method: "POST", body: JSON.stringify(body) },
    (data) => verifyPaymentResponseSchema.parse(data),
  );
}

export async function shopGetOrder(): Promise<OrderDetail> {
  return shopFetch("/order", { method: "GET" }, (data) => orderDetailSchema.parse(data));
}

export async function shopClearOrder(): Promise<void> {
  await shopFetch("/order", { method: "DELETE" }, () => undefined);
}

export async function shopClearCart(): Promise<void> {
  await shopFetch("/cart", { method: "DELETE" }, () => undefined);
}

export async function migrateLegacySecrets(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const cart = localStorage.getItem("prabhix_cart_token");
    if (cart) {
      await fetch("/api/shop/cart/adopt", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartToken: cart }),
      });
      localStorage.removeItem("prabhix_cart_token");
    }
    const order = sessionStorage.getItem("prabhix_order_access");
    if (order) {
      await fetch("/api/shop/order/adopt", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: order }),
      });
      sessionStorage.removeItem("prabhix_order_access");
    }
  } catch {
    /* next page load retries */
  }
}
