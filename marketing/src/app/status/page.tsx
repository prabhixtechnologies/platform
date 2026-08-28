import type { Metadata } from "next";
import { CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Status & Trust",
  description:
    "Prabhix platform status, uptime targets, security practices, and trust commitments.",
  path: "/status",
});

const services = [
  { name: "Marketing site", status: "operational" as const },
  { name: "Customer console", status: "operational" as const },
  { name: "Platform API", status: "operational" as const },
  { name: "Shared inbox ingestion", status: "operational" as const },
  { name: "Razorpay webhooks", status: "operational" as const },
];

const commitments = [
  {
    title: "99.9% uptime SLA",
    description:
      "Enterprise plans include a contractual uptime target with service credits for qualifying incidents.",
  },
  {
    title: "Tenant isolation",
    description:
      "Three-layer isolation — JWT claims, request filters, Hibernate scoping — plus Postgres RLS on high-risk tables.",
  },
  {
    title: "Data residency",
    description:
      "Primary processing in AWS ap-south-1 (Mumbai). Cross-border transfers only with documented safeguards.",
  },
  {
    title: "Incident communication",
    description:
      "Status updates within 30 minutes of confirmed customer-impacting incidents. Post-mortems for SEV-1 events.",
  },
];

export default function StatusPage() {
  return (
    <>
      <Section
        eyebrow="Trust center"
        title="Status & reliability"
        description="Current platform health, our uptime commitments, and where to find security documentation."
        centered
        className="pt-24"
      />

      <Section className="pt-0">
        <Reveal>
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-6 text-primary" aria-hidden />
                <div>
                  <h2 className="text-lg font-semibold">All systems operational</h2>
                  <p className="text-sm text-muted-foreground">
                    Last checked: {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </p>
                </div>
              </div>
              <Badge variant="accent">Operational</Badge>
            </div>
            <ul className="mt-8 divide-y divide-border">
              {services.map((service) => (
                <li
                  key={service.name}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <span className="font-medium">{service.name}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                    <CheckCircle2 className="size-4" aria-hidden />
                    Operational
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </Section>

      <Section eyebrow="Commitments" title="What we stand behind" className="bg-surface/30">
        <div className="grid gap-6 sm:grid-cols-2">
          {commitments.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <Card>
                <Clock className="size-5 text-accent" aria-hidden />
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Security" title="Documentation">
        <Reveal>
          <div className="flex flex-wrap gap-4">
            <a
              href="/legal/security"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Security overview
            </a>
            <a
              href="/legal/privacy"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Privacy policy
            </a>
            <a
              href="/legal/dpa"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Data processing agreement
            </a>
          </div>
        </Reveal>
      </Section>

      <CTABand
        title="Report a security concern"
        description="We take responsible disclosure seriously. Contact our security team for vulnerability reports."
        primaryLabel="Email security"
        primaryHref="mailto:security@prabhixtechnologies.com"
        secondaryLabel="View changelog"
        secondaryHref="/changelog"
      />
    </>
  );
}
