"use client";

import Link from "next/link";
import { PRODUCT_LINKS, RESOURCE_LINKS, STORE_URL } from "@/lib/constants";
import { useActionState, useEffect, useRef } from "react";
import { subscribeNewsletter } from "@/app/actions";
import { siteConfig } from "@/lib/utils";
import { Container } from "./Container";
import { LogoMark } from "./logo-mark";

const footerColumns = [
  {
    title: "Product",
    links: [
      { href: "/platform", label: "How we build" },
      ...PRODUCT_LINKS.map((l) => ({ href: l.href, label: l.label })),
      { href: "/pricing", label: "Pricing" },
      { href: STORE_URL, label: "Get the apps" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Resources",
    links: RESOURCE_LINKS.map((l) => ({ href: l.href, label: l.label })),
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/security", label: "Security" },
      { href: "/legal/dpa", label: "Data Processing Agreement" },
    ],
  },
];

export function SiteFooter() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, null);
  const trackedRef = useRef(false);

  useEffect(() => {
    if (state?.ok && !trackedRef.current) {
      trackedRef.current = true;
      window.prabhixTrack?.("newsletter_subscribed", { source: "footer-newsletter" });
    }
  }, [state?.ok]);

  return (
    <footer className="border-t border-border bg-surface/30 pb-[env(safe-area-inset-bottom,0px)]">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <LogoMark />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {siteConfig.tagline} Enterprise software built in India, designed
              for global scale.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Stay updated
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Product releases, platform updates, and engineering insights.
              </p>
            </div>
            <form action={formAction} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
              <input type="hidden" name="source" value="footer-newsletter" />
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                aria-invalid={!!state?.fieldErrors?.email}
                aria-describedby={
                  state?.fieldErrors?.email ? "newsletter-error" : undefined
                }
                className="h-11 flex-1 rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={pending}
                className="h-11 shrink-0 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-strong disabled:opacity-50"
              >
                {pending ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          </div>
          {state && (
            <p
              id="newsletter-error"
              className={`mt-3 text-sm ${state.ok ? "text-primary" : "text-danger"}`}
              role={state.ok ? "status" : "alert"}
              aria-live="polite"
            >
              {state.message}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Prabhix Technologies. All rights
            reserved.
          </p>
          <p>{siteConfig.email}</p>
        </div>
      </Container>
    </footer>
  );
}
