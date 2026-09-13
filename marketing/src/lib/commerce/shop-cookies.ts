/** Host-only cookies. The browser never reads these; XSS cannot exfiltrate them. */
export const CART_COOKIE = "pbx_cart";
export const ORDER_COOKIE = "pbx_order";
export const DOWNLOAD_COOKIE = "pbx_dl";

const CART_MAX_AGE = 60 * 60 * 24 * 30;
const ORDER_MAX_AGE = 60 * 60 * 24 * 7;
const DOWNLOAD_MAX_AGE = 60 * 5;

/** Opaque commerce tokens are URL-safe Base64 of 32 bytes (typically 43 chars). */
export function isOpaqueToken(value: string | null | undefined): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{20,128}$/.test(value);
}

export function hostedCookieName(short: string): string {
  return process.env.NODE_ENV === "production" ? `__Host-${short}` : short;
}

type CookieReader = { get(name: string): { value: string } | undefined };

export function readHostCookie(store: CookieReader, short: string): string | undefined {
  return store.get(`__Host-${short}`)?.value ?? store.get(short)?.value;
}

export function secretCookieOptions(maxAge: number, sameSite: "lax" | "strict" = "lax") {
  return {
    httpOnly: true,
    // __Host- cookies require Secure; production is HTTPS. Local HTTP keeps the unprefixed name.
    secure: process.env.NODE_ENV === "production",
    sameSite,
    path: "/" as const,
    maxAge,
  };
}

export const cartCookieOptions = () => secretCookieOptions(CART_MAX_AGE, "lax");
export const orderCookieOptions = () => secretCookieOptions(ORDER_MAX_AGE, "lax");
export const downloadCookieOptions = () => secretCookieOptions(DOWNLOAD_MAX_AGE, "strict");
