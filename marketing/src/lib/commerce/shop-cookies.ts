/** Host-only cookies. The browser never reads these; XSS cannot exfiltrate them. */
export const CART_COOKIE = "pbx_cart";
export const ORDER_COOKIE = "pbx_order";

const CART_MAX_AGE = 60 * 60 * 24 * 30;
const ORDER_MAX_AGE = 60 * 60 * 24 * 7;

/** Opaque commerce tokens are URL-safe Base64 of 32 bytes (typically 43 chars). */
export function isOpaqueToken(value: string | null | undefined): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{20,128}$/.test(value);
}

export function secretCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export const cartCookieOptions = () => secretCookieOptions(CART_MAX_AGE);
export const orderCookieOptions = () => secretCookieOptions(ORDER_MAX_AGE);
