import { NextResponse, type NextRequest } from "next/server";
import { ingestBatch, identifyVisitor } from "@/lib/visitor/api";
import { siteConfig } from "@/lib/site-config";
import type { BatchIngestRequest, IdentifyRequest } from "@/lib/visitor/types";
import {
  VISITOR_COOKIE,
  isVisitorKey,
  visitorCookieOptions,
} from "@/lib/chat/bff-cookies";

export const runtime = "nodejs";

function readVisitor(request: NextRequest): string | null {
  const value = request.cookies.get(VISITOR_COOKIE)?.value ?? null;
  return isVisitorKey(value) ? value : null;
}

function withVisitorCookie(response: NextResponse, key: string) {
  response.cookies.set({ name: VISITOR_COOKIE, value: key, ...visitorCookieOptions() });
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
  try {
    if (url.endsWith("/identify")) {
      const body = (await request.json()) as IdentifyRequest;
      const key = resolveKey(request, body.visitorKey);
      const ok = await identifyVisitor(siteConfig.orgSlug, { ...body, visitorKey: key });
      const response = NextResponse.json({ ok });
      return withVisitorCookie(response, key);
    }
    const body = (await request.json()) as BatchIngestRequest;
    const key = resolveKey(request, body.visitorKey);
    const ack = await ingestBatch(siteConfig.orgSlug, { ...body, visitorKey: key });
    const response = NextResponse.json({
      sessionId: ack?.sessionId,
    });
    return withVisitorCookie(response, ack?.visitorKey && isVisitorKey(ack.visitorKey) ? ack.visitorKey : key);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
