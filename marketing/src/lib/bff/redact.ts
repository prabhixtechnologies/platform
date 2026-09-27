const SENSITIVE_KEY =
  /token|secret|password|signature|payment|claim|cartToken|accessToken|conversationToken|razorpay|prabhixPublicBff|publicBff/i;

/** Strip credential-shaped fields before logging or test snapshots. */
export function redactForLog(value: unknown): unknown {
  if (value == null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => redactForLog(entry));
  }
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    out[key] = SENSITIVE_KEY.test(key) ? "[redacted]" : redactForLog(entry);
  }
  return out;
}

export function safeErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Request failed";
}
