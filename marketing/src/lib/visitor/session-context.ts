import type { SessionContext } from "./types";

function detectDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function detectBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  return "other";
}

function detectOs(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "other";
}

export function buildSessionContext(): SessionContext {
  return {
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
    os: detectOs(),
    screenWidth: typeof screen !== "undefined" ? screen.width : undefined,
    screenHeight: typeof screen !== "undefined" ? screen.height : undefined,
    language: typeof navigator !== "undefined" ? navigator.language : undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export function captureUtmParams(
  search: string,
): Record<string, string> | null {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (key.startsWith("utm_") && value) {
      utm[key] = value;
    }
  }
  return Object.keys(utm).length > 0 ? utm : null;
}
