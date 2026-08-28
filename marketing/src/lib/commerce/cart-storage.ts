import type { ProductType } from "./schemas";

const CART_TOKEN_KEY = "prabhix_cart_token";
const VARIANT_META_KEY = "prabhix_cart_variant_meta";
const ACCESS_TOKEN_KEY = "prabhix_order_access";
const PENDING_CHECKOUT_KEY = "prabhix_pending_checkout";

export type VariantMeta = Record<string, { productType: ProductType; slug: string }>;

export type PendingCheckout = {
  razorpayOrderId: string;
  accessToken: string;
  orderNumber: string;
  orderId: string;
  totalMinor: number;
  currency: string;
  razorpayKeyId: string;
  createdAt: number;
};

function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* quota */
  }
}

function safeRemove(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function readCartToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(CART_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function writeCartToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearCartToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_TOKEN_KEY);
    sessionStorage.removeItem(VARIANT_META_KEY);
  } catch {
    /* ignore */
  }
}

export function readVariantMeta(): VariantMeta {
  if (typeof window === "undefined") return {};
  const raw = safeGet(VARIANT_META_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as VariantMeta;
  } catch {
    return {};
  }
}

export function writeVariantMeta(meta: VariantMeta): void {
  if (typeof window === "undefined") return;
  safeSet(VARIANT_META_KEY, JSON.stringify(meta));
}

export function rememberVariant(
  variantId: string,
  productType: ProductType,
  slug: string,
): void {
  const meta = readVariantMeta();
  meta[variantId] = { productType, slug };
  writeVariantMeta(meta);
}

export function cartHasPhysical(meta: VariantMeta, variantIds: string[]): boolean {
  return variantIds.some((id) => meta[id]?.productType === "PHYSICAL");
}

export function writeOrderAccessToken(token: string): void {
  safeSet(ACCESS_TOKEN_KEY, token);
}

export function readOrderAccessToken(): string | null {
  return safeGet(ACCESS_TOKEN_KEY);
}

export function clearOrderAccessToken(): void {
  safeRemove(ACCESS_TOKEN_KEY);
}

export function writePendingCheckout(checkout: PendingCheckout): void {
  safeSet(PENDING_CHECKOUT_KEY, JSON.stringify(checkout));
}

export function readPendingCheckout(): PendingCheckout | null {
  const raw = safeGet(PENDING_CHECKOUT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingCheckout;
  } catch {
    return null;
  }
}

export function clearPendingCheckout(): void {
  safeRemove(PENDING_CHECKOUT_KEY);
}
