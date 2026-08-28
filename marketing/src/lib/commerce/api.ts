import { getApiBaseUrl } from "@/lib/api-url";
import { siteConfig } from "@/lib/site-config";
import { CommerceApiError, type ApiErrorBody } from "./errors";
import {
  cartViewSchema,
  checkoutResponseSchema,
  createCartResponseSchema,
  cursorPageSchema,
  downloadLinkResponseSchema,
  orderDetailSchema,
  productDetailSchema,
  productSummarySchema,
  verifyPaymentResponseSchema,
  type CartView,
  type OrderDetail,
  type ProductDetail,
  type ProductSummary,
} from "./schemas";

function orgBase(): string {
  const slug = siteConfig.orgSlug;
  if (!slug) {
    throw new CommerceApiError(503, {
      code: "STORE_NOT_CONFIGURED",
      message: "The shop is not configured yet.",
    });
  }
  return `${getApiBaseUrl()}/v1/commerce/public/${encodeURIComponent(slug)}`;
}

async function parseError(response: Response): Promise<CommerceApiError> {
  try {
    const json = (await response.json()) as ApiErrorBody;
    if (json.code && json.message) {
      return new CommerceApiError(response.status, json);
    }
  } catch {
    /* fall through */
  }
  return new CommerceApiError(response.status, {
    code: "UNKNOWN",
    message: response.statusText || "Request failed",
  });
}

async function commerceFetch<T>(
  path: string,
  init: RequestInit,
  parse: (data: unknown) => T,
): Promise<T> {
  const response = await fetch(`${orgBase()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return parse(null);
  }

  const json: unknown = await response.json();
  return parse(json);
}

export async function listProducts(params?: {
  cursor?: string;
  limit?: number;
}): Promise<{ items: ProductSummary[]; nextCursor: string | null; hasMore: boolean }> {
  const qs = new URLSearchParams();
  if (params?.cursor) qs.set("cursor", params.cursor);
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return commerceFetch(
    `/products${query ? `?${query}` : ""}`,
    { method: "GET" },
    (data) => cursorPageSchema(productSummarySchema).parse(data),
  );
}

export async function getProduct(slug: string): Promise<ProductDetail> {
  return commerceFetch(
    `/products/${encodeURIComponent(slug)}`,
    { method: "GET" },
    (data) => productDetailSchema.parse(data),
  );
}

export async function createCart(visitorId?: string): Promise<{
  cartToken: string;
  cart: CartView;
}> {
  const qs = visitorId ? `?visitorId=${encodeURIComponent(visitorId)}` : "";
  return commerceFetch(
    `/carts${qs}`,
    { method: "POST" },
    (data) => createCartResponseSchema.parse(data),
  );
}

export async function getCart(cartToken: string): Promise<CartView> {
  return commerceFetch(
    `/carts/${encodeURIComponent(cartToken)}`,
    { method: "GET" },
    (data) => cartViewSchema.parse(data),
  );
}

export async function addCartItem(
  cartToken: string,
  variantId: string,
  quantity: number,
): Promise<CartView> {
  return commerceFetch(
    `/carts/${encodeURIComponent(cartToken)}/items`,
    { method: "POST", body: JSON.stringify({ variantId, quantity }) },
    (data) => cartViewSchema.parse(data),
  );
}

export async function updateCartItem(
  cartToken: string,
  itemId: string,
  quantity: number,
): Promise<CartView> {
  return commerceFetch(
    `/carts/${encodeURIComponent(cartToken)}/items/${itemId}`,
    { method: "PUT", body: JSON.stringify({ quantity }) },
    (data) => cartViewSchema.parse(data),
  );
}

export async function removeCartItem(
  cartToken: string,
  itemId: string,
): Promise<CartView> {
  return commerceFetch(
    `/carts/${encodeURIComponent(cartToken)}/items/${itemId}`,
    { method: "DELETE" },
    (data) => cartViewSchema.parse(data),
  );
}

export async function applyDiscount(
  cartToken: string,
  code: string,
): Promise<CartView> {
  return commerceFetch(
    `/carts/${encodeURIComponent(cartToken)}/discount`,
    { method: "POST", body: JSON.stringify({ code }) },
    (data) => cartViewSchema.parse(data),
  );
}

export async function clearDiscount(cartToken: string): Promise<CartView> {
  return commerceFetch(
    `/carts/${encodeURIComponent(cartToken)}/discount`,
    { method: "DELETE" },
    (data) => cartViewSchema.parse(data),
  );
}

export type CheckoutPayload = {
  email: string;
  name?: string;
  phone?: string;
  marketingConsent: boolean;
  visitorId?: string;
  billingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string;
  };
  shippingAddress?: CheckoutPayload["billingAddress"];
};

export async function startCheckout(cartToken: string, payload: CheckoutPayload) {
  return commerceFetch(
    `/carts/${encodeURIComponent(cartToken)}/checkout`,
    { method: "POST", body: JSON.stringify(payload) },
    (data) => checkoutResponseSchema.parse(data),
  );
}

export async function verifyPayment(body: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  return commerceFetch(
    "/payments/verify",
    { method: "POST", body: JSON.stringify(body) },
    (data) => verifyPaymentResponseSchema.parse(data),
  );
}

export async function getOrder(accessToken: string): Promise<OrderDetail> {
  return commerceFetch(
    `/orders/${encodeURIComponent(accessToken)}`,
    { method: "GET" },
    (data) => orderDetailSchema.parse(data),
  );
}

export async function issueDownload(downloadToken: string) {
  return commerceFetch(
    `/downloads/${encodeURIComponent(downloadToken)}`,
    { method: "GET" },
    (data) => downloadLinkResponseSchema.parse(data),
  );
}

/** Resolve visitor UUID when the key is a valid UUID (optional cart linkage). */
export function resolveVisitorId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const key = window.prabhixTracker?.getVisitorKey?.() ?? null;
  if (!key) return undefined;
  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRe.test(key) ? key : undefined;
}
