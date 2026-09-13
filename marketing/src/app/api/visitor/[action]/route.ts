import { NextResponse, type NextRequest } from "next/server";
import { ingestBatch, identifyVisitor } from "@/lib/visitor/api";
import { siteConfig } from "@/lib/site-config";
import type { BatchIngestRequest, IdentifyRequest } from "@/lib/visitor/types";
import {
  SESSION_COOKIE,
  VISITOR_COOKIE,
  hostedCookieName,
  isVisitorKey,
  sessionCookieOptions,
  visitorCookieOptions,
} from "@/lib/chat/bff-cookies";
import { readHostCookie } from "@/lib/commerce/shop-cookies";

export const runtime = "nodejs";

function readVisitor(request: NextRequest): string | null {
  const value = readHostCookie(request.cookies, VISITOR_COOKIE) ?? null;
  return isVisitorKey(value) ? value : null;
}

function resolveSession(request: NextRequest): string {
  const existing = readHostCookie(request.cookies, SESSION_COOKIE);
  return isVisitorKey(existing) ? existing : crypto.randomUUID();
}

function withTrackingCookies(response: NextResponse, visitorKey: string, sessionId: string) {
  response.cookies.set({
    name: hostedCookieName(VISITOR_COOKIE),
    value: visitorKey,
    ...visitorCookieOptions(),
  });
  response.cookies.set({
    name: hostedCookieName(SESSION_COOKIE),
    value: sessionId,
    ...sessionCookieOptions(),
  });
  return response;
}

function resolveKey(request: NextRequest, claimed: string | undefined): string {
  const cookie = readVisitor(request);
  if (cookie) return cookie;
  if (isVisitorKey(claimed)) return claimed;
  return crypto.randomUUID();
}

export async function POST(request: NextRequest) {
  if (!siteConfig.orgSlug) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  const url = request.nextUrl.pathname;
  const sessionId = resolveSession(request);
  try {
    if (url.endsWith("/identify")) {
      const body = (await request.json()) as IdentifyRequest;
      const key = resolveKey(request, body.visitorKey);
      const ok = await identifyVisitor(siteConfig.orgSlug, { ...body, visitorKey: key });
      const response = NextResponse.json({ ok });
      return withTrackingCookies(response, key, sessionId);
    }
    const body = (await request.json()) as BatchIngestRequest;
    const key = resolveKey(request, body.visitorKey);
    // Session id is minted on the BFF, not taken from the browser.
    const ack = await ingestBatch(siteConfig.orgSlug, { ...body, visitorKey: key, sessionId });
    const response = NextResponse.json({ ok: true });
    return withTrackingCookies(
      response,
      ack?.visitorKey && isVisitorKey(ack.visitorKey) ? ack.visitorKey : key,
      sessionId,
    );
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
