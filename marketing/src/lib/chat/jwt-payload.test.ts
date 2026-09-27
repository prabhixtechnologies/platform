import { describe, expect, it } from "vitest";
import { readChatJwtPayload } from "./jwt-payload";

function fakeJwt(payload: Record<string, string>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256" }), "utf8").toString("base64url");
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${header}.${body}.signature`;
}

describe("readChatJwtPayload", () => {
  it("reads org and conv claims without verifying the signature", () => {
    const token = fakeJwt({
      org: "11111111-1111-4111-8111-111111111111",
      conv: "22222222-2222-4222-8222-222222222222",
    });
    expect(readChatJwtPayload(token)).toEqual({
      org: "11111111-1111-4111-8111-111111111111",
      conv: "22222222-2222-4222-8222-222222222222",
      vis: undefined,
    });
  });

  it("returns null for malformed tokens", () => {
    expect(readChatJwtPayload("not-a-jwt")).toBeNull();
  });
});
