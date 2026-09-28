"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Button } from "./Button";
import { Container } from "./Container";

const CONSENT_KEY = "prabhix_cookie_consent";
type Consent = "accepted" | "declined" | "pending";

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

// The answer is in localStorage and `setConsent` already announces every change on the event
// below, so the banner can read the store directly instead of copying it into state. Accepting
// or declining now hides this by changing the thing it renders from, rather than by a second
// setState next to the one that wrote the value.
function subscribe(onChange: () => void) {
  window.addEventListener("prabhix-consent-change", onChange);
  // Another tab deciding counts too - two banners open at once was possible before.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("prabhix-consent-change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function read(): Consent {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "declined") return stored;
  } catch {
    // Storage disabled. Undecided is the safe reading: it asks rather than assumes.
  }
  return "pending";
}

// Nothing is rendered on the server, as before: the banner appeared only after mount, because
// the decision cannot be known while generating the page.
const readOnServer = () => undefined;

/**
 * In-document strip, not a modal. Tab must reach the rest of the page; trapping
 * focus here used to be correct only while this sat over the hero as a dialog.
 */
export function ConsentBanner() {
  const consent = useSyncExternalStore(subscribe, read, readOnServer);

  // Still an effect, because publishing the value on `window` is a side effect and not
  // something render may do. What it no longer does is set state.
  useEffect(() => {
    if (consent) window.prabhixConsent = consent;
  }, [consent]);

  if (consent !== "pending") return null;

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
            <a href="/legal/privacy" className="text-accent-text underline">
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
            }}
            className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Decline optional
          </button>
          <Button
            onClick={() => {
              setConsent("accepted");
            }}
          >
            Accept all
          </Button>
        </div>
      </Container>
    </div>
  );
}
