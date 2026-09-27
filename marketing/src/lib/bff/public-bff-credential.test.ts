import { describe, expect, it } from "vitest";
import {
  assertPublicBffCredentialConfigured,
  PUBLIC_BFF_CREDENTIAL_ENV,
  publicBffCredentialForUpstream,
} from "./public-bff-credential.logic";

describe("public BFF credential", () => {
  it("throws in production when PRABHIX_PUBLIC_BFF_CREDENTIAL is unset", () => {
    expect(() =>
      assertPublicBffCredentialConfigured({
        NODE_ENV: "production",
        [PUBLIC_BFF_CREDENTIAL_ENV]: "",
      }),
    ).toThrow(/PRABHIX_PUBLIC_BFF_CREDENTIAL/);
  });

  it("returns the trimmed credential in production when configured", () => {
    expect(
      publicBffCredentialForUpstream({
        NODE_ENV: "production",
        [PUBLIC_BFF_CREDENTIAL_ENV]: "  test-secret  ",
      }),
    ).toBe("test-secret");
  });

  it("allows missing credential outside production", () => {
    expect(
      publicBffCredentialForUpstream({
        NODE_ENV: "development",
        [PUBLIC_BFF_CREDENTIAL_ENV]: "",
      }),
    ).toBeUndefined();
  });
});
