"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Container } from "./Container";

const CONSENT_KEY = "prabhix_cookie_consent";

declare global {
  interface Window {
    prabhixConsent?: "accepted" | "declined" | "pending";
  }
}

function setConsent(value: "accepted" | "declined") {
  try {
    localStorage.setItem(CONSENT_KEY, value);
    const secure = window.location.protocol === "https:" ? ";Secure" : "";
    document.cookie = `prabhix_consent=${value};path=/;max-age=31536000;SameSite=Lax${secure}`;
    window.prabhixConsent = value;
    window.dispatchEvent(new Event("prabhix-consent-change"));
  } catch {
    window.prabhixConsent = value;
    window.dispatchEvent(new Event("prabhix-consent-change"));
  }
}

/**
 * In-document strip, not a modal. Tab must reach the rest of the page; trapping
 * focus here used to be correct only while this sat over the hero as a dialog.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY) as
        | "accepted"
        | "declined"
        | null;
      if (stored === "accepted" || stored === "declined") {
        window.prabhixConsent = stored;
        return;
      }
    } catch {
      /* ignore */
    }
    window.prabhixConsent = "pending";
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
      className="shrink-0 border-b border-border bg-surface/90 backdrop-blur-xl"
    >
      <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p id="consent-title" className="text-sm font-semibold text-foreground">
            Cookie preferences
          </p>
          <p id="consent-desc" className="mt-1 text-sm text-muted-foreground">
            We use essential cookies for site functionality and optional analytics
            to improve our services. See our{" "}
            <a href="/legal/privacy" className="text-primary underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setConsent("declined");
              setVisible(false);
            }}
            className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Decline optional
          </button>
          <Button
            onClick={() => {
              setConsent("accepted");
              setVisible(false);
            }}
          >
            Accept all
          </Button>
        </div>
      </Container>
    </div>
  );
}
