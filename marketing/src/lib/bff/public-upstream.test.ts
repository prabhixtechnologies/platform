/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";
import { PUBLIC_BFF_HEADER } from "./public-bff-credential.logic";

describe("public upstream headers", () => {
  it("sets X-Prabhix-Public-Bff when the env credential is present", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("PRABHIX_PUBLIC_BFF_CREDENTIAL", "bff-shared-secret");
    const { mergePublicUpstreamHeaders } = await import("./public-upstream.logic");
    const headers = mergePublicUpstreamHeaders({ Accept: "application/json" });
    expect(headers.get("Accept")).toBe("application/json");
    expect(headers.get(PUBLIC_BFF_HEADER)).toBe("bff-shared-secret");
    vi.unstubAllEnvs();
  });

  it("fetchPublicUpstream attaches the header on outbound requests", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("PRABHIX_PUBLIC_BFF_CREDENTIAL", "bff-shared-secret");
    const fetchMock = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const { fetchPublicUpstream } = await import("./public-upstream.logic");
    await fetchPublicUpstream("http://localhost:8080/api/v1/oneops/site/careers");
    expect(fetchMock).toHaveBeenCalledOnce();
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = new Headers(init.headers);
    expect(headers.get(PUBLIC_BFF_HEADER)).toBe("bff-shared-secret");
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
});
