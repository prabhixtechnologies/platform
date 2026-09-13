import { NextResponse, type NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/api-url";
import { siteConfig } from "@/lib/site-config";
import {
  CHAT_COOKIE,
  VISITOR_COOKIE,
  chatCookieOptions,
  hostedCookieName,
  isChatJwt,
  isVisitorKey,
} from "@/lib/chat/bff-cookies";
import { readHostCookie } from "@/lib/commerce/shop-cookies";

export const runtime = "nodejs";

type RouteCtx = { params: Promise<{ path?: string[] }> };

function readChatCookie(request: NextRequest): string | null {
  const value = readHostCookie(request.cookies, CHAT_COOKIE) ?? null;
  return isChatJwt(value) ? value : null;
}

function withChatCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: hostedCookieName(CHAT_COOKIE),
    value: token,
    ...chatCookieOptions(),
  });
  return response;
}

function clearChatCookie(response: NextResponse) {
  const options = { ...chatCookieOptions(), maxAge: 0 };
  response.cookies.set({ name: CHAT_COOKIE, value: "", ...options });
  response.cookies.set({ name: `__Host-${CHAT_COOKIE}`, value: "", ...options, secure: true });
  return response;
}

function orgBase(): string | null {
  const slug = siteConfig.orgSlug;
  if (!slug) return null;
  return `${getApiBaseUrl()}/v1/chat/public/${encodeURIComponent(slug)}`;
}

async function backend(
  path: string,
  init: RequestInit & { token?: string },
): Promise<Response> {
  const base = orgBase();
  if (!base) {
    return new Response(JSON.stringify({ message: "Chat is not configured" }), { status: 503 });
  }
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (init.token) headers.set("X-Chat-Token", init.token);
  return fetch(`${base}${path}`, { ...init, headers });
}

function publicStart(data: Record<string, unknown>) {
  const rest = { ...data };
  delete rest.conversationToken;
  return rest;
}

export async function GET(request: NextRequest, ctx: RouteCtx) {
  const segments = (await ctx.params).path ?? [];
  const token = readChatCookie(request);
  if (!token) {
    return NextResponse.json({ message: "No chat session" }, { status: 401 });
  }
  if (segments[0] === "conversations" && segments[1] && segments[2] === "messages") {
    const qs = request.nextUrl.searchParams.toString();
    const upstream = await backend(
      `/conversations/${encodeURIComponent(segments[1])}/messages${qs ? `?${qs}` : ""}`,
      { method: "GET", token },
    );
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  return NextResponse.json({ message: "Unknown chat path" }, { status: 404 });
}

export async function POST(request: NextRequest, ctx: RouteCtx) {
  const segments = (await ctx.params).path ?? [];
  const path = segments.join("/");
  try {
    if (path === "conversations") {
      const body = (await request.json()) as Record<string, unknown>;
      const visitor = readHostCookie(request.cookies, VISITOR_COOKIE);
      if (isVisitorKey(visitor) && !body.visitorKey) {
        body.visitorKey = visitor;
      }
      const upstream = await backend("/conversations", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = (await upstream.json()) as Record<string, unknown>;
      if (!upstream.ok) {
        return NextResponse.json(data, { status: upstream.status });
      }
      const chatToken = data.conversationToken;
      if (typeof chatToken !== "string" || !isChatJwt(chatToken)) {
        return NextResponse.json({ message: "Chat did not issue a session" }, { status: 502 });
      }
      return withChatCookie(NextResponse.json(publicStart(data)), chatToken);
    }
    if (path === "adopt") {
      const body = (await request.json()) as { conversationToken?: string };
      if (readChatCookie(request)) {
        return NextResponse.json({ ok: true });
      }
      if (!isChatJwt(body.conversationToken)) {
        return NextResponse.json({ ok: false }, { status: 400 });
      }
      return withChatCookie(NextResponse.json({ ok: true }), body.conversationToken);
    }
    if (segments[0] === "conversations" && segments[1] && segments[2] === "messages") {
      const token = readChatCookie(request);
      if (!token) {
        return NextResponse.json({ message: "No chat session" }, { status: 401 });
      }
      const upstream = await backend(`/conversations/${encodeURIComponent(segments[1])}/messages`, {
        method: "POST",
        body: JSON.stringify(await request.json()),
        token,
      });
      return new NextResponse(upstream.body, {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    return NextResponse.json({ message: "Unknown chat path" }, { status: 404 });
  } catch {
    return NextResponse.json({ message: "Request failed" }, { status: 500 });
  }
}

export async function DELETE() {
  return clearChatCookie(NextResponse.json({ ok: true }));
}
