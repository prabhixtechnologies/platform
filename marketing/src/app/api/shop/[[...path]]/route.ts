import { NextResponse, type NextRequest } from "next/server";
import {
  addCartItem,
  applyDiscount,
  clearDiscount,
  createCart,
  getCart,
  getOrder,
  issueDownload,
  removeCartItem,
  startCheckout,
  updateCartItem,
  verifyPayment,
  type CheckoutPayload,
} from "@/lib/commerce/api";
import { CommerceApiError } from "@/lib/commerce/errors";
import type { CartView, OrderDetail } from "@/lib/commerce/schemas";
import {
  CART_COOKIE,
  ORDER_COOKIE,
  cartCookieOptions,
  isOpaqueToken,
  orderCookieOptions,
} from "@/lib/commerce/shop-cookies";

export const runtime = "nodejs";

type RouteCtx = { params: Promise<{ path?: string[] }> };

const VISITOR_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function publicCart(cart: CartView) {
  const rest = { ...cart };
  delete rest.cartToken;
  return rest;
}

function fail(err: unknown): NextResponse {
  if (err instanceof CommerceApiError) {
    const response = NextResponse.json(
      { code: err.code, message: err.message, fieldErrors: err.fieldErrors },
      { status: err.status },
    );
    if (err.code === "CART_NOT_FOUND") {
      return clearCookie(response, CART_COOKIE);
    }
    if (err.code === "ORDER_NOT_FOUND") {
      return clearCookie(response, ORDER_COOKIE);
    }
    return response;
  }
  return NextResponse.json({ code: "UNKNOWN", message: "Request failed" }, { status: 500 });
}

function readCookie(request: NextRequest, name: string): string | null {
  const value = request.cookies.get(name)?.value ?? null;
  return isOpaqueToken(value) ? value : null;
}

function withCartCookie(response: NextResponse, token: string) {
  response.cookies.set({ name: CART_COOKIE, value: token, ...cartCookieOptions() });
  return response;
}

function withOrderCookie(response: NextResponse, token: string) {
  response.cookies.set({ name: ORDER_COOKIE, value: token, ...orderCookieOptions() });
  return response;
}

function clearCookie(response: NextResponse, name: string) {
  response.cookies.set({ name, value: "", ...cartCookieOptions(), maxAge: 0 });
  return response;
}

function optionalVisitorId(value: unknown): string | undefined {
  return typeof value === "string" && VISITOR_UUID.test(value) ? value : undefined;
}

async function jsonBody<T>(request: NextRequest): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new CommerceApiError(400, {
      code: "UNKNOWN",
      message: "Invalid JSON",
    });
  }
}

async function requireCart(request: NextRequest): Promise<string> {
  const token = readCookie(request, CART_COOKIE);
  if (!token) {
    throw new CommerceApiError(404, {
      code: "CART_NOT_FOUND",
      message: "Your cart has expired. Please start again.",
    });
  }
  return token;
}

export async function GET(request: NextRequest, ctx: RouteCtx) {
  const path = ((await ctx.params).path ?? []).join("/");
  try {
    if (path === "cart") {
      const token = readCookie(request, CART_COOKIE);
      if (!token) {
        return NextResponse.json({ cart: null });
      }
      const cart = await getCart(token);
      return NextResponse.json({ cart: publicCart(cart) });
    }
    if (path === "order") {
      const token = readCookie(request, ORDER_COOKIE);
      if (!token) {
        throw new CommerceApiError(404, {
          code: "ORDER_NOT_FOUND",
          message: "No order found for this browser.",
        });
      }
      const order = await getOrder(token);
      const rest = { ...(order as OrderDetail) };
      delete rest.accessToken;
      return NextResponse.json(rest);
    }
    if (path.startsWith("downloads/")) {
      const token = path.slice("downloads/".length);
      if (!isOpaqueToken(token)) {
        return NextResponse.json({ code: "NOT_FOUND", message: "Unknown shop path" }, { status: 404 });
      }
      const link = await issueDownload(token);
      const response = NextResponse.redirect(link.downloadUrl, 302);
      response.headers.set("referrer-policy", "no-referrer");
      return response;
    }
    return NextResponse.json({ code: "NOT_FOUND", message: "Unknown shop path" }, { status: 404 });
  } catch (err) {
    return fail(err);
  }
}

