import { siteConfig } from "@/lib/site-config";
import { ingestViaBff, sendBeaconIngest } from "./api";
import {
  allowsAnalytics,
  allowsPresence,
  consentToApiLevel,
  readUiConsent,
  type UiConsent,
} from "./consent";
import { buildSessionContext, captureUtmParams } from "./session-context";
import {
  clearTrackingIdentifiers,
  createEphemeralKey,
  readFirstTouchReferrer,
  readFirstTouchUtm,
  readSessionId,
  readVisitorKey,
  writeFirstTouchReferrer,
  writeFirstTouchUtm,
  writeSessionId,
  dropLegacyVisitorKeys,
} from "./storage";
import type {
  BatchIngestRequest,
  CustomEventInput,
  PageViewInput,
  PresenceUpdate,
} from "./types";

const MAX_BATCH = 50;
const FLUSH_INTERVAL_MS = 12_000;
const DEBOUNCE_MS = 2_000;
const HEARTBEAT_MS = 20_000;
const MAX_BUFFER = 200;

type ActivePage = {
  url: string;
  path: string;
  title: string;
  enteredAt: number;
  referrer?: string;
  isEntry: boolean;
};

declare global {
  interface Window {
    prabhixConsent?: UiConsent;
    prabhixTrack?: (name: string, properties?: Record<string, unknown>) => void;
    prabhixTracker?: VisitorTracker;
  }
}

export class VisitorTracker {
  private pageViews: PageViewInput[] = [];
  private events: CustomEventInput[] = [];
  private activePage: ActivePage | null = null;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private intervalTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private sessionContextSent = false;
  private utmSent = false;
  private started = false;
  private flushing = false;
  private lastConsent: UiConsent = "pending";

  init(): void {
    if (this.started || !siteConfig.orgSlug) return;
    this.started = true;
    this.lastConsent = readUiConsent();
    window.prabhixTrack = (name, properties) => this.track(name, properties);
    window.prabhixTracker = this;

    this.captureFirstTouch();
    this.bindLifecycle();
    this.onConsentOrRoute(readUiConsent(), true);
  }

  getVisitorKey(): string | null {
    const full = allowsAnalytics(readUiConsent());
    return readVisitorKey(full);
  }

  track(name: string, properties?: Record<string, unknown>): void {
    if (!allowsAnalytics(readUiConsent())) return;
    if (this.events.length >= MAX_BUFFER) return;
    this.events.push({ name, properties });
    this.scheduleFlush();
  }

  identify(name: string, email: string): void {
    if (!allowsAnalytics(readUiConsent()) || !siteConfig.orgSlug) return;
    void import("./api").then(({ identifyVisitor }) =>
      identifyVisitor(siteConfig.orgSlug, {
        visitorKey: readVisitorKey(true) ?? undefined,
        name,
        email,
      }).catch(() => undefined),
    );
  }

  onRouteChange(path: string, search: string): void {
    if (!siteConfig.orgSlug) return;
    const consent = readUiConsent();
    if (!allowsPresence(consent)) return;

    const url = `${window.location.origin}${path}${search}`;
    const title = document.title;
    this.closeActivePage(false);
    this.openPage(url, path, title, false);
    void this.flush({});
    this.scheduleFlush();
  }

  onConsentChange(): void {
    const consent = readUiConsent();
    if (consent === this.lastConsent) return;

    if (this.lastConsent === "accepted" && consent === "declined") {
      this.withdrawConsent();
    }

    this.lastConsent = consent;
    this.onConsentOrRoute(consent, false);
  }

  private onConsentOrRoute(consent: UiConsent, isInitial: boolean): void {
    if (!allowsPresence(consent)) {
      this.stopTimers();
      this.pageViews = [];
      this.events = [];
      return;
    }

    if (isInitial || this.activePage === null) {
      const path = window.location.pathname;
      const search = window.location.search;
      const url = `${window.location.origin}${path}${search}`;
      this.openPage(url, path, document.title, isInitial);
    }

    this.startTimers();
    this.scheduleFlush();
  }

  private withdrawConsent(): void {
    this.closeActivePage(true);
    void this.flush({ deleted: true, useBeacon: true });
    clearTrackingIdentifiers();
    this.pageViews = [];
    this.events = [];
    this.sessionContextSent = false;
    this.utmSent = false;
    this.stopTimers();
  }

  private captureFirstTouch(): void {
    if (!allowsAnalytics(readUiConsent())) return;
    const utm = captureUtmParams(window.location.search);
    if (utm && !readFirstTouchUtm()) {
      writeFirstTouchUtm(utm);
    }
    const ref = document.referrer;
    if (ref && !readFirstTouchReferrer()) {
      writeFirstTouchReferrer(ref);
    }
  }

  private openPage(
    url: string,
    path: string,
    title: string,
    isEntry: boolean,
  ): void {
    this.activePage = {
      url,
      path,
      title,
      enteredAt: Date.now(),
      referrer: isEntry ? document.referrer || undefined : undefined,
      isEntry,
    };
  }

