export type UiConsent = "accepted" | "declined" | "pending";

export function readUiConsent(): UiConsent {
  if (typeof window === "undefined") return "pending";
  const value = window.prabhixConsent;
  if (value === "accepted" || value === "declined" || value === "pending") {
    return value;
  }
  return "pending";
}

export function consentToApiLevel(
  ui: UiConsent,
): "FULL" | "MINIMAL" | "DELETED" | null {
  if (ui === "accepted") return "FULL";
  if (ui === "declined") return "MINIMAL";
  return null;
}

export function allowsAnalytics(ui: UiConsent): boolean {
  return ui === "accepted";
}

export function allowsPresence(ui: UiConsent): boolean {
  return ui === "accepted" || ui === "declined";
}
