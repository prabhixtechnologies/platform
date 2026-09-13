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

async function postJsonSameOrigin<T>(
  path: string,
  body: unknown,
): Promise<T | null> {
  try {
    const response = await fetch(path, {
      method: "POST",
      credentials: "same-origin",
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

/** Browser ingest goes through the same-origin BFF so the visitor key stays httpOnly. */
export function ingestViaBff(body: BatchIngestRequest): Promise<IngestAck | null> {
  return postJsonSameOrigin("/api/visitor/ingest", body);
}

export function sendBeaconIngest(
  _orgSlug: string,
  body: BatchIngestRequest,
): boolean {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) {
    return false;
  }
  try {
    const blob = new Blob([JSON.stringify(body)], {
      type: "application/json",
    });
    return navigator.sendBeacon("/api/visitor/ingest", blob);
  } catch {
    return false;
  }
}

export function identifyVisitor(
  orgSlug: string,
  body: IdentifyRequest,
): Promise<boolean> {
  if (typeof window !== "undefined") {
    return postJsonSameOrigin("/api/visitor/identify", body).then((result) => result !== null);
  }
  return postJson<unknown>(
    `/v1/visitor/public/${encodeURIComponent(orgSlug)}/identify`,
    body,
  ).then((result) => result !== null);
}

export function getVisitorKeyForChat(): string | null {
  if (typeof window === "undefined") return null;
  return window.prabhixTracker?.getVisitorKey() ?? null;
}