  private closeActivePage(markExit: boolean): void {
    if (!this.activePage) return;
    if (!allowsAnalytics(readUiConsent())) {
      this.activePage = null;
      return;
    }

    const durationMs = Math.max(0, Date.now() - this.activePage.enteredAt);
    const pageView: PageViewInput = {
      url: this.activePage.url,
      path: this.activePage.path,
      title: this.activePage.title,
      referrer: this.activePage.referrer,
      durationMs,
      entry: this.activePage.isEntry || undefined,
      exit: markExit || undefined,
    };

    if (this.pageViews.length < MAX_BUFFER) {
      this.pageViews.push(pageView);
    }
    this.activePage = null;
  }

  private bindLifecycle(): void {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.closeActivePage(true);
        void this.flush({ useBeacon: true });
        this.stopHeartbeat();
        return;
      }
      if (allowsPresence(readUiConsent())) {
        const path = window.location.pathname;
        const search = window.location.search;
        const url = `${window.location.origin}${path}${search}`;
        this.openPage(url, path, document.title, false);
        this.startHeartbeat();
        this.scheduleFlush();
      }
    });

    window.addEventListener("pagehide", () => {
      this.closeActivePage(true);
      void this.flush({ useBeacon: true });
    });

    window.addEventListener("prabhix-consent-change", () => {
      this.onConsentChange();
    });
  }

  private startTimers(): void {
    if (this.intervalTimer) return;
    this.intervalTimer = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      void this.flush({});
    }, FLUSH_INTERVAL_MS);
    this.startHeartbeat();
  }

  private stopTimers(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    this.stopHeartbeat();
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer || !allowsPresence(readUiConsent())) return;
    this.heartbeatTimer = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      void this.flush({ presenceOnly: true });
    }, HEARTBEAT_MS);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleFlush(): void {
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => {
      void this.flush({});
    }, DEBOUNCE_MS);
  }

  private buildPresence(): PresenceUpdate | undefined {
    if (!this.activePage) return undefined;
    return {
      url: this.activePage.url,
      path: this.activePage.path,
      title: this.activePage.title,
    };
  }

  private ensureIds(): {
    visitorKey?: string;
    sessionId: string;
  } {
    const visitorKey = readVisitorKey(true) ?? readVisitorKey(false) ?? undefined;

    let sessionId = readSessionId();
    if (!sessionId) {
      sessionId = createEphemeralKey();
      writeSessionId(sessionId);
    }

    return { visitorKey, sessionId };
  }

  private async flush(options: {
    useBeacon?: boolean;
    deleted?: boolean;
    presenceOnly?: boolean;
  }): Promise<void> {
    if (this.flushing || !siteConfig.orgSlug) return;

    const consent = options.deleted
      ? "DELETED"
      : consentToApiLevel(readUiConsent());
    if (!consent) return;

    const fullConsent = consent === "FULL";
    const analytics = fullConsent;
    const hasPageViews = analytics && this.pageViews.length > 0;
    const hasEvents = analytics && this.events.length > 0;
    const presence = this.buildPresence();

    if (
      options.presenceOnly &&
      !hasPageViews &&
      !hasEvents &&
      !presence
    ) {
      if (!presence) return;
    }

    if (
      !options.presenceOnly &&
      !hasPageViews &&
      !hasEvents &&
      !presence &&
      !options.deleted
    ) {
      return;
    }

    const { visitorKey, sessionId } = this.ensureIds();
    const batch: BatchIngestRequest = {
      consent,
      sessionId,
    };
    if (visitorKey) {
      batch.visitorKey = visitorKey;
    }

    if (analytics) {
      if (hasPageViews) {
        batch.pageViews = this.pageViews.splice(0, MAX_BATCH);
      }
      if (hasEvents) {
        batch.events = this.events.splice(0, MAX_BATCH);
      }
      if (!this.sessionContextSent) {
        batch.session = buildSessionContext();
        this.sessionContextSent = true;
      }
      if (!this.utmSent) {
        const utm = readFirstTouchUtm();
        const referrer = readFirstTouchReferrer();
        if (utm) batch.utm = utm;
        if (referrer) batch.referrer = referrer;
        if (utm || referrer) this.utmSent = true;
      }
    }

    if (presence) {
      batch.presence = presence;
    }

    if (options.deleted) {
      batch.pageViews = [];
      batch.events = [];
    }

    this.flushing = true;
    try {
      if (options.useBeacon && sendBeaconIngest(siteConfig.orgSlug, batch)) {
        return;
      }

      const ack = await ingestViaBff(batch);
      if (ack?.sessionId) {
        writeSessionId(ack.sessionId);
      }
      dropLegacyVisitorKeys();
    } catch {
      /* fail silently */
    } finally {
      this.flushing = false;
    }
  }
}

let singleton: VisitorTracker | null = null;

export function getVisitorTracker(): VisitorTracker {
  if (!singleton) {
    singleton = new VisitorTracker();
  }
  return singleton;
}

export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
): void {
  window.prabhixTrack?.(name, properties);
}
