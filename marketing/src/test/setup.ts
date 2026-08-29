/// <reference types="vitest/globals" />
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom implements no IntersectionObserver, and <Reveal> — which wraps most of the marketing site —
// calls framer-motion's useInView on mount. Without this, rendering any section of a real page
// throws, so the components that make up the site were effectively untestable.
//
// Reporting an immediate intersection is what makes the tests useful: the reveal animation settles
// at its final state, so assertions see the content as a visitor eventually would, not the
// opacity-0 starting frame.
class ImmediateIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [
        {
          target,
          isIntersecting: true,
          intersectionRatio: 1,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      this,
    );
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", ImmediateIntersectionObserver);

afterEach(() => {
  cleanup();
});
