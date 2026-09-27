import { afterEach, describe, expect, it } from "vitest";
import {
  dropLegacyVisitorKeys,
  readVisitorKey,
  writeVisitorKey,
} from "./storage";

describe("visitor storage", () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("supports a returning visitor key under full consent", () => {
    writeVisitorKey("11111111-1111-4111-8111-111111111111", true);
    expect(readVisitorKey(true)).toBe("11111111-1111-4111-8111-111111111111");
  });

  it("drops legacy web-storage keys after the BFF cookie migration", () => {
    writeVisitorKey("11111111-1111-4111-8111-111111111111", true);
    dropLegacyVisitorKeys();
    expect(readVisitorKey(true)).toBeNull();
  });
});
