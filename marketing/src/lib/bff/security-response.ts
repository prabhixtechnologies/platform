import { NextResponse } from "next/server";

export type BffErrorBody = {
  code: string;
  message: string;
  retryAfterSeconds?: number;
};

export function bffJson(
  body: BffErrorBody,
  status: number,
  extraHeaders?: Record<string, string>,
): NextResponse {
  const headers: Record<string, string> = { ...extraHeaders };
  if (body.retryAfterSeconds != null && status === 429) {
    headers["Retry-After"] = String(body.retryAfterSeconds);
  }
  return NextResponse.json(body, { status, headers });
}

export function originRejected(): NextResponse {
  return bffJson(
    {
      code: "ORIGIN_NOT_ALLOWED",
      message: "This request is not allowed from this site.",
    },
    403,
  );
}

export function rateLimited(retryAfterSeconds: number): NextResponse {
  return bffJson(
    {
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait a moment and try again.",
      retryAfterSeconds,
    },
    429,
  );
}

export function parseRetryAfterHeader(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number.parseInt(value, 10);
  if (Number.isFinite(seconds) && seconds > 0) return seconds;
  const date = Date.parse(value);
  if (Number.isFinite(date)) {
    const delta = Math.ceil((date - Date.now()) / 1000);
    return delta > 0 ? delta : undefined;
  }
  return undefined;
}

export function forwardRetryAfter(upstream: Response): Record<string, string> {
  const retryAfter = parseRetryAfterHeader(upstream.headers.get("Retry-After"));
  if (retryAfter == null) return {};
  return { "Retry-After": String(retryAfter) };
}
