import { describe, expect, it } from "vitest";
import {
  CONTACT_INTENT_MAP,
  resolveLeadInterest,
  type LeadInterest,
} from "@/lib/lead-interests";

describe("lead interest mapping", () => {
  it("maps contact URL intents to the correct lead interest values", () => {
    const expected: Record<string, LeadInterest> = {
      demo: "PLATFORM",
      mobistack: "MOBISTACK",
      starter: "PLATFORM",
      growth: "PLATFORM",
      business: "PLATFORM",
      enterprise: "PARTNERSHIP",
      careers: "OTHER",
    };

    for (const [intent, interest] of Object.entries(expected)) {
      const label = CONTACT_INTENT_MAP[intent];
      expect(label, `missing label for intent ${intent}`).toBeDefined();
      expect(resolveLeadInterest(label!)).toBe(interest);
    }
  });

  it("falls back to OTHER for unknown interest labels", () => {
    expect(resolveLeadInterest("Unknown product")).toBe("OTHER");
    expect(resolveLeadInterest("")).toBe("OTHER");
  });
});
