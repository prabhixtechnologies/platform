import { siteConfig } from "@/lib/site-config";
import { secretCookieOptions } from "@/lib/commerce/shop-cookies";

export const CHAT_COOKIE = "pbx_chat";
export const VISITOR_COOKIE = "pbx_vk";

const CHAT_MAX_AGE = 60 * 60 * 24 * 7;
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365;

/** Visitor chat tokens are compact JWTs, not the commerce opaque tokens. */
export function isChatJwt(value: string | null | undefined): value is string {
  return (
    typeof value === "string" &&
    value.length >= 40 &&
    value.length <= 4096 &&
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
  );
}

const VISITOR_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isVisitorKey(value: string | null | undefined): value is string {
  return typeof value === "string" && VISITOR_UUID.test(value);
}

export const chatCookieOptions = () => secretCookieOptions(CHAT_MAX_AGE);
export const visitorCookieOptions = () => secretCookieOptions(VISITOR_MAX_AGE);

export function publicChatStreamPath(conversationId: string): string | null {
  if (!siteConfig.orgId) return null;
  return `/api/chat/stream?conversationId=${encodeURIComponent(conversationId)}`;
}
