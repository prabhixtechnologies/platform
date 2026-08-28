import { getApiBaseUrl } from "@/lib/api-url";
import type { BatchIngestRequest, IngestAck, IdentifyRequest } from "./types";

async function postJson<T>(
  path: string,
  body: unknown,
): Promise<T | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function ingestBatch(
  orgSlug: string,
  body: BatchIngestRequest,
): Promise<IngestAck | null> {
  return postJson<IngestAck>(
    `/v1/visitor/public/${encodeURIComponent(orgSlug)}/ingest`,
    body,
  );
}

export function sendBeaconIngest(
  orgSlug: string,
  body: BatchIngestRequest,
): boolean {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) {
    return false;
  }
  try {
    const blob = new Blob([JSON.stringify(body)], {
      type: "application/json",
    });
    const path = `/v1/visitor/public/${encodeURIComponent(orgSlug)}/ingest`;
    return navigator.sendBeacon(`${getApiBaseUrl()}${path}`, blob);
  } catch {
    return false;
  }
}

export function identifyVisitor(
  orgSlug: string,
  body: IdentifyRequest,
): Promise<boolean> {
  return postJson<unknown>(
    `/v1/visitor/public/${encodeURIComponent(orgSlug)}/identify`,
    body,
  ).then((result) => result !== null);
}

export function getVisitorKeyForChat(): string | null {
  if (typeof window === "undefined") return null;
  return window.prabhixTracker?.getVisitorKey() ?? null;
}
