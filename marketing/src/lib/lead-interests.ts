export const LEAD_INTEREST_VALUES = [
  "PLATFORM",
  "MOBISTACK",
  "CUSTOM_SOFTWARE",
  "CLOUD_DEVOPS",
  "AI_ML",
  "MOBILE_APPS",
  "CONSULTING",
  "PARTNERSHIP",
  "OTHER",
] as const;

export type LeadInterest = (typeof LEAD_INTEREST_VALUES)[number];

export const LEAD_INTEREST_OPTIONS: ReadonlyArray<{
  label: string;
  value: LeadInterest;
}> = [
  { label: "Product demo", value: "PLATFORM" },
  { label: "Starter plan", value: "PLATFORM" },
  { label: "Growth plan", value: "PLATFORM" },
  { label: "Business plan", value: "PLATFORM" },
  { label: "MobiStack", value: "MOBISTACK" },
  { label: "Custom development", value: "CUSTOM_SOFTWARE" },
  { label: "Enterprise partnership", value: "PARTNERSHIP" },
  { label: "General inquiry", value: "OTHER" },
];

const labelToValue = new Map(
  LEAD_INTEREST_OPTIONS.map((option) => [option.label, option.value]),
);

export function resolveLeadInterest(label: string): LeadInterest {
  return labelToValue.get(label) ?? "OTHER";
}

export function leadInterestLabel(value: LeadInterest): string {
  const match = LEAD_INTEREST_OPTIONS.find((option) => option.value === value);
  return match?.label ?? "General inquiry";
}

export const CONTACT_INTENT_MAP: Record<string, string> = {
  demo: "Product demo",
  mobistack: "MobiStack",
  starter: "Starter plan",
  growth: "Growth plan",
  business: "Business plan",
  enterprise: "Enterprise partnership",
  careers: "General inquiry",
};