export async function POST(request: NextRequest, ctx: RouteCtx) {
  const path = ((await ctx.params).path ?? []).join("/");
  try {
    if (path === "cart") {
      const token = readCookie(request, CART_COOKIE);
      if (token) {
        const cart = await getCart(token);
        return NextResponse.json({ cart: publicCart(cart) });
      }
      let visitorId: string | undefined;
      try {
        const body = await jsonBody<{ visitorId?: string }>(request);
        visitorId = optionalVisitorId(body.visitorId);
      } catch {
        visitorId = undefined;
      }
      const created = await createCart(visitorId);
      return withCartCookie(
        NextResponse.json({ cart: publicCart(created.cart) }),
        created.cartToken,
      );
    }
    if (path === "cart/adopt") {
      const body = await jsonBody<{ cartToken?: string }>(request);
      if (readCookie(request, CART_COOKIE)) {
        return NextResponse.json({ ok: true });
      }
      if (!isOpaqueToken(body.cartToken)) {
        return NextResponse.json({ ok: false }, { status: 400 });
      }
      await getCart(body.cartToken);
      return withCartCookie(NextResponse.json({ ok: true }), body.cartToken);
    }
    if (path === "cart/items") {
      const body = await jsonBody<{ variantId: string; quantity: number; visitorId?: string }>(
        request,
      );
      let token = readCookie(request, CART_COOKIE);
      let created = false;
      if (!token) {
        const fresh = await createCart(optionalVisitorId(body.visitorId));
        token = fresh.cartToken;
        created = true;
      }
      try {
        const cart = await addCartItem(token, body.variantId, body.quantity);
        const response = NextResponse.json({ cart: publicCart(cart) });
        return created ? withCartCookie(response, token) : response;
      } catch (err) {
        const response = fail(err);
        return created ? withCartCookie(response, token) : response;
      }
    }
    if (path === "cart/discount") {
      const body = await jsonBody<{ code: string }>(request);
      const cart = await applyDiscount(await requireCart(request), body.code);
      return NextResponse.json({ cart: publicCart(cart) });
    }
    if (path === "cart/checkout") {
      const body = await jsonBody<CheckoutPayload>(request);
      const checkout = await startCheckout(await requireCart(request), body);
      if (!checkout.accessToken) {
        throw new CommerceApiError(500, {
          code: "UNKNOWN",
          message: "Checkout did not issue an order token.",
        });
      }
      const { accessToken, ...rest } = checkout;
      return withOrderCookie(NextResponse.json(rest), accessToken);
    }
    if (path === "payments/verify") {
      const body = await jsonBody<{
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
      }>(request);
      const result = await verifyPayment(body);
      const response = NextResponse.json(result);
      return clearCookie(response, CART_COOKIE);
    }
    if (path === "order/adopt") {
      const body = await jsonBody<{ accessToken?: string }>(request);
      if (readCookie(request, ORDER_COOKIE)) {
        return NextResponse.json({ ok: true });
      }
      if (!isOpaqueToken(body.accessToken)) {
        return NextResponse.json({ ok: false }, { status: 400 });
      }
      await getOrder(body.accessToken);
      return withOrderCookie(NextResponse.json({ ok: true }), body.accessToken);
    }
    return NextResponse.json({ code: "NOT_FOUND", message: "Unknown shop path" }, { status: 404 });
  } catch (err) {
    return fail(err);
  }
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const segments = (await ctx.params).path ?? [];
  try {
    if (segments[0] === "cart" && segments[1] === "items" && segments[2]) {
      const body = await jsonBody<{ quantity: number }>(request);
      const cart = await updateCartItem(await requireCart(request), segments[2], body.quantity);
      return NextResponse.json({ cart: publicCart(cart) });
    }
    return NextResponse.json({ code: "NOT_FOUND", message: "Unknown shop path" }, { status: 404 });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(request: NextRequest, ctx: RouteCtx) {
  const segments = (await ctx.params).path ?? [];
  const path = segments.join("/");
  try {
    if (segments[0] === "cart" && segments[1] === "items" && segments[2]) {
      const cart = await removeCartItem(await requireCart(request), segments[2]);
      return NextResponse.json({ cart: publicCart(cart) });
    }
    if (path === "cart/discount") {
      const cart = await clearDiscount(await requireCart(request));
      return NextResponse.json({ cart: publicCart(cart) });
    }
    if (path === "order") {
      return clearCookie(NextResponse.json({ ok: true }), ORDER_COOKIE);
    }
    if (path === "cart") {
      return clearCookie(NextResponse.json({ ok: true }), CART_COOKIE);
    }
    return NextResponse.json({ code: "NOT_FOUND", message: "Unknown shop path" }, { status: 404 });
  } catch (err) {
    return fail(err);
  }
}
