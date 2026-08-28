import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Key, Webhook } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

/**
 * These cards used to link to `${CONSOLE_URL}/docs/*`, which has never existed in the console —
 * every one of them 404'd into the SPA fallback.
 *
 * There is no public developer docs site yet, and Swagger UI is deliberately disabled in
 * production (`SWAGGER_ENABLED=false`), so linking there would just move the broken link to the
 * API host. Until real docs exist, these point at the contact form and the spec location is
 * described in the copy instead of linked.
 */
const REQUEST_ACCESS = "/contact?intent=api";

export const metadata: Metadata = pageMetadata({
  title: "Documentation",
  description:
    "Developer documentation for the Prabhix platform — REST API, authentication, webhooks, and integration guides.",
  path: "/docs",
});

const docSections = [
  {
    icon: Key,
    title: "Authentication",
    description:
      "JWT-based auth with organization-scoped claims. Send X-Prabhix-Org to pin the active tenant on multi-org users.",
    href: REQUEST_ACCESS,
  },
  {
    icon: Code2,
    title: "REST API reference",
    description:
      "OpenAPI 3.1 spec, served at /v3/api-docs on your API host. Keyset pagination via cursor — treat nextCursor as opaque.",
    href: REQUEST_ACCESS,
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description:
      "Billing, mail, and membership events with HMAC-SHA256 signature verification and retry semantics.",
    href: REQUEST_ACCESS,
  },
  {
    icon: BookOpen,
    title: "SDKs & examples",
    description:
      "TypeScript and Java client examples for leads, subscribers, and organization management.",
    href: REQUEST_ACCESS,
  },
];

export default function DocsPage() {
  return (
    <>
      <Section
        eyebrow="Developers"
        title="Build on the Prabhix platform"
        description="API-first architecture with documented endpoints, predictable error codes, and tenant isolation you can verify."
        centered
        className="pt-24"
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {docSections.map((section, i) => (
            <Reveal key={section.title} delay={i * 0.08}>
              <Card hover className="flex h-full flex-col">
                <section.icon className="size-6 text-primary" aria-hidden />
                <h2 className="mt-4 text-xl font-semibold">{section.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {section.description}
                </p>
                <Link
                  href={section.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Request access
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Quick start" title="Three steps to your first API call" className="bg-surface/30">
        <Reveal>
          <ol className="mx-auto max-w-2xl space-y-6">
            {[
              "Create an organization in OneOps and invite your team.",
              "Generate an API token with the scopes your integration needs.",
              "Call GET /api/v1/org with Authorization: Bearer <token> and X-Prabhix-Org set to your organization ID.",
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Button href={siteConfig.consoleUrl} external size="lg">
              Open OneOps
            </Button>
          </div>
        </Reveal>
      </Section>

      <CTABand
        title="Need integration support?"
        description="Our engineering team helps partners design secure, tenant-aware integrations."
        primaryLabel="Contact engineering"
        primaryHref="/contact?intent=enterprise"
      />
    </>
  );
}
