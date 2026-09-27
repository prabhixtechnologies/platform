import {
  PUBLIC_BFF_HEADER,
  publicBffCredentialForUpstream,
} from "@/lib/bff/public-bff-credential.logic";

/** Testable twin of public-upstream.ts (no server-only import). */
export function mergePublicUpstreamHeaders(init?: HeadersInit): Headers {
  const headers = new Headers(init);
  const credential = publicBffCredentialForUpstream();
  if (credential) {
    headers.set(PUBLIC_BFF_HEADER, credential);
  }
  return headers;
}

export async function fetchPublicUpstream(
  input: string | URL,
  init?: RequestInit,
): Promise<Response> {
  const headers = mergePublicUpstreamHeaders(init?.headers);
  return fetch(input, { ...init, headers });
}
