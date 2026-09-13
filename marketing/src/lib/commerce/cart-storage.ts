import type { ProductType } from "./schemas";

const VARIANT_META_KEY = "prabhix_cart_variant_meta";
const PENDING_CHECKOUT_KEY = "prabhix_pending_checkout";

export type VariantMeta = Record<string, { productType: ProductType; slug: string }>;

/** Razorpay resume fields only — order capability stays in the httpOnly cookie. */
export type PendingCheckout = {
  razorpayOrderId: string;
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

export function clearVariantMeta(): void {
  if (typeof window === "undefined") return;
  safeRemove(VARIANT_META_KEY);
}

export function cartHasPhysical(meta: VariantMeta, variantIds: string[]): boolean {
  return variantIds.some((id) => meta[id]?.productType === "PHYSICAL");
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
